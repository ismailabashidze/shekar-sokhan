<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAssessment } from '~/composables/useAssessment'

definePageMeta({
  title: 'سفر درمانی - ارزیابی اولیه',
  layout: 'empty',
  preview: {
    title: 'سفر درمانی - ارزیابی اولیه',
    description: 'تکمیل پرسشنامه ارزیابی اولیه با کمک هوش مصنوعی',
    categories: ['therapy', 'assessment'],
    src: '/img/logo.svg',
    srcDark: '/img/logo.svg',
    order: 2,
  },
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'سفر درمانی - ارزیابی اولیه | ذهنا',
  meta: [
    { name: 'description', content: 'ارزیابی اولیه برای شناخت بهتر نیازهای درمانی شما توسط هوش مصنوعی' },
  ],
})

const router = useRouter()
const { createAssessment, getUserAssessments, updateAssessment } = useAssessment()
const isVisible = ref(false)
const isDevelopment = computed(() => {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
})
const currentStep = ref(0)
const isProcessing = ref(false)
const isLoading = ref(true)
const existingAssessmentId = ref<string | null>(null)
const autoSaveTimeout = ref<NodeJS.Timeout | null>(null)
const isAutoSaving = ref(false)
const formData = ref({
  // Status
  status: 'draft' as const,

  // Step 1: Main concerns
  mainConcerns: '',
  triggerEvents: '',
  symptomsStarted: '',
  impactOnLife: '',

  // Step 2: Current mood & emotional state
  mood: '',
  emotionalState: [],
  energyLevel: 3,
  motivationLevel: 3,
  socialConnection: 3,

  // Step 3: Physical & mental levels
  anxietyLevel: 3,
  sleepQuality: 3,
  stressLevel: 3,
  concentrationLevel: 3,
  physicalSymptoms: [],

  // Step 4: Background & personal info
  age: '',
  gender: '',
  relationshipStatus: '',
  livingStatus: '',
  workStatus: '',
  lifeGoals: '',
  previousTherapy: '',
  currentMedication: '',
  supportSystem: '',

  // Step 5: Therapy preferences
  preferredApproach: '',
  timeAvailability: '',
  communicationStyle: '',
  providerPreference: '',
  specificIssues: [],
  copingMethods: [],
  expectations: '',

  // Step 6: Demographics
  education: '',
  incomeLevel: '',
  location: '',
  ethnicity: '',
  religion: '',
  language: '',
  familySize: '',
  parentalStatus: '',
})

const steps = [
  {
    id: 'demographics',
    title: 'آشنایی با شما',
    description: 'ابتدا کمی با شما آشنا شویم - تمام سوالات اختیاری هستند',
    icon: 'ph:user',
    color: 'teal',
  },
  {
    id: 'concerns',
    title: 'نگرانی‌های اصلی شما',
    description: 'درباره مشکلات و دلایل مراجعه به درمان بگویید',
    icon: 'ph:heart',
    color: 'primary',
  },
  {
    id: 'emotional',
    title: 'وضعیت عاطفی و روحی',
    description: 'حال و هوا، انرژی و ارتباطات اجتماعی‌تان را بررسی کنیم',
    icon: 'ph:smiley',
    color: 'success',
  },
  {
    id: 'physical',
    title: 'علائم جسمی و ذهنی',
    description: 'خواب، تمرکز، اضطراب و علائم فیزیکی را ارزیابی کنید',
    icon: 'ph:chart-bar',
    color: 'info',
  },
  {
    id: 'background',
    title: 'پیشینه شخصی و زندگی',
    description: 'اطلاعات کلی، روابط، کار و اهداف زندگی',
    icon: 'ph:user-circle',
    color: 'warning',
  },
  {
    id: 'preferences',
    title: 'ترجیحات و انتظارات درمانی',
    description: 'نحوه کار، روش‌های مقابله و انتظارات از درمان',
    icon: 'ph:gear-six',
    color: 'purple',
  },
]

const moodOptions = [
  { value: 'excellent', label: 'عالی - احساس انرژی و شادی می‌کنم', color: 'success' },
  { value: 'good', label: 'خوب - حالم خوب است اما گاهی نگران می‌شوم', color: 'success' },
  { value: 'neutral', label: 'متوسط - نه خوب نه بد', color: 'warning' },
  { value: 'low', label: 'پایین - احساس غم یا ناامیدی می‌کنم', color: 'danger' },
  { value: 'very-low', label: 'بسیار پایین - خیلی سخت می‌گذرد', color: 'danger' },
]

const emotionalStateOptions = [
  'احساس غمگینی', 'نگرانی مداوم', 'عصبانیت', 'احساس تنهایی',
  'بی‌حوصلگی', 'احساس گناه', 'ترس از آینده', 'کم اعتمادی به نفس',
  'احساس خالی بودن', 'تحریک‌پذیری', 'احساس ناامیدی', 'اضطراب اجتماعی',
]

const physicalSymptomsOptions = [
  'سردرد مکرر', 'درد قفسه سینه', 'تنگی نفس', 'دل درد یا تهوع',
  'درد عضلانی', 'خستگی مداوم', 'لرزش', 'سرگیجه',
  'مشکلات گوارشی', 'تپش قلب', 'عرق کردن بی‌دلیل', 'تغییر اشتها',
]

const relationshipOptions = [
  { value: 'single', label: 'مجرد' },
  { value: 'dating', label: 'در رابطه عاشقانه' },
  { value: 'engaged', label: 'نامزد' },
  { value: 'married', label: 'متأهل' },
  { value: 'divorced', label: 'مطلقه/مطلق' },
  { value: 'widowed', label: 'بیوه' },
  { value: 'complicated', label: 'پیچیده' },
]

const livingStatusOptions = [
  { value: 'alone', label: 'تنها زندگی می‌کنم' },
  { value: 'family', label: 'با خانواده' },
  { value: 'spouse', label: 'با همسر' },
  { value: 'roommates', label: 'با هم‌خانه' },
  { value: 'parents', label: 'با والدین' },
  { value: 'others', label: 'سایر' },
]

const workStatusOptions = [
  { value: 'employed', label: 'شاغل تمام وقت' },
  { value: 'part-time', label: 'شاغل پاره وقت' },
  { value: 'student', label: 'دانشجو' },
  { value: 'unemployed', label: 'بیکار' },
  { value: 'retired', label: 'بازنشسته' },
  { value: 'freelance', label: 'آزاد/فریلنسر' },
  { value: 'homemaker', label: 'خانه‌دار' },
]

const ageRanges = [
  { value: '18-25', label: '۱۸-۲۵ سال' },
  { value: '26-35', label: '۲۶-۳۵ سال' },
  { value: '36-45', label: '۳۶-۴۵ سال' },
  { value: '46-55', label: '۴۶-۵۵ سال' },
  { value: '56-65', label: '۵۶-۶۵ سال' },
  { value: '65+', label: '۶۵+ سال' },
]

const genderOptions = [
  { value: 'female', label: 'زن' },
  { value: 'male', label: 'مرد' },
  { value: 'non-binary', label: 'غیربایناری' },
  { value: 'prefer-not-say', label: 'ترجیح می‌دهم نگویم' },
]

const statusOptions = [
  { value: 'draft', label: 'پیش‌نویس', color: 'warning' },
  { value: 'completed', label: 'تکمیل شده', color: 'success' },
  { value: 'reviewed', label: 'بررسی شده', color: 'info' },
]

const communicationStyles = [
  {
    value: 'direct',
    label: 'مستقیم و صریح',
    description: 'دوست دارم مسائل به صراحت و بدون طولانی کردن گفته شوند',
    example: 'مثل اینکه بگویید "مشکل شما اینجاست و راه حل این است"',
  },
  {
    value: 'gentle',
    label: 'ملایم و صبورانه',
    description: 'نیاز به صحبت آرام، دلسوزانه و گام به گام دارم',
    example: 'مثل اینکه کم کم و با صبر موضوعات را بررسی کنیم تا احساس راحتی کنم',
  },
  {
    value: 'structured',
    label: 'منظم و برنامه‌ریزی شده',
    description: 'دوست دارم برنامه مشخص داشته باشیم و بدانم چه اتفاقی می‌افتد',
    example: 'مثل اینکه بگویید "امروز روی این موضوع کار می‌کنیم، هفته آینده آن موضوع"',
  },
  {
    value: 'flexible',
    label: 'انعطاف‌پذیر',
    description: 'بسته به حال و هوای روزم متفاوت است، گاهی آرام گاهی جدی‌تر',
    example: 'گاهی ممکن است نیاز به صحبت عمیق داشته باشم، گاهی فقط نیاز به گوش دادن',
  },
  {
    value: 'not-sure-comm',
    label: 'مطمئن نیستم',
    description: 'هنوز نمی‌دانم چه سبک ارتباطی برایم مناسب است',
    example: 'هوش مصنوعی در طول زمان یاد می‌گیرد چطور بهتر با شما ارتباط برقرار کند',
  },
]

const therapyApproaches = [
  {
    value: 'practical-thinking',
    label: 'تغییر نحوه فکر کردن',
    description: 'کمک به تشخیص و تغییر افکار منفی که باعث ناراحتی می‌شوند',
    example: 'مثل یاد گرفتن اینکه چطور به جای "همه چیز بد پیش می‌رود" بگوییم "این موقعیت سخت است ولی قابل حل"',
  },
  {
    value: 'mindfulness',
    label: 'آرامش و حضور در لحظه',
    description: 'یاد گرفتن تکنیک‌های آرام‌سازی و تمرکز بر لحظه حال',
    example: 'تکنیک‌های تنفس، مراقبه، و روش‌هایی برای کنترل اضطراب و استرس',
  },
  {
    value: 'solution-focused',
    label: 'حل مسئله و تمرکز بر راه‌حل',
    description: 'به جای پرداختن طولانی به مشکل، روی یافتن راه‌حل‌های عملی کار کنیم',
    example: 'تمرکز بر چیزهایی که می‌توانید تغییر دهید و اهداف کوچک و قابل دستیابی',
  },
  {
    value: 'talk-therapy',
    label: 'صحبت آزاد و کشف خود',
    description: 'فضایی امن برای صحبت و کشف احساسات و تجربیات شخصی',
    example: 'درک بهتر خودتان، رشد شخصی، و کار بر روی روابط و احساسات',
  },
  {
    value: 'not-sure',
    label: 'مطمئن نیستم / نمی‌دانم',
    description: 'هوش مصنوعی بر اساس نیازهای شما بهترین روش را انتخاب می‌کند',
    example: 'اگر با این مفاهیم آشنا نیستید، ما کمکتان می‌کنیم بهترین روش را پیدا کنید',
  },
]

const specificIssuesOptions = [
  'اضطراب و نگرانی', 'افسردگی و غمگینی', 'حملات پانیک', 'اضطراب اجتماعی',
  'مسائل خانوادگی', 'مشکلات ارتباطی', 'مشکلات زناشویی', 'مسائل فرزندپروری',
  'مشکلات کاری', 'استرس شغلی', 'فرسودگی شغلی', 'بیکاری',
  'کم اعتمادی به نفس', 'مشکلات خواب', 'اختلالات تغذیه', 'اعتیاد و سوء مصرف',
  'مدیریت خشم', 'کنترل تکانه', 'مشکلات مالی', 'بحران هویت',
  'سوگ و از دست دادن', 'تروما و PTSD', 'تصمیم‌گیری‌های مهم', 'تغییرات زندگی',
]

const copingMethodsOptions = {
  healthy: [
    'ورزش و فعالیت بدنی', 'مراقبه و یوگا', 'صحبت با دوستان', 'نوشتن و خاطره‌نویسی',
    'طبیعت‌گردی', 'موسیقی و هنر', 'مطالعه و یادگیری', 'کار با دست و هنرهای دستی',
    'تنفس عمیق', 'دعا و معنویت', 'کمک به دیگران', 'استراحت و خواب کافی',
  ],
  unhealthy: [
    'مصرف مواد (سیگار، الکل)', 'عقب‌نشینی اجتماعی', 'پرخوری یا کم‌خوری', 'انکار مسئله',
    'بازی‌های ویدئویی بیش از حد', 'خشونت و عصبانیت', 'خودآزاری', 'خرید بیش از حد',
    'اجتناب از مسئولیت‌ها', 'بی‌خوابی عمدی', 'منزوی شدن', 'سرزنش خود',
  ],
}

const educationOptions = [
  { value: 'elementary', label: 'ابتدایی' },
  { value: 'middle', label: 'راهنمایی' },
  { value: 'high-school', label: 'دبیرستان' },
  { value: 'diploma', label: 'دیپلم' },
  { value: 'associate', label: 'کاردانی' },
  { value: 'bachelor', label: 'کارشناسی' },
  { value: 'master', label: 'کارشناسی ارشد' },
  { value: 'phd', label: 'دکتری' },
  { value: 'other', label: 'سایر' },
]

const incomeOptions = [
  { value: 'very-low', label: 'خیلی کم - زیر ۵ میلیون تومان' },
  { value: 'low', label: 'کم - ۵ تا ۱۰ میلیون تومان' },
  { value: 'middle-low', label: 'متوسط رو به پایین - ۱۰ تا ۲۰ میلیون تومان' },
  { value: 'middle', label: 'متوسط - ۲۰ تا ۴۰ میلیون تومان' },
  { value: 'middle-high', label: 'متوسط رو به بالا - ۴۰ تا ۸۰ میلیون تومان' },
  { value: 'high', label: 'بالا - بیش از ۸۰ میلیون تومان' },
  { value: 'prefer-not-say', label: 'ترجیح می‌دهم نگویم' },
]

const locationOptions = [
  { value: 'tehran', label: 'تهران' },
  { value: 'isfahan', label: 'اصفهان' },
  { value: 'mashhad', label: 'مشهد' },
  { value: 'shiraz', label: 'شیراز' },
  { value: 'tabriz', label: 'تبریز' },
  { value: 'karaj', label: 'کرج' },
  { value: 'ahvaz', label: 'اهواز' },
  { value: 'qom', label: 'قم' },
  { value: 'other-major', label: 'شهر بزرگ دیگر' },
  { value: 'small-city', label: 'شهر کوچک' },
  { value: 'rural', label: 'روستایی' },
  { value: 'abroad', label: 'خارج از ایران' },
]

const ethnicityOptions = [
  { value: 'persian', label: 'فارس' },
  { value: 'azeri', label: 'آذری' },
  { value: 'kurd', label: 'کرد' },
  { value: 'lur', label: 'لر' },
  { value: 'arab', label: 'عرب' },
  { value: 'baloch', label: 'بلوچ' },
  { value: 'turkmen', label: 'ترکمن' },
  { value: 'mixed', label: 'مختلط' },
  { value: 'other', label: 'سایر' },
  { value: 'prefer-not-say', label: 'ترجیح می‌دهم نگویم' },
]

const religionOptions = [
  { value: 'shia', label: 'شیعه' },
  { value: 'sunni', label: 'سنی' },
  { value: 'christian', label: 'مسیحی' },
  { value: 'jewish', label: 'یهودی' },
  { value: 'zoroastrian', label: 'زرتشتی' },
  { value: 'bahai', label: 'بهایی' },
  { value: 'spiritual', label: 'معنوی اما غیر مذهبی' },
  { value: 'atheist', label: 'بی‌دین' },
  { value: 'agnostic', label: 'آگنوستیک' },
  { value: 'other', label: 'سایر' },
  { value: 'prefer-not-say', label: 'ترجیح می‌دهم نگویم' },
]

const languageOptions = [
  { value: 'persian-only', label: 'فقط فارسی' },
  { value: 'persian-english', label: 'فارسی و انگلیسی' },
  { value: 'persian-arabic', label: 'فارسی و عربی' },
  { value: 'persian-local', label: 'فارسی و زبان محلی' },
  { value: 'multilingual', label: 'چند زبانه' },
  { value: 'other', label: 'سایر' },
]

const familySizeOptions = [
  { value: 'alone', label: 'تنها زندگی می‌کنم' },
  { value: '2', label: '۲ نفر' },
  { value: '3', label: '۳ نفر' },
  { value: '4', label: '۴ نفر' },
  { value: '5', label: '۵ نفر' },
  { value: '6+', label: '۶ نفر یا بیشتر' },
]

const parentalStatusOptions = [
  { value: 'no-children', label: 'فرزندی ندارم' },
  { value: 'planning', label: 'در حال برنامه‌ریزی برای فرزند' },
  { value: 'pregnant', label: 'باردار هستم' },
  { value: 'infant', label: 'فرزند نوزاد دارم' },
  { value: 'young-children', label: 'فرزندان کوچک دارم' },
  { value: 'teenagers', label: 'فرزندان نوجوان دارم' },
  { value: 'adult-children', label: 'فرزندان بزرگسال دارم' },
  { value: 'mixed-ages', label: 'فرزندان در سنین مختلف' },
]

const providerPreferenceOptions = [
  {
    value: 'ai-only',
    label: 'فقط هوش مصنوعی',
    description: 'تمام جلسات با هوش مصنوعی انجام شود',
    example: 'در دسترس ۲۴/۷، بدون قضاوت، سرعت بالا در پاسخ‌دهی',
    icon: 'ph:robot',
  },
  {
    value: 'hybrid',
    label: 'ترکیبی (هوش مصنوعی + انسان)',
    description: 'ترکیب هوش مصنوعی برای پشتیبانی روزانه و متخصص انسانی برای جلسات عمیق',
    example: 'چت روزانه با AI + جلسه هفتگی با روانشناس',
    icon: 'ph:users',
  },
  {
    value: 'more-human',
    label: 'بیشتر انسان تا هوش مصنوعی',
    description: 'درمان اصلی با متخصص انسانی و هوش مصنوعی به عنوان پشتیبان',
    example: 'جلسات اصلی با روانشناس + ابزارهای کمکی AI',
    icon: 'ph:user-focus',
  },
  {
    value: 'human-only',
    label: 'فقط متخصص انسانی',
    description: 'تمام درمان توسط روانشناس یا روانپزشک انسانی',
    example: 'درمان سنتی با جلسات حضوری یا آنلاین با متخصص',
    icon: 'ph:user',
  },
]

// Validation helpers
const getFieldValidation = (fieldName: string) => {
  const value = formData.value[fieldName as keyof typeof formData.value] as string
  const trimmedLength = value?.trim().length || 0

  const requirements = {
    mainConcerns: { min: 15, message: 'لطفاً حداقل ۱۵ کاراکتر وارد کنید تا بتوانیم شما را بهتر درک کنیم' },
    impactOnLife: { min: 10, message: 'لطفاً حداقل ۱۰ کاراکتر وارد کنید تا تأثیر مسائل بر زندگی‌تان را بفهمیم' },
    lifeGoals: { min: 3, message: 'لطفاً حداقل ۳ کاراکتر وارد کنید' },
  }

  const requirement = requirements[fieldName as keyof typeof requirements]
  if (!requirement) return { isValid: true, remaining: 0, message: '' }

  const isValid = trimmedLength >= requirement.min
  const remaining = Math.max(0, requirement.min - trimmedLength)

  return {
    isValid,
    remaining,
    message: isValid ? '' : requirement.message,
    currentLength: trimmedLength,
  }
}

const getValidationErrors = computed(() => {
  const step = steps[currentStep.value]
  const errors: string[] = []

  switch (step.id) {
    case 'demographics':
      // Optional step - all fields are optional
      break
    case 'concerns':
      if (!getFieldValidation('mainConcerns').isValid) {
        errors.push('لطفاً مشکل اصلی خود را شرح دهید (حداقل ۱۵ کاراکتر)')
      }
      if (formData.value.symptomsStarted === '') {
        errors.push('لطفاً زمان شروع مشکلات را انتخاب کنید')
      }
      if (!getFieldValidation('impactOnLife').isValid) {
        errors.push('لطفاً تأثیر مسائل بر زندگی‌تان را شرح دهید (حداقل ۱۰ کاراکتر)')
      }
      break
    case 'emotional':
      if (formData.value.mood === '') {
        errors.push('لطفاً حال کلی خود را انتخاب کنید')
      }
      if (formData.value.emotionalState.length === 0) {
        errors.push('لطفاً حداقل یک احساس را انتخاب کنید')
      }
      break
    case 'physical':
      // Always valid as sliders have default values
      break
    case 'background':
      if (formData.value.age === '') {
        errors.push('لطفاً محدوده سنی خود را انتخاب کنید')
      }
      if (formData.value.relationshipStatus === '') {
        errors.push('لطفاً وضعیت ارتباطی خود را انتخاب کنید')
      }
      if (!getFieldValidation('lifeGoals').isValid) {
        errors.push('لطفاً اهداف و انتظارات خود را شرح دهید (حداقل ۳ کاراکتر)')
      }
      break
    case 'preferences':
      if (formData.value.preferredApproach === '') {
        errors.push('لطفاً نوع کمک مورد انتظار خود را انتخاب کنید')
      }
      if (formData.value.communicationStyle === '') {
        errors.push('لطفاً سبک ارتباطی مورد نظر خود را انتخاب کنید')
      }
      if (formData.value.providerPreference === '') {
        errors.push('لطفاً نوع ارائه‌دهنده درمان مورد نظر خود را انتخاب کنید')
      }
      if (formData.value.timeAvailability === '') {
        errors.push('لطفاً میزان وقت در دسترس خود را انتخاب کنید')
      }
      break
  }

  return errors
})

const isCurrentStepValid = computed(() => {
  return getValidationErrors.value.length === 0
})

const autoSaveAssessment = async () => {
  try {
    isAutoSaving.value = true
    if (!existingAssessmentId.value) {
      // Create a draft assessment for auto-save
      const draftData = {
        ...formData.value,
        status: 'draft' as const,
      }
      const newAssessment = await createAssessment(draftData)
      existingAssessmentId.value = newAssessment.id
    }
    else {
      // Update existing assessment
      const draftData = {
        ...formData.value,
        status: formData.value.status, // Keep existing status
      }
      await updateAssessment(existingAssessmentId.value, draftData)
    }
  }
  catch (error) {
    console.error('Auto-save failed:', error)
  }
  finally {
    isAutoSaving.value = false
  }
}

const debouncedAutoSave = () => {
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value)
  }

  autoSaveTimeout.value = setTimeout(() => {
    autoSaveAssessment()
  }, 2000) // Save after 2 seconds of inactivity
}

const loadExistingAssessment = async () => {
  try {
    isLoading.value = true
    const assessments = await getUserAssessments()

    if (assessments && assessments.length > 0) {
      // Get the most recent assessment (could be draft or completed)
      const latestAssessment = assessments[0]
      existingAssessmentId.value = latestAssessment.id

      // Populate form with existing data
      formData.value = {
        status: latestAssessment.status || 'draft',
        mainConcerns: latestAssessment.mainConcerns || '',
        triggerEvents: latestAssessment.triggerEvents || '',
        symptomsStarted: latestAssessment.symptomsStarted || '',
        impactOnLife: latestAssessment.impactOnLife || '',
        mood: latestAssessment.mood || '',
        emotionalState: latestAssessment.emotionalState || [],
        energyLevel: latestAssessment.energyLevel || 3,
        motivationLevel: latestAssessment.motivationLevel || 3,
        socialConnection: latestAssessment.socialConnection || 3,
        anxietyLevel: latestAssessment.anxietyLevel || 3,
        sleepQuality: latestAssessment.sleepQuality || 3,
        stressLevel: latestAssessment.stressLevel || 3,
        concentrationLevel: latestAssessment.concentrationLevel || 3,
        physicalSymptoms: latestAssessment.physicalSymptoms || [],
        age: latestAssessment.age || '',
        gender: latestAssessment.gender || '',
        relationshipStatus: latestAssessment.relationshipStatus || '',
        livingStatus: latestAssessment.livingStatus || '',
        workStatus: latestAssessment.workStatus || '',
        lifeGoals: latestAssessment.lifeGoals || '',
        previousTherapy: latestAssessment.previousTherapy || '',
        currentMedication: latestAssessment.currentMedication || '',
        supportSystem: latestAssessment.supportSystem || '',
        preferredApproach: latestAssessment.preferredApproach || '',
        timeAvailability: latestAssessment.timeAvailability || '',
        communicationStyle: latestAssessment.communicationStyle || '',
        providerPreference: latestAssessment.providerPreference || '',
        specificIssues: latestAssessment.specificIssues || [],
        copingMethods: latestAssessment.copingMethods || [],
        expectations: latestAssessment.expectations || '',
        education: latestAssessment.education || '',
        incomeLevel: latestAssessment.incomeLevel || '',
        location: latestAssessment.location || '',
        ethnicity: latestAssessment.ethnicity || '',
        religion: latestAssessment.religion || '',
        language: latestAssessment.language || '',
        familySize: latestAssessment.familySize || '',
        parentalStatus: latestAssessment.parentalStatus || '',
      }

      // If assessment is completed, start from the last step
      if (latestAssessment.status === 'completed') {
        currentStep.value = steps.length - 1
      }
    }
  }
  catch (error) {
    console.error('Error loading existing assessment:', error)
    // Continue with empty form if loading fails
  }
  finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadExistingAssessment()
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

// Watch for form data changes and auto-save
watch(formData, () => {
  if (!isLoading.value) {
    debouncedAutoSave()
  }
}, { deep: true })

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const fillTestData = () => {
  formData.value = {
    // Status remains automatic
    status: 'draft',

    // Step 1: Main concerns
    mainConcerns: 'احساس اضطراب شدید و افسردگی دارم. گاهی نمی‌توانم تمرکز کنم و احساس ناامیدی می‌کنم. مشکلات خواب و کاهش انرژی هم دارم.',
    triggerEvents: 'فشار کاری زیاد، مشکلات مالی و درگذشت یکی از اعضای خانواده',
    symptomsStarted: '6-months',
    impactOnLife: 'نمی‌توانم در محل کار عملکرد خوبی داشته باشم، روابطم با خانواده تیره شده و خوابم به هم ریخته است.',

    // Step 2: Current mood & emotional state
    mood: 'low',
    emotionalState: ['احساس غمگینی', 'نگرانی مداوم', 'احساس تنهایی', 'کم اعتمادی به نفس'],
    energyLevel: 2,
    motivationLevel: 2,
    socialConnection: 2,

    // Step 3: Physical & mental levels
    anxietyLevel: 4,
    sleepQuality: 2,
    stressLevel: 4,
    concentrationLevel: 2,
    physicalSymptoms: ['سردرد مکرر', 'خستگی مداوم', 'تپش قلب', 'مشکلات گوارشی'],

    // Step 4: Background & personal info
    age: '26-35',
    gender: 'female',
    relationshipStatus: 'single',
    livingStatus: 'alone',
    workStatus: 'employed',
    lifeGoals: 'می‌خواهم اضطرابم کمتر شود، خوابم بهتر شود و بتوانم در کار بهتر عملکرد داشته باشم. همچنین دوست دارم روابط اجتماعی بهتری داشته باشم.',
    previousTherapy: 'سال گذشته چند جلسه با روانشناس رفتم اما ادامه ندادم',
    currentMedication: 'هیچ دارویی مصرف نمی‌کنم',
    supportSystem: 'خانواده‌ام حمایت می‌کنند اما چند دوست صمیمی دارم که می‌توانم روی آن‌ها حساب کنم',

    // Step 5: Therapy preferences
    preferredApproach: 'cbt',
    timeAvailability: 'weekday-evening',
    communicationStyle: 'supportive',
    providerPreference: 'hybrid',
    specificIssues: ['اضطراب و نگرانی', 'افسردگی و غمگینی', 'مشکلات خواب', 'کم اعتمادی به نفس'],
    copingMethods: ['ورزش و فعالیت بدنی', 'صحبت با دوستان', 'مطالعه', 'عقب‌نشینی اجتماعی'],
    expectations: 'امیدوارم بتوانم ابزارهای لازم برای مدیریت اضطراب و بهبود خواب یاد بگیرم',

    // Step 6: Demographics
    education: 'bachelor',
    incomeLevel: 'middle',
    location: 'tehran',
    ethnicity: 'persian',
    religion: 'shia',
    language: 'persian-english',
    familySize: 'alone',
    parentalStatus: 'no-children',
  }

  // Navigate to the last step
  currentStep.value = steps.length - 1
}

const submitAssessment = async () => {
  isProcessing.value = true

  try {
    // Save assessment data to PocketBase
    const assessmentData = {
      ...formData.value,
      status: 'completed' as const, // Set status to completed when submitting
      completionTime: Math.round((Date.now() - new Date().getTime()) / 1000 / 60), // rough estimate
    }

    if (existingAssessmentId.value) {
      // Update existing assessment
      await updateAssessment(existingAssessmentId.value, assessmentData)
    }
    else {
      // Create new assessment
      const newAssessment = await createAssessment(assessmentData)
      existingAssessmentId.value = newAssessment.id
    }

    // Navigate directly to wait page for background processing
    router.push('/therapy-journey/wait')
  }
  catch (error) {
    console.error('Error saving assessment:', error)
    // You might want to show an error message to the user here
    // For now, still navigate to avoid blocking the user
    router.push('/therapy-journey/wait')
  }
  finally {
    isProcessing.value = false
  }
}

const toggleSpecificIssue = (issue: string) => {
  const index = formData.value.specificIssues.indexOf(issue)
  if (index === -1) {
    formData.value.specificIssues.push(issue)
  }
  else {
    formData.value.specificIssues.splice(index, 1)
  }
}

const toggleEmotionalState = (emotion: string) => {
  const index = formData.value.emotionalState.indexOf(emotion)
  if (index === -1) {
    formData.value.emotionalState.push(emotion)
  }
  else {
    formData.value.emotionalState.splice(index, 1)
  }
}

const togglePhysicalSymptom = (symptom: string) => {
  const index = formData.value.physicalSymptoms.indexOf(symptom)
  if (index === -1) {
    formData.value.physicalSymptoms.push(symptom)
  }
  else {
    formData.value.physicalSymptoms.splice(index, 1)
  }
}

const toggleCopingMethod = (method: string) => {
  const index = formData.value.copingMethods.indexOf(method)
  if (index === -1) {
    formData.value.copingMethods.push(method)
  }
  else {
    formData.value.copingMethods.splice(index, 1)
  }
}
</script>

<template>
  <div class="dark:from-muted-900 dark:to-muted-800 min-h-screen bg-gradient-to-br from-slate-50 to-white dark:bg-gradient-to-br">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="border-primary-200 border-t-primary-500 mx-auto mb-4 size-16 animate-spin rounded-full border-4" />
        <p class="text-muted-600 dark:text-muted-400">
          در حال بارگذاری اطلاعات شما...
        </p>
      </div>
    </div>

    <!-- Background particles -->
    <div v-else class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="bg-primary-300/20 absolute left-1/4 top-1/4 size-2 animate-pulse rounded-full" />
      <div class="bg-success-300/20 absolute right-1/3 top-3/4 size-3 animate-pulse rounded-full delay-500" />
      <div class="bg-info-300/20 absolute right-1/4 top-1/2 size-1 animate-pulse rounded-full delay-1000" />
      <div class="bg-warning-300/20 absolute bottom-1/4 left-1/3 size-2 animate-pulse rounded-full delay-700" />
    </div>

    <div v-if="!isLoading" class="relative flex flex-col px-6 py-8">
      <div class="relative mx-auto w-full max-w-4xl">
        <!-- Navigation Header -->
        <div
          class="mb-8 flex w-full items-center justify-between transition-all duration-1000"
          :class="{ 'translate-y-0 opacity-100': isVisible, '-translate-y-4 opacity-0': !isVisible }"
        >
          <NuxtLink
            to="/therapy-journey/welcome"
            class="text-muted-400 hover:text-primary-500 flex items-center gap-2 font-sans font-medium transition-all duration-300 hover:gap-3"
          >
            <Icon name="gg:arrow-long-right" class="size-5" />
            <span>بازگشت</span>
          </NuxtLink>

          <div class="flex items-center gap-3">
            <!-- Auto-save indicator -->
            <div
              v-if="isAutoSaving"
              class="text-muted-500 dark:text-muted-400 flex items-center gap-2 text-sm"
            >
              <div class="border-muted-300 border-t-primary-500 size-3 animate-spin rounded-full border-2" />
              ذخیره...
            </div>

            <!-- Test Button - Only visible in development -->
            <BaseButton
              v-if="isDevelopment"
              size="sm"
              color="warning"
              variant="outline"
              class="font-sans"
              @click="fillTestData"
            >
              <Icon name="ph:test-tube" class="ml-2 size-4" />
              تست
            </BaseButton>
            <BaseThemeToggle />
          </div>
        </div>

        <!-- Progress Indicator -->
        <div
          class="mb-8 transition-all delay-200 duration-1000"
          :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
        >
          <div class="mb-4 flex items-center justify-between">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex flex-1 flex-col items-center"
            >
              <div
                class="mb-2 flex size-10 items-center justify-center rounded-full transition-all duration-500"
                :class="{
                  'bg-primary-500 text-white': index <= currentStep,
                  'bg-muted-200 dark:bg-muted-700 text-muted-400': index > currentStep
                }"
              >
                <Icon :name="step.icon" class="size-5" />
              </div>
              <span
                class="text-center text-xs font-medium transition-colors duration-500"
                :class="{
                  'text-primary-600 dark:text-primary-400': index <= currentStep,
                  'text-muted-400': index > currentStep
                }"
              >
                {{ step.title }}
              </span>
            </div>
          </div>
          <div class="bg-muted-200 dark:bg-muted-700 h-2 w-full overflow-hidden rounded-full">
            <div
              class="bg-primary-500 h-full rounded-full transition-all duration-700 ease-out"
              :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
            />
          </div>
        </div>

        <!-- Assessment Form -->
        <div
          class="delay-400 transition-all duration-1000"
          :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-8 opacity-0': !isVisible }"
        >
          <div class="dark:bg-muted-800/60 rounded-2xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-sm">
            <!-- Step 1: Demographics -->
            <div v-if="currentStep === 0" class="space-y-8">
              <div class="mb-8 text-center">
                <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-teal-500/10">
                  <Icon name="ph:user" class="size-8 text-teal-500" />
                </div>
                <BaseHeading
                  as="h2"
                  size="2xl"
                  weight="bold"
                  class="mb-2 text-teal-700 dark:text-teal-300"
                >
                  {{ steps[0].title }}
                </BaseHeading>
                <BaseParagraph class="text-muted-600 dark:text-muted-300">
                  {{ steps[0].description }}
                </BaseParagraph>
              </div>

              <!-- Education & Socioeconomic -->
              <div class="rounded-xl bg-teal-50 p-6 dark:bg-teal-900/10">
                <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-teal-700 dark:text-teal-300">
                  <Icon name="ph:graduation-cap" class="size-5" />
                  تحصیلات و وضعیت اقتصادی
                </h3>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      میزان تحصیلات
                    </label>
                    <BaseSelect v-model="formData.education">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in educationOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      سطح درآمد خانوار (ماهانه)
                    </label>
                    <BaseSelect v-model="formData.incomeLevel">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in incomeOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>
                </div>
              </div>

              <!-- Location & Culture -->
              <div class="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/10">
                <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
                  <Icon name="ph:map-pin" class="size-5" />
                  موقعیت جغرافیایی و فرهنگی
                </h3>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      محل سکونت
                    </label>
                    <BaseSelect v-model="formData.location">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in locationOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      قومیت
                    </label>
                    <BaseSelect v-model="formData.ethnicity">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in ethnicityOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      باور مذهبی/معنوی
                    </label>
                    <BaseSelect v-model="formData.religion">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in religionOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      زبان‌های صحبت
                    </label>
                    <BaseSelect v-model="formData.language">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in languageOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>
                </div>
              </div>

              <!-- Family Structure -->
              <div class="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/10">
                <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-700 dark:text-purple-300">
                  <Icon name="ph:house" class="size-5" />
                  ساختار خانوادگی
                </h3>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      تعداد افراد خانوار
                    </label>
                    <BaseSelect v-model="formData.familySize">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in familySizeOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      وضعیت فرزندآوری
                    </label>
                    <BaseSelect v-model="formData.parentalStatus">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in parentalStatusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>
                </div>
              </div>

              <!-- Welcome Note -->
              <div class="rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 p-5 dark:from-teal-900/10 dark:to-blue-900/10">
                <div class="flex items-start gap-4">
                  <Icon name="ph:hand-waving" class="mt-0.5 size-6 text-teal-500" />
                  <div>
                    <p class="mb-2 font-semibold text-teal-700 dark:text-teal-300">
                      خوش آمدید!
                    </p>
                    <p class="mb-3 text-sm text-teal-600 dark:text-teal-400">
                      با آشنایی بهتر با شما می‌توانیم خدمات درمانی را بهتر شخصی‌سازی کنیم. تمام سوالات این بخش اختیاری هستند و می‌توانید هر کدام را که می‌خواهید رد کنید.
                    </p>
                    <p class="text-xs text-teal-500 dark:text-teal-400">
                      🔒 اطلاعات شما کاملاً محرمانه است و هیچ قضاوتی صورت نمی‌گیرد
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Main Concerns -->
            <div v-if="currentStep === 1" class="space-y-8">
              <div class="mb-8 text-center">
                <div class="bg-primary-500/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                  <Icon name="ph:heart" class="text-primary-500 size-8" />
                </div>
                <BaseHeading
                  as="h2"
                  size="2xl"
                  weight="bold"
                  class="text-primary-700 dark:text-primary-300 mb-2"
                >
                  {{ steps[1].title }}
                </BaseHeading>
                <BaseParagraph class="text-muted-600 dark:text-muted-300">
                  {{ steps[1].description }}
                </BaseParagraph>
              </div>

              <div class="space-y-6">
                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                    مشکل اصلی که شما را به اینجا آورده چیست؟ *
                  </label>
                  <BaseTextarea
                    v-model="formData.mainConcerns"
                    placeholder="مثلاً: احساس اضطراب زیادی دارم، نمی‌توانم بخوابم، مشکلات ارتباطی با همسرم دارم، استرس کاری زیاد است..."
                    rows="5"
                    class="w-full"
                    :class="{
                      'border-danger-300 focus:border-danger-500': !getFieldValidation('mainConcerns').isValid && formData.mainConcerns.length > 0
                    }"
                  />
                  <div class="mt-2 flex items-center justify-between">
                    <p
                      class="text-xs transition-colors duration-200"
                      :class="{
                        'text-muted-500': getFieldValidation('mainConcerns').isValid || formData.mainConcerns.length === 0,
                        'text-danger-600': !getFieldValidation('mainConcerns').isValid && formData.mainConcerns.length > 0
                      }"
                    >
                      {{ getFieldValidation('mainConcerns').isValid || formData.mainConcerns.length === 0
                        ? 'حداقل ۱۵ کاراکتر نیاز است'
                        : getFieldValidation('mainConcerns').message }}
                    </p>
                    <p class="text-muted-400 text-xs">
                      {{ getFieldValidation('mainConcerns').currentLength }}/15
                    </p>
                  </div>
                </div>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                    چه زمانی این مشکلات شروع شدند؟ *
                  </label>
                  <BaseSelect v-model="formData.symptomsStarted">
                    <option value="">
                      انتخاب کنید
                    </option>
                    <option value="recent">
                      اخیراً (کمتر از یک ماه)
                    </option>
                    <option value="few-months">
                      چند ماه پیش
                    </option>
                    <option value="this-year">
                      امسال
                    </option>
                    <option value="last-year">
                      سال گذشته
                    </option>
                    <option value="few-years">
                      چند سال پیش
                    </option>
                    <option value="childhood">
                      از کودکی
                    </option>
                    <option value="unknown">
                      مشخص نیست
                    </option>
                  </BaseSelect>
                </div>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                    آیا رویداد خاصی باعث شروع یا تشدید این مشکلات شده؟
                  </label>
                  <BaseTextarea
                    v-model="formData.triggerEvents"
                    placeholder="مثلاً: تغییر شغل، مرگ عزیزان، طلاق، مشکلات مالی، کووید، بیماری..."
                    rows="3"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                    این مسائل چگونه روی زندگی روزانه‌تان تأثیر گذاشته؟ *
                  </label>
                  <BaseTextarea
                    v-model="formData.impactOnLife"
                    placeholder="مثلاً: نمی‌توانم کار کنم، روابطم خراب شده، خوابم به هم ریخته، اشتهام کم شده..."
                    rows="4"
                    class="w-full"
                    :class="{
                      'border-danger-300 focus:border-danger-500': !getFieldValidation('impactOnLife').isValid && formData.impactOnLife.length > 0
                    }"
                  />
                  <div class="mt-2 flex items-center justify-between">
                    <p
                      class="text-xs transition-colors duration-200"
                      :class="{
                        'text-muted-500': getFieldValidation('impactOnLife').isValid || formData.impactOnLife.length === 0,
                        'text-danger-600': !getFieldValidation('impactOnLife').isValid && formData.impactOnLife.length > 0
                      }"
                    >
                      {{ getFieldValidation('impactOnLife').isValid || formData.impactOnLife.length === 0
                        ? 'حداقل ۱۰ کاراکتر نیاز است'
                        : getFieldValidation('impactOnLife').message }}
                    </p>
                    <p class="text-muted-400 text-xs">
                      {{ getFieldValidation('impactOnLife').currentLength }}/10
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-info-50 dark:bg-info-900/20 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <Icon name="ph:info" class="text-info-500 mt-0.5 size-5" />
                  <div>
                    <p class="text-info-700 dark:text-info-300 mb-1 text-sm font-medium">
                      یادآوری مهم
                    </p>
                    <p class="text-info-600 dark:text-info-400 text-sm">
                      اطلاعات شما کاملاً محرمانه است. هر چه جزئیات بیشتری ارائه دهید، کمک‌های شخصی‌سازی‌شده بهتری دریافت خواهید کرد.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Emotional State -->
            <div v-if="currentStep === 2" class="space-y-8">
              <div class="mb-8 text-center">
                <div class="bg-success-500/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                  <Icon name="ph:smiley" class="text-success-500 size-8" />
                </div>
                <BaseHeading
                  as="h2"
                  size="2xl"
                  weight="bold"
                  class="text-success-700 dark:text-success-300 mb-2"
                >
                  {{ steps[2].title }}
                </BaseHeading>
                <BaseParagraph class="text-muted-600 dark:text-muted-300">
                  {{ steps[2].description }}
                </BaseParagraph>
              </div>

              <div class="space-y-6">
                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                    حال کلی شما در هفته‌های اخیر چگونه بوده؟ *
                  </label>
                  <div class="space-y-3">
                    <div
                      v-for="option in moodOptions"
                      :key="option.value"
                      class="relative"
                    >
                      <input
                        :id="option.value"
                        v-model="formData.mood"
                        :value="option.value"
                        type="radio"
                        class="peer sr-only"
                      >
                      <label
                        :for="option.value"
                        class="dark:bg-muted-700 hover:border-muted-300 flex cursor-pointer items-center rounded-lg border-2 bg-white p-4 pr-6 transition-all duration-200"
                        :class="[
                          formData.mood === option.value
                            ? 'border-success-500 bg-success-50 dark:bg-success-900/20'
                            : 'border-muted-200 dark:border-muted-600'
                        ]"
                      >
                        <div
                          class="mr-4 flex size-4 items-center justify-center rounded-full border-2 transition-all duration-200"
                          :class="[
                            formData.mood === option.value
                              ? 'border-success-500 bg-success-500'
                              : 'border-muted-300 dark:border-muted-500'
                          ]"
                        >
                          <div
                            class="size-2 rounded-full bg-white transition-opacity duration-200"
                            :class="formData.mood === option.value ? 'opacity-100' : 'opacity-0'"
                          />
                        </div>
                        <span class="text-muted-700 dark:text-muted-200">{{ option.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                    کدام احساسات را اخیراً تجربه کرده‌اید؟ (حداقل یک مورد انتخاب کنید) *
                  </label>
                  <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <div
                      v-for="emotion in emotionalStateOptions"
                      :key="emotion"
                      class="dark:bg-muted-700 border-muted-200 dark:border-muted-600 hover:border-muted-300 cursor-pointer rounded-lg border-2 bg-white p-3 text-center text-sm transition-all duration-200"
                      :class="{
                        'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300': formData.emotionalState.includes(emotion)
                      }"
                      @click="toggleEmotionalState(emotion)"
                    >
                      {{ emotion }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <!-- Energy Level -->
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                      سطح انرژی ({{ formData.energyLevel }}/5)
                    </label>
                    <input
                      v-model.number="formData.energyLevel"
                      type="range"
                      min="1"
                      max="5"
                      class="bg-muted-200 dark:bg-muted-700 slider h-2 w-full cursor-pointer appearance-none rounded-lg"
                    >
                    <div class="text-muted-500 mt-2 flex justify-between text-xs">
                      <span>پایین</span>
                      <span>بالا</span>
                    </div>
                  </div>

                  <!-- Motivation Level -->
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                      انگیزه ({{ formData.motivationLevel }}/5)
                    </label>
                    <input
                      v-model.number="formData.motivationLevel"
                      type="range"
                      min="1"
                      max="5"
                      class="bg-muted-200 dark:bg-muted-700 slider h-2 w-full cursor-pointer appearance-none rounded-lg"
                    >
                    <div class="text-muted-500 mt-2 flex justify-between text-xs">
                      <span>کم</span>
                      <span>زیاد</span>
                    </div>
                  </div>

                  <!-- Social Connection -->
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                      ارتباط اجتماعی ({{ formData.socialConnection }}/5)
                    </label>
                    <input
                      v-model.number="formData.socialConnection"
                      type="range"
                      min="1"
                      max="5"
                      class="bg-muted-200 dark:bg-muted-700 slider h-2 w-full cursor-pointer appearance-none rounded-lg"
                    >
                    <div class="text-muted-500 mt-2 flex justify-between text-xs">
                      <span>منزوی</span>
                      <span>اجتماعی</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Physical & Mental Symptoms -->
            <div v-if="currentStep === 3" class="space-y-8">
              <div class="mb-8 text-center">
                <div class="bg-info-500/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                  <Icon name="ph:chart-bar" class="text-info-500 size-8" />
                </div>
                <BaseHeading
                  as="h2"
                  size="2xl"
                  weight="bold"
                  class="text-info-700 dark:text-info-300 mb-2"
                >
                  {{ steps[3].title }}
                </BaseHeading>
                <BaseParagraph class="text-muted-600 dark:text-muted-300">
                  {{ steps[3].description }}
                </BaseParagraph>
              </div>

              <div class="space-y-6">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <!-- Anxiety Level -->
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                      سطح اضطراب ({{ formData.anxietyLevel }}/5)
                    </label>
                    <input
                      v-model.number="formData.anxietyLevel"
                      type="range"
                      min="1"
                      max="5"
                      class="bg-muted-200 dark:bg-muted-700 slider h-2 w-full cursor-pointer appearance-none rounded-lg"
                    >
                    <div class="text-muted-500 mt-2 flex justify-between text-xs">
                      <span>آرام</span>
                      <span>پر اضطراب</span>
                    </div>
                  </div>

                  <!-- Sleep Quality -->
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                      کیفیت خواب ({{ formData.sleepQuality }}/5)
                    </label>
                    <input
                      v-model.number="formData.sleepQuality"
                      type="range"
                      min="1"
                      max="5"
                      class="bg-muted-200 dark:bg-muted-700 slider h-2 w-full cursor-pointer appearance-none rounded-lg"
                    >
                    <div class="text-muted-500 mt-2 flex justify-between text-xs">
                      <span>ضعیف</span>
                      <span>عالی</span>
                    </div>
                  </div>

                  <!-- Stress Level -->
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                      سطح استرس ({{ formData.stressLevel }}/5)
                    </label>
                    <input
                      v-model.number="formData.stressLevel"
                      type="range"
                      min="1"
                      max="5"
                      class="bg-muted-200 dark:bg-muted-700 slider h-2 w-full cursor-pointer appearance-none rounded-lg"
                    >
                    <div class="text-muted-500 mt-2 flex justify-between text-xs">
                      <span>آرام</span>
                      <span>پر استرس</span>
                    </div>
                  </div>

                  <!-- Concentration Level -->
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                      توانایی تمرکز ({{ formData.concentrationLevel }}/5)
                    </label>
                    <input
                      v-model.number="formData.concentrationLevel"
                      type="range"
                      min="1"
                      max="5"
                      class="bg-muted-200 dark:bg-muted-700 slider h-2 w-full cursor-pointer appearance-none rounded-lg"
                    >
                    <div class="text-muted-500 mt-2 flex justify-between text-xs">
                      <span>ضعیف</span>
                      <span>قوی</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                    آیا علائم جسمی زیر را تجربه می‌کنید؟ (اختیاری)
                  </label>
                  <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
                    <div
                      v-for="symptom in physicalSymptomsOptions"
                      :key="symptom"
                      class="dark:bg-muted-700 border-muted-200 dark:border-muted-600 hover:border-muted-300 cursor-pointer rounded-lg border-2 bg-white p-3 text-center text-sm transition-all duration-200"
                      :class="{
                        'border-info-500 bg-info-50 dark:bg-info-900/20 text-info-700 dark:text-info-300': formData.physicalSymptoms.includes(symptom)
                      }"
                      @click="togglePhysicalSymptom(symptom)"
                    >
                      {{ symptom }}
                    </div>
                  </div>
                </div>

                <div class="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <Icon name="ph:warning-circle" class="text-warning-500 mt-0.5 size-5" />
                    <div>
                      <p class="text-warning-700 dark:text-warning-300 mb-1 text-sm font-medium">
                        نکته مهم
                      </p>
                      <p class="text-warning-600 dark:text-warning-400 text-sm">
                        در صورت تجربه علائم جسمی شدید، حتماً با پزشک خود مشورت کنید. این ابزار جایگزین مشاوره پزشکی نیست.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: Background & Goals -->
            <div v-if="currentStep === 4" class="space-y-8">
              <div class="mb-8 text-center">
                <div class="bg-warning-500/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                  <Icon name="ph:user-circle" class="text-warning-500 size-8" />
                </div>
                <BaseHeading
                  as="h2"
                  size="2xl"
                  weight="bold"
                  class="text-warning-700 dark:text-warning-300 mb-2"
                >
                  {{ steps[4].title }}
                </BaseHeading>
                <BaseParagraph class="text-muted-600 dark:text-muted-300">
                  {{ steps[4].description }}
                </BaseParagraph>
              </div>

              <!-- Personal Information Section -->
              <div class="bg-warning-50 dark:bg-warning-900/10 rounded-xl p-6">
                <h3 class="text-warning-700 dark:text-warning-300 mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Icon name="ph:info" class="size-5" />
                  اطلاعات شخصی
                </h3>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      محدوده سنی *
                    </label>
                    <BaseSelect v-model="formData.age">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="range in ageRanges"
                        :key="range.value"
                        :value="range.value"
                      >
                        {{ range.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      جنسیت
                    </label>
                    <BaseSelect v-model="formData.gender">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="gender in genderOptions"
                        :key="gender.value"
                        :value="gender.value"
                      >
                        {{ gender.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      وضعیت ارتباطی *
                    </label>
                    <BaseSelect v-model="formData.relationshipStatus">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in relationshipOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      وضعیت زندگی
                    </label>
                    <BaseSelect v-model="formData.livingStatus">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in livingStatusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      وضعیت شغلی
                    </label>
                    <BaseSelect v-model="formData.workStatus">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option
                        v-for="option in workStatusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </BaseSelect>
                  </div>
                </div>
              </div>

              <!-- Medical History Section -->
              <div class="bg-info-50 dark:bg-info-900/10 rounded-xl p-6">
                <h3 class="text-info-700 dark:text-info-300 mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Icon name="ph:heart-straight" class="size-5" />
                  سابقه پزشکی و درمانی
                </h3>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      سابقه درمان روانشناسی
                    </label>
                    <BaseSelect v-model="formData.previousTherapy">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option value="none">
                        هیچ سابقه‌ای ندارم
                      </option>
                      <option value="individual">
                        درمان فردی داشته‌ام
                      </option>
                      <option value="group">
                        درمان گروهی داشته‌ام
                      </option>
                      <option value="medication">
                        تنها دارو مصرف کرده‌ام
                      </option>
                      <option value="both">
                        هم درمان هم دارو
                      </option>
                    </BaseSelect>
                  </div>

                  <div>
                    <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                      داروهای فعلی
                    </label>
                    <BaseSelect v-model="formData.currentMedication">
                      <option value="">
                        انتخاب کنید
                      </option>
                      <option value="none">
                        هیچ داروی روانپزشکی مصرف نمی‌کنم
                      </option>
                      <option value="antidepressant">
                        ضد افسردگی
                      </option>
                      <option value="anxiety">
                        ضد اضطراب
                      </option>
                      <option value="mood-stabilizer">
                        تنظیم‌کننده خلق
                      </option>
                      <option value="sleep">
                        داروی خواب
                      </option>
                      <option value="multiple">
                        چند نوع دارو
                      </option>
                      <option value="prefer-not-say">
                        ترجیح می‌دهم نگویم
                      </option>
                    </BaseSelect>
                  </div>
                </div>
              </div>

              <!-- Support System Section -->
              <div class="bg-success-50 dark:bg-success-900/10 rounded-xl p-6">
                <h3 class="text-success-700 dark:text-success-300 mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Icon name="ph:users-three" class="size-5" />
                  شبکه حمایتی
                </h3>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                    چه کسانی در زندگی‌تان هستند که می‌توانید روی آن‌ها حساب کنید؟
                  </label>
                  <BaseTextarea
                    v-model="formData.supportSystem"
                    placeholder="مثلاً: خانواده، دوستان نزدیک، همسر، همکاران... یا اینکه کسی نیست و احساس تنهایی می‌کنم"
                    rows="3"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Coping Methods Section -->
              <div class="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/10">
                <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-700 dark:text-purple-300">
                  <Icon name="ph:brain" class="size-5" />
                  روش‌های مقابله با استرس
                </h3>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                    معمولاً وقتی ناراحت یا استرس دارید چه کاری می‌کنید؟ (چند مورد انتخاب کنید)
                  </label>

                  <div class="space-y-4">
                    <!-- Healthy Coping Methods -->
                    <div>
                      <p class="text-success-700 dark:text-success-300 mb-3 text-sm font-medium">
                        روش‌های مثبت:
                      </p>
                      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
                        <div
                          v-for="method in copingMethodsOptions.healthy"
                          :key="method"
                          class="dark:bg-muted-700 border-muted-200 dark:border-muted-600 hover:border-muted-300 cursor-pointer rounded-lg border-2 bg-white p-3 text-center text-sm transition-all duration-200"
                          :class="{
                            'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300': formData.copingMethods.includes(method)
                          }"
                          @click="toggleCopingMethod(method)"
                        >
                          {{ method }}
                        </div>
                      </div>
                    </div>

                    <!-- Unhealthy Coping Methods -->
                    <div>
                      <p class="text-warning-700 dark:text-warning-300 mb-3 text-sm font-medium">
                        روش‌های منفی (صادقانه انتخاب کنید):
                      </p>
                      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
                        <div
                          v-for="method in copingMethodsOptions.unhealthy"
                          :key="method"
                          class="dark:bg-muted-700 border-muted-200 dark:border-muted-600 hover:border-muted-300 cursor-pointer rounded-lg border-2 bg-white p-3 text-center text-sm transition-all duration-200"
                          :class="{
                            'border-warning-500 bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300': formData.copingMethods.includes(method)
                          }"
                          @click="toggleCopingMethod(method)"
                        >
                          {{ method }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-info-50 dark:bg-info-900/20 mt-4 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                      <Icon name="ph:shield-check" class="text-info-500 mt-0.5 size-5" />
                      <p class="text-info-600 dark:text-info-400 text-sm">
                        انتخاب روش‌های منفی کمک می‌کند تا بهتر درکتان کنیم. هیچ قضاوتی نمی‌شود و این اطلاعات محرمانه است.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Goals Section -->
              <div class="from-primary-50 dark:from-primary-900/10 rounded-xl bg-gradient-to-r to-purple-50 p-6 dark:to-purple-900/10">
                <h3 class="text-primary-700 dark:text-primary-300 mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Icon name="ph:target" class="size-5" />
                  اهداف و انتظارات
                </h3>

                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                    اهداف زندگی و انتظارات از درمان *
                  </label>
                  <BaseTextarea
                    v-model="formData.lifeGoals"
                    placeholder="مثلاً: می‌خواهم اضطرابم کمتر شود، روابط بهتری داشته باشم، خوابم بهتر شود، اعتماد به نفسم بیشتر شود..."
                    rows="4"
                    class="w-full"
                    :class="{
                      'border-danger-300 focus:border-danger-500': !getFieldValidation('lifeGoals').isValid && formData.lifeGoals.length > 0
                    }"
                  />
                  <div class="mt-2 flex items-center justify-between">
                    <p
                      class="text-xs transition-colors duration-200"
                      :class="{
                        'text-muted-500': getFieldValidation('lifeGoals').isValid || formData.lifeGoals.length === 0,
                        'text-danger-600': !getFieldValidation('lifeGoals').isValid && formData.lifeGoals.length > 0
                      }"
                    >
                      {{ getFieldValidation('lifeGoals').isValid || formData.lifeGoals.length === 0
                        ? 'حداقل ۳ کاراکتر نیاز است'
                        : getFieldValidation('lifeGoals').message }}
                    </p>
                    <p class="text-muted-400 text-xs">
                      {{ getFieldValidation('lifeGoals').currentLength }}/3
                    </p>
                  </div>
                </div>
              </div>

              <!-- Specific Issues Selection -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                  موضوعات خاصی که می‌خواهید روی آن‌ها کار کنید (چند مورد انتخاب کنید)
                </label>
                <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <div
                    v-for="issue in specificIssuesOptions"
                    :key="issue"
                    class="dark:bg-muted-700 border-muted-200 dark:border-muted-600 hover:border-muted-300 cursor-pointer rounded-lg border-2 bg-white p-3 text-center text-sm transition-all duration-200"
                    :class="{
                      'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': formData.specificIssues.includes(issue)
                    }"
                    @click="toggleSpecificIssue(issue)"
                  >
                    {{ issue }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 6: Preferences -->
            <div v-if="currentStep === 5" class="space-y-6">
              <div class="mb-8 text-center">
                <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-500/10">
                  <Icon name="ph:gear" class="size-8 text-purple-500" />
                </div>
                <BaseHeading
                  as="h2"
                  size="2xl"
                  weight="bold"
                  class="mb-2 text-purple-700 dark:text-purple-300"
                >
                  {{ steps[5].title }}
                </BaseHeading>
                <BaseParagraph class="text-muted-600 dark:text-muted-300">
                  {{ steps[5].description }}
                </BaseParagraph>
              </div>

              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                  چه نوع کمکی از درمان انتظار دارید؟ *
                </label>
                <div class="space-y-4">
                  <div
                    v-for="approach in therapyApproaches"
                    :key="approach.value"
                    class="relative"
                  >
                    <input
                      :id="approach.value"
                      v-model="formData.preferredApproach"
                      :value="approach.value"
                      type="radio"
                      class="peer sr-only"
                    >
                    <label
                      :for="approach.value"
                      class="dark:bg-muted-700 hover:border-muted-300 flex cursor-pointer items-start rounded-xl border-2 bg-white p-5 transition-all duration-200 hover:shadow-md"
                      :class="[
                        formData.preferredApproach === approach.value
                          ? 'border-purple-500 bg-purple-50 shadow-lg dark:bg-purple-900/20'
                          : 'border-muted-200 dark:border-muted-600',
                        approach.value === 'not-sure' ? 'border-info-300 bg-info-25 dark:bg-info-900/10' : ''
                      ]"
                    >
                      <div
                        class="mr-4 mt-0.5 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200"
                        :class="[
                          formData.preferredApproach === approach.value
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-muted-300 dark:border-muted-500'
                        ]"
                      >
                        <div
                          class="size-2.5 rounded-full bg-white transition-opacity duration-200"
                          :class="formData.preferredApproach === approach.value ? 'opacity-100' : 'opacity-0'"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="text-muted-700 dark:text-muted-200 mb-2 text-base font-semibold">
                          {{ approach.label }}
                        </div>
                        <div class="text-muted-600 dark:text-muted-300 mb-3 text-sm leading-relaxed">
                          {{ approach.description }}
                        </div>
                        <div class="text-muted-500 dark:text-muted-400 bg-muted-50 dark:bg-muted-800 border-muted-300 rounded-lg border-r-4 p-3 text-xs">
                          <span class="font-medium">مثال:</span> {{ approach.example }}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="bg-info-50 dark:bg-info-900/20 mt-6 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <Icon name="ph:lightbulb" class="text-info-500 mt-0.5 size-5" />
                    <div>
                      <p class="text-info-700 dark:text-info-300 mb-1 text-sm font-medium">
                        نکته مهم
                      </p>
                      <p class="text-info-600 dark:text-info-400 text-sm">
                        اگر با این روش‌ها آشنا نیستید، نگران نباشید! گزینه "مطمئن نیستم" را انتخاب کنید تا ما بهترین روش را برایتان پیدا کنیم.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                  چه سبک ارتباطی را ترجیح می‌دهید؟ *
                </label>
                <div class="space-y-3">
                  <div
                    v-for="style in communicationStyles"
                    :key="style.value"
                    class="relative"
                  >
                    <input
                      :id="style.value"
                      v-model="formData.communicationStyle"
                      :value="style.value"
                      type="radio"
                      class="peer sr-only"
                    >
                    <label
                      :for="style.value"
                      class="dark:bg-muted-700 hover:border-muted-300 flex cursor-pointer items-start rounded-lg border-2 bg-white p-4 transition-all duration-200"
                      :class="[
                        formData.communicationStyle === style.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-muted-200 dark:border-muted-600',
                        style.value === 'not-sure-comm' ? 'border-info-300 bg-info-25 dark:bg-info-900/10' : ''
                      ]"
                    >
                      <div
                        class="mr-4 mt-1 flex size-4 items-center justify-center rounded-full border-2 transition-all duration-200"
                        :class="[
                          formData.communicationStyle === style.value
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-muted-300 dark:border-muted-500'
                        ]"
                      >
                        <div
                          class="size-2 rounded-full bg-white transition-opacity duration-200"
                          :class="formData.communicationStyle === style.value ? 'opacity-100' : 'opacity-0'"
                        />
                      </div>
                      <div>
                        <div class="text-muted-700 dark:text-muted-200 mb-1 font-medium">{{ style.label }}</div>
                        <div class="text-muted-500 dark:text-muted-400 mb-2 text-sm">{{ style.description }}</div>
                        <div class="text-muted-400 text-xs italic">{{ style.example }}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Provider Preference Section -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-4 block text-sm font-medium">
                  چه نوع ارائه‌دهنده درمان را ترجیح می‌دهید؟ *
                </label>
                <div class="space-y-4">
                  <div
                    v-for="provider in providerPreferenceOptions"
                    :key="provider.value"
                    class="relative"
                  >
                    <input
                      :id="provider.value"
                      v-model="formData.providerPreference"
                      :value="provider.value"
                      type="radio"
                      class="peer sr-only"
                    >
                    <label
                      :for="provider.value"
                      class="dark:bg-muted-700 hover:border-muted-300 flex cursor-pointer items-start rounded-xl border-2 bg-white p-5 transition-all duration-200 hover:shadow-md"
                      :class="[
                        formData.providerPreference === provider.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                          : 'border-muted-200 dark:border-muted-600'
                      ]"
                    >
                      <div
                        class="mr-4 mt-0.5 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200"
                        :class="[
                          formData.providerPreference === provider.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-muted-300 dark:border-muted-500'
                        ]"
                      >
                        <div
                          class="size-2.5 rounded-full bg-white transition-opacity duration-200"
                          :class="formData.providerPreference === provider.value ? 'opacity-100' : 'opacity-0'"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="mb-2 flex items-center gap-3">
                          <Icon :name="provider.icon" class="text-primary-600 dark:text-primary-400 size-6" />
                          <div class="text-muted-700 dark:text-muted-200 text-base font-semibold">
                            {{ provider.label }}
                          </div>
                        </div>
                        <div class="text-muted-600 dark:text-muted-300 mb-3 text-sm leading-relaxed">
                          {{ provider.description }}
                        </div>
                        <div class="text-muted-500 dark:text-muted-400 bg-muted-50 dark:bg-muted-800 border-primary-300 rounded-lg border-r-4 p-3 text-xs">
                          <span class="font-medium">مثال:</span> {{ provider.example }}
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="bg-primary-50 dark:bg-primary-900/20 mt-6 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <Icon name="ph:info" class="text-primary-500 mt-0.5 size-5" />
                    <div>
                      <p class="text-primary-700 dark:text-primary-300 mb-1 text-sm font-medium">
                        نکته مهم
                      </p>
                      <p class="text-primary-600 dark:text-primary-400 text-sm">
                        انتخاب شما بر کیفیت درمان تأثیر نمی‌گذارد. هر روش مزایای خاص خود را دارد و می‌توانید در طول درمان تغییر دهید.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-3 block text-sm font-medium">
                  چقدر وقت برای درمان دارید؟ *
                </label>
                <BaseSelect v-model="formData.timeAvailability">
                  <option value="">
                    انتخاب کنید
                  </option>
                  <option value="daily">
                    روزانه (۱۰-۳۰ دقیقه) - یک چت کوتاه هر روز
                  </option>
                  <option value="few-times-week">
                    چند بار در هفته - جلسات ۳۰-۶۰ دقیقه‌ای
                  </option>
                  <option value="weekly">
                    هفتگی - یک جلسه کامل در هفته
                  </option>
                  <option value="flexible">
                    انعطاف‌پذیر - بسته به وضعیت و نیازم
                  </option>
                  <option value="minimal">
                    حداقل ممکن - فقط وقتی واقعاً نیاز دارم
                  </option>
                </BaseSelect>
              </div>

              <div class="bg-success-50 dark:bg-success-900/20 mt-8 rounded-lg p-5">
                <div class="flex items-start gap-4">
                  <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-6" />
                  <div>
                    <p class="text-success-700 dark:text-success-300 mb-2 font-semibold">
                      تقریباً تمام شد!
                    </p>
                    <p class="text-success-600 dark:text-success-400 mb-3 text-sm">
                      هیچ نگرانی نداشته باشید - تمام این تنظیمات قابل تغییر هستند. هوش مصنوعی در طول زمان با شما هماهنگ می‌شود و روش کار را بهبود می‌دهد.
                    </p>
                    <p class="text-success-500 dark:text-success-400 text-xs">
                      🔒 تمام اطلاعات شما کاملاً محرمانه و امن نگهداری می‌شود
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Validation Errors -->
            <div
              v-if="getValidationErrors.length > 0"
              class="bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 mt-6 rounded-lg border p-4"
            >
              <div class="flex items-start gap-3">
                <Icon name="ph:warning-circle" class="text-danger-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <p class="text-danger-700 dark:text-danger-300 mb-2 text-sm font-medium">
                    لطفاً موارد زیر را تکمیل کنید:
                  </p>
                  <ul class="space-y-1">
                    <li
                      v-for="error in getValidationErrors"
                      :key="error"
                      class="text-danger-600 dark:text-danger-400 flex items-start gap-2 text-sm"
                    >
                      <span class="bg-danger-500 mt-2 size-1 shrink-0 rounded-full" />
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="border-muted-200 dark:border-muted-700 mt-8 flex items-center justify-between border-t pt-6">
              <BaseButton
                v-if="currentStep > 0"
                variant="pastel"
                color="muted"
                class="px-6"
                @click="prevStep"
              >
                <Icon name="ph:arrow-right" class="ml-2 size-4" />
                قبلی
              </BaseButton>
              <div v-else />

              <BaseButton
                v-if="currentStep < steps.length - 1"
                :disabled="!isCurrentStepValid"
                color="primary"
                class="px-8"
                @click="nextStep"
              >
                بعدی
                <Icon name="ph:arrow-left" class="mr-2 size-4" />
              </BaseButton>

              <BaseButton
                v-else
                :loading="isProcessing"
                :disabled="!isCurrentStepValid || isProcessing"
                color="success"
                class="px-8"
                @click="submitAssessment"
              >
                <Icon name="ph:robot" class="ml-2 size-4" />
                {{ isProcessing ? 'در حال آماده‌سازی...' : 'شروع گفت‌وگو با AI' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom slider styles */
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  border: 2px solid white;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.slider::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
}

.dark .slider {
  background: #374151;
}

.dark .slider::-webkit-slider-track {
  background: #374151;
}

.dark .slider::-webkit-slider-thumb {
  background: #60a5fa;
  box-shadow: 0 2px 8px rgba(96, 165, 250, 0.3);
}

.dark .slider::-moz-range-thumb {
  background: #60a5fa;
  box-shadow: 0 2px 8px rgba(96, 165, 250, 0.3);
}
</style>
