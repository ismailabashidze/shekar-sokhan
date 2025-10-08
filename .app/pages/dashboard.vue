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
const { getUserAvatarUrl } = useAvatarManager()

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
      name: 'دکتر مرتضی زهرایی',
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
            <div class="flex flex-col items-start">
              <BaseText size="sm" class="text-muted-400">
                این دکمه را  پیدا کنید
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

    <!-- Bug Report Icon - Only visible when Alpha modal is showing -->
    <div class="fixed bottom-6 right-6 z-50">
      <GlobalBugReportIcon :visible="showAlphaModal" />
    </div>

    <div>
      <!-- Statistics Cards Section -->
      <div class="mb-3 mt-0" data-tour="statistics">
        <DashboardStatisticsCards />
      </div>


      <!-- Grid -->
      <div class="grid grid-cols-12 gap-6">
        
        <!-- Main Content Column -->
        <div :class="showFeatures ? 'ltablet:col-span-8 lg:col-span-8' : 'ltablet:col-span-12 lg:col-span-12'" class="col-span-12 mb-3">
          <!-- Inner grid -->
          <div class="grid grid-cols-12 gap-6">
            <!-- Header -->
            <div class="col-span-12" data-tour="welcome-section">
              <div class="bg-primary-800 flex flex-col items-center rounded-2xl p-4 sm:flex-row">
                <div class="relative h-[150px] w-[320px] shrink-0 sm:h-[175px]">
                  <img
                    class="pointer-events-none absolute start-0 top-0 sm:-start-10"
                    src="/img/illustrations/dashboards/writer/readers.png"
                    alt="Readers illustration"
                  >
                </div>
                <div class="mt-[80px] grow sm:mt-0">
                  <div class="pb-4 text-center sm:pb-0 sm:text-right">
                    <BaseHeading tag="h1" class="text-white opacity-90">
                      <span class="flex items-center justify-center gap-2 sm:justify-start">
                        سلام،
                        <BaseAvatar
                          :src="getUserAvatarUrl(user) || '/img/avatars/default-male.jpg'"
                          :text="user?.meta?.name?.substring(0, 2) || 'کا'"
                          size="xs"
                          class="inline-block align-middle"
                        />
                        <span>{{ user?.meta?.name || 'کاربر عزیز' }} ! 👋</span>
                      </span>
                    </BaseHeading>
                    <BaseParagraph size="sm" class="my-3 text-white opacity-70">
                      <span>
                        این جا پنل شماست. در این بخش می توانید جلسات و برنامه ها، اطلاعات جلسات، محتوای متنی و دیگر بخش ها
                        را مدیریت و نظارت کنید.
                      </span>
                    </BaseParagraph>
                    <div class="mt-2 flex flex-col gap-2 sm:flex-row" data-tour="quick-actions">
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
                        data-tour="therapists-button"
                      >
                        <Icon name="ph:chat-circle-text-duotone" class="ml-2 size-4" />
                        <span>گفت و گوی آزاد</span>
                      </BaseButton>
                      <BaseButton
                        size="sm"
                        color="light"
                        variant="outline"
                        class="w-full sm:w-auto"
                        to="/therapy-journey/welcome"
                        data-tour="therapists-button"
                      >
                        <Icon name="ph:stethoscope" class="ml-2 size-4" />
                        <span>گفت و گوی درمانی</span>
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
                <div class="col-span-12 md:col-span-4">
                  <BaseCard rounded="lg" class="p-4">
                    <InfoImage
                      rounded="lg"
                      image="/img/illustrations/widgets/5.svg"
                      title="استفاده آسان"
                      text="پیشنهادات هوشمندانه را برای شما ارسال می کند"
                    />
                  </BaseCard>
                </div>
                <div class="col-span-12 md:col-span-4">
                  <BaseCard rounded="lg" class="p-4">
                    <InfoImage
                      rounded="lg"
                      image="/img/illustrations/widgets/6.svg"
                      title="مشاور روان"
                      text="می توانید به آسانی با یک مشاور صحبت کنید"
                    />
                  </BaseCard>
                </div>
                <div class="col-span-12 md:col-span-4">
                  <BaseCard rounded="lg" class="p-4">
                    <InfoImage
                      rounded="lg"
                      image="/img/illustrations/widgets/1.png"
                      title="برنامه ریزی و اجرا"
                      text="برای کارتان برنامه ریزی کنید"
                    />
                  </BaseCard>
                </div>
                <!-- <div class="col-span-4">
                  <BaseCard rounded="lg" class="p-6">
                    <IconsSquare rounded="lg" />
                  </BaseCard>
                </div> -->
                <!-- <div class="col-span-8">
                  <BaseCard rounded="lg" class="p-6">
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
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- Right Column (only shown when features are visible) -->
        <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
          <!-- New Features Section -->
            <div class="col-span-12">
              <Transition
                name="features"
                leave-active-class="transition origin-top duration-75 ease-in"
                leave-from-class="transform scale-y-100 opacity-100"
                leave-to-class="transform scale-y-0 opacity-0"
              >
                <div
                  v-if="showFeatures"
                  class="w-full"
                  data-tour="new-features"
                >
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
        </div>
        
      </div>

    </div>
  </div>
</template>
