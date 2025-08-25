<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'گزارشات و مالی',
  icon: 'mdi:finance',
  layout: 'distributor'
})

useHead({
  title: 'گزارشات و مالی - با هم',
  meta: [
    { name: 'description', content: 'گزارشات مالی و تسویه‌حساب توزیع‌کننده در پلتفرم با هم' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Reactive states
const salesPeriod = ref('هفته جاری')
const commissionPeriod = ref('ماه جاری')

// Period options
const periodOptions = [
  { label: 'هفته جاری', value: 'هفته جاری' },
  { label: 'هفته گذشته', value: 'هفته گذشته' },
  { label: 'ماه جاری', value: 'ماه جاری' },
  { label: 'ماه گذشته', value: 'ماه گذشته' }
]

// Settlement columns
const settlementColumns = [
  { key: 'id', label: 'شماره درخواست', sortable: true },
  { key: 'date', label: 'تاریخ', sortable: true },
  { key: 'amount', label: 'مبلغ (تومان)', sortable: true },
  { key: 'status', label: 'وضعیت', sortable: true },
  { key: 'description', label: 'توضیحات', sortable: true }
]

// Mock data for settlement requests
const settlementRequests = ref([
  {
    id: 'SET-001',
    date: '1403/05/20',
    amount: 3200000,
    status: 'paid',
    description: 'تسویه حساب هفتگی'
  },
  {
    id: 'SET-002',
    date: '1403/05/13',
    amount: 2800000,
    status: 'paid',
    description: 'تسویه حساب هفتگی'
  },
  {
    id: 'SET-003',
    date: '1403/05/06',
    amount: 3100000,
    status: 'pending',
    description: 'در انتظار واریز'
  },
  {
    id: 'SET-004',
    date: '1403/04/29',
    amount: 2950000,
    status: 'paid',
    description: 'تسویه حساب هفتگی'
  },
  {
    id: 'SET-005',
    date: '1403/04/22',
    amount: 3050000,
    status: 'rejected',
    description: 'اطلاعات بانکی ناقص'
  }
])

// Toast for notifications
const toast = useToaster()

// Request settlement function
const requestSettlement = () => {
  const newRequest = {
    id: `SET-${String(settlementRequests.value.length + 1).padStart(3, '0')}`,
    date: '1403/05/25',
    amount: 3000000,
    status: 'pending',
    description: 'درخواست تسویه جدید'
  }
  
  settlementRequests.value.unshift(newRequest)
  toast.success('درخواست تسویه‌حساب جدید ثبت شد')
}

// Status text mapping
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'در انتظار',
    'paid': 'پرداخت شده',
    'rejected': 'رد شده'
  }
  return statusMap[status] || status
}

// Status color mapping
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'pending': 'warning',
    'paid': 'success',
    'rejected': 'danger'
  }
  return colorMap[status] || 'secondary'
}

// Format currency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:chart-line-up-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">گزارشات و مالی</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">بررسی عملکرد مالی و درخواست تسویه‌حساب</p>
    </div>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard 
        rounded="xl" 
        class="dark:!bg-muted-900 shadow-sm border-r-4 border-r-blue-500"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ml-4">
              <Icon name="ph:currency-circle-dollar-duotone" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">فروش امروز</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">1,200,000 تومان</p>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard 
        rounded="xl" 
        class="dark:!bg-muted-900 shadow-sm border-r-4 border-r-green-500"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 ml-4">
              <Icon name="ph:hand-coins-duotone" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">کارمزد امروز</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">120,000 تومان</p>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard 
        rounded="xl" 
        class="dark:!bg-muted-900 shadow-sm border-r-4 border-r-purple-500"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 ml-4">
              <Icon name="ph:chart-bar-duotone" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">فروش این ماه</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">24,500,000 تومان</p>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard 
        rounded="xl" 
        class="dark:!bg-muted-900 shadow-sm border-r-4 border-r-yellow-500"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 ml-4">
              <Icon name="ph:bank-duotone" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">کارمزد این ماه</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">2,450,000 تومان</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Sales Chart -->
      <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:chart-line-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              نمودار فروش هفتگی
            </h2>
            <BaseSelect 
              v-model="salesPeriod" 
              :options="periodOptions" 
              size="md"
              rounded="lg"
            />
          </div>
        </div>
        <div class="p-6">
          <div class="h-80 bg-gray-100 dark:bg-muted-800 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <Icon name="ph:chart-line-duotone" class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">نمودار فروش (در دسترس در نسخه کامل)</p>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Commission Chart -->
      <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:coins-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              نمودار کارمزدها
            </h2>
            <BaseSelect 
              v-model="commissionPeriod" 
              :options="periodOptions" 
              size="md"
              rounded="lg"
            />
          </div>
        </div>
        <div class="p-6">
          <div class="h-80 bg-gray-100 dark:bg-muted-800 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <Icon name="ph:chart-line-duotone" class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">نمودار کارمزدها (در دسترس در نسخه کامل)</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Settlement Requests -->
    <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="ph:receipt-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
            درخواست تسویه‌حساب
          </h2>
          <BaseButton 
            @click="requestSettlement" 
            variant="solid" 
            color="primary"
            size="lg"
            rounded="lg"
          >
            <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
            درخواست تسویه جدید
          </BaseButton>
        </div>
      </div>
      
      <div class="p-6">
        <ClientOnly>
          <BaseTable 
            v-if="settlementRequests.length > 0" 
            :columns="settlementColumns" 
            :data="settlementRequests"
          >
            <template #id="{ row }">
              <span class="font-medium text-gray-900 dark:text-white">#{{ row.id }}</span>
            </template>
            
            <template #amount="{ row }">
              <span class="font-medium">{{ formatCurrency(row.amount) }}</span>
            </template>
            
            <template #status="{ row }">
              <BaseBadge 
                :color="getStatusColor(row.status)" 
                rounded="full"
                class="px-3 py-1"
              >
                {{ getStatusText(row.status) }}
              </BaseBadge>
            </template>
            
            <template #description="{ row }">
              <span class="text-gray-600 dark:text-gray-400">{{ row.description }}</span>
            </template>
          </BaseTable>
          
          <div v-else class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6 mx-auto">
              <Icon name="ph:receipt-duotone" class="h-8 w-8 text-primary-500" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">درخواستی ثبت نشده است</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">هنوز هیچ درخواست تسویه‌ای ثبت نکرده‌اید</p>
            <BaseButton 
              @click="requestSettlement" 
              variant="solid" 
              color="primary"
              rounded="lg"
            >
              <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
              ایجاد درخواست اولیه
            </BaseButton>
          </div>
        </ClientOnly>
      </div>
    </BaseCard>
  </div>
</template>