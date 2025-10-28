<script setup lang="ts">
definePageMeta({
  title: 'User Details',
  preview: {
    title: 'User Session Details',
    description: 'Detailed view of user sessions and risk analysis',
    categories: ['dashboards', 'admin'],
    order: 2,
  },
})

// Get user ID from route params
const route = useRoute()
const userId = route.params.id as string

// Mock user data - this will be replaced with real API data
const userData = ref({
  id: userId,
  user: {
    name: 'علی رضایی',
    email: 'ali@example.com',
    avatar: '/img/avatars/2.svg',
    phone: '+98 912 345 6789',
    joinDate: '2023-06-15',
    totalSessions: 12,
    zones: ['hamdel', 'hampazhooh', 'khebre'],
  },
  currentRisk: {
    level: 'critical',
    suicideIndicator: true,
    factors: ['افکار خودکشی', 'انزوای اجتماعی', 'بی‌خوابی'],
    score: 85,
    lastAssessment: '2024-01-15',
  },
  sessions: [
    {
      id: '1',
      date: '2024-01-15',
      duration: 45,
      summary: 'جلسه با discussion در مورد anxiety و افکار خودکشی',
      risk: {
        level: 'critical',
        suicideIndicator: true,
        factors: ['افکار خودکشی', 'انزوای اجتماعی'],
      },
      emotionalState: 'بسیار مضطرب',
      mood: 'منفی',
      status: 'flagged',
    },
    {
      id: '2',
      date: '2024-01-12',
      duration: 30,
      summary: 'جلسه با focus روی depression',
      risk: {
        level: 'high',
        suicideIndicator: false,
        factors: ['حالت افسرده', 'کاهش انرژی'],
      },
      emotionalState: 'افسرده',
      mood: 'منفی',
      status: 'reviewed',
    },
    {
      id: '3',
      date: '2024-01-08',
      duration: 35,
      summary: 'جلسه check-in و بررسی وضعیت عمومی',
      risk: {
        level: 'medium',
        suicideIndicator: false,
        factors: ['استرس کاری'],
      },
      emotionalState: 'معمولی',
      mood: 'خنثی',
      status: 'reviewed',
    },
    {
      id: '4',
      date: '2024-01-05',
      duration: 40,
      summary: 'جلسه با discussion در مورد استرس مدیریت',
      risk: {
        level: 'medium',
        suicideIndicator: false,
        factors: ['استرس کاری', 'خستگی'],
      },
      emotionalState: 'استرس‌زا',
      mood: 'منفی',
      status: 'reviewed',
    },
  ],
  adminNotes: [
    {
      id: '1',
      date: '2024-01-15',
      author: 'دکتر احمدی',
      note: 'کاربر در جلسه آخر افکار خودکشی را گزارش کرده است. نیاز به پیگیری فوری دارد.',
      priority: 'high',
    },
    {
      id: '2',
      date: '2024-01-12',
      author: 'مشاور مریم قاسمی',
      note: 'کاربر حالت افسرده دارد اما بهبود نسبی مشاهده شده است.',
      priority: 'medium',
    },
  ],
})

// Statistics
const stats = computed(() => ({
  totalSessions: userData.value.sessions.length,
  criticalSessions: userData.value.sessions.filter(s => s.risk.level === 'critical').length,
  highRiskSessions: userData.value.sessions.filter(s => s.risk.level === 'high').length,
  suicideRiskSessions: userData.value.sessions.filter(s => s.risk.suicideIndicator).length,
  averageDuration: Math.round(
    userData.value.sessions.reduce((acc, s) => acc + s.duration, 0) / userData.value.sessions.length,
  ),
}))

// Helper functions
function getRiskColor(level: string) {
  switch (level) {
    case 'critical':
      return 'danger'
    case 'high':
      return 'warning'
    case 'medium':
      return 'muted'
    case 'low':
      return 'success'
    default:
      return 'muted'
  }
}

function getRiskLabel(level: string) {
  switch (level) {
    case 'critical':
      return 'بحرانی'
    case 'high':
      return 'پرریسک'
    case 'medium':
      return 'متوسط'
    case 'low':
      return 'کم'
    default:
      return level
  }
}

function getMoodColor(mood: string) {
  switch (mood) {
    case 'مثبت':
      return 'success'
    case 'خنثی':
      return 'muted'
    case 'منفی':
      return 'danger'
    default:
      return 'muted'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'muted'
  }
}
</script>

<template>
  <div class="relative">
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- User Info Header -->
      <div class="col-span-12">
        <BaseCard rounded="lg" class="p-6">
          <div class="flex flex-col items-center gap-6 sm:flex-row">
            <BaseAvatar
              :src="userData.user.avatar"
              size="xl"
              class="shrink-0"
            />
            <div class="text-center sm:text-left">
              <BaseHeading
                as="h2"
                size="2xl"
                weight="semibold"
                class="text-muted-800 dark:text-muted-100"
              >
                {{ userData.user.name }}
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                {{ userData.user.email }}
              </BaseParagraph>
              <div class="mt-2 flex flex-wrap justify-center gap-4 sm:justify-start">
                <div class="flex items-center gap-2">
                  <Icon name="ph:phone-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-600 text-sm">{{ userData.user.phone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Icon name="ph:calendar-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-600 text-sm">عضویت: {{ userData.user.joinDate }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Icon name="ph:chat-circle-dots-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-600 text-sm">{{ userData.user.totalSessions }} جلسه</span>
                </div>
              </div>
              <div class="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <div class="flex items-center gap-2">
                  <Icon name="ph:map-pin-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-600 text-sm">مناطق:</span>
                </div>
                <BaseTag
                  v-for="zone in userData.user.zones"
                  :key="zone"
                  color="info"
                  variant="pastel"
                  rounded="full"
                  size="sm"
                >
                  {{ zone }}
                </BaseTag>
                <span v-if="!userData.user.zones?.length" class="text-muted-400 text-xs">
                  بدون منطقه
                </span>
              </div>
            </div>
            <div class="mt-4 sm:ms-auto sm:mt-0">
              <div class="text-center">
                <BaseTag
                  :color="getRiskColor(userData.currentRisk.level)"
                  rounded="full"
                  variant="pastel"
                  size="md"
                  class="mb-2"
                >
                  ریسک فعلی: {{ getRiskLabel(userData.currentRisk.level) }}
                </BaseTag>
                <div
                  v-if="userData.currentRisk.suicideIndicator"
                  class="flex items-center justify-center gap-2 text-red-500"
                >
                  <Icon name="ph:warning-duotone" class="size-5" />
                  <span class="text-sm font-medium">ریسک خودکشی شناسایی شد</span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Risk Assessment Card -->
      <div class="col-span-12 lg:col-span-8">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-muted-100"
            >
              ارزیابی ریسک
            </BaseHeading>
          </div>
          <div class="grid gap-6 sm:grid-cols-2">
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-2">
                سطح ریسک فعلی
              </BaseParagraph>
              <div class="flex items-center gap-3">
                <BaseTag
                  :color="getRiskColor(userData.currentRisk.level)"
                  rounded="full"
                  variant="pastel"
                  size="md"
                >
                  {{ getRiskLabel(userData.currentRisk.level) }}
                </BaseTag>
                <span class="text-muted-800 dark:text-muted-100 text-2xl font-bold">
                  {{ userData.currentRisk.score }}%
                </span>
              </div>
            </div>
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-2">
                آخرین ارزیابی
              </BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-muted-100 font-medium">
                {{ userData.currentRisk.lastAssessment }}
              </BaseParagraph>
            </div>
          </div>
          <div class="mt-6">
            <BaseParagraph size="sm" class="text-muted-500 mb-3">
              عوامل خطر شناسایی شده
            </BaseParagraph>
            <div class="flex flex-wrap gap-2">
              <BaseTag
                v-for="factor in userData.currentRisk.factors"
                :key="factor"
                color="danger"
                rounded="full"
                variant="pastel"
                size="sm"
              >
                {{ factor }}
              </BaseTag>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Statistics Sidebar -->
      <div class="col-span-12 lg:col-span-4">
        <div class="flex flex-col gap-6">
          <!-- Stats Card -->
          <BaseCard rounded="lg" class="p-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-muted-100 mb-4"
            >
              آمار جلسات
            </BaseHeading>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-muted-500 text-sm">کل جلسات</span>
                <span class="text-muted-800 dark:text-muted-100 font-semibold">{{ stats.totalSessions
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-500 text-sm">جلسات بحرانی</span>
                <span class="font-semibold text-red-500">{{ stats.criticalSessions }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-500 text-sm">جلسات پرریسک</span>
                <span class="font-semibold text-orange-500">{{ stats.highRiskSessions }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-500 text-sm">ریسک خودکشی</span>
                <span class="font-semibold text-red-500">{{ stats.suicideRiskSessions }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-500 text-sm">میانگین مدت</span>
                <span class="text-muted-800 dark:text-muted-100 font-semibold">{{ stats.averageDuration
                }} دقیقه</span>
              </div>
            </div>
          </BaseCard>

          <!-- Quick Actions -->
          <BaseCard rounded="lg" class="p-6">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-muted-100 mb-4"
            >
              عملیات سریع
            </BaseHeading>
            <div class="flex flex-col gap-3">
              <BaseButton
                color="primary"
                rounded="lg"
                class="w-full"
              >
                <Icon name="ph:phone-duotone" class="size-4" />
                تماس با کاربر
              </BaseButton>
              <BaseButton
                color="warning"
                rounded="lg"
                class="w-full"
              >
                <Icon name="ph:flag-duotone" class="size-4" />
                علامت‌گذاری بحرانی
              </BaseButton>
              <BaseButton
                color="default"
                rounded="lg"
                class="w-full"
              >
                <Icon name="ph:note-duotone" class="size-4" />
                افزودن یادداشت
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- Sessions History -->
      <div class="col-span-12">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-muted-100"
            >
              تاریخچه جلسات
            </BaseHeading>
          </div>
          <div class="space-y-3">
            <TairoFlexTableRow
              v-for="session in userData.sessions"
              :key="session.id"
              rounded="sm"
              :class="{
                'border-l-4 border-l-red-500': session.risk.level === 'critical',
                'border-l-4 border-l-orange-500': session.risk.level === 'high',
                'border-l-4 border-l-yellow-500': session.risk.level === 'medium',
              }"
            >
              <TairoFlexTableCell type="grow" data-content="جلسه">
                <div class="flex items-center gap-3">
                  <Icon name="ph:calendar-duotone" class="text-muted-400 size-5" />
                  <div>
                    <p class="text-muted-800 font-medium dark:text-white">
                      {{ session.date }} - {{
                        session.duration }} دقیقه
                    </p>
                    <p class="text-muted-500 dark:text-muted-400 text-sm">
                      {{ session.summary }}
                    </p>
                  </div>
                </div>
              </TairoFlexTableCell>
              <TairoFlexTableCell type="stable" data-content="وضعیت روحی">
                <BaseTag
                  :color="getMoodColor(session.mood)"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ session.emotionalState }}
                </BaseTag>
              </TairoFlexTableCell>
              <TairoFlexTableCell type="stable" data-content="ریسک">
                <BaseTag
                  :color="getRiskColor(session.risk.level)"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ getRiskLabel(session.risk.level) }}
                </BaseTag>
              </TairoFlexTableCell>
              <TairoFlexTableCell type="stable" data-content="خودکشی">
                <BaseTag
                  :color="session.risk.suicideIndicator ? 'danger' : 'success'"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ session.risk.suicideIndicator ? 'خطر' : 'امن' }}
                </BaseTag>
              </TairoFlexTableCell>
              <TairoFlexTableCell type="stable" data-content="وضعیت">
                <BaseTag
                  :color="session.status === 'flagged' ? 'danger' : 'success'"
                  rounded="full"
                  variant="pastel"
                  size="sm"
                >
                  {{ session.status === 'flagged' ? 'علامت‌گذاری شده' : 'بررسی شده' }}
                </BaseTag>
              </TairoFlexTableCell>
            </TairoFlexTableRow>
          </div>
        </BaseCard>
      </div>

      <!-- Admin Notes -->
      <div class="col-span-12">
        <BaseCard rounded="lg" class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-muted-100"
            >
              یادداشت‌های ادمین
            </BaseHeading>
          </div>
          <div class="space-y-4">
            <div
              v-for="note in userData.adminNotes"
              :key="note.id"
              class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
            >
              <div class="mb-2 flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <BaseParagraph size="sm" class="text-muted-800 dark:text-muted-100 font-medium">
                    {{ note.author }}
                  </BaseParagraph>
                  <BaseTag
                    :color="getPriorityColor(note.priority)"
                    rounded="full"
                    variant="pastel"
                    size="xs"
                  >
                    {{ note.priority === 'high' ? 'مهم' : note.priority === 'medium' ? 'متوسط' :
                      'کم' }}
                  </BaseTag>
                </div>
                <BaseParagraph size="xs" class="text-muted-500">
                  {{ note.date }}
                </BaseParagraph>
              </div>
              <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                {{ note.note }}
              </BaseParagraph>
            </div>
          </div>
          <!-- Add Note Button -->
          <div class="mt-6">
            <BaseButton
              color="default"
              rounded="lg"
              class="w-full sm:w-auto"
            >
              <Icon name="ph:plus-duotone" class="size-4" />
              افزودن یادداشت جدید
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
