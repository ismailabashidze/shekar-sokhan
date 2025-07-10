// Types and mock data for session analysis collections

export type Importance = 'high' | 'medium' | 'low'
export type OverallMood = 'very_good' | 'good' | 'neutral' | 'challenging' | 'difficult'
export type CommunicationQuality = 'excellent' | 'good' | 'developing' | 'needs_attention'
export type UnderstandingLevel = 'high' | 'moderate' | 'growing' | 'initial'
export type TrustLevel = 'strong' | 'building' | 'early_stage'

export interface MainPoint {
  session: string
  title: string
  description: string
  importance: Importance
  actionItems: {
    title: string
    completed: boolean
    dueDate?: string
    icon?: string
  }[]
}

export interface SessionProgress {
  session: string
  strengthsIdentified: {
    strengths: { label: string, icon?: string }[]
    notes?: string
  }
  areasForGrowth: {
    areas: { title: string, reason?: string, suggestedActions?: { title: string, icon?: string }[], icon?: string }[]
    notes?: string
  }
  achievements: {
    achievements: { title: string, date?: string, details?: string, icon?: string }[]
    notes?: string
  }
  nextSteps: {
    steps: { title: string, responsible?: string, dueDate?: string, description?: string, icon?: string }[]
    responsible?: string
    dueDate?: string
  }
}

// Use different names for mock data to avoid conflicts
export interface MockEmotionalJourney {
  session: string
  emojis: string
  overallMood: OverallMood
  moodDescription: string
  keyEmotions: {
    [emotion: string]: number // e.g. { joy: 3, sadness: 1 }
  }
  copingStrategies: {
    strategies: { title: string, icon?: string }[]
    effectiveness: string
  }
}

export interface MockPersonalGrowth {
  session: string
  insights: {
    insights: { text: string, icon?: string }[]
    summary?: string
  }
  learnings: {
    learnings: { text: string, icon?: string }[]
    summary?: string
  }
}

export interface TherapeuticRelationship {
  session: string
  communicationQuality: CommunicationQuality
  understandingLevel: UnderstandingLevel
  trustLevel: TrustLevel
  nextStepsForBetterCommunication: {
    steps: { title: string, icon?: string }[]
    notes?: string
  }
}

export interface MockSessionAnalysisForPatient {
  session: string
  sessionNumber: number
  mainPoints: { title: string, icon?: string }[]
  sessionProgress: string
  emotionalJourney: string
  personalGrowth: string
  therapeuticRelationship: string
}

// Mock Data
export const mockMainPoint: MainPoint = {
  session: 'RELATION_RECORD_ID',
  title: 'تعیین مرزهای سالم',
  description:
    'در این جلسه متوجه شدم که تعیین مرزهای سالم چگونه می‌تواند به بهبود روابط من با دیگران کمک کند. درباره موقعیت‌هایی که مرزهایم نقض شده بود صحبت کردم و احساساتم را بیان کردم. همچنین یاد گرفتم که احترام به مرزهای خودم نشانه خوددوستی است و به من احساس امنیت و آرامش بیشتری می‌دهد.',
  importance: 'high',
  actionItems: [
    { title: 'تمرین گفتن نه در موقعیت‌های روزمره، حتی اگر سخت باشد', completed: false, dueDate: '2025-05-10', icon: '🛑' },
    { title: 'نوشتن خاطرات و احساساتم درباره مرزها و تجربه‌های جدیدم', completed: true, icon: '✍️' },
    { title: 'شناسایی موقعیت‌هایی که مرزهایم رعایت نمی‌شود و تحلیل واکنشم', completed: false, icon: '🔍' },
    { title: 'مطالعه مقاله‌ای درباره مرزهای سالم در روابط', completed: false, icon: '📚' },
  ],
}

export const mockSessionProgress: SessionProgress = {
  session: 'RELATION_RECORD_ID',
  strengthsIdentified: {
    strengths: [
      { label: 'انعطاف‌پذیری', icon: '🌱' },
      { label: 'صداقت', icon: '🤝' },
      { label: 'پذیرش بازخورد', icon: '🧠' },
      { label: 'توانایی فکر کردن قبل از واکنش', icon: '⏳' },
      { label: 'شجاعت در بیان احساسات', icon: '💬' },
    ],
    notes:
      'در این جلسه متوجه شدم که انعطاف‌پذیری و صداقتم به من کمک می‌کند تا روابط بهتری داشته باشم. همچنین توانستم بازخورد درمانگر را بدون احساس تدافعی بپذیرم و درباره احساساتم با شجاعت بیشتری صحبت کنم.',
  },
  areasForGrowth: {
    areas: [
      {
        title: 'جرأت‌مندی',
        reason: 'در جمع‌ها گاهی خودم را کمتر ابراز می‌کنم و از قضاوت دیگران می‌ترسم.',
        icon: '🗣️',
        suggestedActions: [
          { title: 'تمرین بیان احساسات در جمع حتی اگر اضطراب داشته باشم', icon: '🎤' },
          { title: 'شرکت در کارگاه مهارت‌های اجتماعی و تمرین نقش‌آفرینی', icon: '🎭' },
        ],
      },
      {
        title: 'مدیریت استرس',
        reason: 'در موقعیت‌های پراسترس گاهی دچار افکار منفی و بی‌حوصلگی می‌شوم.',
        icon: '😮‍💨',
        suggestedActions: [
          { title: 'تمرین تنفس عمیق و ذهن‌آگاهی هر روز صبح', icon: '🧘‍♂️' },
          { title: 'استفاده از تکنیک‌های آرام‌سازی و یادداشت‌برداری از افکارم', icon: '📝' },
        ],
      },
    ],
    notes:
      'برای رشد شخصی‌ام تصمیم گرفتم مهارت‌های جرأت‌مندی و مدیریت استرس را به طور منظم تمرین کنم. همچنین می‌خواهم بیشتر به احساسات خودم توجه کنم و اجازه ندهم ترس از قضاوت دیگران مانع بیان خودم شود.',
  },
  achievements: {
    achievements: [
      {
        title: 'تکمیل هدف هفتگی',
        date: '2025-04-30',
        details:
          'توانستم هدفی که برای خودم تعیین کرده بودم را تا پایان هفته انجام دهم و احساس موفقیت و رضایت داشتم. این هدف شامل گفتن "نه" به یک درخواست غیرمنطقی بود که قبلاً برایم دشوار بود.',
        icon: '🏆',
      },
      {
        title: 'شرکت فعال در جلسه',
        details:
          'در بحث گروهی بیشتر مشارکت کردم و نظراتم را با اعتماد به نفس بیان کردم. این کار باعث شد احساس ارزشمندی بیشتری داشته باشم.',
        icon: '🙋‍♂️',
      },
      {
        title: 'مدیریت یک موقعیت استرس‌زا',
        details:
          'در یک موقعیت کاری که معمولاً مضطرب می‌شوم، با استفاده از تکنیک تنفس عمیق توانستم آرامشم را حفظ کنم و واکنش بهتری نشان دهم.',
        icon: '😌',
      },
    ],
    notes:
      'پیشرفت خوبی در پیگیری اهدافم داشتم و از اینکه توانستم در موقعیت‌های چالش‌برانگیز بهتر عمل کنم، به خودم افتخار می‌کنم.',
  },
  nextSteps: {
    steps: [
      {
        title: 'گزارش پیشرفت به درمانگر',
        responsible: 'من',
        dueDate: '2025-05-09',
        description: 'در جلسه بعدی خلاصه‌ای از پیشرفت خودم را ارائه خواهم داد و درباره احساساتم نسبت به تمرین مرزگذاری صحبت می‌کنم.',
        icon: '🗒️',
      },
      {
        title: 'تعیین هدف جدید هفتگی',
        responsible: 'من',
        dueDate: '2025-05-16',
        description: 'برای هفته آینده یک هدف جدید درباره تمرین جرأت‌مندی تعیین می‌کنم و سعی می‌کنم آن را در موقعیت‌های واقعی اجرا کنم.',
        icon: '🎯',
      },
      {
        title: 'تمرین روزانه ذهن‌آگاهی',
        responsible: 'من',
        dueDate: '2025-05-16',
        description: 'هر روز حداقل ۵ دقیقه تمرین ذهن‌آگاهی انجام دهم و تاثیر آن را یادداشت کنم.',
        icon: '🧘‍♀️',
      },
    ],
    responsible: 'من',
    dueDate: '2025-05-16',
  },
}

export const mockEmotionalJourney: MockEmotionalJourney = {
  session: 'RELATION_RECORD_ID',
  emojis: '😊😌😐😔',
  overallMood: 'good',
  moodDescription:
    'در ابتدای جلسه کمی مضطرب بودم اما با صحبت کردن درباره احساساتم آرام‌تر شدم. در طول جلسه احساس امیدواری و شادی بیشتری پیدا کردم و در پایان جلسه حس سبکی داشتم. با این حال، هنوز گاهی اضطراب و تردید سراغم می‌آید.',
  keyEmotions: { شادی: 4, اضطراب: 3, امیدواری: 4, تردید: 2, آرامش: 3 },
  copingStrategies: {
    strategies: [
      { title: 'تنفس عمیق و تمرکز بر نفس‌هایم وقتی مضطرب می‌شوم', icon: '🌬️' },
      { title: 'مطالعه کتاب‌های الهام‌بخش برای تقویت روحیه', icon: '📖' },
      { title: 'گفتگو با دوستان نزدیک وقتی احساس تنهایی دارم', icon: '👥' },
      { title: 'نوشتن احساساتم در دفترچه روزانه', icon: '📓' },
    ],
    effectiveness:
      'احساس می‌کنم تکنیک‌های ذهن‌آگاهی و نوشتن احساساتم بیشترین تاثیر را داشتند. صحبت با دوستان هم به کاهش اضطرابم کمک کرد، اما هنوز باید تمرین کنم تا به طور مداوم از این روش‌ها استفاده کنم.',
  },
}

export const mockPersonalGrowth: MockPersonalGrowth = {
  session: 'RELATION_RECORD_ID',
  insights: {
    insights: [
      { text: 'یاد گرفتم باید از خودم مراقبت کنم و این کار خودخواهی نیست.', icon: '🧡' },
      { text: 'فهمیدم تعیین مرزها در روابط چقدر مهم است و باعث احترام بیشتر دیگران به من می‌شود.', icon: '🚧' },
      { text: 'متوجه شدم که احساسات من ارزشمند هستند و باید به آن‌ها توجه کنم.', icon: '💭' },
      { text: 'درک کردم که می‌توانم رفتارها و واکنش‌هایم را تغییر دهم و رشد کنم.', icon: '🌻' },
    ],
    summary:
      'در این جلسه به این نتیجه رسیدم که مراقبت از خود و تعیین مرزها برای آرامش روانم ضروری است. همچنین فهمیدم که رشد شخصی یک فرآیند تدریجی است و باید به خودم فرصت بدهم.',
  },
  learnings: {
    learnings: [
      { text: 'مهارت نه گفتن بدون احساس گناه', icon: '🙅‍♀️' },
      { text: 'ارتباط مؤثر با دیگران و بیان نیازهایم', icon: '📢' },
      { text: 'تشخیص احساساتم و نام‌گذاری آن‌ها', icon: '🔖' },
      { text: 'استفاده از تکنیک‌های آرام‌سازی هنگام استرس', icon: '🧊' },
      { text: 'یادگیری اینکه اشتباه کردن بخشی از مسیر رشد است', icon: '🪜' },
    ],
    summary:
      'در این جلسه مهارت‌هایی را تمرین کردم که می‌توانم در زندگی روزمره‌ام به کار ببرم و به تدریج اعتماد به نفس بیشتری پیدا کنم.',
  },
}

export const mockTherapeuticRelationship: TherapeuticRelationship = {
  session: 'RELATION_RECORD_ID',
  communicationQuality: 'good',
  understandingLevel: 'moderate',
  trustLevel: 'building',
  nextStepsForBetterCommunication: {
    steps: [
      { title: 'در جلسه بعدی احساساتم را شفاف‌تر بیان کنم و از بیان نگرانی‌هایم نترسم', icon: '🗣️' },
      { title: 'سوالات و ابهاماتم را یادداشت کنم تا فراموش نکنم', icon: '📝' },
      { title: 'در صورت نیاز از درمانگر درخواست راهنمایی بیشتر کنم', icon: '🤲' },
    ],
    notes:
      'می‌خواهم ارتباطم با درمانگرم را بازتر و شفاف‌تر کنم تا بهتر بتوانم پیشرفت کنم. گاهی هنوز احساس خجالت دارم اما تصمیم دارم این احساس را مدیریت کنم و بیشتر به خودم اعتماد کنم.',
  },
}

export const mockSessionAnalysisForPatient: SessionAnalysisForPatient = {
  session: 'RELATION_RECORD_ID',
  sessionNumber: 7,
  mainPoints: [
    { title: 'تعیین مرزهای سالم', icon: '🚧' },
    { title: 'تمرین نه گفتن', icon: '🙅‍♂️' },
    { title: 'مدیریت استرس', icon: '😮‍💨' },
    { title: 'تقویت جرأت‌مندی', icon: '🗣️' },
    { title: 'تمرین ذهن‌آگاهی', icon: '🧘‍♂️' },
  ],
  sessionProgress: 'RELATION_RECORD_ID',
  emotionalJourney: 'RELATION_RECORD_ID',
  personalGrowth: 'RELATION_RECORD_ID',
  therapeuticRelationship: 'RELATION_RECORD_ID',
}
