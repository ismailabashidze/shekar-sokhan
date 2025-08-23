<script setup lang="ts">
definePageMeta({
  title: 'کیف پول',
  layout: 'default',
})

const walletBalance = {
  total: '2,450,000',
  currency: 'تومان',
}

const recentTransactions = [
  {
    id: 1,
    type: 'credit',
    amount: '500,000',
    description: 'شارژ کیف پول',
    date: '1402/02/20',
    time: '14:30',
  },
  {
    id: 2,
    type: 'debit',
    amount: '150,000',
    description: 'پرداخت جلسه مشاوره',
    date: '1402/02/18',
    time: '10:15',
  },
  {
    id: 3,
    type: 'credit',
    amount: '300,000',
    description: 'هدیه امتیاز وفاداری',
    date: '1402/02/15',
    time: '09:45',
  },
  {
    id: 4,
    type: 'debit',
    amount: '899,000',
    description: 'خرید بسته استاندارد',
    date: '1402/02/15',
    time: '08:20',
  },
]

const quickActions = [
  {
    title: 'شارژ کیف پول',
    icon: 'ph:plus-circle',
    color: 'primary',
    to: '/togethermama/mother/wallet/top-up',
  },
  {
    id: 2,
    title: 'انتقال به حساب',
    icon: 'ph:arrow-square-out',
    color: 'success',
    to: '#',
  },
  {
    id: 3,
    title: 'درخواست برداشت',
    icon: 'ph:arrow-square-in',
    color: 'info',
    to: '#',
  },
]
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
        <span>کیف پول</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>مدیریت موجودی و تراکنش‌های مالی</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Wallet Balance -->
      <div class="lg:col-span-2">
        <BaseCard class="from-primary-500/10 to-success-500/10 mb-6 bg-gradient-to-br p-6 dark:from-primary-500/20 dark:to-success-500/20">
          <div class="flex items-center justify-between">
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-2">
                موجودی کیف پول
              </BaseParagraph>
              <BaseHeading
                as="h2"
                size="2xl"
                weight="bold"
                class="text-muted-800 dark:text-white"
              >
                {{ walletBalance.total }} {{ walletBalance.currency }}
              </BaseHeading>
            </div>
            <BaseIconBox
              color="primary"
              size="xl"
              rounded="xl"
            >
              <Icon name="ph:wallet" class="size-8" />
            </BaseIconBox>
          </div>
        </BaseCard>

        <!-- Quick Actions -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.title"
            :to="action.to"
          >
            <BaseCard class="dark:hover:bg-muted-800/50 hover:bg-muted-50 cursor-pointer p-5 transition-colors">
              <div class="text-center">
                <BaseIconBox
                  :color="action.color"
                  size="md"
                  rounded="lg"
                  class="mx-auto mb-3"
                >
                  <Icon :name="action.icon" class="size-6" />
                </BaseIconBox>
                <BaseParagraph class="text-muted-800 dark:text-white">
                  {{ action.title }}
                </BaseParagraph>
              </div>
            </BaseCard>
          </NuxtLink>
        </div>

        <!-- Recent Transactions -->
        <BaseCard class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              تراکنش‌های اخیر
            </BaseHeading>
            <NuxtLink to="/togethermama/mother/wallet/transactions" class="text-primary-500 hover:text-primary-600 text-sm">
              مشاهده همه
            </NuxtLink>
          </div>

          <div class="space-y-4">
            <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="dark:border-muted-700 border-b border-muted-200 pb-4 last:border-0 last:pb-0"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <BaseIconBox
                    :color="transaction.type === 'credit' ? 'success' : 'danger'"
                    size="md"
                    rounded="lg"
                  >
                    <Icon
                      :name="transaction.type === 'credit' ? 'ph:arrow-down' : 'ph:arrow-up'"
                      class="size-6"
                    />
                  </BaseIconBox>
                  <div>
                    <BaseHeading
                      as="h3"
                      size="sm"
                      weight="medium"
                      class="text-muted-800 dark:text-white mb-1"
                    >
                      {{ transaction.description }}
                    </BaseHeading>
                    <div class="flex items-center gap-2 text-xs">
                      <BaseParagraph class="text-muted-500">
                        {{ transaction.date }}
                      </BaseParagraph>
                      <span class="text-muted-300">•</span>
                      <BaseParagraph class="text-muted-500">
                        {{ transaction.time }}
                      </BaseParagraph>
                    </div>
                  </div>
                </div>
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="semibold"
                  :class="transaction.type === 'credit' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'"
                >
                  {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount }} تومان
                </BaseHeading>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Wallet Stats -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              آمار کیف پول
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <div>
              <div class="mb-2 flex items-center justify-between">
                <BaseParagraph size="sm" class="text-muted-500">درآمد ماه جاری</BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white font-medium">
                  800,000 تومان
                </BaseParagraph>
              </div>
              <BaseProgress
                :value="80"
                color="success"
                size="sm"
              />
            </div>
            
            <div>
              <div class="mb-2 flex items-center justify-between">
                <BaseParagraph size="sm" class="text-muted-500">هزینه‌های ماه جاری</BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white font-medium">
                  1,049,000 تومان
                </BaseParagraph>
              </div>
              <BaseProgress
                :value="65"
                color="danger"
                size="sm"
              />
            </div>
          </div>
        </BaseCard>

        <!-- Promotions -->
        <BaseCard class="border-success-500/30 bg-success-500/10 dark:bg-success-500/10 p-6">
          <div class="mb-4 flex items-center gap-3">
            <BaseIconBox
              color="success"
              size="md"
              rounded="lg"
            >
              <Icon name="ph:gift" class="size-6" />
            </BaseIconBox>
            <BaseHeading
              as="h2"
              size="md"
              weight="semibold"
              class="text-success-700 dark:text-success-300"
            >
              پیشنهاد ویژه
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-success-600 dark:text-success-400 mb-4">
            با شارژ ۵۰۰ هزار تومان، ۱۰۰ هزار تومان هدیه بگیرید!
          </BaseParagraph>
          <NuxtLink to="/togethermama/mother/wallet/top-up">
            <BaseButton color="success" variant="solid" class="w-full">
              <span>شارژ کیف پول</span>
            </BaseButton>
          </NuxtLink>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
