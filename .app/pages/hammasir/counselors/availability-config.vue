<script setup lang="ts">
import { useProfileCounselor } from '~/composables/hammasir/useProfileCounselor'
import type { AvailabilityDto, WeeklyScheduleDto, TimeSlotDto } from '~/types/api'

definePageMeta({
  title: 'پیکربندی دسترس‌پذیری',
  layout: 'sidebar',
  middleware: ['auth', 'counselor']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  counselorProfileState,
  isProfileLoading,
  profileError,
  getMyCounselorProfile,
  updateAvailability
} = useProfileCounselor()

const availability = ref<AvailabilityDto>({
  weeklySchedule: [],
  exceptions: [],
  timeZone: 'Asia/Tehran'
})

const isSaving = ref(false)
const saveError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Days of the week in Persian
const daysOfWeek = [
  { id: 'saturday', name: 'شنبه', en: 'Saturday' },
  { id: 'sunday', name: 'یکشنبه', en: 'Sunday' },
  { id: 'monday', name: 'دوشنبه', en: 'Monday' },
  { id: 'tuesday', name: 'سه‌شنبه', en: 'Tuesday' },
  { id: 'wednesday', name: 'چهارشنبه', en: 'Wednesday' },
  { id: 'thursday', name: 'پنج‌شنبه', en: 'Thursday' },
  { id: 'friday', name: 'جمعه', en: 'Friday' }
]

// Initialize the availability data
onMounted(async () => {
  await loadAvailability()
})

const loadAvailability = async () => {
  try {
    const profile = await getMyCounselorProfile()
    if (profile?.availability) {
      availability.value = {
        ...profile.availability,
        weeklySchedule: profile.availability.weeklySchedule || []
      }
    } else {
      // Initialize with empty schedule
      availability.value = {
        weeklySchedule: daysOfWeek.map(day => ({
          dayOfWeek: day.en,
          isEnabled: false,
          timeSlots: []
        })),
        exceptions: [],
        timeZone: 'Asia/Tehran'
      }
    }
  } catch (error) {
    console.error('Error loading availability:', error)
  }
}

const getDaySchedule = (dayEn: string) => {
  const existing = availability.value.weeklySchedule.find(d => d.dayOfWeek === dayEn)
  if (existing) {
    return existing
  }
  
  // Create a new schedule for this day
  const newSchedule: WeeklyScheduleDto = {
    dayOfWeek: dayEn,
    isEnabled: false,
    timeSlots: []
  }
  
  availability.value.weeklySchedule.push(newSchedule)
  return newSchedule
}

const updateDaySchedule = (dayEn: string, schedule: WeeklyScheduleDto) => {
  const index = availability.value.weeklySchedule.findIndex(d => d.dayOfWeek === dayEn)
  if (index !== -1) {
    availability.value.weeklySchedule[index] = schedule
  } else {
    availability.value.weeklySchedule.push(schedule)
  }
}

const addTimeSlot = (dayEn: string) => {
  const schedule = getDaySchedule(dayEn)
  schedule.timeSlots.push({
    startTime: '09:00',
    endTime: '17:00',
    durationMinutes: 60
  })
  updateDaySchedule(dayEn, schedule)
}

const removeTimeSlot = (dayEn: string, slotIndex: number) => {
  const schedule = getDaySchedule(dayEn)
  schedule.timeSlots.splice(slotIndex, 1)
  updateDaySchedule(dayEn, schedule)
}

const updateTimeSlot = (dayEn: string, slotIndex: number, field: string, value: string | number) => {
  const schedule = getDaySchedule(dayEn)
  if (schedule.timeSlots[slotIndex]) {
    (schedule.timeSlots[slotIndex] as any)[field] = value
    updateDaySchedule(dayEn, schedule)
  }
}

const toggleDay = (dayEn: string) => {
  const schedule = getDaySchedule(dayEn)
  schedule.isEnabled = !schedule.isEnabled
  updateDaySchedule(dayEn, schedule)
}

const saveAvailability = async () => {
  isSaving.value = true
  saveError.value = null
  successMessage.value = null

  try {
    // Validate that at least one day is enabled
    const hasEnabledDays = availability.value.weeklySchedule.some(day => day.isEnabled)
    if (!hasEnabledDays) {
      saveError.value = 'حداقل یک روز باید فعال باشد'
      return
    }

    // Validate time slots
    for (const day of availability.value.weeklySchedule) {
      if (day.isEnabled && day.timeSlots.length === 0) {
        saveError.value = `برای روز ${daysOfWeek.find(d => d.en === day.dayOfWeek)?.name} حداقل یک بازه زمانی باید تعریف شود`
        return
      }
      
      // Validate time slot formats
      for (const slot of day.timeSlots) {
        if (slot.startTime >= slot.endTime) {
          saveError.value = `در روز ${daysOfWeek.find(d => d.en === day.dayOfWeek)?.name} زمان شروع باید قبل از زمان پایان باشد`
          return
        }
      }
    }

    const result = await updateAvailability(availability.value)
    if (result) {
      successMessage.value = 'تغییرات با موفقیت ذخیره شد'
      
      // Reload to get updated data
      await loadAvailability()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    }
  } catch (error: any) {
    saveError.value = error.message || 'خطا در ذخیره تغییرات'
  } finally {
    isSaving.value = false
  }
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}`
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              پیکربندی دسترس‌پذیری
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              تنظیم ساعات دسترس‌پذیری برای رزرو جلسات
            </p>
          </div>
          <div class="mt-4 flex space-x-3 space-x-reverse md:mt-0">
            <NuxtLink
              to="/hammasir/counselors/me"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Icon name="ph:arrow-right" class="ml-2 size-4" />
              <span>بازگشت به پروفایل</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:check-circle" class="size-5 text-green-400" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">
              {{ successMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="saveError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ saveError }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isProfileLoading" class="flex items-center justify-center py-12">
        <div class="size-12 animate-spin rounded-full border-y-2 border-indigo-500" />
        <span class="mr-3 text-gray-700 dark:text-gray-300">در حال بارگذاری اطلاعات...</span>
      </div>

      <!-- Availability Configuration Form -->
      <div v-else class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              ساعات دسترس‌پذیری هفتگی
            </h2>
            <div class="mt-4 flex md:mt-0">
              <button
                :disabled="isSaving"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                @click="saveAvailability"
              >
                <Icon
                  v-if="isSaving"
                  name="ph:spinner"
                  class="ml-2 size-4 animate-spin"
                />
                <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="px-4 py-5 sm:px-6">
          <div class="space-y-8">
            <!-- Timezone Info -->
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
              <div class="flex items-center">
                <Icon name="ph:globe" class="ml-3 size-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                    منطقه زمانی
                  </h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    تمامی ساعات بر اساس منطقه زمانی ایران (UTC+3:30) تنظیم می‌شوند
                  </p>
                </div>
              </div>
            </div>

            <!-- Availability Schedule -->
            <div class="space-y-6">
              <div
                v-for="day in daysOfWeek"
                :key="day.id"
                class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div
                  class="flex items-center justify-between px-4 py-3 sm:px-6"
                  :class="getDaySchedule(day.en).isEnabled ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-700/50'"
                >
                  <div class="flex items-center">
                    <input
                      :id="`day-${day.id}`"
                      :checked="getDaySchedule(day.en).isEnabled"
                      type="checkbox"
                      class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      @change="toggleDay(day.en)"
                    >
                    <label
                      :for="`day-${day.id}`"
                      class="mr-3 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ day.name }}
                    </label>
                  </div>
                  <div v-if="getDaySchedule(day.en).isEnabled" class="text-sm text-gray-500 dark:text-gray-400">
                    {{ getDaySchedule(day.en).timeSlots.length }} بازه زمانی
                  </div>
                </div>

                <div
                  v-show="getDaySchedule(day.en).isEnabled"
                  class="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-600 dark:bg-gray-800 sm:px-6"
                >
                  <div v-if="getDaySchedule(day.en).timeSlots.length === 0" class="py-2 text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      هنوز بازه زمانی‌ای تعریف نشده است
                    </p>
                  </div>

                  <div class="space-y-4">
                    <div
                      v-for="(slot, slotIndex) in getDaySchedule(day.en).timeSlots"
                      :key="slotIndex"
                      class="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50 sm:grid-cols-12"
                    >
                      <div class="sm:col-span-4">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          ساعت شروع
                        </label>
                        <input
                          :value="slot.startTime"
                          type="time"
                          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          @change="updateTimeSlot(day.en, slotIndex, 'startTime', ($event.target as HTMLInputElement).value)"
                        >
                      </div>

                      <div class="sm:col-span-4">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          ساعت پایان
                        </label>
                        <input
                          :value="slot.endTime"
                          type="time"
                          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          @change="updateTimeSlot(day.en, slotIndex, 'endTime', ($event.target as HTMLInputElement).value)"
                        >
                      </div>

                      <div class="sm:col-span-3">
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300">
                          مدت جلسه (دقیقه)
                        </label>
                        <select
                          :value="slot.durationMinutes"
                          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                          @change="updateTimeSlot(day.en, slotIndex, 'durationMinutes', parseInt(($event.target as HTMLSelectElement).value))"
                        >
                          <option :value="30">
                            30 دقیقه
                          </option>
                          <option :value="45">
                            45 دقیقه
                          </option>
                          <option :value="60">
                            60 دقیقه
                          </option>
                          <option :value="90">
                            90 دقیقه
                          </option>
                        </select>
                      </div>

                      <div class="flex items-end sm:col-span-1">
                        <button
                          type="button"
                          class="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                          @click="removeTimeSlot(day.en, slotIndex)"
                        >
                          <Icon name="ph:trash" class="size-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="inline-flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                      @click="addTimeSlot(day.en)"
                    >
                      <Icon name="ph:plus" class="ml-2 size-4" />
                      <span>افزودن بازه زمانی</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button (Duplicate for mobile) -->
            <div class="sm:hidden">
              <button
                :disabled="isSaving"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                @click="saveAvailability"
              >
                <Icon
                  v-if="isSaving"
                  name="ph:spinner"
                  class="ml-2 size-5 animate-spin"
                />
                <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          راهنمای تنظیم دسترس‌پذیری
        </h3>
        <div class="space-y-4">
          <div class="flex items-start">
            <Icon name="ph:info" class="ml-3 mt-0.5 size-5 text-blue-500" />
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                نحوه تنظیم ساعات
              </h4>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                برای هر روز، ساعاتی که مایل به دریافت جلسه هستید را مشخص کنید. می‌توانید چند بازه زمانی برای هر روز تعریف کنید.
              </p>
            </div>
          </div>
          <div class="flex items-start">
            <Icon name="ph:clock" class="ml-3 mt-0.5 size-5 text-blue-500" />
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                مدت جلسه
              </h4>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                مدت زمان هر جلسه را بر اساس نیاز خود انتخاب کنید. این مدت زمان برای تقسیم‌بندی ساعات شما استفاده می‌شود.
              </p>
            </div>
          </div>
          <div class="flex items-start">
            <Icon name="ph:warning" class="ml-3 mt-0.5 size-5 text-blue-500" />
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                نکات مهم
              </h4>
              <ul class="mt-1 list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>حداقل یک روز باید فعال باشد</li>
                <li>برای روزهای فعال، حداقل یک بازه زمانی تعریف کنید</li>
                <li>زمان شروع باید قبل از زمان پایان باشد</li>
                <li>تغییرات بلافاصله پس از ذخیره اعمال می‌شوند</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>