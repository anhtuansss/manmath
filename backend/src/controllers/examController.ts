import type { Request, Response } from 'express';
import {
  getExamAttemptsByExamId,
  getExamDetailById,
  getExamSummaries,
  submitExam,
} from '../services/examService';

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
    const examSummaries = await getExamSummaries();

    res.json(examSummaries);
  } catch (error) {
    console.error('Failed to load exam summaries:', error);
    res.status(500).json({ message: 'Khong the lay danh sach de thi' });
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
    const attempts = await getExamAttemptsByExamId(req.params.id);

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

export const submitExamController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await submitExam(req.body);

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
