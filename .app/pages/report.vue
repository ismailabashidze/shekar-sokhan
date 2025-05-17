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
              alt="No report data"
              class="mb-6 w-72"
            >
            <BaseHeading
              tag="h2"
              size="2xl"
              weight="medium"
              class="text-muted-800 mb-2 dark:text-white"
            >
              گزارشی یافت نشد
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-400 mb-8">
              هنوز هیچ گزارش نهایی برای شما ثبت نشده است. برای شروع، یک جلسه جدید ایجاد کنید.
            </BaseParagraph>
            <BaseButton color="primary" @click="startNewSession">
              <Icon name="ph:plus-circle-duotone" class="me-2 size-5" />
              شروع جلسه جدید
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Report Content (when data exists) -->
    <div v-else class="grid grid-cols-12 gap-6">
      <!-- Header -->
      <div class="col-span-12">
        <div class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row">
          <div class="relative h-[168px] w-[280px] shrink-0">
            <img
              class="pointer-events-none absolute -start-6 -top-20 sm:-start-10"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="Report illustration"
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white opacity-90">
                <span>گزارش نهایی</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-white opacity-60">
                <span>
                  <span>
                    خلاصه و تحلیل نهایی جلسات مشاوره
                  </span>
                </span>
              </BaseParagraph>
              <div class="mt-6 flex flex-wrap gap-4 pb-4 text-center sm:mt-4 sm:pb-0 sm:text-right">
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">تعداد کل جلسات</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ report.totalSessions }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">اولین جلسه</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ formatDate(report.created) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-medium text-white/50">آخرین بروزرسانی</span>
                    <div class="text-white">
                      <span class="text-base font-medium">
                        {{ formatDate(report.updated) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div class="col-span-12 mb-8 lg:col-span-8">
        <!-- Summaries Card -->
        <BaseCard class="p-6" shape="curved">
          <div class="mb-2 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>خلاصه جلسات</span>
            </BaseHeading>
          </div>
          <div class="flex justify-between">
            <BaseParagraph size="xs" class="text-muted-400 max-w-full">
              <Icon name="ph:notepad-duotone" class="size-4" />
              <span>خلاصه تمام جلسات مشاوره</span>
            </BaseParagraph>
          </div>
          <div class="mt-6">
            <div
              v-for="(summary, idx) in report.summaries"
              :key="summary.session"
              class="mb-6"
            >
              <BaseCard
                shape="rounded"
                class="border-primary-100 dark:border-primary-500/20 border-2 p-5 transition-all duration-300 hover:shadow-lg"
              >
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  lead="none"
                  class="text-primary-500 mb-3"
                >
                  {{ summary.title }}
                </BaseHeading>
                <BaseText size="xs" class="text-muted-500 leading-relaxed">
                  {{ summary.summary }}
                </BaseText>
              </BaseCard>
            </div>
          </div>
        </BaseCard>
        <!-- Demographic Profile Card -->
        <BaseCard shape="curved" class="mt-4 p-6">
          <div class="mb-2 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>اطلاعات دموگرافیک</span>
            </BaseHeading>
          </div>
          <div class="flex justify-between">
            <BaseParagraph size="xs" class="text-muted-400 max-w-full">
              <Icon name="ph:user-duotone" class="size-4" />
              <span>
                اطلاعات دموگرافیک مراجع که در طول جلسات استخراج شده است.
              </span>
            </BaseParagraph>
          </div>
          <div class="relative mt-5">
            <div class="grid grid-cols-12 gap-4">
              <!-- First Name -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">نام</label>
                  <span v-if="report.finalDemographicProfile?.firstName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseInput
                  :model-value="report.finalDemographicProfile?.firstName || ''"
                  disabled
                  type="text"
                  icon="ph:user-duotone"
                  placeholder="نام"
                  :class="{'opacity-50': !report.finalDemographicProfile?.firstName}"
                />
              </div>

              <!-- Last Name -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">نام خانوادگی</label>
                  <span v-if="report.finalDemographicProfile?.lastName" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseInput
                  :model-value="report.finalDemographicProfile?.lastName || ''"
                  disabled
                  type="text"
                  icon="ph:user-duotone"
                  placeholder="نام خانوادگی"
                  :class="{'opacity-50': !report.finalDemographicProfile?.lastName}"
                />
              </div>

              <!-- Age -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">سن</label>
                  <span v-if="report.finalDemographicProfile?.age" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseInput
                  :model-value="report.finalDemographicProfile?.age || ''"
                  disabled
                  type="number"
                  icon="ph:calendar-duotone"
                  placeholder="سن"
                  :class="{'opacity-50': !report.finalDemographicProfile?.age}"
                />
              </div>

              <!-- Gender -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">جنسیت</label>
                  <span v-if="report.finalDemographicProfile?.gender" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  :model-value="report.finalDemographicProfile?.gender || ''"
                  disabled
                  placeholder="جنسیت"
                  :class="{'opacity-50': !report.finalDemographicProfile?.gender}"
                >
                  <option value="">
                    جنسیت
                  </option>
                  <option value="male">
                    مرد
                  </option>
                  <option value="female">
                    زن
                  </option>
                  <option value="other">
                    دیگر
                  </option>
                </BaseSelect>
              </div>

              <!-- Education -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">تحصیلات</label>
                  <span v-if="report.finalDemographicProfile?.education" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  :model-value="report.finalDemographicProfile?.education || ''"
                  disabled
                  placeholder="تحصیلات"
                  :class="{'opacity-50': !report.finalDemographicProfile?.education}"
                >
                  <option value="">
                    تحصیلات
                  </option>
                  <option value="under diploma">
                    زیر دیپلم
                  </option>
                  <option value="diploma">
                    دیپلم
                  </option>
                  <option value="bachelor">
                    کارشناسی
                  </option>
                  <option value="master">
                    کارشناسی ارشد
                  </option>
                  <option value="phd">
                    دکتری
                  </option>
                  <option value="other">
                    سایر
                  </option>
                </BaseSelect>
              </div>

              <!-- Occupation -->
              <div class="col-span-12 sm:col-span-6">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">شغل</label>
                  <span v-if="report.finalDemographicProfile?.occupation" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  :model-value="report.finalDemographicProfile?.occupation || ''"
                  disabled
                  placeholder="شغل"
                  :class="{'opacity-50': !report.finalDemographicProfile?.occupation}"
                >
                  <option value="">
                    شغل
                  </option>
                  <option value="student">
                    دانشجو
                  </option>
                  <option value="employed">
                    کارمند
                  </option>
                  <option value="self-employed">
                    آزاد
                  </option>
                  <option value="unemployed">
                    بیکار
                  </option>
                  <option value="retired">
                    بازننشسته
                  </option>
                  <option value="householder">
                    خانه‌دار
                  </option>
                  <option value="other">
                    سایر
                  </option>
                </BaseSelect>
              </div>

              <!-- Marital Status -->
              <div class="col-span-12">
                <div class="mb-1 flex items-center justify-between">
                  <label class="text-muted-400 text-xs font-medium">وضعیت تأهل</label>
                  <span v-if="report.finalDemographicProfile?.maritalStatus" class="bg-success-500/10 text-success-500 rounded-full px-2 py-0.5 text-xs">موجود</span>
                  <span v-else class="bg-muted-300/30 text-muted-500 dark:bg-muted-700/30 dark:text-muted-400 rounded-full px-2 py-0.5 text-xs">نامشخص</span>
                </div>
                <BaseSelect
                  :model-value="report.finalDemographicProfile?.maritalStatus || ''"
                  disabled
                  placeholder="وضعیت تأهل"
                  :class="{'opacity-50': !report.finalDemographicProfile?.maritalStatus}"
                >
                  <option value="">
                    وضعیت تأهل
                  </option>
                  <option value="single">
                    مجرد
                  </option>
                  <option value="married">
                    متأهل
                  </option>
                  <option value="divorced">
                    مطلقه
                  </option>
                  <option value="widowed">
                    بیوه
                  </option>
                </BaseSelect>
              </div>
            </div>

            <!-- No Data Overlay -->
            <div
              v-if="!report.finalDemographicProfile ||
                Object.values(report.finalDemographicProfile).every(value => !value)"
              class="bg-muted-100/50 dark:bg-muted-900/50 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm"
            >
              <div class="text-center">
                <Icon
                  name="ph:user-circle-minus-duotone"
                  class="text-muted-400 mb-2 size-12"
                />
                <p class="text-muted-500 dark:text-muted-400">
                  اطلاعات جمعیت‌شناختی در دسترس نیست
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar Content -->
      <div class="col-span-12 mb-5 lg:col-span-4">
        <!-- Possible Deeper Goals Card -->
        <div class="col-span-12 lg:col-span-6">
          <BaseCard class="h-full p-6" shape="curved">
            <div class="mb-2 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>اهداف عمیق‌تر ممکن</span>
              </BaseHeading>
            </div>
            <div class="flex justify-between">
              <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                <Icon name="ph:target-duotone" class="size-4" />
                <span>اهداف و انگیزه‌های زیربنایی مراجع</span>
              </BaseParagraph>
            </div>
            <div class="mt-6">
              <div v-if="report.possibleDeeperGoals.length > 0" class="space-y-4">
                <div
                  v-for="(goal, idx) in report.possibleDeeperGoals"
                  :key="idx"
                  class="group relative"
                >
                  <BaseCard
                    shape="rounded"
                    class="border-success-100 dark:border-success-500/20 border-2 p-4 transition-all duration-300 hover:shadow-lg"
                  >
                    <div class="flex w-full items-start gap-3">
                      <div class="bg-success-500/10 dark:bg-success-500/20 rounded-lg p-2">
                        <Icon name="ph:target-duotone" class="text-success-500 size-5" />
                      </div>
                      <div class="flex-1">
                        <BaseText size="xs" class="text-muted-600">
                          {{ goal }}
                        </BaseText>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              </div>
              <div v-else class="text-center">
                <Icon name="ph:target-duotone" class="text-muted-400 mb-2 size-12" />
                <BaseText size="sm" class="text-muted-400">
                  در حال حاضر هدفی ثبت نشده است.
                </BaseText>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Possible Risk Factors Card -->
        <div class="col-span-12 mt-4 lg:col-span-6">
          <BaseCard class="h-full p-6" shape="curved">
            <div class="mb-2 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                lead="tight"
                class="text-muted-800 dark:text-white"
              >
                <span>عوامل خطر احتمالی</span>
              </BaseHeading>
            </div>
            <div class="flex justify-between">
              <BaseParagraph size="xs" class="text-muted-400 max-w-full">
                <Icon name="ph:warning-circle-duotone" class="size-4" />
                <span>عوامل خطر شناسایی شده در جلسات</span>
              </BaseParagraph>
            </div>
            <div class="mt-6">
              <div v-if="report.possibleRiskFactors.length > 0" class="space-y-4">
                <div v-for="(group, idx) in report.possibleRiskFactors" :key="idx">
                  <div
                    v-for="(risk, j) in group"
                    :key="j"
                    class="group relative"
                  >
                    <BaseCard
                      shape="rounded"
                      class="border-danger-100 dark:border-danger-500/20 border-2 p-4 transition-all duration-300 hover:shadow-lg"
                    >
                      <div class="flex w-full items-start gap-3">
                        <div class="bg-danger-500/10 dark:bg-danger-500/20 rounded-lg p-2">
                          <Icon name="ph:warning-circle-duotone" class="text-danger-500 size-5" />
                        </div>
                        <div class="flex-1">
                          <BaseHeading
                            as="h4"
                            size="sm"
                            weight="medium"
                            lead="none"
                            class="text-danger-500 mb-3"
                          >
                            {{ risk.title }}
                          </BaseHeading>
                          <BaseText size="xs" class="text-muted-600">
                            {{ risk.description }}
                          </BaseText>
                        </div>
                      </div>
                    </BaseCard>
                  </div>
                </div>
              </div>
              <div v-else class="text-center">
                <Icon name="ph:warning-circle-duotone" class="text-muted-400 mb-2 size-12" />
                <BaseText size="sm" class="text-muted-400">
                  در حال حاضر عامل خطری شناسایی نشده است.
                </BaseText>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'گزارش نهایی',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const isLoading = ref(true)
const hasData = ref(true)
const router = useRouter()
const { getReportByUserId } = useReport()
const nuxtApp = useNuxtApp()
// For demo, we'll simulate data fetching with a timeout
const report = ref({
  collectionId: '',
  collectionName: '',
  created: '',
  finalDemographicProfile: {
    age: null,
    education: null,
    firstName: null,
    gender: null,
    lastName: null,
    maritalStatus: null,
    occupation: null,
  },
  id: '',
  possibleDeeperGoals: [],
  possibleRiskFactors: [],
  summaries: [],
  totalSessions: 0,
  updated: '',
  user: '',
})

// Function to fetch reports
async function fetchReport() {
  isLoading.value = true

  try {
    // Get current user
    const userId = nuxtApp.$pb.authStore.baseModel.id

    if (!userId) {
      hasData.value = false
      return
    }

    // Get report for the current user
    const userReport = await getReportByUserId(userId)

    if (userReport) {
      report.value = userReport
      hasData.value = true
    }
    else {
      hasData.value = false
    }
  }
  catch (error) {
    console.error('Error fetching report:', error)
    hasData.value = false
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchReport()
})

function startNewSession() {
  // Navigate to the session creation page
  router.push('/darmana/therapists/sessions')
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)

  // Format date and time separately and combine with dash
  const dateOnly = d.toLocaleDateString('fa-IR', { dateStyle: 'short' })
  const timeOnly = d.toLocaleTimeString('fa-IR', { timeStyle: 'short' })

  return `${dateOnly}-${timeOnly}`
}
</script>

<style scoped>
/* Optional: custom styles for RTL and better appearance */
[dir="rtl"] .list-disc { padding-right: 1.5rem; }
</style>
