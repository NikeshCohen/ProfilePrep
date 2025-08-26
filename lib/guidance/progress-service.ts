interface TopicProgress {
  topicId: string;
  userId: string;
  completed: boolean;
  progress: number;
  lastAccessed: Date;
  sectionsCompleted: string[];
  timeSpent: number; // in minutes
  bookmarked: boolean;
}

interface GuidanceAnalytics {
  userId: string;
  totalTopicsCompleted: number;
  totalTimeSpent: number; // in minutes
  averageProgress: number;
  lastActive: Date;
  streakDays: number;
  topicsInProgress: string[];
  completedTopics: string[];
  preferredTopics: string[]; // Based on engagement
}

class GuidanceProgressService {
  private static instance: GuidanceProgressService;

  private constructor() {}

  static getInstance(): GuidanceProgressService {
    if (!this.instance) {
      this.instance = new GuidanceProgressService();
    }
    return this.instance;
  }

  // Save progress to localStorage and optionally to database
  async saveProgress(
    userId: string,
    topicId: string,
    progress: Partial<TopicProgress>,
  ): Promise<void> {
    const storageKey = `guidance_progress_${userId}`;
    const existingData = this.getLocalProgress(userId);

    existingData[topicId] = {
      ...existingData[topicId],
      ...progress,
      lastAccessed: new Date(),
      userId,
      topicId,
    };

    localStorage.setItem(storageKey, JSON.stringify(existingData));

    // Optionally sync to database
    if (progress.completed || progress.progress === 100) {
      await this.syncToDatabase(userId, topicId, existingData[topicId]);
    }
  }

  // Get progress for all topics
  getLocalProgress(userId: string): Record<string, TopicProgress> {
    const storageKey = `guidance_progress_${userId}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  // Get progress for a specific topic
  getTopicProgress(userId: string, topicId: string): TopicProgress | null {
    const allProgress = this.getLocalProgress(userId);
    return allProgress[topicId] || null;
  }

  // Calculate overall analytics
  calculateAnalytics(userId: string): GuidanceAnalytics {
    const allProgress = this.getLocalProgress(userId);
    const progressValues = Object.values(allProgress);

    const completedTopics = progressValues
      .filter((p) => p.completed)
      .map((p) => p.topicId);

    const topicsInProgress = progressValues
      .filter((p) => !p.completed && p.progress > 0)
      .map((p) => p.topicId);

    const totalTimeSpent = progressValues.reduce(
      (sum, p) => sum + (p.timeSpent || 0),
      0,
    );

    const averageProgress =
      progressValues.length > 0
        ? progressValues.reduce((sum, p) => sum + (p.progress || 0), 0) /
          progressValues.length
        : 0;

    const lastActive =
      progressValues
        .map((p) => new Date(p.lastAccessed))
        .sort((a, b) => b.getTime() - a.getTime())[0] || new Date();

    // Calculate streak (simplified - counts consecutive days with activity)
    const streakDays = this.calculateStreak(progressValues);

    // Determine preferred topics based on time spent and progress
    const preferredTopics = this.calculatePreferredTopics(progressValues);

    return {
      userId,
      totalTopicsCompleted: completedTopics.length,
      totalTimeSpent,
      averageProgress,
      lastActive,
      streakDays,
      topicsInProgress,
      completedTopics,
      preferredTopics,
    };
  }

  // Track time spent on a topic
  trackTimeSpent(userId: string, topicId: string, minutes: number): void {
    const progress =
      this.getTopicProgress(userId, topicId) || ({} as TopicProgress);
    this.saveProgress(userId, topicId, {
      timeSpent: (progress.timeSpent || 0) + minutes,
    });
  }

  // Mark section as complete
  markSectionComplete(
    userId: string,
    topicId: string,
    sectionId: string,
  ): void {
    const progress =
      this.getTopicProgress(userId, topicId) || ({} as TopicProgress);
    const sectionsCompleted = progress.sectionsCompleted || [];

    if (!sectionsCompleted.includes(sectionId)) {
      sectionsCompleted.push(sectionId);
      this.saveProgress(userId, topicId, { sectionsCompleted });
    }
  }

  // Toggle bookmark status
  toggleBookmark(userId: string, topicId: string): void {
    const progress =
      this.getTopicProgress(userId, topicId) || ({} as TopicProgress);
    this.saveProgress(userId, topicId, {
      bookmarked: !progress.bookmarked,
    });
  }

  // Get recommended next topics based on progress and prerequisites
  getRecommendedTopics(
    userId: string,
    allTopics: Array<{ id: string; prerequisites: string[] }>,
    maxRecommendations: number = 3,
  ): string[] {
    const progress = this.getLocalProgress(userId);
    const completedTopics = Object.entries(progress)
      .filter(([, p]) => p.completed)
      .map(([id]) => id);

    // Filter topics that:
    // 1. Are not completed
    // 2. Have all prerequisites completed
    // 3. Are either in progress or not started
    const eligibleTopics = allTopics.filter((topic) => {
      const isCompleted = completedTopics.includes(topic.id);
      const prerequisitesMet = topic.prerequisites.every((prereq: string) =>
        completedTopics.includes(prereq),
      );

      return !isCompleted && prerequisitesMet;
    });

    // Sort by progress (in-progress first) and return top N
    return eligibleTopics
      .sort((a, b) => {
        const progressA = progress[a.id]?.progress || 0;
        const progressB = progress[b.id]?.progress || 0;
        return progressB - progressA;
      })
      .slice(0, maxRecommendations)
      .map((topic) => topic.id);
  }

  // Private helper methods
  private async syncToDatabase(
    userId: string,
    topicId: string,
    progress: TopicProgress,
  ): Promise<void> {
    try {
      await fetch("/api/user/guidance/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, topicId, progress }),
      });
    } catch (error) {
      console.error("Failed to sync progress to database:", error);
    }
  }

  private calculateStreak(progressValues: TopicProgress[]): number {
    if (progressValues.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeDates = progressValues
      .map((p) => {
        const date = new Date(p.lastAccessed);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = today.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    for (const activeDate of activeDates) {
      if (Math.abs(currentDate - activeDate) <= oneDay) {
        streak++;
        currentDate = activeDate;
      } else {
        break;
      }
    }

    return streak;
  }

  private calculatePreferredTopics(progressValues: TopicProgress[]): string[] {
    return progressValues
      .filter((p) => p.timeSpent > 0)
      .sort((a, b) => {
        // Sort by engagement score (time spent * progress)
        const scoreA = (a.timeSpent || 0) * (a.progress || 0);
        const scoreB = (b.timeSpent || 0) * (b.progress || 0);
        return scoreB - scoreA;
      })
      .slice(0, 3)
      .map((p) => p.topicId);
  }

  // Export progress data for user
  exportProgress(userId: string): string {
    const progress = this.getLocalProgress(userId);
    const analytics = this.calculateAnalytics(userId);

    const exportData = {
      userId,
      exportDate: new Date().toISOString(),
      analytics,
      topicProgress: progress,
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Import progress data
  importProgress(userId: string, jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      if (importData.userId !== userId) {
        console.warn("User ID mismatch in import data");
        return false;
      }

      const storageKey = `guidance_progress_${userId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify(importData.topicProgress),
      );
      return true;
    } catch (error) {
      console.error("Failed to import progress data:", error);
      return false;
    }
  }

  // Clear all progress for a user
  clearProgress(userId: string): void {
    const storageKey = `guidance_progress_${userId}`;
    localStorage.removeItem(storageKey);
  }
}

export const guidanceProgressService = GuidanceProgressService.getInstance();

// Hooks for React components
export function useGuidanceProgress(userId: string) {
  const saveProgress = (topicId: string, progress: Partial<TopicProgress>) =>
    guidanceProgressService.saveProgress(userId, topicId, progress);

  const getProgress = (topicId?: string) =>
    topicId
      ? guidanceProgressService.getTopicProgress(userId, topicId)
      : guidanceProgressService.getLocalProgress(userId);

  const getAnalytics = () => guidanceProgressService.calculateAnalytics(userId);

  const trackTime = (topicId: string, minutes: number) =>
    guidanceProgressService.trackTimeSpent(userId, topicId, minutes);

  const toggleBookmark = (topicId: string) =>
    guidanceProgressService.toggleBookmark(userId, topicId);

  return {
    saveProgress,
    getProgress,
    getAnalytics,
    trackTime,
    toggleBookmark,
  };
}
