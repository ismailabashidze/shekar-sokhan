<script setup lang="ts">
definePageMeta({
  title: 'داشبورد مادر - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const mother = ref({
  name: 'زهرا محمدی',
  childName: 'امیرمحمد',
  childAge: '۲ سال و ۳ ماه',
  childGender: 'پسر',
  avatar: '/img/avatars/10.svg',
})

const upcomingSessions = ref([
  {
    id: 1,
    psychologist: 'دکتر مریم ترابی',
    specialty: 'روانشناس کودک',
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۰:۳۰',
    type: 'آنلاین',
  },
  {
    id: 2,
    psychologist: 'دکتر علی بهرامی',
    specialty: 'متخصص رفتار کودک',
    date: '۱۴۰۳/۰۵/۱۸',
    time: '۱۴:۰۰',
    type: 'آنلاین',
  },
])

const recentArticles = ref([
  {
    id: 1,
    title: '۵ راه برای مدیریت خشم کودک',
    excerpt: 'روش‌هایی موثر برای کمک به کودک در کنترل احساساتش',
    readTime: '۵ دقیقه',
    category: 'رفتار کودک',
  },
  {
    id: 2,
    title: 'تاثیر بازی بر رشد ذهنی کودک',
    excerpt: 'چگونه بازی می‌تواند به توسعه مهارت‌های کودک کمک کند',
    readTime: '۷ دقیقه',
    category: 'رشد کودک',
  },
])

const subscription = ref({
  plan: 'استاندارد',
  endDate: '۱۴۰۳/۰۶/۱۵',
  sessionsUsed: 2,
  sessionsTotal: 4,
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
        خوش آمدید، {{ mother.name }}
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        به داشبورد والدین TogetherMama خوش آمدید
      </BaseParagraph>
    </div>

    <!-- Stats Cards -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <BaseCard class="p-6">
        <div class="flex items-center gap-4">
          <div class="bg-primary-100 dark:bg-primary-500/20 flex size-12 items-center justify-center rounded-full">
            <Icon name="ph:baby-duotone" class="text-primary-500 size-6" />
          </div>
          <div>
            <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
              {{ mother.childName }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500">
              {{ mother.childAge }}
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-6">
        <div class="flex items-center gap-4">
          <div class="bg-success-100 dark:bg-success-500/20 flex size-12 items-center justify-center rounded-full">
            <Icon name="ph:calendar-duotone" class="text-success-500 size-6" />
          </div>
          <div>
            <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
              جلسات باقی‌مانده
            </BaseHeading>
            <BaseParagraph class="text-muted-500">
              {{ subscription.sessionsTotal - subscription.sessionsUsed }} از {{ subscription.sessionsTotal }}
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-6">
        <div class="flex items-center gap-4">
          <div class="bg-info-100 dark:bg-info-500/20 flex size-12 items-center justify-center rounded-full">
            <Icon name="ph:clock-duotone" class="text-info-500 size-6" />
          </div>
          <div>
            <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
              پایان اشتراک
            </BaseHeading>
            <BaseParagraph class="text-muted-500">
              {{ subscription.endDate }}
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Upcoming Sessions -->
    <div class="mb-8">
      <div class="mb-4 flex items-center justify-between">
        <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
          جلسات آینده
        </BaseHeading>
        <NuxtLink
          to="/togethermama/mother/psychologist/sessions"
          class="text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
        >
          مشاهده همه
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BaseCard
          v-for="session in upcomingSessions"
          :key="session.id"
          class="p-5 transition-shadow hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                {{ session.psychologist }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ session.specialty }}
              </BaseParagraph>
              <div class="mt-3 flex items-center gap-4">
                <div class="flex items-center gap-1 text-sm">
                  <Icon name="ph:calendar" class="text-muted-500" />
                  <span>{{ session.date }}</span>
                </div>
                <div class="flex items-center gap-1 text-sm">
                  <Icon name="ph:clock" class="text-muted-500" />
                  <span>{{ session.time }}</span>
                </div>
              </div>
            </div>
            <BaseTag color="primary" variant="pastel">
              {{ session.type }}
            </BaseTag>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Recent Articles -->
    <div>
      <div class="mb-4 flex items-center justify-between">
        <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
          مقالات تازه
        </BaseHeading>
        <NuxtLink
          to="/togethermama/mother/articles"
          class="text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
        >
          مشاهده همه
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BaseCard
          v-for="article in recentArticles"
          :key="article.id"
          class="p-5 transition-shadow hover:shadow-md"
        >
          <div class="mb-3">
            <BaseTag color="muted" variant="pastel" size="sm">
              {{ article.category }}
            </BaseTag>
          </div>
          <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-2">
            {{ article.title }}
          </BaseHeading>
          <BaseParagraph class="text-muted-500 mb-3 text-sm">
            {{ article.excerpt }}
          </BaseParagraph>
          <div class="flex items-center justify-between">
            <span class="text-muted-400 text-xs">{{ article.readTime }} مطالعه</span>
            <NuxtLink
              :to="`/togethermama/mother/articles/${article.id}`"
              class="text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
            >
              ادامه مطلب
            </NuxtLink>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
