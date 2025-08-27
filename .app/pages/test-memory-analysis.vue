<template>
  <div class="container mx-auto p-6">
    <BaseCard class="mx-auto max-w-4xl" shape="curved">
      <div class="p-6">
        <BaseHeading
          tag="h1"
          size="2xl"
          class="mb-6 text-center"
        >
          آزمایش تحلیل خاطرات
        </BaseHeading>

        <div class="space-y-6">
          <!-- Message Input -->
          <div>
            <BaseTextarea
              v-model="testMessage"
              label="پیام آزمایشی"
              placeholder="پیامی بنویسید تا تحلیل شود..."
              rows="4"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4">
            <BaseButton
              color="primary"
              :loading="isAnalyzing"
              @click="analyzeMessage"
            >
              <Icon name="ph:brain-duotone" class="me-2 size-4" />
              تحلیل پیام
            </BaseButton>

            <BaseButton
              color="success"
              :loading="isSending"
              @click="sendTestMessage"
            >
              <Icon name="ph:paper-plane-duotone" class="me-2 size-4" />
              ارسال با ذخیره خاطره
            </BaseButton>

            <BaseButton
              color="muted"
              @click="clearResults"
            >
              پاک کردن
            </BaseButton>
          </div>

          <!-- Sample Messages -->
          <div>
            <BaseHeading
              tag="h3"
              size="md"
              class="mb-3"
            >
              پیام‌های نمونه:
            </BaseHeading>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <BaseButton
                v-for="sample in sampleMessages"
                :key="sample"
                color="muted"
                size="sm"
                class="h-auto whitespace-normal p-3 text-right"
                @click="testMessage = sample"
              >
                {{ sample }}
              </BaseButton>
            </div>
          </div>

          <!-- Analysis Results -->
          <div v-if="analysisResult" class="mt-8">
            <BaseCard
              shape="rounded"
              class="border-2"
              :class="analysisResult.isWorth ? 'border-success-200 dark:border-success-500/20' : 'border-muted-200 dark:border-muted-500/20'"
            >
              <div class="p-6">
                <div class="mb-4 flex items-center gap-3">
                  <div class="rounded-lg p-2" :class="analysisResult.isWorth ? 'bg-success-100 dark:bg-success-500/20' : 'bg-muted-100 dark:bg-muted-500/20'">
                    <Icon
                      :name="analysisResult.isWorth ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
                      class="size-5"
                      :class="analysisResult.isWorth ? 'text-success-600 dark:text-success-400' : 'text-muted-600 dark:text-muted-400'"
                    />
                  </div>
                  <BaseHeading tag="h3" size="md">
                    {{ analysisResult.isWorth ? 'ارزش ذخیره دارد' : 'ارزش ذخیره ندارد' }}
                  </BaseHeading>
                </div>

                <div class="space-y-4">
                  <div v-if="analysisResult.reason">
                    <BaseText class="text-muted-500 font-medium">
                      دلیل:
                    </BaseText>
                    <BaseText class="mt-1">
                      {{ analysisResult.reason }}
                    </BaseText>
                  </div>

                  <div v-if="analysisResult.isWorth && analysisResult.extractedInfo">
                    <BaseText class="text-muted-500 font-medium">
                      اطلاعات استخراج شده:
                    </BaseText>
                    <BaseText class="mt-1">
                      {{ analysisResult.extractedInfo }}
                    </BaseText>
                  </div>

                  <div v-if="analysisResult.isWorth" class="flex flex-wrap gap-4">
                    <div v-if="analysisResult.suggestedCategory">
                      <BaseText class="text-muted-500 text-xs font-medium">
                        دسته‌بندی:
                      </BaseText>
                      <BaseText class="mt-1 text-sm">
                        {{ getCategoryLabel(analysisResult.suggestedCategory) }}
                      </BaseText>
                    </div>

                    <div v-if="analysisResult.suggestedImportance">
                      <BaseText class="text-muted-500 text-xs font-medium">
                        اهمیت:
                      </BaseText>
                      <BaseText class="mt-1 text-sm">
                        {{ analysisResult.suggestedImportance }}/10
                      </BaseText>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Recent Memories -->
          <div v-if="recentMemories.length > 0" class="mt-8">
            <BaseHeading
              tag="h3"
              size="md"
              class="mb-4"
            >
              خاطرات اخیر:
            </BaseHeading>
            <div class="space-y-3">
              <BaseCard
                v-for="memory in recentMemories"
                :key="memory.id"
                shape="rounded"
                class="border-primary-500 border-l-4 p-4"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <BaseText class="font-medium">
                      {{ memory.content }}
                    </BaseText>
                    <div class="text-muted-500 mt-2 flex items-center gap-4 text-sm">
                      <span>{{ getCategoryLabel(memory.category) }}</span>
                      <span>اهمیت: {{ memory.importance }}/10</span>
                      <span>{{ formatDate(memory.created) }}</span>
                    </div>
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MemoryCategory } from '~/types/memory'

definePageMeta({
  title: 'آزمایش تحلیل خاطرات',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  analyzeMessageWorth,
  sendEnhancedMessage,
} = useEnhancedMessaging()

const { getUserMemories } = useMem0()
const toaster = useToaster()

// State
const testMessage = ref('')
const isAnalyzing = ref(false)
const isSending = ref(false)
const analysisResult = ref<any>(null)
const recentMemories = ref<any[]>([])

// Sample messages for testing
const sampleMessages = [
  'سلام، چطورید؟',
  'نام من علی محمدی است و 28 ساله هستم',
  'هدف من از درمان غلبه بر اضطراب اجتماعی است',
  'وقتی با افراد غریبه صحبت می‌کنم قلبم تند می‌زند',
  'دیشب با مادرم دعوا کردم و خیلی ناراحت شدم',
  'احساس می‌کنم در این هفته پیشرفت خوبی داشته‌ام',
  'متشکرم بابت کمکتون',
  'کارم در شرکت نرم‌افزاری خیلی استرس‌زا است',
  'از کودکی مشکل اعتماد به نفس داشتم',
  'امروز توانستم در جلسه کاری نظرم را بیان کنم',
]

// Methods
const analyzeMessage = async () => {
  if (!testMessage.value.trim()) {
    toaster.show({
      title: 'خطا',
      message: 'لطفاً پیامی بنویسید',
      color: 'danger',
      closable: true,
    })
    return
  }

  isAnalyzing.value = true
  try {
    analysisResult.value = await analyzeMessageWorth(testMessage.value)
  }
  catch (error) {
    console.error('Error analyzing message:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در تحلیل پیام',
      color: 'danger',
      closable: true,
    })
  }
  finally {
    isAnalyzing.value = false
  }
}

const sendTestMessage = async () => {
  if (!testMessage.value.trim()) {
    toaster.show({
      title: 'خطا',
      message: 'لطفاً پیامی بنویسید',
      color: 'danger',
      closable: true,
    })
    return
  }

  isSending.value = true
  try {
    await sendEnhancedMessage(testMessage.value, 'test-session', {
      extractMemories: true,
      injectContext: false,
      showToasts: true,
    })

    // Refresh recent memories
    await fetchRecentMemories()

    // Clear the message
    testMessage.value = ''
    analysisResult.value = null
  }
  catch (error) {
    console.error('Error sending message:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در ارسال پیام',
      color: 'danger',
      closable: true,
    })
  }
  finally {
    isSending.value = false
  }
}

const clearResults = () => {
  testMessage.value = ''
  analysisResult.value = null
}

const fetchRecentMemories = async () => {
  try {
    const result = await getUserMemories(1, 5)
    recentMemories.value = result.items
  }
  catch (error) {
    console.error('Error fetching recent memories:', error)
  }
}

const getCategoryLabel = (category: MemoryCategory) => {
  const labels = {
    personal_info: 'اطلاعات شخصی',
    goals: 'اهداف',
    symptoms: 'علائم',
    triggers: 'محرک‌ها',
    relationships: 'روابط',
    progress: 'پیشرفت',
    preferences: 'تنظیمات',
    therapy_notes: 'یادداشت‌های درمانی',
    important_events: 'رویدادهای مهم',
    other: 'سایر',
  }
  return labels[category] || labels.other
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fa-IR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Initialize
onMounted(() => {
  fetchRecentMemories()
})
</script>

<style scoped>
/* Custom styles */
</style>
