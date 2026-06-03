import type { UserProgress } from '../App';
import { getOverallQuizScore } from '../data/quizData';

const STORAGE_KEY = 'gentech_user_progress';

export const defaultUserProgress = (): UserProgress => ({
  level: 1,
  completedModules: 0,
  completedModuleIds: [],
  totalModules: 0,
  quizScore: 0,
  quizScores: {},
  transactionsReviewed: 0,
  transactionsFlagged: 0,
  badges: [],
});

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserProgress();
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const quizScores =
      parsed.quizScores && typeof parsed.quizScores === 'object'
        ? parsed.quizScores
        : parsed.quizScore && parsed.quizScore > 0
          ? { 'blockchain-basics': parsed.quizScore }
          : {};

    const progress: UserProgress = {
      ...defaultUserProgress(),
      ...parsed,
      completedModuleIds: Array.isArray(parsed.completedModuleIds)
        ? parsed.completedModuleIds
        : [],
      quizScores,
      quizScore: getOverallQuizScore(quizScores),
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
    };
    return progress;
  } catch {
    return defaultUserProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
