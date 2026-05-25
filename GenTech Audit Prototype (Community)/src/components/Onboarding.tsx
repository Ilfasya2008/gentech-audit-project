import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Target, Award, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: BookOpen,
    title: 'Selamat Datang di GenTech Audit',
    description: 'Platform pembelajaran interaktif yang menggabungkan teori blockchain, praktik audit digital, dan simulasi kasus nyata untuk mempersiapkan Anda menghadapi masa depan audit teknologi.',
    color: 'from-blue-600 to-blue-500'
  },
  {
    icon: Target,
    title: 'Fitur-Fitur Unggulan',
    description: 'Pelajari materi blockchain dan audit melalui modul terstruktur, uji pemahaman dengan kuis interaktif, dan praktikkan kemampuan audit melalui simulasi transaksi blockchain nyata.',
    color: 'from-purple-600 to-purple-500'
  },
  {
    icon: Award,
    title: 'Cara Menggunakan Aplikasi',
    description: 'Mulai dengan modul pembelajaran, selesaikan kuis untuk unlock fitur simulasi, telusuri dan tandai transaksi mencurigakan, lalu buat laporan audit profesional. Raih achievement dan tingkatkan level Anda!',
    color: 'from-pink-600 to-pink-500'
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`inline-block bg-gradient-to-br ${slides[currentSlide].color} p-6 rounded-3xl mb-6`}
              >
                {(() => {
                  const Icon = slides[currentSlide].icon;
                  return <Icon className="w-12 h-12 text-white" />;
                })()}
              </motion.div>

              <h2 className="mb-4">{slides[currentSlide].title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-8 bg-gradient-to-r from-blue-600 to-purple-600' 
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  currentSlide === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Kembali
              </button>

              <button
                onClick={nextSlide}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow"
              >
                {currentSlide === slides.length - 1 ? 'Mulai' : 'Lanjut'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
