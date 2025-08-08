<template>
  <div class="container mx-auto p-6">
    <BaseCard class="max-w-2xl mx-auto" shape="curved">
      <div class="p-6">
        <BaseHeading tag="h1" size="xl" class="mb-6 text-center">
          تست عیب‌یابی خاطرات
        </BaseHeading>

        <div class="space-y-4">
          <BaseInput
            v-model="testMessage"
            label="پیام آزمایشی"
            placeholder="پیامی بنویسید..."
          />

          <BaseButton
            @click="runDirectTest"
            color="primary"
            :loading="isLoading"
            class="w-full"
          >
            تست مستقیم
          </BaseButton>

          <div v-if="debugInfo.length > 0" class="space-y-3">
            <BaseHeading tag="h3" size="md">نتایج عیب‌یابی:</BaseHeading>
            
            <div 
              v-for="(info, index) in debugInfo" 
              :key="index"
              class="p-3 rounded-lg border bg-gray-50"
            >
              <div class="text-sm">
                <div class="font-medium">{{ info.step }}</div>
                <div class="mt-1">
                  <span class="font-medium">نتیجه:</span> 
                  <span :class="info.result.isWorth ? 'text-green-600' : 'text-red-600'">
                    {{ info.result.isWorth ? '✓' : '✗' }} {{ info.result.reason }}
                  </span>
                </div>
                <div v-if="info.result.isWorth" class="text-xs text-gray-600 mt-1">
                  دسته: {{ info.result.suggestedCategory }} | 
                  اهمیت: {{ info.result.suggestedImportance }}/10
                </div>
                <div v-if="info.error" class="text-red-600 text-xs mt-1">
                  خطا: {{ info.error }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'عیب‌یابی خاطرات',
  layout: 'sidebar',
})

const testMessage = ref('نام من علی است و 25 ساله هستم')
const isLoading = ref(false)
const debugInfo = ref<any[]>([])

const runDirectTest = async () => {
  if (!testMessage.value.trim()) return

  isLoading.value = true
  debugInfo.value = []

  // Test 1: Direct fallback analysis
  try {
    const directResult = performDirectAnalysis(testMessage.value)
    debugInfo.value.push({
      step: '1. تست مستقیم (بدون composable)',
      result: directResult,
      error: null
    })
  } catch (error) {
    debugInfo.value.push({
      step: '1. تست مستقیم (بدون composable)',
      result: { isWorth: false, reason: 'خطا در تست مستقیم' },
      error: error.message
    })
  }

  // Test 2: Server API
  try {
    const serverResult = await testServerAPI(testMessage.value)
    debugInfo.value.push({
      step: '2. تست API سرور',
      result: serverResult,
      error: null
    })
  } catch (error) {
    debugInfo.value.push({
      step: '2. تست API سرور',
      result: { isWorth: false, reason: 'خطا در API سرور' },
      error: error.message
    })
  }

  // Test 3: Enhanced messaging composable
  try {
    const { analyzeMessageWorth } = useEnhancedMessaging()
    const composableResult = await analyzeMessageWorth(testMessage.value)
    debugInfo.value.push({
      step: '3. تست composable کامل',
      result: composableResult,
      error: null
    })
  } catch (error) {
    debugInfo.value.push({
      step: '3. تست composable کامل',
      result: { isWorth: false, reason: 'خطا در composable' },
      error: error.message
    })
  }

  isLoading.value = false
}

// Direct analysis function (copy of the logic)
const performDirectAnalysis = (content: string) => {
  const personalInfoKeywords = ['نام', 'سن', 'ساله', 'شغل', 'تحصیلات', 'متأهل', 'مجرد', 'هستم']
  const goalsKeywords = ['هدف', 'می‌خواهم', 'میخواهم', 'آرزو', 'تمایل', 'برنامه', 'قصد']
  const symptomsKeywords = ['اضطراب', 'افسرده', 'استرس', 'نگران', 'ترس', 'خواب', 'نمی‌خوابم']
  const relationshipKeywords = ['مادر', 'پدر', 'همسر', 'فرزند', 'دوست', 'خانواده', 'مادرم', 'پدرم']
  
  const lowerContent = content.toLowerCase().trim()
  
  let category = 'other'
  let importance = 3
  let isWorth = false
  let reason = 'پیام عمومی'
  
  if (personalInfoKeywords.some(keyword => lowerContent.includes(keyword))) {
    category = 'personal_info'
    importance = 7
    isWorth = true
    reason = 'حاوی اطلاعات شخصی'
  } else if (goalsKeywords.some(keyword => lowerContent.includes(keyword))) {
    category = 'goals'
    importance = 8
    isWorth = true
    reason = 'بیان هدف یا آرزو'
  } else if (symptomsKeywords.some(keyword => lowerContent.includes(keyword))) {
    category = 'symptoms'
    importance = 8
    isWorth = true
    reason = 'شامل علائم روانی'
  } else if (relationshipKeywords.some(keyword => lowerContent.includes(keyword))) {
    category = 'relationships'
    importance = 7
    isWorth = true
    reason = 'مربوط به روابط خانوادگی'
  }
  
  const commonWords = ['سلام', 'ممنون', 'متشکر', 'خداحافظ', 'چطور', 'خوب']
  if (content.length < 8 || commonWords.some(word => lowerContent.includes(word))) {
    if (!isWorth) {
      isWorth = false
      reason = 'پیام کوتاه یا تعارفی'
    }
  }
  
  return {
    isWorth,
    reason,
    suggestedCategory: category,
    suggestedImportance: importance,
    extractedInfo: isWorth ? content : undefined
  }
}

// Test server API directly
const testServerAPI = async (content: string) => {
  const response = await $fetch('/api/memory/analyze', {
    method: 'POST',
    body: {
      content,
      userId: 'test-user'
    }
  })
  
  if (response.success) {
    return response.analysis
  } else {
    throw new Error(response.error || 'Server analysis failed')
  }
}
</script>