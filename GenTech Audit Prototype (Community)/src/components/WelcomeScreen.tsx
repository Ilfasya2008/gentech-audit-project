import { useState } from 'react';
import { ArrowRight, Blocks, FileCheck, TrendingUp, Sparkles, Activity, ShieldCheck, Zap, ChevronLeft, ChevronRight, Check, BookOpen, Brain, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import logo from 'figma:asset/3b670beca6d9f65f8127efd31decabb8aaae9980.png';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const onboardingSteps = [
  {
    icon: BookOpen,
    title: 'Pelajari Materi',
    description: 'Akses modul pembelajaran terstruktur tentang blockchain dan audit digital. Setiap modul dirancang untuk memberikan pemahaman mendalam dengan visualisasi yang menarik.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Brain,
    title: 'Uji Pemahaman',
    description: 'Ikuti kuis interaktif untuk mengevaluasi pemahaman Anda. Dapatkan umpan balik langsung dan penjelasan detail untuk setiap pertanyaan.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Search,
    title: 'Simulasi Audit',
    description: 'Telusuri dan analisis transaksi blockchain. Tandai transaksi yang mencurigakan dan pelajari cara memverifikasi keaslian data di blockchain.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'Buat Laporan',
    description: 'Susun laporan audit profesional dari temuan Anda. Pelajari cara mendokumentasikan hasil audit dengan format yang terstruktur.',
    color: 'from-pink-500 to-pink-600',
  },
];

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onContinue();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const step = onboardingSteps[currentStep];
  const Icon = step ? step.icon : BookOpen;

  return (
    <div className="min-h-screen flex w-full bg-slate-50 overflow-hidden">
      
      {/* Left Pane - Visuals / Floating Elements (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 items-center justify-center overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], x: [0, -80, 0], y: [0, 80, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[40%] right-[-20%] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px]" 
          />
        </div>

        {/* Floating UI Elements */}
        <div className="relative z-10 w-full max-w-lg h-[600px] flex items-center justify-center">
          
          {/* Center Main Graphic */}
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="relative z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center"
          >
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 rounded-full"></div>
            <img src={logo} alt="GenTech Audit" className="w-40 h-40 mb-6 rounded-[2rem] drop-shadow-2xl relative z-10 object-cover" />
            <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10">GenTech Audit</h2>
          </motion.div>

          {/* Orbiting Card 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[5%] z-30 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Status Sistem</p>
              <p className="text-sm font-extrabold text-slate-800">Aman & Terverifikasi</p>
            </div>
          </motion.div>

          {/* Orbiting Card 2 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] right-[5%] z-30 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Live Audit</p>
              <p className="text-sm font-extrabold text-slate-800">850 Tx/s Analisis</p>
            </div>
          </motion.div>

          {/* Orbiting Card 3 */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[25%] right-[0%] z-30 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-800">Cepat & Responsif</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Content (Mobile: Full Width) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        
        {/* Mobile Background Shapes */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
        <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {!showOnboarding ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/80 backdrop-blur-2xl lg:bg-transparent lg:backdrop-blur-none rounded-[2.5rem] p-8 sm:p-10 shadow-2xl lg:shadow-none border border-white/60 lg:border-none flex flex-col items-center lg:items-start w-full"
              >
                {/* Logo for mobile */}
                <div className="lg:hidden relative mb-6">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                  <img src={logo} alt="GenTech Audit" className="w-24 h-24 rounded-2xl drop-shadow-xl relative z-10 object-cover" />
                </div>
                
                {/* Title */}
                <div className="text-center lg:text-left mb-10 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100 shadow-sm">
                     <Sparkles className="w-3 h-3" /> Selamat Datang
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Mulai Petualangan <br className="hidden lg:block"/> Audit Digital
                  </h1>
                  <p className="text-slate-500 font-medium">
                    Platform simulasi audit digital berbasis blockchain untuk mengasah insting dan kemampuan teknis Anda.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="w-full space-y-4 mb-10">
                  <div className="bg-white/90 lg:bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                      <Blocks className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Blockchain Learning</h3>
                      <p className="text-sm text-slate-500 font-medium">Pelajari dasar blockchain</p>
                    </div>
                  </div>

                  <div className="bg-white/90 lg:bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                      <FileCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Audit Simulation</h3>
                      <p className="text-sm text-slate-500 font-medium">Praktik audit interaktif</p>
                    </div>
                  </div>

                  <div className="bg-white/90 lg:bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Track Progress</h3>
                      <p className="text-sm text-slate-500 font-medium">Pantau perkembangan Anda</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowOnboarding(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Mulai Perjalanan
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/80 backdrop-blur-2xl lg:bg-transparent lg:backdrop-blur-none rounded-[2.5rem] p-8 sm:p-10 shadow-2xl lg:shadow-none border border-white/60 lg:border-none flex flex-col items-center w-full min-h-[500px] justify-between"
              >
                <div className="w-full flex flex-col items-center">
                  {/* Progress Bar */}
                  <div className="w-full mb-10">
                    <div className="flex justify-between mb-2 text-slate-500 font-medium text-sm">
                      <span>Langkah {currentStep + 1}/{onboardingSteps.length}</span>
                      <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-[2rem] mb-8 shadow-xl flex items-center justify-center shadow-blue-500/20`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>

                  {/* Title & Desc */}
                  <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-4 tracking-tight">
                    {step.title}
                  </h2>
                  <p className="text-slate-500 text-center font-medium leading-relaxed mb-10">
                    {step.description}
                  </p>

                  {/* Step Indicators */}
                  <div className="flex justify-center gap-2 mb-8">
                    {onboardingSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentStep 
                            ? 'w-8 bg-blue-600' 
                            : index < currentStep 
                              ? 'w-2 bg-blue-300' 
                              : 'w-2 bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="w-full space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all"
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
                      <>
                        Mulai Belajar
                        <Check className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Lanjut
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex justify-between items-center px-2 pt-2">
                    <button
                      onClick={handlePrevious}
                      className="text-slate-500 hover:text-slate-800 font-bold transition flex items-center gap-1 text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Kembali
                    </button>

                    {currentStep < onboardingSteps.length - 1 && (
                      <button
                        onClick={onContinue}
                        className="text-slate-400 hover:text-blue-600 font-bold transition text-sm underline-offset-2 hover:underline"
                      >
                        Lewati
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}