<script setup lang="ts">
definePageMeta({
  title: 'مدیریت سفارشات - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مدیریت سفارشات - با هم',
  meta: [
    { name: 'description', content: 'مدیریت سفارشات پلتفرم با هم' }
  ]
})

// Mock data for orders
const orders = [
  {
    id: '1001',
    buyer: 'زهرا احمدی',
    product: 'سیب زمینی مرغوب',
    quantity: 50,
    totalPrice: 400000,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: new Date('2023-06-12')
  },
  {
    id: '1002',
    buyer: 'حسین کریمی',
    product: 'پیاز زرد',
    quantity: 30,
    totalPrice: 360000,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: new Date('2023-06-13')
  },
  {
    id: '1003',
    buyer: 'مریم رضایی',
    product: 'گوجه فرنگی',
    quantity: 20,
    totalPrice: 500000,
    status: 'confirmed_by_provider',
    paymentStatus: 'paid',
    createdAt: new Date('2023-06-14')
  }
]

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'confirmed_by_provider': return 'bg-blue-100 text-blue-800'
    case 'shipped': return 'bg-indigo-100 text-indigo-800'
    case 'out_for_delivery': return 'bg-purple-100 text-purple-800'
    case 'delivered': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'در انتظار تایید'
    case 'confirmed_by_provider': return 'تایید شده توسط ارائه‌دهنده'
    case 'shipped': return 'ارسال شده'
    case 'out_for_delivery': return 'در حال تحویل'
    case 'delivered': return 'تحویل داده شده'
    case 'cancelled': return 'لغو شده'
    default: return status
  }
}

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'پرداخت شده'
    case 'pending': return 'در انتظار پرداخت'
    case 'failed': return 'پرداخت ناموفق'
    default: return status
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          مدیریت سفارشات
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          لیست تمام سفارشات ثبت شده در پلتفرم
        </BaseParagraph>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton color="primary">
          <Icon name="ph:plus-duotone" class="size-5 mr-2" />
          ایجاد سفارش دستی
        </BaseButton>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900 mb-8">
      <div class="p-6">
        <!-- Search and Filters -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <BaseInput
              placeholder="جستجوی سفارشات..."
              rounded="sm"
              :classes="{
                wrapper: 'w-full'
              }"
            >
              <template #addon>
                <Icon name="ph:magnifying-glass-duotone" class="size-5 text-muted-400" />
              </template>
            </BaseInput>
          </div>
          <div>
            <BaseSelect rounded="sm">
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار تایید</option>
              <option value="confirmed_by_provider">تایید شده توسط ارائه‌دهنده</option>
              <option value="shipped">ارسال شده</option>
              <option value="out_for_delivery">در حال تحویل</option>
              <option value="delivered">تحویل داده شده</option>
              <option value="cancelled">لغو شده</option>
            </BaseSelect>
          </div>
          <div>
            <BaseSelect rounded="sm">
              <option value="">همه محصولات</option>
              <option value="potato">سیب زمینی</option>
              <option value="onion">پیاز</option>
              <option value="tomato">گوجه فرنگی</option>
            </BaseSelect>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <!-- Orders Table -->
    <TairoTable rounded="lg" class="dark:!bg-muted-900">
      <template #header>
        <TairoTableHeading>شناسه سفارش</TairoTableHeading>
        <TairoTableHeading>خریدار</TairoTableHeading>
        <TairoTableHeading>محصول</TairoTableHeading>
        <TairoTableHeading>مقدار (کیلو)</TairoTableHeading>
        <TairoTableHeading>مبلغ کل (ریال)</TairoTableHeading>
        <TairoTableHeading>وضعیت سفارش</TairoTableHeading>
        <TairoTableHeading>وضعیت پرداخت</TairoTableHeading>
        <TairoTableHeading>تاریخ ثبت</TairoTableHeading>
        <TairoTableHeading class="text-center">عملیات</TairoTableHeading>
      </template>
      
      <TairoTableRow v-for="order in orders" :key="order.id">
        <TairoTableCell>
          <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
            #{{ order.id }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ order.buyer }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ order.product }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ order.quantity.toLocaleString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ order.totalPrice.toLocaleString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseBadge 
            :color="order.status === 'delivered' ? 'success' : 
                   order.status === 'shipped' ? 'info' : 
                   order.status === 'confirmed_by_provider' ? 'primary' : 
                   order.status === 'pending' ? 'warning' : 'danger'" 
            rounded="lg"
            class="capitalize"
          >
            {{ getStatusText(order.status) }}
          </BaseBadge>
        </TairoTableCell>
        <TairoTableCell>
          <BaseBadge 
            :color="order.paymentStatus === 'paid' ? 'success' : 
                   order.paymentStatus === 'pending' ? 'warning' : 'danger'" 
            rounded="lg"
            class="capitalize"
          >
            {{ getPaymentStatusText(order.paymentStatus) }}
          </BaseBadge>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ new Date(order.createdAt).toLocaleDateString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell class="text-center">
          <BaseButton color="primary" size="sm" outlined>
            مشاهده جزئیات
          </BaseButton>
        </TairoTableCell>
      </TairoTableRow>
    </TairoTable>
    
    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
        نمایش <span class="font-medium">1</span> تا <span class="font-medium">3</span> از <span class="font-medium">3</span> سفارش
      </BaseParagraph>
      <div class="flex space-x-2 rtl:space-x-reverse">
        <BaseButton size="sm" color="default" outlined>
          قبلی
        </BaseButton>
        <BaseButton size="sm" color="primary">
          1
        </BaseButton>
        <BaseButton size="sm" color="default" outlined>
          بعدی
        </BaseButton>
      </div>
    </div>
  </div>
</template>