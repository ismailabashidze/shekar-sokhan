<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">مدیریت سفارشات</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">سفارشات دریافتی شما</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
            <Icon name="ph:package-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">مجموع سفارشات</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ allOrders.length }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">لیست سفارشات</h2>
          <div class="flex flex-wrap gap-2">
            <TairoButton 
              @click="filterOrders('all')" 
              :variant="activeFilter === 'all' ? 'solid' : 'outline'"
              color="primary"
              size="sm"
              rounded="lg"
            >
              همه سفارشات
            </TairoButton>
            <TairoButton 
              @click="filterOrders('pending')" 
              :variant="activeFilter === 'pending' ? 'solid' : 'outline'"
              color="primary"
              size="sm"
              rounded="lg"
            >
              جدید
            </TairoButton>
            <TairoButton 
              @click="filterOrders('confirmed_by_provider')" 
              :variant="activeFilter === 'confirmed_by_provider' ? 'solid' : 'outline'"
              color="primary"
              size="sm"
              rounded="lg"
            >
              تأیید شده
            </TairoButton>
            <TairoButton 
              @click="filterOrders('delivered')" 
              :variant="activeFilter === 'delivered' ? 'solid' : 'outline'"
              color="primary"
              size="sm"
              rounded="lg"
            >
              تحویل داده شده
            </TairoButton>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-muted-800">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">شناسه سفارش</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">خریدار</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">محصول</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مقدار</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">قیمت کل</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-muted-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="hover:bg-gray-50 dark:hover:bg-muted-800 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ order.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div>{{ order.buyerName }}</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs mt-1">{{ order.buyerPhone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ order.loadDetails.productName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ new Intl.NumberFormat('fa-IR').format(order.quantity_kg) }} کیلوگرم
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ new Intl.NumberFormat('fa-IR').format(order.total_price) }} ریال
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <TairoBadge :color="getStatusColor(order.status)">
                  {{ getStatusText(order.status) }}
                </TairoBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <NuxtLink :to="`/baham/distributor/orders/${order.id}`">
                  <TairoButton variant="outline" color="primary" size="sm" rounded="lg">
                    جزئیات
                  </TairoButton>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredOrders.length === 0" class="text-center py-16">
        <Icon name="ph:package-duotone" class="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">سفارشی یافت نشد</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">بر اساس فیلترهای انتخابی شما، سفارشی یافت نشد</p>
        <TairoButton 
          variant="solid" 
          color="primary" 
          rounded="lg"
          @click="filterOrders('all')"
        >
          <Icon name="ph:funnel-x-duotone" class="h-4 w-4 ml-2" />
          بازنشانی فیلترها
        </TairoButton>
      </div>
      
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          نمایش {{ filteredOrders.length }} سفارش از مجموع {{ allOrders.length }} سفارش
        </div>
        <div class="flex gap-2">
          <TairoButton 
            variant="outline" 
            color="primary" 
            size="sm"
            rounded="lg"
            :disabled="pagination.page <= 1"
            @click="updatePagination({ page: pagination.page - 1 })"
          >
            <Icon name="ph:caret-left-duotone" class="h-4 w-4 ml-1" />
            قبلی
          </TairoButton>
          <TairoButton 
            variant="outline" 
            color="primary" 
            size="sm"
            rounded="lg"
            :disabled="pagination.page >= Math.ceil(allOrders.length / pagination.perPage)"
            @click="updatePagination({ page: pagination.page + 1 })"
          >
            بعدی
            <Icon name="ph:caret-right-duotone" class="h-4 w-4 mr-1" />
          </TairoButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'مدیریت سفارشات',
  icon: 'mdi:clipboard-list',
  layout: 'distributor'
})

useHead({
  title: 'مدیریت سفارشات - با هم',
  meta: [
    { name: 'description', content: 'مدیریت سفارشات توزیع‌کننده در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

const loading = ref(false)
const activeFilter = ref('all')

// Mock data for orders
const allOrders = ref([
  {
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
  },
  {
    id: 'ORD-002',
    buyerName: 'سوپرمارکت طلایی',
    buyerPhone: '09129876543',
    quantity_kg: 200,
    total_price: 6000000,
    status: 'confirmed_by_provider',
    delivery_method: 'pickup_from_distributor',
    loadDetails: {
      productName: 'پیاز زرد'
    }
  },
  {
    id: 'ORD-003',
    buyerName: 'رستوران آبی',
    buyerPhone: '09124567890',
    quantity_kg: 80,
    total_price: 2400000,
    status: 'shipped',
    delivery_method: 'pickup_from_distributor',
    loadDetails: {
      productName: 'سیر خشک'
    }
  },
  {
    id: 'ORD-004',
    buyerName: 'فروشگاه میوه‌فروشی',
    buyerPhone: '09125678901',
    quantity_kg: 120,
    total_price: 3600000,
    status: 'out_for_delivery',
    delivery_method: 'pickup_from_distributor',
    loadDetails: {
      productName: 'گوجه فرنگی'
    }
  },
  {
    id: 'ORD-005',
    buyerName: 'سوپرمارکت نوین',
    buyerPhone: '09126789012',
    quantity_kg: 300,
    total_price: 9000000,
    status: 'delivered',
    delivery_method: 'pickup_from_distributor',
    loadDetails: {
      productName: 'هویج'
    }
  }
])

const pagination = ref({
  page: 1,
  perPage: 10,
  total: allOrders.value.length
})

const filteredOrders = computed(() => {
  let filtered = [...allOrders.value]
  
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeFilter.value)
  }
  
  // Apply pagination
  const start = (pagination.value.page - 1) * pagination.value.perPage
  const end = start + pagination.value.perPage
  return filtered.slice(start, end)
})

const filterOrders = (filter: string) => {
  activeFilter.value = filter
  pagination.value.page = 1
}

const updatePagination = (newPagination: any) => {
  pagination.value = { ...pagination.value, ...newPagination }
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