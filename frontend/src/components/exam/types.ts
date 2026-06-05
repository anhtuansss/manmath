export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type ExamResponse = {
  id: string;
  examTitle: string;
  durationMinutes: number;
  questions: Question[];
};

export type Answers = Record<number, number>;

export type SubmitRequest = {
  examId: string;
  answers: Answers;
};

export type SubmitResult = {
  correctCount: number;
  totalQuestions: number;
  score: number;
};

export type ExamDifficulty = 'easy' | 'medium' | 'hard';

export type ExamListItem = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  subject: string;
  difficulty: ExamDifficulty;
  year?: number;
  statusLabel: string;
  href: string;
};

export type ExamListApiItem = Omit<ExamListItem, 'href'>;

export type ExamResultSession = {
  examId: string;
  examTitle: string;
  submittedAt: string;
  answers: Answers;
  submitResult: SubmitResult;
  exam?: ExamResponse;
};
