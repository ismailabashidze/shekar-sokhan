<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'سفارشات من - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'سفارشات من - با هم',
  meta: [
    { name: 'description', content: 'تاریخچه سفارشات شما در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 
})

// Define types
interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  unit: string
}

interface Order {
  id: number
  createdAt: Date
  totalPrice: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  deliveryAddress: string
  paymentMethod: string
  trackingNumber?: string
}

// Reactive data
const orders = ref<Order[]>([])
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all')
const router = useRouter()

// Status translations
const statusTranslations = {
  pending: 'در انتظار تأیید',
  confirmed: 'تأیید شده',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده'
}

// Status classes
const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

// Filtered orders
const filteredOrders = computed(() => {
  let result = [...orders.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.id.toString().includes(query) ||
      order.items.some(item => item.productName.toLowerCase().includes(query))
    )
  }
  
  // Apply status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(order => order.status === selectedStatus.value)
  }
  
  return result
})

// Methods
const viewOrderDetails = (orderId: number) => {
  router.push(`/baham/buyer/orders/${orderId}`)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Initialize with mock data
const initializeOrders = () => {
  orders.value = [
    {
      id: 1001,
      createdAt: new Date('2023-05-15'),
      totalPrice: 1250000,
      status: 'delivered',
      deliveryAddress: 'تهران، خیابان ولیعصر، پلاک 123',
      paymentMethod: 'کارت بانکی',
      trackingNumber: 'TRK123456789',
      items: [
        {
          id: 1,
          productId: 101,
          productName: 'گوجه فرنگی تازه',
          quantity: 5,
          price: 25000,
          unit: 'کیلوگرم'
        },
        {
          id: 2,
          productId: 102,
          productName: 'سیب زمینی',
          quantity: 10,
          price: 18000,
          unit: 'کیلوگرم'
        }
      ]
    },
    {
      id: 1002,
      createdAt: new Date('2023-05-20'),
      totalPrice: 890000,
      status: 'shipped',
      deliveryAddress: 'تهران، خیابان فerdowsi، پلاک 45',
      paymentMethod: 'کیف پول',
      trackingNumber: 'TRK987654321',
      items: [
        {
          id: 3,
          productId: 103,
          productName: 'پیاز',
          quantity: 8,
          price: 15000,
          unit: 'کیلوگرم'
        }
      ]
    },
    {
      id: 1003,
      createdAt: new Date('2023-05-25'),
      totalPrice: 2100000,
      status: 'confirmed',
      deliveryAddress: 'تهران، میدان تجریش، خیابان شیراز جنوبی، پلاک 67',
      paymentMethod: 'کارت بانکی',
      items: [
        {
          id: 4,
          productId: 104,
          productName: 'هویج',
          quantity: 15,
          price: 20000,
          unit: 'کیلوگرم'
        },
        {
          id: 5,
          productId: 105,
          productName: 'قارچ',
          quantity: 3,
          price: 40000,
          unit: 'کیلوگرم'
        }
      ]
    },
    {
      id: 1004,
      createdAt: new Date('2023-06-01'),
      totalPrice: 750000,
      status: 'pending',
      deliveryAddress: 'تهران، خیابان انقلاب، پلاک 89',
      paymentMethod: 'کارت بانکی',
      items: [
        {
          id: 6,
          productId: 106,
          productName: 'کاهو',
          quantity: 4,
          price: 30000,
          unit: 'کیلوگرم'
        }
      ]
    },
    {
      id: 1005,
      createdAt: new Date('2023-06-05'),
      totalPrice: 1500000,
      status: 'cancelled',
      deliveryAddress: 'تهران، خیابان آزادی، پلاک 101',
      paymentMethod: 'کیف پول',
      items: [
        {
          id: 7,
          productId: 107,
          productName: 'خیار',
          quantity: 6,
          price: 25000,
          unit: 'کیلوگرم'
        }
      ]
    }
  ]
}

// Lifecycle
onMounted(() => {
  initializeOrders()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">سفارشات من</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">تاریخچه سفارشات شما</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
            <Icon name="ph:package-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">مجموع سفارشات</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ orders.length }}</p>
          </div>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TairoInput
          v-model="searchQuery"
          placeholder="جستجو در سفارشات..."
          icon="ph:magnifying-glass-duotone"
          class="w-full"
          rounded="lg"
        />
        
        <TairoSelect
          v-model="selectedStatus"
          :options="[
            { label: 'همه وضعیت‌ها', value: 'all' },
            { label: 'در انتظار تأیید', value: 'pending' },
            { label: 'تأیید شده', value: 'confirmed' },
            { label: 'ارسال شده', value: 'shipped' },
            { label: 'تحویل داده شده', value: 'delivered' },
            { label: 'لغو شده', value: 'cancelled' }
          ]"
          rounded="lg"
        />
        
        <TairoButton 
          variant="outline" 
          color="secondary" 
          class="w-full"
          rounded="lg"
          @click="() => { searchQuery = ''; selectedStatus = 'all'; }"
        >
          <Icon name="ph:funnel-duotone" class="h-4 w-4 ml-2" />
          پاک کردن فیلترها
        </TairoButton>
      </div>
    </div>
    
    <!-- Orders Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center">
          <div class="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-2 mr-3">
            <Icon name="ph:clock-duotone" class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-400">در انتظار</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ orders.filter(o => o.status === 'pending').length }}
            </p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center">
          <div class="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2 mr-3">
            <Icon name="ph:check-circle-duotone" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-400">تأیید شده</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ orders.filter(o => o.status === 'confirmed').length }}
            </p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center">
          <div class="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-2 mr-3">
            <Icon name="ph:truck-duotone" class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-400">ارسال شده</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ orders.filter(o => o.status === 'shipped').length }}
            </p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center">
          <div class="rounded-lg bg-green-100 dark:bg-green-900/30 p-2 mr-3">
            <Icon name="ph:gift-duotone" class="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-400">تحویل داده شده</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ orders.filter(o => o.status === 'delivered').length }}
            </p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center">
          <div class="rounded-lg bg-red-100 dark:bg-red-900/30 p-2 mr-3">
            <Icon name="ph:x-circle-duotone" class="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-400">لغو شده</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ orders.filter(o => o.status === 'cancelled').length }}
            </p>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Orders Table -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 mb-8">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-muted-800">
            <tr>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">شماره سفارش</th>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ</th>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">آیتم‌ها</th>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مبلغ</th>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
              <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-muted-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="hover:bg-gray-50 dark:hover:bg-muted-800 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                #{{ order.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <div class="flex flex-col gap-1">
                  <span v-for="item in order.items" :key="item.id">
                    {{ item.productName }} ({{ item.quantity }} {{ item.unit }})
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(order.totalPrice) }} ریال
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(order.status)"
                >
                  {{ statusTranslations[order.status] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <TairoButton
                  @click="viewOrderDetails(order.id)"
                  variant="solid"
                  color="primary"
                  size="sm"
                  rounded="lg"
                >
                  <Icon name="ph:eye-duotone" class="h-4 w-4 ml-1" />
                  مشاهده جزئیات
                </TairoButton>
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
          @click="() => { searchQuery = ''; selectedStatus = 'all'; }"
        >
          <Icon name="ph:funnel-x-duotone" class="h-4 w-4 ml-2" />
          پاک کردن فیلترها
        </TairoButton>
      </div>
    </BaseCard>
    
    <!-- Summary -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400">
        نمایش {{ filteredOrders.length }} سفارش از مجموع {{ orders.length }} سفارش
      </TairoParagraph>
      <div class="flex gap-2">
        <TairoButton 
          variant="outline" 
          color="primary" 
          size="sm"
          rounded="lg"
          disabled
        >
          <Icon name="ph:caret-left-duotone" class="h-4 w-4 ml-1" />
          قبلی
        </TairoButton>
        <TairoButton 
          variant="outline" 
          color="primary" 
          size="sm"
          rounded="lg"
          disabled
        >
          بعدی
          <Icon name="ph:caret-right-duotone" class="h-4 w-4 mr-1" />
        </TairoButton>
      </div>
    </div>
  </div>
</template>