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
        <!-- حالت پیام -->
        <TairoFormGroup label="حالت پیام" sublabel="نحوه ارسال پاسخ توسط هوش مصنوعی">
          <div class="grid grid-cols-2 gap-3">
            <TairoRadioCard
              name="multiMsgMode"
              value="single"
              :model-value="state.multiMsgMode"
              @update:model-value="state.multiMsgMode = $event as any"
              title="تک پیام"
              subtitle="همه محتوا در یک پیام"
              icon="ph:chat-circle-text-duotone"
            />
            <TairoRadioCard
              name="multiMsgMode"
              value="multi_short"
              :model-value="state.multiMsgMode"
              @update:model-value="state.multiMsgMode = $event as any"
              title="چند پیام کوتاه"
              subtitle="تقسیم پاسخ به چند پیام"
              icon="ph:chats-teardrop-duotone"
            />
          </div>
        </TairoFormGroup>

        <!-- طول پیام -->
        <TairoFormGroup label="طول پیام" sublabel="اندازه متن تولیدی">
          <div class="grid grid-cols-3 gap-3">
            <TairoRadioCard
              name="lengthPref"
              value="very_short"
              :model-value="state.lengthPref"
              @update:model-value="state.lengthPref = $event as any"
              title="خیلی کوتاه"
              subtitle="خلاصه و موجز"
              icon="ph:dots-three-duotone"
            />
            <TairoRadioCard
              name="lengthPref"
              value="short"
              :model-value="state.lengthPref"
              @update:model-value="state.lengthPref = $event as any"
              title="کوتاه"
              subtitle="چند جمله"
              icon="ph:align-left-duotone"
            />
            <TairoRadioCard
              name="lengthPref"
              value="long"
              :model-value="state.lengthPref"
              @update:model-value="state.lengthPref = $event as any"
              title="بلند"
              subtitle="جزئیات بیشتر"
              icon="ph:textbox-duotone"
            />
          </div>
        </TairoFormGroup>

        <!-- استفاده از ایموجی -->
        <TairoFormGroup label="استفاده از ایموجی" sublabel="میزان استفاده از ایموجی در پاسخ">
          <div class="grid grid-cols-5 gap-3">
            <TairoRadioCard name="emojiLevel" value="none" :model-value="state.emojiLevel" @update:model-value="state.emojiLevel = $event as any" title="هیچ" icon="ph:prohibit-duotone" />
            <TairoRadioCard name="emojiLevel" value="low" :model-value="state.emojiLevel" @update:model-value="state.emojiLevel = $event as any" title="کم" icon="ph:smiley-nervous-duotone" />
            <TairoRadioCard name="emojiLevel" value="medium" :model-value="state.emojiLevel" @update:model-value="state.emojiLevel = $event as any" title="متوسط" icon="ph:smiley-duotone" />
            <TairoRadioCard name="emojiLevel" value="high" :model-value="state.emojiLevel" @update:model-value="state.emojiLevel = $event as any" title="زیاد" icon="ph:smiley-wink-duotone" />
            <TairoRadioCard name="emojiLevel" value="very_high" :model-value="state.emojiLevel" @update:model-value="state.emojiLevel = $event as any" title="خیلی زیاد" icon="ph:party-popper-duotone" />
          </div>
        </TairoFormGroup>

        <!-- لحن -->
        <TairoFormGroup label="لحن" sublabel="سبک نوشتاری پاسخ">
          <div class="grid grid-cols-2 gap-3">
            <TairoRadioCard name="tone" value="formal" :model-value="state.tone" @update:model-value="state.tone = $event as any" title="رسمی" icon="ph:seal-check-duotone" />
            <TairoRadioCard name="tone" value="informal" :model-value="state.tone" @update:model-value="state.tone = $event as any" title="محاوره‌ای" icon="ph:hand-waving-duotone" />
          </div>
        </TairoFormGroup>

        <!-- مهربانی -->
        <TairoFormGroup label="مهربانی" sublabel="سطح همدلی و ادب">
          <div class="grid grid-cols-3 gap-3">
            <TairoRadioCard name="kindness" value="not_kind" :model-value="state.kindness" @update:model-value="state.kindness = $event as any" title="غیرمهربان" icon="ph:minus-circle-duotone" />
            <TairoRadioCard name="kindness" value="kind" :model-value="state.kindness" @update:model-value="state.kindness = $event as any" title="مهربان" icon="ph:heart-duotone" />
            <TairoRadioCard name="kindness" value="very_kind" :model-value="state.kindness" @update:model-value="state.kindness = $event as any" title="بسیار مهربان" icon="ph:hands-praying-duotone" />
          </div>
        </TairoFormGroup>

        <!-- خلاقیت (slider) -->
        <TairoFormGroup label="خلاقیت" sublabel="میزان خلاقیت در تولید پاسخ">
          <div class="rounded-xl border border-muted-200 bg-white dark:bg-muted-900 shadow-sm p-5">
            <input type="range" min="0" max="2" step="1" v-model.number="state.creativity" class="w-full" />
            <div class="text-xs text-muted-600 dark:text-muted-300 mt-1">
              {{ state.creativity === 0 ? 'قطعی' : state.creativity === 1 ? 'متعادل' : 'خلاق' }}
            </div>
          </div>
        </TairoFormGroup>

        <!-- سخت‌گیری دامنه -->
        <TairoFormGroup label="سخت‌گیری دامنه" sublabel="پایبندی به حوزه موضوعی">
          <div class="grid grid-cols-3 gap-3">
            <TairoRadioCard name="domainStrictness" value="strict" :model-value="state.domainStrictness" @update:model-value="state.domainStrictness = $event as any" title="سخت‌گیر" subtitle="پایبندی شدید" icon="ph:shield-duotone" />
            <TairoRadioCard name="domainStrictness" value="balanced" :model-value="state.domainStrictness" @update:model-value="state.domainStrictness = $event as any" title="متعادل" subtitle="تعادل محتوا" icon="ph:scales-duotone" />
            <TairoRadioCard name="domainStrictness" value="loose" :model-value="state.domainStrictness" @update:model-value="state.domainStrictness = $event as any" title="آزاد" subtitle="انعطاف بالا" icon="ph:arrows-out-cardinal-duotone" />
          </div>
        </TairoFormGroup>

        <!-- سبک زبان -->
        <TairoFormGroup label="سبک زبان" sublabel="حال‌وهوای نوشتار">
          <div class="grid grid-cols-3 gap-3">
            <TairoRadioCard name="languageStyle" value="plain" :model-value="state.languageStyle" @update:model-value="state.languageStyle = $event as any" title="ساده" subtitle="روشن و مستقیم" icon="ph:text-t-duotone" />
            <TairoRadioCard name="languageStyle" value="professional" :model-value="state.languageStyle" @update:model-value="state.languageStyle = $event as any" title="حرفه‌ای" subtitle="رسمی و دقیق" icon="ph:suitcase-duotone" />
            <TairoRadioCard name="languageStyle" value="friendly" :model-value="state.languageStyle" @update:model-value="state.languageStyle = $event as any" title="دوستانه" subtitle="گرم و صمیمی" icon="ph:handshake-duotone" />
          </div>
        </TairoFormGroup>

        <!-- بیانیه‌های سلب مسئولیت -->
        <TairoFormGroup label="بیانیه‌های سلب مسئولیت" sublabel="افزودن عبارات راهنما">
          <div class="grid grid-cols-3 gap-3">
            <TairoRadioCard name="disclaimers" value="always" :model-value="state.disclaimers" @update:model-value="state.disclaimers = $event as any" title="همیشه" subtitle="افزودن دائم" icon="ph:info-duotone" />
            <TairoRadioCard name="disclaimers" value="when_needed" :model-value="state.disclaimers" @update:model-value="state.disclaimers = $event as any" title="در صورت نیاز" subtitle="بسته به محتوا" icon="ph:question-duotone" />
            <TairoRadioCard name="disclaimers" value="never" :model-value="state.disclaimers" @update:model-value="state.disclaimers = $event as any" title="هرگز" subtitle="غیرفعال" icon="ph:x-circle-duotone" />
          </div>
        </TairoFormGroup>

        <!-- الفاظ رکیک -->
        <TairoFormGroup label="الفاظ رکیک" sublabel="کنترل استفاده از واژگان نامناسب">
          <div class="grid grid-cols-3 gap-3">
            <TairoRadioCard name="profanity" value="block" :model-value="state.profanity" @update:model-value="state.profanity = $event as any" title="مسدود" subtitle="عدم نمایش" icon="ph:prohibit-duotone" />
            <TairoRadioCard name="profanity" value="soften" :model-value="state.profanity" @update:model-value="state.profanity = $event as any" title="تلطیف" subtitle="ملایم‌سازی" icon="ph:eraser-duotone" />
            <TairoRadioCard name="profanity" value="allow" :model-value="state.profanity" @update:model-value="state.profanity = $event as any" title="مجاز" subtitle="بدون محدودیت" icon="ph:check-circle-duotone" />
          </div>
        </TairoFormGroup>

        <!-- قالب‌بندی -->
        <TairoFormGroup label="قالب‌بندی" sublabel="نحوه ساختار پاسخ">
          <div class="grid grid-cols-3 gap-3">
            <TairoRadioCard name="formatting" value="none" :model-value="state.formatting" @update:model-value="state.formatting = $event as any" title="بدون قالب" subtitle="متن ساده" icon="ph:text-aa-duotone" />
            <TairoRadioCard name="formatting" value="bullets" :model-value="state.formatting" @update:model-value="state.formatting = $event as any" title="گلوله‌ای" subtitle="فهرست‌وار" icon="ph:list-bullets-duotone" />
            <TairoRadioCard name="formatting" value="markdown" :model-value="state.formatting" @update:model-value="state.formatting = $event as any" title="مارک‌داون" subtitle="تاکید و فهرست" icon="ph:hash-duotone" />
          </div>
        </TairoFormGroup>

        <!-- سرعت پاسخ (slider) -->
        <TairoFormGroup label="سرعت پاسخ (میلی‌ثانیه)" sublabel="فاصله زمانی بین بخش‌های پاسخ در استریم">
          <div class="rounded-xl border border-muted-200 bg-white dark:bg-muted-900 shadow-sm p-5">
            <input type="range" min="100" max="1000" step="50" v-model.number="state.replySpeedMs" class="w-full" />
            <div class="text-xs text-muted-600 dark:text-muted-300 mt-1">
              {{ state.replySpeedMs }} میلی‌ثانیه بین بخش‌ها
            </div>
          </div>
        </TairoFormGroup>
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
