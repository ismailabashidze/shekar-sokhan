<script setup lang="ts">
definePageMeta({
  title: 'مدیریت بارها - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مدیریت بارها - با هم',
  meta: [
    { name: 'description', content: 'مدیریت بارهای پلتفرم با هم' }
  ]
})

// Mock data for loads
const loads = [
  {
    id: '1',
    productName: 'سیب زمینی مرغوب',
    provider: 'محمد رضایی',
    totalQuantity: 1000,
    availableQuantity: 750,
    pricePerKg: 8000,
    status: 'active',
    availabilityDate: new Date('2023-06-15'),
    expiryDate: new Date('2023-06-20')
  },
  {
    id: '2',
    productName: 'پیاز زرد',
    provider: 'علی احمدی',
    totalQuantity: 500,
    availableQuantity: 0,
    pricePerKg: 12000,
    status: 'completed',
    availabilityDate: new Date('2023-06-10'),
    expiryDate: new Date('2023-06-18')
  },
  {
    id: '3',
    productName: 'گوجه فرنگی',
    provider: 'زهرا کریمی',
    totalQuantity: 300,
    availableQuantity: 300,
    pricePerKg: 25000,
    status: 'active',
    availabilityDate: new Date('2023-06-16'),
    expiryDate: new Date('2023-06-22')
  }
]

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'completed': return 'bg-blue-100 text-blue-800'
    case 'expired': return 'bg-red-100 text-red-800'
    case 'canceled': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'فعال'
    case 'completed': return 'تکمیل شده'
    case 'expired': return 'منقضی شده'
    case 'canceled': return 'لغو شده'
    default: return status
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          مدیریت بارها
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          لیست تمام بارهای ثبت شده در پلتفرم
        </BaseParagraph>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton color="primary">
          <Icon name="ph:plus-duotone" class="size-5 mr-2" />
          افزودن بار جدید
        </BaseButton>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900 mb-8">
      <div class="p-6">
        <!-- Search and Filters -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <BaseInput
              placeholder="جستجوی بارها..."
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
              <option value="active">فعال</option>
              <option value="completed">تکمیل شده</option>
              <option value="expired">منقضی شده</option>
              <option value="canceled">لغو شده</option>
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
    
    <!-- Loads Table -->
    <TairoTable rounded="lg" class="dark:!bg-muted-900">
      <template #header>
        <TairoTableHeading>محصول</TairoTableHeading>
        <TairoTableHeading>ارائه‌دهنده</TairoTableHeading>
        <TairoTableHeading>مقدار کل (کیلو)</TairoTableHeading>
        <TairoTableHeading>موجودی (کیلو)</TairoTableHeading>
        <TairoTableHeading>قیمت هر کیلو (ریال)</TairoTableHeading>
        <TairoTableHeading>وضعیت</TairoTableHeading>
        <TairoTableHeading>تاریخ در دسترسی</TairoTableHeading>
        <TairoTableHeading>تاریخ انقضا</TairoTableHeading>
        <TairoTableHeading class="text-center">عملیات</TairoTableHeading>
      </template>
      
      <TairoTableRow v-for="load in loads" :key="load.id">
        <TairoTableCell>
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-10 items-center justify-center mr-3">
              <Icon name="ph:package-duotone" class="text-primary-500 size-5" />
            </div>
            <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
              {{ load.productName }}
            </BaseParagraph>
          </div>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ load.provider }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ load.totalQuantity.toLocaleString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ load.availableQuantity.toLocaleString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ load.pricePerKg.toLocaleString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseBadge 
            :color="load.status === 'active' ? 'success' : 
                   load.status === 'completed' ? 'info' : 
                   load.status === 'expired' ? 'danger' : 'default'" 
            rounded="lg"
            class="capitalize"
          >
            {{ getStatusText(load.status) }}
          </BaseBadge>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ new Date(load.availabilityDate).toLocaleDateString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ new Date(load.expiryDate).toLocaleDateString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell class="text-center">
          <div class="flex justify-center space-x-2 rtl:space-x-reverse">
            <BaseButton color="primary" size="sm" outlined>
              مشاهده
            </BaseButton>
            <BaseButton color="danger" size="sm" outlined>
              حذف
            </BaseButton>
          </div>
        </TairoTableCell>
      </TairoTableRow>
    </TairoTable>
    
    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
        نمایش <span class="font-medium">1</span> تا <span class="font-medium">3</span> از <span class="font-medium">3</span> بار
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