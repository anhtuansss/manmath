const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Exam = require('./src/models/Exam');

dotenv.config({ path: '../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ManMath API is running' });
});

// Lấy danh sách đề thi
app.get('/api/exams', async (req, res) => {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu đề thi', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));