import { mockExams } from './mockExams';
import { disconnectPrisma, prisma } from '../lib/prisma';

const topics = [
  { name: 'Hàm số', slug: 'ham-so', order: 1 },
  { name: 'Tích phân', slug: 'tich-phan', order: 2 },
  { name: 'Giới hạn', slug: 'gioi-han', order: 3 },
  { name: 'Mũ và logarit', slug: 'logarit-mu', order: 4 },
  { name: 'Hình học', slug: 'hinh-hoc', order: 5 },
  { name: 'Xác suất - tổ hợp', slug: 'xac-suat-to-hop', order: 6 },
  { name: 'Vector - tọa độ', slug: 'vector-toa-do', order: 7 },
  { name: 'Ma trận', slug: 'ma-tran', order: 8 },
];

async function main(): Promise<void> {
    // Xóa dữ liệu con trước để tránh lỗi khóa ngoại
    await prisma.attemptAnswer.deleteMany();
    await prisma.attempt.deleteMany();
    await prisma.question.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.topic.deleteMany();

    // Tạo chủ đề
    for (const topic of topics) {
    await prisma.topic.create({
        data: topic,
    });
    }

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
                        topic: {
                            connect: { slug: question.topicSlug },
                        },
                        question: question.question,
                        imageUrl: question.imageUrl ?? null,
                        options: question.options,
                        optionImageUrls: question.optionImageUrls ?? [],
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
