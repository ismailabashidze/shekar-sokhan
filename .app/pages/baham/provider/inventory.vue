<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'مدیریت موجودی',
  layout: 'sidebar',
})

useHead({
  title: 'مدیریت موجودی | با هم',
  htmlAttrs: { dir: 'rtl' },
})

// Mock data for inventory
const inventoryItems = ref([])

onMounted(() => {
  // Mock data initialization
  inventoryItems.value = [
    {
      id: '1',
      productName: 'سیب زمینی مرغوب',
      category: 'صیفی‌جات',
      currentStock: 1500,
      reservedStock: 400,
      availableStock: 1100,
      unit: 'کیلوگرم',
      lastUpdated: new Date()
    },
    {
      id: '2',
      productName: 'پیاز زرد',
      category: 'صیفی‌جات',
      currentStock: 800,
      reservedStock: 200,
      availableStock: 600,
      unit: 'کیلوگرم',
      lastUpdated: new Date()
    },
    {
      id: '3',
      productName: 'گوجه فرنگی',
      category: 'صیفی‌جات',
      currentStock: 500,
      reservedStock: 150,
      availableStock: 350,
      unit: 'کیلوگرم',
      lastUpdated: new Date()
    },
    {
      id: '4',
      productName: 'سیر',
      category: 'سبزیجات',
      currentStock: 300,
      reservedStock: 50,
      availableStock: 250,
      unit: 'کیلوگرم',
      lastUpdated: new Date()
    },
    {
      id: '5',
      productName: 'هویج',
      category: 'صیفی‌جات',
      currentStock: 400,
      reservedStock: 100,
      availableStock: 300,
      unit: 'کیلوگرم',
      lastUpdated: new Date()
    },
    {
      id: '6',
      productName: 'کاهو',
      category: 'سبزیجات',
      currentStock: 200,
      reservedStock: 50,
      availableStock: 150,
      unit: 'کیلوگرم',
      lastUpdated: new Date()
    }
  ]
})

// Calculate summary data
const totalStock = inventoryItems.value.reduce((sum, item) => sum + item.currentStock, 0)
const totalReserved = inventoryItems.value.reduce((sum, item) => sum + item.reservedStock, 0)
const totalAvailable = inventoryItems.value.reduce((sum, item) => sum + item.availableStock, 0)
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          مدیریت موجودی
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          نمایش و مدیریت موجودی محصولات
        </BaseText>
      </template>
      
      <template #right>
        <BaseButton color="primary" variant="solid">
          <Icon name="ph:plus" class="size-4" />
          <span>به‌روزرسانی موجودی</span>
        </BaseButton>
      </template>
      
      <!-- Inventory Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                کل موجودی
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مجموع کل موجودی
              </BaseText>
            </div>
            <div class="bg-primary-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:package-duotone" class="text-primary-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-primary-500">
            {{ totalStock }} کیلو
          </BaseHeading>
        </BaseCard>
        
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                موجودی رزرو شده
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                رزرو شده برای سفارش‌ها
              </BaseText>
            </div>
            <div class="bg-warning-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:clock-duotone" class="text-warning-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-warning-500">
            {{ totalReserved }} کیلو
          </BaseHeading>
        </BaseCard>
        
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                موجودی قابل فروش
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                آماده برای فروش
              </BaseText>
            </div>
            <div class="bg-success-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-success-500">
            {{ totalAvailable }} کیلو
          </BaseHeading>
        </BaseCard>
        
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                تعداد محصولات
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                انواع محصولات موجود
              </BaseText>
            </div>
            <div class="bg-purple-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:tag-duotone" class="text-purple-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-purple-500">
            {{ inventoryItems.length }}
          </BaseHeading>
        </BaseCard>
      </div>
      
      <!-- Inventory Table -->
      <BaseCard rounded="sm" class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <BaseHeading as="h2" size="lg" weight="medium">
              موجودی محصولات
            </BaseHeading>
            <BaseText size="sm" class="text-muted-400 mt-1">
              لیست تمام محصولات و موجودی آنها
            </BaseText>
          </div>
        </div>
        
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                نام محصول
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                دسته‌بندی
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                موجودی کل
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                رزرو شده
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                قابل فروش
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                آخرین به‌روزرسانی
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced class="text-end">
                عملیات
              </TairoTableHeading>
            </template>
            
            <TairoTableRow v-for="item in inventoryItems" :key="item.id">
              <TairoTableCell spaced>
                <div class="font-medium">{{ item.productName }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ item.category }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ item.currentStock }} {{ item.unit }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ item.reservedStock }} {{ item.unit }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ item.availableStock }} {{ item.unit }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ new Date(item.lastUpdated).toLocaleDateString('fa-IR') }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex justify-end">
                  <BaseButton color="primary" variant="pastel" size="sm">
                    <Icon name="ph:pencil-simple" class="size-4" />
                    <span>ویرایش</span>
                  </BaseButton>
                </div>
              </TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </BaseCard>
      
      <!-- Inventory Chart Placeholder -->
      <BaseCard rounded="sm" class="p-6 mt-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <BaseHeading as="h2" size="lg" weight="medium">
              نمودار موجودی
            </BaseHeading>
            <BaseText size="sm" class="text-muted-400 mt-1">
              تحلیل موجودی محصولات
            </BaseText>
          </div>
        </div>
        
        <div class="h-64 flex items-center justify-center bg-muted-100 dark:bg-muted-800 rounded-lg">
          <div class="text-center">
            <Icon name="ph:chart-bar-duotone" class="text-muted-400 size-12 mx-auto mb-3" />
            <BaseText size="sm" class="text-muted-500">
              نمودار موجودی محصولات در اینجا نمایش داده می‌شود
            </BaseText>
          </div>
        </div>
      </BaseCard>
    </TairoContentWrapper>
  </div>
</template>