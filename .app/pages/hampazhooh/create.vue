<script setup lang="ts">
  interface ProjectType {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning';
  }

  interface FormData {
    projectType: string;
    title: string;
    description: string;
    category: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    institution: string;
    keywords: string[];
    objectives: string;
    methodology: string;
    ethicsApproval: boolean;
    fundingSource: string;
  }

  definePageMeta({
    title: 'ایجاد پروژه جدید',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();

  const currentStep = ref(1);
  const totalSteps = 5;
  const isBrainstorming = ref(false);
  const brainstormResults = ref('');

  const formData = ref<FormData>({
    projectType: '',
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    maxParticipants: 50,
    institution: '',
    keywords: [],
    objectives: '',
    methodology: '',
    ethicsApproval: false,
    fundingSource: '',
  });

  const projectTypes: ProjectType[] = [
    {
      id: 'project',
      title: 'پروژه',
      description: 'پروژه پژوهشی عمومی با اهداف مشخص و محدودیت زمانی',
      icon: 'ph:folder-open',
      color: 'primary',
    },
    {
      id: 'doctoral',
      title: 'رساله دکتری',
      description: 'رساله دکتری با نیاز به تحقیق عمیق و مستند',
      icon: 'ph:graduation-cap',
      color: 'info',
    },
    {
      id: 'masters',
      title: 'پایان‌نامه کارشناسی ارشد',
      description: 'تحقیق جامع در سطح کارشناسی ارشد با نظارت استاد راهنما',
      icon: 'ph:student',
      color: 'success',
    },
    {
      id: 'article',
      title: 'اقدام پژوهشی برای تولید مقاله',
      description: 'تحقیق کوچک‌تر با هدف انتشار مقاله علمی',
      icon: 'ph:article',
      color: 'warning',
    },
  ];

  const categoryOptions = ['روانشناسی بالینی', 'روانشناسی اجتماعی', 'روانشناسی رشد', 'سلامت روان', 'روانشناسی شناختی'];

  const steps = computed(() => [
    { number: 1, title: 'نوع پروژه', completed: currentStep.value > 1 },
    { number: 2, title: 'طوفان فکری', completed: currentStep.value > 2 },
    { number: 3, title: 'اطلاعات اولیه', completed: currentStep.value > 3 },
    { number: 4, title: 'جزئیات پژوهش', completed: currentStep.value > 4 },
    { number: 5, title: 'بررسی و ثبت', completed: currentStep.value > 5 },
  ]);

  const canGoNext = computed(() => {
    if (currentStep.value === 1) return formData.value.projectType !== '';
    if (currentStep.value === 2) return true;
    if (currentStep.value === 3) {
      return formData.value.title && formData.value.description && formData.value.category;
    }
    if (currentStep.value === 4) {
      return formData.value.objectives && formData.value.methodology;
    }
    return true;
  });

  const selectProjectType = (typeId: string) => {
    formData.value.projectType = typeId;
  };

  const nextStep = () => {
    if (canGoNext.value && currentStep.value < totalSteps) {
      currentStep.value++;
    }
  };

  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  const submitForm = () => {
    toaster.show({
      title: 'موفق',
      message: 'پروژه با موفقیت ایجاد شد',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    });
    router.push('/hampazhooh/projects');
  };

  const cancelForm = () => {
    router.push('/hampazhooh/projects');
  };

  const newKeyword = ref('');
  const addKeyword = () => {
    if (newKeyword.value.trim() && !formData.value.keywords.includes(newKeyword.value.trim())) {
      formData.value.keywords.push(newKeyword.value.trim());
      newKeyword.value = '';
    }
  };

  const removeKeyword = (index: number) => {
    formData.value.keywords.splice(index, 1);
  };

  const startBrainstorm = async () => {
    isBrainstorming.value = true;

    // Simulate AI brainstorming
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const projectTypeName = projectTypes.find((t) => t.id === formData.value.projectType)?.title || '';

    brainstormResults.value = `بر اساس نوع پروژه "${projectTypeName}"، در اینجا چند ایده و پیشنهاد برای شروع پژوهش شما:

🎯 پیشنهادات موضوعی:
• بررسی تأثیر فناوری‌های نوین بر رفتار انسانی
• مطالعه الگوهای تعاملی در محیط‌های مجازی
• تحلیل عوامل موثر بر بهره‌وری و سلامت روان

📚 رویکردهای پژوهشی پیشنهادی:
• استفاده از روش‌های ترکیبی (کمی و کیفی)
• مطالعات طولی برای بررسی روند تغییرات
• استفاده از تکنیک‌های نوین جمع‌آوری داده

💡 نکات کلیدی:
• تعریف دقیق جامعه آماری
• انتخاب ابزارهای معتبر سنجش
• در نظر گرفتن ملاحظات اخلاقی

🔍 کلیدواژه‌های پیشنهادی:
روانشناسی، رفتار، مداخله، اثربخشی، سلامت روان`;

    isBrainstorming.value = false;
  };
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div>
              <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
                ایجاد پروژه پژوهشی جدید
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400 mt-1">
                مراحل ایجاد پروژه را با دقت تکمیل کنید
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps Indicator -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div class="flex items-center justify-between">
            <div v-for="(step, index) in steps" :key="step.number" class="flex flex-1 items-center">
              <!-- Step Circle -->
              <div class="relative flex flex-col items-center">
                <div
                  :class="[
                    'flex size-12 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300',
                    currentStep === step.number
                      ? 'border-primary-500 bg-primary-500 shadow-primary-500/30 text-white shadow-lg'
                      : step.completed
                      ? 'border-success-500 bg-success-500 text-white'
                      : 'dark:border-muted-600 dark:bg-muted-800 dark:text-muted-400 border-gray-300 bg-gray-50 text-gray-400',
                  ]"
                >
                  <Icon v-if="step.completed" name="ph:check-bold" class="size-6" />
                  <span v-else>{{ step.number }}</span>
                </div>
                <span
                  :class="[
                    'mt-2 text-sm font-medium transition-colors duration-200',
                    currentStep === step.number
                      ? 'text-primary-500'
                      : step.completed
                      ? 'text-success-500'
                      : 'text-muted-400',
                  ]"
                >
                  {{ step.title }}
                </span>
              </div>

              <!-- Connector Line -->
              <div
                v-if="index < steps.length - 1"
                :class="[
                  'mx-4 h-0.5 flex-1 transition-colors duration-300',
                  step.completed ? 'bg-success-500' : 'dark:bg-muted-700 bg-gray-200',
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl">
        <!-- Step 1: Project Type Selection -->
        <div v-if="currentStep === 1" class="animate-fade-in">
          <div class="mb-8 text-center">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              نوع پروژه خود را انتخاب کنید
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              نوع پروژه به شما در تنظیم بهتر جزئیات و الزامات کمک می‌کند
            </BaseParagraph>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div
              v-for="type in projectTypes"
              :key="type.id"
              :class="[
                'dark:bg-muted-800 dark:border-muted-700 group relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-white p-6 transition-all duration-300',
                formData.projectType === type.id
                  ? 'border-primary-500 shadow-primary-500/20 ring-primary-500/10 shadow-xl ring-4'
                  : 'hover:border-primary-300 border-gray-200 hover:shadow-lg',
              ]"
              @click="selectProjectType(type.id)"
            >
              <!-- Selected Indicator -->
              <div
                v-if="formData.projectType === type.id"
                class="bg-primary-500 absolute left-4 top-4 flex size-8 items-center justify-center rounded-full shadow-lg"
              >
                <Icon name="ph:check-bold" class="size-5 text-white" />
              </div>

              <!-- Icon -->
              <div
                :class="[
                  'mb-4 flex size-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                  `bg-${type.color}-500/10`,
                ]"
              >
                <Icon :name="type.icon" :class="[`text-${type.color}-500`, 'size-8']" />
              </div>

              <!-- Content -->
              <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                {{ type.title }}
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                {{ type.description }}
              </BaseParagraph>
            </div>
          </div>
        </div>

        <!-- Step 2: Brainstorm -->
        <div v-if="currentStep === 2" class="animate-fade-in">
          <div class="mb-8 text-center">
            <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
              طوفان فکری برای پروژه شما
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              با استفاده از هوش مصنوعی، ایده‌ها و پیشنهادات مرتبط با پروژه خود را دریافت کنید
            </BaseParagraph>
          </div>

          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <!-- Brainstorm Info Card -->
            <div v-if="!brainstormResults" class="mb-6">
              <div class="bg-primary-500/10 dark:bg-primary-500/20 mb-6 rounded-xl p-6">
                <div class="flex items-start gap-4">
                  <div class="bg-primary-500 flex size-12 shrink-0 items-center justify-center rounded-xl">
                    <Icon name="ph:lightbulb-fill" class="size-6 text-white" />
                  </div>
                  <div class="flex-1">
                    <BaseHeading as="h3" size="md" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                      چرا طوفان فکری؟
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-3">
                      طوفان فکری به شما کمک می‌کند تا:
                    </BaseParagraph>
                    <ul class="text-muted-600 dark:text-muted-300 mr-6 space-y-2 text-sm">
                      <li class="flex items-start gap-2">
                        <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-4 shrink-0" />
                        <span>ایده‌های خلاقانه و نوآورانه برای موضوع پژوهش پیدا کنید</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-4 shrink-0" />
                        <span>رویکردهای پژوهشی متناسب با نوع پروژه خود را بشناسید</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <Icon name="ph:check-circle-fill" class="text-primary-500 mt-0.5 size-4 shrink-0" />
                        <span>کلیدواژه‌ها و مفاهیم مرتبط را کشف کنید</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Brainstorm Buttons -->
              <div class="flex flex-col items-center gap-4">
                <BaseButton
                  color="primary"
                  shape="curved"
                  size="xl"
                  :loading="isBrainstorming"
                  :disabled="isBrainstorming"
                  class="shadow-primary-500/30 shadow-xl"
                  @click="startBrainstorm"
                >
                  <Icon name="ph:sparkle-fill" class="ml-2 size-6" />
                  شروع طوفان فکری سریع
                </BaseButton>

                <div class="flex items-center gap-3">
                  <div class="dark:bg-muted-700 h-px flex-1 bg-gray-300" />
                  <span class="text-muted-500 text-sm">یا</span>
                  <div class="dark:bg-muted-700 h-px flex-1 bg-gray-300" />
                </div>

                <BaseButton color="info" shape="curved" size="lg" @click="router.push('/hampazhooh/brainstorm')">
                  <Icon name="ph:circles-four" class="ml-2 size-5" />
                  استفاده از چارچوب پیشرفته RDC
                </BaseButton>
                <BaseParagraph size="xs" class="text-muted-500 max-w-md text-center">
                  چارچوب چهار مرحله‌ای کشف پژوهشی با ابزارها و تکنیک‌های ساختاریافته
                </BaseParagraph>
              </div>
            </div>

            <!-- Brainstorm Results -->
            <div v-else class="space-y-4">
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-success-500/10 flex size-10 items-center justify-center rounded-xl">
                    <Icon name="ph:check-circle-fill" class="text-success-500 size-5" />
                  </div>
                  <div>
                    <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-900 dark:text-white">
                      نتایج طوفان فکری
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-500">پیشنهادات هوش مصنوعی برای پروژه شما</BaseParagraph>
                  </div>
                </div>
                <BaseButton color="muted" shape="curved" size="sm" @click="brainstormResults = ''">
                  <Icon name="ph:arrows-counter-clockwise" class="ml-1 size-4" />
                  طوفان فکری مجدد
                </BaseButton>
              </div>

              <div class="dark:bg-muted-900/50 dark:border-muted-700 rounded-xl border border-gray-100 bg-gray-50 p-6">
                <div class="text-muted-700 dark:text-muted-200 whitespace-pre-line text-sm leading-relaxed">
                  {{ brainstormResults }}
                </div>
              </div>

              <div class="bg-info-500/10 dark:bg-info-500/20 mt-6 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <Icon name="ph:info-fill" class="text-info-500 mt-0.5 size-5 shrink-0" />
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                    این پیشنهادات به عنوان نقطه شروع طراحی شده‌اند. می‌توانید در مراحل بعدی آن‌ها را سفارشی‌سازی کنید.
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Basic Information -->
        <div v-if="currentStep === 3" class="animate-fade-in">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6">
              <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                اطلاعات اولیه پروژه
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">اطلاعات پایه پروژه پژوهشی خود را وارد کنید</BaseParagraph>
            </div>

            <div class="space-y-6">
              <!-- Title -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">عنوان پروژه *</label>
                <BaseInput
                  v-model="formData.title"
                  placeholder="عنوان کامل پروژه را وارد کنید"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">توضیحات پروژه *</label>
                <BaseTextarea
                  v-model="formData.description"
                  placeholder="توضیحات کامل درباره پروژه، اهداف و نتایج مورد انتظار را بنویسید"
                  rows="4"
                  shape="curved"
                />
              </div>

              <!-- Category -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">دسته‌بندی *</label>
                <BaseListbox
                  v-model="formData.category"
                  :items="categoryOptions"
                  placeholder="دسته‌بندی را انتخاب کنید"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                />
              </div>

              <!-- Dates Row -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">تاریخ شروع</label>
                  <BaseInput v-model="formData.startDate" type="date" shape="curved" :classes="{ input: 'h-12' }" />
                </div>
                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">تاریخ پایان</label>
                  <BaseInput v-model="formData.endDate" type="date" shape="curved" :classes="{ input: 'h-12' }" />
                </div>
              </div>

              <!-- Institution & Participants -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">
                    سازمان/دانشگاه
                  </label>
                  <BaseInput
                    v-model="formData.institution"
                    placeholder="نام سازمان یا دانشگاه"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                  />
                </div>
                <div>
                  <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">
                    حداکثر شرکت‌کنندگان
                  </label>
                  <BaseInput
                    v-model="formData.maxParticipants"
                    type="number"
                    placeholder="تعداد"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Research Details -->
        <div v-if="currentStep === 4" class="animate-fade-in">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6">
              <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                جزئیات پژوهش
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                اطلاعات تکمیلی و جزئیات علمی پروژه را وارد کنید
              </BaseParagraph>
            </div>

            <div class="space-y-6">
              <!-- Keywords -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">کلیدواژه‌ها</label>
                <div class="flex gap-2">
                  <BaseInput
                    v-model="newKeyword"
                    placeholder="کلیدواژه را وارد کنید"
                    shape="curved"
                    :classes="{ input: 'h-12' }"
                    class="flex-1"
                    @keyup.enter="addKeyword"
                  />
                  <BaseButton color="primary" shape="curved" @click="addKeyword">
                    <Icon name="ph:plus" class="ml-1 size-5" />
                    افزودن
                  </BaseButton>
                </div>
                <div v-if="formData.keywords.length > 0" class="mt-3 flex flex-wrap gap-2">
                  <BaseTag
                    v-for="(keyword, index) in formData.keywords"
                    :key="index"
                    color="primary"
                    size="sm"
                    shape="full"
                    class="cursor-pointer"
                    @click="removeKeyword(index)"
                  >
                    {{ keyword }}
                    <Icon name="ph:x" class="mr-1 size-3" />
                  </BaseTag>
                </div>
              </div>

              <!-- Objectives -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">اهداف پژوهش *</label>
                <BaseTextarea
                  v-model="formData.objectives"
                  placeholder="اهداف اصلی و فرعی پژوهش را شرح دهید"
                  rows="4"
                  shape="curved"
                />
              </div>

              <!-- Methodology -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">روش‌شناسی *</label>
                <BaseTextarea
                  v-model="formData.methodology"
                  placeholder="روش‌های تحقیق و گردآوری داده را توضیح دهید"
                  rows="4"
                  shape="curved"
                />
              </div>

              <!-- Funding Source -->
              <div>
                <label class="text-muted-700 dark:text-muted-200 mb-2 block text-sm font-medium">منبع تامین مالی</label>
                <BaseInput
                  v-model="formData.fundingSource"
                  placeholder="نام سازمان یا منبع تامین مالی"
                  shape="curved"
                  :classes="{ input: 'h-12' }"
                />
              </div>

              <!-- Ethics Approval -->
              <div class="dark:bg-muted-700/50 flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <label class="text-muted-700 dark:text-muted-200 block text-sm font-medium">تایید کمیته اخلاق</label>
                  <BaseParagraph size="xs" class="text-muted-500 mt-1">
                    آیا این پژوهش نیاز به تایید کمیته اخلاق دارد؟
                  </BaseParagraph>
                </div>
                <BaseSwitchThin v-model="formData.ethicsApproval" color="primary" />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Review -->
        <div v-if="currentStep === 5" class="animate-fade-in">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8">
            <div class="mb-6">
              <BaseHeading as="h2" size="xl" weight="semibold" class="mb-2 text-gray-900 dark:text-white">
                بررسی نهایی
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                اطلاعات وارد شده را بررسی کرده و در صورت صحت بودن، پروژه را ثبت کنید
              </BaseParagraph>
            </div>

            <div class="space-y-6">
              <!-- Project Type -->
              <div class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                <div class="text-muted-500 mb-1 text-xs font-medium">نوع پروژه</div>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ projectTypes.find((t) => t.id === formData.projectType)?.title }}
                </div>
              </div>

              <!-- Title -->
              <div class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                <div class="text-muted-500 mb-1 text-xs font-medium">عنوان</div>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ formData.title }}
                </div>
              </div>

              <!-- Description -->
              <div class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                <div class="text-muted-500 mb-1 text-xs font-medium">توضیحات</div>
                <div class="text-muted-700 dark:text-muted-300 text-sm">
                  {{ formData.description }}
                </div>
              </div>

              <!-- Details Grid -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                  <div class="text-muted-500 mb-1 text-xs font-medium">دسته‌بندی</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formData.category }}
                  </div>
                </div>
                <div class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                  <div class="text-muted-500 mb-1 text-xs font-medium">سازمان</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formData.institution || '-' }}
                  </div>
                </div>
                <div class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                  <div class="text-muted-500 mb-1 text-xs font-medium">تاریخ شروع</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formData.startDate || '-' }}
                  </div>
                </div>
                <div class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                  <div class="text-muted-500 mb-1 text-xs font-medium">حداکثر شرکت‌کنندگان</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formData.maxParticipants }}
                  </div>
                </div>
              </div>

              <!-- Keywords -->
              <div
                v-if="formData.keywords.length > 0"
                class="dark:border-muted-700 rounded-xl border border-gray-100 p-4"
              >
                <div class="text-muted-500 mb-2 text-xs font-medium">کلیدواژه‌ها</div>
                <div class="flex flex-wrap gap-2">
                  <BaseTag v-for="keyword in formData.keywords" :key="keyword" color="primary" size="sm" shape="full">
                    {{ keyword }}
                  </BaseTag>
                </div>
              </div>

              <!-- Objectives -->
              <div v-if="formData.objectives" class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                <div class="text-muted-500 mb-1 text-xs font-medium">اهداف پژوهش</div>
                <div class="text-muted-700 dark:text-muted-300 text-sm">
                  {{ formData.objectives }}
                </div>
              </div>

              <!-- Methodology -->
              <div v-if="formData.methodology" class="dark:border-muted-700 rounded-xl border border-gray-100 p-4">
                <div class="text-muted-500 mb-1 text-xs font-medium">روش‌شناسی</div>
                <div class="text-muted-700 dark:text-muted-300 text-sm">
                  {{ formData.methodology }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 flex items-center justify-between">
          <BaseButton v-if="currentStep > 1" color="muted" shape="curved" size="lg" @click="previousStep">
            <Icon name="ph:arrow-right" class="ml-2 size-5" />
            مرحله قبل
          </BaseButton>
          <div v-else />

          <div class="flex gap-3">
            <BaseButton color="muted" shape="curved" size="lg" @click="cancelForm">انصراف</BaseButton>
            <BaseButton
              v-if="currentStep < totalSteps"
              color="primary"
              shape="curved"
              size="lg"
              :disabled="!canGoNext"
              class="shadow-primary-500/30 shadow-lg"
              @click="nextStep"
            >
              مرحله بعد
              <Icon name="ph:arrow-left" class="mr-2 size-5" />
            </BaseButton>
            <BaseButton
              v-else
              color="success"
              shape="curved"
              size="lg"
              class="shadow-success-500/30 shadow-lg"
              @click="submitForm"
            >
              <Icon name="ph:check-circle" class="ml-2 size-5" />
              ثبت پروژه
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
