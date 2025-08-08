import { computed } from 'vue'

export type MemoryCategoryId =
  | 'regulation_attention_learning'
  | 'emotional_range_expression_perception'
  | 'mentalizing_reading_capacity_performance'
  | 'differentiation_integrity_identity'
  | 'relationships_intimacy'
  | 'self_esteem_internal_experience_quality'
  | 'control_self_regulation'
  | 'defense_mechanisms'
  | 'adaptability_flexibility_innovation'
  | 'metacognition_insight'
  | 'rules_standards_internal_tests'
  | 'meaning_purpose'

export interface MemoryRecordDraft {
  userId: string
  sessionId?: string | null
  therapistId?: string | null
  text: string
  importance: number
  categories: MemoryCategoryId[]
  source?: 'messaging' | 'system' | 'manual'
}

export const MEMORY_CATEGORIES: Record<MemoryCategoryId, { fa: string; description: string }> = {
  regulation_attention_learning: { fa: 'تنظیم، توجه و یادگیری', description: 'توانایی تمرکز، مدیریت توجه و آموختن' },
  emotional_range_expression_perception: { fa: 'دامنه هیجانی، بیان و درک هیجان', description: 'بیان و درک احساسات' },
  mentalizing_reading_capacity_performance: { fa: 'ظرفیت ذهن‌خوانی و عملکرد', description: 'ذهن‌فهمی و درک نیت‌ها' },
  differentiation_integrity_identity: { fa: 'تمایز و یکپارچگی (هویت)', description: 'ثبات و مشخص بودن خود' },
  relationships_intimacy: { fa: 'روابط و صمیمیت', description: 'نحوه ارتباط و نزدیکی با دیگران' },
  self_esteem_internal_experience_quality: { fa: 'تنظیم عزت‌نفس و کیفیت تجربه درونی', description: 'ارزشمندی خود و کیفیت تجربه' },
  control_self_regulation: { fa: 'کنترل و تنظیم‌کننده', description: 'خودمهاری و خودتنظیمی' },
  defense_mechanisms: { fa: 'عملکرد دفاعی', description: 'الگوهای دفاعی آگاه/ناآگاه' },
  adaptability_flexibility_innovation: { fa: 'سازگاری، انعطاف‌پذیری و نوآوری', description: 'انطباق با تغییر و خلاقیت' },
  metacognition_insight: { fa: 'ظرفیت خودهوشمندی (بینش/شناخت)', description: 'خودبازاندیشی و آگاهی' },
  rules_standards_internal_tests: { fa: 'ساخت و استفاده از استانداردها و آزمون‌های درونی', description: 'قواعد شخصی و ارزیابی' },
  meaning_purpose: { fa: 'معنا و هدفمندی', description: 'اهداف، ارزش‌ها و جهت زندگی' },
}

function scoreImportance(text: string): number {
  // Lightweight heuristic importance score 0..1
  if (!text) return 0
  const normalized = text.replace(/\s+/g, ' ').trim()
  const lengthScore = Math.min(normalized.length / 300, 1)
  const hasNumbers = /\d/.test(normalized) ? 0.2 : 0
  const keywords = [
    'هدف', 'برنامه', 'قرار', 'زمان', 'تاریخ', 'نمی‌توانم', 'می‌خواهم', 'می‌خواهم', 'دوست دارم',
    'حس', 'احساس', 'نگران', 'استرس', 'عصب', 'غم', 'افسرد', 'اضطراب',
    'رابطه', 'دوست', 'خانواده', 'همکار', 'همسر',
  ]
  const keywordHits = keywords.reduce((acc, kw) => acc + (normalized.includes(kw) ? 1 : 0), 0)
  const keywordScore = Math.min(keywordHits / 6, 0.6)
  // Cap importance to 1
  return Math.min(0.15 + lengthScore * 0.5 + hasNumbers + keywordScore, 1)
}

function categorizeHeuristically(text: string): MemoryCategoryId[] {
  const t = text || ''
  const cats: Set<MemoryCategoryId> = new Set()
  if (/(تمرکز|حواس|یادگیری|یاد می|درس|مطالعه|فراموش)/.test(t)) cats.add('regulation_attention_learning')
  if (/(احساس|هیجان|عصبانی|غمگین|شاد|ترس|خشم|گریه|اشک|هیجانی)/.test(t)) cats.add('emotional_range_expression_perception')
  if (/(ذهن|حدس|نیت|درک رفتار|فکر او|چی فکر)/.test(t)) cats.add('mentalizing_reading_capacity_performance')
  if (/(هویت|کی هستم|خود|شخصیت|دوپارگی|تناقض)/.test(t)) cats.add('differentiation_integrity_identity')
  if (/(رابطه|طلاق|ازدواج|دوست|صمیمیت|تنهایی|دعوا)/.test(t)) cats.add('relationships_intimacy')
  if (/(عزت نفس|احترام به نفس|بی ارزشی|گناه|شرم)/.test(t)) cats.add('self_esteem_internal_experience_quality')
  if (/(کنترل|خودکنترلی|تکانه|اعتیاد|پرخوری|تعلل)/.test(t)) cats.add('control_self_regulation')
  if (/(دفاع|انکار|فرافکنی|سرکوب|واکنش وارونه)/.test(t)) cats.add('defense_mechanisms')
  if (/(سازگاری|انعطاف|تغییر|نوآوری|خلاق)/.test(t)) cats.add('adaptability_flexibility_innovation')
  if (/(بینش|خودآگاهی|خودشناسی|فکر کردن به فکر|متاکاگنیشن)/.test(t)) cats.add('metacognition_insight')
  if (/(قانون|استاندارد|باید|نباید|معیار|وجدان)/.test(t)) cats.add('rules_standards_internal_tests')
  if (/(معنا|هدف|جهت|ارزش|رسالت|زندگی)/.test(t)) cats.add('meaning_purpose')
  // Fallback category when nothing matched – choose based on presence of emotion words
  if (cats.size === 0 && /(احساس|هیجان|حس)/.test(t)) cats.add('emotional_range_expression_perception')
  return Array.from(cats)
}

export function useMemory() {
  const nuxtApp = useNuxtApp()
  const userId = computed(() => nuxtApp.$pb?.authStore?.model?.id as string | undefined)
  const mem0Plugin = (nuxtApp as any).$mem0 as { enabled: boolean; apiKey?: string; baseUrl?: string } | undefined

  async function detectMemoryFromMessage(text: string, opts?: { sessionId?: string; therapistId?: string }) {
    const importance = scoreImportance(text)
    const categories = categorizeHeuristically(text)
    const draft: MemoryRecordDraft = {
      userId: userId.value || '',
      sessionId: opts?.sessionId || null,
      therapistId: opts?.therapistId || null,
      text,
      importance,
      categories,
      source: 'messaging',
    }
    return draft
  }

  async function saveMemory(draft: MemoryRecordDraft) {
    if (!nuxtApp.$pb) throw new Error('PocketBase client not available')
    if (!draft.userId) throw new Error('userId is required for saving memory')
    const payload: any = {
      user: draft.userId,
      session: draft.sessionId,
      therapist: draft.therapistId,
      text: draft.text,
      importance: Math.round(draft.importance * 100),
      categories: draft.categories,
      source: draft.source || 'messaging',
    }
    const rec = await nuxtApp.$pb.collection('gpt_5_memories').create(payload)

    // If Mem0 API key is present, mirror memory server-side to avoid exposing the key
    try {
      if (mem0Plugin?.enabled) {
        await $fetch('/api/mem0/memories', {
          method: 'POST',
          body: {
            userId: draft.userId,
            content: draft.text,
            metadata: {
              sessionId: draft.sessionId,
              therapistId: draft.therapistId,
              categories: draft.categories,
              importance: draft.importance,
              source: draft.source,
            },
          },
        })
      }
    }
    catch (e) {
      // Do not block on external memory forwarding; log only
      console.warn('mem0 mirror failed', e)
    }
    return rec
  }

  async function getRelevantMemories(opts: { userId?: string; limit?: number; categories?: MemoryCategoryId[] }) {
    const uid = opts.userId || userId.value
    if (!uid) return []
    const filterParts = [`user="${uid}"`]
    if (opts.categories?.length) {
      // categories is a JSON array field; use PocketBase JSON filter operator ?~ (contains any)
      const list = opts.categories.map(c => `"${c}"`).join(',')
      filterParts.push(`categories ?~ [${list}]`)
    }
    const filter = filterParts.join(' && ')
    const res = await nuxtApp.$pb.collection('gpt_5_memories').getList(1, opts.limit || 5, {
      filter,
      sort: '-importance,-created',
    })
    return res?.items || []
  }

  function summarizeMemoriesForSystem(memories: any[]): string {
    if (!memories?.length) return ''
    const lines = memories.map((m: any, idx: number) => `- (${m.importance}/100) ${m.text}`)
    return `خلاصه حافظه‌های مرتبط کاربر برای کمک به پاسخ‌دهی بهتر:
${lines.join('\n')}`
  }

  return {
    MEMORY_CATEGORIES,
    detectMemoryFromMessage,
    saveMemory,
    getRelevantMemories,
    summarizeMemoriesForSystem,
  }
}


