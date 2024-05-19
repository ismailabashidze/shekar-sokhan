<script setup lang="ts">
definePageMeta({
  title: 'داشبورد',
  layout: "sidebar",
  preview: {
    title: 'صفحه اصلی',
    description: 'برای نمایش بخش های مختلف، اطلاعات و ارتباطات',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-writer.png',
    srcDark: '/img/screens/dashboards-writer-dark.png',
    order: 18,
  },
})

useHead({ htmlAttrs: { dir: 'rtl' } })


const activePosts = ref('recent')
const candidates = [
  {
    id: 0,
    tooltip: 'Adam Wrangler',
    src: '/img/avatars/15.svg',
    text: 'EC',
    role: 'UI/UX designer',
  },
  {
    id: 1,
    tooltip: 'Jennifer Miller',
    src: '/img/avatars/5.svg',
    text: 'JM',
    role: 'Frontend developer',
  },
  {
    id: 2,
    tooltip: 'Tara Svenson',
    src: '/img/avatars/4.svg',
    text: 'TS',
    role: 'Software architect',
  },
  {
    id: 3,
    tooltip: 'Naomi Liversky',
    src: undefined,
    text: 'NL',
    role: 'UI/UX designer',
  },
]
const showFeatures = ref(true)
const featuredVideos = [
  {
    id: 1,
    title: 'Code a responsive landing page using Tailwind CSS',
    slug: '',
    cover: '/img/illustrations/dashboards/video/1.png',
    uploaded: '2 hours ago',
    category: 'Frontend',
    author: {
      name: 'Hermann Mayer',
      avatar: '/img/avatars/16.svg',
    },
  },
  {
    id: 2,
    title: 'Designing a consistent UI framework for your app',
    slug: '',
    cover: '/img/illustrations/dashboards/video/2.jpg',
    uploaded: '6 hours ago',
    category: 'UI/UX',
    author: {
      name: 'Kendra Wilson',
      avatar: '/img/avatars/10.svg',
    },
  },
  {
    id: 3,
    title: 'Designing a set of chart widgets for my next dashboard',
    slug: '',
    cover: '/img/illustrations/dashboards/video/3.png',
    uploaded: 'Yesterday',
    category: 'Frontend',
    author: {
      name: 'Anna Lopez',
      avatar: '/img/avatars/12.svg',
    },
  },
  {
    id: 4,
    title: 'Integrating minimalism and negative space in your designs',
    slug: '',
    cover: '/img/illustrations/dashboards/video/4.png',
    uploaded: '2 days ago',
    category: 'Design',
    author: {
      name: 'John Polack',
      avatar: '/img/avatars/17.svg',
    },
  },
  {
    id: 5,
    title: 'Creating reusable sections using Tailwind CSS',
    slug: '',
    cover: '/img/illustrations/dashboards/video/5.png',
    uploaded: 'Last week',
    category: 'UI/UX',
    author: {
      name: 'Maya Rosselini',
      avatar: '/img/avatars/2.svg',
    },
  },
]

const videos = [
  {
    id: 6,
    title: 'How to think a mobile app landing page design',
    slug: '',
    cover: '/img/illustrations/dashboards/video/6.png',
    uploaded: '7 hours ago',
    category: 'Frontend',
    author: {
      name: 'Alan Skelli',
      avatar: '/img/avatars/11.svg',
    },
  },
  {
    id: 6,
    title: '8 tips to deliver the right message when talking to personas',
    slug: '',
    cover: '/img/illustrations/dashboards/video/7.jpg',
    uploaded: 'Yesterday',
    category: 'UI/UX',
    author: {
      name: 'Kendra Wilson',
      avatar: '/img/avatars/10.svg',
    },
  },
  {
    id: 7,
    title: '5 Differences between promoting your services and a product',
    slug: '',
    cover: '/img/illustrations/dashboards/video/8.jpg',
    uploaded: 'Yesterday',
    category: 'Branding',
    author: {
      name: 'Clarissa Miller',
      avatar: '/img/avatars/5.svg',
    },
  },
  {
    id: 8,
    title: 'Speed up your mobile development velocity using Flutter',
    slug: '',
    cover: '/img/illustrations/dashboards/video/9.png',
    uploaded: '2 days ago',
    category: 'Mobile',
    author: {
      name: 'Hermann Mayer',
      avatar: '/img/avatars/16.svg',
    },
  },
  {
    id: 9,
    title: 'How I created a full featured design system for my last project',
    slug: '',
    cover: '/img/illustrations/dashboards/video/10.png',
    uploaded: 'Yesterday',
    category: 'UI/UX',
    author: {
      name: 'Anna Lopez',
      avatar: '/img/avatars/12.svg',
    },
  },
  {
    id: 9,
    title: 'The never ending debate between development and low code projects',
    slug: '',
    cover: '/img/illustrations/dashboards/video/11.png',
    uploaded: '5 days ago',
    category: 'Engineering',
    author: {
      name: 'Ron Smith',
      avatar: '/img/avatars/14.svg',
    },
  },
  {
    id: 10,
    title:
      'Using javascript component to enforce code reusability in your project',
    slug: '',
    cover: '/img/illustrations/dashboards/video/12.png',
    uploaded: '2 weeks ago',
    category: 'Engineering',
    author: {
      name: 'Peter Weyland',
      avatar: '/img/avatars/15.svg',
    },
  },
  {
    id: 11,
    title:
      'How to use minimalism to emphasize the right message in your designs',
    slug: '',
    cover: '/img/illustrations/dashboards/video/13.png',
    uploaded: '1 month ago',
    category: 'UI/UX',
    author: {
      name: 'Clark Hamilton',
      avatar: '/img/avatars/3.svg',
    },
  },
  {
    id: 12,
    title: '10 Challenges UX designers should be able to face in their career',
    slug: '',
    cover: '/img/illustrations/dashboards/video/14.png',
    uploaded: '1 month ago',
    category: 'UI/UX',
    author: {
      name: 'Maya Rosselini',
      avatar: '/img/avatars/2.svg',
    },
  },
]
</script>

<template>
  <div class="relative">
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Column -->
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <!-- Inner grid -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Header -->
          <div class="col-span-12">
            <div class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row">
              <div class="relative h-[150px] w-[320px] shrink-0 sm:h-[175px]">
                <img class="pointer-events-none absolute start-6 top-0 sm:-start-10"
                  src="/img/illustrations/dashboards/writer/readers.svg" alt="Readers illustration">
              </div>
              <div class="mt-6 grow sm:mt-0">
                <div class="pb-4 text-center sm:pb-0 sm:text-right">
                  <BaseHeading tag="h1" class="text-white opacity-90">
                    <span>سلام، علی ! 👋</span>
                  </BaseHeading>
                  <BaseParagraph size="sm" class="max-w-xs text-white opacity-70">
                    <span>
                      این جا پنل شماست. در این بخش می توانید جلسات و برنامه ها، اطلاعات جلسات، محتوای متنی و دیگر بخش ها
                      را مدیریت و نظارت کنید.
                    </span>
                  </BaseParagraph>
                  <div class="mt-2">
                    <BaseButton size="sm" color="light" variant="outline" class="w-full sm:w-auto">
                      <Icon name="lucide:message-circle-plus" class="size-4 ml-2" />
                      <span>رفتن به گفت و گو</span>
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Content -->
          <div class="col-span-12">
            <!-- Sub grid -->
            <div class="grid grid-cols-12 gap-6">
              <!-- Sub column -->
              <div class="col-span-12">
                <div class="flex flex-col gap-6">
                  <!-- Tile grid -->
                  <div class="grid grid-cols-4 gap-4">
                    <!-- Inner item -->
                    <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
                      <BaseIconBox size="sm"
                        class="bg-info-100 text-info-500 dark:bg-info-500/20 dark:text-info-400 dark:border-info-500 dark:border-2"
                        rounded="full" color="none">
                        <Icon name="ph:timer-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading as="h2" size="sm" weight="semibold" lead="tight"
                          class="text-muted-800 dark:text-white">
                          <span>62K</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">Minutes</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                    <!-- Inner item -->
                    <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
                      <BaseIconBox size="sm"
                        class="bg-primary-100 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500 dark:border-2"
                        rounded="full" color="none">
                        <Icon name="ph:broadcast-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading as="h2" size="sm" weight="semibold" lead="tight"
                          class="text-muted-800 dark:text-white">
                          <span>263</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">Interviews</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                    <!-- Inner item -->
                    <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
                      <BaseIconBox size="sm"
                        class="bg-lime-100 text-lime-500 dark:border-2 dark:border-lime-500 dark:bg-lime-500/20 dark:text-lime-400"
                        rounded="full" color="none">
                        <Icon name="ph:user-plus-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading as="h2" size="sm" weight="semibold" lead="tight"
                          class="text-muted-800 dark:text-white">
                          <span>49</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">Approved</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                    <!-- Inner item -->
                    <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
                      <BaseIconBox size="sm"
                        class="bg-amber-100 text-amber-500 dark:border-2 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-400"
                        rounded="full" color="none">
                        <Icon name="ph:door-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading as="h2" size="sm" weight="semibold" lead="tight"
                          class="text-muted-800 dark:text-white">
                          <span>214</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">Rejected</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                  </div>
                </div>
              </div>
              <div class="col-span-12">
                <Transition leave-active-class="transition origin-top duration-75 ease-in"
                  leave-from-class="transform scale-y-100 opacity-100" leave-to-class="transform scale-y-0 opacity-0">
                  <div v-if="showFeatures" class="w-full pb-6">
                    <!--Features widget-->
                    <DemoWidgetFeatures>
                      <template #actions>
                        <BaseButtonClose size="sm" color="muted" data-nui-tooltip="Hide this"
                          @click="showFeatures = false" />
                      </template>
                    </DemoWidgetFeatures>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="bg-muted-200 dark:bg-muted-800/70 rounded-2xl p-6">
          <!-- Title -->
          <div class="mb-8 flex items-center justify-between">
            <BaseHeading as="h3" size="md" weight="semibold" lead="tight" class="text-muted-800 dark:text-white">
              <span>آخرین مطالب</span>
            </BaseHeading>
            <div class="flex scale-90 gap-2 sm:justify-end">
              <BaseButtonAction small :color="activePosts === 'recent' ? 'primary' : 'default'"
                @click="activePosts = 'recent'">
                مقالات اخیر
              </BaseButtonAction>
              <BaseButtonAction small :color="activePosts === 'popular' ? 'primary' : 'default'"
                @click="activePosts = 'popular'">
                مقالات محبوب
              </BaseButtonAction>
            </div>
          </div>
          <!-- Posts-->
          <div class="ptablet:grid ptablet:grid-cols-2 flex flex-col gap-6">
            <!-- Post -->
            <NuxtLink to="#" class="flex flex-col">
              <img src="/img/illustrations/dashboards/writer/post-1.svg" alt="Post image"
                class="bg-muted-200 rounded-xl">
              <BaseCard class="shadow-muted-300/30 dark:shadow-muted-900/20 -mt-8 !rounded-2xl p-6 shadow-xl">
                <div class="mb-3">
                  <BaseHeading as="h4" size="md" weight="light" lead="tight"
                    class="text-muted-800 mb-1 dark:text-white">
                    <span>Learning the modern novel</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">
                      Some article content and lorem ipsum sit dolor amet as a
                      nice dummy subtitle
                    </span>
                  </BaseParagraph>
                </div>
                <div class="flex gap-3">
                  <BaseAvatar src="/img/avatars/6.svg" text="BT" size="xs"
                    class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0" />
                  <div>
                    <BaseHeading as="h4" size="xs" weight="light" lead="tight" class="text-muted-800 dark:text-white">
                      <span>Mike Janovski</span>
                    </BaseHeading>
                    <BaseParagraph size="xs">
                      <span class="text-muted-400">Novel writer</span>
                    </BaseParagraph>
                  </div>
                </div>
              </BaseCard>
            </NuxtLink>
            <!-- Post -->
            <NuxtLink to="#" class="flex flex-col">
              <img src="/img/illustrations/dashboards/writer/post-2.svg" alt="Post image"
                class="bg-muted-200 rounded-xl">
              <BaseCard class="shadow-muted-300/30 dark:shadow-muted-900/20 -mt-8 !rounded-2xl p-6 shadow-xl">
                <div class="mb-3">
                  <BaseHeading as="h4" size="md" weight="light" lead="tight"
                    class="text-muted-800 mb-1 dark:text-white">
                    <span>5 writing tips just for you</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">
                      Some article content and lorem ipsum sit dolor amet as a
                      nice dummy subtitle
                    </span>
                  </BaseParagraph>
                </div>
                <div class="flex gap-3">
                  <BaseAvatar src="/img/avatars/5.svg" text="BT" size="xs"
                    class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0" />
                  <div>
                    <BaseHeading as="h4" size="xs" weight="light" lead="tight" class="text-muted-800 dark:text-white">
                      <span>Clarissa Miller</span>
                    </BaseHeading>
                    <BaseParagraph size="xs">
                      <span class="text-muted-400">Novel writer</span>
                    </BaseParagraph>
                  </div>
                </div>
              </BaseCard>
            </NuxtLink>
          </div>
        </div>
      </div>
      
    </div>
    <div class="grid min-h-[440px] grid-cols-12 gap-6 mt-5">
        <!-- Column -->
        <div
          v-for="video in featuredVideos.slice(0, 1)"
          :key="video.id"
          class="ltablet:col-span-6 col-span-12 lg:col-span-6"
        >
          <div class="flex h-full flex-col">
            <div
              class="bg-muted-200 dark:bg-muted-800 group relative size-full overflow-hidden rounded-2xl"
            >
              <img
                :src="video.cover"
                :alt="video.title"
                class="w-full object-cover object-center"
              >
              <div
                class="absolute inset-x-0 bottom-0 z-10 h-3/5 w-full bg-gradient-to-t from-black transition-all duration-500 ease-in-out group-hover:h-full"
              />
              <div
                class="absolute inset-0 z-20 flex size-full flex-col justify-between"
              >
                <div class="ptablet:p-10 p-6">
                  <NuxtLink
                    to="#"
                    class="group-hover:border-primary-500 text-muted-300 group-hover:text-primary-500 shadow-muted-300/30 dark:shadow-muted-900/20 flex size-14 items-center justify-center rounded-full border-2 border-transparent bg-white shadow-2xl transition-colors duration-300"
                  >
                    <Icon name="ic:round-play-arrow" class="size-7" />
                  </NuxtLink>
                </div>
                <div class="ptablet:p-10 p-6">
                  <NuxtLink to="#">
                    <BaseHeading
                      as="h3"
                      size="3xl"
                      weight="bold"
                      lead="tight"
                      class="xs:text-xl hover:text-primary-300 mb-4 line-clamp-2 text-white transition-colors duration-300"
                    >
                      <span>{{ video.title }}</span>
                    </BaseHeading>
                  </NuxtLink>
                  <div class="flex gap-3">
                    <BaseAvatar
                      :src="video.author.avatar"
                      :text="video.author.name.slice(0, 1)"
                      size="xs"
                      class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
                    />
                    <div>
                      <NuxtLink to="#">
                        <BaseHeading
                          as="h4"
                          size="xs"
                          weight="light"
                          lead="tight"
                          class="hover:text-primary-500 text-white transition-colors duration-300"
                        >
                          <span>{{ video.author.name }}</span>
                        </BaseHeading>
                      </NuxtLink>

                      <BaseParagraph size="xs">
                        <span class="text-muted-400">{{ video.uploaded }}</span>
                      </BaseParagraph>
                    </div>
                    <div class="ms-auto">
                      <BaseTag
                        color="primary"
                        rounded="full"
                        size="sm"
                      >
                        <span>{{ video.category }}</span>
                      </BaseTag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Column -->
        <div class="ltablet:col-span-6 col-span-12 lg:col-span-6">
          <div class="flex h-full flex-col">
            <div class="grid h-full grid-cols-12 gap-6">
              <!-- Subcolumn -->
              <div
                v-for="video in featuredVideos.slice(1)"
                :key="video.id"
                class="col-span-12 sm:col-span-6"
              >
                <div class="group flex h-full flex-col">
                  <div
                    class="bg-muted-200 dark:bg-muted-800 relative size-full overflow-hidden rounded-2xl"
                  >
                    <img
                      :src="video.cover"
                      :alt="video.title"
                      class="w-full object-cover object-center"
                    >
                    <div
                      class="absolute inset-x-0 bottom-0 z-10 h-3/5 w-full bg-gradient-to-t from-black transition-all duration-500 ease-in-out group-hover:h-full"
                    />
                    <div
                      class="absolute inset-0 z-20 flex size-full flex-col justify-between"
                    >
                      <div class="p-4">
                        <NuxtLink
                          to="#"
                          class="group-hover:border-primary-500 text-muted-300 group-hover:text-primary-500 shadow-muted-300/30 dark:shadow-muted-900/20 flex size-10 items-center justify-center rounded-full border-2 border-transparent bg-white shadow-2xl transition-colors duration-300"
                        >
                          <Icon name="ic:round-play-arrow" class="size-5" />
                        </NuxtLink>
                      </div>
                      <div class="p-4">
                        <NuxtLink to="#">
                          <BaseHeading
                            as="h3"
                            size="md"
                            weight="medium"
                            lead="tight"
                            class="xs:text-xl ptablet:text-xl ptablet:font-bold xs:font-bold hover:text-primary-300 mb-4 line-clamp-2 text-white transition-colors duration-300"
                          >
                            <span>{{ video.title }}</span>
                          </BaseHeading>
                        </NuxtLink>
                        <div class="flex gap-3">
                          <BaseAvatar
                            :src="video.author.avatar"
                            :text="video.author.name.slice(0, 1)"
                            size="xs"
                            class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
                          />
                          <div>
                            <NuxtLink to="#">
                              <BaseHeading
                                as="h4"
                                size="xs"
                                weight="light"
                                lead="tight"
                                class="hover:text-primary-500 text-white transition-colors duration-300"
                              >
                                <span>{{ video.author.name }}</span>
                              </BaseHeading>
                            </NuxtLink>

                            <BaseParagraph size="xs">
                              <span class="text-muted-400">
                                {{ video.uploaded }}
                              </span>
                            </BaseParagraph>
                          </div>
                          <div class="ms-auto">
                            <BaseTag
                              color="primary"
                              rounded="full"
                              size="sm"
                            >
                              <span>{{ video.category }}</span>
                            </BaseTag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
