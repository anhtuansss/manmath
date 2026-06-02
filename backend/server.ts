import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { findExamById, getExamSummaries, mockExams } from './src/data/mockExams';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'ManMath API is running' });
});

app.get('/api/exams', (req: Request, res: Response) => {
  res.json(getExamSummaries());
});

app.get('/api/exams/:id', (req: Request, res: Response): void => {
  const exam = findExamById(req.params.id);

  if (!exam) {
    res.status(404).json({ message: 'Khong tim thay de thi' });
    return;
  }

  res.json({
    id: exam.id,
    examTitle: exam.examTitle,
    durationMinutes: exam.durationMinutes,
    questions: exam.questions,
  });
});

type SubmitBody = {
  examId?: string;
  answers?: Record<number, number>;
};

app.post('/api/exam/submit', (req: Request, res: Response): void => {
  const { examId, answers } = req.body as SubmitBody;

  if (!answers) {
    res.status(400).json({ message: 'Thieu du lieu cau tra loi' });
    return;
  }

  const exam = examId ? findExamById(examId) : mockExams[0];

  if (!exam) {
    res.status(404).json({ message: 'Khong tim thay de thi de cham diem' });
    return;
  }

  let correctCount = 0;

  for (const question of exam.questions) {
    const selectedOptionIndex = answers[question.id];
    const correctIndex = question.options.indexOf(question.correctAnswer);

    if (selectedOptionIndex === correctIndex) {
      correctCount++;
    }
  }

  const totalQuestions = exam.questions.length;
  const score = Math.round((correctCount / totalQuestions) * 10);

  res.json({
    correctCount,
    totalQuestions,
    score,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
