import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'; 
import { Pool } from 'pg'; 
import { PrismaPg } from '@prisma/adapter-pg'; 

// Cấu hình biến môi trường
dotenv.config();

const app = express();

// Khởi tạo connection pool bằng thư viện pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Khởi tạo PrismaClient với adapter (chuẩn Prisma 7)
const prisma = new PrismaClient({ adapter }); 

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'ManMath API is running (PostgreSQL Edition)' });
});
// Route để nhận dữ liệu trả lời từ frontend
app.post('/api/exam/submit', async (req: Request, res: Response) => { 
    const { answers } = req.body;

    let correctCount = 0;
    for (const question of mockExam.questions) {
        const qid = question.id;
        const selectedOptionIndex = answers[qid];
        const correctIndex = question.options.indexOf(question.correctAnswer);

        if (selectedOptionIndex === correctIndex) {
            correctCount++;
        }
    }

    const totalQuestions = mockExam.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 10);

    res.json({
        correctCount,
        totalQuestions,
        score,
    });
});

// Lấy danh sách đề thi
app.get('/api/exams', async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(mockExam);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Lỗi server khi lấy dữ liệu đề thi', 
            error: error.message 
        });
    }
});

// Khai báo kiểu dữ liệu cho câu hỏi và đề thi
type Question = {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
};

type ExamRespone = {
    examTitle: string;
    durationMinutes: number;
    questions: Question[];
};


// Mock Exam
const mockExam: ExamRespone = {
    examTitle: "Đề Toán THPT Quốc Gia Mock",
    durationMinutes: 1,
    questions: [
        {
            id: 1,
            question: "Nghiệm của phương trình 2x - 4 = 0 là:",
            options: ["A. x = 2", "B. x = 4", "C. x = 0", "D. x = 1"],
            correctAnswer: "A. x = 2",
        },
    ],
};

// Thêm app.listen() để khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});
