<!--
  This is the dynamic video page that will show individual video content
  The [id].vue filename creates a dynamic route parameter
-->
<script setup lang="ts">
definePageMeta({
  title: 'محتوای بصری',
  layout: 'sidebar',
  preview: {
    title: 'ویدیو',
    description: 'ویدیو',
    categories: ['videos'],
    src: '/img/screens/videos.png',
    srcDark: '/img/screens/videos-dark.png',
    order: 18,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

// Video data (in real app, this would come from an API)
const videos = [
  {
    id: 1,
    title: 'مراقبه روان شناختی و نحوه ی انجام آن',
    description: 'در این ویدیو به بررسی مراقبه روان شناختی و نحوه انجام صحیح آن می‌پردازیم.',
    videoUrl: 'https://example.com/videos/1.mp4', // Replace with actual video URL
    cover: '/img/illustrations/dashboards/video/1.png',
    uploaded: 'دو ساعت پیش',
    category: 'آموزشی',
    author: {
      name: 'علی بهرامی',
      avatar: '/img/avatars/16.svg',
      bio: 'متخصص در زمینه مراقبه و تکنیک‌های آرامش‌بخشی',
    },
  },
  {
    id: 2,
    title: 'خودشفقتی و مهربانی با خود',
    description: 'آموزش تکنیک‌های خودشفقتی و راه‌های ایجاد رابطه سالم با خود',
    videoUrl: 'https://example.com/videos/2.mp4',
    cover: '/img/illustrations/dashboards/video/2.jpg',
    uploaded: 'شش ساعت پیش',
    category: 'درمان',
    author: {
      name: 'کاملیا مرادزاده',
      avatar: '/img/avatars/10.svg',
      bio: 'روانشناس بالینی با تخصص در حوزه خودشفقتی',
    },
  },
  {
    id: 3,
    title: 'مکانیزم های دفاعی',
    description: 'بررسی انواع مکانیزم‌های دفاعی و نقش آنها در سلامت روان',
    videoUrl: 'https://example.com/videos/3.mp4',
    cover: '/img/illustrations/dashboards/video/3.png',
    uploaded: 'دیروز',
    category: 'آموزشی',
    author: {
      name: 'دکتر مرتضی زهرایی',
      avatar: '/img/avatars/12.svg',
      bio: 'استاد دانشگاه و متخصص روانشناسی بالینی',
    },
  },
  {
    id: 4,
    title: 'رویکرد مبتنی بر تمرکز در درمان',
    description: 'معرفی و آموزش تکنیک‌های درمانی مبتنی بر تمرکز',
    videoUrl: 'https://example.com/videos/4.mp4',
    cover: '/img/illustrations/dashboards/video/4.png',
    uploaded: 'دو روز پیش',
    category: 'درمان',
    author: {
      name: 'علیرضا پرخانی',
      avatar: '/img/avatars/17.svg',
      bio: 'درمانگر و متخصص در رویکردهای نوین درمانی',
    },
  },
  {
    id: 5,
    title: 'اصول مشاوره',
    description: 'آشنایی با اصول پایه‌ای مشاوره و کاربرد آن در درمان',
    videoUrl: 'https://example.com/videos/5.mp4',
    cover: '/img/illustrations/dashboards/video/5.png',
    uploaded: 'هفته پیش',
    category: 'درمان',
    author: {
      name: 'مریم ترابی',
      avatar: '/img/avatars/2.svg',
      bio: 'مشاور ارشد و مدرس دانشگاه',
    },
  },
]

// Get route params
const route = useRoute()
const videoId = parseInt(route.params.id as string)

// Find the current video
const currentVideo = videos.find(v => v.id === videoId)

// Handle video not found
if (!currentVideo) {
  throw createError({
    statusCode: 404,
    message: 'ویدیو مورد نظر یافت نشد',
  })
}

// Get related videos (excluding current video)
const relatedVideos = computed(() =>
  videos
    .filter(v => v.id !== videoId)
    .filter(v => v.category === currentVideo.category)
    .slice(0, 3),
)
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
    <div class="container mx-auto p-4">
      <!-- Video Info -->
      <div class="mb-8 grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <!-- Title and Meta -->
          <div class="dark:bg-muted-800 relative overflow-hidden rounded-xl bg-white p-6 shadow-lg">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5">
              <div class="bg-info-500/30 absolute -left-12 top-0 size-64 rounded-full blur-2xl" />
              <div class="bg-primary-500/20 absolute -bottom-12 -right-12 size-64 rounded-full blur-2xl" />
            </div>

            <!-- Content -->
            <div class="relative">
              <div class="mb-6 flex items-center justify-between">
                <h1 class="text-muted-800 text-2xl font-bold dark:text-white">
                  {{ currentVideo.title }}
                </h1>
                <button class="text-muted-400 border-muted-200 dark:border-muted-700 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:text-amber-500">
                  <Icon name="ph:bookmark-simple-duotone" class="size-5" />
                  <span>ذخیره</span>
                </button>
              </div>

              <div class="mb-6 flex flex-wrap items-center gap-4">
                <div class="bg-muted-100 dark:bg-muted-900 flex items-center gap-2 rounded-lg px-3 py-1.5">
                  <Icon name="ph:clock-duotone" class="text-primary-500 size-4" />
                  <span class="text-muted-500 text-sm">{{ currentVideo.uploaded }}</span>
                </div>
                <div class="bg-muted-100 dark:bg-muted-900 flex items-center gap-2 rounded-lg px-3 py-1.5">
                  <Icon name="ph:folder-duotone" class="text-success-500 size-4" />
                  <span class="text-muted-500 text-sm">{{ currentVideo.category }}</span>
                </div>
                <div class="bg-muted-100 dark:bg-muted-900 flex items-center gap-2 rounded-lg px-3 py-1.5">
                  <Icon name="ph:timer-duotone" class="text-info-500 size-4" />
                  <span class="text-muted-500 text-sm">۱۵ دقیقه</span>
                </div>
              </div>

              <div class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-900 relative rounded-lg border p-5">
                <div class="bg-primary-500 absolute -right-1 top-4 size-1 rounded-full" />
                <p class="text-muted-600 dark:text-muted-200 text-sm leading-relaxed">
                  {{ currentVideo.description }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in ['روانشناسی', 'آموزش', 'مراقبه', 'سلامت روان']"
                    :key="tag"
                    class="text-primary-500 bg-primary-500/10 rounded-lg px-2.5 py-1 text-xs font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Author Info -->
        <div class="dark:bg-muted-800 relative overflow-hidden rounded-xl bg-white p-6 shadow-lg">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-5">
            <div class="bg-primary-500/30 absolute -right-12 -top-12 size-48 rounded-full blur-2xl" />
            <div class="bg-success-500/20 absolute -bottom-12 -left-12 size-48 rounded-full blur-2xl" />
          </div>

          <!-- Content -->
          <div class="relative">
            <div class="mb-6 flex items-center gap-4">
              <div class="relative">
                <div class="bg-primary-500/20 absolute -inset-1 animate-pulse rounded-full blur-sm" />
                <img
                  :src="currentVideo.author.avatar"
                  :alt="currentVideo.author.name"
                  class="dark:border-muted-700 relative size-20 rounded-full border-2 border-white shadow-lg"
                >
              </div>
              <div>
                <h3 class="text-muted-800 mb-1 text-xl font-bold dark:text-white">
                  {{ currentVideo.author.name }}
                </h3>
                <p class="text-primary-500 text-sm font-medium">
                  {{ currentVideo.category }}
                </p>
              </div>
            </div>

            <div class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-900 relative rounded-lg border p-4">
              <p class="text-muted-500 dark:text-muted-300 mb-3 text-sm leading-relaxed">
                {{ currentVideo.author.bio }}
              </p>
              <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-t pt-3">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1">
                    <Icon name="ph:video-camera-duotone" class="text-primary-500 size-4" />
                    <span class="text-muted-400 text-xs">12 ویدیو</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon name="ph:users-duotone" class="text-success-500 size-4" />
                    <span class="text-muted-400 text-xs">2.5K دنبال‌کننده</span>
                  </div>
                </div>
                <button class="text-primary-500 hover:text-primary-600 flex items-center gap-1 text-sm font-medium transition-colors">
                  <Icon name="ph:plus-circle-duotone" class="size-4" />
                  <span>دنبال کردن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Video Player Section -->
      <div class="dark:bg-muted-800 relative mb-8 overflow-hidden rounded-xl bg-white p-6 shadow-lg">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="bg-primary-500/20 absolute -left-24 -top-24 size-96 rounded-full blur-3xl" />
          <div class="bg-info-500/20 absolute -bottom-24 -right-24 size-96 rounded-full blur-3xl" />
        </div>

        <!-- Content -->
        <div class="relative">
          <div class="bg-muted-200 dark:bg-muted-700 group relative aspect-video w-full overflow-hidden rounded-lg">
            <!-- Placeholder for video player -->
            <div class="flex h-full flex-col items-center justify-center">
              <div class="mb-4 flex size-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Icon name="ph:play-circle-duotone" class="size-12 text-white" />
              </div>
              <span class="text-lg font-medium text-white/90">{{ currentVideo.title }}</span>
              <span class="mt-2 text-sm text-white/60">برای پخش کلیک کنید</span>
            </div>

            <!-- Video thumbnail -->
            <img
              :src="currentVideo.cover"
              :alt="currentVideo.title"
              class="absolute inset-0 size-full object-cover opacity-50"
            >

            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <!-- Video meta info -->
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <Icon name="ph:clock-duotone" class="text-primary-500 size-5" />
                <span class="text-muted-400 text-sm">{{ currentVideo.uploaded }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ph:eye-duotone" class="text-success-500 size-5" />
                <span class="text-muted-400 text-sm">2.1K بازدید</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button class="text-muted-400 hover:text-primary-500 flex items-center gap-1 text-sm transition-colors">
                <Icon name="ph:share-network-duotone" class="size-5" />
                <span>اشتراک‌گذاری</span>
              </button>
              <button class="text-muted-400 flex items-center gap-1 text-sm transition-colors hover:text-rose-500">
                <Icon name="ph:heart-duotone" class="size-5" />
                <span>۱۲۵ لایک</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Videos -->
      <div v-if="relatedVideos.length" class="mb-8">
        <h2 class="text-muted-800 mb-6 text-xl font-bold dark:text-white">
          ویدیوهای مرتبط
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="video in relatedVideos"
            :key="video.id"
            :to="`/videos/${video.id}`"
            class="dark:bg-muted-800 group rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <div class="relative mb-4 aspect-video overflow-hidden rounded-lg">
              <img
                :src="video.cover"
                :alt="video.title"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              >
            </div>
            <h3 class="text-muted-800 mb-2 font-semibold dark:text-white">
              {{ video.title }}
            </h3>
            <div class="text-muted-500 flex items-center gap-2 text-sm">
              <img
                :src="video.author.avatar"
                :alt="video.author.name"
                class="size-6 rounded-full"
              >
              <span>{{ video.author.name }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
