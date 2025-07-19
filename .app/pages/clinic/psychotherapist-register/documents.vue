<script setup lang="ts">
import type { PsychoReg, StepData } from '../../../types'

definePageMeta({
  preview: {
    title: 'ثبت نام - مشاور - مدارک و توافق‌نامه',
    description: 'بخش ثبت نام مشاوران - آپلود مدارک و پذیرش توافق‌نامه',
    categories: ['layouts', 'wizards', 'forms'],
    src: '/img/screens/layouts-invite.png',
    srcDark: '/img/screens/layouts-invite-dark.png',
    order: 41,
  },
})

const {
  data: request,
  currentStepId,
  loading,
  errors,
  getPrevStep,
  complete,
  steps,
  checkPreviousSteps,
} = useMultiStepForm<PsychoReg, StepData>()

onBeforeMount(checkPreviousSteps)

const profilePhotoUrl = ref<string | null>(null)
const fileErrors = ref<Record<string, string>>({})

const validateFile = (file: File, field: string): boolean => {
  const maxSizes = {
    profilePhoto: 2 * 1024 * 1024, // 2MB
    licenseDocument: 5 * 1024 * 1024, // 5MB
    cvDocument: 5 * 1024 * 1024, // 5MB
  }
  
  const allowedTypes = {
    profilePhoto: ['image/jpeg', 'image/jpg', 'image/png'],
    licenseDocument: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    cvDocument: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  }
  
  // Check file size
  if (file.size > maxSizes[field as keyof typeof maxSizes]) {
    fileErrors.value[field] = 'اندازه فایل بیش از حد مجاز است'
    return false
  }
  
  // Check file type
  if (!allowedTypes[field as keyof typeof allowedTypes].includes(file.type)) {
    fileErrors.value[field] = 'فرمت فایل مجاز نیست'
    return false
  }
  
  delete fileErrors.value[field]
  return true
}

const handleFileUpload = (event: Event, field: keyof Pick<PsychoReg, 'profilePhoto' | 'licenseDocument' | 'cvDocument'>) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  
  if (file) {
    // Validate file
    if (!validateFile(file, field)) {
      target.value = '' // Clear the input
      return
    }
    
    request[field] = file
    
    // Create preview URL for profile photo
    if (field === 'profilePhoto') {
      if (profilePhotoUrl.value) {
        URL.revokeObjectURL(profilePhotoUrl.value)
      }
      profilePhotoUrl.value = URL.createObjectURL(file)
    }
  } else {
    request[field] = null
    if (field === 'profilePhoto') {
      if (profilePhotoUrl.value) {
        URL.revokeObjectURL(profilePhotoUrl.value)
      }
      profilePhotoUrl.value = null
    }
  }
}

// Cleanup URLs on unmount
onUnmounted(() => {
  if (profilePhotoUrl.value) {
    URL.revokeObjectURL(profilePhotoUrl.value)
  }
})
</script>

<template>
  <div class="w-full">
    <div v-if="!complete" class="mb-8 space-y-2">
      <BaseHeading
        as="h2"
        size="2xl"
        weight="medium"
        class="md:!3xl text-muted-800 dark:text-white"
      >
        {{ steps[currentStepId].meta.title }}
      </BaseHeading>
      <BaseParagraph
        size="sm"
        class="text-muted-500 dark:text-muted-400 max-w-sm"
      >
        {{ steps[currentStepId].meta.subtitle }}
      </BaseParagraph>
    </div>

    <div v-if="!complete" class="w-full max-w-lg">
      <div class="grid grid-cols-12 gap-6">
        <!-- Profile Photo -->
        <div class="col-span-12">
          <div class="space-y-2">
            <label class="nui-label text-muted-400 text-xs">عکس پروفایل (اختیاری)</label>
            <div class="flex items-center gap-4">
              <div class="relative">
                <BaseAvatar
                  :src="profilePhotoUrl || '/img/avatars/default-male.jpg'"
                  size="lg"
                  class="ring-2 ring-muted-200 dark:ring-muted-700"
                />
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  id="profilePhoto"
                  @change="handleFileUpload($event, 'profilePhoto')"
                />
                <BaseButton
                  as="label"
                  for="profilePhoto"
                  color="muted"
                  variant="outline"
                  size="sm"
                  class="cursor-pointer"
                >
                  <Icon name="ph:camera-duotone" class="w-4 h-4 mr-2" />
                  {{ request.profilePhoto ? 'تغییر عکس' : 'انتخاب عکس' }}
                </BaseButton>
                <div class="space-y-1">
                  <p class="text-muted-400 text-xs">فرمت JPG یا PNG، حداکثر 2MB</p>
                  <p v-if="request.profilePhoto" class="text-success-600 text-xs">
                    ✓ {{ request.profilePhoto.name }}
                  </p>
                  <p v-if="fileErrors.profilePhoto" class="text-danger-600 text-xs">
                    {{ fileErrors.profilePhoto }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- License Document -->
        <div class="col-span-12">
          <div class="space-y-2">
            <label class="nui-label text-muted-400 text-xs">پروانه فعالیت (در صورت وجود)</label>
            <div 
              class="rounded-lg border-2 border-dashed p-6 text-center transition-colors"
              :class="request.licenseDocument 
                ? 'border-success-300 dark:border-success-600 bg-success-50 dark:bg-success-900/20' 
                : 'border-muted-300 dark:border-muted-600 hover:border-primary-300 dark:hover:border-primary-600'"
            >
              <div class="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                :class="request.licenseDocument 
                  ? 'bg-success-100 dark:bg-success-800' 
                  : 'bg-muted-100 dark:bg-muted-800'"
              >
                <Icon 
                  :name="request.licenseDocument ? 'ph:check-circle-duotone' : 'ph:file-text-duotone'" 
                  class="w-6 h-6"
                  :class="request.licenseDocument ? 'text-success-600' : 'text-muted-400'"
                />
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                class="hidden"
                id="licenseDocument"
                @change="handleFileUpload($event, 'licenseDocument')"
              />
              <BaseButton
                as="label"
                for="licenseDocument"
                :color="request.licenseDocument ? 'success' : 'primary'"
                variant="outline"
                size="sm"
                class="cursor-pointer"
              >
                <Icon 
                  :name="request.licenseDocument ? 'ph:file-check-duotone' : 'ph:upload-duotone'" 
                  class="w-4 h-4 mr-2" 
                />
                {{ request.licenseDocument ? 'تغییر فایل' : 'انتخاب فایل' }}
              </BaseButton>
              <p class="text-muted-400 mt-2 text-xs">فرمت PDF یا عکس، حداکثر 5MB</p>
              <p v-if="request.licenseDocument" class="text-success-600 mt-2 text-sm font-medium">
                ✓ {{ request.licenseDocument.name }}
              </p>
              <p v-if="fileErrors.licenseDocument" class="text-danger-600 mt-2 text-sm">
                {{ fileErrors.licenseDocument }}
              </p>
            </div>
          </div>
        </div>

        <!-- CV Document -->
        <div class="col-span-12">
          <div class="space-y-2">
            <label class="nui-label text-muted-400 text-xs">رزومه (اختیاری)</label>
            <div 
              class="rounded-lg border-2 border-dashed p-6 text-center transition-colors"
              :class="request.cvDocument 
                ? 'border-success-300 dark:border-success-600 bg-success-50 dark:bg-success-900/20' 
                : 'border-muted-300 dark:border-muted-600 hover:border-primary-300 dark:hover:border-primary-600'"
            >
              <div class="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                :class="request.cvDocument 
                  ? 'bg-success-100 dark:bg-success-800' 
                  : 'bg-muted-100 dark:bg-muted-800'"
              >
                <Icon 
                  :name="request.cvDocument ? 'ph:check-circle-duotone' : 'ph:file-text-duotone'" 
                  class="w-6 h-6"
                  :class="request.cvDocument ? 'text-success-600' : 'text-muted-400'"
                />
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                class="hidden"
                id="cvDocument"
                @change="handleFileUpload($event, 'cvDocument')"
              />
              <BaseButton
                as="label"
                for="cvDocument"
                :color="request.cvDocument ? 'success' : 'primary'"
                variant="outline"
                size="sm"
                class="cursor-pointer"
              >
                <Icon 
                  :name="request.cvDocument ? 'ph:file-check-duotone' : 'ph:upload-duotone'" 
                  class="w-4 h-4 mr-2" 
                />
                {{ request.cvDocument ? 'تغییر فایل' : 'انتخاب فایل' }}
              </BaseButton>
              <p class="text-muted-400 mt-2 text-xs">فرمت PDF یا Word، حداکثر 5MB</p>
              <p v-if="request.cvDocument" class="text-success-600 mt-2 text-sm font-medium">
                ✓ {{ request.cvDocument.name }}
              </p>
              <p v-if="fileErrors.cvDocument" class="text-danger-600 mt-2 text-sm">
                {{ fileErrors.cvDocument }}
              </p>
            </div>
          </div>
        </div>

        <!-- Agreements -->
        <div class="col-span-12 space-y-4">
          <div class="space-y-4 p-4 rounded-lg bg-muted-50 dark:bg-muted-800">
            <div>
              <BaseCheckbox
                v-model="request.agreementAccepted"
                color="primary"
                :error="errors.fields.agreementAccepted"
              >
                <span class="text-sm">
                  قوانین و مقررات پلتفرم ذهنا را می‌پذیرم
                  <a href="#" class="text-primary-500 hover:underline">
                    (مطالعه قوانین)
                  </a>
                </span>
              </BaseCheckbox>
            </div>

            <div>
              <BaseCheckbox
                v-model="request.privacyPolicyAccepted"
                color="primary"
                :error="errors.fields.privacyPolicyAccepted"
              >
                <span class="text-sm">
                  سیاست حفظ حریم خصوصی را می‌پذیرم
                  <a href="#" class="text-primary-500 hover:underline">
                    (مطالعه سیاست)
                  </a>
                </span>
              </BaseCheckbox>
            </div>
          </div>

          <!-- Summary Info -->
          <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div class="flex items-start gap-3">
              <Icon name="ph:info-duotone" class="w-5 h-5 text-blue-500 mt-0.5" />
              <div class="text-sm text-blue-700 dark:text-blue-300">
                <p class="font-medium mb-1">مراحل بعدی:</p>
                <ul class="space-y-1 text-xs">
                  <li>• بررسی اطلاعات توسط تیم ذهنا (1-3 روز کاری)</li>
                  <li>• تماس جهت مصاحبه تخصصی</li>
                  <li>• فعال‌سازی حساب مشاور در صورت تایید</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex gap-4">
        <BaseButton
          v-if="currentStepId > 0"
          :to="loading ? undefined : getPrevStep()?.to"
          :disabled="!getPrevStep()"
          size="lg"
          class="w-full"
        >
          <span>بخش قبلی</span>
        </BaseButton>
        <BaseButton
          type="submit"
          color="primary"
          size="lg"
          class="w-full"
          :loading="loading"
        >
          <span>ثبت درخواست</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>