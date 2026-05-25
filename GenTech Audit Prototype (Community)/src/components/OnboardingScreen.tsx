import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, BookOpen, Brain, Search, FileText } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
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

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between mb-2 text-muted-foreground">
            <span>Langkah {currentStep + 1}/{onboardingSteps.length}</span>
            <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Icon */}
        <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-3xl mb-6 shadow-xl flex items-center justify-center`}>
          <Icon className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-primary text-center mb-4">
          {step.title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-center mb-8">
          {step.description}
        </p>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep 
                  ? 'w-8 bg-primary' 
                  : index < currentStep 
                    ? 'w-2 bg-secondary' 
                    : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-sm space-y-3 pb-safe">
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl hover:bg-blue-800 transition shadow-lg"
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
        </button>

        {currentStep > 0 && (
          <button
            onClick={handlePrevious}
            className="w-full flex items-center justify-center gap-2 bg-white text-primary px-6 py-4 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali
          </button>
        )}

        {/* Skip Button */}
        {currentStep < onboardingSteps.length - 1 && (
          <div className="text-center">
            <button
              onClick={onComplete}
              className="text-muted-foreground hover:text-primary transition"
            >
              Lewati Pengenalan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}