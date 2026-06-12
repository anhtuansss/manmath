import { prisma } from '../lib/prisma';
import type { TopicStatDto } from '../types/exam';

type AnswerTopicRecord = {
  questionId: number;
  isCorrect: boolean;
};

type TopicStatAccumulator = {
  topicId: string | null;
  topicName: string;
  topicSlug: string | null;
  correct: number;
  total: number;
};

export const getUserTopicStats = async (
  userId: string,
): Promise<TopicStatDto[]> => {
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
    },
    select: {
      answers: {
        select: {
          questionId: true,
          isCorrect: true,
        },
      },
    },
  });

  const answerRecords: AnswerTopicRecord[] = attempts.flatMap(
    (attempt) => attempt.answers,
  );

  if (answerRecords.length === 0) {
    return [];
  }

  const questionIds = Array.from(
    new Set(answerRecords.map((answer) => answer.questionId)),
  );

  const questions = await prisma.question.findMany({
    where: {
      id: {
        in: questionIds,
      },
    },
    select: {
      id: true,
      topic: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  const topicByQuestionId = new Map(
    questions.map((question) => [question.id, question.topic]),
  );

  const topicStatMap = new Map<string, TopicStatAccumulator>();

  for (const answer of answerRecords) {
    const topic = topicByQuestionId.get(answer.questionId);
    const topicKey = topic?.id ?? 'uncategorized';
    const existingStat = topicStatMap.get(topicKey);

    if (existingStat) {
      existingStat.total += 1;

      if (answer.isCorrect) {
        existingStat.correct += 1;
      }

      continue;
    }

    topicStatMap.set(topicKey, {
      topicId: topic?.id ?? null,
      topicName: topic?.name ?? 'Chưa phân loại',
      topicSlug: topic?.slug ?? null,
      correct: answer.isCorrect ? 1 : 0,
      total: 1,
    });
  }

  return Array.from(topicStatMap.values())
    .map((topicStat) => ({
      ...topicStat,
      accuracy:
        topicStat.total > 0
          ? Math.round((topicStat.correct / topicStat.total) * 100)
          : 0,
    }))
    .sort((a, b) => {
      if (a.accuracy !== b.accuracy) {
        return a.accuracy - b.accuracy;
      }

      if (a.total !== b.total) {
        return b.total - a.total;
      }

      return a.topicName.localeCompare(b.topicName, 'vi');
    });
};
