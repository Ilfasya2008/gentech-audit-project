import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen User
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen'; // Import Baru
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LearningModule } from './components/LearningModule';
import { QuizScreen } from './components/QuizScreen';
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
  totalModules: number;
  quizScore: number;
  transactionsReviewed: number;
  transactionsFlagged: number;
  badges: string[];
}

export default function App() {
  // --- State Global ---
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [flaggedTransactions, setFlaggedTransactions] = useState<FlaggedTransaction[]>([]);
  
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1, 
    completedModules: 0,
    totalModules: 5,
    quizScore: 0,
    transactionsReviewed: 0,
    transactionsFlagged: 0,
    badges: []
  });

  // --- Handlers ---
  const handleCompleteModule = () => {
    setUserProgress(prev => ({
      ...prev,
      completedModules: Math.min(prev.completedModules + 1, prev.totalModules)
    }));
  };

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

  return (
    <Router>
      <div className="min-h-screen w-full bg-background overflow-x-hidden">
        <div className="w-full min-h-screen bg-white">
          <Routes>
            {/* Redirect bad URLs */}
            <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

            {/* 1. Route Login & Register */}
            <Route path="/" element={<LoginScreen onLogin={() => window.location.href='/admin/dashboard'} />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* 2. Alur User (Onboarding) */}
            <Route path="/welcome" element={<WelcomeScreen onContinue={() => window.location.href='/onboarding'} />} />
            <Route path="/onboarding" element={<OnboardingScreen onComplete={() => window.location.href='/user/dashboard'} />} />
            
            {/* 3. Main Dashboard (Responsive) */}
            <Route path="/user/dashboard" element={
              <Dashboard 
                userProgress={userProgress} 
                navigate={(screen: AppScreen) => window.location.href = `/${screen}`} 
              />
            } />

            {/* 4. Fitur Pembelajaran & Explorer */}
            <Route path="/learning" element={
              <LearningModule 
                onComplete={() => { handleCompleteModule(); window.location.href='/quiz'; }} 
                onNavigate={(screen: AppScreen) => window.location.href = `/${screen}`} 
                progress={userProgress} 
              />
            } />

            <Route path="/quiz" element={
              <QuizScreen 
                onComplete={(score) => { window.location.href='/explorer'; }} 
                onBack={() => window.location.href='/learning'} 
              />
            } />

            <Route path="/explorer" element={
              <TransactionExplorer 
                onSelectTransaction={(tx) => {
                  setSelectedTransaction(tx);
                  window.location.href='/detail';
                }} 
                onNavigate={(screen: AppScreen) => window.location.href = `/${screen}`} 
                flaggedTransactions={flaggedTransactions} 
              />
            } />

            {/* 5. Route Admin Dashboard */}
            <Route path="/admin/dashboard" element={
              <div className="w-full min-h-screen bg-white">
                <AdminDashboard />
              </div>
            } />

          </Routes>
        </div>
      </div>
    </Router>
  );
}