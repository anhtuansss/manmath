export type ExamDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionDto = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type ExamSummaryDto = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  subject: string;
  difficulty: ExamDifficulty;
  year?: number;
  statusLabel: string;
};

export type ExamDetailDto = {
  id: string;
  examTitle: string;
  durationMinutes: number;
  questions: QuestionDto[];
};

export type ExamAttemptSummaryDto = {
  id: string;
  examId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  unansweredCount: number;
  durationSeconds: number | null;
  submittedAt: string;
};
