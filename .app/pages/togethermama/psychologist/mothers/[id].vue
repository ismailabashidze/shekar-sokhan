<script setup lang="ts">
definePageMeta({
  title: 'پروفایل مادر - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const motherId = route.params.id

const mother = ref({
  id: motherId,
  name: 'زهرا محمدی',
  email: 'zahra.mohammadi@example.com',
  phone: '09123456789',
  child: 'امیرمحمد',
  childAge: '۲ سال و ۳ ماه',
  childGender: 'پسر',
  childBirthday: '۱۴۰۰/۰۲/۱۵',
  avatar: '/img/avatars/10.svg',
  registrationDate: '۱۴۰۳/۰۱/۱۵',
  lastSession: '۱۴۰۳/۰۵/۱۵',
  totalSessions: 8,
  notes: 'مادر نگران از رفتار پرخاشگرانه کودک. نیاز به آموزش روش‌های مدیریت خشم دارد.',
})

const sessions = ref([
  {
    id: 1,
    date: '۱۴۰۳/۰۵/۱۵',
    time: '۱۰:۳۰',
    type: 'آنلاین',
    status: 'completed',
    notes: 'جلسه مفید درباره ترس کودک از مدرسه',
  },
  {
    id: 2,
    date: '۱۴۰۳/۰۵/۰۸',
    time: '۱۴:۰۰',
    type: 'آنلاین',
    status: 'completed',
    notes: 'بررسی پیشرفت کودک در ۲ هفته گذشته',
  },
  {
    id: 3,
    date: '۱۴۰۳/۰۵/۰۱',
    time: '۱۱:۰۰',
    type: 'آنلاین',
    status: 'completed',
    notes: 'جلسه اولیه برای آشنایی با کودک',
  },
])

const updateNotes = () => {
  // Mock update notes functionality
  alert('یادداشت‌ها به‌روزرسانی شد')
}
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink
        to="/togethermama/psychologist/mothers"
        class="text-muted-400 hover:text-primary-500 mb-4 inline-flex items-center gap-2 font-sans font-medium transition-colors duration-300"
      >
        <Icon name="gg:arrow-long-right" class="size-5" />
        <span>بازگشت به لیست مادران</span>
      </NuxtLink>
      
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-muted-800 dark:text-white"
      >
        پروفایل مادر
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        اطلاعات و جلسات {{ mother.name }}
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Mother Info -->
      <div class="lg:col-span-2">
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات مادر
          </BaseHeading>

          <div class="flex flex-col items-center gap-6 sm:flex-row">
            <BaseAvatar
              :src="mother.avatar"
              :text="mother.name.substring(0, 2)"
              size="2xl"
            />
            
            <div class="text-center sm:text-right">
              <BaseHeading as="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white">
                {{ mother.name }}
              </BaseHeading>
              
              <div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <BaseHeading as="h4" size="sm" weight="medium" class="text-muted-500 mb-1">
                    ایمیل
                  </BaseHeading>
                  <BaseParagraph class="text-muted-800 dark:text-white">
                    {{ mother.email }}
                  </BaseParagraph>
                </div>
                
                <div>
                  <BaseHeading as="h4" size="sm" weight="medium" class="text-muted-500 mb-1">
                    شماره تماس
                  </BaseHeading>
                  <BaseParagraph class="text-muted-800 dark:text-white">
                    {{ mother.phone }}
                  </BaseParagraph>
                </div>
                
                <div>
                  <BaseHeading as="h4" size="sm" weight="medium" class="text-muted-500 mb-1">
                    تاریخ ثبت‌نام
                  </BaseHeading>
                  <BaseParagraph class="text-muted-800 dark:text-white">
                    {{ mother.registrationDate }}
                  </BaseParagraph>
                </div>
                
                <div>
                  <BaseHeading as="h4" size="sm" weight="medium" class="text-muted-500 mb-1">
                    آخرین جلسه
                  </BaseHeading>
                  <BaseParagraph class="text-muted-800 dark:text-white">
                    {{ mother.lastSession }}
                  </BaseParagraph>
                </div>
              </div>
              
              <div class="flex gap-3">
                <NuxtLink :to="`/togethermama/psychologist/sessions/book-${mother.id}`">
                  <BaseButton color="primary">
                    جلسه جدید
                  </BaseButton>
                </NuxtLink>
                <BaseButton color="muted" variant="outline">
                  <Icon name="ph:chat-circle-text" class="ml-2 size-4" />
                  پیام
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Child Info -->
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات کودک
          </BaseHeading>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                نام کودک
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ mother.child }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                سن
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ mother.childAge }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                جنسیت
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ mother.childGender }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                تاریخ تولد
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ mother.childBirthday }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>

        <!-- Notes -->
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            یادداشت‌ها
          </BaseHeading>
          
          <BaseTextarea
            v-model="mother.notes"
            placeholder="یادداشت‌های مربوط به مادر و کودک..."
            rows="4"
            class="mb-4"
          />
          
          <BaseButton color="primary" @click="updateNotes">
            به‌روزرسانی یادداشت‌ها
          </BaseButton>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div>
        <!-- Session Stats -->
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            آمار جلسات
          </BaseHeading>
          
          <div class="space-y-4">
            <div class="text-center">
              <BaseHeading as="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ mother.totalSessions }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500">
                تعداد کل جلسات
              </BaseParagraph>
            </div>
            
            <div class="border-muted-200 dark:border-muted-700 my-2 border-t" />
            
            <div class="flex justify-between">
              <span class="text-muted-500">آخرین جلسه:</span>
              <span class="font-medium">{{ mother.lastSession }}</span>
            </div>
          </div>
        </BaseCard>

        <!-- Recent Sessions -->
        <BaseCard class="p-6">
          <div class="mb-4 flex items-center justify-between">
            <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
              جلسات اخیر
            </BaseHeading>
            <NuxtLink
              to="/togethermama/psychologist/sessions"
              class="text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
            >
              مشاهده همه
            </NuxtLink>
          </div>

          <div class="space-y-4">
            <div
              v-for="session in sessions"
              :key="session.id"
              class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
            >
              <div class="mb-2 flex items-center justify-between">
                <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                  {{ session.date }}
                </BaseHeading>
                <BaseTag
                  :color="session.status === 'completed' ? 'success' : 'primary'"
                  variant="pastel"
                  size="sm"
                >
                  {{ session.status === 'completed' ? 'انجام شده' : 'آینده' }}
                </BaseTag>
              </div>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 text-sm mb-2">
                {{ session.time }} - {{ session.type }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-xs">
                {{ session.notes }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
