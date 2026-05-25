import { Trophy, BookOpen, Brain, Flag, TrendingUp, Award, Target, Zap, Home, FileText, Search } from 'lucide-react';
import { AppScreen, UserProgress } from '../App';

interface DashboardSummaryProps {
  progress: UserProgress;
  onNavigate: (screen: AppScreen) => void;
}

export function DashboardSummary({ progress, onNavigate }: DashboardSummaryProps) {
  const completionPercentage = Math.round((progress.completedModules / progress.totalModules) * 100);
  
  const badges = [
    { id: 'learning', name: 'Learning Master', icon: BookOpen, earned: progress.badges.includes('Learning Master'), color: 'from-blue-500 to-blue-600' },
    { id: 'quiz', name: 'Quiz Expert', icon: Brain, earned: progress.badges.includes('Quiz Expert'), color: 'from-purple-500 to-purple-600' },
    { id: 'auditor', name: 'Junior Auditor', icon: Flag, earned: progress.transactionsFlagged >= 3, color: 'from-orange-500 to-orange-600' },
    { id: 'explorer', name: 'Explorer', icon: Search, earned: progress.transactionsReviewed >= 5, color: 'from-green-500 to-green-600' },
  ];

  const earnedBadges = badges.filter(b => b.earned);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-2">Dashboard Ringkasan</h1>
              <p className="text-gray-600">
                Pantau progres pembelajaran dan pencapaian Anda
              </p>
            </div>
            <button
              onClick={() => onNavigate('learning')}
              className="p-2 bg-white rounded-lg hover:bg-gray-50 transition shadow-md"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-white mb-2">Selamat Datang Kembali! 👋</h2>
              <p className="text-blue-100 mb-6">
                Anda telah menyelesaikan {completionPercentage}% dari perjalanan pembelajaran
              </p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-blue-100 mb-2">
                  <span>Overall Progress</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="h-3 bg-blue-400 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-blue-100 mb-1">Level</div>
                  <div className="text-white">{progress.level}</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-blue-100 mb-1">Badges</div>
                  <div className="text-white">{earnedBadges.length}/{badges.length}</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-blue-100 mb-1">Modules</div>
                  <div className="text-white">{progress.completedModules}/{progress.totalModules}</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-blue-100 mb-1">Quiz Score</div>
                  <div className="text-white">{progress.quizScore}%</div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-gray-600 mb-1">Modul Selesai</div>
            <div className="text-gray-900">{progress.completedModules} dari {progress.totalModules}</div>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${(progress.completedModules / progress.totalModules) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              {progress.quizScore >= 80 && <TrendingUp className="w-5 h-5 text-green-500" />}
            </div>
            <div className="text-gray-600 mb-1">Skor Kuis</div>
            <div className="text-gray-900">{progress.quizScore}%</div>
            <div className={`mt-2 px-3 py-1 rounded-full text-center ${
              progress.quizScore >= 80 ? 'bg-green-100 text-green-700' :
              progress.quizScore >= 60 ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {progress.quizScore >= 80 ? 'Excellent' : progress.quizScore >= 60 ? 'Good' : 'Keep Learning'}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-gray-600 mb-1">Transaksi Diperiksa</div>
            <div className="text-gray-900">{progress.transactionsReviewed}</div>
            <div className="mt-2 text-gray-600">Total reviews</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-gray-600 mb-1">Transaksi Ditandai</div>
            <div className="text-gray-900">{progress.transactionsFlagged}</div>
            <div className="mt-2 text-gray-600">Audit findings</div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Pencapaian & Lencana
            </h2>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
              {earnedBadges.length}/{badges.length} Earned
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`relative rounded-2xl p-6 border-2 transition ${
                    badge.earned
                      ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  {badge.earned && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    badge.earned 
                      ? `bg-gradient-to-br ${badge.color}`
                      : 'bg-gray-300'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className={`mb-2 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                    {badge.name}
                  </h3>
                  
                  <div className={`${badge.earned ? 'text-green-600' : 'text-gray-400'}`}>
                    {badge.earned ? '✓ Earned' : 'Locked'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => onNavigate('learning')}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Lanjutkan Belajar</h3>
            <p className="text-gray-600 mb-3">
              Akses modul pembelajaran berikutnya
            </p>
            <div className="flex items-center gap-2 text-blue-600">
              <span>Mulai</span>
              <TrendingUp className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Uji Pemahaman</h3>
            <p className="text-gray-600 mb-3">
              Ikuti kuis untuk menguji pengetahuan
            </p>
            <div className="flex items-center gap-2 text-purple-600">
              <span>Mulai Quiz</span>
              <Target className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('explorer')}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Simulasi Audit</h3>
            <p className="text-gray-600 mb-3">
              Telusuri dan audit transaksi blockchain
            </p>
            <div className="flex items-center gap-2 text-green-600">
              <span>Explore</span>
              <Flag className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Jalur Pembelajaran
          </h2>

          <div className="space-y-4">
            <div className={`flex items-center gap-4 p-4 rounded-xl ${
              progress.completedModules > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress.completedModules > 0 ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {progress.completedModules > 0 ? (
                  <Target className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white">1</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className={progress.completedModules > 0 ? 'text-green-900' : 'text-blue-900'}>
                  Pelajari Materi Blockchain
                </h3>
                <p className={progress.completedModules > 0 ? 'text-green-700' : 'text-blue-700'}>
                  {progress.completedModules}/{progress.totalModules} modul selesai
                </p>
              </div>
              {progress.completedModules > 0 && (
                <div className="text-green-600">✓</div>
              )}
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-xl ${
              progress.quizScore > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress.quizScore > 0 ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {progress.quizScore > 0 ? (
                  <Target className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white">2</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className={progress.quizScore > 0 ? 'text-green-900' : 'text-gray-700'}>
                  Selesaikan Kuis
                </h3>
                <p className={progress.quizScore > 0 ? 'text-green-700' : 'text-gray-600'}>
                  {progress.quizScore > 0 ? `Skor: ${progress.quizScore}%` : 'Belum dikerjakan'}
                </p>
              </div>
              {progress.quizScore > 0 && (
                <div className="text-green-600">✓</div>
              )}
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-xl ${
              progress.transactionsReviewed > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress.transactionsReviewed > 0 ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {progress.transactionsReviewed > 0 ? (
                  <Target className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white">3</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className={progress.transactionsReviewed > 0 ? 'text-green-900' : 'text-gray-700'}>
                  Praktik Audit Digital
                </h3>
                <p className={progress.transactionsReviewed > 0 ? 'text-green-700' : 'text-gray-600'}>
                  {progress.transactionsReviewed > 0 
                    ? `${progress.transactionsReviewed} transaksi diperiksa, ${progress.transactionsFlagged} ditandai` 
                    : 'Belum dimulai'}
                </p>
              </div>
              {progress.transactionsReviewed > 0 && (
                <div className="text-green-600">✓</div>
              )}
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-xl ${
              progress.transactionsFlagged > 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress.transactionsFlagged > 0 ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {progress.transactionsFlagged > 0 ? (
                  <Target className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white">4</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className={progress.transactionsFlagged > 0 ? 'text-green-900' : 'text-gray-700'}>
                  Buat Laporan Audit
                </h3>
                <p className={progress.transactionsFlagged > 0 ? 'text-green-700' : 'text-gray-600'}>
                  {progress.transactionsFlagged > 0 
                    ? 'Laporan audit siap dibuat' 
                    : 'Tandai transaksi untuk membuat laporan'}
                </p>
              </div>
              {progress.transactionsFlagged > 0 && (
                <button
                  onClick={() => onNavigate('report')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Lihat Laporan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
