<template>
  <BaseCard shape="curved" class="p-6">
    <div class="mb-4 flex items-center justify-between">
      <BaseHeading
        as="h3"
        size="md"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <Icon name="ph:funnel-duotone" class="me-2 size-5" />
        فیلتر هوشمند
      </BaseHeading>
      <BaseButton
        v-if="hasActiveFilters"
        color="danger"
        size="sm"
        variant="ghost"
        @click="clearAllFilters"
      >
        <Icon name="ph:x-circle-duotone" class="me-1 size-4" />
        پاک کردن
      </BaseButton>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <BaseInput
        v-model="localFilters.searchQuery"
        icon="ph:magnifying-glass-duotone"
        placeholder="جستجو در عنوان و محتوای جلسات..."
        @input="debouncedSearch"
      />
    </div>

    <!-- Filter Presets -->
    <div class="mb-4">
      <BaseParagraph size="sm" class="text-muted-500 mb-3">
        فیلترهای پیش‌تعریف شده
      </BaseParagraph>
      <div class="space-y-2">
        <button
          v-for="(preset, key) in enhancedFilterPresets"
          :key="key"
          class="w-full rounded-lg border p-3 text-right transition-colors"
          :class="[
            activePreset === key
              ? 'border-primary-300 bg-primary-50 dark:border-primary-500/30 dark:bg-primary-900/20'
              : 'border-muted-200 bg-muted-50 hover:border-muted-300 dark:border-muted-700 dark:bg-muted-800/50 dark:hover:border-muted-600'
          ]"
          @click="applyPreset(key as string)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon
                :name="preset.icon"
                class="size-4"
                :class="getPresetIconColor(key)"
              />
              <span class="text-sm font-medium" :class="getPresetTextColor(key)">
                {{ preset.name }}
              </span>
            </div>
            <Icon
              v-if="activePreset === key"
              name="ph:check-circle-duotone"
              class="text-primary-500 size-4"
            />
          </div>
          <div class="mt-1 text-xs" :class="getPresetDescriptionColor(key)">
            {{ preset.description }}
          </div>
          <div class="text-muted-500 mt-1 text-xs">
            {{ getPresetDetails(preset) }}
          </div>
        </button>
      </div>
    </div>

    <!-- Importance Range -->
    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between">
        <BaseParagraph size="sm" class="text-muted-500">
          سطح اهمیت ({{ localFilters.minImportance }} - {{ localFilters.maxImportance }})
        </BaseParagraph>
        <BaseButton
          size="xs"
          variant="ghost"
          @click="showImportanceGuide = !showImportanceGuide"
        >
          <Icon name="ph:info-duotone" class="size-3" />
        </BaseButton>
      </div>

      <!-- Enhanced Importance Guide (expandable) -->
      <div v-if="showImportanceGuide" class="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-900/20">
        <div class="mb-2 text-xs font-medium text-blue-700 dark:text-blue-300">
          <Icon name="ph:graduation-cap-duotone" class="me-1 size-3" />
          راهنمای سطوح اهمیت
        </div>
        <div class="grid grid-cols-1 gap-2 text-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Icon name="ph:warning-duotone" class="size-3 text-red-500" />
              <span class="font-medium text-red-600 dark:text-red-400">بحرانی (۸۰-۱۰۰):</span>
              <span class="text-red-600 dark:text-red-400">نیاز به توجه فوری</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:star-duotone" class="size-3 text-orange-500" />
              <span class="font-medium text-orange-600 dark:text-orange-400">مهم (۶۰-۷۹):</span>
              <span class="text-orange-600 dark:text-orange-400">اولویت بالا</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:circle-duotone" class="size-3 text-yellow-500" />
              <span class="font-medium text-yellow-600 dark:text-yellow-400">متوسط (۴۰-۵۹):</span>
              <span class="text-yellow-600 dark:text-yellow-400">بررسی معمولی</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:minus-circle-duotone" class="size-3 text-gray-500" />
              <span class="font-medium text-gray-600 dark:text-gray-400">کم (۰-۳۹):</span>
              <span class="text-gray-600 dark:text-gray-400">اولویت پایین</span>
            </div>
          </div>
        </div>
        <div class="mt-2 text-xs text-blue-600 dark:text-blue-400">
          💡 نکته: امتیاز بر اساس ۴ معیار محاسبه می‌شود: تازگی، محتوا، طول، و کلمات کلیدی
        </div>
      </div>

      <div class="space-y-2">
        <BaseSlider
          v-model="localFilters.minImportance"
          :min="0"
          :max="100"
          :step="5"
          color="primary"
          label="حداقل اهمیت"
        />
        <BaseSlider
          v-model="localFilters.maxImportance"
          :min="0"
          :max="100"
          :step="5"
          color="primary"
          label="حداکثر اهمیت"
        />
      </div>
    </div>

    <!-- Date Range -->
    <div class="mb-4">
      <BaseParagraph size="sm" class="text-muted-500 mb-2">
        بازه زمانی
      </BaseParagraph>
      <div class="grid grid-cols-2 gap-2">
        <BaseInput
          v-model="startDate"
          type="date"
          label="از تاریخ"
          size="sm"
        />
        <BaseInput
          v-model="endDate"
          type="date"
          label="تا تاریخ"
          size="sm"
        />
      </div>
    </div>

    <!-- Compression Status -->
    <div class="mb-4">
      <BaseParagraph size="sm" class="text-muted-500 mb-2">
        وضعیت فشرده‌سازی
      </BaseParagraph>
      <div class="space-y-2">
        <BaseCheckbox
          v-model="showCompressed"
          label="نمایش جلسات فشرده شده"
          color="primary"
        />
        <BaseCheckbox
          v-model="showUncompressed"
          label="نمایش جلسات عادی"
          color="primary"
        />
      </div>
    </div>

    <!-- Sort Options -->
    <div class="mb-4">
      <BaseParagraph size="sm" class="text-muted-500 mb-2">
        مرتب‌سازی
      </BaseParagraph>
      <div class="grid grid-cols-2 gap-2">
        <BaseSelect
          v-model="localFilters.sortBy"
          label="مرتب‌سازی بر اساس"
          size="sm"
        >
          <option value="relevance">
            مرتبط‌ترین
          </option>
          <option value="date">
            تاریخ
          </option>
          <option value="importance">
            اهمیت
          </option>
          <option value="length">
            طول محتوا
          </option>
        </BaseSelect>
        <BaseSelect
          v-model="localFilters.sortOrder"
          label="ترتیب"
          size="sm"
        >
          <option value="desc">
            نزولی
          </option>
          <option value="asc">
            صعودی
          </option>
        </BaseSelect>
      </div>
    </div>

    <!-- Filter Stats -->
    <div v-if="filterStats" class="border-muted-200 dark:border-muted-700 border-t pt-4">
      <div class="grid grid-cols-2 gap-4 text-center">
        <div>
          <div class="text-primary-500 text-lg font-semibold">
            {{ filterStats.filteredCount }}
          </div>
          <div class="text-muted-500 text-xs">
            نتایج فیلتر شده
          </div>
        </div>
        <div>
          <div class="text-muted-700 dark:text-muted-300 text-lg font-semibold">
            {{ filterStats.totalCount }}
          </div>
          <div class="text-muted-500 text-xs">
            کل جلسات
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useSmartFiltering, type FilterOptions } from '@/composables/useSmartFiltering'

interface Props {
  modelValue: FilterOptions
  totalCount?: number
  filteredCount?: number
}

interface Emits {
  (e: 'update:modelValue', value: FilterOptions): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { getFilterPresets } = useSmartFiltering()
const filterPresets = getFilterPresets()

// Local reactive copies of filters
const localFilters = ref<FilterOptions>({ ...props.modelValue })
const activePreset = ref<string | null>(null)

// Date inputs (string format for HTML inputs)
const startDate = ref('')
const endDate = ref('')

// Compression checkboxes
const showCompressed = ref(true)
const showUncompressed = ref(true)

// UI state
const showImportanceGuide = ref(false)

// Enhanced filter presets with descriptions and icons
const enhancedFilterPresets = computed(() => ({
  critical: {
    ...filterPresets.critical,
    name: 'جلسات بحرانی',
    description: 'امتیاز ۸۰+ - نیاز به توجه فوری و پیگیری سریع',
    icon: 'ph:warning-duotone',
  },
  recent: {
    ...filterPresets.recent,
    name: 'جلسات اخیر',
    description: 'جلسات ماه گذشته - آخرین وضعیت بیمار',
    icon: 'ph:clock-duotone',
  },
  important: {
    ...filterPresets.important,
    name: 'جلسات مهم',
    description: 'امتیاز ۶۰+ - اولویت بالا برای بررسی',
    icon: 'ph:star-duotone',
  },
  compressed: {
    ...filterPresets.compressed,
    name: 'جلسات فشرده',
    description: 'جلسات بهینه‌سازی شده - صرفه‌جویی در فضا',
    icon: 'ph:archive-duotone',
  },
}))

// Computed properties
const hasActiveFilters = computed(() => {
  return activePreset.value !== null
    || localFilters.value.searchQuery
    || localFilters.value.minImportance > 0
    || localFilters.value.maxImportance < 100
    || startDate.value
    || endDate.value
    || !showCompressed.value
    || !showUncompressed.value
})

const filterStats = computed(() => {
  if (props.totalCount !== undefined && props.filteredCount !== undefined) {
    return {
      totalCount: props.totalCount,
      filteredCount: props.filteredCount,
    }
  }
  return null
})

// Helper functions for preset styling
function getPresetIconColor(key: string) {
  switch (key) {
    case 'critical':
      return 'text-red-500'
    case 'recent':
      return 'text-blue-500'
    case 'important':
      return 'text-orange-500'
    case 'compressed':
      return 'text-purple-500'
    default:
      return 'text-gray-500'
  }
}

function getPresetTextColor(key: string) {
  const isActive = activePreset.value === key
  if (isActive) return 'text-primary-700 dark:text-primary-300'

  return 'text-muted-800 dark:text-muted-200'
}

function getPresetDescriptionColor(key: string) {
  const isActive = activePreset.value === key
  if (isActive) return 'text-primary-600 dark:text-primary-400'

  return 'text-muted-600 dark:text-muted-400'
}

function getPresetDetails(preset: any) {
  const details = []

  if (preset.minImportance !== undefined) {
    details.push(`حداقل امتیاز: ${preset.minImportance}`)
  }
  if (preset.maxImportance !== undefined && preset.maxImportance < 100) {
    details.push(`حداکثر امتیاز: ${preset.maxImportance}`)
  }
  if (preset.dateRange) {
    details.push(`محدوده زمانی: ${preset.dateRange} روز`)
  }
  if (preset.compressionFilter !== undefined) {
    details.push(preset.compressionFilter ? 'فقط فشرده' : 'غیر فشرده')
  }

  return details.join(' • ')
}

function applyPreset(key: string) {
  const preset = enhancedFilterPresets.value[key]
  if (!preset) return

  activePreset.value = key

  // Apply preset values to local filters
  Object.assign(localFilters.value, preset)

  // Update date inputs if preset has date range
  if (preset.dateRange) {
    const endDateObj = new Date()
    const startDateObj = new Date()
    startDateObj.setDate(startDateObj.getDate() - preset.dateRange)

    startDate.value = startDateObj.toISOString().split('T')[0]
    endDate.value = endDateObj.toISOString().split('T')[0]

    localFilters.value.startDate = startDate.value
    localFilters.value.endDate = endDate.value
  }

  // Update compression filters
  if (preset.compressionFilter !== undefined) {
    showCompressed.value = preset.compressionFilter
    showUncompressed.value = !preset.compressionFilter
    localFilters.value.showCompressed = preset.compressionFilter
    localFilters.value.showUncompressed = !preset.compressionFilter
  }

  // Emit changes
  emit('update:modelValue', { ...localFilters.value })
}

// Clear all filters
function clearAllFilters() {
  activePreset.value = null
  localFilters.value = {
    minImportance: 0,
    maxImportance: 100,
    sortBy: 'relevance',
    sortOrder: 'desc',
  }
  startDate.value = ''
  endDate.value = ''
  showCompressed.value = true
  showUncompressed.value = true
  emitFilters()
}

// Initialize filters from props
function initializeFilters() {
  localFilters.value = { ...props.modelValue }
  updateDateInputs()

  // Initialize sliders with default values if not set
  if (localFilters.value.minImportance === undefined) {
    localFilters.value.minImportance = 0
  }
  if (localFilters.value.maxImportance === undefined) {
    localFilters.value.maxImportance = 100
  }
}

// Update date inputs from filter object
function updateDateInputs() {
  if (localFilters.value.dateRange?.start) {
    startDate.value = localFilters.value.dateRange.start.toISOString().split('T')[0]
  }
  else {
    startDate.value = ''
  }

  if (localFilters.value.dateRange?.end) {
    endDate.value = localFilters.value.dateRange.end.toISOString().split('T')[0]
  }
  else {
    endDate.value = ''
  }
}

// Emit filter changes
function emitFilters() {
  const filters: FilterOptions = { ...localFilters.value }

  // Handle date range
  if (startDate.value || endDate.value) {
    filters.dateRange = {}
    if (startDate.value) {
      filters.dateRange.start = new Date(startDate.value)
    }
    if (endDate.value) {
      filters.dateRange.end = new Date(endDate.value)
    }
  }
  else {
    delete filters.dateRange
  }

  // Handle compression filters
  if (showCompressed.value && !showUncompressed.value) {
    filters.onlyCompressed = true
    delete filters.onlyUncompressed
  }
  else if (!showCompressed.value && showUncompressed.value) {
    filters.onlyUncompressed = true
    delete filters.onlyCompressed
  }
  else {
    delete filters.onlyCompressed
    delete filters.onlyUncompressed
  }

  emit('update:modelValue', filters)
}

// Debounced search function
const debouncedSearch = useDebounceFn(() => {
  activePreset.value = null // Clear preset when manually searching
  emitFilters()
}, 300)

// Watch for changes in local filters
watch(() => [
  localFilters.value.minImportance,
  localFilters.value.maxImportance,
  localFilters.value.sortBy,
  localFilters.value.sortOrder,
], () => {
  activePreset.value = null // Clear preset when manually changing
  emitFilters()
})

// Watch date inputs
watch([startDate, endDate], () => {
  activePreset.value = null
  emitFilters()
})

// Watch compression checkboxes
watch([showCompressed, showUncompressed], () => {
  activePreset.value = null
  emitFilters()
})

// Initialize on mount
onMounted(() => {
  initializeFilters()
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  localFilters.value = { ...newValue }
  updateDateInputs()
}, { deep: true })
</script>

<style scoped>
/* RTL support for form elements */
[dir="rtl"] .grid {
  direction: rtl;
}
</style>
