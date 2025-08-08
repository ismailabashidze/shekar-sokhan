<template>
  <div class="container mx-auto p-6">
    <BaseCard class="max-w-2xl mx-auto" shape="curved">
      <div class="p-6">
        <BaseHeading tag="h1" size="xl" class="mb-6 text-center">
          آزمایش ساده تحلیل خاطرات
        </BaseHeading>

        <div class="space-y-4">
          <!-- Message Input -->
          <BaseTextarea
            v-model="testMessage"
            label="پیام آزمایشی"
            placeholder="پیامی بنویسید..."
            rows="3"
          />

          <!-- Test Button -->
          <BaseButton
            @click="testAnalysis"
            color="primary"
            :loading="isLoading"
            class="w-full"
          >
            <Icon name="ph:brain-duotone" class="me-2 size-4" />
            تست تحلیل
          </BaseButton>

          <!-- Sample Messages -->
          <div class="grid grid-cols-1 gap-2">
            <BaseButton
              v-for="sample in samples"
              :key="sample"
              @click="testMessage = sample"
              color="muted"
              size="sm"
              class="text-right h-auto whitespace-normal p-3"
            >
              {{ sample }}
            </BaseButton>
          </div>

          <!-- Results -->
          <div v-if="result" class="mt-6 p-4 rounded-lg border" :class="result.isWorth ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'">
            <div class="flex items-center gap-2 mb-2">
              <Icon 
                :name="result.isWorth ? 'ph:check-circle' : 'ph:x-circle'" 
                :class="result.isWorth ? 'text-green-600' : 'text-gray-600'"
                class="size-5"
              />
              <span class="font-medium">
                {{ result.isWorth ? 'ارزش ذخیره دارد' : 'ارزش ذخیره ندارد' }}
              </span>
            </div>
            
            <div class="text-sm space-y-1">
              <p><strong>دلیل:</strong> {{ result.reason }}</p>
              <p v-if="result.suggestedCategory"><strong>دسته:</strong> {{ getCategoryLabel(result.suggestedCategory) }}</p>
              <p v-if="result.suggestedImportance"><strong>اهمیت:</strong> {{ result.suggestedImportance }}/10</p>
              <p v-if="result.extractedInfo"><strong>محتوا:</strong> {{ result.extractedInfo }}</p>
            </div>
          </div>

          <!-- PocketBase Status -->
          <div class="mt-6 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="ph:database" class="text-blue-600 size-4" />
              <span class="text-sm font-medium text-blue-800">وضعیت پایگاه داده</span>
            </div>
            <div class="text-xs text-blue-700">
              <div class="flex justify-between">
                <span>اتصال PocketBase:</span>
                <span :class="pbStatus.connected ? 'text-green-600' : 'text-red-600'">
                  {{ pbStatus.connected ? '✓ متصل' : '✗ قطع' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>کاربر وارد شده:</span>
                <span :class="pbStatus.user ? 'text-green-600' : 'text-red-600'">
                  {{ pbStatus.user ? '✓ بله' : '✗ خیر' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'آزمایش ساده خاطرات',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// State
const testMessage = ref('')
const isLoading = ref(false)
const result = ref<any>(null)
const pbStatus = ref({ connected: false, user: false })

// Sample messages
const samples = [
  'سلام چطورید؟',
  'نام من علی است و 25 ساله هستم',
  'می‌خواهم اضطراب خودم را کنترل کنم',
  'شب‌ها خواب ندارم و نگران هستم',
  'با مادرم مشکل دارم'
]

// Test function
const testAnalysis = async () => {
  if (!testMessage.value.trim()) return

  isLoading.value = true
  result.value = null

  try {
    // Test the analysis function directly
    const { analyzeMessageWorth } = useEnhancedMessaging()
    result.value = await analyzeMessageWorth(testMessage.value)
  } catch (error) {
    console.error('Error in analysis:', error)
    // Manual fallback analysis
    result.value = performManualAnalysis(testMessage.value)
  } finally {
    isLoading.value = false
  }
}

// Manual analysis fallback
const performManualAnalysis = (content: string) => {
  const personalKeywords = ['نام', 'سن', 'ساله', 'هستم', 'شغل', 'تحصیلات']
  const goalKeywords = ['می‌خواهم', 'میخواهم', 'هدف', 'آرزو', 'قصد', 'برنامه']
  const symptomKeywords = ['اضطراب', 'نگران', 'خواب', 'استرس', 'افسرده', 'ترس']
  const relationshipKeywords = ['مادر', 'پدر', 'همسر', 'خانواده', 'مادرم', 'پدرم', 'دوست']
  
  let category = 'other'
  let importance = 3
  let isWorth = false
  let reason = 'پیام عمومی'

  const lower = content.toLowerCase().trim()

  if (personalKeywords.some(k => lower.includes(k))) {
    category = 'personal_info'
    importance = 7
    isWorth = true
    reason = 'حاوی اطلاعات شخصی'
  } else if (goalKeywords.some(k => lower.includes(k))) {
    category = 'goals'
    importance = 8
    isWorth = true
    reason = 'بیان هدف یا آرزو'
  } else if (symptomKeywords.some(k => lower.includes(k))) {
    category = 'symptoms'
    importance = 8
    isWorth = true
    reason = 'شامل علائم روانی'
  } else if (relationshipKeywords.some(k => lower.includes(k))) {
    category = 'relationships'
    importance = 7
    isWorth = true
    reason = 'مربوط به روابط'
  }

  // Skip very short or common messages
  const commonWords = ['سلام', 'ممنون', 'متشکر', 'خداحافظ', 'چطور', 'خوب']
  if (content.length < 8 || commonWords.some(word => lower.includes(word))) {
    if (!isWorth) {  // Only override if not already important
      isWorth = false
      reason = 'پیام کوتاه یا تعارفی'
    }
  }

  return {
    isWorth,
    reason,
    suggestedCategory: category,
    suggestedImportance: importance,
    extractedInfo: isWorth ? content : null
  }
}

// Category labels
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    personal_info: 'اطلاعات شخصی',
    goals: 'اهداف',
    symptoms: 'علائم',
    relationships: 'روابط',
    other: 'سایر'
  }
  return labels[category] || category
}

// Check status
const checkStatus = () => {
  try {
    const nuxtApp = useNuxtApp()
    const { user } = useUser()
    
    pbStatus.value.connected = !!nuxtApp.$pb
    pbStatus.value.user = !!user.value?.id
  } catch (error) {
    pbStatus.value.connected = false
    pbStatus.value.user = false
  }
}

onMounted(() => {
  checkStatus()
})
</script>