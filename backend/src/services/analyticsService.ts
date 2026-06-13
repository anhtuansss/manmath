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

export type WeakTopicRecommendationDto = TopicStatDto & {
  reason: string;
};

export type RecommendedExamDto = {
  examId: string;
  title: string;
  durationMinutes: number;
  matchedWeakTopicCount: number;
  matchedWeakQuestionCount: number;
  reason: string;
};

export type UserRecommendationsDto = {
  weakTopics: WeakTopicRecommendationDto[];
  recommendedExams: RecommendedExamDto[];
};

const MAX_WEAK_TOPICS = 3;
const MAX_RECOMMENDED_EXAMS = 3;

const buildWeakTopicReason = (topicStat: TopicStatDto): string => {
  if (topicStat.accuracy < 40) {
    return 'Tỷ lệ đúng còn thấp, nên ôn lại công thức nền tảng và làm thêm bài cùng chuyên đề.';
  }

  if (topicStat.accuracy < 70) {
    return 'Chuyên đề này chưa ổn định, nên luyện thêm vài đề có nhiều câu cùng dạng.';
  }

  return 'Chuyên đề này chưa thực sự chắc chắn, nên xem lại để giữ độ ổn định.';
};

const buildRecommendationReason = (
  matchedWeakTopicCount: number,
  matchedWeakQuestionCount: number,
): string => {
  if (matchedWeakQuestionCount >= 4) {
    return 'Đề này có nhiều câu bám đúng các chuyên đề bạn đang yếu.';
  }

  if (matchedWeakTopicCount >= 2) {
    return 'Đề này phủ được nhiều chuyên đề bạn cần ôn lại.';
  }

  return 'Đề này có ít nhất một nhóm câu phù hợp để bạn luyện lại phần còn yếu.';
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

export const getUserRecommendations = async (
  userId: string,
): Promise<UserRecommendationsDto> => {
  const topicStats = await getUserTopicStats(userId);
  const weakTopics = topicStats
    .filter((topicStat) => topicStat.total > 0)
    .slice(0, MAX_WEAK_TOPICS)
    .map((topicStat) => ({
      ...topicStat,
      reason: buildWeakTopicReason(topicStat),
    }));

  const exams = await prisma.exam.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      durationMinutes: true,
      questions: {
        select: {
          topicId: true,
        },
      },
    },
  });

  if (weakTopics.length === 0) {
    return {
      weakTopics: [],
      recommendedExams: exams.slice(0, MAX_RECOMMENDED_EXAMS).map((exam) => ({
        examId: exam.id,
        title: exam.title,
        durationMinutes: exam.durationMinutes,
        matchedWeakTopicCount: 0,
        matchedWeakQuestionCount: 0,
        reason: 'Bạn chưa có dữ liệu luyện tập, hãy bắt đầu với đề này.',
      })),
    };
  }

  const weakTopicIds = new Set(
    weakTopics
      .map((topicStat) => topicStat.topicId)
      .filter((topicId): topicId is string => topicId !== null),
  );

  const rankedExams = exams
    .map((exam) => {
      const matchedTopicIds = new Set<string>();
      let matchedWeakQuestionCount = 0;

      for (const question of exam.questions) {
        if (!question.topicId || !weakTopicIds.has(question.topicId)) {
          continue;
        }

        matchedWeakQuestionCount += 1;
        matchedTopicIds.add(question.topicId);
      }

      return {
        examId: exam.id,
        title: exam.title,
        durationMinutes: exam.durationMinutes,
        matchedWeakTopicCount: matchedTopicIds.size,
        matchedWeakQuestionCount,
      };
    })
    .filter((exam) => exam.matchedWeakQuestionCount > 0)
    .sort((a, b) => {
      if (a.matchedWeakTopicCount !== b.matchedWeakTopicCount) {
        return b.matchedWeakTopicCount - a.matchedWeakTopicCount;
      }

      if (a.matchedWeakQuestionCount !== b.matchedWeakQuestionCount) {
        return b.matchedWeakQuestionCount - a.matchedWeakQuestionCount;
      }

      if (a.durationMinutes !== b.durationMinutes) {
        return a.durationMinutes - b.durationMinutes;
      }

      return a.title.localeCompare(b.title, 'vi');
    })
    .slice(0, MAX_RECOMMENDED_EXAMS)
    .map((exam) => ({
      ...exam,
      reason: buildRecommendationReason(
        exam.matchedWeakTopicCount,
        exam.matchedWeakQuestionCount,
      ),
    }));

  if (rankedExams.length > 0) {
    return {
      weakTopics,
      recommendedExams: rankedExams,
    };
  }

  return {
    weakTopics,
    recommendedExams: exams.slice(0, MAX_RECOMMENDED_EXAMS).map((exam) => ({
      examId: exam.id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      matchedWeakTopicCount: 0,
      matchedWeakQuestionCount: 0,
      reason: 'Chưa tìm thấy đề khớp rõ chuyên đề yếu, hãy bắt đầu với đề này để tạo thêm dữ liệu.',
    })),
  };
};
