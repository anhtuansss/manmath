import { prisma } from '../lib/prisma';
import {
  mapExamRecordToDetailDto,
  mapExamRecordToSummaryDto,
} from '../lib/examMapper';
import type {
  ExamAttemptDetailDto,
  ExamAttemptSummaryDto,
  ExamDetailDto,
  ExamSummaryDto,
} from '../types/exam';

export type SubmitExamRequestDto = {
  examId?: string;
  answers?: Record<number, number>;
  durationSeconds?: number;
};

export type SubmitExamResultDto = {
  correctCount: number;
  totalQuestions: number;
  score: number;
};

type ValidationResult =
  | { ok: true; answers: Record<number, number> }
  | { ok: false; message: string };

export type SubmitExamServiceResult =
  | { ok: true; data: SubmitExamResultDto }
  | { ok: false; statusCode: 400 | 404; message: string };

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

// Hàm kiểm tra và chuẩn hóa dữ liệu câu trả lời khi nộp bài thi
const normalizeSubmitAnswers = (
  exam: ExamDetailDto,
  rawAnswers: unknown,
): ValidationResult => {
  if (!isPlainObject(rawAnswers)) {
    return {
      ok: false,
      message: 'Du lieu cau tra loi khong hop le',
    };
  }

  const questionMap = new Map(exam.questions.map((question) => [question.id, question]));
  const normalizedAnswers: Record<number, number> = {};

  for (const [rawQuestionId, rawSelectedOptionIndex] of Object.entries(rawAnswers)) {
    if (!/^\d+$/.test(rawQuestionId)) {
      return {
        ok: false,
        message: 'Cau tra loi khong hop le',
      };
    }

    const questionId = Number(rawQuestionId);
    const question = questionMap.get(questionId);

    if (!question) {
      return {
        ok: false,
        message: 'Cau tra loi khong hop le',
      };
    }

    if (
      typeof rawSelectedOptionIndex !== 'number' ||
      !Number.isInteger(rawSelectedOptionIndex)
    ) {
      return {
        ok: false,
        message: 'Lua chon tra loi khong hop le',
      };
    }

    if (rawSelectedOptionIndex < 0 || rawSelectedOptionIndex >= question.options.length) {
      return {
        ok: false,
        message: 'Lua chon tra loi khong hop le',
      };
    }

    normalizedAnswers[questionId] = rawSelectedOptionIndex;
  }

  return {
    ok: true,
    answers: normalizedAnswers,
  };
};

// Lấy danh sách tóm tắt các đề thi
export const getExamSummaries = async (): Promise<ExamSummaryDto[]> => {
  const exams = await prisma.exam.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      durationMinutes: true,
      subject: true,
      difficulty: true,
      year: true,
      statusLabel: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  return exams.map((exam) => mapExamRecordToSummaryDto(exam));
};

// Lấy chi tiết đề thi theo ID, bao gồm cả câu hỏi và đáp án
export const getExamDetailById = async (
  examId: string,
): Promise<ExamDetailDto | null> => {
  const examRecord = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
    select: {
      id: true,
      title: true,
      durationMinutes: true,
      questions: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          question: true,
          options: true,
          correctAnswer: true,
        },
      },
    },
  });

  if (!examRecord) {
    return null;
  }

  return mapExamRecordToDetailDto(examRecord);
};

// Lấy danh sách các lần thi đã nộp cho một đề thi cụ thể
export const getExamAttemptsByExamId = async (
  examId: string,
): Promise<ExamAttemptSummaryDto[] | null> => {
  const examRecord = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
    select: {
      attempts: {
        orderBy: {
          submittedAt: 'desc',
        },
        select: {
          id: true,
          examId: true,
          score: true,
          correctCount: true,
          totalQuestions: true,
          unansweredCount: true,
          durationSeconds: true,
          submittedAt: true,
        },
      },
    },
  });

  if (!examRecord) {
    return null;
  }

  return examRecord.attempts.map((attempt) => ({
    id: attempt.id,
    examId: attempt.examId,
    score: attempt.score,
    correctCount: attempt.correctCount,
    totalQuestions: attempt.totalQuestions,
    unansweredCount: attempt.unansweredCount,
    durationSeconds: attempt.durationSeconds,
    submittedAt: attempt.submittedAt.toISOString(),
  }));
};

// Lấy chi tiết một lần thi theo ID, bao gồm cả thông tin đề thi và câu trả lời đã chọn
export const getAttemptDetailById = async (
  attemptId: string,
): Promise<ExamAttemptDetailDto | null> => {
  const attemptRecord = await prisma.attempt.findUnique({
    where: {
      id: attemptId,
    },
    select: {
      id: true,
      examId: true,
      score: true,
      correctCount: true,
      totalQuestions: true,
      unansweredCount: true,
      durationSeconds: true,
      submittedAt: true,
      exam: {
        select: {
          id: true,
          title: true,
          durationMinutes: true,
          questions: {
            orderBy: {
              order: 'asc',
            },
            select: {
              id: true,
              question: true,
              options: true,
            },
          },
        },
      },
      answers: {
        select: {
          questionId: true,
          selectedOptionIndex: true,
          correctOptionIndex: true,
          isCorrect: true,
        },
      },
    },
  });

  if (!attemptRecord) {
    return null;
  }

  const answerMap = new Map(
    attemptRecord.answers.map((answer) => [answer.questionId, answer]),
  );

  return {
    attempt: {
      id: attemptRecord.id,
      examId: attemptRecord.examId,
      score: attemptRecord.score,
      correctCount: attemptRecord.correctCount,
      totalQuestions: attemptRecord.totalQuestions,
      unansweredCount: attemptRecord.unansweredCount,
      durationSeconds: attemptRecord.durationSeconds,
      submittedAt: attemptRecord.submittedAt.toISOString(),
    },
    exam: {
      id: attemptRecord.exam.id,
      title: attemptRecord.exam.title,
      durationMinutes: attemptRecord.exam.durationMinutes,
    },
    answers: attemptRecord.exam.questions.flatMap((question) => {
      const answer = answerMap.get(question.id);

      if (!answer) {
        return [];
      }

      return {
        questionId: question.id,
        question: question.question,
        options: question.options,
        selectedOptionIndex: answer.selectedOptionIndex,
        correctOptionIndex: answer.correctOptionIndex,
        isCorrect: answer.isCorrect,
      };
    }),
  };
};

// Xử lý nộp bài thi, tính điểm và trả về kết quả
export const submitExam = async (
  payload: unknown,
): Promise<SubmitExamServiceResult> => {
  if (!isPlainObject(payload)) {
    return {
      ok: false,
      statusCode: 400,
      message: 'Du lieu nop bai khong hop le',
    };
  }

  const { examId, answers, durationSeconds } =
  payload as Partial<SubmitExamRequestDto>;

  if (typeof examId !== 'string' || examId.trim().length === 0) {
    return {
      ok: false,
      statusCode: 400,
      message: 'Thieu examId hop le',
    };
  }

  if (
    durationSeconds !== undefined &&
    (typeof durationSeconds !== 'number' ||
      !Number.isInteger(durationSeconds) ||
      durationSeconds < 0)
  ) {
    return {
      ok: false,
      statusCode: 400,
      message: 'Thoi gian lam bai khong hop le',
    };
  }

  const exam = await getExamDetailById(examId.trim());

  if (!exam) {
    return {
      ok: false,
      statusCode: 404,
      message: 'Khong tim thay de thi de cham diem',
    };
  }

  const validatedAnswers = normalizeSubmitAnswers(exam, answers);

  if (!validatedAnswers.ok) {
    return {
      ok: false,
      statusCode: 400,
      message: validatedAnswers.message,
    };
  }

  let correctCount = 0;

  for (const question of exam.questions) {
    const selectedOptionIndex = validatedAnswers.answers[question.id];
    const correctIndex = question.options.indexOf(question.correctAnswer);

    if (selectedOptionIndex === correctIndex) {
      correctCount++;
    }
  }

  const totalQuestions = exam.questions.length;
  const unansweredCount = exam.questions.filter((question) => {
    return validatedAnswers.answers[question.id] === undefined;
  }).length;
  const score = Math.round((correctCount / totalQuestions) * 10);

  await prisma.attempt.create({
    data: {
      examId: exam.id,
      score,
      correctCount,
      totalQuestions,
      unansweredCount,
      durationSeconds: durationSeconds ?? null,
      answers: {
        create: exam.questions.map((question) => {
          const selectedOptionIndex = validatedAnswers.answers[question.id];
          const correctOptionIndex = question.options.indexOf(question.correctAnswer);
          const isAnswered = selectedOptionIndex !== undefined;

          return {
            questionId: question.id,
            selectedOptionIndex: isAnswered ? selectedOptionIndex : null,
            correctOptionIndex,
            isCorrect: isAnswered && selectedOptionIndex === correctOptionIndex,
          };
        }),
      },
    },
  });

  return {
    ok: true,
    data: {
      correctCount,
      totalQuestions,
      score,
    },
  };
};
