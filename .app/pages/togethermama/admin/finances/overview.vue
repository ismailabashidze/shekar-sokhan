<script setup lang="ts">
definePageMeta({
  title: 'بررسی مالی - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const financialStats = ref({
  totalRevenue: '45,000,000',
  monthlyRevenue: '9,000,000',
  pendingPayouts: '2,500,000',
  commission: '4,500,000',
})

const recentTransactions = ref([
  {
    id: 1,
    user: 'زهرا محمدی',
    type: 'subscription',
    amount: '899,000',
    date: '۱۴۰۳/۰۵/۱۵',
    status: 'completed',
  },
  {
    id: 2,
    user: 'احمد رضوی',
    type: 'package',
    amount: '1,200,000',
    date: '۱۴۰۳/۰۵/۱۴',
    status: 'completed',
  },
  {
    id: 3,
    user: 'فاطمه کریمی',
    type: 'session',
    amount: '250,000',
    date: '۱۴۰۳/۰۵/۱۴',
    status: 'completed',
  },
  {
    id: 4,
    user: 'دکتر مریم ترابی',
    type: 'payout',
    amount: '8,000,000',
    date: '۱۴۰۳/۰۵/۰۱',
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
        مشاهده و تحلیل درآمد و مالیات سیستم
      </BaseParagraph>
    </div>

    <!-- Financial Summary -->
    <div class="mb-8">
      <BaseCard class="p-6">
        <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
          خلاصه مالی
        </BaseHeading>
        
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              کل درآمد
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ financialStats.totalRevenue }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              درآمد ماهانه
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ financialStats.monthlyRevenue }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              تسویه‌های در انتظار
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ financialStats.pendingPayouts }} تومان
            </BaseHeading>
          </div>
          
          <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center">
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              کمیسیون
            </BaseHeading>
            <BaseHeading as="h4" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ financialStats.commission }} تومان
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Revenue Chart -->
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

    <!-- Recent Transactions -->
    <div>
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
            تراکنش‌های اخیر
          </BaseHeading>
          <NuxtLink
            to="/togethermama/admin/finances/transactions"
            class="text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
          >
            مشاهده همه
          </NuxtLink>
        </div>

        <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex items-center justify-between p-4"
          >
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ transaction.user }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ transaction.type === 'subscription' ? 'اشتراک' : transaction.type === 'package' ? 'بسته' : transaction.type === 'session' ? 'جلسه' : 'تسویه' }} - {{ transaction.date }}
              </BaseParagraph>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-medium">{{ transaction.amount }} تومان</span>
              <BaseTag
                :color="transaction.status === 'completed' ? 'success' : 'warning'"
                variant="pastel"
                size="sm"
              >
                {{ transaction.status === 'completed' ? 'تکمیل شده' : 'در انتظار' }}
              </BaseTag>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
