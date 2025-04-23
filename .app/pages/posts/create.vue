<script setup lang="ts">
// --- راهنمای مارک‌داون برای استفاده در پرامپت هوش مصنوعی ---
const markdownGuide = `# راهنمای نگارش مارک‌داون

مارک‌داون یک روش ساده برای قالب‌بندی متن است. در این راهنما، نحوه استفاده از آن را یاد می‌گیرید.

## سرفصل‌ها
برای ایجاد سرفصل از علامت # استفاده کنید. تعداد # نشان‌دهنده سطح سرفصل است.

# سرفصل سطح ۱
## سرفصل سطح ۲
### سرفصل سطح ۳
#### سرفصل سطح ۴

## متن‌های ویژه
می‌توانید متن را به شکل‌های مختلف قالب‌بندی کنید:

- **متن پررنگ** با **متن**
- *متن مورب* با *متن*
- ***متن پررنگ و مورب*** با ***متن***
- ~~متن خط خورده~~ با ~~متن~~
- کد تک خطی با کد

## لیست‌ها
### لیست نامرتب
- مورد اول
  - زیرمورد اول
  - زیرمورد دوم
- مورد دوم
  * می‌توانید از * هم استفاده کنید
  + یا از + استفاده کنید

### لیست مرتب
1. مورد اول
2. مورد دوم
   1. زیرمورد اول
   2. زیرمورد دوم
3. مورد سوم

## نقل قول
نقل قول‌ها با > شروع می‌شوند:

> این یک نقل قول است
> که می‌تواند چند خط باشد
>> حتی می‌توانید نقل قول تو در تو داشته باشید

## پیوندها
- [لینک ساده](https://example.com)
- [لینک با توضیح](https://example.com "روی من هاور کنید!")
- لینک مستقیم: <https://example.com>

## تصاویر
تصاویر مانند لینک‌ها هستند، فقط با یک ! در ابتدا:

![توضیح تصویر](https://picsum.photos/200/100)


## جدول‌ها
جدول‌ها با خط عمودی (|) ایجاد می‌شوند:

| عنوان ۱ | عنوان ۲ | عنوان ۳ |
|---------|---------|---------|
| سلول ۱  | سلول ۲  | سلول ۳  |
| ردیف ۲  | مقدار   | دیگر    |

## خط افقی
سه خط تیره یا بیشتر یک خط افقی ایجاد می‌کند:

---

### پانویس
متن با پانویس[^1] و پانویس دیگر[^2]

[^1]: این توضیح پانویس اول است
[^2]: این توضیح پانویس دوم است
`

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
const secretMessage = ref('')
const aiSuggestion = ref('')
const aiFeedback = ref('')
const goals = ref('')

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
  { value: 'self-help', label: 'خودیاری', icon: 'ph:hand-heart-duotone' },
  { value: 'motivation', label: 'انگیزشی', icon: 'ph:star-duotone' },
  { value: 'relationship', label: 'روابط', icon: 'ph:users-duotone' },
  { value: 'parenting', label: 'فرزندپروری', icon: 'ph:baby-duotone' },
  { value: 'counseling', label: 'مشاوره', icon: 'ph:chat-circle-dots-duotone' },
  { value: 'stress', label: 'مدیریت استرس', icon: 'ph:activity-duotone' },
  { value: 'anxiety', label: 'اضطراب', icon: 'ph:cloud-warning-duotone' },
  { value: 'depression', label: 'افسردگی', icon: 'ph:cloud-rain-duotone' },
  { value: 'happiness', label: 'شادکامی', icon: 'ph:smiley-duotone' },
  { value: 'addiction', label: 'اعتیاد', icon: 'ph:beer-bottle-duotone' },
  { value: 'trauma', label: 'تروما و آسیب', icon: 'ph:heartbeat-duotone' },
  { value: 'sexuality', label: 'مسائل جنسی', icon: 'ph:gender-intersex-duotone' },
  { value: 'sleep', label: 'خواب و استراحت', icon: 'ph:bed-duotone' },
  { value: 'nutrition', label: 'تغذیه و سبک زندگی', icon: 'ph:apple-logo-duotone' },
  { value: 'mindfulness', label: 'ذهن‌آگاهی', icon: 'ph:eye-duotone' },
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
  if (newTag.value && !tags.value.includes(newTag.value.trim())) {
    tags.value.push(newTag.value.trim())
    newTag.value = ''
  }
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
    secretMessage: secretMessage.value,
    goals: goals.value,
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
watch([title, description, contentLong, excerpt, slug, category, tags, publishDate, readTime, isFeatured, allowComments, secretMessage, goals], savePreviewToLocalStorage)

function backToPosts() {
  router.push('/posts/list')
}

function requestAISuggestion() {
  // Fake AI suggestion for demo (replace with API call)
  aiSuggestion.value = 'تو قوی‌تر از چیزی هستی که فکر می‌کنی!'
  aiFeedback.value = ''
}
function acceptAISuggestion() {
  secretMessage.value = aiSuggestion.value
  aiFeedback.value = ''
}
function rejectAISuggestion() {
  aiFeedback.value = 'این پیشنهاد مورد پسند واقع نشد. لطفاً بازنویسی کنید.'
}
function regenerateAISuggestion() {
  // Fake regenerate (replace with API call + feedback)
  aiSuggestion.value = 'هر روز یک شروع دوباره است، ازش لذت ببر!'
  aiFeedback.value = ''
}

// AI suggestion functions
import { useOpenRouter } from '~/composables/useOpenRouter'
const { streamChat, processing } = useOpenRouter()

async function suggestAIField(field) {
  // Gather all relevant info for context
  const context = {
    title: title.value,
    secretMessage: secretMessage.value,
    tags: tags.value.join('، '),
    excerpt: excerpt.value,
    slug: slug.value,
    readTime: readTime.value,
    description: description.value,
    contentLong: contentLong.value,
    goals: goals.value,
  }
  // Compose context string (exclude the current field)
  const contextString = Object.entries(context)
    .filter(([key]) => key !== field && context[key])
    .map(([key, val]) => `${key}: ${val}`)
    .join('\n')

  const prompts = {
    title: 'یک عنوان مناسب برای مقاله پیشنهاد بده که حتماً با ساختار مارک‌داون و با استفاده از # در ابتدای خط نوشته شود. فقط عنوان را به صورت مارک‌داون بازگردان.',
    secretMessage: `یک پیام مخفی کوتاه، بسیار دقیق، مرتبط و عمیق فقط برای همین مقاله پیشنهاد بده. پیام باید کاملاً متناسب با موضوع عنوان و سایر اطلاعات مقاله باشد و به خواننده حس خاص و الهام‌بخش منتقل کند. از پیام‌های کلیشه‌ای و بی‌ربط یا جملات بی‌معنی خودداری کن. فقط یک پیام کاملاً مرتبط و معنی‌دار ارائه بده که واقعا به دل خواننده بنشیند.`,
    tags: 'چند برچسب مرتبط فقط با همین مقاله پیشنهاد بده (با ویرگول جدا کن). فقط لیست برچسب‌ها را بنویس.',
    excerpt: 'یک خلاصه کوتاه و مناسب فقط برای همین مقاله پیشنهاد بده. فقط خلاصه را بنویس.',
    slug: 'یک اسلاگ مناسب (لاتین و بدون فاصله) فقط برای همین مقاله پیشنهاد بده. فقط اسلاگ را بنویس.',
    readTime: 'زمان تقریبی مطالعه (بر حسب دقیقه) فقط برای همین مقاله پیشنهاد بده. فقط یک عدد بنویس.',
    description: 'یک توضیح کوتاه فقط برای همین مقاله پیشنهاد بده. فقط توضیح را بنویس.',
    contentLong: `یک متن کامل و منسجم برای مقاله بنویس. حتماً فقط و فقط با مارک‌داون بنویس. متن باید حداقل ۵۰۰۰ کلمه باشد و تا حد ممکن از ساختارها و امکانات مختلف مارک‌داون (سرفصل، لیست، چک‌لیست، نقل‌قول، جدول، کد، تصویر، پیوند و غیره) استفاده کن. پاسخ نهایی باید حتماً ساختار مارک‌داون داشته باشد و نشانه‌های مارک‌داون (مثل # برای عنوان، - یا * برای لیست و ...) به‌درستی رعایت شود. مثال‌های زیر را برای تنوع ساختار ببین:
${markdownGuide}`,
    goals: 'اهداف آموزشی و روانشناختی مقاله را بنویسید. هدف روانشناس از نگارش مقاله، دستاوردها و مطالبی که خواننده یاد می‌گیرد را اینجا بنویسید...',
  }
  const prompt = prompts[field] || 'یک مقدار مناسب پیشنهاد بده.'
  const userContent = context[field]
  const messages = [
    { role: 'user', content: userContent ? `${prompt}\nمقدار فعلی: ${userContent}\nاطلاعات دیگر مقاله:\n${contextString}` : `${prompt}\nاطلاعات دیگر مقاله:\n${contextString}` },
  ]
  try {
    let suggestion = ''
    await streamChat(messages, {}, (chunk) => {
      suggestion += chunk.choices?.[0]?.delta?.content || ''
    })
    console.log(suggestion)
    setFieldValue(field, suggestion.trim())
  }
  catch (e) {
    // handle error (optional toast)
  }
}
function getFieldValue(field) {
  switch (field) {
    case 'title': return title.value
    case 'description': return description.value
    case 'excerpt': return excerpt.value
    case 'slug': return slug.value
    case 'category': return category.value
    case 'tags': return tags.value.join('، ')
    case 'secretMessage': return secretMessage.value
    case 'contentLong': return contentLong.value
    case 'goals': return goals.value
    // ...other fields
    default: return ''
  }
}
function setFieldValue(field, value) {
  switch (field) {
    case 'tags':
      // اگر مقدار یک رشته است، به آرایه جداگانه تبدیل کن:
      if (typeof value === 'string') {
        tags.value = value.split('،').map(t => t.trim()).filter(Boolean)
      }
      else if (Array.isArray(value)) {
        tags.value = value
      }
      else {
        tags.value = []
      }
      break
    case 'title': title.value = value; break
    case 'description': description.value = value; break
    case 'excerpt': excerpt.value = value; break
    case 'slug': slug.value = value; break
    case 'category': category.value = value; break
    case 'secretMessage': secretMessage.value = value; break
    case 'contentLong': contentLong.value = value; break
    case 'goals': goals.value = value; break
    // ...other fields
  }
}

// Markdown AI edit
const showMarkdownAiEdit = ref(false)
const selectedMarkdownText = ref('')
const markdownAiEditDesc = ref('')
const markdownTextarea = ref(null)

function openMarkdownAiEditPopup() {
  showMarkdownAiEdit.value = true
}
function applyMarkdownAiEdit() {
  // Call AI API with selectedMarkdownText and markdownAiEditDesc
  const prompt = `یک پاراگراف مارک‌داون برای این متن پیشنهاد بده.\nمتن فعلی:\n${selectedMarkdownText.value}\nتوضیحات:\n${markdownAiEditDesc.value}`
  const messages = [
    { role: 'user', content: prompt },
  ]
  streamChat(messages, {}, (chunk) => {
    const suggestion = chunk.choices?.[0]?.delta?.content || ''
    contentLong.value = contentLong.value.replace(selectedMarkdownText.value, suggestion)
    showMarkdownAiEdit.value = false
    markdownAiEditDesc.value = ''
    selectedMarkdownText.value = ''
  })
}
// Detect selection in markdown textarea
function handleMarkdownSelection() {
  const textarea = markdownTextarea.value?.$el?.querySelector('textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    if (start !== end) {
      selectedMarkdownText.value = textarea.value.substring(start, end)
    }
    else {
      selectedMarkdownText.value = ''
    }
  }
}
// Attach selection handler
onMounted(() => {
  const textarea = markdownTextarea.value?.$el?.querySelector('textarea')
  if (textarea) {
    textarea.addEventListener('mouseup', handleMarkdownSelection)
    textarea.addEventListener('keyup', handleMarkdownSelection)
  }
})

const generateGoalsListAI = async () => {
  const { streamChat, processing } = useOpenRouter()
  goals.value = ''
  const topic = title.value.trim()
  const prompt = `با توجه به عنوان مقاله زیر، یک لیست از اهداف آموزشی و روانشناختی مرتبط با همان عنوان که خواننده پس از مطالعه این مقاله به دست می‌آورد به زبان فارسی بنویس. تاکید: خروجی باید فقط یک لیست باشد و هر هدف در یک خط مجزا نوشته شود.\nعنوان مقاله: ${topic}`
  const messages = [
    { role: 'system', content: 'شما یک دستیار متخصص تولید محتوای روانشناسی هستید.' },
    { role: 'user', content: prompt },
  ]
  try {
    let result = ''
    await streamChat(messages, {}, (chunk) => {
      result += chunk.choices?.[0]?.delta?.content || ''
      goals.value = result
    })
  }
  catch (e) {
    goals.value = 'خطا در دریافت اهداف از هوش مصنوعی.'
  }
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
                <!-- Title & Secret Message in one row -->
                <div class="mb-6 flex flex-col gap-4 md:flex-row">
                  <div class="flex-1">
                    <BaseInput
                      v-model="title"
                      label="عنوان مقاله"
                      placeholder="مثلاً قدرت ذهن"
                      icon="ph:article"
                      :error="errors.title"
                      class="w-full"
                    >
                      <template #action>
                        <button
                          type="button"
                          data-nui-tooltip="پیشنهاد هوش مصنوعی"
                          class="text-muted-400 hover:text-primary-500 absolute end-0 top-0 z-[1] flex size-8 items-center justify-center transition-colors duration-300"
                          @click="suggestAIField('title')"
                        >
                          <Icon name="ph:sparkle" class="size-4" />
                        </button>
                      </template>
                    </BaseInput>
                  </div>
                  <div class="flex-1">
                    <BaseInput
                      v-model="secretMessage"
                      label="پیام مخفی برای خواننده (اختیاری)"
                      placeholder="پیام اصلی ای که می خواهی به خواننده منتقل کنی را اینجا بنویس"
                      icon="ph:lock-key"
                      class="w-full"
                    >
                      <template #action>
                        <button
                          type="button"
                          data-nui-tooltip="پیشنهاد هوش مصنوعی"
                          class="text-muted-400 hover:text-primary-500 absolute end-0 top-0 z-[1] flex size-8 items-center justify-center transition-colors duration-300"
                          @click="suggestAIField('secretMessage')"
                        >
                          <Icon name="ph:sparkle" class="size-4" />
                        </button>
                      </template>
                    </BaseInput>
                  </div>
                </div>
                <!-- Educational and Psychological Goals -->
                <div class="mb-6">
                  <div class="mb-2 flex items-center justify-between">
                    <label class="text-muted-800 dark:text-muted-100 font-semibold">اهداف آموزشی و روانشناختی مقاله</label>
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      @click="generateGoalsListAI"
                    >
                      <Icon name="ph:sparkle" class="size-4" />
                    </button>
                  </div>
                  <BaseTextarea
                    v-model="goals"
                    placeholder="هدف روانشناس از نگارش مقاله، دستاوردها و مطالبی که خواننده یاد می‌گیرد را اینجا به صورت لیست بنویسید..."
                    rows="4"
                    :error="errors.goals"
                  >
                    <template #action>
                      <button
                        type="button"
                        data-nui-tooltip="پیشنهاد هوش مصنوعی"
                        class="text-muted-400 hover:text-primary-500 absolute end-0 top-0 z-[1] flex size-8 items-center justify-center transition-colors duration-300"
                        @click="suggestAIField('goals')"
                      >
                        <Icon name="ph:sparkle" class="size-4" />
                      </button>
                    </template>
                  </BaseTextarea>
                  <div class="text-primary-600 mt-1 text-xs">
                    (تأکید: خروجی حتماً باید به صورت لیست اهداف باشد)
                  </div>
                </div>
                <!-- Category Selection -->
                <div class="mb-6">
                  <label class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold">دسته‌بندی
                    <button
                      type="button"
                      data-nui-tooltip="پیشنهاد هوش مصنوعی"
                      class="text-muted-400 hover:text-primary-500 ml-2 flex size-7 items-center justify-center transition-colors duration-300"
                      @click="suggestAIField('category')"
                    >
                      <Icon name="ph:sparkle" class="size-4" />
                    </button>
                  </label>
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
                    <button
                      type="button"
                      data-nui-tooltip="پیشنهاد هوش مصنوعی"
                      class="text-muted-400 hover:text-primary-500 ml-2 flex size-8 items-center justify-center transition-colors duration-300"
                      @click="suggestAIField('tags')"
                    >
                      <Icon name="ph:sparkle" class="size-4" />
                    </button>
                  </div>
                  <div class="mb-2 flex flex-wrap gap-2">
                    <span
                      v-for="(tag, i) in tags"
                      :key="i"
                      class="bg-primary-100 text-primary-700 flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                    >
                      <span>{{ tag }}</span>
                      <button
                        type="button"
                        class="text-danger-500 hover:text-danger-700 ml-1"
                        @click="tags.splice(i, 1)"
                      >
                        <Icon name="ph:x" class="size-3" />
                      </button>
                    </span>
                  </div>
                  <div class="flex items-end gap-2">
                    <BaseInput
                      v-model="newTag"
                      label="افزودن برچسب جدید"
                      placeholder="مثلاً انگیزشی"
                      size="sm"
                      @keyup.enter="addTag"
                    />
                    <BaseButton
                      color="primary"
                      size="sm"
                      @click="addTag"
                    >
                      افزودن
                    </BaseButton>
                  </div>
                </div>

                <!-- Image Upload with Preview (Headless) -->
                <div class="mb-6 w-full">
                  <label class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold">تصویر مقاله (آپلود)</label>
                  <BaseInputFileHeadless
                    v-slot="{ open, remove, preview, drop, files }"
                    v-model="uploadedFiles"
                    :multiple="false"
                    class="w-full"
                  >
                    <div class="mb-4 flex items-center gap-2">
                      <button
                        type="button"
                        class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
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

                <!-- Excerpt (خلاصه کوتاه) with AI button -->
                <BaseTextarea
                  v-model="excerpt"
                  label="خلاصه کوتاه"
                  placeholder="یک خلاصه کوتاه برای پیش‌نمایش مقاله..."
                  rows="2"
                  size="sm"
                  rounded="md"

                  icon="ph:info"
                  :error="errors.excerpt"
                  addon
                  class="mb-6"
                >
                  <template #addon>
                    <button
                      type="button"
                      data-nui-tooltip="پیشنهاد هوش مصنوعی"
                      class="text-muted-400 hover:text-primary-500 flex h-12 w-10 items-center justify-center transition-colors duration-300"
                      @click="suggestAIField('excerpt')"
                    >
                      <Icon name="ph:sparkle" class="size-5" />
                    </button>
                  </template>
                </BaseTextarea>

                <!-- Slug -->
                <BaseInput
                  v-model="slug"
                  label="اسلاگ (اختیاری)"
                  placeholder="مثلاً self-awareness"
                  icon="ph:link"
                  class="mb-6"
                >
                  <template #action>
                    <button
                      type="button"
                      data-nui-tooltip="پیشنهاد هوش مصنوعی"
                      class="text-muted-400 hover:text-primary-500 absolute end-0 top-0 z-[1] flex size-8 items-center justify-center transition-colors duration-300"
                      @click="suggestAIField('slug')"
                    >
                      <Icon name="ph:sparkle" class="size-4" />
                    </button>
                  </template>
                </BaseInput>

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
                    <label class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold">متن کامل مقاله (مارک‌داون)</label>
                    <button
                      type="button"
                      data-nui-tooltip="پیشنهاد هوش مصنوعی"
                      class="text-muted-400 hover:text-primary-500 ml-2 flex size-8 items-center justify-center transition-colors duration-300"
                      @click="suggestAIField('contentLong')"
                    >
                      <Icon name="ph:sparkle" class="size-4" />
                    </button>
                  </div>
                  <BaseTextarea
                    ref="markdownTextarea"
                    v-model="contentLong"
                    label=""
                    placeholder="متن کامل مقاله را وارد کنید... (Markdown)"
                    rows="12"
                    icon="ph:file-text"
                    :error="errors.content"
                    class="mb-6"
                  >
                    <template #action>
                      <button
                        type="button"
                        data-nui-tooltip="پیشنهاد هوش مصنوعی"
                        class="text-muted-400 hover:text-primary-500 absolute end-0 top-0 z-[1] flex size-8 items-center justify-center transition-colors duration-300"
                        @click="suggestAIField('contentLong')"
                      >
                        <Icon name="ph:sparkle" class="size-4" />
                      </button>
                    </template>
                  </BaseTextarea>
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
                  <!-- Selection AI edit button -->
                  <button
                    v-if="selectedMarkdownText"
                    class="text-info-500 mt-2 underline underline-offset-4"
                    @click="openMarkdownAiEditPopup"
                  >
                    ویرایش هوشمند بخش انتخاب‌شده
                  </button>
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
  <!-- Markdown AI edit popup -->
  <TairoModal v-model="showMarkdownAiEdit" size="md">
    <template #header>
      <h2 class="text-lg font-bold">
        ویرایش هوشمند بخش انتخابی
      </h2>
    </template>
    <div class="flex flex-col gap-4 p-4">
      <div class="bg-muted-100 rounded p-2">
        {{ selectedMarkdownText }}
      </div>
      <BaseInput
        v-model="markdownAiEditDesc"
        label="توضیح تغییر موردنظر"
        placeholder="مثلاً رسمی‌تر کن"
      />
      <BaseButton color="primary" @click="applyMarkdownAiEdit">
        اعمال تغییر
      </BaseButton>
    </div>
  </TairoModal>
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
