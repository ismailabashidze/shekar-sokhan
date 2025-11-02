<script setup lang="ts">
  definePageMeta({
    title: 'Six Thinking Hats - نگاه‌های چندبعدی',
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

  const thinkingHats = [
    {
      color: 'white',
      title: 'کلاه سفید',
      subtitle: 'واقعیت‌ها و داده‌ها',
      icon: 'ph:clipboard-text',
      description: 'تمرکز بر واقعیت‌ها، آمار، داده‌ها و اطلاعات عینی. بدون احساسات و نظرات شخصی.',
      questions: [
        'چه اطلاعاتی در دسترس داریم؟',
        'چه داده‌هایی نیاز داریم؟',
        'حقایق چه هستند؟',
        'چه چیزهایی را می‌توانیم اثبات کنیم؟',
      ],
      focus: 'عینی و بی‌طرف',
      examples: [
        'تحلیل آمار بازاریابی',
        'بررسی تحقیقات قبلی',
        'جمع‌آوری داده‌های واقعی',
      ],
    },
    {
      color: 'red',
      title: 'کلاه قرمز',
      subtitle: 'احساسات و شهود',
      icon: 'ph:heart',
      description: 'بیان احساسات، شهود و واکنش‌های هیجانی بدون نیاز به توجیه و دلیل.',
      questions: [
        'چه احساسی دارم؟',
        'شهود من چه می‌گوید؟',
        'واکنش هیجانی من چیست؟',
        'چه چیزی ناخوشایند است؟',
      ],
      focus: 'احساسی و شهودی',
      examples: [
        'این ایده به من حس خوبی می‌دهد',
        'نمی‌توانم با این روش کنار بیایم',
        'انگیزه‌ای برای این کار ندارم',
      ],
    },
    {
      color: 'black',
      title: 'کلاه سیاه',
      subtitle: 'نقاط ضعف و خطرات',
      icon: 'ph:warning',
      description: 'بررسی نقاط ضعف، خطرات، مشکلات و چالش‌های احتمالی. تفکر نقادانه و محتاطانه.',
      questions: [
        'چه مشکلاتی ممکن است پیش بیاید؟',
        'خطرات کدامند؟',
        'چرا این روش جواب نمی‌دهد؟',
        'محدودیت‌ها چیست؟',
      ],
      focus: 'نقادانه و محتاط',
      examples: [
        'بودجه کافی نداریم',
        'زمان لازم برای این کار زیاد است',
        'مقاومت تیم در برابر تغییر',
      ],
    },
    {
      color: 'yellow',
      title: 'کلاه زرد',
      subtitle: 'نقاط قوت و فواید',
      icon: 'ph:sun',
      description: 'تمرکز بر نقاط قوت، فواید، فرصت‌ها و جنبه‌های مثبت. تفکر خوش‌بینانه و سازنده.',
      questions: [
        'چه مزایایی دارد؟',
        'چطور این کار می‌کند؟',
        'فرصت‌ها کدامند؟',
        'ارزش آن چیست؟',
      ],
      focus: 'مثبت و خوش‌بین',
      examples: [
        'این روش هزینه را کاهش می‌دهد',
        'رضایت مشتریان افزایش می‌یابد',
        'فرصت رشد سریع وجود دارد',
      ],
    },
    {
      color: 'green',
      title: 'کلاه سبز',
      subtitle: 'خلاقیت و ایده‌های جدید',
      icon: 'ph:leaf',
      description: 'تولید ایده‌های جدید، راه‌حل‌های خلاقانه و رویکردهای نوآورانه بدون محدودیت.',
      questions: [
        'راه‌های جدید چیست؟',
        'چطور می‌توانیم متفاوت فکر کنیم؟',
        'چه ایده‌های دیگری وجود دارد؟',
        'راه‌حل‌های جایگزین کدامند؟',
      ],
      focus: 'خلاق و نوآور',
      examples: [
        'استفاده از تکنولوژی جدید',
        'ایجاد مدل کسب‌وکار جدید',
        'ترکیب روش‌های مختلف',
      ],
    },
    {
      color: 'blue',
      title: 'کلاه آبی',
      subtitle: 'مدیریت فرایند و نتیجه‌گیری',
      icon: 'ph:gear',
      description: 'مدیریت فرایند فکری، کنترل زمان، خلاصه‌سازی و رسیدن به نتیجه‌گیری نهایی.',
      questions: [
        'کجا هستیم؟',
        'چه کاری باید انجام شود؟',
        'چه مراحل بعدی است؟',
        'چطور به نتیجه برسیم؟',
      ],
      focus: 'مدیریتی و فرایندی',
      examples: [
        'تعیین议程 جلسه',
        'خلاصه دیدگاه‌ها',
        'تعیین اقدامات بعدی',
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
      
      let basePrompt = `با استفاده از تکنیک Six Thinking Hats، ۶ ایده از دیدگاه‌های مختلف برای چالش تحقیقاتی زیر تولید کنید:
${context}`;

      // Add selected idea context if available
      if (selectedIdea.value) {
        basePrompt += `

ایده منتخب برای گسترش: ${selectedIdea.value.content}

لطفاً ایده‌های جدیدی تولید کنید که بر اساس ایده منتخب بالا و با استفاده از تکنیک Six Thinking Hats از دیدگاه‌های مختلف بررسی شده‌اند.`;
      }

      const prompt = `${basePrompt}

شش کلاه فکری:
- کلاه سفید: واقعیت‌ها و داده‌ها
- کلاه قرمز: احساسات و شهود
- کلاه سیاه: نقاط ضعف و خطرات
- کلاه زرد: نقاط قوت و فواید
- کلاه سبز: خلاقیت و ایده‌های جدید
- کلاه آبی: مدیریت فرایند و نتیجه‌گیری

${guidance ? `راهنمایی کاربر: ${guidance}` : ''}

برای هر کلاه، یک ایده یا دیدگاه ارائه دهید که نشان‌دهنده آن نگرش خاص باشد.
پاسخ را به صورت لیستی با مشخص کردن کلاه هر ایده برگردانید:`;

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

      const generatedIdeas = parseGeneratedIdeas(generatedContent);
      
      generatedIdeas.forEach((ideaContent, index) => {
        ideas.value.push({
          id: `ai-${Date.now()}-${index}`,
          content: ideaContent,
          technique: 'six-hats',
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
      ideas.push(...paragraphs.slice(0, 6));
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
    localStorage.setItem('hampazhooh-six-hats-ideas', JSON.stringify(ideas.value));
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
              <div class="bg-info-500 shadow-info-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:user-switch" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-info-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  تکنیک خلاقیت
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  Six Thinking Hats - نگاه‌های چندبعدی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  ۶ دیدگاه مختلف برای بررسی مسائل
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
          class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border-2 border-info-200 bg-info-50 dark:bg-info-900/20 p-6"
        >
          <div class="mb-4 flex items-start gap-3">
            <div class="bg-info-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
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
          <div class="bg-info-100 dark:bg-info-900/30 rounded-lg p-4">
            <div class="text-info-700 dark:text-info-300 text-sm">
              با استفاده از تکنیک Six Thinking Hats، می‌توانید این ایده را از ۶ دیدگاه مختلف بررسی و ایده‌های جدیدی بر اساس آن تولید کنید.
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
              تکنیک Six Thinking Hats چیست؟
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4 leading-relaxed">
              این تکنیک شما را تشویق می‌کند که مسئله را از ۶ دیدگاه مختلف بررسی کنید. هر کلاه یک نگرش خاص را نمایندگی می‌کند
              و با پوشیدن کلاه‌های مختلف، می‌توانید همه جنبه‌های یک مسئله را به طور جامع بررسی کنید.
            </BaseParagraph>
          </div>

          <!-- Process Overview -->
          <div class="bg-info-500/10 dark:bg-info-500/20 border-info-500/20 rounded-xl border-2 p-6">
            <div class="flex items-start gap-4">
              <div class="bg-info-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon name="ph:shuffle" class="size-5 text-white" />
              </div>
              <div>
                <div class="text-muted-800 text-sm font-semibold dark:text-white mb-2">
                  فرایند کار
                </div>
                <div class="text-muted-700 dark:text-muted-200 text-sm">
                  شما می‌توانید کلاه‌ها را به ترتیب مختلف بپوشید یا از یک کلاه خاص برای تمام شرکت‌کنندگان استفاده کنید.
                  هدف، بررسی همه‌جانبه مسئله و جلوگیری از تکرار یک نوع تفکر است.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hats Grid -->
        <div class="grid gap-6 lg:grid-cols-3 mb-8">
          <div
            v-for="hat in thinkingHats"
            :key="hat.color"
            class="dark:bg-muted-800 dark:border-muted-700 group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div class="mb-4 flex items-start gap-4">
              <div
                :class="[
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  `bg-${hat.color}-500`,
                ]"
              >
                <Icon :name="hat.icon" class="size-6 text-white" />
              </div>
              <div class="flex-1">
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-1 text-gray-900 dark:text-white"
                >
                  {{ hat.title }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 font-medium">
                  {{ hat.subtitle }}
                </BaseParagraph>
              </div>
            </div>

            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-4">
              {{ hat.description }}
            </BaseParagraph>

            <!-- Focus Area -->
            <div class="mb-4">
              <BaseTag
                :color="hat.color"
                size="sm"
                shape="full"
              >
                تمرکز: {{ hat.focus }}
              </BaseTag>
            </div>

            <!-- Questions -->
            <div class="dark:border-muted-700 dark:bg-muted-900/30 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div class="text-muted-700 dark:text-muted-200 mb-3 text-sm font-semibold">
                سوالات کلیدی:
              </div>
              <ul class="space-y-2">
                <li
                  v-for="question in hat.questions"
                  :key="question"
                  class="text-muted-600 dark:text-muted-400 text-sm flex items-start gap-2"
                >
                  <Icon :name="`ph:arrow-right`" :class="`text-${hat.color}-500 mt-0.5 size-3.5 shrink-0`" />
                  {{ question }}
                </li>
              </ul>
            </div>

            <!-- Examples -->
            <details class="mt-4">
              <summary class="text-muted-600 dark:text-muted-300 text-sm cursor-pointer hover:text-info-500 transition-colors">
                <Icon name="ph:lightbulb" class="ml-1 size-4" />
                مثال‌ها
              </summary>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="example in hat.examples"
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
              {{ ideas.length }} ایده با تکنیک Six Thinking Hats تولید شده
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
                  <BaseTag color="info" size="sm" shape="full">
                    Six Hats
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
            color="info"
            shape="curved"
            size="lg"
            :disabled="aiGenerating"
            @click="openAiGuidance"
            class="shadow-info-500/30 shadow-lg"
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
          <div class="bg-info-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:sparkle" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading
              as="h2"
              size="xl"
              weight="bold"
            >
              تولید ایده با Six Thinking Hats
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              استفاده از هوش مصنوعی برای تولید ایده‌های چندبعدی
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
            placeholder="مثلاً: بیشتر روی جنبه استراتژیک تمرکز کن، یا دیدگاه‌های عملیاتی را بررسی کن..."
            rows="4"
            shape="curved"
          />
          <div class="text-muted-500 mt-2 text-xs">
            این راهنمایی به هوش مصنوعی کمک می‌کند تا دیدگاه‌های متناسب‌تری تولید کند.
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
            color="info"
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