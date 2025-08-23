<script setup lang="ts">
definePageMeta({
  title: 'تسویه‌های در انتظار - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const pendingPayouts = ref([
  {
    id: 1,
    user: 'دکتر مریم ترابی',
    amount: '8,000,000',
    method: 'حساب بانک ملی',
    requestDate: '۱۴۰۳/۰۵/۰۱',
    status: 'pending',
  },
  {
    id: 2,
    user: 'دکتر علی بهرامی',
    amount: '6,500,000',
    method: 'حساب بانک صادرات',
    requestDate: '۱۴۰۳/۰۵/۰۵',
    status: 'pending',
  },
  {
    id: 3,
    user: 'دکتر کاملیا مرادزاده',
    amount: '7,200,000',
    method: 'حساب بانک ملت',
    requestDate: '۱۴۰۳/۰۵/۰۳',
    status: 'pending',
  },
])

const search = ref('')

const filteredPayouts = computed(() => {
  let result = pendingPayouts.value
  
  if (search.value) {
    result = result.filter(p => 
      p.user.includes(search.value) || 
      p.method.includes(search.value)
    )
  }
  
  // Sort by request date
  result.sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  })
  
  return result
})

const approvePayout = (id: number) => {
  // Mock approve payout functionality
  alert(`تسویه با شناسه ${id} تأیید شد`)
}

const rejectPayout = (id: number) => {
  // Mock reject payout functionality
  if (confirm('آیا مطمئن هستید که می‌خواهید این تسویه را رد کنید؟')) {
    alert(`تسویه با شناسه ${id} رد شد`)
  }
}
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
        تسویه‌های در انتظار
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و تأیید تسویه‌های در انتظار
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

    <!-- Pending Payouts List -->
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
              {{ payout.method }} - {{ payout.requestDate }}
            </BaseParagraph>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="font-medium">{{ payout.amount }} تومان</span>
            <BaseTag color="warning" variant="pastel" size="sm">
              در انتظار
            </BaseTag>
            <div class="flex gap-2">
              <BaseButton size="sm" color="success" @click="approvePayout(payout.id)">
                تأیید
              </BaseButton>
              <BaseButton size="sm" color="danger" variant="outline" @click="rejectPayout(payout.id)">
                رد
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
