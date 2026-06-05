/**
 * Mục đích:
 * Express API cho MVP ManMath. Backend hiện dùng mock data để kiểm tra trọn luồng
 * trước khi thay nguồn dữ liệu bằng PostgreSQL.
 *
 * Luồng dữ liệu:
 * Frontend gọi GET /api/exams để lấy danh sách, GET /api/exams/:id để lấy chi tiết,
 * và POST /api/exam/submit để backend chấm điểm.
 *
 * File liên quan:
 * backend/src/data/mockExams.ts
 * frontend/src/components/exam/ExamListClient.tsx
 * frontend/src/components/exam/ExamTakingClient.tsx
 * frontend/src/components/exam/ExamResultClient.tsx
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  findExamById,
  getExamSummaries,
  type ExamDetailDto,
} from './src/data/mockExams';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'ManMath API is running' });
});

/**
 * Trả danh sách đề rút gọn cho trang danh sách hoặc bảng tổng quan.
 * Phản hồi cố ý nhỏ hơn chi tiết đề để màn danh sách không nhận dữ liệu câu hỏi dư thừa.
 */
app.get('/api/exams', (req: Request, res: Response) => {
  res.json(getExamSummaries());
});

/**
 * Trả chi tiết một đề theo id cho màn làm bài.
 * Chi tiết đề có cả questions và correctAnswer vì MVP cần xem lại đáp án sau khi nộp.
 */
app.get('/api/exams/:id', (req: Request, res: Response): void => {
  const exam = findExamById(req.params.id);

  if (!exam) {
    res.status(404).json({ message: 'Khong tim thay de thi' });
    return;
  }

  const examDetail: ExamDetailDto = {
    id: exam.id,
    examTitle: exam.examTitle,
    durationMinutes: exam.durationMinutes,
    questions: exam.questions,
  };

  res.json(examDetail);
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

app.post('/api/exam/submit', (req: Request, res: Response): void => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ message: 'Du lieu nop bai khong hop le' });
    return;
  }

  const { examId, answers } = req.body as Partial<SubmitExamRequestDto>;

  if (typeof examId !== 'string' || examId.trim().length === 0) {
    res.status(400).json({ message: 'Thieu examId hop le' });
    return;
  }

  const exam = findExamById(examId.trim());

  if (!exam) {
    res.status(404).json({ message: 'Khong tim thay de thi de cham diem' });
    return;
  }

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
