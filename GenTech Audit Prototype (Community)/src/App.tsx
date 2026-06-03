import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { loadUserProgress, saveUserProgress, getCurrentUserRole, getCurrentUserEmail, computeProgressState } from './lib/userProgress';
import { getOverallQuizScore } from './data/quizData';

// Import Komponen User
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen'; // Import Baru
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LearningModule } from './components/LearningModule';
import { QuizScreen } from './components/QuizScreen';
import { QuizDashboard } from './components/QuizDashboard';
import { TransactionExplorer } from './components/TransactionExplorer';
import { TransactionDetail } from './components/TransactionDetail';
import { BlockchainProof } from './components/BlockchainProof';
import { AuditReport } from './components/AuditReport';
import { DashboardSummary } from './components/DashboardSummary';
import Dashboard from './components/Dashboard';

// Import Komponen Admin
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ModuleManagement from './components/admin/ModuleManagement';
import QuizManagement from './components/admin/QuizManagement';
import TransactionManagement from './components/admin/TransactionManagement';
import FaqManagement from './components/admin/FaqManagement';

// --- Types & Interfaces ---
export type AppScreen = 'learning' | 'quiz' | 'explorer' | 'report' | 'summary' | string;

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  blockNumber: number | string;
  hash: string;
  gasUsed: number;
  status: 'success' | 'pending' | 'failed';
}

export interface FlaggedTransaction extends Transaction {
  flagNote: string;
  flaggedAt: string;
}

export interface UserProgress {
  level: number;
  completedModules: number;
  completedModuleIds: number[];
  totalModules: number;
  quizScore: number;
  quizScores: Record<string, number>;
  transactionsReviewed: number;
  transactionsFlagged: number;
  badges: string[];
  xp: number;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const role = getCurrentUserRole();
  if (role !== 'admin') {
    return <Navigate to="/user/dashboard" replace />;
  }
  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const email = getCurrentUserEmail();
  if (!email) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [flaggedTransactions, setFlaggedTransactions] = useState<FlaggedTransaction[]>(() => {
    const saved = localStorage.getItem('audit_flagged_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress);

  useEffect(() => {
    saveUserProgress(userProgress);
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('audit_flagged_transactions', JSON.stringify(flaggedTransactions));
    
    // Auto-sync dashboard count with actual flagged list
    setUserProgress(prev => {
      if (prev.transactionsFlagged !== flaggedTransactions.length) {
        return computeProgressState({ ...prev, transactionsFlagged: flaggedTransactions.length });
      }
      return prev;
    });
  }, [flaggedTransactions]);

  const goTo = useCallback((path: string) => navigate(path), [navigate]);

  const handleCompleteModule = (moduleId: number) => {
    setUserProgress(prev => {
      if (prev.completedModuleIds.includes(moduleId)) return prev;
      const completedModuleIds = [...prev.completedModuleIds, moduleId];
      return computeProgressState({
        ...prev,
        completedModuleIds,
        completedModules: completedModuleIds.length,
      });
    });
  };

  const setTotalModules = (count: number) => {
    setUserProgress(prev =>
      prev.totalModules === count ? prev : computeProgressState({ ...prev, totalModules: count })
    );
  };

  const handleQuizComplete = (quizId: string, score: number) => {
    setUserProgress(prev => {
      const previous = prev.quizScores[quizId] ?? 0;
      const best = Math.max(previous, score);
      const quizScores = { ...prev.quizScores, [quizId]: best };
      return computeProgressState({
        ...prev,
        quizScores,
        quizScore: getOverallQuizScore(quizScores),
      });
    });
    goTo('/quiz');
  };

  function QuizPlayRoute() {
    const { quizId } = useParams<{ quizId: string }>();
    const [apiQuiz, setApiQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!quizId) { setLoading(false); return; }
      fetch(`http://localhost:8000/api/quizzes/${quizId}`, {
        headers: { 'Accept': 'application/json' },
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data) {
            // Normalize API quiz to match QuizScreen expectations
            const raw = data.data;
            setApiQuiz({
              id: String(raw.id),
              title: raw.title,
              description: raw.description,
              difficulty: raw.difficulty,
              estimatedMinutes: raw.estimated_minutes,
              icon: raw.icon as 'brain' | 'shield' | 'search',
              color: raw.color,
              questions: (raw.questions ?? []).map((q: any) => ({
                id: q.id,
                question: q.question,
                options: Array.isArray(q.options) ? q.options : JSON.parse(q.options ?? '[]'),
                correctAnswer: q.correct_answer,
                explanation: q.explanation ?? '',
              })),
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [quizId]);

    if (loading) {
      return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat kuis...</div>;
    }

    if (!apiQuiz || apiQuiz.questions.length === 0) {
      return <Navigate to="/quiz" replace />;
    }

    return (
      <QuizScreen
        quiz={apiQuiz}
        previousBestScore={userProgress.quizScores[apiQuiz.id]}
        onComplete={score => handleQuizComplete(apiQuiz.id, score)}
        onBack={() => goTo('/quiz')}
      />
    );
  }

  const handleFlagTransaction = (transaction: Transaction, note: string) => {
    const flagged: FlaggedTransaction = {
      ...transaction,
      flagNote: note,
      flaggedAt: new Date().toISOString()
    };
    
    // Gunakan filter untuk mencegah duplikasi jika transaksi yang sama ditandai lagi
    setFlaggedTransactions(prev => {
      const filtered = prev.filter(t => t.id !== transaction.id);
      return [...filtered, flagged];
    });
  };

  const screenToPath: Record<string, string> = {
    dashboard: '/user/dashboard',
    learning: '/learning',
    quiz: '/quiz',
    explorer: '/explorer',
    report: '/report',
    summary: '/summary',
  };

  const navigateToScreen = (screen: AppScreen) => {
    goTo(screenToPath[screen] ?? `/${screen}`);
  };

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <div className="w-full min-h-screen bg-white">
        <Routes>
          <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

          <Route path="/" element={<LoginScreen onLogin={() => goTo('/admin/dashboard')} />} />
          <Route path="/register" element={<RegisterScreen />} />

          <Route path="/welcome" element={<WelcomeScreen onContinue={() => goTo('/user/dashboard')} />} />

          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute>
                <Dashboard
                  userProgress={userProgress}
                  onTotalModulesLoaded={setTotalModules}
                  navigate={navigateToScreen}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/summary"
            element={
              <PrivateRoute>
                <DashboardSummary
                  progress={userProgress}
                  onNavigate={navigateToScreen}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/learning"
            element={
              <PrivateRoute>
                <LearningModule
                  onModuleComplete={handleCompleteModule}
                  onAllModulesComplete={() => goTo('/quiz')}
                  onNavigate={navigateToScreen}
                  onTotalModulesLoaded={setTotalModules}
                  progress={userProgress}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/quiz"
            element={
              <PrivateRoute>
                <QuizDashboard
                  userProgress={userProgress}
                  onSelectQuiz={id => goTo(`/quiz/${id}`)}
                  onNavigateHome={() => goTo('/user/dashboard')}
                />
              </PrivateRoute>
            }
          />

          <Route path="/quiz/:quizId" element={<PrivateRoute><QuizPlayRoute /></PrivateRoute>} />

          <Route
            path="/explorer"
            element={
              <PrivateRoute>
                <TransactionExplorer
                  onSelectTransaction={(tx) => {
                    setSelectedTransaction(tx);
                    setUserProgress(prev => computeProgressState({
                      ...prev,
                      transactionsReviewed: prev.transactionsReviewed + 1
                    }));
                    goTo('/detail');
                  }}
                  onNavigate={navigateToScreen}
                  flaggedTransactions={flaggedTransactions}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/detail"
            element={
              <PrivateRoute>
                {selectedTransaction ? (
                  <TransactionDetail
                    transaction={selectedTransaction}
                    isFlagged={flaggedTransactions.some(f => f.id === selectedTransaction.id)}
                    onFlag={(note) => {
                      handleFlagTransaction(selectedTransaction, note);
                      goTo('/explorer');
                    }}
                    onViewProof={() => goTo('/proof')}
                    onBack={() => goTo('/explorer')}
                  />
                ) : (
                  <Navigate to="/explorer" replace />
                )}
              </PrivateRoute>
            }
          />

          <Route
            path="/proof"
            element={
              <PrivateRoute>
                {selectedTransaction ? (
                  <BlockchainProof
                    transaction={selectedTransaction}
                    onBack={() => goTo('/detail')}
                    onGenerateReport={() => goTo('/report')}
                  />
                ) : (
                  <Navigate to="/explorer" replace />
                )}
              </PrivateRoute>
            }
          />

          <Route
            path="/report"
            element={
              <PrivateRoute>
                <AuditReport 
                  flaggedTransactions={flaggedTransactions}
                  onBack={() => goTo('/explorer')}
                  onViewDashboard={() => goTo('/user/dashboard')}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute><UserManagement /></AdminRoute>}
          />
          <Route
            path="/admin/modules"
            element={<AdminRoute><ModuleManagement /></AdminRoute>}
          />
          <Route
            path="/admin/quizzes"
            element={<AdminRoute><QuizManagement /></AdminRoute>}
          />
          <Route
            path="/admin/transactions"
            element={<AdminRoute><TransactionManagement /></AdminRoute>}
          />
          <Route
            path="/admin/faqs"
            element={<AdminRoute><FaqManagement /></AdminRoute>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}