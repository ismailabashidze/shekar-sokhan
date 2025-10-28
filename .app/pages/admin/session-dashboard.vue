<script setup lang="ts">
definePageMeta({
  title: 'Session Dashboard',
  preview: {
    title: 'Admin Session Dashboard',
    description: 'Dashboard for managing user sessions and suicide risk monitoring',
    categories: ['dashboards', 'admin'],
    order: 1,
  },
  layout: 'sidebar',
});
useHead({
  htmlAttrs: { dir: 'rtl' },
});
// Mock data for development - this will be replaced with real API data
const sessions = ref([
  {
    id: '1',
    user: {
      name: 'علی رضایی',
      email: 'ali@example.com',
      avatar: '/img/avatars/2.svg',
    },
    session: {
      date: '2024-01-15',
      duration: 45,
      summary: 'جلسه با discussion در مورد anxiety',
    },
    risk: {
      level: 'critical',
      suicideIndicator: true,
      factors: ['افکار خودکشی', 'انزوای اجتماعی', 'بی‌خوابی'],
    },
    status: 'flagged',
    lastUpdated: '2024-01-15 14:30',
  },
  {
    id: '2',
    user: {
      name: 'سارا محمدی',
      email: 'sara@example.com',
      avatar: '/img/avatars/5.svg',
    },
    session: {
      date: '2024-01-15',
      duration: 30,
      summary: 'جلسه با focus روی depression',
    },
    risk: {
      level: 'high',
      suicideIndicator: false,
      factors: ['حالت افسرده', 'کاهش انرژی'],
    },
    status: 'reviewed',
    lastUpdated: '2024-01-15 13:15',
  },
  {
    id: '3',
    user: {
      name: 'رضا احمدی',
      email: 'reza@example.com',
      avatar: '/img/avatars/9.svg',
    },
    session: {
      date: '2024-01-14',
      duration: 60,
      summary: 'جلسه با discussion در مورد stress management',
    },
    risk: {
      level: 'medium',
      suicideIndicator: false,
      factors: ['استرس کاری', 'خستگی'],
    },
    status: 'new',
    lastUpdated: '2024-01-14 16:45',
  },
  {
    id: '4',
    user: {
      name: 'مریم قاسمی',
      email: 'maryam@example.com',
      avatar: '/img/avatars/12.svg',
    },
    session: {
      date: '2024-01-14',
      duration: 25,
      summary: 'جلسه check-in معمولی',
    },
    risk: {
      level: 'low',
      suicideIndicator: false,
      factors: [],
    },
    status: 'new',
    lastUpdated: '2024-01-14 10:30',
  },
  {
    id: '5',
    user: {
      name: 'امین حسینی',
      email: 'amin@example.com',
      avatar: '/img/avatars/16.svg',
    },
    session: {
      date: '2024-01-13',
      duration: 50,
      summary: 'جلسه با focus روی relationship issues',
    },
    risk: {
      level: 'high',
      suicideIndicator: true,
      factors: ['احساس تنهایی', 'پایان رابطه', 'امیدواری کم'],
    },
    status: 'flagged',
    lastUpdated: '2024-01-13 18:20',
  },
  {
    id: '6',
    user: {
      name: 'فاطمه احمدی',
      email: 'fatemeh@example.com',
      avatar: '/img/avatars/3.svg',
    },
    session: {
      date: '2024-01-13',
      duration: 35,
      summary: 'جلسه با focus روی self-esteem',
    },
    risk: {
      level: 'medium',
      suicideIndicator: false,
      factors: ['کاهش اعتماد به نفس', 'مقایسه با دیگران'],
    },
    status: 'reviewed',
    lastUpdated: '2024-01-13 15:30',
  },
  {
    id: '7',
    user: {
      name: 'محسن کریمی',
      email: 'mohsen@example.com',
      avatar: '/img/avatars/7.svg',
    },
    session: {
      date: '2024-01-12',
      duration: 55,
      summary: 'جلسه با discussion در مورد family conflicts',
    },
    risk: {
      level: 'critical',
      suicideIndicator: true,
      factors: ['تعارضات خانوادگی', 'احساس تنهایی', 'بی‌خوابی'],
    },
    status: 'flagged',
    lastUpdated: '2024-01-12 19:45',
  },
  {
    id: '8',
    user: {
      name: 'زهرا حسینی',
      email: 'zahra@example.com',
      avatar: '/img/avatars/11.svg',
    },
    session: {
      date: '2024-01-12',
      duration: 40,
      summary: 'جلسه check-in معمولی',
    },
    risk: {
      level: 'low',
      suicideIndicator: false,
      factors: [],
    },
    status: 'new',
    lastUpdated: '2024-01-12 11:20',
  },
  {
    id: '9',
    user: {
      name: 'رضا محمدی',
      email: 'rezam@example.com',
      avatar: '/img/avatars/14.svg',
    },
    session: {
      date: '2024-01-11',
      duration: 45,
      summary: 'جلسه با focus روی trauma processing',
    },
    risk: {
      level: 'high',
      suicideIndicator: false,
      factors: ['ترومای گذشته', 'اضطراب'],
    },
    status: 'reviewed',
    lastUpdated: '2024-01-11 16:30',
  },
  {
    id: '10',
    user: {
      name: 'سارا کریمی',
      email: 'sarak@example.com',
      avatar: '/img/avatars/18.svg',
    },
    session: {
      date: '2024-01-11',
      duration: 30,
      summary: 'جلسه با discussion در مورد coping strategies',
    },
    risk: {
      level: 'medium',
      suicideIndicator: false,
      factors: ['استرس', 'کاهش تمرکز'],
    },
    status: 'new',
    lastUpdated: '2024-01-11 14:15',
  },
  {
    id: '11',
    user: {
      name: 'علی موسوی',
      email: 'amousavi@example.com',
      avatar: '/img/avatars/1.svg',
    },
    session: {
      date: '2024-01-10',
      duration: 50,
      summary: 'جلسه با focus روی addiction recovery',
    },
    risk: {
      level: 'critical',
      suicideIndicator: true,
      factors: ['اعتیاد', 'علائم ترک', 'بی‌خوابی'],
    },
    status: 'flagged',
    lastUpdated: '2024-01-10 17:20',
  },
  {
    id: '12',
    user: {
      name: 'مریم احمدی',
      email: 'maryama@example.com',
      avatar: '/img/avatars/6.svg',
    },
    session: {
      date: '2024-01-10',
      duration: 25,
      summary: 'جلسه check-in معمولی',
    },
    risk: {
      level: 'low',
      suicideIndicator: false,
      factors: [],
    },
    status: 'reviewed',
    lastUpdated: '2024-01-10 09:30',
  },
  {
    id: '13',
    user: {
      name: 'امیر رضایی',
      email: 'amirr@example.com',
      avatar: '/img/avatars/8.svg',
    },
    session: {
      date: '2024-01-09',
      duration: 60,
      summary: 'جلسه با discussion در مورد behavioral patterns',
    },
    risk: {
      level: 'medium',
      suicideIndicator: false,
      factors: ['الگوهای رفتاری', 'خستگی مزمن'],
    },
    status: 'new',
    lastUpdated: '2024-01-09 18:45',
  },
  {
    id: '14',
    user: {
      name: 'فاطمه رضایی',
      email: 'fatemehr@example.com',
      avatar: '/img/avatars/15.svg',
    },
    session: {
      date: '2024-01-09',
      duration: 35,
      summary: 'جلسه با focus روی emotional regulation',
    },
    risk: {
      level: 'high',
      suicideIndicator: false,
      factors: ['کنترل احساسات', 'نوسانات خلقی'],
    },
    status: 'reviewed',
    lastUpdated: '2024-01-09 13:10',
  },
  {
    id: '15',
    user: {
      name: 'محمد حسینی',
      email: 'mohammadh@example.com',
      avatar: '/img/avatars/10.svg',
    },
    session: {
      date: '2024-01-08',
      duration: 45,
      summary: 'جلسه با discussion در مورد social anxiety',
    },
    risk: {
      level: 'critical',
      suicideIndicator: true,
      factors: ['اضطراب اجتماعی', 'اجتناب از جمع', 'وحشتگی'],
    },
    status: 'flagged',
    lastUpdated: '2024-01-08 16:20',
  },
  {
    id: '16',
    user: {
      name: 'زهرا محمدی',
      email: 'zahram@example.com',
      avatar: '/img/avatars/13.svg',
    },
    session: {
      date: '2024-01-08',
      duration: 30,
      summary: 'جلسه check-in معمولی',
    },
    risk: {
      level: 'low',
      suicideIndicator: false,
      factors: [],
    },
    status: 'new',
    lastUpdated: '2024-01-08 10:45',
  },
  {
    id: '17',
    user: {
      name: 'سارا موسوی',
      email: 'saramousavi@example.com',
      avatar: '/img/avatars/4.svg',
    },
    session: {
      date: '2024-01-07',
      duration: 55,
      summary: 'جلسه با focus روی grief counseling',
    },
    risk: {
      level: 'high',
      suicideIndicator: false,
      factors: ['سوگ', 'از دست دادن', 'انزوا'],
    },
    status: 'reviewed',
    lastUpdated: '2024-01-07 19:30',
  },
  {
    id: '18',
    user: {
      name: 'علی کریمی',
      email: 'alikarimi@example.com',
      avatar: '/img/avatars/17.svg',
    },
    session: {
      date: '2024-01-07',
      duration: 40,
      summary: 'جلسه با discussion در مورد mindfulness techniques',
    },
    risk: {
      level: 'medium',
      suicideIndicator: false,
      factors: ['استرس', 'کاهش تمرکز'],
    },
    status: 'new',
    lastUpdated: '2024-01-07 14:15',
  },
]);

const activeFilter = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 25, 50];

// Statistics
const stats = computed(() => ({
  total: sessions.value.length,
  critical: sessions.value.filter(s => s.risk.level === 'critical').length,
  high: sessions.value.filter(s => s.risk.level === 'high').length,
  suicideRisk: sessions.value.filter(s => s.risk.suicideIndicator).length,
  flagged: sessions.value.filter(s => s.status === 'flagged').length,
  newSessions: sessions.value.filter(s => s.status === 'new').length,
}));

// Filter sessions based on active filter and search
const filteredSessions = computed(() => {
  let filtered = sessions.value;

  // Apply filter
  if (activeFilter.value !== 'all') {
    switch (activeFilter.value) {
      case 'critical':
        filtered = filtered.filter(s => s.risk.level === 'critical');
        break;
      case 'high':
        filtered = filtered.filter(s => s.risk.level === 'high');
        break;
      case 'suicide':
        filtered = filtered.filter(s => s.risk.suicideIndicator);
        break;
      case 'flagged':
        filtered = filtered.filter(s => s.status === 'flagged');
        break;
      case 'new':
        filtered = filtered.filter(s => s.status === 'new');
        break;
    }
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(s =>
      s.user.name.toLowerCase().includes(query)
      || s.user.email.toLowerCase().includes(query)
      || s.session.summary.toLowerCase().includes(query),
    );
  }

  return filtered;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredSessions.value.length / itemsPerPage.value));
const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSessions.value.slice(start, end);
});

// Enhanced date formatting functions
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  // Add relative time for recent dates
  if (diffDays === 0) {
    return `${formattedDate} (امروز)`;
  }
  else if (diffDays === 1) {
    return `${formattedDate} (دیروز)`;
  }
  else if (diffDays <= 7) {
    return `${formattedDate} (${diffDays} روز پیش)`;
  }

  return formattedDate;
}

function formatTime(timeString: string) {
  // Handle both date+time format and time-only format
  const timeOnly = timeString.includes(' ') ? timeString.split(' ')[1] : timeString;
  const [hours, minutes] = timeOnly.split(':');
  const hour = parseInt(hours);
  const minute = parseInt(minutes);

  // Format in Persian style with AM/PM
  const period = hour >= 12 ? 'بعد از ظهر' : 'صبح';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} دقیقه`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} ساعت و ${remainingMinutes} دقیقه` : `${hours} ساعت`;
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return 'چند لحظه پیش';
  }
  else if (diffHours < 24) {
    return `${diffHours} ساعت پیش`;
  }
  else if (diffDays <= 7) {
    return `${diffDays} روز پیش`;
  }
  else {
    return formatDate(dateString);
  }
}

// Helper functions
function getRiskColor(level: string) {
  switch (level) {
    case 'critical':
      return 'danger';
    case 'high':
      return 'warning';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'muted';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'flagged':
      return 'danger';
    case 'reviewed':
      return 'success';
    case 'new':
      return 'info';
    default:
      return 'muted';
  }
}

function getRiskLabel(level: string) {
  switch (level) {
    case 'critical':
      return 'بحرانی';
    case 'high':
      return 'پرریسک';
    case 'medium':
      return 'متوسط';
    case 'low':
      return 'کم';
    default:
      return level;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'flagged':
      return 'علامت‌گذاری شده';
    case 'reviewed':
      return 'بررسی شده';
    case 'new':
      return 'جدید';
    default:
      return status;
  }
}

// Icon helper functions
function getRiskIcon(level: string) {
  switch (level) {
    case 'critical':
      return 'ph:warning-octagon-duotone';
    case 'high':
      return 'ph:warning-duotone';
    case 'medium':
      return 'ph:info-duotone';
    case 'low':
      return 'ph:check-circle-duotone';
    default:
      return 'ph:circle-duotone';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'flagged':
      return 'ph:flag-duotone';
    case 'reviewed':
      return 'ph:check-circle-duotone';
    case 'new':
      return 'ph:sparkle-duotone';
    default:
      return 'ph:circle-duotone';
  }
}
</script>

<template>
  <div class="relative">
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Header with Statistics -->
      <div class="col-span-12 ">
        <div class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row">
          <div class="relative h-[168px] w-[280px] shrink-0">
            <img
              class="pointer-events-none absolute -start-6 -top-20 sm:-start-10"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="Admin dashboard illustration"
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>داشبورد مدیریت جلسات</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="mb-4 text-white opacity-70">
                <span>
                  نظارت بر جلسات کاربران و مدیریت ریسک خودکشی
                </span>
              </BaseParagraph>
              <BaseParagraph size="xs" class="max-w-2xl text-white opacity-60">
                <span>
                  این داشبورد به شما امکان می‌دهد جلسات درمانی کاربران را به صورت لحظه‌ای رصد کنید،
                  موارد پرریسک را شناسایی کرده و اقدامات لازم را برای حمایت از کاربران در معرض خطر
                  انجام دهید. تمامی جلسات بر اساس سطح ریسک، وضعیت خودکشی و نیاز به بررسی اولویت‌بندی شده‌اند.
                </span>
              </BaseParagraph>
              <div class="mt-6 flex flex-wrap gap-y-6 pb-4 text-center sm:mt-4 sm:gap-x-8 sm:pb-0 sm:text-right">
                <div class="min-w-[33.3%] sm:min-w-0">
                  <div class="flex flex-col items-center gap-2 sm:items-end">
                    <div class="flex items-center gap-2">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-white/20">
                        <Icon name="ph:users-duotone" class="size-5 text-white" />
                      </div>
                      <BaseHeading
                        tag="h4"
                        weight="medium"
                        size="sm"
                        class="text-white opacity-90"
                      >
                        <span>{{ stats.total }}</span>
                      </BaseHeading>
                    </div>
                    <BaseParagraph size="xs" class="text-white opacity-70">
                      <span>کل جلسات</span>
                    </BaseParagraph>
                  </div>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <div class="flex flex-col items-center gap-2 sm:items-end">
                    <div class="flex items-center gap-2">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-red-500/30">
                        <Icon name="ph:warning-duotone" class="size-5 text-red-400" />
                      </div>
                      <BaseHeading
                        tag="h4"
                        weight="medium"
                        size="sm"
                        class="text-red-400"
                      >
                        <span>{{ stats.critical }}</span>
                      </BaseHeading>
                    </div>
                    <BaseParagraph size="xs" class="text-white opacity-70">
                      <span>وضعیت بحرانی</span>
                    </BaseParagraph>
                  </div>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <div class="flex flex-col items-center gap-2 sm:items-end">
                    <div class="flex items-center gap-2">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-orange-500/30">
                        <Icon name="ph:heart-break-duotone" class="size-5 text-orange-400" />
                      </div>
                      <BaseHeading
                        tag="h4"
                        weight="medium"
                        size="sm"
                        class="text-orange-400"
                      >
                        <span>{{ stats.suicideRisk }}</span>
                      </BaseHeading>
                    </div>
                    <BaseParagraph size="xs" class="text-white opacity-70">
                      <span>ریسک خودکشی</span>
                    </BaseParagraph>
                  </div>
                </div>
                <div class="min-w-[33.3%] sm:min-w-0">
                  <div class="flex flex-col items-center gap-2 sm:items-end">
                    <div class="flex items-center gap-2">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-red-500/30">
                        <Icon name="ph:flag-duotone" class="size-5 text-red-400" />
                      </div>
                      <BaseHeading
                        tag="h4"
                        weight="medium"
                        size="sm"
                        class="text-red-400"
                      >
                        <span>{{ stats.flagged }}</span>
                      </BaseHeading>
                    </div>
                    <BaseParagraph size="xs" class="text-white opacity-70">
                      <span>علامت‌گذاری شده</span>
                    </BaseParagraph>
                  </div>
                </div>
                <div class="ptablet:hidden min-w-[33.3%] sm:min-w-0">
                  <div class="flex flex-col items-center gap-2 sm:items-end">
                    <div class="flex items-center gap-2">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-yellow-500/30">
                        <Icon name="ph:sparkle-duotone" class="size-5 text-yellow-400" />
                      </div>
                      <BaseHeading
                        tag="h4"
                        weight="medium"
                        size="sm"
                        class="text-yellow-400"
                      >
                        <span>{{ stats.newSessions }}</span>
                      </BaseHeading>
                    </div>
                    <BaseParagraph size="xs" class="text-white opacity-70">
                      <span>جلسات جدید</span>
                    </BaseParagraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="col-span-12">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div class="flex items-center gap-3">
            <Icon name="ph:funnel-duotone" class="text-muted-400 size-5" />
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-muted-100 mb-1"
            >
              <span>فیلتر جلسات</span>
            </BaseHeading>
          </div>
          <div class="flex gap-2 sm:justify-end">
            <BaseButtonAction
              rounded="lg"
              :color="activeFilter === 'all' ? 'primary' : 'default'"
              @click="activeFilter = 'all'"
            >
              <Icon name="ph:grid-four-duotone" class="size-4" />
              <span class="mr-2">همه</span>
            </BaseButtonAction>
            <BaseButtonAction
              rounded="lg"
              :color="activeFilter === 'critical' ? 'danger' : 'default'"
              @click="activeFilter = 'critical'"
            >
              <Icon name="ph:warning-octagon-duotone" class="size-4" />
              <span class="mr-2">بحرانی</span>
            </BaseButtonAction>
            <BaseButtonAction
              rounded="lg"
              :color="activeFilter === 'high' ? 'warning' : 'default'"
              @click="activeFilter = 'high'"
            >
              <Icon name="ph:warning-duotone" class="size-4" />
              <span class="mr-2">پرریسک</span>
            </BaseButtonAction>
            <BaseButtonAction
              rounded="lg"
              :color="activeFilter === 'suicide' ? 'danger' : 'default'"
              @click="activeFilter = 'suicide'"
            >
              <Icon name="ph:heart-break-duotone" class="size-4" />
              <span class="mr-2">ریسک خودکشی</span>
            </BaseButtonAction>
            <BaseButtonAction
              rounded="lg"
              :color="activeFilter === 'flagged' ? 'danger' : 'default'"
              @click="activeFilter = 'flagged'"
            >
              <Icon name="ph:flag-duotone" class="size-4" />
              <span class="mr-2">علامت‌گذاری شده</span>
            </BaseButtonAction>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="col-span-12">
        <BaseCard rounded="lg" class="p-4">
          <div class="relative">
            <BaseInput
              v-model="searchQuery"
              placeholder="جستجوی جلسات..."
              icon="ph:magnifying-glass-duotone"
              rounded="lg"
            />
            <div v-if="searchQuery" class="absolute end-12 top-1/2 -translate-y-1/2">
              <button class="text-muted-400 hover:text-muted-600" @click="searchQuery = ''">
                <Icon name="ph:x-circle-duotone" class="size-5" />
              </button>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sessions List -->
      <div class="col-span-12 xl:col-span-12">
        <div class="space-y-2">
          <TairoFlexTableRow
            v-for="session in paginatedSessions"
            :key="session.id"
            rounded="sm"
          >
            <TairoFlexTableCell type="grow" data-content="کاربر">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <img
                    :src="session.user.avatar"
                    :alt="session.user.name"
                    class="size-10 rounded-full object-cover"
                  >
                  <div
                    v-if="session.risk.level === 'critical' || session.risk.suicideIndicator"
                    class="dark:border-muted-900 absolute -bottom-1 -end-1 size-4 rounded-full border-2 border-white bg-red-500"
                  >
                    <Icon name="ph:warning-fill" class="size-3 text-white" />
                  </div>
                </div>
                <div>
                  <p class="text-muted-800 font-medium dark:text-white">
                    {{ session.user.name }}
                  </p>
                  <p class="text-muted-500 dark:text-muted-400 text-sm">
                    {{ session.user.email }}
                  </p>
                </div>
              </div>
            </TairoFlexTableCell>
            <TairoFlexTableCell
              type="stable"
              data-content="تاریخ و زمان"
              class="min-w-[280px]"
            >
              <div class="space-y-2">
                <!-- Session Date with enhanced styling -->
                <div class="flex items-center gap-2">
                  <div
                    class="bg-primary-100 dark:bg-primary-900/20 flex size-8 items-center justify-center rounded-lg"
                  >
                    <Icon name="ph:calendar-duotone" class="text-primary-600 dark:text-primary-400 size-4" />
                  </div>
                  <div class="text-sm">
                    <div class="text-muted-700 dark:text-muted-300 font-medium">
                      {{ formatDate(session.session.date) }}
                    </div>
                    <div class="text-muted-500 text-xs">
                      {{ getRelativeTime(session.session.date) }}
                    </div>
                  </div>
                </div>

                <!-- Last Updated Time with enhanced styling -->
                <div v-if="session.lastUpdated" class="flex items-center gap-2">
                  <div
                    class="bg-success-100 dark:bg-success-900/20 flex size-8 items-center justify-center rounded-lg"
                  >
                    <Icon name="ph:clock-duotone" class="text-success-600 dark:text-success-400 size-4" />
                  </div>
                  <div class="text-sm">
                    <div class="text-muted-700 dark:text-muted-300 font-medium">
                      {{ formatTime(session.lastUpdated) }}
                    </div>
                    <div class="text-muted-500 text-xs">
                      آخرین به‌روزرسانی
                    </div>
                  </div>
                </div>
              </div>
            </TairoFlexTableCell>
            <TairoFlexTableCell type="stable" data-content="مدت جلسه">
              <div class="text-muted-500 dark:text-muted-400 flex items-center gap-2 font-sans text-sm">
                <div class="bg-info-100 dark:bg-info-900/20 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:timer-duotone" class="text-info-600 dark:text-info-400 size-4" />
                </div>
                <span>{{ formatDuration(session.session.duration) }}</span>
              </div>
            </TairoFlexTableCell>
            <TairoFlexTableCell type="stable" data-content="ریسک">
              <div class="flex items-center gap-2">
                <Icon
                  :name="getRiskIcon(session.risk.level)"
                  :class="{
                    'size-4 text-red-500': session.risk.level === 'critical',
                    'size-4 text-orange-500': session.risk.level === 'high',
                    'size-4 text-yellow-500': session.risk.level === 'medium',
                    'size-4 text-green-500': session.risk.level === 'low'
                  }"
                />
                <BaseTag
                  :color="getRiskColor(session.risk.level)"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ getRiskLabel(session.risk.level) }}
                </BaseTag>
              </div>
            </TairoFlexTableCell>
            <TairoFlexTableCell type="stable" data-content="خودکشی">
              <div class="flex items-center gap-2">
                <Icon
                  :name="session.risk.suicideIndicator ? 'ph:heart-break-duotone' : 'ph:heart-duotone'"
                  :class="session.risk.suicideIndicator ? 'size-4 text-red-500' : 'size-4 text-green-500'"
                />
                <BaseTag
                  :color="session.risk.suicideIndicator ? 'danger' : 'success'"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ session.risk.suicideIndicator ? 'خطر' : 'امن' }}
                </BaseTag>
              </div>
            </TairoFlexTableCell>
            <TairoFlexTableCell type="stable" data-content="وضعیت">
              <div class="flex items-center gap-2">
                <Icon
                  :name="getStatusIcon(session.status)"
                  :class="{
                    'size-4 text-red-500': session.status === 'flagged',
                    'size-4 text-green-500': session.status === 'reviewed',
                    'size-4 text-blue-500': session.status === 'new'
                  }"
                />
                <BaseTag
                  :color="getStatusColor(session.status)"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ getStatusLabel(session.status) }}
                </BaseTag>
              </div>
            </TairoFlexTableCell>
            <TairoFlexTableCell type="stable" data-content="عملیات">
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/admin/user-details/${session.id}`"
                  class="text-primary-500 flex items-center gap-1 font-sans text-xs underline-offset-4 hover:underline"
                >
                  <Icon name="ph:eye-duotone" class="size-4" />
                  <span>جزئیات</span>
                </NuxtLink>
                <span
                  v-if="session.risk.level === 'critical' || session.risk.suicideIndicator"
                  class="font-sans text-xs font-medium text-red-500"
                >
                  <Icon name="ph:warning-duotone" class="inline size-4" />
                </span>
              </div>
            </TairoFlexTableCell>
          </TairoFlexTableRow>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="col-span-12 mt-6">
        <BasePagination
          :total-items="filteredSessions.length"
          :item-per-page="itemsPerPage"
          :current-page="currentPage"
          :max-links-displayed="5"
          rounded="md"
          @update:current-page="currentPage = $event"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredSessions.length === 0" class="col-span-12">
        <BaseCard rounded="lg" class="p-12 text-center">
          <div class="relative">
            <Icon name="ph:folder-open-duotone" class="text-muted-300 mx-auto mb-4 size-20" />
            <Icon name="ph:magnifying-glass-duotone" class="text-muted-400 mx-auto -mt-12 mb-4 size-12" />
          </div>
          <BaseHeading
            as="h3"
            size="lg"
            weight="medium"
            class="text-muted-600 mb-2"
          >
            <span>هیچ جلسه‌ای یافت نشد</span>
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400">
            <span>با فیلترهای فعلی هیچ جلسه‌ای وجود ندارد</span>
          </BaseParagraph>
          <BaseButtonAction
            color="primary"
            class="mt-4"
            @click="activeFilter = 'all'; searchQuery = ''"
          >
            <Icon name="ph:arrow-counter-clockwise-duotone" class="size-4" />
            <span class="mr-2">بازنشانی فیلترها</span>
          </BaseButtonAction>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
