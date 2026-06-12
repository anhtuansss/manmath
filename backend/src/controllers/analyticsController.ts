import type { Request, Response } from 'express';
import { getUserTopicStats } from '../services/analyticsService';

export const getMyTopicStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const topicStats = await getUserTopicStats(req.user.userId);

    res.json({
      topicStats,
    });
  } catch (error) {
    console.error('Failed to load user topic stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
