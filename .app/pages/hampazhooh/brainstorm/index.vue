<script setup lang="ts">
  interface Stage {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning';
    route: string;
    features: string[];
  }

  definePageMeta({
    title: 'طوفان فکری پژوهشی',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();

  const stages: Stage[] = [
    {
      id: 1,
      title: 'مرحله ۱',
      subtitle: 'تعریف حوزه و قاب مفهومی',
      description: 'تعیین مرزهای موضوعی و مفهومی برای طوفان فکری. مشخص کردن سؤال یا چالش اصلی، حوزهٔ دانشی، و سطح تمرکز پژوهش.',
      icon: 'ph:target',
      color: 'primary',
      route: '/hampazhooh/brainstorm/stage1',
      features: [
        'مشخص کردن سؤال یا چالش اصلی',
        'تعیین حوزهٔ دانشی',
        'تعیین سطح تمرکز: کاربردی، نظری، بین‌رشته‌ای',
        'تعیین محدودیت‌ها و فرصت‌ها',
      ],
    },
    {
      id: 2,
      title: 'مرحله ۲',
      subtitle: 'تولید ایده‌های خلاقانه',
      description: 'گسترش طیف ایده‌ها بدون قضاوت. تمرکز بر کمّیت قبل از کیفیت و استفاده از تکنیک‌های خلاقیت ساختاریافته.',
      icon: 'ph:lightbulb',
      color: 'info',
      route: '/hampazhooh/brainstorm/stage2',
      features: [
        'تکنیک SCAMPER',
        'Six Thinking Hats',
        'Analogical Thinking',
        'Reverse Brainstorming',
      ],
    },
    {
      id: 3,
      title: 'مرحله ۳',
      subtitle: 'ساختاردهی و ارزیابی',
      description: 'فیلتر، دسته‌بندی و اولویت‌بندی ایده‌ها. تبدیل ایده‌های پراکنده به طرح‌های پژوهشی قابل اجرا.',
      icon: 'ph:funnel',
      color: 'success',
      route: '/hampazhooh/brainstorm/stage3',
      features: [
        'ماتریس ارزیابی ایده',
        'نقشهٔ مفهومی',
        'کارت‌های ایده',
        'معیارهای نوآوری، امکان‌سنجی، و تأثیرگذاری',
      ],
    },
    {
      id: 4,
      title: 'مرحله ۴',
      subtitle: 'بازخورد و تکرار',
      description: 'بهبود چرخه از طریق یادگیری و بازبینی. شناسایی شکاف‌های مفهومی و بازگشت به مراحل قبل برای تعمیق.',
      icon: 'ph:arrows-clockwise',
      color: 'warning',
      route: '/hampazhooh/brainstorm/stage4',
      features: [
        'جلسهٔ Peer Review',
        'فهرست چک‌لیست بازخورد',
        'روزنوشتهٔ فرایند',
        'بازگشت به مراحل قبل',
      ],
    },
  ];

  const systemicPrinciples = [
    {
      title: 'تعامل بین عناصر',
      description: 'هر مرحله با مراحل دیگر در تعامل است',
      icon: 'ph:git-merge',
      color: 'primary',
    },
    {
      title: 'بازخورد (Feedback Loop)',
      description: 'سیستم از طریق بازخورد یاد می‌گیرد و تکامل می‌یابد',
      icon: 'ph:repeat',
      color: 'info',
    },
    {
      title: 'ناخطی بودن (Non-linearity)',
      description: 'می‌توانید بین مراحل جابه‌جا شوید',
      icon: 'ph:shuffle',
      color: 'success',
    },
    {
      title: 'مرزهای پویا',
      description: 'مرزهای موضوعی می‌توانند گسترش یا انقباض پیدا کنند',
      icon: 'ph:arrow-line-up-right',
      color: 'warning',
    },
  ];

  const navigateToStage = (route: string) => {
    router.push(route);
  };

  const startNewSession = () => {
    router.push('/hampazhooh/brainstorm/stage1');
  };
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="mb-2 flex items-center gap-3">
              <div class="bg-primary-500 shadow-primary-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:sparkle-fill" class="size-6 text-white" />
              </div>
              <div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  فرایند چرخه‌ای کشف پژوهشی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  Research Discovery Cycle (RDC)
                </BaseParagraph>
              </div>
            </div>
          </div>
          <BaseButton
            color="primary"
            shape="curved"
            size="lg"
            class="shadow-primary-500/30 shadow-lg"
            @click="startNewSession"
          >
            <Icon name="ph:plus-circle-fill" class="ml-2 size-5" />
            شروع جلسه جدید
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Introduction Section -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
        <div class="mb-6">
          <BaseHeading
            as="h2"
            size="xl"
            weight="semibold"
            class="mb-3 text-gray-900 dark:text-white"
          >
            چارچوب سیستمی طوفان فکری پژوهشی
          </BaseHeading>
          <BaseParagraph class="text-muted-600 dark:text-muted-300 leading-relaxed">
            این چارچوب از چهار مرحلهٔ اصلی تشکیل شده که در یک چرخهٔ بازخوردی (feedback loop) قرار دارند و می‌توانند تکرار شوند تا عمق و گستردگی ایده‌ها افزایش یابد. هر مرحله ابزارها و تکنیک‌های خاص خود را دارد که به شما کمک می‌کند تا فرایند پژوهش خود را به صورت سیستماتیک و خلاقانه پیش ببرید.
          </BaseParagraph>
        </div>

        <!-- Highlight Box -->
        <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="bg-primary-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon name="ph:info-fill" class="size-6 text-white" />
            </div>
            <div>
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="mb-2 text-gray-900 dark:text-white"
              >
                چرا چارچوب سیستمی؟
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 leading-relaxed">
                برخلاف طوفان فکری‌های سنتی که فقط روی تولید ایده تمرکز دارند، این چارچوب یک رویکرد جامع و چرخه‌ای ارائه می‌دهد که شامل تعریف مسئله، تولید خلاق، ارزیابی منطقی، و بهبود مستمر است. این رویکرد به شما کمک می‌کند تا نه تنها ایده‌های بیشتری تولید کنید، بلکه ایده‌های قابل اجرا و تأثیرگذار نیز داشته باشید.
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>

      <!-- 4 Stages Grid -->
      <div class="mb-8">
        <div class="mb-6">
          <BaseHeading
            as="h2"
            size="xl"
            weight="semibold"
            class="text-gray-900 dark:text-white"
          >
            چهار مرحله اصلی
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 mt-1">
            هر مرحله را بشناسید و فرایند خود را شروع کنید
          </BaseParagraph>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <div
            v-for="stage in stages"
            :key="stage.id"
            class="dark:bg-muted-800 dark:border-muted-700 group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/50"
          >
            <!-- Stage Number Badge -->
            <div class="absolute left-6 top-6">
              <div
                :class="[
                  'flex size-12 items-center justify-center rounded-full font-bold text-white shadow-lg',
                  `bg-${stage.color}-500`,
                ]"
              >
                {{ stage.id }}
              </div>
            </div>

            <div class="p-8 pt-6">
              <!-- Icon & Title -->
              <div class="mb-6 mt-8 flex items-start gap-4">
                <div
                  :class="[
                    'flex size-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                    `bg-${stage.color}-500/10`,
                  ]"
                >
                  <Icon
                    :name="stage.icon"
                    :class="[`text-${stage.color}-500`, 'size-8']"
                  />
                </div>
                <div class="flex-1">
                  <div class="text-muted-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                    {{ stage.title }}
                  </div>
                  <BaseHeading
                    as="h3"
                    size="lg"
                    weight="semibold"
                    class="text-gray-900 dark:text-white"
                  >
                    {{ stage.subtitle }}
                  </BaseHeading>
                </div>
              </div>

              <!-- Description -->
              <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-6 leading-relaxed">
                {{ stage.description }}
              </BaseParagraph>

              <!-- Features List -->
              <div class="dark:border-muted-700 dark:bg-muted-900/50 mb-6 space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div class="text-muted-700 dark:text-muted-200 mb-2 text-xs font-semibold uppercase">
                  ویژگی‌های کلیدی
                </div>
                <div
                  v-for="(feature, idx) in stage.features"
                  :key="idx"
                  class="text-muted-600 dark:text-muted-400 flex items-start gap-2 text-sm"
                >
                  <Icon
                    name="ph:check-circle-fill"
                    :class="[`text-${stage.color}-500`, 'mt-0.5 size-4 shrink-0']"
                  />
                  <span>{{ feature }}</span>
                </div>
              </div>

              <!-- Action Button -->
              <BaseButton
                :color="stage.color"
                shape="curved"
                class="w-full"
                @click="navigateToStage(stage.route)"
              >
                <Icon name="ph:arrow-left" class="mr-2 size-5" />
                شروع مرحله {{ stage.id }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Systemic Principles Section -->
      <div class="mb-8">
        <div class="mb-6">
          <BaseHeading
            as="h2"
            size="xl"
            weight="semibold"
            class="text-gray-900 dark:text-white"
          >
            اصول سیستمی
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 mt-1">
            ویژگی‌های منحصر به فرد این چارچوب
          </BaseParagraph>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="principle in systemicPrinciples"
            :key="principle.title"
            class="dark:bg-muted-800 dark:border-muted-700 group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              :class="[
                'mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                `bg-${principle.color}-500/10`,
              ]"
            >
              <Icon
                :name="principle.icon"
                :class="[`text-${principle.color}-500`, 'size-6']"
              />
            </div>
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
              {{ principle.title }}
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              {{ principle.description }}
            </BaseParagraph>
          </div>
        </div>
      </div>

      <!-- Documentation Note -->
      <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
        <div class="flex items-start gap-6">
          <div class="bg-warning-500/10 flex size-16 shrink-0 items-center justify-center rounded-2xl">
            <Icon name="ph:notebook-fill" class="text-warning-500 size-8" />
          </div>
          <div class="flex-1">
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="mb-3 text-gray-900 dark:text-white"
            >
              اهمیت مستندسازی
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4 leading-relaxed">
              مستندسازی بخش جدایی‌ناپذیر این سیستم است. هر مرحله باید مستند شود (حتی ایده‌های ردشده). از الگوهای یکسان برای ثبت اطلاعات استفاده کنید. این مستندات پایه‌ای برای تولید پروپوزال، مقاله، یا طرح پژوهشی خواهند بود.
            </BaseParagraph>
            <div class="flex flex-wrap gap-3">
              <BaseTag
                color="warning"
                size="sm"
                shape="full"
              >
                <Icon name="ph:clipboard-text" class="ml-1 size-3.5" />
                تمپلیت ایده‌ها
              </BaseTag>
              <BaseTag
                color="warning"
                size="sm"
                shape="full"
              >
                <Icon name="ph:chart-bar" class="ml-1 size-3.5" />
                تمپلیت ارزیابی
              </BaseTag>
              <BaseTag
                color="warning"
                size="sm"
                shape="full"
              >
                <Icon name="ph:clock-clockwise" class="ml-1 size-3.5" />
                روزنوشتهٔ فرایند
              </BaseTag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
