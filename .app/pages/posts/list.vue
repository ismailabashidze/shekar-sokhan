<script setup lang="ts">
definePageMeta({
  title: 'مطالب',
  preview: {
    title: 'مطالب',
    description: 'مطالب',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-jobs.png',
    srcDark: '/img/screens/dashboards-jobs-dark.png',
    order: 14,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// استفاده از کامپوزبل posts
const { 
  posts, 
  loading, 
  error, 
  totalPages, 
  totalItems,
  getPosts, 
  deletePost,
  searchPosts,
  getPostsByCategory,
  getUserPosts
} = usePosts()

// State for pagination and filtering
const currentPage = ref(1)
const postsPerPage = ref(9)

// Sample posts for backup - will be replaced by API data
const samplePosts = [
  {
    id: 1,
    title: 'چگونه خودآگاهی می‌تواند زندگی‌تان را تغییر دهد',
    description: 'کشف قدرت خودآگاهی برای بهبود زندگی و راهکارهای کاربردی برای تقویت آن.',
    image: '/img/illustrations/dashboards/writer/post-1.svg',
    category: 'روانشناسی',
    tags: ['خودآگاهی', 'رشد فردی', 'سلامت روان'],
    date: '۲ هفته پیش',
    readTime: '۵ دقیقه',
    likes: '245',
    views: '3.2K',
    author: {
      name: 'دکتر علی مرادی',
      role: 'روانشناس بالینی',
      avatar: '/img/avatars/6.svg',
    },
  },
  {
    id: 2,
    title: 'استرس را بکش، قبل از اینکه تو را بکشد',
    description: 'چرا باید استرس داشته باشیم، وقتی می توانیم شاد باشیم؟',
    image: '/img/illustrations/dashboards/writer/post-2.svg',
    category: 'سلامت روان',
    tags: ['استرس', 'آرامش', 'سلامت روان'],
    date: '۱ ماه پیش',
    readTime: '۷ دقیقه',
    likes: '189',
    views: '2.8K',
    author: {
      name: 'دکتر مرضیه یوسفی',
      role: 'روان درمانگر و عضو هیئت علمی دانشگاه',
      avatar: '/img/avatars/5.svg',
    },
  },
  {
    id: 3,
    title: 'تکنیک‌های مدیتیشن برای مبتدیان',
    description: 'راهنمای گام به گام برای شروع مدیتیشن و بهره‌مندی از فواید آن در زندگی روزمره.',
    image: '/img/illustrations/dashboards/writer/post-3.svg',
    category: 'مدیتیشن',
    tags: ['مدیتیشن', 'آرامش', 'تمرکز'],
    date: '۳ هفته پیش',
    readTime: '۶ دقیقه',
    likes: '215',
    views: '2.5K',
    author: {
      name: 'سارا محمدی',
      role: 'مربی یوگا و مدیتیشن',
      avatar: '/img/avatars/19.svg',
    },
  },
  {
    id: 4,
    title: 'یوگا برای سلامت ستون فقرات',
    description: 'حرکات و تمرینات یوگا برای تقویت و انعطاف‌پذیری ستون فقرات و کاهش دردهای کمر.',
    image: '/img/illustrations/dashboards/writer/post-4.svg',
    category: 'یوگا',
    tags: ['یوگا', 'ستون فقرات', 'سلامت جسمی'],
    date: '۱ هفته پیش',
    readTime: '۸ دقیقه',
    likes: '178',
    views: '1.9K',
    author: {
      name: 'رضا کریمی',
      role: 'مربی یوگا و متخصص حرکات اصلاحی',
      avatar: '/img/avatars/16.svg',
    },
  },
]

// Active filter
const activeFilter = ref('all')
const filters = [
  { value: 'all', label: 'همه' },
  { value: 'latest', label: 'جدیدترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'featured', label: 'ویژه' },
]

// Search query
const searchQuery = ref('')

// Categories
const selectedCategory = ref('all')
const categories = [
  { value: 'all', label: 'همه', icon: 'ph:circles-four-duotone' },
  { value: 'psychology', label: 'روانشناسی', icon: 'ph:brain-duotone' },
  { value: 'meditation', label: 'مدیتیشن', icon: 'ph:person-simple-duotone' },
  { value: 'yoga', label: 'یوگا', icon: 'ph:person-simple-walk-duotone' },
  { value: 'mental-health', label: 'سلامت روان', icon: 'ph:heartbeat-duotone' },
]

// Sorting options
const sortBy = ref('newest')
const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'oldest', label: 'قدیمی‌ترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'views', label: 'پربازدیدترین' },
]

// Search and filter functions
const performSearch = async () => {
  if (searchQuery.value.trim()) {
    await searchPosts(searchQuery.value, {
      page: currentPage.value,
      perPage: postsPerPage.value,
      sort: getSortValue(),
    })
  } else {
    await loadPosts()
  }
}

const filterByCategory = async (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
  
  if (category === 'all') {
    await loadPosts()
  } else {
    await getPostsByCategory(category, {
      page: currentPage.value,
      perPage: postsPerPage.value,
      sort: getSortValue(),
    })
  }
}

const getSortValue = () => {
  switch (sortBy.value) {
    case 'oldest':
      return '+created'
    case 'popular':
      return '-likeCount'
    case 'views':
      return '-viewCount'
    default: // newest
      return '-created'
  }
}

// Main load posts function
const loadPosts = async () => {
  try {
    await getPosts({
      page: currentPage.value,
      perPage: postsPerPage.value,
      sort: getSortValue(),
      filters: {
        status: 'published' // فقط مقالات منتشر شده
      }
    })
  } catch (err) {
    console.error('Error loading posts:', err)
  }
}

// Watch for changes in sort and search
watch(sortBy, () => {
  if (searchQuery.value.trim()) {
    performSearch()
  } else if (selectedCategory.value !== 'all') {
    filterByCategory(selectedCategory.value)
  } else {
    loadPosts()
  }
})

// Simple debounce function
let searchTimeout: NodeJS.Timeout | null = null

watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 500)
})

// Pagination
const changePage = (page: number) => {
  currentPage.value = page
  if (searchQuery.value.trim()) {
    performSearch()
  } else if (selectedCategory.value !== 'all') {
    filterByCategory(selectedCategory.value)
  } else {
    loadPosts()
  }
}

// Delete post function
const handleDeletePost = async (postId: string) => {
  if (confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
    try {
      await deletePost(postId)
      await loadPosts() // Reload after delete
    } catch (err) {
      console.error('Error deleting post:', err)
    }
  }
}

// Format functions for display
const formatViewCount = (count: number | string): string => {
  const num = typeof count === 'string' ? parseInt(count) : count
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'امروز'
  if (diffInDays === 1) return 'دیروز'
  if (diffInDays < 7) return `${diffInDays} روز پیش`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} هفته پیش`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ماه پیش`
  return `${Math.floor(diffInDays / 365)} سال پیش`
}

// Load posts on mount
onMounted(() => {
  loadPosts()
})

// Computed properties for display
const displayPosts = computed(() => {
  return posts.value.length > 0 ? posts.value : samplePosts
})

// View mode (grid or list)
const viewMode = ref('grid')
</script>

<template>
  <div>
    <BasePageHeading
      title="مقالات"
      subtitle="مجموعه مقالات آموزشی در حوزه سلامت روان، مدیتیشن و یوگا"
    >
      <template #pageTitle>
        <div class="flex items-center">
          <Icon name="ph:article-duotone" class="text-primary-500 me-2 size-6" />
          <span>مقالات</span>
        </div>
      </template>
    </BasePageHeading>

    <div class="pb-20">
      <BaseCard class="p-5">
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
                مقالات آموزشی
              </h1>
            </div>
            <div class="flex items-center gap-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="جستجو در مقالات..."
                  class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-900 focus:ring-primary-500 w-64 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-1 dark:text-white"
                >
                <Icon name="ph:magnifying-glass-duotone" class="text-muted-400 absolute left-3 top-2.5 size-5" />
              </div>

              <!-- View Mode Toggle -->
              <div class="ml-4 flex items-center gap-2">
                <button
                  :class="[
                    'rounded-lg p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-primary-500/10 text-primary-500' : 'text-muted-400 hover:text-primary-500'
                  ]"
                  @click="viewMode = 'grid'"
                >
                  <Icon name="ph:grid-four-duotone" class="size-5" />
                </button>
                <button
                  :class="[
                    'rounded-lg p-2 transition-colors',
                    viewMode === 'list' ? 'bg-primary-500/10 text-primary-500' : 'text-muted-400 hover:text-primary-500'
                  ]"
                  @click="viewMode = 'list'"
                >
                  <Icon name="ph:list-bullets-duotone" class="size-5" />
                </button>
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
                @click="filterByCategory(category.value)"
              >
                <Icon :name="category.icon" class="size-4" />
                {{ category.label }}
              </button>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <!-- Sorting -->
            <div class="flex items-center gap-2">
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

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center py-12">
            <BasePlaceload class="size-12" />
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="py-12 text-center">
            <div class="text-muted-400 mb-4">
              <Icon name="ph:warning-duotone" class="mx-auto size-16" />
            </div>
            <h3 class="text-muted-800 dark:text-muted-200 mb-2 text-lg font-semibold">
              خطا در بارگیری مقالات
            </h3>
            <p class="text-muted-500 mb-4">{{ error }}</p>
            <BaseButton
              color="primary"
              variant="pastel"
              @click="loadPosts"
            >
              تلاش مجدد
            </BaseButton>
          </div>

          <!-- Posts Grid/List -->
          <div
            v-else
            :class="[
              viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-6'
            ]"
          >
            <!-- Empty State -->
            <div v-if="displayPosts.length === 0" class="col-span-full py-12 text-center">
              <div class="text-muted-400 mb-4">
                <Icon name="ph:article-duotone" class="mx-auto size-16" />
              </div>
              <h3 class="text-muted-800 dark:text-muted-200 mb-2 text-lg font-semibold">
                هیچ مقاله‌ای یافت نشد
              </h3>
              <p class="text-muted-500 mb-4">مقاله‌ای با معیارهای جستجوی شما پیدا نشد.</p>
              <BaseButton
                color="primary"
                variant="pastel"
                @click="searchQuery = ''; selectedCategory = 'all'; loadPosts()"
              >
                مشاهده همه مقالات
              </BaseButton>
            </div>

            <div
              v-for="post in displayPosts"
              :key="post.id"
              :class="[
                'dark:bg-muted-800 group relative overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1',
                viewMode === 'grid' ? 'rounded-xl' : 'flex gap-4 rounded-lg'
              ]"
            >
              <!-- Thumbnail Section -->
              <div
                :class="[
                  'bg-muted-200 dark:bg-muted-700 relative overflow-hidden',
                  viewMode === 'grid' ? 'aspect-video' : 'aspect-[16/9] w-1/3'
                ]"
              >
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <NuxtLink
                  :to="`/posts/${post.id}`"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <div class="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon name="ph:article-duotone" class="size-6 text-white" />
                  </div>
                </NuxtLink>

                <div class="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 backdrop-blur-sm">
                  <span class="text-xs text-white">{{ post.readTime || '5' }} دقیقه</span>
                </div>
              </div>

              <!-- Content Section -->
              <div
                :class="[
                  'flex flex-col justify-between p-4',
                  viewMode === 'grid' ? '' : 'flex-1'
                ]"
              >
                <NuxtLink :to="`/posts/${post.id}`">
                  <h3 class="text-muted-800 mb-2 line-clamp-1 text-lg font-bold dark:text-white">
                    {{ post.title }}
                  </h3>
                </NuxtLink>

                <p class="text-muted-500 mb-4 line-clamp-2 text-sm">
                  {{ post.description }}
                </p>

                <!-- Tags -->
                <div class="mb-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags"
                    :key="tag"
                    class="bg-muted-100 dark:bg-muted-700 text-muted-500 dark:text-muted-300 rounded-full px-2 py-1 text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>

                <div class="mt-auto flex items-center justify-between">
                  <!-- Author -->
                  <div class="flex items-center gap-2">
                    <img
                      :src="post.author?.avatar || post.author?.meta?.avatarUrl || '/img/avatars/placeholder.svg'"
                      :alt="post.author?.name || post.author?.meta?.name || 'نویسنده'"
                      class="size-8 rounded-full"
                    >
                    <div>
                      <h4 class="text-muted-800 text-sm font-medium dark:text-white">
                        {{ post.author?.name || post.author?.meta?.name || 'نویسنده' }}
                      </h4>
                      <p class="text-muted-400 text-xs">
                        {{ formatDate(post.created || post.publishDate) }}
                      </p>
                    </div>
                  </div>

                  <!-- Stats and Actions -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1">
                        <Icon name="ph:eye-duotone" class="text-muted-400 size-4" />
                        <span class="text-muted-400 text-xs">{{ formatViewCount(post.viewCount || post.views || 0) }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <Icon name="ph:heart-duotone" class="size-4 text-rose-500" />
                        <span class="text-muted-400 text-xs">{{ post.likeCount || post.likes || 0 }}</span>
                      </div>
                    </div>

                    <!-- Action Buttons (only show for actual posts from API) -->
                    <div v-if="post.id && typeof post.id === 'string'" class="flex items-center gap-1">
                      <NuxtLink
                        :to="`/posts/edit?id=${post.id}`"
                        class="flex size-7 items-center justify-center rounded-full bg-primary-500/10 text-primary-500 transition-colors hover:bg-primary-500/20"
                      >
                        <Icon name="ph:pencil" class="size-3" />
                      </NuxtLink>
                      <button
                        class="flex size-7 items-center justify-center rounded-full bg-danger-500/10 text-danger-500 transition-colors hover:bg-danger-500/20"
                        @click="handleDeletePost(post.id)"
                      >
                        <Icon name="ph:trash" class="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center">
              <div class="flex items-center gap-2">
                <BaseButton
                  :disabled="currentPage === 1"
                  color="muted"
                  variant="pastel"
                  size="sm"
                  @click="changePage(currentPage - 1)"
                >
                  <Icon name="ph:arrow-right" class="size-4" />
                  قبلی
                </BaseButton>

                <div class="flex items-center gap-1">
                  <BaseButton
                    v-for="page in Math.min(totalPages, 7)"
                    :key="page"
                    :color="currentPage === page ? 'primary' : 'muted'"
                    :variant="currentPage === page ? 'solid' : 'pastel'"
                    size="sm"
                    class="min-w-[2rem]"
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </BaseButton>
                </div>

                <BaseButton
                  :disabled="currentPage === totalPages"
                  color="muted"
                  variant="pastel"
                  size="sm"
                  @click="changePage(currentPage + 1)"
                >
                  بعدی
                  <Icon name="ph:arrow-left" class="size-4" />
                </BaseButton>
              </div>
            </div>

            <!-- Create Post Button (Floating Action Button) -->
            <NuxtLink
              to="/posts/create"
              class="fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-primary-600"
            >
              <Icon name="ph:plus-bold" class="size-6" />
            </NuxtLink>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
