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
  year: number | null;
  statusLabel: string;
  _count: {
    questions: number;
  };
};

type QuestionDbRecord = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

type ExamDetailDbRecord = {
  id: string;
  title: string;
  durationMinutes: number;
  questions: QuestionDbRecord[];
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
    questions: examRecord.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
    })),
  };
};
