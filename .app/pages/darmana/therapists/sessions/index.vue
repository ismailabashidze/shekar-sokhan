<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: 'جلسات مشاوره',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const statusFilter = ref('all')
const perPage = ref(10)
const sessions = ref([])
const loading = ref(false)
const toaster = useToaster()

watch([filter, statusFilter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

const { getSessions } = useSessions()

// Format date to Persian format
const formatDate = (dateString) => {
  if (!dateString) return 'تاریخ نامشخص'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Format duration in minutes to readable format
const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return 'زمان ثبت نشده'
  if (minutes < 60) return `${minutes} دقیقه`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours} ساعت و ${remainingMinutes} دقیقه`
}

// Get status display text and color
const getStatusInfo = (status) => {
  switch (status) {
    case 'inprogress':
      return { text: 'در حال انجام', color: 'warning' }
    case 'done':
      return { text: 'تکمیل شده', color: 'success' }
    case 'closed':
      return { text: 'بسته شده', color: 'info' }
    default:
      return { text: 'نامشخص', color: 'muted' }
  }
}

// Get session type display text and color
const getSessionTypeInfo = (type) => {
  switch (type) {
    case 'educational':
      return { text: 'آموزشی', color: 'info', icon: 'ph:graduation-cap-duotone' }
    case 'therapic':
      return { text: 'درمانی', color: 'success', icon: 'ph:heartbeat-duotone' }
    default:
      return { text: 'نامشخص', color: 'muted', icon: 'ph:question-duotone' }
  }
}

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return 'زمان نامشخص'
  const date = new Date(timeString)
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Fetch sessions
const fetchSessions = async () => {
  loading.value = true
  try {
    let filterObj = {}

    if (statusFilter.value !== 'all') {
      filterObj.status = statusFilter.value
    }

    const result = await getSessions(filterObj)
    sessions.value = result
    console.log('Sessions loaded:', sessions.value)
  }
  catch (error) {
    console.error('Error fetching sessions:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در دریافت اطلاعات جلسات',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
  finally {
    loading.value = false
  }
}

// Refresh sessions data
const refreshSessions = () => {
  fetchSessions()
  toaster.show({
    title: 'بروزرسانی',
    message: 'اطلاعات جلسات بروزرسانی شد',
    color: 'success',
    icon: 'ph:check-circle-fill',
    closable: true,
  })
}

// Navigate to session analysis
const viewSessionAnalysis = (sessionId) => {
  navigateTo(`/darmana/therapists/analysis?analysis_id=${sessionId}`)
}

// Navigate to session history
const viewSessionHistory = (sessionId) => {
  navigateTo(`/darmana/therapists/history?sessionId=${sessionId}`)
}

// Continue a session
const continueSession = (therapistId) => {
  navigateTo(`/darmana/therapists/messaging?therapistId=${therapistId}`)
}

// Filter sessions based on search term
const filteredSessions = computed(() => {
  if (!filter.value.trim()) return sessions.value

  const searchTerm = filter.value.toLowerCase()
  return sessions.value.filter((session) => {
    // Search in therapist name if expanded
    const therapistName = session.expand?.therapist?.name || ''
    // Search in session ID
    return therapistName.toLowerCase().includes(searchTerm)
      || session.id.toLowerCase().includes(searchTerm)
  })
})

// Pagination
const paginatedSessions = computed(() => {
  const start = (page.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredSessions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / perPage.value)
})

// Fetch sessions on component mount
onMounted(() => {
  fetchSessions()
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="ph:chat-circle-text-duotone" class="text-primary-500 ml-2 size-6" />
          <BaseHeading
            tag="h2"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            جلسات مشاوره
          </BaseHeading>
        </div>

        <div class="flex items-center gap-2">
          <BaseSelect
            v-model="statusFilter"
            shape="rounded"
            class="w-40"
            @update:model-value="fetchSessions"
          >
            <option value="all">
              همه جلسات
            </option>
            <option value="inprogress">
              در حال انجام
            </option>
            <option value="done">
              تکمیل شده
            </option>
            <option value="closed">
              بسته شده
            </option>
          </BaseSelect>

          <BaseInput
            v-model="filter"
            icon="lucide:search"
            placeholder="جستجو در جلسات..."
            :classes="{
              wrapper: 'w-full sm:w-64',
            }"
          />

          <BaseButton
            color="success"
            shape="curved"
            class="gap-1"
            @click="refreshSessions"
          >
            <Icon name="ph:arrows-clockwise-duotone" class="size-4" />
            <span class="hidden sm:inline">بروزرسانی</span>
          </BaseButton>

          <BaseButton
            color="primary"
            class="w-full gap-1 sm:w-auto"
            shape="curved"
            @click="navigateTo('/darmana/therapists/chooseTherapist')"
          >
            <Icon name="ph:plus-bold" class="size-4" />
            <span>جلسه جدید</span>
          </BaseButton>

          <BaseThemeToggle />
        </div>
      </div>

      <BaseParagraph size="sm" class="text-muted-400 mt-2">
        تاریخچه جلسات مشاوره شما با روانشناسان
      </BaseParagraph>

      <!-- Loading state -->
      <div v-if="loading" class="py-10">
        <div class="flex flex-col items-center justify-center">
          <div class="mt-8 w-full">
            <div
              v-for="i in 5"
              :key="i"
              class="mb-4"
            >
              <BaseCard shape="curved" class="overflow-hidden">
                <div class="p-4">
                  <div class="flex items-center justify-between">
                    <BasePlaceload class="h-5 w-40 rounded" />
                    <BasePlaceload class="h-5 w-20 rounded" />
                  </div>
                  <div class="mt-4 flex items-center justify-between">
                    <BasePlaceload class="h-4 w-32 rounded" />
                    <BasePlaceload class="h-4 w-24 rounded" />
                  </div>
                  <div class="mt-3 flex items-center justify-between">
                    <BasePlaceload class="h-4 w-28 rounded" />
                    <BasePlaceload class="h-8 w-24 rounded" />
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="!loading && filteredSessions.length === 0">
        <BasePlaceholderPage
          title="جلسه‌ای یافت نشد"
          subtitle="هیچ جلسه‌ای با این مشخصات پیدا نشد. لطفا معیارهای جستجوی خود را تغییر دهید یا یک جلسه جدید شروع کنید."
        >
          <template #image>
            <img
              class="block dark:hidden"
              src="/img/illustrations/placeholders/flat/placeholder-search.png"
              alt="Placeholder image"
            >
            <img
              class="hidden dark:block"
              src="/img/illustrations/placeholders/flat/placeholder-search.png"
              alt="Placeholder image"
            >
          </template>
          <template #action>
            <div class="flex gap-2">
              <BaseButton
                color="muted"
                shape="curved"
                @click="statusFilter = 'all'; fetchSessions()"
              >
                نمایش همه جلسات
              </BaseButton>
              <BaseButton
                color="primary"
                shape="curved"
                @click="navigateTo('/darmana/therapists/chooseTherapist')"
              >
                شروع جلسه جدید
              </BaseButton>
            </div>
          </template>
        </BasePlaceholderPage>
      </div>

      <!-- Results list -->
      <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransitionGroup
          enter-active-class="transform-gpu"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transform-gpu"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <BaseCard
            v-for="session in paginatedSessions"
            :key="session.id"
            shape="curved"
            class="border-muted-200 dark:border-muted-700 mb-4 overflow-hidden border transition-all duration-300 hover:shadow-lg"
          >
            <div class="bg-muted-50 dark:bg-muted-800/30 border-muted-200 dark:border-muted-700 border-b p-4">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="flex items-center">
                  <BaseAvatar
                    :src="session.expand?.therapist?.avatar ? `https://pocket.zehna.ir/api/files/therapists/${session.expand.therapist.id}/${session.expand.therapist.avatar}` : '/img/avatars/default-male.jpg'"
                    size="lg"
                    class="ml-3"
                  />
                  <div>
                    <div class="flex items-center">
                      <BaseTag
                        :color="getSessionTypeInfo(session.session_type).color"
                        shape="curved"
                        size="md"
                        class="ml-2"
                      >
                        <div class="flex items-center px-3 py-1">
                          <Icon :name="getSessionTypeInfo(session.session_type).icon" class="ml-1 size-3" />
                          {{ getSessionTypeInfo(session.session_type).text }}
                        </div>
                      </BaseTag>
                      <BaseHeading
                        tag="h3"
                        size="sm"
                        weight="medium"
                        class="text-muted-800 dark:text-white"
                      >
                        {{ session.expand?.therapist?.name || 'روانشناس' }}
                      </BaseHeading>
                    </div>

                    <div v-if="session.expand?.therapist?.specialty" class="text-muted-400 mt-1 text-xs">
                      {{ session.expand.therapist.specialty }}
                    </div>

                    <div class="text-muted-400 mt-1 flex items-center">
                      <Icon name="ph:calendar-duotone" class="ml-1 size-4" />
                      <BaseParagraph size="xs">
                        {{ formatDate(session.created) }}
                      </BaseParagraph>
                    </div>
                  </div>
                </div>

                <div class="mt-3 md:mt-0">
                  <BaseTag
                    :color="getStatusInfo(session.status).color"
                    shape="curved"
                    size="sm"
                  >
                    <div class="px-3 py-1">
                      {{ getStatusInfo(session.status).text }}
                    </div>
                  </BaseTag>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                  <div class="bg-primary-100 dark:bg-primary-500/20 ml-3 rounded-full p-2">
                    <Icon name="ph:clock-duotone" class="text-primary-500 size-5" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-muted-400 text-xs">مدت جلسه</span>
                    <span class="text-muted-800 font-medium dark:text-white">
                      {{ formatDuration(session.total_time_passed) }}
                    </span>
                  </div>
                </div>

                <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                  <div class="bg-info-100 dark:bg-info-500/20 ml-3 rounded-full p-2">
                    <Icon name="ph:chat-dots-duotone" class="text-info-500 size-5" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-muted-400 text-xs">تعداد پیام‌ها</span>
                    <span class="text-muted-800 font-medium dark:text-white">
                      {{ session.count_of_total_messages || '0' }} پیام
                    </span>
                  </div>
                </div>

                <div class="bg-muted-100 dark:bg-muted-800 flex items-center rounded-lg p-3">
                  <div class="bg-success-100 dark:bg-success-500/20 ml-3 rounded-full p-2">
                    <Icon name="ph:timer-duotone" class="text-success-500 size-5" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-muted-400 text-xs">زمان شروع/پایان</span>
                    <span class="text-muted-800 font-medium dark:text-white">
                      {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div class="flex items-center" />

                <div class="flex items-center justify-start gap-2 md:justify-end">
                  <BaseButton
                    v-if="session.status === 'inprogress'"
                    color="primary"
                    shape="curved"
                    @click="continueSession(session.expand?.therapist?.id)"
                  >
                    <Icon name="ph:chat-circle-dots-duotone" class="ml-1 size-4" />
                    ادامه گفتگو
                  </BaseButton>

                  <BaseButton
                    v-if="session.status === 'done'"
                    color="info"
                    shape="curved"
                    @click="viewSessionAnalysis(session.session_analysis_for_system)"
                  >
                    <Icon name="ph:chart-line-duotone" class="ml-1 size-4" />
                    مشاهده تحلیل
                  </BaseButton>

                  <BaseButton
                    color="warning"
                    shape="curved"
                    @click="viewSessionHistory(session.id)"
                  >
                    <Icon name="ph:clock-counter-clockwise-duotone" class="ml-1 size-4" />
                    تاریخچه
                  </BaseButton>

                  <BaseButton
                    v-if="!['done', 'inprogress'].includes(session.status)"
                    color="muted"
                    shape="curved"
                    disabled
                  >
                    <Icon name="ph:info-duotone" class="ml-1 size-4" />
                    {{ session.status === 'closed' ? 'جلسه بسته شده' : 'غیرقابل دسترس' }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </BaseCard>
        </TransitionGroup>

        <!-- Pagination -->
        <div v-if="filteredSessions.length > perPage" class="mt-6">
          <BasePagination
            :total-items="filteredSessions.length"
            :item-per-page="perPage"
            :current-page="page"
            rounded="full"
          />
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>

<style scoped>
.text-muted-400 {
  line-height: 1.6;
}

.flex.items-center {
  line-height: 1.5;
}

/* Remove the margin-bottom that was causing the issue */
.flex.items-center:not(.nui-tag .flex.items-center) {
  margin-bottom: 0.5rem;
}

/* Ensure tag content is visible */
.nui-tag .flex.items-center {
  line-height: normal;
  margin-bottom: 0;
}

.text-xs {
  line-height: 1.6;
  margin-bottom: 0.25rem;
}

.bg-muted-100 {
  line-height: 1.5;
}

.bg-muted-100 .flex-col span {
  line-height: 1.6;
  padding: 0.125rem 0;
}
</style>
