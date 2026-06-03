import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Brain, Search, FileText, TrendingUp, Award, LogOut, AlertTriangle, X, Settings } from 'lucide-react';
import type { AppScreen, UserProgress } from '../App';
import { clearCurrentUserSession, getCurrentUserName } from '../lib/userProgress';
import SettingsModal from './SettingsModal';

interface DashboardProps {
  navigate: (screen: AppScreen) => void;
  userProgress: UserProgress;
  onTotalModulesLoaded: (count: number) => void;
}

export default function Dashboard({ navigate, userProgress, onTotalModulesLoaded }: DashboardProps) {
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/modules')
      .then(res => onTotalModulesLoaded(res.data.data?.length ?? 0))
      .catch(() => {});

    // Fetch total quiz count from API (now source of truth)
    axios
      .get('http://localhost:8000/api/quizzes')
      .then(res => setTotalQuizzes(res.data.data?.length ?? 0))
      .catch(() => {});
  }, [onTotalModulesLoaded]);

  const totalModules = userProgress.totalModules || 1;
  const completedModules = userProgress.completedModules || 0;
  const quizzesCompleted = Object.keys(userProgress.quizScores ?? {}).length;
  
  // Fungsi Logout
  const handleLogout = () => {
    clearCurrentUserSession(); 
    window.location.href = '/';
  };

  const menuItems = [
    {
      icon: BookOpen,
      title: 'Pelajaran',
      description: 'Materi blockchain & audit digital',
      screen: 'learning' as AppScreen,
      color: 'from-blue-500 to-blue-600',
      progressValue: userProgress.completedModules,
      progressText: `${completedModules}/${totalModules} Selesai`,
      progressPercent: (completedModules / totalModules) * 100
    },
    {
      icon: Brain,
      title: 'Kuis',
      description: 'Uji pemahaman Anda',
      screen: 'quiz' as AppScreen,
      color: 'from-purple-500 to-purple-600',
      progressValue: quizzesCompleted,
      progressText: `${quizzesCompleted}/${totalQuizzes} kuis · ${userProgress.quizScore || 0}%`,
      progressPercent: (quizzesCompleted / totalQuizzes) * 100
    },
    {
      icon: Search,
      title: 'Telusuri Transaksi',
      description: 'Simulasi audit blockchain',
      screen: 'explorer' as AppScreen,
      color: 'from-pink-500 to-pink-600',
      progressValue: userProgress.transactionsReviewed,
      progressText: `${userProgress.transactionsReviewed || 0} Diperiksa`,
      progressPercent: Math.min((userProgress.transactionsReviewed || 0) * 10, 100)
    },
    {
      icon: FileText,
      title: 'Laporan Audit',
      description: 'Lihat laporan hasil audit',
      screen: 'report' as AppScreen,
      color: 'from-green-500 to-green-600',
      progressValue: userProgress.transactionsFlagged,
      progressText: `${userProgress.transactionsFlagged || 0} Ditandai`,
      progressPercent: Math.min((userProgress.transactionsFlagged || 0) * 20, 100)
    },
    {
      icon: TrendingUp,
      title: 'Pencapaian & Lencana',
      description: 'Koleksi lencana dan progress pencapaian Anda',
      screen: 'summary' as AppScreen,
      color: 'from-orange-500 to-orange-600',
      progressValue: userProgress.badges ? userProgress.badges.length : 0,
      progressText: `${userProgress.badges ? userProgress.badges.length : 0} Badges`,
      progressPercent: Math.min((userProgress.badges ? userProgress.badges.length : 0) * 25, 100)
    }
  ];
  // Calculate XP Progress
  const xp = userProgress.xp || 0;
  let nextLevelXp = 100;
  let currentLevelBaseXp = 0;
  if (xp >= 1000) { nextLevelXp = 1000; currentLevelBaseXp = 1000; }
  else if (xp >= 500) { nextLevelXp = 1000; currentLevelBaseXp = 500; }
  else if (xp >= 250) { nextLevelXp = 500; currentLevelBaseXp = 250; }
  else if (xp >= 100) { nextLevelXp = 250; currentLevelBaseXp = 100; }

  const xpProgressPercent = xp >= 1000 ? 100 : ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden bg-slate-50">
      
      {/* Dynamic Mesh Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-blue-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-indigo-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header Section with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12 mt-4"
        >
          {/* TOMBOL LOGOUT */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 px-4 py-2.5 rounded-full shadow-sm hover:bg-slate-50 hover:shadow-md transition-all font-bold text-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Pengaturan</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-red-100 text-red-500 px-5 py-2.5 rounded-full shadow-sm hover:bg-red-50 hover:shadow-md transition-all font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </motion.button>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-2 mb-6"
            >
              <div className="inline-flex items-center gap-3 bg-white/90 border border-slate-100 rounded-full px-6 py-2.5 shadow-sm">
                <Award className="w-6 h-6 text-yellow-500 drop-shadow-sm" />
                <span className="text-slate-800 font-bold tracking-wide text-lg">Level {userProgress.level || 1}</span>
              </div>
              <div className="flex flex-col items-center w-64 mt-1">
                <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                  <span>{xp} XP</span>
                  <span>{xp >= 1000 ? 'Max Level' : `${nextLevelXp} XP`}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${xpProgressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
            >
              Halo, {getCurrentUserName() || 'Auditor'}!
            </motion.h1>
            
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-500 font-medium max-w-2xl"
            >
              Selamat datang di Dashboard GenTech Audit. Pilih menu di bawah untuk melanjutkan pembelajaran blockchain & simulasi audit digital Anda hari ini.
            </motion.p>
          </div>
        </motion.div>

        {/* MODAL LOGOUT */}
        <AnimatePresence>
          {isLogoutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLogoutModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/50 overflow-hidden text-center"
              >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />
                
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
                <p className="text-slate-500 mb-8 font-medium text-sm px-2">
                  Apakah Anda yakin ingin keluar dari sesi simulasi ini? Progres terakhir Anda akan tetap tersimpan.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/30 transition-all active:scale-95"
                  >
                    <LogOut className="w-5 h-5" />
                    Ya, Keluar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL SETTINGS */}
        <SettingsModal 
          isOpen={isSettingsModalOpen} 
          onClose={() => setIsSettingsModalOpen(false)} 
        />

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Modul Selesai</p>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">{completedModules}/{totalModules}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skor Kuis</p>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
              {quizzesCompleted}/{totalQuizzes}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">Rata-rata {userProgress.quizScore || 0}%</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Transaksi Ditandai</p>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">{userProgress.transactionsFlagged || 0}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Badges</p>
            <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">{userProgress.badges ? userProgress.badges.length : 0}</p>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.screen)}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 text-left group flex flex-col h-full relative overflow-hidden"
              >
                {/* Decorative background shape */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>

                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-extrabold text-slate-800 mb-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-8 flex-grow leading-relaxed">{item.description}</p>
                
                {(item.progressValue > 0 || item.progressPercent > 0) && (
                  <div className="w-full mt-auto pt-5 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                      <span className="text-[10px] font-bold text-slate-700">{item.progressText}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progressPercent}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} relative`}
                      >
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20" style={{ animation: 'shimmer 2s infinite' }}></div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}