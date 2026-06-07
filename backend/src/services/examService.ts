import { prisma } from '../lib/prisma';
import {
  mapExamRecordToDetailDto,
  mapExamRecordToSummaryDto,
} from '../lib/examMapper';
import type { ExamDetailDto, ExamSummaryDto } from '../types/exam';

export type SubmitExamRequestDto = {
  examId?: string;
  answers?: Record<number, number>;
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
    include: {
      questions: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!examRecord) {
    return null;
  }

  return mapExamRecordToDetailDto(examRecord);
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

  const { examId, answers } = payload as Partial<SubmitExamRequestDto>;

  if (typeof examId !== 'string' || examId.trim().length === 0) {
    return {
      ok: false,
      statusCode: 400,
      message: 'Thieu examId hop le',
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
  const score = Math.round((correctCount / totalQuestions) * 10);

  return {
    ok: true,
    data: {
      correctCount,
      totalQuestions,
      score,
    },
  };
};