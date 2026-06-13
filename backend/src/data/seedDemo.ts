import path from 'path';
import { disconnectPrisma } from '../lib/prisma';
import { importExamFromFile } from '../scripts/importExamFromJson';
import { seedMockData } from './seed';

const SAMPLE_IMPORT_PATH = './src/data/import/sample-exam.json';

async function main(): Promise<void> {
  await seedMockData();

  try {
    await importExamFromFile(SAMPLE_IMPORT_PATH);
  } catch (error) {
    const resolvedPath = path.resolve(process.cwd(), SAMPLE_IMPORT_PATH);
    throw new Error(
      `Seed mock thanh cong nhung import sample JSON that bai (${resolvedPath}): ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  console.log('Seed demo completed with mock exams and sample JSON exam.');
}

main()
  .catch((error) => {
    console.error('Seed demo failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
