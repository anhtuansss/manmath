import { Router } from 'express';
import { getMyTopicStats } from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/authMiddleware';

export const meRouter = Router();

meRouter.get('/topic-stats', authMiddleware, getMyTopicStats);
