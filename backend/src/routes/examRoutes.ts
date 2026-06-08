import { Router } from 'express';
import {
  getExamAttempts,
  getExamDetail,
  getExamList,
  getHealth,
  submitExamController,
} from '../controllers/examController';

export const examRouter = Router();

// Endpoint kiểm tra sức khỏe của API
examRouter.get('/health', getHealth);

// Lấy danh sách đề thi (không bao gồm câu hỏi và đáp án)
examRouter.get('/exams', getExamList);

// Lấy chi tiết đề thi theo ID, bao gồm cả câu hỏi và đáp án
examRouter.get('/exams/:id/attempts', getExamAttempts);

examRouter.get('/exams/:id', getExamDetail);

// Xử lý nộp bài thi, tính điểm và trả về kết quả
examRouter.post('/exam/submit', submitExamController);
