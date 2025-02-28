<script setup lang="ts">
definePageMeta({
  title: 'عامل ها',
  preview: {
    title: 'عامل های هوش مصنوعی',
    description: 'عامل های هوش مصنوعی برای رویکرد های مختلف درمانا',
    categories: ['layouts'],
    src: '/img/screens/layouts-user-grid-4.png',
    srcDark: '/img/screens/layouts-user-grid-4-dark.png',
    order: 67,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const page = computed(() => parseInt((route.query.page as string) ?? '1'))

const filter = ref('')
const perPage = ref(18)

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

const query = computed(() => {
  return {
    filter: filter.value,
    perPage: perPage.value,
    page: page.value,
  }
})

const data = ref({
  data: [
    {
      id: 0,
      username: 'مانا',
      position: 'عامل هوشمند ارزیابی سلامت روان',
      src: '/img/avatars/mana.jpg',
      badge: '/img/logo.png',
      location: 'ایران، تهران',
      industry: 'روان درمانا',
      status: 'online',
      tasks: {
        pending: 37,
        done: 164,
        status: 0,
      },
      description:
        'مانا اولین عامل هوشمند ارزیابی سلامت روان با سیستم تصمیم گیری و هدف گذاری برای تشخیص موضوعات مرتبط با سلامت روان است.',
    },
    {
      id: 2,
      username: 'یارا',
      position: 'عامل هوشمند همدلی',
      src: '/img/avatars/3.svg',
      badge: '/img/logo.png',
      location: 'ایران، تهران',
      industry: 'Business',
      status: 'working',
      tasks: {
        pending: 21,
        done: 598,
        status: 1,
      },
      description:
        'یارا، اولین عامل هوشمند همدلی است که با توجه به وضعیت روانی و موضوعات فرد، از کاربران سیستم حمایت عاطفی و روانی انجام می دهد.',
    },
    {
      id: 3,
      username: 'صبا',
      position: 'عامل هوشمند مداخله در بحران',
      src: '/img/avatars/saba.webp',
      badge: '/img/logo.png',
      location: 'ایران، تهران',
      industry: 'Business',
      status: 'working',
      tasks: {
        pending: 21,
        done: 598,
        status: 1,
      },
      description:
        'صبا، اولین عامل هوشمند در مداخله های بحران، مناسب برای خطوط داغ مشاوره های بحران هایی مانند آسیب به خود و خودکشی است.',
    },
    {
      id: 4,
      username: 'زیگا',
      position: 'عامل هوشمند مشاوره پویشی',
      src: '/img/avatars/3.svg',
      badge: '/img/logo.png',
      location: 'ایران، تهران',
      industry: 'Business',
      status: 'working',
      tasks: {
        pending: 21,
        done: 598,
        status: 1,
      },
      description:
        'زیگا، اولین عامل هوشمند در جهان است که توانایی برنامه ریزی و مداخله با استفاده از تکنیک های روانپویشی و تکنیک های ISTPD را دارد.',
    },
    {
      id: 5,
      username: 'کیا',
      position: 'دستیار هوشمند مشاوره',
      src: '/img/avatars/kia.webp',
      badge: '/img/logo.png',
      location: 'ایران، تهران',
      industry: 'Business',
      status: 'working',
      tasks: {
        pending: 21,
        done: 598,
        status: 1,
      },
      description:
        'کیا، اولین دستیار هوشمند روان درمانگران با ارائه ی امکانات ویژه برای کمک به درمان',
    },
  ],
})
const pending = ref()
const error = ref()
const refresh = ref()

// Function to get random color for avatars
function getRandomColor() {
  const colors = [
    'bg-primary-500',
    'bg-info-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-danger-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-green-500',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<template>
  <div>
    <TairoContentWrapper class="mb-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="ph:robot-duotone" class="text-primary-500 ml-2 size-6" />
          <BaseHeading
            tag="h2"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            انتخاب عامل هوش مصنوعی
          </BaseHeading>
        </div>
        
        <div class="flex items-center gap-2">
          <BaseInput
            v-model="filter"
            icon="lucide:search"
            placeholder="جستجوی عامل ها..."
            :classes="{
              wrapper: 'w-full sm:w-64',
            }"
          />
          <BaseThemeToggle />
        </div>
      </div>

      <BaseParagraph size="sm" class="text-muted-400 mt-2">
        عامل مورد نظر خود را برای شروع گفتگو انتخاب کنید
      </BaseParagraph>
      <div class="mt-2">
        <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
          عامل‌های هوش مصنوعی ما برای کمک به شما در زمینه‌های مختلف طراحی شده‌اند. هر عامل دارای ویژگی‌ها و تخصص‌های منحصر به فرد است که می‌تواند به شما در بهبود تکنیک های روانشناختی، مدیریت استرس، افزایش اعتماد به نفس، بهبود مهارت های اجتماعی و بسیاری از موارد دیگر کمک کند.
        </BaseParagraph>
      </div>

      <!-- Loading state (if needed) -->
      <div v-if="pending" class="py-10">
        <div class="flex flex-col items-center justify-center">
          <div class="mt-8 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div
              v-for="i in 8"
              :key="i"
              class="flex flex-col"
            >
              <BaseCard shape="curved" class="flex flex-col overflow-hidden">
                <div class="bg-muted-50 dark:bg-muted-800/30 p-6">
                  <div class="flex items-center justify-between">
                    <BasePlaceload class="h-4 w-20 rounded" />
                    <BasePlaceload class="size-7 rounded-full" />
                  </div>
                </div>
                <div class="flex grow flex-col p-6">
                  <div class="mb-3 flex w-full items-center justify-center">
                    <BasePlaceload class="size-16 rounded-full" />
                  </div>
                  <div class="text-center">
                    <BasePlaceload class="mx-auto h-4 w-32 rounded" />
                    <BasePlaceload class="mx-auto mt-2 h-3 w-24 rounded" />
                  </div>
                  <div class="mb-6 mt-4 flex items-center justify-center">
                    <BasePlaceload class="h-3 w-full rounded" />
                  </div>
                  <div class="mt-auto flex items-center gap-2">
                    <BasePlaceload class="h-9 w-full rounded-lg" />
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="!pending && data?.data.length === 0">
        <BasePlaceholderPage
          title="نتیجه‌ای یافت نشد"
          subtitle="هیچ عاملی با این مشخصات پیدا نشد. لطفا معیارهای جستجوی خود را تغییر دهید."
        >
          <template #image>
            <img
              class="block dark:hidden"
              src="/img/illustrations/placeholders/flat/placeholder-search-2.svg"
              alt="Placeholder image"
            >
            <img
              class="hidden dark:block"
              src="/img/illustrations/placeholders/flat/placeholder-search-2-dark.svg"
              alt="Placeholder image"
            >
          </template>
          <template #action>
            <BaseButton
              color="primary"
              shape="curved"
              @click="filter = ''"
            >
              نمایش همه عامل‌ها
            </BaseButton>
          </template>
        </BasePlaceholderPage>
      </div>

      <!-- Results grid -->
      <div
        v-else
        class="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <TransitionGroup
          enter-active-class="transform-gpu"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transform-gpu"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <BaseCard
            v-for="(item, index) in data?.data"
            :key="index"
            shape="curved"
            elevated-hover
            class="flex flex-col overflow-hidden"
          >
            <div class="bg-muted-50 dark:bg-muted-800/30 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <BaseHeading
                    v-if="item.tasks.status === 0"
                    tag="h3"
                    size="md"
                    weight="medium"
                    lead="none"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    در دسترس
                  </BaseHeading>
                  <BaseHeading
                    v-else
                    tag="h3"
                    size="md"
                    weight="medium"
                    lead="none"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    مشغول
                  </BaseHeading>
                </div>
                <div>
                  <Icon
                    v-if="item.tasks.status === 0"
                    name="ph:check-circle-duotone"
                    class="text-success-500 size-7"
                  />
                  <Icon v-else name="ph:x-circle-duotone" class="text-danger-500 size-7" />
                </div>
              </div>
            </div>
            <div class="flex grow flex-col p-6">
              <div class="mb-3 flex w-full items-center justify-center">
                <BaseAvatar
                  size="xl"
                  rounded="full"
                  :src="item.src"
                  :badge-src="item.badge"
                  :text="item.username.charAt(0).toUpperCase()"
                  :class="getRandomColor()"
                />
              </div>
              <div class="text-center">
                <BaseHeading
                  tag="h3"
                  size="md"
                  weight="medium"
                  lead="none"
                  class="text-muted-800 dark:text-white"
                >
                  {{ item.username }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-400 mt-1">
                  {{ item.position }}
                </BaseParagraph>
              </div>
              <div
                class="text-muted-500 dark:text-muted-400 mb-6 mt-4 flex items-center justify-center gap-3 text-center"
              >
                {{ item.description }}
              </div>
              <div class="mt-auto flex items-center gap-2">
                <BaseButton
                  shape="curved"
                  class="w-full"
                  color="light"
                  @click="navigateTo(`/onboarding/therapist-profile?id=${item.id}`)"
                >
                  <Icon name="ph:user-duotone" class="ml-2 size-4" />
                  <span>نمایه</span>
                </BaseButton>

                <BaseButton
                  shape="curved"
                  class="w-full"
                  :to="`/mana/chat-therapist/messaging?therapistId=${item.id}`"
                  :color="item.tasks.status === 0 ? 'success' : 'muted'"
                  :disabled="item.tasks.status !== 0"
                >
                  <Icon name="ph:chat-circle-duotone" class="ml-2 size-4" />
                  <span>گفت و گو</span>
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </TransitionGroup>
      </div>
    </TairoContentWrapper>
  </div>
</template>
