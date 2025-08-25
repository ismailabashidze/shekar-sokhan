<template>
  <div class="order-detail space-y-8">
    <BaseCard class="p-6">
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
            جزئیات سفارش #{{ order.id }}
          </BaseHeading>
          <BaseDropdown>
            <template #trigger>
              <BaseButton variant="solid" color="primary" size="lg" rounded="lg">
                تغییر وضعیت
                <Icon name="mdi:chevron-down" class="mr-2" />
              </BaseButton>
            </template>
            <BaseDropdownItem 
              v-for="status in nextPossibleStatuses" 
              :key="status.value"
              @click="changeStatus(status.value)"
              class="text-base py-3"
            >
              {{ status.label }}
            </BaseDropdownItem>
          </BaseDropdown>
        </div>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        <div>
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            اطلاعات خریدار
          </BaseHeading>
          <div class="space-y-5">
            <div class="flex items-start">
              <Icon name="mdi:account" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
              <div>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                  نام خریدار
                </BaseParagraph>
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                  {{ order.buyerName }}
                </BaseParagraph>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="mdi:phone" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
              <div>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                  تلفن تماس
                </BaseParagraph>
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                  {{ order.buyerPhone }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            اطلاعات سفارش
          </BaseHeading>
          <div class="space-y-5">
            <div class="flex items-start">
              <Icon name="mdi:package-variant" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
              <div>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                  محصول
                </BaseParagraph>
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                  {{ order.loadDetails.productName }}
                </BaseParagraph>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="mdi:scale" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
              <div>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                  مقدار
                </BaseParagraph>
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                  {{ order.quantity_kg }} کیلوگرم
                </BaseParagraph>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="mdi:currency-usd" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
              <div>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                  قیمت کل
                </BaseParagraph>
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                  {{ formatPrice(order.total_price) }} تومان
                </BaseParagraph>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="mdi:progress-clock" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
              <div>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                  وضعیت
                </BaseParagraph>
                <BaseTag :color="getStatusColor(order.status)" variant="solid" size="lg">
                  {{ getStatusText(order.status) }}
                </BaseTag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BaseCard class="p-6">
        <template #header>
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            تاریخچه وضعیت
          </BaseHeading>
        </template>
        <div class="relative">
          <div class="absolute right-5 top-0 bottom-0 w-1 bg-muted-200 dark:bg-muted-700"></div>
          <div class="space-y-8 pl-12">
            <div v-for="(status, index) in statusHistory" :key="index" class="relative">
              <div class="absolute -right-14 top-0 w-8 h-8 rounded-full bg-primary-500 border-4 border-white dark:border-muted-900 flex items-center justify-center">
                <Icon 
                  v-if="index === statusHistory.length - 1" 
                  name="mdi:check" 
                  class="w-4 h-4 text-white" 
                />
                <div 
                  v-else 
                  class="w-2 h-2 rounded-full bg-white"
                ></div>
              </div>
              <div class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl border border-muted-200 dark:border-muted-700">
                <div class="flex justify-between items-start mb-3">
                  <BaseHeading tag="h3" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
                    {{ getStatusText(status.status) }}
                  </BaseHeading>
                  <BaseTag :color="getStatusColor(status.status)" variant="solid" size="md">
                    {{ status.date }}
                  </BaseTag>
                </div>
                <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                  {{ status.description }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="p-6">
        <template #header>
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            اطلاعات تحویل
          </BaseHeading>
        </template>
        <div class="space-y-6">
          <div class="flex items-start">
            <Icon name="mdi:truck-delivery" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
            <div>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                روش تحویل
              </BaseParagraph>
              <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                {{ order.delivery_method === 'pickup_from_distributor' ? 'تحویل از توزیع‌کننده' : 'تحویل مستقیم' }}
              </BaseParagraph>
            </div>
          </div>
          <div v-if="order.delivery_address" class="flex items-start">
            <Icon name="mdi:map-marker" class="w-6 h-6 text-muted-400 ml-4 mt-1" />
            <div>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                آدرس تحویل
              </BaseParagraph>
              <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                {{ order.delivery_address }}
              </BaseParagraph>
            </div>
          </div>
          <div class="h-64 bg-muted-100 dark:bg-muted-800 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-200 dark:border-muted-700">
            <div class="text-center">
              <Icon name="mdi:map-marker-radius" class="w-12 h-12 text-muted-400 dark:text-muted-500 mx-auto mb-3" />
              <BaseParagraph size="lg" class="text-muted-500 dark:text-muted-400">
                نقشه مسیر (Tairo Map Component)
              </BaseParagraph>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DistributorOrder } from '../types'

definePageMeta({
  title: 'جزئیات سفارش',
  icon: 'mdi:clipboard-text',
  layout: 'distributor'
})

useHead({
  title: 'جزئیات سفارش - با هم',
  meta: [
    { name: 'description', content: 'جزئیات سفارش توزیع‌کننده در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

// Mock data for a specific order
const order: DistributorOrder = {
  id: 'ORD-001',
  buyerName: 'فروشگاه سبز',
  buyerPhone: '09123456789',
  quantity_kg: 150,
  total_price: 4500000,
  status: 'pending',
  delivery_method: 'pickup_from_distributor',
  loadDetails: {
    productName: 'سیب زمینی مرغوب'
  }
}

const statusHistory = [
  {
    status: 'pending',
    date: '1403/05/20',
    description: 'سفارش ثبت شد و در انتظار تأیید توزیع‌کننده است'
  },
  {
    status: 'confirmed_by_provider',
    date: '1403/05/20',
    description: 'سفارش توسط توزیع‌کننده تأیید شد'
  }
]

const nextPossibleStatuses = [
  { value: 'shipped', label: 'ارسال شده' },
  { value: 'out_for_delivery', label: 'در مسیر تحویل' },
  { value: 'delivered', label: 'تحویل داده شده' }
]

const changeStatus = (status: string) => {
  order.status = status as any
  // In a real app, we would update the backend
  alert(`وضعیت سفارش به "${getStatusText(status)}" تغییر کرد`)
}

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'در انتظار',
    'confirmed_by_provider': 'تأیید شده',
    'shipped': 'ارسال شده',
    'out_for_delivery': 'در مسیر تحویل',
    'delivered': 'تحویل داده شده',
    'cancelled': 'لغو شده'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'pending': 'warning',
    'confirmed_by_provider': 'info',
    'shipped': 'primary',
    'out_for_delivery': 'purple',
    'delivered': 'success',
    'cancelled': 'danger'
  }
  return colorMap[status] || 'secondary'
}
</script>