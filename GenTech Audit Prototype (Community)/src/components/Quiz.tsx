import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import type { AppScreen, UserProgress } from '../App';

interface QuizProps {
  navigate: (screen: AppScreen) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  userProgress: UserProgress;
}

const quizQuestions = [
  {
    question: 'Apa karakteristik utama dari teknologi blockchain?',
    options: [
      'Terpusat dan dapat diubah',
      'Desentralisasi dan immutable',
      'Pribadi dan tersembunyi',
      'Cepat namun tidak aman'
    ],
    correctAnswer: 1,
    explanation: 'Blockchain bersifat desentralisasi (tidak ada otoritas pusat) dan immutable (data tidak dapat diubah setelah tercatat).'
  },
  {
    question: 'Fungsi hash dalam blockchain digunakan untuk:',
    options: [
      'Mempercepat transaksi',
      'Mengurangi ukuran data',
      'Memastikan integritas data dan menghubungkan blok',
      'Menyembunyikan identitas pengguna'
    ],
    correctAnswer: 2,
    explanation: 'Hash berfungsi sebagai sidik jari digital yang memastikan integritas data dan menghubungkan blok secara kriptografis.'
  },
  {
    question: 'Apa keunggulan audit berbasis blockchain dibanding audit tradisional?',
    options: [
      'Lebih mahal dan rumit',
      'Hanya bisa dilakukan sekali',
      'Real-time verification dan trail audit permanen',
      'Memerlukan lebih banyak auditor'
    ],
    correctAnswer: 2,
    explanation: 'Audit blockchain memungkinkan verifikasi real-time dan memiliki trail audit permanen yang transparan.'
  },
  {
    question: 'Smart contract adalah:',
    options: [
      'Kontrak kertas yang dipindai',
      'Program yang berjalan otomatis di blockchain',
      'Aplikasi mobile untuk trading',
      'Database terpusat'
    ],
    correctAnswer: 1,
    explanation: 'Smart contract adalah program self-executing yang berjalan otomatis di blockchain ketika kondisi tertentu terpenuhi.'
  },
  {
    question: 'Red flag dalam analisis transaksi blockchain meliputi:',
    options: [
      'Transaksi dengan timestamp normal',
      'Alamat yang terverifikasi',
      'Transaksi dengan nilai tidak wajar dan pola mencurigakan',
      'Gas fee yang standar'
    ],
    correctAnswer: 2,
    explanation: 'Transaksi dengan nilai tidak wajar, pola transfer mencurigakan, dan alamat terkait aktivitas ilegal adalah red flags yang perlu diwaspadai.'
  }
];

export default function Quiz({ navigate, updateProgress, userProgress }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      const finalScore = selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? score + 1 : score;
      
      // Update progress
      updateProgress({
        quizScores: [...userProgress.quizScores, finalScore]
      });

      // Add achievement for perfect score
      if (finalScore === quizQuestions.length && !userProgress.achievements.includes('perfectScore')) {
        updateProgress({
          achievements: [...userProgress.achievements, 'perfectScore']
        });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const finalScore = score;
    const percentage = (finalScore / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <Award className="w-20 h-20 text-yellow-500 mx-auto" />
          </motion.div>

          <h2 className="mb-4">Kuis Selesai!</h2>
          
          <div className="mb-8">
            <div className="text-6xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {finalScore}/{quizQuestions.length}
            </div>
            <p className="text-gray-600">
              Skor Anda: {percentage.toFixed(0)}%
            </p>
          </div>

          {percentage === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6"
            >
              <p className="text-yellow-800">
                🎉 Sempurna! Anda mendapatkan achievement "Perfect Score"!
              </p>
            </motion.div>
          )}

          <div className="flex gap-4">
            <button
              onClick={restartQuiz}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Ulangi Kuis
            </button>
            <button
              onClick={() => navigate('dashboard')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-shadow"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Dashboard
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10"
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}</span>
              <span>Skor: {score}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="mb-6">{question.question}</h3>

              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={index}
                      onClick={() => !showExplanation && handleAnswer(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        !showResult
                          ? 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-blue-300'
                          : isSelected && isCorrect
                          ? 'bg-green-50 border-2 border-green-500'
                          : isSelected && !isCorrect
                          ? 'bg-red-50 border-2 border-red-500'
                          : isCorrect
                          ? 'bg-green-50 border-2 border-green-500'
                          : 'bg-gray-50 border-2 border-transparent'
                      } ${showExplanation ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          !showResult
                            ? 'border-gray-300'
                            : isCorrect
                            ? 'border-green-500 bg-green-500'
                            : isSelected
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6"
                  >
                    <p className="text-sm text-blue-800">
                      <span>💡 Penjelasan:</span> {question.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {showExplanation && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg transition-shadow"
                >
                  {currentQuestion < quizQuestions.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil'}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
