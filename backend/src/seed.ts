import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding eLearn database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@elearn.co.zw' },
    update: {},
    create: {
      email: 'demo@elearn.co.zw',
      password: hashedPassword,
      displayName: 'Demo Student',
      level: 'Both',
    },
  });

  // Add some demo progress
  const demoLessons = [
    { lessonId: 'o-math-1', subjectId: 'o-math', subjectName: 'Mathematics', lessonTitle: 'Number Systems & Operations' },
    { lessonId: 'o-math-2', subjectId: 'o-math', subjectName: 'Mathematics', lessonTitle: 'Algebraic Expressions' },
    { lessonId: 'o-eng-1', subjectId: 'o-eng', subjectName: 'English Language', lessonTitle: 'Essay Writing Techniques' },
    { lessonId: 'o-sci-1', subjectId: 'o-sci', subjectName: 'Combined Science', lessonTitle: 'Cells & Organisation' },
    { lessonId: 'o-hist-1', subjectId: 'o-hist', subjectName: 'History', lessonTitle: 'Pre-Colonial Zimbabwe' },
  ];

  for (const lesson of demoLessons) {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: lesson.lessonId } },
      update: {},
      create: {
        userId: user.id,
        ...lesson,
      },
    });
  }

  console.log(`Created demo user: demo@elearn.co.zw / demo123`);
  console.log(`Added ${demoLessons.length} demo progress entries`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
