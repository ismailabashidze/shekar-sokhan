<script setup lang="ts">
definePageMeta({
  title: 'تراکنش‌های مالی - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const transactions = ref([
  {
    id: 1,
    user: 'زهرا محمدی',
    type: 'subscription',
    amount: '899,000',
    date: '۱۴۰۳/۰۵/۱۵',
    status: 'completed',
    reference: 'TRX-2024-001',
  },
  {
    id: 2,
    user: 'احمد رضوی',
    type: 'package',
    amount: '1,200,000',
    date: '۱۴۰۳/۰۵/۱۴',
    status: 'completed',
    reference: 'TRX-2024-002',
  },
  {
    id: 3,
    user: 'فاطمه کریمی',
    type: 'session',
    amount: '250,000',
    date: '۱۴۰۳/۰۵/۱۴',
    status: 'completed',
    reference: 'TRX-2024-003',
  },
  {
    id: 4,
    user: 'دکتر مریم ترابی',
    type: 'payout',
    amount: '8,000,000',
    date: '۱۴۰۳/۰۵/۰۱',
    status: 'completed',
    reference: 'TRX-2024-004',
  },
  {
    id: 5,
    user: 'مریم حسینی',
    type: 'subscription',
    amount: '899,000',
    date: '۱۴۰۳/۰۵/۱۰',
    status: 'pending',
    reference: 'TRX-2024-005',
  },
])

const filter = ref('all')
const search = ref('')
const dateFilter = ref('all')

const filteredTransactions = computed(() => {
  let result = transactions.value
  
  if (filter.value !== 'all') {
    result = result.filter(t => t.type === filter.value)
  }
  
  if (dateFilter.value !== 'all') {
    const today = new Date()
    if (dateFilter.value === 'today') {
      result = result.filter(t => t.date === formatDate(today))
    } else if (dateFilter.value === 'week') {
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      result = result.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= weekAgo && transactionDate <= today
      })
    }
  }
  
  if (search.value) {
    result = result.filter(t => 
      t.user.includes(search.value) || 
      t.reference.includes(search.value)
    )
  }
  
  // Sort by date
  result.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  return result
})

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-muted-800 dark:text-white"
      >
        تراکنش‌های مالی
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت تمام تراکنش‌های مالی
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-6 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap gap-3">
          <BaseButton
            :color="filter === 'all' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'all'"
          >
            همه تراکنش‌ها
          </BaseButton>
          <BaseButton
            :color="filter === 'subscription' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'subscription'"
          >
            اشتراک‌ها
          </BaseButton>
          <BaseButton
            :color="filter === 'package' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'package'"
          >
            بسته‌ها
          </BaseButton>
          <BaseButton
            :color="filter === 'session' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'session'"
          >
            جلسات
          </BaseButton>
          <BaseButton
            :color="filter === 'payout' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'payout'"
          >
            تسویه‌ها
          </BaseButton>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <BaseSelect
            v-model="dateFilter"
            shape="curved"
            :classes="{ input: 'h-10' }"
          >
            <option value="all">همه تاریخ‌ها</option>
            <option value="today">امروز</option>
            <option value="week">هفته جاری</option>
          </BaseSelect>
          
          <div class="md:w-64">
            <BaseInput
              v-model="search"
              placeholder="جستجو..."
              shape="curved"
              :classes="{ input: 'h-10' }"
            >
              <template #addon>
                <Icon name="ph:magnifying-glass" class="text-muted-500 size-4" />
              </template>
            </BaseInput>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Transactions List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="flex items-center justify-between p-4"
        >
          <div class="flex items-center gap-4">
            <div
              :class="[
                'flex size-10 items-center justify-center rounded-full',
                transaction.type === 'subscription' ? 'bg-primary-100 dark:bg-primary-500/20' :
                transaction.type === 'package' ? 'bg-success-100 dark:bg-success-500/20' :
                transaction.type === 'session' ? 'bg-info-100 dark:bg-info-500/20' :
                'bg-warning-100 dark:bg-warning-500/20'
              ]"
            >
              <Icon
                :name="transaction.type === 'subscription' ? 'ph:credit-card' :
                       transaction.type === 'package' ? 'ph:package' :
                       transaction.type === 'session' ? 'ph:chat-circle' :
                       'ph:bank'"
                :class="[
                  'size-5',
                  transaction.type === 'subscription' ? 'text-primary-500' :
                  transaction.type === 'package' ? 'text-success-500' :
                  transaction.type === 'session' ? 'text-info-500' :
                  'text-warning-500'
                ]"
              />
            </div>
            <div>
              <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                {{ transaction.user }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ transaction.type === 'subscription' ? 'اشتراک' : transaction.type === 'package' ? 'بسته' : transaction.type === 'session' ? 'جلسه' : 'تسویه' }} - {{ transaction.reference }}
              </BaseParagraph>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="font-medium">{{ transaction.amount }} تومان</span>
            <BaseTag
              :color="transaction.status === 'completed' ? 'success' : 'warning'"
              variant="pastel"
              size="sm"
            >
              {{ transaction.status === 'completed' ? 'تکمیل شده' : 'در انتظار' }}
            </BaseTag>
            <BaseParagraph class="text-muted-400 text-sm">
              {{ transaction.date }}
            </BaseParagraph>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
