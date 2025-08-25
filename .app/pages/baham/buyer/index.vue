<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'پیشخوان - با هم',
  layout: 'sidebar',
})

useHead({
  title: 'پیشخوان - با هم',
  meta: [
    { name: 'description', content: 'ورود به حساب کاربری پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 
})

const router = useRouter()

// Mock data for the dashboard
const stats = ref({
  totalOrders: 12,
  pendingOrders: 3,
  totalSpent: 2450000,
  savedAmount: 180000,
  favoriteProducts: 8
})

const avgOrderValue = computed(() => {
  if (stats.value.totalOrders === 0) return 0
  return Math.round(stats.value.totalSpent / stats.value.totalOrders)
})

const quickActions = [
  { id: 1, title: 'ثبت سفارش', icon: 'fa6-solid:cart-plus', color: 'primary', action: () => router.push('/baham/buyer/marketplace') },
  { id: 2, title: 'سفارشات', icon: 'fa6-solid:box-open', color: 'info', action: () => router.push('/baham/buyer/orders') },
  { id: 3, title: 'راهنما', icon: 'ph:book-open', color: 'success', action: () => router.push('/baham/buyer/guide') },
  { id: 4, title: 'پیام‌ها', icon: 'fa6-solid:comments', color: 'warning', action: () => router.push('/baham/buyer/messages') }
]

const recentOrders = ref([
  { id: 'ORD-001', createdAt: new Date('2023-05-15'), totalPrice: 1250000, status: 'completed' },
  { id: 'ORD-002', createdAt: new Date('2023-05-18'), totalPrice: 875000, status: 'pending' },
  { id: 'ORD-003', createdAt: new Date('2023-05-20'), totalPrice: 2100000, status: 'shipped' },
  { id: 'ORD-004', createdAt: new Date('2023-05-22'), totalPrice: 650000, status: 'processing' }
])

const activeLoads = ref([
  {
    id: 1,
    product: {
      name: 'گوجه فرنگی تازه',
      category: 'سبزیجات',
      description: 'گوجه فرنگی محلی با کیفیت عالی، تازه برداشت شده از مزرعه'
    },
    pricePerKg: 28000,
    availableQuantityKg: 150,
    expiryDate: new Date('2023-05-30')
  },
  {
    id: 2,
    product: {
      name: 'سیب زمینی',
      category: 'سبزیجات',
      description: 'سیب زمینی محلی با پوست نازک و مزه عالی'
    },
    pricePerKg: 18000,
    availableQuantityKg: 300,
    expiryDate: new Date('2023-06-05')
  }
])

const statusTranslations = {
  pending: 'در انتظار',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده'
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'nui-tag nui-tag-md nui-tag-solid nui-tag-warning',
    processing: 'nui-tag nui-tag-md nui-tag-solid nui-tag-info',
    shipped: 'nui-tag nui-tag-md nui-tag-solid nui-tag-primary',
    completed: 'nui-tag nui-tag-md nui-tag-solid nui-tag-success',
    cancelled: 'nui-tag nui-tag-md nui-tag-solid nui-tag-danger'
  }
  return classes[status] || 'nui-tag nui-tag-md nui-tag-solid nui-tag-default'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          پیشخوان خریدار
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          خلاصه وضعیت و فعالیت‌های اخیر شما
        </BaseParagraph>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton 
          color="primary" 
          size="lg"
          rounded="lg"
          @click="router.push('/baham/buyer/marketplace')"
        >
          <Icon name="fa6-solid:cart-plus" class="size-5 ml-2" />
          ثبت سفارش جدید
        </BaseButton>
      </div>
    </div>
    <!-- Stats Overview -->
    <div class="space-y-4">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
        آمار کلی
      </BaseHeading>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        <!-- Total Orders Card -->
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-primary-500/10 p-4">
              <Icon name="fa6-solid:box-open" class="size-7 text-primary-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                مجموع سفارشات
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ stats.totalOrders }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="primary" 
              rounded="lg"
              @click="router.push('/baham/buyer/orders')"
            >
              مشاهده جزئیات
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <!-- Pending Orders Card -->
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-warning-500/10 p-4">
              <Icon name="fa6-solid:clock" class="size-7 text-warning-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                سفارشات در انتظار
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ stats.pendingOrders }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="warning" 
              rounded="lg"
              @click="router.push('/baham/buyer/orders?status=pending')"
            >
              پیگیری
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <!-- Total Spent Card -->
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-success-500/10 p-4">
              <Icon name="fa6-solid:money-bill" class="size-7 text-success-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                مجموع خرج شده
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ formatCurrency(stats.totalSpent) }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="success" 
              rounded="lg"
              @click="router.push('/baham/buyer/orders')"
            >
              گزارش مالی
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <!-- Average Order Value Card -->
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-amber-500/10 p-4">
              <Icon name="fa6-solid:chart-line" class="size-7 text-amber-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                میانگین هزینه سفارش
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ formatCurrency(avgOrderValue) }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="amber" 
              rounded="lg"
              @click="router.push('/baham/buyer/analytics')"
            >
              تحلیل بیشتر
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <!-- Savings Card -->
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-info-500/10 p-4">
              <Icon name="fa6-solid:percent" class="size-7 text-info-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                صرفه‌جویی
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white flex items-center">
                {{ formatCurrency(stats.savedAmount) }}
                <Icon name="fa6-solid:chart-line" class="size-4 text-success-500 mr-2" />
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="info" 
              rounded="lg"
              @click="router.push('/baham/buyer/marketplace?sort=discount')"
            >
              محصولات تخفیف‌دار
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <!-- Favorite Products Card -->
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-danger-500/10 p-4">
              <Icon name="fa6-solid:heart" class="size-7 text-danger-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                محصولات مورد علاقه
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ stats.favoriteProducts }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="danger" 
              rounded="lg"
              @click="router.push('/baham/buyer/favorites')"
            >
              مشاهده لیست
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
    
    <!-- Welcome Banner -->
    <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 p-6">
        <div class="flex items-center gap-5">
          <BaseAvatar size="xl" initials="علی" color="primary" />
          <div>
            <BaseHeading tag="h2" size="xl" weight="bold" class="text-muted-800 dark:text-white mb-1">
              خوش آمدید، علی محمدی!
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
              آخرین فعالیت‌های شما در پلتفرم با هم
            </BaseParagraph>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <BaseTag color="primary" variant="solid" size="lg">
            <Icon name="fa6-solid:star" class="size-4 ml-2" />
            خریدار ویژه
          </BaseTag>
          <BaseTag color="success" variant="solid" size="lg">
            <Icon name="fa6-solid:shield" class="size-4 ml-2" />
            حساب تأیید شده
          </BaseTag>
        </div>
      </div>
    </BaseCard>

    <!-- Quick Actions -->
    <div class="space-y-4">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
        عملیات سریع
      </BaseHeading>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <BaseCard
          v-for="action in quickActions"
          :key="action.id"
          rounded="lg"
          elevated
          class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 cursor-pointer hover:shadow-lg transition-all duration-300"
          @click="action.action"
        >
          <div class="text-center py-6">
            <div class="inline-flex items-center justify-center size-14 rounded-full bg-primary-500/10 text-primary-500 mb-4">
              <Icon :name="action.icon" class="size-7" />
            </div>
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              {{ action.title }}
            </BaseHeading>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Recent Orders and Active Loads -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Orders -->
      <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
            سفارشات اخیر
          </BaseHeading>
          <BaseButton 
            variant="ghost" 
            color="primary" 
            size="md"
            rounded="lg"
            @click="router.push('/baham/buyer/orders')"
          >
            مشاهده همه
          </BaseButton>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-muted-200 dark:border-muted-700">
                <th class="text-right py-4 px-5 text-sm font-semibold text-muted-600 dark:text-muted-300">شماره سفارش</th>
                <th class="text-right py-4 px-5 text-sm font-semibold text-muted-600 dark:text-muted-300">تاریخ</th>
                <th class="text-right py-4 px-5 text-sm font-semibold text-muted-600 dark:text-muted-300">مبلغ</th>
                <th class="text-right py-4 px-5 text-sm font-semibold text-muted-600 dark:text-muted-300">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="order in recentOrders" 
                :key="order.id" 
                class="border-b border-muted-100 dark:border-muted-800 hover:bg-muted-100/50 dark:hover:bg-muted-800/50 transition-colors"
              >
                <td class="py-4 px-5 text-sm font-medium text-muted-800 dark:text-white">
                  #{{ order.id }}
                </td>
                <td class="py-4 px-5 text-sm text-muted-600 dark:text-muted-400">
                  {{ order.createdAt.toLocaleDateString('fa-IR') }}
                </td>
                <td class="py-4 px-5 text-sm text-muted-600 dark:text-muted-400">
                  {{ formatCurrency(order.totalPrice) }}
                </td>
                <td class="py-4 px-5">
                  <span :class="getStatusClass(order.status)">
                    {{ statusTranslations[order.status] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="recentOrders.length === 0" class="text-center py-12">
          <Icon name="fa6-solid:box-open" class="size-16 text-muted-400 mx-auto mb-5" />
          <BaseHeading tag="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white mb-2">
            سفارشی یافت نشد
          </BaseHeading>
          <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400">
            شما هنوز سفارشی ثبت نکرده‌اید
          </BaseParagraph>
        </div>
      </BaseCard>
      
      <!-- Active Loads -->
      <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
            بارهای فعال
          </BaseHeading>
          <BaseButton 
            variant="ghost" 
            color="primary" 
            size="md"
            rounded="lg"
            @click="router.push('/baham/buyer/marketplace')"
          >
            مشاهده همه
          </BaseButton>
        </div>
        
        <div class="space-y-5">
          <div
            v-for="load in activeLoads"
            :key="load.id"
            class="border border-muted-200 dark:border-muted-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer"
            @click="router.push(`/baham/buyer/marketplace`)"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <BaseHeading tag="h3" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-1">
                  {{ load.product.name }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  {{ load.product.category }}
                </BaseParagraph>
              </div>
              <div class="text-left">
                <BaseHeading tag="h4" size="md" weight="semibold" class="text-success-600 dark:text-success-400">
                  {{ formatCurrency(load.pricePerKg) }}/کیلو
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-2">
                  موجود: {{ load.availableQuantityKg }} کیلو
                </BaseParagraph>
              </div>
            </div>
            <div class="flex justify-between items-center text-sm text-muted-600 dark:text-muted-400 mt-3">
              <span>انقضا: {{ load.expiryDate.toLocaleDateString('fa-IR') }}</span>
              <BaseTag color="success" variant="solid" size="md">
                فعال
              </BaseTag>
            </div>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-4 line-clamp-2">
              {{ load.product.description }}
            </BaseParagraph>
          </div>
        </div>
        
        <div v-if="activeLoads.length === 0" class="text-center py-12">
          <Icon name="fa6-solid:truck-ramp-box" class="size-16 text-muted-400 mx-auto mb-5" />
          <BaseHeading tag="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white mb-2">
            بار فعالی یافت نشد
          </BaseHeading>
          <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400">
            در حال حاضر بار فعالی وجود ندارد
          </BaseParagraph>
        </div>
      </BaseCard>
    </div>
    
    <!-- Helpful Information -->
    <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
        راهنمایی و اطلاعات مفید
      </BaseHeading>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-5 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:lightbulb" class="size-6 text-primary-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              نکات خرید
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            برای خرید بهتر، از فیلترهای پیشرفته در بازار استفاده کنید و قیمت‌ها را مقایسه کنید.
          </BaseParagraph>
        </div>
        <div class="p-5 bg-success-500/10 dark:bg-success-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:truck" class="size-6 text-success-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              تحویل سفارشات
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            سفارشات شما معمولاً ظرف 24-48 ساعت تحویل داده می‌شوند.
          </BaseParagraph>
        </div>
        <div class="p-5 bg-warning-500/10 dark:bg-warning-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:percent" class="size-6 text-warning-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              تخفیف‌ها
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            برای دریافت تخفیف‌های ویژه، عضو کلاب با هم شوید.
          </BaseParagraph>
        </div>
      </div>
    </BaseCard>
    
    <!-- Navigation Links -->
    <div class="mt-10">
      <BuyerNavigation />
    </div>
  </div>
</template>