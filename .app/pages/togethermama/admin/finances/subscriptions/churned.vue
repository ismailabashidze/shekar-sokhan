<script setup lang="ts">
definePageMeta({
  title: 'اشتراک‌های لغو شده - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const churnedSubscriptions = ref([
  {
    id: 1,
    user: 'مریم حسینی',
    plan: 'استاندارد',
    startDate: '۱۴۰۳/۰۳/۰۱',
    endDate: '۱۴۰۳/۰۴/۰۱',
    cancelDate: '۱۴۰۳/۰۳/۲۵',
    amount: '899,000',
    reason: 'عدم رضایت از خدمات',
  },
  {
    id: 2,
    user: 'محمد احمدی',
    plan: 'مقدماتی',
    startDate: '۱۴۰۳/۰۲/۱۵',
    endDate: '۱۴۰۳/۰۳/۱۵',
    cancelDate: '۱۴۰۳/۰۳/۱۰',
    amount: '499,000',
    reason: 'عدم استفاده از خدمات',
  },
  {
    id: 3,
    user: 'سارا محمدی',
    plan: 'حرفه‌ای',
    startDate: '۱۴۰۳/۰۱/۲۰',
    endDate: '۱۴۰۳/۰۲/۲۰',
    cancelDate: '۱۴۰۳/۰۲/۱۵',
    amount: '1,399,000',
    reason: 'تغییر شرایط مالی',
  },
])

const search = ref('')
const sortBy = ref('cancelDate')

const filteredSubscriptions = computed(() => {
  let result = [...churnedSubscriptions.value]
  
  if (search.value) {
    result = result.filter(s => 
      s.user.includes(search.value) || 
      s.plan.includes(search.value) ||
      s.reason.includes(search.value)
    )
  }
  
  // Sort by selected criteria
  result.sort((a, b) => {
    if (sortBy.value === 'cancelDate') {
      return new Date(b.cancelDate).getTime() - new Date(a.cancelDate).getTime()
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
        اشتراک‌های لغو شده
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و تحلیل اشتراک‌های لغو شده
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
            <option value="cancelDate">مرتب‌سازی بر اساس تاریخ لغو</option>
            <option value="amount">مرتب‌سازی بر اساس مبلغ</option>
          </BaseSelect>
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

    <!-- Churned Subscriptions List -->
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
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
                دلیل لغو: {{ subscription.reason }}
              </BaseParagraph>
            </div>
            
            <div class="text-center md:text-right">
              <BaseParagraph class="text-muted-800 dark:text-white font-medium">
                لغو شده در {{ subscription.cancelDate }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ subscription.startDate }} تا {{ subscription.endDate }}
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
