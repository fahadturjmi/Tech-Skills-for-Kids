/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Globe, 
  ShieldCheck, 
  Rocket, 
  Star, 
  Trophy, 
  LogOut, 
  ChevronLeft, 
  CheckCircle2, 
  Circle,
  PlayCircle,
  Award,
  User as UserIcon,
  Lock,
  BadgeCheck,
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  GraduationCap
} from 'lucide-react';
import { useDatabase } from './useDatabase';
import { UNITS } from './data';
import { Unit, Lesson, Activity } from './types';
import { cn } from './lib/utils';
import confetti from 'canvas-confetti';

export default function App() {
  const { user, loading, signup, login, logout, updateProgress, submitQuiz } = useDatabase();
  const [view, setView] = useState<'auth' | 'dashboard' | 'lesson' | 'quiz'>('auth');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Auto-redirect to dashboard if logged in
  React.useEffect(() => {
    if (user && view === 'auth') setView('dashboard');
    if (!user && view !== 'auth') setView('auth');
  }, [user, view]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Rocket className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header user={user} onLogout={logout} onGoHome={() => setView('dashboard')} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          {view === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthView onLogin={login} onSignup={signup} />
            </motion.div>
          )}
          
          {view === 'dashboard' && user && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DashboardView 
                user={user} 
                onSelectUnit={(unit) => {
                  setSelectedUnit(unit);
                  setView('lesson');
                  setSelectedLesson(unit.lessons[0]);
                }} 
              />
            </motion.div>
          )}

          {view === 'lesson' && user && selectedUnit && selectedLesson && (
            <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LessonView 
                unit={selectedUnit}
                lesson={selectedLesson}
                user={user}
                onNextLesson={(next) => setSelectedLesson(next)}
                onComplete={() => {
                  updateProgress(selectedLesson.id, selectedUnit.id, true);
                  const currentIndex = selectedUnit.lessons.findIndex(l => l.id === selectedLesson.id);
                  if (currentIndex < selectedUnit.lessons.length - 1) {
                    setSelectedLesson(selectedUnit.lessons[currentIndex + 1]);
                  } else {
                    setView('quiz');
                  }
                }}
                onBack={() => setView('dashboard')}
              />
            </motion.div>
          )}

          {view === 'quiz' && user && selectedUnit && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizView 
                unit={selectedUnit}
                onComplete={(score) => {
                  submitQuiz(selectedUnit.id, score);
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                  });
                  setView('dashboard');
                }}
                onBack={() => setView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function Header({ user, onLogout, onGoHome }: { user: any, onLogout: () => void, onGoHome: () => void, key?: string }) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-surface-container shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-primary leading-none">مدرسة ثنية الوداع</h1>
            <span className="text-xs text-on-surface-variant font-bold">المهارات الرقمية</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-on-surface">{user.fullName}</span>
              <span className="text-[10px] text-on-surface-variant">{user.grade}</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary-container/30 px-3 py-1.5 rounded-full border border-secondary/10">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="font-black text-secondary">{user.stars}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function AuthView({ onLogin, onSignup }: { onLogin: (u: string) => void, onSignup: (u: string, f: string, g: string) => void, key?: string }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('الصف الأول');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        onLogin(username);
      } else {
        onSignup(username, fullName, grade);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto mt-12"
    >
      <div className="bg-white rounded-xl shadow-2xl shadow-primary/5 p-8 border border-surface-container">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-container/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary animate-float">
            <Rocket className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-primary mb-2">
            {isLogin ? 'تسجيل الدخول' : 'حساب جديد'}
          </h2>
          <p className="text-on-surface-variant">مستعد لمغامرتك الرقمية؟</p>
          
          {isLogin && (
            <div className="mt-4 p-3 bg-secondary-container/20 border border-secondary/20 rounded-xl text-sm">
              <p className="text-secondary font-bold mb-1">بيانات الدخول التجريبية:</p>
              <div className="flex justify-center gap-4 text-on-surface">
                <button 
                  type="button"
                  onClick={() => setUsername('demo')}
                  className="hover:scale-105 transition-transform"
                >
                  اسم المستخدم: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold cursor-pointer border border-secondary/10">demo</code>
                </button>
                <span>كلمة المرور: <code className="bg-white px-2 py-0.5 rounded font-mono font-bold">123456</code></span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2">انقر على اسم المستخدم لتعبئته تلقائياً</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error/10 text-error text-sm p-3 rounded-lg border border-error/20 text-center font-bold">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant mr-1">اسم المستخدم</label>
            <div className="relative">
              <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-surface-container-low rounded-xl border-none focus:ring-4 focus:ring-primary/20 transition-all text-lg"
                placeholder="مثال: ahmad123"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant mr-1">الاسم الكامل</label>
                <div className="relative">
                  <BadgeCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input 
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 bg-surface-container-low rounded-xl border-none focus:ring-4 focus:ring-secondary/20 transition-all text-lg"
                    placeholder="ما هو اسمك الجميل؟"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant mr-1">المرحلة الدراسية</label>
                <select 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-4 bg-surface-container-low rounded-xl border-none focus:ring-4 focus:ring-secondary/20 transition-all text-lg appearance-none"
                >
                  <option>الصف الأول</option>
                  <option>الصف الثاني</option>
                  <option>الصف الثالث</option>
                  <option>الصف الرابع</option>
                  <option>الصف الخامس</option>
                  <option>الصف السادس</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant mr-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input 
                type="password"
                required
                className="w-full pr-12 pl-4 py-4 bg-surface-container-low rounded-xl border-none focus:ring-4 focus:ring-primary/20 transition-all text-lg"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-l from-primary to-primary-container text-white rounded-xl font-black text-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isLogin ? 'انطلاق!' : 'سجلني الآن'}
            <ChevronLeft className="w-6 h-6" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardView({ user, onSelectUnit }: { user: any, onSelectUnit: (u: Unit) => void, key?: string }) {
  const totalLessons = UNITS.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const completedCount = user.completedLessons.length;
  const overallProgress = Math.round((completedCount / totalLessons) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      {/* Hero Welcome */}
      <section className="relative bg-gradient-to-br from-primary to-primary-dim rounded-xl p-8 md:p-12 overflow-hidden shadow-xl shadow-primary/20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-grow text-white text-right">
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">مرحباً بك مجدداً يا {user.fullName.split(' ')[0]}! 🚀</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl">أنت تقوم بعمل رائع في تعلم المهارات الرقمية. استمر في التقدم لتصبح بطلاً رقمياً!</p>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-md">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold">إجمالي التقدم</span>
                <span className="font-black text-2xl">{overallProgress}%</span>
              </div>
              <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  className="h-full bg-tertiary-container rounded-full" 
                />
              </div>
              <p className="text-sm mt-3 opacity-80">لقد أكملت {completedCount} درساً من أصل {totalLessons}</p>
            </div>
          </div>
          <div className="flex-shrink-0 animate-float">
            <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Trophy className="w-24 h-24 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={BookOpen} label="الدروس المكتملة" value={completedCount} color="tertiary" />
        <StatCard icon={Star} label="إجمالي النجوم" value={user.stars} color="secondary" />
        <StatCard icon={Award} label="الأوسمة" value={Object.keys(user.quizScores).length} color="primary" />
      </section>

      {/* Units Grid */}
      <section className="space-y-6">
        <h3 className="text-2xl font-black text-on-surface flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          وحدات التعلم
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {UNITS.map((unit) => (
            <UnitCard 
              key={unit.id} 
              unit={unit} 
              user={user}
              onClick={() => onSelectUnit(unit)} 
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string, key?: string }) {
  const colors: any = {
    primary: "bg-primary-container/20 text-primary border-primary/10",
    secondary: "bg-secondary-container/20 text-secondary border-secondary/10",
    tertiary: "bg-tertiary-container/20 text-tertiary border-tertiary/10",
  };

  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm flex items-center gap-5 border", colors[color])}>
      <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", colors[color].split(' ')[0])}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-on-surface-variant text-sm font-bold">{label}</p>
        <p className="text-3xl font-black text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function UnitCard({ unit, user, onClick }: { unit: Unit, user: any, onClick: () => void, key?: string }) {
  const unitLessons = unit.lessons.map(l => l.id);
  const completedInUnit = user.completedLessons.filter((id: string) => unitLessons.includes(id)).length;
  const progress = Math.round((completedInUnit / unit.lessons.length) * 100);
  const isCompleted = progress === 100;

  const icons: any = {
    Monitor: Monitor,
    Globe: Globe,
    ShieldCheck: ShieldCheck,
  };
  const Icon = icons[unit.icon] || Monitor;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl p-8 shadow-lg shadow-primary/5 border border-surface-container relative overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 bg-primary-container/20 rounded-2xl flex items-center justify-center text-primary">
          <Icon className="w-10 h-10" />
        </div>
        {isCompleted && (
          <div className="bg-tertiary-container/30 text-tertiary p-1.5 rounded-full">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        )}
      </div>

      <h4 className="text-2xl font-black mb-3 text-on-surface">{unit.title}</h4>
      <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">{unit.description}</p>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-bold">
          <span className="text-on-surface-variant">التقدم</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary rounded-full" 
          />
        </div>
      </div>

      <button className="mt-8 w-full py-4 bg-surface-container-low text-primary font-black rounded-xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2">
        <span>{progress === 0 ? 'ابدأ التعلم' : progress === 100 ? 'مراجعة الوحدة' : 'واصل التعلم'}</span>
        <ChevronLeft className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

function LessonView({ unit, lesson, user, onNextLesson, onComplete, onBack }: { 
  unit: Unit, 
  lesson: Lesson, 
  user: any,
  onNextLesson: (l: Lesson) => void,
  onComplete: () => void,
  onBack: () => void,
  key?: string
}) {
  const [showActivity, setShowActivity] = useState(false);
  const [activityAnswered, setActivityAnswered] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleAnswer = (choiceId: string, isCorrect: boolean) => {
    if (activityAnswered) return;
    setSelectedChoice(choiceId);
    setActivityAnswered(true);
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5 rotate-180" />
          العودة للوحة التحكم
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-primary bg-primary-container/20 px-3 py-1 rounded-full">{unit.title}</span>
          <span className="text-xs font-bold text-on-surface-variant">الدرس {unit.lessons.indexOf(lesson) + 1} من {unit.lessons.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-surface-container overflow-hidden">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={lesson.imageUrl} alt={lesson.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h2 className="absolute bottom-8 right-8 text-3xl md:text-4xl font-black text-white">{lesson.title}</h2>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {!showActivity ? (
            <>
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-primary flex items-center gap-3">
                  <BookOpen className="w-7 h-7" />
                  الشرح المبسط
                </h3>
                <p className="text-xl text-on-surface leading-relaxed">{lesson.content}</p>
              </div>

              <div className="bg-surface-container-low p-8 rounded-xl border-r-8 border-secondary relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <h4 className="text-xl font-black text-secondary mb-4 flex items-center gap-3">
                  <PlayCircle className="w-6 h-6" />
                  مثال توضيحي
                </h4>
                <p className="text-lg text-on-surface-variant italic">{lesson.example}</p>
              </div>

              <button 
                onClick={() => setShowActivity(true)}
                className="w-full py-5 bg-primary text-white rounded-xl font-black text-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Gamepad2 className="w-7 h-7" />
                انتقل للنشاط التفاعلي
              </button>
            </>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-black text-secondary mb-2 flex items-center justify-center gap-3">
                  <Gamepad2 className="w-7 h-7" />
                  نشاط تفاعلي
                </h3>
                <p className="text-on-surface-variant">أجب على السؤال التالي لتكمل الدرس</p>
              </div>

              <div className="bg-surface-container-low p-8 rounded-xl border border-surface-container">
                <p className="text-2xl font-black text-on-surface mb-8 text-center">{lesson.activities[0].question}</p>
                <div className="grid grid-cols-1 gap-4">
                  {lesson.activities[0].choices?.map((choice) => (
                    <button
                      key={choice.id}
                      disabled={activityAnswered}
                      onClick={() => handleAnswer(choice.id, choice.isCorrect)}
                      className={cn(
                        "w-full p-6 rounded-xl border-2 text-right text-xl font-bold transition-all flex items-center justify-between",
                        !activityAnswered && "border-surface-container hover:border-primary hover:bg-white",
                        activityAnswered && choice.isCorrect && "border-tertiary bg-tertiary/10 text-tertiary",
                        activityAnswered && !choice.isCorrect && selectedChoice === choice.id && "border-error bg-error/10 text-error",
                        activityAnswered && !choice.isCorrect && selectedChoice !== choice.id && "border-surface-container opacity-50"
                      )}
                    >
                      <span>{choice.text}</span>
                      {activityAnswered && choice.isCorrect && <CheckCircle2 className="w-6 h-6" />}
                      {!activityAnswered && <Circle className="w-6 h-6 opacity-20" />}
                    </button>
                  ))}
                </div>
              </div>

              {activityAnswered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button 
                    onClick={onComplete}
                    className="w-full py-5 bg-tertiary text-white rounded-xl font-black text-xl shadow-lg shadow-tertiary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {selectedChoice && lesson.activities[0].choices?.find(c => c.id === selectedChoice)?.isCorrect ? 'أحسنت! أكمل المغامرة' : 'حاول مرة أخرى في الدرس القادم'}
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function QuizView({ unit, onComplete, onBack }: { unit: Unit, onComplete: (score: number) => void, onBack: () => void, key?: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (choiceId: string) => {
    setAnswers({ ...answers, [unit.quiz[currentQuestion].id]: choiceId });
    if (currentQuestion < unit.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const score = useMemo(() => {
    let correct = 0;
    unit.quiz.forEach(q => {
      const correctChoice = q.choices?.find(c => c.isCorrect);
      if (correctChoice && answers[q.id] === correctChoice.id) correct++;
    });
    return Math.round((correct / unit.quiz.length) * 100);
  }, [answers, unit.quiz]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      {!showResult ? (
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 border border-surface-container">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-primary">اختبار الوحدة</h2>
            <span className="text-sm font-bold text-on-surface-variant">سؤال {currentQuestion + 1} من {unit.quiz.length}</span>
          </div>

          <div className="space-y-8">
            <p className="text-2xl font-black text-on-surface text-center">{unit.quiz[currentQuestion].question}</p>
            <div className="grid grid-cols-1 gap-4">
              {unit.quiz[currentQuestion].choices?.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleAnswer(choice.id)}
                  className="w-full p-6 rounded-xl border-2 border-surface-container hover:border-primary hover:bg-primary/5 text-right text-xl font-bold transition-all"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl p-12 border border-surface-container text-center space-y-8">
          <div className="w-24 h-24 bg-secondary-container/30 rounded-full flex items-center justify-center mx-auto text-secondary">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-on-surface">نتيجتك النهائية</h2>
          <div className="text-6xl font-black text-primary">{score}%</div>
          <p className="text-xl text-on-surface-variant">
            {score >= 80 ? 'عمل رائع! أنت بطل حقيقي' : 'أداء جيد، يمكنك المحاولة مرة أخرى لتحسين نتيجتك'}
          </p>
          <button 
            onClick={() => onComplete(score)}
            className="w-full py-5 bg-primary text-white rounded-xl font-black text-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            العودة للوحة التحكم
          </button>
        </div>
      )}
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-surface-container py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-on-surface-variant font-bold text-sm">مدرسة ثنية الوداع الابتدائية - منصة المهارات الرقمية</p>
        <p className="text-on-surface-variant mt-2 font-medium">جميع الحقوق محفوظة 2026 لفهد الترجمي</p>
        <p className="text-[10px] text-on-surface-variant mt-2 opacity-60 uppercase tracking-widest">Thaniyat al-Wada' Digital Skills Portal © 2026</p>
      </div>
    </footer>
  );
}
