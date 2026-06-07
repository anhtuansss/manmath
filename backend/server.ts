/**
 * Mục đích:
 * Điểm khởi động Express API cho MVP ManMath.
 *
 * Luồng dữ liệu:
 * server.ts chỉ cấu hình app, middleware và mount API routes.
 * Logic xử lý request nằm trong controllers, business logic nằm trong services.
 *
 * File liên quan:
 * backend/src/routes/examRoutes.ts
 * backend/src/controllers/examController.ts
 * backend/src/services/examService.ts
 */
import express from 'express';
import cors from 'cors';
import { examRouter } from './src/routes/examRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', examRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});