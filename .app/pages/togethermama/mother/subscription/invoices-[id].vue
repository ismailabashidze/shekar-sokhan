<script setup lang="ts">
definePageMeta({
  title: 'جزئیات فاکتور',
  layout: 'default',
})

// Mock invoice data
const invoice = {
  id: 'INV-001',
  date: '1402/02/15',
  dueDate: '1402/02/15',
  amount: '899,000',
  status: 'paid',
  plan: 'بسته استاندارد',
  customer: {
    name: 'زهرا محمدی',
    email: 'zahra.m@gmail.com',
    phone: '09123456789',
  },
  items: [
    {
      description: 'بسته استاندارد (ماهانه)',
      quantity: 1,
      price: '899,000',
      total: '899,000',
    },
  ],
  subtotal: '899,000',
  tax: '0',
  total: '899,000',
}

const downloadInvoice = () => {
  // Mock function for downloading invoice
  alert('فاکتور دانلود می‌شود')
}

const printInvoice = () => {
  // Mock function for printing invoice
  alert('صفحه چاپ فاکتور باز می‌شود')
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
        <span>جزئیات فاکتور</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>شماره فاکتور: {{ invoice.id }}</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Invoice Details -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <BaseHeading
                as="h2"
                size="lg"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                فاکتور #{{ invoice.id }}
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500">
                تاریخ: {{ invoice.date }}
              </BaseParagraph>
            </div>
            <BaseTag
              :color="invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'danger'"
              variant="solid"
            >
              {{ invoice.status === 'paid' ? 'پرداخت شده' : invoice.status === 'pending' ? 'در انتظار' : 'لغو شده' }}
            </BaseTag>
          </div>

          <!-- Invoice Items -->
          <div class="mb-6">
            <table class="w-full">
              <thead>
                <tr class="border-b border-muted-200 dark:border-muted-700 text-right">
                  <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">شرح</th>
                  <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">تعداد</th>
                  <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">قیمت واحد</th>
                  <th class="pb-4 text-sm font-semibold text-muted-500 dark:text-muted-400">جمع</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in invoice.items"
                  :key="index"
                >
                  <td class="py-4 text-sm text-muted-800 dark:text-white">
                    {{ item.description }}
                  </td>
                  <td class="py-4 text-sm text-muted-500">
                    {{ item.quantity }}
                  </td>
                  <td class="py-4 text-sm text-muted-500">
                    {{ item.price }} تومان
                  </td>
                  <td class="py-4 text-sm font-medium text-muted-800 dark:text-white">
                    {{ item.total }} تومان
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Invoice Totals -->
          <div class="mb-6">
            <div class="ml-auto max-w-xs">
              <div class="flex items-center justify-between py-2">
                <BaseParagraph size="sm" class="text-muted-500">جمع کل:</BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ invoice.subtotal }} تومان
                </BaseParagraph>
              </div>
              <div class="flex items-center justify-between py-2">
                <BaseParagraph size="sm" class="text-muted-500">مالیات:</BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ invoice.tax }} تومان
                </BaseParagraph>
              </div>
              <div class="mt-4 flex items-center justify-between border-t border-muted-200 pt-4 dark:border-muted-700">
                <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                  مجموع:
                </BaseHeading>
                <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                  {{ invoice.total }} تومان
                </BaseHeading>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <BaseButton color="primary" variant="solid" @click="downloadInvoice">
              <Icon name="ph:download" class="mr-2 size-5" />
              <span>دانلود فاکتور</span>
            </BaseButton>
            <BaseButton color="muted" variant="outline" @click="printInvoice">
              <Icon name="ph:printer" class="mr-2 size-5" />
              <span>چاپ فاکتور</span>
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Customer Info -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              اطلاعات مشتری
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-1">نام</BaseParagraph>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ invoice.customer.name }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-1">ایمیل</BaseParagraph>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ invoice.customer.email }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-1">تلفن</BaseParagraph>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ invoice.customer.phone }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>

        <!-- Payment Info -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              اطلاعات پرداخت
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-1">تاریخ فاکتور</BaseParagraph>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ invoice.date }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-1">تاریخ سررسید</BaseParagraph>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ invoice.dueDate }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-1">وضعیت</BaseParagraph>
              <BaseTag
                :color="invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'danger'"
                variant="pastel"
              >
                {{ invoice.status === 'paid' ? 'پرداخت شده' : invoice.status === 'pending' ? 'در انتظار' : 'لغو شده' }}
              </BaseTag>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
