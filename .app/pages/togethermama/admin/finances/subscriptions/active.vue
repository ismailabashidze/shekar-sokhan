<script setup lang="ts">
definePageMeta({
  title: 'اشتراک‌های فعال - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const subscriptions = ref([
  {
    id: 1,
    user: 'زهرا محمدی',
    plan: 'استاندارد',
    startDate: '۱۴۰۳/۰۵/۰۱',
    endDate: '۱۴۰۳/۰۶/۰۱',
    amount: '899,000',
    sessionsUsed: 2,
    sessionsTotal: 4,
  },
  {
    id: 2,
    user: 'احمد رضوی',
    plan: 'حرفه‌ای',
    startDate: '۱۴۰۳/۰۴/۱۵',
    endDate: '۱۴۰۳/۰۵/۱۵',
    amount: '1,399,000',
    sessionsUsed: 5,
    sessionsTotal: 'نامحدود',
  },
  {
    id: 3,
    user: 'فاطمه کریمی',
    plan: 'مقدماتی',
    startDate: '۱۴۰۳/۰۵/۱۰',
    endDate: '۱۴۰۳/۰۶/۱۰',
    amount: '499,000',
    sessionsUsed: 1,
    sessionsTotal: 2,
  },
])

const search = ref('')
const sortBy = ref('startDate')

const filteredSubscriptions = computed(() => {
  let result = [...subscriptions.value]
  
  if (search.value) {
    result = result.filter(s => 
      s.user.includes(search.value) || 
      s.plan.includes(search.value)
    )
  }
  
  // Sort by selected criteria
  result.sort((a, b) => {
    if (sortBy.value === 'startDate') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    } else if (sortBy.value === 'endDate') {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    } else {
      return parseInt(b.amount.replace(/,/g, '')) - parseInt(a.amount.replace(/,/g, ''))
    }
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
        اشتراک‌های فعال
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت اشتراک‌های فعال کاربران
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-6 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex gap-3">
          <BaseSelect
            v-model="sortBy"
            shape="curved"
            :classes="{ input: 'h-10' }"
          >
            <option value="startDate">مرتب‌سازی بر اساس تاریخ شروع</option>
            <option value="endDate">مرتب‌سازی بر اساس تاریخ پایان</option>
            <option value="amount">مرتب‌سازی بر اساس مبلغ</option>
          </BaseSelect>
        </div>
        
        <div class="md:w-64">
          <BaseInput
            v-model="search"
            placeholder="جستجوی کاربر یا بسته..."
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

    <!-- Subscriptions List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="subscription in filteredSubscriptions"
          :key="subscription.id"
          class="p-4"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                {{ subscription.user }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                بسته: {{ subscription.plan }} - {{ subscription.amount }} تومان
              </BaseParagraph>
            </div>
            
            <div class="flex-1">
              <div class="mb-2 flex justify-between text-sm">
                <span class="text-muted-500">جلسات:</span>
                <span class="font-medium">
                  {{ subscription.sessionsUsed }}/{{ subscription.sessionsTotal }}
                </span>
              </div>
              <div class="h-2 w-full rounded-full bg-muted-200 dark:bg-muted-700">
                <div
                  class="h-2 rounded-full bg-primary-500"
                  :style="{ width: subscription.sessionsTotal === 'نامحدود' ? '100%' : `${(subscription.sessionsUsed / parseInt(subscription.sessionsTotal)) * 100}%` }"
                />
              </div>
            </div>
            
            <div class="text-center md:text-right">
              <BaseParagraph class="text-muted-800 dark:text-white font-medium">
                {{ subscription.startDate }} تا {{ subscription.endDate }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) }} روز باقی‌مانده
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
