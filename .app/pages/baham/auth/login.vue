<script setup lang="ts">
import type { LoginForm } from '~/types/auth'

definePageMeta({
  title: 'ورود - با هم',
  layout: 'empty'
})

useHead({
  title: 'ورود - با هم',
  meta: [
    { name: 'description', content: 'ورود به حساب کاربری پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

const router = useRouter()
const route = useRoute()

const loginForm = reactive<LoginForm>({
  phoneNumber: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const submitLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // In a real app, this would be an API call
    // await $fetch('/api/auth/login', { method: 'POST', body: loginForm })
    
    // Mock authentication
    if (loginForm.phoneNumber && loginForm.password) {
      // Redirect based on user role (mocked)
      const role = route.query.role || 'buyer'
      // Redirect to regular buyer dashboard, middleware will handle fresh redirect
      await router.push(`/baham/${role}`)
    } else {
      error.value = 'شماره تلفن یا رمز عبور اشتباه است'
    }
  } catch (err) {
    error.value = 'خطا در ورود. لطفا دوباره تلاش کنید'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-muted-100 dark:bg-muted-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center mb-6">
        <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-16 items-center justify-center">
          <Icon name="ph:sign-in-duotone" class="text-primary-500 size-8" />
        </div>
      </div>
      <BaseHeading
        tag="h1"
        size="xl"
        weight="semibold"
        lead="tight"
        class="text-center text-muted-800 dark:text-white"
      >
        ورود به حساب کاربری
      </BaseHeading>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 sm:p-8">
        <form class="space-y-6" @submit.prevent="submitLogin">
          <TairoFormGroup label="شماره تلفن">
            <BaseInput
              id="phone"
              v-model="loginForm.phoneNumber"
              dir="ltr"
              placeholder="09123456789"
              rounded="sm"
              :classes="{
                wrapper: 'w-full'
              }"
            />
          </TairoFormGroup>

          <TairoFormGroup label="رمز عبور">
            <BaseInput
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="رمز عبور خود را وارد کنید"
              rounded="sm"
              :classes="{
                wrapper: 'w-full'
              }"
            />
            <div class="mt-2 text-right">
              <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-500">
                رمز عبور را فراموش کرده‌اید؟
              </a>
            </div>
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
            {{ loading ? 'در حال ورود...' : 'ورود' }}
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
              حساب کاربری ندارید؟
              <NuxtLink to="/baham/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
                ایجاد حساب کاربری
              </NuxtLink>
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>