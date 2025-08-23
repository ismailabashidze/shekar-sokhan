<script setup lang="ts">
definePageMeta({
  title: 'مدیریت جلسات - TogetherMama',
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
    type: 'آنلاین',
    status: 'completed',
    duration: '۶۰ دقیقه',
    notes: 'جلسه مفید درباره ترس کودک از مدرسه',
  },
  {
    id: 2,
    mother: 'احمد رضوی',
    child: 'سارا',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۱:۳۰',
    type: 'آنلاین',
    status: 'upcoming',
    duration: '۶۰ دقیقه',
    notes: 'جلسه برنامه‌ریزی شده برای بررسی رفتار جدید',
  },
  {
    id: 3,
    mother: 'فاطمه کریمی',
    child: 'حسین',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۴:۰۰',
    type: 'آنلاین',
    status: 'upcoming',
    duration: '۶۰ دقیقه',
    notes: 'جلسه پیگیری پیشرفت کودک',
  },
  {
    id: 4,
    mother: 'محمد احمدی',
    child: 'نرگس',
    date: '۱۴۰۳/۰۵/۱۴',
    time: '۰۹:۰۰',
    type: 'آنلاین',
    status: 'completed',
    duration: '۶۰ دقیقه',
    notes: 'جلسه اولیه برای آشنایی با کودک',
  },
  {
    id: 5,
    mother: 'مریم حسینی',
    child: 'آرین',
    date: '۱۴۰۳/۰۵/۱۳',
    time: '۱۵:۳۰',
    type: 'آنلاین',
    status: 'completed',
    duration: '۶۰ دقیقه',
    notes: 'جلسه مفید درباره مشکلات خواب کودک',
  },
])

const filter = ref('all')
const search = ref('')
const dateFilter = ref('all')

const filteredSessions = computed(() => {
  let result = sessions.value
  
  if (filter.value !== 'all') {
    result = result.filter(s => s.status === filter.value)
  }
  
  if (dateFilter.value !== 'all') {
    const today = new Date()
    if (dateFilter.value === 'today') {
      result = result.filter(s => s.date === formatDate(today))
    } else if (dateFilter.value === 'week') {
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      result = result.filter(s => {
        const sessionDate = new Date(s.date)
        return sessionDate >= weekAgo && sessionDate <= today
      })
    }
  }
  
  if (search.value) {
    result = result.filter(s => 
      s.mother.includes(search.value) || 
      s.child.includes(search.value) ||
      s.notes.includes(search.value)
    )
  }
  
  // Sort by date and time
  result.sort((a, b) => {
    if (a.date === b.date) {
      return a.time.localeCompare(b.time)
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
  
  return result
})

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
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
        مدیریت جلسات
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت جلسات مشاوره
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-6 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap gap-3">
          <BaseButton
            :color="filter === 'all' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'all'"
          >
            همه جلسات
          </BaseButton>
          <BaseButton
            :color="filter === 'upcoming' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'upcoming'"
          >
            جلسات آینده
          </BaseButton>
          <BaseButton
            :color="filter === 'completed' ? 'primary' : 'muted'"
            size="sm"
            @click="filter = 'completed'"
          >
            جلسات گذشته
          </BaseButton>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <BaseSelect
            v-model="dateFilter"
            shape="curved"
            :classes="{ input: 'h-10' }"
          >
            <option value="all">همه تاریخ‌ها</option>
            <option value="today">امروز</option>
            <option value="week">هفته جاری</option>
          </BaseSelect>
          
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
      </div>
    </BaseCard>

    <!-- Sessions List -->
    <div class="space-y-4">
      <BaseCard
        v-for="session in filteredSessions"
        :key="session.id"
        class="p-5"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <div
              :class="[
                'flex size-12 items-center justify-center rounded-full',
                session.status === 'upcoming' 
                  ? 'bg-primary-100 dark:bg-primary-500/20' 
                  : 'bg-success-100 dark:bg-success-500/20'
              ]"
            >
              <Icon
                :name="session.status === 'upcoming' ? 'ph:clock' : 'ph:check-circle'"
                :class="[
                  'size-6',
                  session.status === 'upcoming' ? 'text-primary-500' : 'text-success-500'
                ]"
              />
            </div>
            <div>
              <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                {{ session.mother }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                کودک: {{ session.child }}
              </BaseParagraph>
            </div>
          </div>
          
          <div class="flex-1">
            <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
              {{ session.notes }}
            </BaseParagraph>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="text-center md:text-right">
              <BaseParagraph class="text-muted-800 dark:text-white font-medium">
                {{ session.date }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ session.time }} ({{ session.duration }})
              </BaseParagraph>
            </div>
            
            <BaseTag
              :color="session.status === 'upcoming' ? 'primary' : 'success'"
              variant="pastel"
            >
              {{ session.status === 'upcoming' ? 'آینده' : 'انجام شده' }}
            </BaseTag>
            
            <NuxtLink :to="`/togethermama/psychologist/sessions/${session.id}`">
              <BaseButton size="sm" color="muted" variant="outline">
                مشاهده
              </BaseButton>
            </NuxtLink>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
