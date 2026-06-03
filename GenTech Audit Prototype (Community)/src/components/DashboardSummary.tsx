import { Trophy, BookOpen, Brain, Flag, Search, Award, Lock, Home, ChevronRight, Zap } from 'lucide-react';
import { AppScreen, UserProgress } from '../App';

interface DashboardSummaryProps {
  progress: UserProgress;
  onNavigate: (screen: AppScreen) => void;
}

export function DashboardSummary({ progress, onNavigate }: DashboardSummaryProps) {
  const badges = [
    { 
      id: 'learning', 
      name: 'Learning Master', 
      description: 'Diberikan kepada pengguna yang telah menyelesaikan seluruh modul pembelajaran fundamental.',
      icon: BookOpen, 
      earned: progress.completedModules >= progress.totalModules && progress.totalModules > 0, 
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      currentValue: progress.completedModules,
      targetValue: progress.totalModules || 4,
      unit: 'Modul'
    },
    { 
      id: 'quiz', 
      name: 'Quiz Expert', 
      description: 'Diberikan kepada pengguna yang berhasil lulus kuis komprehensif dengan skor minimal 80%.',
      icon: Brain, 
      earned: progress.quizScore >= 80, 
      color: 'from-purple-500 to-fuchsia-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      currentValue: progress.quizScore,
      targetValue: 80,
      unit: 'Skor'
    },
    { 
      id: 'auditor', 
      name: 'Junior Auditor', 
      description: 'Diberikan kepada pengguna yang tajam dalam menemukan dan menandai minimal 5 transaksi mencurigakan.',
      icon: Flag, 
      earned: progress.transactionsFlagged >= 5, 
      color: 'from-orange-500 to-rose-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      currentValue: progress.transactionsFlagged,
      targetValue: 5,
      unit: 'Transaksi'
    },
    { 
      id: 'explorer', 
      name: 'Explorer', 
      description: 'Diberikan kepada pengguna yang tekun menelusuri dan menginspeksi minimal 5 transaksi blockchain.',
      icon: Search, 
      earned: progress.transactionsReviewed >= 5, 
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      currentValue: progress.transactionsReviewed,
      targetValue: 5,
      unit: 'Transaksi'
    },
  ];

  const earnedBadges = badges.filter(b => b.earned);
  const completionPercentage = Math.round((earnedBadges.length / badges.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Award className="w-8 h-8 text-orange-500" />
              Pencapaian & Lencana
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Kumpulkan seluruh lencana untuk membuktikan keahlian audit digital Anda
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all text-slate-600 font-semibold"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Dashboard</span>
          </button>
        </div>

        {/* Master Progress Card */}
        <div className="relative overflow-hidden bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/20 to-rose-400/20 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0 relative">
              {completionPercentage === 100 ? (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20" />
              ) : null}
              <Trophy className={`w-14 h-14 ${completionPercentage === 100 ? 'text-yellow-500' : 'text-slate-300'}`} />
            </div>
            
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Koleksi Lencana Anda</h2>
              <p className="text-slate-500 mb-6">
                Anda telah mengumpulkan <strong className="text-slate-800">{earnedBadges.length} dari {badges.length}</strong> lencana eksklusif.
                {completionPercentage === 100 ? ' Luar biasa! Anda adalah seorang Master Auditor!' : ' Terus selesaikan tantangan untuk membuka semuanya!'}
              </p>
              
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            // Calculate progress for the specific badge (cap at 100%)
            const badgeProgressPercent = Math.min((badge.currentValue / badge.targetValue) * 100, 100);
            
            return (
              <div 
                key={badge.id}
                className={`relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500 ${
                  badge.earned 
                    ? 'bg-white shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1' 
                    : 'bg-slate-50 border-2 border-dashed border-slate-200 opacity-80 grayscale-[20%]'
                }`}
              >
                {/* Background Glow for Earned */}
                {badge.earned && (
                  <div className={`absolute -right-20 -top-20 w-48 h-48 bg-gradient-to-br ${badge.color} opacity-10 rounded-full blur-3xl pointer-events-none`} />
                )}

                <div className="flex items-start gap-5 relative z-10">
                  {/* Badge Icon */}
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                      badge.earned ? `bg-gradient-to-br ${badge.color}` : 'bg-slate-200'
                  }`}>
                    {badge.earned ? (
                      <Icon className="w-10 h-10 text-white" />
                    ) : (
                      <Lock className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold text-xl ${badge.earned ? 'text-slate-800' : 'text-slate-500'}`}>
                        {badge.name}
                      </h3>
                      {badge.earned && (
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <Zap className="w-3 h-3" />
                          Diraih
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                      {badge.description}
                    </p>

                    {/* Individual Progress Bar */}
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className={badge.earned ? badge.textColor : 'text-slate-400 uppercase tracking-wider'}>
                          {badge.earned ? 'Misi Selesai' : 'Progress'}
                        </span>
                        <span className="text-slate-600">
                          {badge.currentValue} / {badge.targetValue} {badge.unit}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            badge.earned ? `bg-gradient-to-r ${badge.color}` : 'bg-slate-400'
                          }`}
                          style={{ width: `${badgeProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
