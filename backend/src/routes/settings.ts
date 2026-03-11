import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const updateSettingsSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  level: z.enum(['O Level', 'A Level', 'Both']).optional(),
  notifications: z.boolean().optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
});

router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        displayName: true,
        level: true,
        notifications: true,
        fontSize: true,
      },
    });

    res.json({ settings: user });
  } catch (err) {
    next(err);
  }
});

router.put('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateSettingsSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: body,
      select: {
        displayName: true,
        level: true,
        notifications: true,
        fontSize: true,
      },
    });

    res.json({ settings: user });
  } catch (err) {
    next(err);
  }
});

export default router;
