<script setup lang="ts">
definePageMeta({
  title: 'جلسات مشاوره - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const sessions = ref([
  {
    id: 1,
    psychologist: 'دکتر مریم ترابی',
    specialty: 'روانشناس کودک',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۰:۳۰',
    type: 'آنلاین',
    status: 'completed',
    notes: 'جلسه مفید درباره ترس کودک از مدرسه',
  },
  {
    id: 2,
    psychologist: 'دکتر مریم ترابی',
    specialty: 'روانشناس کودک',
    date: '۱۴۰۳/۰۵/۰۸',
    time: '۱۴:۰۰',
    type: 'آنلاین',
    status: 'completed',
    notes: 'بررسی پیشرفت کودک در ۲ هفته گذشته',
  },
  {
    id: 3,
    psychologist: 'دکتر علی بهرامی',
    specialty: 'متخصص رفتار کودک',
    date: '۱۴۰۳/۰۵/۲۰',
    time: '۱۱:۰۰',
    type: 'آنلاین',
    status: 'upcoming',
    notes: 'جلسه برنامه‌ریزی شده برای بررسی رفتار جدید',
  },
  {
    id: 4,
    psychologist: 'دکتر کاملیا مرادزاده',
    specialty: 'روان درمانگر کودک',
    date: '۱۴۰۳/۰۴/۲۵',
    time: '۰۹:۳۰',
    type: 'آنلاین',
    status: 'completed',
    notes: 'جلسه اولیه برای آشنایی با کودک',
  },
])

const filter = ref('all')
const search = ref('')

const filteredSessions = computed(() => {
  let result = sessions.value
  
  if (filter.value !== 'all') {
    result = result.filter(s => s.status === filter.value)
  }
  
  if (search.value) {
    result = result.filter(s => 
      s.psychologist.includes(search.value) || 
      s.specialty.includes(search.value) ||
      s.notes.includes(search.value)
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
        جلسات مشاوره
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت جلسات مشاوره شما
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
        
        <div class="md:w-64">
          <BaseInput
            v-model="search"
            placeholder="جستجو در جلسات..."
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
                  session.status === 'upcoming' 
                    ? 'text-primary-500' 
                    : 'text-success-500'
                ]"
              />
            </div>
            <div>
              <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                {{ session.psychologist }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ session.specialty }}
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
                {{ session.time }}
              </BaseParagraph>
            </div>
            
            <BaseTag
              :color="session.status === 'upcoming' ? 'primary' : 'success'"
              variant="pastel"
            >
              {{ session.status === 'upcoming' ? 'آینده' : 'انجام شده' }}
            </BaseTag>
            
            <NuxtLink :to="`/togethermama/mother/psychologist/sessions/${session.id}`">
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
