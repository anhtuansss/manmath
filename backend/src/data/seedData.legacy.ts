import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const seedProblems: Prisma.MathProblemCreateManyInput[] = [
  {
    question: 'Nghiá»‡m cá»§a phÆ°Æ¡ng trÃ¬nh 2x - 4 = 0 lÃ :',
    choice: ['A. x = 2', 'B. x = 4', 'C. x = 0', 'D. x = 1'],
    answer: 'A. x = 2',
  },
  {
    question: 'Äáº¡o hÃ m cá»§a hÃ m sá»‘ y = x^3 lÃ :',
    choice: ["A. y' = 3x", "B. y' = 3x^2", "C. y' = x^2", "D. y' = 2x^3"],
    answer: "B. y' = 3x^2",
  },
  {
    question: 'Thá»ƒ tÃ­ch khá»‘i láº­p phÆ°Æ¡ng cÃ³ cáº¡nh a báº±ng:',
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
