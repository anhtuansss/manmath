import { Router } from 'express';
import {
  getMyProgress,
  getMyRecommendations,
  getMyTopicStats,
} from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

export const meRouter = Router();

meRouter.get('/topic-stats', authMiddleware, getMyTopicStats);
meRouter.get('/recommendations', authMiddleware, getMyRecommendations);
meRouter.get('/progress', authMiddleware, getMyProgress);
