import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signToken, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(1, 'Display name is required').max(50),
  level: z.enum(['O Level', 'A Level', 'Both']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        displayName: body.displayName,
        level: body.level || 'Both',
      },
    });

    const token = signToken({ userId: user.id, email: user.email });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        notifications: user.notifications,
        fontSize: user.fontSize,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = signToken({ userId: user.id, email: user.email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        notifications: user.notifications,
        fontSize: user.fontSize,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        level: true,
        notifications: true,
        fontSize: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
