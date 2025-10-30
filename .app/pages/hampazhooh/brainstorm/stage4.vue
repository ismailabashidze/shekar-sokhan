<script setup lang="ts">
  interface FeedbackArea {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning';
    questions: string[];
  }

  interface Tool {
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success';
  }

  interface ChecklistItem {
    id: string;
    question: string;
    checked: boolean;
  }

  interface JournalEntry {
    id: string;
    date: Date;
    title: string;
    content: string;
    stage: string;
  }

  definePageMeta({
    title: 'مرحله ۴: بازخورد و تکرار',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();

  const feedbackAreas: FeedbackArea[] = [
    {
      id: 'conceptual',
      title: 'بازبینی مفهومی',
      description: 'بررسی قاب مفهومی و تعریف مسئله',
      icon: 'ph:brain',
      color: 'primary',
      questions: [
        'آیا سؤال تحقیق به اندازه کافی واضح است؟',
        'آیا حوزه پژوهش به درستی تعریف شده؟',
        'آیا محدودیت‌ها و فرصت‌ها کامل هستند؟',
      ],
    },
    {
      id: 'ideas',
      title: 'بازبینی ایده‌ها',
      description: 'ارزیابی تنوع و عمق ایده‌های تولید شده',
      icon: 'ph:lightbulb',
      color: 'info',
      questions: [
        'آیا تنوع کافی در ایده‌ها وجود دارد؟',
        'آیا از تکنیک‌های مختلف استفاده شده؟',
        'آیا ایده‌های غیرمعمول نیز در نظر گرفته شده‌اند؟',
      ],
    },
    {
      id: 'evaluation',
      title: 'بازبینی ارزیابی',
      description: 'بررسی معیارها و نتایج ارزیابی',
      icon: 'ph:chart-bar',
      color: 'success',
      questions: [
        'آیا معیارهای ارزیابی مناسب بودند؟',
        'آیا امتیازدهی منصفانه و واقع‌بینانه بوده؟',
        'آیا ایده‌های برتر واقعاً قابل اجرا هستند؟',
      ],
    },
    {
      id: 'methodology',
      title: 'بازبینی روش‌شناختی',
      description: 'ارزیابی رویکرد پژوهشی انتخاب شده',
      icon: 'ph:path',
      color: 'warning',
      questions: [
        'آیا رویکرد پژوهشی با نوع مسئله همخوانی دارد؟',
        'آیا روش‌های جمع‌آوری داده مناسب هستند؟',
        'آیا ابزارهای تحلیل به درستی انتخاب شده‌اند؟',
      ],
    },
  ];

  const tools: Tool[] = [
    {
      title: 'جلسهٔ Peer Review',
      description: 'دریافت بازخورد از همکاران و همتایان (حتی ۱۵ دقیقه)',
      icon: 'ph:users-three',
      color: 'primary',
    },
    {
      title: 'فهرست چک‌لیست بازخورد',
      description: 'استفاده از چک‌لیست ساختاریافته برای بازبینی',
      icon: 'ph:checklist',
      color: 'info',
    },
    {
      title: 'روزنوشتهٔ فرایند',
      description: 'ثبت تصمیمات، تغییرات و یادگیری‌ها',
      icon: 'ph:notebook',
      color: 'success',
    },
  ];

  const checklist = ref<ChecklistItem[]>([
    { id: '1', question: 'آیا کلیدواژه‌ها پوشش کامل دارند؟', checked: false },
    { id: '2', question: 'آیا رویکرد پژوهشی مناسب است؟', checked: false },
    { id: '3', question: 'آیا اهداف واضح و قابل اندازه‌گیری هستند؟', checked: false },
    { id: '4', question: 'آیا منابع مورد نیاز شناسایی شده‌اند؟', checked: false },
    { id: '5', question: 'آیا جدول زمانی واقع‌بینانه است؟', checked: false },
    { id: '6', question: 'آیا ملاحظات اخلاقی در نظر گرفته شده‌اند؟', checked: false },
    { id: '7', question: 'آیا شکاف‌های دانشی شناسایی شده‌اند؟', checked: false },
    { id: '8', question: 'آیا نتایج قابل اندازه‌گیری و ارزیابی هستند؟', checked: false },
  ]);

  const journalEntries = ref<JournalEntry[]>([
    {
      id: '1',
      date: new Date(),
      title: 'تصمیم اولیه درباره حوزه پژوهش',
      content: 'پس از بررسی، تصمیم گرفتیم روی تأثیر فناوری بر رفتار انسانی تمرکز کنیم...',
      stage: 'مرحله ۱',
    },
  ]);

  const newJournalTitle = ref('');
  const newJournalContent = ref('');

  const completedChecks = computed(() => {
    return checklist.value.filter(item => item.checked).length;
  });

  const checklistProgress = computed(() => {
    return (completedChecks.value / checklist.value.length) * 100;
  });

  const addJournalEntry = () => {
    if (newJournalTitle.value.trim() && newJournalContent.value.trim()) {
      journalEntries.value.unshift({
        id: Date.now().toString(),
        date: new Date(),
        title: newJournalTitle.value.trim(),
        content: newJournalContent.value.trim(),
        stage: 'مرحله ۴',
      });
      newJournalTitle.value = '';
      newJournalContent.value = '';
    }
  };

  const goBackToStage = (stageNumber: number) => {
    router.push(`/hampazhooh/brainstorm/stage${stageNumber}`);
  };

  const completeCycle = () => {
    router.push('/hampazhooh/brainstorm');
  };

  const exportJournal = () => {
    // Implementation for exporting journal
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
            @click="goBackToStage(3)"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            مرحله قبل
          </BaseButton>
          <div class="flex-1">
            <div class="mb-2 flex items-center gap-3">
              <div class="bg-warning-500 shadow-warning-500/30 flex size-12 items-center justify-center rounded-xl shadow-lg">
                <Icon name="ph:arrows-clockwise" class="size-6 text-white" />
              </div>
              <div>
                <div class="text-warning-500 mb-1 text-xs font-semibold uppercase tracking-wider">
                  مرحله ۴
                </div>
                <BaseHeading
                  as="h1"
                  size="2xl"
                  weight="bold"
                  class="text-gray-900 dark:text-white"
                >
                  بازخورد و تکرار
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  Feedback & Iteration
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
              در این مرحله، کل فرایند را بازبینی می‌کنیم، شکاف‌های مفهومی را شناسایی کرده و در صورت نیاز به مراحل قبل بازمی‌گردیم. این چرخه بازخوردی به بهبود مستمر کمک می‌کند.
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
                <Icon name="ph:eye-fill" class="text-warning-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    بازبینی انتقادی
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    نگاه دقیق به تمام مراحل
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:arrows-counter-clockwise-fill" class="text-warning-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    بازگشت و تعمیق
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    بازگشت به مراحل قبل
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:trend-up-fill" class="text-warning-500 mt-0.5 size-5 shrink-0" />
                <div>
                  <div class="text-muted-700 dark:text-muted-200 mb-1 text-sm font-semibold">
                    بهبود مستمر
                  </div>
                  <div class="text-muted-600 dark:text-muted-400 text-xs">
                    یادگیری و تکامل
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback Areas -->
        <div class="mb-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="text-gray-900 dark:text-white"
            >
              حوزه‌های بازخورد
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 mt-1">
              هر حوزه را با دقت بررسی کنید
            </BaseParagraph>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <div
              v-for="area in feedbackAreas"
              :key="area.id"
              class="dark:bg-muted-800 dark:border-muted-700 group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl"
            >
              <div class="mb-4 flex items-start gap-4">
                <div
                  :class="[
                    'flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                    `bg-${area.color}-500/10`,
                  ]"
                >
                  <Icon
                    :name="area.icon"
                    :class="[`text-${area.color}-500`, 'size-7']"
                  />
                </div>
                <div class="flex-1">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    class="mb-1 text-gray-900 dark:text-white"
                  >
                    {{ area.title }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    {{ area.description }}
                  </BaseParagraph>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-3">
                <div
                  v-for="(question, idx) in area.questions"
                  :key="idx"
                  class="text-muted-700 dark:text-muted-300 flex items-start gap-2 text-sm"
                >
                  <Icon
                    name="ph:question"
                    :class="[`text-${area.color}-500`, 'mt-0.5 size-4 shrink-0']"
                  />
                  <span>{{ question }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checklist -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="semibold"
                class="text-gray-900 dark:text-white"
              >
                چک‌لیست بازخورد
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mt-1">
                {{ completedChecks }} از {{ checklist.length }} مورد تکمیل شده
              </BaseParagraph>
            </div>
            <div class="text-left">
              <div class="text-warning-500 text-3xl font-bold">
                {{ Math.round(checklistProgress) }}%
              </div>
              <div class="text-muted-500 text-xs">
                پیشرفت
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-6">
            <BaseProgressbar
              :value="checklistProgress"
              color="warning"
              size="md"
              shape="full"
            />
          </div>

          <!-- Checklist Items -->
          <div class="space-y-3">
            <div
              v-for="item in checklist"
              :key="item.id"
              :class="[
                'dark:border-muted-700 flex items-center gap-4 rounded-xl border p-4 transition-all duration-200',
                item.checked
                  ? 'border-success-500/30 bg-success-500/5'
                  : 'dark:bg-muted-900/30 border-gray-100 bg-gray-50 hover:border-gray-200',
              ]"
            >
              <BaseSwitchThin
                v-model="item.checked"
                color="success"
              />
              <label
                :class="[
                  'flex-1 cursor-pointer text-sm transition-colors',
                  item.checked
                    ? 'text-success-700 dark:text-success-400 line-through'
                    : 'text-muted-700 dark:text-muted-200',
                ]"
                @click="item.checked = !item.checked"
              >
                {{ item.question }}
              </label>
              <Icon
                v-if="item.checked"
                name="ph:check-circle-fill"
                class="text-success-500 size-5"
              />
            </div>
          </div>
        </div>

        <!-- Process Journal -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="semibold"
                class="text-gray-900 dark:text-white"
              >
                روزنوشتهٔ فرایند
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 mt-1">
                تصمیمات، تغییرات و یادگیری‌های خود را ثبت کنید
              </BaseParagraph>
            </div>
            <BaseButton
              color="muted"
              shape="curved"
              size="sm"
              @click="exportJournal"
            >
              <Icon name="ph:download-simple" class="ml-2 size-4" />
              دانلود
            </BaseButton>
          </div>

          <!-- Add New Entry Form -->
          <div class="dark:border-muted-700 dark:bg-muted-900/50 mb-6 rounded-xl border border-gray-100 bg-gray-50 p-6">
            <div class="mb-4">
              <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">
                عنوان یادداشت
              </label>
              <BaseInput
                v-model="newJournalTitle"
                placeholder="مثال: تغییر در سؤال تحقیق"
                shape="curved"
                :classes="{ input: 'h-12' }"
              />
            </div>
            <div class="mb-4">
              <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">
                محتوای یادداشت
              </label>
              <BaseTextarea
                v-model="newJournalContent"
                placeholder="تصمیمات، دلایل، و یادگیری‌های خود را بنویسید..."
                rows="4"
                shape="curved"
              />
            </div>
            <BaseButton
              color="warning"
              shape="curved"
              :disabled="!newJournalTitle.trim() || !newJournalContent.trim()"
              @click="addJournalEntry"
            >
              <Icon name="ph:plus-circle" class="ml-2 size-5" />
              افزودن یادداشت
            </BaseButton>
          </div>

          <!-- Journal Entries -->
          <div class="space-y-4">
            <div
              v-for="entry in journalEntries"
              :key="entry.id"
              class="dark:border-muted-700 dark:bg-muted-900/30 rounded-xl border border-gray-100 bg-white p-6"
            >
              <div class="mb-3 flex items-start justify-between">
                <div class="flex-1">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="semibold"
                    class="mb-1 text-gray-900 dark:text-white"
                  >
                    {{ entry.title }}
                  </BaseHeading>
                  <div class="text-muted-500 flex items-center gap-3 text-xs">
                    <span>{{ new Date(entry.date).toLocaleDateString('fa-IR') }}</span>
                    <span>•</span>
                    <BaseTag
                      color="warning"
                      size="sm"
                      shape="full"
                    >
                      {{ entry.stage }}
                    </BaseTag>
                  </div>
                </div>
              </div>
              <div class="text-muted-700 dark:text-muted-300 whitespace-pre-line text-sm leading-relaxed">
                {{ entry.content }}
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
              از این ابزارها برای دریافت بازخورد استفاده کنید
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

        <!-- Return to Stages -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 rounded-2xl border border-gray-200 bg-white p-8">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="xl"
              weight="semibold"
              class="mb-2 text-gray-900 dark:text-white"
            >
              بازگشت به مراحل قبل
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              اگر نیاز به تعمیق یا اصلاح دارید، به مرحله مورد نظر بازگردید
            </BaseParagraph>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <BaseButton
              color="primary"
              shape="curved"
              class="justify-start"
              @click="goBackToStage(1)"
            >
              <Icon name="ph:arrow-bend-up-left" class="ml-2 size-5" />
              بازگشت به مرحله ۱
            </BaseButton>
            <BaseButton
              color="info"
              shape="curved"
              class="justify-start"
              @click="goBackToStage(2)"
            >
              <Icon name="ph:arrow-bend-up-left" class="ml-2 size-5" />
              بازگشت به مرحله ۲
            </BaseButton>
            <BaseButton
              color="success"
              shape="curved"
              class="justify-start"
              @click="goBackToStage(3)"
            >
              <Icon name="ph:arrow-bend-up-left" class="ml-2 size-5" />
              بازگشت به مرحله ۳
            </BaseButton>
          </div>
        </div>

        <!-- Tips Box -->
        <div class="bg-warning-500/10 dark:bg-warning-500/20 border-warning-500/20 mb-8 rounded-2xl border-2 p-6">
          <div class="flex items-start gap-4">
            <div class="bg-warning-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
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
                  <Icon name="ph:dot-outline-fill" class="text-warning-500 mt-1 size-4 shrink-0" />
                  <span>بازخورد از دیگران می‌تواند دیدگاه‌های تازه‌ای ارائه دهد که خودتان متوجه نشده‌اید.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-warning-500 mt-1 size-4 shrink-0" />
                  <span>برگشت به مراحل قبل نشانه ضعف نیست، بلکه نشان از رشد و یادگیری است.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-warning-500 mt-1 size-4 shrink-0" />
                  <span>روزنوشت فرایند در آینده برای شما و دیگران بسیار ارزشمند خواهد بود.</span>
                </li>
                <li class="flex items-start gap-2">
                  <Icon name="ph:dot-outline-fill" class="text-warning-500 mt-1 size-4 shrink-0" />
                  <span>هر چرخه تکرار، پژوهش شما را قوی‌تر و عمیق‌تر می‌کند.</span>
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
            @click="goBackToStage(3)"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            مرحله قبل
          </BaseButton>
          <BaseButton
            color="success"
            shape="curved"
            size="lg"
            class="shadow-success-500/30 shadow-lg"
            @click="completeCycle"
          >
            <Icon name="ph:check-circle" class="ml-2 size-5" />
            تکمیل چرخه
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
