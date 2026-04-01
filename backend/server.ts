import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db';
import Exam from './src/models/Exam';

// Chỉ cần 1 dòng này để cấu hình biến môi trường
dotenv.config({ path: '../.env' }); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối Database
connectDB();

// Routes
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'ManMath API is running' });
});

// Lấy danh sách đề thi (Đã thêm kiểu dữ liệu trả về cho chuẩn TS)
app.get('/api/exams', async (req: Request, res: Response): Promise<void> => {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Lỗi server khi lấy dữ liệu đề thi', 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});