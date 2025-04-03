<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  title: 'پرداختی ها',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { user } = useUser()
const route = useRoute()
const router = useRouter()

// Pagination
const page = computed(() => parseInt((route.query.page as string) ?? '1'))
const perPage = ref(10)

// Filters
const filter = ref('')
const statusFilter = ref('all')

// Mock payment data (replace with actual API call)
const payments = ref([
  {
    id: 1,
    date: '1402/12/15',
    amount: 1500000,
    status: 'success',
    description: 'جلسه مشاوره - دکتر رضایی',
    transactionId: 'TRX-123456',
  },
  {
    id: 2,
    date: '1402/12/10',
    amount: 1200000,
    status: 'success',
    description: 'جلسه مشاوره - دکتر محمدی',
    transactionId: 'TRX-123457',
  },
  {
    id: 3,
    date: '1402/12/05',
    amount: 1500000,
    status: 'failed',
    description: 'جلسه مشاوره - دکتر رضایی',
    transactionId: 'TRX-123458',
  },
])

// Filter payments
const filteredPayments = computed(() => {
  return payments.value
    .filter((payment) => {
      if (statusFilter.value !== 'all' && payment.status !== statusFilter.value) {
        return false
      }
      if (filter.value && !payment.description.includes(filter.value)) {
        return false
      }
      return true
    })
})

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Reset filters
const resetFilters = () => {
  filter.value = ''
  statusFilter.value = 'all'
  router.push({ query: { page: '1' } })
}

watch([filter, statusFilter], () => {
  router.push({
    query: {
      page: '1',
    },
  })
})
</script>

<template>
  <div class="py-6">
    <div class="container-fluid">
      <!-- Header -->
      <div class="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-muted-800 text-2xl font-bold dark:text-white">
            تاریخچه پرداختی ها
          </h1>
          <p class="text-muted-400 mt-1">
            مدیریت و مشاهده پرداختی های شما
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <!-- Search -->
          <BaseInput
            v-model="filter"
            icon="ph:magnifying-glass-duotone"
            placeholder="جستجو..."
            class="w-full max-w-xs"
          />
          <!-- Status filter -->
          <BaseSelect v-model="statusFilter" class="w-40">
            <option value="all">
              همه وضعیت ها
            </option>
            <option value="success">
              موفق
            </option>
            <option value="failed">
              ناموفق
            </option>
          </BaseSelect>
        </div>

        <!-- Reset filters -->
        <BaseButton
          color="muted"
          @click="resetFilters"
        >
          پاک کردن فیلترها
        </BaseButton>
      </div>

      <!-- Payments table -->
      <BaseCard class="relative overflow-x-auto">
        <div class="min-w-full align-middle">
          <table class="min-w-full">
            <thead>
              <tr class="bg-muted-100 dark:bg-muted-800">
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-center text-xs font-semibold uppercase first:rounded-tr"
                >
                  #
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  تاریخ
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  شرح
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  مبلغ (تومان)
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  شماره تراکنش
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase last:rounded-tl"
                >
                  وضعیت
                </th>
              </tr>
            </thead>
            <tbody class="divide-muted-200 dark:divide-muted-700 divide-y">
              <tr
                v-for="(payment, index) in filteredPayments"
                :key="payment.id"
                class="border-muted-200 dark:border-muted-700 border-b transition-colors duration-300 hover:bg-muted-50 dark:hover:bg-muted-800/50"
              >
                <td class="text-muted-500 dark:text-muted-300 whitespace-nowrap p-3 text-center text-sm">
                  {{ (page - 1) * perPage + index + 1 }}
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <span class="bg-muted-100 dark:bg-muted-800 rounded px-2 py-1">{{ payment.date }}</span>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:note-duotone" class="text-primary-500 size-4" />
                    {{ payment.description }}
                  </div>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <span class="font-mono font-medium text-success-600 dark:text-success-400">
                    {{ formatPrice(payment.amount) }}
                  </span>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <span class="font-mono bg-muted-100 dark:bg-muted-800 rounded px-2 py-1 text-xs">
                    {{ payment.transactionId }}
                  </span>
                </td>
                <td class="whitespace-nowrap p-3 text-sm">
                  <div
                    :class="[
                      payment.status === 'success'
                        ? 'bg-success-100 dark:bg-success-500/20 text-success-500 border border-success-200 dark:border-success-500/30'
                        : 'bg-danger-100 dark:bg-danger-500/20 text-danger-500 border border-danger-200 dark:border-danger-500/30',
                      'inline-flex items-center justify-center gap-2 rounded-full px-3 py-1',
                    ]"
                  >
                    <Icon
                      :name="payment.status === 'success' ? 'ph:check-circle-duotone' : 'ph:x-circle-duotone'"
                      class="size-4"
                    />
                    <span class="text-xs font-medium">
                      {{ payment.status === 'success' ? 'موفق' : 'ناموفق' }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- Empty state -->
      <div
        v-if="filteredPayments.length === 0"
        class="text-muted-400 mt-6 flex flex-col items-center justify-center space-y-2 py-12"
      >
        <Icon name="ph:money-duotone" class="size-12" />
        <p>هیچ پرداختی یافت نشد</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredPayments.length > 0" class="mt-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <BaseSelect v-model="perPage" class="min-w-32">
            <option :value="10">
              10
            </option>
            <option :value="25">
              25
            </option>
            <option :value="50">
              50
            </option>
          </BaseSelect>
          <p class="text-muted-400 min-w-32 text-sm">
            مورد در هر صفحه
          </p>
        </div>
        <BasePagination
          :total-items="filteredPayments.length"
          :per-page="perPage"
          :current-page="page"
          class="justify-end"
        />
      </div>
    </div>
  </div>
</template>
