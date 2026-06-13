import { ExamDifficulty } from '@prisma/client';

export type NormalizedTopicInput = {
  name: string;
  slug: string;
};

export type NormalizedSubtopicInput = {
  name: string;
  slug: string;
};

export type NormalizedQuestionInput = {
  id: number;
  question: string;
  imageUrl: string | null;
  options: string[];
  optionImageUrls: string[];
  correctAnswer: string;
  topic: NormalizedTopicInput | null;
  subtopic: NormalizedSubtopicInput | null;
};

export type NormalizedExamInput = {
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

export type ImportSummary = {
  examId: string;
  title: string;
  questionCount: number;
  detectedTopicCount: number;
  detectedSubtopicCount: number;
  questionImageCount: number;
  optionImageQuestionCount: number;
};

export class ImportValidationError extends Error {
  issues: string[];

  constructor(issues: string[]) {
    super('Import validation failed');
    this.name = 'ImportValidationError';
    this.issues = issues;
  }
}

const DEFAULT_DESCRIPTION = 'De import tu JSON';
const DEFAULT_SUBJECT = 'Toan';
const DEFAULT_DIFFICULTY: ExamDifficulty = 'medium';
const DEFAULT_STATUS_LABEL = 'Imported JSON';
const EXPECTED_OPTION_COUNT = 4;
const TOPIC_SLUG_PATTERN = /^[a-z0-9-]+$/;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const readRequiredString = (
  value: unknown,
  path: string,
  issues: string[],
): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    issues.push(`${path} is required`);
    return null;
  }

  return value.trim();
};

const readOptionalString = (
  value: unknown,
  path: string,
  issues: string[],
): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    issues.push(`${path} must be a string`);
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const readPositiveInteger = (
  value: unknown,
  path: string,
  issues: string[],
): number | null => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    issues.push(`${path} must be a positive integer`);
    return null;
  }

  return value;
};

const readOptionalInteger = (
  value: unknown,
  path: string,
  issues: string[],
): number | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    issues.push(`${path} must be an integer`);
    return null;
  }

  return value;
};

const readDifficulty = (
  value: unknown,
  path: string,
  issues: string[],
): ExamDifficulty => {
  if (value === undefined) {
    return DEFAULT_DIFFICULTY;
  }

  if (value === 'easy' || value === 'medium' || value === 'hard') {
    return value;
  }

  issues.push(`${path} must be one of: easy, medium, hard`);
  return DEFAULT_DIFFICULTY;
};

const readStringArray = (
  value: unknown,
  path: string,
  issues: string[],
): string[] | null => {
  if (!Array.isArray(value)) {
    issues.push(`${path} must be an array of strings`);
    return null;
  }

  const items: string[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];

    if (typeof item !== 'string') {
      issues.push(`${path}[${index}] must be a string`);
      continue;
    }

    items.push(item.trim());
  }

  return items;
};

const normalizeTopic = (
  value: unknown,
  path: string,
  issues: string[],
): NormalizedTopicInput | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object`);
    return null;
  }

  const name = readRequiredString(value.name, `${path}.name`, issues);
  const slug = readRequiredString(value.slug, `${path}.slug`, issues);

  if (slug && !TOPIC_SLUG_PATTERN.test(slug)) {
    issues.push(
      `${path}.slug must contain only lowercase letters, numbers, and hyphens`,
    );
  }

  if (!name || !slug) {
    return null;
  }

  return {
    name,
    slug,
  };
};

const normalizeSubtopic = (
  value: unknown,
  path: string,
  issues: string[],
): NormalizedSubtopicInput | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object`);
    return null;
  }

  const name = readRequiredString(value.name, `${path}.name`, issues);
  const slug = readRequiredString(value.slug, `${path}.slug`, issues);

  if (slug && !TOPIC_SLUG_PATTERN.test(slug)) {
    issues.push(
      `${path}.slug must contain only lowercase letters, numbers, and hyphens`,
    );
  }

  if (!name || !slug) {
    return null;
  }

  return {
    name,
    slug,
  };
};

const normalizeQuestion = (
  value: unknown,
  index: number,
  issues: string[],
): NormalizedQuestionInput | null => {
  const path = `questions[${index}]`;

  if (!isPlainObject(value)) {
    issues.push(`${path} must be an object`);
    return null;
  }

  const id = readPositiveInteger(value.id, `${path}.id`, issues);
  const question = readRequiredString(value.question, `${path}.question`, issues);
  const imageUrl = readOptionalString(value.imageUrl, `${path}.imageUrl`, issues);
  const options = readStringArray(value.options, `${path}.options`, issues);
  const correctAnswer = readRequiredString(
    value.correctAnswer,
    `${path}.correctAnswer`,
    issues,
  );
  const optionImageUrls =
    value.optionImageUrls === undefined
      ? []
      : readStringArray(value.optionImageUrls, `${path}.optionImageUrls`, issues);
  const topic = normalizeTopic(value.topic, `${path}.topic`, issues);
  const subtopic = normalizeSubtopic(value.subtopic, `${path}.subtopic`, issues);

  if (options && options.length !== EXPECTED_OPTION_COUNT) {
    issues.push(
      `${path}.options must contain exactly ${EXPECTED_OPTION_COUNT} items`,
    );
  }

  if (options && options.some((option) => option.length === 0)) {
    issues.push(`${path}.options must not contain empty strings`);
  }

  if (correctAnswer && options && !options.includes(correctAnswer)) {
    issues.push(`${path}.correctAnswer must be one of options`);
  }

  if (optionImageUrls && optionImageUrls.length > EXPECTED_OPTION_COUNT) {
    issues.push(
      `${path}.optionImageUrls must not contain more than ${EXPECTED_OPTION_COUNT} items`,
    );
  }

  if (subtopic && !topic) {
    issues.push(`${path}.subtopic requires topic to be provided`);
  }

  if (!id || !question || !options || !correctAnswer || !optionImageUrls) {
    return null;
  }

  return {
    id,
    question,
    imageUrl,
    options,
    optionImageUrls,
    correctAnswer,
    topic,
    subtopic,
  };
};

export const validateExamImportPayload = (
  rawValue: unknown,
): {
  exam: NormalizedExamInput;
  summary: ImportSummary;
} => {
  const issues: string[] = [];

  if (!isPlainObject(rawValue)) {
    throw new ImportValidationError(['root must be an object']);
  }

  const id = readRequiredString(rawValue.id, 'id', issues);
  const title = readRequiredString(rawValue.title, 'title', issues);
  const durationMinutes = readPositiveInteger(
    rawValue.durationMinutes,
    'durationMinutes',
    issues,
  );

  if (!Array.isArray(rawValue.questions) || rawValue.questions.length === 0) {
    issues.push('questions must be a non-empty array');
  }

  const questions = Array.isArray(rawValue.questions)
    ? rawValue.questions
        .map((question, index) => normalizeQuestion(question, index, issues))
        .filter(
          (question): question is NormalizedQuestionInput => question !== null,
        )
    : [];

  const duplicateQuestionIds = new Set<number>();
  const seenQuestionIds = new Set<number>();

  if (Array.isArray(rawValue.questions)) {
    for (const question of rawValue.questions) {
      if (!isPlainObject(question)) {
        continue;
      }

      if (typeof question.id !== 'number' || !Number.isInteger(question.id)) {
        continue;
      }

      if (seenQuestionIds.has(question.id)) {
        duplicateQuestionIds.add(question.id);
      }

      seenQuestionIds.add(question.id);
    }
  }

  for (const questionId of duplicateQuestionIds) {
    issues.push(`questions contain duplicate id: ${questionId}`);
  }

  const year = readOptionalInteger(rawValue.year, 'year', issues);
  const difficulty = readDifficulty(rawValue.difficulty, 'difficulty', issues);
  const description =
    readOptionalString(rawValue.description, 'description', issues) ??
    DEFAULT_DESCRIPTION;
  const subject =
    readOptionalString(rawValue.subject, 'subject', issues) ?? DEFAULT_SUBJECT;
  const statusLabel =
    readOptionalString(rawValue.statusLabel, 'statusLabel', issues) ??
    DEFAULT_STATUS_LABEL;

  if (!id || !title || !durationMinutes || issues.length > 0) {
    throw new ImportValidationError(issues);
  }

  const normalizedExam: NormalizedExamInput = {
    id,
    title,
    description,
    durationMinutes,
    subject,
    difficulty,
    year,
    statusLabel,
    questions,
  };

  const summary: ImportSummary = {
    examId: normalizedExam.id,
    title: normalizedExam.title,
    questionCount: normalizedExam.questions.length,
    detectedTopicCount: new Set(
      normalizedExam.questions
        .map((question) => question.topic?.slug ?? null)
        .filter((slug): slug is string => slug !== null),
    ).size,
    detectedSubtopicCount: new Set(
      normalizedExam.questions
        .map((question) => question.subtopic?.slug ?? null)
        .filter((slug): slug is string => slug !== null),
    ).size,
    questionImageCount: normalizedExam.questions.filter(
      (question) => question.imageUrl !== null,
    ).length,
    optionImageQuestionCount: normalizedExam.questions.filter((question) =>
      question.optionImageUrls.some((imageUrl) => imageUrl.length > 0),
    ).length,
  };

  return {
    exam: normalizedExam,
    summary,
  };
};

export const printImportSummary = (
  summary: ImportSummary,
  options?: { dryRun?: boolean },
): void => {
  const modeLabel = options?.dryRun ? 'DRY RUN' : 'IMPORT';

  console.log(`[${modeLabel}] Exam ID: ${summary.examId}`);
  console.log(`[${modeLabel}] Title: ${summary.title}`);
  console.log(`[${modeLabel}] Questions: ${summary.questionCount}`);
  console.log(`[${modeLabel}] Topics detected: ${summary.detectedTopicCount}`);
  console.log(
    `[${modeLabel}] Subtopics detected: ${summary.detectedSubtopicCount}`,
  );
  console.log(
    `[${modeLabel}] Questions with imageUrl: ${summary.questionImageCount}`,
  );
  console.log(
    `[${modeLabel}] Questions with optionImageUrls: ${summary.optionImageQuestionCount}`,
  );
};
