export interface ImportanceMetrics {
  recency: number; // امتیاز بر اساس تاریخ (0-100)
  contentScore: number; // امتیاز بر اساس محتوا (0-100)
  lengthScore: number; // امتیاز بر اساس طول محتوا (0-100)
  keywordScore: number; // امتیاز بر اساس کلمات کلیدی مهم (0-100)
  overallImportance: number; // امتیاز کلی (0-100)
}

export interface SessionSummaryWithImportance {
  session: string;
  title: string;
  summary: string;
  date: string;
  duration?: number;
  importance?: ImportanceMetrics;
  isCompressed?: boolean;
  originalLength?: number;
}

export interface CompressionSettings {
  maxAge: number; // حداکثر سن برای فشرده‌سازی (روز)
  importanceThreshold: number; // حد آستانه اهمیت برای فشرده‌سازی
  compressionRatio: number; // نسبت فشرده‌سازی (0-1)
  preserveKeyPhrases: boolean; // حفظ عبارات کلیدی
}

export const useDataImportance = () => {
  // کلمات کلیدی مهم در زمینه مشاوره
  const importantKeywords = [
    // احساسات مهم
    'افسردگی', 'اضطراب', 'استرس', 'ترس', 'خشم', 'غضب', 'نگرانی',
    // اقدامات مهم
    'خودکشی', 'آسیب', 'خشونت', 'اعتیاد', 'مصرف', 'دارو',
    // روابط مهم
    'خانواده', 'ازدواج', 'طلاق', 'فرزند', 'والدین', 'همسر',
    // اهداف درمانی
    'هدف', 'پیشرفت', 'بهبود', 'تغییر', 'مشکل', 'چالش',
    // بحران‌ها
    'بحران', 'فوری', 'اورژانس', 'خطر', 'تهدید'
  ];

  // محاسبه امتیاز تازگی بر اساس تاریخ
  const calculateRecencyScore = (date: string): number => {
    const sessionDate = new Date(date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // امتیاز بالاتر برای جلسات جدیدتر
    if (daysDiff <= 7) return 100;
    if (daysDiff <= 30) return 80;
    if (daysDiff <= 90) return 60;
    if (daysDiff <= 180) return 40;
    if (daysDiff <= 365) return 20;
    return 10;
  };

  // محاسبه امتیاز محتوا بر اساس کلمات کلیدی
  const calculateContentScore = (text: string): number => {
    const lowerText = text.toLowerCase();
    let score = 0;
    let keywordCount = 0;

    importantKeywords.forEach(keyword => {
      const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
      if (matches > 0) {
        keywordCount++;
        score += matches * 10; // هر کلمه کلیدی 10 امتیاز
      }
    });

    // امتیاز اضافی برای تنوع کلمات کلیدی
    score += keywordCount * 5;

    return Math.min(score, 100); // حداکثر 100
  };

  // محاسبه امتیاز طول محتوا
  const calculateLengthScore = (text: string): number => {
    const length = text.length;
    
    // متن‌های کوتاه (کمتر از 50 کاراکتر) - امتیاز پایین
    if (length < 50) return 20;
    
    // متن‌های متوسط (50-200 کاراکتر) - امتیاز متوسط
    if (length <= 200) return 60;
    
    // متن‌های بلند (200-500 کاراکتر) - امتیاز بالا
    if (length <= 500) return 90;
    
    // متن‌های خیلی بلند (بیش از 500 کاراکتر) - امتیاز بالا
    return 100;
  };

  // محاسبه امتیاز کلمات کلیدی خاص
  const calculateKeywordScore = (text: string): number => {
    const criticalKeywords = ['خودکشی', 'آسیب', 'خشونت', 'بحران', 'فوری'];
    const highPriorityKeywords = ['افسردگی', 'اضطراب', 'اعتیاد', 'خانواده'];
    
    let score = 0;
    const lowerText = text.toLowerCase();

    // کلمات بحرانی - امتیاز خیلی بالا
    criticalKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 40;
      }
    });

    // کلمات مهم - امتیاز بالا
    highPriorityKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 20;
      }
    });

    return Math.min(score, 100);
  };

  // محاسبه امتیاز کلی اهمیت
  const calculateOverallImportance = (metrics: Omit<ImportanceMetrics, 'overallImportance'>): number => {
    // وزن‌های مختلف برای معیارهای مختلف
    const weights = {
      recency: 0.3,
      contentScore: 0.3,
      lengthScore: 0.2,
      keywordScore: 0.4 // وزن بیشتر برای کلمات کلیدی
    };

    const weightedSum = 
      metrics.recency * weights.recency +
      metrics.contentScore * weights.contentScore +
      metrics.lengthScore * weights.lengthScore +
      metrics.keywordScore * weights.keywordScore;

    return Math.round(weightedSum);
  };

  // محاسبه کامل امتیاز اهمیت برای یک خلاصه
  const calculateImportanceMetrics = (summary: SessionSummaryWithImportance): ImportanceMetrics => {
    const recency = calculateRecencyScore(summary.date);
    const contentScore = calculateContentScore(summary.summary);
    const lengthScore = calculateLengthScore(summary.summary);
    const keywordScore = calculateKeywordScore(summary.summary);
    
    const metrics = {
      recency,
      contentScore,
      lengthScore,
      keywordScore,
      overallImportance: 0
    };

    metrics.overallImportance = calculateOverallImportance(metrics);

    return metrics;
  };

  // فشرده‌سازی محتوا با حفظ نکات مهم
  const compressContent = (text: string, ratio: number = 0.5, preserveKeyPhrases: boolean = true): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 2) {
      return text; // خیلی کوتاه است، فشرده‌سازی نمی‌شود
    }

    // شناسایی جملات مهم بر اساس کلمات کلیدی
    const sentenceScores = sentences.map(sentence => {
      let score = 0;
      const lowerSentence = sentence.toLowerCase();
      
      importantKeywords.forEach(keyword => {
        if (lowerSentence.includes(keyword)) {
          score += 10;
        }
      });

      return { sentence: sentence.trim(), score };
    });

    // مرتب کردن بر اساس امتیاز
    sentenceScores.sort((a, b) => b.score - a.score);

    // انتخاب جملات برتر
    const targetCount = Math.max(1, Math.floor(sentences.length * ratio));
    const selectedSentences = sentenceScores.slice(0, targetCount);

    // مرتب کردن مجدد بر اساس ترتیب اصلی
    const result = selectedSentences
      .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
      .map(item => item.sentence)
      .join('. ');

    return result + (result.endsWith('.') ? '' : '.');
  };

  // اعمال فشرده‌سازی بر روی آرایه خلاصه‌ها
  const compressSummaries = (
    summaries: SessionSummaryWithImportance[], 
    settings: CompressionSettings
  ): SessionSummaryWithImportance[] => {
    return summaries.map(summary => {
      // محاسبه امتیاز اهمیت اگر وجود ندارد
      if (!summary.importance) {
        summary.importance = calculateImportanceMetrics(summary);
      }

      const daysSinceSession = Math.floor(
        (new Date().getTime() - new Date(summary.date).getTime()) / (1000 * 60 * 60 * 24)
      );

      // اگر جلسه کهنه است و امتیاز اهمیت پایین دارد، فشرده‌سازی می‌شود
      if (
        daysSinceSession > settings.maxAge && 
        summary.importance.overallImportance < settings.importanceThreshold &&
        !summary.isCompressed
      ) {
        const originalSummary = summary.summary;
        const compressedSummary = compressContent(
          originalSummary, 
          settings.compressionRatio, 
          settings.preserveKeyPhrases
        );

        return {
          ...summary,
          summary: compressedSummary,
          isCompressed: true,
          originalLength: originalSummary.length
        };
      }

      return summary;
    });
  };

  // تنظیمات پیش‌فرض فشرده‌سازی
  const defaultCompressionSettings: CompressionSettings = {
    maxAge: 90, // 3 ماه
    importanceThreshold: 40,
    compressionRatio: 0.6,
    preserveKeyPhrases: true
  };

  return {
    calculateImportanceMetrics,
    compressSummaries,
    compressContent,
    defaultCompressionSettings,
    importantKeywords
  };
}; 