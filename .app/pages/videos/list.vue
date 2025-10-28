<!--
  Video list page showing all available videos with filters and search
-->
<script setup lang="ts">
definePageMeta({
  title: 'لیست ویدیوها',
  layout: 'sidebar',
  preview: {
    title: 'ویدیوها',
    description: 'لیست ویدیوها',
    categories: ['videos'],
    src: '/img/screens/videos.png',
    srcDark: '/img/screens/videos-dark.png',
    order: 18,
  },
});
useHead({ htmlAttrs: { dir: 'rtl' } });

// Video data (in real app, this would come from an API)
const videos = [
  {
    id: 1,
    title: 'مراقبه روان شناختی و نحوه ی انجام آن',
    description: 'در این ویدیو به بررسی مراقبه روان شناختی و نحوه انجام صحیح آن می‌پردازیم.',
    cover: '/img/illustrations/dashboards/video/1.png',
    uploaded: 'دو ساعت پیش',
    duration: '۱۵ دقیقه',
    views: '2.1K',
    likes: '125',
    category: 'آموزشی',
    tags: ['روانشناسی', 'آموزش', 'مراقبه', 'سلامت روان'],
    author: {
      name: 'علی بهرامی',
      avatar: '/img/avatars/16.svg',
      bio: 'روانشناس بالینی و متخصص در حوزه مراقبه و سلامت روان',
      videos: 12,
      followers: '2.5K',
    },
  },
  {
    id: 2,
    title: 'تکنیک‌های مدیتیشن برای آرامش ذهنی',
    description: 'آموزش تکنیک‌های مختلف مدیتیشن برای دستیابی به آرامش ذهنی و کاهش استرس.',
    cover: '/img/illustrations/dashboards/video/2.png',
    uploaded: 'یک روز پیش',
    duration: '۲۰ دقیقه',
    views: '1.8K',
    likes: '98',
    category: 'آموزشی',
    tags: ['مدیتیشن', 'آرامش', 'یوگا'],
    author: {
      name: 'مریم احمدی',
      avatar: '/img/avatars/17.svg',
      bio: 'مربی یوگا و متخصص مدیتیشن',
      videos: 8,
      followers: '1.9K',
    },
  },
  {
    id: 3,
    title: 'تمرینات تنفسی برای کاهش اضطراب',
    description: 'در این ویدیو، تمرینات تنفسی موثر برای کاهش اضطراب و استرس را یاد می‌گیرید.',
    cover: '/img/illustrations/dashboards/video/3.png',
    uploaded: 'سه روز پیش',
    duration: '۱۲ دقیقه',
    views: '3.2K',
    likes: '245',
    category: 'سلامت',
    tags: ['تنفس', 'اضطراب', 'آرامش'],
    author: {
      name: 'رضا کریمی',
      avatar: '/img/avatars/18.svg',
      bio: 'متخصص طب سنتی و تنفس درمانی',
      videos: 15,
      followers: '4.1K',
    },
  },
  {
    id: 4,
    title: 'یوگای مقدماتی برای مبتدیان',
    description: 'آموزش حرکات پایه یوگا برای افراد مبتدی به همراه تمرینات عملی.',
    cover: '/img/illustrations/dashboards/video/4.png',
    uploaded: 'یک هفته پیش',
    duration: '۳۰ دقیقه',
    views: '5.7K',
    likes: '432',
    category: 'یوگا',
    featured: true,
    tags: ['یوگا', 'مبتدی', 'تمرین'],
    author: {
      name: 'سارا محمدی',
      avatar: '/img/avatars/19.svg',
      bio: 'مربی بین‌المللی یوگا',
      videos: 25,
      followers: '7.2K',
    },
  },
  {
    id: 5,
    title: 'تکنیک‌های پیشرفته مدیتیشن',
    description: 'در این دوره، تکنیک‌های پیشرفته مدیتیشن را برای افراد با تجربه آموزش می‌دهیم.',
    cover: '/img/illustrations/dashboards/video/5.png',
    uploaded: 'دو هفته پیش',
    duration: '۴۵ دقیقه',
    views: '3.9K',
    likes: '289',
    category: 'مدیتیشن',
    premium: true,
    tags: ['مدیتیشن', 'پیشرفته'],
    author: {
      name: 'حسن رضایی',
      avatar: '/img/avatars/20.svg',
      bio: 'استاد مدیتیشن و مربی ذهن‌آگاهی',
      videos: 18,
      followers: '5.5K',
    },
  },
  {
    id: 6,
    title: 'روانشناسی مثبت‌نگر در زندگی روزمره',
    description: 'چگونه می‌توانیم از اصول روانشناسی مثبت‌نگر در زندگی روزمره استفاده کنیم؟',
    cover: '/img/illustrations/dashboards/video/6.png',
    uploaded: 'سه هفته پیش',
    duration: '۲۵ دقیقه',
    views: '4.2K',
    likes: '367',
    category: 'روانشناسی',
    tags: ['روانشناسی', 'مثبت‌نگری', 'سلامت روان'],
    author: {
      name: 'زهرا کمالی',
      avatar: '/img/avatars/21.svg',
      bio: 'دکترای روانشناسی مثبت‌نگر',
      videos: 30,
      followers: '8.1K',
    },
  },
];

// Active filter
const activeFilter = ref('all');
const filters = [
  { value: 'all', label: 'همه' },
  { value: 'latest', label: 'جدیدترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'educational', label: 'آموزشی' },
];

// Search query
const searchQuery = ref('');

// View mode and sorting
const viewMode = ref('grid');
const sortBy = ref('newest');
const selectedCategory = ref('all');

// Watch Later and Playlist Management
const watchLater = ref<number[]>([]);
const selectedVideos = ref<number[]>([]);
const showPlaylistModal = ref(false);
const showShareModal = ref(false);
const selectedVideoForShare = ref<number | null>(null);
const playlists = ref([
  { id: 1, name: 'مراقبه و مدیتیشن', count: 5 },
  { id: 2, name: 'تمرینات تنفسی', count: 3 },
  { id: 3, name: 'یوگا', count: 7 },
]);

// User History and Progress
const viewHistory = ref<number[]>([1, 3, 5]);
const videoProgress = ref({
  1: 45, // 45% watched
  3: 20, // 20% watched
  5: 80, // 80% watched
});

// Recommendations
const recommendedVideos = ref([
  {
    id: 7,
    title: 'مدیتیشن برای کاهش استرس',
    cover: '/img/illustrations/dashboards/video/7.png',
    duration: '۱۸ دقیقه',
    author: {
      name: 'مریم احمدی',
      avatar: '/img/avatars/17.svg',
    },
  },
  {
    id: 8,
    title: 'یوگا برای سلامت ستون فقرات',
    cover: '/img/illustrations/dashboards/video/8.png',
    duration: '۲۵ دقیقه',
    author: {
      name: 'سارا محمدی',
      avatar: '/img/avatars/19.svg',
    },
  },
  {
    id: 9,
    title: 'تکنیک‌های تمرکز ذهن',
    cover: '/img/illustrations/dashboards/video/9.png',
    duration: '۱۵ دقیقه',
    author: {
      name: 'علی بهرامی',
      avatar: '/img/avatars/16.svg',
    },
  },
]);

// Video Comments Preview
const videoComments = ref({
  1: [
    { user: 'سعید', avatar: '/img/avatars/10.svg', text: 'ویدیوی بسیار مفیدی بود، ممنون از اشتراک‌گذاری.', likes: 12 },
    { user: 'نیلوفر', avatar: '/img/avatars/11.svg', text: 'من هم این تکنیک را امتحان کردم و نتیجه خوبی گرفتم.', likes: 8 },
  ],
  2: [
    { user: 'امیر', avatar: '/img/avatars/12.svg', text: 'آموزش خیلی خوبی بود، ممنون.', likes: 5 },
  ],
  4: [
    { user: 'مهسا', avatar: '/img/avatars/13.svg', text: 'برای مبتدیان عالیه!', likes: 15 },
    { user: 'رضا', avatar: '/img/avatars/14.svg', text: 'من هر روز این تمرینات رو انجام میدم.', likes: 7 },
  ],
});

// Video Analytics
const videoAnalytics = ref({
  totalWatched: '۲۵ ساعت',
  favoriteCategory: 'مدیتیشن',
  completedVideos: 12,
  averageRating: 4.7,
});

// Show/Hide Sections
const showAnalytics = ref(true);
const showRecommended = ref(false);
const showHistory = ref(false);

// Categories
const categories = [
  { value: 'all', label: 'همه', icon: 'ph:squares-four-duotone' },
  { value: 'meditation', label: 'مدیتیشن', icon: 'ph:brain-duotone' },
  { value: 'yoga', label: 'یوگا', icon: 'ph:person-simple-walk-duotone' },
  { value: 'breathing', label: 'تنفس', icon: 'ph:wind-duotone' },
  { value: 'psychology', label: 'روانشناسی', icon: 'ph:heartbeat-duotone' },
];

// Sorting options
const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'views', label: 'پربازدیدترین' },
];

// Computed properties
const filteredVideos = computed(() => {
  let result = [...videos];

  // Apply category filter
  if (selectedCategory.value !== 'all') {
    result = result.filter(v => v.category.toLowerCase() === selectedCategory.value);
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(v =>
      v.title.toLowerCase().includes(query)
      || v.description.toLowerCase().includes(query)
      || v.tags.some(tag => tag.toLowerCase().includes(query)),
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'oldest':
      result.reverse();
      break;
    case 'popular':
      result.sort((a, b) => parseInt(b.likes.replace('K', '000')) - parseInt(a.likes.replace('K', '000')));
      break;
    case 'views':
      result.sort((a, b) => parseInt(b.views.replace('K', '000')) - parseInt(a.views.replace('K', '000')));
      break;
  }

  return result;
});

// Methods
const toggleWatchLater = (videoId: number) => {
  const index = watchLater.value.indexOf(videoId);
  if (index === -1) {
    watchLater.value.push(videoId);
  }
  else {
    watchLater.value.splice(index, 1);
  }
};

const toggleVideoSelection = (videoId: number) => {
  const index = selectedVideos.value.indexOf(videoId);
  if (index === -1) {
    selectedVideos.value.push(videoId);
  }
  else {
    selectedVideos.value.splice(index, 1);
  }
};

const shareVideo = (videoId: number) => {
  selectedVideoForShare.value = videoId;
  showShareModal.value = true;
};

const downloadVideo = (videoId: number) => {
  // In a real app, this would trigger a download
  alert(`دانلود ویدیو ${videoId} شروع شد.`);
};

const toggleSection = (section: 'recommended' | 'history' | 'analytics') => {
  if (section === 'recommended') {
    showRecommended.value = !showRecommended.value;
    showHistory.value = false;
    showAnalytics.value = false;
  }
  else if (section === 'history') {
    showHistory.value = !showHistory.value;
    showRecommended.value = false;
    showAnalytics.value = false;
  }
  else if (section === 'analytics') {
    showAnalytics.value = !showAnalytics.value;
    showRecommended.value = false;
    showHistory.value = false;
  }
};

const clearHistory = () => {
  viewHistory.value = [];
  videoProgress.value = {};
};
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="dark:bg-muted-800 relative mb-8 overflow-hidden rounded-xl bg-white p-6 shadow-lg">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="bg-primary-500/20 absolute -left-24 -top-24 size-96 rounded-full blur-3xl" />
          <div class="bg-info-500/20 absolute -bottom-24 -right-24 size-96 rounded-full blur-3xl" />
        </div>

        <!-- Content -->
        <div class="relative">
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NuxtLink
                to="/dashboard"
                class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors"
              >
                <Icon name="ph:arrow-right-duotone" class="text-muted-500 size-4" />
                <span class="text-muted-500">بازگشت</span>
              </NuxtLink>
              <h1 class="text-muted-800 text-2xl font-bold dark:text-white">
                ویدیوهای آموزشی
              </h1>
            </div>
            <div class="flex items-center gap-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="جستجو در ویدیوها..."
                  class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-900 focus:ring-primary-500 w-64 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 dark:text-white"
                >
                <Icon name="ph:magnifying-glass-duotone" class="text-muted-400 absolute left-3 top-2.5 size-5" />
              </div>
              <!-- Filters -->
              <div class="flex items-center gap-2">
                <button
                  v-for="filter in filters"
                  :key="filter.value"
                  :class="[
                    'rounded-lg px-3 py-1.5 text-sm transition-colors',
                    activeFilter === filter.value
                      ? 'bg-primary-500/10 text-primary-500'
                      : 'text-muted-400 hover:text-primary-500'
                  ]"
                  @click="activeFilter = filter.value"
                >
                  {{ filter.label }}
                </button>
              </div>
              <!-- View Mode Toggle -->
              <div class="ml-4 flex items-center gap-2">
                <button
                  :class="[
                    'rounded-lg p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary-500/10 text-primary-500'
                      : 'text-muted-400 hover:text-primary-500'
                  ]"
                  @click="viewMode = 'grid'"
                >
                  <Icon name="ph:grid-four-duotone" class="size-5" />
                </button>
                <button
                  :class="[
                    'rounded-lg p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary-500/10 text-primary-500'
                      : 'text-muted-400 hover:text-primary-500'
                  ]"
                  @click="viewMode = 'list'"
                >
                  <Icon name="ph:list-bullets-duotone" class="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-6 overflow-x-auto">
        <div class="flex items-center gap-3 pb-1">
          <button
            v-for="category in categories"
            :key="category.value"
            :class="[
              'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors',
              selectedCategory === category.value
                ? 'bg-primary-500 text-white'
                : 'bg-muted-100 text-muted-500 hover:bg-primary-500/10 hover:text-primary-500 dark:bg-muted-800 dark:text-muted-300'
            ]"
            @click="selectedCategory = category.value"
          >
            <Icon :name="category.icon" class="size-4" />
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <!-- Selection Tools -->
        <div class="flex items-center gap-4">
          <div v-if="selectedVideos.length > 0" class="flex items-center gap-2">
            <span class="text-muted-400 text-sm">{{ selectedVideos.length }} مورد انتخاب شده</span>
            <button
              class="bg-primary-500 hover:bg-primary-600 rounded-lg px-3 py-1.5 text-sm text-white transition-colors"
              @click="showPlaylistModal = true"
            >
              افزودن به پلی‌لیست
            </button>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="flex items-center gap-3">
          <label class="text-muted-400 text-sm">مرتب‌سازی:</label>
          <select
            v-model="sortBy"
            class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-900 focus:ring-primary-500 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 dark:text-white"
          >
            <option
              v-for="option in sortOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- User Sections Tabs -->
      <div class="border-muted-200 dark:border-muted-700 mb-6 flex border-b">
        <button
          :class="[
            'relative px-4 py-2 text-sm font-medium transition-colors',
            showAnalytics ? 'text-primary-500 border-primary-500 border-b-2' : 'text-muted-400 hover:text-primary-500'
          ]"
          @click="toggleSection('analytics')"
        >
          <div class="flex items-center gap-2">
            <Icon name="ph:chart-line-duotone" class="size-4" />
            <span>آمار</span>
          </div>
        </button>
        <button
          :class="[
            'relative px-4 py-2 text-sm font-medium transition-colors',
            showRecommended ? 'text-primary-500 border-primary-500 border-b-2' : 'text-muted-400 hover:text-primary-500'
          ]"
          @click="toggleSection('recommended')"
        >
          <div class="flex items-center gap-2">
            <Icon name="ph:star-duotone" class="size-4" />
            <span>پیشنهادها</span>
          </div>
        </button>
        <button
          :class="[
            'relative px-4 py-2 text-sm font-medium transition-colors',
            showHistory ? 'text-primary-500 border-primary-500 border-b-2' : 'text-muted-400 hover:text-primary-500'
          ]"
          @click="toggleSection('history')"
        >
          <div class="flex items-center gap-2">
            <Icon name="ph:clock-counter-clockwise-duotone" class="size-4" />
            <span>تاریخچه</span>
          </div>
        </button>
      </div>

      <!-- Recommended Videos Section -->
      <div v-if="showRecommended" class="mb-8">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-bold">
            پیشنهاد برای شما
          </h2>
          <button class="text-primary-500 text-sm hover:underline">
            مشاهده همه
          </button>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            v-for="video in recommendedVideos"
            :key="video.id"
            class="dark:bg-muted-800 group relative overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1"
          >
            <div class="bg-muted-200 dark:bg-muted-700 relative aspect-video overflow-hidden">
              <img
                :src="video.cover"
                :alt="video.title"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <NuxtLink
                :to="`/videos/${video.id}`"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Icon name="ph:play-circle-duotone" class="size-6 text-white" />
                </div>
              </NuxtLink>

              <div class="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 backdrop-blur-sm">
                <span class="text-xs text-white">{{ video.duration }}</span>
              </div>
            </div>
            <div class="p-3">
              <h3 class="text-muted-800 mb-2 line-clamp-1 text-sm font-bold dark:text-white">
                {{ video.title }}
              </h3>
              <div class="flex items-center gap-2">
                <img
                  :src="video.author.avatar"
                  :alt="video.author.name"
                  class="size-6 rounded-full"
                >
                <span class="text-muted-400 text-xs">{{ video.author.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div v-if="showHistory" class="mb-8">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-bold">
            تاریخچه تماشا
          </h2>
          <button
            class="text-sm text-rose-500 hover:underline"
            @click="clearHistory"
          >
            پاک کردن تاریخچه
          </button>
        </div>

        <div v-if="viewHistory.length === 0" class="dark:bg-muted-800 rounded-lg bg-white p-8 text-center shadow-md">
          <Icon name="ph:video-camera-slash-duotone" class="text-muted-300 mx-auto mb-4 size-16" />
          <p class="text-muted-400 mb-2">
            تاریخچه تماشای شما خالی است
          </p>
          <p class="text-muted-400 text-sm">
            با تماشای ویدیوها، آن‌ها در اینجا نمایش داده می‌شوند
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="videoId in viewHistory"
            :key="videoId"
            class="dark:bg-muted-800 flex items-center gap-4 rounded-lg bg-white p-4 shadow-md"
          >
            <div class="bg-muted-200 dark:bg-muted-700 relative aspect-video w-40 overflow-hidden rounded-lg">
              <img
                :src="videos.find(v => v.id === videoId)?.cover"
                :alt="videos.find(v => v.id === videoId)?.title"
                class="size-full object-cover"
              >

              <!-- Progress Bar -->
              <div
                v-if="viewHistory.includes(videoId)"
                class="bg-muted-300 absolute inset-x-0 bottom-0 h-1"
              >
                <div
                  class="bg-primary-500 h-full"
                  :style="`width: ${videoProgress[videoId]}%`"
                />
              </div>
            </div>

            <div class="flex-1">
              <NuxtLink :to="`/videos/${videoId}`">
                <h3 class="text-muted-800 mb-1 line-clamp-1 text-sm font-bold dark:text-white">
                  {{ videos.find(v => v.id === videoId)?.title }}
                </h3>
              </NuxtLink>
              <p class="text-muted-400 text-xs">
                {{ videoProgress[videoId] }}% تماشا شده
              </p>
              <div class="mt-2 flex items-center gap-2">
                <button
                  class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 rounded-full border p-1.5 transition-colors"
                  @click="() => { $router.push(`/videos/${videoId}`) }"
                >
                  <Icon name="ph:play-duotone" class="text-primary-500 size-4" />
                </button>
                <button
                  class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 rounded-full border p-1.5 transition-colors"
                  @click="toggleWatchLater(videoId)"
                >
                  <Icon
                    :name="watchLater.includes(videoId) ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple-duotone'"
                    class="text-muted-400 size-4"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Section -->
      <div v-if="showAnalytics" class="mb-8">
        <div class="mb-4">
          <h2 class="text-xl font-bold">
            آمار تماشای شما
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="dark:bg-muted-800 rounded-lg bg-white p-4 shadow-md">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-muted-400 text-sm">
                زمان تماشا
              </h3>
              <Icon name="ph:clock-duotone" class="text-primary-500 size-5" />
            </div>
            <p class="text-2xl font-bold">
              {{ videoAnalytics.totalWatched }}
            </p>
          </div>

          <div class="dark:bg-muted-800 rounded-lg bg-white p-4 shadow-md">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-muted-400 text-sm">
                دسته محبوب
              </h3>
              <Icon name="ph:heart-duotone" class="size-5 text-rose-500" />
            </div>
            <p class="text-2xl font-bold">
              {{ videoAnalytics.favoriteCategory }}
            </p>
          </div>

          <div class="dark:bg-muted-800 rounded-lg bg-white p-4 shadow-md">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-muted-400 text-sm">
                ویدیوهای کامل شده
              </h3>
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5" />
            </div>
            <p class="text-2xl font-bold">
              {{ videoAnalytics.completedVideos }}
            </p>
          </div>

          <div class="dark:bg-muted-800 rounded-lg bg-white p-4 shadow-md">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-muted-400 text-sm">
                میانگین امتیاز
              </h3>
              <Icon name="ph:star-duotone" class="text-warning-500 size-5" />
            </div>
            <p class="text-2xl font-bold">
              {{ videoAnalytics.averageRating }}
            </p>
          </div>
        </div>
      </div>

      <!-- Video Grid/List -->
      <div
        :class="[
          viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-6'
        ]"
      >
        <div
          v-for="video in filteredVideos"
          :key="video.id"
          :class="[
            'dark:bg-muted-800 group relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1',
            viewMode === 'grid' ? 'rounded-xl' : 'flex gap-4 rounded-lg'
          ]"
        >
          <NuxtLink :to="`/videos/${video.id}`" class="absolute inset-0 z-20">
            <span class="sr-only">مشاهده {{ video.title }}</span>
          </NuxtLink>

          <!-- Selection Checkbox -->
          <div class="absolute left-3 top-3 z-30">
            <input
              type="checkbox"
              :checked="selectedVideos.includes(video.id)"
              class="border-muted-300 bg-muted-50 text-primary-500 focus:ring-primary-500 rounded"
              @change="toggleVideoSelection(video.id)"
            >
          </div>

          <!-- Premium Badge -->
          <div v-if="video.premium" class="absolute right-3 top-3 z-30">
            <span class="bg-warning-500 rounded-full px-2 py-1 text-xs text-white">ویژه</span>
          </div>

          <!-- Featured Badge -->
          <div v-if="video.featured" class="absolute right-3 top-3 z-30">
            <span class="bg-success-500 rounded-full px-2 py-1 text-xs text-white">منتخب</span>
          </div>

          <!-- Thumbnail Section -->
          <div
            :class="[
              'bg-muted-200 dark:bg-muted-700 relative overflow-hidden',
              viewMode === 'grid' ? 'aspect-video' : 'aspect-[16/9] w-1/3'
            ]"
          >
            <img
              :src="video.cover"
              :alt="video.title"
              class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <!-- Progress Bar (if watched) -->
            <div
              v-if="viewHistory.includes(video.id)"
              class="bg-muted-300 absolute inset-x-0 bottom-0 h-1"
            >
              <div
                class="bg-primary-500 h-full"
                :style="`width: ${videoProgress[video.id]}%`"
              />
            </div>

            <NuxtLink
              :to="`/videos/${video.id}`"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="flex size-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Icon name="ph:play-circle-duotone" class="size-8 text-white" />
              </div>
            </NuxtLink>

            <!-- Duration -->
            <div class="absolute bottom-3 right-3 rounded-lg bg-black/50 px-2 py-1 backdrop-blur-sm">
              <span class="text-xs text-white">{{ video.duration }}</span>
            </div>

            <!-- Watch Later Button -->
            <button
              class="absolute bottom-3 left-3 z-10"
              @click.prevent="toggleWatchLater(video.id)"
            >
              <div class="flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 backdrop-blur-sm">
                <Icon
                  :name="watchLater.includes(video.id) ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple-duotone'"
                  class="size-4 text-white"
                />
                <span class="text-xs text-white">تماشای بعدی</span>
              </div>
            </button>
          </div>

          <!-- Content Section -->
          <div
            :class="[
              'flex flex-col justify-between p-4',
              viewMode === 'grid' ? '' : 'flex-1'
            ]"
          >
            <div>
              <h3 class="text-muted-800 mb-2 line-clamp-1 text-lg font-bold dark:text-white">
                {{ video.title }}
              </h3>

              <p class="text-muted-500 mb-4 line-clamp-2 text-sm">
                {{ video.description }}
              </p>

              <!-- Tags -->
              <div class="mb-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in video.tags"
                  :key="tag"
                  class="bg-muted-100 dark:bg-muted-700 text-muted-500 dark:text-muted-300 rounded-full px-2 py-1 text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Comments Preview -->
            <div v-if="videoComments[video.id]" class="border-muted-200 dark:border-muted-700 mb-4 border-t pt-3">
              <div class="mb-2 flex items-center justify-between">
                <h4 class="text-muted-500 text-xs font-medium">
                  نظرات اخیر
                </h4>
                <span class="text-muted-400 text-xs">{{ videoComments[video.id].length }} نظر</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(comment, index) in videoComments[video.id].slice(0, 1)"
                  :key="index"
                  class="bg-muted-50 dark:bg-muted-900 rounded-lg p-2"
                >
                  <div class="flex items-center gap-2">
                    <img
                      :src="comment.avatar"
                      :alt="comment.user"
                      class="size-5 rounded-full"
                    >
                    <span class="text-muted-800 text-xs font-medium dark:text-white">{{ comment.user }}</span>
                  </div>
                  <p class="text-muted-500 mt-1 text-xs">
                    {{ comment.text }}
                  </p>
                  <div class="mt-1 flex items-center justify-end gap-1">
                    <Icon name="ph:heart-duotone" class="size-3 text-rose-500" />
                    <span class="text-muted-400 text-xs">{{ comment.likes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty space placeholder for consistent card height when no comments -->
            <div v-else class="mb-4 grow" />

            <div class="mt-auto flex items-center justify-between ">
              <!-- Author -->
              <div class="flex items-center gap-2">
                <img
                  :src="video.author.avatar"
                  :alt="video.author.name"
                  class="size-8 rounded-full"
                >
                <span class="text-muted-400 text-sm">{{ video.author.name }}</span>
              </div>

              <!-- Meta -->
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1">
                  <Icon name="ph:eye-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-400 text-xs">{{ video.views }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="ph:heart-duotone" class="size-4 text-rose-500" />
                  <span class="text-muted-400 text-xs">{{ video.likes }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <button
                  class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 rounded-full border p-1.5 transition-colors"
                  @click="shareVideo(video.id)"
                >
                  <Icon name="ph:share-network-duotone" class="text-muted-400 size-4" />
                </button>
                <button
                  class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 rounded-full border p-1.5 transition-colors"
                  @click="downloadVideo(video.id)"
                >
                  <Icon name="ph:download-simple-duotone" class="text-muted-400 size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Playlist Modal -->
  <div
    v-if="showPlaylistModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div class="dark:bg-muted-800 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold">
          افزودن به پلی‌لیست
        </h3>
        <button @click="showPlaylistModal = false">
          <Icon name="ph:x-duotone" class="text-muted-400 size-5" />
        </button>
      </div>

      <div class="space-y-3">
        <button
          v-for="playlist in playlists"
          :key="playlist.id"
          class="dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 bg-muted-50 flex w-full items-center justify-between rounded-lg p-3 transition-colors"
        >
          <div class="flex items-center gap-3">
            <Icon name="ph:playlist-duotone" class="text-primary-500 size-5" />
            <span>{{ playlist.name }}</span>
          </div>
          <span class="text-muted-400 text-sm">{{ playlist.count }} ویدیو</span>
        </button>
      </div>

      <div class="mt-4 flex justify-end gap-3">
        <button
          class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 rounded-lg border px-4 py-2 text-sm transition-colors dark:text-white"
          @click="showPlaylistModal = false"
        >
          انصراف
        </button>
        <button
          class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-sm text-white transition-colors"
          @click="showPlaylistModal = false"
        >
          افزودن
        </button>
      </div>
    </div>
  </div>

  <!-- Share Modal -->
  <div
    v-if="showShareModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <div class="dark:bg-muted-800 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold">
          اشتراک‌گذاری ویدیو
        </h3>
        <button @click="showShareModal = false">
          <Icon name="ph:x-duotone" class="text-muted-400 size-5" />
        </button>
      </div>

      <div v-if="selectedVideoForShare" class="mb-4 flex items-center gap-3">
        <img
          :src="videos.find(v => v.id === selectedVideoForShare)?.cover"
          :alt="videos.find(v => v.id === selectedVideoForShare)?.title"
          class="aspect-video w-20 rounded-lg object-cover"
        >
        <div>
          <h4 class="text-muted-800 line-clamp-1 text-sm font-medium dark:text-white">
            {{ videos.find(v => v.id === selectedVideoForShare)?.title }}
          </h4>
          <p class="text-muted-400 text-xs">
            {{ videos.find(v => v.id === selectedVideoForShare)?.author.name }}
          </p>
        </div>
      </div>

      <div class="mb-4">
        <label class="text-muted-500 mb-1 block text-sm">لینک ویدیو</label>
        <div class="flex items-center gap-2">
          <input
            type="text"
            :value="`https://example.com/videos/${selectedVideoForShare}`"
            readonly
            class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-900 focus:ring-primary-500 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:text-white"
          >
          <button class="bg-primary-500 hover:bg-primary-600 rounded-lg px-3 py-2 text-sm text-white transition-colors">
            کپی
          </button>
        </div>
      </div>

      <div class="mb-6">
        <label class="text-muted-500 mb-1 block text-sm">اشتراک‌گذاری در</label>
        <div class="flex flex-wrap gap-3">
          <button class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors">
            <Icon name="ph:telegram-logo-duotone" class="size-5 text-blue-500" />
            <span>تلگرام</span>
          </button>
          <button class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors">
            <Icon name="ph:whatsapp-logo-duotone" class="size-5 text-green-500" />
            <span>واتساپ</span>
          </button>
          <button class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors">
            <Icon name="ph:instagram-logo-duotone" class="size-5 text-rose-500" />
            <span>اینستاگرام</span>
          </button>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-sm text-white transition-colors"
          @click="showShareModal = false"
        >
          بستن
        </button>
      </div>
    </div>
  </div>
</template>
