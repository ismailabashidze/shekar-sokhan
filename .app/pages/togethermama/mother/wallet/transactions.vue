<script setup lang="ts">
definePageMeta({
  title: 'تراکنش‌ها',
  layout: 'default',
})

const transactions = [
  {
    id: 1,
    type: 'credit',
    amount: '500,000',
    description: 'شارژ کیف پول',
    date: '1402/02/20',
    time: '14:30',
    status: 'completed',
  },
  {
    id: 2,
    type: 'debit',
    amount: '150,000',
    description: 'پرداخت جلسه مشاوره',
    date: '1402/02/18',
    time: '10:15',
    status: 'completed',
  },
  {
    id: 3,
    type: 'credit',
    amount: '300,000',
    description: 'هدیه امتیاز وفاداری',
    date: '1402/02/15',
    time: '09:45',
    status: 'completed',
  },
  {
    id: 4,
    type: 'debit',
    amount: '899,000',
    description: 'خرید بسته استاندارد',
    date: '1402/02/15',
    time: '08:20',
    status: 'completed',
  },
  {
    id: 5,
    type: 'credit',
    amount: '250,000',
    description: 'شارژ کیف پول',
    date: '1402/01/22',
    time: '16:45',
    status: 'completed',
  },
  {
    id: 6,
    type: 'debit',
    amount: '200,000',
    description: 'پرداخت جلسه مشاوره',
    date: '1402/01/20',
    time: '11:30',
    status: 'completed',
  },
  {
    id: 7,
    type: 'credit',
    amount: '100,000',
    description: 'هدیه دعوت از دوستان',
    date: '1402/01/18',
    time: '09:15',
    status: 'completed',
  },
  {
    id: 8,
    type: 'debit',
    amount: '499,000',
    description: 'خرید بسته مقدماتی',
    date: '1402/01/15',
    time: '08:00',
    status: 'completed',
  },
]

const typeOptions = [
  { label: 'همه', value: 'all' },
  { label: 'واریز', value: 'credit' },
  { label: 'برداشت', value: 'debit' },
]

const statusOptions = [
  { label: 'همه', value: 'all' },
  { label: 'تکمیل‌شده', value: 'completed' },
  { label: 'در انتظار', value: 'pending' },
  { label: 'لغو‌شده', value: 'cancelled' },
]

const selectedType = ref('all')
const selectedStatus = ref('all')
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
        <span>تراکنش‌ها</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>مشاهده تمام تراکنش‌های کیف پول</span>
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <div class="min-w-[200px]">
          <BaseSelect
            v-model="selectedType"
            :options="typeOptions"
            label="نوع تراکنش"
          />
        </div>
        <div class="min-w-[200px]">
          <BaseSelect
            v-model="selectedStatus"
            :options="statusOptions"
            label="وضعیت"
          />
        </div>
        <BaseButton color="muted" variant="outline">
          <Icon name="ph:funnel" class="mr-2 size-5" />
          <span>فیلتر</span>
        </BaseButton>
      </div>
    </div>

    <!-- Transactions List -->
    <BaseCard class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <BaseHeading
          as="h2"
          size="lg"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          لیست تراکنش‌ها
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500">
          تعداد کل: {{ transactions.length }} تراکنش
        </BaseParagraph>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-muted-200 dark:border-muted-700 text-right">
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">توضیحات</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">تاریخ</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">نوع</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">مبلغ</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in transactions"
              :key="transaction.id"
              class="border-b border-muted-100 dark:border-muted-800 hover:bg-muted-50 dark:hover:bg-muted-800/50"
            >
              <td class="py-4">
                <BaseHeading
                  as="h3"
                  size="sm"
                  weight="medium"
                  class="text-muted-800 dark:text-white mb-1"
                >
                  {{ transaction.description }}
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-500">
                  {{ transaction.time }}
                </BaseParagraph>
              </td>
              <td class="py-4 text-sm text-muted-500">
                {{ transaction.date }}
              </td>
              <td class="py-4">
                <BaseTag
                  :color="transaction.type === 'credit' ? 'success' : 'danger'"
                  variant="pastel"
                >
                  {{ transaction.type === 'credit' ? 'واریز' : 'برداشت' }}
                </BaseTag>
              </td>
              <td
                class="py-4 text-sm font-medium"
                :class="transaction.type === 'credit' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'"
              >
                {{ transaction.type === 'credit' ? '+' : '-' }}{{ transaction.amount }} تومان
              </td>
              <td class="py-4">
                <BaseTag
                  :color="transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'"
                  variant="pastel"
                >
                  {{ transaction.status === 'completed' ? 'تکمیل‌شده' : transaction.status === 'pending' ? 'در انتظار' : 'لغو‌شده' }}
                </BaseTag>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between">
        <BaseParagraph size="sm" class="text-muted-500">
          نمایش 1 تا {{ transactions.length }} از {{ transactions.length }} تراکنش
        </BaseParagraph>
        <div class="flex items-center gap-2">
          <BaseButton size="sm" color="muted" variant="outline" disabled>
            <Icon name="ph:caret-right" class="size-4" />
          </BaseButton>
          <BaseButton size="sm" color="primary" variant="solid">
            1
          </BaseButton>
          <BaseButton size="sm" color="muted" variant="outline" disabled>
            <Icon name="ph:caret-left" class="size-4" />
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
