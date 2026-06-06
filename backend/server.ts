/**
 * Mục đích:
 * Express API cho MVP ManMath. Backend đọc dữ liệu đề qua Prisma helper để giữ
 * runtime gọn, còn mock data chỉ còn phục vụ seed local.
 *
 * Luồng dữ liệu:
 * Frontend gọi GET /api/exams để lấy danh sách, GET /api/exams/:id để lấy chi tiết,
 * và POST /api/exam/submit để backend chấm điểm từ dữ liệu PostgreSQL.
 *
 * File liên quan:
 * backend/src/lib/prisma.ts
 * backend/src/lib/examMapper.ts
 * backend/src/types/exam.ts
 * frontend/src/components/exam/ExamListClient.tsx
 * frontend/src/components/exam/ExamTakingClient.tsx
 * frontend/src/components/exam/ExamResultClient.tsx
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './src/lib/prisma';
import {
  mapExamRecordToDetailDto,
  mapExamRecordToSummaryDto,
} from './src/lib/examMapper';
import type { ExamDetailDto } from './src/types/exam';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'ManMath API is running' });
});

// Lấy danh sách đề thi với thông tin tóm tắt để hiển thị ở trang danh sách.
app.get('/api/exams', async (req: Request, res: Response): Promise<void> => {
  try {
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

    const examSummaries = exams.map((exam) => mapExamRecordToSummaryDto(exam));

    res.json(examSummaries);
  } catch (error) {
    console.error('Failed to load exam summaries:', error);
    res.status(500).json({ message: 'Khong the lay danh sach de thi' });
  }
});

// Lấy chi tiết đề thi, bao gồm danh sách câu hỏi và đáp án đúng để màn làm bài sử dụng.
app.get('/api/exams/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const examRecord = await prisma.exam.findUnique({
      where: {
        id: req.params.id,
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
      res.status(404).json({ message: 'Khong tim thay de thi' });
      return;
    }

    const examDetail: ExamDetailDto = mapExamRecordToDetailDto(examRecord);

    res.json(examDetail);
  } catch (error) {
    console.error('Failed to load exam detail:', error);
    res.status(500).json({ message: 'Khong the lay chi tiet de thi' });
  }
});

type SubmitExamRequestDto = {
  examId?: string;
  answers?: Record<number, number>;
};

type SubmitExamResultDto = {
  correctCount: number;
  totalQuestions: number;
  score: number;
};

type ValidationResult =
  | { ok: true; answers: Record<number, number> }
  | { ok: false; message: string };

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Chuẩn hóa answers từ JSON thành Record<number, number>.
 * Key của object JSON luôn đi vào dưới dạng string, nên cần kiểm tra questionId
 * và chỉ số đáp án trước khi chấm để không âm thầm nhận dữ liệu nộp bài sai.
 */
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

app.post('/api/exam/submit', async (req: Request, res: Response): Promise<void> => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ message: 'Du lieu nop bai khong hop le' });
    return;
  }

  const { examId, answers } = req.body as Partial<SubmitExamRequestDto>;

  if (typeof examId !== 'string' || examId.trim().length === 0) {
    res.status(400).json({ message: 'Thieu examId hop le' });
    return;
  }

  const examRecord = await prisma.exam.findUnique({
    where: {
      id: examId.trim(),
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
    res.status(404).json({ message: 'Khong tim thay de thi de cham diem' });
    return;
  }

  const exam: ExamDetailDto = mapExamRecordToDetailDto(examRecord);

  const validatedAnswers = normalizeSubmitAnswers(exam, answers);

  if (!validatedAnswers.ok) {
    res.status(400).json({ message: validatedAnswers.message });
    return;
  }

  let correctCount = 0;

  // Câu chưa làm vẫn hợp lệ; chỉ đơn giản là không tăng correctCount.
  for (const question of exam.questions) {
    const selectedOptionIndex = validatedAnswers.answers[question.id];
    const correctIndex = question.options.indexOf(question.correctAnswer);

    if (selectedOptionIndex === correctIndex) {
      correctCount++;
    }
  }

  const totalQuestions = exam.questions.length;
  const score = Math.round((correctCount / totalQuestions) * 10);

  const submitResult: SubmitExamResultDto = {
    correctCount,
    totalQuestions,
    score,
  };

  res.json(submitResult);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
