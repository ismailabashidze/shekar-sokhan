<script setup lang="ts">
definePageMeta({
  title: 'دسترسی آنلاین مشاوران',
  layout: 'sidebar',
  middleware: ['auth', 'therapist'] // Only for therapists
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'دسترسی آنلاین - مداخله بحران'
})

const { user, role } = useUser()
const toaster = useToaster()

// Online status
const isOnline = ref(false)
const availabilitySettings = ref({
  maxConcurrentSessions: 2,
  responseTimeMinutes: 5,
  availableDays: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday'],
  workingHours: {
    start: '08:00',
    end: '20:00'
  },
  crisisTypes: ['anxiety', 'depression', 'suicidal_thoughts', 'panic_attacks', 'relationship'],
  languages: ['persian', 'english']
})

const onlineStats = ref({
  activeUsers: 0,
  waitingUsers: 0,
  todaySessions: 0,
  totalHours: 0,
  rating: 4.8
})

const recentRequests = ref([])
const loading = ref(false)

// Crisis types options
const crisisTypeOptions = [
  { value: 'anxiety', label: 'اضطراب و نگرانی', icon: 'ph:heart-duotone' },
  { value: 'depression', label: 'افسردگی', icon: 'ph:cloud-rain-duotone' },
  { value: 'suicidal_thoughts', label: 'افکار خودکشی', icon: 'ph:warning-octagon-duotone' },
  { value: 'panic_attacks', label: 'حملات پانیک', icon: 'ph:lightning-duotone' },
  { value: 'relationship', label: 'مسائل رابطه', icon: 'ph:users-duotone' },
  { value: 'family', label: 'مسائل خانوادگی', icon: 'ph:house-duotone' },
  { value: 'work_stress', label: 'استرس شغلی', icon: 'ph:briefcase-duotone' },
  { value: 'trauma', label: 'ترومای روانی', icon: 'ph:shield-warning-duotone' },
  { value: 'addiction', label: 'اعتیاد', icon: 'ph:prohibit-duotone' },
  { value: 'grief', label: 'غم و از دست دادن', icon: 'ph:heart-break-duotone' }
]

// Days of week
const daysOfWeek = [
  { value: 'saturday', label: 'شنبه' },
  { value: 'sunday', label: 'یکشنبه' },
  { value: 'monday', label: 'دوشنبه' },
  { value: 'tuesday', label: 'سه‌شنبه' },
  { value: 'wednesday', label: 'چهارشنبه' },
  { value: 'thursday', label: 'پنج‌شنبه' },
  { value: 'friday', label: 'جمعه' }
]

// Language options
const languageOptions = [
  { value: 'persian', label: 'فارسی' },
  { value: 'english', label: 'انگلیسی' },
  { value: 'arabic', label: 'عربی' },
  { value: 'turkish', label: 'ترکی' },
  { value: 'kurdish', label: 'کردی' }
]

// Time slots
const timeSlots = []
for (let hour = 6; hour <= 23; hour++) {
  const time = hour.toString().padStart(2, '0') + ':00'
  timeSlots.push(time)
  if (hour < 23) {
    const halfTime = hour.toString().padStart(2, '0') + ':30'
    timeSlots.push(halfTime)
  }
}

// Toggle online status
const toggleOnlineStatus = async () => {
  loading.value = true
  try {
    // API call to update online status
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isOnline.value) {
      // Going offline
      toaster.show({
        title: 'آفلاین شدید',
        message: 'شما در حال حاضر برای مداخله بحران در دسترس نیستید',
        color: 'warning',
        icon: 'ph:power-duotone',
        closable: true,
      })
    } else {
      // Going online
      toaster.show({
        title: 'آنلاین شدید',
        message: 'شما اکنون برای مداخله بحران در دسترس هستید',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      })
    }
    
    isOnline.value = !isOnline.value
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در تغییر وضعیت آنلاین',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    loading.value = false
  }
}

// Save availability settings
const saveSettings = async () => {
  loading.value = true
  try {
    // API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toaster.show({
      title: 'تنظیمات ذخیره شد',
      message: 'تنظیمات دسترسی شما با موفقیت ذخیره شد',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در ذخیره تنظیمات',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    loading.value = false
  }
}

// Load therapist data
const loadTherapistData = async () => {
  try {
    // Load existing settings and stats
    onlineStats.value = {
      activeUsers: 3,
      waitingUsers: 1,
      todaySessions: 8,
      totalHours: 45.5,
      rating: 4.9
    }
    
    recentRequests.value = [
      {
        id: '1',
        time: '14:30',
        level: 'high',
        type: 'suicidal_thoughts',
        status: 'handled',
        duration: 25
      },
      {
        id: '2',
        time: '13:15',
        level: 'medium',
        type: 'anxiety',
        status: 'completed',
        duration: 18
      },
      {
        id: '3',
        time: '11:45',
        level: 'low',
        type: 'relationship',
        status: 'completed',
        duration: 32
      }
    ]
  } catch (error) {
    console.error('Error loading therapist data:', error)
  }
}

// Handle crisis request
const handleCrisisRequest = (requestId: string) => {
  // Navigate to crisis session
  navigateTo(`/darmana/crisis/session/${requestId}`)
}

onMounted(() => {
  loadTherapistData()
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Icon name="ph:shield-check-duotone" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <BaseHeading tag="h1" size="xl" weight="semibold" class="text-muted-900 dark:text-white">
                دسترسی آنلاین مداخله بحران
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                مدیریت دسترسی شما برای پاسخگویی به درخواست‌های بحرانی
              </BaseParagraph>
            </div>
          </div>

          <!-- Online Status Toggle -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-muted-700 dark:text-muted-300">
                {{ isOnline ? 'آنلاین' : 'آفلاین' }}
              </span>
              <div class="relative">
                <button
                  @click="toggleOnlineStatus"
                  :disabled="loading"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="isOnline ? 'bg-green-600' : 'bg-muted-200 dark:bg-muted-700'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="isOnline ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Online Status Alert -->
        <div v-if="isOnline" class="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <Icon name="ph:check-circle-duotone" class="w-5 h-5 text-green-600" />
            <div>
              <h3 class="font-semibold text-green-800 dark:text-green-200">
                شما در حال حاضر آنلاین هستید
              </h3>
              <p class="text-sm text-green-700 dark:text-green-300">
                کاربران می‌توانند برای مداخله بحران با شما ارتباط برقرار کنند
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Online Statistics -->
        <div class="lg:col-span-1">
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                آمار امروز
              </BaseHeading>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:users-duotone" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm text-muted-600 dark:text-muted-400">کاربران فعال</span>
                  </div>
                  <span class="font-semibold text-muted-900 dark:text-white">
                    {{ onlineStats.activeUsers }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:clock-duotone" class="w-4 h-4 text-yellow-600" />
                    <span class="text-sm text-muted-600 dark:text-muted-400">در انتظار</span>
                  </div>
                  <span class="font-semibold text-muted-900 dark:text-white">
                    {{ onlineStats.waitingUsers }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:chat-circle-duotone" class="w-4 h-4 text-green-600" />
                    <span class="text-sm text-muted-600 dark:text-muted-400">جلسات امروز</span>
                  </div>
                  <span class="font-semibold text-muted-900 dark:text-white">
                    {{ onlineStats.todaySessions }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:timer-duotone" class="w-4 h-4 text-purple-600" />
                    <span class="text-sm text-muted-600 dark:text-muted-400">مجموع ساعات</span>
                  </div>
                  <span class="font-semibold text-muted-900 dark:text-white">
                    {{ onlineStats.totalHours }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:star-duotone" class="w-4 h-4 text-orange-600" />
                    <span class="text-sm text-muted-600 dark:text-muted-400">امتیاز</span>
                  </div>
                  <span class="font-semibold text-muted-900 dark:text-white">
                    {{ onlineStats.rating }}
                  </span>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Recent Requests -->
          <BaseCard class="mt-6">
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                درخواست‌های اخیر
              </BaseHeading>
              
              <div class="space-y-3">
                <div
                  v-for="request in recentRequests"
                  :key="request.id"
                  class="flex items-center justify-between p-3 bg-muted-50 dark:bg-muted-800 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full"
                      :class="{
                        'bg-red-500': request.level === 'high',
                        'bg-yellow-500': request.level === 'medium',
                        'bg-green-500': request.level === 'low'
                      }"
                    ></div>
                    <div>
                      <div class="text-sm font-medium text-muted-900 dark:text-white">
                        {{ request.time }}
                      </div>
                      <div class="text-xs text-muted-600 dark:text-muted-400">
                        {{ request.duration }} دقیقه
                      </div>
                    </div>
                  </div>
                  <BaseTag
                    :color="request.status === 'completed' ? 'success' : 'primary'"
                    size="sm"
                  >
                    {{ request.status === 'completed' ? 'تکمیل شده' : 'انجام شده' }}
                  </BaseTag>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Settings -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Availability Settings -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                تنظیمات دسترسی
              </BaseHeading>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Basic Settings -->
                <div class="space-y-4">
                  <BaseInputNumber
                    v-model="availabilitySettings.maxConcurrentSessions"
                    label="حداکثر جلسات همزمان"
                    :min="1"
                    :max="5"
                  />
                  
                  <BaseInputNumber
                    v-model="availabilitySettings.responseTimeMinutes"
                    label="زمان پاسخگویی (دقیقه)"
                    :min="1"
                    :max="15"
                  />
                </div>

                <!-- Working Hours -->
                <div class="space-y-4">
                  <label class="block text-sm font-medium text-muted-700 dark:text-muted-300">
                    ساعات کاری
                  </label>
                  <div class="grid grid-cols-2 gap-4">
                    <BaseListbox
                      v-model="availabilitySettings.workingHours.start"
                      label="شروع"
                      :items="timeSlots"
                    />
                    <BaseListbox
                      v-model="availabilitySettings.workingHours.end"
                      label="پایان"
                      :items="timeSlots"
                    />
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Available Days -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                روزهای در دسترس
              </BaseHeading>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                  v-for="day in daysOfWeek"
                  :key="day.value"
                  class="flex items-center"
                >
                  <BaseCheckbox
                    :model-value="availabilitySettings.availableDays.includes(day.value)"
                    :label="day.label"
                    color="primary"
                    @update:model-value="(checked) => {
                      if (checked) {
                        if (!availabilitySettings.availableDays.includes(day.value)) {
                          availabilitySettings.availableDays.push(day.value)
                        }
                      } else {
                        const index = availabilitySettings.availableDays.indexOf(day.value)
                        if (index > -1) {
                          availabilitySettings.availableDays.splice(index, 1)
                        }
                      }
                    }"
                  />
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Crisis Types -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                انواع بحران که می‌توانید مدیریت کنید
              </BaseHeading>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="crisisType in crisisTypeOptions"
                  :key="crisisType.value"
                  class="flex items-center"
                >
                  <BaseCheckbox
                    :model-value="availabilitySettings.crisisTypes.includes(crisisType.value)"
                    color="primary"
                    @update:model-value="(checked) => {
                      if (checked) {
                        if (!availabilitySettings.crisisTypes.includes(crisisType.value)) {
                          availabilitySettings.crisisTypes.push(crisisType.value)
                        }
                      } else {
                        const index = availabilitySettings.crisisTypes.indexOf(crisisType.value)
                        if (index > -1) {
                          availabilitySettings.crisisTypes.splice(index, 1)
                        }
                      }
                    }"
                  >
                    <div class="flex items-center gap-2">
                      <Icon :name="crisisType.icon" class="w-4 h-4 text-primary-600" />
                      {{ crisisType.label }}
                    </div>
                  </BaseCheckbox>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Languages -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                زبان‌های ارائه مشاوره
              </BaseHeading>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="language in languageOptions"
                  :key="language.value"
                  class="flex items-center"
                >
                  <BaseCheckbox
                    :model-value="availabilitySettings.languages.includes(language.value)"
                    :label="language.label"
                    color="primary"
                    @update:model-value="(checked) => {
                      if (checked) {
                        if (!availabilitySettings.languages.includes(language.value)) {
                          availabilitySettings.languages.push(language.value)
                        }
                      } else {
                        const index = availabilitySettings.languages.indexOf(language.value)
                        if (index > -1) {
                          availabilitySettings.languages.splice(index, 1)
                        }
                      }
                    }"
                  />
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Save Button -->
          <div class="flex justify-end">
            <BaseButton
              color="primary"
              size="lg"
              :loading="loading"
              @click="saveSettings"
            >
              <Icon name="ph:floppy-disk-duotone" class="w-5 h-5 mr-2" />
              ذخیره تنظیمات
            </BaseButton>
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>