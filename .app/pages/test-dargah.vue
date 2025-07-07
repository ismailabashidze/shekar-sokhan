<script setup lang="ts">
definePageMeta({
  title: 'Test Dargah Login',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { login, isLoading, error, authToken, merchantId } = useDargah()
const config = useRuntimeConfig()

const username = ref(String(config.public.dargahUsername || ''))
const password = ref(String(config.public.dargahPassword || ''))
const testResult = ref('')

const testLogin = async () => {
  testResult.value = ''

  try {
    console.log('🧪 Starting test login...')
    const result = await login({
      username: username.value,
      password: password.value,
    })

    testResult.value = `✅ Success! Token: ${result.access_token.substring(0, 20)}...`
    console.log('✅ Test login successful:', result)
  }
  catch (err) {
    testResult.value = `❌ Failed: ${err.message}`
    console.error('❌ Test login failed:', err)
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center py-8">
    <div class="mx-auto w-full max-w-lg">
      <BaseCard>
        <div class="p-8">
          <BaseHeading
            as="h1"
            size="xl"
            weight="medium"
            class="mb-6 text-center"
          >
            🧪 Test Dargah Login
          </BaseHeading>

          <form class="space-y-4" @submit.prevent="testLogin">
            <BaseInput
              v-model="username"
              label="Username/Phone"
              placeholder="09121248393"
              required
            />

            <BaseInput
              v-model="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              required
            />

            <BaseButton
              type="submit"
              color="primary"
              class="w-full"
              :loading="isLoading"
            >
              Test Login
            </BaseButton>
          </form>

          <div v-if="error" class="bg-danger-100 dark:bg-danger-900/20 mt-4 rounded-lg p-4">
            <div class="text-danger-800 dark:text-danger-200 text-sm">
              {{ error }}
            </div>
          </div>

          <div
            v-if="testResult"
            class="mt-4 rounded-lg p-4"
            :class="testResult.includes('✅') ? 'bg-success-100 dark:bg-success-900/20' : 'bg-danger-100 dark:bg-danger-900/20'"
          >
            <div
              class="text-sm"
              :class="testResult.includes('✅') ? 'text-success-800 dark:text-success-200' : 'text-danger-800 dark:text-danger-200'"
            >
              {{ testResult }}
            </div>
          </div>

          <div v-if="authToken" class="bg-info-100 dark:bg-info-900/20 mt-4 rounded-lg p-4">
            <div class="text-info-800 dark:text-info-200 text-sm">
              <div><strong>Token:</strong> {{ authToken.substring(0, 30) }}...</div>
              <div><strong>Merchant ID:</strong> {{ merchantId }}</div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <BaseButton to="/onboarding" variant="outline">
              بازگشت به پرداخت
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
