<script setup lang="ts">
import type { RegisterForm } from '~/types/auth'

definePageMeta({
  title: 'ثبت نام خریدار - با هم',
  layout: 'empty'
})

useHead({
  title: 'ثبت نام خریدار - با هم',
  meta: [
    { name: 'description', content: 'ثبت نام خریدار در پلتفرم با هم' }
  ],
   htmlAttrs: { dir: 'rtl' } 

})

const router = useRouter()

const registerForm = reactive<RegisterForm>({
  phoneNumber: '',
  email: '',
  password: '',
  role: 'buyer',
  companyName: '',
  businessLicenseNumber: ''
})

const loading = ref(false)
const error = ref('')

const submitRegister = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // In a real app, this would be an API call
    // await $fetch('/api/auth/register', { method: 'POST', body: registerForm })
    
    // Mock registration
    if (registerForm.phoneNumber && registerForm.password) {
      // Redirect to regular buyer dashboard, middleware will handle fresh redirect
      await router.push(`/baham/${registerForm.role}`)
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
        <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-16 items-center justify-center">
          <Icon name="ph:shopping-cart-duotone" class="text-primary-500 size-8" />
        </div>
      </div>
      <BaseHeading
        tag="h1"
        size="xl"
        weight="semibold"
        lead="tight"
        class="text-center text-muted-800 dark:text-white"
      >
        ثبت نام خریدار
      </BaseHeading>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 sm:p-8">
        <form class="space-y-6" @submit.prevent="submitRegister">
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

          <BaseButton
            type="submit"
            color="primary"
            :loading="loading"
            class="w-full"
          >
            {{ loading ? 'در حال ثبت نام...' : 'ثبت نام' }}
          </BaseButton>
        </form>

        <div class="mt-6">
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