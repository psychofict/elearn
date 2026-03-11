import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get all completed lessons for the authenticated user
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { userId: req.user!.userId },
      orderBy: { completedAt: 'desc' },
    });

    res.json({
      completedLessons: progress.map(p => p.lessonId),
      recentActivity: progress.slice(0, 20).map(p => ({
        lessonId: p.lessonId,
        subjectId: p.subjectId,
        subject: p.subjectName,
        lesson: p.lessonTitle,
        timestamp: p.completedAt.getTime(),
      })),
      totalCompleted: progress.length,
    });
  } catch (err) {
    next(err);
  }
});

const completeSchema = z.object({
  subjectId: z.string().min(1),
  subjectName: z.string().min(1),
  lessonTitle: z.string().min(1),
});

// Mark a lesson as complete
router.post('/:lessonId/complete', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;
    const body = completeSchema.parse(req.body);

    const existing = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId: req.user!.userId, lessonId } },
    });

    if (existing) {
      res.json({ message: 'Already completed', progress: existing });
      return;
    }

    const progress = await prisma.progress.create({
      data: {
        userId: req.user!.userId,
        lessonId,
        subjectId: body.subjectId,
        subjectName: body.subjectName,
        lessonTitle: body.lessonTitle,
      },
    });

    res.status(201).json({ message: 'Lesson completed', progress });
  } catch (err) {
    next(err);
  }
});

// Uncomplete a lesson
router.delete('/:lessonId/complete', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;

    await prisma.progress.deleteMany({
      where: { userId: req.user!.userId, lessonId },
    });

    res.json({ message: 'Lesson unmarked' });
  } catch (err) {
    next(err);
  }
});

// Reset all progress
router.delete('/reset', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.progress.deleteMany({
      where: { userId: req.user!.userId },
    });

    res.json({ message: 'All progress reset' });
  } catch (err) {
    next(err);
  }
});

export default router;
