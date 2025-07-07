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

    <!-- Quick Filter Presets -->
    <div class="mb-6">
      <BaseParagraph size="sm" class="text-muted-500 mb-3">
        فیلترهای آماده
      </BaseParagraph>
      <div class="flex flex-wrap gap-2">
        <BaseButton
          v-for="(preset, key) in filterPresets"
          :key="key"
          size="sm"
          :color="activePreset === key ? 'primary' : 'default'"
          :variant="activePreset === key ? 'solid' : 'outline'"
          @click="applyPreset(key)"
        >
          {{ preset.label }}
        </BaseButton>
      </div>
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

    <!-- Importance Range -->
    <div class="mb-4">
      <BaseParagraph size="sm" class="text-muted-500 mb-2">
        سطح اهمیت ({{ localFilters.minImportance }} - {{ localFilters.maxImportance }})
      </BaseParagraph>
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
import { ref, computed, watch } from 'vue'
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
const showCompressed = ref(false)
const showUncompressed = ref(true)

// Computed filter stats
const filterStats = computed(() => {
  if (props.totalCount === undefined || props.filteredCount === undefined) return null
  return {
    totalCount: props.totalCount,
    filteredCount: props.filteredCount,
  }
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    localFilters.value.searchQuery
    || localFilters.value.minImportance !== 0
    || localFilters.value.maxImportance !== 100
    || localFilters.value.dateRange?.start
    || localFilters.value.dateRange?.end
    || localFilters.value.onlyCompressed
    || localFilters.value.onlyUncompressed
  )
})

// Initialize local filters with default values
function initializeFilters() {
  localFilters.value = {
    minImportance: 0,
    maxImportance: 100,
    sortBy: 'relevance',
    sortOrder: 'desc',
    ...props.modelValue,
  }

  // Set date inputs
  if (localFilters.value.dateRange?.start) {
    startDate.value = localFilters.value.dateRange.start.toISOString().split('T')[0]
  }
  if (localFilters.value.dateRange?.end) {
    endDate.value = localFilters.value.dateRange.end.toISOString().split('T')[0]
  }

  // Set compression checkboxes
  showCompressed.value = localFilters.value.onlyCompressed || (!localFilters.value.onlyCompressed && !localFilters.value.onlyUncompressed)
  showUncompressed.value = localFilters.value.onlyUncompressed || (!localFilters.value.onlyCompressed && !localFilters.value.onlyUncompressed)
}

// Apply a preset filter
function applyPreset(presetKey: string) {
  const preset = filterPresets[presetKey as keyof typeof filterPresets]
  if (preset) {
    activePreset.value = presetKey
    localFilters.value = { ...localFilters.value, ...preset.options }
    updateDateInputs()
    emitFilters()
  }
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
