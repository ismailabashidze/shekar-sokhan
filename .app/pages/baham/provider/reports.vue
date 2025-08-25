<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { FinancialReport, SettlementRequest } from './types'

definePageMeta({
  title: 'گزارشات مالی',
  layout: 'sidebar',
})

useHead({
  title: 'گزارشات مالی | با هم',
  htmlAttrs: { dir: 'rtl' },
})

// Mock data for financial reports
const reports = ref<FinancialReport[]>([])
const selectedPeriod = ref('monthly')

onMounted(() => {
  // Mock data initialization
  reports.value = [
    {
      period: 'فروردین 1403',
      totalSales: 15000000,
      totalCommission: 750000,
      netIncome: 14250000
    },
    {
      period: 'اردیبهشت 1403',
      totalSales: 18000000,
      totalCommission: 900000,
      netIncome: 17100000
    },
    {
      period: 'خرداد 1403',
      totalSales: 22000000,
      totalCommission: 1100000,
      netIncome: 20900000
    },
    {
      period: 'تیر 1403',
      totalSales: 19500000,
      totalCommission: 975000,
      netIncome: 18525000
    },
    {
      period: 'مرداد 1403',
      totalSales: 21000000,
      totalCommission: 1050000,
      netIncome: 19950000
    },
    {
      period: 'شهریور 1403',
      totalSales: 17500000,
      totalCommission: 875000,
      netIncome: 16625000
    }
  ]
})

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fa-IR')
}

// Mock settlement requests
const settlementRequests = ref<SettlementRequest[]>([
  {
    id: '1',
    date: '1403/04/15',
    amount: 15000000,
    status: 'pending',
    account: 'IR *** *** 4578'
  },
  {
    id: '2',
    date: '1403/03/22',
    amount: 18000000,
    status: 'paid',
    account: 'IR *** *** 4578'
  },
  {
    id: '3',
    date: '1403/02/10',
    amount: 12000000,
    status: 'rejected',
    account: 'IR *** *** 4578'
  }
])

// Status color mapping
const statusColors = {
  pending: 'warning',
  paid: 'success',
  rejected: 'danger'
} as const

// Status text mapping
const statusText = {
  pending: 'در انتظار تأیید',
  paid: 'پرداخت شده',
  rejected: 'رد شده'
} as const

// Calculate summary data
const totalSales = computed(() => reports.value.reduce((sum, report) => sum + report.totalSales, 0))
const totalCommission = computed(() => reports.value.reduce((sum, report) => sum + report.totalCommission, 0))
const netIncome = computed(() => reports.value.reduce((sum, report) => sum + report.netIncome, 0))
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          گزارشات مالی
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          تحلیل فروش و گزارشات مالی
        </BaseText>
      </template>
      
      <template #right>
        <div class="flex flex-wrap gap-3">
          <BaseSelect
            v-model="selectedPeriod"
            :classes="{
              wrapper: 'w-32'
            }"
          >
            <option value="daily">روزانه</option>
            <option value="weekly">هفتگی</option>
            <option value="monthly">ماهانه</option>
            <option value="yearly">سالانه</option>
          </BaseSelect>
          <BaseButton color="primary" variant="solid">
            <Icon name="ph:download" class="size-4" />
            <span>خروجی گزارش</span>
          </BaseButton>
        </div>
      </template>
      
      <!-- Financial Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                فروش کل (تومان)
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مجموع فروش تاکنون
              </BaseText>
            </div>
            <div class="bg-primary-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:currency-circle-dollar-duotone" class="text-primary-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-primary-500">
            {{ formatCurrency(totalSales) }}
          </BaseHeading>
        </BaseCard>
        
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                کارمزد کل (تومان)
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                کارمزد پلتفرم
              </BaseText>
            </div>
            <div class="bg-warning-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:percent-duotone" class="text-warning-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-warning-500">
            {{ formatCurrency(totalCommission) }}
          </BaseHeading>
        </BaseCard>
        
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                درآمد خالص (تومان)
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                درآمد پس از کسر کارمزد
              </BaseText>
            </div>
            <div class="bg-success-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:wallet-duotone" class="text-success-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-success-500">
            {{ formatCurrency(netIncome) }}
          </BaseHeading>
        </BaseCard>
      </div>
      
      <!-- Reports Table -->
      <BaseCard rounded="sm" class="p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <BaseHeading as="h2" size="lg" weight="medium">
              گزارشات فروش
            </BaseHeading>
            <BaseText size="sm" class="text-muted-400 mt-1">
              گزارشات فروش بر اساس دوره‌های زمانی
            </BaseText>
          </div>
        </div>
        
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                دوره
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                فروش کل (تومان)
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                کارمزد (تومان)
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                درآمد خالص (تومان)
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced class="text-end">
                عملیات
              </TairoTableHeading>
            </template>
            
            <TairoTableRow v-for="report in reports" :key="report.period">
              <TairoTableCell spaced>
                <div class="font-medium">{{ report.period }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ formatCurrency(report.totalSales) }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ formatCurrency(report.totalCommission) }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ formatCurrency(report.netIncome) }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex justify-end">
                  <BaseButton color="primary" variant="pastel" size="sm">
                    <Icon name="ph:eye" class="size-4" />
                    <span>جزئیات</span>
                  </BaseButton>
                </div>
              </TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </BaseCard>
      
      <!-- Settlement Requests -->
      <BaseCard rounded="sm" class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <BaseHeading as="h2" size="lg" weight="medium">
              درخواست‌های تسویه‌حساب
            </BaseHeading>
            <BaseText size="sm" class="text-muted-400 mt-1">
              لیست درخواست‌های تسویه‌حساب ثبت شده
            </BaseText>
          </div>
          <BaseButton color="success" variant="solid">
            <Icon name="ph:plus" class="size-4" />
            <span>درخواست تسویه جدید</span>
          </BaseButton>
        </div>
        
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                تاریخ درخواست
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                مبلغ (تومان)
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                وضعیت
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                شماره حساب
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced class="text-end">
                عملیات
              </TairoTableHeading>
            </template>
            
            <TairoTableRow v-for="request in settlementRequests" :key="request.id">
              <TairoTableCell spaced>
                <div class="text-sm">{{ request.date }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ formatCurrency(request.amount) }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <BaseTag 
                  :color="statusColors[request.status]" 
                  variant="pastel" 
                  rounded="full" 
                  size="sm"
                >
                  {{ statusText[request.status] }}
                </BaseTag>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm font-mono">{{ request.account }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex justify-end gap-2">
                  <BaseButton 
                    v-if="request.status === 'pending'" 
                    color="danger" 
                    variant="pastel" 
                    size="sm"
                  >
                    <Icon name="ph:x" class="size-4" />
                    <span>لغو</span>
                  </BaseButton>
                  <BaseButton 
                    v-if="request.status === 'paid'" 
                    color="primary" 
                    variant="pastel" 
                    size="sm"
                  >
                    <Icon name="ph:file-text" class="size-4" />
                    <span>فاکتور</span>
                  </BaseButton>
                </div>
              </TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </BaseCard>
    </TairoContentWrapper>
  </div>
</template>