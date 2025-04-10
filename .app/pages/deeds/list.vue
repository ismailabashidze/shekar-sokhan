<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  title: 'پیشنهادات نیک',
  preview: {
    title: 'پیشنهادات اعمال نیک',
    description: 'برای دریافت کد اشتراک از طریق انجام کارهای نیک',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-jobs.png',
    srcDark: '/img/screens/dashboards-jobs-dark.png',
    order: 14,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()

// Type mapping for display
const typeMapping = {
  family: 'خانواده',
  society: 'جامعه',
  spiritual: 'معنویت',
} as const

// Difficulty mapping for display
const difficultyMapping = {
  simple: 'ساده',
  moderate: 'متوسط',
  hard: 'چالش‌برانگیز',
} as const

// Reverse mappings for converting display text to DB values
const reverseTypeMapping = Object.entries(typeMapping).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {} as Record<string, string>)

const reverseDifficultyMapping = Object.entries(difficultyMapping).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {} as Record<string, string>)

// Initialize state from query params
const search = ref(route.query.search?.toString() || '')
const selectedType = ref(route.query.type?.toString() || 'all')
const selectedDifficulty = ref(route.query.difficulty?.toString() || 'all')
const selectedTypes = ref<string[]>(
  route.query.types
    ? Array.isArray(route.query.types)
      ? route.query.types
      : [route.query.types.toString()]
    : Object.keys(typeMapping),
)
const selectedDifficulties = ref<string[]>(
  route.query.difficulties
    ? Array.isArray(route.query.difficulties)
      ? route.query.difficulties
      : [route.query.difficulties.toString()]
    : Object.keys(difficultyMapping),
)

const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = ref(10)
const totalDeeds = ref(0)

const loading = ref(true)
const error = ref<Error | null>(null)

const typeCounts = ref<Record<string, number>>({})
const difficultyCounts = ref<Record<string, number>>({})

const { getApprovedDeeds } = useDeed()
const deeds = ref([])

// Initialize with all types and difficulties selected
onMounted(() => {
  fetchDeeds()
})

// Fetch deeds with filters
const fetchDeeds = async () => {
  try {
    loading.value = true
    error.value = null

    // Get paginated deeds
    const result = await getApprovedDeeds({
      search: search.value || undefined,
      type: selectedType.value === 'all' ? undefined : selectedType.value,
      difficulty: selectedDifficulty.value === 'all' ? undefined : selectedDifficulty.value,
      selectedTypes: selectedTypes.value.length > 0 ? selectedTypes.value : undefined,
      selectedDifficulties: selectedDifficulties.value.length > 0 ? selectedDifficulties.value : undefined,
      page: currentPage.value,
      perPage: itemsPerPage.value,
    })

    const items = result?.items || []
    deeds.value = items.slice().reverse()
    totalDeeds.value = result?.total || 0

    // Get total counts for types and difficulties
    const totalResult = await getApprovedDeeds({
      perPage: 1,
      page: 1,
    })

    // Reset counts
    typeCounts.value = Object.keys(typeMapping).reduce((acc, type) => {
      acc[type] = 0
      return acc
    }, {} as Record<string, number>)

    difficultyCounts.value = Object.keys(difficultyMapping).reduce((acc, difficulty) => {
      acc[difficulty] = 0
      return acc
    }, {} as Record<string, number>)

    // Count all items
    totalResult.items.forEach((deed: any) => {
      if (deed.type) typeCounts.value[deed.type] = (typeCounts.value[deed.type] || 0) + 1
      if (deed.difficulty) difficultyCounts.value[deed.difficulty] = (difficultyCounts.value[deed.difficulty] || 0) + 1
    })
  }
  catch (err: any) {
    console.error('Error fetching deeds:', err)
    error.value = err
  }
  finally {
    loading.value = false
  }
}

// Update URL when filters change
const updateQueryParams = () => {
  const query: Record<string, any> = {
    page: currentPage.value,
  }

  if (search.value) query.search = search.value
  if (selectedType.value !== 'all') query.type = selectedType.value
  if (selectedDifficulty.value !== 'all') query.difficulty = selectedDifficulty.value
  if (selectedTypes.value.length < Object.keys(typeMapping).length) query.types = selectedTypes.value
  if (selectedDifficulties.value.length < Object.keys(difficultyMapping).length) query.difficulties = selectedDifficulties.value

  router.push({ query })
}

// Handle page change
const handlePageChange = (page: number) => {
  if (page < 1 || page > Math.ceil(totalDeeds.value / itemsPerPage.value)) return
  currentPage.value = page
  updateQueryParams()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for filter changes with debounce
const debouncedFetch = useDebounceFn(() => {
  currentPage.value = 1
  updateQueryParams()
}, 300)

watch([search], () => {
  if (search.value.length >= 2 || search.value === '') {
    debouncedFetch()
  }
})

// Watch dropdown changes and update checkboxes
watch(selectedType, (newType) => {
  if (newType === 'all') {
    selectedTypes.value = Object.keys(typeMapping)
  }
  else if (newType) {
    selectedTypes.value = [newType]
  }
  currentPage.value = 1
  updateQueryParams()
})

watch(selectedDifficulty, (newDifficulty) => {
  if (newDifficulty === 'all') {
    selectedDifficulties.value = Object.keys(difficultyMapping)
  }
  else if (newDifficulty) {
    selectedDifficulties.value = [newDifficulty]
  }
  currentPage.value = 1
  updateQueryParams()
})

// Watch checkbox changes and update dropdowns
watch(selectedTypes, (newTypes) => {
  if (newTypes.length === Object.keys(typeMapping).length) {
    selectedType.value = 'all'
  }
  else if (newTypes.length === 1) {
    selectedType.value = newTypes[0]
  }
  else {
    selectedType.value = ''
  }
  currentPage.value = 1
  updateQueryParams()
}, { deep: true })

watch(selectedDifficulties, (newDifficulties) => {
  if (newDifficulties.length === Object.keys(difficultyMapping).length) {
    selectedDifficulty.value = 'all'
  }
  else if (newDifficulties.length === 1) {
    selectedDifficulty.value = newDifficulties[0]
  }
  else {
    selectedDifficulty.value = ''
  }
  currentPage.value = 1
  updateQueryParams()
}, { deep: true })

// Update toggleType and toggleDifficulty functions
const toggleType = (displayType: string) => {
  const dbType = reverseTypeMapping[displayType]
  const index = selectedTypes.value.indexOf(dbType)
  if (index === -1) {
    // If not selected, only select this one
    selectedTypes.value = [dbType]
  }
  else if (selectedTypes.value.length === 1) {
    // If this was the only one selected, select all
    selectedTypes.value = Object.keys(typeMapping)
  }
  else {
    // If multiple were selected, only select this one
    selectedTypes.value = [dbType]
  }
}

const toggleDifficulty = (displayDifficulty: string) => {
  const dbDifficulty = reverseDifficultyMapping[displayDifficulty]
  const index = selectedDifficulties.value.indexOf(dbDifficulty)
  if (index === -1) {
    // If not selected, only select this one
    selectedDifficulties.value = [dbDifficulty]
  }
  else if (selectedDifficulties.value.length === 1) {
    // If this was the only one selected, select all
    selectedDifficulties.value = Object.keys(difficultyMapping)
  }
  else {
    // If multiple were selected, only select this one
    selectedDifficulties.value = [dbDifficulty]
  }
}

// Handle search button click
const handleSearch = () => {
  fetchDeeds()
}

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'خانواده':
    case 'والدین':
    case 'همسر':
      return 'primary'
    case 'معنوی':
      return 'info'
    case 'جامعه':
    case 'همسایه':
    case 'دوستان':
      return 'success'
    case 'تشیع':
      return 'warning'
    default:
      return 'default'
  }
}

const formatTime = (time: string) => {
  switch (time) {
    case 'below_15':
      return 'کمتر از ۱۵ دقیقه'
    case 'between_15_60':
      return '۱۵ تا ۶۰ دقیقه'
    case 'more_60':
      return 'بیش از ۶۰ دقیقه'
    default:
      return time
  }
}

// Get type count with proper mapping
const getTypeCount = (displayType: string) => {
  const dbType = reverseTypeMapping[displayType]
  return typeCounts.value[dbType] || 0
}

// Get difficulty count with proper mapping
const getDifficultyCount = (displayDifficulty: string) => {
  const dbDifficulty = reverseDifficultyMapping[displayDifficulty]
  return difficultyCounts.value[dbDifficulty] || 0
}

const totalPages = computed(() => Math.ceil(totalDeeds.value / itemsPerPage.value))

const pageNumbers = computed(() => {
  const pages = []
  const total = Math.ceil(totalDeeds.value / itemsPerPage.value)
  for (let i = 1; i <= total; i++) {
    pages.push(i)
  }
  return pages
})

// Reset pagination when filters change
watch([search, selectedType, selectedDifficulty, selectedTypes, selectedDifficulties], () => {
  currentPage.value = 1
})

// Watch query params for changes
watch(() => route.query, () => {
  fetchDeeds()
}, { deep: true })

// Retry button handler
const handleRetry = () => {
  fetchDeeds()
}

// Reset filters
const resetFilters = () => {
  search.value = ''
  selectedType.value = 'all'
  selectedDifficulty.value = 'all'
  selectedTypes.value = Object.keys(typeMapping)
  selectedDifficulties.value = Object.keys(difficultyMapping)
  currentPage.value = 1
  updateQueryParams()
}

// Toggle type filter
// const toggleType = (displayType: string) => {
//   const dbType = reverseTypeMapping[displayType]
//   const index = selectedTypes.value.indexOf(dbType)
//   if (index === -1) {
//     selectedTypes.value.push(dbType)
//   }
//   else {
//     selectedTypes.value.splice(index, 1)
//   }
// }

// Toggle difficulty filter
// const toggleDifficulty = (displayDifficulty: string) => {
//   const dbDifficulty = reverseDifficultyMapping[displayDifficulty]
//   const index = selectedDifficulties.value.indexOf(dbDifficulty)
//   if (index === -1) {
//     selectedDifficulties.value.push(dbDifficulty)
//   }
//   else {
//     selectedDifficulties.value.splice(index, 1)
//   }
// }
</script>

<template>
  <div class="pb-4 pt-6">
    <!-- Search bar -->
    <BaseCard rounded="lg" class="p-6">
      <div class="flex flex-col gap-4 sm:flex-row">
        <div class="flex-1">
          <BaseInput
            v-model.trim="search"
            rounded="lg"
            icon="lucide:search"
            placeholder="جستجوی کارهای نیک"
          />
        </div>
        <div class="w-full sm:w-40">
          <BaseSelect
            v-model="selectedType"
            rounded="lg"
            icon="ph:article"
            label=""
            hide-label
          >
            <option value="">
              انتخاب نوع کار نیک
            </option>
            <option value="all">
              همه
            </option>
            <option value="family">
              خانواده
            </option>
            <option value="society">
              جامعه
            </option>
            <option value="spiritual">
              معنویت
            </option>
          </BaseSelect>
        </div>
        <div class="w-full sm:w-40">
          <BaseSelect
            v-model="selectedDifficulty"
            rounded="lg"
            icon="ph:hand-fist"
            label=""
            hide-label
          >
            <option value="">
              انتخاب سطح سختی
            </option>
            <option value="all">
              همه
            </option>
            <option value="simple">
              ساده
            </option>
            <option value="moderate">
              متوسط
            </option>
            <option value="hard">
              چالش‌برانگیز
            </option>
          </BaseSelect>
        </div>
        <div class="w-full sm:w-32">
          <BaseButton
            type="button"
            color="primary"
            rounded="lg"
            class="w-full"
            @click="handleSearch"
          >
            جستجو
          </BaseButton>
        </div>
        <div class=" sm:w-32">
          <BaseButtonIcon rounded="full" @click="resetFilters">
            <Icon name="ph:arrows-counter-clockwise-bold" class="size-5" />
          </BaseButtonIcon>
        </div>
      </div>
    </BaseCard>

    <!-- Loading state -->
    <template v-if="loading">
      <div class="mt-6 grid grid-cols-12 gap-6">
        <!-- Filters skeleton -->
        <div class="ptablet:col-span-4 ltablet:col-span-4 col-span-12 lg:col-span-3">
          <div class="w-full">
            <BaseCard rounded="lg" class="p-6">
              <div class="nui-placeload animate-nui-placeload h-8 w-1/2 rounded-lg" />
              <div class="mt-6">
                <div class="nui-placeload animate-nui-placeload h-10 w-full rounded-lg" />
              </div>
              <div class="mt-6">
                <div class="space-y-4">
                  <div class="nui-placeload animate-nui-placeload h-6 w-full rounded-lg" />
                  <div class="nui-placeload animate-nui-placeload h-6 w-full rounded-lg" />
                  <div class="nui-placeload animate-nui-placeload h-6 w-full rounded-lg" />
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Content skeleton -->
        <div class="ptablet:col-span-8 ltablet:col-span-8 col-span-12 lg:col-span-9">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <template v-for="n in 4" :key="n">
              <BaseCard rounded="lg" class="p-6">
                <div class="flex items-center justify-between">
                  <div class="nui-placeload animate-nui-placeload size-10 rounded-lg" />
                  <div class="nui-placeload animate-nui-placeload h-6 w-24 rounded-lg" />
                </div>
                <div class="mt-4 space-y-4">
                  <div class="nui-placeload animate-nui-placeload h-6 w-full rounded-lg" />
                  <div class="nui-placeload animate-nui-placeload h-6 w-3/4 rounded-lg" />
                  <div class="nui-placeload animate-nui-placeload h-6 w-1/2 rounded-lg" />
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="nui-placeload animate-nui-placeload h-8 w-20 rounded-lg" />
                  <div class="nui-placeload animate-nui-placeload h-8 w-20 rounded-lg" />
                </div>
              </BaseCard>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- Error state -->
    <div v-else-if="error" class="flex h-64 flex-col items-center justify-center">
      <div class="text-muted-800 dark:text-muted-100 text-lg font-medium">
        خطا در دریافت اطلاعات
      </div>
      <p class="text-muted-500 mt-2 text-sm">
        {{ error.message }}
      </p>
      <BaseButton
        color="primary"
        rounded="sm"
        class="mt-4"
        @click="handleRetry"
      >
        تلاش مجدد
      </BaseButton>
    </div>

    <!-- No results -->
    <div v-else-if="deeds.length === 0" class="mt-6">
      <BasePlaceholderPage
        title="نتیجه‌ای یافت نشد"
        subtitle="هیچ عمل نیکی با این مشخصات پیدا نشد. لطفا معیارهای جستجوی خود را تغییر دهید."
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
            @click="() => {
              search.value = ''
              selectedType.value = ''
              selectedDifficulty.value = ''
              selectedTypes.value = []
              selectedDifficulties.value = []
              fetchDeeds()
            }"
          >
            نمایش همه اعمال نیک
          </BaseButton>
        </template>
      </BasePlaceholderPage>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Grid -->
      <div class="mt-6 grid grid-cols-12 gap-6">
        <!-- Column -->
        <div class="ptablet:col-span-4 ltablet:col-span-4 col-span-12 lg:col-span-3">
          <div class="w-full">
            <div class="bg-muted-200 dark:bg-muted-800 mb-12 rounded-xl p-6">
              <!-- Title -->
              <div class="mb-6">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-2 dark:text-white"
                >
                  <span>ایجاد هشدار کار نیک</span>
                </BaseHeading>
                <BaseParagraph size="xs">
                  <span class="text-muted-500">
                    ایجاد یک هشدار کار نیک مطابق با کلمات کلیدی زیر و در صورت انتشار یک کار نیک جدید مطابق با معیارهای شما، از طریق ایمیل به شما اطلاع‌رسانی می‌شود.
                  </span>
                </BaseParagraph>
              </div>
              <!-- Form -->
              <form class="space-y-2">
                <BaseInput
                  v-model.trim="alertKeyword"
                  rounded="lg"
                  icon="lucide:mail"
                  placeholder="ایمیل شما "
                />
                <BaseButton
                  rounded="lg"
                  color="primary"
                  class="w-full"
                >
                  افزودن
                </BaseButton>
              </form>
            </div>
            <!-- Filters -->
            <div class="bg-muted-200 dark:bg-muted-800 space-y-12 rounded-xl p-6">
              <!-- Filter group -->
              <div class="relative">
                <!-- Title -->
                <div class="mb-6">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="light"
                    lead="tight"
                    class="text-muted-800 mb-2 dark:text-white"
                  >
                    <span>انواع کارهای نیک</span>
                  </BaseHeading>
                </div>
                <!-- Checkboxes -->
                <div class="flex flex-col gap-4 ps-2">
                  <div
                    v-for="(displayType, dbType) in typeMapping"
                    :key="dbType"
                    class="flex items-center justify-between"
                  >
                    <div class="nui-checkbox nui-checkbox-rounded-sm nui-checkbox-primary">
                      <div class="nui-checkbox-outer">
                        <input
                          v-model="selectedTypes"
                          type="checkbox"
                          class="nui-checkbox-input"
                          :value="dbType"
                          @change="toggleType(displayType)"
                        >
                        <div class="nui-checkbox-inner" />
                      </div>
                      <div class="nui-checkbox-label-wrapper">
                        <label class="nui-checkbox-label-text">{{ displayType }}</label>
                      </div>
                    </div>
                    <span class="nui-tag nui-tag-sm nui-tag-rounded-full nui-tag-solid nui-tag-default text-xs">
                      {{ getTypeCount(displayType) }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- Filter group -->
              <div class="relative">
                <!-- Title -->
                <div class="mb-6">
                  <BaseHeading
                    as="h3"
                    size="md"
                    weight="light"
                    lead="tight"
                    class="text-muted-800 mb-2 dark:text-white"
                  >
                    <span>سطح سختی کارهای نیک</span>
                  </BaseHeading>
                </div>
                <!-- Checkboxes -->
                <div class="flex flex-col gap-4 ps-2">
                  <div
                    v-for="(displayDifficulty, dbDifficulty) in difficultyMapping"
                    :key="dbDifficulty"
                    class="flex items-center justify-between"
                  >
                    <div class="nui-checkbox nui-checkbox-rounded-sm nui-checkbox-primary">
                      <div class="nui-checkbox-outer">
                        <input
                          v-model="selectedDifficulties"
                          type="checkbox"
                          class="nui-checkbox-input"
                          :value="dbDifficulty"
                          @change="toggleDifficulty(displayDifficulty)"
                        >
                        <div class="nui-checkbox-inner" />
                      </div>
                      <div class="nui-checkbox-label-wrapper">
                        <label class="nui-checkbox-label-text">{{ displayDifficulty }}</label>
                      </div>
                    </div>
                    <span class="nui-tag nui-tag-sm nui-tag-rounded-full nui-tag-solid nui-tag-default text-xs">
                      {{ getDifficultyCount(displayDifficulty) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column -->
        <div class="ptablet:col-span-8 ltablet:col-span-8 col-span-12 lg:col-span-9">
          <!-- Title -->
          <div class="mb-6">
            <BaseHeading
              as="h3"
              size="lg"
              weight="light"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>نمایش {{ totalDeeds }} کار نیک</span>
            </BaseHeading>
            <BaseParagraph size="sm">
              <span class="text-muted-500">
                این‌ها کارهای نیک هستند که ما پیدا کردیم
              </span>
            </BaseParagraph>
          </div>

          <!-- Inner jobs grid -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              v-for="deed in deeds"
              :key="deed.id"
              class="relative"
            >
              <BaseCard rounded="lg" class="p-6">
                <div class="flex w-full flex-col gap-4 sm:flex-row">
                  <div
                    :data-nui-tooltip="deed.type"
                    class="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                    :class="{
                      'bg-primary-500/10 dark:bg-primary-500/20': deed.type === 'family',
                      'bg-success-500/10 dark:bg-success-500/20': deed.type === 'society',
                      'bg-info-500/10 dark:bg-info-500/20': deed.type === 'spiritual'
                    }"
                  >
                    {{ deed.emoji }}
                  </div>
                  <div class="flex-1">
                    <div class="mb-2 flex items-center justify-between">
                      <BaseHeading
                        as="h4"
                        size="md"
                        weight="semibold"
                        lead="tight"
                        class="text-muted-800 dark:text-white"
                      >
                        {{ deed.title }}
                      </BaseHeading>
                      <BaseTag
                        :color="deed.status === 'approved' ? 'success' : deed.status === 'pending' ? 'warning' : 'info'"
                        rounded="lg"
                      >
                        {{ deed.status === 'approved' ? 'تایید شده' : deed.status === 'pending' ? 'در انتظار' : 'پیش‌نویس' }}
                      </BaseTag>
                    </div>
                    <BaseParagraph size="sm" class="mb-4">
                      <span class="text-muted-500 dark:text-muted-400">
                        {{ deed.shortDescription }}
                      </span>
                    </BaseParagraph>
                    <div class="mb-4 flex flex-wrap items-center gap-2">
                      <BaseTag
                        v-for="tag in deed.tags"
                        :key="tag"
                        :color="getTagColor(tag)"
                        size="sm"
                        rounded="lg"
                      >
                        {{ tag }}
                      </BaseTag>
                    </div>
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1">
                          <Icon name="ph:eye-duotone" class="text-primary-500 size-4" />
                          <span class="text-muted-500 dark:text-muted-400 text-xs">{{ deed.views }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-4" />
                          <span class="text-muted-500 dark:text-muted-400 text-xs">{{ deed.completions }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <Icon
                            :name="deed.difficulty === 'simple' ? 'ph:asterisk-simple' : deed.difficulty === 'moderate' ? 'ph:star' : 'ph:sparkle'"
                            class="size-4 text-yellow-400"
                          />
                          <span class="text-muted-500 dark:text-muted-400 text-xs">
                            {{ deed.difficulty === 'simple' ? 'ساده' : deed.difficulty === 'moderate' ? 'متوسط' : 'چالش‌برانگیز' }}
                          </span>
                        </div>
                        <div class="flex items-center gap-1">
                          <Icon name="ph:clock-duotone" class="text-info-500 size-4" />
                          <span class="text-muted-500 dark:text-muted-400 text-xs">{{ formatTime(deed.timeRequired) }}</span>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <!-- <BaseButtonIcon rounded="full" color="primary">
                          <Icon name="ph:play" class="size-5" />
                        </BaseButtonIcon> -->
                        <BaseButton
                          rounded="full"
                          size="sm"
                          color="info"
                          @click="navigateTo(`/deeds/${deed.id}`)"
                        >
                          <Icon name="ph:info" class="ml-2 size-5" />
                          <span>جزییات</span>
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalDeeds > itemsPerPage" class="mt-6 flex justify-center">
            <div class="nui-pagination nui-pagination-rounded-sm nui-pagination-primary">
              <ul class="nui-pagination-list nui-pagination-rounded-sm">
                <li v-for="page in pageNumbers" :key="page">
                  <button
                    class="nui-pagination-link"
                    :class="{ 'nui-active': currentPage === page }"
                    @click="handlePageChange(page)"
                  >
                    {{ page }}
                  </button>
                </li>
              </ul>
              <div class="nui-pagination-buttons nui-pagination-rounded-sm">
                <button
                  class="nui-pagination-button"
                  :disabled="currentPage === 1"
                  @click="handlePageChange(currentPage - 1)"
                >
                  <Icon name="ph:caret-left-bold" class="size-4" />
                </button>
                <button
                  class="nui-pagination-button"
                  :disabled="currentPage === totalPages"
                  @click="handlePageChange(currentPage + 1)"
                >
                  <Icon name="ph:caret-right-bold" class="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.animate-nui-placeload {
  background: linear-gradient(
    90deg,
    rgba(var(--color-muted-200), 0.5) 25%,
    rgba(var(--color-muted-200), 0.7) 37%,
    rgba(var(--color-muted-200), 0.5) 63%
  );
  background-size: 400% 100%;
  animation: placeload 1.5s ease infinite;
}

@keyframes placeload {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.dark .animate-nui-placeload {
  background: linear-gradient(
    90deg,
    rgba(var(--color-muted-800), 0.5) 25%,
    rgba(var(--color-muted-800), 0.7) 37%,
    rgba(var(--color-muted-800), 0.5) 63%
  );
}
</style>
