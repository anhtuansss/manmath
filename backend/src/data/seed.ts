import { mockExams } from './mockExams';
import { disconnectPrisma, prisma } from '../lib/prisma';

const topics = [
  { name: 'Ham so', slug: 'ham-so', order: 1 },
  { name: 'Nguyen ham - tich phan', slug: 'nguyen-ham-tich-phan', order: 2 },
  { name: 'Gioi han', slug: 'gioi-han', order: 3 },
  { name: 'Mu - logarit', slug: 'mu-logarit', order: 4 },
  { name: 'Xac suat - to hop', slug: 'xac-suat-to-hop', order: 5 },
  { name: 'Vector - toa do', slug: 'vector-toa-do', order: 6 },
  { name: 'Ma tran', slug: 'ma-tran', order: 7 },
  { name: 'Hinh hoc khong gian', slug: 'hinh-hoc-khong-gian', order: 8 },
];

const subtopics = [
  { name: 'Phuong trinh bac nhat', slug: 'phuong-trinh-bac-nhat', topicSlug: 'ham-so' },
  { name: 'Dao ham', slug: 'dao-ham', topicSlug: 'ham-so' },
  { name: 'Cuc tri', slug: 'cuc-tri', topicSlug: 'ham-so' },
  { name: 'Do thi ham so', slug: 'do-thi-ham-so', topicSlug: 'ham-so' },
  { name: 'Tap xac dinh', slug: 'tap-xac-dinh', topicSlug: 'ham-so' },
  { name: 'Don dieu', slug: 'don-dieu', topicSlug: 'ham-so' },
  { name: 'Tiem can', slug: 'tiem-can', topicSlug: 'ham-so' },
  { name: 'Can thuc co ban', slug: 'can-thuc-co-ban', topicSlug: 'ham-so' },
  { name: 'Phuong trinh mu', slug: 'phuong-trinh-mu', topicSlug: 'mu-logarit' },
  { name: 'Logarit co ban', slug: 'logarit-co-ban', topicSlug: 'mu-logarit' },
  { name: 'Phuong trinh logarit', slug: 'phuong-trinh-logarit', topicSlug: 'mu-logarit' },
  { name: 'Dao ham logarit', slug: 'dao-ham-logarit', topicSlug: 'mu-logarit' },
  { name: 'Tich phan co ban', slug: 'tich-phan-co-ban', topicSlug: 'nguyen-ham-tich-phan' },
  { name: 'Gioi han luong giac', slug: 'gioi-han-luong-giac', topicSlug: 'gioi-han' },
  { name: 'Gioi han vo cuc', slug: 'gioi-han-vo-cuc', topicSlug: 'gioi-han' },
  { name: 'Gioi han can thuc', slug: 'gioi-han-can-thuc', topicSlug: 'gioi-han' },
  { name: 'Xac suat co ban', slug: 'xac-suat-co-ban', topicSlug: 'xac-suat-to-hop' },
  { name: 'To hop co ban', slug: 'to-hop-co-ban', topicSlug: 'xac-suat-to-hop' },
  { name: 'Tich vo huong', slug: 'tich-vo-huong', topicSlug: 'vector-toa-do' },
  { name: 'Dinh thuc ma tran', slug: 'dinh-thuc-ma-tran', topicSlug: 'ma-tran' },
  { name: 'Goc va khoang cach', slug: 'goc-va-khoang-cach', topicSlug: 'hinh-hoc-khong-gian' },
];

export async function seedMockData(): Promise<void> {
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.subtopic.deleteMany();
  await prisma.topic.deleteMany();

  for (const topic of topics) {
    await prisma.topic.create({
      data: topic,
    });
  }

  for (const subtopic of subtopics) {
    await prisma.subtopic.create({
      data: {
        name: subtopic.name,
        slug: subtopic.slug,
        topic: {
          connect: {
            slug: subtopic.topicSlug,
          },
        },
      },
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
        source: exam.source,
        year: exam.year,
        statusLabel: exam.statusLabel,
        questions: {
          create: exam.questions.map((question, index) => ({
            id: question.id,
            order: index + 1,
            topic: {
              connect: { slug: question.topicSlug },
            },
            subtopic: question.subtopicSlug
              ? {
                  connect: { slug: question.subtopicSlug },
                }
              : undefined,
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
