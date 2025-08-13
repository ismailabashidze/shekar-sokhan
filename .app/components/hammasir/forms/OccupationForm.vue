<script setup lang="ts">
import type { OccupationFormData, OccupationFormErrors } from '~/types/hammasir'

interface Props {
  modelValue: OccupationFormData[]
  errors?: Record<string, OccupationFormErrors>
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: OccupationFormData[]): void
  (e: 'validate', index?: number, field?: string): void
  (e: 'add'): void
  (e: 'remove', index: number): void
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => ({}),
  loading: false,
  disabled: false,
  readonly: false,
})

const emit = defineEmits<Emits>()

const localData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Employment type options
const employmentTypes = [
  { value: 'FULL_TIME', label: 'تمام وقت' },
  { value: 'PART_TIME', label: 'پاره وقت' },
  { value: 'CONTRACT', label: 'پیمانی' },
  { value: 'FREELANCE', label: 'آزاد' },
  { value: 'INTERNSHIP', label: 'کارآموزی' }
]

// Common industries (you can expand this list)
const industries = [
  { value: 'technology', label: 'فناوری اطلاعات' },
  { value: 'healthcare', label: 'بهداشت و درمان' },
  { value: 'education', label: 'آموزش و پرورش' },
  { value: 'finance', label: 'مالی و بانکداری' },
  { value: 'manufacturing', label: 'تولید و ساخت' },
  { value: 'retail', label: 'خرده‌فروشی' },
  { value: 'construction', label: 'ساختمان و عمران' },
  { value: 'transportation', label: 'حمل و نقل' },
  { value: 'hospitality', label: 'هتلداری و گردشگری' },
  { value: 'government', label: 'دولتی' },
  { value: 'nonprofit', label: 'غیرانتفاعی' },
  { value: 'other', label: 'سایر' }
]

// Field update handler
const updateField = (index: number, field: keyof OccupationFormData, value: any) => {
  const updated = [...localData.value]
  updated[index] = {
    ...updated[index],
    [field]: value
  }
  
  // Handle current job logic
  if (field === 'isCurrentJob' && value) {
    updated[index].endDate = ''
  }
  
  localData.value = updated
  emit('validate', index, field)
}

// Add new occupation entry
const addOccupation = () => {
  if (!props.readonly && !props.disabled) {
    emit('add')
  }
}

// Remove occupation entry
const removeOccupation = (index: number) => {
  if (!props.readonly && !props.disabled) {
    emit('remove', index)
  }
}

// Persian date formatting
const formatPersianDate = (value: string): string => {
  return value.replace(/[^\d\/]/g, '').replace(/(\d{4})\/(\d{1,2})\/(\d{1,2}).*/, '$1/$2/$3')
}

const handleDateInput = (event: Event, index: number, field: 'startDate' | 'endDate') => {
  const target = event.target as HTMLInputElement
  const formatted = formatPersianDate(target.value)
  updateField(index, field, formatted)
}

// Get field error
const getFieldError = (index: number, field: keyof OccupationFormData): string => {
  const occupation = localData.value[index]
  const occupationId = occupation.id || occupation.tempId || index.toString()
  return props.errors[occupationId]?.[field]?.[0] || ''
}

// Check if section is completed
const isCompleted = (occupation: OccupationFormData): boolean => {
  return !!(
    occupation.currentPosition &&
    occupation.companyName &&
    occupation.industry &&
    occupation.employmentType &&
    occupation.startDate &&
    (occupation.isCurrentJob || occupation.endDate)
  )
}

// Calculate duration
const calculateDuration = (startDate: string, endDate?: string): string => {
  if (!startDate) return ''
  
  // This is a simplified calculation - you might want to use a proper Persian date library
  const [startYear, startMonth] = startDate.split('/').map(Number)
  
  if (!endDate && !localData.value.find(o => o.startDate === startDate)?.isCurrentJob) {
    return ''
  }
  
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  
  // Convert to Gregorian (approximate)
  const gregorianStartYear = startYear + 621
  
  let years = currentYear - gregorianStartYear
  let months = currentMonth - startMonth
  
  if (months < 0) {
    years--
    months += 12
  }
  
  if (years > 0 && months > 0) {
    return `${years} سال و ${months} ماه`
  } else if (years > 0) {
    return `${years} سال`
  } else if (months > 0) {
    return `${months} ماه`
  }
  
  return 'کمتر از یک ماه'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white">
          سوابق شغلی
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-400 mt-1">
          تجربیات شغلی خود را وارد کنید
        </BaseParagraph>
      </div>
      
      <BaseButton
        v-if="!readonly"
        size="sm"
        variant="outline"
        :disabled="disabled || loading"
        @click="addOccupation"
      >
        <Icon name="ph:plus" class="w-4 h-4 me-2" />
        افزودن شغل
      </BaseButton>
    </div>

    <!-- Occupation Entries -->
    <div v-if="localData.length === 0" class="text-center py-8">
      <Icon name="ph:briefcase" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <BaseParagraph class="text-gray-500 dark:text-gray-400 mb-4">
        هنوز هیچ سابقه شغلی اضافه نکرده‌اید
      </BaseParagraph>
      <BaseButton
        v-if="!readonly"
        variant="outline"
        :disabled="disabled || loading"
        @click="addOccupation"
      >
        <Icon name="ph:plus" class="w-4 h-4 me-2" />
        افزودن اولین شغل
      </BaseButton>
    </div>

    <TransitionGroup
      v-else
      name="occupation"
      tag="div"
      class="space-y-6"
    >
      <div
        v-for="(occupation, index) in localData"
        :key="occupation.id || occupation.tempId || index"
        class="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md"
      >
        <!-- Completion Indicator and Actions -->
        <div class="absolute top-4 right-4 flex items-center space-x-2 space-x-reverse">
          <HammasirCommonStatusBadge
            :status="occupation.isCurrentJob ? 'active' : (isCompleted(occupation) ? 'completed' : 'in_progress')"
            size="sm"
          />
          
          <BaseButton
            v-if="!readonly && localData.length > 1"
            size="xs"
            variant="ghost"
            class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            @click="removeOccupation(index)"
          >
            <Icon name="ph:trash" class="w-4 h-4" />
          </BaseButton>
        </div>

        <div class="grid gap-6 mt-6">
          <!-- Position and Company -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عنوان شغل
                <span class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="occupation.currentPosition"
                :disabled="disabled || loading"
                :readonly="readonly"
                placeholder="مثلاً: مهندس نرم‌افزار"
                :error="getFieldError(index, 'currentPosition')"
                @update:model-value="updateField(index, 'currentPosition', $event)"
                @blur="emit('validate', index, 'currentPosition')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نام شرکت/سازمان
                <span class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="occupation.companyName"
                :disabled="disabled || loading"
                :readonly="readonly"
                placeholder="نام شرکت یا سازمان"
                :error="getFieldError(index, 'companyName')"
                @update:model-value="updateField(index, 'companyName', $event)"
                @blur="emit('validate', index, 'companyName')"
              />
            </div>
          </div>

          <!-- Industry and Employment Type -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                صنعت/حوزه فعالیت
                <span class="text-red-500">*</span>
              </label>
              <BaseSelect
                :model-value="occupation.industry"
                :options="industries"
                :disabled="disabled || loading || readonly"
                placeholder="انتخاب حوزه فعالیت"
                :error="getFieldError(index, 'industry')"
                @update:model-value="updateField(index, 'industry', $event)"
                @blur="emit('validate', index, 'industry')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نوع استخدام
                <span class="text-red-500">*</span>
              </label>
              <BaseSelect
                :model-value="occupation.employmentType"
                :options="employmentTypes"
                :disabled="disabled || loading || readonly"
                placeholder="انتخاب نوع استخدام"
                :error="getFieldError(index, 'employmentType')"
                @update:model-value="updateField(index, 'employmentType', $event)"
                @blur="emit('validate', index, 'employmentType')"
              />
            </div>
          </div>

          <!-- Dates -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاریخ شروع
                <span class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="occupation.startDate"
                :disabled="disabled || loading"
                :readonly="readonly"
                placeholder="1400/01/01"
                :error="getFieldError(index, 'startDate')"
                @input="handleDateInput($event, index, 'startDate')"
                @blur="emit('validate', index, 'startDate')"
              >
                <template #prefix>
                  <Icon name="ph:calendar" class="w-4 h-4 text-gray-400" />
                </template>
              </BaseInput>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاریخ پایان
                <span v-if="!occupation.isCurrentJob" class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="occupation.endDate"
                :disabled="disabled || loading || occupation.isCurrentJob"
                :readonly="readonly"
                placeholder="1402/12/30"
                :error="getFieldError(index, 'endDate')"
                @input="handleDateInput($event, index, 'endDate')"
                @blur="emit('validate', index, 'endDate')"
              >
                <template #prefix>
                  <Icon name="ph:calendar" class="w-4 h-4 text-gray-400" />
                </template>
              </BaseInput>
            </div>
          </div>

          <!-- Current Job Checkbox and Duration -->
          <div class="flex items-center justify-between">
            <BaseCheckbox
              :model-value="occupation.isCurrentJob"
              :disabled="disabled || loading || readonly"
              @update:model-value="updateField(index, 'isCurrentJob', $event)"
            >
              شغل فعلی من است
            </BaseCheckbox>

            <div v-if="occupation.startDate" class="text-sm text-gray-500 dark:text-gray-400">
              مدت: {{ calculateDuration(occupation.startDate, occupation.endDate) }}
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Add More Button (Bottom) -->
    <div v-if="localData.length > 0 && !readonly" class="text-center pt-4">
      <BaseButton
        variant="outline"
        :disabled="disabled || loading"
        @click="addOccupation"
      >
        <Icon name="ph:plus" class="w-4 h-4 me-2" />
        افزودن شغل بیشتر
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.occupation-enter-active,
.occupation-leave-active {
  transition: all 0.3s ease;
}

.occupation-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.occupation-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.occupation-move {
  transition: transform 0.3s ease;
}
</style>