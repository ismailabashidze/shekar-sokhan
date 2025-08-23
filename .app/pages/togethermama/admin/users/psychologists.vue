<script setup lang="ts">
definePageMeta({
  title: 'مدیریت روانشناسان - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const psychologists = ref([
  {
    id: 1,
    name: 'دکتر مریم ترابی',
    email: 'maryam.tarabi@example.com',
    phone: '09123456789',
    specialty: 'روانشناس کودک',
    license: '123456',
    experience: '۸ سال',
    rating: 4.8,
    reviews: 124,
    registrationDate: '۱۴۰۲/۱۰/۱۵',
    status: 'active',
    avatar: '/img/avatars/2.svg',
  },
  {
    id: 2,
    name: 'دکتر علی بهرامی',
    email: 'ali.bahrami@example.com',
    phone: '09129876543',
    specialty: 'متخصص رفتار کودک',
    license: '789012',
    experience: '۱۲ سال',
    rating: 4.9,
    reviews: 98,
    registrationDate: '۱۴۰۲/۱۱/۲۰',
    status: 'active',
    avatar: '/img/avatars/16.svg',
  },
  {
    id: 3,
    name: 'دکتر کاملیا مرادزاده',
    email: 'kamila.moradzadeh@example.com',
    phone: '09124567890',
    specialty: 'روان درمانگر کودک',
    license: '345678',
    experience: '۱۰ سال',
    rating: 4.7,
    reviews: 156,
    registrationDate: '۱۴۰۲/۱۲/۱۰',
    status: 'pending',
    avatar: '/img/avatars/10.svg',
  },
])

const search = ref('')
const statusFilter = ref('all')

const filteredPsychologists = computed(() => {
  let result = psychologists.value
  
  if (statusFilter.value !== 'all') {
    result = result.filter(p => p.status === statusFilter.value)
  }
  
  if (search.value) {
    result = result.filter(p => 
      p.name.includes(search.value) || 
      p.email.includes(search.value) ||
      p.specialty.includes(search.value) ||
      p.license.includes(search.value)
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
  const psychologist = psychologists.value.find(p => p.id === id)
  if (psychologist) {
    if (psychologist.status === 'pending') {
      psychologist.status = 'active'
    } else {
      psychologist.status = psychologist.status === 'active' ? 'inactive' : 'active'
    }
    alert(`وضعیت ${psychologist.name} به ${psychologist.status === 'active' ? 'فعال' : psychologist.status === 'pending' ? 'در انتظار' : 'غیرفعال'} تغییر کرد`)
  }
}

const viewProfile = (id: number) => {
  // Mock view profile functionality
  alert(`مشاهده پروفایل روانشناس با شناسه ${id}`)
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
        مدیریت روانشناسان
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        مشاهده و مدیریت حساب‌های روانشناسان
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
            همه روانشناسان
          </BaseButton>
          <BaseButton
            :color="statusFilter === 'active' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'active'"
          >
            فعال
          </BaseButton>
          <BaseButton
            :color="statusFilter === 'pending' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'pending'"
          >
            در انتظار تأیید
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

    <!-- Psychologists List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="psychologist in filteredPsychologists"
          :key="psychologist.id"
          class="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center gap-4">
            <BaseAvatar
              :src="psychologist.avatar"
              :text="psychologist.name.substring(0, 2)"
              size="md"
            />
            <div>
              <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                {{ psychologist.name }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ psychologist.email }} - {{ psychologist.phone }}
              </BaseParagraph>
            </div>
          </div>
          
          <div class="flex-1">
            <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
              {{ psychologist.specialty }} - {{ psychologist.experience }}
            </BaseParagraph>
            <div class="mt-1 flex items-center gap-2">
              <Icon name="ph:star" class="text-warning-500 size-4" />
              <span class="text-sm font-medium">{{ psychologist.rating }}</span>
              <span class="text-muted-400 text-sm">({{ psychologist.reviews }} نظر)</span>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <BaseTag
              :color="psychologist.status === 'active' ? 'success' : psychologist.status === 'pending' ? 'warning' : 'danger'"
              variant="pastel"
              size="sm"
            >
              {{ psychologist.status === 'active' ? 'فعال' : psychologist.status === 'pending' ? 'در انتظار' : 'غیرفعال' }}
            </BaseTag>
            <div class="text-center md:text-right">
              <BaseParagraph class="text-muted-800 dark:text-white text-sm">
                شماره نظام: {{ psychologist.license }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-xs">
                عضویت: {{ psychologist.registrationDate }}
              </BaseParagraph>
            </div>
            <div class="flex gap-2">
              <BaseButtonIcon size="sm" color="muted" @click="viewProfile(psychologist.id)">
                <Icon name="ph:eye" class="size-4" />
              </BaseButtonIcon>
              <BaseButtonIcon 
                size="sm" 
                :color="psychologist.status === 'active' ? 'danger' : psychologist.status === 'pending' ? 'success' : 'success'"
                @click="toggleStatus(psychologist.id)"
              >
                <Icon 
                  :name="psychologist.status === 'active' ? 'ph:pause' : psychologist.status === 'pending' ? 'ph:check' : 'ph:play'" 
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
