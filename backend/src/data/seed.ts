import { mockExams } from './mockExams';
import { disconnectPrisma, prisma } from '../lib/prisma';

const topics = [
  { name: 'Ham so', slug: 'ham-so', order: 1 },
  { name: 'Tich phan', slug: 'tich-phan', order: 2 },
  { name: 'Gioi han', slug: 'gioi-han', order: 3 },
  { name: 'Mu va logarit', slug: 'logarit-mu', order: 4 },
  { name: 'Hinh hoc', slug: 'hinh-hoc', order: 5 },
  { name: 'Xac suat - to hop', slug: 'xac-suat-to-hop', order: 6 },
  { name: 'Vector - toa do', slug: 'vector-toa-do', order: 7 },
  { name: 'Ma tran', slug: 'ma-tran', order: 8 },
];

export async function seedMockData(): Promise<void> {
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.topic.deleteMany();

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

async function main(): Promise<void> {
  await seedMockData();
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await disconnectPrisma();
    });
}
