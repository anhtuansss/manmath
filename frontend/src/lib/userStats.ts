const USER_STATS_KEY = 'manmath:user-stats';

export type UserStats = {
  examsCompleted: number;
  averageScore: number;
  bestScore: number;
  totalQuestionsAnswered: number;
  lastSubmitDate: string | null;
  currentStreak: number;
};

const defaultStats: UserStats = {
  examsCompleted: 0,
  averageScore: 0,
  bestScore: 0,
  totalQuestionsAnswered: 0,
  lastSubmitDate: null,
  currentStreak: 0,
};

export const getUserStats = (): UserStats => {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const data = localStorage.getItem(USER_STATS_KEY);
    if (!data) return defaultStats;
    return { ...defaultStats, ...JSON.parse(data) };
  } catch (e) {
    return defaultStats;
  }
};

export const updateUserStats = (score: number, questionsAnswered: number) => {
  if (typeof window === 'undefined') return;
  const current = getUserStats();
  
  const newExamsCompleted = current.examsCompleted + 1;
  const newTotalQuestions = current.totalQuestionsAnswered + questionsAnswered;
  
  // Update average
  const currentTotalScore = current.averageScore * current.examsCompleted;
  const newAverageScore = (currentTotalScore + score) / newExamsCompleted;
  
  // Update best
  const newBestScore = Math.max(current.bestScore, score);
  
  // Update streak
  let newStreak = current.currentStreak;
  const today = new Date().toISOString().split('T')[0];
  
  if (current.lastSubmitDate) {
    const lastDate = new Date(current.lastSubmitDate);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    } // if diffDays === 0, keep same streak
  } else {
    newStreak = 1;
  }
  
  const newStats: UserStats = {
    examsCompleted: newExamsCompleted,
    averageScore: newAverageScore,
    bestScore: newBestScore,
    totalQuestionsAnswered: newTotalQuestions,
    lastSubmitDate: today,
    currentStreak: newStreak,
  };
  
  try {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(newStats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
};
