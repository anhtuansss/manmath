import { Router } from 'express';
import {
  getAttemptDetail,
  getExamAttempts,
  getExamDetail,
  getExamList,
  getHealth,
  submitExamController,
} from '../controllers/examController';
import { optionalAuthMiddleware } from '../middleware/authMiddleware';

export const examRouter = Router();

// Endpoint kiểm tra sức khỏe của API
examRouter.get('/health', getHealth);

// Lấy danh sách đề thi (không bao gồm câu hỏi và đáp án)
examRouter.get('/exams', getExamList);

// Lấy danh sách các lần thi đã nộp cho một đề thi cụ thể
examRouter.get('/exams/:id/attempts', getExamAttempts);

// Lấy chi tiết đề thi theo ID, bao gồm cả câu hỏi và đáp án
examRouter.get('/exams/:id', getExamDetail);

// Lấy chi tiết một lần thi theo ID, bao gồm cả thông tin đề thi và câu trả lời đã chọn
examRouter.get('/attempts/:attemptId', getAttemptDetail);

// Xử lý nộp bài thi, tính điểm và trả về kết quả
examRouter.post('/exam/submit', optionalAuthMiddleware, submitExamController);
