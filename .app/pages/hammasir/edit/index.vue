<script setup lang="ts">
// Profile Edit Page - Main editing interface with step-by-step form
import { useApplicantProfileService } from '~/composables/hammasir/useApplicantProfileService'
import { useProfileForm } from '~/composables/hammasir/useProfileForm'
import { useProfileUpload } from '~/composables/hammasir/useProfileUpload'

definePageMeta({
  title: 'ویرایش پروفایل - همسر',
  description: 'ویرایش و به‌روزرسانی اطلاعات پروفایل شخصی',
  layout: 'default'
})

// Composables
const { getMyProfile } = useApplicantProfileService()
const { profile, loading: profileLoading, error: profileError } = getMyProfile()
const { state: formState, updateForm, saveForm, validateForm, resetForm } = useProfileForm(profile.value)
const { uploadFile } = useProfileUpload()

// Reactive state
const currentStep = ref(1)
const saving = ref(false)
const hasUnsavedChanges = ref(false)

// Form steps configuration
const formSteps = [
  {
    id: 1,
    key: 'personal-info',
    title: 'اطلاعات شخصی',
    description: 'نام، تماس، تصویر و مشخصات پایه',
    icon: 'ph:user',
    component: 'HammasirFormsPersonalInfoForm',
    required: true
  },
  {
    id: 2,
    key: 'education',
    title: 'سوابق تحصیلی',
    description: 'مدارک، دانشگاه‌ها و رشته‌های تحصیلی',
    icon: 'ph:graduation-cap',
    component: 'HammasirFormsEducationForm',
    required: true
  },
  {
    id: 3,
    key: 'occupation',
    title: 'سوابق شغلی',
    description: 'تجربیات کاری و مهارت‌های حرفه‌ای',
    icon: 'ph:briefcase',
    component: 'HammasirFormsOccupationForm',
    required: true
  },
  {
    id: 4,
    key: 'location',
    title: 'اطلاعات مکانی',
    description: 'محل‌های سکونت و تمایلات مکانی',
    icon: 'ph:map-pin',
    component: 'HammasirFormsLocationForm',
    required: false
  },
  {
    id: 5,
    key: 'preferences',
    title: 'تنظیمات و ترجیحات',
    description: 'حریم خصوصی و تنظیمات ارتباطی',
    icon: 'ph:gear',
    component: 'HammasirFormsPreferencesForm',
    required: true
  }
]

// Get current step configuration
const currentStepConfig = computed(() => {
  return formSteps.find(step => step.id === currentStep.value) || formSteps[0]
})

// Check if step is completed
const isStepCompleted = (stepKey: string) => {
  switch (stepKey) {
    case 'personal-info':
      return !!(formState.value.personalInfo.firstName && 
                formState.value.personalInfo.lastName && 
                formState.value.personalInfo.email &&
                formState.value.personalInfo.phoneNumber)
    case 'education':
      return formState.value.demographics.education.length > 0
    case 'occupation':
      return formState.value.demographics.occupation.length > 0
    case 'location':
      return formState.value.demographics.location.length > 0
    case 'preferences':
      return true // Always considered completed if reached
    default:
      return false
  }
}

// Navigation methods
const goToStep = (stepId: number) => {
  if (hasUnsavedChanges.value) {
    if (confirm('تغییرات ذخیره نشده‌ای دارید. آیا می‌خواهید بدون ذخیره ادامه دهید؟')) {
      hasUnsavedChanges.value = false
      currentStep.value = stepId
    }
  } else {
    currentStep.value = stepId
  }
}

const nextStep = () => {
  if (currentStep.value < formSteps.length) {
    saveCurrentStep()
      .then(() => {
        currentStep.value += 1
      })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value -= 1
  }
}

// Save current step
const saveCurrentStep = async () => {
  saving.value = true
  try {
    const isValid = await validateForm(currentStepConfig.value.key)
    if (isValid) {
      await saveForm(currentStepConfig.value.key)
      hasUnsavedChanges.value = false
      $toast.success('اطلاعات ذخیره شد')
      return true
    } else {
      $toast.error('لطفاً خطاهای فرم را برطرف کنید')
      return false
    }
  } catch (error) {
    console.error('Save error:', error)
    $toast.error('خطا در ذخیره اطلاعات')
    return false
  } finally {
    saving.value = false
  }
}

// Save and finish
const saveAndFinish = async () => {
  const success = await saveCurrentStep()
  if (success) {
    navigateTo('/hammasir')
  }
}

// Handle form changes
const handleFormChange = () => {
  hasUnsavedChanges.value = true
}

// Handle form validation
const handleFormValidation = (section: string, field?: string) => {
  validateForm(section, field)
}

// Handle array operations
const handleAddItem = (section: 'education' | 'occupation' | 'location') => {
  const newItem = {
    tempId: `temp_${Date.now()}`,
    // Add default values based on section
    ...(section === 'education' && {
      institutionName: '',
      degree: '',
      fieldOfStudy: '',
      educationLevel: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      isGraduated: false
    }),
    ...(section === 'occupation' && {
      currentPosition: '',
      companyName: '',
      industry: '',
      employmentType: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false
    }),
    ...(section === 'location' && {
      city: '',
      state: '',
      country: 'ایران',
      isCurrent: false
    })
  }
  
  formState.value.demographics[section].push(newItem)
  handleFormChange()
}

const handleRemoveItem = (section: 'education' | 'occupation' | 'location', index: number) => {
  formState.value.demographics[section].splice(index, 1)
  handleFormChange()
}

// Handle file upload
const handleFileUpload = async (file: File, field: string) => {
  try {
    const uploadResult = await uploadFile(file)
    if (uploadResult.success && uploadResult.url) {
      updateForm('personalInfo', { [field]: uploadResult.url })
      handleFormChange()
      $toast.success('فایل با موفقیت آپلود شد')
    } else {
      $toast.error('خطا در آپلود فایل')
    }
  } catch (error) {
    console.error('Upload error:', error)
    $toast.error('خطا در آپلود فایل')
  }
}

// Prevent navigation with unsaved changes
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = confirm('تغییرات ذخیره نشده‌ای دارید. آیا می‌خواهید بدون ذخیره خارج شوید؟')
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

// Handle browser back/refresh
onBeforeUnmount(() => {
  if (hasUnsavedChanges.value) {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault()
      e.returnValue = ''
    })
  }
})

// URL params handling for direct step access
const route = useRoute()
onMounted(() => {
  const stepParam = route.query.step
  if (stepParam) {
    const stepNumber = parseInt(stepParam as string)
    if (stepNumber >= 1 && stepNumber <= formSteps.length) {
      currentStep.value = stepNumber
    }
  }
})

// Update URL when step changes
watch(currentStep, (newStep) => {
  const router = useRouter()
  router.replace({ query: { step: newStep.toString() } })
})

// SEO and meta
useHead({
  title: 'ویرایش پروفایل - همسر',
  meta: [
    { name: 'description', content: 'ویرایش و به‌روزرسانی اطلاعات پروفایل شخصی' },
    { name: 'keywords', content: 'ویرایش، پروفایل، همسر، اطلاعات شخصی' },
    { property: 'og:title', content: 'ویرایش پروفایل - همسر' },
    { property: 'og:description', content: 'ویرایش و به‌روزرسانی اطلاعات پروفایل شخصی' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm">
            <NuxtLink 
              to="/hammasir" 
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              پروفایل
            </NuxtLink>
            <Icon name="ph:caret-left" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-800 dark:text-white font-medium">ویرایش</span>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="saving"
              @click="resetForm"
            >
              <Icon name="ph:arrow-clockwise" class="w-4 h-4 me-2" />
              بازنشانی
            </BaseButton>
            
            <BaseButton
              variant="outline"
              size="sm"
              @click="navigateTo('/hammasir')"
            >
              <Icon name="ph:x" class="w-4 h-4 me-2" />
              انصراف
            </BaseButton>
          </div>
        </div>

        <div class="mt-4">
          <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-800 dark:text-white mb-2">
            ویرایش پروفایل
          </BaseHeading>
          <BaseParagraph class="text-gray-600 dark:text-gray-400">
            {{ currentStepConfig.description }}
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="profileLoading" class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8">
          <div class="animate-pulse space-y-6">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div class="space-y-4">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="profileError" class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto text-center">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-800 dark:text-white mb-4">
          خطا در بارگذاری پروفایل
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-400 mb-6">
          متأسفانه در بارگذاری اطلاعات مشکلی پیش آمده. لطفاً دوباره تلاش کنید.
        </BaseParagraph>
        <BaseButton variant="solid" @click="navigateTo('/hammasir')">
          بازگشت به پروفایل
        </BaseButton>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Step Progress -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div class="flex items-center justify-between mb-4">
            <BaseHeading as="h2" size="md" weight="semibold" class="text-gray-800 dark:text-white">
              پیشرفت تکمیل پروفایل
            </BaseHeading>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              مرحله {{ currentStep }} از {{ formSteps.length }}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="`width: ${(currentStep / formSteps.length) * 100}%`"
              ></div>
            </div>
          </div>

          <!-- Step Navigation -->
          <div class="flex justify-between">
            <div 
              v-for="step in formSteps" 
              :key="step.id"
              class="flex flex-col items-center cursor-pointer group"
              @click="goToStep(step.id)"
            >
              <!-- Step Circle -->
              <div 
                :class="`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step.id === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : step.id < currentStep || isStepCompleted(step.key)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-gray-600'
                }`"
              >
                <Icon 
                  v-if="step.id < currentStep || isStepCompleted(step.key)"
                  name="ph:check" 
                  class="w-5 h-5" 
                />
                <Icon 
                  v-else
                  :name="step.icon" 
                  class="w-5 h-5" 
                />
              </div>

              <!-- Step Label -->
              <div class="mt-2 text-center">
                <div 
                  :class="`text-xs font-medium ${
                    step.id === currentStep 
                      ? 'text-blue-600' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`"
                >
                  {{ step.title }}
                </div>
                <div v-if="step.required" class="text-xs text-orange-600 dark:text-orange-400">
                  ضروری
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <!-- Step Header -->
          <div class="flex items-start justify-between mb-8">
            <div class="flex items-start gap-4">
              <div :class="`w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center`">
                <Icon :name="currentStepConfig.icon" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-800 dark:text-white mb-2">
                  {{ currentStepConfig.title }}
                </BaseHeading>
                <BaseParagraph class="text-gray-600 dark:text-gray-400">
                  {{ currentStepConfig.description }}
                </BaseParagraph>
              </div>
            </div>

            <!-- Save Status -->
            <div v-if="hasUnsavedChanges" class="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
              <Icon name="ph:warning" class="w-4 h-4" />
              <span>تغییرات ذخیره نشده</span>
            </div>
          </div>

          <!-- Dynamic Form Component -->
          <div class="mb-8">
            <!-- Personal Info Form -->
            <HammasirFormsPersonalInfoForm
              v-if="currentStepConfig.key === 'personal-info'"
              v-model="formState.personalInfo"
              :errors="formState.errors.personalInfo"
              :loading="saving"
              @update:model-value="handleFormChange"
              @validate="handleFormValidation"
              @upload-avatar="handleFileUpload($event, 'profilePicture')"
            />

            <!-- Education Form -->
            <HammasirFormsEducationForm
              v-else-if="currentStepConfig.key === 'education'"
              v-model="formState.demographics.education"
              :errors="formState.errors.education"
              :loading="saving"
              @update:model-value="handleFormChange"
              @validate="handleFormValidation"
              @add="handleAddItem('education')"
              @remove="handleRemoveItem('education', $event)"
            />

            <!-- Occupation Form -->
            <HammasirFormsOccupationForm
              v-else-if="currentStepConfig.key === 'occupation'"
              v-model="formState.demographics.occupation"
              :errors="formState.errors.occupation"
              :loading="saving"
              @update:model-value="handleFormChange"
              @validate="handleFormValidation"
              @add="handleAddItem('occupation')"
              @remove="handleRemoveItem('occupation', $event)"
            />

            <!-- Location Form -->
            <div v-else-if="currentStepConfig.key === 'location'">
              <div class="text-center py-8">
                <Icon name="ph:map-pin" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <BaseHeading as="h4" size="md" weight="medium" class="text-gray-600 dark:text-gray-400 mb-4">
                  فرم محل سکونت
                </BaseHeading>
                <BaseParagraph class="text-gray-500 dark:text-gray-400 mb-6">
                  این بخش به زودی اضافه خواهد شد
                </BaseParagraph>
                <BaseButton variant="outline" @click="nextStep">
                  رد کردن این مرحله
                </BaseButton>
              </div>
            </div>

            <!-- Preferences Form -->
            <HammasirFormsPreferencesForm
              v-else-if="currentStepConfig.key === 'preferences'"
              v-model="formState.preferences"
              :errors="formState.errors.preferences"
              :loading="saving"
              @update:model-value="handleFormChange"
              @validate="handleFormValidation"
            />
          </div>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <BaseButton
              v-if="currentStep > 1"
              variant="outline"
              :disabled="saving"
              @click="previousStep"
            >
              <Icon name="ph:arrow-right" class="w-4 h-4 me-2" />
              مرحله قبل
            </BaseButton>
            <div v-else></div>

            <div class="flex items-center gap-3">
              <BaseButton
                variant="outline"
                :loading="saving"
                @click="saveCurrentStep"
              >
                <Icon name="ph:floppy-disk" class="w-4 h-4 me-2" />
                ذخیره
              </BaseButton>

              <BaseButton
                v-if="currentStep < formSteps.length"
                variant="solid"
                :loading="saving"
                @click="nextStep"
              >
                مرحله بعد
                <Icon name="ph:arrow-left" class="w-4 h-4 ms-2" />
              </BaseButton>

              <BaseButton
                v-else
                variant="solid"
                :loading="saving"
                @click="saveAndFinish"
              >
                تکمیل و ذخیره
                <Icon name="ph:check" class="w-4 h-4 ms-2" />
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Help Section -->
        <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div class="flex items-start gap-4">
            <Icon name="ph:info" class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <BaseHeading as="h4" size="sm" weight="semibold" class="text-blue-800 dark:text-blue-200 mb-2">
                نکات مهم
              </BaseHeading>
              <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <div>• اطلاعات دقیق و کامل وارد کنید تا نتایج بهتری دریافت کنید</div>
                <div>• تمام بخش‌های ضروری را تکمیل کنید</div>
                <div>• پس از هر تغییر، حتماً اطلاعات را ذخیره کنید</div>
                <div>• در صورت نیاز به راهنمایی، با پشتیبانی تماس بگیرید</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom transitions for step navigation */
.step-enter-active, .step-leave-active {
  transition: all 0.3s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>