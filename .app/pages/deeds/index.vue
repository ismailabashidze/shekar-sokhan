<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Deed } from '~/composables/useDeed'

definePageMeta({
  title: 'کارهای نیک',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { user } = useUser()
const route = useRoute()
const router = useRouter()

const { getMyCoupons } = useDiscountCopoun()

// Pagination
const page = computed(() => parseInt((route.query.page as string) ?? '1'))
const perPage = ref(10)

// Filters
const filter = ref('')
const typeFilter = ref('all')
const difficultyFilter = ref('all')

// Filter deeds
const filteredDeeds = computed(() => {
  return deeds.value
    .filter((deed) => {
      if (typeFilter.value !== 'all' && deed.type !== typeFilter.value) {
        return false
      }
      if (difficultyFilter.value !== 'all' && deed.difficulty !== difficultyFilter.value) {
        return false
      }
      if (filter.value && !deed.title.includes(filter.value)) {
        return false
      }
      return true
    })
})

// Helper functions
const getTypeLabel = (type: string) => {
  switch (type) {
    case 'family':
      return 'خانواده'
    case 'society':
      return 'اجتماعی'
    case 'spiritual':
      return 'معنوی'
    default:
      return type
  }
}

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'simple':
      return 'ساده'
    case 'moderate':
      return 'متوسط'
    case 'hard':
      return 'سخت'
    default:
      return difficulty
  }
}

const getTimeLabel = (time: string) => {
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

// Reset filters
const resetFilters = () => {
  filter.value = ''
  typeFilter.value = 'all'
  difficultyFilter.value = 'all'
  router.push({ query: { page: '1' } })
}

watch([filter, typeFilter, difficultyFilter], () => {
  router.push({
    query: {
      page: '1',
    },
  })
})
const deeds = ref<Deed[]>([])
onMounted(async () => {
  const coupons = await getMyCoupons()
  deeds.value = extractDeeds(coupons)
  console.log('deeds', deeds.value)
})
const extractDeeds = (coupons: discountCopoun[]) => {
  // Filter out empty expands and create a map of deed counts
  const deedCounts = new Map<string, number>()

  // Count occurrences of each deed
  coupons
    .filter(coupon => coupon.expand?.deed && Object.keys(coupon.expand.deed).length > 0)
    .forEach((coupon) => {
      const deedId = coupon.expand.deed.id
      deedCounts.set(deedId, (deedCounts.get(deedId) || 0) + 1)
    })

  // Create unique deeds with completion counts
  return Array.from(
    new Map(
      coupons
        .filter(coupon => coupon.expand?.deed && Object.keys(coupon.expand.deed).length > 0)
        .map(coupon => [
          coupon.expand.deed.id,
          {
            ...coupon.expand.deed,
            completionCount: deedCounts.get(coupon.expand.deed.id) || 1,
          },
        ]),
    ).values(),
  )
}
</script>

<template>
  <div class="py-6">
    <div class="container-fluid">
      <!-- Header -->
      <div class="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-muted-800 text-2xl font-bold dark:text-white">
            کارهای نیک من
          </h1>
          <p class="text-muted-400 mt-1">
            مشاهده کارهای نیک انجام شده توسط شما
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <!-- Search -->
          <BaseInput
            v-model="filter"
            icon="ph:magnifying-glass-duotone"
            placeholder="جستجو..."
            class="w-full max-w-xs"
          />
          <!-- Type filter -->
          <BaseSelect v-model="typeFilter" class="min-w-32">
            <option value="all">
              همه انواع
            </option>
            <option value="family">
              خانواده
            </option>
            <option value="society">
              اجتماعی
            </option>
            <option value="spiritual">
              معنوی
            </option>
          </BaseSelect>
          <!-- Difficulty filter -->
          <BaseSelect v-model="difficultyFilter" class="min-w-32">
            <option value="all">
              همه سختی‌ها
            </option>
            <option value="simple">
              ساده
            </option>
            <option value="moderate">
              متوسط
            </option>
            <option value="hard">
              سخت
            </option>
          </BaseSelect>
        </div>

        <!-- Reset filters -->
        <BaseButton
          color="muted"
          @click="resetFilters"
        >
          پاک کردن فیلترها
        </BaseButton>
      </div>

      <!-- Deeds table -->
      <BaseCard class="relative overflow-x-auto">
        <div class="min-w-full align-middle">
          <table class="min-w-full">
            <thead>
              <tr class="bg-muted-100 dark:bg-muted-800">
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-center text-xs font-semibold uppercase first:rounded-tr"
                >
                  #
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  عنوان
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  نوع
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  سختی
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  زمان
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-center text-xs font-semibold uppercase last:rounded-tl"
                >
                  <div class="flex items-center justify-center gap-4">
                    <span>بازدیدها</span>
                    <span>انجام‌ها</span>
                    <span>انجام‌های من</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-muted-200 dark:divide-muted-700 divide-y">
              <tr
                v-for="(deed, index) in filteredDeeds"
                :key="deed.title"
                class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800/50 border-b transition-colors duration-300"
              >
                <td class="text-muted-500 dark:text-muted-300 whitespace-nowrap p-3 text-center text-sm">
                  {{ (page - 1) * perPage + index + 1 }}
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ deed.emoji }}</span>
                    <span class="font-medium">{{ deed.title }}</span>
                  </div>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <div
                    :class="[
                      deed.type === 'family'
                        ? 'bg-info-100 dark:bg-info-500/20 text-info-500'
                        : deed.type === 'society'
                          ? 'bg-warning-100 dark:bg-warning-500/20 text-warning-500'
                          : 'bg-success-100 dark:bg-success-500/20 text-success-500',
                      'inline-flex items-center justify-center gap-1 rounded-full px-2 py-1 text-xs',
                    ]"
                  >
                    <Icon
                      :name="deed.type === 'family' ? 'ph:users-three-duotone' : deed.type === 'society' ? 'ph:handshake-duotone' : 'ph:heart-duotone'"
                      class="size-4"
                    />
                    {{ getTypeLabel(deed.type) }}
                  </div>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <div
                    :class="[
                      deed.difficulty === 'simple'
                        ? 'bg-success-100 dark:bg-success-500/20 text-success-500'
                        : deed.difficulty === 'moderate'
                          ? 'bg-warning-100 dark:bg-warning-500/20 text-warning-500'
                          : 'bg-danger-100 dark:bg-danger-500/20 text-danger-500',
                      'inline-flex items-center justify-center gap-1 rounded-full px-2 py-1 text-xs',
                    ]"
                  >
                    <Icon name="ph:chart-bar-duotone" class="size-4" />
                    {{ getDifficultyLabel(deed.difficulty) }}
                  </div>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <div class="bg-muted-100 dark:bg-muted-800 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                    <Icon name="ph:clock-duotone" class="size-4" />
                    {{ getTimeLabel(deed.timeRequired) }}
                  </div>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-center text-sm">
                  <div class="flex items-center justify-center gap-3">
                    <div class="flex items-center gap-1">
                      <Icon name="ph:eye-duotone" class="text-primary-500 size-4" />
                      <span class="text-xs">{{ deed.views }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Icon name="ph:users-duotone" class="text-info-500 size-4" />
                      <span class="text-xs">{{ deed.completions }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Icon name="ph:user-circle-check-duotone" class="text-success-500 size-4" />
                      <span class="text-xs">{{ deed.completionCount || 0 }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- Empty state -->
      <div
        v-if="filteredDeeds.length === 0"
        class="text-muted-400 mt-6 flex flex-col items-center justify-center space-y-2 py-12"
      >
        <Icon name="ph:handshake-duotone" class="size-12" />
        <p>هیچ کار نیکی یافت نشد</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredDeeds.length > 0" class="mt-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <BaseSelect v-model="perPage" class="min-w-32">
            <option :value="10">
              10
            </option>
            <option :value="25">
              25
            </option>
            <option :value="50">
              50
            </option>
          </BaseSelect>
          <p class="text-muted-400 min-w-32 text-sm">
            مورد در هر صفحه
          </p>
        </div>
        <BasePagination
          :total-items="filteredDeeds.length"
          :per-page="perPage"
          :current-page="page"
          class="justify-end"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
th, tr {
  text-align: center;
}
</style>
