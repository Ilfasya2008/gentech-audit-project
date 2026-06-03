import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { loadUserProgress, saveUserProgress } from './lib/userProgress';
import { getQuizById, getOverallQuizScore } from './data/quizData';

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
import Dashboard from './components/Dashboard';

// Import Komponen Admin
import AdminDashboard from './components/admin/AdminDashboard';

// --- Types & Interfaces ---
export type AppScreen = 'learning' | 'quiz' | 'explorer' | 'report' | 'summary' | string;

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  blockNumber: number;
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
}

function AppRoutes() {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [flaggedTransactions, setFlaggedTransactions] = useState<FlaggedTransaction[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress);

  useEffect(() => {
    saveUserProgress(userProgress);
  }, [userProgress]);

  const goTo = useCallback((path: string) => navigate(path), [navigate]);

  const handleCompleteModule = (moduleId: number) => {
    setUserProgress(prev => {
      if (prev.completedModuleIds.includes(moduleId)) return prev;
      const completedModuleIds = [...prev.completedModuleIds, moduleId];
      return {
        ...prev,
        completedModuleIds,
        completedModules: completedModuleIds.length,
      };
    });
  };

  const setTotalModules = (count: number) => {
    setUserProgress(prev =>
      prev.totalModules === count ? prev : { ...prev, totalModules: count }
    );
  };

  const handleQuizComplete = (quizId: string, score: number) => {
    setUserProgress(prev => {
      const previous = prev.quizScores[quizId] ?? 0;
      const best = Math.max(previous, score);
      const quizScores = { ...prev.quizScores, [quizId]: best };
      const badges = [...prev.badges];
      if (score >= 80 && !badges.includes('Quiz Expert')) {
        badges.push('Quiz Expert');
      }
      return {
        ...prev,
        quizScores,
        quizScore: getOverallQuizScore(quizScores),
        badges,
      };
    });
    goTo('/quiz');
  };

  function QuizPlayRoute() {
    const { quizId } = useParams<{ quizId: string }>();
    const quiz = quizId ? getQuizById(quizId) : undefined;

    if (!quiz) {
      return <Navigate to="/quiz" replace />;
    }

    return (
      <QuizScreen
        quiz={quiz}
        previousBestScore={userProgress.quizScores[quiz.id]}
        onComplete={score => handleQuizComplete(quiz.id, score)}
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
    setFlaggedTransactions(prev => [...prev, flagged]);
    
    setUserProgress(prev => ({
      ...prev,
      transactionsFlagged: prev.transactionsFlagged + 1
    }));
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

          <Route path="/welcome" element={<WelcomeScreen onContinue={() => goTo('/onboarding')} />} />
          <Route path="/onboarding" element={<OnboardingScreen onComplete={() => goTo('/user/dashboard')} />} />

          <Route
            path="/user/dashboard"
            element={
              <Dashboard
                userProgress={userProgress}
                onTotalModulesLoaded={setTotalModules}
                navigate={navigateToScreen}
              />
            }
          />

          <Route
            path="/learning"
            element={
              <LearningModule
                onModuleComplete={handleCompleteModule}
                onAllModulesComplete={() => goTo('/quiz')}
                onNavigate={navigateToScreen}
                onTotalModulesLoaded={setTotalModules}
                progress={userProgress}
              />
            }
          />

          <Route
            path="/quiz"
            element={
              <QuizDashboard
                userProgress={userProgress}
                onSelectQuiz={id => goTo(`/quiz/${id}`)}
                onNavigateHome={() => goTo('/user/dashboard')}
              />
            }
          />

          <Route path="/quiz/:quizId" element={<QuizPlayRoute />} />

          <Route
            path="/explorer"
            element={
              <TransactionExplorer
                onSelectTransaction={(tx) => {
                  setSelectedTransaction(tx);
                  goTo('/detail');
                }}
                onNavigate={navigateToScreen}
                flaggedTransactions={flaggedTransactions}
              />
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <div className="w-full min-h-screen bg-white">
                <AdminDashboard />
              </div>
            }
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