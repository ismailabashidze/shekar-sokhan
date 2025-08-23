<script setup lang="ts">
definePageMeta({
  title: 'مشاوران',
  layout: 'default',
})

const psychologists = [
  {
    id: 1,
    name: 'دکتر مریم محمدی',
    specialty: 'روانشناس کودک و نوجوان',
    experience: '8 سال',
    rating: 4.8,
    reviews: 124,
    image: '/img/avatars/1.svg',
    about: 'متخصص در زمینه رشد کودکان و مشکلات رفتاری نوجوانان',
    languages: ['فارسی', 'انگلیسی'],
    sessions: ['آنلاین', 'حضوری'],
  },
  {
    id: 2,
    name: 'دکتر علی رضایی',
    specialty: 'مشاور خانواده',
    experience: '12 سال',
    rating: 4.9,
    reviews: 89,
    image: '/img/avatars/2.svg',
    about: 'متخصص در زمینه مشکلات خانوادگی و روابط بین فردی',
    languages: ['فارسی', 'انگلیسی', 'فرانسوی'],
    sessions: ['آنلاین'],
  },
  {
    id: 3,
    name: 'دکتر زهرا کریمی',
    specialty: 'متخصص تربیت فرزند',
    experience: '6 سال',
    rating: 4.7,
    reviews: 156,
    image: '/img/avatars/3.svg',
    about: 'متخصص در زمینه تربیت فرزند و روش‌های آموزش مؤثر',
    languages: ['فارسی'],
    sessions: ['حضوری'],
  },
  {
    id: 4,
    name: 'دکتر حسن احمدی',
    specialty: 'روان‌درمانگر',
    experience: '10 سال',
    rating: 4.6,
    reviews: 78,
    image: '/img/avatars/4.svg',
    about: 'متخصص در زمینه درمان اختلالات روانی و اضطراب',
    languages: ['فارسی', 'انگلیسی'],
    sessions: ['آنلاین', 'حضوری'],
  },
]

const specialties = [
  { label: 'همه تخصص‌ها', value: 'all' },
  { label: 'روانشناس کودک و نوجوان', value: 'child' },
  { label: 'مشاور خانواده', value: 'family' },
  { label: 'متخصص تربیت فرزند', value: 'parenting' },
  { label: 'روان‌درمانگر', value: 'therapist' },
]

const selectedSpecialty = ref('all')
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <span>مشاوران</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>مشاوران متخصص خود را انتخاب کنید</span>
      </BaseParagraph>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <div class="min-w-[200px]">
          <BaseSelect
            v-model="selectedSpecialty"
            :options="specialties"
            label="تخصص"
          />
        </div>
        <BaseButton color="muted" variant="outline">
          <Icon name="ph:funnel" class="mr-2 size-5" />
          <span>فیلتر</span>
        </BaseButton>
      </div>
    </div>

    <!-- Psychologists Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <NuxtLink
        v-for="psychologist in psychologists"
        :key="psychologist.id"
        :to="`/togethermama/mother/psychologist/${psychologist.id}`"
      >
        <BaseCard class="dark:hover:border-primary-500/50 hover:border-primary-300 cursor-pointer p-6 transition-all hover:shadow-lg">
          <div class="flex gap-6">
            <BaseAvatar
              :src="psychologist.image"
              size="xl"
              class="shrink-0"
            />
            
            <div class="flex-1">
              <div class="mb-2 flex items-start justify-between">
                <div>
                  <BaseHeading
                    as="h2"
                    size="lg"
                    weight="semibold"
                    class="text-muted-800 dark:text-white"
                  >
                    {{ psychologist.name }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500">
                    {{ psychologist.specialty }}
                  </BaseParagraph>
                </div>
                
                <div class="flex items-center gap-1">
                  <Icon name="ph:star-fill" class="text-amber-500 size-4" />
                  <BaseParagraph size="sm" class="text-muted-800 dark:text-white font-medium">
                    {{ psychologist.rating }}
                  </BaseParagraph>
                  <BaseParagraph size="xs" class="text-muted-500">
                    ({{ psychologist.reviews }})
                  </BaseParagraph>
                </div>
              </div>
              
              <div class="mb-3 flex items-center gap-4">
                <div class="flex items-center gap-1">
                  <Icon name="ph:briefcase" class="text-muted-500 size-4" />
                  <BaseParagraph size="sm" class="text-muted-500">
                    {{ psychologist.experience }} تجربه
                  </BaseParagraph>
                </div>
                
                <div class="flex items-center gap-1">
                  <Icon name="ph:chat-circle" class="text-muted-500 size-4" />
                  <BaseParagraph size="sm" class="text-muted-500">
                    {{ psychologist.sessions.join(', ') }}
                  </BaseParagraph>
                </div>
              </div>
              
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-4 line-clamp-2">
                {{ psychologist.about }}
              </BaseParagraph>
              
              <div class="flex flex-wrap gap-2">
                <BaseTag
                  v-for="language in psychologist.languages"
                  :key="language"
                  color="primary"
                  variant="pastel"
                  size="sm"
                >
                  {{ language }}
                </BaseTag>
              </div>
            </div>
          </div>
        </BaseCard>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex items-center justify-between">
      <BaseParagraph size="sm" class="text-muted-500">
        نمایش 1 تا {{ psychologists.length }} از {{ psychologists.length }} مشاور
      </BaseParagraph>
      <div class="flex items-center gap-2">
        <BaseButton size="sm" color="muted" variant="outline" disabled>
          <Icon name="ph:caret-right" class="size-4" />
        </BaseButton>
        <BaseButton size="sm" color="primary" variant="solid">
          1
        </BaseButton>
        <BaseButton size="sm" color="muted" variant="outline" disabled>
          <Icon name="ph:caret-left" class="size-4" />
        </BaseButton>
      </div>
    </div>
  </div>
</template>
