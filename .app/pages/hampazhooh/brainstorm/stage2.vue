<script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { useBrainStorm, type BrainStorm } from '@/composables/useBrainStorm';
  import AddonMarkdownRemark from '~/components/AddonMarkdownRemark.vue';

  interface Technique {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning';
    steps: string[];
  }

  interface Idea {
    id: string;
    content: string;
    technique: string;
    timestamp: Date;
    aiGenerated?: boolean;
  }

  interface TitleItem {
    id: string;
    title: string;
    description: string;
    value: string;
    relevance: string;
    novelty: string;
    feasibility?: string;
  }

  definePageMeta({
    title: 'مرحله ۲: تولید ایده‌های خلاقانه',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();
  const { streamChat, processing } = useOpenRouter();
  const { getContextForAI } = useStage1Data();

  // BrainStorm data management
  const {
    brainStorms,
    currentBrainStorm,
    loading,
    error,
    getUserBrainStorms,
    getBrainStorm,
    updateBrainStorm,
    updateLastAccessed,
  } = useBrainStorm();

  const { user } = useUser();
  const currentSessionId = ref<string | null>(null);

  const selectedTechnique = ref<string | null>(null);
  const selectedIdea = ref<Idea | null>(null);
  const ideas = ref<Idea[]>([]);
  const newIdea = ref('');

  // Titles list state
  const titlesList = ref<TitleItem[]>([]);
  const titlesListLoading = ref(false);

  // Stage1 data extracted from currentBrainStorm
  const stage1Data = computed(() => {
    if (!currentBrainStorm.value) {
      return {
        mainChallenge: '',
        researchDomain: [] as string[],
        keywords: [] as string[],
        focusLevel: '',
        whQuestions: {},
        swotData: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: [],
        },
      };
    }

    // Debug: Log the raw data from PocketBase
    console.log('currentBrainStorm.value:', currentBrainStorm.value);
    console.log('researchDomain type:', typeof currentBrainStorm.value.researchDomain);
    console.log('researchDomain value:', currentBrainStorm.value.researchDomain);

    // Parse researchDomain - it might be stored as JSON string
    let researchDomainArray: string[] = [];
    if (Array.isArray(currentBrainStorm.value.researchDomain)) {
      researchDomainArray = currentBrainStorm.value.researchDomain;
    } else if (typeof currentBrainStorm.value.researchDomain === 'string') {
      try {
        const parsed = JSON.parse(currentBrainStorm.value.researchDomain);
        researchDomainArray = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.warn('Failed to parse researchDomain as JSON:', e);
        researchDomainArray = [];
      }
    } else if (
      typeof currentBrainStorm.value.researchDomain === 'object' &&
      currentBrainStorm.value.researchDomain !== null
    ) {
      // If it's an object, try to extract array values
      researchDomainArray = Object.values(currentBrainStorm.value.researchDomain).filter((v) => typeof v === 'string');
    }

    return {
      mainChallenge: currentBrainStorm.value.mainChallenge || '',
      researchDomain: researchDomainArray,
      keywords: currentBrainStorm.value.keywords || [],
      focusLevel: currentBrainStorm.value.focusLevel || '',
      whQuestions: currentBrainStorm.value.whQuestions || {},
      swotData: currentBrainStorm.value.swotData || {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },
    };
  });

  // Check if stage1 data is properly loaded and valid
  const isStage1DataValid = computed(() => {
    return !!(
      currentBrainStorm.value &&
      stage1Data.value.mainChallenge &&
      stage1Data.value.mainChallenge.trim().length > 0
    );
  });

  // AI Generation states
  const aiGenerating = ref(false);
  const currentTechniqueGenerating = ref<string | null>(null);
  const userGuidance = ref('');
  const showAiGuidanceModal = ref(false);

  const techniques: Technique[] = [
    {
      id: 'scamper',
      title: 'SCAMPER',
      subtitle: 'بازتعریف خلاقانه مسائل',
      description:
        'تکنیک SCAMPER با استفاده از ۷ رویکرد مختلف (جایگزینی، ترکیب، تطبیق، تغییر، استفاده دیگر، حذف، معکوس) به شما کمک می‌کند مسائل را از زوایای مختلف ببینید.',
      icon: 'ph:magic-wand',
      color: 'primary',
      steps: [
        'Substitute: چه چیزی را می‌توان جایگزین کرد؟',
        'Combine: چه چیزهایی را می‌توان ترکیب کرد؟',
        'Adapt: چه چیزی را می‌توان تطبیق داد؟',
        'Modify: چه چیزی را می‌توان تغییر داد؟',
        'Put to another use: از آن چگونه می‌توان استفاده دیگری کرد؟',
        'Eliminate: چه چیزی را می‌توان حذف کرد؟',
        'Reverse: چه چیزی را می‌توان معکوس کرد؟',
      ],
    },
    {
      id: 'six-hats',
      title: 'Six Thinking Hats',
      subtitle: 'نگاه‌های چندبعدی',
      description:
        'این تکنیک شما را تشویق می‌کند که مسئله را از ۶ دیدگاه مختلف (احساسی، منطقی، خلاقانه، منفی، مثبت، مدیریتی) بررسی کنید.',
      icon: 'ph:user-switch',
      color: 'info',
      steps: [
        'کلاه سفید: واقعیت‌ها و داده‌ها',
        'کلاه قرمز: احساسات و شهود',
        'کلاه سیاه: نقاط ضعف و خطرات',
        'کلاه زرد: نقاط قوت و فواید',
        'کلاه سبز: خلاقیت و ایده‌های جدید',
        'کلاه آبی: مدیریت فرایند و نتیجه‌گیری',
      ],
    },
    {
      id: 'analogical',
      title: 'Analogical Thinking',
      subtitle: 'استعاره‌های مفهومی',
      description: 'با استفاده از تشبیه و استعاره از حوزه‌های دیگر، دیدگاه‌های تازه‌ای به مسئله خود پیدا کنید.',
      icon: 'ph:arrows-left-right',
      color: 'success',
      steps: [
        'مسئله را در یک حوزه دیگر تصور کنید',
        'شباهت‌های ساختاری را پیدا کنید',
        'راه‌حل‌های آن حوزه را بررسی کنید',
        'این راه‌حل‌ها را به مسئله خود تطبیق دهید',
      ],
    },
    {
      id: 'reverse',
      title: 'Reverse Brainstorming',
      subtitle: 'نگاه معکوس',
      description:
        'به جای "چطور حل کنیم؟" بپرسید "چطور بدتر کنیم؟" این تغییر دیدگاه می‌تواند راه‌حل‌های غیرمنتظره‌ای ایجاد کند.',
      icon: 'ph:arrow-u-up-left',
      color: 'warning',
      steps: [
        'مسئله را معکوس کنید',
        'روش‌های بدتر کردن را فهرست کنید',
        'هر روش را معکوس کنید',
        'راه‌حل‌های واقعی را استخراج کنید',
      ],
    },
  ];

  // Convert stage1 data to initial ideas
  const convertStage1ToIdeas = (stage1Data: any): Idea[] => {
    const initialIdeas: Idea[] = [];

    if (stage1Data?.mainChallenge) {
      initialIdeas.push({
        id: 'stage1-main-challenge',
        content: `چالش اصلی پژوهش: ${stage1Data.mainChallenge}`,
        technique: 'stage1',
        timestamp: new Date(),
        aiGenerated: false,
      });
    }

    if (stage1Data?.researchDomain && stage1Data.researchDomain.length > 0) {
      initialIdeas.push({
        id: 'stage1-domains',
        content: `حوزه‌های دانشی پژوهش: ${stage1Data.researchDomain.join(', ')}`,
        technique: 'stage1',
        timestamp: new Date(),
        aiGenerated: false,
      });
    }

    if (stage1Data?.focusLevel) {
      const focusLabels = {
        applied: 'کاربردی',
        theoretical: 'نظری',
        interdisciplinary: 'بین‌رشته‌ای',
        mixed: 'ترکیبی',
      };
      initialIdeas.push({
        id: 'stage1-focus',
        content: `سطح تمرکز پژوهش: ${focusLabels[stage1Data.focusLevel] || stage1Data.focusLevel}`,
        technique: 'stage1',
        timestamp: new Date(),
        aiGenerated: false,
      });
    }

    return initialIdeas;
  };

  // Load stage1 data and convert to initial ideas
  onMounted(async () => {
    // First try to load existing session from PocketBase
    if (user.value) {
      await loadExistingSession();

      // After loading, convert stage1 data to initial ideas if available and no ideas exist yet
      await nextTick();
      if (stage1Data.value && stage1Data.value.mainChallenge && ideas.value.length === 0) {
        const stage1Ideas = convertStage1ToIdeas(stage1Data.value);
        ideas.value.push(...stage1Ideas);
      }

      // Load existing titles list if available
      if (currentBrainStorm.value?.list && Array.isArray(currentBrainStorm.value.list)) {
        titlesList.value = currentBrainStorm.value.list.map((item: any) => ({
          id: item.id || `title-${Date.now()}-${Math.random()}`,
          title: item.title || '',
          description: item.description || '',
          value: item.value || '',
          relevance: item.relevance || '',
          novelty: item.novelty || '',
          feasibility: item.feasibility || '',
        }));
      }
    } else {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا وارد حساب کاربری خود شوید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      router.push('/auth/login');
    }
  });

  // Load existing brainstorm session
  const loadExistingSession = async () => {
    try {
      // First, try to get the most recent session for this user (any stage)
      const result = await getUserBrainStorms(user.value.id, {
        perPage: 1,
        sort: '-updated',
      });

      if (result && result.items && result.items.length > 0) {
        const session = result.items[0];
        currentSessionId.value = session.id;

        // Load session data
        await getBrainStorm(session.id);

        // Update last accessed timestamp
        await updateLastAccessed(session.id);

        // Convert session data to ideas if they exist and we're in stage2 or later
        if (session.stage === 'stage2' || session.stage === 'stage3') {
          if (session.researchDomain && typeof session.researchDomain === 'object') {
            // Extract ideas from session data structure
            loadSessionIdeas(session);
          }
        }

        toaster.show({
          title: 'موفقیت',
          message: 'جلسه طوفان فکری با موفقیت بارگیری شد.',
          color: 'success',
          icon: 'ph:check-circle',
          timeout: 3000,
        });
      }
    } catch (err: any) {
      console.error('Error loading existing session:', err);
      toaster.show({
        title: 'هشدار',
        message: 'خطا در بارگیری جلسه. لطفاً مطمئن شوید که مرحله ۱ را تکمیل کرده‌اید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
    }
  };

  // Load ideas from session data
  const loadSessionIdeas = (session: BrainStorm) => {
    // Extract ideas from different session fields
    const sessionIdeas: Idea[] = [];

    // Load from research domain if it contains idea-like data
    if (session.researchDomain && typeof session.researchDomain === 'object') {
      Object.entries(session.researchDomain).forEach(([key, value], index) => {
        if (typeof value === 'string' && value.length > 10) {
          sessionIdeas.push({
            id: `session-domain-${index}`,
            content: value,
            technique: 'stage1',
            timestamp: new Date(session.created),
            aiGenerated: false,
          });
        }
      });
    }

    // Load from keywords if they contain substantial content
    if (session.keywords && Array.isArray(session.keywords)) {
      session.keywords.forEach((keyword, index) => {
        if (keyword.length > 10) {
          sessionIdeas.push({
            id: `session-keyword-${index}`,
            content: keyword,
            technique: 'stage1',
            timestamp: new Date(session.created),
            aiGenerated: false,
          });
        }
      });
    }

    // Add session ideas to the ideas array
    if (sessionIdeas.length > 0) {
      ideas.value.unshift(...sessionIdeas);
    }
  };

  const selectTechnique = (techniqueId: string) => {
    selectedTechnique.value = techniqueId;
  };

  const selectIdea = (idea: Idea) => {
    selectedIdea.value = idea;
  };

  const applyTechniqueToIdea = (idea: Idea, techniqueId: string) => {
    // Navigate to the technique page with selected idea and technique as query params
    router.push({
      path: `/hampazhooh/brainstorm/techniques/${techniqueId}`,
      query: {
        ideaId: idea.id,
        ideaContent: idea.content,
        ideaTechnique: idea.technique,
        ideaTimestamp: idea.timestamp.toISOString(),
        ideaAiGenerated: idea.aiGenerated ? 'true' : 'false',
      },
    });
  };

  const addIdea = () => {
    if (newIdea.value.trim() && selectedTechnique.value) {
      ideas.value.push({
        id: Date.now().toString(),
        content: newIdea.value.trim(),
        technique: selectedTechnique.value,
        timestamp: new Date(),
        aiGenerated: false,
      });
      newIdea.value = '';
    }
  };

  const navigateToTechnique = (techniqueId: string) => {
    router.push(`/hampazhooh/brainstorm/techniques/${techniqueId}`);
  };

  const generateIdeasWithAI = async (techniqueId: string, guidance?: string) => {
    if (!stage1Data.value.mainChallenge) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا به مرحله ۱ بازگردید و چالش اصلی پژوهش را مشخص کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    const technique = techniques.find((t) => t.id === techniqueId);
    if (!technique) return;

    currentTechniqueGenerating.value = techniqueId;
    aiGenerating.value = true;

    try {
      const context = getContextForAI(stage1Data.value);

      // Add selected idea context if available
      let contextString = context;
      if (selectedIdea.value) {
        contextString += `\n\nایده منتخب برای گسترش: ${selectedIdea.value.content}\n\nلطفاً ایده‌های جدیدی تولید کنید که بر اساس ایده منتخب بالا و با استفاده از تکنیک انتخاب شده گسترش داده شده‌اند.`;
      }

      const techniquePrompts = {
        scamper: `با استفاده از تکنیک SCAMPER، حداقل ۵ ایده خلاقانه برای چالش تحقیقاتی زیر تولید کنید:
${contextString}

تکنیک SCAMPER شامل:
- Substitute: جایگزینی عناصر
- Combine: ترکیب مفاهیم مختلف
- Adapt: تطبیق از حوزه‌های دیگر
- Modify: تغییر و بهبود
- Put to another use: استفاده جدید
- Eliminate: حذف موارد غیرضروری
- Reverse: معکوس کردن فرایند

${guidance ? `راهنمایی کاربر: ${guidance}` : ''}

برای هر ایده:
1. کدام جنبه SCAMPER را استفاده می‌کند (مثلا: Substitute)
2. ایده را به صورت واضح و عملی توضیح دهید
3. نشان دهید چگونه این ایده به چالش اصلی کمک می‌کند

پاسخ را به صورت لیستی شماره‌گذاری شده برگردانید:`,

        'six-hats': `با استفاده از تکنیک Six Thinking Hats، حداقل ۶ ایده از دیدگاه‌های مختلف برای چالش تحقیقاتی زیر تولید کنید:
${contextString}

شش کلاه فکری:
- کلاه سفید: واقعیت‌ها و داده‌ها
- کلاه قرمز: احساسات و شهود
- کلاه سیاه: نقاط ضعف و خطرات
- کلاه زرد: نقاط قوت و فواید
- کلاه سبز: خلاقیت و ایده‌های جدید
- کلاه آبی: مدیریت فرایند و نتیجه‌گیری

${guidance ? `راهنمایی کاربر: ${guidance}` : ''}

برای هر کلاه، یک ایده یا دیدگاه ارائه دهید که نشان‌دهنده آن نگرش خاص باشد.
پاسخ را به صورت لیستی با مشخص کردن کلاه هر ایده برگردانید:`,

        analogical: `با استفاده از تفکر قیاسی (Analogical Thinking)، حداقل ۴ ایده خلاقانه برای چالش تحقیقاتی زیر تولید کنید:
${contextString}

فرایند تفکر قیاسی:
1. مسئله را در یک حوزه دیگر تصور کنید
2. شباهت‌های ساختاری را پیدا کنید
3. راه‌حل‌های آن حوزه را بررسی کنید
4. این راه‌حل‌ها را به مسئله خود تطبیق دهید

${guidance ? `راهنمایی کاربر: ${guidance}` : ''}

برای هر ایده:
1. حوزه استعاری را مشخص کنید (مثلا: طبیعت، فناوری، هنر، ورزش)
2. شباهت‌های ساختاری را توضیح دهید
3. راه‌حل تطبیق‌یافته را ارائه دهید

پاسخ را به صورت لیستی شماره‌گذاری شده برگردانید:`,

        reverse: `با استفاده از تکنیک Reverse Brainstorming، حداقل ۵ ایده برای چالش تحقیقاتی زیر تولید کنید:
${contextString}

فرایند طوفان فکری معکوس:
1. مسئله را معکوس کنید
2. روش‌های بدتر کردن را فهرست کنید
3. هر روش را معکوس کنید
4. راه‌حل‌های واقعی را استخراج کنید

${guidance ? `راهنمایی کاربر: ${guidance}` : ''}

ابتدا ۳ روش برای بدتر کردن مسئله را فهرست کنید، سپس هر کدام را معکوس کرده تا راه‌حل‌های خلاقانه واقعی به دست آید.
پاسخ را به صورت دو بخش برگردانید:
بخش ۱: روش‌های بدتر کردن
بخش ۲: راه‌حل‌های معکوس شده`,
      };

      const prompt = techniquePrompts[techniqueId as keyof typeof techniquePrompts];
      const messages = [{ role: 'user', content: prompt }];

      let generatedContent = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            generatedContent += chunk;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      // Parse and add generated ideas
      const generatedIdeas = parseGeneratedIdeas(generatedContent, techniqueId);

      generatedIdeas.forEach((ideaContent, index) => {
        ideas.value.push({
          id: `ai-${Date.now()}-${index}`,
          content: ideaContent,
          technique: techniqueId,
          timestamp: new Date(),
          aiGenerated: true,
        });
      });

      toaster.show({
        title: 'موفقیت',
        message: `${generatedIdeas.length} ایده جدید با هوش مصنوعی تولید شد.`,
        color: 'success',
        icon: 'ph:check-circle',
        timeout: 4000,
      });
    } catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در تولید ایده‌ها: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      aiGenerating.value = false;
      currentTechniqueGenerating.value = null;
      showAiGuidanceModal.value = false;
      userGuidance.value = '';
    }
  };

  // Parse AI generated content into individual ideas
  const parseGeneratedIdeas = (content: string, techniqueId: string): string[] => {
    const ideas: string[] = [];

    // Split by numbered items or bullet points
    const items = content.split(/\n(?=\d+\.|\n(?=-))/);

    for (const item of items) {
      const trimmedItem = item.trim();
      if (trimmedItem && (trimmedItem.match(/^\d+\./) || trimmedItem.startsWith('-'))) {
        // Remove numbering/bullets and clean up
        const ideaText = trimmedItem
          .replace(/^\d+\.\s*/, '')
          .replace(/^-\s*/, '')
          .trim();
        if (ideaText.length > 10) {
          // Filter out very short items
          ideas.push(ideaText);
        }
      }
    }

    // If no structured items found, split by paragraphs
    if (ideas.length === 0) {
      const paragraphs = content.split('\n\n').filter((p) => p.trim().length > 20);
      ideas.push(...paragraphs.slice(0, 5)); // Limit to first 5 paragraphs
    }

    return ideas.slice(0, 8); // Limit total ideas
  };

  const openAiGuidance = (techniqueId: string) => {
    selectedTechnique.value = techniqueId;
    showAiGuidanceModal.value = true;
  };

  const removeIdea = (id: string) => {
    ideas.value = ideas.value.filter((idea) => idea.id !== id);
  };

  const getTechniqueName = (id: string) => {
    if (id === 'stage1') return 'مرحله ۱';
    return techniques.find((t) => t.id === id)?.title || '';
  };

  const getTechniqueColor = (id: string) => {
    if (id === 'stage1') return 'muted';
    return techniques.find((t) => t.id === id)?.color || 'muted';
  };

  const saveAndContinue = async () => {
    try {
      // Save current session data to PocketBase
      if (currentSessionId.value && currentBrainStorm.value) {
        // Prepare ideas data for storage
        const ideasData = ideas.value.reduce((acc, idea, index) => {
          acc[`idea_${index}`] = {
            content: idea.content,
            technique: idea.technique,
            timestamp: idea.timestamp.toISOString(),
            aiGenerated: idea.aiGenerated,
          };
          return acc;
        }, {} as Record<string, any>);

        await updateBrainStorm({
          id: currentSessionId.value,
          researchDomain: {
            ...currentBrainStorm.value.researchDomain,
            ...ideasData,
          },
          stage: 'stage3',
          status: 'in_progress',
          lastAccessed: new Date().toISOString(),
        });

        toaster.show({
          title: 'موفقیت',
          message: 'ایده‌ها با موفقیت ذخیره شدند.',
          color: 'success',
          icon: 'ph:check-circle',
          timeout: 3000,
        });
      }

      router.push('/hampazhooh/brainstorm/stage3');
    } catch (err: any) {
      console.error('Error saving session:', err);
      toaster.show({
        title: 'خطا',
        message: 'خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm/stage1');
  };

  // Generate titles list with AI
  const generateTitlesList = async () => {
    if (!stage1Data.value.mainChallenge) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا به مرحله ۱ بازگردید و چالش اصلی پژوهش را مشخص کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    // Clear existing list before generating new one
    titlesList.value = [];
    titlesListLoading.value = true;

    try {
      const context = getContextForAI(stage1Data.value);

      const prompt = `شما یک مشاور پژوهشی متخصص هستید. بر اساس اطلاعات پژوهش زیر، ۵ عنوان پژوهشی خلاقانه، قابل دفاع و علمی تولید کنید:

${context}

الزامات عناوین:
- عناوین باید مستقیماً به چالش اصلی پژوهش پاسخ دهند
- باید با حوزه‌های دانشی و سطح تمرکز ذکر شده همخوانی داشته باشند
- باید دقیق، مشخص و قابل اندازه‌گیری باشند
- از اصطلاحات علمی صحیح و رایج در حوزه استفاده شود
- تنوع در رویکردها (نظری، کاربردی، میدانی، تجربی، بین‌رشته‌ای)

برای هر عنوان، اطلاعات زیر را به صورت JSON خالص و بدون هیچ متن اضافی ارائه دهید:

{
  "titles": [
    {
      "title": "عنوان پژوهش به زبان فارسی (دقیق و علمی)",
      "description": "توضیح مختصر درباره محتوا، روش و هدف این پژوهش (۲-۳ جمله)",
      "value": "ارزش و کاربرد این پژوهش برای جامعه علمی یا عملی",
      "relevance": "چگونگی پاسخ‌دهی این عنوان به چالش اصلی و اهداف پژوهش",
      "novelty": "جنبه نوآورانه و تمایز این پژوهش از مطالعات پیشین",
      "feasibility": "امکان‌سنجی اجرای این پژوهش از نظر منابع، زمان و دسترسی به داده"
    }
  ]
}

نکات مهم:
1. عناوین باید کاملاً با اطلاعات مرحله ۱ همخوان باشند
2. از عناوین عمومی و کلیشه‌ای پرهیز کنید
3. هر عنوان باید قابل تبدیل به یک پروپوزال پژوهشی واقعی باشد
4. فقط JSON معتبر برگردانید، بدون توضیحات اضافی یا markdown`;

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
        // Remove markdown code blocks if present
        let cleanedResult = result.trim();
        if (cleanedResult.startsWith('```')) {
          cleanedResult = cleanedResult.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
        }

        // Extract JSON object
        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);

          if (parsedData.titles && Array.isArray(parsedData.titles) && parsedData.titles.length > 0) {
            titlesList.value = parsedData.titles.map((item: any, index: number) => ({
              id: `title-${Date.now()}-${index}`,
              title: item.title || '',
              description: item.description || '',
              value: item.value || '',
              relevance: item.relevance || '',
              novelty: item.novelty || '',
              feasibility: item.feasibility || '',
            }));

            // Save the generated list to backend
            if (currentSessionId.value) {
              try {
                await updateBrainStorm({
                  id: currentSessionId.value,
                  list: titlesList.value,
                });

                toaster.show({
                  title: 'موفقیت',
                  message: `${titlesList.value.length} عنوان پژوهشی با کیفیت بالا تولید و ذخیره شد.`,
                  color: 'success',
                  icon: 'ph:check-circle',
                  timeout: 4000,
                });
              } catch (saveError) {
                console.error('Error saving titles list:', saveError);
                toaster.show({
                  title: 'هشدار',
                  message: `عناوین تولید شدند اما خطا در ذخیره‌سازی رخ داد.`,
                  color: 'warning',
                  icon: 'ph:warning',
                  closable: true,
                });
              }
            } else {
              toaster.show({
                title: 'موفقیت',
                message: `${titlesList.value.length} عنوان پژوهشی با کیفیت بالا تولید شد.`,
                color: 'success',
                icon: 'ph:check-circle',
                timeout: 4000,
              });
            }
          } else {
            throw new Error('هیچ عنوانی در پاسخ یافت نشد');
          }
        } else {
          throw new Error('فرمت JSON معتبر پیدا نشد');
        }
      } catch (parseError: any) {
        console.error('Error parsing titles JSON:', parseError);
        console.error('Raw result:', result);
        toaster.show({
          title: 'خطا',
          message: `خطا در تفسیر پاسخ: ${parseError.message || 'فرمت نامعتبر'}. لطفاً دوباره امتحان کنید.`,
          color: 'danger',
          icon: 'ph:warning',
          closable: true,
        });
      }
    } catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در تولید عناوین: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      titlesListLoading.value = false;
    }
  };

  const exportIdeas = () => {
    if (ideas.value.length === 0) {
      toaster.show({
        title: 'هشدار',
        message: 'هیچ ایده‌ای برای دانلود وجود ندارد.',
        color: 'warning',
        icon: 'ph:warning',
      });
      return;
    }

    let content = `# ایده‌های تولید شده - مرحله ۲\n\n`;
    content += `تاریخ تولید: ${new Date().toLocaleString('fa-IR')}\n`;
    content += `تعداد ایده‌ها: ${ideas.value.length}\n\n`;

    // Group by technique
    const ideasByTechnique = ideas.value.reduce((acc, idea) => {
      if (!acc[idea.technique]) {
        acc[idea.technique] = [];
      }
      acc[idea.technique].push(idea);
      return acc;
    }, {} as Record<string, Idea[]>);

    Object.entries(ideasByTechnique).forEach(([techniqueId, techniqueIdeas]) => {
      const technique = techniques.find((t) => t.id === techniqueId);
      content += `## ${technique?.title || techniqueId} (${techniqueIdeas.length} ایده)\n\n`;

      techniqueIdeas.forEach((idea, index) => {
        content += `### ${index + 1}. ${idea.aiGenerated ? '🤖 تولید شده با هوش مصنوعی' : '✏️ دستی'}\n\n`;
        content += `${idea.content}\n\n`;
        content += `*زمان: ${new Date(idea.timestamp).toLocaleString('fa-IR')}*\n\n`;
        content += `---\n\n`;
      });
    });

    // Add stage1 context
    content += `## زمینه پژوهش (از مرحله ۱)\n\n`;
    content += `**چالش اصلی:** ${stage1Data.value?.mainChallenge || 'مشخص نشده'}\n\n`;
    content += `**حوزه‌های دانشی:** ${stage1Data.value?.researchDomain?.join(', ') || 'مشخص نشده'}\n\n`;

    // Download as file
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hampazhooh-ideas-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toaster.show({
      title: 'موفقیت',
      message: 'ایده‌ها با موفقیت دانلود شدند.',
      color: 'success',
      icon: 'ph:check-circle',
    });
  };
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div class="bg-info-500 shadow-info-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:lightbulb" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-info-500 mb-1 text-xs font-semibold uppercase tracking-wider">مرحله ۲</div>
                <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
                  تولید ایده‌های خلاقانه
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">Divergent Ideation</BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- Loading State -->
        <div
          v-if="loading && !currentBrainStorm && !stage1Data.mainChallenge"
          class="flex min-h-[400px] items-center justify-center"
        >
          <div class="text-center">
            <div class="text-primary-500 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
              <Icon name="svg-spinners:90-ring-with-bg" class="size-8" />
            </div>
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-muted-700 dark:text-muted-300 mb-2">
              در حال بارگیری جلسه طوفان فکری...
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">لطفاً چند لحظه صبر کنید</BaseParagraph>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error && !currentBrainStorm && !stage1Data.mainChallenge"
          class="flex min-h-[400px] items-center justify-center"
        >
          <div class="text-center max-w-md">
            <div
              class="bg-danger-500/10 dark:bg-danger-500/20 mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
            >
              <Icon name="ph:warning-octagon" class="text-danger-500 size-8" />
            </div>
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-muted-700 dark:text-muted-300 mb-2">
              خطا در بارگیری جلسه
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 mb-4">
              {{ error }}
            </BaseParagraph>
            <BaseButton color="primary" shape="curved" size="sm" @click="loadExistingSession">
              <Icon name="ph:arrow-clockwise" class="ml-2 size-4" />
              تلاش مجدد
            </BaseButton>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else>
          <!-- Introduction (هدف این مرحله) - Moved to top -->
          <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6">
              <BaseHeading as="h2" size="xl" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
                هدف این مرحله
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4 leading-relaxed">
                در این مرحله، هدف گسترش طیف ایده‌ها بدون قضاوت است. تمرکز بر کمّیت قبل از کیفیت باشد. از تکنیک‌های
                خلاقیت ساختاریافته استفاده کنید تا ایده‌های متنوع و خلاقانه تولید کنید.
              </BaseParagraph>
            </div>

            <!-- Key Principles -->
            <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border border-gray-100 bg-gray-50 p-6">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-4 text-gray-900 dark:text-white">
                اصول کلیدی
              </BaseHeading>
              <div class="grid gap-4 sm:grid-cols-3">
                <div class="flex items-start gap-3">
                  <Icon name="ph:chart-line-up-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                  <div>
                    <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">کمّیت اول</div>
                    <div class="text-muted-600 dark:text-muted-400 text-xs">هرچه ایده بیشتر، بهتر</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="ph:hand-palm-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                  <div>
                    <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">بدون قضاوت</div>
                    <div class="text-muted-600 dark:text-muted-400 text-xs">همه ایده‌ها خوب هستند</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="ph:arrows-merge-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                  <div>
                    <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">ترکیب حوزه‌ها</div>
                    <div class="text-muted-600 dark:text-muted-400 text-xs">از حوزه‌های مختلف الهام بگیرید</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Session Info Card (if session exists) -->
          <div
            v-if="currentBrainStorm"
            class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div class="mb-4 flex items-center gap-3">
              <div class="bg-success-500/10 flex size-10 items-center justify-center rounded-lg">
                <Icon name="ph:database" class="text-success-500 size-5" />
              </div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
                اطلاعات جلسه از پایگاه داده
              </BaseHeading>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <!-- Session Title -->
              <div class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <Icon name="ph:text-align-right" class="text-primary-500 size-4" />
                  <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">عنوان جلسه:</span>
                </div>
                <p class="text-muted-600 dark:text-muted-400 text-sm leading-relaxed truncate">
                  {{ currentBrainStorm.title }}
                </p>
              </div>

              <!-- Session Status -->
              <div class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <Icon name="ph:info" class="text-primary-500 size-4" />
                  <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">وضعیت:</span>
                </div>
                <BaseTag
                  :color="
                    currentBrainStorm.status === 'completed'
                      ? 'success'
                      : currentBrainStorm.status === 'in_progress'
                      ? 'info'
                      : 'muted'
                  "
                  size="sm"
                  shape="full"
                >
                  {{
                    currentBrainStorm.status === 'completed'
                      ? 'تکمیل شده'
                      : currentBrainStorm.status === 'in_progress'
                      ? 'در حال انجام'
                      : currentBrainStorm.status === 'draft'
                      ? 'پیش‌نویس'
                      : 'بایگانی شده'
                  }}
                </BaseTag>
              </div>

              <!-- Last Accessed -->
              <div class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <Icon name="ph:clock" class="text-primary-500 size-4" />
                  <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">آخرین بازدید:</span>
                </div>
                <p class="text-muted-600 dark:text-muted-400 text-sm leading-relaxed">
                  {{
                    currentBrainStorm.lastAccessed
                      ? new Date(currentBrainStorm.lastAccessed).toLocaleString('fa-IR')
                      : 'ثبت نشده'
                  }}
                </p>
              </div>

              <!-- Session ID -->
              <div class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <Icon name="ph:fingerprint" class="text-primary-500 size-4" />
                  <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">شناسه جلسه:</span>
                </div>
                <p class="text-muted-600 dark:text-muted-400 text-xs font-mono leading-relaxed truncate">
                  {{ currentBrainStorm.id.slice(0, 8) }}...{{ currentBrainStorm.id.slice(-4) }}
                </p>
              </div>
            </div>
          </div>

          <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-6">
            <div class="mb-4 flex items-center gap-3">
              <div class="bg-primary-500/10 flex size-10 items-center justify-center rounded-lg">
                <Icon name="ph:clipboard-text" class="text-primary-500 size-5" />
              </div>
              <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
                خلاصه مرحله ۱: تعریف حوزه و قاب مفهومی
              </BaseHeading>
            </div>

            <div
              v-if="
                stage1Data && (stage1Data.mainChallenge || stage1Data.researchDomain?.length || stage1Data.focusLevel)
              "
              class="space-y-4"
            >
              <!-- Main Challenge -->
              <div
                v-if="stage1Data.mainChallenge"
                class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div class="mb-3 flex items-center gap-2">
                  <Icon name="ph:question" class="text-primary-500 size-4" />
                  <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">چالش اصلی:</span>
                </div>
                <div
                  class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl max-w-none"
                >
                  <AddonMarkdownRemark :source="stage1Data.mainChallenge" />
                </div>
              </div>

              <!-- Research Domains & Focus Level - Two Column Row -->
              <div v-if="stage1Data.researchDomain?.length || stage1Data.focusLevel" class="grid gap-4 sm:grid-cols-2">
                <!-- Research Domains -->
                <div
                  v-if="stage1Data.researchDomain?.length"
                  class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div class="mb-2 flex items-center gap-2">
                    <Icon name="ph:books" class="text-primary-500 size-4" />
                    <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">حوزه‌های دانشی:</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <BaseTag
                      v-for="domain in stage1Data.researchDomain"
                      :key="domain"
                      color="primary"
                      size="sm"
                      shape="full"
                    >
                      {{ domain }}
                    </BaseTag>
                  </div>
                </div>

                <!-- Focus Level -->
                <div
                  v-if="stage1Data.focusLevel"
                  class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div class="mb-2 flex items-center gap-2">
                    <Icon name="ph:target" class="text-primary-500 size-4" />
                    <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">سطح تمرکز:</span>
                  </div>
                  <BaseTag
                    :color="
                      stage1Data.focusLevel === 'applied'
                        ? 'success'
                        : stage1Data.focusLevel === 'theoretical'
                        ? 'info'
                        : stage1Data.focusLevel === 'interdisciplinary'
                        ? 'warning'
                        : 'muted'
                    "
                    size="sm"
                    shape="full"
                  >
                    {{
                      stage1Data.focusLevel === 'applied'
                        ? 'کاربردی'
                        : stage1Data.focusLevel === 'theoretical'
                        ? 'نظری'
                        : stage1Data.focusLevel === 'interdisciplinary'
                        ? 'بین‌رشته‌ای'
                        : 'ترکیبی'
                    }}
                  </BaseTag>
                </div>
              </div>

              <!-- Keywords -->
              <div
                v-if="stage1Data.keywords?.length"
                class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div class="mb-2 flex items-center gap-2">
                  <Icon name="ph:key" class="text-primary-500 size-4" />
                  <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">کلیدواژه‌ها:</span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <BaseTag v-for="keyword in stage1Data.keywords" :key="keyword" color="warning" size="sm" shape="full">
                    {{ keyword }}
                  </BaseTag>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else
              class="dark:bg-muted-900/50 dark:border-muted-600 rounded-lg border border-gray-100 bg-gray-50 p-6 text-center"
            >
              <div
                class="bg-muted-100 dark:bg-muted-900 mx-auto mb-3 flex size-12 items-center justify-center rounded-full"
              >
                <Icon name="ph:info" class="text-muted-400 size-6" />
              </div>
              <BaseParagraph size="sm" class="text-muted-500">هنوز هیچ داده‌ای از مرحله ۱ ثبت نشده است.</BaseParagraph>
              <BaseButton color="primary" shape="curved" size="sm" class="mt-3" @click="goBack">
                <Icon name="ph:arrow-right" class="ml-2 size-4" />
                بازگشت به مرحله ۱
              </BaseButton>
            </div>
          </div>

          <!-- Titles List Card -->
          <div class="dark:bg-muted-800 dark:border-muted-700 mt-8 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-success-500/10 flex size-12 items-center justify-center rounded-xl">
                  <Icon name="ph:list-bullets" class="text-success-500 size-6" />
                </div>
                <div>
                  <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
                    لیست عناوین پژوهشی
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500 mt-1">
                    عناوین پیشنهادی بر اساس چالش اصلی و اطلاعات مرحله ۱
                  </BaseParagraph>
                </div>
              </div>
              <div>
                <BaseButton
                  color="success"
                  shape="curved"
                  size="md"
                  :disabled="titlesListLoading || !isStage1DataValid"
                  @click="generateTitlesList"
                >
                  <Icon v-if="!titlesListLoading" name="ph:sparkle" class="ml-2 size-5" />
                  <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-5" />
                  {{ titlesListLoading ? 'در حال تولید...' : 'تولید با هوش مصنوعی' }}
                </BaseButton>
                <BaseParagraph v-if="!isStage1DataValid" size="xs" class="text-danger-500 mt-2">
                  برای تولید عناوین، ابتدا باید اطلاعات مرحله ۱ را تکمیل کنید
                </BaseParagraph>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="titlesList.length === 0 && !titlesListLoading"
              class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-12 text-center"
            >
              <div
                class="bg-muted-100 dark:bg-muted-800 mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
              >
                <Icon name="ph:list-bullets" class="text-muted-400 size-8" />
              </div>
              <BaseHeading as="h4" size="md" weight="semibold" class="text-muted-700 dark:text-muted-300 mb-2">
                هنوز عنوانی تولید نشده است
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                با کلیک روی دکمه "تولید با هوش مصنوعی" عناوین پژوهشی خلاقانه ایجاد کنید
              </BaseParagraph>
            </div>

            <!-- Loading State -->
            <div
              v-if="titlesListLoading"
              class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-12 text-center"
            >
              <div class="text-primary-500 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                <Icon name="svg-spinners:90-ring-with-bg" class="size-8" />
              </div>
              <BaseHeading as="h4" size="md" weight="semibold" class="text-muted-700 dark:text-muted-300 mb-2">
                در حال تولید عناوین پژوهشی...
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">لطفاً چند لحظه صبر کنید</BaseParagraph>
            </div>

            <!-- Titles List -->
            <div v-if="titlesList.length > 0 && !titlesListLoading" class="space-y-4">
              <div
                v-for="(titleItem, index) in titlesList"
                :key="titleItem.id"
                class="dark:border-muted-700 dark:bg-muted-900/50 group rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-200 hover:shadow-md"
              >
                <!-- Title and Number -->
                <div class="mb-4 flex items-start gap-4">
                  <div
                    class="bg-success-500 flex size-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <BaseHeading as="h4" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                      {{ titleItem.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 leading-relaxed">
                      {{ titleItem.description }}
                    </BaseParagraph>
                  </div>
                </div>

                <!-- Details Grid -->
                <div class="grid gap-3 sm:grid-cols-2">
                  <!-- Value -->
                  <div class="dark:bg-muted-800 dark:border-muted-600 rounded-lg border border-gray-200 bg-white p-3">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon name="ph:star" class="text-warning-500 size-4" />
                      <span class="text-muted-700 dark:text-muted-200 text-xs font-semibold">ارزش و اهمیت:</span>
                    </div>
                    <p class="text-muted-600 dark:text-muted-400 text-xs leading-relaxed">
                      {{ titleItem.value }}
                    </p>
                  </div>

                  <!-- Relevance -->
                  <div class="dark:bg-muted-800 dark:border-muted-600 rounded-lg border border-gray-200 bg-white p-3">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon name="ph:link" class="text-info-500 size-4" />
                      <span class="text-muted-700 dark:text-muted-200 text-xs font-semibold">ارتباط با چالش:</span>
                    </div>
                    <p class="text-muted-600 dark:text-muted-400 text-xs leading-relaxed">
                      {{ titleItem.relevance }}
                    </p>
                  </div>

                  <!-- Novelty -->
                  <div class="dark:bg-muted-800 dark:border-muted-600 rounded-lg border border-gray-200 bg-white p-3">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon name="ph:lightbulb" class="text-primary-500 size-4" />
                      <span class="text-muted-700 dark:text-muted-200 text-xs font-semibold">نوآوری:</span>
                    </div>
                    <p class="text-muted-600 dark:text-muted-400 text-xs leading-relaxed">
                      {{ titleItem.novelty }}
                    </p>
                  </div>

                  <!-- Feasibility -->
                  <div
                    v-if="titleItem.feasibility"
                    class="dark:bg-muted-800 dark:border-muted-600 rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <div class="mb-2 flex items-center gap-2">
                      <Icon name="ph:check-circle" class="text-success-500 size-4" />
                      <span class="text-muted-700 dark:text-muted-200 text-xs font-semibold">امکان‌پذیری:</span>
                    </div>
                    <p class="text-muted-600 dark:text-muted-400 text-xs leading-relaxed">
                      {{ titleItem.feasibility }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tips Box -->
          <div class="bg-info-500/10 dark:bg-info-500/20 border-info-500/20 mt-8 rounded-2xl border-2 p-6">
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
                    <span>در این مرحله هیچ ایده‌ای بد نیست. همه چیز را یادداشت کنید.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                    <span>از چند تکنیک مختلف استفاده کنید تا تنوع ایده‌ها بیشتر شود.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                    <span>ایده‌های دیوانه‌وار و غیرعادی می‌توانند منجر به راه‌حل‌های نوآورانه شوند.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Icon name="ph:dot-outline-fill" class="text-info-500 mt-1 size-4 shrink-0" />
                    <span>با دیگران در میان بگذارید - همکاری می‌تواند ایده‌های بهتری ایجاد کند.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Creativity Techniques Card (تکنیک‌های خلاقیت) - Moved to bottom -->
          <div class="dark:bg-muted-800 dark:border-muted-700 mt-8 rounded-2xl border border-gray-200 bg-white p-6">
            <BaseHeading as="h3" size="lg" weight="semibold" class="mb-6 text-gray-900 dark:text-white">
              تکنیک‌های خلاقیت برای بهبود ایده ها
            </BaseHeading>

            <div class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="technique in techniques"
                :key="technique.id"
                :class="[
                  'dark:border-muted-700 cursor-pointer rounded-xl border-2 p-4 transition-all duration-200',
                  selectedTechnique === technique.id
                    ? `border-${technique.color}-500 ring-4 ring-${technique.color}-500/10`
                    : 'dark:border-muted-700 dark:hover:border-muted-600 border-gray-200 hover:border-gray-300',
                ]"
              >
                <div class="mb-3 flex items-center gap-3">
                  <div :class="['flex size-10 items-center justify-center rounded-lg', `bg-${technique.color}-500/10`]">
                    <Icon :name="technique.icon" :class="[`text-${technique.color}-500`, 'size-5']" />
                  </div>
                  <div class="flex-1">
                    <div class="text-muted-800 text-sm font-semibold dark:text-white">
                      {{ technique.title }}
                    </div>
                    <div class="text-muted-500 text-xs">
                      {{ technique.subtitle }}
                    </div>
                  </div>
                  <div
                    v-if="selectedTechnique === technique.id"
                    :class="['flex size-6 items-center justify-center rounded-full', `bg-${technique.color}-500`]"
                  >
                    <Icon name="ph:check-bold" class="size-3.5 text-white" />
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                  <BaseButton
                    :color="technique.color"
                    shape="curved"
                    size="sm"
                    class="flex-1"
                    @click.stop="selectTechnique(technique.id)"
                  >
                    <Icon name="ph:selection" class="ml-1 size-4" />
                    انتخاب
                  </BaseButton>
                  <BaseButton
                    v-if="selectedIdea"
                    :color="technique.color"
                    shape="curved"
                    size="sm"
                    class="flex-1"
                    @click.stop="applyTechniqueToIdea(selectedIdea, technique.id)"
                  >
                    <Icon name="ph:lightbulb" class="ml-1 size-4" />
                    اعمال روی ایده
                  </BaseButton>
                  <BaseButton
                    v-else
                    :color="technique.color"
                    shape="curved"
                    size="sm"
                    class="flex-1"
                    @click.stop="openAiGuidance(technique.id)"
                  >
                    <Icon name="ph:sparkle" class="ml-1 size-4" />
                    تولید با هوش
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Technique Details Section -->
          <div class="space-y-6">
            <!-- Technique Details -->
            <div
              v-if="selectedTechnique"
              class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8"
            >
              <div v-for="technique in techniques.filter((t) => t.id === selectedTechnique)" :key="technique.id">
                <div class="mb-6 flex items-start gap-4">
                  <div
                    :class="['flex size-16 items-center justify-center rounded-2xl', `bg-${technique.color}-500/10`]"
                  >
                    <Icon :name="technique.icon" :class="[`text-${technique.color}-500`, 'size-8']" />
                  </div>
                  <div class="flex-1">
                    <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                      {{ technique.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                      {{ technique.description }}
                    </BaseParagraph>
                  </div>
                </div>

                <!-- Steps -->
                <div
                  class="dark:border-muted-700 dark:bg-muted-900/50 mb-6 rounded-xl border border-gray-100 bg-gray-50 p-6"
                >
                  <div class="text-muted-700 dark:text-muted-200 mb-4 text-sm font-semibold">مراحل استفاده:</div>
                  <div class="space-y-3">
                    <div v-for="(step, idx) in technique.steps" :key="idx" class="flex items-start gap-3">
                      <div
                        :class="[
                          'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                          `bg-${technique.color}-500`,
                        ]"
                      >
                        {{ idx + 1 }}
                      </div>
                      <div class="text-muted-600 dark:text-muted-400 text-sm">
                        {{ step }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- AI Generation Button -->
                <div class="flex items-center justify-between">
                  <div class="text-muted-600 dark:text-muted-400 text-sm">
                    <Icon name="ph:info" class="inline-block ml-2 size-4" />
                    برای تولید خودکار ایده با این تکنیک، از دکمه زیر استفاده کنید
                  </div>
                  <BaseButton
                    :color="technique.color"
                    shape="curved"
                    size="lg"
                    :disabled="aiGenerating"
                    @click="openAiGuidance(technique.id)"
                  >
                    <Icon v-if="!aiGenerating" name="ph:sparkle" class="ml-2 size-5" />
                    <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-5" />
                    {{
                      aiGenerating && currentTechniqueGenerating === technique.id
                        ? 'در حال تولید...'
                        : 'تولید ایده با هوش مصنوعی'
                    }}
                  </BaseButton>
                </div>
              </div>
            </div>

            <!-- No Technique Selected -->
            <div
              v-else
              class="dark:bg-muted-800 dark:border-muted-700 flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8"
            >
              <div class="text-center">
                <div
                  class="bg-muted-100 dark:bg-muted-900 mx-auto mb-4 flex size-20 items-center justify-center rounded-full"
                >
                  <Icon name="ph:selection-plus" class="text-muted-400 size-10" />
                </div>
                <BaseHeading as="h3" size="lg" weight="semibold" class="text-muted-700 dark:text-muted-300 mb-2">
                  یک تکنیک را انتخاب کنید
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500">
                  از لیست سمت چپ، یک تکنیک خلاقیت را انتخاب کنید تا شروع به تولید ایده کنید
                </BaseParagraph>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="mt-8 flex items-center justify-between">
            <BaseButton color="muted" shape="curved" size="lg" @click="goBack">
              <Icon name="ph:arrow-right" class="ml-2 size-5" />
              مرحله قبل
            </BaseButton>
            <BaseButton
              color="success"
              shape="curved"
              size="lg"
              :disabled="ideas.length === 0"
              class="shadow-success-500/30 shadow-lg"
              @click="saveAndContinue"
            >
              ذخیره و ادامه
              <Icon name="ph:arrow-left" class="mr-2 size-5" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Guidance Modal -->
    <TairoModal :open="showAiGuidanceModal" size="xl" @close="showAiGuidanceModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:sparkle" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">تولید ایده با هوش مصنوعی</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              {{ selectedTechnique ? techniques.find((t) => t.id === selectedTechnique)?.title : '' }}
            </BaseParagraph>
          </div>
        </div>
      </template>

      <template #body>
        <div class="space-y-6 p-6">
          <!-- Context Display -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
              زمینه پژوهش (از مرحله ۱)
            </BaseHeading>
            <div class="space-y-2 text-sm">
              <div class="text-muted-600 dark:text-muted-400">
                <strong>چالش اصلی:</strong>
                {{ stage1Data.value?.mainChallenge || 'مشخص نشده' }}
              </div>
              <div class="text-muted-600 dark:text-muted-400">
                <strong>حوزه‌های دانشی:</strong>
                {{ stage1Data.value?.researchDomain?.join(', ') || 'مشخص نشده' }}
              </div>
              <div class="text-muted-600 dark:text-muted-400">
                <strong>سطح تمرکز:</strong>
                {{ stage1Data.value?.focusLevel || 'مشخص نشده' }}
              </div>
            </div>
          </div>

          <!-- User Guidance -->
          <div>
            <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">
              راهنمایی اختیاری برای هوش مصنوعی
            </label>
            <BaseTextarea
              v-model="userGuidance"
              placeholder="مثلاً: بیشتر روی جنبه آموزشی تمرکز کن، یا ایده‌های عملی و قابل اجرا بده..."
              rows="4"
              shape="curved"
            />
            <div class="text-muted-500 mt-2 text-xs">
              این راهنمایی به هوش مصنوعی کمک می‌کند تا ایده‌های مرتبط‌تر و دقیق‌تری تولید کند. (اختیاری)
            </div>
          </div>

          <!-- Technique Info -->
          <div
            v-if="selectedTechnique"
            class="dark:border-muted-700 dark:bg-muted-900/30 rounded-xl border border-gray-100 p-4"
          >
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'flex size-10 items-center justify-center rounded-lg',
                  `bg-${techniques.find((t) => t.id === selectedTechnique)?.color}-500/10`,
                ]"
              >
                <Icon
                  :name="techniques.find((t) => t.id === selectedTechnique)?.icon || 'ph:lightbulb'"
                  :class="[`text-${techniques.find((t) => t.id === selectedTechnique)?.color}-500`, 'size-5']"
                />
              </div>
              <div class="flex-1">
                <div class="text-muted-800 text-sm font-semibold dark:text-white">
                  {{ techniques.find((t) => t.id === selectedTechnique)?.title }}
                </div>
                <div class="text-muted-500 text-xs">
                  {{ techniques.find((t) => t.id === selectedTechnique)?.subtitle }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between">
            <BaseButton color="muted" shape="curved" @click="showAiGuidanceModal = false">انصراف</BaseButton>
            <BaseButton
              color="info"
              shape="curved"
              size="lg"
              :disabled="!selectedTechnique || aiGenerating"
              @click="generateIdeasWithAI(selectedTechnique!, userGuidance)"
            >
              <Icon v-if="!aiGenerating" name="ph:sparkle" class="ml-2 size-5" />
              <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-5" />
              {{ aiGenerating ? 'در حال تولید...' : 'تولید ایده‌ها' }}
            </BaseButton>
          </div>
        </div>
      </template>
    </TairoModal>
  </div>
</template>
