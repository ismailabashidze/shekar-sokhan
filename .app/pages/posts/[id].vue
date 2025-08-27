<script setup lang="ts">
definePageMeta({
  title: 'مقاله',
  preview: {
    title: 'مقاله',
    description: 'مقاله',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-jobs.png',
    srcDark: '/img/screens/dashboards-jobs-dark.png',
    order: 14,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const toaster = useToaster()

// استفاده از کامپوزبل posts
const {
  currentPost,
  loading,
  error,
  getPost,
  getPostsByCategory,
  incrementViewCount,
  toggleLike,
} = usePosts()

const { getUserAvatarUrl } = useAvatarManager()

const postId = route.params.id as string

// State for related posts and comments
const relatedPosts = ref<any[]>([])
const comments = ref<any[]>([])

// Load post and related data
const loadPost = async () => {
  try {
    console.log('Loading post with ID:', postId)
    console.log('PocketBase instance:', useNuxtApp().$pb)
    console.log('Auth store valid:', useNuxtApp().$pb.authStore.isValid)
    console.log('Current user:', useNuxtApp().$pb.authStore.model)

    await getPost(postId)
    console.log('Post loaded:', currentPost.value)

    if (currentPost.value) {
      // Increment view count
      await incrementViewCount(postId)

      // Load related posts from same category
      if (currentPost.value.category) {
        const relatedData = await getPostsByCategory(currentPost.value.category, {
          page: 1,
          perPage: 3,
          filters: { status: 'published' },
        })
        // Exclude current post from related posts
        relatedPosts.value = relatedData.items?.filter(p => p.id !== postId).slice(0, 2) || []
      }
    }
  }
  catch (err: any) {
    console.error('Error loading post:', err)
    console.error('Error details:', {
      message: err.message,
      status: err.status,
      response: err.response,
      data: err.data,
    })
    if (err?.message?.includes('404') || err?.message?.includes('not found')) {
      // Post not found, redirect to 404 or posts list
      router.push('/posts/list')
    }
  }
}

// Format functions
const formatDate = (dateString: string): string => {
  if (!dateString) return ''

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

const formatViewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Computed properties for display
const post = computed(() => currentPost.value)

const displayAuthor = computed(() => {
  if (!post.value?.author) return null

  // Handle both expanded and non-expanded author data
  if (typeof post.value.author === 'string') {
    return {
      name: 'نویسنده',
      role: 'نویسنده مقاله',
      avatar: '/img/avatars/1.png',
      bio: 'نویسنده محترم این مقاله',
    }
  }

  return {
    name: (post.value.author as any)?.name || (post.value.author as any)?.meta?.name || 'نویسنده',
    role: 'نویسنده مقاله',
    avatar: getUserAvatarUrl(post.value.author as any) || '/img/avatars/1.png',
    bio: (post.value.author as any)?.bio || 'نویسنده محترم این مقاله',
  }
})

// Load data on mount
onMounted(() => {
  loadPost()
})

// Comment form
const newComment = ref('')
const submitComment = () => {
  if (!newComment.value.trim()) return

  // TODO: Implement comment API
  toaster.show({
    title: 'ویژگی نظرات',
    message: 'قابلیت نظردهی به زودی فعال خواهد شد',
    color: 'info',
    icon: 'ph:info',
    closable: true,
  })
  newComment.value = ''
}

// Like post
const likePost = async () => {
  if (!post.value?.id) return

  try {
    await toggleLike(post.value.id)
    toaster.show({
      title: 'پسندیدن',
      message: 'مقاله پسندیده شد',
      color: 'success',
      icon: 'ph:heart',
      closable: true,
    })
  }
  catch (err) {
    console.error('Error liking post:', err)
  }
}

// SEO Meta
watchEffect(() => {
  if (post.value) {
    useHead({
      title: post.value.title,
      meta: [
        { name: 'description', content: post.value.description || post.value.excerpt },
        { property: 'og:title', content: post.value.title },
        { property: 'og:description', content: post.value.description || post.value.excerpt },
        { property: 'og:image', content: typeof post.value.featuredImage === 'string' ? post.value.featuredImage : '/img/og-default.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'keywords', content: post.value.tags?.join(', ') || '' },
      ],
    })
  }
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <BasePlaceload class="size-16" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-20 text-center">
      <div class="text-muted-400 mb-4">
        <Icon name="ph:warning-duotone" class="mx-auto size-16" />
      </div>
      <h3 class="text-muted-800 dark:text-muted-200 mb-2 text-lg font-semibold">
        خطا در بارگیری مقاله
      </h3>
      <p class="text-muted-500 mb-4">
        {{ error }}
      </p>
      <div class="flex justify-center gap-3">
        <BaseButton
          color="primary"
          variant="pastel"
          @click="loadPost"
        >
          تلاش مجدد
        </BaseButton>
        <BaseButton
          color="muted"
          variant="pastel"
          @click="router.push('/posts/list')"
        >
          بازگشت به لیست
        </BaseButton>
      </div>
    </div>

    <!-- Post Content -->
    <div v-else-if="post">
      <BasePageHeading
        :title="post.title"
        :subtitle="post.description"
      >
        <template #pageTitle>
          <div class="flex items-center">
            <Icon name="ph:article-duotone" class="text-primary-500 me-2 size-6" />
            <span>مقاله</span>
          </div>
        </template>
      </BasePageHeading>

      <div class="pb-20">
        <BaseCard class="p-5">
          <!-- Back Button -->
          <div class="mb-6">
            <NuxtLink
              to="/posts/list"
              class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors"
            >
              <Icon name="ph:arrow-right-duotone" class="text-muted-500 size-4" />
              <span class="text-muted-500">بازگشت به مقالات</span>
            </NuxtLink>
          </div>

          <!-- Post Header -->
          <div class="mb-8">
            <h1 class="text-muted-800 mb-4 text-3xl font-bold dark:text-white">
              {{ post.title }}
            </h1>

            <div class="mb-6 flex flex-wrap items-center gap-4">
              <div v-if="displayAuthor" class="flex items-center gap-2">
                <img
                  :src="displayAuthor.avatar"
                  :alt="displayAuthor.name"
                  class="size-10 rounded-full"
                >
                <div>
                  <h4 class="text-muted-800 text-sm font-medium dark:text-white">
                    {{ displayAuthor.name }}
                  </h4>
                  <p class="text-muted-400 text-xs">
                    {{ displayAuthor.role }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1">
                  <Icon name="ph:clock-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-400 text-xs">{{ formatDate(post.created || post.publishDate) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="ph:book-open-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-400 text-xs">{{ post.readTime || 5 }} دقیقه</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="ph:eye-duotone" class="text-muted-400 size-4" />
                  <span class="text-muted-400 text-xs">{{ formatViewCount(post.viewCount || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Featured Image -->
            <img
              v-if="post.featuredImage"
              :src="post.featuredImage"
              :alt="post.title"
              class="mb-6 w-full rounded-xl object-cover"
              style="max-height: 400px;"
            >

            <!-- Tags -->
            <div v-if="post.tags && post.tags.length > 0" class="mb-6 flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="bg-muted-100 dark:bg-muted-700 text-muted-500 dark:text-muted-300 rounded-full px-3 py-1 text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Post Content -->
          <div class="mb-10">
            <AddonMarkdownRemark
              v-if="post.contentLong"
              :source="post.contentLong"
              class="prose prose-lg dark:prose-invert markdown-content max-w-none"
            />
            <div v-else class="text-muted-500 py-8 text-center">
              محتوای مقاله در دسترس نیست
            </div>
          </div>

          <!-- Post Actions -->
          <div class="border-muted-200 dark:border-muted-700 mb-10 flex items-center justify-between border-y py-4">
            <div class="flex items-center gap-4">
              <button
                class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                @click="likePost"
              >
                <Icon name="ph:heart-duotone" class="size-5 text-rose-500" />
                <span>{{ post.likeCount || 0 }} پسندیدن</span>
              </button>

              <button class="hover:bg-primary-500/10 hover:text-primary-500 flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors">
                <Icon name="ph:share-network-duotone" class="text-muted-400 size-5" />
                <span>اشتراک‌گذاری</span>
              </button>
            </div>

            <button class="hover:bg-primary-500/10 hover:text-primary-500 flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors">
              <Icon name="ph:bookmark-simple-duotone" class="text-muted-400 size-5" />
              <span>ذخیره</span>
            </button>
          </div>

          <!-- Author Bio -->
          <div v-if="displayAuthor" class="dark:bg-muted-800 bg-muted-50 mb-10 rounded-xl p-6">
            <div class="flex items-start gap-4">
              <img
                :src="displayAuthor.avatar"
                :alt="displayAuthor.name"
                class="size-16 rounded-full"
              >
              <div>
                <h3 class="text-muted-800 mb-2 text-lg font-bold dark:text-white">
                  {{ displayAuthor.name }}
                </h3>
                <p class="text-muted-500 mb-4 text-sm">
                  {{ displayAuthor.bio }}
                </p>
                <div class="flex gap-2">
                  <button class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-sm text-white transition-colors">
                    دنبال کردن
                  </button>
                  <button class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 rounded-lg border px-4 py-2 text-sm transition-colors">
                    مشاهده پروفایل
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Posts -->
          <div v-if="relatedPosts && relatedPosts.length > 0" class="mb-10">
            <h3 class="text-muted-800 mb-6 text-xl font-bold dark:text-white">
              مقالات مرتبط
            </h3>

            <div class="grid gap-6 sm:grid-cols-2">
              <div
                v-for="relatedPost in relatedPosts"
                :key="relatedPost.id"
                class="dark:bg-muted-800 group relative overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:-translate-y-1"
              >
                <div class="bg-muted-200 dark:bg-muted-700 relative aspect-video overflow-hidden">
                  <img
                    :src="relatedPost.featuredImage || '/img/placeholder.jpg'"
                    :alt="relatedPost.title"
                    class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <NuxtLink
                    :to="`/posts/${relatedPost.id}`"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <div class="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon name="ph:article-duotone" class="size-6 text-white" />
                    </div>
                  </NuxtLink>

                  <div class="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 backdrop-blur-sm">
                    <span class="text-xs text-white">{{ relatedPost.readTime || 5 }} دقیقه</span>
                  </div>
                </div>

                <div class="p-4">
                  <NuxtLink :to="`/posts/${relatedPost.id}`">
                    <h4 class="text-muted-800 mb-2 line-clamp-1 text-lg font-bold dark:text-white">
                      {{ relatedPost.title }}
                    </h4>
                  </NuxtLink>

                  <p class="text-muted-500 mb-4 line-clamp-2 text-sm">
                    {{ relatedPost.description }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img
                        :src="getUserAvatarUrl(relatedPost.author as any) || '/img/avatars/1.png'"
                        :alt="(relatedPost.author as any)?.name || 'نویسنده'"
                        class="size-8 rounded-full"
                      >
                      <span class="text-muted-400 text-xs">
                        {{ (relatedPost.author as any)?.name || (relatedPost.author as any)?.meta?.name || 'نویسنده' }}
                      </span>
                    </div>

                    <div class="flex items-center gap-2">
                      <Icon name="ph:heart-duotone" class="size-4 text-rose-500" />
                      <span class="text-muted-400 text-xs">{{ relatedPost.likeCount || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div>
            <h3 class="text-muted-800 mb-6 text-xl font-bold dark:text-white">
              نظرات ({{ comments.length }})
            </h3>

            <!-- Comment List -->
            <div v-if="comments.length > 0" class="mb-6 space-y-4">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="dark:bg-muted-800 bg-muted-50 rounded-xl p-4"
              >
                <div class="mb-2 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img
                      :src="comment.avatar || '/img/avatars/1.png'"
                      :alt="comment.user || 'کاربر'"
                      class="size-8 rounded-full"
                    >
                    <div>
                      <h4 class="text-muted-800 text-sm font-medium dark:text-white">
                        {{ comment.user || 'کاربر ناشناس' }}
                      </h4>
                      <p class="text-muted-400 text-xs">
                        {{ formatDate(comment.date || comment.created) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-1">
                    <Icon name="ph:heart-duotone" class="size-4 text-rose-500" />
                    <span class="text-muted-400 text-xs">{{ comment.likes || 0 }}</span>
                  </div>
                </div>

                <p class="text-muted-500 text-sm">
                  {{ comment.text || comment.content }}
                </p>
              </div>
            </div>

            <!-- Empty comments state -->
            <div v-else class="mb-6 py-8 text-center">
              <div class="text-muted-400 mb-2">
                <Icon name="ph:chat-circle-duotone" class="mx-auto size-12" />
              </div>
              <p class="text-muted-500 text-sm">
                هنوز نظری ثبت نشده است
              </p>
            </div>

            <!-- Comment Form -->
            <div class="dark:bg-muted-800 rounded-xl bg-white p-4 shadow-sm">
              <h4 class="text-muted-800 mb-4 text-lg font-medium dark:text-white">
                ارسال نظر
              </h4>

              <div class="mb-4">
                <textarea
                  v-model="newComment"
                  rows="4"
                  placeholder="نظر خود را بنویسید..."
                  class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-900 focus:ring-primary-500 w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-1 dark:text-white"
                />
              </div>

              <div class="flex justify-end">
                <button
                  class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!newComment.trim()"
                  @click="submitComment"
                >
                  ارسال نظر
                </button>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Markdown content styling */
.markdown-content {
  direction: rtl;
  text-align: right;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  text-align: right;
  margin-bottom: 1rem;
}

.markdown-content :deep(p) {
  text-align: right;
  margin-bottom: 1rem;
  line-height: 1.8;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  text-align: right;
  margin-bottom: 1rem;
  padding-right: 1.5rem;
  padding-left: 0;
}

.markdown-content :deep(blockquote) {
  border-right: 4px solid #e5e7eb;
  border-left: none;
  padding-right: 1rem;
  padding-left: 0;
  margin: 1rem 0;
  font-style: italic;
}

.markdown-content :deep(table) {
  direction: rtl;
  text-align: right;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  text-align: right;
}

.markdown-content :deep(code) {
  direction: ltr;
  text-align: left;
}

.markdown-content :deep(pre) {
  direction: ltr;
  text-align: left;
}

/* Dark mode adjustments */
.dark .markdown-content :deep(blockquote) {
  border-right-color: #374151;
}
</style>
