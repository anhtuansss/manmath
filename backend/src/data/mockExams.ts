/**
 * Mục đích:
 * Dữ liệu đề giả lập dùng cho seed local và kiểm tra cấu trúc đề trước khi hoàn toàn
 * chuyển sang PostgreSQL ở runtime.
 *
 * Luồng dữ liệu:
 * File seed đọc mockExams để tạo Exam và Question trong database local. Runtime backend
 * không còn đọc file này nữa; server.ts đi qua Prisma helper.
 *
 * File liên quan:
 * backend/src/data/seed.ts
 * backend/src/types/exam.ts
 */
import type {
  ExamDetailDto,
  ExamDifficulty,
  ExamSummaryDto,
  QuestionDto,
} from '../types/exam';

export type Question = QuestionDto;

export type ExamMock = ExamDetailDto & {
  description: string;
  subject: string;
  difficulty: ExamDifficulty;
  year?: number;
  statusLabel: string;
};

// Dữ liệu đề giả lập có thêm metadata cho list UI và seed local.
export type Exam = ExamMock;

export type ExamSummary = ExamSummaryDto;

export const mockExams: ExamMock[] = [
  {
    id: 'thpt-mock-01',
    examTitle: 'De luyen thi THPT Quoc gia so 1',
    description:
      'Bo de mock dung de kiem tra flow lam bai hien tai: chon dap an, luu nhap, tinh gio va nop bai.',
    durationMinutes: 5,
    subject: 'Toan',
    difficulty: 'medium',
    year: 2026,
    statusLabel: 'Mock data',
    questions: [
      {
        id: 1,
        question: 'Nghiem cua phuong trinh 2x - 4 = 0 la:',
        options: ['A. x = 2', 'B. x = 4', 'C. x = 0', 'D. x = 1'],
        correctAnswer: 'A. x = 2',
      },
      {
        id: 2,
        question: 'Dao ham cua ham so y = x^3 la:',
        options: ["A. y' = 3x", "B. y' = 3x^2", "C. y' = x^2", "D. y' = 2x^3"],
        correctAnswer: "B. y' = 3x^2",
      },
      {
        id: 3,
        question: 'The tich khoi lap phuong co canh a bang:',
        options: ['A. a^2', 'B. 3a', 'C. a^3', 'D. a^3 / 3'],
        correctAnswer: 'C. a^3',
      },
    ],
  },
  {
    id: 'ham-so-muc-tieu',
    examTitle: 'Chuyen de Ham so va do thi',
    description:
      'Tap trung vao nhan dang do thi, tinh don dieu, cuc tri va cac cau van dung thuong gap.',
    durationMinutes: 45,
    subject: 'Toan',
    difficulty: 'easy',
    year: 2026,
    statusLabel: 'Mock data',
    questions: [
      {
        id: 101,
        question: 'Ham so y = x^2 dong bien tren khoang nao?',
        options: ['A. (-infinity; 0)', 'B. (0; +infinity)', 'C. R', 'D. (-1; 1)'],
        correctAnswer: 'B. (0; +infinity)',
      },
      {
        id: 102,
        question: 'Do thi ham so y = ax + b voi a > 0 co dang:',
        options: [
          'A. Duong thang di xuong tu trai sang phai',
          'B. Duong thang di len tu trai sang phai',
          'C. Parabol',
          'D. Duong tron',
        ],
        correctAnswer: 'B. Duong thang di len tu trai sang phai',
      },
    ],
  },
  {
    id: 'tong-hop-van-dung-cao',
    examTitle: 'De tong hop van dung cao',
    description:
      'Nhom cau hoi kho hon de luyen toc do xu ly va kiem tra do chac kien thuc truoc ky thi.',
    durationMinutes: 90,
    subject: 'Toan',
    difficulty: 'hard',
    year: 2026,
    statusLabel: 'Mock data',
    questions: [
      {
        id: 201,
        question: 'Neu log2(x) = 3 thi x bang:',
        options: ['A. 6', 'B. 8', 'C. 9', 'D. 12'],
        correctAnswer: 'B. 8',
      },
      {
        id: 202,
        question: 'So nghiem thuc cua phuong trinh x^2 - 4x + 4 = 0 la:',
        options: ['A. 0', 'B. 1', 'C. 2', 'D. 3'],
        correctAnswer: 'B. 1',
      },
      {
        id: 203,
        question: 'Gia tri lon nhat cua ham so y = -x^2 + 2x + 3 la:',
        options: ['A. 3', 'B. 4', 'C. 5', 'D. 6'],
        correctAnswer: 'B. 4',
      },
    ],
  },
];
