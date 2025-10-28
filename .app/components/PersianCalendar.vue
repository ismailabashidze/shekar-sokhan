<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import jalaali from 'jalaali-js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  minYear: { type: Number, default: 1370 },
  maxYear: { type: Number, default: 1450 },
  placeholder: { type: String, default: 'انتخاب تاریخ' },
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
  inputClass: { type: String, default: '' },
  popupClass: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'focus', 'blur'])

// Persian months and weekdays
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]
const persianWeekdays = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه',
]

const today = new Date()

function gregorianToJalali(gy: number, gm: number, gd: number) {
  // jalaali-js months are 1-based for input
  const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd)
  return [jy, jm, jd]
}

function daysInJalaliMonth(year: number, month: number) {
  return jalaali.jalaaliMonthLength(year, month)
}

const showCalendar = ref(false)

const selected = ref<{ year: number, month: number, day: number } | null>(null)

// Initialize to today or prop value
function parseJalaliString(str: string) {
  const m = str.match(/^(\d{4})\/(\d{2})\/(\d{2})$/)
  if (!m) return null
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) }
}

if (props.modelValue) {
  const parsed = parseJalaliString(props.modelValue)
  if (parsed) selected.value = parsed
  else {
    const [jy, jm, jd] = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate())
    selected.value = { year: jy, month: jm, day: jd }
  }
}
else {
  const [jy, jm, jd] = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate())
  selected.value = { year: jy, month: jm, day: jd }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const parsed = parseJalaliString(val)
      if (parsed) selected.value = parsed
    }
  },
)

const daysInMonth = computed(() => {
  const m = selected.value?.month || 1
  const y = selected.value?.year || 1400
  return daysInJalaliMonth(y, m)
})

function selectDay(day: number) {
  if (!selected.value) return
  selected.value.day = day
  emit('update:modelValue', formatted.value)
  emit('change', formatted.value)
  showCalendar.value = false
}

const transitionDirection = ref('next') // 'next' or 'prev' for month transitions

function prevMonth() {
  transitionDirection.value = 'prev'
  if (!selected.value) return
  if (selected.value.month === 1) {
    selected.value.month = 12
    selected.value.year--
  }
  else {
    selected.value.month--
  }
}

function nextMonth() {
  transitionDirection.value = 'next'
  if (!selected.value) return
  if (selected.value.month === 12) {
    selected.value.month = 1
    selected.value.year++
  }
  else {
    selected.value.month++
  }
}

function getJalaliMonthStartWeekday(jy: number, jm: number) {
  // Convert first day of Jalali month to Gregorian
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, 1)
  const jsWeekday = new Date(gy, gm - 1, gd).getDay()
  // Correct mapping: 0=Sat, ..., 6=Fri
  return (jsWeekday + 1) % 7
}

// Years range (e.g. 1370-1450)
const years = Array.from({ length: props.maxYear - props.minYear + 1 }, (_, i) => props.minYear + i)

function selectMonth(month: number) {
  if (!selected.value) return
  selected.value.month = month
}
function selectYear(year: number) {
  if (!selected.value) return
  selected.value.year = year
}

// UX/Look improvements:
// - Use Tairo/BaseInput for selects
// - Add hover/focus/active styles
// - Add today button
// - Add highlight for today
// - Add subtle shadow and rounded corners
// - Add more spacing and alignment

const todayJalali = (() => {
  const { jy, jm, jd } = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate())
  return { year: jy, month: jm, day: jd }
})()

function goToToday() {
  if (!selected.value) return
  selected.value.year = todayJalali.year
  selected.value.month = todayJalali.month
  selected.value.day = todayJalali.day
  emit('update:modelValue', formatted.value)
  emit('change', formatted.value)
  showCalendar.value = false
}

// Icons (inline SVG)
const ChevronLeft = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 19l-7-7 7-7' /></svg>`
const ChevronRight = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' /></svg>`
const CalendarIcon = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4 inline mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'><rect x='3' y='8' width='18' height='13' rx='2' stroke-width='2' stroke='currentColor' fill='none'/><path d='M16 2v4M8 2v4M3 10h18' stroke-width='2' stroke='currentColor' fill='none'/></svg>`
const ClearIcon = `<svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' /></svg>`

function clearDate() {
  selected.value = null
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  showCalendar.value = false
}

// --- Month Dropdown Animation ---
const showMonthDropdown = ref(false)
function toggleMonthDropdown() {
  showMonthDropdown.value = !showMonthDropdown.value
}
function selectMonthDropdown(idx: number) {
  if (!selected.value) return
  selected.value.month = idx + 1
  showMonthDropdown.value = false
}

function openCalendar() {
  if (props.disabled) return
  showCalendar.value = true
  emit('focus')
}

function closeCalendar() {
  showCalendar.value = false
  emit('blur')
}

const formatted = computed(() => {
  if (!selected.value) return ''
  return `${selected.value.year}/${selected.value.month.toString().padStart(2, '0')}/${selected.value.day.toString().padStart(2, '0')}`
})

// Expose methods for programmatic control
defineExpose({
  open: openCalendar,
  close: closeCalendar,
  clear: clearDate,
  goToToday,
  formatted,
})
</script>

<template>
  <div class="relative">
    <div v-if="label" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
    </div>
    <BaseInput
      :model-value="formatted"
      readonly
      :placeholder="placeholder"
      class="cursor-pointer"
      :class="[inputClass, { 'cursor-not-allowed opacity-60': disabled }]"
      :disabled="disabled"
      :error="error"
      :size="size"
      @click="openCalendar"
    >
      <template #append>
        <button
          v-if="clearable && formatted"
          type="button"
          class="hover-scale ml-2 rounded bg-red-100 px-2 py-1 text-red-600 hover:bg-red-200"
          @click="clearDate"
        >
          <span class="text-red-600" v-html="ClearIcon" />
        </button>
        <button
          type="button"
          class="hover-scale bg-primary-100 hover:bg-primary-200 ml-2 rounded px-2 py-1"
          :disabled="disabled"
          @click="openCalendar"
        >
          <span class="text-primary-700">انتخاب</span>
        </button>
      </template>
    </BaseInput>
    <div v-if="error" class="text-danger-500 mt-1 text-xs">
      {{ error }}
    </div>
    <transition name="calendar-popup">
      <div
        v-if="showCalendar"
        class="absolute z-50 mt-2 w-max min-w-[320px] rounded-lg border bg-white p-4 shadow-lg"
        :class="popupClass"
        @click.stop
      >
        <div class="mb-4 flex items-center justify-between gap-2">
          <button
            class="hover-scale hover:bg-primary-100 text-primary-600 rounded px-2 py-1 text-lg"
            aria-label="Previous month"
            @click="prevMonth"
          >
            <span v-html="ChevronRight" />
          </button>
          <div class="flex items-center gap-1">
            <span v-html="CalendarIcon" />
            <div class="relative mx-1 w-28">
              <button class="hover:bg-primary-50 flex w-full items-center justify-between rounded border bg-white px-3 py-1 text-right focus:outline-none" @click="toggleMonthDropdown">
                <span>{{ persianMonths[selected?.month - 1] }}</span>
                <svg
                  class="ml-1 size-3"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 8l4 4 4-4"
                /></svg>
              </button>
              <transition name="fade-slide">
                <ul v-if="showMonthDropdown" class="animate-fade-in absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white shadow-lg">
                  <li
                    v-for="(m, idx) in persianMonths"
                    :key="m"
                    class="hover:bg-primary-100 cursor-pointer px-3 py-1 text-right"
                    :class="{'bg-primary-50 font-bold': selected?.month-1 === idx}"
                    @click="selectMonthDropdown(idx)"
                  >
                    {{ m }}
                  </li>
                </ul>
              </transition>
            </div>
            <BaseInput
              v-model.number="selected.year"
              type="select"
              class="mx-1 w-24"
              size="sm"
            >
              <option
                v-for="y in years"
                :key="y"
                :value="y"
              >
                {{ y }}
              </option>
            </BaseInput>
          </div>
          <button
            class="hover-scale hover:bg-primary-100 text-primary-600 rounded px-2 py-1 text-lg"
            aria-label="Next month"
            @click="nextMonth"
          >
            <span v-html="ChevronLeft" />
          </button>
        </div>
        <div class="mb-4 border-b border-gray-200" />
        <div class="relative overflow-hidden">
          <transition :name="'calendar-' + transitionDirection">
            <div>
              <div class="mb-2 grid grid-cols-7 gap-1">
                <span
                  v-for="w in persianWeekdays"
                  :key="w"
                  class="bg-gray-100 p-1 text-center text-xs text-gray-500"
                >{{ w }}</span>
              </div>
              <div class="grid grid-cols-7 gap-1">
                <span v-for="n in getJalaliMonthStartWeekday(selected?.year, selected?.month)" :key="'empty' + n" />
                <button
                  v-for="d in daysInMonth"
                  :key="d"
                  class="day-btn size-8 rounded-full text-center"
                  :class="[
                    selected?.day === d ? 'selected bg-primary-500 text-white' : 'hover:bg-primary-100',
                    (todayJalali.year === selected?.year && todayJalali.month === selected?.month && todayJalali.day === d) ? 'ring-primary-400 ring-2' : ''
                  ]"
                  @click="selectDay(d)"
                >
                  {{ d }}
                </button>
              </div>
            </div>
          </transition>
        </div>
        <div class="mt-2 flex justify-end gap-2">
          <button
            type="button"
            class="hover-scale pulse bg-primary-100 text-primary-700 hover:bg-primary-200 rounded px-3 py-1 text-xs font-bold transition"
            aria-label="Go to today"
            title="Go to today"
            @click="goToToday"
          >
            برو به امروز
          </button>
          <button
            type="button"
            class="hover-scale hover:text-primary-600 text-xs text-gray-500"
            aria-label="Close calendar"
            @click="closeCalendar"
          >
            بستن
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
button[disabled] {
  opacity: 0.5;
  pointer-events: none;
}

/* Base transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transitions for month dropdown */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Calendar grid transitions */
.calendar-next-enter-active,
.calendar-next-leave-active,
.calendar-prev-enter-active,
.calendar-prev-leave-active {
  transition: all 0.3s ease-out;
  position: absolute;
  width: 100%;
}

.calendar-next-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.calendar-next-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.calendar-prev-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.calendar-prev-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Day selection animation */
.day-btn {
  transition: all 0.2s ease;
}
.day-btn:active {
  transform: scale(0.9);
}
.day-btn.selected {
  animation: selectDay 0.3s ease;
}

@keyframes selectDay {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Hover animations */
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

/* Calendar popup animation */
.calendar-popup-enter-active,
.calendar-popup-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  transform-origin: top;
}
.calendar-popup-enter-from,
.calendar-popup-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Today button pulse animation */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--color-primary-400), 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(var(--color-primary-400), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--color-primary-400), 0);
  }
}
.pulse {
  animation: pulse 2s infinite;
}
</style>
