import { readFile } from 'fs/promises';
import path from 'path';
import { ExamDifficulty, Prisma } from '@prisma/client';
import { disconnectPrisma, prisma } from '../lib/prisma';

type JsonTopicInput = {
  name: string;
  slug: string;
};

type JsonQuestionInput = {
  id: number;
  question: string;
  imageUrl?: string;
  options: string[];
  optionImageUrls?: string[];
  correctAnswer: string;
  topic?: JsonTopicInput | null;
};

type JsonExamInput = {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  subject?: string;
  difficulty?: ExamDifficulty;
  year?: number;
  statusLabel?: string;
  questions: JsonQuestionInput[];
};

type NormalizedTopicInput = {
  name: string;
  slug: string;
};

type NormalizedQuestionInput = {
  id: number;
  question: string;
  imageUrl: string | null;
  options: string[];
  optionImageUrls: string[];
  correctAnswer: string;
  topic: NormalizedTopicInput | null;
};

type NormalizedExamInput = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  subject: string;
  difficulty: ExamDifficulty;
  year: number | null;
  statusLabel: string;
  questions: NormalizedQuestionInput[];
};

const DEFAULT_DESCRIPTION = 'De import tu JSON';
const DEFAULT_SUBJECT = 'Toan';
const DEFAULT_DIFFICULTY: ExamDifficulty = 'medium';
const DEFAULT_STATUS_LABEL = 'Imported JSON';
const EXPECTED_OPTION_COUNT = 4;

const ensurePlainObject = (
  value: unknown,
  message: string,
): Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(message);
  }

  return value as Record<string, unknown>;
};

const getRequiredString = (value: unknown, message: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(message);
  }

  return value.trim();
};

const getOptionalString = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('Gia tri string khong hop le');
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const getPositiveInteger = (value: unknown, message: string): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new Error(message);
  }

  return value;
};

const getOptionalInteger = (value: unknown): number | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error('Gia tri so nguyen khong hop le');
  }

  return value;
};

const getDifficulty = (value: unknown): ExamDifficulty => {
  if (value === undefined) {
    return DEFAULT_DIFFICULTY;
  }

  if (value === 'easy' || value === 'medium' || value === 'hard') {
    return value;
  }

  throw new Error('difficulty phai la easy, medium hoac hard');
};

const getStringArray = (value: unknown, message: string): string[] => {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }

  return value.map((item) => {
    if (typeof item !== 'string') {
      throw new Error(message);
    }

    return item.trim();
  });
};

const normalizeTopic = (
  value: unknown,
  questionId: number,
): NormalizedTopicInput | null => {
  if (value === undefined || value === null) {
    return null;
  }

  const topicRecord = ensurePlainObject(
    value,
    `question ${questionId}: topic phai la object neu co`,
  );

  return {
    name: getRequiredString(
      topicRecord.name,
      `question ${questionId}: topic.name la bat buoc`,
    ),
    slug: getRequiredString(
      topicRecord.slug,
      `question ${questionId}: topic.slug la bat buoc`,
    ),
  };
};

const normalizeQuestion = (
  value: unknown,
  index: number,
): NormalizedQuestionInput => {
  const questionRecord = ensurePlainObject(
    value,
    `question o vi tri ${index + 1} phai la object hop le`,
  );

  if (
    typeof questionRecord.id !== 'number' ||
    !Number.isInteger(questionRecord.id)
  ) {
    throw new Error(`question o vi tri ${index + 1}: id phai la so nguyen`);
  }

  const questionId = questionRecord.id;
  const questionText = getRequiredString(
    questionRecord.question,
    `question ${questionId}: noi dung cau hoi la bat buoc`,
  );
  const options = getStringArray(
    questionRecord.options,
    `question ${questionId}: options phai la mang string`,
  );

  if (options.length !== EXPECTED_OPTION_COUNT) {
    throw new Error(
      `question ${questionId}: options phai co dung ${EXPECTED_OPTION_COUNT} phan tu`,
    );
  }

  if (options.some((option) => option.length === 0)) {
    throw new Error(
      `question ${questionId}: moi option phai la string khong rong`,
    );
  }

  const correctAnswer = getRequiredString(
    questionRecord.correctAnswer,
    `question ${questionId}: correctAnswer la bat buoc`,
  );

  if (!options.includes(correctAnswer)) {
    throw new Error(
      `question ${questionId}: correctAnswer phai nam trong options`,
    );
  }

  const optionImageUrls =
    questionRecord.optionImageUrls === undefined
      ? []
      : getStringArray(
          questionRecord.optionImageUrls,
          `question ${questionId}: optionImageUrls phai la mang string`,
        );

  if (optionImageUrls.length > EXPECTED_OPTION_COUNT) {
    throw new Error(
      `question ${questionId}: optionImageUrls khong duoc dai hon ${EXPECTED_OPTION_COUNT} phan tu`,
    );
  }

  let imageUrl: string | null;
  try {
    imageUrl = getOptionalString(questionRecord.imageUrl);
  } catch {
    throw new Error(`question ${questionId}: imageUrl phai la string neu co`);
  }

  return {
    id: questionId,
    question: questionText,
    imageUrl,
    options,
    optionImageUrls,
    correctAnswer,
    topic: normalizeTopic(questionRecord.topic, questionId),
  };
};

const normalizeExam = (rawValue: unknown): NormalizedExamInput => {
  const examRecord = ensurePlainObject(rawValue, 'JSON de thi phai la object hop le');

  const id = getRequiredString(examRecord.id, 'exam id la bat buoc');
  const title = getRequiredString(examRecord.title, 'exam title la bat buoc');
  const durationMinutes = getPositiveInteger(
    examRecord.durationMinutes,
    'durationMinutes phai la so nguyen lon hon 0',
  );

  if (!Array.isArray(examRecord.questions) || examRecord.questions.length === 0) {
    throw new Error('questions phai la mang khong rong');
  }

  const questions = examRecord.questions.map((question, index) =>
    normalizeQuestion(question, index),
  );

  const questionIds = new Set<number>();
  for (const question of questions) {
    if (questionIds.has(question.id)) {
      throw new Error(`question id ${question.id} bi trung trong cung file import`);
    }

    questionIds.add(question.id);
  }

  let year: number | null;
  try {
    year = getOptionalInteger(examRecord.year);
  } catch {
    throw new Error('year phai la so nguyen neu co');
  }

  return {
    id,
    title,
    description:
      typeof examRecord.description === 'string' &&
      examRecord.description.trim().length > 0
        ? examRecord.description.trim()
        : DEFAULT_DESCRIPTION,
    durationMinutes,
    subject:
      typeof examRecord.subject === 'string' && examRecord.subject.trim().length > 0
        ? examRecord.subject.trim()
        : DEFAULT_SUBJECT,
    difficulty: getDifficulty(examRecord.difficulty),
    year,
    statusLabel:
      typeof examRecord.statusLabel === 'string' &&
      examRecord.statusLabel.trim().length > 0
        ? examRecord.statusLabel.trim()
        : DEFAULT_STATUS_LABEL,
    questions,
  };
};

const upsertTopic = async (
  tx: Prisma.TransactionClient,
  topic: NormalizedTopicInput | null,
): Promise<string | null> => {
  if (!topic) {
    return null;
  }

  const upsertedTopic = await tx.topic.upsert({
    where: {
      slug: topic.slug,
    },
    update: {
      name: topic.name,
    },
    create: {
      name: topic.name,
      slug: topic.slug,
    },
  });

  return upsertedTopic.id;
};

export const importNormalizedExam = async (
  exam: NormalizedExamInput,
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const incomingQuestionIds = exam.questions.map((question) => question.id);
    const existingQuestions = await tx.question.findMany({
      where: {
        id: {
          in: incomingQuestionIds,
        },
      },
      select: {
        id: true,
        examId: true,
      },
    });

    for (const existingQuestion of existingQuestions) {
      if (existingQuestion.examId !== exam.id) {
        throw new Error(
          `question id ${existingQuestion.id} dang thuoc exam ${existingQuestion.examId}, khong the import sang exam ${exam.id}`,
        );
      }
    }

    await tx.exam.upsert({
      where: {
        id: exam.id,
      },
      update: {
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        subject: exam.subject,
        difficulty: exam.difficulty,
        year: exam.year,
        statusLabel: exam.statusLabel,
      },
      create: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        subject: exam.subject,
        difficulty: exam.difficulty,
        year: exam.year,
        statusLabel: exam.statusLabel,
      },
    });

    for (const [index, question] of exam.questions.entries()) {
      const topicId = await upsertTopic(tx, question.topic);

      await tx.question.upsert({
        where: {
          id: question.id,
        },
        update: {
          examId: exam.id,
          order: index + 1,
          topicId,
          question: question.question,
          imageUrl: question.imageUrl,
          options: question.options,
          optionImageUrls: question.optionImageUrls,
          correctAnswer: question.correctAnswer,
        },
        create: {
          id: question.id,
          examId: exam.id,
          order: index + 1,
          topicId,
          question: question.question,
          imageUrl: question.imageUrl,
          options: question.options,
          optionImageUrls: question.optionImageUrls,
          correctAnswer: question.correctAnswer,
        },
      });
    }
  });
};

export const importExamFromFile = async (inputPath: string): Promise<void> => {
  if (inputPath.trim().length === 0) {
    throw new Error(
      'Thieu duong dan file JSON. Vi du: npm run import:exam -- ./src/data/import/sample-exam.json',
    );
  }

  const resolvedPath = path.resolve(process.cwd(), inputPath);
  const rawContent = await readFile(resolvedPath, 'utf8');

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawContent);
  } catch {
    throw new Error(`File JSON khong hop le: ${resolvedPath}`);
  }

  const normalizedExam = normalizeExam(parsedJson);
  await importNormalizedExam(normalizedExam);

  console.log(
    `Imported exam ${normalizedExam.id} with ${normalizedExam.questions.length} questions from ${resolvedPath}.`,
  );
};

async function main(): Promise<void> {
  await importExamFromFile(process.argv[2] ?? '');
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('Import failed:', error instanceof Error ? error.message : error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await disconnectPrisma();
    });
}
