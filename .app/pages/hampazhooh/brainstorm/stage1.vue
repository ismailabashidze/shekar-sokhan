<script setup lang="ts">
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

  const formData = ref({
    mainChallenge: '',
    researchDomain: [] as string[],
    focusLevel: '',
    constraints: '',
    opportunities: '',
  });

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

  // Initialize with default suggestions
  domainSuggestions.value = [...defaultDomainSuggestions];

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

  const handleDomainKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addDomain();
    }
  };
  // AI Loading states for each field
  const mainChallengeAiLoading = ref(false);
  const researchDomainAiLoading = ref(false);
  const focusLevelAiLoading = ref(false);
  const constraintsAiLoading = ref(false);
  const opportunitiesAiLoading = ref(false);
  const smartCompleteLoading = ref(false);

  // Interactive Tools State
  const showWhQuestionsModal = ref(false);
  const showSwotModal = ref(false);
  const showMindMapModal = ref(false);

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

  // Mind Map Data
  const mindMapNodes = ref<Array<{ id: string; label: string; x: number; y: number }>>([]);
  const mindMapConnections = ref<Array<{ from: string; to: string }>>([]);
  const mindMapLoading = ref(false);

  const tools: Tool[] = [
    {
      title: 'نقشهٔ ذهنی اولیه',
      description: 'ایجاد یک نقشه بصری از مفاهیم و ارتباطات آن‌ها برای درک بهتر حوزه پژوهش',
      icon: 'ph:tree-structure',
      color: 'primary',
    },
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
      question: 'سطح تمرکز پژوهش چیست؟',
      placeholder: 'کاربردی، نظری، بین‌رشته‌ای؟',
      icon: 'ph:target',
    },
    {
      question: 'محدودیت‌های پژوهش کدامند؟',
      placeholder: 'زمان، منابع، دسترسی به داده، محدودیت‌های روش‌شناختی',
      icon: 'ph:warning-circle',
    },
    {
      question: 'فرصت‌های موجود چیست؟',
      placeholder: 'منابع موجود، همکاری‌ها، دسترسی‌ها، تخصص‌های موجود',
      icon: 'ph:trend-up',
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
    // Set loading state
    switch (field) {
      case 'mainChallenge':
        mainChallengeAiLoading.value = true;
        break;
      case 'researchDomain':
        researchDomainAiLoading.value = true;
        break;
      case 'focusLevel':
        focusLevelAiLoading.value = true;
        break;
      case 'constraints':
        constraintsAiLoading.value = true;
        break;
      case 'opportunities':
        opportunitiesAiLoading.value = true;
        break;
    }

    try {
      // Get context from existing fields
      const context = {
        mainChallenge: formData.value.mainChallenge,
        researchDomain: formData.value.researchDomain.join(', '),
        focusLevel: formData.value.focusLevel,
        constraints: formData.value.constraints,
        opportunities: formData.value.opportunities,
      };

      const contextMapping = {
        mainChallenge: 'چالش اصلی',
        researchDomain: 'حوزه دانشی',
        focusLevel: 'سطح تمرکز',
        constraints: 'محدودیت‌ها',
        opportunities: 'فرصت‌ها',
      };

      // Get focus level label if selected
      let enrichedContext = { ...context };
      if (enrichedContext.focusLevel) {
        const selectedLevel = focusLevels.find(l => l.value === enrichedContext.focusLevel);
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

        focusLevel: `بر اساس چالش تحقیقاتی و حوزه دانشی، مناسب‌ترین سطح تمرکز را از بین گزینه‌های زیر انتخاب کن:
- applied (کاربردی): تحقیق با هدف حل مسائل عملی
- theoretical (نظری): تحقیق با هدف توسعه دانش نظری
- interdisciplinary (بین‌رشته‌ای): تحقیق که از چند حوزه استفاده می‌کند
- mixed (ترکیبی): ترکیبی از رویکردهای نظری و کاربردی

${contextString ? `\nاطلاعات موجود:\n${contextString}` : ''}
فقط یکی از مقادیر: applied, theoretical, interdisciplinary, mixed را برگردان.`,

        constraints: `محدودیت‌های احتمالی این پژوهش را شناسایی کن. محدودیت‌ها می‌توانند شامل موارد زیر باشند:
- محدودیت زمانی
- محدودیت منابع مالی
- دسترسی به داده و نمونه آماری
- محدودیت‌های روش‌شناختی
- قوانین و مقررات اخلاقی
- محدودیت‌های فنی و تکنولوژیکی

${contextString ? `\nاطلاعات موجود:\n${contextString}` : ''}
لیست محدودیت‌های احتمالی را به صورت واضح بنویس.`,

        opportunities: `فرصت‌های موجود برای انجام این پژوهش را شناسایی کن. فرصت‌ها می‌توانند شامل:
- دسترسی به منابع و داده‌ها
- همکاری با سازمان‌ها و مؤسسات
- تخصص‌های موجود در تیم
- بودجه و منابع مالی
- تکنولوژی و ابزارهای موجود
- شبکه‌های علمی و حرفه‌ای

${contextString ? `\nاطلاعات موجود:\n${contextString}` : ''}
لیست فرصت‌های احتمالی را به صورت واضح بنویس.`,
      };

      const prompt = prompts[field] || 'یک مقدار مناسب پیشنهاد بده.';
      const userContent = field === 'researchDomain'
        ? formData.value.researchDomain.join(', ')
        : formData.value[field];
      const messages = [
        {
          role: 'user',
          content: userContent
            ? `${prompt}\n\nمقدار فعلی: ${userContent}`
            : prompt,
        },
      ];

      let suggestion = '';
      const initialContent = formData.value[field];

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
                l => trimmedSuggestion.includes(l.value) || l.value.includes(trimmedSuggestion),
              );
              if (matchedLevel) {
                formData.value.focusLevel = matchedLevel.value;
              }
            }
 else if (field === 'researchDomain') {
              // For research domain, wait for complete response and parse JSON
              // Don't update in real-time, wait for final result
            }
 else {
              // For text fields, show progressive update
              formData.value[field] = (initialContent ? initialContent + '\n' : '') + suggestion;
            }
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Handle researchDomain separately after completion
      if (field === 'researchDomain') {
        try {
          // Try to parse as JSON array
          const jsonMatch = suggestion.match(/\[.*?\]/s);
          if (jsonMatch) {
            const domains = JSON.parse(jsonMatch[0]);
            if (Array.isArray(domains)) {
              // Clear existing domains and add new ones
              formData.value.researchDomain = domains.filter(d => d && typeof d === 'string').map(d => d.trim());

              // Update domain suggestions with AI-generated ones
              domainSuggestions.value = [...domains, ...defaultDomainSuggestions.slice(0, 5)];
            }
          }
 else {
            // Fallback: try to parse as comma-separated list
            const domains = suggestion.split(/[,،\n]/).map(d => d.trim()).filter(d => d && !d.startsWith('-') && !d.includes('مثال'));
            if (domains.length > 0) {
              formData.value.researchDomain = [...new Set([...formData.value.researchDomain, ...domains])];
            }
          }
        }
 catch (error) {
          console.warn('Error parsing research domain suggestions:', error);
          // Fallback to simple parsing
          const domains = suggestion.split(/[,،\n]/).map(d => d.trim()).filter(d => d && !d.startsWith('-'));
          if (domains.length > 0) {
            formData.value.researchDomain = [...new Set([...formData.value.researchDomain, ...domains])];
          }
        }
      }

      // Show success toast
      toaster.show({
        title: 'موفقیت',
        message: 'پیشنهاد هوش مصنوعی با موفقیت اعمال شد.',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
        timeout: 3000,
      });

      // Update domain suggestions if main challenge was suggested (researchDomain updates its own suggestions)
      if (field === 'mainChallenge') {
        await generateDomainSuggestions();
      }
    }
 catch (e: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در دریافت پیشنهاد: ${e.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
 finally {
      // Reset loading state
      switch (field) {
        case 'mainChallenge':
          mainChallengeAiLoading.value = false;
          break;
        case 'researchDomain':
          researchDomainAiLoading.value = false;
          break;
        case 'focusLevel':
          focusLevelAiLoading.value = false;
          break;
        case 'constraints':
          constraintsAiLoading.value = false;
          break;
        case 'opportunities':
          opportunitiesAiLoading.value = false;
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
      const syncOrder = ['researchDomain', 'focusLevel', 'constraints', 'opportunities'];

      for (const fieldName of syncOrder) {
        try {
          await suggestAIField(fieldName);
          // Short delay between requests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
 catch (error) {
          console.warn(`خطا در همگام‌سازی ${fieldName}:`, error);
        }
      }

      toaster.show({
        title: 'موفقیت',
        message: 'همگام‌سازی هوشمند با موفقیت انجام شد.',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
        timeout: 5000,
      });
    }
 catch (error) {
      console.error('خطا در همگام‌سازی:', error);
      toaster.show({
        title: 'خطا',
        message: 'خطا در همگام‌سازی فیلدها. لطفاً دوباره امتحان کنید.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
 finally {
      smartCompleteLoading.value = false;
    }
  }

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
    what: { label: 'چه چیزی؟ (What)', icon: 'ph:question', prompt: 'موضوع اصلی تحقیق چیست؟ چه مسئله‌ای را بررسی می‌کنید?' },
    why: { label: 'چرا؟ (Why)', icon: 'ph:lightbulb', prompt: 'چرا این تحقیق مهم است؟ انگیزه و اهمیت آن چیست؟' },
    how: { label: 'چگونه؟ (How)', icon: 'ph:gear', prompt: 'چگونه این تحقیق را انجام خواهید داد؟ روش‌ها چیست؟' },
    who: { label: 'چه کسانی؟ (Who)', icon: 'ph:users', prompt: 'چه کسانی تأثیرگذار هستند؟ جامعه هدف کیست؟' },
    where: { label: 'کجا؟ (Where)', icon: 'ph:map-pin', prompt: 'محیط و مکان تحقیق کجاست؟' },
    when: { label: 'چه زمانی؟ (When)', icon: 'ph:calendar', prompt: 'بازه زمانی تحقیق چیست؟' },
  };

  const whQuestionOrder = ['what', 'why', 'how', 'who', 'where', 'when'];

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

      toaster.show({
        title: 'موفقیت',
        message: 'پاسخ با موفقیت تولید شد.',
        color: 'success',
        icon: 'ph:check-circle',
        timeout: 2000,
      });
    }
 catch (error) {
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید پاسخ. لطفاً دوباره امتحان کنید.',
        color: 'danger',
        icon: 'ph:warning',
      });
    }
 finally {
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
    // Compile all WH answers and enhance the main challenge
    const summary = Object.entries(whQuestions.value)
      .filter(([_, answer]) => answer)
      .map(([question, answer]) => `${whQuestionLabels[question].label}: ${answer}`)
      .join('\n\n');

    if (summary) {
      formData.value.mainChallenge = `${formData.value.mainChallenge}\n\n--- تحلیل WH ---\n${summary}`;
      toaster.show({
        title: 'موفقیت',
        message: 'پاسخ‌های WH به چالش اصلی اضافه شد.',
        color: 'success',
        icon: 'ph:check-circle',
      });
      showWhQuestionsModal.value = false;
    }
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

فرمت پاسخ به این صورت باشد:
STRENGTHS:
- نقطه قوت ۱
- نقطه قوت ۲

WEAKNESSES:
- نقطه ضعف ۱
- نقطه ضعف ۲

OPPORTUNITIES:
- فرصت ۱
- فرصت ۲

THREATS:
- تهدید ۱
- تهدید ۲`;

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

      // Parse the SWOT result
      const strengthsMatch = result.match(/STRENGTHS:(.*?)(?=WEAKNESSES:|$)/s);
      const weaknessesMatch = result.match(/WEAKNESSES:(.*?)(?=OPPORTUNITIES:|$)/s);
      const opportunitiesMatch = result.match(/OPPORTUNITIES:(.*?)(?=THREATS:|$)/s);
      const threatsMatch = result.match(/THREATS:(.*?)$/s);

      if (strengthsMatch) {
        swotData.value.strengths = strengthsMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim());
      }
      if (weaknessesMatch) {
        swotData.value.weaknesses = weaknessesMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim());
      }
      if (opportunitiesMatch) {
        swotData.value.opportunities = opportunitiesMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim());
      }
      if (threatsMatch) {
        swotData.value.threats = threatsMatch[1].trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim());
      }

      toaster.show({
        title: 'موفقیت',
        message: 'تحلیل SWOT با موفقیت تولید شد.',
        color: 'success',
        icon: 'ph:check-circle',
      });
    }
 catch (error) {
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید تحلیل SWOT.',
        color: 'danger',
        icon: 'ph:warning',
      });
    }
 finally {
      swotLoading.value = false;
    }
  }

  const addSwotItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    if (newSwotItem.value.trim()) {
      swotData.value[category].push(newSwotItem.value.trim());
      newSwotItem.value = '';
    }
  };

  const removeSwotItem = (category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
    swotData.value[category].splice(index, 1);
  };

  const applySwot = () => {
    // Apply opportunities to opportunities field
    if (swotData.value.opportunities.length > 0) {
      formData.value.opportunities = swotData.value.opportunities.join('\n');
    }

    // Apply weaknesses and threats to constraints
    const constraints = [...swotData.value.weaknesses, ...swotData.value.threats];
    if (constraints.length > 0) {
      formData.value.constraints = constraints.join('\n');
    }

    toaster.show({
      title: 'موفقیت',
      message: 'تحلیل SWOT به فرم اعمال شد.',
      color: 'success',
      icon: 'ph:check-circle',
    });
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

    // Initialize with main concept
    if (mindMapNodes.value.length === 0) {
      mindMapNodes.value.push({
        id: 'main',
        label: formData.value.mainChallenge.substring(0, 50) + '...',
        x: 400,
        y: 300,
      });
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
      const concepts = result.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());

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

      toaster.show({
        title: 'موفقیت',
        message: `${concepts.length} مفهوم جدید به نقشه ذهنی اضافه شد.`,
        color: 'success',
        icon: 'ph:check-circle',
      });
    }
 catch (error) {
      toaster.show({
        title: 'خطا',
        message: 'خطا در تولید پیشنهادات.',
        color: 'danger',
        icon: 'ph:warning',
      });
    }
 finally {
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
    mindMapNodes.value = mindMapNodes.value.filter(n => n.id !== nodeId);
    mindMapConnections.value = mindMapConnections.value.filter(c => c.from !== nodeId && c.to !== nodeId);
  };

  const exportMindMapAsMarkdown = () => {
    let markdown = `# نقشه ذهنی: ${formData.value.mainChallenge}\n\n`;
    markdown += '## مفاهیم کلیدی\n\n';
    mindMapNodes.value.forEach((node) => {
      markdown += `- ${node.label}\n`;
    });
    markdown += '\n## ارتباطات\n\n';
    mindMapConnections.value.forEach((conn) => {
      const fromNode = mindMapNodes.value.find(n => n.id === conn.from);
      const toNode = mindMapNodes.value.find(n => n.id === conn.to);
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

    toaster.show({
      title: 'موفقیت',
      message: 'نقشه ذهنی دانلود شد.',
      color: 'success',
      icon: 'ph:check-circle',
    });
  };

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
      const suggestions = result.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(domain => domain && !formData.value.researchDomain.includes(domain));

      if (suggestions.length > 0) {
        // Mix AI suggestions with some default ones
        domainSuggestions.value = [...suggestions, ...defaultDomainSuggestions.slice(0, 5)];
      }
    }
 catch (error) {
      console.warn('خطا در تولید پیشنهادات حوزه:', error);
      // Keep default suggestions on error
      domainSuggestions.value = [...defaultDomainSuggestions];
    }
  }

  const saveAndContinue = () => {
    router.push('/hampazhooh/brainstorm/stage2');
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm');
  };

  const exportMindMap = () => {
    openMindMap();
  };
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <BaseButton
            color="muted"
            shape="curved"
            size="sm"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            بازگشت
          </BaseButton>
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div class="bg-primary-500 shadow-primary-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:target" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-primary-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  مرحله ۱
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  تعریف حوزه و قاب مفهومی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  Framing & Scoping
                </BaseParagraph>
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
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-3 text-gray-900 dark:text-white"
            >
              هدف این مرحله
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
              در این مرحله، مرزهای موضوعی و مفهومی پژوهش خود را مشخص می‌کنید. این کار به شما کمک می‌کند تا تمرکز خود را حفظ کرده و از پراکندگی جلوگیری کنید.
            </BaseParagraph>
          </div>

          <!-- Key Features -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-4 text-gray-900 dark:text-white"
            >
              ویژگی‌های کلیدی
            </BaseHeading>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    مشخص کردن سؤال اصلی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    حتی اگر در ابتدا مبهم باشد
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    تعیین حوزهٔ دانشی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    علوم انسانی، فناوری، محیط زیست و...
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    تعیین سطح تمرکز
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    کاربردی، نظری، یا بین‌رشته‌ای
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    محدودیت‌ها و فرصت‌ها
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    زمان، منابع، دسترسی به داده
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scoping Form -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
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
                  <Icon
                    v-if="!mainChallengeAiLoading"
                    name="ph:sparkle"
                    class="size-4"
                  />
                  <Icon
                    v-else
                    name="svg-spinners:90-ring-with-bg"
                    class="size-4"
                  />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
              <BaseTextarea
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
                  <Icon
                    v-if="!researchDomainAiLoading"
                    name="ph:sparkle"
                    class="size-4"
                  />
                  <Icon
                    v-else
                    name="svg-spinners:90-ring-with-bg"
                    class="size-4"
                  />
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
                    <div class="text-muted-400 text-xs">
                      Enter برای افزودن
                    </div>
                  </div>
                </div>

                <!-- Suggestions -->
                <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-900/50 rounded-lg border bg-gray-50 p-3">
                  <div class="text-muted-600 dark:text-muted-400 mb-2 text-xs font-medium">
                    پیشنهادها:
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="suggestion in domainSuggestions"
                      :key="suggestion"
                      type="button"
                      :disabled="formData.researchDomain.includes(suggestion)"
                      class="nui-focus border-muted-200 hover:border-primary-500 hover:bg-primary-50 text-muted-600 dark:text-muted-300 dark:border-muted-700 dark:hover:bg-primary-900/20 dark:hover:border-primary-500 rounded-full border px-3 py-1 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      @click="() => { if (!formData.researchDomain.includes(suggestion)) { formData.researchDomain.push(suggestion); } }"
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
                  <Icon
                    v-if="!focusLevelAiLoading"
                    name="ph:sparkle"
                    class="size-4"
                  />
                  <Icon
                    v-else
                    name="svg-spinners:90-ring-with-bg"
                    class="size-4"
                  />
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

            <!-- Constraints -->
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                  <Icon name="ph:warning-circle" class="text-warning-500 size-5" />
                  محدودیت‌های پژوهش کدامند؟
                </label>
                <button
                  type="button"
                  class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                  :disabled="constraintsAiLoading"
                  @click="suggestAIField('constraints')"
                >
                  <Icon
                    v-if="!constraintsAiLoading"
                    name="ph:sparkle"
                    class="size-4"
                  />
                  <Icon
                    v-else
                    name="svg-spinners:90-ring-with-bg"
                    class="size-4"
                  />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
              <BaseTextarea
                v-model="formData.constraints"
                placeholder="زمان، منابع مالی، دسترسی به داده، محدودیت‌های روش‌شناختی، قوانین و مقررات"
                rows="3"
                shape="curved"
              />
            </div>

            <!-- Opportunities -->
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label class="text-muted-700 dark:text-muted-200 flex items-center gap-2 text-sm font-medium">
                  <Icon name="ph:trend-up" class="text-success-500 size-5" />
                  فرصت‌های موجود چیست؟
                </label>
                <button
                  type="button"
                  class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                  :disabled="opportunitiesAiLoading"
                  @click="suggestAIField('opportunities')"
                >
                  <Icon
                    v-if="!opportunitiesAiLoading"
                    name="ph:sparkle"
                    class="size-4"
                  />
                  <Icon
                    v-else
                    name="svg-spinners:90-ring-with-bg"
                    class="size-4"
                  />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
              <BaseTextarea
                v-model="formData.opportunities"
                placeholder="منابع موجود، همکاری با سازمان‌ها، دسترسی به داده، تخصص‌های موجود در تیم"
                rows="3"
                shape="curved"
              />
            </div>
          </div>

          <!-- Smart Complete Button -->
          <div class="mt-8 flex justify-center">
            <BaseButton
              color="primary"
              shape="curved"
              size="lg"
              class="shadow-primary-500/20 shadow-lg"
              :disabled="smartCompleteLoading || !formData.mainChallenge.trim()"
              @click="smartComplete"
            >
              <Icon
                v-if="!smartCompleteLoading"
                name="ph:magic-wand"
                class="ml-2 size-5"
              />
              <Icon
                v-else
                name="svg-spinners:90-ring-with-bg"
                class="ml-2 size-5"
              />
              همگام‌سازی هوشمند تمام فیلدها
            </BaseButton>
          </div>
        </div>

        <!-- Tools Section -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
              ابزارهای پیشنهادی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              از این ابزارها برای تعریف بهتر حوزه پژوهش استفاده کنید
            </BaseParagraph>
          </div>

          <div class="grid gap-6 lg:grid-cols-3">
            <!-- Mind Map Tool -->
            <div
              class="dark:border-muted-700 hover:border-primary-500 dark:bg-muted-900/50 group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl"
              @click="openMindMap"
            >
              <div class="bg-primary-500/10 mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Icon name="ph:tree-structure" class="text-primary-500 size-6" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                نقشهٔ ذهنی اولیه
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
                ایجاد یک نقشه بصری از مفاهیم و ارتباطات آن‌ها برای درک بهتر حوزه پژوهش
              </BaseParagraph>
              <div class="text-primary-500 flex items-center gap-1 text-xs font-medium">
                <Icon name="ph:arrow-left" class="size-4" />
                <span>باز کردن ابزار</span>
              </div>
            </div>

            <!-- WH Questions Tool -->
            <div
              class="dark:border-muted-700 hover:border-info-500 dark:bg-muted-900/50 group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl"
              @click="openWhQuestionsWizard"
            >
              <div class="bg-info-500/10 mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Icon name="ph:question" class="text-info-500 size-6" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
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
              <div class="bg-success-500/10 mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Icon name="ph:chart-line-up" class="text-success-500 size-6" />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
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
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-3 text-gray-900 dark:text-white"
              >
                نکات مهم برای این مرحله
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-200 space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                  <span>اگر سؤال اصلی شما هنوز کاملاً واضح نیست، نگران نباشید. در مراحل بعدی می‌توانید آن را دقیق‌تر کنید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                  <span>محدودیت‌ها را به عنوان چالش نبینید، بلکه آن‌ها را به عنوان راهنمایی برای واقعی‌تر کردن پژوهش در نظر بگیرید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                  <span>فرصت‌ها می‌توانند شامل همکاری‌های احتمالی، دسترسی به داده‌های موجود، یا تخصص‌های خاص باشند.</span>
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
          <BaseButton
            color="muted"
            shape="curved"
            size="lg"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            بازگشت به چارچوب
          </BaseButton>
          <BaseButton
            color="primary"
            shape="curved"
            size="lg"
            class="shadow-primary-500/30 shadow-lg"
            @click="saveAndContinue"
          >
            ذخیره و ادامه
            <Icon name="ph:arrow-left" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- WH Questions Modal -->
    <BaseModal
      :open="showWhQuestionsModal"
      size="2xl"
      @close="showWhQuestionsModal = false"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:question" class="size-6 text-white" />
          </div>
          <div>
            <BaseHeading
              as="h2"
              size="xl"
              weight="bold"
            >
              ویزارد سؤالات WH
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              پاسخ به سؤالات کلیدی برای تعریف دقیق‌تر پژوهش
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6">
        <!-- Progress Steps -->
        <div class="flex items-center justify-between">
          <div
            v-for="(key, index) in whQuestionOrder"
            :key="key"
            class="flex flex-1 items-center"
          >
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
              <Icon
                v-if="whQuestions[key]"
                name="ph:check-bold"
                class="size-4"
              />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div
              v-if="index < whQuestionOrder.length - 1"
              :class="[
                'mx-2 h-1 flex-1 rounded transition-all',
                whQuestions[whQuestionOrder[index + 1]]
                  ? 'bg-success-500'
                  : 'bg-muted-200',
              ]"
            />
          </div>
        </div>

        <!-- Current Question -->
        <div class="border-muted-200 dark:border-muted-700 from-info-50 dark:from-info-900/20 dark:to-muted-900 rounded-xl border-2 bg-gradient-to-br to-white p-6">
          <div class="mb-4 flex items-start gap-3">
            <Icon :name="whQuestionLabels[currentWhQuestion].icon" class="text-info-500 mt-1 size-6" />
            <div class="flex-1">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-2"
              >
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
              <Icon
                v-if="!whQuestionsLoading"
                name="ph:sparkle"
                class="ml-2 size-4"
              />
              <Icon
                v-else
                name="svg-spinners:90-ring-with-bg"
                class="ml-2 size-4"
              />
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

          <BaseButton
            v-else
            color="success"
            shape="curved"
            @click="applyWhQuestions"
          >
            اعمال به فرم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- SWOT Matrix Modal -->
    <BaseModal
      :open="showSwotModal"
      size="4xl"
      @close="showSwotModal = false"
    >
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="bg-success-500 flex size-12 items-center justify-center rounded-xl">
              <Icon name="ph:chart-line-up" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="bold"
              >
                تحلیل SWOT
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                نقاط قوت، ضعف، فرصت‌ها و تهدیدها
              </BaseParagraph>
            </div>
          </div>
          <BaseButton
            color="success"
            shape="curved"
            :disabled="swotLoading"
            @click="generateSwotAnalysis"
          >
            <Icon
              v-if="!swotLoading"
              name="ph:sparkle"
              class="ml-2 size-4"
            />
            <Icon
              v-else
              name="svg-spinners:90-ring-with-bg"
              class="ml-2 size-4"
            />
            تولید خودکار SWOT
          </BaseButton>
        </div>
      </template>

      <div class="p-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Strengths -->
          <div class="border-success-200 dark:border-success-700 bg-success-50 dark:bg-success-900/20 rounded-xl border-2 p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:trend-up" class="text-success-600 size-5" />
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="text-success-700 dark:text-success-300"
              >
                نقاط قوت (Strengths)
              </BaseHeading>
            </div>
            <div class="space-y-2">
              <div
                v-for="(item, index) in swotData.strengths"
                :key="index"
                class="dark:bg-muted-800 flex items-start gap-2 rounded-lg bg-white p-2"
              >
                <span class="flex-1 text-sm">{{ item }}</span>
                <button
                  class="text-danger-500 hover:text-danger-600"
                  @click="removeSwotItem('strengths', index)"
                >
                  <Icon name="ph:x" class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Weaknesses -->
          <div class="border-warning-200 dark:border-warning-700 bg-warning-50 dark:bg-warning-900/20 rounded-xl border-2 p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:warning" class="text-warning-600 size-5" />
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="text-warning-700 dark:text-warning-300"
              >
                نقاط ضعف (Weaknesses)
              </BaseHeading>
            </div>
            <div class="space-y-2">
              <div
                v-for="(item, index) in swotData.weaknesses"
                :key="index"
                class="dark:bg-muted-800 flex items-start gap-2 rounded-lg bg-white p-2"
              >
                <span class="flex-1 text-sm">{{ item }}</span>
                <button
                  class="text-danger-500 hover:text-danger-600"
                  @click="removeSwotItem('weaknesses', index)"
                >
                  <Icon name="ph:x" class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Opportunities -->
          <div class="border-info-200 dark:border-info-700 bg-info-50 dark:bg-info-900/20 rounded-xl border-2 p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:lightbulb" class="text-info-600 size-5" />
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="text-info-700 dark:text-info-300"
              >
                فرصت‌ها (Opportunities)
              </BaseHeading>
            </div>
            <div class="space-y-2">
              <div
                v-for="(item, index) in swotData.opportunities"
                :key="index"
                class="dark:bg-muted-800 flex items-start gap-2 rounded-lg bg-white p-2"
              >
                <span class="flex-1 text-sm">{{ item }}</span>
                <button
                  class="text-danger-500 hover:text-danger-600"
                  @click="removeSwotItem('opportunities', index)"
                >
                  <Icon name="ph:x" class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Threats -->
          <div class="border-danger-200 dark:border-danger-700 bg-danger-50 dark:bg-danger-900/20 rounded-xl border-2 p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="ph:warning-circle" class="text-danger-600 size-5" />
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="text-danger-700 dark:text-danger-300"
              >
                تهدیدها (Threats)
              </BaseHeading>
            </div>
            <div class="space-y-2">
              <div
                v-for="(item, index) in swotData.threats"
                :key="index"
                class="dark:bg-muted-800 flex items-start gap-2 rounded-lg bg-white p-2"
              >
                <span class="flex-1 text-sm">{{ item }}</span>
                <button
                  class="text-danger-500 hover:text-danger-600"
                  @click="removeSwotItem('threats', index)"
                >
                  <Icon name="ph:x" class="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Apply Button -->
        <div class="mt-6 flex justify-end">
          <BaseButton
            color="success"
            shape="curved"
            size="lg"
            @click="applySwot"
          >
            اعمال به فرم
            <Icon name="ph:check" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Mind Map Modal -->
    <BaseModal
      :open="showMindMapModal"
      size="6xl"
      @close="showMindMapModal = false"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-primary-500 flex size-12 items-center justify-center rounded-xl">
              <Icon name="ph:tree-structure" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="bold"
              >
                نقشه ذهنی
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                مفاهیم کلیدی و ارتباطات آنها
              </BaseParagraph>
            </div>
          </div>
          <div class="flex gap-2">
            <BaseButton
              color="primary"
              shape="curved"
              :disabled="mindMapLoading"
              @click="generateMindMapSuggestions"
            >
              <Icon
                v-if="!mindMapLoading"
                name="ph:sparkle"
                class="ml-2 size-4"
              />
              <Icon
                v-else
                name="svg-spinners:90-ring-with-bg"
                class="ml-2 size-4"
              />
              تولید مفاهیم
            </BaseButton>
            <BaseButton
              color="muted"
              shape="curved"
              @click="exportMindMapAsMarkdown"
            >
              <Icon name="ph:download-simple" class="ml-2 size-4" />
              دانلود
            </BaseButton>
          </div>
        </div>
      </template>

      <div class="p-6">
        <!-- Simple Visual Representation -->
        <div class="border-muted-200 dark:border-muted-700 from-primary-50 dark:from-primary-900/10 dark:to-muted-900 relative h-96 overflow-auto rounded-xl border-2 bg-gradient-to-br to-white p-8">
          <div
            v-for="node in mindMapNodes"
            :key="node.id"
            :style="{
              position: 'absolute',
              left: node.x + 'px',
              top: node.y + 'px',
              transform: 'translate(-50%, -50%)',
            }"
            :class="[
              'dark:bg-muted-800 group relative cursor-move rounded-xl border-2 bg-white px-4 py-3 shadow-lg transition-all hover:shadow-xl',
              node.id === 'main' ? 'border-primary-500 scale-110' : 'border-muted-300',
            ]"
          >
            <div class="flex items-center gap-2">
              <Icon
                v-if="node.id === 'main'"
                name="ph:target"
                class="text-primary-500 size-5"
              />
              <Icon
                v-else
                name="ph:circle"
                class="text-muted-400 size-3"
              />
              <span class="text-sm font-medium">{{ node.label }}</span>
              <button
                v-if="node.id !== 'main'"
                class="text-danger-500 hover:text-danger-600 ml-2 opacity-0 transition-opacity group-hover:opacity-100"
                @click="removeMindMapNode(node.id)"
              >
                <Icon name="ph:x" class="size-4" />
              </button>
            </div>
          </div>

          <!-- SVG for connections -->
          <svg class="pointer-events-none absolute inset-0 size-full">
            <line
              v-for="conn in mindMapConnections"
              :key="`${conn.from}-${conn.to}`"
              :x1="mindMapNodes.find(n => n.id === conn.from)?.x"
              :y1="mindMapNodes.find(n => n.id === conn.from)?.y"
              :x2="mindMapNodes.find(n => n.id === conn.to)?.x"
              :y2="mindMapNodes.find(n => n.id === conn.to)?.y"
              stroke="#9C6ADE"
              stroke-width="2"
              stroke-dasharray="5,5"
              opacity="0.5"
            />
          </svg>
        </div>

        <!-- Concepts List -->
        <div class="mt-6">
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            class="mb-3"
          >
            مفاهیم ({{ mindMapNodes.length }})
          </BaseHeading>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="node in mindMapNodes"
              :key="node.id"
              :class="[
                'rounded-full px-4 py-2 text-sm',
                node.id === 'main'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-muted-100 text-muted-700 dark:bg-muted-800 dark:text-muted-300',
              ]"
            >
              {{ node.label }}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
