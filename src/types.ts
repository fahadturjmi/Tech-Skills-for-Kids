
export type User = {
  id: string;
  username: string;
  fullName: string;
  grade: string;
  progress: Record<string, number>; // unitId -> percentage
  completedLessons: string[]; // lessonIds
  quizScores: Record<string, number>; // unitId -> score
  stars: number;
};

export type Choice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Activity = {
  id: string;
  type: 'mcq' | 'matching';
  question: string;
  choices?: Choice[];
  pairs?: { left: string; right: string }[];
};

export type Lesson = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  example: string;
  activities: Activity[];
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  quiz: Activity[];
};
