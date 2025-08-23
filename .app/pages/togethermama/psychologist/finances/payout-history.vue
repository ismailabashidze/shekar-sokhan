<script setup lang="ts">
definePageMeta({
  title: 'تاریخچه تسویه - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const payouts = ref([
  {
    id: 1,
    date: '۱۴۰۳/۰۵/۰۱',
    amount: '8,000,000',
    method: 'حساب بانک ملی',
    status: 'completed',
    reference: 'TRX-2024-001',
  },
  {
    id: 2,
    date: '۱۴۰۳/۰۴/۰۱',
    amount: '7,500,000',
    method: 'حساب بانک ملی',
    status: 'completed',
    reference: 'TRX-2024-002',
  },
  {
    id: 3,
    date: '۱۴۰۳/۰۳/۰۱',
    amount: '8,200,000',
    method: 'حساب بانک ملی',
    status: 'completed',
    reference: 'TRX-2024-003',
  },
  {
    id: 4,
    date: '۱۴۰۳/۰۲/۰۱',
    amount: '7,800,000',
    method: 'حساب بانک ملی',
    status: 'pending',
    reference: 'TRX-2024-004',
  },
])

const filter = ref('all')
const search = ref('')

const filteredPayouts = computed(() => {
  let result = payouts.value
  
  if (filter.value !== 'all') {
    result = result.filter(p => p.status === filter.value)
  }
  
  if (search.value) {
    result = result.filter(p => 
      p.reference.includes(search.value) || 
      p.method.includes(search.value)
    )
  }
  
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
        تاریخچه تسویه
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده تاریخچه تسویه‌های مالی
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
            همه تسویه‌ها
          </BaseButton>
          <BaseButton
            :color="filter === 'completed' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'completed'"
          >
            تکمیل شده
          </BaseButton>
          <BaseButton
            :color="filter === 'pending' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'pending'"
          >
            در انتظار
          </BaseButton>
        </div>
        
        <div class="md:w-64">
          <BaseInput
            v-model="search"
            placeholder="جستجوی شناسه یا روش..."
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

    <!-- Payouts List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="payout in filteredPayouts"
          :key="payout.id"
          class="flex items-center justify-between p-4"
        >
          <div>
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white">
              {{ payout.reference }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500 text-sm">
              {{ payout.date }} - {{ payout.method }}
            </BaseParagraph>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-medium">{{ payout.amount }} تومان</span>
            <BaseTag
              :color="payout.status === 'completed' ? 'success' : 'warning'"
              variant="pastel"
              size="sm"
            >
              {{ payout.status === 'completed' ? 'تکمیل شده' : 'در انتظار' }}
            </BaseTag>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
