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

export type MockQuestion = QuestionDto & {
  topicSlug: string;
};

export type Question = MockQuestion;

export type ExamMock = Omit<ExamDetailDto, 'questions'> & {
  description: string;
  subject: string;
  difficulty: ExamDifficulty;
  year?: number;
  statusLabel: string;
  questions: MockQuestion[];
};

// Dữ liệu đề giả lập có thêm metadata cho list UI và seed local.
export type Exam = ExamMock;

export type ExamSummary = ExamSummaryDto;

export const mockExams: ExamMock[] = [
  {
    id: 'thpt-mock-01',
    examTitle: 'Đề luyện thi THPT Quốc gia số 1',
    description:
      'Bộ đề tổng hợp có LaTeX để kiểm tra flow làm bài, chấm điểm và render công thức KaTeX.',
    durationMinutes: 50,
    subject: 'Toán',
    difficulty: 'medium',
    year: 2026,
    statusLabel: 'Dữ liệu mẫu',
    questions: [
      {
        id: 1,
        topicSlug: 'ham-so',
        question: 'Giải phương trình $2x - 4 = 0$. Nghiệm của phương trình là:',
        options: ['A. $x=2$', 'B. $x=4$', 'C. $x=0$', 'D. $x=1$'],
        correctAnswer: 'A. $x=2$',
      },
      {
        id: 2,
        topicSlug: 'ham-so',
        question: "Cho hàm số $f(x)=x^3-2x$. Tính $f'(x)$.",
        options: [
          "A. $f'(x)=3x^2-2$",
          "B. $f'(x)=3x-2$",
          "C. $f'(x)=x^2-2$",
          "D. $f'(x)=3x^2+2$",
        ],
        correctAnswer: "A. $f'(x)=3x^2-2$",
      },
      {
        id: 3,
        topicSlug: 'tich-phan',
        question: 'Tính tích phân $$\\int_0^1 x^2\\,dx$$',
        options: ['A. $\\frac{1}{2}$', 'B. $\\frac{1}{3}$', 'C. $1$', 'D. $0$'],
        correctAnswer: 'B. $\\frac{1}{3}$',
      },
      {
        id: 4,
        topicSlug: 'gioi-han',
        question: 'Tính giới hạn $\\lim_{x\\to 0}\\frac{\\sin x}{x}$.',
        options: ['A. $0$', 'B. $1$', 'C. $+\\infty$', 'D. $-1$'],
        correctAnswer: 'B. $1$',
      },
      {
        id: 5,
        topicSlug: 'ham-so',
        question: 'Rút gọn biểu thức $\\sqrt{50}$.',
        options: [
          'A. $5\\sqrt{2}$',
          'B. $25\\sqrt{2}$',
          'C. $10\\sqrt{5}$',
          'D. $2\\sqrt{5}$',
        ],
        correctAnswer: 'A. $5\\sqrt{2}$',
      },
      {
        id: 6,
        topicSlug: 'logarit-mu',
        question: 'Nếu $\\log_2 x=3$ thì $x$ bằng:',
        options: ['A. $6$', 'B. $8$', 'C. $9$', 'D. $12$'],
        correctAnswer: 'B. $8$',
      },
      {
        id: 7,
        topicSlug: 'ham-so',
        question: 'Giải phương trình $2^x=8$.',
        options: ['A. $x=2$', 'B. $x=3$', 'C. $x=4$', 'D. $x=8$'],
        correctAnswer: 'B. $x=3$',
      },
      {
        id: 8,
        topicSlug: 'vector-toa-do',
        question:
          'Cho $\\vec{u}=(1;2;3)$ và $\\vec{v}=(2;0;1)$. Tính $\\vec{u}\\cdot\\vec{v}$.',
        options: ['A. $3$', 'B. $4$', 'C. $5$', 'D. $6$'],
        correctAnswer: 'C. $5$',
      },
      {
        id: 9,
        topicSlug: 'xac-suat-to-hop',
        question:
          'Gieo một con xúc xắc cân đối. Xác suất để mặt xuất hiện là số chẵn bằng:',
        options: [
          'A. $\\frac{1}{6}$',
          'B. $\\frac{1}{3}$',
          'C. $\\frac{1}{2}$',
          'D. $\\frac{2}{3}$',
        ],
        correctAnswer: 'C. $\\frac{1}{2}$',
      },
      {
        id: 10,
        topicSlug: 'xac-suat-to-hop',
        question: 'Tính số tổ hợp $C_5^2$.',
        options: ['A. $5$', 'B. $10$', 'C. $20$', 'D. $25$'],
        correctAnswer: 'B. $10$',
      },
    ],
  },
  {
    id: 'ham-so-muc-tieu',
    examTitle: 'Chuyên đề Hàm số và đồ thị',
    description:
      'Tập trung vào đạo hàm, giới hạn, đơn điệu, tiếp tuyến và các câu hàm số có LaTeX.',
    durationMinutes: 45,
    subject: 'Toán',
    difficulty: 'easy',
    year: 2026,
    statusLabel: 'Dữ liệu mẫu',
    questions: [
      {
        id: 101,
        topicSlug: 'ham-so',
        question: "Cho $f(x)=x^4-2x^2$. Tính $f'(x)$.",
        options: [
          "A. $f'(x)=4x^3-4x$",
          "B. $f'(x)=4x^3-2x$",
          "C. $f'(x)=x^3-4x$",
          "D. $f'(x)=4x^2-4$",
        ],
        correctAnswer: "A. $f'(x)=4x^3-4x$",
      },
      {
        id: 102,
        topicSlug: 'ham-so',
        question: 'Tập xác định của hàm số $y=\\frac{2x+1}{x-1}$ là:',
        options: [
          'A. $\\mathbb{R}$',
          'B. $\\mathbb{R}\\setminus\\{1\\}$',
          'C. $\\mathbb{R}\\setminus\\{-1\\}$',
          'D. $(1;+\\infty)$',
        ],
        correctAnswer: 'B. $\\mathbb{R}\\setminus\\{1\\}$',
      },
      {
        id: 103,
        topicSlug: 'gioi-han',
        question: 'Tính giới hạn $\\lim_{x\\to +\\infty}\\frac{2x+1}{x-1}$.',
        options: ['A. $1$', 'B. $2$', 'C. $-1$', 'D. $+\\infty$'],
        correctAnswer: 'B. $2$',
      },
      {
        id: 104,
        topicSlug: 'ham-so',
        question: 'Hàm số $y=x^3-3x$ nghịch biến trên khoảng nào?',
        options: [
          'A. $(-\\infty;-1)$',
          'B. $(-1;1)$',
          'C. $(1;+\\infty)$',
          'D. $\\mathbb{R}$',
        ],
        correctAnswer: 'B. $(-1;1)$',
      },
      {
        id: 105,
        topicSlug: 'ham-so',
        question: 'Tiếp tuyến của đồ thị $y=x^2$ tại điểm có hoành độ $x=1$ là:',
        options: ['A. $y=x+1$', 'B. $y=2x-1$', 'C. $y=2x+1$', 'D. $y=x-1$'],
        correctAnswer: 'B. $y=2x-1$',
      },
      {
        id: 106,
        topicSlug: 'ham-so',
        question: "Với $f(x)=x^3-3x$, các điểm tới hạn thỏa $f'(x)=0$ là:",
        options: ['A. $x=0$', 'B. $x=1$', 'C. $x=\\pm 1$', 'D. $x=\\pm 3$'],
        correctAnswer: 'C. $x=\\pm 1$',
      },
      {
        id: 107,
        topicSlug: 'ham-so',
        question: 'Đường tiệm cận đứng của đồ thị $y=\\frac{x+1}{x-2}$ là:',
        options: ['A. $x=1$', 'B. $x=2$', 'C. $y=1$', 'D. $y=2$'],
        correctAnswer: 'B. $x=2$',
      },
      {
        id: 108,
        topicSlug: 'logarit-mu',
        question: 'Điều kiện xác định của $\\log_2(x-1)$ là:',
        options: ['A. $x>1$', 'B. $x\\ge 1$', 'C. $x<1$', 'D. $x\\ne 1$'],
        correctAnswer: 'A. $x>1$',
      },
      {
        id: 109,
        topicSlug: 'ham-so',
        question: 'Giải phương trình $2^{x+1}=16$.',
        options: ['A. $x=2$', 'B. $x=3$', 'C. $x=4$', 'D. $x=5$'],
        correctAnswer: 'B. $x=3$',
      },
      {
        id: 110,
        topicSlug: 'tich-phan',
        question: 'Tính tích phân $$\\int_0^2 x\\,dx$$',
        options: ['A. $1$', 'B. $2$', 'C. $3$', 'D. $4$'],
        correctAnswer: 'B. $2$',
      },
    ],
  },
  {
    id: 'tong-hop-van-dung-cao',
    examTitle: 'Đề tổng hợp vận dụng cao',
    description:
      'Nhóm câu hỏi khó hơn về giới hạn, tích phân, logarit, xác suất, vector và ma trận.',
    durationMinutes: 90,
    subject: 'Toán',
    difficulty: 'hard',
    year: 2026,
    statusLabel: 'Dữ liệu mẫu',
    questions: [
      {
        id: 201,
        topicSlug: 'gioi-han',
        question: 'Tính giới hạn $\\lim_{x\\to 0}\\frac{\\sqrt{1+x}-1}{x}$.',
        options: ['A. $0$', 'B. $\\frac{1}{2}$', 'C. $1$', 'D. $2$'],
        correctAnswer: 'B. $\\frac{1}{2}$',
      },
      {
        id: 202,
        topicSlug: 'tich-phan',
        question: 'Tính tích phân $$\\int_0^1 3x^2\\,dx$$',
        options: ['A. $\\frac{1}{3}$', 'B. $\\frac{1}{2}$', 'C. $1$', 'D. $3$'],
        correctAnswer: 'C. $1$',
      },
      {
        id: 203,
        topicSlug: 'xac-suat-to-hop',
        question: 'Nếu $C_n^2=45$ và $n\\ge 2$, giá trị của $n$ là:',
        options: ['A. $8$', 'B. $9$', 'C. $10$', 'D. $11$'],
        correctAnswer: 'C. $10$',
      },
      {
        id: 204,
        topicSlug: 'xac-suat-to-hop',
        question:
          'Hộp có 3 bi đỏ và 2 bi xanh. Chọn ngẫu nhiên 2 bi. Xác suất chọn được 2 bi cùng màu là:',
        options: [
          'A. $\\frac{1}{5}$',
          'B. $\\frac{2}{5}$',
          'C. $\\frac{3}{5}$',
          'D. $\\frac{4}{5}$',
        ],
        correctAnswer: 'B. $\\frac{2}{5}$',
      },
      {
        id: 205,
        topicSlug: 'vector-toa-do',
        question: 'Cho $\\vec{u}=(1;2;0)$ và $\\vec{v}=(2;-1;1)$. Mệnh đề nào đúng?',
        options: [
          'A. $\\vec{u}\\cdot\\vec{v}=0$',
          'B. $\\vec{u}\\cdot\\vec{v}=1$',
          'C. $\\vec{u}\\cdot\\vec{v}=2$',
          'D. $\\vec{u}\\cdot\\vec{v}=3$',
        ],
        correctAnswer: 'A. $\\vec{u}\\cdot\\vec{v}=0$',
      },
      {
        id: 206,
        topicSlug: 'logarit-mu',
        question: 'Giải phương trình $\\log_2 x+\\log_2(x-2)=3$ với $x>2$.',
        options: ['A. $x=2$', 'B. $x=3$', 'C. $x=4$', 'D. $x=6$'],
        correctAnswer: 'C. $x=4$',
      },
      {
        id: 207,
        topicSlug: 'logarit-mu',
        question: "Đạo hàm của hàm số $f(x)=\\ln x$ với $x>0$ là:",
        options: [
          "A. $f'(x)=x$",
          "B. $f'(x)=\\frac{1}{x}$",
          "C. $f'(x)=\\ln x$",
          "D. $f'(x)=e^x$",
        ],
        correctAnswer: "B. $f'(x)=\\frac{1}{x}$",
      },
      {
        id: 208,
        topicSlug: 'ham-so',
        question: 'Giá trị lớn nhất của hàm số $y=-x^2+4x+1$ trên $\\mathbb{R}$ là:',
        options: ['A. $4$', 'B. $5$', 'C. $6$', 'D. $7$'],
        correctAnswer: 'B. $5$',
      },
      {
        id: 209,
        topicSlug: 'ma-tran',
        question: 'Tính định thức $$\\begin{vmatrix}1&2\\\\3&4\\end{vmatrix}$$',
        options: ['A. $-2$', 'B. $2$', 'C. $10$', 'D. $-10$'],
        correctAnswer: 'A. $-2$',
      },
      {
        id: 210,
        topicSlug: 'vector-toa-do',
        question: 'Khoảng cách từ $A(1;2;3)$ đến mặt phẳng $x+2y+2z-9=0$ bằng:',
        options: ['A. $\\frac{1}{3}$', 'B. $\\frac{2}{3}$', 'C. $1$', 'D. $2$'],
        correctAnswer: 'B. $\\frac{2}{3}$',
      },
    ],
  },
];
