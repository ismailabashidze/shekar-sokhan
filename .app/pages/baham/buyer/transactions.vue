<script setup lang="ts">
import { ref, computed } from 'vue'

// Reactive states
const searchQuery = ref('')
const sortBy = ref('date')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Sample transaction data
const allTransactions = ref([
  {
    id: 1,
    date: new Date('2023-05-15'),
    description: 'فروش محصولات کشاورزی',
    amount: 1500000,
    balance: 3000000,
    type: 'income'
  },
  {
    id: 2,
    date: new Date('2023-05-10'),
    description: 'پرداخت هزینه حمل و نقل',
    amount: -200000,
    balance: 1500000,
    type: 'expense'
  },
  {
    id: 3,
    date: new Date('2023-05-05'),
    description: 'فروش محصولات باغی',
    amount: 1700000,
    balance: 1700000,
    type: 'income'
  },
  {
    id: 4,
    date: new Date('2023-04-28'),
    description: 'پرداخت هزینه بسته‌بندی',
    amount: -150000,
    balance: 0,
    type: 'expense'
  },
  {
    id: 5,
    date: new Date('2023-04-20'),
    description: 'فروش محصولات دامی',
    amount: 2000000,
    balance: 150000,
    type: 'income'
  },
  {
    id: 6,
    date: new Date('2023-04-15'),
    description: 'خرید نهاده‌های کشاورزی',
    amount: -300000,
    balance: -1850000,
    type: 'expense'
  },
  {
    id: 7,
    date: new Date('2023-04-10'),
    description: 'فروش سبزیجات',
    amount: 800000,
    balance: -1550000,
    type: 'income'
  },
  {
    id: 8,
    date: new Date('2023-04-05'),
    description: 'پرداخت حقوق کارگران',
    amount: -500000,
    balance: -2350000,
    type: 'expense'
  }
])

// Filtered and sorted transactions
const filteredTransactions = computed(() => {
  let result = allTransactions.value
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(transaction => 
      transaction.description.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  result = [...result].sort((a, b) => {
    let modifier = sortOrder.value === 'asc' ? 1 : -1
    
    switch (sortBy.value) {
      case 'date':
        return (a.date - b.date) * modifier
      case 'amount':
        return (a.amount - b.amount) * modifier
      case 'description':
        return a.description.localeCompare(b.description) * modifier
      default:
        return 0
    }
  })
  
  return result
})

// Paginated transactions
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
})

// Financial summary
const totalIncome = computed(() => {
  return allTransactions.value
    .filter(t => t.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0)
})

const totalExpense = computed(() => {
  return allTransactions.value
    .filter(t => t.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)
})

const currentBalance = computed(() => {
  return allTransactions.value.length > 0 
    ? allTransactions.value[0].balance 
    : 0
})

// Format currency function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(Math.abs(amount)) + ' ریال'
}

// Format date function
const formatDate = (date) => {
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

// Sorting functions
const sortTransactions = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  sortBy.value = 'date'
  sortOrder.value = 'desc'
  currentPage.value = 1
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">تراکنش‌های مالی</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">تاریخچه تراکنش‌های مالی شما</p>
      </div>
      <div class="flex gap-2">
        <TairoInput
          v-model="searchQuery"
          placeholder="جستجو در تراکنش‌ها..."
          icon="fa6-solid:magnifying-glass"
          class="w-full md:w-64"
        />
        <TairoButton variant="outline" color="primary" @click="resetFilters">
          <Icon name="fa6-solid:rotate-left" class="h-4 w-4" />
        </TairoButton>
        <TairoButton variant="outline" color="primary">
          <Icon name="fa6-solid:download" class="h-4 w-4" />
        </TairoButton>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard class="border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
            <Icon name="fa6-solid:arrow-down" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">دریافتی کل</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalIncome) }}</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="rounded-lg bg-red-100 dark:bg-red-900/30 p-3">
            <Icon name="fa6-solid:arrow-up" class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">پرداختی کل</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalExpense) }}</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
            <Icon name="fa6-solid:wallet" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">موجودی فعلی</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(currentBalance) }}</p>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <BaseCard class="border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th 
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="sortTransactions('date')"
              >
                <div class="flex items-center justify-end">
                  تاریخ
                  <Icon 
                    v-if="sortBy === 'date'" 
                    :name="sortOrder === 'asc' ? 'fa6-solid:sort-up' : 'fa6-solid:sort-down'" 
                    class="mr-1"
                  />
                </div>
              </th>
              <th 
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="sortTransactions('description')"
              >
                <div class="flex items-center justify-end">
                  شرح
                  <Icon 
                    v-if="sortBy === 'description'" 
                    :name="sortOrder === 'asc' ? 'fa6-solid:sort-up' : 'fa6-solid:sort-down'" 
                    class="mr-1"
                  />
                </div>
              </th>
              <th 
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="sortTransactions('amount')"
              >
                <div class="flex items-center justify-end">
                  مبلغ
                  <Icon 
                    v-if="sortBy === 'amount'" 
                    :name="sortOrder === 'asc' ? 'fa6-solid:sort-up' : 'fa6-solid:sort-down'" 
                    class="mr-1"
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                موجودی
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="transaction in paginatedTransactions" 
              :key="transaction.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ transaction.description }}
              </td>
              <td 
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                :class="{
                  'text-green-600 dark:text-green-400': transaction.amount > 0,
                  'text-red-600 dark:text-red-400': transaction.amount < 0
                }"
              >
                {{ transaction.amount > 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatCurrency(transaction.balance) }}
              </td>
            </tr>
            
            <tr v-if="paginatedTransactions.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <Icon name="fa6-solid:money-bill" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">تراکنشی یافت نشد</h3>
                <p class="text-gray-500 dark:text-gray-400">با معیارهای جستجوی فعلی تراکنشی یافت نشد</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div class="text-sm text-gray-700 dark:text-gray-300 mb-4 md:mb-0">
          نمایش {{ paginatedTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} 
          تا {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} 
          از {{ filteredTransactions.length }}
        </div>
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
          <TairoButton 
            variant="outline" 
            color="primary" 
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            قبلی
          </TairoButton>
          
          <div class="flex items-center">
            <span class="text-sm text-gray-700 dark:text-gray-300 mx-2">صفحه</span>
            <input
              type="number"
              min="1"
              :max="totalPages"
              v-model.number="currentPage"
              class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded text-center dark:bg-gray-700 dark:text-white"
              @change="goToPage(currentPage)"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300 mx-2">از {{ totalPages }}</span>
          </div>
          
          <TairoButton 
            variant="outline" 
            color="primary" 
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="nextPage"
          >
            بعدی
          </TairoButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>