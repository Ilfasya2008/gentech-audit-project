import type { UserProgress } from '../App';
import { getOverallQuizScore } from '../data/quizData';

const SESSION_KEY = 'gentech_current_user'; // stores the email of whoever is logged in
const NAME_SESSION_KEY = 'gentech_current_user_name'; // stores the user's name
const ROLE_SESSION_KEY = 'gentech_current_user_role'; // stores the user's role

/** Returns the localStorage key specific to the given user email. */
function storageKeyFor(email: string): string {
  return `gentech_progress_${email}`;
}

/** Get the currently logged-in user's email (set at login time). */
export function getCurrentUserEmail(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

/** Persist the logged-in user's email so progress can be keyed per-user. */
export function setCurrentUserEmail(email: string): void {
  localStorage.setItem(SESSION_KEY, email);
}

export function getCurrentUserName(): string | null {
  return localStorage.getItem(NAME_SESSION_KEY);
}

export function setCurrentUserName(name: string): void {
  localStorage.setItem(NAME_SESSION_KEY, name);
}

export function getCurrentUserRole(): string | null {
  return localStorage.getItem(ROLE_SESSION_KEY);
}

export function setCurrentUserRole(role: string): void {
  localStorage.setItem(ROLE_SESSION_KEY, role);
}

/** Clear the current user session (call on logout). */
export function clearCurrentUserSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(NAME_SESSION_KEY);
  localStorage.removeItem(ROLE_SESSION_KEY);
}

export function resetUserProgress(): void {
  const email = getCurrentUserEmail();
  if (email) {
    localStorage.removeItem(storageKeyFor(email));
  }
}

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
  xp: 0,
});

export function loadUserProgress(): UserProgress {
  try {
    const email = getCurrentUserEmail();
    if (!email) return defaultUserProgress();
    const raw = localStorage.getItem(storageKeyFor(email));
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
    
    // Calculate derived XP and Level dynamically to ensure consistency
    return computeProgressState(progress);
  } catch {
    return defaultUserProgress();
  }
}

export function loadUserProgressByEmail(email: string): UserProgress {
  try {
    const raw = localStorage.getItem(storageKeyFor(email));
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
    
    // Calculate derived XP and Level dynamically to ensure consistency
    return computeProgressState(progress);
  } catch {
    return defaultUserProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  const email = getCurrentUserEmail();
  if (!email) return; // no session, don't overwrite anything
  
  // Ensure it's fully synced before saving
  const toSave = computeProgressState(progress);
  
  localStorage.setItem(storageKeyFor(email), JSON.stringify(toSave));
}

/**
 * Computes all derived states (badges, XP, Level) to guarantee synchronization.
 */
export function computeProgressState(progress: Omit<UserProgress, 'xp' | 'level' | 'badges'> | UserProgress): UserProgress {
  const next = { ...progress } as UserProgress;
  
  // 1. Sync Badges
  const badges: string[] = [];
  if (next.completedModules >= (next.totalModules || 4) && (next.totalModules || 4) > 0) badges.push('Learning Master');
  if ((next.quizScore || 0) >= 80) badges.push('Quiz Expert');
  if ((next.transactionsFlagged || 0) >= 3) badges.push('Junior Auditor');
  if ((next.transactionsReviewed || 0) >= 5) badges.push('Explorer');
  next.badges = badges;

  // 2. Sync XP and Level
  const { xp, level } = calculateXPAndLevel(next);
  next.xp = xp;
  next.level = level;

  return next;
}

/**
 * Helper to calculate XP and Level based on user's activities.
 * Derived logic ensures XP never desyncs from actual achievements.
 */
export function calculateXPAndLevel(progress: Omit<UserProgress, 'xp' | 'level'> | UserProgress): { xp: number, level: number } {
  let xp = 0;
  
  // 1. Completed Modules (+50 XP each)
  xp += (progress.completedModules || 0) * 50;
  
  // 2. Quiz Score (+100 XP if passed >= 80)
  if ((progress.quizScore || 0) >= 80) {
    xp += 100;
  }
  
  // 3. Transactions Reviewed (+10 XP each)
  xp += (progress.transactionsReviewed || 0) * 10;
  
  // 4. Transactions Flagged (+20 XP each)
  xp += (progress.transactionsFlagged || 0) * 20;
  
  // 5. Badges Earned (+150 XP each)
  xp += ((progress.badges || []).length) * 150;

  // Level thresholds
  let level = 1;
  if (xp >= 1000) level = 5;
  else if (xp >= 500) level = 4;
  else if (xp >= 250) level = 3;
  else if (xp >= 100) level = 2;

  return { xp, level };
}
