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

// Lấy danh sách đề thi
app.get('/api/exams', async (req: Request, res: Response): Promise<void> => {
    try {
        const exams = await prisma.exam.findMany(); 
        res.json(exams);
    } catch (error: any) {
        res.status(500).json({ 
            message: 'Lỗi server khi lấy dữ liệu đề thi', 
            error: error.message 
        });
    }
});
