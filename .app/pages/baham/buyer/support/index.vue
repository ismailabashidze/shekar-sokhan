<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'مرکز پشتیبانی - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مرکز پشتیبانی - با هم',
  meta: [
    { name: 'description', content: 'تاریخچه تیکت‌های پشتیبانی شما در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 
})

// Define types
interface Ticket {
  id: number
  subject: string
  description: string
  category: 'delivery' | 'payment' | 'account' | 'technical' | 'other'
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'closed'
  createdAt: Date
  updatedAt: Date
  assignedTo: string
}

// Reactive data
const tickets = ref<Ticket[]>([])
const searchQuery = ref('')
const statusFilter = ref<'all' | 'open' | 'in_progress' | 'closed'>('all')
const priorityFilter = ref<'all' | 'low' | 'medium' | 'high'>('all')
const categoryFilter = ref<'all' | 'delivery' | 'payment' | 'account' | 'technical' | 'other'>('all')
const router = useRouter()

// Debounce timer for search
let searchDebounce: NodeJS.Timeout | null = null

// Ticket stats
const ticketStats = computed(() => {
  return {
    total: tickets.value.length,
    open: tickets.value.filter(t => t.status === 'open').length,
    inProgress: tickets.value.filter(t => t.status === 'in_progress').length,
    closed: tickets.value.filter(t => t.status === 'closed').length
  }
})

// Filtered tickets
const filteredTickets = computed(() => {
  let result = [...tickets.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(ticket => 
      ticket.subject.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.id.toString().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(ticket => ticket.status === statusFilter.value)
  }
  
  // Apply priority filter
  if (priorityFilter.value !== 'all') {
    result = result.filter(ticket => ticket.priority === priorityFilter.value)
  }
  
  // Apply category filter
  if (categoryFilter.value !== 'all') {
    result = result.filter(ticket => ticket.category === categoryFilter.value)
  }
  
  return result
})

// Translations
const statusTranslations = {
  open: 'باز',
  in_progress: 'در حال پیگیری',
  closed: 'بسته شده'
}

const priorityTranslations = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد'
}

const categoryTranslations = {
  delivery: 'تحویل',
  payment: 'پرداخت',
  account: 'حساب کاربری',
  technical: 'فنی',
  other: 'سایر'
}

// Methods
const getCategoryClass = (category: string) => {
  const classes = {
    delivery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    payment: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    account: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    technical: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority: string) => {
  const classes = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  const classes = {
    open: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    closed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const viewTicketDetails = (ticketId: number) => {
  router.push(`/baham/buyer/support/${ticketId}`)
}

const createNewTicket = () => {
  router.push('/baham/buyer/support/new')
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  categoryFilter.value = 'all'
}

const clearSearch = () => {
  searchQuery.value = ''
}

const exportTickets = () => {
  console.log('Exporting tickets')
  // Implementation for exporting tickets
}

// Debounced search
const debouncedSearch = () => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
  searchDebounce = setTimeout(() => {
    // Search will automatically trigger through computed property
    console.log('Searching for:', searchQuery.value)
  }, 300)
}

// Watch search query for debouncing
watch(searchQuery, () => {
  debouncedSearch()
})

// Initialize with mock data
const initializeTickets = () => {
  tickets.value = [
    {
      id: 1001,
      subject: 'مشکل در تحویل سفارش',
      description: 'سفارش من هنوز تحویل داده نشده است',
      category: 'delivery',
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-16'),
      assignedTo: 'محمد رضایی'
    },
    {
      id: 1002,
      subject: 'مشکل در پرداخت',
      description: 'پرداخت من با خطا مواجه شد',
      category: 'payment',
      priority: 'medium',
      status: 'closed',
      createdAt: new Date('2023-05-20'),
      updatedAt: new Date('2023-05-21'),
      assignedTo: 'فاطمه محمدی'
    },
    {
      id: 1003,
      subject: 'تغییر آدرس تحویل',
      description: 'آدرس تحویل سفارش را باید تغییر دهم',
      category: 'delivery',
      priority: 'low',
      status: 'open',
      createdAt: new Date('2023-05-25'),
      updatedAt: new Date('2023-05-25'),
      assignedTo: 'در انتظار واگذاری'
    },
    {
      id: 1004,
      subject: 'مشکل در ورود به حساب کاربری',
      description: 'نمی‌توانم به حساب کاربری خود وارد شوم',
      category: 'account',
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-02'),
      assignedTo: 'حسین کریمی'
    }
  ]
}

// Lifecycle
onMounted(() => {
  initializeTickets()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">مرکز پشتیبانی</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">تاریخچه تیکت‌های پشتیبانی شما</p>
        </div>
        <TairoButton 
          variant="solid" 
          color="primary" 
          rounded="lg"
          @click="createNewTicket"
        >
          <Icon name="fa6-solid:plus" class="h-4 w-4 ml-2" />
          ایجاد تیکت جدید
        </TairoButton>
      </div>
    </div>
    
    <!-- Ticket Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
            <Icon name="fa6-solid:ticket" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">مجموع تیکت‌ها</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ ticketStats.total }}</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-red-100 dark:bg-red-900/30 p-3">
            <Icon name="fa6-solid:exclamation-circle" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">تیکت‌های باز</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ ticketStats.open }}</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-3">
            <Icon name="fa6-solid:sync" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">در حال پیگیری</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ ticketStats.inProgress }}</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
            <Icon name="fa6-solid:check-circle" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">تیکت‌های بسته</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ ticketStats.closed }}</p>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Filters -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div class="relative">
          <TairoLabel>جستجو</TairoLabel>
          <TairoInput
            v-model="searchQuery"
            placeholder="جستجو در موضوع، توضیحات یا شماره تیکت"
            icon="fa6-solid:magnifying-glass"
            rounded="lg"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            type="button"
          >
            <Icon name="fa6-solid:xmark" class="h-4 w-4" />
          </button>
        </div>
        
        <div>
          <TairoLabel>وضعیت</TairoLabel>
          <TairoSelect
            v-model="statusFilter"
            :options="[
              { label: 'همه وضعیت‌ها', value: 'all' },
              { label: 'باز', value: 'open' },
              { label: 'در حال پیگیری', value: 'in_progress' },
              { label: 'بسته شده', value: 'closed' }
            ]"
            rounded="lg"
          />
        </div>
        
        <div>
          <TairoLabel>اولویت</TairoLabel>
          <TairoSelect
            v-model="priorityFilter"
            :options="[
              { label: 'همه اولویت‌ها', value: 'all' },
              { label: 'کم', value: 'low' },
              { label: 'متوسط', value: 'medium' },
              { label: 'زیاد', value: 'high' }
            ]"
            rounded="lg"
          />
        </div>
        
        <div>
          <TairoLabel>دسته‌بندی</TairoLabel>
          <TairoSelect
            v-model="categoryFilter"
            :options="[
              { label: 'همه دسته‌بندی‌ها', value: 'all' },
              { label: 'تحویل', value: 'delivery' },
              { label: 'پرداخت', value: 'payment' },
              { label: 'حساب کاربری', value: 'account' },
              { label: 'فنی', value: 'technical' },
              { label: 'سایر', value: 'other' }
            ]"
            rounded="lg"
          />
        </div>
        
        <div class="flex items-end">
          <TairoButton 
            variant="outline" 
            color="secondary" 
            class="w-full"
            rounded="lg"
            @click="resetFilters"
          >
            <Icon name="fa6-solid:rotate" class="h-4 w-4 ml-2" />
            بازنشانی
          </TairoButton>
        </div>
      </div>
    </BaseCard>
    
    <!-- Results Info -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="text-gray-600 dark:text-gray-400">
        نمایش {{ filteredTickets.length }} تیکت از مجموع {{ tickets.length }} تیکت
      </div>
      <div class="flex gap-2">
        <TairoButton 
          variant="ghost" 
          color="primary" 
          size="sm"
          rounded="lg"
          @click="exportTickets"
        >
          <Icon name="fa6-solid:download" class="h-4 w-4 ml-2" />
          خروجی اکسل
        </TairoButton>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 mb-8">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-muted-800">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">موضوع</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">دسته‌بندی</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">اولویت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">وضعیت</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ ایجاد</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">آخرین به‌روزرسانی</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">واگذار شده به</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-muted-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="ticket in filteredTickets" 
              :key="ticket.id" 
              class="hover:bg-gray-50 dark:hover:bg-muted-800 cursor-pointer transition-colors"
              @click="viewTicketDetails(ticket.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ ticket.subject }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ ticket.description }}</div>
                <div class="text-xs text-gray-400 dark:text-gray-500">#{{ ticket.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getCategoryClass(ticket.category)"
                >
                  {{ categoryTranslations[ticket.category] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getPriorityClass(ticket.priority)"
                >
                  {{ priorityTranslations[ticket.priority] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(ticket.status)"
                >
                  {{ statusTranslations[ticket.status] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(ticket.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(ticket.updatedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ ticket.assignedTo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <TairoButton 
                  variant="ghost" 
                  color="primary" 
                  size="sm"
                  rounded="lg"
                  @click.stop="viewTicketDetails(ticket.id)"
                >
                  مشاهده
                </TairoButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredTickets.length === 0" class="text-center py-16">
        <Icon name="fa6-solid:ticket" class="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">تیکتی یافت نشد</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">بر اساس فیلترهای انتخابی شما، تیکتی یافت نشد</p>
        <TairoButton 
          variant="solid" 
          color="primary" 
          rounded="lg"
          @click="resetFilters"
        >
          <Icon name="fa6-solid:rotate" class="h-4 w-4 ml-2" />
          بازنشانی فیلترها
        </TairoButton>
      </div>
    </BaseCard>
    
    <!-- Pagination -->
    <div class="flex items-center justify-between mb-8">
      <div class="text-sm text-gray-700 dark:text-gray-400">
        نمایش 1 تا {{ filteredTickets.length }} از {{ filteredTickets.length }}
      </div>
      <div class="flex gap-2">
        <TairoButton variant="outline" color="primary" rounded="lg" disabled>
          قبلی
        </TairoButton>
        <TairoButton variant="outline" color="primary" rounded="lg" disabled>
          بعدی
        </TairoButton>
      </div>
    </div>
    
    <!-- Support Information -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">اطلاعات تماس پشتیبانی</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon name="fa6-solid:phone" class="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">تلفن پشتیبانی</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">021-12345678</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">شنبه تا چهارشنبه 9 تا 17</p>
        </div>
        <div class="text-center p-5 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Icon name="fa6-solid:envelope" class="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">ایمیل پشتیبانی</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">support@baham.com</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">پاسخ ظرف 24 ساعت</p>
        </div>
        <div class="text-center p-5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Icon name="fa6-solid:comments" class="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">چت آنلاین</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">در پایین صفحه</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">24 ساعته در دسترس</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>