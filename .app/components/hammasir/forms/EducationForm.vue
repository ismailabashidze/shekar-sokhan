<script setup lang="ts">
import type { EducationFormData, EducationFormErrors } from '~/types/hammasir'

interface Props {
  modelValue: EducationFormData[]
  errors?: Record<string, EducationFormErrors>
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: EducationFormData[]): void
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

// Education level options
const educationLevels = [
  { value: 'HIGH_SCHOOL', label: 'دیپلم' },
  { value: 'BACHELOR', label: 'کارشناسی' },
  { value: 'MASTER', label: 'کارشناسی ارشد' },
  { value: 'PHD', label: 'دکتری' },
  { value: 'VOCATIONAL', label: 'فنی و حرفه‌ای' },
  { value: 'OTHER', label: 'سایر' }
]

// Field update handler
const updateField = (index: number, field: keyof EducationFormData, value: any) => {
  const updated = [...localData.value]
  updated[index] = {
    ...updated[index],
    [field]: value
  }
  
  // Handle current education logic
  if (field === 'isCurrent' && value) {
    updated[index].endDate = ''
    updated[index].isGraduated = false
  }
  
  localData.value = updated
  emit('validate', index, field)
}

// Add new education entry
const addEducation = () => {
  if (!props.readonly && !props.disabled) {
    emit('add')
  }
}

// Remove education entry
const removeEducation = (index: number) => {
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
const getFieldError = (index: number, field: keyof EducationFormData): string => {
  const education = localData.value[index]
  const educationId = education.id || education.tempId || index.toString()
  return props.errors[educationId]?.[field]?.[0] || ''
}

// Check if section is completed
const isCompleted = (education: EducationFormData): boolean => {
  return !!(
    education.institutionName &&
    education.degree &&
    education.fieldOfStudy &&
    education.educationLevel &&
    education.startDate &&
    (education.isCurrent || education.endDate)
  )
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white">
          سوابق تحصیلی
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-400 mt-1">
          اطلاعات تحصیلی خود را وارد کنید
        </BaseParagraph>
      </div>
      
      <BaseButton
        v-if="!readonly"
        size="sm"
        variant="outline"
        :disabled="disabled || loading"
        @click="addEducation"
      >
        <Icon name="ph:plus" class="w-4 h-4 me-2" />
        افزودن تحصیلات
      </BaseButton>
    </div>

    <!-- Education Entries -->
    <div v-if="localData.length === 0" class="text-center py-8">
      <Icon name="ph:graduation-cap" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <BaseParagraph class="text-gray-500 dark:text-gray-400 mb-4">
        هنوز هیچ سابقه تحصیلی اضافه نکرده‌اید
      </BaseParagraph>
      <BaseButton
        v-if="!readonly"
        variant="outline"
        :disabled="disabled || loading"
        @click="addEducation"
      >
        <Icon name="ph:plus" class="w-4 h-4 me-2" />
        افزودن اولین تحصیلات
      </BaseButton>
    </div>

    <TransitionGroup
      v-else
      name="education"
      tag="div"
      class="space-y-6"
    >
      <div
        v-for="(education, index) in localData"
        :key="education.id || education.tempId || index"
        class="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md"
      >
        <!-- Completion Indicator -->
        <div class="absolute top-4 right-4 flex items-center space-x-2 space-x-reverse">
          <HammasirCommonStatusBadge
            :status="isCompleted(education) ? 'completed' : 'in_progress'"
            size="sm"
          />
          
          <BaseButton
            v-if="!readonly && localData.length > 1"
            size="xs"
            variant="ghost"
            class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            @click="removeEducation(index)"
          >
            <Icon name="ph:trash" class="w-4 h-4" />
          </BaseButton>
        </div>

        <div class="grid gap-6 mt-6">
          <!-- Institution and Degree -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نام مؤسسه/دانشگاه
                <span class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="education.institutionName"
                :disabled="disabled || loading"
                :readonly="readonly"
                placeholder="نام دانشگاه یا مؤسسه آموزشی"
                :error="getFieldError(index, 'institutionName')"
                @update:model-value="updateField(index, 'institutionName', $event)"
                @blur="emit('validate', index, 'institutionName')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                مدرک/درجه
                <span class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="education.degree"
                :disabled="disabled || loading"
                :readonly="readonly"
                placeholder="نام مدرک (مثلاً لیسانس علوم کامپیوتر)"
                :error="getFieldError(index, 'degree')"
                @update:model-value="updateField(index, 'degree', $event)"
                @blur="emit('validate', index, 'degree')"
              />
            </div>
          </div>

          <!-- Field of Study and Level -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رشته تحصیلی
                <span class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="education.fieldOfStudy"
                :disabled="disabled || loading"
                :readonly="readonly"
                placeholder="نام رشته تحصیلی"
                :error="getFieldError(index, 'fieldOfStudy')"
                @update:model-value="updateField(index, 'fieldOfStudy', $event)"
                @blur="emit('validate', index, 'fieldOfStudy')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                سطح تحصیلات
                <span class="text-red-500">*</span>
              </label>
              <BaseSelect
                :model-value="education.educationLevel"
                :options="educationLevels"
                :disabled="disabled || loading || readonly"
                placeholder="انتخاب سطح تحصیلات"
                :error="getFieldError(index, 'educationLevel')"
                @update:model-value="updateField(index, 'educationLevel', $event)"
                @blur="emit('validate', index, 'educationLevel')"
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
                :model-value="education.startDate"
                :disabled="disabled || loading"
                :readonly="readonly"
                placeholder="1390/09/01"
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
                <span v-if="!education.isCurrent" class="text-red-500">*</span>
              </label>
              <BaseInput
                :model-value="education.endDate"
                :disabled="disabled || loading || education.isCurrent"
                :readonly="readonly"
                placeholder="1394/06/30"
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

          <!-- Status Checkboxes -->
          <div class="flex flex-wrap gap-6">
            <BaseCheckbox
              :model-value="education.isCurrent"
              :disabled="disabled || loading || readonly"
              @update:model-value="updateField(index, 'isCurrent', $event)"
            >
              در حال تحصیل هستم
            </BaseCheckbox>

            <BaseCheckbox
              :model-value="education.isGraduated"
              :disabled="disabled || loading || readonly || education.isCurrent"
              @update:model-value="updateField(index, 'isGraduated', $event)"
            >
              فارغ‌التحصیل شده‌ام
            </BaseCheckbox>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Add More Button (Bottom) -->
    <div v-if="localData.length > 0 && !readonly" class="text-center pt-4">
      <BaseButton
        variant="outline"
        :disabled="disabled || loading"
        @click="addEducation"
      >
        <Icon name="ph:plus" class="w-4 h-4 me-2" />
        افزودن تحصیلات بیشتر
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.education-enter-active,
.education-leave-active {
  transition: all 0.3s ease;
}

.education-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.education-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.education-move {
  transition: transform 0.3s ease;
}
</style>