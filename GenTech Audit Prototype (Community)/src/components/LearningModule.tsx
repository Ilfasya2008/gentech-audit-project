import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ChevronRight, Check, Home, ArrowLeft, Lock, Award, PlayCircle, Clock } from 'lucide-react';
import { AppScreen, UserProgress } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface LearningModuleProps {
  onModuleComplete: (moduleId: number) => void;
  onAllModulesComplete: () => void;
  onNavigate: (screen: AppScreen) => void;
  onTotalModulesLoaded: (count: number) => void;
  progress: UserProgress;
}

interface Module {
  id: number;
  title: string;
  duration: string;
  topics: string[];
  content: {
    heading: string;
    text: string;
  }[];
  status: string;
}

export function LearningModule({
  onModuleComplete,
  onAllModulesComplete,
  onNavigate,
  onTotalModulesLoaded,
  progress,
}: LearningModuleProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => {
    const fetchLearningModules = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/modules');
        const formattedModules = response.data.data.map((mod: any) => ({
          id: mod.id,
          title: mod.title,
          duration: mod.duration || 'Waktu tidak ditentukan',
          topics: Array.isArray(mod.topics) ? mod.topics : (typeof mod.topics === 'string' ? JSON.parse(mod.topics) : []), 
          content: (typeof mod.content === 'string' ? JSON.parse(mod.content) : Array.isArray(mod.content) ? mod.content : null) 
                   || [{ heading: "Pengantar", text: mod.description || "Belum ada konten" }],
          status: mod.status
        }));

        const activeModules = formattedModules.filter((m: any) => m.status !== 'draft');
        
        setModules(formattedModules);
        onTotalModulesLoaded(activeModules.length);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil modul pembelajaran:", error);
        setLoading(false);
      }
    };
    fetchLearningModules();
  }, [onTotalModulesLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-indigo-600 font-bold tracking-wide animate-pulse">Menyiapkan Modul Pembelajaran...</p>
        </div>
      </div>
    );
  }

  // Tampilan saat modul dipilih (Detail Modul)
  if (selectedModule) {
    if (!selectedModule.content || selectedModule.content.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
          <p className="text-slate-600 font-medium">Konten modul ini belum tersedia.</p>
          <button onClick={() => setSelectedModule(null)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Kembali</button>
        </div>
      );
    }

    const currentContent = selectedModule.content[currentContentIndex];
    const isLastContent = currentContentIndex === selectedModule.content.length - 1;
    const isModuleCompleted = progress.completedModuleIds.includes(selectedModule.id);
    const activeModules = modules.filter(m => m.status !== 'draft');
    const modulePosition = activeModules.findIndex(m => m.id === selectedModule.id) + 1 || 1;
    const allModulesCompleted = activeModules.length > 0 && activeModules.every(m => progress.completedModuleIds.includes(m.id) || m.id === selectedModule.id);

    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-blue-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        {/* Header Glassmorphism */}
        <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl border-b border-white/60 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => { setSelectedModule(null); setCurrentContentIndex(0); }} className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800 line-clamp-1">{selectedModule.title}</h3>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Modul {modulePosition} dari {activeModules.length}</p>
              </div>
            </div>
            
            <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500 relative"
                style={{ width: `${((currentContentIndex + 1) / selectedModule.content.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 max-w-4xl mx-auto relative z-10 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentContentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 mb-8"
            >
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100/50">
                  Topik {currentContentIndex + 1} dari {selectedModule.content.length}
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">{currentContent?.heading}</h2>
              </div>

              <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed font-medium">
                {currentContent?.text.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {currentContentIndex === 0 && selectedModule.topics && selectedModule.topics.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="mt-10 p-6 bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-3xl border border-indigo-100/60"
                >
                  <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" /> Yang akan Anda pelajari:
                  </h4>
                  <ul className="space-y-3">
                    {selectedModule.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-700 font-semibold">
                        <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {currentContentIndex > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentContentIndex(currentContentIndex - 1)}
                className="w-full sm:w-auto px-6 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Sebelumnya
              </motion.button>
            )}

            {isLastContent && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isModuleCompleted) onModuleComplete(selectedModule.id);
                  setSelectedModule(null);
                  setCurrentContentIndex(0);
                }}
                className="w-full sm:flex-1 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all font-bold shadow-sm"
              >
                Kembali ke List Modul
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isLastContent) {
                  setCurrentContentIndex(currentContentIndex + 1);
                } else {
                  if (!isModuleCompleted) onModuleComplete(selectedModule.id);
                  setSelectedModule(null);
                  setCurrentContentIndex(0);
                  const willAllBeDone = activeModules.every(m => progress.completedModuleIds.includes(m.id) || m.id === selectedModule.id);
                  if (willAllBeDone || allModulesCompleted) onAllModulesComplete();
                }
              }}
              className="w-full sm:flex-1 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 font-bold text-lg"
            >
              {isLastContent ? (
                allModulesCompleted || isModuleCompleted ? 'Selesai & Lanjut Kuis' : 'Selesaikan Modul'
              ) : 'Lanjut Topik Berikutnya'}
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const activeModules = modules.filter(m => m.status !== 'draft');

  // Tampilan List Modul (Halaman Utama Learning)
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      {/* Dynamic Mesh Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-blue-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-indigo-400/20 mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pusat Belajar</h1>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">Modul & Teori Dasar</p>
              </div>
            </div>
            <button onClick={() => onNavigate('dashboard')} className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all">
              <Home className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Card Glassmorphism */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Progress Belajar Anda</h3>
                    <p className="text-slate-500 font-medium text-sm">Selesaikan semua modul untuk membuka kuis</p>
                  </div>
                  <div className="text-2xl font-black text-indigo-600">{progress.completedModules} <span className="text-slate-400 text-lg">/ {activeModules.length || 1}</span></div>
                </div>
                <div className="h-2.5 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${(progress.completedModules / Math.max(activeModules.length, 1)) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 mb-4 ml-2">Daftar Modul</h2>
          
          {modules.length === 0 ? (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Belum ada modul yang tersedia.</p>
            </div>
          ) : (
            modules.map((module, index) => {
              const isCompleted = progress.completedModuleIds.includes(module.id);
              const isDraft = module.status === 'draft';

              return (
                <motion.button
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => !isDraft && setSelectedModule(module)}
                  disabled={isDraft}
                  className={`w-full group bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border transition-all duration-300 text-left flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden ${
                    isDraft ? 'border-slate-200 opacity-75 cursor-not-allowed' : 
                    isCompleted ? 'border-emerald-100 hover:border-emerald-300 hover:shadow-lg' : 
                    'border-slate-100 hover:border-indigo-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-105 ${
                    isDraft ? 'bg-slate-100 text-slate-400' :
                    isCompleted ? 'bg-emerald-50 text-emerald-600' : 
                    'bg-indigo-50 text-indigo-600'
                  }`}>
                    {isDraft ? <Lock className="w-7 h-7" /> : 
                     isCompleted ? <Check className="w-8 h-8" /> : 
                     <PlayCircle className="w-8 h-8" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`text-xl font-black truncate ${isDraft ? 'text-slate-500' : 'text-slate-800'}`}>
                        {module.title}
                      </h3>
                      {isDraft && (
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                          Segera Hadir
                        </span>
                      )}
                      {isCompleted && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                          Selesai
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-3">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {module.duration}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{module.content?.length || 1} Topik</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {module.topics && module.topics.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isDraft ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                          {topic}
                        </span>
                      ))}
                      {module.topics && module.topics.length > 3 && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-500 border border-slate-200">
                          +{module.topics.length - 3} lagi
                        </span>
                      )}
                    </div>
                  </div>

                  {!isDraft && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </motion.button>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('quiz')}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-slate-200/60 hover:border-purple-300 hover:shadow-lg transition-all text-left flex items-center justify-between group"
          >
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-1">Ikuti Kuis Akhir</h3>
              <p className="text-sm font-medium text-slate-500">Uji pemahaman teori Anda</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronRight className="w-6 h-6" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('explorer')}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-sm border border-slate-200/60 hover:border-pink-300 hover:shadow-lg transition-all text-left flex items-center justify-between group"
          >
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-1">Simulasi Audit</h3>
              <p className="text-sm font-medium text-slate-500">Praktikkan audit blockchain</p>
            </div>
            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronRight className="w-6 h-6" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}