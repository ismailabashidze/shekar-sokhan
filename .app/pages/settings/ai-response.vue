<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات',
  preview: {
    title: 'تنظیمات',
    description: 'نمایش تنظیمات حساب کاربری',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-settings.png',
    srcDark: '/img/screens/layouts-subpages-settings-dark.png',
    order: 81,
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
  <div class="p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <!-- heroicons: sparkles -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904a6.375 6.375 0 1 1 4.374-4.374m-4.374 4.374L6 21m3.813-5.096L15 18m-2.813-6.47L18 6" />
            </svg>
          </span>
          تنظیمات پاسخ هوش مصنوعی
        </h1>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm bg-muted-100 hover:bg-muted-200 text-muted-800 rounded-lg px-3 py-2" @click="goBack">
            <!-- heroicons: arrow-left -->
            <svg class="h-5 w-5 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.5 19.5L3 12l7.5-7.5M3 12h18" />
            </svg>
            بازگشت
          </button>
          <button class="btn btn-sm bg-warning-100 text-warning-700 hover:bg-warning-200 rounded-lg px-3 py-2" @click="resetToDefaults">
            <!-- heroicons: arrow-path -->
            <svg class="h-5 w-5 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.023 9.348h4.992M19.515 5.859l1.5 3.489-3.489 1.5M7.977 14.652H2.985m2.508 3.489l-1.5-3.489 3.489-1.5M8.25 6.75a5.25 5.25 0 0 1 9.584 2.598M15.75 17.25A5.25 5.25 0 0 1 6.166 14.652" />
            </svg>
            بازنشانی
          </button>
        </div>
      </div>

      <!-- Summary card -->
      <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-4">
        <div class="flex items-center gap-3 text-muted-700">
          <!-- heroicons: eye -->
          <svg class="h-5 w-5 text-muted-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322c1.258-4.233 5.34-7.322 9.964-7.322s8.706 3.089 9.964 7.322c-1.258 4.233-5.34 7.322-9.964 7.322S3.294 16.555 2.036 12.322z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span class="font-medium">پیش‌نمایش</span>
        </div>
        <p class="mt-2 text-sm text-muted-600">
          {{ previewSummary }}
        </p>
      </div>

      <!-- Controls grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Multi-message vs single -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: squares-2x2 -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3.75h7.5v7.5h-7.5zM12.75 3.75h7.5v7.5h-7.5zM3.75 12.75h7.5v7.5h-7.5zM12.75 12.75h7.5v7.5h-7.5z" />
            </svg>
            <h3 class="font-medium">حالت پیام</h3>
          </div>
          <div class="flex gap-3">
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.multiMsgMode==='single' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.multiMsgMode='single'">تک پیام</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.multiMsgMode==='multi_short' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.multiMsgMode='multi_short'">چند پیام کوتاه</button>
          </div>
        </div>

        <!-- Length -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: bars-3-bottom-left -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6.75h12.5M3.75 12h8.75M3.75 17.25h5" />
            </svg>
            <h3 class="font-medium">طول پیام</h3>
          </div>
          <div class="flex gap-3 flex-wrap">
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.lengthPref==='very_short' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.lengthPref='very_short'">خیلی کوتاه</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.lengthPref==='short' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.lengthPref='short'">کوتاه</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.lengthPref==='long' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.lengthPref='long'">بلند</button>
          </div>
        </div>

        <!-- Emoji usage -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: face-smile -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.59 14.37a4.5 4.5 0 0 1-7.18 0M8.25 9a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <h3 class="font-medium">استفاده از ایموجی</h3>
          </div>
          <select v-model="state.emojiLevel" class="form-select w-full">
            <option value="very_high">خیلی زیاد</option>
            <option value="high">زیاد</option>
            <option value="medium">متوسط</option>
            <option value="low">کم</option>
            <option value="none">بدون ایموجی</option>
          </select>
        </div>

        <!-- Tone -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: scale -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h18M6 3v6m12-6v6M6 9h12l-2 12H8L6 9z" />
            </svg>
            <h3 class="font-medium">لحن</h3>
          </div>
          <div class="flex gap-3">
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.tone==='formal' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.tone='formal'">رسمی</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.tone==='informal' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.tone='informal'">محاوره‌ای</button>
          </div>
        </div>

        <!-- Kindness -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: heart -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.995 20.25S3.75 15 3.75 9.75a4.5 4.5 0 0 1 8.245-2.655A4.5 4.5 0 0 1 20.25 9.75c0 5.25-8.255 10.5-8.255 10.5z" />
            </svg>
            <h3 class="font-medium">مهربانی</h3>
          </div>
          <div class="flex gap-3 flex-wrap">
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.kindness==='very_kind' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.kindness='very_kind'">بسیار مهربان</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.kindness==='kind' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.kindness='kind'">مهربان</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.kindness==='not_kind' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.kindness='not_kind'">غیرمهربان</button>
          </div>
        </div>

        <!-- Creativity -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: beaker -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v5.25L4.5 16.5A3.75 3.75 0 0 0 8.25 22.5h7.5A3.75 3.75 0 0 0 19.5 16.5L15 8.25V3" />
            </svg>
            <h3 class="font-medium">خلاقیت</h3>
          </div>
          <input type="range" min="0" max="2" step="1" v-model.number="state.creativity" class="w-full" />
          <div class="text-xs text-muted-600 mt-1">
            {{ state.creativity === 0 ? 'قطعی' : state.creativity === 1 ? 'متعادل' : 'خلاق' }}
          </div>
        </div>

        <!-- Domain strictness -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: shield-check -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3l7.5 4.5v4.75A8.75 8.75 0 0 1 12 21.75A8.75 8.75 0 0 1 4.5 12.25V7.5L12 3z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9.75 12.75 1.5 1.5 3-3" />
            </svg>
            <h3 class="font-medium">سخت‌گیری دامنه</h3>
          </div>
          <div class="flex gap-3">
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.domainStrictness==='strict' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.domainStrictness='strict'">سخت‌گیر</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.domainStrictness==='balanced' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.domainStrictness='balanced'">متعادل</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.domainStrictness==='loose' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.domainStrictness='loose'">آزاد</button>
          </div>
        </div>

        <!-- Language style -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: chat-bubble-left-right -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 8.511a6.739 6.739 0 0 1-2.25.389 6.75 6.75 0 1 1-6.75-6.75c.133 0 .265.003.396.01" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 15.75 6 21l5.25-2.25" />
            </svg>
            <h3 class="font-medium">سبک زبان</h3>
          </div>
          <select v-model="state.languageStyle" class="form-select w-full">
            <option value="plain">ساده</option>
            <option value="professional">حرفه‌ای</option>
            <option value="friendly">دوستانه</option>
          </select>
        </div>

        <!-- Disclaimers -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: information-circle -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8.25v.008M12 11.25v4.5" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <h3 class="font-medium">بیانیه‌های سلب مسئولیت</h3>
          </div>
          <select v-model="state.disclaimers" class="form-select w-full">
            <option value="always">همیشه</option>
            <option value="when_needed">در صورت نیاز</option>
            <option value="never">هرگز</option>
          </select>
        </div>

        <!-- Profanity filter -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: no-symbol -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18.364 5.636-12.728 12.728M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
            </svg>
            <h3 class="font-medium">الفاظ رکیک</h3>
          </div>
          <div class="flex gap-3">
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.profanity==='block' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.profanity='block'">مسدود</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.profanity==='soften' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.profanity='soften'">تلطیف</button>
            <button :class="['px-3 py-2 rounded-lg text-sm border', state.profanity==='allow' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-muted-700 border-muted-300']" @click="state.profanity='allow'">مجاز</button>
          </div>
        </div>

        <!-- Formatting preference -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: list-bullet -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 7.5h10.5M6.75 12h10.5M6.75 16.5h10.5" />
            </svg>
            <h3 class="font-medium">قالب‌بندی</h3>
          </div>
          <select v-model="state.formatting" class="form-select w-full">
            <option value="none">بدون قالب</option>
            <option value="bullets">گلوله‌ای</option>
            <option value="markdown">مارک‌داون</option>
          </select>
        </div>

        <!-- Reply speed -->
        <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-5">
          <div class="flex items-center gap-2 mb-3">
            <!-- heroicons: bolt -->
            <svg class="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m13.5 4.5-6 9h6L10.5 21l6-9h-6l3-7.5z" />
            </svg>
            <h3 class="font-medium">سرعت پاسخ (میلی‌ثانیه)</h3>
          </div>
          <input type="range" min="100" max="1000" step="50" v-model.number="state.replySpeedMs" class="w-full" />
          <div class="text-xs text-muted-600 mt-1">
            {{ state.replySpeedMs }} میلی‌ثانیه بین بخش‌ها
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-muted-200 bg-white shadow-sm p-4 flex items-center justify-between">
        <div class="text-sm text-muted-700 dark:text-muted-300">
          تنظیمات به‌صورت خودکار در این دستگاه ذخیره می‌شوند.
        </div>
        <NuxtLink to="/darmana/therapists/messaging" class="btn bg-primary-600 text-white dark:text-white rounded-lg px-4 py-2 hover:bg-primary-700">
          <!-- heroicons: paper-airplane -->
          <svg class="h-5 w-5 inline-block mr-2 -rotate-45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m3 11 18-8-8 18-2-8-8-2z" />
          </svg>
          ورود به گفتگو
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
