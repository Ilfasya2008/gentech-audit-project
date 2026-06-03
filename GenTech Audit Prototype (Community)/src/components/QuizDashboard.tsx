import { Brain, Shield, Search, Home, ChevronRight, Clock, BarChart3 } from 'lucide-react';
import type { UserProgress } from '../App';
import { quizTypes } from '../data/quizData';
import logo from 'figma:asset/3b670beca6d9f65f8127efd31decabb8aaae9980.png';

interface QuizDashboardProps {
  userProgress: UserProgress;
  onSelectQuiz: (quizId: string) => void;
  onNavigateHome: () => void;
}

const iconMap = {
  brain: Brain,
  shield: Shield,
  search: Search,
};

const difficultyColors: Record<string, string> = {
  Pemula: 'bg-green-100 text-green-700',
  Menengah: 'bg-blue-100 text-blue-700',
  Lanjutan: 'bg-orange-100 text-orange-700',
};

export function QuizDashboard({ userProgress, onSelectQuiz, onNavigateHome }: QuizDashboardProps) {
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
                {completedCount}/{quizTypes.length}
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
        {quizTypes.map(quiz => {
          const Icon = iconMap[quiz.icon];
          const bestScore = userProgress.quizScores[quiz.id];
          const isDone = bestScore !== undefined;

          return (
            <button
              key={quiz.id}
              onClick={() => onSelectQuiz(quiz.id)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition text-left group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${quiz.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-primary font-bold text-lg">{quiz.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[quiz.difficulty]}`}
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
                      {quiz.questions.length} pertanyaan
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />~{quiz.estimatedMinutes} menit
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
