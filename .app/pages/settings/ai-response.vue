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

import { computed } from 'vue'
import { useRouter } from 'vue-router'

type EmojiLevel = 'very_high' | 'high' | 'medium' | 'low' | 'none'
type Tone = 'formal' | 'informal'
type Kindness = 'very_kind' | 'kind' | 'not_kind'
type LengthPref = 'very_short' | 'short' | 'long'
type MultiMsgMode = 'single' | 'multi_short'

type Creativity = 0 | 1 | 2 // 0=deterministic,1=balanced,2=creative
type DomainStrictness = 'strict' | 'balanced' | 'loose'
type LanguageStyle = 'plain' | 'professional' | 'friendly'
type Disclaimers = 'always' | 'when_needed' | 'never'
type Profanity = 'block' | 'soften' | 'allow'
type Formatting = 'none' | 'bullets' | 'markdown'

// Persist key
const STORAGE_KEY = 'aiResponseSettings.v1'

type AiResponseSettings = {
  multiMsgMode: MultiMsgMode
  lengthPref: LengthPref
  emojiLevel: EmojiLevel
  tone: Tone
  kindness: Kindness

  // Additional 6+ controls
  replySpeedMs: number // simulate/guide streaming speed preference
  creativity: Creativity
  domainStrictness: DomainStrictness
  languageStyle: LanguageStyle
  disclaimers: Disclaimers
  profanity: Profanity
  formatting: Formatting
}

const defaults: AiResponseSettings = {
  multiMsgMode: 'single',
  lengthPref: 'short',
  emojiLevel: 'medium',
  tone: 'formal',
  kindness: 'kind',
  replySpeedMs: 350,
  creativity: 1,
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
  } catch {
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
  (val) => saveSettings(val),
  { deep: true }
)

const router = useRouter()

const previewSummary = computed(() => {
  const emojiMap: Record<EmojiLevel, string> = {
    very_high: '🤩🤩🤩',
    high: '😊😊',
    medium: '🙂',
    low: '🙂 (rare)',
    none: '🚫',
  }
  return [
    `حالت: ${state.multiMsgMode === 'multi_short' ? 'چند پیام کوتاه' : 'تک پیام'}`,
    `طول پیام: ${state.lengthPref === 'very_short' ? 'خیلی کوتاه' : state.lengthPref === 'short' ? 'کوتاه' : 'بلند'}`,
    `ایموجی: ${emojiMap[state.emojiLevel]}`,
    `لحن: ${state.tone === 'formal' ? 'رسمی' : 'محاوره‌ای'}`,
    `مهربانی: ${state.kindness === 'very_kind' ? 'بسیار مهربان' : state.kindness === 'kind' ? 'مهربان' : 'غیرمهربان'}`,
    `خلاقیت: ${state.creativity === 0 ? 'قطعی' : state.creativity === 1 ? 'متعادل' : 'خلاق'}`,
    `سخت‌گیری دامنه: ${state.domainStrictness === 'strict' ? 'سخت‌گیر' : state.domainStrictness === 'balanced' ? 'متعادل' : 'آزاد'}`,
    `سبک زبان: ${state.languageStyle === 'plain' ? 'ساده' : state.languageStyle === 'professional' ? 'حرفه‌ای' : 'دوستانه'}`,
    `سلب مسئولیت: ${state.disclaimers === 'always' ? 'همیشه' : state.disclaimers === 'when_needed' ? 'در صورت نیاز' : 'هرگز'}`,
    `الفاظ رکیک: ${state.profanity === 'block' ? 'مسدود' : state.profanity === 'soften' ? 'تلطیف' : 'مجاز'}`,
    `قالب‌بندی: ${state.formatting === 'none' ? 'بدون قالب' : state.formatting === 'bullets' ? 'گلوله‌ای' : 'مارک‌داون'}`,
    `سرعت پاسخ: ${state.replySpeedMs}ms`
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
  <div class="p-6 bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold flex items-center gap-3 text-muted-900 dark:text-white">
          <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <Icon name="ph:brain-duotone" class="size-6" />
          </span>
          تنظیمات پاسخ هوش مصنوعی
        </h1>
        <div class="flex items-center gap-2">
          <BaseButton 
            color="muted" 
            variant="solid" 
            @click="goBack"
          >
            <Icon name="ph:arrow-left" class="size-4 ml-1" />
            بازگشت
          </BaseButton>
          <BaseButton 
            color="warning" 
            variant="solid" 
            @click="resetToDefaults"
          >
            <Icon name="ph:arrow-counter-clockwise" class="size-4 ml-1" />
            بازنشانی
          </BaseButton>
        </div>
      </div>

      <!-- Summary card -->
      <div class="rounded-xl border border-muted-200 dark:border-muted-700/50 bg-white dark:bg-muted-800 shadow-sm p-5">
        <div class="flex items-center gap-3 text-muted-700 dark:text-muted-200 mb-3">
          <Icon name="ph:eye-duotone" class="size-5 text-muted-500" />
          <span class="font-medium">پیش‌نمایش</span>
        </div>
        <div class="bg-muted-100 dark:bg-muted-900/50 rounded-lg p-4">
          <p class="text-sm text-muted-600 dark:text-muted-300 leading-relaxed">
            {{ previewSummary }}
          </p>
        </div>
      </div>

      <!-- Controls grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Multi-message vs single -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:squares-four-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">حالت پیام</h3>
            </div>
            <div class="flex gap-3">
              <BaseButton 
                :color="state.multiMsgMode === 'single' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.multiMsgMode='single'"
              >
                تک پیام
              </BaseButton>
              <BaseButton 
                :color="state.multiMsgMode === 'multi_short' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.multiMsgMode='multi_short'"
              >
                چند پیام کوتاه
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Length -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:text-align-left-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">طول پیام</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <BaseButton 
                size="sm"
                :color="state.lengthPref === 'very_short' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.lengthPref='very_short'"
              >
                خیلی کوتاه
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.lengthPref === 'short' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.lengthPref='short'"
              >
                کوتاه
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.lengthPref === 'long' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.lengthPref='long'"
              >
                بلند
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Emoji usage -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:smiley-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">استفاده از ایموجی</h3>
            </div>
            <BaseSelect
              v-model="state.emojiLevel"
              :options="[
                { label: 'خیلی زیاد', value: 'very_high' },
                { label: 'زیاد', value: 'high' },
                { label: 'متوسط', value: 'medium' },
                { label: 'کم', value: 'low' },
                { label: 'بدون ایموجی', value: 'none' }
              ]"
              placeholder="انتخاب کنید"
              rounded="md"
            />
          </div>
        </BaseCard>

        <!-- Tone -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:scale-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">لحن</h3>
            </div>
            <div class="flex gap-3">
              <BaseButton 
                :color="state.tone === 'formal' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.tone='formal'"
              >
                رسمی
              </BaseButton>
              <BaseButton 
                :color="state.tone === 'informal' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.tone='informal'"
              >
                محاوره‌ای
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Kindness -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:heart-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">مهربانی</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <BaseButton 
                size="sm"
                :color="state.kindness === 'very_kind' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.kindness='very_kind'"
              >
                بسیار مهربان
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.kindness === 'kind' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.kindness='kind'"
              >
                مهربان
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.kindness === 'not_kind' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.kindness='not_kind'"
              >
                غیرمهربان
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Creativity -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:flask-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">خلاقیت</h3>
            </div>
            <div class="space-y-4">
              <BaseSlider
                v-model="state.creativity"
                :min="0"
                :max="2"
                :step="1"
                tooltip
              />
              <div class="text-center">
                <span class="text-sm font-medium text-muted-700 dark:text-muted-300">
                  {{ state.creativity === 0 ? 'قطعی' : state.creativity === 1 ? 'متعادل' : 'خلاق' }}
                </span>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Domain strictness -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:shield-check-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">سخت‌گیری دامنه</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <BaseButton 
                size="sm"
                :color="state.domainStrictness === 'strict' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.domainStrictness='strict'"
              >
                سخت‌گیر
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.domainStrictness === 'balanced' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.domainStrictness='balanced'"
              >
                متعادل
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.domainStrictness === 'loose' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.domainStrictness='loose'"
              >
                آزاد
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Language style -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:chat-centered-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">سبک زبان</h3>
            </div>
            <BaseSelect
              v-model="state.languageStyle"
              :options="[
                { label: 'ساده', value: 'plain' },
                { label: 'حرفه‌ای', value: 'professional' },
                { label: 'دوستانه', value: 'friendly' }
              ]"
              placeholder="انتخاب کنید"
              rounded="md"
            />
          </div>
        </BaseCard>

        <!-- Disclaimers -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:info-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">بیانیه‌های سلب مسئولیت</h3>
            </div>
            <BaseSelect
              v-model="state.disclaimers"
              :options="[
                { label: 'همیشه', value: 'always' },
                { label: 'در صورت نیاز', value: 'when_needed' },
                { label: 'هرگز', value: 'never' }
              ]"
              placeholder="انتخاب کنید"
              rounded="md"
            />
          </div>
        </BaseCard>

        <!-- Profanity filter -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:prohibit-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">الفاظ رکیک</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <BaseButton 
                size="sm"
                :color="state.profanity === 'block' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.profanity='block'"
              >
                مسدود
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.profanity === 'soften' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.profanity='soften'"
              >
                تلطیف
              </BaseButton>
              <BaseButton 
                size="sm"
                :color="state.profanity === 'allow' ? 'primary' : 'default'" 
                variant="solid"
                @click="state.profanity='allow'"
              >
                مجاز
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Formatting preference -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:list-bullets-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">قالب‌بندی</h3>
            </div>
            <BaseSelect
              v-model="state.formatting"
              :options="[
                { label: 'بدون قالب', value: 'none' },
                { label: 'گلوله‌ای', value: 'bullets' },
                { label: 'مارک‌داون', value: 'markdown' }
              ]"
              placeholder="انتخاب کنید"
              rounded="md"
            />
          </div>
        </BaseCard>

        <!-- Reply speed -->
        <BaseCard rounded="lg" elevated class="border border-muted-200 dark:border-muted-700/50">
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="bg-primary-100 dark:bg-primary-900/30 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon name="ph:lightning-duotone" class="size-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="font-semibold text-muted-900 dark:text-white">سرعت پاسخ (میلی‌ثانیه)</h3>
            </div>
            <div class="space-y-4">
              <BaseSlider
                v-model="state.replySpeedMs"
                :min="100"
                :max="1000"
                :step="50"
                tooltip
              />
              <div class="text-center">
                <span class="text-sm font-medium text-muted-700 dark:text-muted-300">
                  {{ state.replySpeedMs }} میلی‌ثانیه بین بخش‌ها
                </span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="rounded-xl border border-muted-200 dark:border-muted-700/50 bg-white dark:bg-muted-800 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-muted-700 dark:text-muted-300">
          <Icon name="ph:info-duotone" class="size-4 inline-block mr-1" />
          تنظیمات به‌صورت خودکار در این دستگاه ذخیره می‌شوند.
        </div>
        <NuxtLink to="/darmana/therapists/messaging">
          <BaseButton 
            color="primary" 
            variant="solid"
          >
            <Icon name="ph:chat-circle-text-duotone" class="size-4 ml-1" />
            ورود به گفتگو
          </BaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn { @apply inline-flex items-center gap-1.5 font-medium transition; }
.form-select {
  @apply rounded-lg border border-muted-300 bg-white dark:bg-muted-800 px-3 py-2 text-sm text-muted-800 dark:text-muted-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full;
}
</style>
