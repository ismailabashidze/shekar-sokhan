<script setup lang="ts">
definePageMeta({
  title: 'داشبورد',
  layout: 'sidebar',
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

// Import user composable
const { user } = useUser()

const activePosts = ref('recent')
const showFeatures = ref(true)
const featuredVideos = [
  {
    id: 1,
    title: 'مراقبه روان شناختی و نحوه ی انجام آن',
    slug: '/videos/1',
    cover: '/img/illustrations/dashboards/video/1.png',
    uploaded: 'دو ساعت پیش',
    category: 'آموزشی',
    author: {
      name: 'علی بهرامی',
      avatar: '/img/avatars/16.svg',
    },
  },
  {
    id: 2,
    title: 'خودشفقتی و مهربانی با خود',
    slug: '/videos/2',
    cover: '/img/illustrations/dashboards/video/2.jpg',
    uploaded: 'شش ساعت پیش',
    category: 'درمان',
    author: {
      name: 'کاملیا مرادزاده',
      avatar: '/img/avatars/10.svg',
    },
  },
  {
    id: 3,
    title: 'مکانیزم های دفاعی',
    slug: '/videos/3',
    cover: '/img/illustrations/dashboards/video/3.png',
    uploaded: 'دیروز',
    category: 'آموزشی',
    author: {
      name: 'دکتر نیما قربانی',
      avatar: '/img/avatars/12.svg',
    },
  },
  {
    id: 4,
    title: 'رویکرد مبتنی بر تمرکز در درمان',
    slug: '/videos/4',
    cover: '/img/illustrations/dashboards/video/4.png',
    uploaded: 'دو روز پیش',
    category: 'درمان',
    author: {
      name: 'علیرضا پرخانی',
      avatar: '/img/avatars/17.svg',
    },
  },
  {
    id: 5,
    title: 'اصول مشاوره',
    slug: '/videos/5',
    cover: '/img/illustrations/dashboards/video/5.png',
    uploaded: 'هفته پیش',
    category: 'درمان',
    author: {
      name: 'مریم ترابی',
      avatar: '/img/avatars/2.svg',
    },
  },
]

const demoAreaMulti = reactive(useDemoAreaMulti())

function useDemoAreaMulti() {
  const { primary, info, success } = useTailwindColors()
  const type = 'area'
  const height = 160

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: [primary.value, info.value, success.value],
    title: {
      text: '',
      align: 'left',
    },
    legend: {
      position: 'top',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-19T01:30:00.000Z',
        '2018-09-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-09-19T04:30:00.000Z',
        '2018-09-19T05:30:00.000Z',
        '2018-09-19T06:30:00.000Z',
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  }

  const series = shallowRef([
    {
      name: 'تکمیل شده',
      data: [31, 120, 28, 51, 42, 109, 100],
    },
    {
      name: 'در انتظار',
      data: [11, 32, 45, 140, 34, 52, 41],
    },
  ])

  return {
    type,
    height,
    options,
    series,
  }
}

// Alpha state modal
const showAlphaModal = ref(false)
const bugReportIconRef = ref(null)

onMounted(() => {
  // Check if the alpha modal has been shown before
  const alphaModalShown = localStorage.getItem('alphaModalShown')

  if (!alphaModalShown) {
    // Show the modal after a short delay
    setTimeout(() => {
      showAlphaModal.value = true
    }, 1000)
  }
})

// Close the modal and save to localStorage
const closeAlphaModal = () => {
  showAlphaModal.value = false
  localStorage.setItem('alphaModalShown', 'true')
}

</script>

<template>
  <div class="relative">
    <!-- Alpha State Modal -->
    <TairoModal
      :open="showAlphaModal"
      size="lg"
      @close="closeAlphaModal"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 sm:p-5">
          <div class="flex items-center gap-2">
            <div class="flex size-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
              <Icon name="ph:warning" class="size-5" />
            </div>
            <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              نسخه آزمایشی
            </h3>
          </div>
          <BaseButtonClose @click="closeAlphaModal" />
        </div>
      </template>
      <div class="p-4 sm:p-5">
        <BaseParagraph class="mb-4 text-justify">
          با سلام و احترام، از اینکه به ما اعتماد کرده‌اید و همراه ما هستید، صمیمانه سپاسگزاریم. این پلتفرم حاصل تلاش شبانه‌روزی تیم ما برای ارائه خدمات بهتر به شماست و هنوز در مرحله آزمایشی (آلفا) قرار دارد.
        </BaseParagraph>
        <BaseParagraph class="mb-4 text-justify">
          ما می‌دانیم که وقت شما ارزشمند است و هر خطا یا مشکلی در سیستم می‌تواند تجربه شما را تحت تأثیر قرار دهد. به همین دلیل، از شما دعوت می‌کنیم تا در این مسیر همراه ما باشید و با گزارش مشکلات، به ما در بهبود سیستم کمک کنید.
        </BaseParagraph>
        <BaseParagraph class="mb-6 text-justify">
          هر بازخورد شما، حتی کوچکترین مورد، برای ما بسیار ارزشمند است و مستقیماً به تیم توسعه ما منتقل می‌شود. با استفاده از دکمه زرد گزارش خطا که در نوار کناری قرار دارد، می‌توانید به راحتی با ما در ارتباط باشید و ما را در مسیر پیشرفت یاری کنید.
        </BaseParagraph>

        <div class="mb-6 flex items-center justify-center">
          <div class="border-muted-200 dark:border-muted-700 flex items-center gap-4 rounded-xl border p-4">
            <div
              class="flex size-12 cursor-pointer items-center justify-center rounded-2xl bg-yellow-500/20 text-yellow-500 transition-colors duration-300 hover:bg-yellow-500/30 hover:text-yellow-500"
            >
              <Icon name="ph:bug" class="size-5" />
            </div>
            <div class="flex flex-col">
              <BaseText size="sm" class="text-muted-400">
                این دکمه را در نوار کناری پیدا کنید
              </BaseText>
              <BaseText>
                و برای گزارش روی آن کلیک کنید
              </BaseText>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <BaseButton color="primary" @click="closeAlphaModal">
            متوجه شدم
          </BaseButton>
        </div>
      </div>
    </TairoModal>

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
                <img
                  class="pointer-events-none absolute start-6 top-0 sm:-start-10"
                  src="/img/illustrations/dashboards/writer/readers.svg"
                  alt="Readers illustration"
                >
              </div>
              <div class="mt-6 grow sm:mt-0">
                <div class="pb-4 text-center sm:pb-0 sm:text-right">
                  <BaseHeading tag="h1" class="text-white opacity-90">
                    <span>سلام، {{ user?.phoneNumber || 'کاربر عزیز' }} ! 👋</span>
                  </BaseHeading>
                  <BaseParagraph size="sm" class="max-w-xs text-white opacity-70">
                    <span>
                      این جا پنل شماست. در این بخش می توانید جلسات و برنامه ها، اطلاعات جلسات، محتوای متنی و دیگر بخش ها
                      را مدیریت و نظارت کنید.
                    </span>
                  </BaseParagraph>
                  <div class="mt-2 flex flex-col gap-2 sm:flex-row">
                    <!-- <BaseButton
                      size="sm"
                      color="light"
                      variant="outline"
                      class="w-full sm:w-auto"
                      to="darmana/patients/choosePatient"
                    >
                      <Icon name="lucide:users" class="ml-2 size-4" />
                      <span>مراجعین</span>
                    </BaseButton> -->
                    <BaseButton
                      size="sm"
                      color="light"
                      variant="outline"
                      class="w-full sm:w-auto"
                      to="/darmana/therapists/sessions"
                    >
                      <Icon name="ph:robot-duotone" class="ml-2 size-4" />
                      <span>روانشناسان هوش مصنوعی</span>
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
                      <BaseIconBox
                        size="sm"
                        class="bg-info-100 text-info-500 dark:bg-info-500/20 dark:text-info-400 dark:border-info-500 dark:border-2"
                        rounded="full"
                        color="none"
                      >
                        <Icon name="ph:timer-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading
                          as="h2"
                          size="sm"
                          weight="semibold"
                          lead="tight"
                          class="text-muted-800 dark:text-white"
                        >
                          <span>۶۳۰۰</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">دقیقه استفاده</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                    <!-- Inner item -->
                    <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
                      <BaseIconBox
                        size="sm"
                        class="bg-primary-100 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500 dark:border-2"
                        rounded="full"
                        color="none"
                      >
                        <Icon name="ph:broadcast-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading
                          as="h2"
                          size="sm"
                          weight="semibold"
                          lead="tight"
                          class="text-muted-800 dark:text-white"
                        >
                          <span>۹۳۰۲</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">پیام رد و بدل شده</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                    <!-- Inner item -->
                    <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
                      <BaseIconBox
                        size="sm"
                        class="bg-lime-100 text-lime-500 dark:border-2 dark:border-lime-500 dark:bg-lime-500/20 dark:text-lime-400"
                        rounded="full"
                        color="none"
                      >
                        <Icon name="ph:user-plus-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading
                          as="h2"
                          size="sm"
                          weight="semibold"
                          lead="tight"
                          class="text-muted-800 dark:text-white"
                        >
                          <span>۱۳</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">تمرین انجام شده</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                    <!-- Inner item -->
                    <BaseCard rounded="lg" class="flex items-center gap-2 p-3">
                      <BaseIconBox
                        size="sm"
                        class="bg-amber-100 text-amber-500 dark:border-2 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-400"
                        rounded="full"
                        color="none"
                      >
                        <Icon name="ph:door-duotone" class="size-5" />
                      </BaseIconBox>
                      <div>
                        <BaseHeading
                          as="h2"
                          size="sm"
                          weight="semibold"
                          lead="tight"
                          class="text-muted-800 dark:text-white"
                        >
                          <span>۱۲۹</span>
                        </BaseHeading>
                        <BaseParagraph size="xs">
                          <span class="text-muted-500 dark:text-muted-400">هدف موفق</span>
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                  </div>
                </div>
              </div>
              <div class="col-span-12">
                <Transition
                  leave-active-class="transition origin-top duration-75 ease-in"
                  leave-from-class="transform scale-y-100 opacity-100"
                  leave-to-class="transform scale-y-0 opacity-0"
                >
                  <div v-if="showFeatures" class="w-full">
                    <!--Features widget-->
                    <NewFeatures>
                      <template #actions>
                        <BaseButtonClose
                          size="sm"
                          color="muted"
                          data-nui-tooltip="بستن"
                          @click="showFeatures = false"
                        />
                      </template>
                    </NewFeatures>
                  </div>
                </Transition>
              </div>
              <div class="col-span-4">
                <BaseCard rounded="lg" class="p-4">
                  <InfoImage
                    rounded="lg"
                    image="/img/illustrations/widgets/5.svg"
                    title="تبریک!"
                    text="نشان نویسنده خلاق را دریافت کرده اید."
                  />
                </BaseCard>
              </div>
              <div class="col-span-4">
                <BaseCard rounded="lg" class="p-4">
                  <InfoImage
                    rounded="lg"
                    image="/img/illustrations/widgets/6.svg"
                    title="مشاور روان"
                    text="می توانید به آسانی با یک مشاور صحبت کنید"
                  />
                </BaseCard>
              </div>
              <div class="col-span-4">
                <BaseCard rounded="lg" class="p-4">
                  <InfoImage
                    rounded="lg"
                    image="/img/illustrations/widgets/1.svg"
                    title="برنامه ریزی و اجرا"
                    text="برای کارتان برنامه ریزی کنید"
                  />
                </BaseCard>
              </div>
              <div class="col-span-4">
                <BaseCard rounded="lg" class="p-6">
                  <IconsSquare rounded="lg" />
                </BaseCard>
              </div>
              <div class="col-span-8">
                <BaseCard rounded="lg" class="p-6">
                  <!-- Title -->
                  <div class="mb-6">
                    <BaseHeading
                      as="h3"
                      size="md"
                      weight="semibold"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>روند اقدامات</span>
                    </BaseHeading>
                  </div>
                  <AddonApexcharts v-bind="demoAreaMulti" />
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Column -->
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="bg-muted-200 dark:bg-muted-800/70  rounded-2xl p-6">
          <!-- Title -->
          <div class="mb-8 flex items-center justify-between">
            <BaseHeading
              as="h3"
              size="md"
              weight="semibold"
              lead="tight"
              class="text-muted-800 dark:text-white"
            >
              <span>آخرین مطالب</span>
            </BaseHeading>
            <div class="flex scale-90 gap-2 sm:justify-end">
              <BaseButtonAction
                small
                :color="activePosts === 'recent' ? 'primary' : 'default'"
                @click="activePosts = 'recent'"
              >
                مقالات اخیر
              </BaseButtonAction>
              <BaseButtonAction
                small
                :color="activePosts === 'popular' ? 'primary' : 'default'"
                @click="activePosts = 'popular'"
              >
                مقالات محبوب
              </BaseButtonAction>
            </div>
          </div>
          <!-- Posts-->
          <div class="ptablet:grid ptablet:grid-cols-2 flex flex-col gap-6">
            <!-- Post -->
            <NuxtLink :to="`/posts/1`" class="flex flex-col">
              <img
                src="/img/illustrations/dashboards/writer/post-1.svg"
                alt="Post image"
                class="bg-muted-200 rounded-xl"
              >
              <BaseCard class="shadow-muted-300/30 dark:shadow-muted-900/20 -mt-8 !rounded-2xl p-6 shadow-xl">
                <div class="mb-3">
                  <BaseHeading
                    as="h4"
                    size="md"
                    weight="light"
                    lead="tight"
                    class="text-muted-800 mb-1 dark:text-white"
                  >
                    <span>چگونه خودآگاهی می‌تواند زندگی‌تان را تغییر دهد</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">
                      کشف قدرت خودآگاهی برای بهبود زندگی و راهکارهای کاربردی برای تقویت آن.
                    </span>
                  </BaseParagraph>
                </div>
                <div class="flex gap-3">
                  <BaseAvatar
                    src="/img/avatars/6.svg"
                    text="BT"
                    size="xs"
                    class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
                  />
                  <div>
                    <BaseHeading
                      as="h4"
                      size="xs"
                      weight="light"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>دکتر علی مرادی</span>
                    </BaseHeading>
                    <BaseParagraph size="xs">
                      <span class="text-muted-400">روانشناس بالینی</span>
                    </BaseParagraph>
                  </div>
                </div>
              </BaseCard>
            </NuxtLink>
            <!-- Post -->
            <NuxtLink :to="`/posts/2`" class="flex flex-col">
              <img
                src="/img/illustrations/dashboards/writer/post-2.svg"
                alt="Post image"
                class="bg-muted-200 rounded-xl"
              >
              <BaseCard class="shadow-muted-300/30 dark:shadow-muted-900/20 -mt-8 !rounded-2xl p-6 shadow-xl">
                <div class="mb-3">
                  <BaseHeading
                    as="h4"
                    size="md"
                    weight="light"
                    lead="tight"
                    class="text-muted-800 mb-1 dark:text-white"
                  >
                    <span>استرس را بکش، قبل از اینکه تو را بکشد</span>
                  </BaseHeading>
                  <BaseParagraph size="xs">
                    <span class="text-muted-400">
                      چرا باید استرس داشته باشیم، وقتی می توانیم شاد باشیم؟
                    </span>
                  </BaseParagraph>
                </div>
                <div class="flex gap-3">
                  <BaseAvatar
                    src="/img/avatars/5.svg"
                    text="BT"
                    size="xs"
                    class="bg-primary-100 dark:bg-primary-500/20 text-primary-500 shrink-0"
                  />
                  <div>
                    <BaseHeading
                      as="h4"
                      size="xs"
                      weight="light"
                      lead="tight"
                      class="text-muted-800 dark:text-white"
                    >
                      <span>دکتر مریم عباسی</span>
                    </BaseHeading>
                    <BaseParagraph size="xs">
                      <span class="text-muted-400">روان درمانگر و عضو هیئت علمی دانشگاه</span>
                    </BaseParagraph>
                  </div>
                </div>
              </BaseCard>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <BaseCard class="mt-5">
      <div class="m-5">
        <BaseHeading
          as="h3"
          weight="medium"
          size="xl"
          class="text-muted-800 dark:text-muted-100"
        >
          ویدئوهایی برای شما
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400">
          اگر با محتوای بصری راحت تر هستید، این ویدئو ها را از دست ندهید
        </BaseParagraph>
      </div>
      <div class="m-5 grid min-h-[440px] grid-cols-12 gap-6">
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
                    :to="`/videos/${video.id}`"
                    class="group-hover:border-primary-500 text-muted-300 group-hover:text-primary-500 shadow-muted-300/30 dark:shadow-muted-900/20 flex size-14 items-center justify-center rounded-full border-2 border-transparent bg-white shadow-2xl transition-colors duration-300"
                  >
                    <Icon name="ic:round-play-arrow" class="size-7" />
                  </NuxtLink>
                </div>
                <div class="ptablet:p-10 p-6">
                  <NuxtLink :to="`/videos/${video.id}`">
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
                      <NuxtLink :to="`/videos/${video.id}`">
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
                          :to="`/videos/${video.id}`"
                          class="group-hover:border-primary-500 text-muted-300 group-hover:text-primary-500 shadow-muted-300/30 dark:shadow-muted-900/20 flex size-10 items-center justify-center rounded-full border-2 border-transparent bg-white shadow-2xl transition-colors duration-300"
                        >
                          <Icon name="ic:round-play-arrow" class="size-5" />
                        </NuxtLink>
                      </div>
                      <div class="p-4">
                        <NuxtLink :to="`/videos/${video.id}`">
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
                            <NuxtLink :to="`/videos/${video.id}`">
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
    </BaseCard>
  </div>
</template>
