<script setup lang="ts">
import type { PreferencesFormData, PreferencesFormErrors } from '~/types/hammasir'

interface Props {
  modelValue: PreferencesFormData
  errors?: PreferencesFormErrors
  loading?: boolean
  disabled?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: PreferencesFormData): void
  (e: 'validate', section?: string, field?: string): void
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

// Field update handlers
const updateCommunicationField = (field: keyof typeof props.modelValue.communication, value: boolean) => {
  localData.value = {
    ...localData.value,
    communication: {
      ...localData.value.communication,
      [field]: value
    }
  }
  emit('validate', 'communication', field)
}

const updatePrivacyField = (field: keyof typeof props.modelValue.privacy, value: boolean) => {
  localData.value = {
    ...localData.value,
    privacy: {
      ...localData.value.privacy,
      [field]: value
    }
  }
  emit('validate', 'privacy', field)
}

// Get field errors
const getCommunicationError = (field: string): string => {
  return props.errors.communication?.[field]?.[0] || ''
}

const getPrivacyError = (field: string): string => {
  return props.errors.privacy?.[field]?.[0] || ''
}

// Form submission
const handleSubmit = () => {
  emit('validate')
  if (!props.errors.communication && !props.errors.privacy) {
    emit('submit')
  }
}

// Reset to defaults
const resetToDefaults = () => {
  localData.value = {
    communication: {
      email: true,
      sms: false,
    },
    privacy: {
      isProfileVisibleToCounselors: true,
      isProfileVisibleToOtherUsers: false,
      allowDataAnalysisForMatching: true,
    },
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Communication Preferences -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center me-3">
          <Icon name="ph:chat-circle" class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white">
            تنظیمات ارتباطی
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm mt-1">
            نحوه دریافت اطلاعیه‌ها را مشخص کنید
          </BaseParagraph>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Email Notifications -->
        <div class="flex items-start space-x-3 space-x-reverse p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
          <BaseCheckbox
            :model-value="localData.communication.email"
            :disabled="disabled || loading || readonly"
            @update:model-value="updateCommunicationField('email', $event)"
          />
          
          <div class="flex-1">
            <label class="block font-medium text-gray-800 dark:text-white cursor-pointer">
              اطلاعیه‌های ایمیلی
            </label>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              دریافت اطلاعیه‌ها و به‌روزرسانی‌ها از طریق ایمیل
            </p>
            <p v-if="getCommunicationError('email')" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ getCommunicationError('email') }}
            </p>
          </div>
          
          <Icon name="ph:envelope" class="w-5 h-5 text-gray-400" />
        </div>

        <!-- SMS Notifications -->
        <div class="flex items-start space-x-3 space-x-reverse p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
          <BaseCheckbox
            :model-value="localData.communication.sms"
            :disabled="disabled || loading || readonly"
            @update:model-value="updateCommunicationField('sms', $event)"
          />
          
          <div class="flex-1">
            <label class="block font-medium text-gray-800 dark:text-white cursor-pointer">
              اطلاعیه‌های پیامکی
            </label>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              دریافت اطلاعیه‌های فوری از طریق پیامک
            </p>
            <p v-if="getCommunicationError('sms')" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ getCommunicationError('sms') }}
            </p>
          </div>
          
          <Icon name="ph:device-mobile" class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Privacy Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center mb-6">
        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center me-3">
          <Icon name="ph:shield-check" class="w-5 h-5 text-green-600" />
        </div>
        <div>
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white">
            تنظیمات حریم خصوصی
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400 text-sm mt-1">
            کنترل نمایش اطلاعات شخصی خود
          </BaseParagraph>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Profile Visible to Counselors -->
        <div class="flex items-start space-x-3 space-x-reverse p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
          <BaseCheckbox
            :model-value="localData.privacy.isProfileVisibleToCounselors"
            :disabled="disabled || loading || readonly"
            @update:model-value="updatePrivacyField('isProfileVisibleToCounselors', $event)"
          />
          
          <div class="flex-1">
            <label class="block font-medium text-gray-800 dark:text-white cursor-pointer">
              نمایش پروفایل به مشاوران
            </label>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              اجازه دسترسی مشاوران به اطلاعات پروفایل شما برای ارائه خدمات بهتر
            </p>
            <p v-if="getPrivacyError('isProfileVisibleToCounselors')" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ getPrivacyError('isProfileVisibleToCounselors') }}
            </p>
          </div>
          
          <Icon name="ph:user-circle-check" class="w-5 h-5 text-gray-400" />
        </div>

        <!-- Profile Visible to Other Users -->
        <div class="flex items-start space-x-3 space-x-reverse p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
          <BaseCheckbox
            :model-value="localData.privacy.isProfileVisibleToOtherUsers"
            :disabled="disabled || loading || readonly"
            @update:model-value="updatePrivacyField('isProfileVisibleToOtherUsers', $event)"
          />
          
          <div class="flex-1">
            <label class="block font-medium text-gray-800 dark:text-white cursor-pointer">
              نمایش پروفایل به سایر کاربران
            </label>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              اجازه مشاهده اطلاعات پروفایل شما توسط کاربران دیگر پلتفرم
            </p>
            <p v-if="getPrivacyError('isProfileVisibleToOtherUsers')" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ getPrivacyError('isProfileVisibleToOtherUsers') }}
            </p>
          </div>
          
          <Icon name="ph:users" class="w-5 h-5 text-gray-400" />
        </div>

        <!-- Allow Data Analysis for Matching -->
        <div class="flex items-start space-x-3 space-x-reverse p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
          <BaseCheckbox
            :model-value="localData.privacy.allowDataAnalysisForMatching"
            :disabled="disabled || loading || readonly"
            @update:model-value="updatePrivacyField('allowDataAnalysisForMatching', $event)"
          />
          
          <div class="flex-1">
            <label class="block font-medium text-gray-800 dark:text-white cursor-pointer">
              استفاده از داده‌ها برای انطباق‌یابی
            </label>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              اجازه تحلیل اطلاعات شما برای بهبود فرآیند انطباق‌یابی و ارائه پیشنهادات مناسب
            </p>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3">
              <div class="flex items-start">
                <Icon name="ph:info" class="w-4 h-4 text-blue-500 me-2 mt-0.5 flex-shrink-0" />
                <p class="text-xs text-blue-700 dark:text-blue-300">
                  این تنظیم به سیستم کمک می‌کند تا بر اساس ویژگی‌های شخصیتی و ترجیحات شما، 
                  بهترین پیشنهادات را ارائه دهد. تمام تحلیل‌ها بصورت ناشناس انجام می‌شود.
                </p>
              </div>
            </div>
            <p v-if="getPrivacyError('allowDataAnalysisForMatching')" class="text-sm text-red-600 dark:text-red-400 mt-1">
              {{ getPrivacyError('allowDataAnalysisForMatching') }}
            </p>
          </div>
          
          <Icon name="ph:chart-line" class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Privacy Notice -->
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
      <div class="flex items-start">
        <Icon name="ph:shield-warning" class="w-5 h-5 text-amber-600 me-2 mt-0.5 flex-shrink-0" />
        <div>
          <h4 class="font-medium text-amber-800 dark:text-amber-200 mb-2">
            تنبیه حریم خصوصی
          </h4>
          <p class="text-sm text-amber-700 dark:text-amber-300">
            ما متعهد به حفظ حریم خصوصی شما هستیم. تمامی اطلاعات شما بصورت امن ذخیره شده و 
            تنها برای اهدافی که شما اجازه داده‌اید استفاده می‌شود. می‌توانید هر زمان این تنظیمات را تغییر دهید.
          </p>
          <NuxtLink
            to="/privacy"
            class="inline-flex items-center text-sm font-medium text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 mt-2"
          >
            مطالعه سیاست حریم خصوصی
            <Icon name="ph:arrow-left" class="w-3 h-3 ms-1" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div v-if="!readonly" class="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
      <BaseButton
        type="button"
        variant="outline"
        :disabled="loading"
        @click="resetToDefaults"
      >
        بازگشت به پیش‌فرض
      </BaseButton>
      
      <div class="flex space-x-4 space-x-reverse">
        <BaseButton
          type="button"
          variant="outline"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          انصراف
        </BaseButton>
        
        <BaseButton
          type="submit"
          variant="solid"
          :loading="loading"
          :disabled="disabled"
        >
          ذخیره تنظیمات
        </BaseButton>
      </div>
    </div>
  </form>
</template>