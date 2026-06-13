import { readFile } from 'fs/promises';
import path from 'path';
import { Prisma } from '@prisma/client';
import { disconnectPrisma, prisma } from '../lib/prisma';
import {
  ImportValidationError,
  type NormalizedExamInput,
  type NormalizedSubtopicInput,
  type NormalizedTopicInput,
  printImportSummary,
  validateExamImportPayload,
} from './importExamValidator';

type ImportCliOptions = {
  inputPath: string;
  dryRun: boolean;
};

const parseCliArguments = (args: string[]): ImportCliOptions => {
  let inputPath = '';
  let dryRun = false;

  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (!inputPath) {
      inputPath = arg;
      continue;
    }
  }

  if (inputPath.trim().length === 0) {
    throw new Error(
      'Thieu duong dan file JSON. Vi du: npm run import:exam -- ./src/data/import/sample-exam.json',
    );
  }

  return {
    inputPath,
    dryRun,
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

const upsertSubtopic = async (
  tx: Prisma.TransactionClient,
  params: {
    topicId: string | null;
    subtopic: NormalizedSubtopicInput | null;
  },
): Promise<string | null> => {
  const { topicId, subtopic } = params;

  if (!subtopic) {
    return null;
  }

  if (!topicId) {
    throw new Error(
      `Subtopic ${subtopic.slug} yeu cau topic hop le truoc khi import`,
    );
  }

  const upsertedSubtopic = await tx.subtopic.upsert({
    where: {
      slug: subtopic.slug,
    },
    update: {
      name: subtopic.name,
      topicId,
    },
    create: {
      name: subtopic.name,
      slug: subtopic.slug,
      topicId,
    },
  });

  return upsertedSubtopic.id;
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
      const subtopicId = await upsertSubtopic(tx, {
        topicId,
        subtopic: question.subtopic,
      });

      await tx.question.upsert({
        where: {
          id: question.id,
        },
        update: {
          examId: exam.id,
          order: index + 1,
          topicId,
          subtopicId,
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
          subtopicId,
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

export const importExamFromFile = async (
  inputPath: string,
  options?: { dryRun?: boolean },
): Promise<void> => {
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

  const { exam, summary } = validateExamImportPayload(parsedJson);

  if (options?.dryRun) {
    printImportSummary(summary, { dryRun: true });
    console.log(`[DRY RUN] Validation passed. No database changes were made.`);
    return;
  }

  await importNormalizedExam(exam);

  printImportSummary(summary);
  console.log(
    `[IMPORT] Imported exam ${summary.examId} from ${resolvedPath} without duplicates.`,
  );
};

async function main(): Promise<void> {
  const cliOptions = parseCliArguments(process.argv.slice(2));
  await importExamFromFile(cliOptions.inputPath, { dryRun: cliOptions.dryRun });
}

if (require.main === module) {
  main()
    .catch((error) => {
      if (error instanceof ImportValidationError) {
        console.error('Import validation failed:');

        for (const issue of error.issues) {
          console.error(`- ${issue}`);
        }
      } else {
        console.error(
          'Import failed:',
          error instanceof Error ? error.message : error,
        );
      }

      process.exitCode = 1;
    })
    .finally(async () => {
      await disconnectPrisma();
    });
}
