<script setup lang="ts">
definePageMeta({
  title: 'داشبورد مدیریت - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const stats = ref([
  { label: 'کل مادران', value: '1,248', icon: 'ph:users', color: 'primary' },
  { label: 'کل روانشناسان', value: '42', icon: 'ph:graduation-cap', color: 'success' },
  { label: 'جلسات امروز', value: '68', icon: 'ph:calendar', color: 'info' },
  { label: 'درآمد امروز', value: '12,500,000', icon: 'ph:currency-circle-dollar', color: 'warning' },
])

const recentActivities = ref([
  {
    id: 1,
    user: 'زهرا محمدی',
    action: 'ثبت‌نام جدید',
    target: 'مادر',
    time: '۵ دقیقه پیش',
  },
  {
    id: 2,
    user: 'دکتر مریم ترابی',
    action: 'جلسه تکمیل شد',
    target: 'امیرمحمد',
    time: '۱۰ دقیقه پیش',
  },
  {
    id: 3,
    user: 'احمد رضوی',
    action: 'پرداخت انجام شد',
    target: 'بسته استاندارد',
    time: '۱۵ دقیقه پیش',
  },
  {
    id: 4,
    user: 'فاطمه کریمی',
    action: 'نظر جدید',
    target: 'دکتر ترابی',
    time: '۲۰ دقیقه پیش',
  },
])

const systemStatus = ref({
  api: 'عملیاتی',
  database: 'عملیاتی',
  payments: 'عملیاتی',
  notifications: 'عملیاتی',
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
        داشبورد مدیریت
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        خلاصه وضعیت سیستم و فعالیت‌های اخیر
      </BaseParagraph>
    </div>

    <!-- Stats Cards -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <BaseCard
        v-for="stat in stats"
        :key="stat.label"
        class="p-5"
      >
        <div class="flex items-center gap-4">
          <div
            :class="[
              'flex size-12 items-center justify-center rounded-full',
              `bg-${stat.color}-100`,
              `dark:bg-${stat.color}-500/20`
            ]"
          >
            <Icon :name="stat.icon" :class="[`text-${stat.color}-500`, 'size-6']" />
          </div>
          <div>
            <BaseHeading as="h3" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              {{ stat.value }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500 text-sm">
              {{ stat.label }}
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- System Status -->
    <div class="mb-8">
      <BaseCard class="p-6">
        <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
          وضعیت سیستم
        </BaseHeading>
        
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(status, key) in systemStatus"
            :key="key"
            class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 text-center"
          >
            <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
              {{ key === 'api' ? 'API' : key === 'database' ? 'پایگاه داده' : key === 'payments' ? 'پرداخت‌ها' : 'اعلان‌ها' }}
            </BaseHeading>
            <BaseTag
              :color="status === 'عملیاتی' ? 'success' : 'danger'"
              variant="pastel"
            >
              {{ status }}
            </BaseTag>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Activities -->
    <div>
      <BaseCard class="p-6">
        <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
          فعالیت‌های اخیر
        </BaseHeading>

        <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center justify-between p-4"
          >
            <div class="flex items-center gap-4">
              <BaseAvatar
                :text="activity.user.substring(0, 2)"
                size="md"
              />
              <div>
                <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                  {{ activity.user }}
                </BaseHeading>
                <BaseParagraph class="text-muted-500 text-sm">
                  {{ activity.action }} - {{ activity.target }}
                </BaseParagraph>
              </div>
            </div>
            <BaseParagraph class="text-muted-400 text-sm">
              {{ activity.time }}
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
