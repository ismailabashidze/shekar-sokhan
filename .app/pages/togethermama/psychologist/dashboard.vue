<script setup lang="ts">
definePageMeta({
  title: 'داشبورد روانشناس - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const psychologist = ref({
  name: 'دکتر مریم ترابی',
  specialty: 'روانشناس کودک',
  experience: '۸ سال',
  rating: 4.8,
  reviews: 124,
  avatar: '/img/avatars/2.svg',
})

const upcomingSessions = ref([
  {
    id: 1,
    mother: 'زهرا محمدی',
    child: 'امیرمحمد',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۰:۳۰',
    type: 'آنلاین',
  },
  {
    id: 2,
    mother: 'احمد رضوی',
    child: 'سارا',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۱:۳۰',
    type: 'آنلاین',
  },
  {
    id: 3,
    mother: 'فاطمه کریمی',
    child: 'حسین',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۴:۰۰',
    type: 'آنلاین',
  },
])

const recentEarnings = ref({
  today: '750,000',
  week: '2,250,000',
  month: '9,000,000',
})

const stats = ref([
  { label: 'جلسات امروز', value: '3', icon: 'ph:calendar' },
  { label: 'جلسات هفته', value: '12', icon: 'ph:calendar-check' },
  { label: 'نظرسنجی', value: '4.8', icon: 'ph:star' },
  { label: 'کل جلسات', value: '246', icon: 'ph:chart-bar' },
])
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-muted-800 dark:text-white"
      >
        خوش آمدید، {{ psychologist.name }}
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        به داشبورد روانشناس TogetherMama خوش آمدید
      </BaseParagraph>
    </div>

    <!-- Stats Cards -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <BaseCard
        v-for="stat in stats"
        :key="stat.label"
        class="p-5"
      >
        <div class="flex items-center gap-4">
          <div class="bg-primary-100 dark:bg-primary-500/20 flex size-12 items-center justify-center rounded-full">
            <Icon :name="stat.icon" class="text-primary-500 size-6" />
          </div>
          <div>
            <BaseHeading as="h3" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ stat.value }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500 text-sm">
              {{ stat.label }}
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Earnings -->
    <div class="mb-8">
      <BaseCard class="p-6">
        <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
          درآمد اخیر
        </BaseHeading>
        
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              امروز
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ recentEarnings.today }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              هفته جاری
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ recentEarnings.week }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              ماه جاری
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ recentEarnings.month }} تومان
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Upcoming Sessions -->
    <div>
      <div class="mb-4 flex items-center justify-between">
        <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
          جلسات آینده
        </BaseHeading>
        <NuxtLink
          to="/togethermama/psychologist/sessions"
          class="text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
        >
          مشاهده همه
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <BaseCard
          v-for="session in upcomingSessions"
          :key="session.id"
          class="p-5 transition-shadow hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                {{ session.mother }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                کودک: {{ session.child }}
              </BaseParagraph>
              <div class="mt-3 flex items-center gap-4">
                <div class="flex items-center gap-1 text-sm">
                  <Icon name="ph:calendar" class="text-muted-500" />
                  <span>{{ session.date }}</span>
                </div>
                <div class="flex items-center gap-1 text-sm">
                  <Icon name="ph:clock" class="text-muted-500" />
                  <span>{{ session.time }}</span>
                </div>
              </div>
            </div>
            <BaseTag color="primary" variant="pastel">
              {{ session.type }}
            </BaseTag>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
