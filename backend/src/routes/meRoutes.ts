import { Router } from 'express';
import {
  getMyRecommendations,
  getMyTopicStats,
} from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

export const meRouter = Router();

meRouter.get('/topic-stats', authMiddleware, getMyTopicStats);
meRouter.get('/recommendations', authMiddleware, getMyRecommendations);
