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
const postId = Number(route.params.id)

// Sample posts data
const posts = [
  {
    id: 1,
    title: 'چگونه خودآگاهی می‌تواند زندگی‌تان را تغییر دهد',
    description: 'کشف قدرت خودآگاهی برای بهبود زندگی و راهکارهای کاربردی برای تقویت آن.',
    content: `
      <p>خودآگاهی یکی از مهم‌ترین مهارت‌هایی است که می‌تواند زندگی شما را متحول کند. در این مقاله، به بررسی مفهوم خودآگاهی، فواید آن و راهکارهایی برای تقویت این مهارت می‌پردازیم.</p>
      
      <h2>خودآگاهی چیست؟</h2>
      <p>خودآگاهی به معنای شناخت عمیق از خود، شامل احساسات، افکار، باورها، ارزش‌ها و انگیزه‌های درونی است. این مهارت به ما کمک می‌کند تا بتوانیم رفتارهای خود را بهتر درک کنیم و در نتیجه، کنترل بیشتری بر زندگی خود داشته باشیم.</p>
      
      <h2>فواید خودآگاهی</h2>
      <ul>
        <li>بهبود روابط بین فردی</li>
        <li>افزایش اعتماد به نفس</li>
        <li>تصمیم‌گیری بهتر</li>
        <li>مدیریت استرس و اضطراب</li>
        <li>رشد شخصی و حرفه‌ای</li>
      </ul>
      
      <h2>راهکارهایی برای تقویت خودآگاهی</h2>
      <p>تمرین مدیتیشن و ذهن‌آگاهی، نوشتن خاطرات روزانه، دریافت بازخورد از دیگران، و خودارزیابی منظم از جمله راهکارهایی هستند که می‌توانند به تقویت خودآگاهی کمک کنند.</p>
    `,
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
      bio: 'دکتر علی مرادی، روانشناس بالینی با بیش از ۱۵ سال تجربه در زمینه روانشناسی مثبت‌نگر و رشد فردی. نویسنده چندین کتاب پرفروش در زمینه خودآگاهی و هوش هیجانی.',
    },
    comments: [
      {
        id: 1,
        user: 'سارا احمدی',
        avatar: '/img/avatars/10.svg',
        text: 'مقاله بسیار مفیدی بود. من از تکنیک‌های خودآگاهی که معرفی کردید استفاده کردم و واقعاً تأثیر مثبتی در زندگی‌ام داشته است.',
        date: '۳ روز پیش',
        likes: 15,
      },
      {
        id: 2,
        user: 'محمد کریمی',
        avatar: '/img/avatars/11.svg',
        text: 'ممنون از اشتراک‌گذاری این اطلاعات ارزشمند. آیا کتاب خاصی در این زمینه پیشنهاد می‌کنید؟',
        date: '۱ هفته پیش',
        likes: 8,
      },
    ],
  },
  {
    id: 2,
    title: 'استرس را بکش، قبل از اینکه تو را بکشد',
    description: 'چرا باید استرس داشته باشیم، وقتی می توانیم شاد باشیم؟',
    content: `
      <p>استرس یکی از بزرگترین چالش‌های زندگی مدرن است. در این مقاله، به بررسی منابع استرس، تأثیرات آن بر سلامت جسمی و روانی، و راهکارهایی برای مدیریت استرس می‌پردازیم.</p>
      
      <h2>استرس چیست؟</h2>
      <p>استرس پاسخ طبیعی بدن به فشارها و تهدیدهای محیطی است. اما وقتی این پاسخ به صورت مزمن ادامه پیدا کند، می‌تواند تأثیرات مخربی بر سلامت ما داشته باشد.</p>
      
      <h2>تأثیرات استرس بر سلامت</h2>
      <ul>
        <li>افزایش فشار خون</li>
        <li>ضعف سیستم ایمنی</li>
        <li>اختلالات خواب</li>
        <li>افسردگی و اضطراب</li>
        <li>مشکلات گوارشی</li>
      </ul>
      
      <h2>راهکارهایی برای مدیریت استرس</h2>
      <p>تمرینات تنفسی، مدیتیشن، فعالیت بدنی منظم، خواب کافی، و تغذیه سالم از جمله راهکارهایی هستند که می‌توانند به کاهش استرس کمک کنند.</p>
    `,
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
      bio: 'دکتر مرضیه یوسفی، روان درمانگر با تخصص در درمان اختلالات اضطرابی و استرس. عضو هیئت علمی دانشگاه و نویسنده چندین مقاله علمی در زمینه مدیریت استرس و سلامت روان.',
    },
    comments: [
      {
        id: 1,
        user: 'رضا محمدی',
        avatar: '/img/avatars/12.svg',
        text: 'واقعاً ممنون از این مقاله کاربردی. من تکنیک‌های تنفسی رو شروع کردم و خیلی کمکم کرده.',
        date: '۲ هفته پیش',
        likes: 12,
      },
    ],
  },
]

// Find the current post
const post = computed(() => posts.find(p => p.id === postId) || posts[0])

// Related posts (excluding current post)
const relatedPosts = computed(() =>
  posts.filter(p => p.id !== postId && p.category === post.value.category).slice(0, 2),
)

// Comment form
const newComment = ref('')
const submitComment = () => {
  if (!newComment.value.trim()) return

  // In a real app, this would send the comment to an API
  alert('نظر شما با موفقیت ثبت شد')
  newComment.value = ''
}

// Like post
const likePost = () => {
  // In a real app, this would update the like count via an API
  post.value.likes = (parseInt(post.value.likes) + 1).toString()
}
</script>

<template>
  <div>
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
            <div class="flex items-center gap-2">
              <img
                :src="post.author.avatar"
                :alt="post.author.name"
                class="size-10 rounded-full"
              >
              <div>
                <h4 class="text-muted-800 text-sm font-medium dark:text-white">
                  {{ post.author.name }}
                </h4>
                <p class="text-muted-400 text-xs">
                  {{ post.author.role }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <Icon name="ph:clock-duotone" class="text-muted-400 size-4" />
                <span class="text-muted-400 text-xs">{{ post.date }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="ph:book-open-duotone" class="text-muted-400 size-4" />
                <span class="text-muted-400 text-xs">{{ post.readTime }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="ph:eye-duotone" class="text-muted-400 size-4" />
                <span class="text-muted-400 text-xs">{{ post.views }}</span>
              </div>
            </div>
          </div>

          <!-- Featured Image -->
          <img
            :src="post.image"
            :alt="post.title"
            class="mb-6 w-full rounded-xl object-cover"
            style="max-height: 400px;"
          >

          <!-- Tags -->
          <div class="mb-6 flex flex-wrap gap-2">
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
          <div class="prose prose-lg dark:prose-invert max-w-none" v-html="post.content" />
        </div>

        <!-- Post Actions -->
        <div class="border-muted-200 dark:border-muted-700 mb-10 flex items-center justify-between border-y py-4">
          <div class="flex items-center gap-4">
            <button
              class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors hover:bg-rose-500/10 hover:text-rose-500"
              @click="likePost"
            >
              <Icon name="ph:heart-duotone" class="size-5 text-rose-500" />
              <span>{{ post.likes }} پسندیدن</span>
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
        <div class="dark:bg-muted-800 bg-muted-50 mb-10 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <img
              :src="post.author.avatar"
              :alt="post.author.name"
              class="size-16 rounded-full"
            >
            <div>
              <h3 class="text-muted-800 mb-2 text-lg font-bold dark:text-white">
                {{ post.author.name }}
              </h3>
              <p class="text-muted-500 mb-4 text-sm">
                {{ post.author.bio }}
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
        <div class="mb-10">
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
                  :src="relatedPost.image"
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
                  <span class="text-xs text-white">{{ relatedPost.readTime }}</span>
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
                      :src="relatedPost.author.avatar"
                      :alt="relatedPost.author.name"
                      class="size-8 rounded-full"
                    >
                    <span class="text-muted-400 text-xs">{{ relatedPost.author.name }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <Icon name="ph:heart-duotone" class="size-4 text-rose-500" />
                    <span class="text-muted-400 text-xs">{{ relatedPost.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div>
          <h3 class="text-muted-800 mb-6 text-xl font-bold dark:text-white">
            نظرات ({{ post.comments?.length || 0 }})
          </h3>

          <!-- Comment List -->
          <div class="mb-6 space-y-4">
            <div
              v-for="comment in post.comments"
              :key="comment.id"
              class="dark:bg-muted-800 bg-muted-50 rounded-xl p-4"
            >
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img
                    :src="comment.avatar"
                    :alt="comment.user"
                    class="size-8 rounded-full"
                  >
                  <div>
                    <h4 class="text-muted-800 text-sm font-medium dark:text-white">
                      {{ comment.user }}
                    </h4>
                    <p class="text-muted-400 text-xs">
                      {{ comment.date }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-1">
                  <Icon name="ph:heart-duotone" class="size-4 text-rose-500" />
                  <span class="text-muted-400 text-xs">{{ comment.likes }}</span>
                </div>
              </div>

              <p class="text-muted-500 text-sm">
                {{ comment.text }}
              </p>
            </div>
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
                class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-sm text-white transition-colors"
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
</template>
