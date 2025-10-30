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

  definePageMeta({
    title: 'مرحله ۳: ساختاردهی و ارزیابی',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();

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
      title: 'نقشهٔ مفهومی',
      description: 'نمایش بصری روابط بین مفاهیم و ایده‌ها',
      icon: 'ph:graph',
      color: 'info',
    },
    {
      title: 'کارت‌های ایده',
      description: 'دسته‌بندی ایده‌ها بر اساس نوع رویکرد یا حوزه',
      icon: 'ph:cards',
      color: 'success',
    },
  ];

  const ideas = ref<Idea[]>([
    {
      id: '1',
      title: 'بررسی تأثیر فناوری بر رفتار',
      description: 'مطالعه چگونگی تأثیر فناوری‌های نوین بر الگوهای رفتاری انسان',
      scores: {},
      totalScore: 0,
    },
    {
      id: '2',
      title: 'تحلیل تعاملات مجازی',
      description: 'بررسی الگوهای تعاملی در محیط‌های مجازی و شبکه‌های اجتماعی',
      scores: {},
      totalScore: 0,
    },
    {
      id: '3',
      title: 'عوامل موثر بر بهره‌وری',
      description: 'شناسایی و تحلیل عوامل کلیدی موثر بر بهره‌وری و سلامت روان',
      scores: {},
      totalScore: 0,
    },
  ]);

  const selectedIdea = ref<string | null>(null);
  const evaluationMode = ref<'matrix' | 'concept-map' | 'cards'>('matrix');

  const updateScore = (ideaId: string, criteriaId: string, score: number) => {
    const idea = ideas.value.find(i => i.id === ideaId);
    if (idea) {
      idea.scores[criteriaId] = score;
      idea.totalScore = Object.values(idea.scores).reduce((sum, val) => sum + val, 0);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    if (score >= 3) return 'info';
    return 'muted';
  };

  const sortedIdeas = computed(() => {
    return [...ideas.value].sort((a, b) => b.totalScore - a.totalScore);
  });

  const selectIdea = (ideaId: string) => {
    selectedIdea.value = ideaId;
  };

  const saveAndContinue = () => {
    router.push('/hampazhooh/brainstorm/stage4');
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm/stage2');
  };

  const exportEvaluation = () => {
    // Implementation for exporting evaluation
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
            مرحله قبل
          </BaseButton>
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div class="bg-success-500 shadow-success-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:funnel" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-success-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  مرحله ۳
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  ساختاردهی و ارزیابی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  Convergent Structuring & Evaluation
                </BaseParagraph>
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
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-3 text-gray-900 dark:text-white"
            >
              هدف این مرحله
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
              در این مرحله، ایده‌های پراکنده را فیلتر، دسته‌بندی و اولویت‌بندی می‌کنیم. هدف تبدیل ایده‌های خلاقانه به طرح‌های پژوهشی قابل اجرا و شناسایی رویکردهای پژوهشی مناسب است.
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
              فعالیت‌های کلیدی
            </BaseHeading>
            <div class="grid gap-4 sm:grid-cols-3">
              <div class="flex items-start gap-3">
                <Icon name="ph:funnel-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    فیلتر کردن
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    انتخاب ایده‌های قابل اجرا
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:stack-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    دسته‌بندی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    گروه‌بندی بر اساس موضوع
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:ranking-fill" class="text-success-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    اولویت‌بندی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    ترتیب براساس ارزش
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Evaluation Criteria -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
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
              <div
                :class="[
                  'mb-3 flex size-12 items-center justify-center rounded-xl',
                  `bg-${criteria.color}-500/10`,
                ]"
              >
                <Icon
                  :name="criteria.icon"
                  :class="[`text-${criteria.color}-500`, 'size-6']"
                />
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

        <!-- Evaluation Matrix -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="semibold"
                class="text-gray-900 dark:text-white"
              >
                ماتریس ارزیابی ایده‌ها
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mt-1">
                به هر ایده امتیاز دهید و نتایج را مشاهده کنید
              </BaseParagraph>
            </div>
            <BaseButton
              color="muted"
              shape="curved"
              size="sm"
              @click="exportEvaluation"
            >
              <Icon name="ph:download-simple" class="ml-2 size-4" />
              دانلود
            </BaseButton>
          </div>

          <!-- Matrix Table -->
          <div class="overflow-x-auto">
            <div class="min-w-[800px]">
              <!-- Header Row -->
              <div class="dark:border-muted-700 dark:bg-muted-900/50 mb-2 grid grid-cols-7 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div class="col-span-2 text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                  ایده
                </div>
                <div
                  v-for="criteria in evaluationCriteria"
                  :key="criteria.id"
                  class="text-center text-xs font-semibold uppercase text-gray-600 dark:text-gray-400"
                >
                  {{ criteria.title }}
                </div>
              </div>

              <!-- Idea Rows -->
              <div class="space-y-2">
                <div
                  v-for="idea in ideas"
                  :key="idea.id"
                  class="dark:border-muted-700 dark:bg-muted-900/30 grid grid-cols-7 items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 transition-all duration-200 hover:shadow-md"
                >
                  <!-- Idea Title -->
                  <div class="col-span-2">
                    <div class="text-muted-800 mb-1 text-sm font-semibold dark:text-white">
                      {{ idea.title }}
                    </div>
                    <div class="text-muted-500 line-clamp-2 text-xs">
                      {{ idea.description }}
                    </div>
                  </div>

                  <!-- Score Inputs -->
                  <div
                    v-for="criteria in evaluationCriteria"
                    :key="criteria.id"
                    class="flex justify-center"
                  >
                    <BaseInput
                      :model-value="idea.scores[criteria.id] || 0"
                      type="number"
                      min="0"
                      max="10"
                      shape="curved"
                      :classes="{ input: 'h-10 w-16 text-center' }"
                      @update:model-value="(val) => updateScore(idea.id, criteria.id, Number(val))"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ranked Results -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
              نتایج رتبه‌بندی شده
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              ایده‌ها بر اساس امتیاز کل مرتب شده‌اند
            </BaseParagraph>
          </div>

          <div class="space-y-4">
            <div
              v-for="(idea, index) in sortedIdeas"
              :key="idea.id"
              class="dark:border-muted-700 dark:bg-muted-900/30 group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-lg"
            >
              <!-- Rank Badge -->
              <div class="absolute left-4 top-4">
                <div
                  :class="[
                    'flex size-10 items-center justify-center rounded-full font-bold text-white shadow-lg',
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-muted-500',
                  ]"
                >
                  {{ index + 1 }}
                </div>
              </div>

              <div class="mr-16">
                <div class="mb-3 flex items-start justify-between">
                  <div class="flex-1">
                    <BaseHeading
                      as="h3"
                      size="lg"
                      weight="semibold"
                      class="mb-2 text-gray-900 dark:text-white"
                    >
                      {{ idea.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                      {{ idea.description }}
                    </BaseParagraph>
                  </div>
                  <div class="mr-4 text-left">
                    <div class="text-muted-500 mb-1 text-xs">
                      امتیاز کل
                    </div>
                    <div
                      :class="[
                        'text-3xl font-bold',
                        idea.totalScore >= 40 ? 'text-success-500' : idea.totalScore >= 25 ? 'text-warning-500' : 'text-muted-400',
                      ]"
                    >
                      {{ idea.totalScore }}
                    </div>
                    <div class="text-muted-500 text-xs">
                      از ۵۰
                    </div>
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
                    {{ criteria.title }}: {{ idea.scores[criteria.id] || 0 }}
                  </BaseTag>
                </div>
              </div>
            </div>
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
              ابزارهای دیگر برای ساختاردهی بهتر ایده‌ها
            </BaseParagraph>
          </div>

          <div class="grid gap-6 lg:grid-cols-3">
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
                <Icon
                  :name="tool.icon"
                  :class="[`text-${tool.color}-500`, 'size-6']"
                />
              </div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
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
          <BaseButton
            color="muted"
            shape="curved"
            size="lg"
            @click="goBack"
          >
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
