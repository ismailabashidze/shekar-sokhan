import type { SessionSummaryWithImportance, ImportanceMetrics } from './useDataImportance';

export interface FilterOptions {
  minImportance?: number;
  maxImportance?: number;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  searchQuery?: string;
  tags?: string[];
  onlyCompressed?: boolean;
  onlyUncompressed?: boolean;
  sortBy?: 'date' | 'importance' | 'length' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface TimeBasedGroup {
  label: string;
  items: SessionSummaryWithImportance[];
  importance: 'critical' | 'high' | 'medium' | 'low';
  period: string;
}

export const useSmartFiltering = () => {
  // فیلتر اطلاعات بر اساس گزینه‌های مختلف
  const filterSummaries = (
    summaries: SessionSummaryWithImportance[],
    options: FilterOptions,
  ): SessionSummaryWithImportance[] => {
    let filtered = [...summaries];

    // فیلتر بر اساس حد آستانه اهمیت
    if (options.minImportance !== undefined) {
      filtered = filtered.filter(summary =>
        (summary.importance?.overallImportance || 0) >= options.minImportance!,
      );
    }

    if (options.maxImportance !== undefined) {
      filtered = filtered.filter(summary =>
        (summary.importance?.overallImportance || 0) <= options.maxImportance!,
      );
    }

    // فیلتر بر اساس بازه زمانی
    if (options.dateRange?.start) {
      filtered = filtered.filter(summary =>
        new Date(summary.date) >= options.dateRange!.start!,
      );
    }

    if (options.dateRange?.end) {
      filtered = filtered.filter(summary =>
        new Date(summary.date) <= options.dateRange!.end!,
      );
    }

    // فیلتر بر اساس جستجوی متنی
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(summary =>
        summary.title.toLowerCase().includes(query)
        || summary.summary.toLowerCase().includes(query),
      );
    }

    // فیلتر بر اساس وضعیت فشرده‌سازی
    if (options.onlyCompressed) {
      filtered = filtered.filter(summary => summary.isCompressed === true);
    }

    if (options.onlyUncompressed) {
      filtered = filtered.filter(summary => !summary.isCompressed);
    }

    // مرتب‌سازی
    if (options.sortBy) {
      filtered = sortSummaries(filtered, options.sortBy, options.sortOrder || 'desc');
    }

    return filtered;
  };

  // مرتب‌سازی خلاصه‌ها
  const sortSummaries = (
    summaries: SessionSummaryWithImportance[],
    sortBy: FilterOptions['sortBy'],
    order: 'asc' | 'desc',
  ): SessionSummaryWithImportance[] => {
    return [...summaries].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'importance':
          comparison = (a.importance?.overallImportance || 0) - (b.importance?.overallImportance || 0);
          break;
        case 'length':
          comparison = a.summary.length - b.summary.length;
          break;
        case 'relevance':
          // مرتب‌سازی بر اساس ترکیب اهمیت و تازگی
          const scoreA = (a.importance?.overallImportance || 0) + (a.importance?.recency || 0) * 0.3;
          const scoreB = (b.importance?.overallImportance || 0) + (b.importance?.recency || 0) * 0.3;
          comparison = scoreA - scoreB;
          break;
        default:
          return 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  };

  // گروه‌بندی بر اساس زمان
  const groupByTimeBasedImportance = (summaries: SessionSummaryWithImportance[]): TimeBasedGroup[] => {
    const now = new Date();
    const groups: TimeBasedGroup[] = [
      { label: 'جلسات اخیر (هفته گذشته)', items: [], importance: 'critical', period: 'recent' },
      { label: 'جلسات این ماه', items: [], importance: 'high', period: 'thisMonth' },
      { label: 'جلسات ۳ ماه گذشته', items: [], importance: 'medium', period: 'lastThreeMonths' },
      { label: 'جلسات قدیمی‌تر', items: [], importance: 'low', period: 'older' },
    ];

    summaries.forEach((summary) => {
      const sessionDate = new Date(summary.date);
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 7) {
        groups[0].items.push(summary);
      }
      else if (daysDiff <= 30) {
        groups[1].items.push(summary);
      }
      else if (daysDiff <= 90) {
        groups[2].items.push(summary);
      }
      else {
        groups[3].items.push(summary);
      }
    });

    // مرتب‌سازی درون هر گروه بر اساس اهمیت
    groups.forEach((group) => {
      group.items = sortSummaries(group.items, 'importance', 'desc');
    });

    // فیلتر گروه‌های خالی
    return groups.filter(group => group.items.length > 0);
  };

  // تشخیص جلسات مهم که نباید فشرده شوند
  const getProtectedSummaries = (summaries: SessionSummaryWithImportance[]): SessionSummaryWithImportance[] => {
    return summaries.filter((summary) => {
      const importance = summary.importance?.overallImportance || 0;
      const keywordScore = summary.importance?.keywordScore || 0;

      // حفاظت از جلسات با اهمیت بالا یا حاوی کلمات کلیدی مهم
      return importance >= 70 || keywordScore >= 40;
    });
  };

  // جستجوی هوشمند با امتیازدهی نتایج
  const smartSearch = (summaries: SessionSummaryWithImportance[], query: string): SessionSummaryWithImportance[] => {
    if (!query.trim()) return summaries;

    const queryLower = query.toLowerCase();
    const searchResults = summaries.map((summary) => {
      let relevanceScore = 0;

      // امتیاز برای تطبیق در عنوان (وزن بیشتر)
      if (summary.title.toLowerCase().includes(queryLower)) {
        relevanceScore += 50;
      }

      // امتیاز برای تطبیق در متن خلاصه
      const summaryMatches = (summary.summary.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length;
      relevanceScore += summaryMatches * 10;

      // امتیاز اضافی بر اساس اهمیت کلی
      relevanceScore += (summary.importance?.overallImportance || 0) * 0.5;

      return {
        ...summary,
        relevanceScore,
      };
    });

    // فیلتر نتایج مرتبط و مرتب‌سازی بر اساس امتیاز
    return searchResults
      .filter(item => item.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(({ relevanceScore, ...summary }) => summary);
  };

  // تحلیل الگوهای زمانی
  const analyzeTemporalPatterns = (summaries: SessionSummaryWithImportance[]) => {
    const patterns = {
      sessionFrequency: 0,
      averageImportance: 0,
      importanceTrend: 'stable' as 'increasing' | 'decreasing' | 'stable',
      criticalSessionsCount: 0,
      compressionRate: 0,
    };

    if (summaries.length === 0) return patterns;

    // محاسبه میانگین اهمیت
    const totalImportance = summaries.reduce((sum, s) => sum + (s.importance?.overallImportance || 0), 0);
    patterns.averageImportance = totalImportance / summaries.length;

    // شمارش جلسات بحرانی
    patterns.criticalSessionsCount = summaries.filter(s =>
      (s.importance?.overallImportance || 0) >= 80,
    ).length;

    // محاسبه نرخ فشرده‌سازی
    const compressedCount = summaries.filter(s => s.isCompressed).length;
    patterns.compressionRate = (compressedCount / summaries.length) * 100;

    // تحلیل روند اهمیت (بر اساس جلسات اخیر در مقابل قدیمی)
    const sortedByDate = [...summaries].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const recentSessions = sortedByDate.slice(0, Math.ceil(summaries.length * 0.3));
    const olderSessions = sortedByDate.slice(-Math.ceil(summaries.length * 0.3));

    if (recentSessions.length > 0 && olderSessions.length > 0) {
      const recentAvg = recentSessions.reduce((sum, s) => sum + (s.importance?.overallImportance || 0), 0) / recentSessions.length;
      const olderAvg = olderSessions.reduce((sum, s) => sum + (s.importance?.overallImportance || 0), 0) / olderSessions.length;

      if (recentAvg > olderAvg + 10) {
        patterns.importanceTrend = 'increasing';
      }
      else if (recentAvg < olderAvg - 10) {
        patterns.importanceTrend = 'decreasing';
      }
    }

    return patterns;
  };

  // پیش‌تنظیمات فیلتر
  const getFilterPresets = () => ({
    critical: {
      label: 'جلسات بحرانی',
      options: { minImportance: 80, sortBy: 'importance' as const, sortOrder: 'desc' as const },
    },
    recent: {
      label: 'جلسات اخیر',
      options: {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        sortBy: 'date' as const,
        sortOrder: 'desc' as const,
      },
    },
    compressed: {
      label: 'جلسات فشرده شده',
      options: { onlyCompressed: true, sortBy: 'date' as const, sortOrder: 'desc' as const },
    },
    important: {
      label: 'جلسات مهم',
      options: { minImportance: 60, sortBy: 'relevance' as const, sortOrder: 'desc' as const },
    },
  });

  return {
    filterSummaries,
    sortSummaries,
    groupByTimeBasedImportance,
    getProtectedSummaries,
    smartSearch,
    analyzeTemporalPatterns,
    getFilterPresets,
  };
};
