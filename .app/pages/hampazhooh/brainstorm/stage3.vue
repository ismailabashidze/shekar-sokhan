<script setup lang="ts">
  interface EvaluationCriteria {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  }

  interface Idea {
    id: string;
    title: string;
    description: string;
    scores: Record<string, number>;
    totalScore: number;
    category?: string;
  }

  interface Tool {
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success';
  }

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();
  const { streamChat, processing } = useOpenRouter();
  const { user } = useUser();

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

  const currentSessionId = ref<string | null>(null);
  const stage1Data = ref<any>(null);
  const stage2Ideas = ref<any[]>([]);

  const evaluationCriteria: EvaluationCriteria[] = [
    {
      id: 'innovation',
      title: 'نوآوری',
      description: 'آیا ایده جدید یا ترکیبی نو است؟',
      icon: 'ph:rocket-launch',
      color: 'primary',
    },
    {
      id: 'feasibility',
      title: 'قابلیت اجرا',
      description: 'آیا با منابع و زمان موجود قابل پیاده‌سازی است؟',
      icon: 'ph:checks',
      color: 'info',
    },
    {
      id: 'alignment',
      title: 'هماهنگی با اهداف',
      description: 'آیا با اهداف پروژه/دانشجو/سازمان همسو است؟',
      icon: 'ph:target',
      color: 'success',
    },
    {
      id: 'impact',
      title: 'پتانسیل تأثیر',
      description: 'آیا می‌تواند به دانش یا عمل تأثیر بگذارد؟',
      icon: 'ph:chart-line-up',
      color: 'warning',
    },
    {
      id: 'scalability',
      title: 'قابلیت تعمیم',
      description: 'آیا نتایج قابل تعمیم به سایر زمینه‌ها هستند؟',
      icon: 'ph:arrows-out',
      color: 'danger',
    },
  ];

  const tools: Tool[] = [
    {
      title: 'ماتریس ارزیابی ایده',
      description: 'ارزیابی ایده‌ها بر اساس معیارهای مشخص و مقایسه آن‌ها',
      icon: 'ph:table',
      color: 'primary',
    },
    {
      title: 'کارت‌های ایده',
      description: 'دسته‌بندی ایده‌ها بر اساس نوع رویکرد یا حوزه',
      icon: 'ph:cards',
      color: 'success',
    },
  ];

  const ideas = ref<Idea[]>([]);

  const selectedIdea = ref<string | null>(null);
  const evaluationMode = ref<'matrix' | 'cards'>('matrix');
  const filterCategory = ref<string>('all');
  const sortBy = ref<'score' | 'name' | 'innovation' | 'feasibility'>('score');
  const evaluatingWithAI = ref(false);
  const generatingMatrix = ref(false);
  const matrixData = ref<any>(null);
  const matrixDescription = ref<string>('');
  const showRankedResults = ref(false);

  // Load existing brainstorm session
  const loadExistingSession = async () => {
    try {
      // First, try to get the most recent session for this user
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

        // Extract stage1 data
        stage1Data.value = {
          mainChallenge: session.mainChallenge || '',
          researchDomain: session.researchDomain || [],
          keywords: session.keywords || [],
          focusLevel: session.focusLevel || '',
        };

        // Extract ideas from stage2 (from titlesList)
        if (session.list && Array.isArray(session.list)) {
          ideas.value = session.list.map((item: any, index: number) => ({
            id: item.id || `idea-${index}`,
            title: item.title || '',
            description: item.description || '',
            scores: item.scores || {},
            totalScore: item.totalScore || 0,
            category: item.category || 'عمومی',
          }));

          // Initialize empty scores if not present
          ideas.value.forEach((idea) => {
            evaluationCriteria.forEach((criteria) => {
              if (!idea.scores[criteria.id]) {
                idea.scores[criteria.id] = 0;
              }
            });
          });
        }

        // Load existing matrix result if available
        if (session.matrixResult) {
          matrixDescription.value = session.matrixResult;
          matrixData.value = {
            generatedAt: session.updated || new Date().toISOString(),
            ideas: sortedIdeas.value.slice(0, 5),
            description: session.matrixResult,
          };
        }

        toaster.show({
          title: 'موفقیت',
          message: `جلسه طوفان فکری بارگیری شد. ${ideas.value.length} ایده یافت شد.`,
          color: 'success',
          icon: 'ph:check-circle',
          timeout: 3000,
        });
      } else {
        toaster.show({
          title: 'هشدار',
          message: 'هیچ جلسه‌ای یافت نشد. لطفاً ابتدا مراحل قبلی را تکمیل کنید.',
          color: 'warning',
          icon: 'ph:warning',
          closable: true,
        });
      }
    } catch (err: any) {
      console.error('Error loading existing session:', err);
      toaster.show({
        title: 'خطا',
        message: 'خطا در بارگیری جلسه. لطفاً مطمئن شوید که مراحل قبلی را تکمیل کرده‌اید.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
  };

  onMounted(async () => {
    if (user.value) {
      await loadExistingSession();
    } else {
      toaster.show({
        title: 'خطا',
        message: 'لطفاً ابتدا وارد حساب کاربری خود شوید.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      router.push('/auth/login');
    }
  });

  // Mind Map State
  const showMindMapModal = ref(false);
  const mindMapNodes = ref<Array<{ id: string; label: string; x: number; y: number }>>([]);
  const mindMapConnections = ref<Array<{ from: string; to: string }>>([]);
  const mindMapLoading = ref(false);

  // Vue Flow Data
  const flowNodes = ref<Node[]>([]);
  const flowEdges = ref<Edge[]>([]);
  const flowLoading = ref(false);

  const updateScore = (ideaId: string, criteriaId: string, score: number) => {
    const idea = ideas.value.find((i) => i.id === ideaId);
    if (idea) {
      idea.scores[criteriaId] = score;
      idea.totalScore = Object.values(idea.scores).reduce((sum, val) => sum + val, 0);

      // Auto-save to backend
      saveEvaluationData();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    if (score >= 3) return 'info';
    return 'muted';
  };

  // Filter and sort ideas
  const filteredIdeas = computed(() => {
    let filtered = [...ideas.value];

    // Apply category filter
    if (filterCategory.value !== 'all') {
      filtered = filtered.filter((idea) => idea.category === filterCategory.value);
    }

    // Apply sorting
    switch (sortBy.value) {
      case 'score':
        filtered.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
        break;
      case 'innovation':
        filtered.sort((a, b) => (b.scores.innovation || 0) - (a.scores.innovation || 0));
        break;
      case 'feasibility':
        filtered.sort((a, b) => (b.scores.feasibility || 0) - (a.scores.feasibility || 0));
        break;
    }

    return filtered;
  });

  const sortedIdeas = computed(() => {
    return [...ideas.value].sort((a, b) => b.totalScore - a.totalScore);
  });

  // Get unique categories for filtering
  const categories = computed(() => {
    const cats = new Set(ideas.value.map((idea) => idea.category || 'عمومی'));
    return ['all', ...Array.from(cats)];
  });

  const selectIdea = (ideaId: string) => {
    selectedIdea.value = ideaId;
  };

  // AI-powered evaluation
  const evaluateWithAI = async () => {
    if (ideas.value.length === 0) {
      toaster.show({
        title: 'هشدار',
        message: 'هیچ ایده‌ای برای ارزیابی وجود ندارد.',
        color: 'warning',
        icon: 'ph:warning',
      });
      return;
    }

    evaluatingWithAI.value = true;

    try {
      for (const idea of ideas.value) {
        const prompt = `به عنوان یک متخصص ارزیابی پژوهش، ایده زیر را بر اساس ۵ معیار ارزیابی کنید و به هر معیار امتیاز 1 تا 10 بدهید:

عنوان ایده: ${idea.title}
توضیحات: ${idea.description}

معیارهای ارزیابی:
1. نوآوری (innovation): آیا ایده جدید یا ترکیبی نو است؟
2. قابلیت اجرا (feasibility): آیا با منابع و زمان موجود قابل پیاده‌سازی است؟
3. هماهنگی با اهداف (alignment): آیا با اهداف پروژه همسو است؟
4. پتانسیل تأثیر (impact): آیا می‌تواند به دانش یا عمل تأثیر بگذارد؟
5. قابلیت تعمیم (scalability): آیا نتایج قابل تعمیم به سایر زمینه‌ها هستند؟

${stage1Data.value?.mainChallenge ? `زمینه پژوهش: ${stage1Data.value.mainChallenge}` : ''}

پاسخ را فقط به صورت JSON برگردانید:
{
  "innovation": 8,
  "feasibility": 7,
  "alignment": 9,
  "impact": 8,
  "scalability": 6
}`;

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
          const jsonMatch = result.match(/\{[\s\S]*?\}/);
          if (jsonMatch) {
            const scores = JSON.parse(jsonMatch[0]);

            // Update idea scores
            evaluationCriteria.forEach((criteria) => {
              if (scores[criteria.id]) {
                idea.scores[criteria.id] = scores[criteria.id];
              }
            });

            idea.totalScore = Object.values(idea.scores).reduce((sum: number, val: any) => sum + Number(val), 0);
          }
        } catch (error) {
          console.error('Error parsing AI evaluation:', error);
        }
      }

      await saveEvaluationData();

      toaster.show({
        title: 'موفقیت',
        message: `${ideas.value.length} ایده با موفقیت ارزیابی شدند.`,
        color: 'success',
        icon: 'ph:check-circle',
      });
    } catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در ارزیابی: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
      });
    } finally {
      evaluatingWithAI.value = false;
    }
  };

  // Generate evaluation matrix with AI
  const generateEvaluationMatrix = async () => {
    if (ideas.value.length === 0) {
      toaster.show({
        title: 'هشدار',
        message: 'هیچ ایده‌ای برای تولید ماتریس وجود ندارد.',
        color: 'warning',
        icon: 'ph:warning',
      });
      return;
    }

    generatingMatrix.value = true;

    try {
      const topIdeas = sortedIdeas.value.slice(0, 5);
      const prompt = `بر اساس ایده‌های ارزیابی شده زیر، یک ماتریس ارزیابی جامع و توضیحات تفصیلی تولید کنید:

${topIdeas
  .map(
    (idea, index) => `
${index + 1}. ${idea.title}
   توضیحات: ${idea.description}
   نوآوری: ${idea.scores.innovation || 0}/10
   قابلیت اجرا: ${idea.scores.feasibility || 0}/10
   هماهنگی: ${idea.scores.alignment || 0}/10
   تأثیر: ${idea.scores.impact || 0}/10
   تعمیم: ${idea.scores.scalability || 0}/10
   امتیاز کل: ${idea.totalScore}/50
`,
  )
  .join('\n')}

${stage1Data.value?.mainChallenge ? `\nزمینه پژوهش: ${stage1Data.value.mainChallenge}` : ''}

لطفاً:
1. یک ماتریس مقایسه‌ای تولید کنید که نقاط قوت و ضعف هر ایده را نشان دهد
2. توصیه‌های عملی برای بهبود ایده‌های برتر ارائه دهید
3. ارتباطات بین ایده‌ها را شناسایی کنید
4. اولویت‌بندی نهایی را با توجیه کامل ارائه دهید

پاسخ را به صورت متن ساختاریافته برگردانید.`;

      const messages = [{ role: 'user', content: prompt }];
      let result = '';

      await new Promise<void>((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          if (chunk) {
            result += chunk;
            matrixDescription.value = result;
          }
        })
          .then(resolve)
          .catch(reject);
      });

      matrixData.value = {
        generatedAt: new Date().toISOString(),
        ideas: topIdeas,
        description: result,
      };

      // Save matrix result to backend
      if (currentSessionId.value) {
        try {
          await updateBrainStorm({
            id: currentSessionId.value,
            matrixResult: result,
          });
        } catch (saveError) {
          console.error('Error saving matrix result:', saveError);
        }
      }

      toaster.show({
        title: 'موفقیت',
        message: 'ماتریس ارزیابی با موفقیت تولید و ذخیره شد.',
        color: 'success',
        icon: 'ph:check-circle',
      });
    } catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در تولید ماتریس: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
      });
    } finally {
      generatingMatrix.value = false;
    }
  };

  // Save evaluation data to backend
  const saveEvaluationData = async () => {
    if (!currentSessionId.value) return;

    try {
      await updateBrainStorm({
        id: currentSessionId.value,
        list: ideas.value,
        matrixResult: matrixDescription.value || undefined,
        stage: 'stage3',
        status: 'in_progress',
      });
    } catch (error) {
      console.error('Error saving evaluation data:', error);
    }
  };

  const saveAndContinue = async () => {
    try {
      await saveEvaluationData();

      toaster.show({
        title: 'موفقیت',
        message: 'ارزیابی‌ها ذخیره شدند. انتقال به مرحله بعد...',
        color: 'success',
        icon: 'ph:check-circle',
        timeout: 2000,
      });

      // Navigate to stage4 after a short delay to show the success message
      setTimeout(() => {
        router.push('/hampazhooh/brainstorm/stage4');
      }, 500);
    } catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: 'خطا در ذخیره داده‌ها.',
        color: 'danger',
        icon: 'ph:warning',
      });
    }
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm/stage2');
  };

  const exportEvaluation = () => {
    if (ideas.value.length === 0) {
      toaster.show({
        title: 'هشدار',
        message: 'هیچ داده‌ای برای دانلود وجود ندارد.',
        color: 'warning',
        icon: 'ph:warning',
      });
      return;
    }

    let content = `# ارزیابی ایده‌ها - مرحله ۳\n\n`;
    content += `تاریخ: ${new Date().toLocaleString('fa-IR')}\n`;
    content += `تعداد ایده‌ها: ${ideas.value.length}\n\n`;

    sortedIdeas.value.forEach((idea, index) => {
      content += `## ${index + 1}. ${idea.title}\n\n`;
      content += `**توضیحات:** ${idea.description}\n\n`;
      content += `**امتیازها:**\n`;
      evaluationCriteria.forEach((criteria) => {
        content += `- ${criteria.title}: ${idea.scores[criteria.id] || 0}/10\n`;
      });
      content += `\n**امتیاز کل:** ${idea.totalScore}/50\n\n`;
      content += `---\n\n`;
    });

    if (matrixDescription.value) {
      content += `## ماتریس ارزیابی\n\n`;
      content += matrixDescription.value + '\n\n';
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toaster.show({
      title: 'موفقیت',
      message: 'فایل ارزیابی دانلود شد.',
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
          <BaseButton color="muted" shape="curved" size="sm" @click="goBack">
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            مرحله قبل
          </BaseButton>
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div
                class="bg-success-500 shadow-success-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg"
              >
                <Icon name="ph:funnel" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-success-500 mb-1 text-xs font-semibold uppercase tracking-wider">مرحله ۳</div>
                <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
                  ساختاردهی و ارزیابی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">Convergent Structuring & Evaluation</BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- Introduction -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
              هدف این مرحله
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
              در این مرحله، ایده‌های پراکنده را فیلتر، دسته‌بندی و اولویت‌بندی می‌کنیم. هدف تبدیل ایده‌های خلاقانه به
              طرح‌های پژوهشی قابل اجرا و شناسایی رویکردهای پژوهشی مناسب است.
            </BaseParagraph>
          </div>

          <!-- Key Features -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <BaseHeading as="h3" size="md" weight="semibold" class="mb-4 text-gray-900 dark:text-white">
              فعالیت‌های کلیدی
            </BaseHeading>
            <div class="grid gap-4 sm:grid-cols-3">
              <div class="flex items-start gap-3">
                <Icon name="ph:funnel-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">فیلتر کردن</div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">انتخاب ایده‌های قابل اجرا</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:stack-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">دسته‌بندی</div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">گروه‌بندی بر اساس موضوع</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:ranking-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">اولویت‌بندی</div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">ترتیب براساس ارزش</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Criteria -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              معیارهای ارزیابی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              هر ایده را بر اساس این پنج معیار کلیدی ارزیابی کنید (از ۱ تا ۱۰)
            </BaseParagraph>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div
              v-for="criteria in evaluationCriteria"
              :key="criteria.id"
              class="dark:border-muted-700 dark:bg-muted-900/30 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div :class="['mb-3 flex size-12 items-center justify-center rounded-xl', `bg-${criteria.color}-500/10`]">
                <Icon :name="criteria.icon" :class="[`text-${criteria.color}-500`, 'size-6']" />
              </div>
              <div class="text-muted-800 mb-2 text-sm font-semibold dark:text-white">
                {{ criteria.title }}
              </div>
              <div class="text-muted-600 dark:text-muted-400 text-xs leading-relaxed">
                {{ criteria.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- Filter and Sort Controls -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
              ابزارهای مدیریت ایده‌ها
            </BaseHeading>
            <div class="flex flex-wrap gap-2">
              <BaseButton
                color="primary"
                shape="curved"
                size="sm"
                :disabled="evaluatingWithAI || ideas.length === 0"
                @click="evaluateWithAI"
                class="flex-shrink-0"
              >
                <Icon v-if="!evaluatingWithAI" name="ph:sparkle" class="ml-2 size-4" />
                <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-4" />
                <span class="whitespace-nowrap">{{ evaluatingWithAI ? 'در حال ارزیابی...' : 'ارزیابی با AI' }}</span>
              </BaseButton>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <!-- Filter by Category -->
            <div>
              <label class="text-muted-700 dark:text-muted-200 mb-2 flex items-center text-sm font-medium">
                <Icon name="ph:funnel" class="ml-2 size-4 flex-shrink-0" />
                <span>فیلتر بر اساس دسته</span>
              </label>
              <BaseSelect v-model="filterCategory" shape="curved">
                <option value="all">همه دسته‌ها</option>
                <option v-for="cat in categories.filter((c) => c !== 'all')" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </BaseSelect>
            </div>

            <!-- Sort By -->
            <div>
              <label class="text-muted-700 dark:text-muted-200 mb-2 flex items-center text-sm font-medium">
                <Icon name="ph:arrows-down-up" class="ml-2 size-4 flex-shrink-0" />
                <span>مرتب‌سازی</span>
              </label>
              <BaseSelect v-model="sortBy" shape="curved">
                <option value="score">امتیاز کل</option>
                <option value="name">نام (الفبا)</option>
                <option value="innovation">نوآوری</option>
                <option value="feasibility">قابلیت اجرا</option>
              </BaseSelect>
            </div>

            <!-- Results Count -->
            <div>
              <label class="text-muted-700 dark:text-muted-200 mb-2 flex items-center text-sm font-medium">
                <Icon name="ph:list-numbers" class="ml-2 size-4 flex-shrink-0" />
                <span>تعداد نتایج</span>
              </label>
              <div
                class="dark:bg-muted-900 dark:border-muted-700 flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-4 text-lg font-bold text-gray-900 dark:text-white"
              >
                {{ filteredIdeas.length }} / {{ ideas.length }}
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Matrix -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-8"
        >
          <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1">
              <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-900 dark:text-white">
                ماتریس ارزیابی ایده‌ها
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mt-1">
                به هر ایده امتیاز دهید و نتایج را مشاهده کنید
              </BaseParagraph>
            </div>
            <div class="flex flex-wrap gap-2">
              <BaseButton
                color="info"
                shape="curved"
                size="sm"
                :disabled="generatingMatrix || ideas.length === 0"
                @click="generateEvaluationMatrix"
                class="flex-shrink-0"
              >
                <Icon v-if="!generatingMatrix" name="ph:table" class="ml-2 size-4" />
                <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-4" />
                <span class="whitespace-nowrap">{{ generatingMatrix ? 'تولید...' : 'تولید ماتریس' }}</span>
              </BaseButton>
              <BaseButton color="muted" shape="curved" size="sm" @click="exportEvaluation" class="flex-shrink-0">
                <Icon name="ph:download-simple" class="ml-2 size-4" />
                <span class="whitespace-nowrap">دانلود</span>
              </BaseButton>
            </div>
          </div>

          <!-- Matrix Table -->
          <div class="overflow-x-auto -mx-4 sm:mx-0">
            <div class="min-w-[900px] px-4 sm:px-0">
              <!-- Header Row -->
              <div
                class="dark:border-muted-700 dark:bg-muted-900/50 mb-2 grid grid-cols-7 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <div class="col-span-2 text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">ایده</div>
                <div
                  v-for="criteria in evaluationCriteria"
                  :key="criteria.id"
                  class="flex items-center justify-center text-center"
                >
                  <span class="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 leading-tight">
                    {{ criteria.title }}
                  </span>
                </div>
              </div>

              <!-- Idea Rows -->
              <div class="space-y-2">
                <div
                  v-if="filteredIdeas.length === 0"
                  class="dark:bg-muted-900/30 rounded-xl border border-gray-100 bg-gray-50 p-12 text-center"
                >
                  <Icon name="ph:funnel-simple" class="text-muted-400 mx-auto mb-4 size-16" />
                  <BaseParagraph class="text-muted-500">هیچ ایده‌ای با این فیلتر یافت نشد.</BaseParagraph>
                </div>

                <div
                  v-for="idea in filteredIdeas"
                  :key="idea.id"
                  class="dark:border-muted-700 dark:bg-muted-900/30 grid grid-cols-7 items-start gap-2 rounded-xl border border-gray-100 bg-white p-3 transition-all duration-200 hover:shadow-md"
                >
                  <!-- Idea Title -->
                  <div class="col-span-2 min-w-0">
                    <div class="text-muted-800 mb-1 text-sm font-semibold dark:text-white break-words">
                      {{ idea.title }}
                    </div>
                    <div class="text-muted-500 line-clamp-2 text-xs break-words">
                      {{ idea.description }}
                    </div>
                  </div>

                  <!-- Score Inputs -->
                  <div
                    v-for="criteria in evaluationCriteria"
                    :key="criteria.id"
                    class="flex items-center justify-center"
                  >
                    <BaseInput
                      :model-value="idea.scores[criteria.id] || 0"
                      type="number"
                      min="0"
                      max="10"
                      shape="curved"
                      :classes="{ input: 'h-10 w-14 text-center text-sm' }"
                      @update:model-value="(val) => updateScore(idea.id, criteria.id, Number(val))"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Generated Matrix Description -->
        <div
          v-if="matrixDescription"
          class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8"
        >
          <div class="mb-6 flex items-center gap-3">
            <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
              <Icon name="ph:table" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-900 dark:text-white">
                ماتریس ارزیابی تولید شده
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mt-1">تحلیل جامع و توصیه‌های عملی</BaseParagraph>
            </div>
          </div>

          <div class="dark:bg-muted-900/30 w-full rounded-xl border border-gray-100 bg-gray-50 p-6">
            <AddonMarkdownRemark :source="matrixDescription" fullwidth />
          </div>
        </div>

        <!-- Ranked Results -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-8"
        >
          <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1">
              <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                نتایج رتبه‌بندی شده
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">ایده‌ها بر اساس امتیاز کل مرتب شده‌اند</BaseParagraph>
            </div>
            <BaseButton
              color="success"
              shape="curved"
              size="sm"
              @click="showRankedResults = !showRankedResults"
              class="flex-shrink-0 self-start"
            >
              <Icon :name="showRankedResults ? 'ph:eye-slash' : 'ph:eye'" class="ml-2 size-4" />
              <span class="whitespace-nowrap">{{ showRankedResults ? 'مخفی کردن' : 'نمایش نتایج' }}</span>
            </BaseButton>
          </div>

          <div v-if="showRankedResults" class="space-y-4">
            <div
              v-for="(idea, index) in sortedIdeas"
              :key="idea.id"
              class="dark:border-muted-700 dark:bg-muted-900/30 group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg"
            >
              <!-- Rank Badge -->
              <div class="absolute left-2 bottom-2 sm:left-4 sm:bottom-4">
                <div
                  :class="[
                    'flex size-8 sm:size-10 items-center justify-center rounded-full text-sm sm:text-base font-bold text-white shadow-lg',
                    index === 0
                      ? 'bg-yellow-500'
                      : index === 1
                      ? 'bg-gray-400'
                      : index === 2
                      ? 'bg-orange-600'
                      : 'bg-muted-500',
                  ]"
                >
                  {{ index + 1 }}
                </div>
              </div>

              <div class="mr-10 sm:mr-16">
                <div class="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div class="flex-1 min-w-0">
                    <BaseHeading
                      as="h3"
                      size="lg"
                      weight="semibold"
                      class="mb-2 text-gray-900 dark:text-white break-words"
                    >
                      {{ idea.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 break-words">
                      {{ idea.description }}
                    </BaseParagraph>
                  </div>
                  <div class="flex-shrink-0 text-center sm:text-left sm:mr-4">
                    <div class="text-muted-500 mb-1 text-xs">امتیاز کل</div>
                    <div
                      :class="[
                        'text-2xl sm:text-3xl font-bold',
                        idea.totalScore >= 40
                          ? 'text-success-500'
                          : idea.totalScore >= 25
                          ? 'text-warning-500'
                          : 'text-muted-400',
                      ]"
                    >
                      {{ idea.totalScore }}
                    </div>
                    <div class="text-muted-500 text-xs">از ۵۰</div>
                  </div>
                </div>

                <!-- Score Breakdown -->
                <div class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="criteria in evaluationCriteria"
                    :key="criteria.id"
                    :color="getScoreColor(idea.scores[criteria.id] || 0)"
                    size="sm"
                    shape="full"
                  >
                    <span class="whitespace-nowrap">{{ criteria.title }}: {{ idea.scores[criteria.id] || 0 }}</span>
                  </BaseTag>
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
            <BaseParagraph size="sm" class="text-muted-500">ابزارهای دیگر برای ساختاردهی بهتر ایده‌ها</BaseParagraph>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <div
              v-for="tool in tools"
              :key="tool.title"
              class="dark:border-muted-700 dark:bg-muted-900/30 group overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div
                :class="[
                  'mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                  `bg-${tool.color}-500/10`,
                ]"
              >
                <Icon :name="tool.icon" :class="[`text-${tool.color}-500`, 'size-6']" />
              </div>
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                {{ tool.title }}
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                {{ tool.description }}
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Tips Box -->
        <div class="bg-success-500/10 dark:bg-success-500/20 border-success-500/20 mb-8 rounded-2xl border-2 p-6">
          <div class="flex items-start gap-4">
            <div class="bg-success-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon name="ph:lightbulb-fill" class="size-6 text-white" />
            </div>
            <div class="flex-1">
              <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
                نکات مهم برای این مرحله
              </BaseHeading>
              <ul class="text-muted-700 dark:text-muted-200 space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>هنگام امتیازدهی، واقع‌بین باشید اما خوش‌بین. محدودیت‌ها را در نظر بگیرید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>ایده‌های با امتیاز پایین را حذف نکنید - ممکن است در آینده مفید باشند.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>می‌توانید چند ایده را ترکیب کنید تا ایده‌ای قوی‌تر ایجاد کنید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-success-500 mt-1 size-4 shrink-0" />
                  <span>از دیگران نظر بخواهید - دیدگاه خارجی می‌تواند ارزیابی را بهبود دهد.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between">
          <BaseButton color="muted" shape="curved" size="lg" @click="goBack">
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            مرحله قبل
          </BaseButton>
          <BaseButton
            color="warning"
            shape="curved"
            size="lg"
            class="shadow-warning-500/30 shadow-lg"
            @click="saveAndContinue"
          >
            ذخیره و ادامه
            <Icon name="ph:arrow-left" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
