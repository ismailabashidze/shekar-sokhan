<script setup lang="ts">
import { useTimeoutTest } from '~/composables/useTimeoutTest'

definePageMeta({
  title: 'تست تایم‌اوت',
  layout: 'empty',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { processing, error, testTimeoutWithRetry } = useTimeoutTest()
const testResult = ref<string | null>(null)

const runTest = async () => {
  try {
    const result = await testTimeoutWithRetry()
    testResult.value = result.message
  } catch (e) {
    testResult.value = `خطا: ${(e as Error).message}`
  }
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">تست مکانیزم تایم‌اوت و تلاش مجدد</h1>
    
    <div class="mb-4">
      <button 
        @click="runTest"
        :disabled="processing"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {{ processing ? 'در حال اجرا...' : 'اجرای تست' }}
      </button>
    </div>
    
    <div v-if="testResult" class="mt-4 p-4 rounded" :class="error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
      <p>{{ testResult }}</p>
    </div>
    
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-800 rounded">
      <p><strong>خطا:</strong> {{ error }}</p>
    </div>
  </div>
</template>