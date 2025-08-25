<script setup lang="ts">
import type { SystemFinancial } from '~/types/admin'

definePageMeta({
  title: 'پیشخوان ادمین - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'پیشخوان ادمین - با هم',
  meta: [
    { name: 'description', content: 'پیشخوان مدیریت پلتفرم با هم' }
  ]
})

// Mock data
const systemStats = {
  totalUsers: 1242,
  totalLoads: 387,
  totalOrders: 921,
  totalRevenue: 125000000
}

const financialData: SystemFinancial = {
  totalCommission: 12500000,
  pendingSettlements: 3200000,
  completedSettlements: 9300000
}

const recentActivities = [
  { id: 1, action: 'ثبت نام کاربر جدید', user: 'علی محمدی', time: '۲ دقیقه پیش' },
  { id: 2, action: 'ثبت بار جدید', user: 'محمد رضایی', time: '۱۵ دقیقه پیش' },
  { id: 3, action: 'ثبت سفارش جدید', user: 'زهرا احمدی', time: '۳۰ دقیقه پیش' },
  { id: 4, action: 'تایید مدارک', user: 'حسین کریمی', time: '۱ ساعت پیش' }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
        پیشخوان ادمین
      </BaseHeading>
      <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
        خلاصه وضعیت پلتفرم
      </BaseParagraph>
    </div>
    
    <!-- Stats -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-5">
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-12 items-center justify-center">
              <Icon name="ph:users-duotone" class="text-primary-500 size-6" />
            </div>
            <div class="mr-4">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 uppercase tracking-wide">
                کاربران کل
              </BaseParagraph>
              <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ systemStats.totalUsers.toLocaleString('fa-IR') }}
              </BaseHeading>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-5">
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-12 items-center justify-center">
              <Icon name="ph:package-duotone" class="text-success-500 size-6" />
            </div>
            <div class="mr-4">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 uppercase tracking-wide">
                بارهای ثبت شده
              </BaseParagraph>
              <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ systemStats.totalLoads.toLocaleString('fa-IR') }}
              </BaseHeading>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-5">
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-12 items-center justify-center">
              <Icon name="ph:shopping-cart-duotone" class="text-info-500 size-6" />
            </div>
            <div class="mr-4">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 uppercase tracking-wide">
                سفارشات کل
              </BaseParagraph>
              <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ systemStats.totalOrders.toLocaleString('fa-IR') }}
              </BaseHeading>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-5">
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-warning-500/10 flex size-12 items-center justify-center">
              <Icon name="ph:currency-circle-dollar-duotone" class="text-warning-500 size-6" />
            </div>
            <div class="mr-4">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 uppercase tracking-wide">
                درآمد کل (ریال)
              </BaseParagraph>
              <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ systemStats.totalRevenue.toLocaleString('fa-IR') }}
              </BaseHeading>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Financial Overview -->
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6">
            وضعیت مالی
          </BaseHeading>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between mb-2">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  کارمزد کل
                </BaseParagraph>
                <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                  {{ financialData.totalCommission.toLocaleString('fa-IR') }} ریال
                </BaseParagraph>
              </div>
              <div class="w-full rounded-full bg-muted-200 dark:bg-muted-700 h-2">
                <div class="h-2 rounded-full bg-primary-500" style="width: 100%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-2">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  تسویه‌حساب‌های انجام شده
                </BaseParagraph>
                <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                  {{ financialData.completedSettlements.toLocaleString('fa-IR') }} ریال
                </BaseParagraph>
              </div>
              <div class="w-full rounded-full bg-muted-200 dark:bg-muted-700 h-2">
                <div 
                  class="h-2 rounded-full bg-success-500" 
                  :style="{ width: (financialData.completedSettlements / financialData.totalCommission * 100) + '%' }"
                ></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-2">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  تسویه‌حساب‌های در انتظار
                </BaseParagraph>
                <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                  {{ financialData.pendingSettlements.toLocaleString('fa-IR') }} ریال
                </BaseParagraph>
              </div>
              <div class="w-full rounded-full bg-muted-200 dark:bg-muted-700 h-2">
                <div 
                  class="h-2 rounded-full bg-warning-500" 
                  :style="{ width: (financialData.pendingSettlements / financialData.totalCommission * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Recent Activity -->
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6">
            فعالیت‌های اخیر
          </BaseHeading>
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id" 
              class="flex items-start pb-4 last:pb-0"
            >
              <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-10 items-center justify-center mr-3">
                <Icon name="ph:activity-duotone" class="text-primary-500 size-5" />
              </div>
              <div class="flex-1 min-w-0">
                <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                  {{ activity.action }}
                </BaseParagraph>
                <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                  {{ activity.user }} - {{ activity.time }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>