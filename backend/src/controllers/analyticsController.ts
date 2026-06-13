import type { Request, Response } from 'express';
import {
  getUserProgress,
  getUserRecommendations,
  getUserTopicStats,
} from '../services/analyticsService';

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

export const getMyRecommendations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const recommendations = await getUserRecommendations(req.user.userId);

    res.json(recommendations);
  } catch (error) {
    console.error('Failed to load user recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyProgress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const progress = await getUserProgress(req.user.userId);

    res.json(progress);
  } catch (error) {
    console.error('Failed to load user progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
