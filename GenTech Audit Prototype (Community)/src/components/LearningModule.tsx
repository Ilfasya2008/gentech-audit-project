import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, ChevronRight, Check, Home, ArrowLeft } from 'lucide-react';
import { AppScreen, UserProgress } from '../App';
import logo from 'figma:asset/3b670beca6d9f65f8127efd31decabb8aaae9980.png';

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
}

export function LearningModule({
  onModuleComplete,
  onAllModulesComplete,
  onNavigate,
  onTotalModulesLoaded,
  progress,
}: LearningModuleProps) {
  // State untuk menampung data dari database
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Fetch data dari API Laravel
  useEffect(() => {
    const fetchLearningModules = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/modules');
        
        // Memastikan format data yang diterima sesuai (terutama array topics & content)
        const formattedModules = response.data.data.map((mod: any) => ({
          id: mod.id,
          title: mod.title,
          duration: mod.duration || 'Waktu tidak ditentukan',
          // Beri nilai default jika null di database
          topics: Array.isArray(mod.topics) ? mod.topics : [], 
          content: Array.isArray(mod.content) ? mod.content : [{ heading: "Pengantar", text: mod.description || "Belum ada konten" }]
        }));

        setModules(formattedModules);
        onTotalModulesLoaded(formattedModules.length);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil modul pembelajaran:", error);
        setLoading(false);
      }
    };

    fetchLearningModules();
  }, []);

  // Tampilan saat loading data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-primary text-lg font-semibold">Memuat Modul Pembelajaran...</p>
      </div>
    );
  }

  // Tampilan saat modul dipilih (Detail Modul)
  if (selectedModule) {
    // Hindari error jika content kosong
    if (!selectedModule.content || selectedModule.content.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 gap-4">
                <p className="text-primary">Konten modul ini belum tersedia.</p>
                <button onClick={() => setSelectedModule(null)} className="px-4 py-2 bg-primary text-white rounded-lg">Kembali</button>
            </div>
        )
    }

    const currentContent = selectedModule.content[currentContentIndex];
    const isLastContent = currentContentIndex === selectedModule.content.length - 1;
    const isModuleCompleted = progress.completedModuleIds.includes(selectedModule.id);
    const modulePosition =
      modules.findIndex(m => m.id === selectedModule.id) + 1 || 1;
    const allModulesCompleted =
      modules.length > 0 &&
      modules.every(m => progress.completedModuleIds.includes(m.id) || m.id === selectedModule.id);

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => {
              setSelectedModule(null);
              setCurrentContentIndex(0);
            }} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <div className="flex-1">
              <h3 className="text-primary">{selectedModule.title}</h3>
              <p className="text-muted-foreground">
                Modul {modulePosition} dari {modules.length}
              </p>
            </div>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentContentIndex + 1) / selectedModule.content.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full mb-3">
                Topik {currentContentIndex + 1} dari {selectedModule.content.length}
              </span>
              <h2 className="text-primary mb-3">{currentContent?.heading}</h2>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {currentContent?.text}
            </p>

            {currentContentIndex === 0 && selectedModule.topics && selectedModule.topics.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-primary mb-3">Yang akan Anda pelajari:</h4>
                <ul className="space-y-2">
                  {selectedModule.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <button
              onClick={() => {
                if (!isLastContent) {
                  setCurrentContentIndex(currentContentIndex + 1);
                } else {
                  if (!isModuleCompleted) {
                    onModuleComplete(selectedModule.id);
                  }
                  setSelectedModule(null);
                  setCurrentContentIndex(0);
                  const willAllBeDone =
                    modules.every(m =>
                      progress.completedModuleIds.includes(m.id) || m.id === selectedModule.id
                    );
                  if (willAllBeDone) {
                    onAllModulesComplete();
                  }
                }
              }}
              className="w-full py-4 bg-primary text-white rounded-2xl hover:bg-blue-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              {isLastContent ? (
                allModulesCompleted || isModuleCompleted
                  ? 'Selesai & Lanjut ke Kuis'
                  : 'Selesaikan Modul'
              ) : (
                'Lanjut'
              )}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan List Modul (Halaman Utama Learning)
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="GenTech Audit" className="w-10 h-10" />
          <div className="flex-1">
            <h1 className="text-primary">Modul Pembelajaran</h1>
          </div>
          <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
            <Home className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Progress */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-primary">Progress</span>
            <span className="text-primary">
              {progress.completedModules}/{modules.length || progress.totalModules || 1}
            </span>
          </div>
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${(progress.completedModules / Math.max(modules.length || progress.totalModules || 1, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="p-4 space-y-3">
        {modules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada modul yang tersedia.
          </div>
        ) : (
          modules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary transition text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {progress.completedModuleIds.includes(module.id) ? (
                    <Check className="w-6 h-6 text-primary" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-primary mb-1">
                    Modul {index + 1}: {module.title}
                  </h3>
                  <p className="text-muted-foreground">{module.duration}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {module.topics && module.topics.slice(0, 2).map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-primary rounded-lg text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 pt-0 space-y-3">
        <button
          onClick={() => onNavigate('quiz')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary transition text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-primary mb-1">Ikuti Kuis</h3>
              <p className="text-muted-foreground">Uji pemahaman Anda</p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('explorer')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-primary transition text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-primary mb-1">Simulasi Audit</h3>
              <p className="text-muted-foreground">Praktikkan audit transaksi</p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </button>
      </div>
    </div>
  );
}