import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Clock, 
  BookOpen, 
  ChevronRight,
  ArrowLeft,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Shield,
  Award,
  Zap,
  Target,
  Database,
  TrendingUp,
  Lock,
  FileText,
  Fingerprint
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  estimated_minutes: number;
  icon?: string;
  color?: string;
  questions_count?: number;
  is_active?: boolean | number | string;
}

interface Question {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  order: number;
}

const AVAILABLE_ICONS = [
  { key: 'brain', Icon: Brain, label: 'Brain' },
  { key: 'shield', Icon: Shield, label: 'Shield' },
  { key: 'search', Icon: Search, label: 'Search' },
  { key: 'book', Icon: BookOpen, label: 'Buku' },
  { key: 'award', Icon: Award, label: 'Penghargaan' },
  { key: 'zap', Icon: Zap, label: 'Kilat' },
  { key: 'target', Icon: Target, label: 'Target' },
  { key: 'database', Icon: Database, label: 'Database' },
  { key: 'trend', Icon: TrendingUp, label: 'Tren' },
  { key: 'lock', Icon: Lock, label: 'Kunci' },
  { key: 'file', Icon: FileText, label: 'Dokumen' },
  { key: 'fingerprint', Icon: Fingerprint, label: 'Sidik Jari' },
];

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Loading states
  const [isQuizLoading, setIsQuizLoading] = useState(true);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  
  // Modals
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
  
  // Form states
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Pemula' as 'Pemula' | 'Menengah' | 'Lanjutan',
    estimated_minutes: 10,
    icon: 'brain',
    color: '#3B82F6',
    is_active: true
  });

  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    correct_answer: 0,
    explanation: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setIsQuizLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/quizzes');
      if (response.data.success) {
        setQuizzes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const fetchQuestions = async (quizId: number) => {
    setIsQuestionLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/quizzes/${quizId}/questions`);
      if (response.data.success) {
        setQuestions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsQuestionLoading(false);
    }
  };

  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    fetchQuestions(quiz.id);
  };

  // --- Quiz CRUD ---
  const handleOpenAddQuiz = () => {
    setEditingQuizId(null);
    setQuizFormData({
      title: '',
      description: '',
      difficulty: 'Pemula',
      estimated_minutes: 10,
      icon: 'brain',
      color: '#3B82F6',
      is_active: true
    });
    setErrorMsg('');
    setIsQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setQuizFormData({
      title: quiz.title,
      description: quiz.description || '',
      difficulty: quiz.difficulty || 'Pemula',
      estimated_minutes: quiz.estimated_minutes || 10,
      icon: quiz.icon || 'brain',
      color: quiz.color || '#3B82F6',
      is_active: quiz.is_active === true || quiz.is_active === 1 || quiz.is_active === '1'
    });
    setErrorMsg('');
    setIsQuizModalOpen(true);
  };

  const handleDeleteQuiz = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuizToDelete(id);
  };

  const executeDeleteQuiz = async () => {
    if (quizToDelete === null) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/quizzes/${quizToDelete}`);
      if (res.data.success) {
        fetchQuizzes();
        if (selectedQuiz?.id === quizToDelete) {
          setSelectedQuiz(null);
          setQuestions([]);
        }
      }
    } catch (error) {
      alert("Gagal menghapus quiz.");
    } finally {
      setQuizToDelete(null);
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingQuizId) {
        await axios.put(`http://localhost:8000/api/quizzes/${editingQuizId}`, quizFormData);
      } else {
        await axios.post('http://localhost:8000/api/quizzes', quizFormData);
      }
      setIsQuizModalOpen(false);
      fetchQuizzes();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  // --- Question CRUD ---
  const handleOpenAddQuestion = () => {
    if (!selectedQuiz) return;
    setEditingQuestionId(null);
    setQuestionFormData({
      question: '',
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      correct_answer: 0,
      explanation: ''
    });
    setErrorMsg('');
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQuestionFormData({
      question: q.question,
      option0: q.options[0] || '',
      option1: q.options[1] || '',
      option2: q.options[2] || '',
      option3: q.options[3] || '',
      correct_answer: q.correct_answer,
      explanation: q.explanation || ''
    });
    setErrorMsg('');
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (qId: number) => {
    if (!selectedQuiz) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      try {
        const res = await axios.delete(`http://localhost:8000/api/quizzes/${selectedQuiz.id}/questions/${qId}`);
        if (res.data.success) {
          fetchQuestions(selectedQuiz.id);
          fetchQuizzes(); // Refresh count
        }
      } catch (error) {
        alert("Gagal menghapus soal.");
      }
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return;
    setErrorMsg('');

    const options = [
      questionFormData.option0.trim(),
      questionFormData.option1.trim(),
      questionFormData.option2.trim(),
      questionFormData.option3.trim(),
    ].filter(Boolean);

    if (options.length < 2) {
      setErrorMsg("Minimal buat 2 pilihan jawaban");
      return;
    }

    const payload = {
      question: questionFormData.question,
      options: options,
      correct_answer: questionFormData.correct_answer,
      explanation: questionFormData.explanation
    };

    try {
      if (editingQuestionId) {
        await axios.put(`http://localhost:8000/api/quizzes/${selectedQuiz.id}/questions/${editingQuestionId}`, payload);
      } else {
        await axios.post(`http://localhost:8000/api/quizzes/${selectedQuiz.id}/questions`, payload);
      }
      setIsQuestionModalOpen(false);
      fetchQuestions(selectedQuiz.id);
      fetchQuizzes(); // Refresh count
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  // --- Render ---
  return (
    <AdminLayout title="Manajemen Bank Soal & Kuis">
      {!selectedQuiz ? (
        // --- View 1: Quiz Sets List ---
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari quiz set..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm transition"
              />
            </div>
            <Button 
              onClick={handleOpenAddQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-blue-500/20 font-semibold text-sm h-11"
            >
              <Plus className="w-4.5 h-4.5" />
              Tambah Quiz Set
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {isQuizLoading ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm text-slate-500">Memuat data kuis...</p>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 text-sm">Tidak ada Quiz Set ditemukan.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-100">
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Set</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Tingkat Kesulitan</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Durasi Estimasi</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Soal</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quizzes.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase())).map((quiz) => {
                      const isActive = quiz.is_active === true || quiz.is_active === 1 || quiz.is_active === '1';
                      return (
                        <tr 
                          key={quiz.id} 
                          onClick={() => handleSelectQuiz(quiz)}
                          className={`cursor-pointer transition duration-150 border-l-4 ${
                            isActive 
                              ? 'bg-green-50/20 hover:bg-green-50/40 border-l-emerald-500' 
                              : 'bg-red-50/20 hover:bg-red-50/40 border-l-red-500'
                          }`}
                        >
                          <td className="px-6 py-4 max-w-md">
                            <div className="flex items-start space-x-3">
                              {(() => {
                                const IconObj = AVAILABLE_ICONS.find(i => i.key === quiz.icon)?.Icon || Brain;
                                const isHex = quiz.color?.startsWith('#');
                                const bgStyle = isHex ? { backgroundColor: quiz.color } : {};
                                const bgClass = isHex ? '' : `bg-gradient-to-br ${quiz.color || 'from-indigo-500 to-indigo-600'}`;
                                return (
                                  <div 
                                    style={bgStyle} 
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${bgClass}`}
                                  >
                                    <IconObj className="w-4.5 h-4.5 text-white" />
                                  </div>
                                );
                              })()}
                              <div>
                                <p className="font-semibold text-slate-800 leading-snug">{quiz.title}</p>
                                <p className="text-slate-500 text-xs mt-1 line-clamp-2">{quiz.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              isActive 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                              {isActive ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              quiz.difficulty === 'Pemula' ? 'bg-green-50 text-green-700' :
                              quiz.difficulty === 'Menengah' ? 'bg-blue-50 text-blue-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {quiz.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {quiz.estimated_minutes} Menit
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap font-medium">
                            {quiz.questions_count ?? 0} Soal
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEditQuiz(quiz)} 
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit Quiz Set"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => handleDeleteQuiz(quiz.id, e)} 
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Hapus Quiz Set"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <ChevronRight className="w-5 h-5 text-slate-300 ml-1" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        // --- View 2: Questions List nested under Selected Quiz ---
        <div className="space-y-6">
          {/* Back Header */}
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSelectedQuiz(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition border border-slate-200"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Kuis Terpilih</span>
                <h2 className="text-lg font-bold text-slate-800 leading-snug">{selectedQuiz.title}</h2>
              </div>
            </div>
            <Button 
              onClick={handleOpenAddQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-blue-500/20 font-semibold text-sm h-11"
            >
              <Plus className="w-4.5 h-4.5" />
              Tambah Soal Baru
            </Button>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {isQuestionLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-slate-400 text-sm">Memuat soal kuis...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                <p className="text-slate-400 text-sm">Belum ada soal dalam kuis ini. Silakan tambahkan soal pertama Anda.</p>
              </div>
            ) : (
              questions.map((q, qIndex) => (
                <div key={q.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4 flex-1">
                      {/* Soal */}
                      <div className="flex gap-2 items-start">
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">Soal {qIndex + 1}</span>
                        <p className="font-semibold text-slate-800 text-base">{q.question}</p>
                      </div>

                      {/* Pilihan Jawaban */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                        {q.options.map((opt, oIndex) => {
                          const isCorrect = q.correct_answer === oIndex;
                          return (
                            <div 
                              key={oIndex} 
                              className={`p-3.5 rounded-xl border text-sm flex items-center gap-2 ${
                                isCorrect 
                                  ? 'bg-green-50 border-green-200 text-green-800 font-medium' 
                                  : 'bg-slate-50/50 border-slate-100 text-slate-600'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                                isCorrect 
                                  ? 'bg-green-600 border-green-600 text-white' 
                                  : 'bg-white border-slate-300 text-slate-500'
                              }`}>
                                {String.fromCharCode(65 + oIndex)}
                              </div>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Penjelasan */}
                      {q.explanation && (
                        <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 flex gap-2 items-start">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold block mb-1">Penjelasan/Jawaban Benar:</span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => handleOpenEditQuestion(q)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition border border-slate-100"
                        title="Edit Soal"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-slate-100"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal CRUD Quiz Set */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">
                {editingQuizId ? 'Edit Quiz Set' : 'Tambah Quiz Set Baru'}
              </h2>
              <button onClick={() => setIsQuizModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuizSubmit} className="p-6 space-y-4">
              {errorMsg && <div className="bg-red-50 text-red-600 border border-red-100 text-sm px-4 py-3 rounded-xl">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Quiz Set</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                  value={quizFormData.title}
                  onChange={e => setQuizFormData({...quizFormData, title: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
                  <select 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                    value={quizFormData.difficulty}
                    onChange={e => setQuizFormData({...quizFormData, difficulty: e.target.value as any})}
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Waktu (Menit)</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                    value={quizFormData.estimated_minutes}
                    onChange={e => setQuizFormData({...quizFormData, estimated_minutes: parseInt(e.target.value) || 10})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Warna (Hex)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="w-12 h-11 border-2 border-slate-100 outline-none p-1 rounded-xl transition bg-slate-50/50 cursor-pointer"
                      value={quizFormData.color}
                      onChange={e => setQuizFormData({...quizFormData, color: e.target.value})}
                    />
                    <input
                      type="text"
                      className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none px-2 rounded-xl text-xs font-mono transition bg-slate-50/50 focus:bg-white"
                      value={quizFormData.color}
                      onChange={e => setQuizFormData({...quizFormData, color: e.target.value})}
                      placeholder="#3b82f6"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Publikasi</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setQuizFormData({ ...quizFormData, is_active: true })}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                      quizFormData.is_active
                        ? 'bg-green-50 border-green-500 text-green-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizFormData({ ...quizFormData, is_active: false })}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition ${
                      !quizFormData.is_active
                        ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Icon Kuis</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 border-2 border-slate-100 rounded-xl bg-slate-50/50 max-h-40 overflow-y-auto">
                  {AVAILABLE_ICONS.map(({ key, Icon, label }) => {
                    const isSelected = quizFormData.icon === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setQuizFormData({ ...quizFormData, icon: key })}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold shadow-sm'
                            : 'border-transparent hover:border-slate-200 bg-white text-slate-500'
                        }`}
                        title={label}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] truncate max-w-full">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Kuis</label>
                <textarea 
                  rows={3} 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white resize-none"
                  value={quizFormData.description}
                  onChange={e => setQuizFormData({...quizFormData, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsQuizModalOpen(false)} className="rounded-xl border border-slate-200 text-slate-500 px-5">Batal</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal CRUD Quiz Question */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">
                {editingQuestionId ? 'Edit Soal Kuis' : 'Tambah Soal Baru'}
              </h2>
              <button onClick={() => setIsQuestionModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuestionSubmit} className="p-6 space-y-4">
              {errorMsg && <div className="bg-red-50 text-red-600 border border-red-100 text-sm px-4 py-3 rounded-xl">{errorMsg}</div>}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teks Soal / Pertanyaan</label>
                <textarea 
                  rows={2} 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white resize-none"
                  value={questionFormData.question}
                  onChange={e => setQuestionFormData({...questionFormData, question: e.target.value})}
                  required
                />
              </div>

              {/* Pilihan Jawaban */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Opsi Pilihan Jawaban</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">A</span>
                    <input 
                      type="text" 
                      placeholder="Jawaban A" 
                      className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-2.5 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                      value={questionFormData.option0}
                      onChange={e => setQuestionFormData({...questionFormData, option0: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">B</span>
                    <input 
                      type="text" 
                      placeholder="Jawaban B" 
                      className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-2.5 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                      value={questionFormData.option1}
                      onChange={e => setQuestionFormData({...questionFormData, option1: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">C</span>
                    <input 
                      type="text" 
                      placeholder="Jawaban C" 
                      className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-2.5 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                      value={questionFormData.option2}
                      onChange={e => setQuestionFormData({...questionFormData, option2: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">D</span>
                    <input 
                      type="text" 
                      placeholder="Jawaban D" 
                      className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-2.5 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                      value={questionFormData.option3}
                      onChange={e => setQuestionFormData({...questionFormData, option3: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jawaban yang Benar</label>
                  <select 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                    value={questionFormData.correct_answer}
                    onChange={e => setQuestionFormData({...questionFormData, correct_answer: parseInt(e.target.value)})}
                  >
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                    {questionFormData.option2.trim() && <option value={2}>Pilihan C</option>}
                    {questionFormData.option3.trim() && <option value={3}>Pilihan D</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Penjelasan (Explanation)</label>
                <textarea 
                  rows={3} 
                  placeholder="Mengapa jawaban ini benar? Berikan penjelasan singkat..."
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white resize-none"
                  value={questionFormData.explanation}
                  onChange={e => setQuestionFormData({...questionFormData, explanation: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsQuestionModalOpen(false)} className="rounded-xl border border-slate-200 text-slate-500 px-5">Batal</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Quiz Confirmation Modal */}
      {quizToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setQuizToDelete(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-sm relative z-10 p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-red-100/50">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Hapus Quiz Set?</h3>
            <p className="text-center text-slate-500 text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus Quiz ini? 
              <br />
              <span className="font-semibold text-red-500">Semua pertanyaan di dalamnya akan ikut terhapus.</span> Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setQuizToDelete(null)} 
                className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={executeDeleteQuiz} 
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/30"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
