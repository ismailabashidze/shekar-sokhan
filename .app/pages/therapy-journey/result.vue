<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: 'سفر درمانی - تعیین اهداف درمانی',
  layout: 'empty',
  preview: {
    title: 'سفر درمانی - تعیین اهداف درمانی',
    description: 'تنظیم اهداف درمانی بر اساس ارزیابی اولیه',
    categories: ['therapy', 'goals'],
    src: '/img/logo.png',
    srcDark: '/img/logo.png',
    order: 3,
  },
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'سفر درمانی - تعیین اهداف درمانی | ذهنا',
  meta: [
    { name: 'description', content: 'تنظیم اهداف درمانی شخصی‌سازی شده بر اساس ارزیابی اولیه' }
  ]
})

const router = useRouter()
const route = useRoute()
const isVisible = ref(false)
const isAnalyzing = ref(true)
const analysisProgress = ref(0)

// Comprehensive assessment data - in real app this would come from previous step
const assessmentData = ref({
  demographics: {
    age: '26-35',
    education: 'bachelor',
    location: 'tehran',
    relationshipStatus: 'single',
    workStatus: 'employed'
  },
  presentingProblems: {
    mainConcerns: 'احساس اضطراب شدید در مواقع اجتماعی که مانع از عملکرد طبیعی در محیط کار و روابط شخصی می‌شود',
    onsetDuration: 'few-months',
    triggerEvents: 'تغییر شغل و انتقال به تیم جدید با تعامل بالا',
    impactOnLife: 'اجتناب از جلسات کاری، کاهش بازدهی، انزوای اجتماعی'
  },
  symptoms: {
    anxiety: {
      level: 4,
      frequency: 'daily',
      triggers: ['جلسات کاری', 'صحبت در جمع', 'ملاقات افراد جدید'],
      physicalSymptoms: ['تپش قلب', 'تعریق', 'لرزش', 'تنگی نفس']
    },
    mood: 'low',
    sleep: {
      quality: 2,
      duration: 5,
      difficulties: ['به خواب رفتن', 'بیدار شدن شبانه']
    },
    stress: {
      level: 5,
      sources: ['محیط کار', 'روابط اجتماعی', 'آینده شغلی']
    },
    concentration: 2,
    energy: 2,
    socialConnection: 1
  },
  riskFactors: {
    selfHarm: false,
    suicidalIdeation: false,
    substanceUse: false,
    socialIsolation: true,
    workImpairment: true
  },
  protectiveFactors: {
    familySupport: true,
    employment: true,
    noSubstanceUse: true,
    seekingHelp: true
  },
  providerPreference: 'hybrid'
})

// Clinical assessment and diagnostic formulation
const clinicalAssessment = ref({
  presentingSymptoms: [
    {
      symptom: 'اضطراب اجتماعی',
      severity: 'شدید',
      frequency: 'روزانه',
      duration: '3 ماه',
      impact: 'اختلال قابل توجه در عملکرد'
    },
    {
      symptom: 'اجتناب از موقعیت‌های اجتماعی',
      severity: 'متوسط تا شدید',
      frequency: 'مداوم',
      duration: '2 ماه',
      impact: 'محدودیت در فعالیت‌های روزانه'
    },
    {
      symptom: 'اختلال خواب',
      severity: 'متوسط',
      frequency: '5-6 شب در هفته',
      duration: '2 ماه',
      impact: 'خستگی روزانه و کاهش تمرکز'
    },
    {
      symptom: 'کاهش اعتماد به نفس',
      severity: 'متوسط',
      frequency: 'مداوم',
      duration: '3 ماه',
      impact: 'اجتناب از فرصت‌های شغلی'
    }
  ],
  mentalStatusExam: {
    appearance: 'مرتب اما نشانه‌هایی از اضطراب',
    behavior: 'کناره‌گیری، تماس چشمی محدود',
    speech: 'آهسته، مکث‌های مکرر',
    mood: 'نگران و افسرده',
    affect: 'محدود، مطابق با گزارش',
    thought: {
      process: 'منطقی اما با نگرانی‌های مکرر',
      content: 'افکار منفی درباره ارزیابی دیگران'
    },
    perception: 'بدون اختلال',
    cognition: 'کاهش تمرکز در موقعیت‌های پراسترس',
    insight: 'خوب - آگاهی از مشکل',
    judgment: 'سالم'
  }
})

// Detailed diagnostic formulation
const detectedConditions = ref({
  primaryDiagnosis: {
    condition: 'اختلال اضطراب اجتماعی (F40.1)',
    dsmCriteria: [
      'ترس یا اضطراب مشخص در موقعیت‌های اجتماعی',
      'ترس از ارزیابی منفی دیگران',
      'موقعیت‌های اجتماعی تقریباً همیشه ترس ایجاد می‌کنند',
      'اجتناب یا تحمل با اضطراب شدید',
      'اختلال قابل توجه در عملکرد',
      'مدت حداقل 6 ماه'
    ],
    confidence: 88,
    severity: 'متوسط تا شدید',
    specifiers: ['عملکرد در محل کار', 'تعامل اجتماعی'],
    symptoms: [
      'اضطراب شدید در موقعیت‌های اجتماعی',
      'اجتناب از جمع و تعامل گروهی',
      'ترس از قضاوت و ارزیابی منفی',
      'علائم جسمانی اضطراب (تپش، تعریق)',
      'کاهش اعتماد به نفس اجتماعی'
    ]
  },
  comorbidities: [
    {
      condition: 'اختلال خواب مرتبط با اضطراب (G47.0)',
      confidence: 75,
      severity: 'متوسط',
      symptoms: [
        'مشکل در به خواب رفتن (بیش از 30 دقیقه)',
        'بیدار شدن شبانه مکرر',
        'کیفیت پایین خواب',
        'خستگی صبحگاهی'
      ],
      relationship: 'ثانویه به اختلال اضطراب اصلی'
    },
    {
      condition: 'علائم افسردگی خفیف (Z73.0)',
      confidence: 65,
      severity: 'خفیف تا متوسط',
      symptoms: [
        'کاهش خلق و انرژی',
        'احساس ناامیدی گاه‌به‌گاه',
        'کاهش لذت از فعالیت‌های اجتماعی',
        'خودانتقادی افزایش یافته'
      ],
      relationship: 'واکنش به استرس اجتماعی مداوم'
    },
    {
      condition: 'اختلال تطبیق با استرس‌ور شغلی (F43.2)',
      confidence: 70,
      severity: 'متوسط',
      symptoms: [
        'اضطراب مرتبط با تغییرات شغلی',
        'کاهش عملکرد کاری',
        'اجتناب از مسئولیت‌های جدید',
        'نگرانی مفرط درباره ارزیابی عملکرد'
      ],
      relationship: 'عامل محرک برای اختلال اضطراب اجتماعی'
    }
  ],
  differentialDiagnosis: [
    {
      condition: 'اختلال اضطراب فراگیر',
      excluded: true,
      reason: 'اضطراب محدود به موقعیت‌های اجتماعی'
    },
    {
      condition: 'اختلال افسردگی اصلی',
      excluded: true,
      reason: 'علائم افسردگی ثانویه و خفیف'
    },
    {
      condition: 'اختلال شخصیت اجتنابی',
      excluded: true,
      reason: 'شروع در بزرگسالی، قبلاً عملکرد اجتماعی طبیعی'
    }
  ]
})

const chiefComplaint = ref({
  primary: 'اضطراب شدید و ناتوانی در تعامل اجتماعی طبیعی',
  secondary: 'اختلال در عملکرد شغلی و روابط شخصی',
  onset: 'تدریجی طی 3 ماه گذشته',
  duration: '3 ماه',
  severity: 'شدید (7/10)',
  frequency: 'روزانه در موقعیت‌های اجتماعی',
  progression: 'رو به وخامت',
  impact: {
    occupational: 'کاهش 40% بازدهی کار',
    social: 'انزوای اجتماعی کامل',
    personal: 'کاهش اعتماد به نفس',
    physical: 'اختلال خواب و خستگی'
  },
  precipitatingFactors: [
    'تغییر شغل و محیط کار',
    'افزایش مسئولیت‌های اجتماعی',
    'قرارگیری در معرض ارزیابی بیشتر'
  ],
  perpetuatingFactors: [
    'اجتناب مداوم از موقعیت‌های اجتماعی',
    'افکار منفی درباره توانایی‌های خود',
    'کمبود مهارت‌های مقابله‌ای'
  ]
})

// Risk assessment
const riskAssessment = ref({
  suicideRisk: {
    level: 'پایین',
    factors: ['عدم سابقه', 'حمایت خانوادگی', 'انگیزه درمان'],
    protective: ['روابط خانوادگی مثبت', 'شغل پایدار', 'آینده‌نگری']
  },
  selfHarmRisk: {
    level: 'بسیار پایین',
    factors: ['عدم سابقه', 'عدم افکار خودآزاری']
  },
  functionalImpairment: {
    level: 'متوسط تا بالا',
    areas: ['عملکرد شغلی', 'روابط اجتماعی', 'کیفیت زندگی']
  },
  crisisIndicators: [
    'افزایش اجتناب اجتماعی',
    'تشدید علائم جسمانی اضطراب',
    'کاهش بیشتر عملکرد کاری',
    'افزایش انزوای اجتماعی'
  ]
})

// Comprehensive therapeutic goals with detailed clinical protocols
const therapeuticGoals = ref({
  session: [
    {
      id: 's1',
      title: 'ارزیابی تشخیصی جامع و تأیید Chief Complaint',
      description: 'انجام مصاحبه ساختاریافته برای تأیید تشخیص اختلال اضطراب اجتماعی و شناسایی عوامل محرک و تداوم‌بخش',
      priority: 'high',
      type: 'assessment',
      timeframe: 'جلسه اول (90 دقیقه)',
      protocols: [
        'استفاده از MINI International Neuropsychiatric Interview',
        'تکمیل Social Phobia Inventory (SPIN)',
        'ارزیابی Mental Status Examination کامل',
        'بررسی سابقه پزشکی و داروهای مصرفی'
      ],
      measurable: [
        'تکمیل فرم تشخیصی استاندارد DSM-5',
        'نمره SPIN بالای 19 (تأیید اختلال)',
        'شناسایی حداقل 5 محرک اصلی اضطراب',
        'مستندسازی کامل Chief Complaint'
      ],
      tools: ['SPIN Scale', 'GAD-7', 'PHQ-9', 'مصاحبه تشخیصی ساختاریافته']
    },
    {
      id: 's2',
      title: 'ارزیابی ریسک و طراحی پلان ایمنی',
      description: 'بررسی عمیق عوامل خطر، ارزیابی خودکشی و طراحی پلان ایمنی فردی',
      priority: 'high',
      type: 'crisis-assessment',
      timeframe: 'جلسه اول (20 دقیقه)',
      protocols: [
        'Columbia Suicide Severity Rating Scale',
        'ارزیابی عوامل خطر و محافظت',
        'طراحی Safety Plan',
        'تعیین شبکه حمایت اضطراری'
      ],
      measurable: [
        'تکمیل کامل Safety Plan',
        'شناسایی 3 نفر حمایت‌کننده',
        'آموزش تکنیک‌های فوری مقابله',
        'تعیین خط قرمز برای مراجعه اورژانسی'
      ]
    },
    {
      id: 's3',
      title: 'Psychoeducation درباره اختلال اضطراب اجتماعی',
      description: 'آموزش جامع درباره ماهیت اختلال، علل، و مکانیزم‌های حفظ کننده',
      priority: 'high',
      type: 'intervention',
      timeframe: 'جلسات ۲-۳',
      protocols: [
        'مدل شناختی-رفتاری اضطراب اجتماعی',
        'چرخه معیوب اضطراب-اجتناب',
        'نقش افکار خودکار منفی',
        'تأثیر اجتناب بر تداوم اختلال'
      ],
      measurable: [
        'درک صحیح چرخه اضطراب (امتحان کوتاه)',
        'شناسایی افکار منفی شخصی',
        'توانایی توضیح مکانیزم اختلال',
        'پذیرش نقش اجتناب در تشدید مشکل'
      ]
    },
    {
      id: 's4',
      title: 'آموزش تکنیک‌های مدیریت اضطراب',
      description: 'یادگیری مهارت‌های عملی برای کنترل علائم فیزیولوژیک و شناختی اضطراب',
      priority: 'high',
      type: 'intervention',
      timeframe: 'جلسات ۳-۶',
      protocols: [
        'Progressive Muscle Relaxation (PMR)',
        'Diaphragmatic Breathing',
        'Mindfulness-based stress reduction',
        'Grounding techniques (5-4-3-2-1)'
      ],
      measurable: [
        'کاهش 30% نمره اضطراب حین تمرین',
        'اجرای صحیح تکنیک تنفس در 90 ثانیه',
        'استفاده موثر از mindfulness روزانه',
        'کاهش علائم فیزیکی طی حملات اضطراب'
      ]
    },
    {
      id: 's5',
      title: 'Cognitive Restructuring و کار با افکار منفی',
      description: 'شناسایی و به چالش کشیدن افکار خودکار منفی و cognitive distortions',
      priority: 'high',
      type: 'intervention',
      timeframe: 'جلسات ۴-۸',
      protocols: [
        'ABC Model (Activating event, Beliefs, Consequences)',
        'Thought Record استاندارد',
        'Cognitive Distortions identification',
        'Evidence For/Against technique'
      ],
      measurable: [
        'شناسایی 10 نوع cognitive distortion',
        'تکمیل روزانه Thought Record',
        'کاهش 40% باور به افکار منفی',
        'ایجاد افکار متعادل جایگزین'
      ]
    }
  ],
  patient: [
    {
      id: 'p1',
      title: 'کاهش قابل توجه اضطراب اجتماعی',
      description: 'کاهش شدت و فراوانی حملات اضطراب در موقعیت‌های اجتماعی از سطح شدید به متوسط',
      priority: 'high',
      type: 'symptom-reduction',
      timeframe: '12 هفته',
      baselineMetrics: {
        spinScore: 42,
        gadScore: 15,
        dailyAnxietyLevel: 7,
        avoidanceBehaviors: 8
      },
      targetMetrics: {
        spinScore: 21,
        gadScore: 8,
        dailyAnxietyLevel: 4,
        avoidanceBehaviors: 3
      },
      measurable: [
        'کاهش 50% نمره SPIN (از 42 به 21)',
        'کاهش GAD-7 از 15 به 8',
        'شرکت در حداقل 3 موقعیت اجتماعی هفتگی',
        'کاهش رفتارهای اجتنابی از 8 به 3 مورد'
      ],
      milestones: [
        { week: 4, target: 'کاهش 25% اضطراب' },
        { week: 8, target: 'شرکت در جلسات کاری' },
        { week: 12, target: 'رسیدن به سطح متوسط اضطراب' }
      ]
    },
    {
      id: 'p2',
      title: 'بهبود کیفیت خواب و الگوی استراحت',
      description: 'بازگشت به الگوی خواب طبیعی و کاهش تأثیر اضطراب بر خواب',
      priority: 'high',
      type: 'lifestyle',
      timeframe: '6 هفته',
      baselineMetrics: {
        sleepLatency: 45,
        sleepDuration: 5,
        sleepQuality: 2,
        nightAwakenings: 3
      },
      targetMetrics: {
        sleepLatency: 15,
        sleepDuration: 7,
        sleepQuality: 4,
        nightAwakenings: 1
      },
      measurable: [
        'کاهش زمان به خواب رفتن به کمتر از 15 دقیقه',
        'افزایش مدت خواب به 7-8 ساعت',
        'بهبود کیفیت خواب از 2 به 4 (مقیاس 5)',
        'کاهش بیداری شبانه به کمتر از 1 بار'
      ],
      interventions: ['Sleep Hygiene', 'Progressive Muscle Relaxation', 'Cognitive Defusion']
    },
    {
      id: 'p3',
      title: 'بازگشت به عملکرد شغلی مطلوب',
      description: 'بهبود عملکرد کاری و مشارکت فعال در فعالیت‌های تیمی',
      priority: 'high',
      type: 'functional',
      timeframe: '10 هفته',
      baselineMetrics: {
        workPerformance: 6,
        teamParticipation: 2,
        presentationAnxiety: 9,
        meetingAvoidance: 80
      },
      targetMetrics: {
        workPerformance: 8,
        teamParticipation: 7,
        presentationAnxiety: 4,
        meetingAvoidance: 20
      },
      measurable: [
        'شرکت در 90% جلسات تیمی',
        'ارائه حداقل 2 پرزنتیشن کاری',
        'کاهش اضطراب ارائه از 9 به 4',
        'دریافت بازخورد مثبت از مدیر'
      ]
    },
    {
      id: 'p4',
      title: 'توسعه شبکه اجتماعی و روابط',
      description: 'ایجاد و حفظ روابط اجتماعی سالم و کاهش انزوای اجتماعی',
      priority: 'medium',
      type: 'social',
      timeframe: '16 هفته',
      measurable: [
        'برقراری رابطه با حداقل 2 همکار جدید',
        'شرکت در 1 فعالیت اجتماعی ماهانه',
        'برقراری تماس هفتگی با دوستان قدیمی',
        'عضویت در یک گروه اجتماعی یا ورزشی'
      ]
    }
  ],
  ai: [
    {
      id: 'ai1',
      title: 'سیستم نظارت هوشمند و تحلیل الگوهای رفتاری',
      description: 'ردیابی مداوم و تحلیل پیشرفته علائم اضطراب، الگوهای خواب، و تغییرات خلقی با استفاده از Machine Learning',
      priority: 'high',
      type: 'monitoring',
      timeframe: '24/7 مداوم',
      algorithms: [
        'Real-time mood analysis',
        'Anxiety pattern recognition',
        'Sleep quality tracking',
        'Social interaction monitoring'
      ],
      dataPoints: [
        'نمره اضطراب روزانه (0-10)',
        'کیفیت خواب شبانه',
        'تعداد موقعیت‌های اجتناب شده',
        'استفاده از تکنیک‌های مقابله‌ای',
        'تعامل اجتماعی روزانه'
      ],
      measurable: [
        'جمع‌آوری 95% داده‌های روزانه',
        'تحلیل الگوهای هفتگی',
        'شناسایی trigger patterns',
        'پیش‌بینی وضعیت با دقت 85%'
      ]
    },
    {
      id: 'ai2',
      title: 'سیستم هشدار زودهنگام و مداخله بحران',
      description: 'شناسایی علائم تشدید اضطراب، ریسک خودکشی، و فعال‌سازی فوری پروتکل‌های ایمنی',
      priority: 'high',
      type: 'crisis-detection',
      timeframe: 'real-time',
      triggers: [
        'افزایش ناگهانی نمره اضطراب (>2 نقطه)',
        'کاهش کیفیت خواب تا زیر 1',
        'اجتناب کامل از فعالیت‌های اجتماعی',
        'کلمات کلیدی خطرناک در متن'
      ],
      responseProtocols: [
        'هشدار فوری به تیم درمانی',
        'فعال‌سازی Safety Plan',
        'ارائه منابع اضطراری',
        'ارتباط با شبکه حمایت'
      ],
      measurable: [
        'زمان پاسخ کمتر از 5 دقیقه',
        'دقت تشخیص بحران 95%',
        'کاهش False positive به زیر 5%',
        'پیگیری 100% موارد پرخطر'
      ]
    },
    {
      id: 'ai3',
      title: 'تولید محتوای درمانی شخصی‌سازی شده',
      description: 'ایجاد تمرینات، تکنیک‌ها، و محتوای آموزشی متناسب با نیازها و پیشرفت فردی',
      priority: 'high',
      type: 'content-generation',
      timeframe: 'روزانه',
      capabilities: [
        'تولید تمرینات mindfulness شخصی',
        'ایجاد exposure hierarchy فردی',
        'محتوای psychoeducation تطبیقی',
        'پیشنهاد تکنیک‌های مقابله‌ای'
      ],
      measurable: [
        'ارائه روزانه 3-5 پیشنهاد شخصی',
        'تطبیق محتوا با سطح پیشرفت',
        'تولید exposure tasks تدریجی',
        'adaptation rate بالای 90%'
      ]
    },
    {
      id: 'ai4',
      title: 'تحلیل پیشرفت و پیش‌بینی نتایج درمان',
      description: 'ارزیابی مداوم پیشرفت درمان و پیش‌بینی نتایج با استفاده از predictive modeling',
      priority: 'medium',
      type: 'analytics',
      timeframe: 'هفتگی',
      analytics: [
        'Progress tracking dashboard',
        'Outcome prediction models',
        'Treatment response analysis',
        'Relapse risk assessment'
      ],
      measurable: [
        'گزارش هفتگی پیشرفت',
        'پیش‌بینی نتایج با دقت 80%',
        'شناسایی عوامل موثر بر بهبودی',
        'تنظیم برنامه درمان بر اساس تحلیل'
      ]
    }
  ],
  psychotherapist: [
    {
      id: 'pt1',
      title: 'ارزیابی تشخیصی جامع و تدوین فرمولاسیون بالینی',
      description: 'انجام مصاحبه تشخیصی ساختاریافته، تأیید تشخیص DSM-5، و تدوین فرمولاسیون بالینی کامل',
      priority: 'high',
      type: 'assessment',
      timeframe: 'جلسات 1-2',
      clinicalTools: [
        'MINI International Neuropsychiatric Interview',
        'Structured Clinical Interview for DSM-5 (SCID-5)',
        'Social Phobia Inventory (SPIN)',
        'Liebowitz Social Anxiety Scale (LSAS)'
      ],
      assessmentDomains: [
        'تشخیص اختلال اضطراب اجتماعی',
        'ارزیابی کوموربیدیتی‌ها',
        'بررسی عوامل خطر و محافظت',
        'تعیین شدت و عملکردی بودن اختلال'
      ],
      measurable: [
        'تکمیل MINI و SCID-5',
        'نمره SPIN >19 (تأیید تشخیص)',
        'تدوین فرمولاسیون 5P (Predisposing, Precipitating, Perpetuating, Protective, Prognosis)',
        'ارائه case conceptualization مکتوب'
      ]
    },
    {
      id: 'pt2',
      title: 'طراحی و اجرای برنامه درمان شناختی-رفتاری (CBT)',
      description: 'تنظیم برنامه CBT اختصاصی برای اختلال اضطراب اجتماعی با رویکرد evidence-based',
      priority: 'high',
      type: 'treatment-planning',
      timeframe: 'جلسه 2-16',
      treatmentModules: [
        'Psychoeducation و case conceptualization',
        'Cognitive Restructuring',
        'Behavioral Experiments',
        'Exposure Therapy (graduated)',
        'Relapse Prevention'
      ],
      techniques: [
        'Socratic Questioning',
        'Thought Records',
        'Behavioral Activation',
        'Social Skills Training',
        'Mindfulness Integration'
      ],
      measurable: [
        'تدوین treatment plan مبتنی بر CBT',
        'اجرای 12-16 جلسه ساختاریافته',
        'homework assignments هفتگی',
        'پیگیری و تنظیم برنامه بر اساس پیشرفت'
      ]
    },
    {
      id: 'pt3',
      title: 'نظارت بر فرآیند درمان و case management',
      description: 'نظارت مستمر بر پیشرفت درمان، هماهنگی با تیم، و تصمیم‌گیری بالینی',
      priority: 'high',
      type: 'supervision',
      timeframe: 'مداوم',
      responsibilities: [
        'بررسی هفتگی پیشرفت بیمار',
        'نظارت بر عملکرد AI و feedback',
        'تصمیم‌گیری درباره تغییرات درمانی',
        'مدیریت موارد بحرانی'
      ],
      measurable: [
        'جلسات بررسی هفتگی',
        'update کردن treatment plan ماهانه',
        'crisis intervention در صورت نیاز',
        'coordination با سایر متخصصان'
      ]
    },
    {
      id: 'pt4',
      title: 'ارزیابی نتایج درمان و prevention of relapse',
      description: 'سنجش outcomes درمان، برنامه‌ریزی پیشگیری از عود، و آماده‌سازی برای termination',
      priority: 'medium',
      type: 'outcome-assessment',
      timeframe: 'جلسات 14-16',
      outcomeMetrics: [
        'کاهش نمره SPIN به زیر 19',
        'بهبود عملکرد اجتماعی و شغلی',
        'کاهش رفتارهای اجتنابی',
        'افزایش self-efficacy'
      ],
      relapsePreventionPlan: [
        'شناسایی early warning signs',
        'تدوین coping strategies',
        'برنامه follow-up sessions',
        'منابع حمایتی مداوم'
      ],
      measurable: [
        'pre-post assessment comparison',
        'functional improvement measures',
        'تدوین relapse prevention plan',
        'قرارداد follow-up sessions'
      ]
    },
    {
      id: 'pt5',
      title: 'توسعه حرفه‌ای و supervision AI system',
      description: 'نظارت بر عملکرد سیستم AI، ارائه feedback، و بهبود مستمر پروتکل‌های درمانی',
      priority: 'low',
      type: 'professional-development',
      timeframe: 'مداوم',
      activities: [
        'بررسی accuracy تشخیص‌های AI',
        'feedback به توسعه‌دهندگان سیستم',
        'مشارکت در تحقیقات بالینی',
        'update کردن evidence-based protocols'
      ],
      measurable: [
        'گزارش ماهانه عملکرد AI',
        'پیشنهادات بهبود سیستم',
        'مشارکت در case studies',
        'آموزش تیم درمانی'
      ]
    }
  ]
})

const priorityColors = {
  high: 'danger',
  medium: 'warning', 
  low: 'info'
}

const typeIcons = {
  assessment: 'ph:clipboard-text',
  intervention: 'ph:gear-six',
  monitoring: 'ph:chart-line',
  'crisis-detection': 'ph:warning-circle',
  'crisis-assessment': 'ph:shield-warning',
  'symptom-reduction': 'ph:trend-down',
  lifestyle: 'ph:heart',
  'treatment-planning': 'ph:strategy',
  functional: 'ph:briefcase',
  social: 'ph:users-three',
  'content-generation': 'ph:magic-wand',
  analytics: 'ph:chart-pie',
  supervision: 'ph:eye',
  'outcome-assessment': 'ph:target',
  'professional-development': 'ph:graduation-cap'
}

// Evidence-based treatment protocols
const treatmentProtocols = ref({
  socialAnxietyDisorder: {
    evidenceLevel: 'Strong',
    primaryTreatment: 'Cognitive Behavioral Therapy (CBT)',
    duration: '12-16 sessions',
    successRate: '70-80%',
    keyComponents: [
      'Cognitive Restructuring',
      'Exposure Therapy',
      'Social Skills Training',
      'Relapse Prevention'
    ]
  },
  assessmentTools: {
    primary: ['SPIN', 'LSAS', 'SIAS'],
    secondary: ['GAD-7', 'PHQ-9', 'WHODAS'],
    screening: ['Mini-SPIN', 'SPS']
  }
})

// Treatment milestones and benchmarks
const treatmentMilestones = ref([
  {
    week: 1,
    milestone: 'Complete diagnostic assessment',
    criteria: 'SPIN score >19, DSM-5 criteria met',
    status: 'pending'
  },
  {
    week: 2,
    milestone: 'Safety plan established',
    criteria: 'Risk assessment complete, emergency contacts identified',
    status: 'pending'
  },
  {
    week: 4,
    milestone: 'Psychoeducation completed',
    criteria: 'Patient understands anxiety cycle, demonstrates knowledge',
    status: 'pending'
  },
  {
    week: 6,
    milestone: 'Coping skills acquired',
    criteria: 'Effective use of breathing, relaxation techniques',
    status: 'pending'
  },
  {
    week: 8,
    milestone: 'Cognitive restructuring',
    criteria: 'Identifies negative thoughts, uses thought records',
    status: 'pending'
  },
  {
    week: 12,
    milestone: 'Exposure therapy progress',
    criteria: 'Completing hierarchy items, reduced avoidance',
    status: 'pending'
  },
  {
    week: 16,
    milestone: 'Treatment completion',
    criteria: 'SPIN <19, functional improvement, relapse plan',
    status: 'pending'
  }
])

// Simulate analysis progress
onMounted(() => {
  const progressInterval = setInterval(() => {
    analysisProgress.value += 10
    if (analysisProgress.value >= 100) {
      clearInterval(progressInterval)
      setTimeout(() => {
        isAnalyzing.value = false
        isVisible.value = true
      }, 500)
    }
  }, 200)
})

const startTherapy = () => {
  router.push('/therapy-journey/session-start')
}

const goBackToAssessment = () => {
  router.push('/therapy-journey/assessment')
}
</script>

<template>
  <div class="dark:bg-gradient-to-br dark:from-muted-900 dark:to-muted-800 bg-gradient-to-br from-slate-50 to-white min-h-screen">
    <!-- Background particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-300/20 rounded-full animate-pulse"></div>
      <div class="absolute top-3/4 right-1/3 w-3 h-3 bg-success-300/20 rounded-full animate-pulse delay-500"></div>
      <div class="absolute top-1/2 right-1/4 w-1 h-1 bg-info-300/20 rounded-full animate-pulse delay-1000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-2 h-2 bg-warning-300/20 rounded-full animate-pulse delay-700"></div>
    </div>

    <div class="relative flex flex-col px-6 py-8">
      <div class="relative mx-auto w-full max-w-6xl">
        <!-- Navigation Header -->
        <div 
          class="flex w-full items-center justify-between mb-8 transition-all duration-1000"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 -translate-y-4': !isVisible }"
        >
          <button
            @click="goBackToAssessment"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-all duration-300 hover:gap-3"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت به ارزیابی</span>
          </button>
          <BaseThemeToggle />
        </div>

        <!-- Analysis Progress -->
        <div v-if="isAnalyzing" class="flex flex-col items-center justify-center min-h-[60vh]">
          <div class="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mb-8">
            <Icon name="ph:brain" class="size-12 text-primary-500 animate-pulse" />
          </div>
          
          <BaseHeading as="h1" size="3xl" weight="bold" class="text-center mb-4">
            در حال تجزیه و تحلیل ارزیابی شما...
          </BaseHeading>
          
          <BaseParagraph class="text-center text-muted-600 dark:text-muted-300 mb-8 max-w-md">
            هوش مصنوعی در حال بررسی پاسخ‌های شما و تنظیم اهداف درمانی شخصی‌سازی شده است
          </BaseParagraph>

          <div class="w-full max-w-md">
            <div class="bg-muted-200 dark:bg-muted-700 h-3 rounded-full overflow-hidden mb-4">
              <div 
                class="bg-primary-500 h-full rounded-full transition-all duration-300 ease-out"
                :style="{ width: `${analysisProgress}%` }"
              ></div>
            </div>
            <p class="text-center text-sm text-muted-500">{{ analysisProgress }}% تکمیل شده</p>
          </div>
        </div>

        <!-- Goals Content -->
        <div 
          v-else
          class="transition-all duration-1000"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-8': !isVisible }"
        >
          <!-- Header -->
          <div class="text-center mb-12">
            <div class="w-20 h-20 bg-gradient-to-r from-primary-500/10 to-success-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ph:target" class="size-10 text-primary-500" />
            </div>
            <BaseHeading as="h1" size="4xl" weight="bold" class="mb-4">
              اهداف درمانی شما تنظیم شد
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 max-w-2xl mx-auto text-lg">
              بر اساس ارزیابی شما، اهداف درمانی شخصی‌سازی شده‌ای تنظیم کرده‌ایم که در مسیر بهبودی کمکتان خواهد کرد
            </BaseParagraph>
          </div>

          <!-- Chief Complaint & Primary Diagnosis -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- Chief Complaint -->
            <div class="bg-gradient-to-r from-danger-50 to-warning-50 dark:from-danger-900/10 dark:to-warning-900/10 rounded-2xl p-8">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-danger-500/10 rounded-full flex items-center justify-center">
                  <Icon name="ph:warning-circle" class="size-6 text-danger-500" />
                </div>
                <BaseHeading as="h2" size="xl" weight="bold" class="text-danger-700 dark:text-danger-300">
                  شکایت اصلی
                </BaseHeading>
              </div>
              
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-muted-600 dark:text-muted-300 mb-2">مشکل اصلی:</p>
                  <p class="text-danger-700 dark:text-danger-300 font-semibold">{{ chiefComplaint.primary }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm font-medium text-muted-600 dark:text-muted-300 mb-1">مدت زمان:</p>
                    <p class="text-muted-700 dark:text-muted-200">{{ chiefComplaint.duration }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-muted-600 dark:text-muted-300 mb-1">شدت:</p>
                    <p class="text-muted-700 dark:text-muted-200">{{ chiefComplaint.severity }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Primary Diagnosis -->
            <div class="bg-gradient-to-r from-primary-50 to-info-50 dark:from-primary-900/10 dark:to-info-900/10 rounded-2xl p-8">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
                  <Icon name="ph:stethoscope" class="size-6 text-primary-500" />
                </div>
                <BaseHeading as="h2" size="xl" weight="bold" class="text-primary-700 dark:text-primary-300">
                  تشخیص اولیه
                </BaseHeading>
              </div>
              
              <div class="space-y-4">
                <div>
                  <p class="text-primary-700 dark:text-primary-300 font-semibold text-lg">
                    {{ detectedConditions.primaryDiagnosis.condition }}
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-sm text-muted-600 dark:text-muted-300">اطمینان:</span>
                    <div class="flex-1 bg-muted-200 dark:bg-muted-700 h-2 rounded-full">
                      <div 
                        class="bg-primary-500 h-full rounded-full"
                        :style="{ width: `${detectedConditions.primaryDiagnosis.confidence}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium">{{ detectedConditions.primaryDiagnosis.confidence }}%</span>
                  </div>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-muted-600 dark:text-muted-300 mb-2">علائم شناسایی شده:</p>
                  <div class="space-y-1">
                    <div 
                      v-for="symptom in detectedConditions.primaryDiagnosis.symptoms" 
                      :key="symptom"
                      class="flex items-center gap-2"
                    >
                      <Icon name="ph:check-circle" class="size-4 text-success-500" />
                      <span class="text-sm text-muted-700 dark:text-muted-200">{{ symptom }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comorbidities -->
          <div v-if="detectedConditions.comorbidities.length > 0" class="mb-12">
            <BaseHeading as="h2" size="2xl" weight="bold" class="mb-6 text-center">
              شرایط همراه (کوموربیدیتی)
            </BaseHeading>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="comorbidity in detectedConditions.comorbidities"
                :key="comorbidity.condition"
                class="bg-slate-100/90 dark:bg-muted-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200/40 dark:border-white/20"
              >
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-semibold text-muted-700 dark:text-muted-200">{{ comorbidity.condition }}</h3>
                  <span class="text-sm px-3 py-1 bg-warning-100 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300 rounded-full">
                    {{ comorbidity.confidence }}% اطمینان
                  </span>
                </div>
                
                <div class="space-y-2">
                  <div 
                    v-for="symptom in comorbidity.symptoms"
                    :key="symptom"
                    class="flex items-center gap-2"
                  >
                    <Icon name="ph:dot" class="size-4 text-warning-500" />
                    <span class="text-sm text-muted-600 dark:text-muted-300">{{ symptom }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Therapeutic Goals -->
          <div class="space-y-12">
            <BaseHeading as="h2" size="3xl" weight="bold" class="text-center mb-8">
              اهداف درمانی
            </BaseHeading>

            <!-- Session Goals -->
            <div class="bg-gradient-to-r from-success-50 to-teal-50 dark:from-success-900/10 dark:to-teal-900/10 rounded-2xl p-8">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 bg-success-500/10 rounded-full flex items-center justify-center">
                  <Icon name="ph:calendar-check" class="size-6 text-success-500" />
                </div>
                <BaseHeading as="h3" size="2xl" weight="bold" class="text-success-700 dark:text-success-300">
                  اهداف جلسات
                </BaseHeading>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div 
                  v-for="goal in therapeuticGoals.session"
                  :key="goal.id"
                  class="bg-white/80 dark:bg-muted-800/80 rounded-xl p-6"
                >
                  <div class="flex items-start gap-4 mb-4">
                    <Icon :name="typeIcons[goal.type]" class="size-6 text-success-500 mt-1" />
                    <div class="flex-1">
                      <h4 class="font-semibold text-muted-700 dark:text-muted-200 mb-2">{{ goal.title }}</h4>
                      <p class="text-sm text-muted-600 dark:text-muted-300 mb-3">{{ goal.description }}</p>
                      
                      <div class="flex items-start flex-col gap-4 text-xs">
                        <div class="flex items-center gap-2">
                          <Icon name="ph:clock" class="size-4" />
                          <span>{{ goal.timeframe }}</span>
                        </div>
                        <div v-for="measurable in goal.measurable" :key="measurable" class="flex items-center gap-2">
                          <Icon name="ph:target" class="size-4" />
                          <span>{{ measurable }}</span>
                        </div>
                      </div>
                    </div>
                    <div :class="`px-2 py-1 rounded-full text-xs bg-${priorityColors[goal.priority]}-100 dark:bg-${priorityColors[goal.priority]}-900/20 text-${priorityColors[goal.priority]}-700 dark:text-${priorityColors[goal.priority]}-300`">
                      {{ goal.priority === 'high' ? 'بالا' : goal.priority === 'medium' ? 'متوسط' : 'پایین' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Patient Goals -->
            <div class="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/10 dark:to-purple-900/10 rounded-2xl p-8">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
                  <Icon name="ph:user-focus" class="size-6 text-primary-500" />
                </div>
                <BaseHeading as="h3" size="2xl" weight="bold" class="text-primary-700 dark:text-primary-300">
                  اهداف بیمار
                </BaseHeading>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div 
                  v-for="goal in therapeuticGoals.patient"
                  :key="goal.id"
                  class="bg-white/80 dark:bg-muted-800/80 rounded-xl p-6"
                >
                  <div class="flex items-start gap-4 mb-4">
                    <Icon :name="typeIcons[goal.type]" class="size-6 text-primary-500 mt-1" />
                    <div class="flex-1">
                      <h4 class="font-semibold text-muted-700 dark:text-muted-200 mb-2">{{ goal.title }}</h4>
                      <p class="text-sm text-muted-600 dark:text-muted-300 mb-3">{{ goal.description }}</p>
                      
                      <div class="flex items-start flex-col gap-4 text-xs">
                        <div class="flex items-center gap-2">
                          <Icon name="ph:clock" class="size-4" />
                          <span>{{ goal.timeframe }}</span>
                        </div>
                        <div v-for="measurable in goal.measurable" :key="measurable" class="flex items-center gap-2">
                          <Icon name="ph:target" class="size-4" />
                          <span>{{ measurable }}</span>
                        </div>
                      </div>
                    </div>
                    <div :class="`px-2 py-1 rounded-full text-xs bg-${priorityColors[goal.priority]}-100 dark:bg-${priorityColors[goal.priority]}-900/20 text-${priorityColors[goal.priority]}-700 dark:text-${priorityColors[goal.priority]}-300`">
                      {{ goal.priority === 'high' ? 'بالا' : goal.priority === 'medium' ? 'متوسط' : 'پایین' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Goals -->
            <div class="bg-gradient-to-r from-info-50 to-cyan-50 dark:from-info-900/10 dark:to-cyan-900/10 rounded-2xl p-8">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 bg-info-500/10 rounded-full flex items-center justify-center">
                  <Icon name="ph:robot" class="size-6 text-info-500" />
                </div>
                <BaseHeading as="h3" size="2xl" weight="bold" class="text-info-700 dark:text-info-300">
                  اهداف هوش مصنوعی
                </BaseHeading>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div 
                  v-for="goal in therapeuticGoals.ai"
                  :key="goal.id"
                  class="bg-white/80 dark:bg-muted-800/80 rounded-xl p-6"
                >
                  <div class="flex items-start gap-4 mb-4">
                    <Icon :name="typeIcons[goal.type]" class="size-6 text-info-500 mt-1" />
                    <div class="flex-1">
                      <h4 class="font-semibold text-muted-700 dark:text-muted-200 mb-2">{{ goal.title }}</h4>
                      <p class="text-sm text-muted-600 dark:text-muted-300 mb-3">{{ goal.description }}</p>
                      
                      <div class="flex items-start flex-col gap-4 text-xs">
                        <div class="flex items-center gap-2">
                          <Icon name="ph:clock" class="size-4" />
                          <span>{{ goal.timeframe }}</span>
                        </div>
                        <div v-for="measurable in goal.measurable" :key="measurable" class="flex items-center gap-2">
                          <Icon name="ph:target" class="size-4" />
                          <span>{{ measurable }}</span>
                        </div>
                      </div>
                    </div>
                    <div :class="`px-2 py-1 rounded-full text-xs bg-${priorityColors[goal.priority]}-100 dark:bg-${priorityColors[goal.priority]}-900/20 text-${priorityColors[goal.priority]}-700 dark:text-${priorityColors[goal.priority]}-300`">
                      {{ goal.priority === 'high' ? 'بالا' : goal.priority === 'medium' ? 'متوسط' : 'پایین' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Psychotherapist Goals -->
            <div class="bg-gradient-to-r from-warning-50 to-orange-50 dark:from-warning-900/10 dark:to-orange-900/10 rounded-2xl p-8">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 bg-warning-500/10 rounded-full flex items-center justify-center">
                  <Icon name="ph:user-circle-gear" class="size-6 text-warning-500" />
                </div>
                <BaseHeading as="h3" size="2xl" weight="bold" class="text-warning-700 dark:text-warning-300">
                  اهداف روانشناس
                </BaseHeading>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div 
                  v-for="goal in therapeuticGoals.psychotherapist"
                  :key="goal.id"
                  class="bg-white/80 dark:bg-muted-800/80 rounded-xl p-6"
                >
                  <div class="flex items-start gap-4 mb-4">
                    <Icon :name="typeIcons[goal.type]" class="size-6 text-warning-500 mt-1" />
                    <div class="flex-1">
                      <h4 class="font-semibold text-muted-700 dark:text-muted-200 mb-2">{{ goal.title }}</h4>
                      <p class="text-sm text-muted-600 dark:text-muted-300 mb-3">{{ goal.description }}</p>
                      
                      <div class="flex items-start flex-col gap-4 text-xs">
                        <div class="flex items-center gap-2">
                          <Icon name="ph:clock" class="size-4" />
                          <span>{{ goal.timeframe }}</span>
                        </div>
                        <div v-for="measurable in goal.measurable" :key="measurable" class="flex items-center gap-2">
                          <Icon name="ph:target" class="size-4" />
                          <span>{{ measurable }}</span>
                        </div>
                      </div>
                    </div>
                    <div :class="`px-2 py-1 rounded-full text-xs bg-${priorityColors[goal.priority]}-100 dark:bg-${priorityColors[goal.priority]}-900/20 text-${priorityColors[goal.priority]}-700 dark:text-${priorityColors[goal.priority]}-300`">
                      {{ goal.priority === 'high' ? 'بالا' : goal.priority === 'medium' ? 'متوسط' : 'پایین' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Important Note -->
          <div class="bg-gradient-to-r from-success-50 to-emerald-50 dark:from-success-900/10 dark:to-emerald-900/10 rounded-2xl p-8 mt-12">
            <div class="flex items-start gap-4">
              <Icon name="ph:lightbulb" class="size-8 text-success-500 mt-1" />
              <div>
                <BaseHeading as="h3" size="xl" weight="bold" class="text-success-700 dark:text-success-300 mb-4">
                  نکات مهم درباره جلسه اول
                </BaseHeading>
                <div class="space-y-3 text-success-600 dark:text-success-400">
                  <p class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="size-5 mt-0.5 text-success-500" />
                    <span>جلسه اول بر شناسایی دقیق علائم و تأیید تشخیص اولیه متمرکز است</span>
                  </p>
                  <p class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="size-5 mt-0.5 text-success-500" />
                    <span>شکایت اصلی (Chief Complaint) به طور کامل بررسی و مستند خواهد شد</span>
                  </p>
                  <p class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="size-5 mt-0.5 text-success-500" />
                    <span>تمام علائم همراه و کوموربیدیتی‌های احتمالی غربالگری می‌شوند</span>
                  </p>
                  <p class="flex items-start gap-2">
                    <Icon name="ph:check-circle" class="size-5 mt-0.5 text-success-500" />
                    <span>برنامه درمانی نهایی پس از تأیید تشخیص تنظیم خواهد شد</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center gap-6 mt-12">
            <BaseButton
              @click="goBackToAssessment"
              variant="pastel"
              color="muted"
              size="lg"
              class="px-8"
            >
              <Icon name="ph:arrow-right" class="size-5 ml-2" />
              بازنگری ارزیابی
            </BaseButton>
            
            <BaseButton
              @click="startTherapy"
              color="primary"
              size="lg"
              class="px-12"
            >
              <Icon name="ph:chat-circle" class="size-5 ml-2" />
              شروع جلسه اول
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>