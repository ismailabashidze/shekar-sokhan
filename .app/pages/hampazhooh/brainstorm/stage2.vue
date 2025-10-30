<script setup lang="ts">
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
  }

  definePageMeta({
    title: 'مرحله ۲: تولید ایده‌های خلاقانه',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();

  const selectedTechnique = ref<string | null>(null);
  const ideas = ref<Idea[]>([]);
  const newIdea = ref('');

  const techniques: Technique[] = [
    {
      id: 'scamper',
      title: 'SCAMPER',
      subtitle: 'بازتعریف خلاقانه مسائل',
      description: 'تکنیک SCAMPER با استفاده از ۷ رویکرد مختلف (جایگزینی، ترکیب، تطبیق، تغییر، استفاده دیگر، حذف، معکوس) به شما کمک می‌کند مسائل را از زوایای مختلف ببینید.',
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
      description: 'این تکنیک شما را تشویق می‌کند که مسئله را از ۶ دیدگاه مختلف (احساسی، منطقی، خلاقانه، منفی، مثبت، مدیریتی) بررسی کنید.',
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
      description: 'به جای "چطور حل کنیم؟" بپرسید "چطور بدتر کنیم؟" این تغییر دیدگاه می‌تواند راه‌حل‌های غیرمنتظره‌ای ایجاد کند.',
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

  const selectTechnique = (techniqueId: string) => {
    selectedTechnique.value = techniqueId;
  };

  const addIdea = () => {
    if (newIdea.value.trim() && selectedTechnique.value) {
      ideas.value.push({
        id: Date.now().toString(),
        content: newIdea.value.trim(),
        technique: selectedTechnique.value,
        timestamp: new Date(),
      });
      newIdea.value = '';
    }
  };

  const removeIdea = (id: string) => {
    ideas.value = ideas.value.filter(idea => idea.id !== id);
  };

  const getTechniqueName = (id: string) => {
    return techniques.find(t => t.id === id)?.title || '';
  };

  const getTechniqueColor = (id: string) => {
    return techniques.find(t => t.id === id)?.color || 'muted';
  };

  const saveAndContinue = () => {
    router.push('/hampazhooh/brainstorm/stage3');
  };

  const goBack = () => {
    router.push('/hampazhooh/brainstorm/stage1');
  };

  const exportIdeas = () => {
    // Implementation for exporting ideas
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
              <div class="bg-info-500 shadow-info-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:lightbulb" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-info-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  مرحله ۲
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  تولید ایده‌های خلاقانه
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  Divergent Ideation
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
            <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4 leading-relaxed">
              در این مرحله، هدف گسترش طیف ایده‌ها بدون قضاوت است. تمرکز بر کمّیت قبل از کیفیت باشد. از تکنیک‌های خلاقیت ساختاریافته استفاده کنید تا ایده‌های متنوع و خلاقانه تولید کنید.
            </BaseParagraph>
          </div>

          <!-- Key Principles -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="mb-4 text-gray-900 dark:text-white"
            >
              اصول کلیدی
            </BaseHeading>
            <div class="grid gap-4 sm:grid-cols-3">
              <div class="flex items-start gap-3">
                <Icon name="ph:chart-line-up-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    کمّیت اول
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    هرچه ایده بیشتر، بهتر
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:hand-palm-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    بدون قضاوت
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    همه ایده‌ها خوب هستند
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:arrows-merge-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    ترکیب حوزه‌ها
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    از حوزه‌های مختلف الهام بگیرید
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Left Column: Techniques -->
          <div class="lg:col-span-1">
            <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6">
              <BaseHeading
                as="h3"
                size="lg"
                weight="semibold"
                class="mb-4 text-gray-900 dark:text-white"
              >
                تکنیک‌های خلاقیت
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mb-6">
                یک تکنیک را انتخاب کنید
              </BaseParagraph>

              <div class="space-y-3">
                <div
                  v-for="technique in techniques"
                  :key="technique.id"
                  :class="[
                    'dark:border-muted-700 cursor-pointer rounded-xl border-2 p-4 transition-all duration-200',
                    selectedTechnique === technique.id
                      ? `border-${technique.color}-500 ring- ring-4${technique.color}-500/10`
                      : 'dark:border-muted-700 dark:hover:border-muted-600 border-gray-200 hover:border-gray-300',
                  ]"
                  @click="selectTechnique(technique.id)"
                >
                  <div class="mb-2 flex items-center gap-3">
                    <div
                      :class="[
                        'flex size-10 items-center justify-center rounded-lg',
                        `bg-${technique.color}-500/10`,
                      ]"
                    >
                      <Icon
                        :name="technique.icon"
                        :class="[`text-${technique.color}-500`, 'size-5']"
                      />
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
                      :class="[
                        'flex size-6 items-center justify-center rounded-full',
                        `bg-${technique.color}-500`,
                      ]"
                    >
                      <Icon name="ph:check-bold" class="size-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Technique Details & Ideas -->
          <div class="space-y-6 lg:col-span-2">
            <!-- Technique Details -->
            <div
              v-if="selectedTechnique"
              class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8"
            >
              <div
                v-for="technique in techniques.filter((t) => t.id === selectedTechnique)"
                :key="technique.id"
              >
                <div class="mb-6 flex items-start gap-4">
                  <div
                    :class="[
                      'flex size-16 items-center justify-center rounded-2xl',
                      `bg-${technique.color}-500/10`,
                    ]"
                  >
                    <Icon
                      :name="technique.icon"
                      :class="[`text-${technique.color}-500`, 'size-8']"
                    />
                  </div>
                  <div class="flex-1">
                    <BaseHeading
                      as="h3"
                      size="lg"
                      weight="semibold"
                      class="mb-2 text-gray-900 dark:text-white"
                    >
                      {{ technique.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                      {{ technique.description }}
                    </BaseParagraph>
                  </div>
                </div>

                <!-- Steps -->
                <div class="dark:border-muted-700 dark:bg-muted-900/50 mb-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
                  <div class="text-muted-700 dark:text-muted-200 mb-4 text-sm font-semibold">
                    مراحل استفاده:
                  </div>
                  <div class="space-y-3">
                    <div
                      v-for="(step, idx) in technique.steps"
                      :key="idx"
                      class="flex items-start gap-3"
                    >
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

                <!-- Add Idea Form -->
                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">
                    ایده خود را بنویسید
                  </label>
                  <div class="flex gap-3">
                    <BaseTextarea
                      v-model="newIdea"
                      placeholder="ایده، سؤال، یا مفهوم خود را اینجا بنویسید..."
                      rows="3"
                      shape="curved"
                      class="flex-1"
                      @keyup.ctrl.enter="addIdea"
                    />
                    <BaseButton
                      :color="technique.color"
                      shape="curved"
                      :disabled="!newIdea.trim()"
                      @click="addIdea"
                    >
                      <Icon name="ph:plus-circle" class="ml-2 size-5" />
                      افزودن
                    </BaseButton>
                  </div>
                  <div class="text-muted-500 mt-2 text-xs">
                    <Icon name="ph:keyboard" class="ml-1 inline size-3" />
                    Ctrl + Enter برای افزودن سریع
                  </div>
                </div>
              </div>
            </div>

            <!-- No Technique Selected -->
            <div
              v-else
              class="dark:bg-muted-800 dark:border-muted-700 flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8"
            >
              <div class="text-center">
                <div class="bg-muted-100 dark:bg-muted-900 mx-auto mb-4 flex size-20 items-center justify-center rounded-full">
                  <Icon name="ph:selection-plus" class="text-muted-400 size-10" />
                </div>
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="text-muted-700 dark:text-muted-300 mb-2"
                >
                  یک تکنیک را انتخاب کنید
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500">
                  از لیست سمت چپ، یک تکنیک خلاقیت را انتخاب کنید تا شروع به تولید ایده کنید
                </BaseParagraph>
              </div>
            </div>

            <!-- Ideas List -->
            <div
              v-if="ideas.length > 0"
              class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8"
            >
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <BaseHeading
                    as="h3"
                    size="lg"
                    weight="semibold"
                    class="text-gray-900 dark:text-white"
                  >
                    ایده‌های تولید شده
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500 mt-1">
                    {{ ideas.length }} ایده ثبت شده
                  </BaseParagraph>
                </div>
                <BaseButton
                  color="muted"
                  shape="curved"
                  size="sm"
                  @click="exportIdeas"
                >
                  <Icon name="ph:download-simple" class="ml-2 size-4" />
                  دانلود
                </BaseButton>
              </div>

              <div class="space-y-3">
                <div
                  v-for="idea in ideas"
                  :key="idea.id"
                  class="dark:border-muted-700 dark:bg-muted-900/30 group relative rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div class="mb-3 flex items-start justify-between gap-3">
                    <BaseTag
                      :color="getTechniqueColor(idea.technique)"
                      size="sm"
                      shape="full"
                    >
                      {{ getTechniqueName(idea.technique) }}
                    </BaseTag>
                    <button
                      class="text-muted-400 hover:text-danger-500 opacity-0 transition-all duration-200 group-hover:opacity-100"
                      @click="removeIdea(idea.id)"
                    >
                      <Icon name="ph:trash" class="size-5" />
                    </button>
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
          </div>
        </div>

        <!-- Tips Box -->
        <div class="bg-info-500/10 dark:bg-info-500/20 border-info-500/20 mt-8 rounded-2xl border-2 p-6">
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

        <!-- Navigation Buttons -->
        <div class="mt-8 flex items-center justify-between">
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
</template>
