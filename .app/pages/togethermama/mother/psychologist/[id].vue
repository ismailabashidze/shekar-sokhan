<script setup lang="ts">
definePageMeta({
  title: 'پروفایل مشاور',
  layout: 'default',
})

// Mock psychologist data
const psychologist = {
  id: 1,
  name: 'دکتر مریم محمدی',
  specialty: 'روانشناس کودک و نوجوان',
  experience: '8 سال',
  rating: 4.8,
  reviews: 124,
  image: '/img/avatars/1.svg',
  about: 'متخصص در زمینه رشد کودکان و مشکلات رفتاری نوجوانان. دارای مدرک دکتری روانشناسی کودک از دانشگاه تهران و عضو انجمن روانشناسی ایران.',
  languages: ['فارسی', 'انگلیسی'],
  sessions: ['آنلاین', 'حضوری'],
  education: [
    {
      degree: 'دکتری روانشناسی کودک',
      university: 'دانشگاه تهران',
      year: '1395',
    },
    {
      degree: 'کارشناسی ارشد روانشناسی عمومی',
      university: 'دانشگاه شهید بهشتی',
      year: '1390',
    },
  ],
  certifications: [
    'گواهی تخصصی روانشناسی کودک - انجمن روانشناسی ایران',
    'گواهی تخصصی مشاوره خانواده',
  ],
}

const reviews = [
  {
    id: 1,
    user: 'فاطمه رضایی',
    rating: 5,
    date: '1402/02/15',
    comment: 'جلسه بسیار مفید بود. دکتر محمدی به خوبی مشکل فرزندم را درک کردند و راهکارهای عملی ارائه دادند.',
  },
  {
    id: 2,
    user: 'زهرا حسینی',
    rating: 4,
    date: '1402/01/22',
    comment: 'مشاوره خوبی بود. تنها نکته این بود که زمان جلسه کمی طولانی شد.',
  },
  {
    id: 3,
    user: 'مریم کریمی',
    rating: 5,
    date: '1401/12/10',
    comment: 'بسیار راضی ام. دکتر محمدی صبور و حرفه‌ای هستند و با کودکم ارتباط خوبی برقرار کردند.',
  },
]

const bookSession = () => {
  navigateTo(`/togethermama/mother/psychologist/sessions/book-${psychologist.id}`)
}
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
        <span>پروفایل مشاور</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>اطلاعات تکمیلی مشاور و نظرات کاربران</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Psychologist Info -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <div class="flex flex-col gap-6 md:flex-row">
            <BaseAvatar
              :src="psychologist.image"
              size="2xl"
              class="shrink-0"
            />
            
            <div class="flex-1">
              <div class="mb-4">
                <BaseHeading
                  as="h2"
                  size="2xl"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  {{ psychologist.name }}
                </BaseHeading>
                <BaseParagraph size="lg" class="text-muted-500">
                  {{ psychologist.specialty }}
                </BaseParagraph>
              </div>
              
              <div class="mb-4 flex flex-wrap items-center gap-4">
                <div class="flex items-center gap-1">
                  <Icon name="ph:star-fill" class="text-amber-500 size-5" />
                  <BaseParagraph size="md" class="text-muted-800 dark:text-white font-medium">
                    {{ psychologist.rating }}
                  </BaseParagraph>
                  <BaseParagraph size="sm" class="text-muted-500">
                    ({{ psychologist.reviews }} نظر)
                  </BaseParagraph>
                </div>
                
                <div class="flex items-center gap-1">
                  <Icon name="ph:briefcase" class="text-muted-500 size-5" />
                  <BaseParagraph size="sm" class="text-muted-500">
                    {{ psychologist.experience }} تجربه
                  </BaseParagraph>
                </div>
                
                <div class="flex items-center gap-1">
                  <Icon name="ph:chat-circle" class="text-muted-500 size-5" />
                  <BaseParagraph size="sm" class="text-muted-500">
                    {{ psychologist.sessions.join(', ') }}
                  </BaseParagraph>
                </div>
              </div>
              
              <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-6">
                {{ psychologist.about }}
              </BaseParagraph>
              
              <div class="flex flex-wrap gap-2">
                <BaseTag
                  v-for="language in psychologist.languages"
                  :key="language"
                  color="primary"
                  variant="pastel"
                >
                  {{ language }}
                </BaseTag>
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end">
            <BaseButton color="primary" size="lg" @click="bookSession">
              <Icon name="ph:calendar-plus" class="mr-2 size-5" />
              <span>رزرو جلسه مشاوره</span>
            </BaseButton>
          </div>
        </BaseCard>

        <!-- Education -->
        <BaseCard class="p-6 mt-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              سوابق تحصیلی
            </BaseHeading>
          </div>
          
          <div class="space-y-4">
            <div
              v-for="(edu, index) in psychologist.education"
              :key="index"
              class="flex items-start gap-4"
            >
              <BaseIconBox
                color="primary"
                size="md"
                rounded="lg"
              >
                <Icon name="ph:graduation-cap" class="size-5" />
              </BaseIconBox>
              <div>
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  class="text-muted-800 dark:text-white"
                >
                  {{ edu.degree }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500">
                  {{ edu.university }} - {{ edu.year }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Certifications -->
        <BaseCard class="p-6 mt-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              گواهی‌نامه‌ها
            </BaseHeading>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="(cert, index) in psychologist.certifications"
              :key="index"
              class="flex items-start gap-3"
            >
              <Icon name="ph:seal-check-fill" class="text-success-500 mt-0.5 size-5" />
              <BaseParagraph class="text-muted-700 dark:text-muted-300">
                {{ cert }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Reviews Summary -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              نظرات کاربران
            </BaseHeading>
          </div>
          
          <div class="mb-6 text-center">
            <div class="mb-2 flex items-center justify-center gap-1">
              <Icon name="ph:star-fill" class="text-amber-500 size-8" />
              <BaseHeading
                as="h3"
                size="2xl"
                weight="bold"
                class="text-muted-800 dark:text-white"
              >
                {{ psychologist.rating }}
              </BaseHeading>
              <BaseParagraph size="md" class="text-muted-500">
                از 5
              </BaseParagraph>
            </div>
            <BaseParagraph size="sm" class="text-muted-500">
              بر اساس {{ psychologist.reviews }} نظر
            </BaseParagraph>
          </div>
          
          <div class="space-y-3">
            <NuxtLink to="#reviews" class="block w-full">
              <BaseButton color="primary" variant="outline" class="w-full">
                <span>مشاهده همه نظرات</span>
              </BaseButton>
            </NuxtLink>
          </div>
        </BaseCard>

        <!-- Availability -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              زمان‌های در دسترس
            </BaseHeading>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">شنبه</BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-white">10:00 - 16:00</BaseParagraph>
            </div>
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">یکشنبه</BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-white">14:00 - 18:00</BaseParagraph>
            </div>
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">دوشنبه</BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-white">10:00 - 16:00</BaseParagraph>
            </div>
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">چهارشنبه</BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-800 dark:text-white">16:00 - 20:00</BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Reviews Section -->
    <BaseCard id="reviews" class="p-6 mt-6">
      <div class="mb-6">
        <BaseHeading
          as="h2"
          size="lg"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          نظرات کاربران
        </BaseHeading>
      </div>
      
      <div class="space-y-6">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="dark:border-muted-700 border-b border-muted-200 pb-6 last:border-0 last:pb-0"
        >
          <div class="mb-3 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              {{ review.user }}
            </BaseHeading>
            <div class="flex items-center gap-1">
              <Icon
                v-for="i in 5"
                :key="i"
                :name="i <= review.rating ? 'ph:star-fill' : 'ph:star'"
                class="text-amber-500 size-4"
              />
              <BaseParagraph size="sm" class="text-muted-500 mr-2">
                {{ review.date }}
              </BaseParagraph>
            </div>
          </div>
          <BaseParagraph class="text-muted-600 dark:text-muted-300">
            {{ review.comment }}
          </BaseParagraph>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
