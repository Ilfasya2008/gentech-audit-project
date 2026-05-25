import { useState } from 'react';
import { Brain, Check, X, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';

interface QuizScreenProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Apa karakteristik utama dari teknologi blockchain?',
    options: [
      'Tersentralisasi dan dapat diubah',
      'Desentralisasi, transparan, dan immutable',
      'Privat dan rahasia',
      'Memerlukan server pusat'
    ],
    correctAnswer: 1,
    explanation: 'Blockchain memiliki tiga karakteristik utama: desentralisasi (tidak ada otoritas tunggal), transparansi (transaksi dapat dilihat publik), dan immutability (data tidak dapat diubah setelah tercatat).'
  },
  {
    id: 2,
    question: 'Apa fungsi utama hash dalam blockchain?',
    options: [
      'Menyimpan password pengguna',
      'Mengenkripsi data pribadi',
      'Mengamankan blok dan menghubungkan blok dalam chain',
      'Mempercepat transaksi'
    ],
    correctAnswer: 2,
    explanation: 'Hash function mengubah data menjadi string dengan panjang tetap. Dalam blockchain, hash digunakan untuk mengamankan setiap blok dan menghubungkan blok satu sama lain, membentuk chain yang tidak dapat dimanipulasi.'
  },
  {
    id: 3,
    question: 'Apa yang dimaksud dengan mekanisme konsensus dalam blockchain?',
    options: [
      'Cara untuk menghapus transaksi lama',
      'Protokol agar semua node setuju tentang keadaan ledger',
      'Metode untuk mengenkripsi data',
      'Sistem untuk membuat password'
    ],
    correctAnswer: 1,
    explanation: 'Mekanisme konsensus adalah protokol yang memastikan semua node dalam jaringan setuju tentang keadaan terkini dari ledger, mencegah double-spending dan memastikan integritas data.'
  },
  {
    id: 4,
    question: 'Mengapa blockchain cocok untuk audit trail?',
    options: [
      'Karena data dapat dihapus kapan saja',
      'Karena hanya admin yang bisa melihat transaksi',
      'Karena menyediakan catatan lengkap yang tidak dapat dimanipulasi',
      'Karena lebih murah dari sistem tradisional'
    ],
    correctAnswer: 2,
    explanation: 'Blockchain menyediakan audit trail yang sempurna karena semua transaksi tercatat secara permanen dengan timestamp, dan tidak dapat diubah atau dihapus. Ini memberikan transparansi penuh untuk proses audit.'
  },
  {
    id: 5,
    question: 'Apa yang harus diperhatikan auditor saat memeriksa transaksi blockchain?',
    options: [
      'Hanya memeriksa nilai transaksi',
      'Hash, signature, konfirmasi blok, dan pola transaksi',
      'Nama pemilik akun',
      'Lokasi geografis pengirim'
    ],
    correctAnswer: 1,
    explanation: 'Auditor harus memeriksa multiple aspek: hash untuk integritas data, digital signature untuk autentikasi, konfirmasi blok untuk validitas, dan pola transaksi untuk mendeteksi anomali atau red flags.'
  }
];

export function QuizScreen({ onComplete, onBack }: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (!showExplanation) {
      setShowExplanation(true);
    } else {
      if (isLastQuestion) {
        // Calculate score
        const correctAnswers = answers.filter((ans, idx) => ans === quizQuestions[idx].correctAnswer).length;
        const score = Math.round((correctAnswers / quizQuestions.length) * 100);
        setQuizCompleted(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestion + 1]);
        setShowExplanation(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowExplanation(false);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter((ans, idx) => ans === quizQuestions[idx].correctAnswer).length;
    return Math.round((correctAnswers / quizQuestions.length) * 100);
  };

  if (quizCompleted) {
    const score = calculateScore();
    const correctAnswers = answers.filter((ans, idx) => ans === quizQuestions[idx].correctAnswer).length;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            {/* Trophy Icon */}
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              score >= 80 ? 'bg-yellow-100' : score >= 60 ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Trophy className={`w-12 h-12 ${
                score >= 80 ? 'text-yellow-500' : score >= 60 ? 'text-blue-500' : 'text-gray-500'
              }`} />
            </div>

            {/* Title */}
            <h2 className="text-gray-900 mb-4">Kuis Selesai!</h2>

            {/* Score */}
            <div className="mb-8">
              <div className="text-gray-900 mb-2">Skor Anda</div>
              <div className={`text-6xl mb-4 ${
                score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {score}
              </div>
              <p className="text-gray-600">
                {correctAnswers} dari {quizQuestions.length} jawaban benar
              </p>
            </div>

            {/* Feedback */}
            <div className={`p-6 rounded-2xl mb-8 ${
              score >= 80 ? 'bg-green-50 border-2 border-green-200' : 
              score >= 60 ? 'bg-blue-50 border-2 border-blue-200' : 
              'bg-orange-50 border-2 border-orange-200'
            }`}>
              <p className={`${
                score >= 80 ? 'text-green-800' : score >= 60 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                {score >= 80 
                  ? '🎉 Luar biasa! Anda menguasai materi dengan sangat baik!'
                  : score >= 60 
                    ? '👍 Bagus! Anda memahami konsep dasar dengan baik.'
                    : '💪 Tetap semangat! Coba pelajari kembali materinya.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Pelajari Lagi
              </button>
              <button
                onClick={() => onComplete(score)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                Lanjut ke Simulasi
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
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Kuis Pemahaman</h2>
                <p className="text-gray-600">Uji pemahaman Anda tentang blockchain</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-2">
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-gray-900 mb-6">{question.question}</h3>

          {/* Options */}
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
                    <span className={`${
                      showResult
                        ? isCorrect
                          ? 'text-green-900'
                          : isSelected
                            ? 'text-red-900'
                            : 'text-gray-600'
                        : isSelected
                          ? 'text-blue-900'
                          : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                    {showResult && isCorrect && (
                      <Check className="w-6 h-6 text-green-500" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <X className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white">i</span>
                </div>
                <div>
                  <h4 className="text-blue-900 mb-2">Penjelasan</h4>
                  <p className="text-blue-800">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
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
            {showExplanation ? (
              isLastQuestion ? 'Lihat Hasil' : 'Pertanyaan Berikutnya'
            ) : (
              'Konfirmasi Jawaban'
            )}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Question indicators */}
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
