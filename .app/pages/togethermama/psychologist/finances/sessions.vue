<script setup lang="ts">
definePageMeta({
  title: 'جلسات مالی - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const sessions = ref([
  {
    id: 1,
    mother: 'زهرا محمدی',
    child: 'امیرمحمد',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۰:۳۰',
    amount: '250,000',
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    id: 2,
    mother: 'احمد رضوی',
    child: 'سارا',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۱:۳۰',
    amount: '250,000',
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    id: 3,
    mother: 'فاطمه کریمی',
    child: 'حسین',
    date: '۱۴۰۳/۰۵/۱۴',
    time: '۱۴:۰۰',
    amount: '250,000',
    status: 'completed',
    paymentStatus: 'paid',
  },
  {
    id: 4,
    mother: 'محمد احمدی',
    child: 'نرگس',
    date: '۱۴۰۳/۰۵/۱۴',
    time: '۰۹:۰۰',
    amount: '250,000',
    status: 'completed',
    paymentStatus: 'pending',
  },
  {
    id: 5,
    mother: 'مریم حسینی',
    child: 'آرین',
    date: '۱۴۰۳/۰۵/۱۳',
    time: '۱۵:۳۰',
    amount: '250,000',
    status: 'completed',
    paymentStatus: 'paid',
  },
])

const filter = ref('all')
const search = ref('')

const filteredSessions = computed(() => {
  let result = sessions.value
  
  if (filter.value !== 'all') {
    result = result.filter(s => s.paymentStatus === filter.value)
  }
  
  if (search.value) {
    result = result.filter(s => 
      s.mother.includes(search.value) || 
      s.child.includes(search.value)
    )
  }
  
  return result
})

const totalEarnings = computed(() => {
  return filteredSessions.value
    .filter(s => s.paymentStatus === 'paid')
    .reduce((sum, session) => sum + parseInt(session.amount.replace(/,/g, '')), 0)
    .toLocaleString()
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
        جلسات مالی
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت درآمد جلسات
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
            همه جلسات
          </BaseButton>
          <BaseButton
            :color="filter === 'paid' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'paid'"
          >
            پرداخت شده
          </BaseButton>
          <BaseButton
            :color="filter === 'pending' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'pending'"
          >
            در انتظار پرداخت
          </BaseButton>
        </div>
        
        <div class="md:w-64">
          <BaseInput
            v-model="search"
            placeholder="جستجوی مادر یا کودک..."
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

    <!-- Summary -->
    <BaseCard class="mb-6 p-5">
      <div class="flex items-center justify-between">
        <BaseHeading as="h2" size="md" weight="semibold" class="text-muted-800 dark:text-white">
          مجموع درآمد
        </BaseHeading>
        <BaseHeading as="h3" size="xl" weight="bold" class="text-muted-800 dark:text-white">
          {{ totalEarnings }} تومان
        </BaseHeading>
      </div>
    </BaseCard>

    <!-- Sessions List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="session in filteredSessions"
          :key="session.id"
          class="flex items-center justify-between p-4"
        >
          <div>
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white">
              {{ session.mother }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500 text-sm">
              کودک: {{ session.child }} - {{ session.date }} - {{ session.time }}
            </BaseParagraph>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-medium">{{ session.amount }} تومان</span>
            <BaseTag
              :color="session.paymentStatus === 'paid' ? 'success' : 'warning'"
              variant="pastel"
              size="sm"
            >
              {{ session.paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار' }}
            </BaseTag>
            <NuxtLink :to="`/togethermama/psychologist/sessions/${session.id}`">
              <BaseButton size="sm" color="muted" variant="outline">
                مشاهده
              </BaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
