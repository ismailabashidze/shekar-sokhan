<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات پاسخ هوش مصنوعی',
  preview: {
    title: 'تنظیمات پاسخ هوش مصنوعی',
    description: 'تنظیمات سفارشی‌سازی پاسخ‌های هوش مصنوعی',
    categories: ['settings', 'ai'],
    order: 82,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

import { computed, reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'

type EmojiLevel = 'high' | 'medium' | 'low' | 'none'
type Tone = 'formal' | 'neutral' | 'casual'
type Kindness = 'very_kind' | 'kind' | 'neutral' | 'direct'
type LengthPref = 'short' | 'medium' | 'long'
type MultiMsgMode = 'single' | 'multi_short' | 'multi_medium'

type Creativity = '0' | '1' | '2'
type DomainStrictness = 'strict' | 'balanced' | 'loose'
type LanguageStyle = 'professional' | 'casual' | 'friendly'
type Disclaimers = 'always' | 'when_needed' | 'rarely' | 'never'
type Profanity = 'block' | 'soften' | 'warn' | 'allow'
type Formatting = 'none' | 'bullets' | 'numbers' | 'markdown' | 'rich'

// Persist key
const STORAGE_KEY = 'aiResponseSettings.v2'

type AiResponseSettings = {
  multiMsgMode: MultiMsgMode
  lengthPref: LengthPref
  emojiLevel: EmojiLevel
  tone: Tone
  kindness: Kindness

  // Additional 6+ controls
  replySpeedMs: string // simulate/guide streaming speed preference
  creativity: Creativity
  domainStrictness: DomainStrictness
  languageStyle: LanguageStyle
  disclaimers: Disclaimers
  profanity: Profanity
  formatting: Formatting
}

const defaults: AiResponseSettings = {
  multiMsgMode: 'single',
  lengthPref: 'medium',
  emojiLevel: 'medium',
  tone: 'neutral',
  kindness: 'kind',
  replySpeedMs: '350',
  creativity: '1',
  domainStrictness: 'balanced',
  languageStyle: 'professional',
  disclaimers: 'when_needed',
  profanity: 'soften',
  formatting: 'bullets',
}

function loadSettings(): AiResponseSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaults }
    const parsed = JSON.parse(raw)
    return { ...defaults, ...parsed }
  }
  catch {
    return { ...defaults }
  }
}

function saveSettings(s: AiResponseSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

// Reactive state (no Pinia to keep this page self-contained; can be swapped later)
const state = reactive<AiResponseSettings>(loadSettings())

watch(
  () => ({ ...state }),
  val => saveSettings(val),
  { deep: true },
)

const router = useRouter()

// Premium features
const isPremiumUser = ref(false) // This would come from your auth/user store
const showPremiumModal = ref(false)

// Debug modal state changes
watch(showPremiumModal, (newValue, oldValue) => {
  console.log('🔔 showPremiumModal changed:', { from: oldValue, to: newValue })
})

// Define which features require premium
const premiumFeatures = {
  emojiLevel: ['high', 'very_high'], // High emoji and very high emoji require premium
  tone: ['formal', 'casual'], // Formal tone and casual tone require premium  
  lengthPref: ['long', 'short'], // Long and short responses require premium
  multiMsgMode: ['multi_short'], // Short messages require premium
  kindness: ['very_kind'], // Very kind requires premium
  replySpeedMs: ['150'], // Fast speed requires premium
  creativity: ['2'], // Max creativity requires premium
  formatting: ['markdown', 'rich'], // Advanced formatting requires premium
}

function isPremiumFeature(category: keyof typeof premiumFeatures, value: string): boolean {
  return premiumFeatures[category]?.includes(value) ?? false
}

function handlePremiumFeatureClick(category: keyof typeof premiumFeatures, value: string) {
  console.log('🔒 handlePremiumFeatureClick called:', { category, value })
  console.log('🔒 isPremiumFeature result:', isPremiumFeature(category, value))
  console.log('🔒 isPremiumUser:', isPremiumUser.value)
  console.log('🔒 showPremiumModal before:', showPremiumModal.value)
  
  if (isPremiumFeature(category, value) && !isPremiumUser.value) {
    console.log('🔒 Opening premium modal...')
    showPremiumModal.value = true
    console.log('🔒 showPremiumModal after:', showPremiumModal.value)
    return
  }
  console.log('🔒 Not a premium feature or user has premium, setting value')
  // If not premium feature or user has premium, allow selection
  ;(state as any)[category] = value
}

function showPremiumUpgrade() {
  showPremiumModal.value = true
}

const previewSummary = computed(() => {
  const emojiMap: Record<EmojiLevel, string> = {
    high: '😊😊',
    medium: '🙂',
    low: '🙂 (کم)',
    none: '🚫',
  }

  const lengthMap: Record<LengthPref, string> = {
    short: 'کوتاه',
    medium: 'متعادل',
    long: 'بلند'
  }

  const toneMap: Record<Tone, string> = {
    formal: 'رسمی',
    neutral: 'خنثی',
    casual: 'راحت'
  }

  const msgModeMap: Record<MultiMsgMode, string> = {
    single: 'تک پیام',
    multi_short: 'چند پیام کوتاه',
    multi_medium: 'چند پیام متوسط'
  }

  return [
    `حالت: ${msgModeMap[state.multiMsgMode] || 'نامشخص'}`,
    `طول پیام: ${lengthMap[state.lengthPref] || 'نامشخص'}`,
    `ایموجی: ${emojiMap[state.emojiLevel] || '🙂'}`,
    `لحن: ${toneMap[state.tone] || 'معمولی'}`,
    `خلاقیت: ${state.creativity === '0' ? 'قطعی' : state.creativity === '1' ? 'متعادل' : 'بسیار خلاق'}`,
    `قالب‌بندی: ${state.formatting === 'none' ? 'بدون قالب' : state.formatting === 'bullets' ? 'گلوله‌ای' : state.formatting === 'numbers' ? 'شماره‌دار' : state.formatting === 'markdown' ? 'مارک‌داون' : 'غنی'}`,
    `سرعت پاسخ: ${state.replySpeedMs}ms`,
  ].join(' • ')
})

function resetToDefaults() {
  Object.assign(state, { ...defaults })
}

function goBack() {
  router.back()
}

/**
 * Integration hint:
 * Import these settings where you build the AI request.
 * Example:
 * const s = JSON.parse(localStorage.getItem('aiResponseSettings.v1') ?? '{}');
 * apply to your prompt or API payload:
 *  - s.lengthPref, s.multiMsgMode, s.emojiLevel, s.tone, s.kindness, s.creativity (temperature/top_p),
 *    s.domainStrictness (system prompt constraints), s.languageStyle, s.disclaimers, s.profanity, s.formatting, s.replySpeedMs
 */
</script>

<template>
  <div class="min-h-screen bg-muted-50 p-6 dark:bg-muted-900" dir="rtl">
    <div class="mx-auto max-w-5xl space-y-6">
      <!-- Header -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary-600 via-primary-500 to-blue-500 p-8 text-white shadow-xl">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex size-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
              <Icon name="ph:robot-duotone" class="size-8 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold">تنظیمات هوش مصنوعی</h1>
              <p class="mt-1 text-primary-100">شخصی‌سازی پاسخ‌های هوشمند برای تجربه بهتر</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <BaseButton
              color="white"
              variant="outline"
              size="sm"
              @click="goBack"
              class="border-white/30 text-white hover:bg-white/10"
            >
              <Icon name="ph:arrow-right-duotone" class="ml-2 size-4" />
              بازگشت
            </BaseButton>
            <BaseButton
              color="white"
              variant="solid"
              size="sm"
              @click="resetToDefaults"
              class="bg-white/20 text-white hover:bg-white/30"
            >
              <Icon name="ph:arrow-counter-clockwise-duotone" class="ml-2 size-4" />
              بازنشانی
            </BaseButton>
          </div>
        </div>
        <div class="absolute -bottom-6 -left-6 size-32 rounded-full bg-white/5"></div>
        <div class="absolute -top-8 -right-8 size-24 rounded-full bg-white/10"></div>
      </div>

      <!-- Premium Banner -->
      <BaseCard v-if="!isPremiumUser" class="overflow-hidden border-2 border-yellow-200 bg-gradient-to-l from-yellow-50 via-amber-50 to-orange-50 dark:border-yellow-800 dark:from-yellow-950/30 dark:via-amber-950/30 dark:to-orange-950/30" rounded="xl">
        <div class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div class="flex items-center gap-4 flex-1">
            <div class="flex size-14 items-center justify-center rounded-2xl bg-yellow-500 shadow-lg shadow-yellow-500/20">
              <Icon name="ph:crown-duotone" class="size-7 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-yellow-800 dark:text-yellow-200">ویژگی‌های پیشرفته محدودشده</h3>
              <p class="text-sm text-yellow-600 dark:text-yellow-300 mt-1">برای دسترسی به تمام قابلیت‌های هوش مصنوعی، به نسخه پرمیوم ارتقا دهید</p>
              <div class="flex items-center gap-4 mt-3 text-xs text-yellow-600 dark:text-yellow-300">
                <div class="flex items-center gap-1">
                  <Icon name="ph:lock-duotone" class="size-3" />
                  سبک‌های خاص
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="ph:lock-duotone" class="size-3" />
                  قالب‌بندی پیشرفته
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="ph:lock-duotone" class="size-3" />
                  حداکثر خلاقیت
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <BaseButton
              color="muted"
              size="sm"
              @click="() => {}"
              class="text-xs"
            >
              بعداً
            </BaseButton>
            <BaseButton
              @click="showPremiumUpgrade"
              class="bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300"
              size="sm"
            >
              <Icon name="ph:crown-duotone" class="ml-2 size-4" />
              ارتقا به پرمیوم
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Enhanced Preview Card -->
      <BaseCard class="overflow-hidden p-0" rounded="xl">
        <div class="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div class="mb-4 flex items-center gap-3">
            <div class="rounded-xl bg-emerald-500 p-3 shadow-lg shadow-emerald-500/20">
              <Icon name="ph:sparkle-duotone" class="size-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-emerald-800 dark:text-emerald-200">پیش‌نمایش شخصیت هوش مصنوعی</h2>
              <p class="text-sm text-emerald-600 dark:text-emerald-300">تنظیمات فعال شما</p>
            </div>
          </div>
        </div>
        <div class="space-y-3 p-6">
          <div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
            <div class="flex items-center gap-2">
              <Icon name="ph:chat-circle-duotone" class="size-4 text-primary-500" />
              <span class="font-medium">{{ state.multiMsgMode === 'multi_short' ? 'چند پیام کوتاه' : 'تک پیام کامل' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:text-align-right-duotone" class="size-4 text-success-500" />
              <span class="font-medium">{{ state.lengthPref === 'very_short' ? 'فوق‌العاده کوتاه' : state.lengthPref === 'short' ? 'کوتاه' : 'تفصیلی' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:palette-duotone" class="size-4 text-yellow-500" />
              <span class="font-medium">{{ state.emojiLevel === 'very_high' ? '🤩 پر از ایموجی' : state.emojiLevel === 'high' ? '😊 ایموجی زیاد' : state.emojiLevel === 'medium' ? '🙂 متعادل' : state.emojiLevel === 'low' ? '😐 کم' : '🚫 بدون ایموجی' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:graduation-cap-duotone" class="size-4 text-info-500" />
              <span class="font-medium">{{ state.tone === 'formal' ? 'رسمی و حرفه‌ای' : 'دوستانه و صمیمی' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:heart-duotone" class="size-4 text-pink-500" />
              <span class="font-medium">{{ state.kindness === 'very_kind' ? 'فوق‌العاده مهربان' : state.kindness === 'kind' ? 'مهربان' : 'خنک و مستقیم' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:lightning-duotone" class="size-4 text-orange-500" />
              <span class="font-medium">{{ state.creativity === '0' ? 'دقیق و قطعی' : state.creativity === '1' ? 'متعادل' : 'خلاق و نوآور' }}</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Settings Form Groups -->
      <div class="space-y-8">
        <!-- Message Mode Group -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="rounded-xl bg-gradient-to-br from-primary-500 to-blue-500 p-3 shadow-lg shadow-primary-500/20">
                <Icon name="ph:chat-circle-dots-duotone" class="size-6 text-white" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-muted-900 dark:text-white">نحوه ارائه پاسخ</h2>
                <p class="text-sm text-muted-500 dark:text-muted-400">انتخاب شیوه نمایش پاسخ‌های هوش مصنوعی</p>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BaseRadioHeadless
                v-model="state.multiMsgMode"
                value="single"
                name="multiMsgMode"
              >
                <BaseCard class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 peer-checked:shadow-lg peer-checked:shadow-primary-500/10 dark:peer-checked:bg-primary-950/20">
                  <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-primary-500 peer-checked:bg-primary-500 dark:border-primary-700 dark:bg-primary-900">
                    <Icon name="ph:check-bold" class="h-4 w-4 text-primary-600 peer-checked:text-white" />
                  </div>
                  <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 mx-auto transition-colors group-hover:bg-primary-200 peer-checked:bg-primary-500 dark:bg-primary-900 dark:group-hover:bg-primary-800 dark:peer-checked:bg-primary-600">
                    <Icon name="ph:note-duotone" class="size-8 text-primary-600 peer-checked:text-white dark:text-primary-400" />
                  </div>
                  <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                    پیام یکپارچه
                  </BaseHeading>
                  <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                    دریافت پاسخ کامل و جامع در یک پیام واحد برای خوانایی بهتر
                  </BaseText>
                </BaseCard>
              </BaseRadioHeadless>
              <div 
                @click="console.log('🖱️ Card clicked: multiMsgMode multi_short', { isPremium: isPremiumFeature('multiMsgMode', 'multi_short'), isPremiumUser: isPremiumUser, condition: isPremiumFeature('multiMsgMode', 'multi_short') && !isPremiumUser }); isPremiumFeature('multiMsgMode', 'multi_short') && !isPremiumUser ? handlePremiumFeatureClick('multiMsgMode', 'multi_short') : undefined"
                class="cursor-pointer"
              >
                <BaseRadioHeadless
                  v-model="state.multiMsgMode"
                  value="multi_short"
                  name="multiMsgMode"
                  :disabled="isPremiumFeature('multiMsgMode', 'multi_short') && !isPremiumUser"
                >
                  <BaseCard 
                    class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-600 peer-checked:shadow-lg peer-checked:shadow-primary-500/10 dark:peer-checked:bg-primary-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                  >
                  <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-primary-500 peer-checked:bg-primary-500 dark:border-primary-700 dark:bg-primary-900">
                    <Icon name="ph:check-bold" class="h-4 w-4 text-primary-600 peer-checked:text-white" />
                  </div>
                  <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 mx-auto transition-colors group-hover:bg-primary-200 peer-checked:bg-primary-500 dark:bg-primary-900 dark:group-hover:bg-primary-800 dark:peer-checked:bg-primary-600">
                    <Icon name="ph:chat-circle-dots-duotone" class="size-8 text-primary-600 peer-checked:text-white dark:text-primary-400" />
                  </div>
                  <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                    <div class="flex items-center justify-center gap-2">
                      پیام‌های کوتاه
                      <Icon 
                        v-if="isPremiumFeature('multiMsgMode', 'multi_short') && !isPremiumUser" 
                        name="ph:lock-duotone" 
                        class="size-4 text-yellow-500" 
                      />
                    </div>
                  </BaseHeading>
                  <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                    تقسیم پاسخ‌ها به بخش‌های کوچک برای هضم آسان‌تر اطلاعات
                  </BaseText>
                </BaseCard>
                </BaseRadioHeadless>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Length Group -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-gradient-to-br from-success-500 to-emerald-500 p-3 shadow-lg shadow-success-500/20">
              <Icon name="ph:text-aa-duotone" class="size-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-muted-900 dark:text-white">حجم محتوای پاسخ</h2>
              <p class="text-sm text-muted-500 dark:text-muted-400">انتخاب میزان تفصیل و طول پاسخ‌های هوش مصنوعی</p>
            </div>
          </div>
          <!-- Primary Length Options -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <div 
              @click="isPremiumFeature('lengthPref', 'short') && !isPremiumUser ? handlePremiumFeatureClick('lengthPref', 'short') : undefined"
              class="cursor-pointer"
            >
              <BaseRadioHeadless
                v-model="state.lengthPref"
                value="short"
                name="lengthPref"
                :disabled="isPremiumFeature('lengthPref', 'short') && !isPremiumUser"
              >
                <BaseCard 
                  class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-success-500 peer-checked:bg-success-50 peer-checked:text-success-600 peer-checked:shadow-lg peer-checked:shadow-success-500/10 dark:peer-checked:bg-success-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                >
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-success-200 bg-success-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-success-500 peer-checked:bg-success-500 dark:border-success-700 dark:bg-success-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-success-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 mx-auto transition-colors group-hover:bg-success-200 peer-checked:bg-success-500 dark:bg-success-900 dark:group-hover:bg-success-800 dark:peer-checked:bg-success-600">
                  <Icon name="ph:minus-duotone" class="size-8 text-success-600 peer-checked:text-white dark:text-success-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  <div class="flex items-center justify-center gap-2">
                    کوتاه
                    <Icon 
                      v-if="isPremiumFeature('lengthPref', 'short') && !isPremiumUser" 
                      name="ph:lock-duotone" 
                      class="size-4 text-yellow-500" 
                    />
                  </div>
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  پاسخ‌های مختصر و اساسی
                </BaseText>
              </BaseCard>
              </BaseRadioHeadless>
            </div>
            <BaseRadioHeadless
              v-model="state.lengthPref"
              value="medium"
              name="lengthPref"
            >
              <BaseCard class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-success-500 peer-checked:bg-success-50 peer-checked:text-success-600 peer-checked:shadow-lg peer-checked:shadow-success-500/10 dark:peer-checked:bg-success-950/20">
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-success-200 bg-success-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-success-500 peer-checked:bg-success-500 dark:border-success-700 dark:bg-success-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-success-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 mx-auto transition-colors group-hover:bg-success-200 peer-checked:bg-success-500 dark:bg-success-900 dark:group-hover:bg-success-800 dark:peer-checked:bg-success-600">
                  <Icon name="ph:chat-text-duotone" class="size-8 text-success-600 peer-checked:text-white dark:text-success-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  متعادل
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  پاسخ‌های متعادل و مناسب
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
            <BaseRadioHeadless
              v-model="state.lengthPref"
              value="long"
              name="lengthPref"
              :disabled="isPremiumFeature('lengthPref', 'long') && !isPremiumUser"
            >
              <BaseCard 
                class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-success-500 peer-checked:bg-success-50 peer-checked:text-success-600 peer-checked:shadow-lg peer-checked:shadow-success-500/10 dark:peer-checked:bg-success-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                :class="{ 'cursor-pointer': !(isPremiumFeature('lengthPref', 'long') && !isPremiumUser) }"
                @click="isPremiumFeature('lengthPref', 'long') && !isPremiumUser ? handlePremiumFeatureClick('lengthPref', 'long') : undefined"
              >
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-success-200 bg-success-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-success-500 peer-checked:bg-success-500 dark:border-success-700 dark:bg-success-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-success-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 mx-auto transition-colors group-hover:bg-success-200 peer-checked:bg-success-500 dark:bg-success-900 dark:group-hover:bg-success-800 dark:peer-checked:bg-success-600">
                  <Icon name="ph:book-duotone" class="size-8 text-success-600 peer-checked:text-white dark:text-success-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  <div class="flex items-center justify-center gap-2">
                    بلند
                    <Icon 
                      v-if="isPremiumFeature('lengthPref', 'long') && !isPremiumUser" 
                      name="ph:lock-duotone" 
                      class="size-4 text-yellow-500" 
                    />
                  </div>
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  پاسخ‌های تفصیلی و کامل
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
          </div>
          
        </div>

        <!-- Tone Group -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-gradient-to-br from-info-500 to-cyan-500 p-3 shadow-lg shadow-info-500/20">
              <Icon name="ph:mask-happy-duotone" class="size-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-muted-900 dark:text-white">سبک برقراری ارتباط</h2>
              <p class="text-sm text-muted-500 dark:text-muted-400">انتخاب نحوه صحبت و لحن هوش مصنوعی</p>
            </div>
          </div>
          <!-- Primary Tone Options -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <BaseRadioHeadless
              v-model="state.tone"
              value="formal"
              name="tone"
              :disabled="isPremiumFeature('tone', 'formal') && !isPremiumUser"
            >
              <BaseCard 
                class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-info-500 peer-checked:bg-info-50 peer-checked:text-info-600 peer-checked:shadow-lg peer-checked:shadow-info-500/10 dark:peer-checked:bg-info-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                :class="{ 'cursor-pointer': !(isPremiumFeature('tone', 'formal') && !isPremiumUser) }"
                @click="isPremiumFeature('tone', 'formal') && !isPremiumUser ? handlePremiumFeatureClick('tone', 'formal') : undefined"
              >
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-info-200 bg-info-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-info-500 peer-checked:bg-info-500 dark:border-info-700 dark:bg-info-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-info-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-info-100 mx-auto transition-colors group-hover:bg-info-200 peer-checked:bg-info-500 dark:bg-info-900 dark:group-hover:bg-info-800 dark:peer-checked:bg-info-600">
                  <Icon name="ph:crown-duotone" class="size-8 text-info-600 peer-checked:text-white dark:text-info-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  <div class="flex items-center justify-center gap-2">
                    رسمی و حرفه‌ای
                    <Icon 
                      v-if="isPremiumFeature('tone', 'formal') && !isPremiumUser" 
                      name="ph:lock-duotone" 
                      class="size-4 text-yellow-500" 
                    />
                  </div>
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  زبان رسمی و معیاری
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
            <BaseRadioHeadless
              v-model="state.tone"
              value="neutral"
              name="tone"
            >
              <BaseCard class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-info-500 peer-checked:bg-info-50 peer-checked:text-info-600 peer-checked:shadow-lg peer-checked:shadow-info-500/10 dark:peer-checked:bg-info-950/20">
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-info-200 bg-info-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-info-500 peer-checked:bg-info-500 dark:border-info-700 dark:bg-info-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-info-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-info-100 mx-auto transition-colors group-hover:bg-info-200 peer-checked:bg-info-500 dark:bg-info-900 dark:group-hover:bg-info-800 dark:peer-checked:bg-info-600">
                  <Icon name="ph:equals-duotone" class="size-8 text-info-600 peer-checked:text-white dark:text-info-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  خنثی و متعادل
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  زبان متعادل و مناسب
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
            <BaseRadioHeadless
              v-model="state.tone"
              value="casual"
              name="tone"
              :disabled="isPremiumFeature('tone', 'casual') && !isPremiumUser"
            >
              <BaseCard 
                class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-info-500 peer-checked:bg-info-50 peer-checked:text-info-600 peer-checked:shadow-lg peer-checked:shadow-info-500/10 dark:peer-checked:bg-info-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                :class="{ 'cursor-pointer': !(isPremiumFeature('tone', 'casual') && !isPremiumUser) }"
                @click="isPremiumFeature('tone', 'casual') && !isPremiumUser ? handlePremiumFeatureClick('tone', 'casual') : undefined"
              >
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-info-200 bg-info-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-info-500 peer-checked:bg-info-500 dark:border-info-700 dark:bg-info-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-info-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-info-100 mx-auto transition-colors group-hover:bg-info-200 peer-checked:bg-info-500 dark:bg-info-900 dark:group-hover:bg-info-800 dark:peer-checked:bg-info-600">
                  <Icon name="ph:smiley-wink-duotone" class="size-8 text-info-600 peer-checked:text-white dark:text-info-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  <div class="flex items-center justify-center gap-2">
                    راحت و دوستانه
                    <Icon 
                      v-if="isPremiumFeature('tone', 'casual') && !isPremiumUser" 
                      name="ph:lock-duotone" 
                      class="size-4 text-yellow-500" 
                    />
                  </div>
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  زبان صمیمی و غیررسمی
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
          </div>

        </div>

        <!-- Kindness Group -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 p-3 shadow-lg shadow-pink-500/20">
              <Icon name="ph:heart-straight-duotone" class="size-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-muted-900 dark:text-white">نحوه ابراز احساسات</h2>
              <p class="text-sm text-muted-500 dark:text-muted-400">میزان مهربانی و دلگرمی در پاسخ‌های هوش مصنوعی</p>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <BaseRadioHeadless
              v-model="state.kindness"
              value="very_kind"
              name="kindness"
              :disabled="isPremiumFeature('kindness', 'very_kind') && !isPremiumUser"
            >
              <BaseCard 
                class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-pink-500 peer-checked:bg-pink-50 peer-checked:text-pink-600 peer-checked:shadow-lg peer-checked:shadow-pink-500/10 dark:peer-checked:bg-pink-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                :class="{ 'cursor-pointer': !(isPremiumFeature('kindness', 'very_kind') && !isPremiumUser) }"
                @click="isPremiumFeature('kindness', 'very_kind') && !isPremiumUser ? handlePremiumFeatureClick('kindness', 'very_kind') : undefined"
              >
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-200 bg-pink-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-pink-500 peer-checked:bg-pink-500 dark:border-pink-700 dark:bg-pink-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-pink-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 mx-auto transition-colors group-hover:bg-pink-200 peer-checked:bg-pink-500 dark:bg-pink-900 dark:group-hover:bg-pink-800 dark:peer-checked:bg-pink-600">
                  <Icon name="ph:heart-duotone" class="size-8 text-pink-600 peer-checked:text-white dark:text-pink-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  <div class="flex items-center justify-center gap-2">
                    فوق‌العاده مهربان
                    <Icon 
                      v-if="isPremiumFeature('kindness', 'very_kind') && !isPremiumUser" 
                      name="ph:lock-duotone" 
                      class="size-4 text-yellow-500" 
                    />
                  </div>
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  ابراز حداکثر مهربانی، دلسوزی و حمایت عاطفی
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
            <BaseRadioHeadless
              v-model="state.kindness"
              value="kind"
              name="kindness"
            >
              <BaseCard class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-pink-500 peer-checked:bg-pink-50 peer-checked:text-pink-600 peer-checked:shadow-lg peer-checked:shadow-pink-500/10 dark:peer-checked:bg-pink-950/20">
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-200 bg-pink-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-pink-500 peer-checked:bg-pink-500 dark:border-pink-700 dark:bg-pink-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-pink-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 mx-auto transition-colors group-hover:bg-pink-200 peer-checked:bg-pink-500 dark:bg-pink-900 dark:group-hover:bg-pink-800 dark:peer-checked:bg-pink-600">
                  <Icon name="ph:smiley-duotone" class="size-8 text-pink-600 peer-checked:text-white dark:text-pink-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  مهربان و دلسوز
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  مهربانی متعادل با حفظ حد و مرز مناسب
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
            <BaseRadioHeadless
              v-model="state.kindness"
              value="not_kind"
              name="kindness"
            >
              <BaseCard class="group relative p-6 text-center transition-all duration-300 hover:shadow-lg peer-checked:!border-slate-500 peer-checked:bg-slate-50 peer-checked:text-slate-600 peer-checked:shadow-lg peer-checked:shadow-slate-500/10 dark:peer-checked:bg-slate-950/20">
                <div class="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50 opacity-0 transition-all duration-300 peer-checked:opacity-100 peer-checked:border-slate-500 peer-checked:bg-slate-500 dark:border-slate-700 dark:bg-slate-900">
                  <Icon name="ph:check-bold" class="h-4 w-4 text-slate-600 peer-checked:text-white" />
                </div>
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mx-auto transition-colors group-hover:bg-slate-200 peer-checked:bg-slate-500 dark:bg-slate-900 dark:group-hover:bg-slate-800 dark:peer-checked:bg-slate-600">
                  <Icon name="ph:robot-duotone" class="size-8 text-slate-600 peer-checked:text-white dark:text-slate-400" />
                </div>
                <BaseHeading as="h4" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                  مستقیم و فنی
                </BaseHeading>
                <BaseText size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
                  پاسخ‌های دقیق، مستقیم و بدون پردازش عاطفی
                </BaseText>
              </BaseCard>
            </BaseRadioHeadless>
          </div>
        </div>

        <!-- Emoji Usage -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 p-3 shadow-lg shadow-yellow-500/20">
              <Icon name="ph:smiley-wink-duotone" class="size-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-muted-900 dark:text-white">سطح احساساتی پاسخ‌ها</h2>
              <p class="text-sm text-muted-500 dark:text-muted-400">میزان استفاده از ایموجی و عبارات احساساتی</p>
            </div>
          </div>
          <BaseCard class="overflow-hidden p-0" rounded="xl">
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 dark:from-yellow-950/30 dark:to-orange-950/30">
              <div class="grid grid-cols-5 gap-2">
                <BaseRadioHeadless
                  v-model="state.emojiLevel"
                  value="none"
                  name="emojiLevel"
                >
                  <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-gray-500 peer-checked:bg-gray-50 peer-checked:shadow-md dark:peer-checked:bg-gray-950/20">
                    <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                      <Icon name="lucide:check" class="h-2 w-2 text-current" />
                    </div>
                    <div class="mb-2 text-2xl">😐</div>
                    <div class="space-y-1">
                      <BaseText size="xs" class="font-medium block">رسمی</BaseText>
                      <BaseText size="xs" class="text-muted-500 block">بدون ایموجی</BaseText>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>
                <BaseRadioHeadless
                  v-model="state.emojiLevel"
                  value="low"
                  name="emojiLevel"
                >
                  <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md dark:peer-checked:bg-blue-950/20">
                    <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                      <Icon name="lucide:check" class="h-2 w-2 text-current" />
                    </div>
                    <div class="mb-2 text-2xl">🙂</div>
                    <div class="space-y-1">
                      <BaseText size="xs" class="font-medium block">محدود</BaseText>
                      <BaseText size="xs" class="text-muted-500 block">کم</BaseText>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>
                <BaseRadioHeadless
                  v-model="state.emojiLevel"
                  value="medium"
                  name="emojiLevel"
                >
                  <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-green-500 peer-checked:bg-green-50 peer-checked:shadow-md dark:peer-checked:bg-green-950/20">
                    <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                      <Icon name="lucide:check" class="h-2 w-2 text-current" />
                    </div>
                    <div class="mb-2 text-2xl">😊</div>
                    <div class="space-y-1">
                      <BaseText size="xs" class="font-medium block">متعادل</BaseText>
                      <BaseText size="xs" class="text-muted-500 block">مناسب</BaseText>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>
                <div 
                  @click="isPremiumFeature('emojiLevel', 'high') && !isPremiumUser ? handlePremiumFeatureClick('emojiLevel', 'high') : (state.emojiLevel = 'high')"
                  class="relative"
                >
                <BaseRadioHeadless
                  v-model="state.emojiLevel"
                  value="high"
                  name="emojiLevel"
                  :disabled="isPremiumFeature('emojiLevel', 'high') && !isPremiumUser"
                >
                  <BaseCard 
                    class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-yellow-500 peer-checked:bg-yellow-50 peer-checked:shadow-md dark:peer-checked:bg-yellow-950/20 cursor-pointer"
                    :class="{ 
                      'opacity-60': isPremiumFeature('emojiLevel', 'high') && !isPremiumUser
                    }"
                  >
                    <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                      <Icon name="lucide:check" class="h-2 w-2 text-current" />
                    </div>
                    <div class="mb-2 text-2xl">😄</div>
                    <div class="space-y-1">
                      <div class="flex items-center justify-center gap-1">
                        <BaseText size="xs" class="font-medium block">زیاد</BaseText>
                        <Icon 
                          v-if="isPremiumFeature('emojiLevel', 'high') && !isPremiumUser" 
                          name="ph:lock-duotone" 
                          class="size-3 text-yellow-500" 
                        />
                      </div>
                      <BaseText size="xs" class="text-muted-500 block">پرانرژی</BaseText>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>
                </div>
                <BaseRadioHeadless
                  v-model="state.emojiLevel"
                  value="very_high"
                  name="emojiLevel"
                  :disabled="isPremiumFeature('emojiLevel', 'very_high') && !isPremiumUser"
                >
                  <BaseCard 
                    class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-pink-500 peer-checked:bg-pink-50 peer-checked:shadow-md dark:peer-checked:bg-pink-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                    :class="{ 'cursor-pointer': !(isPremiumFeature('emojiLevel', 'very_high') && !isPremiumUser) }"
                    @click="isPremiumFeature('emojiLevel', 'very_high') && !isPremiumUser ? handlePremiumFeatureClick('emojiLevel', 'very_high') : undefined"
                  >
                    <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                      <Icon name="lucide:check" class="h-2 w-2 text-current" />
                    </div>
                    <div class="mb-2 text-2xl">🤩</div>
                    <div class="space-y-1">
                      <div class="flex items-center justify-center gap-1">
                        <BaseText size="xs" class="font-medium block">فوق‌العاده</BaseText>
                        <Icon 
                          v-if="isPremiumFeature('emojiLevel', 'very_high') && !isPremiumUser" 
                          name="ph:lock-duotone" 
                          class="size-3 text-yellow-500" 
                        />
                      </div>
                      <BaseText size="xs" class="text-muted-500 block">پر از نشاط</BaseText>
                    </div>
                  </BaseCard>
                </BaseRadioHeadless>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Advanced Settings -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 p-3 shadow-lg shadow-purple-500/20">
              <Icon name="ph:gear-duotone" class="size-6 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-muted-900 dark:text-white">تنظیمات پیشرفته</h2>
              <p class="text-sm text-muted-500 dark:text-muted-400">کنترل دقیق رفتار و شخصیت هوش مصنوعی</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Creativity Slider -->
            <BaseCard class="group overflow-hidden p-0 transition-all duration-300 hover:shadow-lg" rounded="xl">
              <div class="bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-6 dark:from-orange-950/20 dark:via-yellow-950/20 dark:to-amber-950/20">
                <div class="mb-6 flex items-center gap-4">
                  <div class="rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 p-3 shadow-lg shadow-orange-500/20">
                    <Icon name="ph:lightbulb-duotone" class="size-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-muted-900 dark:text-white">میزان خلاقیت</h3>
                    <p class="text-sm text-muted-600 dark:text-muted-400">سطح نوآوری و تنوع در پاسخ‌ها</p>
                  </div>
                </div>
                <div class="space-y-6">
                  <!-- Creative Radio Cards -->
                  <div class="grid grid-cols-3 gap-2">
                    <BaseRadioHeadless
                      v-model="state.creativity"
                      value="0"
                      name="creativity"
                    >
                      <BaseCard class="group relative p-3 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-orange-500 peer-checked:bg-orange-50 peer-checked:shadow-md dark:peer-checked:bg-orange-950/20">
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-xl">🤖</div>
                        <div class="space-y-1">
                          <BaseText size="xs" class="font-medium block">دقیق</BaseText>
                          <BaseText size="xs" class="text-muted-500 block">قطعی</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                    <BaseRadioHeadless
                      v-model="state.creativity"
                      value="1"
                      name="creativity"
                    >
                      <BaseCard class="group relative p-3 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-orange-500 peer-checked:bg-orange-50 peer-checked:shadow-md dark:peer-checked:bg-orange-950/20">
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-xl">⚖️</div>
                        <div class="space-y-1">
                          <BaseText size="xs" class="font-medium block">متعادل</BaseText>
                          <BaseText size="xs" class="text-muted-500 block">تعادل</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                    <BaseRadioHeadless
                      v-model="state.creativity"
                      value="2"
                      name="creativity"
                      :disabled="isPremiumFeature('creativity', '2') && !isPremiumUser"
                    >
                      <BaseCard 
                        class="group relative p-3 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-orange-500 peer-checked:bg-orange-50 peer-checked:shadow-md dark:peer-checked:bg-orange-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                        :class="{ 'cursor-pointer': !(isPremiumFeature('creativity', '2') && !isPremiumUser) }"
                        @click="isPremiumFeature('creativity', '2') && !isPremiumUser ? handlePremiumFeatureClick('creativity', '2') : undefined"
                      >
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-xl">✨</div>
                        <div class="space-y-1">
                          <div class="flex items-center justify-center gap-1">
                            <BaseText size="xs" class="font-medium block">خلاق</BaseText>
                            <Icon 
                              v-if="isPremiumFeature('creativity', '2') && !isPremiumUser" 
                              name="ph:lock-duotone" 
                              class="size-3 text-yellow-500" 
                            />
                          </div>
                          <BaseText size="xs" class="text-muted-500 block">نوآور</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                  </div>
                  <div class="rounded-xl bg-white/80 p-4 text-center shadow-sm dark:bg-muted-900/50">
                    <span class="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
                      <Icon name="ph:star-duotone" class="size-4" />
                      {{ state.creativity === '0' ? 'پاسخ‌های دقیق و قابل پیش‌بینی' : state.creativity === '1' ? 'تعادل بین دقت و خلاقیت' : 'پاسخ‌های نوآورانه و متنوع' }}
                    </span>
                  </div>
                </div>
              </div>
            </BaseCard>

            <!-- Reply Speed -->
            <BaseCard class="group overflow-hidden p-0 transition-all duration-300 hover:shadow-lg" rounded="xl">
              <div class="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
                <div class="mb-6 flex items-center gap-4">
                  <div class="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 shadow-lg shadow-emerald-500/20">
                    <Icon name="ph:timer-duotone" class="size-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-muted-900 dark:text-white">سرعت پردازش</h3>
                    <p class="text-sm text-muted-600 dark:text-muted-400">زمان تأخیر بین ارسال پاسخ‌ها</p>
                  </div>
                </div>
                <div class="space-y-6">
                  <!-- Speed Radio Cards -->
                  <div class="grid grid-cols-3 gap-2">
                    <BaseRadioHeadless
                      v-model="state.replySpeedMs"
                      value="150"
                      name="replySpeed"
                      :disabled="isPremiumFeature('replySpeedMs', '150') && !isPremiumUser"
                    >
                      <BaseCard 
                        class="group relative p-3 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-emerald-500 peer-checked:bg-emerald-50 peer-checked:shadow-md dark:peer-checked:bg-emerald-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                        :class="{ 'cursor-pointer': !(isPremiumFeature('replySpeedMs', '150') && !isPremiumUser) }"
                        @click="isPremiumFeature('replySpeedMs', '150') && !isPremiumUser ? handlePremiumFeatureClick('replySpeedMs', '150') : undefined"
                      >
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-xl">⚡</div>
                        <div class="space-y-1">
                          <div class="flex items-center justify-center gap-1">
                            <BaseText size="xs" class="font-medium block">فوری</BaseText>
                            <Icon 
                              v-if="isPremiumFeature('replySpeedMs', '150') && !isPremiumUser" 
                              name="ph:lock-duotone" 
                              class="size-3 text-yellow-500" 
                            />
                          </div>
                          <BaseText size="xs" class="text-muted-500 block">150ms</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                    <BaseRadioHeadless
                      v-model="state.replySpeedMs"
                      value="350"
                      name="replySpeed"
                    >
                      <BaseCard class="group relative p-3 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-emerald-500 peer-checked:bg-emerald-50 peer-checked:shadow-md dark:peer-checked:bg-emerald-950/20">
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-xl">🕐</div>
                        <div class="space-y-1">
                          <BaseText size="xs" class="font-medium block">متوسط</BaseText>
                          <BaseText size="xs" class="text-muted-500 block">350ms</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                    <BaseRadioHeadless
                      v-model="state.replySpeedMs"
                      value="750"
                      name="replySpeed"
                    >
                      <BaseCard class="group relative p-3 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-emerald-500 peer-checked:bg-emerald-50 peer-checked:shadow-md dark:peer-checked:bg-emerald-950/20">
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-xl">🐌</div>
                        <div class="space-y-1">
                          <BaseText size="xs" class="font-medium block">آرام</BaseText>
                          <BaseText size="xs" class="text-muted-500 block">750ms</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                  </div>
                  <div class="rounded-xl bg-white/80 p-4 text-center shadow-sm dark:bg-muted-900/50">
                    <span class="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
                      <Icon name="ph:clock-duotone" class="size-4" />
                      {{ state.replySpeedMs }}ms - {{ Number(state.replySpeedMs) < 300 ? 'پاسخ فوری' : Number(state.replySpeedMs) < 600 ? 'پاسخ با سرعت متوسط' : 'پاسخ آرام و متفکرانه' }}
                    </span>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Additional Settings -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Language Style & Content Control -->
          <div class="space-y-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold text-muted-900 dark:text-white">
              <Icon name="ph:chat-centered-duotone" class="size-5" />
              سبک زبان و محتوا
            </h3>

            <BaseCard class="space-y-4 p-4">
              <div>
                <label class="mb-3 block text-sm font-medium text-muted-700 dark:text-muted-300">سبک زبان</label>
                <div class="grid grid-cols-3 gap-3">
                  <BaseRadioHeadless
                    v-model="state.languageStyle"
                    value="plain"
                    name="languageStyle"
                  >
                    <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md dark:peer-checked:bg-blue-950/20">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <div class="mb-2 text-lg">📝</div>
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">ساده</BaseText>
                        <BaseText size="xs" class="text-muted-500 block">روزمره</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.languageStyle"
                    value="professional"
                    name="languageStyle"
                  >
                    <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md dark:peer-checked:bg-blue-950/20">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <div class="mb-2 text-lg">💼</div>
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">حرفه‌ای</BaseText>
                        <BaseText size="xs" class="text-muted-500 block">تخصصی</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.languageStyle"
                    value="friendly"
                    name="languageStyle"
                  >
                    <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md dark:peer-checked:bg-blue-950/20">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <div class="mb-2 text-lg">😊</div>
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">دوستانه</BaseText>
                        <BaseText size="xs" class="text-muted-500 block">صمیمی</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>

              <div>
                <label class="mb-3 block text-sm font-medium text-muted-700 dark:text-muted-300">قالب‌بندی پاسخ</label>
                <div class="space-y-2">
                  <div class="grid grid-cols-3 gap-2">
                    <BaseRadioHeadless
                      v-model="state.formatting"
                      value="none"
                      name="formatting"
                    >
                      <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-indigo-500 peer-checked:bg-indigo-50 peer-checked:shadow-md dark:peer-checked:bg-indigo-950/20">
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-lg">📄</div>
                        <div class="space-y-1">
                          <BaseText size="xs" class="font-medium block">ساده</BaseText>
                          <BaseText size="xs" class="text-muted-500 block">بدون قالب</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                    <BaseRadioHeadless
                      v-model="state.formatting"
                      value="bullets"
                      name="formatting"
                    >
                      <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-indigo-500 peer-checked:bg-indigo-50 peer-checked:shadow-md dark:peer-checked:bg-indigo-950/20">
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-lg">•</div>
                        <div class="space-y-1">
                          <BaseText size="xs" class="font-medium block">فهرست</BaseText>
                          <BaseText size="xs" class="text-muted-500 block">گلوله‌ای</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                    <BaseRadioHeadless
                      v-model="state.formatting"
                      value="numbers"
                      name="formatting"
                    >
                      <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-indigo-500 peer-checked:bg-indigo-50 peer-checked:shadow-md dark:peer-checked:bg-indigo-950/20">
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-lg">1.</div>
                        <div class="space-y-1">
                          <BaseText size="xs" class="font-medium block">فهرست عددی</BaseText>
                          <BaseText size="xs" class="text-muted-500 block">شماره‌دار</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <BaseRadioHeadless
                      v-model="state.formatting"
                      value="markdown"
                      name="formatting"
                      :disabled="isPremiumFeature('formatting', 'markdown') && !isPremiumUser"
                    >
                      <BaseCard 
                        class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-indigo-500 peer-checked:bg-indigo-50 peer-checked:shadow-md dark:peer-checked:bg-indigo-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                        :class="{ 'cursor-pointer': !(isPremiumFeature('formatting', 'markdown') && !isPremiumUser) }"
                        @click="isPremiumFeature('formatting', 'markdown') && !isPremiumUser ? handlePremiumFeatureClick('formatting', 'markdown') : undefined"
                      >
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-lg"># **</div>
                        <div class="space-y-1">
                          <div class="flex items-center justify-center gap-1">
                            <BaseText size="xs" class="font-medium block">مارک‌داون</BaseText>
                            <Icon 
                              v-if="isPremiumFeature('formatting', 'markdown') && !isPremiumUser" 
                              name="ph:lock-duotone" 
                              class="size-3 text-yellow-500" 
                            />
                          </div>
                          <BaseText size="xs" class="text-muted-500 block">پیشرفته</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                    <BaseRadioHeadless
                      v-model="state.formatting"
                      value="rich"
                      name="formatting"
                      :disabled="isPremiumFeature('formatting', 'rich') && !isPremiumUser"
                    >
                      <BaseCard 
                        class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-indigo-500 peer-checked:bg-indigo-50 peer-checked:shadow-md dark:peer-checked:bg-indigo-950/20 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed"
                        :class="{ 'cursor-pointer': !(isPremiumFeature('formatting', 'rich') && !isPremiumUser) }"
                        @click="isPremiumFeature('formatting', 'rich') && !isPremiumUser ? handlePremiumFeatureClick('formatting', 'rich') : undefined"
                      >
                        <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                          <Icon name="lucide:check" class="h-2 w-2 text-current" />
                        </div>
                        <div class="mb-2 text-lg">✨</div>
                        <div class="space-y-1">
                          <div class="flex items-center justify-center gap-1">
                            <BaseText size="xs" class="font-medium block">غنی‌سازی کامل</BaseText>
                            <Icon 
                              v-if="isPremiumFeature('formatting', 'rich') && !isPremiumUser" 
                              name="ph:lock-duotone" 
                              class="size-3 text-yellow-500" 
                            />
                          </div>
                          <BaseText size="xs" class="text-muted-500 block">بصری</BaseText>
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Safety & Compliance -->
          <div class="space-y-4">
            <h3 class="flex items-center gap-2 text-lg font-semibold text-muted-900 dark:text-white">
              <Icon name="ph:shield-check-duotone" class="size-5" />
              امنیت و انطباق
            </h3>

            <BaseCard class="space-y-4 p-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-muted-700 dark:text-muted-300">سخت‌گیری موضوعی</label>
                <div class="grid grid-cols-3 gap-2">
                  <BaseRadioHeadless
                    v-model="state.domainStrictness"
                    value="strict"
                    name="domainStrictness"
                  >
                    <BaseCard class="group relative p-3 text-center peer-checked:!border-red-500 peer-checked:text-red-500">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <Icon name="ph:lock-duotone" class="mx-auto mb-2 size-5 text-muted-400 group-hover:text-red-500 peer-checked:text-red-500" />
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">سخت‌گیر</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.domainStrictness"
                    value="balanced"
                    name="domainStrictness"
                  >
                    <BaseCard class="group relative p-3 text-center peer-checked:!border-blue-500 peer-checked:text-blue-500">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <Icon name="ph:scales-duotone" class="mx-auto mb-2 size-5 text-muted-400 group-hover:text-blue-500 peer-checked:text-blue-500" />
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">متعادل</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.domainStrictness"
                    value="loose"
                    name="domainStrictness"
                  >
                    <BaseCard class="group relative p-3 text-center peer-checked:!border-green-500 peer-checked:text-green-500">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <Icon name="ph:key-duotone" class="mx-auto mb-2 size-5 text-muted-400 group-hover:text-green-500 peer-checked:text-green-500" />
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">آزاد</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-muted-700 dark:text-muted-300">کنترل محتوای نامناسب</label>
                <div class="grid grid-cols-2 gap-2">
                  <BaseRadioHeadless
                    v-model="state.profanity"
                    value="block"
                    name="profanity"
                  >
                    <BaseCard class="group relative p-3 text-center peer-checked:!border-red-500 peer-checked:text-red-500">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <Icon name="ph:prohibit-duotone" class="mx-auto mb-2 size-5 text-muted-400 group-hover:text-red-500 peer-checked:text-red-500" />
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">مسدود</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.profanity"
                    value="soften"
                    name="profanity"
                  >
                    <BaseCard class="group relative p-3 text-center peer-checked:!border-orange-500 peer-checked:text-orange-500">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <Icon name="ph:asterisk-duotone" class="mx-auto mb-2 size-5 text-muted-400 group-hover:text-orange-500 peer-checked:text-orange-500" />
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">تلطیف</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.profanity"
                    value="warn"
                    name="profanity"
                  >
                    <BaseCard class="group relative p-3 text-center peer-checked:!border-yellow-500 peer-checked:text-yellow-500">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <Icon name="ph:warning-duotone" class="mx-auto mb-2 size-5 text-muted-400 group-hover:text-yellow-500 peer-checked:text-yellow-500" />
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">هشدار</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.profanity"
                    value="allow"
                    name="profanity"
                  >
                    <BaseCard class="group relative p-3 text-center peer-checked:!border-green-500 peer-checked:text-green-500">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <Icon name="ph:check-circle-duotone" class="mx-auto mb-2 size-5 text-muted-400 group-hover:text-green-500 peer-checked:text-green-500" />
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">مجاز</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>

              <div>
                <label class="mb-3 block text-sm font-medium text-muted-700 dark:text-muted-300">بیانیه سلب مسئولیت</label>
                <div class="grid grid-cols-2 gap-2">
                  <BaseRadioHeadless
                    v-model="state.disclaimers"
                    value="always"
                    name="disclaimers"
                  >
                    <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-amber-500 peer-checked:bg-amber-50 peer-checked:shadow-md dark:peer-checked:bg-amber-950/20">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <div class="mb-2 text-lg">⚠️</div>
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">همیشه</BaseText>
                        <BaseText size="xs" class="text-muted-500 block">اجباری</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.disclaimers"
                    value="when_needed"
                    name="disclaimers"
                  >
                    <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-amber-500 peer-checked:bg-amber-50 peer-checked:shadow-md dark:peer-checked:bg-amber-950/20">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <div class="mb-2 text-lg">🔍</div>
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">در صورت نیاز</BaseText>
                        <BaseText size="xs" class="text-muted-500 block">هوشمند</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.disclaimers"
                    value="rarely"
                    name="disclaimers"
                  >
                    <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-amber-500 peer-checked:bg-amber-50 peer-checked:shadow-md dark:peer-checked:bg-amber-950/20">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <div class="mb-2 text-lg">⏱️</div>
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">به‌ندرت</BaseText>
                        <BaseText size="xs" class="text-muted-500 block">کمیاب</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                  <BaseRadioHeadless
                    v-model="state.disclaimers"
                    value="never"
                    name="disclaimers"
                  >
                    <BaseCard class="group relative p-4 text-center transition-all duration-300 hover:shadow-md peer-checked:!border-amber-500 peer-checked:bg-amber-50 peer-checked:shadow-md dark:peer-checked:bg-amber-950/20">
                      <div class="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-muted-200 bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:border-muted-700 dark:bg-muted-800">
                        <Icon name="lucide:check" class="h-2 w-2 text-current" />
                      </div>
                      <div class="mb-2 text-lg">🚫</div>
                      <div class="space-y-1">
                        <BaseText size="xs" class="font-medium block">هرگز</BaseText>
                        <BaseText size="xs" class="text-muted-500 block">بدون تذکر</BaseText>
                      </div>
                    </BaseCard>
                  </BaseRadioHeadless>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>

      <!-- Enhanced Action Footer -->
      <BaseCard class="overflow-hidden p-0" rounded="xl">
        <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
          <div class="flex flex-col items-center justify-between gap-6 p-8 sm:flex-row">
            <div class="flex items-center gap-4">
              <div class="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-3 shadow-lg shadow-blue-500/20">
                <Icon name="ph:check-circle-duotone" class="size-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-muted-900 dark:text-white">تنظیمات شما ذخیره شد!</h3>
                <p class="text-sm text-muted-600 dark:text-muted-400">تغییرات بلافاصله در گفتگوهای جدید اعمال می‌شود</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <BaseButton
                color="muted"
                variant="outline"
                size="lg"
                @click="resetToDefaults"
                class="border-muted-300 hover:bg-muted-50"
              >
                <Icon name="ph:arrow-counter-clockwise-duotone" class="ml-2 size-5" />
                بازنشانی به پیش‌فرض
              </BaseButton>
              <NuxtLink to="/darmana/therapists/messaging">
                <BaseButton
                  color="primary"
                  variant="solid"
                  size="xl"
                  class="bg-gradient-to-r from-primary-500 to-blue-500 shadow-lg shadow-primary-500/30 hover:shadow-xl"
                >
                  <Icon name="ph:rocket-duotone" class="ml-2 size-5" />
                  شروع تجربه جدید
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Premium Modal -->
    <TairoModal :open="showPremiumModal" @close="console.log('🔔 Modal close triggered'); showPremiumModal = false" >
      {{ console.log('🔔 Modal render - showPremiumModal:', showPremiumModal) }}
      <template #header>
        <div class="flex items-center gap-3 px-8 py-6">
          <Icon name="ph:crown-duotone" class="size-6 text-yellow-500" />
          <h3 class="text-lg font-semibold leading-tight">بروزرسانی به نسخه پرمیوم</h3>
        </div>
      </template>
      <div class="space-y-6 px-8 py-2">
        <div class="rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 p-8 mx-2 dark:from-yellow-950/20 dark:to-amber-950/20">
          <div class="mb-6 flex items-start gap-4 flex-row-reverse">
            <div class="rounded-xl bg-yellow-500 p-3 shadow-lg">
              <Icon name="ph:sparkle-duotone" class="size-7 text-white" />
            </div>
            <div class="flex-1 text-right">
              <h4 class="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2 leading-tight">ویژگی پیشرفته</h4>
              <p class="text-sm text-yellow-600 dark:text-yellow-300 leading-snug">مخصوص کاربران پرمیوم</p>
            </div>
          </div>
          <div class="bg-white/60 dark:bg-muted-800/60 rounded-lg p-5 backdrop-blur-sm text-justify ">
            <div class="text-muted-700 dark:text-muted-200 leading-snug text-base space-y-2">
              <p class="leading-snug">
                این قابلیت فقط برای کاربران پرمیوم قابل دسترسی است.
              </p>
              <p class="leading-snug">
                برای استفاده از تمام امکانات پیشرفته هوش مصنوعی، اشتراک پرمیوم خود را فعال کنید.
              </p>
            </div>
          </div>
        </div>
        <div class="space-y-3 px-2">
          <div class="flex items-center gap-4 text-muted-600 dark:text-muted-300 py-1.5">
            <Icon name="ph:check-circle-duotone" class="size-5 text-green-500 flex-shrink-0" />
            <span class="leading-snug">دسترسی به تمام سبک‌های ارتباطی</span>
          </div>
          <div class="flex items-center gap-4 text-muted-600 dark:text-muted-300 py-1.5">
            <Icon name="ph:check-circle-duotone" class="size-5 text-green-500 flex-shrink-0" />
            <span class="leading-snug">امکانات پیشرفته قالب‌بندی</span>
          </div>
          <div class="flex items-center gap-4 text-muted-600 dark:text-muted-300 py-1.5">
            <Icon name="ph:check-circle-duotone" class="size-5 text-green-500 flex-shrink-0" />
            <span class="leading-snug">حداکثر سطح خلاقیت و شخصی‌سازی</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-between gap-6 px-8 py-6">
          <BaseButton
            color="muted"
            size="lg"
            @click="showPremiumModal = false"
            class="px-6 py-3 leading-tight"
          >
            بعداً
          </BaseButton>
          <BaseButton
            size="lg"
            class="bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 px-8 py-3 leading-tight"
          >
            <Icon name="ph:crown-duotone" class="ml-2 size-5" />
            بروزرسانی به پرمیوم
          </BaseButton>
        </div>
      </template>
    </TairoModal>
  </div>
</template>

<style scoped>
.btn { @apply inline-flex items-center gap-1.5 font-medium transition; }
.form-select {
  @apply rounded-lg border border-muted-300 bg-white dark:bg-muted-800 px-3 py-2 text-sm text-muted-800 dark:text-muted-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full;
}
</style>
