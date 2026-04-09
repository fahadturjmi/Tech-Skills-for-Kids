import { useState, useEffect } from 'react';
import { User } from './types';

const STORAGE_KEY = 'thaniyat_alwada_db';

export function useDatabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let data = saved ? JSON.parse(saved) : { users: {} };
    
    // Seed demo user if not exists
    if (!data.users['demo']) {
      data.users['demo'] = {
        id: 'demo',
        username: 'demo',
        fullName: 'طالب تجريبي',
        grade: 'الصف الرابع',
        progress: {},
        completedLessons: [],
        quizScores: {},
        stars: 150,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    const sessionUser = sessionStorage.getItem('current_user_id');
    if (sessionUser && data.users[sessionUser]) {
      setUser(data.users[sessionUser]);
    }
    setLoading(false);
  }, []);

  const saveToStorage = (allUsers: Record<string, User>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users: allUsers }));
  };

  const signup = (username: string, fullName: string, grade: string) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : { users: {} };
    
    if (data.users[username]) {
      throw new Error('اسم المستخدم موجود مسبقاً');
    }

    const newUser: User = {
      id: username,
      username,
      fullName,
      grade,
      progress: {},
      completedLessons: [],
      quizScores: {},
      stars: 0,
    };

    data.users[username] = newUser;
    saveToStorage(data.users);
    setUser(newUser);
    sessionStorage.setItem('current_user_id', username);
  };

  const login = (username: string) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : { users: {} };
    
    if (!data.users[username]) {
      throw new Error('اسم المستخدم غير موجود');
    }

    setUser(data.users[username]);
    sessionStorage.setItem('current_user_id', username);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('current_user_id');
  };

  const updateProgress = (lessonId: string, unitId: string, isCompleted: boolean) => {
    if (!user) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : { users: {} };
    const currentUser = data.users[user.id];

    if (isCompleted && !currentUser.completedLessons.includes(lessonId)) {
      currentUser.completedLessons.push(lessonId);
      currentUser.stars += 10;
    }

    // Calculate unit progress
    // This is a simplified calculation
    const unitLessons = currentUser.completedLessons.filter((id: string) => id.startsWith(unitId.replace('unit-', 'l')));
    // For now, let's just update the user state and storage
    
    data.users[user.id] = currentUser;
    saveToStorage(data.users);
    setUser({ ...currentUser });
  };

  const submitQuiz = (unitId: string, score: number) => {
    if (!user) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : { users: {} };
    const currentUser = data.users[user.id];

    currentUser.quizScores[unitId] = Math.max(currentUser.quizScores[unitId] || 0, score);
    if (score >= 80) currentUser.stars += 50;

    data.users[user.id] = currentUser;
    saveToStorage(data.users);
    setUser({ ...currentUser });
  };

  return { user, loading, signup, login, logout, updateProgress, submitQuiz };
}
