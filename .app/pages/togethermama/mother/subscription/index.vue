<script setup lang="ts">
definePageMeta({
  title: 'اشتراک من',
  layout: 'default',
})

const currentPlan = {
  id: 'standard',
  name: 'بسته استاندارد',
  price: '899,000',
  duration: 'ماهانه',
  endDate: '1402/05/15',
  features: [
    'تمام امکانات بسته مقدماتی',
    '۴ جلسه مشاوره در ماه',
    'مشاوره تخصصی (کودک، نوجوان)',
    'برنامه‌های شخصی‌سازی شده',
    'تحلیل رفتار کودک',
  ],
}

const invoices = [
  {
    id: 'INV-001',
    date: '1402/02/15',
    amount: '899,000',
    status: 'paid',
  },
  {
    id: 'INV-002',
    date: '1402/01/15',
    amount: '899,000',
    status: 'paid',
  },
  {
    id: 'INV-003',
    date: '1401/12/15',
    amount: '499,000',
    status: 'paid',
  },
]
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <span>اشتراک من</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>مدیریت اشتراک و مشاهده فاکتورها</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Current Plan -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              بسته فعلی شما
            </BaseHeading>
            <NuxtLink to="/togethermama/mother/subscription/plans">
              <BaseButton size="sm" color="primary">
                <span>تغییر بسته</span>
              </BaseButton>
            </NuxtLink>
          </div>

          <div class="mb-6 rounded-xl border border-primary-200 bg-primary-50/50 p-6 dark:border-primary-500/30 dark:bg-primary-500/10">
            <div class="mb-4 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                class="text-primary-700 dark:text-primary-300"
              >
                {{ currentPlan.name }}
              </BaseHeading>
              <BaseTag
                color="primary"
                variant="solid"
                rounded="lg"
              >
                فعال
              </BaseTag>
            </div>
            
            <div class="mb-4 grid grid-cols-2 gap-4">
              <div>
                <BaseParagraph size="sm" class="text-muted-500 mb-1">
                  مبلغ پرداختی
                </BaseParagraph>
                <BaseHeading
                  as="h4"
                  size="lg"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  {{ currentPlan.price }} تومان
                </BaseHeading>
              </div>
              
              <div>
                <BaseParagraph size="sm" class="text-muted-500 mb-1">
                  تاریخ پایان
                </BaseParagraph>
                <BaseHeading
                  as="h4"
                  size="lg"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  {{ currentPlan.endDate }}
                </BaseHeading>
              </div>
            </div>
            
            <div class="mb-6">
              <BaseParagraph size="sm" class="text-muted-500 mb-2">
                امکانات بسته:
              </BaseParagraph>
              <ul class="space-y-2">
                <li
                  v-for="feature in currentPlan.features"
                  :key="feature"
                  class="flex items-start gap-2"
                >
                  <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5" />
                  <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                    {{ feature }}
                  </BaseParagraph>
                </li>
              </ul>
            </div>
            
            <div class="flex gap-3">
              <BaseButton color="primary" variant="solid">
                <Icon name="ph:arrow-clockwise" class="mr-2 size-5" />
                <span>تمدید اشتراک</span>
              </BaseButton>
              <BaseButton color="muted" variant="outline">
                <Icon name="ph:pause" class="mr-2 size-5" />
                <span>مکث در اشتراک</span>
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Payment Methods -->
        <BaseCard class="p-6 mt-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              روش‌های پرداخت
            </BaseHeading>
            <NuxtLink to="/togethermama/mother/subscription/payment-methods">
              <BaseButton size="sm" color="primary" variant="outline">
                <span>مدیریت روش‌های پرداخت</span>
              </BaseButton>
            </NuxtLink>
          </div>

          <div class="space-y-4">
            <div class="dark:border-muted-700 border border-muted-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <Icon name="ph:credit-card" class="text-muted-500 size-8" />
                  <div>
                    <BaseHeading
                      as="h3"
                      size="sm"
                      weight="medium"
                      class="text-muted-800 dark:text-white"
                    >
                      کارت شتاب ****1234
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-500">
                      زهرا محمدی
                    </BaseParagraph>
                  </div>
                </div>
                <BaseTag color="success" variant="pastel">
                  پیش‌فرض
                </BaseTag>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Invoices -->
        <BaseCard class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              فاکتورهای اخیر
            </BaseHeading>
            <NuxtLink to="/togethermama/mother/subscription/invoices" class="text-primary-500 hover:text-primary-600 text-sm">
              مشاهده همه
            </NuxtLink>
          </div>

          <div class="space-y-4">
            <NuxtLink
              v-for="invoice in invoices"
              :key="invoice.id"
              :to="`/togethermama/mother/subscription/invoices/${invoice.id}`"
              class="dark:border-muted-700 border-b border-muted-200 pb-4 last:border-0 last:pb-0"
            >
              <div class="flex items-center justify-between">
                <div>
                  <BaseHeading
                    as="h3"
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-white mb-1"
                  >
                    {{ invoice.id }}
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-500">
                    {{ invoice.date }}
                  </BaseParagraph>
                </div>
                <div class="text-end">
                  <BaseHeading
                    as="h4"
                    size="sm"
                    weight="medium"
                    class="text-muted-800 dark:text-white"
                  >
                    {{ invoice.amount }} تومان
                  </BaseHeading>
                  <BaseTag
                    :color="invoice.status === 'paid' ? 'success' : 'warning'"
                    variant="pastel"
                    size="sm"
                  >
                    {{ invoice.status === 'paid' ? 'پرداخت شده' : 'در انتظار' }}
                  </BaseTag>
                </div>
              </div>
            </NuxtLink>
          </div>
        </BaseCard>

        <!-- Quick Links -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              دسترسی سریع
            </BaseHeading>
          </div>

          <div class="space-y-3">
            <NuxtLink to="/togethermama/mother/subscription/plans">
              <BaseCard class="dark:hover:bg-muted-800/50 hover:bg-muted-50 cursor-pointer p-4 transition-colors">
                <div class="flex items-center gap-3">
                  <BaseIconBox
                    color="primary"
                    size="sm"
                    rounded="lg"
                  >
                    <Icon name="ph:package" class="size-5" />
                  </BaseIconBox>
                  <BaseParagraph class="text-muted-800 dark:text-white">
                    مشاهده بسته‌ها
                  </BaseParagraph>
                </div>
              </BaseCard>
            </NuxtLink>
            
            <NuxtLink to="/togethermama/mother/subscription/invoices">
              <BaseCard class="dark:hover:bg-muted-800/50 hover:bg-muted-50 cursor-pointer p-4 transition-colors">
                <div class="flex items-center gap-3">
                  <BaseIconBox
                    color="info"
                    size="sm"
                    rounded="lg"
                  >
                    <Icon name="ph:receipt" class="size-5" />
                  </BaseIconBox>
                  <BaseParagraph class="text-muted-800 dark:text-white">
                    تمام فاکتورها
                  </BaseParagraph>
                </div>
              </BaseCard>
            </NuxtLink>
            
            <NuxtLink to="/togethermama/mother/subscription/payment-methods">
              <BaseCard class="dark:hover:bg-muted-800/50 hover:bg-muted-50 cursor-pointer p-4 transition-colors">
                <div class="flex items-center gap-3">
                  <BaseIconBox
                    color="success"
                    size="sm"
                    rounded="lg"
                  >
                    <Icon name="ph:credit-card" class="size-5" />
                  </BaseIconBox>
                  <BaseParagraph class="text-muted-800 dark:text-white">
                    روش‌های پرداخت
                  </BaseParagraph>
                </div>
              </BaseCard>
            </NuxtLink>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
