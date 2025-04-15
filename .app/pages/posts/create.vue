<script setup lang="ts">
definePageMeta({
  title: 'ایجاد مقاله جدید',
  preview: {
    title: 'ایجاد مقاله جدید',
    description: 'یک مقاله جدید ایجاد کنید',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-jobs.png',
    srcDark: '/img/screens/dashboards-jobs-dark.png',
    order: 15,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

import PersianCalendar from '~/components/PersianCalendar.vue'
import AddonMarkdownRemark from '~/components/AddonMarkdownRemark.vue'

const router = useRouter()

const title = ref('')
const description = ref('')
const uploadedFiles = ref<FileList | null>(null)
const category = ref('')
const tags = ref<string[]>([])
const newTag = ref('')
const readTime = ref('')
const publishDate = ref('')
const contentLong = ref('')
const excerpt = ref('')
const slug = ref('')
const allowComments = ref(true)
const isFeatured = ref(false)

const postType = ref('normal')
const commentStatus = ref('enabled')

const errors = ref({})
const loading = ref(false)
const success = ref(false)
const showPreview = ref(false)

const categories = [
  { value: 'all', label: 'همه', icon: 'ph:circles-four-duotone' },
  { value: 'psychology', label: 'روانشناسی', icon: 'ph:brain-duotone' },
  { value: 'meditation', label: 'مدیتیشن', icon: 'ph:person-simple-duotone' },
  { value: 'yoga', label: 'یوگا', icon: 'ph:person-simple-walk-duotone' },
  { value: 'mental-health', label: 'سلامت روان', icon: 'ph:heartbeat-duotone' },
]
const availableTags = [
  'خودآگاهی',
  'رشد فردی',
  'سلامت روان',
  'استرس',
  'آرامش',
  'مدیتیشن',
  'یوگا',
]

const previewImage = computed(() => {
  if (uploadedFiles.value && uploadedFiles.value.length) {
    const file = uploadedFiles.value[0]
    return URL.createObjectURL(file)
  }
  return ''
})

function formatFileSize(size: number) {
  if (size < 1024) return size + ' bytes'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / 1024 / 1024).toFixed(1) + ' MB'
}

const categoryIcon = computed(() => {
  const cat = categories.find(c => c.label === category.value)
  return cat ? cat.icon : ''
})

const imageUrl = computed(() => {
  if (!uploadedFiles.value) return ''
  if (typeof uploadedFiles.value === 'string') return uploadedFiles.value
  return URL.createObjectURL(uploadedFiles.value[0])
})

function validate() {
  errors.value = {}
  if (!title.value.trim()) errors.value.title = 'عنوان مقاله الزامی است.'
  if (!description.value.trim()) errors.value.description = 'توضیحات مقاله الزامی است.'
  if (!category.value) errors.value.category = 'دسته‌بندی الزامی است.'
  if (!contentLong.value.trim()) errors.value.content = 'متن کامل مقاله الزامی است.'
  if (!publishDate.value) errors.value.publishDate = 'تاریخ انتشار الزامی است.'
  return Object.keys(errors.value).length === 0
}

function formatLongContent(html: string) {
  return html
    // Convert divs with # to headings
    .replace(/<div>#+ ([^<]+)<\/div>/g, (_, title) => `# ${title}\n`)
    .replace(/<div>##+ ([^<]+)<\/div>/g, (_, title) => `## ${title}\n`)
    // Convert lists
    .replace(/<div>&nbsp; &nbsp;\* ([^<]+)<\/div>/g, (_, item) => `* ${item}\n`)
    .replace(/<div>\d+\. ([^<]+)<\/div>/g, (_, item) => `1. ${item}\n`)
    // Convert regular divs to paragraphs
    .replace(/<div>([^<]+)<\/div>/g, (_, text) => `${text}\n`)
    // Clean up
    .replace(/<br>/g, '\n')
    .replace(/&zwnj;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()
}

async function submit() {
  if (!validate()) return
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    success.value = true
    setTimeout(() => {
      router.push('/posts/list')
    }, 1200)
  }, 1200)
}

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
  }
  newTag.value = ''
}

function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}

function savePreviewToLocalStorage() {
  const data = {
    title: title.value,
    description: description.value,
    contentLong: contentLong.value,
    excerpt: excerpt.value,
    slug: slug.value,
    category: category.value,
    tags: tags.value,
    publishDate: publishDate.value,
    readTime: readTime.value,
    isFeatured: isFeatured.value,
    allowComments: allowComments.value,
    // image: skip for now
  }
  localStorage.setItem('postPreview', JSON.stringify(data))
}

function goToPreview() {
  savePreviewToLocalStorage()
  router.push('/posts/preview')
}

const isPreviewDisabled = computed(() => {
  return !title.value.trim() && !contentLong.value.trim() && !description.value.trim()
})

// Optional: auto-save on change
import { watch } from 'vue'
watch([title, description, contentLong, excerpt, slug, category, tags, publishDate, readTime, isFeatured, allowComments], savePreviewToLocalStorage)

function backToPosts() {
  router.push('/posts/list')
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/posts/list" class="text-primary-500 hover:text-primary-600">
          <Icon name="ph:arrow-right" class="size-6" />
        </NuxtLink>
        <BaseHeading
          tag="h1"
          size="2xl"
          weight="semibold"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          ایجاد مقاله جدید
        </BaseHeading>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <BaseCard rounded="lg" class="mb-6">
          <div class="relative">
            <div class="p-6">
              <!-- Form -->
              <form class="space-y-6" @submit.prevent="submit">
                <!-- Category Selection -->
                <div class="mb-6">
                  <label class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold">دسته‌بندی</label>
                  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    <BaseRadioHeadless
                      v-for="cat in categories"
                      :key="cat.value"
                      v-model="category"
                      :name="'category'"
                      :value="cat.label"
                    >
                      <BaseCard
                        rounded="lg"
                        class="flex cursor-pointer items-center gap-2 border-2 p-3 transition-all duration-150 peer-checked:!border-[#9C6ADE] peer-checked:!bg-[#F6F0FF]"
                      >
                        <Icon :name="cat.icon" class="size-5 text-[#9C6ADE]" />
                        <span class="font-medium">{{ cat.label }}</span>
                      </BaseCard>
                    </BaseRadioHeadless>
                  </div>
                  <div v-if="errors.category" class="text-danger-500 mt-1 text-sm">
                    {{ errors.category }}
                  </div>
                </div>

                <!-- Tags -->
                <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 mb-6 rounded-xl border bg-white p-4">
                  <div class="mb-4 flex items-center gap-2">
                    <Icon name="ph:tag" class="text-primary-500 size-5" />
                    <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                      برچسب‌ها
                    </h3>
                  </div>
                  <div class="space-y-2">
                    <div class="flex w-full gap-2">
                      <BaseInput
                        v-model="newTag"
                        placeholder="برچسب جدید را وارد کنید..."
                        :classes="{
                          wrapper: 'flex-1',
                          input: 'w-full'
                        }"
                        @keydown.enter.prevent="addTag"
                      >
                        <template #suffix>
                          <button
                            type="button"
                            class="text-primary-500 hover:text-primary-600 disabled:text-muted-300 dark:disabled:text-muted-500 transition-colors"
                            :disabled="!newTag"
                            @click="addTag"
                          >
                            <Icon name="ph:plus-circle" class="size-5" />
                          </button>
                        </template>
                      </BaseInput>
                    </div>
                    <div v-if="tags.length" class="flex flex-wrap gap-2">
                      <div
                        v-for="tag in tags"
                        :key="tag"
                        class="bg-muted-100 dark:bg-muted-700 text-muted-500 dark:text-muted-200 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm"
                      >
                        <span>{{ tag }}</span>
                        <button
                          type="button"
                          class="text-muted-400 hover:text-danger-500 transition-colors"
                          @click="removeTag(tag)"
                        >
                          <Icon name="ph:x-circle" class="size-4" />
                        </button>
                      </div>
                    </div>
                    <p v-else class="text-muted-400 text-sm">
                      برچسب‌ها به شما کمک می‌کنند تا مقاله خود را بهتر دسته‌بندی کنید.
                    </p>
                  </div>
                </div>

                <!-- Image Upload with Preview (Headless) -->
                <div class="mb-6 w-full">
                  <BaseInputFileHeadless
                    v-slot="{ open, remove, preview, drop, files }"
                    v-model="uploadedFiles"
                    :multiple="false"
                    class="w-full"
                  >
                    <div class="mb-4 flex items-center gap-2">
                      <button
                        type="button"
                        class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                        tooltip="Select files"
                        @click="open"
                      >
                        <Icon name="lucide:plus" class="size-4" />
                        <span class="sr-only">Select files</span>
                      </button>
                    </div>
                    <div
                      role="button"
                      tabindex="-1"
                      @dragenter.stop.prevent
                      @dragover.stop.prevent
                      @drop="drop"
                    >
                      <div
                        v-if="!files?.length"
                        class="nui-focus border-muted-300 dark:border-muted-700 hover:border-muted-400 focus:border-muted-400 dark:hover:border-muted-600 dark:focus:border-muted-700 group cursor-pointer rounded-lg border-[3px] border-dashed p-8 transition-colors duration-300"
                        tabindex="0"
                        role="button"
                        @click="open"
                        @keydown.enter.prevent="open"
                      >
                        <div class="p-5 text-center">
                          <Icon name="mdi-light:cloud-upload" class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 mb-2 size-10 transition-colors duration-300" />
                          <h4 class="text-muted-400 font-sans text-sm">
                            فایل تصویر را بکشید و رها کنید
                          </h4>
                          <div><span class="text-muted-400 font-sans text-[0.7rem] font-semibold uppercase">یا</span></div>
                          <label class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 cursor-pointer font-sans text-sm underline underline-offset-4 transition-colors duration-300">انتخاب فایل</label>
                        </div>
                      </div>
                      <ul v-else class="mt-6 space-y-2">
                        <li v-for="file in files" :key="file.name">
                          <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative flex items-center justify-end gap-2 rounded-xl border bg-white p-3">
                            <div class="flex items-center gap-2">
                              <div class="shrink-0">
                                <img
                                  v-if="file.type.startsWith('image')"
                                  class="size-14 rounded-xl object-cover object-center"
                                  :src="preview(file).value"
                                  alt="Image preview"
                                >
                                <img
                                  v-else
                                  class="size-14 rounded-xl object-cover object-center"
                                  src="/img/avatars/placeholder-file.png"
                                  alt="Image preview"
                                >
                              </div>
                              <div class="font-sans">
                                <span class="text-muted-800 dark:text-muted-100 line-clamp-1 block text-sm">{{ file.name }}</span>
                                <span class="text-muted-400 block text-xs">{{ formatFileSize(file.size) }}</span>
                              </div>
                            </div>
                            <div class="flex gap-2">
                              <button
                                class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                                type="button"
                                tooltip="Remove"
                                @click.prevent="remove(file)"
                              >
                                <Icon name="lucide:x" class="size-4" /><span class="sr-only">Remove</span>
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </BaseInputFileHeadless>
                </div>

                <!-- Excerpt / Summary -->
                <BaseTextarea
                  v-model="excerpt"
                  label="خلاصه کوتاه (اختیاری)"
                  placeholder="یک خلاصه کوتاه برای مقاله وارد کنید..."
                  rows="2"
                  icon="ph:info"
                  class="mb-6"
                />

                <!-- Slug -->
                <BaseInput
                  v-model="slug"
                  label="اسلاگ (اختیاری)"
                  placeholder="مثلاً self-awareness"
                  icon="ph:link"
                  class="mb-6"
                />

                <!-- Allow Comments & Featured Toggle -->
                <div class="mb-6 flex gap-6">
                  <BaseSwitch v-model="allowComments" label="اجازه ثبت نظر" />
                  <BaseSwitch v-model="isFeatured" label="مقاله ویژه" />
                </div>

                <!-- Date & Read Time -->
                <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold">تاریخ انتشار</label>
                    <PersianCalendar v-model="publishDate" class="w-full" />
                    <div v-if="errors.publishDate" class="text-danger-500 mt-1 text-sm">
                      {{ errors.publishDate }}
                    </div>
                  </div>
                  <div>
                    <label class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold">زمان مطالعه (دقیقه)</label>
                    <BaseInput
                      v-model="readTime"
                      type="number"
                      min="1"
                      placeholder="مثلاً ۵"
                      class="w-full"
                    />
                  </div>
                </div>

                <!-- Long Content (Markdown) -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="text-muted-800 dark:text-muted-100 block font-medium">متن کامل مقاله</label>
                    <NuxtLink to="/markdown-tutorial" class="text-primary-500 hover:text-primary-600 inline-flex items-center gap-1 text-sm">
                      <Icon name="ph:info" class="size-4" />
                      <span>راهنمای نگارش</span>
                    </NuxtLink>
                  </div>
                  <BaseTextarea
                    v-model="contentLong"
                    rows="8"
                    :classes="{
                      wrapper: 'max-w-full',
                    }"
                    placeholder="متن اصلی مقاله را اینجا وارد کنید..."
                    :error="errors.content"
                    required
                    icon="ph:note"
                  />
                  <!-- Markdown Preview -->
                  <div v-if="contentLong" class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 rounded-xl border p-4">
                    <div class="mb-2 flex items-center gap-2">
                      <Icon name="ph:eye" class="text-primary-500 size-4" />
                      <h3 class="text-muted-800 text-sm font-medium dark:text-white">
                        پیش‌نمایش
                      </h3>
                    </div>
                    <div class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl max-w-none">
                      <div class="text-muted-500 dark:text-muted-400 leading-relaxed">
                        <AddonMarkdownRemark :source="formatLongContent(contentLong)" />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </BaseCard>
      </div>
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <BaseCard rounded="xl" class="mb-6 flex items-center justify-end gap-3 border border-[#E5D8FA] bg-[#F6F0FF] p-4 shadow-sm">
          <BaseButton
            color="muted"
            :loading="loading"
            :disabled="loading"
            class="min-w-[110px] flex-1 rounded-xl px-6 py-3 text-base font-bold"
            @click="backToPosts"
          >
            <Icon name="ph:arrow-right" class="ml-2 size-4" />
            انصراف
          </BaseButton>
          <BaseButton
            color="info"
            :disabled="loading || isPreviewDisabled"
            class="min-w-[110px] flex-1 rounded-xl px-6 py-3 text-base font-bold"
            @click="goToPreview"
          >
            <Icon name="ph:eye" class="ml-2 size-4" />
            پیش‌نمایش
          </BaseButton>
          <BaseButton
            color="primary"
            :loading="loading"
            :disabled="loading"
            class="min-w-[110px] flex-1 rounded-xl px-6 py-3 text-base font-bold"
            @click="submit"
          >
            <Icon name="ph:check-circle" class="ml-2 size-4" />
            ایجاد
          </BaseButton>
        </BaseCard>
        <BaseCard rounded="lg" class="mb-6">
          <div class="p-6">
            <div class="space-y-4">
              <BaseHeading
                tag="h3"
                size="sm"
                weight="medium"
                class="text-muted-800 dark:text-muted-100"
              >
                راهنما
              </BaseHeading>
              <BaseParagraph class="text-muted-500 dark:text-muted-400">
                <ul class="list-inside list-disc space-y-2">
                  <li>عنوان باید کوتاه و گویا باشد</li>
                  <li>توضیح کوتاه برای نمایش در لیست مقالات استفاده می‌شود</li>
                  <li>متن کامل مقاله باید شامل جزئیات کافی باشد</li>
                  <li>تاریخ انتشار باید تعیین شود</li>
                  <li>برچسب‌ها به جستجوپذیری مقاله کمک می‌کنند</li>
                </ul>
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.long-description {
  @apply space-y-6 text-muted-500 dark:text-muted-400 leading-relaxed;
}

.long-description h1 {
  @apply text-muted-800 dark:text-muted-100 text-xl font-semibold mb-4;
}

.long-description h2 {
  @apply text-muted-800 dark:text-muted-100 text-lg font-medium mb-3;
}

.long-description p {
  @apply mb-4;
}

.long-description ul {
  @apply list-disc list-inside mb-4;
}

.long-description ol {
  @apply list-decimal list-inside mb-4;
}
</style>
