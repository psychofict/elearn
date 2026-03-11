import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // Get all progress for the user
    const progress = await prisma.progress.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    // Compute subject-level stats
    const subjectMap = new Map<string, { subjectId: string; subjectName: string; count: number }>();
    for (const p of progress) {
      const existing = subjectMap.get(p.subjectId);
      if (existing) {
        existing.count++;
      } else {
        subjectMap.set(p.subjectId, {
          subjectId: p.subjectId,
          subjectName: p.subjectName,
          count: 1,
        });
      }
    }

    // Compute streak (consecutive days with completions)
    const daySet = new Set<string>();
    for (const p of progress) {
      daySet.add(p.completedAt.toISOString().split('T')[0]);
    }
    const sortedDays = [...daySet].sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sortedDays.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (sortedDays[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    // Recent activity (last 20)
    const recentActivity = progress.slice(0, 20).map(p => ({
      lessonId: p.lessonId,
      subjectId: p.subjectId,
      subject: p.subjectName,
      lesson: p.lessonTitle,
      timestamp: p.completedAt.getTime(),
    }));

    // Completions by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentProgress = progress.filter(p => p.completedAt >= thirtyDaysAgo);
    const dailyCounts: Record<string, number> = {};
    for (const p of recentProgress) {
      const day = p.completedAt.toISOString().split('T')[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }

    res.json({
      totalCompleted: progress.length,
      streak,
      subjectStats: [...subjectMap.values()],
      recentActivity,
      dailyCounts,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
