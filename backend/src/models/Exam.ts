import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
    id?: string;
    content: string;
    options?: string[];
    correctAnswerIndex?: number;
    correctAnswer?: string;
    statements?: any[];
    explanation?: string;
}

export interface IPart {
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    title: string;
    questions: IQuestion[];
}

export interface IExam extends Document {
    title: string;
    durationMinutes: number;
    parts: IPart[];
}

const questionSchema = new Schema<IQuestion>({
    id: String,
    content: { type: String, required: true },
    options: [String],
    correctAnswerIndex: Number,
    correctAnswer: String,
    statements: Array,
    explanation: String
});

const partSchema = new Schema<IPart>({
    type: { type: String, enum: ['multiple_choice', 'true_false', 'short_answer'], required: true },
    title: { type: String, required: true },
    questions: [questionSchema]
});

const examSchema = new Schema<IExam>({
    title: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    parts: [partSchema]
});

export default mongoose.model<IExam>('Exam', examSchema);