import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const seedProblems: Prisma.MathProblemCreateManyInput[] = [
  {
    question: 'Nghiệm của phương trình 2x - 4 = 0 là:',
    choice: ['A. x = 2', 'B. x = 4', 'C. x = 0', 'D. x = 1'],
    answer: 'A. x = 2',
  },
  {
    question: 'Đạo hàm của hàm số y = x^3 là:',
    choice: ["A. y' = 3x", "B. y' = 3x^2", "C. y' = x^2", "D. y' = 2x^3"],
    answer: "B. y' = 3x^2",
  },
  {
    question: 'Thể tích khối lập phương có cạnh a bằng:',
    choice: ['A. a^2', 'B. 3a', 'C. a^3', 'D. a^3 / 3'],
    answer: 'C. a^3',
  },
];

async function main(): Promise<void> {
  await prisma.mathProblem.deleteMany();
  await prisma.mathProblem.createMany({
    data: seedProblems,
  });

  console.log(`Seeded ${seedProblems.length} math problems.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
