<script setup lang="ts">
definePageMeta({
  title: 'کیف پول - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'کیف پول - با هم',
  meta: [
    { name: 'description', content: 'مدیریت موجودی و شارژ کیف پول' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Wallet data
const walletBalance = ref(1250000)
const frozenBalance = ref(250000)
const chargeAmount = ref('')

// Savings data
const savings = reactive({
  totalSaved: 3500000,
  currentMonthSaved: 450000,
  averageMonthlySavings: 380000
})

// Payment methods
const paymentMethods = [
  { id: 'card', name: 'کارت بانکی', icon: 'ph:credit-card-duotone' },
  { id: 'digital', name: 'پرداخت دیجیتال', icon: 'ph:wallet-duotone' },
  { id: 'bank', name: 'واریز بانکی', icon: 'ph:bank-duotone' }
]

const selectedPaymentMethod = ref('card')

// Quick charge amounts
const quickChargeAmounts = [50000, 100000, 250000, 500000, 1000000]

// Transactions data
const transactions = ref([
  {
    id: 1,
    date: '2023-05-15',
    description: 'خرید محصولات کشاورزی',
    amount: -125000,
    balance: 1250000,
    type: 'debit'
  },
  {
    id: 2,
    date: '2023-05-10',
    description: 'شارژ کیف پول',
    amount: 500000,
    balance: 1375000,
    type: 'credit'
  },
  {
    id: 3,
    date: '2023-05-05',
    description: 'برداشت وجه',
    amount: -200000,
    balance: 875000,
    type: 'debit'
  },
  {
    id: 4,
    date: '2023-05-01',
    description: 'فروش محصولات',
    amount: 750000,
    balance: 1075000,
    type: 'credit'
  }
])

// Benefits data
const benefits = [
  {
    id: 1,
    title: 'پرداخت سریع',
    description: 'پرداخت فوری برای خریدهای آنلاین',
    icon: 'ph:lightning-duotone'
  },
  {
    id: 2,
    title: 'امنیت بالا',
    description: 'رمزگذاری پیشرفته برای حفظ امنیت مالی شما',
    icon: 'ph:shield-check-duotone'
  },
  {
    id: 3,
    title: 'پس‌انداز',
    description: 'امکان پس‌انداز و مدیریت مالی',
    icon: 'ph:piggy-bank-duotone'
  }
]

// Security settings
const twoFactorEnabled = ref(true)
const biometricEnabled = ref(false)

// Format currency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال'
}

// Set quick charge amount
const setQuickAmount = (amount: number) => {
  chargeAmount.value = amount.toString()
}

// Charge wallet
const chargeWallet = () => {
  if (!chargeAmount.value || parseInt(chargeAmount.value) < 10000) {
    const toaster = useToaster()
    toaster.show({
      title: 'خطا در شارژ کیف پول',
      message: 'حداقل مبلغ شارژ ۱۰,۰۰۰ ریال است',
      color: 'danger',
      icon: 'ph:x-circle-duotone',
      closable: true,
    })
    return
  }
  
  const toaster = useToaster()
  toaster.show({
    title: 'درخواست شارژ ثبت شد',
    message: `درخواست شارژ به مبلغ ${formatCurrency(parseInt(chargeAmount.value))} با موفقیت ثبت شد`,
    color: 'success',
    icon: 'ph:check-circle-duotone',
    closable: true,
  })
  
  // Reset form
  chargeAmount.value = ''
}

// Export transactions
const exportTransactions = () => {
  const toaster = useToaster()
  toaster.show({
    title: 'درخواست خروجی',
    message: 'درخواست خروجی تراکنش‌ها با موفقیت ثبت شد',
    color: 'info',
    icon: 'ph:download-duotone',
    closable: true,
  })
}

// Request withdrawal
const requestWithdrawal = () => {
  const toaster = useToaster()
  toaster.show({
    title: 'درخواست برداشت',
    message: 'درخواست برداشت وجه با موفقیت ثبت شد',
    color: 'info',
    icon: 'ph:arrow-down-duotone',
    closable: true,
  })
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          کیف پول
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mt-2">
          مدیریت موجودی و شارژ کیف پول
        </BaseParagraph>
      </div>
      <div class="flex gap-3">
        <BaseButton 
          variant="outline" 
          color="primary" 
          @click="exportTransactions"
        >
          <Icon name="ph:download-duotone" class="size-5 ml-2" />
          خروجی تراکنش‌ها
        </BaseButton>
        <BaseButton 
          variant="outline" 
          color="primary" 
          @click="requestWithdrawal"
        >
          <Icon name="ph:arrow-down-duotone" class="size-5 ml-2" />
          برداشت وجه
        </BaseButton>
      </div>
    </div>
    
    <!-- Wallet Balance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 bg-gradient-to-br from-success-500/10 to-emerald-500/10 border border-success-200 dark:border-success-800">
        <div class="flex items-center">
          <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-14 items-center justify-center">
            <Icon name="ph:wallet-duotone" class="text-success-500 size-7" />
          </div>
          <div class="mr-4">
            <BaseParagraph size="sm" weight="medium" class="text-muted-600 dark:text-muted-300">
              موجودی قابل استفاده
            </BaseParagraph>
            <BaseHeading tag="h3" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ formatCurrency(walletBalance) }}
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 bg-gradient-to-br from-info-500/10 to-cyan-500/10 border border-info-200 dark:border-info-800">
        <div class="flex items-center">
          <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-14 items-center justify-center">
            <Icon name="ph:snowflake-duotone" class="text-info-500 size-7" />
          </div>
          <div class="mr-4">
            <BaseParagraph size="sm" weight="medium" class="text-muted-600 dark:text-muted-300">
              موجودی مسدود شده
            </BaseParagraph>
            <BaseHeading tag="h3" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ formatCurrency(frozenBalance) }}
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-200 dark:border-purple-800">
        <div class="flex items-center">
          <div class="nui-mask nui-mask-hexed bg-purple-500/10 flex size-14 items-center justify-center">
            <Icon name="ph:chart-line-up-duotone" class="text-purple-500 size-7" />
          </div>
          <div class="mr-4">
            <BaseParagraph size="sm" weight="medium" class="text-muted-600 dark:text-muted-300">
              مجموع پس‌انداز
            </BaseParagraph>
            <BaseHeading tag="h3" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ formatCurrency(savings.totalSaved) }}
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Charge Wallet Form -->
      <div class="lg:col-span-2 space-y-8">
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            شارژ کیف پول
          </BaseHeading>
          <form @submit.prevent="chargeWallet" class="space-y-6">
            <div>
              <BaseInput
                id="amount"
                v-model="chargeAmount"
                type="number"
                label="مبلغ (ریال) *"
                placeholder="مبلغ به ریال"
                required
              />
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-2">
                حداقل مبلغ شارژ: ۱۰,۰۰۰ ریال
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
                روش پرداخت
              </BaseHeading>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BaseCard 
                  v-for="method in paymentMethods"
                  :key="method.id"
                  rounded="lg"
                  class="dark:!bg-muted-800 p-4 cursor-pointer border-2 transition-all"
                  :class="[
                    selectedPaymentMethod === method.id 
                      ? 'border-primary-500 bg-primary-500/10 dark:bg-primary-500/10' 
                      : 'border-muted-200 dark:border-muted-700 hover:border-primary-300 dark:hover:border-primary-700'
                  ]"
                  @click="selectedPaymentMethod = method.id"
                >
                  <div class="flex items-center">
                    <Icon :name="method.icon" class="size-8 text-muted-500 dark:text-muted-400 ml-3" />
                    <div>
                      <BaseHeading tag="h4" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                        {{ method.name }}
                      </BaseHeading>
                      <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 mt-1" v-if="method.id === 'card'">
                        Visa, MasterCard
                      </BaseParagraph>
                      <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 mt-1" v-if="method.id === 'digital'">
                        زرین‌پال، پی‌پینگ
                      </BaseParagraph>
                      <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 mt-1" v-if="method.id === 'bank'">
                        واریز مستقیم
                      </BaseParagraph>
                    </div>
                  </div>
                </BaseCard>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4">
              <BaseButton 
                type="button" 
                variant="outline" 
                color="secondary" 
                @click="chargeAmount = ''"
              >
                پاک کردن
              </BaseButton>
              <BaseButton 
                type="submit" 
                variant="solid" 
                color="primary"
              >
                <Icon name="ph:money-duotone" class="size-5 ml-2" />
                پرداخت و شارژ
              </BaseButton>
            </div>
          </form>
        </BaseCard>
        
        <!-- Quick Charge Options -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            شارژ سریع
          </BaseHeading>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <BaseButton 
              v-for="amount in quickChargeAmounts" 
              :key="amount"
              variant="outline" 
              color="primary"
              @click="setQuickAmount(amount)"
              class="py-3"
            >
              {{ formatCurrency(amount) }}
            </BaseButton>
          </div>
        </BaseCard>
        
        <!-- Transaction History -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <div class="flex justify-between items-center mb-6">
            <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
              آخرین تراکنش‌ها
            </BaseHeading>
            <BaseButton 
              variant="ghost" 
              color="primary" 
              size="sm"
              @click="$router.push('/baham/buyer/transactions')"
            >
              مشاهده همه
            </BaseButton>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-muted-200 dark:divide-muted-700">
              <thead class="bg-muted-50 dark:bg-muted-800">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                    شرح
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                    مبلغ
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                    موجودی
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-muted-900 divide-y divide-muted-200 dark:divide-muted-700">
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-800 dark:text-white">
                    {{ transaction.description }}
                  </td>
                  <td 
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium" 
                    :class="{
                      'text-success-600 dark:text-success-400': transaction.type === 'credit',
                      'text-danger-600 dark:text-danger-400': transaction.type === 'debit'
                    }"
                  >
                    {{ transaction.amount > 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                    {{ formatCurrency(transaction.balance) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="transactions.length === 0" class="text-center py-8">
            <Icon name="ph:wallet-duotone" class="size-12 text-muted-400 mx-auto mb-4" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white mb-2">
              تراکنشی یافت نشد
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
              شما هنوز تراکنشی نداشته‌اید
            </BaseParagraph>
          </div>
        </BaseCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Savings Info -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            پس‌انداز شما
          </BaseHeading>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                پس‌انداز این ماه
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ formatCurrency(savings.currentMonthSaved) }}
              </BaseParagraph>
            </div>
            <div class="flex justify-between items-center">
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                میانگین ماهانه
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ formatCurrency(savings.averageMonthlySavings) }}
              </BaseParagraph>
            </div>
            <div class="pt-4 border-t border-muted-200 dark:border-muted-700">
              <div class="flex justify-between items-center mb-2">
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                  پیشرفت ماهانه
                </BaseParagraph>
                <BaseParagraph size="sm" weight="medium" class="text-muted-700 dark:text-muted-300">
                  ۷۰٪
                </BaseParagraph>
              </div>
              <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-2">
                <div class="bg-success-500 h-2 rounded-full" style="width: 70%"></div>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Wallet Benefits -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            مزایای کیف پول
          </BaseHeading>
          <div class="space-y-4">
            <div 
              v-for="benefit in benefits" 
              :key="benefit.id"
              class="flex items-start"
            >
              <Icon :name="benefit.icon" class="size-5 text-primary-500 ml-3 mt-0.5" />
              <div>
                <BaseHeading tag="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white mb-1">
                  {{ benefit.title }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                  {{ benefit.description }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Security Info -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            امنیت کیف پول
          </BaseHeading>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="ph:shield-duotone" class="size-5 text-success-500 ml-2" />
                <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                  احراز هویت دو مرحله‌ای
                </BaseParagraph>
              </div>
              <BaseToggle v-model="twoFactorEnabled" />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="ph:fingerprint-duotone" class="size-5 text-success-500 ml-2" />
                <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                  بیومتریک
                </BaseParagraph>
              </div>
              <BaseToggle v-model="biometricEnabled" />
            </div>
            <div class="pt-4 border-t border-muted-200 dark:border-muted-700">
              <BaseButton variant="outline" color="primary" class="w-full">
                <Icon name="ph:key-duotone" class="size-5 ml-2" />
                تغییر رمز عبور
              </BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Support -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            پشتیبانی
          </BaseHeading>
          <div class="space-y-4">
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              برای کمک در مورد کیف پول و تراکنش‌ها، با پشتیبانی تماس بگیرید.
            </BaseParagraph>
            <BaseButton 
              variant="solid" 
              color="primary" 
              class="w-full"
              @click="$router.push('/baham/buyer/support/new')"
            >
              <Icon name="ph:headset-duotone" class="size-5 ml-2" />
              تماس با پشتیبانی
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>