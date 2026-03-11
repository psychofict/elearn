export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string[];
  objectives: string[];
}

export interface Subject {
  id: string;
  name: string;
  totalLessons: number;
  lessons: Lesson[];
}

export interface SubjectsByLevel {
  [level: string]: Subject[];
}

export interface Activity {
  subject: string;
  lesson: string;
  timestamp: number;
  lessonId: string;
}

export interface UserProgress {
  completedLessons: string[];
  recentActivity: Activity[];
  streak: number;
  lastStudyDate: string;
  totalTimeMinutes: number;
}

export interface UserSettings {
  displayName: string;
  level: 'O Level' | 'A Level' | 'Both';
  notifications: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface Stats {
  totalSubjects: number;
  totalLessons: number;
  completedLessons: number;
  averageProgress: number;
  streakDays: number;
  totalTimeMinutes: number;
}
