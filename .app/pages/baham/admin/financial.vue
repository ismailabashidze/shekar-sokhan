<script setup lang="ts">
import type { SystemFinancial } from '~/types/admin'

definePageMeta({
  title: 'مدیریت مالی - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مدیریت مالی - با هم',
  meta: [
    { name: 'description', content: 'مدیریت مالی پلتفرم با هم' }
  ]
})

// Mock financial data
const financialData: SystemFinancial = {
  totalCommission: 12500000,
  pendingSettlements: 3200000,
  completedSettlements: 9300000
}

const settlements = [
  {
    id: 'S001',
    user: 'محمد رضایی',
    role: 'provider',
    order: '#1001',
    amount: 380000,
    commissionRate: 5,
    commissionAmount: 20000,
    status: 'paid',
    settledAt: new Date('2023-06-13')
  },
  {
    id: 'S002',
    user: 'علی احمدی',
    role: 'distributor',
    order: '#1001',
    amount: 20000,
    commissionRate: 5,
    commissionAmount: 1000,
    status: 'paid',
    settledAt: new Date('2023-06-13')
  },
  {
    id: 'S003',
    user: 'زهرا کریمی',
    role: 'provider',
    order: '#1002',
    amount: 342000,
    commissionRate: 5,
    commissionAmount: 18000,
    status: 'pending',
    settledAt: null
  }
]

const roles = {
  buyer: 'خریدار',
  distributor: 'توزیع‌کننده',
  provider: 'ارائه‌دهنده',
  admin: 'مدیر'
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'پرداخت شده'
    case 'pending': return 'در انتظار پرداخت'
    default: return status
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
        مدیریت مالی
      </BaseHeading>
      <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
        وضعیت مالی و تسویه‌حساب‌های پلتفرم
      </BaseParagraph>
    </div>
    
    <!-- Financial Overview -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-5">
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-12 items-center justify-center">
              <Icon name="ph:currency-circle-dollar-duotone" class="text-primary-500 size-6" />
            </div>
            <div class="mr-4">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 uppercase tracking-wide">
                کارمزد کل (ریال)
              </BaseParagraph>
              <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ financialData.totalCommission.toLocaleString('fa-IR') }}
              </BaseHeading>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-5">
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-12 items-center justify-center">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-6" />
            </div>
            <div class="mr-4">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 uppercase tracking-wide">
                تسویه‌حساب‌های انجام شده (ریال)
              </BaseParagraph>
              <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ financialData.completedSettlements.toLocaleString('fa-IR') }}
              </BaseHeading>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-5">
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-warning-500/10 flex size-12 items-center justify-center">
              <Icon name="ph:clock-duotone" class="text-warning-500 size-6" />
            </div>
            <div class="mr-4">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 uppercase tracking-wide">
                تسویه‌حساب‌های در انتظار (ریال)
              </BaseParagraph>
              <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ financialData.pendingSettlements.toLocaleString('fa-IR') }}
              </BaseHeading>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Settlements Table -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900">
      <div class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
            تسویه‌حساب‌ها
          </BaseHeading>
          <div class="mt-4 sm:mt-0">
            <BaseButton color="primary">
              <Icon name="ph:plus-duotone" class="size-5 mr-2" />
              درخواست تسویه‌حساب جدید
            </BaseButton>
          </div>
        </div>
        
        <TairoTable rounded="md">
          <template #header>
            <TairoTableHeading>شناسه</TairoTableHeading>
            <TairoTableHeading>کاربر</TairoTableHeading>
            <TairoTableHeading>نقش</TairoTableHeading>
            <TairoTableHeading>سفارش</TairoTableHeading>
            <TairoTableHeading>مبلغ (ریال)</TairoTableHeading>
            <TairoTableHeading>کارمزد (ریال)</TairoTableHeading>
            <TairoTableHeading>وضعیت</TairoTableHeading>
            <TairoTableHeading>تاریخ تسویه</TairoTableHeading>
            <TairoTableHeading class="text-center">عملیات</TairoTableHeading>
          </template>
          
          <TairoTableRow v-for="settlement in settlements" :key="settlement.id">
            <TairoTableCell>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ settlement.id }}
              </BaseParagraph>
            </TairoTableCell>
            <TairoTableCell>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                {{ settlement.user }}
              </BaseParagraph>
            </TairoTableCell>
            <TairoTableCell>
              <BaseBadge color="info" rounded="lg">
                {{ roles[settlement.role] }}
              </BaseBadge>
            </TairoTableCell>
            <TairoTableCell>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                {{ settlement.order }}
              </BaseParagraph>
            </TairoTableCell>
            <TairoTableCell>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                {{ settlement.amount.toLocaleString('fa-IR') }}
              </BaseParagraph>
            </TairoTableCell>
            <TairoTableCell>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                {{ settlement.commissionAmount.toLocaleString('fa-IR') }} ({{ settlement.commissionRate }}%)
              </BaseParagraph>
            </TairoTableCell>
            <TairoTableCell>
              <BaseBadge 
                :color="settlement.status === 'paid' ? 'success' : 'warning'" 
                rounded="lg"
                class="capitalize"
              >
                {{ getStatusText(settlement.status) }}
              </BaseBadge>
            </TairoTableCell>
            <TairoTableCell>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                {{ settlement.settledAt ? new Date(settlement.settledAt).toLocaleDateString('fa-IR') : '-' }}
              </BaseParagraph>
            </TairoTableCell>
            <TairoTableCell class="text-center">
              <BaseButton color="primary" size="sm" outlined>
                مشاهده
              </BaseButton>
            </TairoTableCell>
          </TairoTableRow>
        </TairoTable>
      </div>
    </BaseCard>
  </div>
</template>