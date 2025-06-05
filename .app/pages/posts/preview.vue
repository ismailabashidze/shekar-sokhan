<script setup lang="ts">
import { useRouter } from 'vue-router'
import AddonMarkdownRemark from '~/components/AddonMarkdownRemark.vue'
import { ref, onMounted, computed } from 'vue'

const router = useRouter()
const previewData = ref<any>({})

onMounted(() => {
  const raw = localStorage.getItem('postPreview')
  if (raw) {
    try {
      previewData.value = JSON.parse(raw)
    } catch (e) {
      console.error('Error parsing preview data from localStorage:', e)
      previewData.value = {}
    }
  }
})

const title = computed(() => previewData.value.title || 'بدون عنوان')
const description = computed(() => previewData.value.description || '')
const contentLong = computed(() => previewData.value.contentLong || 'محتوایی برای نمایش وجود ندارد.')
const excerpt = computed(() => previewData.value.excerpt || '')
const slug = computed(() => previewData.value.slug || '')
const category = computed(() => previewData.value.category || '')
const tags = computed(() => previewData.value.tags || [])
const publishDate = computed(() => previewData.value.publishDate || 'تاریخ نامشخص')
const readTime = computed(() => previewData.value.readTime || 'نامشخص')
const isFeatured = computed(() => previewData.value.isFeatured === true || String(previewData.value.isFeatured).toLowerCase() === 'true')
const allowComments = computed(() => previewData.value.allowComments === true || String(previewData.value.allowComments).toLowerCase() === 'true')
const secretMessage = computed(() => previewData.value.secretMessage || '')
const imageUrl = computed(() => previewData.value.imageUrl || '')

const categoryIcon = computed(() => {
  const icons = {
    'همه': 'ph:circles-four-duotone',
    'روانشناسی': 'ph:brain-duotone',
    'مدیتیشن': 'ph:person-simple-run-duotone', // Changed for variety, consider ph:peace-duotone or ph:hands-praying-duotone
    'یوگا': 'ph:person-simple-walk-duotone', // Consider ph:yoga-duotone or ph:lotus-duotone
    'سلامت روان': 'ph:heartbeat-duotone',
    'خودیاری': 'ph:hand-heart-duotone',
    'انگیزشی': 'ph:star-duotone',
    'روابط': 'ph:users-three-duotone',
    'فرزندپروری': 'ph:baby-duotone',
    'مشاوره': 'ph:chats-circle-duotone',
    'مدیریت استرس': 'ph:activity-duotone',
    'اضطراب': 'ph:cloud-lightning-duotone',
    'افسردگی': 'ph:cloud-rain-duotone',
    'شادکامی': 'ph:smiley-duotone',
    'اعتیاد': 'ph:pill-duotone', // Changed from beer-bottle for neutrality
    'تروما و آسیب': 'ph:bandaids-duotone',
    'مسائل جنسی': 'ph:gender-intersex-duotone',
    'خواب و استراحت': 'ph:bed-duotone',
    'تغذیه و سبک زندگی': 'ph:leaf-duotone',
    'ذهن‌آگاهی': 'ph:eye-duotone',
  }
  return icons[category.value] || 'ph:question-duotone'
})

function goBack() {
  router.back()
}
</script>

<template>
  <div class="container mx-auto max-w-3xl py-10 font-sans">
    <BaseCard class="overflow-hidden shadow-xl dark:shadow-gray-800/50">
      <!-- Image Section -->
      <img v-if="imageUrl" :src="imageUrl" alt="تصویر مقاله" class="w-full h-auto max-h-[400px] object-cover mb-0 block" />

      <div class="p-6 md:p-8">
        <!-- Header: Category, Title, Excerpt -->
        <div class="mb-6">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span v-if="category" class="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-500/20 px-3.5 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-300">
              <Icon :name="categoryIcon" class="me-2 size-4" />{{ category }}
            </span>
            <span v-if="isFeatured" class="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-500/20 px-3.5 py-1.5 text-sm font-medium text-yellow-700 dark:text-yellow-300">
              <Icon name="ph:star-fill" class="me-2 size-4 text-yellow-500 dark:text-yellow-400" />مقاله ویژه
            </span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{{ title }}</h1>
          <p v-if="excerpt" class="text-lg text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{{ excerpt }}</p>
          <p v-if="description && description !== excerpt" class="text-md text-gray-500 dark:text-gray-300 leading-relaxed">{{ description }}</p>
        </div>

        <!-- Meta Info: Date, Read Time, Tags -->
        <div class="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-8">
          <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
            <span class="flex items-center"><Icon name="ph:calendar-blank-duotone" class="me-1.5 size-5" />تاریخ انتشار: {{ publishDate }}</span>
            <span class="flex items-center"><Icon name="ph:clock-duotone" class="me-1.5 size-5" />زمان مطالعه: {{ readTime }} دقیقه</span>
            <div v-if="tags && tags.length" class="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <Icon name="ph:tags-duotone" class="size-5 me-1" />
              <span v-for="tag in tags" :key="tag" class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-200">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="prose prose-lg dark:prose-invert rtl max-w-none leading-relaxed text-gray-800 dark:text-gray-200">
          <AddonMarkdownRemark :source="contentLong" />
        </div>

        <!-- Secret Message -->
        <div v-if="secretMessage" class="mt-10 rounded-xl border-2 border-dashed border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/40 p-6 text-center">
          <Icon name="ph:keyhole-duotone" class="text-purple-500 dark:text-purple-400 size-10 mx-auto mb-3" />
          <p class="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-1">{{ secretMessage }}</p>
          <p class="text-sm text-purple-500 dark:text-purple-400">پیام مخفی نویسنده!</p>
        </div>

        <!-- Comments Status -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div v-if="allowComments" class="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Icon name="ph:chats-circle-duotone" class="size-5" />
            <span>نظردهی برای این مقاله فعال است.</span>
          </div>
          <div v-else class="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400">
            <Icon name="ph:chat-circle-slash-duotone" class="size-5" />
            <span>نظردهی برای این مقاله غیرفعال است.</span>
          </div>
        </div>

        <!-- Back Button -->
        <div class="flex justify-start mt-12">
          <BaseButton flavor="outline" color="muted" @click="goBack" size="lg" class="rounded-lg">
            <Icon name="ph:arrow-elbow-left-down-duotone" class="me-2 size-5" />بازگشت به ویرایشگر
          </BaseButton>
        </div>
      </div>
    </BaseCard>
    <div class="mt-8"></div> <!-- Spacer at the bottom -->
  </div>
</template>

<style scoped>
.container {
  direction: rtl;
}
/* Additional global styles for prose if needed, or ensure Tailwind prose plugin is configured for RTL */
:deep(.prose) h1, :deep(.prose) h2, :deep(.prose) h3, :deep(.prose) h4, :deep(.prose) h5, :deep(.prose) h6 {
  font-family: inherit; /* Ensure headings use the same font as body or define specific RTL font */
}
</style>
