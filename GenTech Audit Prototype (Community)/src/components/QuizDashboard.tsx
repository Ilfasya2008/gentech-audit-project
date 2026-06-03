import { useEffect, useState } from 'react';
import { 
  Brain, 
  Shield, 
  Search, 
  Home, 
  ChevronRight, 
  Clock, 
  BarChart3, 
  Loader2, 
  BookOpen, 
  Award, 
  Zap, 
  Target, 
  Database, 
  TrendingUp, 
  Lock, 
  FileText, 
  Fingerprint 
} from 'lucide-react';
import type { UserProgress } from '../App';
import logo from 'figma:asset/3b670beca6d9f65f8127efd31decabb8aaae9980.png';

export interface ApiQuizType {
  id: number;
  title: string;
  description: string;
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  estimated_minutes: number;
  icon: string;
  color: string;
  questions_count: number;
}

interface QuizDashboardProps {
  userProgress: UserProgress;
  onSelectQuiz: (quizId: string) => void;
  onNavigateHome: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  shield: Shield,
  search: Search,
  book: BookOpen,
  award: Award,
  zap: Zap,
  target: Target,
  database: Database,
  trend: TrendingUp,
  lock: Lock,
  file: FileText,
  fingerprint: Fingerprint,
};

const difficultyColors: Record<string, string> = {
  Pemula: 'bg-green-100 text-green-700',
  Menengah: 'bg-blue-100 text-blue-700',
  Lanjutan: 'bg-orange-100 text-orange-700',
};

export function QuizDashboard({ userProgress, onSelectQuiz, onNavigateHome }: QuizDashboardProps) {
  const [quizzes, setQuizzes] = useState<ApiQuizType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/quizzes', {
      headers: { 'Accept': 'application/json' },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const activeQuizzes = data.data.filter((q: any) => q.is_active === true || q.is_active === 1 || q.is_active === '1');
          setQuizzes(activeQuizzes);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const completedCount = Object.keys(userProgress.quizScores).length;
  const avgScore =
    completedCount > 0
      ? Math.round(
          Object.values(userProgress.quizScores).reduce((a, b) => a + b, 0) / completedCount
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white border-b border-gray-200 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="GenTech Audit" className="w-10 h-10" />
            <div className="flex-1">
              <h1 className="text-primary text-xl font-bold">Pusat Kuis</h1>
              <p className="text-muted-foreground text-sm">Pilih jenis kuis sesuai topik yang ingin diuji</p>
            </div>
            <button
              onClick={onNavigateHome}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Kembali ke Dashboard"
            >
              <Home className="w-5 h-5 text-primary" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
              <p className="text-xs text-purple-600 uppercase font-medium mb-1">Kuis Diselesaikan</p>
              <p className="text-2xl font-bold text-purple-700">
                {completedCount}/{quizzes.length}
              </p>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
              <p className="text-xs text-indigo-600 uppercase font-medium mb-1">Rata-rata Skor</p>
              <p className="text-2xl font-bold text-indigo-700">{avgScore}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-sm text-gray-500">Memuat daftar kuis...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>Belum ada kuis tersedia.</p>
          </div>
        ) : (
          quizzes.map(quiz => {
            const Icon = iconMap[quiz.icon] ?? Brain;
            // User progress keys are stored as quiz DB id (as string)
            const progressKey = String(quiz.id);
            const bestScore = userProgress.quizScores[progressKey];
            const isDone = bestScore !== undefined;

            return (
              <button
                key={quiz.id}
                onClick={() => onSelectQuiz(String(quiz.id))}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition text-left group"
              >
                <div className="flex items-start gap-4">
                  {(() => {
                    const isHex = quiz.color?.startsWith('#');
                    const bgStyle = isHex ? { backgroundColor: quiz.color } : {};
                    const bgClass = isHex ? '' : `bg-gradient-to-br ${quiz.color || 'from-indigo-500 to-indigo-600'}`;
                    return (
                      <div
                        style={bgStyle}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${bgClass}`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    );
                  })()}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-primary font-bold text-lg">{quiz.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[quiz.difficulty] ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {quiz.difficulty}
                      </span>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          Skor terbaik: {bestScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{quiz.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {quiz.questions_count} pertanyaan
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />~{quiz.estimated_minutes} menit
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
