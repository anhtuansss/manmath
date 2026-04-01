const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    options: [String],
    correctAnswerIndex: Number,
    correctAnswer: String,
    statements: Array,
    explanation: String
});

const partSchema = new mongoose.Schema({
    type: { type: String, enum: ['multiple_choice', 'true_false', 'short_answer'], required: true },
    title: { type: String, required: true },
    questions: [questionSchema]
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    parts: [partSchema]
});

module.exports = mongoose.model('Exam', examSchema);