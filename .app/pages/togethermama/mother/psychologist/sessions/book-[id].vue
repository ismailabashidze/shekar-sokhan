<script setup lang="ts">
definePageMeta({
  title: 'رزرو جلسه مشاوره',
  layout: 'default',
})

const route = useRoute()
const psychologistId = route.params.id

// Mock psychologist data
const psychologist = {
  id: 1,
  name: 'دکتر مریم محمدی',
  specialty: 'روانشناس کودک و نوجوان',
  image: '/img/avatars/1.svg',
  sessions: ['آنلاین', 'حضوری'],
}

const sessionTypes = [
  { id: 'online', name: 'آنلاین', description: 'جلسه از طریق ویدئو کنفرانس' },
  { id: 'in-person', name: 'حضوری', description: 'جلسه در مطب مشاور' },
]

const selectedType = ref('online')

const timeSlots = [
  { time: '10:00 - 11:00', available: true },
  { time: '11:00 - 12:00', available: true },
  { time: '12:00 - 13:00', available: false },
  { time: '13:00 - 14:00', available: false },
  { time: '14:00 - 15:00', available: true },
  { time: '15:00 - 16:00', available: true },
  { time: '16:00 - 17:00', available: true },
  { time: '17:00 - 18:00', available: false },
]

const selectedDate = ref(new Date())
const selectedTime = ref('')

const bookSession = () => {
  if (!selectedTime.value) {
    alert('لطفاً یک ساعت را انتخاب کنید')
    return
  }
  
  // Mock function for booking session
  alert(`جلسه با ${psychologist.name} برای تاریخ ${selectedDate.value.toLocaleDateString('fa-IR')} در ساعت ${selectedTime.value} رزرو شد`)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <span>رزرو جلسه مشاوره</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>انتخاب تاریخ و ساعت برای جلسه مشاوره</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Booking Form -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              انتخاب تاریخ و ساعت
            </BaseHeading>
          </div>

          <!-- Calendar -->
          <div class="mb-8">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white mb-4"
            >
              تاریخ جلسه
            </BaseHeading>
            <ClientOnly>
              <VueDatePicker
                v-model="selectedDate"
                locale="fa"
                format="YYYY/MM/DD"
                :enable-time-picker="false"
                :min-date="new Date()"
                auto-apply
                class="w-full"
              />
            </ClientOnly>
          </div>

          <!-- Session Type -->
          <div class="mb-8">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white mb-4"
            >
              نوع جلسه
            </BaseHeading>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <BaseCard
                v-for="type in sessionTypes"
                :key="type.id"
                :class="[
                  'cursor-pointer p-4 transition-all',
                  selectedType === type.id
                    ? 'border-primary-500 bg-primary-500/10 dark:border-primary-500 dark:bg-primary-500/20'
                    : 'border-muted-200 hover:border-primary-300 dark:border-muted-700 dark:hover:border-primary-500/50'
                ]"
                @click="selectedType = type.id"
              >
                <div class="flex items-center gap-3">
                  <BaseIconBox
                    :color="selectedType === type.id ? 'primary' : 'muted'"
                    size="md"
                    rounded="lg"
                  >
                    <Icon
                      :name="type.id === 'online' ? 'ph:video-camera' : 'ph:map-pin'"
                      class="size-5"
                    />
                  </BaseIconBox>
                  <div>
                    <BaseHeading
                      as="h4"
                      size="sm"
                      weight="semibold"
                      :class="[
                        'transition-colors',
                        selectedType === type.id
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-muted-800 dark:text-white'
                      ]"
                    >
                      {{ type.name }}
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-500">
                      {{ type.description }}
                    </BaseParagraph>
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>

          <!-- Time Slots -->
          <div class="mb-8">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white mb-4"
            >
              ساعت جلسه
            </BaseHeading>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <BaseCard
                v-for="slot in timeSlots"
                :key="slot.time"
                :class="[
                  'cursor-pointer p-3 text-center transition-all',
                  selectedTime === slot.time
                    ? 'border-primary-500 bg-primary-500/10 dark:border-primary-500 dark:bg-primary-500/20'
                    : slot.available
                      ? 'border-muted-200 hover:border-primary-300 dark:border-muted-700 dark:hover:border-primary-500/50'
                      : 'cursor-not-allowed opacity-50'
                ]"
                :disabled="!slot.available"
                @click="slot.available && (selectedTime = slot.time)"
              >
                <BaseParagraph
                  size="sm"
                  :class="[
                    'transition-colors',
                    selectedTime === slot.time
                      ? 'text-primary-600 dark:text-primary-400 font-medium'
                      : slot.available
                        ? 'text-muted-800 dark:text-white'
                        : 'text-muted-400'
                  ]"
                >
                  {{ slot.time }}
                </BaseParagraph>
                <BaseParagraph
                  v-if="!slot.available"
                  size="xs"
                  class="text-danger-500 mt-1"
                >
                  پر
                </BaseParagraph>
              </BaseCard>
            </div>
          </div>

          <!-- Confirm Button -->
          <div class="flex justify-end">
            <BaseButton
              color="primary"
              size="lg"
              :disabled="!selectedTime"
              @click="bookSession"
            >
              <Icon name="ph:calendar-check" class="mr-2 size-5" />
              <span>تایید و رزرو جلسه</span>
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Psychologist Info -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              مشاور انتخابی
            </BaseHeading>
          </div>

          <div class="text-center">
            <BaseAvatar
              :src="psychologist.image"
              size="xl"
              class="mx-auto mb-4"
            />
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              {{ psychologist.name }}
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500">
              {{ psychologist.specialty }}
            </BaseParagraph>
            
            <div class="mt-4 flex flex-wrap justify-center gap-2">
              <BaseTag
                v-for="sessionType in psychologist.sessions"
                :key="sessionType"
                color="primary"
                variant="pastel"
              >
                {{ sessionType }}
              </BaseTag>
            </div>
          </div>
        </BaseCard>

        <!-- Session Info -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              اطلاعات جلسه
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">مدت زمان جلسه:</BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-white">60 دقیقه</BaseParagraph>
            </div>
            
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">هزینه جلسه:</BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-white">150,000 تومان</BaseParagraph>
            </div>
            
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">شیوه پرداخت:</BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-white">کیف پول</BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
