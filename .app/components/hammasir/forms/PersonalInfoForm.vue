<script setup lang="ts">
import type { PersonalInfoFormData, PersonalInfoFormErrors } from '~/types/hammasir'

interface Props {
  modelValue: PersonalInfoFormData
  errors?: PersonalInfoFormErrors
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: PersonalInfoFormData): void
  (e: 'validate', field?: string): void
  (e: 'submit'): void
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

// Gender options
const genderOptions = [
  { value: 'MALE', label: 'مرد' },
  { value: 'FEMALE', label: 'زن' }
]

// Field update handler
const updateField = (field: keyof PersonalInfoFormData, value: any) => {
  localData.value = {
    ...localData.value,
    [field]: value
  }
  
  // Trigger validation for this field
  emit('validate', field)
}

// Email confirmation validation
const emailConfirmError = computed(() => {
  if (localData.value.confirmEmail && localData.value.email !== localData.value.confirmEmail) {
    return ['ایمیل‌ها مطابقت ندارند']
  }
  return []
})

// Phone number formatting
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, '')
  
  // Format as Iranian phone number
  if (digitsOnly.length <= 11) {
    return digitsOnly.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  
  return digitsOnly.slice(0, 11).replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
}

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formatted = formatPhoneNumber(target.value)
  updateField('phoneNumber', formatted)
}

// Persian date handling
const formatPersianDate = (value: string): string => {
  // This is a simple formatter - you might want to use a proper Persian date library
  return value.replace(/[^\d\/]/g, '').replace(/(\d{4})\/(\d{1,2})\/(\d{1,2}).*/, '$1/$2/$3')
}

const handleDateInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formatted = formatPersianDate(target.value)
  updateField('dateOfBirth', formatted)
}

// Form submission
const handleSubmit = () => {
  emit('validate')
  if (Object.keys(props.errors).length === 0) {
    emit('submit')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Profile Picture -->
    <div class="flex justify-center">
      <HammasirCommonAvatarUpload
        :model-value="localData.profilePicture"
        :disabled="disabled || readonly"
        size="xl"
        helper-text="تصویر پروفایل خود را انتخاب کنید"
        :error="errors.profilePicture?.[0]"
        @update:model-value="updateField('profilePicture', $event)"
      />
    </div>

    <!-- Name Fields -->
    <div class="grid md:grid-cols-2 gap-4">
      <!-- First Name -->
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          نام
          <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="firstName"
          :model-value="localData.firstName"
          :disabled="disabled || loading"
          :readonly="readonly"
          placeholder="نام خود را وارد کنید"
          :error="errors.firstName?.[0]"
          @update:model-value="updateField('firstName', $event)"
          @blur="emit('validate', 'firstName')"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          نام خانوادگی
          <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="lastName"
          :model-value="localData.lastName"
          :disabled="disabled || loading"
          :readonly="readonly"
          placeholder="نام خانوادگی خود را وارد کنید"
          :error="errors.lastName?.[0]"
          @update:model-value="updateField('lastName', $event)"
          @blur="emit('validate', 'lastName')"
        />
      </div>
    </div>

    <!-- Contact Information -->
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ایمیل
          <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="email"
          type="email"
          :model-value="localData.email"
          :disabled="disabled || loading"
          :readonly="readonly"
          placeholder="example@email.com"
          :error="errors.email?.[0]"
          @update:model-value="updateField('email', $event)"
          @blur="emit('validate', 'email')"
        />
      </div>

      <!-- Email Confirmation -->
      <div>
        <label for="confirmEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          تأیید ایمیل
          <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="confirmEmail"
          type="email"
          :model-value="localData.confirmEmail"
          :disabled="disabled || loading"
          :readonly="readonly"
          placeholder="ایمیل را مجدداً وارد کنید"
          :error="errors.confirmEmail?.[0] || emailConfirmError[0]"
          @update:model-value="updateField('confirmEmail', $event)"
          @blur="emit('validate', 'confirmEmail')"
        />
      </div>
    </div>

    <!-- Phone Number -->
    <div>
      <label for="phoneNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        شماره تلفن همراه
        <span class="text-red-500">*</span>
      </label>
      <BaseInput
        id="phoneNumber"
        type="tel"
        :model-value="localData.phoneNumber"
        :disabled="disabled || loading"
        :readonly="readonly"
        placeholder="09XX XXX XXXX"
        :error="errors.phoneNumber?.[0]"
        @input="handlePhoneInput"
        @blur="emit('validate', 'phoneNumber')"
      >
        <template #prefix>
          <Icon name="ph:phone" class="w-4 h-4 text-gray-400" />
        </template>
      </BaseInput>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        شماره تلفن همراه خود را با کد کشور وارد کنید
      </p>
    </div>

    <!-- Personal Details -->
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Date of Birth -->
      <div>
        <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          تاریخ تولد
          <span class="text-red-500">*</span>
        </label>
        <BaseInput
          id="dateOfBirth"
          type="text"
          :model-value="localData.dateOfBirth"
          :disabled="disabled || loading"
          :readonly="readonly"
          placeholder="1370/01/01"
          :error="errors.dateOfBirth?.[0]"
          @input="handleDateInput"
          @blur="emit('validate', 'dateOfBirth')"
        >
          <template #prefix>
            <Icon name="ph:calendar" class="w-4 h-4 text-gray-400" />
          </template>
        </BaseInput>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          تاریخ را به شمسی وارد کنید (مثال: 1370/01/01)
        </p>
      </div>

      <!-- Gender -->
      <div>
        <label for="gender" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          جنسیت
          <span class="text-red-500">*</span>
        </label>
        <BaseRadioGroup
          :model-value="localData.gender"
          :options="genderOptions"
          :disabled="disabled || loading || readonly"
          :error="errors.gender?.[0]"
          @update:model-value="updateField('gender', $event)"
          @blur="emit('validate', 'gender')"
        />
      </div>
    </div>

    <!-- Form Actions -->
    <div v-if="!readonly" class="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200 dark:border-gray-700">
      <BaseButton
        type="button"
        variant="outline"
        :disabled="loading"
        @click="$emit('reset')"
      >
        بازنشانی
      </BaseButton>
      
      <BaseButton
        type="submit"
        variant="solid"
        :loading="loading"
        :disabled="disabled || Object.keys(errors).length > 0"
      >
        ذخیره اطلاعات شخصی
      </BaseButton>
    </div>
  </form>
</template>