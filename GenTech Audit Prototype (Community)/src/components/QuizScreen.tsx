import { useState } from 'react';
import { 
  Brain, 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Trophy,
  Shield,
  Search,
  BookOpen,
  Award,
  Zap,
  Target,
  Database,
  TrendingUp,
  Lock,
  FileText,
  Fingerprint
} from 'lucide-react';
import type { QuizQuestion, QuizType } from '../data/quizData';

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  shield: Shield,
  search: Search,
  book: BookOpen,
  award: Award,
  zap: Zap,
  target: Target,
  database: Database,
  trend: TrendingUp,
  lock: Lock,
  file: FileText,
  fingerprint: Fingerprint,
};

interface QuizScreenProps {
  quiz: QuizType;
  previousBestScore?: number;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function QuizScreen({ quiz, previousBestScore, onComplete, onBack }: QuizScreenProps) {
  const quizQuestions = quiz.questions;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quizQuestions.length).fill(null)
  );
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter(
      (ans, idx) => ans === quizQuestions[idx].correctAnswer
    ).length;
    return Math.round((correctAnswers / quizQuestions.length) * 100);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (!showExplanation) {
      setShowExplanation(true);
    } else if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowExplanation(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers(new Array(quizQuestions.length).fill(null));
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const score = calculateScore();
    const correctAnswers = answers.filter(
      (ans, idx) => ans === quizQuestions[idx].correctAnswer
    ).length;
    const isNewBest = previousBestScore === undefined || score > previousBestScore;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                score >= 80 ? 'bg-yellow-100' : score >= 60 ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <Trophy
                className={`w-12 h-12 ${
                  score >= 80 ? 'text-yellow-500' : score >= 60 ? 'text-blue-500' : 'text-gray-500'
                }`}
              />
            </div>

            <p className="text-sm text-purple-600 font-medium mb-1">{quiz.title}</p>
            <h2 className="text-gray-900 mb-4 text-2xl font-bold">Kuis Selesai!</h2>

            <div className="mb-8">
              <div className="text-gray-900 mb-2">Skor Anda</div>
              <div
                className={`text-6xl mb-4 font-bold ${
                  score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : 'text-orange-600'
                }`}
              >
                {score}%
              </div>
              <p className="text-gray-600">
                {correctAnswers} dari {quizQuestions.length} jawaban benar
              </p>
              {previousBestScore !== undefined && (
                <p className="text-sm text-gray-500 mt-2">
                  Skor sebelumnya: {previousBestScore}%
                  {isNewBest && ' · Rekor baru!'}
                </p>
              )}
            </div>

            <div
              className={`p-6 rounded-2xl mb-8 ${
                score >= 80
                  ? 'bg-green-50 border-2 border-green-200'
                  : score >= 60
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-orange-50 border-2 border-orange-200'
              }`}
            >
              <p
                className={
                  score >= 80
                    ? 'text-green-800'
                    : score >= 60
                      ? 'text-blue-800'
                      : 'text-orange-800'
                }
              >
                {score >= 80
                  ? 'Luar biasa! Anda menguasai materi dengan sangat baik!'
                  : score >= 60
                    ? 'Bagus! Anda memahami konsep dasar dengan baik.'
                    : 'Tetap semangat! Coba pelajari kembali materinya.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Ulangi Kuis
              </button>
              <button
                onClick={() => onComplete(score)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                Simpan & Selesai
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const Icon = iconMap[quiz.icon || ''] ?? Brain;
              const isHex = quiz.color?.startsWith('#');
              const bgStyle = isHex ? { backgroundColor: quiz.color } : {};
              const bgClass = isHex ? '' : `bg-gradient-to-br ${quiz.color || 'from-blue-500 to-indigo-600'}`;
              return (
                <div
                  style={bgStyle}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              );
            })()}
            <div className="flex-1">
              <h2 className="text-gray-900 font-bold">{quiz.title}</h2>
              <p className="text-gray-600 text-sm">{quiz.description}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                quiz.difficulty === 'Pemula'
                  ? 'bg-green-100 text-green-700'
                  : quiz.difficulty === 'Menengah'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'
              }`}
            >
              {quiz.difficulty}
            </span>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-gray-600 mb-1 text-sm">
              <span>
                Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
              </span>
              <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-gray-900 mb-6 font-medium">{question.question}</h3>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 transition ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        showResult
                          ? isCorrect
                            ? 'text-green-900'
                            : isSelected
                              ? 'text-red-900'
                              : 'text-gray-600'
                          : isSelected
                            ? 'text-blue-900'
                            : 'text-gray-700'
                      }
                    >
                      {option}
                    </span>
                    {showResult && isCorrect && <Check className="w-6 h-6 text-green-500" />}
                    {showResult && isSelected && !isCorrect && (
                      <X className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">i</span>
                </div>
                <div>
                  <h4 className="text-blue-900 mb-2 font-medium">Penjelasan</h4>
                  <p className="text-blue-800">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => {
              if (currentQuestion === 0) {
                onBack();
              } else {
                handlePrevious();
              }
            }}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-md flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2 ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            {showExplanation
              ? isLastQuestion
                ? 'Lihat Hasil'
                : 'Pertanyaan Berikutnya'
              : 'Konfirmasi Jawaban'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {quizQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition ${
                answers[index] !== null
                  ? 'bg-indigo-600'
                  : index === currentQuestion
                    ? 'bg-indigo-400'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
