<script setup lang="ts">
definePageMeta({
  title: 'تسویه‌های تکمیل شده - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const processedPayouts = ref([
  {
    id: 1,
    user: 'دکتر مریم ترابی',
    amount: '8,000,000',
    method: 'حساب بانک ملی',
    requestDate: '۱۴۰۳/۰۵/۰۱',
    processDate: '۱۴۰۳/۰۵/۰۳',
    status: 'completed',
    reference: 'PAYOUT-2024-001',
  },
  {
    id: 2,
    user: 'دکتر علی بهرامی',
    amount: '7,500,000',
    method: 'حساب بانک صادرات',
    requestDate: '۱۴۰۳/۰۴/۲۵',
    processDate: '۱۴۰۳/۰۴/۲۷',
    status: 'completed',
    reference: 'PAYOUT-2024-002',
  },
  {
    id: 3,
    user: 'دکتر کاملیا مرادزاده',
    amount: '8,200,000',
    method: 'حساب بانک ملت',
    requestDate: '۱۴۰۳/۰۴/۲۰',
    processDate: '۱۴۰۳/۰۴/۲۲',
    status: 'completed',
    reference: 'PAYOUT-2024-003',
  },
])

const search = ref('')

const filteredPayouts = computed(() => {
  let result = processedPayouts.value
  
  if (search.value) {
    result = result.filter(p => 
      p.user.includes(search.value) || 
      p.reference.includes(search.value) ||
      p.method.includes(search.value)
    )
  }
  
  // Sort by process date
  result.sort((a, b) => {
    return new Date(b.processDate).getTime() - new Date(a.processDate).getTime()
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
        تسویه‌های تکمیل شده
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده تاریخچه تسویه‌های تکمیل شده
      </BaseParagraph>
    </div>

    <!-- Search -->
    <BaseCard class="mb-6 p-5">
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
    </BaseCard>

    <!-- Processed Payouts List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="payout in filteredPayouts"
          :key="payout.id"
          class="flex items-center justify-between p-4"
        >
          <div>
            <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
              {{ payout.user }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500 text-sm">
              {{ payout.method }} - {{ payout.reference }}
            </BaseParagraph>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="font-medium">{{ payout.amount }} تومان</span>
            <BaseTag color="success" variant="pastel" size="sm">
              تکمیل شده
            </BaseTag>
            <div class="text-center md:text-right">
              <BaseParagraph class="text-muted-800 dark:text-white text-sm">
                {{ payout.processDate }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-xs">
                درخواست: {{ payout.requestDate }}
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
