import type { Request, Response } from 'express';
import {
  getAttemptDetailById,
  getExamAttemptsByExamId,
  getExamDetailById,
  getExamSummaries,
  getTopicFilters,
  submitExam,
} from '../services/examService';
import { examDifficulties, type ExamDifficulty } from '../types/exam';

const parseOptionalInteger = (
  rawValue: unknown,
): number | null | 'invalid' => {
  if (rawValue === undefined) {
    return null;
  }

  if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
    return 'invalid';
  }

  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    return 'invalid';
  }

  return parsedValue;
};

const parseOptionalDifficulty = (
  rawValue: unknown,
): ExamDifficulty | null | 'invalid' => {
  if (rawValue === undefined) {
    return null;
  }

  if (typeof rawValue !== 'string') {
    return 'invalid';
  }

  const normalizedValue = rawValue.trim() as ExamDifficulty;

  if (!examDifficulties.includes(normalizedValue)) {
    return 'invalid';
  }

  return normalizedValue;
};

// Endpoint kiểm tra sức khỏe của API
export const getHealth = (req: Request, res: Response): void => {
  res.json({ status: 'ok', message: 'ManMath API is running' });
};

// Lấy danh sách đề thi (không bao gồm câu hỏi và đáp án)
export const getExamList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const search =
      typeof req.query.search === 'string' ? req.query.search : undefined;
    const topic =
      typeof req.query.topic === 'string' ? req.query.topic : undefined;
    const subtopic =
      typeof req.query.subtopic === 'string' ? req.query.subtopic : undefined;
    const durationMin = parseOptionalInteger(req.query.durationMin);
    const durationMax = parseOptionalInteger(req.query.durationMax);
    const difficulty = parseOptionalDifficulty(req.query.difficulty);

    if (durationMin === 'invalid' || durationMax === 'invalid') {
      res.status(400).json({ message: 'Bo loc thoi luong khong hop le' });
      return;
    }

    if (
      typeof durationMin === 'number' &&
      typeof durationMax === 'number' &&
      durationMin > durationMax
    ) {
      res.status(400).json({ message: 'durationMin khong duoc lon hon durationMax' });
      return;
    }

    if (difficulty === 'invalid') {
      res.status(400).json({ message: 'Bo loc do kho khong hop le' });
      return;
    }

    const examSummaries = await getExamSummaries({
      search,
      topic,
      subtopic,
      durationMin: durationMin === null ? undefined : durationMin,
      durationMax: durationMax === null ? undefined : durationMax,
      difficulty: difficulty === null ? undefined : difficulty,
    });

    res.json(examSummaries);
  } catch (error) {
    console.error('Failed to load exam summaries:', error);
    res.status(500).json({ message: 'Khong the lay danh sach de thi' });
  }
};

export const getTopicList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const topics = await getTopicFilters();

    res.json({ topics });
  } catch (error) {
    console.error('Failed to load topics:', error);
    res.status(500).json({ message: 'Khong the lay danh sach chuyen de' });
  }
};

// Xử lý nộp bài thi, tính điểm và trả về kết quả
export const getExamDetail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const examDetail = await getExamDetailById(req.params.id);

    if (!examDetail) {
      res.status(404).json({ message: 'Khong tim thay de thi' });
      return;
    }

    res.json(examDetail);
  } catch (error) {
    console.error('Failed to load exam detail:', error);
    res.status(500).json({ message: 'Khong the lay chi tiet de thi' });
  }
};

// Xử lý nộp bài thi, tính điểm và trả về kết quả
export const getExamAttempts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const attempts = await getExamAttemptsByExamId(req.params.id, req.user.userId);

    if (!attempts) {
      res.status(404).json({ message: 'Khong tim thay de thi' });
      return;
    }

    res.json(attempts);
  } catch (error) {
    console.error('Failed to load exam attempts:', error);
    res.status(500).json({ message: 'Khong the lay lich su lam bai' });
  }
};

// Lấy chi tiết một lần thi theo ID, bao gồm cả thông tin đề thi và câu trả lời đã chọn
export const getAttemptDetail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }


    const attemptDetail = await getAttemptDetailById(req.params.attemptId, req.user.userId);

    if (!attemptDetail) {
      res.status(404).json({ message: 'Khong tim thay lan lam bai' });
      return;
    }

    res.json(attemptDetail);
  } catch (error) {
    console.error('Failed to load attempt detail:', error);
    res.status(500).json({ message: 'Khong the lay chi tiet lan lam bai' });
  }
};

// Xử lý nộp bài thi, tính điểm và trả về kết quả
export const submitExamController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await submitExam(req.body, req.user?.userId);

    if (!result.ok) {
      res.status(result.statusCode).json({ message: result.message });
      return;
    }

    res.json(result.data);
  } catch (error) {
    console.error('Failed to submit exam:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
