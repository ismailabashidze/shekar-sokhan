<script setup lang="ts">
  definePageMeta({
    title: 'Reverse Brainstorming - نگاه معکوس',
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

  const reverseProcess = [
    {
      step: 1,
      title: 'مشخص کردن هدف اصلی',
      description: 'هدف اصلی را به وضوح تعریف کنید (مثلاً: بهبود رضایت مشتری)',
      icon: 'ph:target',
      color: 'warning',
    },
    {
      step: 2,
      title: 'معکوس کردن هدف',
      description: 'هدف را معکوس کنید (مثلاً: بدتر کردن رضایت مشتری)',
      icon: 'ph:arrow-u-up-left',
      color: 'warning',
    },
    {
      step: 3,
      title: 'طوفان فکری معکوس',
      description: 'راه‌های بدتر کردن هدف را پیدا کنید',
      icon: 'ph:cloud-lightning',
      color: 'warning',
    },
    {
      step: 4,
      title: 'معکوس کردن راه‌حل‌ها',
      description: 'هر راه‌حل بد را معکوس کنید تا راه‌حل خوب به دست آید',
      icon: 'ph:arrows-clockwise',
      color: 'warning',
    },
    {
      step: 5,
      title: 'استخراج راه‌حل‌های واقعی',
      description: 'راه‌حل‌های عملی و قابل اجرا را شناسایی کنید',
      icon: 'ph:check-circle',
      color: 'success',
    },
  ];

  const reverseExamples = [
    {
      original: 'بهبود خدمت به مشتری',
      reversed: 'چطور خدمت به مشتری را بدتر کنیم؟',
      badIdeas: [
        'صبر نکردن به حرف مشتری',
        'پاسخگو نبودن به شکایات',
        'انتظار طولانی در صف',
        'عدم اطلاع‌رسانی وضعیت',
        'عدم عذرخواهی برای خطا',
      ],
      goodSolutions: [
        'فعال گوش دادن به مشتری',
        'پاسخ سریع به شکایات',
        'کاهش زمان انتظار',
        'اطلاع‌رسانی شفاف وضعیت',
        'عذرخواهی صادقانه برای خطا',
      ],
    },
    {
      original: 'افزایش بهره‌وری تیم',
      reversed: 'چطور بهره‌وری تیم را کاهش دهیم؟',
      badIdeas: [
        'جلسات بی‌هدف و طولانی',
        'عدم تعیین وظایف مشخص',
        'ارتباط ضعیف بین اعضا',
        'ابزارهای نامناسب کار',
        'مدیریت میکرو و دخالت',
      ],
      goodSolutions: [
        'جلسات کوتاه و هدفمند',
        'تعیین وظایف مشخص و قابل اندازه‌گیری',
        'ارتباط موثر و شفاف',
        'تأمین ابزارهای مناسب',
        'اعتماد به تیم و استقلال عمل',
      ],
    },
    {
      original: 'بهبود فرایند فروش',
      reversed: 'چطور فرایند فروش را خراب کنیم؟',
      badIdeas: [
        'عدم شناخت مشتری',
        'ارائه اطلاعات اشتباه',
        'فشار بیش از حد برای خرید',
        'عدم پیگیری بعد از فروش',
        'قیمت‌گذاری نامناسب',
      ],
      goodSolutions: [
        'شناخت عمیق نیازهای مشتری',
        'ارائه اطلاعات دقیق و شفاف',
        'مشاوره بدون فشار',
        'پشتیبانی بعد از فروش',
        'قیمت‌گذاری منصفانه و رقابتی',
      ],
    },
  ];

  const benefits = [
    {
      title: 'حذف محدودیت‌های فکری',
      description: 'با فکر کردن به راه‌های بد، از محدودیت‌های ذهنی خود فراتر می‌روید',
      icon: 'ph:lock-open',
    },
    {
      title: 'کشف مشکلات پنهان',
      description: 'راه‌های بدتر کردن، مشکلاتی را نشان می‌دهد که شاید متوجه آن‌ها نبودید',
      icon: 'ph:eye',
    },
    {
      title: 'راه‌حل‌های خلاقانه',
      description: 'معکوس کردن مسائل، راه‌حل‌های غیرمنتظره و خلاقانه‌ای ایجاد می‌کند',
      icon: 'ph:lightbulb',
    },
    {
      title: 'گروه‌های خلاق‌تر',
      description: 'این روش در کار گروهی نتایج بسیار خوبی دارد و همه را مشارکت می‌دهد',
      icon: 'ph:users-three',
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

      let basePrompt = `با استفاده از تکنیک Reverse Brainstorming، حداقل ۵ ایده برای چالش تحقیقاتی زیر تولید کنید:
${context}`;

      // Add selected idea context if available
      if (selectedIdea.value) {
        basePrompt += `\n\nایده منتخب برای گسترش: ${selectedIdea.value.content}\n\nلطفاً ایده‌های جدیدی تولید کنید که بر اساس ایده منتخب بالا و با استفاده از تکنیک Reverse Brainstorming از طریق معکوس کردن گسترش داده شده‌اند.`;
      }

      const prompt = `${basePrompt}

فرایند طوفان فکری معکوس:
1. مسئله را معکوس کنید
2. روش‌های بدتر کردن را فهرست کنید
3. هر روش را معکوس کنید
4. راه‌حل‌های واقعی را استخراج کنید

${guidance ? `راهنمایی کاربر: ${guidance}` : ''}

ابتدا ۳ روش برای بدتر کردن مسئله را فهرست کنید، سپس هر کدام را معکوس کرده تا راه‌حل‌های خلاقانه واقعی به دست آید.
پاسخ را به صورت دو بخش برگردانید:
بخش ۱: روش‌های بدتر کردن
بخش ۲: راه‌حل‌های معکوس شده`;

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
          technique: 'reverse',
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

    return ideas.slice(0, 10); // Limit total ideas
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
    localStorage.setItem('hampazhooh-reverse-ideas', JSON.stringify(ideas.value));
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
              <div
                class="bg-warning-500 shadow-warning-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg"
              >
                <Icon name="ph:arrow-u-up-left" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-warning-500 mb-1 text-xs font-semibold uppercase tracking-wider">تکنیک خلاقیت</div>
                <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
                  Reverse Brainstorming - نگاه معکوس
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">از بدتر کردن تا بهتر کردن</BaseParagraph>
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
          class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border-2 border-warning-200 bg-warning-50 dark:bg-warning-900/20 p-6"
        >
          <div class="mb-4 flex items-start gap-3">
            <div class="bg-warning-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
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
          <div class="bg-warning-100 dark:bg-warning-900/30 rounded-lg p-4">
            <div class="text-warning-700 dark:text-warning-300 text-sm">
              با استفاده از تکنیک Reverse Brainstorming، می‌توانید این ایده را از طریق معکوس کردن و نگاه معکوس گسترش دهید.
            </div>
          </div>
        </div>

        <!-- Introduction -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
              طوفان فکری معکوس چیست؟
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4 leading-relaxed">
              به جای پرسیدن "چطور این مشکل را حل کنیم؟"، می‌پرسیم "چطور این مشکل را بدتر کنیم؟". این تغییر دیدگاه
              غیرمنتظره، اغلب راه‌حل‌های خلاقانه‌ای را آشکار می‌کند که در تفکر معمول به چشم نمی‌آیند.
            </BaseParagraph>
          </div>

          <!-- Process Overview -->
          <div class="bg-warning-500/10 dark:bg-warning-500/20 border-warning-500/20 rounded-xl border-2 p-6">
            <div class="flex items-start gap-4">
              <div class="bg-warning-500 flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon name="ph:arrows-clockwise" class="size-5 text-white" />
              </div>
              <div>
                <div class="text-muted-800 text-sm font-semibold dark:text-white mb-2">منطق معکوس</div>
                <div class="text-muted-700 dark:text-muted-200 text-sm">
                  گاهی برای پیدا کردن راه‌حل‌های خوب، باید بدانیم چه چیزی باعث خراب شدن می‌شود. راه‌های بدتر کردن،
                  معمولاً ساده‌تر و واضح‌تر از راه‌های بهتر کردن هستند.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Process Steps -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <BaseHeading as="h3" size="lg" weight="semibold" class="mb-6 text-gray-900 dark:text-white">
            فرایند طوفان فکری معکوس
          </BaseHeading>
          <div class="space-y-4">
            <div
              v-for="(step, index) in reverseProcess"
              :key="step.step"
              class="flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
              :class="[
                index < reverseProcess.length - 1
                  ? 'dark:bg-muted-900/30 dark:border-muted-700 border border-gray-100 bg-gray-50'
                  : 'bg-success-500/10 dark:bg-success-500/20 border-success-500/20 border-2',
              ]"
            >
              <div
                :class="[
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  step.color === 'success' ? 'bg-success-500' : `bg-${step.color}-500`,
                ]"
              >
                <Icon :name="step.icon" class="size-6 text-white" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <div
                    :class="[
                      'flex size-8 items-center justify-center rounded-full text-white font-bold text-sm',
                      step.color === 'success' ? 'bg-success-500' : `bg-${step.color}-500`,
                    ]"
                  >
                    {{ step.step }}
                  </div>
                  <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-900 dark:text-white">
                    {{ step.title }}
                  </BaseHeading>
                </div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                  {{ step.description }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="grid gap-4 lg:grid-cols-4 mb-8">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="dark:bg-muted-800 dark:border-muted-700 rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:shadow-lg"
          >
            <div
              class="bg-warning-500/10 dark:bg-warning-500/20 mx-auto mb-4 flex size-12 items-center justify-center rounded-lg"
            >
              <Icon :name="benefit.icon" class="text-warning-500 size-6" />
            </div>
            <BaseHeading as="h4" size="sm" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              {{ benefit.title }}
            </BaseHeading>
            <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-300">
              {{ benefit.description }}
            </BaseParagraph>
          </div>
        </div>

        <!-- Examples -->
        <div class="space-y-6 mb-8">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            مثال‌های عملی
          </BaseHeading>

          <div
            v-for="example in reverseExamples"
            :key="example.original"
            class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6"
          >
            <div class="mb-4">
              <BaseParagraph class="text-muted-500 text-sm mb-2">هدف اصلی:</BaseParagraph>
              <div class="bg-muted-100 dark:bg-muted-900 p-3 rounded-lg">
                <div class="text-muted-800 dark:text-muted-200 font-medium">
                  {{ example.original }}
                </div>
              </div>
            </div>

            <div class="mb-4">
              <BaseParagraph class="text-muted-500 text-sm mb-2">معکوس شده:</BaseParagraph>
              <div class="bg-warning-500/10 dark:bg-warning-500/20 border-warning-500/20 border p-3 rounded-lg">
                <div class="text-warning-600 dark:text-warning-300 font-medium">
                  {{ example.reversed }}
                </div>
              </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <Icon name="ph:minus-circle" class="text-danger-500 size-5" />
                  <BaseParagraph class="text-danger-500 font-medium text-sm">راه‌های بدتر کردن</BaseParagraph>
                </div>
                <ul class="space-y-2">
                  <li
                    v-for="badIdea in example.badIdeas"
                    :key="badIdea"
                    class="text-muted-600 dark:text-muted-400 text-sm flex items-start gap-2"
                  >
                    <Icon name="ph:x" class="text-danger-500 mt-0.5 size-3.5 shrink-0" />
                    {{ badIdea }}
                  </li>
                </ul>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-3">
                  <Icon name="ph:plus-circle" class="text-success-500 size-5" />
                  <BaseParagraph class="text-success-500 font-medium text-sm">راه‌حل‌های معکوس شده</BaseParagraph>
                </div>
                <ul class="space-y-2">
                  <li
                    v-for="goodSolution in example.goodSolutions"
                    :key="goodSolution"
                    class="text-muted-600 dark:text-muted-400 text-sm flex items-start gap-2"
                  >
                    <Icon name="ph:check" class="text-success-500 mt-0.5 size-3.5 shrink-0" />
                    {{ goodSolution }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Generated Ideas -->
        <div
          v-if="ideas.length > 0"
          class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8"
        >
          <div class="mb-6">
            <BaseHeading as="h3" size="xl" weight="semibold" class="text-gray-900 dark:text-white">
              ایده‌های تولید شده
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 mt-1">
              {{ ideas.length }} ایده با تکنیک Reverse Brainstorming تولید شده
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
                  <BaseTag color="warning" size="sm" shape="full">Reverse</BaseTag>
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
            color="warning"
            shape="curved"
            size="lg"
            :disabled="aiGenerating"
            @click="openAiGuidance"
            class="shadow-warning-500/30 shadow-lg"
          >
            <Icon :name="aiGenerating ? 'svg-spinners:90-ring-with-bg' : 'ph:sparkle'" class="ml-2 size-5" />
            {{ aiGenerating ? 'در حال تولید...' : 'تولید ایده با هوش مصنوعی' }}
          </BaseButton>
        </div>

        <!-- Navigation -->
        <div class="mt-8 flex items-center justify-between">
          <BaseButton color="muted" shape="curved" size="lg" @click="goBack">
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
    <TairoModal :open="showAiGuidanceModal" size="xl" @close="showAiGuidanceModal = false">
      <template #header>
        <div class="flex items-center gap-3 p-6 pb-0">
          <div class="bg-warning-500 flex size-12 items-center justify-center rounded-xl">
            <Icon name="ph:sparkle" class="size-6 text-white" />
          </div>
          <div class="text-right">
            <BaseHeading as="h2" size="xl" weight="bold">تولید ایده با Reverse Brainstorming</BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              استفاده از هوش مصنوعی برای تولید ایده‌های معکوس
            </BaseParagraph>
          </div>
        </div>
      </template>

      <div class="space-y-6 p-6">
        <!-- Context Display -->
        <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
          <BaseHeading as="h4" size="md" weight="semibold" class="mb-3 text-gray-900 dark:text-white">
            زمینه پژوهش
          </BaseHeading>
          <div class="space-y-2 text-sm">
            <div class="text-muted-600 dark:text-muted-400">
              <strong>چالش اصلی:</strong>
              {{ stage1Data.value.mainChallenge || 'مشخص نشده' }}
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
            placeholder="مثلاً: روی جنبه‌های عملی تمرکز کن، یا راه‌حل‌های سریع و کم‌هزینه بده..."
            rows="4"
            shape="curved"
          />
          <div class="text-muted-500 mt-2 text-xs">
            این راهنمایی به هوش مصنوعی کمک می‌کند تا راه‌حل‌های مرتبط‌تری تولید کند.
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between">
          <BaseButton color="muted" shape="curved" @click="showAiGuidanceModal = false">انصراف</BaseButton>
          <BaseButton
            color="warning"
            shape="curved"
            size="lg"
            :disabled="aiGenerating"
            @click="generateIdeasWithAI(userGuidance)"
          >
            <Icon v-if="!aiGenerating" name="ph:sparkle" class="ml-2 size-5" />
            <Icon v-else name="svg-spinners:90-ring-with-bg" class="ml-2 size-5" />
            {{ aiGenerating ? 'در حال تولید...' : 'تولید ایده‌ها' }}
          </BaseButton>
        </div>
      </div>
    </TairoModal>
  </div>
</template>
