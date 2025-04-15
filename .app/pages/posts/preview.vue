<script setup lang="ts">
import { useRouter } from 'vue-router'
import AddonMarkdownRemark from '~/components/AddonMarkdownRemark.vue'
import { ref, onMounted, computed } from 'vue'

const router = useRouter()
const previewData = ref({})

onMounted(() => {
  const raw = localStorage.getItem('postPreview')
  if (raw) {
    try {
      previewData.value = JSON.parse(raw)
    } catch {
      previewData.value = {}
    }
  }
})

const title = computed(() => previewData.value.title || '')
const description = computed(() => previewData.value.description || '')
const contentLong = computed(() => previewData.value.contentLong || '')
const excerpt = computed(() => previewData.value.excerpt || '')
const slug = computed(() => previewData.value.slug || '')
const category = computed(() => previewData.value.category || '')
const tags = computed(() => previewData.value.tags || [])
const publishDate = computed(() => previewData.value.publishDate || '')
const readTime = computed(() => previewData.value.readTime || '')
const isFeatured = computed(() => previewData.value.isFeatured === true || previewData.value.isFeatured === 'true')
const allowComments = computed(() => previewData.value.allowComments === true || previewData.value.allowComments === 'true')

const categoryIcon = computed(() => {
  const icons = {
    'روانشناسی': 'ph:brain-duotone',
    'مدیتیشن': 'ph:person-simple-duotone',
    'یوگا': 'ph:person-simple-walk-duotone',
    'سلامت روان': 'ph:heartbeat-duotone',
    'همه': 'ph:circles-four-duotone',
  }
  return icons[category.value] || ''
})

function goBack() {
  router.back()
}
</script>

<template>
  <div class="container mx-auto max-w-3xl py-10">
    <BaseCard class="p-6">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1 space-y-2">
          <div class="flex items-center gap-2 mb-2">
            <span v-if="category" class="inline-flex items-center rounded-lg bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
              <Icon :name="categoryIcon" class="me-1 size-4" />{{ category }}
            </span>
            <span v-for="tag in tags" :key="tag" class="inline-flex items-center rounded-lg bg-muted-100 px-2 py-1 text-xs text-muted-700">
              <Icon name="ph:tag" class="me-1 size-3" />{{ tag }}
            </span>
            <span v-if="isFeatured" class="inline-flex items-center rounded-lg bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
              <Icon name="ph:star" class="me-1 size-3" />ویژه
            </span>
          </div>
          <h1 class="text-2xl font-bold">{{ title }}</h1>
          <div class="text-muted-500 text-sm mb-2">{{ excerpt }}</div>
          <div class="text-muted-700 text-base mb-2">{{ description }}</div>
          <div class="prose prose-sm dark:prose-invert rtl max-w-none">
            <AddonMarkdownRemark :source="contentLong" />
          </div>
          <div class="flex gap-4 mt-4">
            <span class="text-muted-400 text-xs"><Icon name="ph:calendar" class="me-1 size-3" />{{ publishDate }}</span>
            <span class="text-muted-400 text-xs"><Icon name="ph:clock" class="me-1 size-3" />{{ readTime }} دقیقه</span>
            <span v-if="allowComments" class="text-success-500 text-xs"><Icon name="ph:chat-circle-dots" class="me-1 size-3" />نظردهی فعال است</span>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-8">
        <BaseButton color="muted" @click="goBack">
          <Icon name="ph:arrow-right" class="ml-2 size-4" />بازگشت
        </BaseButton>
      </div>
    </BaseCard>
    <div class="mt-8"></div>
  </div>
</template>

<style scoped>
.container {
  direction: rtl;
}
</style>
