<script setup lang="ts">
  definePageMeta({
    title: 'Analogical Thinking - استعاره‌های مفهومی',
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

  const analogicalDomains = [
    {
      domain: 'طبیعت',
      icon: 'ph:leaf',
      description: 'الگوبرداری از فرایندهای طبیعی مانند تکامل، اکوسیستم‌ها، و ساختارهای بیولوژیکی',
      examples: [
        'شبکه‌های عصبی الهام گرفته از مغز انسان',
        'الگوریتم‌های تکاملی الهام شده از انتخاب طبیعی',
        'طراحی معماری الهام گرفته از لانه زنبورها',
      ],
      concepts: [
        'تکامل و انطباق',
        'اکوسیستم و همزیستی',
        'چرخه‌های طبیعی',
        'ساختارهای بهینه',
      ],
    },
    {
      domain: 'هنر',
      icon: 'ph:palette',
      description: 'استفاده از فرایندهای خلاقانه هنری، ترکیب رنگ‌ها، و تکنیک‌های هنری',
      examples: [
        'طراحی رابط کاربری الهام شده از نقاشی کوبیسم',
        'معماری نرم‌افزار الهام گرفته از موسیقی جاز',
        'فرایندهای تیمی الهام گرفته از تئاتر ایمپرویزاسیون',
      ],
      concepts: [
        'ترکیب و هارمونی',
        'کنتراست و تضاد',
        'تکرار و الگو',
        'انتقال احساس',
      ],
    },
    {
      domain: 'ورزش',
      icon: 'ph:trophy',
      description: 'الگوبرداری از استراتژی‌های ورزشی، تمرین، و فرایندهای بهبود عملکرد',
      examples: [
        'مدیریت پروژه الهام گرفته از استراتژی فوتبال',
        'توسعه تیم الهام گرفته از تمرینات بسکتبال',
        'بهینه‌سازی عملکرد الهام از ورزشکاران المپیک',
      ],
      concepts: [
        'استراتژی و تاکتیک',
        'تمرین و تکرار',
        'کار تیمی و هماهنگی',
        'رقابت و بهبود',
      ],
    },
    {
      domain: 'فناوری',
      icon: 'ph:cpu',
      description: 'انتقال الگوها از حوزه‌های مختلف فناوری مانند اینترنت، هوش مصنوعی، و ارتباطات',
      examples: [
        'مدل کسب‌وکار الهام گرفته از اپ استورها',
        'آموزش آنلاین الهام گرفته از بازی‌های ویدیویی',
        'مدیریت داده‌ها الهام گرفته از شبکه‌های اجتماعی',
      ],
      concepts: [
        'شبکه و اتصال',
        'مقیاس‌پذیری',
        'رابط کاربری',
        'پردازش داده',
      ],
    },
    {
      domain: 'آشپزی',
      icon: 'ph:chef-hat',
      description: 'استفاده از فرایندهای آشپزی، ترکیب مواد اولیه، و تکنیک‌های نوآوری در غذا',
      examples: [
        'ترکیب تیمی الهام گرفته از ترکیب طعم‌ها',
        'فرایند نوآوری الهام از تکنیک‌های آشپزی مدرن',
        'مدیریت کیفیت الهام گرفته از کنترل کیفیت غذا',
      ],
      concepts: [
        'ترکیب و هماهنگی',
        'فرایند و تکنیک',
        'تجربه مشتری',
        'نوآوری در ارائه',
      ],
    },
    {
      domain: 'موسیقی',
      icon: 'ph:music-notes',
      description: 'الگوبرداری از ساختار موسیقی، هارمونی، ریتم، و فرایند آهنگسازی',
      examples: [
        'طراحی تجربه کاربری الهام گرفته از ساختار آهنگ',
        'روانشناسی مشتری الهام از تئوری موسیقی',
        'برندینگ الهام گرفته از سبک‌های موسیقی',
      ],
      concepts: [
        'ریتم و الگو',
        'هارمونی و هماهنگی',
        'ساختار و فرم',
        'احساس و انتقال',
      ],
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'شناسایی مسئله',
      description: 'مسئله اصلی خود را به وضوح تعریف کنید',
    },
    {
      step: 2,
      title: 'انتخاب حوزه استعاری',
      description: 'یک حوزه کاملاً متفاوت را برای استعاره انتخاب کنید',
    },
    {
      step: 3,
      title: 'پیدا کردن شباهت‌ها',
      description: 'مشابهت‌های ساختاری بین مسئله و حوزه استعاری را شناسایی کنید',
    },
    {
      step: 4,
      title: 'بررسی راه‌حل‌ها',
      description: 'راه‌حل‌های موجود در حوزه استعاری را تحلیل کنید',
    },
    {
      step: 5,
      title: 'تطبیق و انتقال',
      description: 'راه‌حل‌ها را به مسئله اصلی خود تطبیق دهید',
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

      let basePrompt = `با استفاده از تفکر قیاسی (Analogical Thinking)، حداقل ۴ ایده خلاقانه برای چالش تحقیقاتی زیر تولید کنید:
${context}`;

      // Add selected idea context if available
      if (selectedIdea.value) {
        basePrompt += `\n\nایده منتخب برای گسترش: ${selectedIdea.value.content}\n\nلطفاً ایده‌های جدیدی تولید کنید که بر اساس ایده منتخب بالا و با استفاده از تفکر قیاسی از حوزه‌های مختلف استعاره شده‌اند.`;
      }

      const prompt = `${basePrompt}

فرایند تفکر قیاسی:
1. مسئله را در یک حوزه دیگر تصور کنید
2. شباهت‌های ساختاری را پیدا کنید
3. راه‌حل‌های آن حوزه را بررسی کنید
4. این راه‌حل‌ها را به مسئله خود تطبیق دهید

حوزه‌های پیشنهادی برای استعاره: طبیعت، هنر، ورزش، فناوری، آشپزی، موسیقی

${guidance ? `راهنمایی کاربر: ${guidance}` : ''}

برای هر ایده:
1. حوزه استعاری را مشخص کنید (مثلا: طبیعت، فناوری، هنر، ورزش)
2. شباهت‌های ساختاری را توضیح دهید
3. راه‌حل تطبیق‌یافته را ارائه دهید

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

      const generatedIdeas = parseGeneratedIdeas(generatedContent);

      generatedIdeas.forEach((ideaContent, index) => {
        ideas.value.push({
          id: `ai-${Date.now()}-${index}`,
          content: ideaContent,
          technique: 'analogical',
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
    }
 catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در تولید ایده‌ها: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    }
 finally {
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
      ideas.push(...paragraphs.slice(0, 4));
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
      }
 catch (e) {
        console.warn('Could not parse saved stage1 data');
      }
    }

    const savedSelectedIdea = localStorage.getItem('hampazhooh-selected-idea');
    if (savedSelectedIdea) {
      try {
        selectedIdea.value = JSON.parse(savedSelectedIdea);
      }
 catch (e) {
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
    localStorage.setItem('hampazhooh-analogical-ideas', JSON.stringify(ideas.value));
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
              <div class="bg-success-500 shadow-success-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:arrows-left-right" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-success-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  تکنیک خلاقیت
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  Analogical Thinking - استعاره‌های مفهومی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  انتقال الگوها از حوزه‌های مختلف
                </BaseParagraph>
              </div>
            </div>
          </div>
          <BaseButton
            color="muted"
            shape="curved"
            @click="goBack"
          >
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
          class="dark:bg-muted-800 dark:border-muted-700 border-success-200 bg-success-50 dark:bg-success-900/20 mb-8 rounded-2xl border-2 p-6"
        >
          <div class="mb-4 flex items-start gap-3">
            <div class="bg-success-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
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
              <div class="text-muted-700 dark:text-muted-200 dark:bg-muted-800 rounded-lg bg-white p-3 text-sm">
                {{ selectedIdea.content }}
              </div>
              <div class="text-muted-500 mt-2 text-xs">
                از {{ getTechniqueName(selectedIdea.technique) }}
              </div>
            </div>
          </div>
          <div class="bg-success-100 dark:bg-success-900/30 rounded-lg p-4">
            <div class="text-success-700 dark:text-success-300 text-sm">
              با استفاده از تکنیک Analogical Thinking، می‌توانید این ایده را از طریق استعاره‌های مفهومی از حوزه‌های مختلف گسترش دهید.
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
              تفکر قیاسی چیست؟
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4 leading-relaxed">
              تفکر قیاسی یک تکنیک قدرتمند برای حل خلاقانه مسائل است. با استفاده از تشبیه و استعاره از حوزه‌های دیگر،
              می‌توانید دیدگاه‌های تازه‌ای به مسئله خود پیدا کنید. این روش به شما کمک می‌کند تا از چارچوب‌های فکری معمول فراتر بروید.
            </BaseParagraph>
          </div>

          <!-- Process Overview -->
          <div class="bg-success-500/10 dark:bg-success-500/20 border-success-500/20 rounded-xl border-2 p-6">
            <div class="flex items-start gap-4">
              <div class="bg-success-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon name="ph:arrows-merge" class="size-5 text-white" />
              </div>
              <div>
                <div class="text-muted-800 mb-2 text-sm font-semibold dark:text-white">
                  اصل کار
                </div>
                <div class="text-muted-700 dark:text-muted-200 text-sm">
                  یک مسئله را به یک حوزه کاملاً متفاوت "ترجمه" کنید، راه‌حل‌های آن حوزه را بررسی کنید،
                  سپس آن راه‌حل‌ها را به مسئله اصلی خود بازگردانید.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Process Steps -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="mb-6 text-gray-900 dark:text-white"
          >
            فرایند تفکر قیاسی
          </BaseHeading>
          <div class="grid gap-4 md:grid-cols-5">
            <div
              v-for="(step, index) in processSteps"
              :key="step.step"
              class="text-center"
            >
              <div class="bg-success-500 mx-auto mb-3 flex size-12 items-center justify-center rounded-full text-lg font-bold text-white">
                {{ step.step }}
              </div>
              <BaseHeading
                as="h4"
                size="sm"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                {{ step.title }}
              </BaseHeading>
              <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-300">
                {{ step.description }}
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Analogical Domains -->
        <div class="mb-8 grid gap-6 lg:grid-cols-3">
          <div
            v-for="domain in analogicalDomains"
            :key="domain.domain"
            class="dark:bg-muted-800 dark:border-muted-700 group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div class="mb-4 flex items-start gap-4">
              <div class="bg-success-500/10 dark:bg-success-500/20 flex size-12 shrink-0 items-center justify-center rounded-lg">
                <Icon :name="domain.icon" class="text-success-500 size-6" />
              </div>
              <div class="flex-1">
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="mb-1 text-gray-900 dark:text-white"
                >
                  {{ domain.domain }}
                </BaseHeading>
              </div>
            </div>

            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-4">
              {{ domain.description }}
            </BaseParagraph>

            <!-- Concepts -->
            <div class="mb-4">
              <div class="text-muted-700 dark:text-muted-200 mb-2 text-sm font-semibold">
                مفاهیم کلیدی:
              </div>
              <div class="flex flex-wrap gap-2">
                <BaseTag
                  v-for="concept in domain.concepts"
                  :key="concept"
                  color="success"
                  size="xs"
                  shape="full"
                >
                  {{ concept }}
                </BaseTag>
              </div>
            </div>

            <!-- Examples -->
            <details>
              <summary class="text-muted-600 dark:text-muted-300 hover:text-success-500 cursor-pointer text-sm transition-colors">
                <Icon name="ph:lightbulb" class="ml-1 size-4" />
                مثال‌ها
              </summary>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="example in domain.examples"
                  :key="example"
                  class="text-muted-600 dark:text-muted-400 flex items-start gap-2 text-sm"
                >
                  <Icon name="ph:arrow-right" class="text-success-500 mt-0.5 size-3.5 shrink-0" />
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
              {{ ideas.length }} ایده با تکنیک Analogical Thinking تولید شده
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
                  <BaseTag
                    color="success"
                    size="sm"
                    shape="full"
                  >
                    Analogical
                  </BaseTag>
                  <BaseTag
                    v-if="idea.aiGenerated"
                    color="info"
                    size="sm"
                    shape="full"
                  >
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
            color="success"
            shape="curved"
            size="lg"
            :disabled="aiGenerating"
            class="shadow-success-500/30 shadow-lg"
            @click="openAiGuidance"
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
            class="shadow-success-500/30 shadow-lg"
            @click="saveAndContinue"
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
          <div class="bg-success-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:sparkle" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading
              as="h2"
              size="xl"
              weight="bold"
            >
              تولید ایده با Analogical Thinking
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              استفاده از هوش مصنوعی برای تولید ایده‌های استعاری
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
            placeholder="مثلاً: از حوزه طبیعت استفاده کن، یا روی جنبه فناوری تمرکز کن..."
            rows="4"
            shape="curved"
          />
          <div class="text-muted-500 mt-2 text-xs">
            این راهنمایی به هوش مصنوعی کمک می‌کند تا حوزه‌های استعاری مرتبط‌تری را انتخاب کند.
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
            color="success"
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
