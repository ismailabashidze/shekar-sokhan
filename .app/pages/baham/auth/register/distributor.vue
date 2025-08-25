<script setup lang="ts">
import type { RegisterForm } from '~/types/auth'

definePageMeta({
  title: 'ثبت نام توزیع‌کننده - با هم',
  layout: 'empty'
})

useHead({
  title: 'ثبت نام توزیع‌کننده - با هم',
  meta: [
    { name: 'description', content: 'ثبت نام توزیع‌کننده در پلتفرم با هم' }
  ],
   htmlAttrs: { dir: 'rtl' } 

})

const router = useRouter()

const registerForm = reactive<RegisterForm>({
  phoneNumber: '',
  email: '',
  password: '',
  role: 'distributor',
  companyName: '',
  businessLicenseNumber: '',
  // Additional fields for distributors
  vehicleType: '',
  deliveryArea: '',
  warehouseCapacity: '',
  experience: ''
})

// Multi-step form state
const currentStep = ref(1)
const totalSteps = 3

const loading = ref(false)
const error = ref('')

// Validation
const validateStep = (step: number) => {
  switch (step) {
    case 1:
      return registerForm.phoneNumber && registerForm.email && registerForm.password
    case 2:
      return registerForm.companyName && registerForm.businessLicenseNumber
    case 3:
      return registerForm.vehicleType && registerForm.deliveryArea
    default:
      return false
  }
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  } else {
    error.value = 'لطفا تمام فیلدهای الزامی را پر کنید'
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = ''
  }
}

const submitRegister = async () => {
  if (!validateStep(currentStep.value)) {
    error.value = 'لطفا تمام فیلدهای الزامی را پر کنید'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    // In a real app, this would be an API call
    // await $fetch('/api/auth/register', { method: 'POST', body: registerForm })
    
    // Mock registration
    if (registerForm.phoneNumber && registerForm.password) {
      // Redirect to dashboard based on role
      await router.push(`/dashboard/${registerForm.role}`)
    } else {
      error.value = 'لطفا تمام فیلدهای الزامی را پر کنید'
    }
  } catch (err) {
    error.value = 'خطا در ثبت نام. لطفا دوباره تلاش کنید'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted-100 dark:bg-muted-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="flex justify-center mb-6">
        <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-16 items-center justify-center">
          <Icon name="ph:truck-duotone" class="text-success-500 size-8" />
        </div>
      </div>
      <BaseHeading
        tag="h1"
        size="xl"
        weight="semibold"
        lead="tight"
        class="text-center text-muted-800 dark:text-white"
      >
        ثبت نام توزیع‌کننده
      </BaseHeading>
      
      <!-- Progress indicator -->
      <div class="mt-8">
        <div class="flex justify-between">
          <div 
            v-for="step in totalSteps" 
            :key="step"
            class="flex-1 flex flex-col items-center"
            :class="{ 'opacity-50': step > currentStep }"
          >
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              :class="step <= currentStep ? 'bg-success-500 text-white' : 'bg-muted-200 dark:bg-muted-700 text-muted-500'"
            >
              {{ step }}
            </div>
            <div 
              class="text-sm"
              :class="step <= currentStep ? 'text-success-600 dark:text-success-400' : 'text-muted-500'"
            >
              {{ 
                step === 1 ? 'اطلاعات کاربری' : 
                step === 2 ? 'اطلاعات شرکت' : 
                'اطلاعات توزیع' 
              }}
            </div>
          </div>
        </div>
        <div class="mt-4 h-2 bg-muted-200 dark:bg-muted-700 rounded-full">
          <div 
            class="h-full bg-success-500 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 sm:p-8">
        <form class="space-y-6" @submit.prevent="submitRegister">
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1">
            <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-center">
              اطلاعات کاربری
            </BaseHeading>
            
            <TairoFormGroup label="شماره تلفن" class="mb-5">
              <BaseInput
                id="phone"
                v-model="registerForm.phoneNumber"
                dir="ltr"
                placeholder="09123456789"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>

            <TairoFormGroup label="ایمیل" class="mb-5">
              <BaseInput
                id="email"
                v-model="registerForm.email"
                type="email"
                dir="ltr"
                placeholder="example@domain.com"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>

            <TairoFormGroup label="رمز عبور" class="mb-5">
              <BaseInput
                id="password"
                v-model="registerForm.password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
          </div>
          
          <!-- Step 2: Company Info -->
          <div v-if="currentStep === 2">
            <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-center">
              اطلاعات شرکت
            </BaseHeading>
            
            <TairoFormGroup label="نام شرکت" class="mb-5">
              <BaseInput
                id="companyName"
                v-model="registerForm.companyName"
                placeholder="نام شرکت یا کسب و کار خود را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>

            <TairoFormGroup label="شماره پروانه کسب" class="mb-5">
              <BaseInput
                id="license"
                v-model="registerForm.businessLicenseNumber"
                placeholder="شماره پروانه کسب خود را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
          </div>
          
          <!-- Step 3: Distribution Info -->
          <div v-if="currentStep === 3">
            <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-center">
              اطلاعات توزیع
            </BaseHeading>
            
            <TairoFormGroup label="نوع وسیله نقلیه" class="mb-5">
              <BaseSelect
                id="vehicleType"
                v-model="registerForm.vehicleType"
                :classes="{ wrapper: 'w-full' }"
                rounded="sm"
              >
                <option value="">نوع وسیله نقلیه خود را انتخاب کنید</option>
                <option value="van">وانت</option>
                <option value="truck">کامیون</option>
                <option value="refrigerated">کامیون یخچالی</option>
                <option value="motorcycle">موتورسیکلت</option>
                <option value="other">سایر</option>
              </BaseSelect>
            </TairoFormGroup>

            <TairoFormGroup label="منطقه خدماتی" class="mb-5">
              <BaseInput
                id="deliveryArea"
                v-model="registerForm.deliveryArea"
                placeholder="منطقه‌هایی که خدمات توزیع ارائه می‌دهید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
            
            <TairoFormGroup label="ظرفیت انبار (تن)" class="mb-5">
              <BaseInput
                id="warehouseCapacity"
                v-model="registerForm.warehouseCapacity"
                type="number"
                placeholder="ظرفیت انبار خود را به تن وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
            
            <TairoFormGroup label="سابقه کار (سال)" class="mb-5">
              <BaseInput
                id="experience"
                v-model="registerForm.experience"
                type="number"
                placeholder="سابقه کار خود در زمینه توزیع"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
          </div>

          <div v-if="error" class="rounded-md bg-danger-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="ph:x-circle-duotone" class="text-danger-400 size-5" />
              </div>
              <div class="mr-3">
                <BaseParagraph size="sm" class="text-danger-700">
                  {{ error }}
                </BaseParagraph>
              </div>
            </div>
          </div>

          <!-- Navigation buttons -->
          <div class="flex justify-between mt-8">
            <BaseButton
              v-if="currentStep > 1"
              color="muted"
              @click="prevStep"
            >
              مرحله قبل
            </BaseButton>
            <div v-else></div>
            
            <div class="flex gap-3">
              <BaseButton
                v-if="currentStep < totalSteps"
                color="success"
                @click="nextStep"
              >
                مرحله بعد
              </BaseButton>
              
              <BaseButton
                v-if="currentStep === totalSteps"
                type="submit"
                color="success"
                :loading="loading"
              >
                {{ loading ? 'در حال ثبت نام...' : 'ثبت نام' }}
              </BaseButton>
            </div>
          </div>
        </form>

        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-muted-200 dark:border-muted-700" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white dark:bg-muted-900 px-2 text-muted-500 dark:text-muted-400">
                یا
              </span>
            </div>
          </div>

          <div class="mt-6">
            <BaseParagraph size="sm" class="text-center text-muted-600 dark:text-muted-400">
              قبلاً حساب کاربری دارید؟
              <NuxtLink to="/baham/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
                ورود به حساب کاربری
              </NuxtLink>
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>