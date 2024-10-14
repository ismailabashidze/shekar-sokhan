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

    // {
    //   id: 2,
    //   username: 'Melany W.',
    //   position: 'Web Developer',
    //   src: '/img/avatars/25.svg',
    //   badge: '/img/logo.png',
    //   location: 'San Jose, CA',
    //   industry: 'Design',
    //   status: 'online',
    //   tasks: {
    //     pending: 45,
    //     done: 265,
    //     status: 1,
    //   },
    //   relations: [
    //     {
    //       id: 127,
    //       src: undefined,
    //       text: 'BT',
    //     },
    //     {
    //       id: 7,
    //       src: '/img/avatars/10.svg',
    //       text: 'KW',
    //     },
    //     {
    //       id: 19,
    //       src: '/img/avatars/19.svg',
    //       text: 'GK',
    //     },
    //     {
    //       id: 148,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 149,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 150,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //   ],
    // },
    // {
    //   id: 3,
    //   username: 'Hermann M',
    //   position: 'Backend Developer',
    //   src: '/img/avatars/16.svg',
    //   badge: '/img/logo.png',
    //   location: 'Las Vegas, NV',
    //   industry: 'Accounting',
    //   status: 'suspended',
    //   tasks: {
    //     pending: 15,
    //     done: 575,
    //     status: 1,
    //   },
    //   relations: [
    //     {
    //       id: 7,
    //       src: '/img/avatars/8.svg',
    //       initials: 'TS',
    //     },
    //   ],
    // },
    // {
    //   id: 4,
    //   username: 'Heinrich L.',
    //   position: 'UI/UX Designer',
    //   src: '/img/avatars/13.svg',
    //   badge: '/img/logo.png',
    //   location: 'Los Angeles, CA',
    //   industry: 'Finance',
    //   status: 'working',
    //   tasks: {
    //     pending: 6,
    //     done: 47,
    //     status: 1,
    //   },
    //   relations: [
    //     {
    //       id: 0,
    //       src: '/img/avatars/3.svg',
    //       text: 'CD',
    //     },
    //     {
    //       id: 14,
    //       src: '/img/avatars/11.svg',
    //       text: 'KL',
    //     },
    //     {
    //       id: 17,
    //       src: '/img/avatars/5.svg',
    //       text: 'ML',
    //     },
    //     {
    //       id: 150,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 151,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 152,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 154,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //   ],
    // },
    // {
    //   id: 5,
    //   username: 'Greta K.',
    //   position: 'Sales Manager',
    //   src: '/img/avatars/19.svg',
    //   badge: '/img/logo.png',
    //   location: 'Berlin, Germany',
    //   industry: 'Business',
    //   status: 'online',
    //   tasks: {
    //     pending: 68,
    //     done: 128,
    //     status: 1,
    //   },
    //   relations: [
    //     {
    //       id: 0,
    //       src: '/img/avatars/4.svg',
    //       text: 'AC',
    //     },
    //     {
    //       id: 49,
    //       src: '/img/avatars/3.svg',
    //       text: 'CJ',
    //     },
    //     {
    //       id: 17,
    //       src: '/img/avatars/5.svg',
    //       text: 'ML',
    //     },
    //     {
    //       id: 150,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 151,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 152,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //   ],
    // },
    // {
    //   id: 6,
    //   username: 'Clément D.',
    //   position: 'Software Engineer',
    //   src: '/img/avatars/3.svg',
    //   badge: '/img/logo.png',
    //   location: 'Toulouse, France',
    //   industry: 'Software',
    //   status: 'Offline',
    //   tasks: {
    //     pending: 19,
    //     done: 127,
    //     status: 1,
    //   },
    //   relations: [
    //     {
    //       id: 0,
    //       src: '/img/avatars/15.svg',
    //       text: 'AC',
    //     },
    //     {
    //       id: 145,
    //       src: '/img/avatars/22.svg',
    //       text: 'AC',
    //     },
    //     {
    //       id: 8,
    //       src: '/img/avatars/16.svg',
    //       text: 'ML',
    //     },
    //     {
    //       id: 150,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //     {
    //       id: 151,
    //       src: undefined,
    //       text: 'SC',
    //     },
    //   ],
    // },
    // {
    //   id: 7,
    //   username: 'Ronald D.',
    //   position: 'Product Manager',
    //   src: '/img/avatars/11.svg',
    //   badge: '/img/logo.png',
    //   location: 'London, UK',
    //   industry: 'Software',
    //   status: 'online',
    //   tasks: {
    //     pending: 24,
    //     done: 277,
    //     status: 1,
    //   },
    //   relations: [
    //     {
    //       id: 25,
    //       src: '/img/avatars/25.svg',
    //       text: 'AC',
    //     },
    //     {
    //       id: 13,
    //       src: '/img/avatars/13.svg',
    //       text: 'TS',
    //     },
    //     {
    //       id: 17,
    //       src: '/img/avatars/5.svg',
    //       text: 'ML',
    //     },
    //   ],
    // },
  ],
})
const pending = ref()
const error = ref()
const refresh = ref()
</script>

<template>
  <div class="m-10">
    <TairoContentWrapper>
      <template #left>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          shape="curved"
          placeholder="فیلتر عامل ها . . ."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>
      <template #right>
        <BaseThemeToggle />
        <!-- <BaseButton class="w-full sm:w-32" shape="curved">Manage</BaseButton>
        <BaseButton color="primary" class="w-full sm:w-32" shape="curved">
          <Icon name="lucide:plus" class="h-4 w-4" />
          <span>Add User</span>
        </BaseButton> -->
      </template>
      <div>
        <div v-if="!pending && data?.data.length === 0">
          <BasePlaceholderPage
            title="No matching results"
            subtitle="Looks like we couldn't find any matching results for your search terms. Try other search terms."
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
          </BasePlaceholderPage>
        </div>
        <div
          v-else
          class="ltablet:grid-cols-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <TransitionGroup
            enter-active-class="transform-gpu"
            enter-from-class="opacity-0 -translate-x-full"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="absolute transform-gpu"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-full"
          >
            <BaseCard
              v-for="(item, index) in data?.data"
              :key="index"
              shape="curved"
              elevated-hover
              class="overflow-hidden"
            >
              <div class="nui-bg-50 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <BaseHeading
                      v-if="item.tasks.status === 0"
                      tag="h3"
                      size="md"
                      weight="medium"
                      lead="none"
                    >
                      در دسترس
                    </BaseHeading>
                    <BaseHeading
                      v-else
                      tag="h3"
                      size="md"
                      weight="medium"
                      lead="none"
                    >
                      {{
                        item.tasks.status === 1
                          ? 'خارج از دسترس'
                          : 'عدم سرویس دهی'
                      }}
                    </BaseHeading>
                    <BaseParagraph size="xs" class="text-muted-400 mt-3">
                      {{ item.tasks.pending }} مشاوره در حال انجام
                    </BaseParagraph>
                  </div>
                  <div>
                    <Icon
                      v-if="item.tasks.status === 0"
                      name="ph:check-circle-duotone"
                      class="text-success-500 size-7"
                    />
                    <Icon
                      v-else-if="item.tasks.status === 1"
                      name="ph:warning-circle-duotone"
                      class="text-warning-500 size-7"
                    />
                    <Icon
                      v-else-if="item.tasks.status === 2"
                      name="ph:x-circle-duotone"
                      class="text-danger-500 size-7"
                    />
                  </div>
                </div>
              </div>
              <div class="p-6">
                <div class="mb-3 flex w-full items-center justify-center">
                  <BaseAvatar
                    size="xl"
                    rounded="full"
                    :src="item.src"
                    :badge-src="item.badge"
                    :text="item.initials"
                    :class="getRandomColor()"
                  />
                </div>
                <div class="text-center">
                  <BaseHeading
                    tag="h3"
                    size="md"
                    weight="medium"
                    lead="none"
                  >
                    {{ item.username }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-400 mt-1">
                    {{ item.position }}
                  </BaseParagraph>
                </div>
                <div
                  class="mb-6 mt-4 flex items-center justify-center gap-3 text-center"
                >
                  {{ item.description }}
                </div>
                <div class="flex items-center gap-2">
                  <BaseButton
                    shape="curved"
                    class="w-full"
                    :disabled="item.tasks.status === 1"
                  >
                    <Icon name="ph:user-duotone" class="ml-2 size-4" />
                    <span>نمایه</span>
                  </BaseButton>
                  <BaseButton
                    shape="curved"
                    class="w-full"
                    :disabled="item.tasks.status === 1"
                    to="/mana/chat-therapist"
                  >
                    <Icon name="ph:chat-circle-duotone" class="ml-2 size-4" />
                    <span>گفت و گو</span>
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </TransitionGroup>
        </div>
        <div v-if="!pending && data?.data.length !== 0" class="mt-4">
          <BasePagination
            :total-items="data?.total ?? 0"
            :item-per-page="perPage"
            :current-page="page"
            shape="curved"
          />
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>
