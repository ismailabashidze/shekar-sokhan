<script setup lang="ts">
definePageMeta({
  title: 'مداخله بحران',
  layout: 'sidebar',
})

useHead({ 
  htmlAttrs: { dir: 'rtl' },
  title: 'مداخله بحران - ذهنا'
})

const { role, user } = useUser()
const router = useRouter()
const toaster = useToaster()
const { sendCrisisNotification } = useNtfy()

// Crisis intervention state
const showEmergencyModal = ref(false)
const isConnecting = ref(false)
const emergencyLevel = ref('')
const emergencyDescription = ref('')
const contactInfo = ref({
  phone: '',
  emergencyContact: '',
  location: ''
})

// Available crisis counselors
const availableCounselors = ref([])
const onlineCounselors = ref([])
const loading = ref(false)

// Crisis levels
const crisisLevels = [
  {
    value: 'low',
    label: 'سطح پایین',
    description: 'احساس ناراحتی، اضطراب خفیف',
    color: 'warning',
    icon: 'ph:warning-duotone'
  },
  {
    value: 'medium',
    label: 'سطح متوسط',
    description: 'افکار منفی، اضطراب شدید، افسردگی',
    color: 'danger',
    icon: 'ph:warning-circle-duotone'
  },
  {
    value: 'high',
    label: 'سطح بالا',
    description: 'افکار آسیب‌رسانی، خطر فوری',
    color: 'danger',
    icon: 'ph:warning-octagon-duotone'
  }
]

// Emergency resources
const emergencyResources = [
  {
    title: 'خط اورژانس روانشناسی',
    phone: '1480',
    description: 'پاسخگویی 24 ساعته',
    available: true
  },
  {
    title: 'اورژانس پزشکی',
    phone: '115',
    description: 'اورژانس‌های پزشکی',
    available: true
  },
  {
    title: 'مرکز مشاوره بحران',
    phone: '1500',
    description: 'مشاوره تلفنی رایگان',
    available: true
  }
]

// Self-help techniques
const selfHelpTechniques = [
  {
    title: 'تکنیک تنفس عمیق',
    description: 'نفس عمیق بکشید و آرام خارج کنید',
    icon: 'ph:wind-duotone',
    steps: [
      '4 ثانیه نفس بکشید',
      '4 ثانیه نگه دارید',
      '6 ثانیه آرام خارج کنید',
      'این فرآیند را 5 بار تکرار کنید'
    ]
  },
  {
    title: 'تکنیک 5-4-3-2-1',
    description: 'تمرکز روی حال حاضر',
    icon: 'ph:eye-duotone',
    steps: [
      '5 چیز که می‌بینید نام ببرید',
      '4 چیز که لمس می‌کنید شناسایی کنید',
      '3 صدا که می‌شنوید توجه کنید',
      '2 بو که احساس می‌کنید',
      '1 طعم که در دهانتان هست'
    ]
  },
  {
    title: 'ماساژ نقاط فشار',
    description: 'فشار دادن نقاط خاص برای آرامش',
    icon: 'ph:hand-duotone',
    steps: [
      'کف دست را ماساژ دهید',
      'شقیقه‌ها را به آرامی فشار دهید',
      'قسمت بین ابرو و پیشانی',
      'پشت گردن را نوازش کنید'
    ]
  }
]

// Fetch available counselors
const fetchAvailableCounselors = async () => {
  loading.value = true
  try {
    // This would be a real API call
    onlineCounselors.value = [
      {
        id: '1',
        name: 'دکتر سارا احمدی',
        specialty: 'روانشناس بالینی',
        experience: 8,
        rating: 4.9,
        avatar: '/img/avatars/therapist-1.jpg',
        status: 'online',
        responseTime: '2 دقیقه',
        languages: ['فارسی', 'انگلیسی']
      },
      {
        id: '2',
        name: 'دکتر علی رضایی',
        specialty: 'مشاور بحران',
        experience: 12,
        rating: 4.8,
        avatar: '/img/avatars/therapist-2.jpg',
        status: 'online',
        responseTime: '1 دقیقه',
        languages: ['فارسی']
      }
    ]
  } catch (error) {
    console.error('Error fetching counselors:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در دریافت مشاوران آنلاین',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    loading.value = false
  }
}

// Connect to crisis counselor
const connectToCounselor = async (counselorId: string) => {
  if (!emergencyLevel.value || !emergencyDescription.value) {
    toaster.show({
      title: 'اطلاعات ناقص',
      message: 'لطفا تمام اطلاعات مورد نیاز را وارد کنید',
      color: 'warning',
      icon: 'ph:warning-duotone',
      closable: true,
    })
    return
  }

  isConnecting.value = true
  try {
    // Send crisis notification to selected counselor
    const sessionUrl = `${window.location.origin}/darmana/crisis/session/${counselorId}`
    
    await sendCrisisNotification(
      counselorId,
      `درخواست مداخله بحران ${emergencyLevel.value === 'high' ? 'فوری' : 'جدید'}: ${emergencyDescription.value.substring(0, 100)}...`,
      sessionUrl
    )
    
    // API call to connect to counselor
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toaster.show({
      title: 'اتصال برقرار شد',
      message: 'مشاور مطلع شد و در حال انتقال به جلسه مشاوره...',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })

    // Redirect to crisis messaging
    router.push(`/darmana/crisis/session/${counselorId}`)
  } catch (error) {
    toaster.show({
      title: 'خطا در اتصال',
      message: 'امکان برقراری ارتباط وجود ندارد',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  } finally {
    isConnecting.value = false
  }
}

// Emergency call
const makeEmergencyCall = (phone: string) => {
  if (process.client) {
    window.open(`tel:${phone}`)
  }
}

onMounted(() => {
  fetchAvailableCounselors()
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full">
            <Icon name="ph:heart-duotone" class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <BaseHeading tag="h1" size="xl" weight="semibold" class="text-muted-900 dark:text-white">
              مداخله بحران
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
              پشتیبانی فوری و مشاوره تخصصی در شرایط بحرانی
            </BaseParagraph>
          </div>
        </div>

        <!-- Crisis Alert -->
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-3">
            <Icon name="ph:warning-duotone" class="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 class="font-semibold text-red-800 dark:text-red-200 mb-1">
                در صورت خطر فوری
              </h3>
              <p class="text-sm text-red-700 dark:text-red-300 mb-3">
                اگر در خطر فوری هستید یا افکار آسیب‌رسانی دارید، فوراً با اورژانس تماس بگیرید.
              </p>
              <BaseButton
                color="danger"
                size="sm"
                @click="makeEmergencyCall('115')"
              >
                <Icon name="ph:phone-duotone" class="w-4 h-4 mr-2" />
                تماس با اورژانس (115)
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Crisis Assessment -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Crisis Level Assessment -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                ارزیابی سطح بحران
              </BaseHeading>
              
              <div class="space-y-4">
                <div
                  v-for="level in crisisLevels"
                  :key="level.value"
                  class="relative"
                >
                  <label class="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
                    :class="emergencyLevel === level.value 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-muted-200 dark:border-muted-700 hover:border-muted-300'"
                  >
                    <input
                      v-model="emergencyLevel"
                      type="radio"
                      :value="level.value"
                      class="sr-only"
                    />
                    <div class="flex items-center justify-center w-8 h-8 rounded-full"
                      :class="level.color === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'"
                    >
                      <Icon 
                        :name="level.icon" 
                        class="w-4 h-4"
                        :class="level.color === 'warning' ? 'text-yellow-600' : 'text-red-600'"
                      />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-muted-900 dark:text-white">
                        {{ level.label }}
                      </h4>
                      <p class="text-sm text-muted-600 dark:text-muted-400">
                        {{ level.description }}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Description -->
              <div class="mt-6">
                <BaseTextarea
                  v-model="emergencyDescription"
                  label="توضیح وضعیت"
                  placeholder="لطفا وضعیت فعلی خود را به صورت مختصر توضیح دهید..."
                  rows="4"
                />
              </div>

              <!-- Contact Information -->
              <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BaseInput
                  v-model="contactInfo.phone"
                  label="شماره تماس"
                  placeholder="09123456789"
                />
                <BaseInput
                  v-model="contactInfo.emergencyContact"
                  label="تماس اضطراری"
                  placeholder="شماره یکی از نزدیکان"
                />
              </div>
            </div>
          </BaseCard>

          <!-- Available Crisis Counselors -->
          <BaseCard>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <BaseHeading tag="h3" size="md" weight="semibold">
                  مشاوران بحران آنلاین
                </BaseHeading>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-sm text-muted-600 dark:text-muted-400">
                    {{ onlineCounselors.length }} مشاور آنلاین
                  </span>
                </div>
              </div>

              <div v-if="loading" class="space-y-4">
                <div v-for="i in 2" :key="i" class="animate-pulse">
                  <div class="flex items-center gap-4 p-4 border border-muted-200 dark:border-muted-700 rounded-lg">
                    <div class="w-12 h-12 bg-muted-200 dark:bg-muted-700 rounded-full"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-muted-200 dark:bg-muted-700 rounded w-1/3"></div>
                      <div class="h-3 bg-muted-200 dark:bg-muted-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="counselor in onlineCounselors"
                  :key="counselor.id"
                  class="flex items-center justify-between p-4 border border-muted-200 dark:border-muted-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <div class="relative">
                      <BaseAvatar
                        :src="counselor.avatar"
                        size="lg"
                      />
                      <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-muted-900 rounded-full"></div>
                    </div>
                    <div>
                      <h4 class="font-medium text-muted-900 dark:text-white">
                        {{ counselor.name }}
                      </h4>
                      <p class="text-sm text-muted-600 dark:text-muted-400">
                        {{ counselor.specialty }}
                      </p>
                      <div class="flex items-center gap-4 mt-1">
                        <span class="text-xs text-muted-500">
                          {{ counselor.experience }} سال تجربه
                        </span>
                        <span class="text-xs text-green-600">
                          پاسخگویی در {{ counselor.responseTime }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <BaseButton
                    color="primary"
                    size="sm"
                    :loading="isConnecting"
                    @click="connectToCounselor(counselor.id)"
                  >
                    <Icon name="ph:chat-circle-duotone" class="w-4 h-4 mr-2" />
                    اتصال فوری
                  </BaseButton>
                </div>
              </div>

              <div v-if="!loading && onlineCounselors.length === 0" class="text-center py-8">
                <Icon name="ph:users-duotone" class="w-12 h-12 text-muted-400 mx-auto mb-3" />
                <p class="text-muted-600 dark:text-muted-400">
                  در حال حاضر مشاوری آنلاین نیست
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Emergency Resources & Self-Help -->
        <div class="space-y-6">
          <!-- Emergency Contacts -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                تماس‌های اضطراری
              </BaseHeading>
              
              <div class="space-y-3">
                <div
                  v-for="resource in emergencyResources"
                  :key="resource.phone"
                  class="flex items-center justify-between p-3 border border-muted-200 dark:border-muted-700 rounded-lg"
                >
                  <div class="flex-1">
                    <h4 class="font-medium text-muted-900 dark:text-white text-sm">
                      {{ resource.title }}
                    </h4>
                    <p class="text-xs text-muted-600 dark:text-muted-400">
                      {{ resource.description }}
                    </p>
                  </div>
                  <BaseButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    @click="makeEmergencyCall(resource.phone)"
                  >
                    <Icon name="ph:phone-duotone" class="w-4 h-4 mr-1" />
                    {{ resource.phone }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Self-Help Techniques -->
          <BaseCard>
            <div class="p-6">
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4">
                تکنیک‌های خودیاری
              </BaseHeading>
              
              <div class="space-y-4">
                <details
                  v-for="technique in selfHelpTechniques"
                  :key="technique.title"
                  class="group"
                >
                  <summary class="flex items-center gap-3 p-3 bg-muted-50 dark:bg-muted-800 rounded-lg cursor-pointer hover:bg-muted-100 dark:hover:bg-muted-700 transition-colors">
                    <Icon :name="technique.icon" class="w-5 h-5 text-primary-600" />
                    <div class="flex-1">
                      <h4 class="font-medium text-muted-900 dark:text-white text-sm">
                        {{ technique.title }}
                      </h4>
                      <p class="text-xs text-muted-600 dark:text-muted-400">
                        {{ technique.description }}
                      </p>
                    </div>
                    <Icon name="ph:caret-down-duotone" class="w-4 h-4 text-muted-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div class="mt-3 px-3">
                    <ol class="space-y-2">
                      <li
                        v-for="(step, index) in technique.steps"
                        :key="index"
                        class="flex items-start gap-3 text-sm text-muted-600 dark:text-muted-400"
                      >
                        <span class="flex items-center justify-center w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs font-medium rounded-full shrink-0 mt-0.5">
                          {{ index + 1 }}
                        </span>
                        {{ step }}
                      </li>
                    </ol>
                  </div>
                </details>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>