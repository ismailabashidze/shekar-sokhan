<script setup lang="ts">
definePageMeta({
  title: 'بررسی مالی - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const earnings = ref({
  today: '750,000',
  week: '2,250,000',
  month: '9,000,000',
  total: '45,000,000',
})

const recentSessions = ref([
  {
    id: 1,
    mother: 'زهرا محمدی',
    child: 'امیرمحمد',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۰:۳۰',
    amount: '250,000',
    status: 'completed',
  },
  {
    id: 2,
    mother: 'احمد رضوی',
    child: 'سارا',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۱:۳۰',
    amount: '250,000',
    status: 'completed',
  },
  {
    id: 3,
    mother: 'فاطمه کریمی',
    child: 'حسین',
    date: '۱۴۰۳/۰۵/۱۴',
    time: '۱۴:۰۰',
    amount: '250,000',
    status: 'completed',
  },
])

const chartData = ref({
  labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
  datasets: [
    {
      label: 'درآمد ماهانه (تومان)',
      data: [7500000, 8200000, 9000000, 7800000, 9500000, 9000000],
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
      borderWidth: 2,
    },
  ],
})
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
        بررسی مالی
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و تحلیل درآمد و مالیات شما
      </BaseParagraph>
    </div>

    <!-- Earnings Summary -->
    <div class="mb-8">
      <BaseCard class="p-6">
        <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
          خلاصه درآمد
        </BaseHeading>
        
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              امروز
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ earnings.today }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              هفته جاری
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ earnings.week }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              ماه جاری
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ earnings.month }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              کل درآمد
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ earnings.total }} تومان
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Earnings Chart -->
    <div class="mb-8">
      <BaseCard class="p-6">
        <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
          درآمد ماهانه
        </BaseHeading>
        
        <div class="h-64">
          <!-- Chart would go here in a real implementation -->
          <div class="flex h-full items-center justify-center">
            <BaseParagraph class="text-muted-500">
              نمودار درآمد ماهانه (در نسخه کامل پیاده‌سازی خواهد شد)
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Sessions -->
    <div>
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
            جلسات اخیر
          </BaseHeading>
          <NuxtLink
            to="/togethermama/psychologist/finances/sessions"
            class="text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
          >
            مشاهده همه
          </NuxtLink>
        </div>

        <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
          <div
            v-for="session in recentSessions"
            :key="session.id"
            class="flex items-center justify-between p-4"
          >
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ session.mother }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                کودک: {{ session.child }} - {{ session.date }} - {{ session.time }}
              </BaseParagraph>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-medium">{{ session.amount }} تومان</span>
              <BaseTag
                v-if="session.status === 'completed'"
                color="success"
                variant="pastel"
                size="sm"
              >
                تکمیل شده
              </BaseTag>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
