<script setup lang="ts">
interface TherapistData {
  id: string
  username: string
  position: string
  src: string
  badge: string
  location: string
  industry: string
  status: string
  tasks: {
    pending: number
    done: number
    status: number
  }
  description: string
}

definePageMeta({
  title: 'انتخاب عامل هوش مصنوعی',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(18)

// Add role from useUser composable
const { role } = useUser()
const isAdmin = computed(() => role.value === 'admin')

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

const query = computed(() => {
  return {
    filter: filter.value,
    perPage: perPage.value,
    page: page.value,
  }
})

const data = ref<{ data: TherapistData[] }>({
  data: [],
})

const pending = ref()
const error = ref()
const refresh = ref()

// Import therapist composable
const { getTherapists } = useTherapist()

// Fetch therapists from the composable
const fetchTherapists = async () => {
  pending.value = true
  try {
    const therapists = await getTherapists()

    // Map therapists to the format expected by the template
    const mappedTherapists = therapists.map(therapist => ({
      id: therapist.id,
      username: therapist.name,
      position: therapist.specialty,
      src: therapist.avatar ? `https://pocket.zehna.ir/api/files/therapists/${therapist.id}/${therapist.avatar}` : '/img/avatars/default-male.jpg',
      badge: '/img/hamdel.png',
      location: 'ایران، تهران',
      industry: 'روان درمانا',
      status: therapist.isActive ? 'online' : 'working',
      tasks: {
        pending: 0,
        done: 0,
        status: therapist.isActive ? 0 : 1,
      },
      description: therapist.shortDescription || therapist.longDescription || '',
    }))

    data.value = { data: mappedTherapists }
  }
  catch (err) {
    console.error('Error fetching therapists:', err)
    error.value = 'خطا در دریافت اطلاعات روانشناسان'
  }
  finally {
    pending.value = false
  }
}

// Fetch therapists on component mount
onMounted(() => {
  fetchTherapists()
})

// Refresh function for manual refresh
refresh.value = fetchTherapists

// Function to get random color for avatars
function getRandomColor() {
  const colors = [
    'bg-primary-500',
    'bg-info-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-danger-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-green-500',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<template>
  <div>
    <TairoContentWrapper class="mb-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="ph:robot-duotone" class="text-primary-500 ml-2 size-6" />
          <BaseHeading
            tag="h2"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            انتخاب عامل هوش مصنوعی
          </BaseHeading>
        </div>

        <div class="flex items-center gap-2">
          <BaseButton
            v-if="isAdmin"
            color="primary"
            class="w-full gap-1 sm:w-32"
            shape="curved"
            @click="navigateTo('/darmana/therapists/newAITherapist')"
          >
            <Icon name="ph:plus-bold" class="size-4" />
            <span>افزودن</span>
          </BaseButton>
          <BaseInput
            v-model="filter"
            icon="lucide:search"
            placeholder="جستجوی عامل ها..."
            :classes="{
              wrapper: 'w-full sm:w-64',
            }"
          />
          <BaseThemeToggle />
        </div>
      </div>

      <BaseParagraph size="sm" class="text-muted-400 mt-2">
        عامل مورد نظر خود را برای شروع گفتگو انتخاب کنید
      </BaseParagraph>
      <div class="mt-2">
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          عامل‌های هوش مصنوعی ما برای کمک به شما در زمینه‌های مختلف طراحی شده‌اند. هر عامل دارای ویژگی‌ها و تخصص‌های منحصر به فرد است که می‌تواند به شما در بهبود تکنیک های روانشناختی، مدیریت استرس، افزایش اعتماد به نفس، بهبود مهارت های اجتماعی و بسیاری از موارد دیگر کمک کند.
        </BaseParagraph>
      </div>

      <!-- Loading state (if needed) -->
      <div v-if="pending" class="py-10">
        <div class="flex flex-col items-center justify-center">
          <div class="mt-8 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="i in 8"
              :key="i"
              class="flex flex-col"
            >
              <BaseCard shape="curved" class="flex flex-col overflow-hidden">
                <div class="bg-muted-50 dark:bg-muted-800/30 p-6">
                  <div class="flex items-center justify-between">
                    <BasePlaceload class="h-4 w-20 rounded" />
                    <BasePlaceload class="size-7 rounded-full" />
                  </div>
                </div>
                <div class="flex grow flex-col p-6">
                  <div class="mb-3 flex w-full items-center justify-center">
                    <BasePlaceload class="size-16 rounded-full" />
                  </div>
                  <div class="text-center">
                    <BasePlaceload class="mx-auto h-4 w-32 rounded" />
                    <BasePlaceload class="mx-auto mt-2 h-3 w-24 rounded" />
                  </div>
                  <div class="mb-6 mt-4 flex items-center justify-center">
                    <BasePlaceload class="h-3 w-full rounded" />
                  </div>
                  <div class="mt-auto flex items-center gap-2">
                    <BasePlaceload class="h-9 w-full rounded-lg" />
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="!pending && data?.data.length === 0">
        <BasePlaceholderPage
          title="نتیجه‌ای یافت نشد"
          subtitle="هیچ عاملی با این مشخصات پیدا نشد. لطفا معیارهای جستجوی خود را تغییر دهید."
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
            <BaseButton
              color="primary"
              shape="curved"
              @click="filter = ''"
            >
              نمایش همه عامل‌ها
            </BaseButton>
          </template>
        </BasePlaceholderPage>
      </div>

      <!-- Results grid -->
      <div
        v-else
        class="mt-8 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TransitionGroup
          enter-active-class="transform-gpu"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transform-gpu"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div
            v-for="therapist in data.data"
            :key="therapist.id"
            class="flex flex-col"
          >
            <BaseCard shape="curved" class="flex flex-col overflow-hidden">
              <div class="bg-muted-50 dark:bg-muted-800/30 p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <BaseTag
                      :color="therapist.status === 'online' ? 'success' : 'warning'"
                      shape="curved"
                      size="sm"
                    >
                      {{ therapist.status === 'online' ? 'فعال' : 'غیرفعال' }}
                    </BaseTag>
                  </div>
                </div>
              </div>
              <div class="therapist-card-content flex p-6">
                <div class="mb-3 flex w-full items-center justify-center">
                  <BaseAvatar
                    :src="therapist.src"
                    :alt="therapist.username"
                    :badge-src="therapist.badge"
                    size="xl"
                    :class="getRandomColor()"
                  />
                </div>
                <div class="text-center">
                  <BaseHeading
                    as="h3"
                    size="sm"
                    weight="medium"
                    lead="tight"
                    class="text-muted-800 dark:text-white"
                  >
                    {{ therapist.username }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-400">
                    {{ therapist.position }}
                  </BaseParagraph>
                </div>
                <div class="mb-6 mt-4 text-center">
                  <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 therapist-description">
                    {{ therapist.description }}
                  </BaseParagraph>
                </div>
                <div class="mt-auto flex items-center gap-2">
                  <BaseButton
                    v-if="isAdmin"
                    class="w-full"
                    shape="curved"
                    @click="navigateTo(`/darmana/therapists/editAITherapist?userId=${therapist.id}`)"
                  >
                    <Icon name="ph:pencil-duotone" class="ml-2 size-4" />
                    <span>ویرایش</span>
                  </BaseButton>
                  <BaseButton
                    color="primary"
                    class="w-full"
                    shape="curved"
                    @click="navigateTo(`/darmana/therapists/messaging?therapistId=${therapist.id}`)"
                  >
                    <Icon name="ph:chat-circle-dots-duotone" class="ml-2 size-5" />
                    <span>گفتگو</span>
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>
        </TransitionGroup>
      </div>
    </TairoContentWrapper>
  </div>
</template>

<style scoped>
.therapist-card-content {
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

.therapist-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
