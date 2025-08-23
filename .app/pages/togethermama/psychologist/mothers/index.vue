<script setup lang="ts">
definePageMeta({
  title: 'مدیریت مادران - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const mothers = ref([
  {
    id: 1,
    name: 'زهرا محمدی',
    child: 'امیرمحمد',
    childAge: '۲ سال و ۳ ماه',
    phone: '09123456789',
    email: 'zahra.mohammadi@example.com',
    lastSession: '۱۴۰۳/۰۵/۱۵',
    totalSessions: 8,
    avatar: '/img/avatars/10.svg',
  },
  {
    id: 2,
    name: 'احمد رضوی',
    child: 'سارا',
    childAge: '۴ سال',
    phone: '09129876543',
    email: 'ahmad.rezavi@example.com',
    lastSession: '۱۴۰۳/۰۵/۱۴',
    totalSessions: 5,
    avatar: '/img/avatars/16.svg',
  },
  {
    id: 3,
    name: 'فاطمه کریمی',
    child: 'حسین',
    childAge: '۳ سال و ۶ ماه',
    phone: '09124567890',
    email: 'fateme.karimi@example.com',
    lastSession: '۱۴۰۳/۰۵/۱۰',
    totalSessions: 12,
    avatar: '/img/avatars/2.svg',
  },
])

const search = ref('')
const sortBy = ref('name')

const filteredMothers = computed(() => {
  let result = [...mothers.value]
  
  if (search.value) {
    result = result.filter(m => 
      m.name.includes(search.value) || 
      m.child.includes(search.value) ||
      m.email.includes(search.value)
    )
  }
  
  // Sort by selected criteria
  result.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'lastSession') {
      return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime()
    } else {
      return b.totalSessions - a.totalSessions
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
        مدیریت مادران
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت مادران تحت درمان
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
            <option value="name">مرتب‌سازی بر اساس نام</option>
            <option value="lastSession">مرتب‌سازی بر اساس آخرین جلسه</option>
            <option value="totalSessions">مرتب‌سازی بر اساس تعداد جلسات</option>
          </BaseSelect>
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

    <!-- Mothers List -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BaseCard
        v-for="mother in filteredMothers"
        :key="mother.id"
        class="p-5 transition-shadow hover:shadow-md"
      >
        <div class="text-center">
          <BaseAvatar
            :src="mother.avatar"
            :text="mother.name.substring(0, 2)"
            size="xl"
            class="mx-auto mb-4"
          />
          
          <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-1">
            {{ mother.name }}
          </BaseHeading>
          
          <BaseParagraph class="text-muted-500 mb-2">
            کودک: {{ mother.child }} ({{ mother.childAge }})
          </BaseParagraph>
          
          <div class="mb-4 flex justify-center gap-2">
            <BaseTag color="primary" variant="pastel" size="sm">
              {{ mother.totalSessions }} جلسه
            </BaseTag>
          </div>
          
          <div class="mb-4 space-y-2">
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:envelope" class="text-muted-500 size-4" />
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
                {{ mother.email }}
              </BaseParagraph>
            </div>
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:phone" class="text-muted-500 size-4" />
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
                {{ mother.phone }}
              </BaseParagraph>
            </div>
            <div class="flex items-center justify-center gap-2">
              <Icon name="ph:calendar" class="text-muted-500 size-4" />
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
                آخرین جلسه: {{ mother.lastSession }}
              </BaseParagraph>
            </div>
          </div>
          
          <div class="flex gap-2">
            <NuxtLink :to="`/togethermama/psychologist/mothers/${mother.id}`">
              <BaseButton size="sm" color="muted" variant="outline" class="flex-1">
                مشاهده پروفایل
              </BaseButton>
            </NuxtLink>
            <NuxtLink :to="`/togethermama/psychologist/sessions/book-${mother.id}`">
              <BaseButton size="sm" color="primary" class="flex-1">
                جلسه جدید
              </BaseButton>
            </NuxtLink>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
