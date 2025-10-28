<script setup lang="ts">
import { useRouter } from 'vue-router';
import AddonMarkdownRemark from '~/components/AddonMarkdownRemark.vue';
import { ref, onMounted, computed } from 'vue';

const router = useRouter();
const previewData = ref<any>({});

onMounted(() => {
  const raw = localStorage.getItem('postPreview');
  if (raw) {
    try {
      previewData.value = JSON.parse(raw);
    }
    catch (e) {
      console.error('Error parsing preview data from localStorage:', e);
      previewData.value = {};
    }
  }
});

const title = computed(() => previewData.value.title || 'بدون عنوان');
const description = computed(() => previewData.value.description || '');
const contentLong = computed(() => previewData.value.contentLong || 'محتوایی برای نمایش وجود ندارد.');
const excerpt = computed(() => previewData.value.excerpt || '');
const slug = computed(() => previewData.value.slug || '');
const category = computed(() => previewData.value.category || '');
const tags = computed(() => previewData.value.tags || []);
const publishDate = computed(() => previewData.value.publishDate || 'تاریخ نامشخص');
const readTime = computed(() => previewData.value.readTime || 'نامشخص');
const isFeatured = computed(() => previewData.value.isFeatured === true || String(previewData.value.isFeatured).toLowerCase() === 'true');
const allowComments = computed(() => previewData.value.allowComments === true || String(previewData.value.allowComments).toLowerCase() === 'true');
const secretMessage = computed(() => previewData.value.secretMessage || '');
const imageUrl = computed(() => previewData.value.imageUrl || '');

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
  };
  return icons[category.value] || 'ph:question-duotone';
});

function goBack() {
  router.back();
}
</script>

<template>
  <div class="container mx-auto max-w-3xl py-10 font-sans">
    <BaseCard class="overflow-hidden shadow-xl dark:shadow-gray-800/50">
      <!-- Image Section -->
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="تصویر مقاله"
        class="mb-0 block h-auto max-h-[400px] w-full object-cover"
      >

      <div class="p-6 md:p-8">
        <!-- Header: Category, Title, Excerpt -->
        <div class="mb-6">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span v-if="category" class="bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium">
              <Icon :name="categoryIcon" class="me-2 size-4" />{{ category }}
            </span>
            <span v-if="isFeatured" class="inline-flex items-center rounded-full bg-yellow-100 px-3.5 py-1.5 text-sm font-medium text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
              <Icon name="ph:star-fill" class="me-2 size-4 text-yellow-500 dark:text-yellow-400" />مقاله ویژه
            </span>
          </div>
          <h1 class="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white lg:text-4xl">
            {{ title }}
          </h1>
          <p v-if="excerpt" class="mb-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {{ excerpt }}
          </p>
          <p v-if="description && description !== excerpt" class="text-md leading-relaxed text-gray-500 dark:text-gray-300">
            {{ description }}
          </p>
        </div>

        <!-- Meta Info: Date, Read Time, Tags -->
        <div class="my-8 border-y border-gray-200 py-4 dark:border-gray-700">
          <div class="flex flex-col flex-wrap items-start gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center">
            <span class="flex items-center"><Icon name="ph:calendar-blank-duotone" class="me-1.5 size-5" />تاریخ انتشار: {{ publishDate }}</span>
            <span class="flex items-center"><Icon name="ph:clock-duotone" class="me-1.5 size-5" />زمان مطالعه: {{ readTime }} دقیقه</span>
            <div v-if="tags && tags.length" class="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <Icon name="ph:tag" class="me-1 size-5" />
              <span
                v-for="tag in tags"
                :key="tag"
                class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
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
        <div v-if="secretMessage" class="mt-10 rounded-xl border-2 border-dashed border-purple-400 bg-purple-50 p-6 text-center dark:border-purple-600 dark:bg-purple-900/40">
          <Icon name="ph:keyhole-duotone" class="mx-auto mb-3 size-10 text-purple-500 dark:text-purple-400" />
          <p class="mb-1 text-xl font-semibold text-purple-700 dark:text-purple-300">
            {{ secretMessage }}
          </p>
          <p class="text-sm text-purple-500 dark:text-purple-400">
            پیام مخفی نویسنده!
          </p>
        </div>

        <!-- Comments Status -->
        <div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
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
        <div class="mt-12 flex justify-start">
          <BaseButton
            flavor="outline"
            color="muted"
            size="lg"
            class="rounded-lg"
            @click="goBack"
          >
            <Icon name="ph:arrow-elbow-left-down-duotone" class="me-2 size-5" />بازگشت به ویرایشگر
          </BaseButton>
        </div>
      </div>
    </BaseCard>
    <div class="mt-8" /> <!-- Spacer at the bottom -->
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
