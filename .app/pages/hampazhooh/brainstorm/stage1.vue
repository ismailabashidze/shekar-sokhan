<script setup lang="ts">
  import { useVueFlow, type Node, type Edge } from '@vue-flow/core';
  import { onMounted } from 'vue';
  import { useBrainStorm } from '~/composables/useBrainStorm';

  interface Tool {
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success';
  }

  interface ScopeItem {
    question: string;
    placeholder: string;
    icon: string;
  }

  definePageMeta({
    title: 'مرحله ۱: تعریف حوزه و قاب مفهومی',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();
  const { streamChat, processing } = useOpenRouter();
  const { createBrainStorm, updateBrainStorm, getUserBrainStorms, getBrainStorm, currentBrainStorm, loading } = useBrainStorm();
  const { user } = useUser();

  // Ensure formData is properly initialized with default values
  const formData = ref({
    mainChallenge: '',
    researchDomain: [] as string[],
    keywords: [] as string[],
    focusLevel: '',
    stage: 'stage1',
    status: 'in_progress' as 'draft' | 'in_progress' | 'completed' | 'archived',
  });

  // Add defensive check to prevent SSR errors
  if (process.server && !formData.value) {
    formData.value = {
      mainChallenge: '',
      researchDomain: [] as string[],
      keywords: [] as string[],
      focusLevel: '',
      stage: 'stage1',
      status: 'in_progress' as 'draft' | 'in_progress' | 'completed' | 'archived',
    };
  }

  // Domain tags management
  const domainInput = ref('');
  const domainSuggestions = ref<string[]>([]);
  const defaultDomainSuggestions = [
    'روانشناسی',
    'علوم کامپیوتر',
    'مهندسی',
    'پزشکی',
    'علوم انسانی',
    'فناوری اطلاعات',
    'محیط زیست',
    'آموزش',
    'کسب و کار',
    'ریاضیات',
    'فیزیک',
    'شیمی',
    'بیولوژی',
    'جامعه شناسی',
    'اقتصاد',
    'حقوق',
    'هنر',
    'ادبیات',
    'تاریخ',
    'فلسفه',
  ];

  // Keywords management
  const keywordInput = ref('');
  const keywordSuggestions = ref<string[]>([]);
  const defaultKeywordSuggestions = [
    'یادگیری ماشین',
    'هوش مصنوعی',
    'تحلیل داده',
    'شبکه‌های عصبی',
    'پردازش زبان طبیعی',
    'بینایی ماشین',
    'یادگیری عمیق',
    'الگوریتم',
    'بازشناسی الگو',
    'کاوش داده',
    'اتوماسیون',
    'رباتیک',
    'اینترنت اشیاء',
    'بلوکچین',
    'محاسبات ابری',
    'امنیت سایبری',
    'توسعه نرم‌افزار',
    'طراحی سیستم',
    'پیش‌بینی',
    'طبقه‌بندی',
  ];

  // Initialize with default suggestions
  domainSuggestions.value = [...defaultDomainSuggestions];
  keywordSuggestions.value = [...defaultKeywordSuggestions];

  const addDomain = () => {
    const domain = domainInput.value.trim();
    if (domain && !formData.value.researchDomain.includes(domain)) {
      formData.value.researchDomain.push(domain);
      domainInput.value = '';
    }
  };

  const removeDomain = (index: number) => {
    formData.value.researchDomain.splice(index, 1);
  };

  const addKeyword = () => {
    const keyword = keywordInput.value.trim();
    if (keyword && !formData.value.keywords.includes(keyword)) {
      formData.value.keywords.push(keyword);
      keywordInput.value = '';
    }
  };

  const removeKeyword = (index: number) => {
    formData.value.keywords.splice(index, 1);
  };

  const handleKeywordKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addKeyword();
    }
  };

  const handleDomainKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addDomain();
    }
  };
  // AI Loading states for each field
  const mainChallengeAiLoading = ref(false);
  const researchDomainAiLoading = ref(false);
  const keywordsAiLoading = ref(false);
  const focusLevelAiLoading = ref(false);
  const smartCompleteLoading = ref(false);

  // Interactive Tools State
  const showWhQuestionsModal = ref(false);
  const showSwotModal = ref(false);

  // WH Questions Data
  const whQuestions = ref({
    what: '',
    why: '',
    how: '',
    who: '',
    where: '',
    when: '',
  });
  const whQuestionsLoading = ref(false);
  const currentWhQuestion = ref('what');

  // SWOT Data
  const swotData = ref({
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[],
  });
  const swotLoading = ref(false);
  const newSwotItem = ref('');
  const editingSwotItem = ref<{ category: string; index: number } | null>(null);
  const editingSwotText = ref('');

  // Separate input fields for each category
  const newStrength = ref('');
  const newWeakness = ref('');
  const newOpportunity = ref('');
  const newThreat = ref('');

  const tools: Tool[] = [
    {
      title: 'سؤال‌های WH',
      description: 'استفاده از سؤالات What, Why, How, Who, Where برای تعریف دقیق‌تر مسئله',
      icon: 'ph:question',
      color: 'info',
    },
    {
      title: 'تحلیل SWOT',
      description: 'شناسایی نقاط قوت، ضعف، فرصت‌ها و تهدیدهای حوزهٔ پژوهشی',
      icon: 'ph:chart-line-up',
      color: 'success',
    },
  ];

  const scopeItems: ScopeItem[] = [
    {
      question: 'سؤال یا چالش اصلی چیست؟',
      placeholder: 'سؤال تحقیق یا چالش اصلی را به صورت واضح بیان کنید',
      icon: 'ph:question',
    },
    {
      question: 'حوزهٔ دانشی خود کدام است؟',
      placeholder: 'روانشناسی، علوم کامپیوتر، مهندسی، پزشکی، علوم انسانی، فناوری اطلاعات، محیط زیست، آموزش، کسب و کار',
      icon: 'ph:books',
    },
    {
      question: 'کلیدواژه‌های پژوهش چیست؟',
      placeholder: 'یادگیری ماشین، هوش مصنوعی، تحلیل داده، شبکه‌های عصبی، پردازش زبان طبیعی',
      icon: 'ph:key',
    },
    {
      question: 'سطح تمرکز پژوهش چیست؟',
      placeholder: 'کاربردی، نظری، بین‌رشته‌ای؟',
      icon: 'ph:target',
    },
  ];

  const focusLevels = [
    { value: 'applied', label: 'کاربردی', description: 'تحقیقی با هدف حل مسائل عملی' },
    { value: 'theoretical', label: 'نظری', description: 'تحقیقی با هدف توسعه دانش نظری' },
    { value: 'interdisciplinary', label: 'بین‌رشته‌ای', description: 'تحقیقی که از چند حوزه استفاده می‌کند' },
    { value: 'mixed', label: 'ترکیبی', description: 'ترکیبی از رویکردهای نظری و کاربردی' },
  ];

  // AI Suggestion Function
  async function suggestAIField(field: string) {
    // Check if main challenge exists for keywords generation
    if (field === 'keywords' && (!formData.value || !formData.value.mainChallenge?.trim())) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا سؤال یا چالش اصلی پژوهش را وارد کنید تا بتوانیم کلیدواژه‌های مرتبط را پیشنهاد دهیم.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }
    // Set loading state
    switch (field) {
      case 'mainChallenge':
        mainChallengeAiLoading.value = true;
        break;
      case 'researchDomain':
        researchDomainAiLoading.value = true;
        break;
      case 'keywords':
        keywordsAiLoading.value = true;
        break;
      case 'focusLevel':
        focusLevelAiLoading.value = true;
        break;
    }

    try {
      // Get context from existing fields
      const context = {
        mainChallenge: formData.value?.mainChallenge || '',
        researchDomain: formData.value?.researchDomain?.join(', ') || '',
        keywords: formData.value?.keywords?.join(', ') || '',
        focusLevel: formData.value?.focusLevel || '',
      };

      const contextMapping = {
        mainChallenge: 'چالش اصلی',
        researchDomain: 'حوزه دانشی',
        keywords: 'کلیدواژه‌ها',
        focusLevel: 'سطح تمرکز',
      };

      // Get focus level label if selected
      let enrichedContext = { ...context };
      if (enrichedContext.focusLevel) {
        const selectedLevel = focusLevels.find((l) => l.value === enrichedContext.focusLevel);
        if (selectedLevel) {
          enrichedContext.focusLevel = `${selectedLevel.label} (${selectedLevel.description})`;
        }
      }

      const contextString = Object.entries(enrichedContext)
        .filter(([key]) => key !== field && enrichedContext[key])
        .map(([key, val]) => `${contextMapping[key] || key}: ${val}`)
        .join('\n');

      // Field-specific prompts
      const prompts = {
        mainChallenge: `یک سؤال تحقیقاتی قوی، واضح و قابل پاسخ برای پژوهش پیشنهاد بده که:
- مشخص و دقیق باشد
- قابل بررسی و پاسخ باشد
- اهمیت علمی و عملی داشته باشد
- با حوزه دانشی مرتبط باشد
${contextString ? `\nاطلاعات موجود:\n${contextString}` : ''}
فقط سؤال تحقیق را بنویس، بدون توضیحات اضافی.`,

        researchDomain: `بر اساس چالش تحقیقاتی، حوزه‌های دانشی مناسب برای این پژوهش را به صورت یک آرایه JSON پیشنهاد بده. حوزه‌ها باید:
- با موضوع تحقیق مرتبط باشند
- مشخص و دقیق باشند
- در صورت نیاز، رویکردهای بین‌رشته‌ای را شامل شوند
${contextString ? `\nاطلاعات موجود:\n${contextString}` : ''}

فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
["حوزه اول", "حوزه دوم", "حوزه سوم", "حوزه چهارم", "حوزه پنجم"]`,

        keywords: `بر اساس چالش تحقیقاتی و حوزه دانشی، کلیدواژه‌های تخصصی و مهم این پژوهش را به صورت یک آرایه JSON پیشنهاد بده. کلیدواژه‌ها باید:
- تخصصی و دقیق باشند
- مفاهیم اصلی پژوهش را پوشش دهند
- برای جستجو در پایگاه‌های علمی مناسب باشند
- انگلیسی یا فارسی باشند (ترجیحاً فارسی برای این پژوهش)
${contextString ? `\nاطلاعات موجود:\n${contextString}` : ''}

فقط یک آرایه JSON معتبر با فرمت زیر برگردان:
["کلیدواژه اول", "کلیدواژه دوم", "کلیدواژه سوم", "کلیدواژه چهارم", "کلیدواژه پنجم"]`,

        focusLevel: `بر اساس چالش تحقیقاتی و حوزه دانشی، مناسب‌ترین سطح تمرکز را از بین گزینه‌های زیر انتخاب کن:
- applied (کاربردی): تحقیق با هدف حل مسائل عملی
- theoretical (نظری): تحقیق با هدف توسعه دانش نظری
- interdisciplinary (بین‌رشته‌ای): تحقیق که از چند حوزه استفاده می‌کند
- mixed (ترکیبی): ترکیبی از رویکردهای نظری و کاربردی

${contextString ? `\nاطلاعات موجود:\n${contextString}` : ''}
فقط یکی از مقادیر: applied, theoretical, interdisciplinary, mixed را برگردان.`,
      };

      const prompt = prompts[field] || 'یک مقدار مناسب پیشنهاد بده.';
      const userContent =
        field === 'researchDomain' ? formData.value?.researchDomain?.join(', ') || '' : formData.value?.[field] || '';
      const messages = [
        {
          role: 'user',
          content: userContent ? `${prompt}\n\nمقدار فعلی: ${userContent}` : prompt,
        },
      ];

      let suggestion = '';

      // Stream AI response
      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            suggestion += chunk;

            // Update field in real-time
            if (field === 'focusLevel') {
              // For focus level, find matching value
              const trimmedSuggestion = suggestion.trim().toLowerCase();
              const matchedLevel = focusLevels.find(
                (l) => trimmedSuggestion.includes(l.value) || l.value.includes(trimmedSuggestion),
              );
              if (matchedLevel && formData.value) {
                formData.value.focusLevel = matchedLevel.value;
              }
            } else if (field === 'researchDomain') {
              // For research domain, wait for complete response and parse JSON
              // Don't update in real-time, wait for final result
            } else if (field === 'keywords') {
              // For keywords, wait for complete response and parse JSON
              // Don't update in real-time, wait for final result
            } else {
              // For text fields, replace with AI suggestion (not append)
              if (formData.value) {
                formData.value[field] = suggestion;
              }
            }
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Handle researchDomain and keywords separately after completion
      if (field === 'researchDomain') {
        try {
          // Try to parse as JSON array
          const jsonMatch = suggestion.match(/\[.*?\]/s);
          if (jsonMatch) {
            const domains = JSON.parse(jsonMatch[0]);
            if (Array.isArray(domains)) {
              // Clear existing domains and add new ones
              if (formData.value) {
                formData.value.researchDomain = domains.filter((d) => d && typeof d === 'string').map((d) => d.trim());
              }

              // Update domain suggestions with AI-generated ones
              domainSuggestions.value = [...domains, ...defaultDomainSuggestions.slice(0, 5)];
            }
          } else {
            // Fallback: try to parse as comma-separated list
            const domains = suggestion
              .split(/[,،\n]/)
              .map((d) => d.trim())
              .filter((d) => d && !d.startsWith('-') && !d.includes('مثال'));
            if (domains.length > 0) {
              if (formData.value) {
                formData.value.researchDomain = [...new Set([...formData.value.researchDomain, ...domains])];
              }
            }
          }
        } catch (error) {
          console.warn('Error parsing research domain suggestions:', error);
          // Fallback to simple parsing
          const domains = suggestion
            .split(/[,،\n]/)
            .map((d) => d.trim())
            .filter((d) => d && !d.startsWith('-'));
          if (domains.length > 0) {
            if (formData.value) {
              formData.value.researchDomain = [...new Set([...formData.value.researchDomain, ...domains])];
            }
          }
        }
      }

      if (field === 'keywords') {
        try {
          // Try to parse as JSON array
          const jsonMatch = suggestion.match(/\[.*?\]/s);
          if (jsonMatch) {
            const keywords = JSON.parse(jsonMatch[0]);
            if (Array.isArray(keywords)) {
              // Clear existing keywords and add new ones
              if (formData.value) {
                formData.value.keywords = keywords.filter((k) => k && typeof k === 'string').map((k) => k.trim());
              }

              // Update keyword suggestions with AI-generated ones
              keywordSuggestions.value = [...keywords, ...defaultKeywordSuggestions.slice(0, 5)];
            }
          } else {
            // Fallback: try to parse as comma-separated list
            const keywords = suggestion
              .split(/[,،\n]/)
              .map((k) => k.trim())
              .filter((k) => k && !k.startsWith('-') && !k.includes('مثال'));
            if (keywords.length > 0) {
              formData.value.keywords = [...new Set([...formData.value.keywords, ...keywords])];
            }
          }
        } catch (error) {
          console.warn('Error parsing keyword suggestions:', error);
          // Fallback to simple parsing
          const keywords = suggestion
            .split(/[,،\n]/)
            .map((k) => k.trim())
            .filter((k) => k && !k.startsWith('-'));
          if (keywords.length > 0) {
            if (formData.value) {
              formData.value.keywords = [...new Set([...formData.value.keywords, ...keywords])];
            }
          }
        }
      }

      // Success toast removed to reduce number of notifications

      // Update domain suggestions if main challenge was suggested (researchDomain updates its own suggestions)
      if (field === 'mainChallenge') {
        await generateDomainSuggestions();
      }
    } catch (e: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در دریافت پیشنهاد: ${e.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      // Reset loading state
      switch (field) {
        case 'mainChallenge':
          mainChallengeAiLoading.value = false;
          break;
        case 'researchDomain':
          researchDomainAiLoading.value = false;
          break;
        case 'keywords':
          keywordsAiLoading.value = false;
          break;
        case 'focusLevel':
          focusLevelAiLoading.value = false;
          break;
      }
    }
  }

  // Smart Complete - Fill all fields intelligently
  async function smartComplete() {
    if (!formData.value.mainChallenge.trim()) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا چالش اصلی پژوهش را وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    smartCompleteLoading.value = true;

    try {
      toaster.show({
        title: 'در حال همگام‌سازی',
        message: 'تمام فیلدها بر اساس چالش اصلی به‌روزرسانی می‌شوند...',
        color: 'info',
        icon: 'svg-spinners:90-ring-with-bg',
        timeout: 0,
      });

      // Sync fields in optimal order
      const syncOrder = ['researchDomain', 'keywords', 'focusLevel'];

      for (const fieldName of syncOrder) {
        try {
          await suggestAIField(fieldName);
          // Short delay between requests
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.warn(`خطا در همگام‌سازی ${fieldName}:`, error);
        }
      }

      // Success toast removed to reduce number of notifications
    } catch (error) {
      console.error('خطا در همگام‌سازی:', error);
      toaster.show({
        title: 'خطا',
        message: 'خطا در همگام‌سازی فیلدها. لطفاً دوباره امتحان کنید.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      smartCompleteLoading.value = false;
    }
  }

  // Generate Test Data Function
  const generateTestData = () => {
    const testData = {
      mainChallenge:
        'چگونه می‌توان تأثیر استفاده از هوش مصنوعی در بهبود فرآیندهای آموزشی در مدارس ابتدایی را ارزیابی و تحلیل کرد؟',
      researchDomain: ['علوم تربیتی', 'هوش مصنوعی', 'فناوری آموزشی', 'روانشناسی تربیتی'],
      keywords: ['یادگیری ماشین', 'هوش مصنوعی در آموزش', 'شخصی‌سازی آموزش', 'ارزیابی آموزشی', 'فناوری آموزشی'],
      focusLevel: 'applied',
    };

    const whTestData = {
      what: 'تأثیر ابزارهای مبتنی بر هوش مصنوعی بر یادگیری و engagement دانش‌آموزان',
      why: 'آموزش سنتی نیاز به تحول دیجیتال دارد و هوش مصنوعی پتانسیل شخصی‌سازی آموزش را دارد',
      how: 'طراحی آزمایش کنترل‌شده با گروه آزمایش (استفاده از هوش مصنوعی) و گروه کنترل (روش سنتی)',
      who: 'دانش‌آموزان کلاس‌های سوم تا پنجم ابتدایی، معلمان، والدین و مدیران مدارس',
      where: '۵ مدرسه ابتدایی در منطقه شهری با امکانات فناوری مناسب',
      when: 'طی سال تحصیلی ۱۴۰۳-۱۴۰۴ به صورت ماهانه',
    };

    const swotTestData = {
      strengths: ['دسترسی به مدارس همکار', 'تخصص تیم در فناوری آموزشی', 'حمایت دانشگاه', 'نوآوری بودن موضوع'],
      weaknesses: [
        'محدودیت زمان جمع‌آوری داده',
        'نیاز به تجهیزات فنی',
        'مقاومت معلمان در برابر تغییر',
        'عدم تجربه قبلی در مقیاس بزرگ',
      ],
      opportunities: [
        'حمایت دولت از تحول دیجیتال',
        'علاقه روزافزون به هوش مصنوعی',
        'نیاز مبرم به بهبود کیفیت آموزش',
        'وجود پلتفرم‌های آماده',
      ],
      threats: [
        'چالش‌های حریم خصوصی دانش‌آموزان',
        'تغییر سریع تکنولوژی',
        'محدودیت‌های بودجه‌ای',
        'مخالفت اولیا نسبت به روش‌های جدید',
      ],
    };

    // Fill form data
    formData.value = { ...testData };

    // Update suggestions
    domainSuggestions.value = [...testData.researchDomain, ...defaultDomainSuggestions.slice(0, 3)];
    keywordSuggestions.value = [...testData.keywords, ...defaultKeywordSuggestions.slice(0, 3)];

    // Fill WH questions
    whQuestions.value = { ...whTestData };

    // Fill SWOT data
    swotData.value = { ...swotTestData };

    // Success toast removed to reduce number of notifications
  };

  // WH Questions Wizard Functions
  const openWhQuestionsWizard = () => {
    if (!formData.value.mainChallenge.trim()) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا چالش اصلی پژوهش را وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }
    showWhQuestionsModal.value = true;
    currentWhQuestion.value = 'what';
  };

  const whQuestionLabels = {
    what: {
      label: 'چه چیزی؟ (What)',
      icon: 'ph:question',
      prompt: 'موضوع اصلی تحقیق چیست؟ چه مسئله‌ای را بررسی می‌کنید?',
    },
    why: { label: 'چرا؟ (Why)', icon: 'ph:lightbulb', prompt: 'چرا این تحقیق مهم است؟ انگیزه و اهمیت آن چیست؟' },
    how: { label: 'چگونه؟ (How)', icon: 'ph:gear', prompt: 'چگونه این تحقیق را انجام خواهید داد؟ روش‌ها چیست؟' },
    who: { label: 'چه کسانی؟ (Who)', icon: 'ph:users', prompt: 'چه کسانی تأثیرگذار هستند؟ جامعه هدف کیست؟' },
    where: { label: 'کجا؟ (Where)', icon: 'ph:map-pin', prompt: 'محیط و مکان تحقیق کجاست؟' },
    when: { label: 'چه زمانی؟ (When)', icon: 'ph:calendar', prompt: 'بازه زمانی تحقیق چیست؟' },
  };

  const whQuestionOrder = ['what', 'why', 'how', 'who', 'where', 'when'];

  // WH Questions completion status
  const whQuestionsStatus = computed(() => {
    const filledQuestions = Object.values(whQuestions.value).filter((answer) => answer && answer.trim() !== '');
    const totalQuestions = whQuestionOrder.length;
    const percentage = (filledQuestions.length / totalQuestions) * 100;

    if (percentage === 0) return { status: 'empty', percentage: 0, text: 'تکمیل نشده', color: 'muted' };
    if (percentage === 100) return { status: 'completed', percentage: 100, text: 'تکمیل شده', color: 'success' };
    return { status: 'partial', percentage, text: `${filledQuestions.length}/${totalQuestions}`, color: 'warning' };
  });

  // SWOT completion status
  const swotStatus = computed(() => {
    const totalItems =
      swotData.value.strengths.length +
      swotData.value.weaknesses.length +
      swotData.value.opportunities.length +
      swotData.value.threats.length;

    if (totalItems === 0) return { status: 'empty', percentage: 0, text: 'تکمیل نشده', color: 'muted' };
    if (totalItems >= 4) return { status: 'completed', percentage: 100, text: 'تکمیل شده', color: 'success' };
    return { status: 'partial', percentage: (totalItems / 4) * 100, text: `${totalItems} مورد`, color: 'warning' };
  });

  async function generateWhAnswer(question: string) {
    whQuestionsLoading.value = true;
    try {
      const prompt = `بر اساس چالش تحقیقاتی زیر، به سؤال "${whQuestionLabels[question].prompt}" پاسخ دهید:

چالش تحقیقاتی: ${formData.value.mainChallenge}
${formData.value.researchDomain.length > 0 ? `حوزه دانشی: ${formData.value.researchDomain.join(', ')}` : ''}

پاسخ را به صورت واضح، مختصر و مفید بنویسید.`;

      const messages = [{ role: 'user', content: prompt }];
      let answer = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            answer += chunk;
            whQuestions.value[question] = answer;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Success toast removed to reduce number of notifications
    } catch (error) {
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید پاسخ. لطفاً دوباره امتحان کنید.',
        color: 'danger',
        icon: 'ph:warning',
      });
    } finally {
      whQuestionsLoading.value = false;
    }
  }

  const nextWhQuestion = () => {
    const currentIndex = whQuestionOrder.indexOf(currentWhQuestion.value);
    if (currentIndex < whQuestionOrder.length - 1) {
      currentWhQuestion.value = whQuestionOrder[currentIndex + 1];
    }
  };

  const prevWhQuestion = () => {
    const currentIndex = whQuestionOrder.indexOf(currentWhQuestion.value);
    if (currentIndex > 0) {
      currentWhQuestion.value = whQuestionOrder[currentIndex - 1];
    }
  };

  const applyWhQuestions = () => {
    // WH questions are already saved separately in whQuestions object
    // No need to append them to mainChallenge
    showWhQuestionsModal.value = false;
  };

  // SWOT Matrix Functions
  const openSwotMatrix = () => {
    if (!formData.value.mainChallenge.trim()) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا چالش اصلی پژوهش را وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }
    showSwotModal.value = true;
  };

  async function generateSwotAnalysis() {
    swotLoading.value = true;
    try {
      const prompt = `بر اساس چالش تحقیقاتی زیر، یک تحلیل SWOT کامل ارائه دهید:

چالش تحقیقاتی: ${formData.value.mainChallenge}
${formData.value.researchDomain.length > 0 ? `حوزه دانشی: ${formData.value.researchDomain.join(', ')}` : ''}

پاسخ را حتماً به صورت یک آبجکت JSON معتبر برگردانید با ساختار زیر:
{
  "strengths": ["نقطه قوت ۱", "نقطه قوت ۲"],
  "weaknesses": ["نقطه ضعف ۱", "نقطه ضعف ۲"],
  "opportunities": ["فرصت ۱", "فرصت ۲"],
  "threats": ["تهدید ۱", "تهدید ۲"]
}

نکات مهم:
- هر بخش باید حداقل ۲ مورد داشته باشد
- موارد باید مختصر و مرتبط با تحقیق باشند
- فقط JSON خالص برگردانید، بدون متن اضافی`;

      const messages = [{ role: 'user', content: prompt }];
      let result = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            result += chunk;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Parse the structured JSON response
      try {
        // Clean up the result to extract JSON
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const swotJson = JSON.parse(jsonMatch[0]);

          // Update the swotData with parsed values
          if (swotJson.strengths && Array.isArray(swotJson.strengths)) {
            swotData.value.strengths = swotJson.strengths
              .filter((item) => item && typeof item === 'string')
              .map((item) => item.trim());
          }
          if (swotJson.weaknesses && Array.isArray(swotJson.weaknesses)) {
            swotData.value.weaknesses = swotJson.weaknesses
              .filter((item) => item && typeof item === 'string')
              .map((item) => item.trim());
          }
          if (swotJson.opportunities && Array.isArray(swotJson.opportunities)) {
            swotData.value.opportunities = swotJson.opportunities
              .filter((item) => item && typeof item === 'string')
              .map((item) => item.trim());
          }
          if (swotJson.threats && Array.isArray(swotJson.threats)) {
            swotData.value.threats = swotJson.threats
              .filter((item) => item && typeof item === 'string')
              .map((item) => item.trim());
          }
        } else {
          // Fallback to old parsing method if JSON not found
          throw new Error('JSON response not found');
        }
      } catch (parseError) {
        // Fallback parsing if JSON parsing fails
        const strengthsMatch = result.match(/STRENGTHS:(.*?)(?=WEAKNESSES:|$)/s);
        const weaknessesMatch = result.match(/WEAKNESSES:(.*?)(?=OPPORTUNITIES:|$)/s);
        const opportunitiesMatch = result.match(/OPPORTUNITIES:(.*?)(?=THREATS:|$)/s);
        const threatsMatch = result.match(/THREATS:(.*?)$/s);

        if (strengthsMatch) {
          swotData.value.strengths = strengthsMatch[1]
            .trim()
            .split('\n')
            .filter((line) => line.trim().startsWith('-'))
            .map((line) => line.replace(/^-\s*/, '').trim())
            .filter((item) => item);
        }
        if (weaknessesMatch) {
          swotData.value.weaknesses = weaknessesMatch[1]
            .trim()
            .split('\n')
            .filter((line) => line.trim().startsWith('-'))
            .map((line) => line.replace(/^-\s*/, '').trim())
            .filter((item) => item);
        }
        if (opportunitiesMatch) {
          swotData.value.opportunities = opportunitiesMatch[1]
            .trim()
            .split('\n')
            .filter((line) => line.trim().startsWith('-'))
            .map((line) => line.replace(/^-\s*/, '').trim())
            .filter((item) => item);
        }
        if (threatsMatch) {
          swotData.value.threats = threatsMatch[1]
            .trim()
            .split('\n')
            .filter((line) => line.trim().startsWith('-'))
            .map((line) => line.replace(/^-\s*/, '').trim())
            .filter((item) => item);
        }
      }

      // Success toast removed to reduce number of notifications
    } catch (error) {
      console.error('SWOT generation error:', error);
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید تحلیل SWOT.',
        color: 'danger',
        icon: 'ph:warning',
      });
    } finally {
      swotLoading.value = false;
    }
  }

  const addSwotItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    let inputValue = '';
    let targetRef: any;

    switch (category) {
      case 'strengths':
        inputValue = newStrength.value.trim();
        targetRef = newStrength;
        break;
      case 'weaknesses':
        inputValue = newWeakness.value.trim();
        targetRef = newWeakness;
        break;
      case 'opportunities':
        inputValue = newOpportunity.value.trim();
        targetRef = newOpportunity;
        break;
      case 'threats':
        inputValue = newThreat.value.trim();
        targetRef = newThreat;
        break;
    }

    if (inputValue) {
      swotData.value[category].push(inputValue);
      targetRef.value = '';
    }
  };

  const startEditSwotItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
    editingSwotItem.value = { category, index };
    editingSwotText.value = swotData.value[category][index];

    // Fill the appropriate category input with the item being edited
    switch (category) {
      case 'strengths':
        newStrength.value = swotData.value[category][index];
        break;
      case 'weaknesses':
        newWeakness.value = swotData.value[category][index];
        break;
      case 'opportunities':
        newOpportunity.value = swotData.value[category][index];
        break;
      case 'threats':
        newThreat.value = swotData.value[category][index];
        break;
    }
  };

  const saveEditSwotItem = () => {
    if (editingSwotItem.value && editingSwotText.value.trim()) {
      const { category, index } = editingSwotItem.value;
      swotData.value[category][index] = editingSwotText.value.trim();
      cancelEditSwotItem();
    }
  };

  const updateSwotItem = () => {
    if (editingSwotItem.value) {
      const { category, index } = editingSwotItem.value;
      let inputValue = '';

      // Get the appropriate input value based on category
      switch (category) {
        case 'strengths':
          inputValue = newStrength.value.trim();
          break;
        case 'weaknesses':
          inputValue = newWeakness.value.trim();
          break;
        case 'opportunities':
          inputValue = newOpportunity.value.trim();
          break;
        case 'threats':
          inputValue = newThreat.value.trim();
          break;
      }

      if (inputValue) {
        swotData.value[category][index] = inputValue;
        cancelEditSwotItem();
      }
    }
  };

  const cancelEditSwotItem = () => {
    editingSwotItem.value = null;
    editingSwotText.value = '';

    // Clear the appropriate category input when canceling
    if (editingSwotItem.value) {
      switch (editingSwotItem.value.category) {
        case 'strengths':
          newStrength.value = '';
          break;
        case 'weaknesses':
          newWeakness.value = '';
          break;
        case 'opportunities':
          newOpportunity.value = '';
          break;
        case 'threats':
          newThreat.value = '';
          break;
      }
    }
  };

  const removeSwotItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
    swotData.value[category].splice(index, 1);
  };

  const applySwot = () => {
    // Success toast removed to reduce number of notifications
    showSwotModal.value = false;
  };

  // Mind Map Functions
  const openMindMap = () => {
    if (!formData.value.mainChallenge.trim()) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا چالش اصلی پژوهش را وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    // Initialize Vue Flow with main concept if empty
    if (flowNodes.value.length === 0) {
      flowNodes.value = [
        {
          id: '1',
          type: 'default',
          position: { x: 400, y: 200 },
          label: formData.value.mainChallenge.substring(0, 50) + '...',
          style: { backgroundColor: '#10b981', color: 'white' },
        },
      ];

      flowEdges.value = [];
    }

    showMindMapModal.value = true;
  };

  async function generateMindMapSuggestions() {
    mindMapLoading.value = true;
    try {
      const prompt = `بر اساس چالش تحقیقاتی زیر، ۵ مفهوم کلیدی مرتبط را پیشنهاد دهید که باید در نقشه ذهنی قرار گیرند:

چالش تحقیقاتی: ${formData.value.mainChallenge}
${formData.value.researchDomain.length > 0 ? `حوزه دانشی: ${formData.value.researchDomain.join(', ')}` : ''}

فقط لیست مفاهیم را با خط تیره بنویسید، بدون توضیحات اضافی:
- مفهوم ۱
- مفهوم ۲
...`;

      const messages = [{ role: 'user', content: prompt }];
      let result = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            result += chunk;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Parse suggestions and add as nodes
      const concepts = result
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace(/^-\s*/, '').trim());

      // Add nodes in a circle around the main node
      const centerX = 400;
      const centerY = 300;
      const radius = 200;

      concepts.forEach((concept, index) => {
        const angle = (index / concepts.length) * 2 * Math.PI;
        const nodeId = `node-${Date.now()}-${index}`;

        mindMapNodes.value.push({
          id: nodeId,
          label: concept,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });

        // Connect to main node
        mindMapConnections.value.push({
          from: 'main',
          to: nodeId,
        });
      });

      // Success toast removed to reduce number of notifications
    } catch (error) {
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید پیشنهادات.',
        color: 'danger',
        icon: 'ph:warning',
      });
    } finally {
      mindMapLoading.value = false;
    }
  }

  const addMindMapNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      label: 'مفهوم جدید',
      x: 400 + Math.random() * 200 - 100,
      y: 300 + Math.random() * 200 - 100,
    };
    mindMapNodes.value.push(newNode);
  };

  const removeMindMapNode = (nodeId: string) => {
    mindMapNodes.value = mindMapNodes.value.filter((n) => n.id !== nodeId);
    mindMapConnections.value = mindMapConnections.value.filter((c) => c.from !== nodeId && c.to !== nodeId);
  };

  const exportMindMapAsMarkdown = () => {
    let markdown = `# نقشه ذهنی: ${formData.value.mainChallenge}\n\n`;
    markdown += '## مفاهیم کلیدی\n\n';
    mindMapNodes.value.forEach((node) => {
      markdown += `- ${node.label}\n`;
    });
    markdown += '\n## ارتباطات\n\n';
    mindMapConnections.value.forEach((conn) => {
      const fromNode = mindMapNodes.value.find((n) => n.id === conn.from);
      const toNode = mindMapNodes.value.find((n) => n.id === conn.to);
      if (fromNode && toNode) {
        markdown += `- ${fromNode.label} → ${toNode.label}\n`;
      }
    });

    // Download as file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mind-map.md';
    a.click();
    URL.revokeObjectURL(url);

    // Success toast removed to reduce number of notifications
  };

  // Vue Flow Data
  const flowNodes = ref<Node[]>([]);
  const flowEdges = ref<Edge[]>([]);
  const flowLoading = ref(false);

  // Mind Map Data (for simpler implementation)
  const showMindMapModal = ref(false);
  const mindMapLoading = ref(false);
  const mindMapNodes = ref<Array<{ id: string; label: string; x: number; y: number }>>([]);
  const mindMapConnections = ref<Array<{ from: string; to: string }>>([]);

  // Vue Flow Functions
  const onFlowNodeClick = (event: any) => {
    console.log('Flow node clicked:', event.node);
  };

  const onFlowEdgeClick = (event: any) => {
    console.log('Flow edge clicked:', event.edge);
  };

  const onFlowConnect = (connection: any) => {
    console.log('Flow connected:', connection);
  };

  // Get VueFlow instance once
  const { fitView } = useVueFlow();

  // Auto-layout function
  const autoLayoutNodes = () => {
    if (flowNodes.value.length === 0) return;

    const centerX = 400;
    const centerY = 200;
    const radius = 150;

    flowNodes.value = flowNodes.value.map((node, index) => {
      if (node.id === 'main') {
        return { ...node, position: { x: centerX, y: centerY } };
      }

      // Arrange other nodes in a circle around main
      const angle = (index / (flowNodes.value.length - 1)) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return { ...node, position: { x, y } };
    });

    // Recenter view after layout
    nextTick(() => {
      fitView({ padding: 0.2 });
    });
  };

  async function generateFlowMindMap() {
    flowLoading.value = true;
    try {
      // Collect all available information from page
      const allData = {
        mainChallenge: formData.value.mainChallenge,
        researchDomain: formData.value.researchDomain,
        keywords: formData.value.keywords,
        focusLevel: formData.value.focusLevel,
        whQuestions: whQuestions.value,
        swotData: swotData.value,
      };

      // Get focus level label
      const focusLevelLabel = focusLevels.find((l) => l.value === allData.focusLevel)?.label || allData.focusLevel;

      const prompt = `بر اساس اطلاعات پژوهش زیر، یک نقشه ذهنی ساده و واضح تولید کنید:

چالش اصلی: ${allData.mainChallenge}
حوزه‌های دانشی: ${allData.researchDomain.slice(0, 3).join(', ') || 'مشخص نشده'}
کلیدواژه‌ها: ${allData.keywords.slice(0, 3).join(', ') || 'مشخص نشده'}
سطح تمرکز: ${focusLevelLabel || 'مشخص نشده'}

${allData.whQuestions.what ? `سؤال اصلی (What): ${allData.whQuestions.what}` : ''}
${allData.swotData.strengths.length > 0 ? `نقطه قوت کلیدی: ${allData.swotData.strengths[0]}` : ''}

پاسخ را حتماً به صورت JSON برگردانید با ساختار زیر:

{
  "nodes": [
    {"id": "main", "label": "چالش اصلی", "type": "default", "position": {"x": 400, "y": 200}},
    {"id": "domain", "label": "حوزه دانشی", "type": "default", "position": {"x": 150, "y": 100}},
    {"id": "method", "label": "روش تحقیق", "type": "default", "position": {"x": 650, "y": 100}},
    {"id": "wh", "label": "سؤالات کلیدی", "type": "default", "position": {"x": 200, "y": 300}},
    {"id": "swot", "label": "تحلیل SWOT", "type": "default", "position": {"x": 600, "y": 300}}
  ],
  "edges": [
    {"id": "e-main-domain", "source": "main", "target": "domain", "type": "smoothstep"},
    {"id": "e-main-method", "source": "main", "target": "method", "type": "smoothstep"},
    {"id": "e-main-wh", "source": "main", "target": "wh", "type": "smoothstep", "label": "تحلیل"},
    {"id": "e-main-swot", "source": "main", "target": "swot", "type": "smoothstep", "animated": true, "label": "SWOT"}
  ]
}

قوانین مهم:
1. فقط ۵ گره اصلی برای سادگی و خوانایی
2. فقط ۴ ارتباط مستقیم به گره اصلی  
3. برچسب‌ها کوتاه و واضح
4. فقط اطلاعات کلیدی و مهم را نمایش دهید
5. موقعیت‌ها با فاصله مناسب از هم برای خوانایی بهتر
6. ساختار متوازن و قرینه برای زیبایی بصری
7. فقط JSON برگردانید`;

      const messages = [{ role: 'user', content: prompt }];
      let result = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            result += chunk;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Parse JSON response
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const mindMapJson = JSON.parse(jsonMatch[0]);

          if (mindMapJson.nodes && Array.isArray(mindMapJson.nodes)) {
            flowNodes.value = mindMapJson.nodes.map((node: any) => {
              // Determine node color based on its role
              let style = { backgroundColor: '#6b7280', color: 'white', border: '2px solid #374151' };

              if (node.id === 'main') {
                style = {
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: '3px solid #059669',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                };
              } else if (node.id.includes('domain')) {
                style = {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: '2px solid #2563eb',
                };
              } else if (node.id.includes('wh')) {
                style = {
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: '2px solid #7c3aed',
                };
              } else if (node.id.includes('swot')) {
                style = {
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: '2px solid #d97706',
                };
              }

              return {
                ...node,
                style,
                data: {
                  ...node.data,
                  label: node.label,
                },
              };
            });
          }

          if (mindMapJson.edges && Array.isArray(mindMapJson.edges)) {
            flowEdges.value = mindMapJson.edges.map((edge: any) => ({
              ...edge,
              style: {
                strokeWidth: edge.animated ? 3 : 2,
                stroke: edge.animated ? '#10b981' : '#6b7280',
              },
              labelStyle: {
                fill: '#374151',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '2px 6px',
                borderRadius: '4px',
              },
              markerEnd: {
                type: 'arrowclosed',
                color: edge.animated ? '#10b981' : '#6b7280',
              },
            }));
          }
        }
      } catch (parseError) {
        console.error('Error parsing mind map JSON:', parseError);

        // Create simple fallback nodes with better spacing
        const fallbackNodes = [
          {
            id: 'main',
            type: 'default',
            position: { x: 400, y: 200 },
            label: allData.mainChallenge.substring(0, 40) + '...',
            style: {
              backgroundColor: '#10b981',
              color: 'white',
              border: '3px solid #059669',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          },
        ];

        // Add domain node - top left
        if (allData.researchDomain.length > 0) {
          fallbackNodes.push({
            id: 'domain',
            type: 'default',
            position: { x: 150, y: 100 },
            label: allData.researchDomain.slice(0, 2).join(', '),
            style: { backgroundColor: '#3b82f6', color: 'white', border: '2px solid #2563eb' },
          });
        }

        // Add method node - top right
        if (focusLevelLabel) {
          fallbackNodes.push({
            id: 'method',
            type: 'default',
            position: { x: 650, y: 100 },
            label: focusLevelLabel,
            style: { backgroundColor: '#8b5cf6', color: 'white', border: '2px solid #7c3aed' },
          });
        }

        // Add WH questions node - bottom left
        if (allData.whQuestions.what || allData.whQuestions.why) {
          fallbackNodes.push({
            id: 'wh',
            type: 'default',
            position: { x: 200, y: 300 },
            label: allData.whQuestions.what?.substring(0, 30) + '...' || 'سؤالات کلیدی',
            style: { backgroundColor: '#ef4444', color: 'white', border: '2px solid #dc2626' },
          });
        }

        // Add SWOT node - bottom right
        if (allData.swotData.strengths.length > 0) {
          fallbackNodes.push({
            id: 'swot',
            type: 'default',
            position: { x: 600, y: 300 },
            label: `${allData.swotData.strengths[0]?.substring(0, 30) || 'تحلیل'}...`,
            style: { backgroundColor: '#06b6d4', color: 'white', border: '2px solid #0891b2' },
          });
        }

        // Create simple edges - all connect to main
        const fallbackEdges = fallbackNodes.slice(1).map((node) => ({
          id: `e-main-${node.id}`,
          source: 'main',
          target: node.id,
          type: 'smoothstep',
          label: node.id === 'swot' ? 'SWOT' : node.id === 'wh' ? 'تحلیل' : undefined,
          animated: node.id === 'swot',
        }));

        flowNodes.value = fallbackNodes;
        flowEdges.value = fallbackEdges;
      }

      // Success toast removed to reduce number of notifications
    } catch (error) {
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید نقشه ذهنی.',
        color: 'danger',
        icon: 'ph:warning',
      });
    } finally {
      flowLoading.value = false;
    }
  }

  // Generate domain suggestions based on context
  async function generateDomainSuggestions() {
    try {
      const prompt = `بر اساس چالش تحقیقاتی زیر، ۱۰ حوزه دانشی مرتبط و مناسب پیشنهاد دهید. فقط لیست حوزه‌ها را با خط تیره بنویسید، بدون توضیحات اضافی:

چالش تحقیقاتی: ${formData.value.mainChallenge}
${formData.value.researchDomain.length > 0 ? `حوزه‌های فعلی: ${formData.value.researchDomain.join(', ')}` : ''}

مثال فرمت:
- روانشناسی بالینی
- هوش مصنوعی
- داده کاوی`;

      const messages = [{ role: 'user', content: prompt }];
      let result = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            result += chunk;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Parse suggestions
      const suggestions = result
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter((domain) => domain && !formData.value.researchDomain.includes(domain));

      if (suggestions.length > 0) {
        // Mix AI suggestions with some default ones
        domainSuggestions.value = [...suggestions, ...defaultDomainSuggestions.slice(0, 5)];
      }
    } catch (error) {
      console.warn('خطا در تولید پیشنهادات حوزه:', error);
      // Keep default suggestions on error
      domainSuggestions.value = [...defaultDomainSuggestions];
    }
  }

  const saveAndContinue = async () => {
    if (!user.value) {
      toaster.show({
        title: 'خطا',
        message: 'لطفاً ابتدا وارد حساب کاربری خود شوید.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    if (!formData.value?.mainChallenge?.trim()) {
      toaster.show({
        title: 'خطا',
        message: 'لطفاً سؤال یا چالش اصلی پژوهش را وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    try {
      // Prepare data for useBrainStorm composable
      const dataToSave = {
        user: user.value.id,
        title: `جلسه طوفان فکری - ${new Date().toLocaleDateString('fa-IR')}`,
        mainChallenge: formData.value.mainChallenge,
        researchDomain: formData.value.researchDomain,
        keywords: formData.value.keywords,
        focusLevel: formData.value.focusLevel,
        stage: formData.value.stage,
        status: formData.value.status as 'draft' | 'in_progress' | 'completed' | 'archived',
        whQuestions: whQuestions.value,
        swotData: swotData.value,
        lastAccessed: new Date().toISOString(),
      };

      // Check if we have an existing brainstorm session
      if (currentBrainStorm.value) {
        // Update existing session
        await updateBrainStorm({
          id: currentBrainStorm.value.id,
          ...dataToSave,
        });

        // Success toast removed to reduce number of notifications
      } else {
        // Create new session
        await createBrainStorm(dataToSave);

        // Success toast removed to reduce number of notifications
      }

      router.push('/hampazhooh/brainstorm/stage2');
    } catch (error: any) {
      console.error('Error saving data:', error);
      toaster.show({
        title: 'خطا',
        message: `خطا در ذخیره داده‌ها: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
  };

  const goToStage2Test = () => {
    saveAndContinue();
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm');
  };

  // Load existing data on page mount
  onMounted(async () => {
    if (!user.value) {
    }

    try {
      // Try to load existing session from useBrainStorm composable
      const result = await getUserBrainStorms(user.value.id, {
        filters: {
          stage: 'stage1',
        },
        perPage: 1,
        sort: '-created',
      });

      if (result && result.items && result.items.length > 0) {
        const existingRecord = result.items[0];

        // Load the brainstorm session to set currentBrainStorm
        await getBrainStorm(existingRecord.id);

        // Load existing data into form
        if (formData.value) {
          formData.value.mainChallenge = existingRecord.mainChallenge || '';
          formData.value.researchDomain = existingRecord.researchDomain || [];
          formData.value.keywords = existingRecord.keywords || [];
          formData.value.focusLevel = existingRecord.focusLevel || '';
          formData.value.stage = existingRecord.stage || 'stage1';
          formData.value.status = existingRecord.status || 'in_progress';
        }

        if (existingRecord.whQuestions) {
          whQuestions.value = existingRecord.whQuestions;
        }

        if (existingRecord.swotData) {
          swotData.value = existingRecord.swotData;
        }

        // Update last accessed timestamp
        await updateBrainStorm({
          id: existingRecord.id,
          lastAccessed: new Date().toISOString(),
        });

        // Success toast removed to reduce number of notifications
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  });
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div
                class="bg-primary-500 shadow-primary-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg"
              >
                <Icon name="ph:target" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-primary-500 mb-1 text-xs font-semibold uppercase tracking-wider">مرحله ۱</div>
                <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
                  تعریف حوزه و قاب مفهومی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">Framing & Scoping</BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl">
        <!-- Introduction -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
              هدف این مرحله
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
              در این مرحله، مرزهای موضوعی و مفهومی پژوهش خود را مشخص می‌کنید. این کار به شما کمک می‌کند تا تمرکز خود را
              حفظ کرده و از پراکندگی جلوگیری کنید.
            </BaseParagraph>
          </div>

          <!-- Key Features -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <BaseHeading as="h3" size="md" weight="semibold" class="mb-4 text-gray-900 dark:text-white">
              ویژگی‌های کلیدی
            </BaseHeading>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">مشخص کردن سؤال اصلی</div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">حتی اگر در ابتدا مبهم باشد</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">تعیین حوزهٔ دانشی</div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">علوم انسانی، فناوری، محیط زیست و...</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">کلیدواژه‌های تخصصی</div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">مفاهیم کلیدی و اصطلاحات تخصصی پژوهش</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">تعیین سطح تمرکز</div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">کاربردی، نظری، یا بین‌رشته‌ای</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    استفاده از ابزارهای تحلیلی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">نقشه ذهنی، سؤالات WH، تحلیل SWOT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scoping Form -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              تعریف حوزه پژوهش
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              با پاسخ به سؤالات زیر، حوزه و قاب مفهومی پژوهش خود را مشخص کنید
            </BaseParagraph>
          </div>

          <div class="space-y-6">
            <!-- Main Challenge -->
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                  <Icon name="ph:question" class="text-primary-500 size-5" />
                  سؤال یا چالش اصلی چیست؟
                </label>
                <button
                  type="button"
                  class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                  :disabled="mainChallengeAiLoading"
                  @click="suggestAIField('mainChallenge')"
                >
                  <Icon v-if="!mainChallengeAiLoading" name="ph:sparkle" class="size-4" />
                  <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
              <BaseTextarea
                v-if="formData"
                v-model="formData.mainChallenge"
                placeholder="سؤال تحقیق یا چالش اصلی را به صورت واضح بیان کنید. نگران نباشید اگر هنوز کاملاً مشخص نیست."
                rows="4"
                shape="curved"
              />
              <div class="text-muted-500 mt-2 flex items-start gap-2 text-xs">
                <Icon name="ph:lightbulb" class="mt-0.5 size-4 shrink-0" />
                <span>نکته: سؤال خوب باید قابل پاسخ، مشخص و مرتبط با حوزه تحقیقاتی شما باشد.</span>
              </div>
            </div>

            <!-- Research Domain -->
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                  <Icon name="ph:books" class="text-primary-500 size-5" />
                  حوزهٔ دانشی شما کدام است؟
                </label>
                <button
                  type="button"
                  class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                  :disabled="researchDomainAiLoading"
                  @click="suggestAIField('researchDomain')"
                >
                  <Icon v-if="!researchDomainAiLoading" name="ph:sparkle" class="size-4" />
                  <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
              <div class="space-y-3">
                <!-- Domain Tags Display -->
                <div v-if="formData.researchDomain.length > 0" class="flex flex-wrap gap-2">
                  <div
                    v-for="(domain, index) in formData.researchDomain"
                    :key="index"
                    class="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                  >
                    <span>{{ domain }}</span>
                    <button
                      type="button"
                      class="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                      @click="removeDomain(index)"
                    >
                      <Icon name="ph:x" class="size-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Domain Input -->
                <div class="relative">
                  <BaseInput
                    v-model="domainInput"
                    placeholder="روانشناسی، علوم کامپیوتر، مهندسی، پزشکی..."
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @keydown="handleDomainKeydown"
                  />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2">
                    <div class="text-muted-400 text-xs">Enter برای افزودن</div>
                  </div>
                </div>

                <!-- Suggestions -->
                <div
                  class="border-muted-200 dark:border-muted-700 dark:bg-muted-900/50 rounded-lg border bg-gray-50 p-3"
                >
                  <div class="text-muted-600 dark:text-muted-400 mb-2 text-xs font-medium">پیشنهادها:</div>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="suggestion in domainSuggestions"
                      :key="suggestion"
                      type="button"
                      :disabled="formData.researchDomain.includes(suggestion)"
                      class="nui-focus border-muted-200 hover:border-primary-500 hover:bg-primary-50 text-muted-600 dark:text-muted-300 dark:border-muted-700 dark:hover:bg-primary-900/20 dark:hover:border-primary-500 rounded-full border px-3 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      @click="
                        () => {
                          if (!formData.researchDomain.includes(suggestion)) {
                            formData.researchDomain.push(suggestion);
                          }
                        }
                      "
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Keywords -->
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                  <Icon name="ph:key" class="text-primary-500 size-5" />
                  کلیدواژه‌های پژوهش
                </label>
                <button
                  type="button"
                  class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                  :disabled="keywordsAiLoading"
                  @click="suggestAIField('keywords')"
                >
                  <Icon v-if="!keywordsAiLoading" name="ph:sparkle" class="size-4" />
                  <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
              <div class="space-y-3">
                <!-- Keywords Tags Display -->
                <div v-if="formData.keywords.length > 0" class="flex flex-wrap gap-2">
                  <div
                    v-for="(keyword, index) in formData.keywords"
                    :key="index"
                    class="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                  >
                    <span>{{ keyword }}</span>
                    <button
                      type="button"
                      class="text-warning-500 hover:text-warning-600 dark:text-warning-400 dark:hover:text-warning-300 transition-colors"
                      @click="removeKeyword(index)"
                    >
                      <Icon name="ph:x" class="size-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Keyword Input -->
                <div class="relative">
                  <BaseInput
                    v-model="keywordInput"
                    placeholder="یادگیری ماشین، هوش مصنوعی، تحلیل داده..."
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    @keydown="handleKeywordKeydown"
                  />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2">
                    <div class="text-muted-400 text-xs">Enter برای افزودن</div>
                  </div>
                </div>

                <!-- Suggestions -->
                <div
                  class="border-muted-200 dark:border-muted-700 dark:bg-muted-900/50 rounded-lg border bg-gray-50 p-3"
                >
                  <div class="text-muted-600 dark:text-muted-400 mb-2 text-xs font-medium">پیشنهادها:</div>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="suggestion in keywordSuggestions"
                      :key="suggestion"
                      type="button"
                      :disabled="formData.keywords.includes(suggestion)"
                      class="nui-focus border-muted-200 hover:border-warning-500 hover:bg-warning-50 text-muted-600 dark:text-muted-300 dark:border-muted-700 dark:hover:bg-warning-900/20 dark:hover:border-warning-500 rounded-full border px-3 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      @click="
                        () => {
                          if (!formData.keywords.includes(suggestion)) {
                            formData.keywords.push(suggestion);
                          }
                        }
                      "
                    >
                      {{ suggestion }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Focus Level -->
            <div>
              <div class="mb-3 flex items-center justify-between">
                <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                  <Icon name="ph:target" class="text-primary-500 size-5" />
                  سطح تمرکز پژوهش را انتخاب کنید
                </label>
                <button
                  type="button"
                  class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                  :disabled="focusLevelAiLoading"
                  @click="suggestAIField('focusLevel')"
                >
                  <Icon v-if="!focusLevelAiLoading" name="ph:sparkle" class="size-4" />
                  <Icon v-else name="svg-spinners:90-ring-with-bg" class="size-4" />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div
                  v-for="level in focusLevels"
                  :key="level.value"
                  :class="[
                    'dark:border-muted-700 dark:bg-muted-900/50 cursor-pointer rounded-xl border-2 bg-white p-4 transition-all duration-200',
                    formData.focusLevel === level.value
                      ? 'border-primary-500 ring-primary-500/10 ring-4'
                      : 'hover:border-primary-300 border-gray-200',
                  ]"
                  @click="formData.focusLevel = level.value"
                >
                  <div class="mb-2 flex items-center justify-between">
                    <div class="text-muted-800 text-sm font-semibold dark:text-white">
                      {{ level.label }}
                    </div>
                    <div
                      v-if="formData.focusLevel === level.value"
                      class="bg-primary-500 flex size-6 items-center justify-center rounded-full"
                    >
                      <Icon name="ph:check-bold" class="size-3.5 text-white" />
                    </div>
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    {{ level.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tools Section -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              ابزارهای پیشنهادی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              از این ابزارها برای تعریف بهتر حوزه پژوهش استفاده کنید
            </BaseParagraph>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <!-- WH Questions Tool -->
            <div
              class="dark:border-muted-700 hover:border-info-500 dark:bg-muted-900/50 group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl"
              @click="openWhQuestionsWizard"
            >
              <div class="flex items-start justify-between">
                <div
                  class="bg-info-500/10 mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                >
                  <Icon name="ph:question" class="text-info-500 size-6" />
                </div>

                <!-- Completion Indicator -->
                <div
                  :class="[
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    whQuestionsStatus.status === 'completed'
                      ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300'
                      : whQuestionsStatus.status === 'partial'
                      ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300'
                      : 'bg-muted-100 text-muted-600 dark:bg-muted-900/20 dark:text-muted-400',
                  ]"
                >
                  <Icon v-if="whQuestionsStatus.status === 'completed'" name="ph:check-circle-fill" class="size-3.5" />
                  <Icon
                    v-else-if="whQuestionsStatus.status === 'partial'"
                    name="ph:circle-half-fill"
                    class="size-3.5"
                  />
                  <Icon v-else name="ph:circle" class="size-3.5" />
                  {{ whQuestionsStatus.text }}
                </div>
              </div>

              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                سؤال‌های WH
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
                استفاده از سؤالات What, Why, How, Who, Where برای تعریف دقیق‌تر مسئله
              </BaseParagraph>
              <div class="text-info-500 flex items-center gap-1 text-xs font-medium">
                <Icon name="ph:arrow-left" class="size-4" />
                <span>باز کردن ابزار</span>
              </div>
            </div>

            <!-- SWOT Tool -->
            <div
              class="dark:border-muted-700 hover:border-success-500 dark:bg-muted-900/50 group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl"
              @click="openSwotMatrix"
            >
              <div class="flex items-start justify-between">
                <div
                  class="bg-success-500/10 mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                >
                  <Icon name="ph:chart-line-up" class="text-success-500 size-6" />
                </div>

                <!-- Completion Indicator -->
                <div
                  :class="[
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    swotStatus.status === 'completed'
                      ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300'
                      : swotStatus.status === 'partial'
                      ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300'
                      : 'bg-muted-100 text-muted-600 dark:bg-muted-900/20 dark:text-muted-400',
                  ]"
                >
                  <Icon v-if="swotStatus.status === 'completed'" name="ph:check-circle-fill" class="size-3.5" />
                  <Icon v-else-if="swotStatus.status === 'partial'" name="ph:circle-half-fill" class="size-3.5" />
                  <Icon v-else name="ph:circle" class="size-3.5" />
                  {{ swotStatus.text }}
                </div>
              </div>

              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-right text-gray-900 dark:text-white">
                تحلیل SWOT
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
                شناسایی نقاط قوت، ضعف، فرصت‌ها و تهدیدهای حوزهٔ پژوهشی
              </BaseParagraph>
              <div class="text-success-500 flex items-center gap-1 text-xs font-medium">
                <Icon name="ph:arrow-left" class="size-4" />
                <span>باز کردن ابزار</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips Box -->
        <div class="bg-info-500/10 dark:bg-info-500/20 border-info-500/20 mb-8 rounded-2xl border-2 p-6">
          <div class="flex items-start gap-4">
            <div class="bg-info-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon name="ph:lightbulb-fill" class="size-6 text-white" />
            </div>
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
                نکات مهم برای این مرحله
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-200 space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                  <span>
                    اگر سؤال اصلی شما هنوز کاملاً واضح نیست، نگران نباشید. در مراحل بعدی می‌توانید آن را دقیق‌تر کنید.
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                  <span>تعیین دقیق حوزه دانشی به شما کمک می‌کند تا منابع و متدهای مناسب را پیدا کنید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                  <span>کلیدواژه‌های تخصصی به جستجوی بهتر در پایگاه‌های علمی و دیده‌ شدن پژوهش شما کمک می‌کند.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                  <span>از ابزارهای بصری مانند نقشه ذهنی استفاده کنید تا ارتباط بین مفاهیم را بهتر ببینید.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between">
          <BaseButton color="muted" shape="curved" size="lg" @click="goBack">
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            بازگشت به چارچوب
          </BaseButton>
          <BaseButton
            color="primary"
            shape="curved"
            size="lg"
            class="shadow-primary-500/30 shadow-lg"
            :disabled="loading || !formData?.mainChallenge?.trim()"
            @click="saveAndContinue"
          >
            <Icon v-if="loading" name="svg-spinners:90-ring-with-bg" class="mr-2 size-5" />
            <Icon v-else name="ph:arrow-left" class="mr-2 size-5" />
            {{ loading ? 'در حال ذخیره...' : 'ذخیره و ادامه' }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- WH Questions Modal -->
    <TairoModal :open="showWhQuestionsModal" size="2xl" @close="showWhQuestionsModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:question" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">سؤالات WH</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              پاسخ به سؤالات کلیدی برای تعریف دقیق‌تر پژوهش
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6">
        <!-- Progress Steps -->
        <div class="flex items-center justify-between">
          <div v-for="(key, index) in whQuestionOrder" :key="key" class="flex flex-1 items-center">
            <div
              :class="[
                'flex size-8 items-center justify-center rounded-full text-sm font-bold transition-all',
                currentWhQuestion === key
                  ? 'bg-info-500 scale-110 text-white'
                  : whQuestions[key]
                  ? 'bg-success-500 text-white'
                  : 'bg-muted-200 text-muted-500',
              ]"
            >
              <Icon v-if="whQuestions[key]" name="ph:check-bold" class="size-4" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div
              v-if="index < whQuestionOrder.length - 1"
              :class="[
                'mx-2 h-1 flex-1 rounded transition-all',
                whQuestions[whQuestionOrder[index + 1]] ? 'bg-success-500' : 'bg-muted-200',
              ]"
            />
          </div>
        </div>

        <!-- Current Question -->
        <div
          class="border-muted-200 dark:border-muted-700 from-info-50 dark:from-info-900/20 dark:to-muted-900 rounded-xl border-2 bg-gradient-to-br to-white p-6"
        >
          <div class="mb-4 flex items-start gap-3 text-right">
            <Icon :name="whQuestionLabels[currentWhQuestion].icon" class="text-info-500 mt-1 size-6" />
            <div class="flex-1">
              <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2">
                {{ whQuestionLabels[currentWhQuestion].label }}
              </BaseHeading>
              <BaseParagraph class="text-muted-600">
                {{ whQuestionLabels[currentWhQuestion].prompt }}
              </BaseParagraph>
            </div>
            <BaseButton
              color="info"
              size="sm"
              shape="curved"
              :disabled="whQuestionsLoading"
              @click="generateWhAnswer(currentWhQuestion)"
            >
              <Icon v-if="!whQuestionsLoading" name="ph:sparkle" class="ml-2 size-4" />
              <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-4" />
              تولید هوشمند
            </BaseButton>
          </div>

          <BaseTextarea
            v-model="whQuestions[currentWhQuestion]"
            rows="5"
            placeholder="پاسخ خود را بنویسید یا از دکمه تولید هوشمند استفاده کنید..."
            shape="curved"
          />
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between">
          <BaseButton
            color="muted"
            shape="curved"
            :disabled="whQuestionOrder.indexOf(currentWhQuestion) === 0"
            @click="prevWhQuestion"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            سؤال قبلی
          </BaseButton>

          <BaseButton
            v-if="whQuestionOrder.indexOf(currentWhQuestion) < whQuestionOrder.length - 1"
            color="info"
            shape="curved"
            @click="nextWhQuestion"
          >
            سؤال بعدی
            <Icon name="ph:arrow-left" class="mr-2 size-5" />
          </BaseButton>

          <BaseButton v-else color="success" shape="curved" @click="applyWhQuestions">
            اعمال به فرم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>

    <!-- SWOT Matrix Modal -->
    <TairoModal :open="showSwotModal" size="3xl" @close="showSwotModal = false">
      <template #header>
        <div class="flex items-center justify-between gap-3 p-6 pb-0">
          <div class="flex items-center gap-3">
            <div class="bg-success-500 flex size-12 items-center justify-center rounded-xl">
              <Icon name="ph:chart-line-up" class="size-6 text-white" />
            </div>
            <div class="text-right">
              <BaseHeading as="h2" size="xl" weight="bold">تحلیل SWOT</BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">نقاط قوت، ضعف، فرصت‌ها و تهدیدها</BaseParagraph>
            </div>
          </div>
          <BaseButton color="success" shape="curved" :disabled="swotLoading" @click="generateSwotAnalysis">
            <Icon v-if="!swotLoading" name="ph:sparkle" class="ml-2 size-4" />
            <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-4" />
            تولید خودکار SWOT
          </BaseButton>
        </div>
      </template>

      <div class="max-h-[70vh] overflow-y-auto p-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Strengths -->
          <div
            class="border-success-200 dark:border-success-700 bg-success-50 dark:bg-success-900/20 rounded-xl border-2 p-4"
          >
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:trend-up" class="text-success-600 size-5" />
              <BaseHeading as="h3" size="md" weight="semibold" class="text-success-700 dark:text-success-300">
                نقاط قوت (Strengths)
              </BaseHeading>
            </div>
            <div class="mb-3 space-y-2">
              <div
                v-for="(item, index) in swotData.strengths"
                :key="index"
                class="dark:bg-muted-800 flex items-center justify-between gap-2 rounded-lg bg-white p-2 text-right"
                :dir="'rtl'"
              >
                <span
                  class="flex-1 text-sm"
                  :class="{
                    'text-primary-600': editingSwotItem?.category === 'strengths' && editingSwotItem?.index === index,
                  }"
                >
                  {{ item }}
                </span>
                <div class="flex gap-1">
                  <button
                    v-if="editingSwotItem?.category === 'strengths' && editingSwotItem?.index === index"
                    class="text-success-500 hover:text-success-600"
                    title="ذخیره ویرایش"
                    @click="updateSwotItem"
                  >
                    <Icon name="ph:check" class="size-4" />
                  </button>
                  <button
                    v-if="editingSwotItem?.category === 'strengths' && editingSwotItem?.index === index"
                    class="text-muted-500 hover:text-muted-600"
                    title="انصراف از ویرایش"
                    @click="cancelEditSwotItem"
                  >
                    <Icon name="ph:x" class="size-4" />
                  </button>
                  <button
                    v-else
                    class="text-muted-500 hover:text-primary-600"
                    title="ویرایش"
                    @click="startEditSwotItem('strengths', index)"
                  >
                    <Icon name="ph:pencil-simple" class="size-4" />
                  </button>
                  <button
                    v-else
                    class="text-danger-500 hover:text-danger-600"
                    title="حذف"
                    @click="removeSwotItem('strengths', index)"
                  >
                    <Icon name="ph:trash" class="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Add new item -->
            <div class="flex items-center gap-3">
              <BaseInput
                v-model="newStrength"
                placeholder="نقطه قوت جدید..."
                shape="curved"
                class="flex-1"
                @keydown.enter="
                  () => {
                    if (newStrength.trim()) {
                      addSwotItem('strengths');
                    }
                  }
                "
              />
              <BaseButton
                color="success"
                shape="full"
                size="sm"
                :disabled="!newStrength.trim()"
                class="flex size-10 items-center justify-center rounded-full shadow-sm transition-all hover:scale-105 hover:shadow-md"
                @click="addSwotItem('strengths')"
              >
                <Icon name="ph:plus" class="size-4 text-white" />
              </BaseButton>
            </div>
          </div>

          <!-- Weaknesses -->
          <div
            class="border-warning-200 dark:border-warning-700 bg-warning-50 dark:bg-warning-900/20 rounded-xl border-2 p-4"
          >
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:warning" class="text-warning-600 size-5" />
              <BaseHeading as="h3" size="md" weight="semibold" class="text-warning-700 dark:text-warning-300">
                نقاط ضعف (Weaknesses)
              </BaseHeading>
            </div>
            <div class="mb-3 space-y-2">
              <div
                v-for="(item, index) in swotData.weaknesses"
                :key="index"
                class="dark:bg-muted-800 flex items-start gap-2 rounded-lg bg-white p-2 text-right"
              >
                <template v-if="editingSwotItem?.category === 'weaknesses' && editingSwotItem?.index === index">
                  <BaseInput
                    v-model="editingSwotText"
                    size="sm"
                    shape="curved"
                    class="flex-1"
                    @keydown.enter="saveEditSwotItem"
                    @keydown.escape="cancelEditSwotItem"
                    @blur="saveEditSwotItem"
                  />
                </template>
                <template v-else>
                  <span class="flex-1 cursor-pointer text-sm" @click="startEditSwotItem('weaknesses', index)">
                    {{ item }}
                  </span>
                </template>
                <div class="flex gap-1">
                  <button
                    v-if="editingSwotItem?.category === 'weaknesses' && editingSwotItem?.index === index"
                    class="text-success-500 hover:text-success-600"
                    @click="saveEditSwotItem"
                  >
                    <Icon name="ph:check" class="size-4" />
                  </button>
                  <button
                    v-if="editingSwotItem?.category === 'weaknesses' && editingSwotItem?.index === index"
                    class="text-muted-500 hover:text-muted-600"
                    @click="cancelEditSwotItem"
                  >
                    <Icon name="ph:x" class="size-4" />
                  </button>
                  <button
                    v-else
                    class="text-danger-500 hover:text-danger-600"
                    @click="removeSwotItem('weaknesses', index)"
                  >
                    <Icon name="ph:trash" class="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Add new item -->
            <div class="flex items-center gap-3">
              <BaseInput
                v-model="newWeakness"
                placeholder="نقطه ضعف جدید..."
                shape="curved"
                class="flex-1"
                @keydown.enter="
                  () => {
                    if (newWeakness.trim()) {
                      addSwotItem('weaknesses');
                    }
                  }
                "
              />
              <BaseButton
                color="warning"
                shape="full"
                size="sm"
                :disabled="!newWeakness.trim()"
                class="flex size-10 items-center justify-center rounded-full shadow-sm transition-all hover:scale-105 hover:shadow-md"
                @click="addSwotItem('weaknesses')"
              >
                <Icon name="ph:plus" class="size-4 text-white" />
              </BaseButton>
            </div>
          </div>

          <!-- Opportunities -->
          <div class="border-info-200 dark:border-info-700 bg-info-50 dark:bg-info-900/20 rounded-xl border-2 p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:lightbulb" class="text-info-600 size-5" />
              <BaseHeading as="h3" size="md" weight="semibold" class="text-info-700 dark:text-info-300">
                فرصت‌ها (Opportunities)
              </BaseHeading>
            </div>
            <div class="mb-3 space-y-2">
              <div
                v-for="(item, index) in swotData.opportunities"
                :key="index"
                class="dark:bg-muted-800 flex items-start gap-2 rounded-lg bg-white p-2 text-right"
              >
                <template v-if="editingSwotItem?.category === 'opportunities' && editingSwotItem?.index === index">
                  <BaseInput
                    v-model="editingSwotText"
                    size="sm"
                    shape="curved"
                    class="flex-1"
                    @keydown.enter="saveEditSwotItem"
                    @keydown.escape="cancelEditSwotItem"
                    @blur="saveEditSwotItem"
                  />
                </template>
                <template v-else>
                  <span class="flex-1 cursor-pointer text-sm" @click="startEditSwotItem('opportunities', index)">
                    {{ item }}
                  </span>
                </template>
                <div class="flex gap-1">
                  <button
                    v-if="editingSwotItem?.category === 'opportunities' && editingSwotItem?.index === index"
                    class="text-success-500 hover:text-success-600"
                    @click="saveEditSwotItem"
                  >
                    <Icon name="ph:check" class="size-4" />
                  </button>
                  <button
                    v-if="editingSwotItem?.category === 'opportunities' && editingSwotItem?.index === index"
                    class="text-muted-500 hover:text-muted-600"
                    @click="cancelEditSwotItem"
                  >
                    <Icon name="ph:x" class="size-4" />
                  </button>
                  <button
                    v-else
                    class="text-danger-500 hover:text-danger-600"
                    @click="removeSwotItem('opportunities', index)"
                  >
                    <Icon name="ph:trash" class="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Add new item -->
            <div class="flex items-center gap-3">
              <BaseInput
                v-model="newOpportunity"
                placeholder="فرصت جدید..."
                shape="curved"
                class="flex-1"
                @keydown.enter="
                  () => {
                    if (newOpportunity.trim()) {
                      addSwotItem('opportunities');
                    }
                  }
                "
              />
              <BaseButton
                color="info"
                shape="full"
                size="sm"
                :disabled="!newOpportunity.trim()"
                class="flex size-10 items-center justify-center rounded-full shadow-sm transition-all hover:scale-105 hover:shadow-md"
                @click="addSwotItem('opportunities')"
              >
                <Icon name="ph:plus" class="size-4 text-white" />
              </BaseButton>
            </div>
          </div>

          <!-- Threats -->
          <div
            class="border-danger-200 dark:border-danger-700 bg-danger-50 dark:bg-danger-900/20 rounded-xl border-2 p-4"
          >
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:warning-circle" class="text-danger-600 size-5" />
              <BaseHeading as="h3" size="md" weight="semibold" class="text-danger-700 dark:text-danger-300">
                تهدیدها (Threats)
              </BaseHeading>
            </div>
            <div class="mb-3 space-y-2">
              <div
                v-for="(item, index) in swotData.threats"
                :key="index"
                class="dark:bg-muted-800 flex items-start gap-2 rounded-lg bg-white p-2 text-right"
              >
                <template v-if="editingSwotItem?.category === 'threats' && editingSwotItem?.index === index">
                  <BaseInput
                    v-model="editingSwotText"
                    size="sm"
                    shape="curved"
                    class="flex-1"
                    @keydown.enter="saveEditSwotItem"
                    @keydown.escape="cancelEditSwotItem"
                    @blur="saveEditSwotItem"
                  />
                </template>
                <template v-else>
                  <span class="flex-1 cursor-pointer text-sm" @click="startEditSwotItem('threats', index)">
                    {{ item }}
                  </span>
                </template>
                <div class="flex gap-1">
                  <button
                    v-if="editingSwotItem?.category === 'threats' && editingSwotItem?.index === index"
                    class="text-success-500 hover:text-success-600"
                    @click="saveEditSwotItem"
                  >
                    <Icon name="ph:check" class="size-4" />
                  </button>
                  <button
                    v-if="editingSwotItem?.category === 'threats' && editingSwotItem?.index === index"
                    class="text-muted-500 hover:text-muted-600"
                    @click="cancelEditSwotItem"
                  >
                    <Icon name="ph:x" class="size-4" />
                  </button>
                  <button
                    v-else
                    class="text-danger-500 hover:text-danger-600"
                    @click="removeSwotItem('threats', index)"
                  >
                    <Icon name="ph:trash" class="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Add new item -->
            <div class="flex items-center gap-3">
              <BaseInput
                v-model="newThreat"
                placeholder="تهدید جدید..."
                shape="curved"
                class="flex-1"
                @keydown.enter="
                  () => {
                    if (newThreat.trim()) {
                      addSwotItem('threats');
                    }
                  }
                "
              />
              <BaseButton
                color="danger"
                shape="full"
                size="sm"
                :disabled="!newThreat.trim()"
                class="flex size-10 items-center justify-center rounded-full shadow-sm transition-all hover:scale-105 hover:shadow-md"
                @click="addSwotItem('threats')"
              >
                <Icon name="ph:plus" class="size-4 text-white" />
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Apply Button -->
        <div class="mt-6 flex justify-end">
          <BaseButton color="success" shape="curved" size="lg" @click="applySwot">
            اعمال به فرم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </TairoModal>
  </div>
</template>
