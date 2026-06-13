import type {
  ExamDetailDto,
  ExamDifficulty,
  ExamSummaryDto,
} from '../types/exam';

type ExamSummaryDbRecord = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  subject: string;
  difficulty: ExamDifficulty;
  source: string | null;
  year: number | null;
  statusLabel: string;
  _count: {
    questions: number;
  };
};

type QuestionDbRecord = {
  id: number;
  question: string;
  imageUrl: string | null;
  options: string[];
  optionImageUrls: string[];
  subtopic: {
    id: string;
    name: string;
    slug: string;
  } | null;
  correctAnswer: string;
};

type ExamDetailDbRecord = {
  id: string;
  title: string;
  durationMinutes: number;
  subject: string;
  difficulty: ExamDifficulty;
  source: string | null;
  year: number | null;
  statusLabel: string;
  questions: QuestionDbRecord[];
};

export const normalizeOptionImageUrls = (
  options: string[],
  optionImageUrls: string[],
): (string | null)[] => {
  return options.map((_, index) => {
    const imageUrl = optionImageUrls[index];

    if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return null;
    }

    return imageUrl;
  });
};

export const mapExamRecordToSummaryDto = (
  examRecord: ExamSummaryDbRecord,
): ExamSummaryDto => {
  return {
    id: examRecord.id,
    title: examRecord.title,
    description: examRecord.description,
    durationMinutes: examRecord.durationMinutes,
    totalQuestions: examRecord._count.questions,
    subject: examRecord.subject,
    difficulty: examRecord.difficulty,
    source: examRecord.source,
    year: examRecord.year ?? undefined,
    statusLabel: examRecord.statusLabel,
  };
};

export const mapExamRecordToDetailDto = (
  examRecord: ExamDetailDbRecord,
): ExamDetailDto => {
  return {
    id: examRecord.id,
    examTitle: examRecord.title,
    durationMinutes: examRecord.durationMinutes,
    subject: examRecord.subject,
    difficulty: examRecord.difficulty,
    source: examRecord.source,
    year: examRecord.year,
    statusLabel: examRecord.statusLabel,
    questions: examRecord.questions.map((question) => ({
      id: question.id,
      question: question.question,
      imageUrl: question.imageUrl,
      options: question.options,
      optionImageUrls: normalizeOptionImageUrls(
        question.options,
        question.optionImageUrls,
      ),
      subtopic: question.subtopic,
      correctAnswer: question.correctAnswer,
    })),
  };
};
