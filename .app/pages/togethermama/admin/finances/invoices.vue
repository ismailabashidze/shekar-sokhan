<script setup lang="ts">
definePageMeta({
  title: 'فاکتورها - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const invoices = ref([
  {
    id: 1,
    invoiceNumber: 'TM-2024-001',
    user: 'زهرا محمدی',
    amount: '899,000',
    date: '۱۴۰۳/۰۵/۱۵',
    dueDate: '۱۴۰۳/۰۵/۱۵',
    status: 'paid',
  },
  {
    id: 2,
    invoiceNumber: 'TM-2024-002',
    user: 'احمد رضوی',
    amount: '1,200,000',
    date: '۱۴۰۳/۰۵/۱۴',
    dueDate: '۱۴۰۳/۰۵/۱۴',
    status: 'paid',
  },
  {
    id: 3,
    invoiceNumber: 'TM-2024-003',
    user: 'فاطمه کریمی',
    amount: '250,000',
    date: '۱۴۰۳/۰۵/۱۴',
    dueDate: '۱۴۰۳/۰۵/۱۴',
    status: 'paid',
  },
  {
    id: 4,
    invoiceNumber: 'TM-2024-004',
    user: 'دکتر مریم ترابی',
    amount: '8,000,000',
    date: '۱۴۰۳/۰۵/۰۱',
    dueDate: '۱۴۰۳/۰۵/۰۱',
    status: 'paid',
  },
  {
    id: 5,
    invoiceNumber: 'TM-2024-005',
    user: 'مریم حسینی',
    amount: '899,000',
    date: '۱۴۰۳/۰۵/۱۰',
    dueDate: '۱۴۰۳/۰۵/۱۰',
    status: 'overdue',
  },
])

const filter = ref('all')
const search = ref('')

const filteredInvoices = computed(() => {
  let result = invoices.value
  
  if (filter.value !== 'all') {
    result = result.filter(i => i.status === filter.value)
  }
  
  if (search.value) {
    result = result.filter(i => 
      i.user.includes(search.value) || 
      i.invoiceNumber.includes(search.value)
    )
  }
  
  // Sort by date
  result.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  return result
})
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
        فاکتورها
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت فاکتورهای سیستم
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-6 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex gap-3">
          <BaseButton
            :color="filter === 'all' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'all'"
          >
            همه فاکتورها
          </BaseButton>
          <BaseButton
            :color="filter === 'paid' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'paid'"
          >
            پرداخت شده
          </BaseButton>
          <BaseButton
            :color="filter === 'overdue' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'overdue'"
          >
            سررسید گذشته
          </BaseButton>
        </div>
        
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
    </BaseCard>

    <!-- Invoices List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="invoice in filteredInvoices"
          :key="invoice.id"
          class="flex items-center justify-between p-4"
        >
          <div>
            <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
              {{ invoice.invoiceNumber }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500 text-sm">
              {{ invoice.user }} - {{ invoice.date }}
            </BaseParagraph>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="font-medium">{{ invoice.amount }} تومان</span>
            <BaseTag
              :color="invoice.status === 'paid' ? 'success' : 'danger'"
              variant="pastel"
              size="sm"
            >
              {{ invoice.status === 'paid' ? 'پرداخت شده' : 'سررسید گذشته' }}
            </BaseTag>
            <NuxtLink :to="`/togethermama/admin/finances/invoices/${invoice.id}`">
              <BaseButton size="sm" color="muted" variant="outline">
                مشاهده
              </BaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
