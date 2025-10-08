<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات امنیت',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()

// Passkey functionality
const passkeyInput = ref('')
const passkeySet = ref(false)
const inactivityPeriod = ref('2') // default 2 minutes

// Check if passkey is already set in localStorage
onMounted(() => {
  if (process.client) {
    const storedPasskey = localStorage.getItem('passkey')
    const storedInactivity = localStorage.getItem('inactivityPeriod')
    
    if (storedPasskey) {
      passkeySet.value = true
      inactivityPeriod.value = storedInactivity ? storedInactivity : '2'
    }
  }
})

const isPasskeyValid = computed(() => {
  return passkeyInput.value.length === 4 && /^\d{4}$/.test(passkeyInput.value)
})

const setPasskey = () => {
  if (isPasskeyValid.value) {
    // Encode the passkey in base64
    const encodedPasskey = btoa(passkeyInput.value)
    localStorage.setItem('passkey', encodedPasskey)
    localStorage.setItem('inactivityPeriod', inactivityPeriod.value.toString())
    passkeySet.value = true
    passkeyInput.value = ''
    alert('گذرواژه با موفقیت تنظیم شد')
  }
}

const clearPasskey = () => {
  localStorage.removeItem('passkey')
  localStorage.removeItem('inactivityPeriod')
  localStorage.removeItem('passkeyAuthenticated')
  passkeySet.value = false
  alert('گذرواژه با موفقیت حذف شد')
}

const lockScreenManually = () => {
  // Set a flag to indicate manual lock
  localStorage.setItem('manualLock', 'true')
  // Redirect to lock screen
  navigateTo('/lock-screen')
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl">
    <BaseCard rounded="lg" class="p-6">
      <div class="mb-6">
        <BaseHeading tag="h3" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
          تنظیمات امنیت حساب
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 mt-2">
          مدیریت امنیت حساب کاربری شما
        </BaseParagraph>
      </div>

      <!-- Passkey Settings Section -->
      <div class="mb-8">
        <BaseHeading tag="h4" size="md" weight="medium" class="text-muted-800 dark:text-white mb-4">
          گذرواژه ۴ رقمی
        </BaseHeading>
        
        <BaseParagraph size="sm" class="text-muted-500 mb-4">
          یک گذرواژه ۴ رقمی برای حفاظت از حساب کاربری خود تنظیم کنید
        </BaseParagraph>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-muted-700 dark:text-white mb-2">
              گذرواژه ۴ رقمی
            </label>
            <div class="flex gap-3">
              <BaseInput
                v-model="passkeyInput"
                type="password"
                maxlength="4"
                placeholder="****"
                class="w-full max-w-xs"
              />
              <BaseButton
                color="primary"
                variant="solid"
                @click="setPasskey"
                :disabled="!isPasskeyValid"
              >
                {{ passkeySet ? 'به‌روزرسانی' : 'تنظیم' }}
              </BaseButton>
              <BaseButton
                v-if="passkeySet"
                color="muted"
                variant="outline"
                @click="clearPasskey"
              >
                حذف
              </BaseButton>
            </div>
            <BaseText size="xs" class="text-muted-500 mt-1">
              یک گذرواژه ۴ رقمی وارد کنید
            </BaseText>
          </div>

          <div v-if="passkeySet">
            <label class="block text-sm font-medium text-muted-700 dark:text-white mb-2">
              زمان عدم فعالیت قبل از قفل شدن
            </label>
            <BaseSelect
              v-model="inactivityPeriod"
              class="w-full max-w-xs"
            >
              <option value="1">۱ دقیقه</option>
              <option value="2">۲ دقیقه</option>
              <option value="5">۵ دقیقه</option>
              <option value="10">۱۰ دقیقه</option>
              <option value="15">۱۵ دقیقه</option>
              <option value="30">۳۰ دقیقه</option>
            </BaseSelect>
          </div>

          <div v-if="passkeySet" class="flex items-center pt-2">
            <BaseButton
              color="primary"
              variant="outline"
              @click="lockScreenManually"
            >
              آزمایش قفل صفحه
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Additional Security Settings Can Be Added Here -->
      <div>
        <BaseHeading tag="h4" size="md" weight="medium" class="text-muted-800 dark:text-white mb-4">
          سایر تنظیمات امنیتی
        </BaseHeading>
        
        <BaseParagraph size="sm" class="text-muted-500 mb-4">
          تنظیمات بیشتر امنیتی در آینده اضافه خواهند شد
        </BaseParagraph>
      </div>
    </BaseCard>
  </div>
</template>