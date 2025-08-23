<script setup lang="ts">
definePageMeta({
  title: 'جزئیات جلسه - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const sessionId = route.params.id

const session = ref({
  id: sessionId,
  mother: 'زهرا محمدی',
  child: 'امیرمحمد',
  motherEmail: 'zahra.mohammadi@example.com',
  motherPhone: '09123456789',
  date: '۱۴۰۳/۰۵/۱۵',
  time: '۱۰:۳۰',
  duration: '۶۰ دقیقه',
  type: 'آنلاین',
  status: 'completed',
  price: '250,000',
  notes: 'جلسه مفید درباره ترس کودک از مدرسه. کودک احساس تنهایی می‌کند و نگران ارتباط با همکلاسی‌هاست.',
  summary: 'در این جلسه به بررسی علل ترس کودک از مدرسه پرداختیم. روش‌هایی برای افزایش اعتماد به نفس کودک و تقویت مهارت‌های اجتماعی ارائه شد. والدین نیز تکلیف‌هایی برای انجام در خانه دریافت کردند.',
  recommendations: [
    'تمرین‌های افزایش اعتماد به نفس روزانه',
    'برگزاری جلسات بازی با همکلاسی‌ها در خانه',
    'تشویق کودک به شرکت در فعالیت‌های گروهی',
    'پیگیری پیشرفت کودک در ۲ هفته آینده',
  ],
  meetingLink: 'https://meet.togethermama.com/session-1',
  meetingId: 'TM-SESSION-1',
})

const cancelSession = () => {
  // Mock cancel functionality
  alert('جلسه لغو شد')
}

const rescheduleSession = () => {
  // Mock reschedule functionality
  alert('درخواست تغییر زمان جلسه ارسال شد')
}

const sendMessage = () => {
  // Mock send message functionality
  alert('پیام ارسال شد')
}
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink
        to="/togethermama/psychologist/sessions"
        class="text-muted-400 hover:text-primary-500 mb-4 inline-flex items-center gap-2 font-sans font-medium transition-colors duration-300"
      >
        <Icon name="gg:arrow-long-right" class="size-5" />
        <span>بازگشت به لیست جلسات</span>
      </NuxtLink>
      
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <BaseHeading
            as="h1"
            size="2xl"
            weight="bold"
            class="text-muted-800 dark:text-white"
          >
            جزئیات جلسه
          </BaseHeading>
          <BaseParagraph class="text-muted-500">
            جلسه با {{ session.mother }}
          </BaseParagraph>
        </div>
        <div class="flex gap-3">
          <BaseButton v-if="session.status === 'upcoming'" color="danger" variant="outline" @click="cancelSession">
            لغو جلسه
          </BaseButton>
          <BaseButton v-if="session.status === 'upcoming'" color="muted" variant="outline" @click="rescheduleSession">
            تغییر زمان
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Session Details -->
      <div class="lg:col-span-2">
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات جلسه
          </BaseHeading>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                مادر
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.mother }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                کودک
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.child }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                تاریخ
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.date }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                ساعت
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.time }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                مدت زمان
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.duration }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                نوع جلسه
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.type }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                وضعیت
              </BaseHeading>
              <BaseTag
                :color="session.status === 'upcoming' ? 'primary' : 'success'"
                variant="pastel"
              >
                {{ session.status === 'upcoming' ? 'آینده' : 'انجام شده' }}
              </BaseTag>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                هزینه
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.price }} تومان
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>

        <!-- Session Notes -->
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            یادداشت‌های جلسه
          </BaseHeading>
          <BaseParagraph class="text-muted-600 dark:text-muted-300">
            {{ session.notes }}
          </BaseParagraph>
        </BaseCard>

        <!-- Session Summary -->
        <BaseCard v-if="session.status === 'completed'" class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            خلاصه جلسه
          </BaseHeading>
          <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-6">
            {{ session.summary }}
          </BaseParagraph>
          
          <BaseHeading as="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-white">
            توصیه‌ها
          </BaseHeading>
          <ul class="space-y-2">
            <li
              v-for="(recommendation, index) in session.recommendations"
              :key="index"
              class="flex items-start gap-2"
            >
              <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5" />
              <span class="text-muted-600 dark:text-muted-300">{{ recommendation }}</span>
            </li>
          </ul>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div>
        <!-- Actions -->
        <BaseCard v-if="session.status === 'upcoming'" class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            عملیات
          </BaseHeading>
          
          <div class="space-y-3">
            <BaseButton color="primary" class="w-full">
              ورود به جلسه
            </BaseButton>
            <BaseButton color="muted" variant="outline" class="w-full">
              یادآوری پیامکی
            </BaseButton>
          </div>
        </BaseCard>

        <!-- Meeting Info -->
        <BaseCard v-if="session.status === 'upcoming'" class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            اطلاعات جلسه
          </BaseHeading>
          
          <div class="space-y-4">
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                لینک جلسه
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white break-all">
                {{ session.meetingLink }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                شناسه جلسه
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ session.meetingId }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>

        <!-- Mother Contact -->
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            تماس با مادر
          </BaseHeading>
          
          <div class="flex items-center gap-4">
            <BaseAvatar
              src="/img/avatars/10.svg"
              text="زم"
              size="lg"
            />
            <div>
              <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                {{ session.mother }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500 text-sm">
                {{ session.child }}
              </BaseParagraph>
            </div>
          </div>
          
          <div class="mt-4 space-y-3">
            <div class="flex items-center gap-2">
              <Icon name="ph:envelope" class="text-muted-500 size-4" />
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
                {{ session.motherEmail }}
              </BaseParagraph>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="ph:phone" class="text-muted-500 size-4" />
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm">
                {{ session.motherPhone }}
              </BaseParagraph>
            </div>
          </div>
          
          <div class="mt-4 flex gap-3">
            <BaseButton color="muted" variant="outline" class="flex-1" @click="sendMessage">
              <Icon name="ph:chat-circle-text" class="ml-2 size-4" />
              پیام
            </BaseButton>
            <BaseButton color="muted" variant="outline" class="flex-1">
              <Icon name="ph:phone" class="ml-2 size-4" />
              تماس
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
