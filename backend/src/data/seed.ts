import { mockExams } from './mockExams';
import { disconnectPrisma, prisma } from '../lib/prisma';

async function main(): Promise<void> {
    // Xóa dữ liệu con trước để tránh lỗi khóa ngoại
    await prisma.question.deleteMany(); 
    await prisma.exam.deleteMany();

    for (const exam of mockExams) {
        await prisma.exam.create({
            data: {
                id: exam.id,
                title: exam.examTitle,
                description: exam.description,
                durationMinutes: exam.durationMinutes,
                subject: exam.subject,
                difficulty: exam.difficulty,
                year: exam.year,
                statusLabel: exam.statusLabel,
                questions: {
                    create: exam.questions.map((question, index) => ({
                        id: question.id,
                        order: index + 1,
                        question: question.question,
                        options: question.options,
                        correctAnswer: question.correctAnswer,
                    })),
                },
            },
        });
    }
    console.log(`Seeded ${mockExams.length} exams.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
