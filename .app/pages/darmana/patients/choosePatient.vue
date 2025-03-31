<script setup lang="ts">
definePageMeta({
  title: 'انتخاب عامل',
  preview: {
    title: 'عامل های هوش مصنوعی',
    description: 'عامل های هوش مصنوعی برای رویکرد های مختلف درمانا',
    categories: ['layouts'],
    src: '/img/screens/layouts-user-grid-4.png',
    srcDark: '/img/screens/layouts-user-grid-4-dark.png',
    order: 67,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(12)
const isLoading = ref(true)
const noResults = ref(false)

const { getPatients } = usePatient()
const { role } = useUser()

// Random colors for avatars
const colors = [
  'bg-primary-500',
  'bg-info-500',
  'bg-success-500',
  'bg-warning-500',
  'bg-danger-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
]

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
}

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

// Fetch patients data
const patients = ref([])
const totalPatients = ref(0)

const fetchPatients = async () => {
  isLoading.value = true
  try {
    const data = await getPatients()
    patients.value = data
    patients.value.map(p => p.badge = '/img/logo.png')
    totalPatients.value = data.length

    // Filter patients if search filter is applied
    if (filter.value) {
      patients.value = patients.value.filter(patient =>
        patient.name.toLowerCase().includes(filter.value.toLowerCase())
        || (patient.shortDescription && patient.shortDescription.toLowerCase().includes(filter.value.toLowerCase())),
      )
    }

    noResults.value = patients.value.length === 0
  }
  catch (error) {
    console.error('Error fetching patients:', error)
  }
  finally {
    isLoading.value = false
  }
}

// Initial fetch
fetchPatients()

// Watch for filter changes to refetch
watch(filter, () => {
  fetchPatients()
})
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
            v-if="role === 'admin'"
            color="primary"
            class="w-full gap-1 sm:w-32"
            shape="curved"
            to="/onboarding/newPatient"
          >
            <Icon name="lucide:plus" class="size-4" />
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

      <!-- Loading state -->
      <div v-if="isLoading" class="py-10">
        <div class="flex flex-col items-center justify-center">
          <div class="mt-8 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="i in 6"
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
      <div v-else-if="noResults" class="py-10">
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
              src="/img/illustrations/placeholders/flat/placeholder-search-2-dark.svg"
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
        class="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TransitionGroup
          enter-active-class="transform-gpu"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transform-gpu"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <BaseCard
            v-for="(item, index) in patients"
            :key="item.id || index"
            shape="curved"
            elevated-hover
            class="flex flex-col overflow-hidden"
          >
            <div class="bg-muted-50 dark:bg-muted-800/30 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <BaseHeading
                    tag="h3"
                    size="sm"
                    weight="medium"
                    lead="none"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ item.isActive ? 'فعال' : 'غیر فعال' }}
                  </BaseHeading>
                </div>
                <div>
                  <Icon
                    :name="item.isActive ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
                    :class="item.isActive ? 'text-success-500 size-7' : 'text-danger-500 size-7'"
                  />
                </div>
              </div>
            </div>
            <div class="flex grow flex-col p-6">
              <div class="mb-3 flex w-full items-center justify-center">
                <BaseAvatar
                  size="xl"
                  rounded="full"
                  :src="item.avatar ? `https://pocket.zehna.ir/api/files/patients/${item.id}/${item.avatar}` : '/img/avatars/1.svg'"
                  :badge-src="item.badge"
                  :text="item.name ? item.name.charAt(0).toUpperCase() : 'A'"
                  :class="getRandomColor()"
                />
              </div>
              <div class="text-center">
                <BaseHeading
                  tag="h3"
                  size="md"
                  weight="medium"
                  lead="none"
                  class="text-muted-800 dark:text-white"
                >
                  {{ item.name }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  {{ item.position || 'عامل هوش مصنوعی' }}
                </BaseParagraph>
              </div>
              <div
                class="text-muted-500 dark:text-muted-400 mb-6 mt-4 flex items-center justify-center gap-3 text-center"
              >
                {{ item.shortDescription || 'توضیحات مختصر درباره این عامل در دسترس نیست.' }}
              </div>
              <div class="mt-auto flex items-center gap-2">
                <BaseButton
                  v-if="role === 'admin'"
                  shape="curved"
                  color="primary"
                  @click="navigateTo(`/darmana/patients/editPatient?userId=${item.id}`)"
                >
                  <Icon name="lucide:edit-3" class="size-4" />
                  <span>ویرایش</span>
                </BaseButton>
                <BaseButton
                  v-if="role !== 'admin'"
                  shape="curved"
                  class="w-full"
                  color="light"
                  @click="navigateTo(`/darmana/patients/editPatient?userId=${item.id}`)"
                >
                  <Icon name="ph:user-duotone" class="ml-2 size-4" />
                  <span>نمایه</span>
                </BaseButton>

                <BaseButton
                  shape="curved"
                  class="w-full"
                  :to="`/darmana/patients/messaging?patientId=${item.id}`"
                  :color="item.isActive ? 'success' : 'muted'"
                  :disabled="!item.isActive"
                >
                  <Icon name="ph:chat-circle-duotone" class="ml-2 size-4" />
                  <span>گفت و گو</span>
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </TransitionGroup>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && patients.length > 0" class="mt-8 flex justify-center">
        <BasePagination
          :total-items="totalPatients"
          :item-per-page="perPage"
          :current-page="page"
          shape="curved"
        />
      </div>
    </TairoContentWrapper>
  </div>
</template>
