<script setup lang="ts">
definePageMeta({
  title: 'Debug Environment Variables',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const config = useRuntimeConfig()

const envVars = {
  dargahUsername: config.public.dargahUsername,
  dargahPassword: config.public.dargahPassword,
  dargahMerchantId: config.public.dargahMerchantId,
  dargahBaseUrl: config.public.dargahBaseUrl,
  appUrl: config.public.appUrl,
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center py-8">
    <div class="mx-auto w-full max-w-2xl">
      <BaseCard>
        <div class="p-8">
          <BaseHeading
            as="h1"
            size="xl"
            weight="medium"
            class="mb-6 text-center"
          >
            🔍 Debug Environment Variables
          </BaseHeading>
          
          <div class="space-y-4">
            <div v-for="(value, key) in envVars" :key="key" 
                 class="border-muted-200 dark:border-muted-700 flex items-center justify-between rounded-lg border p-4">
              <div class="flex-1">
                <div class="text-muted-900 dark:text-muted-100 font-medium">
                  {{ key }}
                </div>
                <div class="text-muted-500 dark:text-muted-400 mt-1 text-sm font-mono">
                  {{ value || '❌ خالی یا تعریف نشده' }}
                </div>
              </div>
              <div class="ml-4">
                <div v-if="value" class="text-success-500 flex items-center">
                  <Icon name="ph:check-circle" class="size-5" />
                </div>
                <div v-else class="text-danger-500 flex items-center">
                  <Icon name="ph:x-circle" class="size-5" />
                </div>
              </div>
            </div>
          </div>

          <div class="border-muted-200 dark:border-muted-700 mt-8 rounded-lg border p-6">
            <BaseHeading as="h3" size="md" weight="medium" class="mb-4">
              📋 چک‌لیست حل مشکل
            </BaseHeading>
            
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <Icon name="ph:number-circle-one" class="text-primary-500 mt-1 size-5" />
                <div>
                  <div class="text-muted-900 dark:text-muted-100 font-medium">
                    فایل .env در مسیر درست باشد
                  </div>
                  <div class="text-muted-500 dark:text-muted-400 text-sm">
                    مسیر: <code class="bg-muted-100 dark:bg-muted-800 rounded px-2 py-1">.app/.env</code>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <Icon name="ph:number-circle-two" class="text-primary-500 mt-1 size-5" />
                <div>
                  <div class="text-muted-900 dark:text-muted-100 font-medium">
                    نام متغیرها درست باشد
                  </div>
                  <div class="text-muted-500 dark:text-muted-400 text-sm">
                    <code class="bg-muted-100 dark:bg-muted-800 rounded px-2 py-1">DARGAH_USERNAME</code>,
                    <code class="bg-muted-100 dark:bg-muted-800 rounded px-2 py-1">DARGAH_PASSWORD</code>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start gap-3">
                <Icon name="ph:number-circle-three" class="text-primary-500 mt-1 size-5" />
                <div>
                  <div class="text-muted-900 dark:text-muted-100 font-medium">
                    سرور restart شده باشد
                  </div>
                  <div class="text-muted-500 dark:text-muted-400 text-sm">
                    <code class="bg-muted-100 dark:bg-muted-800 rounded px-2 py-1">pnpm dev</code> را دوباره اجرا کنید
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <BaseButton to="/onboarding" color="primary">
              بازگشت به صفحه پرداخت
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template> 