<script setup lang="ts">
definePageMeta({
  title: 'فاکتورها',
  layout: 'default',
})

const invoices = [
  {
    id: 'INV-001',
    date: '1402/02/15',
    amount: '899,000',
    status: 'paid',
    plan: 'بسته استاندارد',
  },
  {
    id: 'INV-002',
    date: '1402/01/15',
    amount: '899,000',
    status: 'paid',
    plan: 'بسته استاندارد',
  },
  {
    id: 'INV-003',
    date: '1401/12/15',
    amount: '499,000',
    status: 'paid',
    plan: 'بسته مقدماتی',
  },
  {
    id: 'INV-004',
    date: '1401/11/15',
    amount: '499,000',
    status: 'paid',
    plan: 'بسته مقدماتی',
  },
  {
    id: 'INV-005',
    date: '1401/10/15',
    amount: '499,000',
    status: 'paid',
    plan: 'بسته مقدماتی',
  },
]

const statusOptions = [
  { label: 'همه', value: 'all' },
  { label: 'پرداخت شده', value: 'paid' },
  { label: 'در انتظار', value: 'pending' },
  { label: 'لغو شده', value: 'cancelled' },
]

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
        <span>فاکتورها</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>مشاهده و دانلود فاکتورهای پرداخت‌شده</span>
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <div class="min-w-[200px]">
          <BaseSelect
            v-model="selectedStatus"
            :options="statusOptions"
            label="وضعیت فاکتور"
          />
        </div>
        <BaseButton color="muted" variant="outline">
          <Icon name="ph:funnel" class="mr-2 size-5" />
          <span>فیلتر</span>
        </BaseButton>
      </div>
    </div>

    <!-- Invoices List -->
    <BaseCard class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <BaseHeading
          as="h2"
          size="lg"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          لیست فاکتورها
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500">
          تعداد کل: {{ invoices.length }} فاکتور
        </BaseParagraph>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-muted-200 dark:border-muted-700 text-right">
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">شماره فاکتور</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">تاریخ</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">بسته</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">مبلغ</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">وضعیت</th>
              <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="border-b border-muted-100 dark:border-muted-800 hover:bg-muted-50 dark:hover:bg-muted-800/50"
            >
              <td class="py-4 text-sm font-medium text-muted-800 dark:text-white">
                {{ invoice.id }}
              </td>
              <td class="py-4 text-sm text-muted-500">
                {{ invoice.date }}
              </td>
              <td class="py-4 text-sm text-muted-500">
                {{ invoice.plan }}
              </td>
              <td class="py-4 text-sm font-medium text-muted-800 dark:text-white">
                {{ invoice.amount }} تومان
              </td>
              <td class="py-4">
                <BaseTag
                  :color="invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'danger'"
                  variant="pastel"
                >
                  {{ invoice.status === 'paid' ? 'پرداخت شده' : invoice.status === 'pending' ? 'در انتظار' : 'لغو شده' }}
                </BaseTag>
              </td>
              <td class="py-4">
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/togethermama/mother/subscription/invoices/${invoice.id}`">
                    <BaseButton size="sm" color="primary" variant="outline">
                      <Icon name="ph:eye" class="size-4" />
                    </BaseButton>
                  </NuxtLink>
                  <BaseButton size="sm" color="muted" variant="outline">
                    <Icon name="ph:download" class="size-4" />
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between">
        <BaseParagraph size="sm" class="text-muted-500">
          نمایش 1 تا {{ invoices.length }} از {{ invoices.length }} فاکتور
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
