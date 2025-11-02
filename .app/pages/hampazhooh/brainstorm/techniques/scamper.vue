<script setup lang="ts">
  definePageMeta({
    title: 'SCAMPER - بازتعریف خلاقانه مسائل',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();
  const { streamChat, processing } = useOpenRouter();
  const { extractStage1Data, getContextForAI } = useStage1Data();

  const stage1Data = ref(extractStage1Data());
  const selectedIdea = ref<any>(null);
  const ideas = ref([]);
  const aiGenerating = ref(false);
  const userGuidance = ref('');
  const showAiGuidanceModal = ref(false);

  const scamperSteps = [
    {
      letter: 'S',
      title: 'Substitute',
      subtitle: 'جایگزینی',
      description: 'چه چیزی را می‌توان جایگزین کرد؟ مواد، افراد، فرایندها، ابزارها را با گزینه‌های جدید عوض کنید.',
      examples: [
        'به جای کاغذ، از دیجیتال استفاده کنید',
        'جایگزین کردن نیروی انسانی با اتوماسیون',
        'استفاده از مواد جایگزین در تولید',
      ],
      questions: [
        'چه مواد یا کامپوننت‌هایی را می‌توان جایگزین کرد؟',
        'چه فرایندهایی را می‌توان با روش‌های نوین عوض کرد؟',
        'چه افرادی را می‌توان در این نقش قرار داد؟',
      ],
    },
    {
      letter: 'C',
      title: 'Combine',
      subtitle: 'ترکیب',
      description: 'چه چیزهایی را می‌توان ترکیب کرد؟ مفاهیم، ایده‌ها، محصولات را با هم ادغام کنید.',
      examples: [
        'ترکیب گوشی هوشمند با دوربین حرفه‌ای',
        'ادغام شبکه‌های اجتماعی با ابزارهای آموزشی',
        'ترکیب فروشگاه آنلاین با تجربه مجازی',
      ],
      questions: [
        'چه ایده‌ها را می‌توان با هم ترکیب کرد؟',
        'چگونه می‌توان محصولات مختلف را ادغام کرد؟',
        'چه ترکیبات جدیدی ممکن است کارساز باشد؟',
      ],
    },
    {
      letter: 'A',
      title: 'Adapt',
      subtitle: 'تطبیق',
      description: 'چه چیزی را می‌توان تطبیق داد؟ از راه‌حل‌های موجود در حوزه‌های دیگر الگو بگیرید.',
      examples: [
        'تطبیق مدل کسب‌وکار استارتاپ‌ها در سازمان‌های بزرگ',
        'استفاده از الگوریتم‌های طبیعت در طراحی نرم‌افزار',
        'اقتباس از بازی‌های ویدیویی در آموزش',
      ],
      questions: [
        'چه چیزی را می‌توان از حوزه‌های دیگر یاد گرفت؟',
        'چه الگوهایی در طبیعت وجود دارد که قابل تطبیق باشند؟',
        'چگونه می‌توان از راه‌حل‌های موفق elsewhere استفاده کرد؟',
      ],
    },
    {
      letter: 'M',
      title: 'Modify',
      subtitle: 'تغییر',
      description: 'چه چیزی را می‌توان تغییر داد؟ اندازه، شکل، ویژگی‌ها، فرایند را بهبود دهید.',
      examples: [
        'تغییر اندازه محصول برای بازارهای مختلف',
        'اصلاح فرایند برای افزایش کارایی',
        'تغییر ویژگی‌های کلیدی برای جذب مشتریان جدید',
      ],
      questions: [
        'چه ویژگی‌هایی را می‌توان تغییر داد؟',
        'چگونه می‌توان شکل یا اندازه را اصلاح کرد؟',
        'چه تغییراتی ارزش افزوده ایجاد می‌کنند؟',
      ],
    },
    {
      letter: 'P',
      title: 'Put to another use',
      subtitle: 'استفاده دیگر',
      description: 'از آن چگونه می‌توان استفاده دیگری کرد؟ کاربردهای جدید و غیرمنتظره پیدا کنید.',
      examples: [
        'استفاده از تلفن‌های قدیمی به عنوان دوربین مداربسته',
        'تبدیل فضاهای خالی به مراکز آموزشی',
        'استفاده از ضایعات در تولید محصولات جدید',
      ],
      questions: [
        'چه کاربردهای دیگری برای این محصول/خدمت وجود دارد؟',
        'چگونه می‌توان آن را برای مخاطبان جدید استفاده کرد؟',
        'چه استفاه‌های غیرمنتظره‌ای ممکن است؟',
      ],
    },
    {
      letter: 'E',
      title: 'Eliminate',
      subtitle: 'حذف',
      description: 'چه چیزی را می‌توان حذف کرد؟ موارد غیرضروری، مراحل اضافی، هزینه‌ها را حذف کنید.',
      examples: [
        'حذف واسطه‌ها در فروش مستقیم',
        'حذف فرایندهای بوروکراتیک',
        'حذف ویژگی‌های کم‌استفاده برای سادگی',
      ],
      questions: [
        'چه چیزی را می‌توان بدون مشکل حذف کرد؟',
        'کدام مراحل فرایند غیرضروری هستند؟',
        'چه هزینه‌هایی را می‌توان کاهش داد؟',
      ],
    },
    {
      letter: 'R',
      title: 'Reverse',
      subtitle: 'معکوس',
      description: 'چه چیزی را می‌توان معکوس کرد؟ ترتیب، جهت، رویکرد را برعکس کنید.',
      examples: [
        'فروش قبل از تولید (Pre-order)',
        'آموزش از دانشجو به استاد',
        'کار در خانه به جای دفتر',
      ],
      questions: [
        'چگونه می‌توان ترتیب را معکوس کرد؟',
        'چه جهتی را می‌توان تغییر داد؟',
        'چه اتفاقی می‌افتد اگر همه چیز برعکس شود؟',
      ],
    },
  ];

  const generateIdeasWithAI = async (guidance?: string) => {
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

    aiGenerating.value = true;

    try {
      const context = getContextForAI(stage1Data.value);
      
      let basePrompt = `با استفاده از تکنیک SCAMPER، حداقل ۷ ایده خلاقانه برای چالش تحقیقاتی زیر تولید کنید:
${context}`;

      // Add selected idea context if available
      if (selectedIdea.value) {
        basePrompt += `

ایده منتخب برای گسترش: ${selectedIdea.value.content}

لطفاً ایده‌های جدیدی تولید کنید که بر اساس ایده منتخب بالا و با استفاده از تکنیک SCAMPER توسعه داده شده‌اند.`;
      }

      const prompt = `${basePrompt}

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

پاسخ را به صورت لیستی شماره‌گذاری شده برگردانید:`;

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
      const generatedIdeas = parseGeneratedIdeas(generatedContent);
      
      generatedIdeas.forEach((ideaContent, index) => {
        ideas.value.push({
          id: `ai-${Date.now()}-${index}`,
          content: ideaContent,
          technique: 'scamper',
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
      showAiGuidanceModal.value = false;
      userGuidance.value = '';
    }
  };

  const parseGeneratedIdeas = (content: string): string[] => {
    const ideas: string[] = [];
    
    const items = content.split(/\n(?=\d+\.|\n(?=-))/);
    
    for (const item of items) {
      const trimmedItem = item.trim();
      if (trimmedItem && (trimmedItem.match(/^\d+\./) || trimmedItem.startsWith('-'))) {
        const ideaText = trimmedItem.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim();
        if (ideaText.length > 10) {
          ideas.push(ideaText);
        }
      }
    }
    
    if (ideas.length === 0) {
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
      ideas.push(...paragraphs.slice(0, 7));
    }
    
    return ideas.slice(0, 10);
  };

  const openAiGuidance = () => {
    showAiGuidanceModal.value = true;
  };

  const getTechniqueName = (id: string) => {
    if (id === 'stage1') return 'مرحله ۱';
    return id;
  };

  // Load selected idea and technique from localStorage
  onMounted(() => {
    const savedStage1Data = localStorage.getItem('hampazhooh-stage1-data');
    if (savedStage1Data) {
      try {
        stage1Data.value = JSON.parse(savedStage1Data);
      } catch (e) {
        console.warn('Could not parse saved stage1 data');
      }
    }

    const savedSelectedIdea = localStorage.getItem('hampazhooh-selected-idea');
    if (savedSelectedIdea) {
      try {
        selectedIdea.value = JSON.parse(savedSelectedIdea);
      } catch (e) {
        console.warn('Could not parse saved selected idea');
      }
    }

    // Clear the selected idea from localStorage after loading
    localStorage.removeItem('hampazhooh-selected-idea');
    localStorage.removeItem('hampazhooh-selected-technique');
  });

  const goBack = () => {
    router.push('/hampazhooh/brainstorm/stage2');
  };

  const saveAndContinue = () => {
    // Save ideas to localStorage for stage2
    localStorage.setItem('hampazhooh-scamper-ideas', JSON.stringify(ideas.value));
    router.push('/hampazhooh/brainstorm/stage2');
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
              <div class="bg-primary-500 shadow-primary-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:magic-wand" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-primary-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  تکنیک خلاقیت
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  SCAMPER - بازتعریف خلاقانه مسائل
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  ۷ رویکرد برای تولید ایده‌های نوآورانه
                </BaseParagraph>
              </div>
            </div>
          </div>
          <BaseButton color="muted" shape="curved" @click="goBack">
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            بازگشت
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- Selected Idea (if any) -->
        <div
          v-if="selectedIdea"
          class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border-2 border-primary-200 bg-primary-50 dark:bg-primary-900/20 p-6"
        >
          <div class="mb-4 flex items-start gap-3">
            <div class="bg-primary-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Icon name="ph:lightbulb" class="size-5 text-white" />
            </div>
            <div class="flex-1">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                ایده منتخب برای گسترش
              </BaseHeading>
              <div class="text-muted-700 dark:text-muted-200 bg-white dark:bg-muted-800 rounded-lg p-3 text-sm">
                {{ selectedIdea.content }}
              </div>
              <div class="text-muted-500 mt-2 text-xs">
                از {{ getTechniqueName(selectedIdea.technique) }}
              </div>
            </div>
          </div>
          <div class="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-4">
            <div class="text-primary-700 dark:text-primary-300 text-sm">
              با استفاده از تکنیک SCAMPER، می‌توانید این ایده را از ۷ زاویه مختلف بررسی و ایده‌های جدیدی بر اساس آن تولید کنید.
            </div>
          </div>
        </div>

        <!-- Introduction -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-3 text-gray-900 dark:text-white"
            >
              تکنیک SCAMPER چیست؟
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4 leading-relaxed">
              SCAMPER یک تکنیک خلاقیت قدرتمند است که به شما کمک می‌کند مسائل و محصولات را از ۷ زاویه مختلف بررسی کنید.
              با استفاده از این تکنیک، می‌توانید ایده‌های جدیدی تولید کرده و راه‌حل‌های نوآورانه‌ای برای چالش‌های خود پیدا کنید.
            </BaseParagraph>
          </div>

          <!-- Quick Start -->
          <div class="bg-primary-500/10 dark:bg-primary-500/20 border-primary-500/20 rounded-xl border-2 p-6">
            <div class="flex items-start gap-4">
              <div class="bg-primary-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon name="ph:rocket" class="size-5 text-white" />
              </div>
              <div>
                <div class="text-muted-800 text-sm font-semibold dark:text-white mb-2">
                  شروع سریع
                </div>
                <div class="text-muted-700 dark:text-muted-200 text-sm">
                  هر حرف از SCAMPER یک سوال کلیدی می‌پرسد که به شما کمک می‌کند ذهنیت خود را تغییر دهید.
                  با پاسخ به این سوالات، می‌توانید ایده‌های جدیدی تولید کنید.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SCAMPER Steps Grid -->
        <div class="grid gap-6 lg:grid-cols-2 mb-8">
          <div
            v-for="(step, index) in scamperSteps"
            :key="step.letter"
            class="dark:bg-muted-800 dark:border-muted-700 group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div class="mb-4 flex items-start gap-4">
              <div class="bg-primary-500 text-white flex size-12 shrink-0 items-center justify-center rounded-xl font-bold text-lg">
                {{ step.letter }}
              </div>
              <div class="flex-1">
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-1 text-gray-900 dark:text-white"
                >
                  {{ step.title }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-primary-500 font-medium">
                  {{ step.subtitle }}
                </BaseParagraph>
              </div>
            </div>

            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-4">
              {{ step.description }}
            </BaseParagraph>

            <!-- Questions -->
            <div class="dark:border-muted-700 dark:bg-muted-900/30 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div class="text-muted-700 dark:text-muted-200 mb-3 text-sm font-semibold">
                سوالات کلیدی:
              </div>
              <ul class="space-y-2">
                <li
                  v-for="question in step.questions"
                  :key="question"
                  class="text-muted-600 dark:text-muted-400 text-sm flex items-start gap-2"
                >
                  <Icon name="ph:arrow-right" class="text-primary-500 mt-0.5 size-3.5 shrink-0" />
                  {{ question }}
                </li>
              </ul>
            </div>

            <!-- Examples (expandable) -->
            <details class="mt-4">
              <summary class="text-muted-600 dark:text-muted-300 text-sm cursor-pointer hover:text-primary-500 transition-colors">
                <Icon name="ph:lightbulb" class="ml-1 size-4" />
                مثال‌ها
              </summary>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="example in step.examples"
                  :key="example"
                  class="text-muted-600 dark:text-muted-400 text-sm flex items-start gap-2"
                >
                  <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-3.5 shrink-0" />
                  {{ example }}
                </li>
              </ul>
            </details>
          </div>
        </div>

        <!-- Generated Ideas -->
        <div
          v-if="ideas.length > 0"
          class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8"
        >
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="xl"
              weight="semibold"
              class="text-gray-900 dark:text-white"
            >
              ایده‌های تولید شده
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 mt-1">
              {{ ideas.length }} ایده با تکنیک SCAMPER تولید شده
            </BaseParagraph>
          </div>

          <div class="space-y-3">
            <div
              v-for="idea in ideas"
              :key="idea.id"
              class="dark:border-muted-700 dark:bg-muted-900/30 group relative rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:shadow-md"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <div class="flex items-center gap-2">
                  <BaseTag color="primary" size="sm" shape="full">
                    SCAMPER
                  </BaseTag>
                  <BaseTag v-if="idea.aiGenerated" color="info" size="sm" shape="full">
                    <Icon name="ph:robot" class="ml-1 size-3" />
                    هوش مصنوعی
                  </BaseTag>
                </div>
              </div>
              <div class="text-muted-700 dark:text-muted-200 text-sm leading-relaxed">
                {{ idea.content }}
              </div>
              <div class="text-muted-500 mt-3 flex items-center gap-2 text-xs">
                <Icon name="ph:clock" class="size-3.5" />
                {{ new Date(idea.timestamp).toLocaleString('fa-IR') }}
              </div>
            </div>
          </div>
        </div>

        <!-- AI Generation Section -->
        <div class="mt-8 text-center">
          <BaseButton
            color="primary"
            shape="curved"
            size="lg"
            :disabled="aiGenerating"
            @click="openAiGuidance"
            class="shadow-primary-500/30 shadow-lg"
          >
            <Icon
              :name="aiGenerating ? 'svg-spinners:90-ring-with-bg' : 'ph:sparkle'"
              class="ml-2 size-5"
            />
            {{ aiGenerating ? 'در حال تولید...' : 'تولید ایده با هوش مصنوعی' }}
          </BaseButton>
        </div>

        <!-- Navigation -->
        <div class="mt-8 flex items-center justify-between">
          <BaseButton
            color="muted"
            shape="curved"
            size="lg"
            @click="goBack"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            بازگشت به مرحله ۲
          </BaseButton>
          <BaseButton
            v-if="ideas.length > 0"
            color="success"
            shape="curved"
            size="lg"
            @click="saveAndContinue"
            class="shadow-success-500/30 shadow-lg"
          >
            ذخیره و ادامه
            <Icon name="ph:arrow-left" class="mr-2 size-5" />
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- AI Guidance Modal -->
    <TairoModal
      :open="showAiGuidanceModal"
      size="xl"
      @close="showAiGuidanceModal = false"
    >
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-primary-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:sparkle" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading
              as="h2"
              size="xl"
              weight="bold"
            >
              تولید ایده با SCAMPER
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              استفاده از هوش مصنوعی برای تولید ایده‌های خلاقانه
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6">
        <!-- Context Display -->
        <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
          <BaseHeading
            as="h4"
            size="md"
            weight="semibold"
            class="mb-3 text-gray-900 dark:text-white"
          >
            زمینه پژوهش
          </BaseHeading>
          <div class="space-y-2 text-sm">
            <div class="text-muted-600 dark:text-muted-400">
              <strong>چالش اصلی:</strong> {{ stage1Data.value.mainChallenge || 'مشخص نشده' }}
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
            این راهنمایی به هوش مصنوعی کمک می‌کند تا ایده‌های مرتبط‌تری تولید کند.
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between">
          <BaseButton
            color="muted"
            shape="curved"
            @click="showAiGuidanceModal = false"
          >
            انصراف
          </BaseButton>
          <BaseButton
            color="primary"
            shape="curved"
            size="lg"
            :disabled="aiGenerating"
            @click="generateIdeasWithAI(userGuidance)"
          >
            <Icon
              v-if="!aiGenerating"
              name="ph:sparkle"
              class="ml-2 size-5"
            />
            <Icon
              v-else
              name="svg-spinners:90-ring-with-bg"
              class="ml-2 size-5"
            />
            {{ aiGenerating ? 'در حال تولید...' : 'تولید ایده‌ها' }}
          </BaseButton>
        </div>
      </div>
    </TairoModal>
  </div>
</template>