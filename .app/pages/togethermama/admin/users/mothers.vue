<script setup lang="ts">
definePageMeta({
  title: 'مدیریت مادران - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const mothers = ref([
  {
    id: 1,
    name: 'زهرا محمدی',
    email: 'zahra.mohammadi@example.com',
    phone: '09123456789',
    child: 'امیرمحمد',
    childAge: '۲ سال و ۳ ماه',
    registrationDate: '۱۴۰۳/۰۱/۱۵',
    lastSession: '۱۴۰۳/۰۵/۱۵',
    totalSessions: 8,
    status: 'active',
    avatar: '/img/avatars/10.svg',
  },
  {
    id: 2,
    name: 'احمد رضوی',
    email: 'ahmad.rezavi@example.com',
    phone: '09129876543',
    child: 'سارا',
    childAge: '۴ سال',
    registrationDate: '۱۴۰۳/۰۲/۲۰',
    lastSession: '۱۴۰۳/۰۵/۱۴',
    totalSessions: 5,
    status: 'active',
    avatar: '/img/avatars/16.svg',
  },
  {
    id: 3,
    name: 'فاطمه کریمی',
    email: 'fateme.karimi@example.com',
    phone: '09124567890',
    child: 'حسین',
    childAge: '۳ سال و ۶ ماه',
    registrationDate: '۱۴۰۳/۰۳/۱۰',
    lastSession: '۱۴۰۳/۰۵/۱۰',
    totalSessions: 12,
    status: 'active',
    avatar: '/img/avatars/2.svg',
  },
])

const search = ref('')
const statusFilter = ref('all')

const filteredMothers = computed(() => {
  let result = mothers.value
  
  if (statusFilter.value !== 'all') {
    result = result.filter(m => m.status === statusFilter.value)
  }
  
  if (search.value) {
    result = result.filter(m => 
      m.name.includes(search.value) || 
      m.email.includes(search.value) ||
      m.child.includes(search.value)
    )
  }
  
  // Sort by registration date
  result.sort((a, b) => {
    return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
  })
  
  return result
})

const toggleStatus = (id: number) => {
  // Mock toggle status functionality
  const mother = mothers.value.find(m => m.id === id)
  if (mother) {
    mother.status = mother.status === 'active' ? 'inactive' : 'active'
    alert(`وضعیت ${mother.name} به ${mother.status === 'active' ? 'فعال' : 'غیرفعال'} تغییر کرد`)
  }
}

const viewProfile = (id: number) => {
  // Mock view profile functionality
  alert(`مشاهده پروفایل کاربر با شناسه ${id}`)
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
        مدیریت مادران
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت حساب‌های مادران
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-6 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex gap-3">
          <BaseButton
            :color="statusFilter === 'all' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'all'"
          >
            همه مادران
          </BaseButton>
          <BaseButton
            :color="statusFilter === 'active' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'active'"
          >
            فعال
          </BaseButton>
          <BaseButton
            :color="statusFilter === 'inactive' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'inactive'"
          >
            غیرفعال
          </BaseButton>
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

    <!-- Mothers List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="mother in filteredMothers"
          :key="mother.id"
          class="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center gap-4">
            <BaseAvatar
              :src="mother.avatar"
              :text="mother.name.substring(0, 2)"
              size="md"
            />
            <div>
              <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                {{ mother.name }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ mother.email }} - {{ mother.phone }}
              </BaseParagraph>
            </div>
          </div>
          
          <div class="flex-1">
            <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
              کودک: {{ mother.child }} ({{ mother.childAge }})
            </BaseParagraph>
          </div>
          
          <div class="flex items-center gap-4">
            <BaseTag
              :color="mother.status === 'active' ? 'success' : 'danger'"
              variant="pastel"
              size="sm"
            >
              {{ mother.status === 'active' ? 'فعال' : 'غیرفعال' }}
            </BaseTag>
            <div class="text-center md:text-right">
              <BaseParagraph class="text-muted-800 dark:text-white text-sm">
                جلسات: {{ mother.totalSessions }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-xs">
                آخرین جلسه: {{ mother.lastSession }}
              </BaseParagraph>
            </div>
            <div class="flex gap-2">
              <BaseButtonIcon size="sm" color="muted" @click="viewProfile(mother.id)">
                <Icon name="ph:eye" class="size-4" />
              </BaseButtonIcon>
              <BaseButtonIcon 
                size="sm" 
                :color="mother.status === 'active' ? 'danger' : 'success'"
                @click="toggleStatus(mother.id)"
              >
                <Icon 
                  :name="mother.status === 'active' ? 'ph:pause' : 'ph:play'" 
                  class="size-4" 
                />
              </BaseButtonIcon>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
