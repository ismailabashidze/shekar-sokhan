<template>
  <div class="relative">
    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-12 gap-6">
      <!-- Loading Header -->
      <div class="col-span-12">
        <div class="bg-primary-800 flex animate-pulse flex-col items-center rounded-2xl p-4 sm:flex-row">
          <div class="bg-primary-700/50 relative h-[168px] w-[280px] shrink-0" />
          <div class="mt-6 w-full grow sm:mt-0">
            <div class="flex flex-col gap-4 text-center sm:text-right">
              <div class="bg-primary-700/50 mx-auto h-8 w-1/2 rounded-md sm:mr-0" />
              <div class="bg-primary-700/50 mx-auto h-4 w-3/4 rounded-md sm:mr-0" />
              <div class="mt-6 flex flex-wrap gap-4 pb-4 sm:mt-4 sm:pb-0">
                <div class="flex-1">
                  <div class="bg-primary-700/50 h-16 rounded-md" />
                </div>
                <div class="flex-1">
                  <div class="bg-primary-700/50 h-16 rounded-md" />
                </div>
                <div class="flex-1">
                  <div class="bg-primary-700/50 h-16 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Content -->
      <div class="col-span-12 lg:col-span-8">
        <div class="animate-pulse">
          <div class="bg-muted-200 dark:bg-muted-800 mb-6 h-96 rounded-2xl" />
          <div class="bg-muted-200 dark:bg-muted-800 h-64 rounded-2xl" />
        </div>
      </div>

      <!-- Loading Sidebar -->
      <div class="col-span-12 lg:col-span-4">
        <div class="bg-muted-200 dark:bg-muted-800 h-[600px] animate-pulse rounded-2xl" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasData" class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <BaseCard class="p-10" shape="curved">
          <div class="flex flex-col items-center text-center">
            <img
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="No AI psychologist data"
              class="mb-6 w-72"
            >
            <BaseHeading
              tag="h2"
              size="2xl"
              weight="medium"
              class="text-muted-800 mb-2 dark:text-white"
            >
              پروفایل هوش مصنوعی روان‌شناس یافت نشد
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-400 mb-8">
              هنوز هیچ اطلاعاتی برای هوش مصنوعی روان‌شناس تنظیم نشده است. برای شروع، پروفایل جدید ایجاد کنید.
            </BaseParagraph>
            <BaseButton color="primary" @click="createProfile">
              <Icon name="ph:plus-circle-duotone" class="me-2 size-5" />
              ایجاد پروفایل جدید
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- AI Psychologist Profile Content -->
    <div v-else class="grid grid-cols-12 gap-6">
      <!-- Header -->
      <div class="col-span-12">
        <div class="from-primary-800 to-primary-600 flex flex-col items-center rounded-2xl bg-gradient-to-r p-4 sm:flex-row">
          <div class="relative h-[168px] w-[280px] shrink-0">
            <img
              class="pointer-events-none absolute -start-6 -top-20 sm:-start-10"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="AI Psychologist illustration"
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>🤖 {{ aiPsychologist.name }}</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-white opacity-60">
                <span>{{ aiPsychologist.specialization }}</span>
              </BaseParagraph>
              <div class="mt-6 flex flex-wrap gap-4 pb-4 text-center sm:mt-4 sm:pb-0 sm:text-right">
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">سابقه فعالیت</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ aiPsychologist.experience }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">تعداد جلسات</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ aiPsychologist.totalSessions }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">میزان موفقیت</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ aiPsychologist.successRate }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-span-12 lg:col-span-8">
        <!-- Session Goals Section -->
        <BaseCard class="mb-6 p-6" shape="curved">
          <div class="mb-4 flex items-center gap-3">
            <Icon name="ph:target-duotone" class="text-primary-500 size-6" />
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              اهداف جلسات مشاوره
            </BaseHeading>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              v-for="goal in sessionGoals"
              :key="goal.id"
              class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
            >
              <div class="flex items-start gap-3">
                <div class="text-primary-500 mt-1 shrink-0">
                  <Icon :name="goal.icon" class="size-5" />
                </div>
                <div class="flex-1">
                  <h4 class="text-muted-800 font-medium dark:text-white">
                    {{ goal.title }}
                  </h4>
                  <p class="text-muted-500 mt-1 text-sm">
                    {{ goal.description }}
                  </p>
                  <div class="mt-2 flex items-center gap-2">
                    <span class="bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400 rounded-full px-2 py-1 text-xs">
                      {{ goal.priority }}
                    </span>
                    <span class="text-muted-400 text-xs">
                      {{ goal.estimatedSessions }} جلسه
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Therapeutic Techniques Section -->
        <BaseCard class="mb-6 p-6" shape="curved">
          <div class="mb-4 flex items-center gap-3">
            <Icon name="ph:gear-duotone" class="text-primary-500 size-6" />
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              تکنیک‌های درمانی مورد استفاده
            </BaseHeading>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              v-for="technique in therapeuticTechniques"
              :key="technique.id"
              class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              <div class="text-center">
                <div class="text-primary-500 mb-3 flex justify-center">
                  <Icon :name="technique.icon" class="size-8" />
                </div>
                <h4 class="text-muted-800 mb-2 font-medium dark:text-white">
                  {{ technique.name }}
                </h4>
                <p class="text-muted-500 mb-3 text-sm">
                  {{ technique.description }}
                </p>
                <div class="flex flex-wrap justify-center gap-1">
                  <span
                    v-for="tag in technique.tags"
                    :key="tag"
                    class="bg-muted-100 text-muted-600 dark:bg-muted-800 dark:text-muted-400 rounded-full px-2 py-1 text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Therapeutic Approaches Section -->
        <BaseCard class="mb-6 p-6" shape="curved">
          <div class="mb-4 flex items-center gap-3">
            <Icon name="ph:compass-duotone" class="text-primary-500 size-6" />
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              رویکردهای درمانی
            </BaseHeading>
          </div>
          <div class="space-y-4">
            <div
              v-for="approach in therapeuticApproaches"
              :key="approach.id"
              class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
            >
              <div class="flex items-start gap-4">
                <div class="text-primary-500 mt-1 shrink-0">
                  <Icon :name="approach.icon" class="size-6" />
                </div>
                <div class="flex-1">
                  <div class="mb-2 flex items-center justify-between">
                    <h4 class="text-muted-800 font-medium dark:text-white">
                      {{ approach.name }}
                    </h4>
                    <span class="bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-400 rounded-full px-2 py-1 text-xs">
                      {{ approach.effectiveness }}% موثر
                    </span>
                  </div>
                  <p class="text-muted-500 mb-3 text-sm">
                    {{ approach.description }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="condition in approach.suitableFor"
                      :key="condition"
                      class="bg-info-100 text-info-600 dark:bg-info-900 dark:text-info-400 rounded-full px-2 py-1 text-xs"
                    >
                      {{ condition }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Assessment Methods Section -->
        <BaseCard class="mb-6 p-6" shape="curved">
          <div class="mb-4 flex items-center gap-3">
            <Icon name="ph:clipboard-text-duotone" class="text-primary-500 size-6" />
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              روش‌های ارزیابی
            </BaseHeading>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              v-for="assessment in assessmentMethods"
              :key="assessment.id"
              class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
            >
              <div class="flex items-start gap-3">
                <div class="text-primary-500 mt-1 shrink-0">
                  <Icon :name="assessment.icon" class="size-5" />
                </div>
                <div class="flex-1">
                  <h4 class="text-muted-800 mb-1 font-medium dark:text-white">
                    {{ assessment.name }}
                  </h4>
                  <p class="text-muted-500 mb-2 text-sm">
                    {{ assessment.description }}
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-400 rounded-full px-2 py-1 text-xs">
                      {{ assessment.duration }}
                    </span>
                    <span class="text-muted-400 text-xs">
                      دقت: {{ assessment.accuracy }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="col-span-12 lg:col-span-4">
        <!-- Quick Stats -->
        <BaseCard class="mb-6 p-6" shape="curved">
          <div class="mb-4 flex items-center gap-3">
            <Icon name="ph:chart-bar-duotone" class="text-primary-500 size-6" />
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              آمار کلیدی
            </BaseHeading>
          </div>
          <div class="space-y-4">
            <div
              v-for="stat in quickStats"
              :key="stat.label"
              class="bg-muted-50 dark:bg-muted-900 flex items-center justify-between rounded-lg p-3"
            >
              <div class="flex items-center gap-3">
                <Icon
                  :name="stat.icon"
                  :class="stat.color"
                  class="size-5"
                />
                <span class="text-muted-600 dark:text-muted-300 text-sm">
                  {{ stat.label }}
                </span>
              </div>
              <span class="text-muted-800 font-medium dark:text-white">
                {{ stat.value }}
              </span>
            </div>
          </div>
        </BaseCard>

        <!-- Recent Activity -->
        <BaseCard class="mb-6 p-6" shape="curved">
          <div class="mb-4 flex items-center gap-3">
            <Icon name="ph:clock-duotone" class="text-primary-500 size-6" />
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              فعالیت‌های اخیر
            </BaseHeading>
          </div>
          <div class="space-y-3">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="bg-muted-50 dark:bg-muted-900 flex items-start gap-3 rounded-lg p-3"
            >
              <Icon :name="activity.icon" class="text-primary-500 mt-0.5 size-4" />
              <div class="flex-1">
                <p class="text-muted-800 text-sm dark:text-white">
                  {{ activity.description }}
                </p>
                <span class="text-muted-400 text-xs">
                  {{ activity.time }}
                </span>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <BaseButton
            color="primary"
            class="w-full"
            @click="editProfile"
          >
            <Icon name="ph:pencil-duotone" class="me-2 size-4" />
            ویرایش پروفایل
          </BaseButton>
          <BaseButton
            color="success"
            variant="outline"
            class="w-full"
            @click="startSession"
          >
            <Icon name="ph:play-duotone" class="me-2 size-4" />
            شروع جلسه جدید
          </BaseButton>
          <BaseButton
            color="info"
            variant="outline"
            class="w-full"
            @click="viewHistory"
          >
            <Icon name="ph:clock-counter-clockwise-duotone" class="me-2 size-4" />
            مشاهده تاریخچه
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'پروفایل هوش مصنوعی روان‌شناس',
  layout: 'sidebar',
});

// Reactive state
const isLoading = ref(false);
const hasData = ref(true);

// Mock data for AI Psychologist
const aiPsychologist = ref({
  name: 'دکتر هوش مصنوعی زهرا',
  specialization: 'روان‌شناس متخصص در درمان شناختی رفتاری و مشاوره خانواده',
  experience: '5 سال',
  totalSessions: 1247,
  successRate: 94,
});

// Session Goals Mock Data
const sessionGoals = ref([
  {
    id: 1,
    title: 'شناسایی و درمان اضطراب',
    description: 'کمک به کاربران برای شناسایی علائم اضطراب و ارائه راهکارهای مقابله',
    priority: 'بالا',
    estimatedSessions: '6-8',
    icon: 'ph:heart-duotone',
  },
  {
    id: 2,
    title: 'بهبود روابط بین فردی',
    description: 'تقویت مهارت‌های ارتباطی و حل تعارض در روابط',
    priority: 'متوسط',
    estimatedSessions: '4-6',
    icon: 'ph:users-duotone',
  },
  {
    id: 3,
    title: 'مدیریت استرس',
    description: 'یادگیری تکنیک‌های مؤثر برای کاهش و مدیریت استرس روزانه',
    priority: 'بالا',
    estimatedSessions: '3-5',
    icon: 'ph:leaf-duotone',
  },
  {
    id: 4,
    title: 'تقویت اعتماد به نفس',
    description: 'افزایش احترام به خود و بهبود تصویر ذهنی مثبت',
    priority: 'متوسط',
    estimatedSessions: '5-7',
    icon: 'ph:star-duotone',
  },
  {
    id: 5,
    title: 'درمان افسردگی',
    description: 'شناسایی و درمان علائم افسردگی با روش‌های علمی',
    priority: 'بالا',
    estimatedSessions: '8-12',
    icon: 'ph:sun-duotone',
  },
  {
    id: 6,
    title: 'مشاوره تحصیلی',
    description: 'راهنمایی در مسائل تحصیلی و انتخاب مسیر شغلی',
    priority: 'پایین',
    estimatedSessions: '2-4',
    icon: 'ph:graduation-cap-duotone',
  },
]);

// Therapeutic Techniques Mock Data
const therapeuticTechniques = ref([
  {
    id: 1,
    name: 'درمان شناختی رفتاری',
    description: 'تغییر الگوهای فکری منفی و رفتارهای ناسازگار',
    icon: 'ph:brain-duotone',
    tags: ['CBT', 'اضطراب', 'افسردگی'],
  },
  {
    id: 2,
    name: 'ذهن‌آگاهی',
    description: 'تمرکز بر لحظه حال و کاهش استرس',
    icon: 'ph:lotus-duotone',
    tags: ['مدیتیشن', 'استرس', 'آرامش'],
  },
  {
    id: 3,
    name: 'درمان قبولی و تعهد',
    description: 'پذیرش احساسات و تعهد به اهداف مهم',
    icon: 'ph:heart-straight-duotone',
    tags: ['ACT', 'انعطاف‌پذیری', 'ارزش‌ها'],
  },
  {
    id: 4,
    name: 'گفتگوی انگیزشی',
    description: 'تقویت انگیزه برای تغییر و بهبود',
    icon: 'ph:chat-circle-duotone',
    tags: ['انگیزه', 'تغییر', 'هدف‌گذاری'],
  },
  {
    id: 5,
    name: 'درمان خانواده',
    description: 'بهبود روابط و ارتباطات خانوادگی',
    icon: 'ph:house-duotone',
    tags: ['خانواده', 'ارتباط', 'حل تعارض'],
  },
  {
    id: 6,
    name: 'درمان شناختی مبتنی بر ذهن‌آگاهی',
    description: 'ترکیب تکنیک‌های شناختی و ذهن‌آگاهی',
    icon: 'ph:circles-three-duotone',
    tags: ['MBCT', 'شناختی', 'ذهن‌آگاهی'],
  },
]);

// Therapeutic Approaches Mock Data
const therapeuticApproaches = ref([
  {
    id: 1,
    name: 'رویکرد انسان‌محور',
    description: 'تمرکز بر درک و همدلی با تجربه کاربر و ایجاد محیط امن و حمایتی',
    effectiveness: 88,
    icon: 'ph:person-duotone',
    suitableFor: ['اضطراب عمومی', 'مسائل هویت', 'کم اعتمادی'],
  },
  {
    id: 2,
    name: 'رویکرد راه‌حل محور',
    description: 'تمرکز بر راه‌حل‌ها و نقاط قوت به جای مشکلات',
    effectiveness: 85,
    icon: 'ph:lightbulb-duotone',
    suitableFor: ['مشکلات کوتاه‌مدت', 'هدف‌گذاری', 'بحران‌های زندگی'],
  },
  {
    id: 3,
    name: 'رویکرد تلفیقی',
    description: 'ترکیب چندین روش درمانی بر اساس نیاز فردی کاربر',
    effectiveness: 92,
    icon: 'ph:puzzle-piece-duotone',
    suitableFor: ['مسائل پیچیده', 'درمان طولانی‌مدت', 'کوموربیدیتی'],
  },
  {
    id: 4,
    name: 'رویکرد پیشگیری',
    description: 'تمرکز بر پیشگیری از مشکلات روانی و تقویت سلامت روان',
    effectiveness: 78,
    icon: 'ph:shield-duotone',
    suitableFor: ['سلامت روان', 'پیشگیری', 'تقویت تاب‌آوری'],
  },
]);

// Assessment Methods Mock Data
const assessmentMethods = ref([
  {
    id: 1,
    name: 'پرسشنامه استاندارد اضطراب',
    description: 'ارزیابی سطح اضطراب با استفاده از مقیاس‌های علمی',
    duration: '10-15 دقیقه',
    accuracy: 94,
    icon: 'ph:clipboard-duotone',
  },
  {
    id: 2,
    name: 'تحلیل گفتار و زبان',
    description: 'بررسی الگوهای گفتاری برای شناسایی حالات روحی',
    duration: '5-10 دقیقه',
    accuracy: 87,
    icon: 'ph:waveform-duotone',
  },
  {
    id: 3,
    name: 'ارزیابی رفتاری',
    description: 'مشاهده و تحلیل الگوهای رفتاری کاربر',
    duration: '20-30 دقیقه',
    accuracy: 91,
    icon: 'ph:eye-duotone',
  },
  {
    id: 4,
    name: 'تست شخصیت',
    description: 'شناسایی ویژگی‌های شخصیتی برای درمان هدفمند',
    duration: '15-25 دقیقه',
    accuracy: 89,
    icon: 'ph:user-circle-duotone',
  },
]);

// Quick Stats Mock Data
const quickStats = ref([
  {
    label: 'نرخ رضایت',
    value: '96%',
    icon: 'ph:thumbs-up-duotone',
    color: 'text-success-500',
  },
  {
    label: 'زمان پاسخ',
    value: '< 2 ثانیه',
    icon: 'ph:lightning-duotone',
    color: 'text-warning-500',
  },
  {
    label: 'جلسات امروز',
    value: '23',
    icon: 'ph:calendar-duotone',
    color: 'text-info-500',
  },
  {
    label: 'کاربران فعال',
    value: '145',
    icon: 'ph:users-duotone',
    color: 'text-primary-500',
  },
]);

// Recent Activities Mock Data
const recentActivities = ref([
  {
    id: 1,
    description: 'جلسه مشاوره با کاربر جدید تکمیل شد',
    time: '10 دقیقه پیش',
    icon: 'ph:check-circle-duotone',
  },
  {
    id: 2,
    description: 'پروفایل درمانی بروزرسانی شد',
    time: '1 ساعت پیش',
    icon: 'ph:pencil-duotone',
  },
  {
    id: 3,
    description: 'گزارش هفتگی تولید شد',
    time: '2 ساعت پیش',
    icon: 'ph:file-text-duotone',
  },
  {
    id: 4,
    description: 'تکنیک درمانی جدید اضافه شد',
    time: '1 روز پیش',
    icon: 'ph:plus-circle-duotone',
  },
]);

// Methods
const createProfile = () => {
  // Navigate to create profile page
  console.log('Create new AI psychologist profile');
};

const editProfile = () => {
  // Navigate to edit profile page
  console.log('Edit AI psychologist profile');
};

const startSession = () => {
  // Start a new therapy session
  console.log('Start new therapy session');
};

const viewHistory = () => {
  // View session history
  console.log('View session history');
};

// Simulate loading state
onMounted(() => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
