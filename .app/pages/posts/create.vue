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
const toaster = useToaster()
const { streamChat, processing } = useOpenRouter()

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
const goals = ref('')

// Loading state for AI suggestion buttons
const titleAiLoading = ref(false)
const secretMessageAiLoading = ref(false)
const goalsAiLoading = ref(false)
const categoryAiLoading = ref(false)
const tagsAiLoading = ref(false)
const excerptAiLoading = ref(false)
const slugAiLoading = ref(false)
const contentLongAiLoading = ref(false)
const generateGoalsAiLoading = ref(false)

const errors = ref({})
const loading = ref(false)
const success = ref(false)

const categories = [
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
  {
    value: 'sexuality',
    label: 'مسائل جنسی',
    icon: 'ph:gender-intersex-duotone',
  },
  { value: 'sleep', label: 'خواب و استراحت', icon: 'ph:bed-duotone' },
  {
    value: 'nutrition',
    label: 'تغذیه و سبک زندگی',
    icon: 'ph:apple-logo-duotone',
  },
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

function validate() {
  errors.value = {}
  if (!title.value.trim()) errors.value.title = 'عنوان مقاله الزامی است.'
  if (!description.value.trim())
    errors.value.description = 'توضیحات مقاله الزامی است.'
  if (!category.value) errors.value.category = 'دسته‌بندی الزامی است.'
  if (!contentLong.value.trim())
    errors.value.content = 'متن کامل مقاله الزامی است.'
  if (!publishDate.value) errors.value.publishDate = 'تاریخ انتشار الزامی است.'
  return Object.keys(errors.value).length === 0
}

function formatLongContent(html: string) {
  return (
    html
      // Convert divs with # to headings
      .replace(/<div>#+ ([^<]+)<\/div>/g, (_, title) => `# ${title}\n`)
      .replace(/<div>##+ ([^<]+)<\/div>/g, (_, title) => `## ${title}\n`)
      // Convert lists
      .replace(
        /<div>&nbsp; &nbsp;\* ([^<]+)<\/div>/g,
        (_, item) => `* ${item}\n`,
      )
      .replace(/<div>\d+\. ([^<]+)<\/div>/g, (_, item) => `1. ${item}\n`)
      // Convert regular divs to paragraphs
      .replace(/<div>([^<]+)<\/div>/g, (_, text) => `${text}\n`)
      // Clean up
      .replace(/<br>/g, '\n')
      .replace(/&zwnj;/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim()
  )
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
  tags.value = tags.value.filter((t) => t !== tag)
}

function removeAllTags() {
  tags.value = []
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
  return (
    !title.value.trim() &&
    !contentLong.value.trim() &&
    !description.value.trim()
  )
})

// Optional: auto-save on change
import { watch } from 'vue'
watch(
  [
    title,
    description,
    contentLong,
    excerpt,
    slug,
    category,
    tags,
    publishDate,
    readTime,
    isFeatured,
    allowComments,
    secretMessage,
    goals,
  ],
  savePreviewToLocalStorage,
)

function backToPosts() {
  router.push('/posts/list')
}

async function suggestAIField(field: string) {
  switch (field) {
    case 'title':
      titleAiLoading.value = true
      break
    case 'secretMessage':
      secretMessageAiLoading.value = true
      break
    case 'goals':
      goalsAiLoading.value = true
      break
    case 'category':
      categoryAiLoading.value = true
      break
    case 'tags':
      tagsAiLoading.value = true
      break
    case 'excerpt':
      excerptAiLoading.value = true
      break
    case 'slug':
      slugAiLoading.value = true
      break
    case 'contentLong':
      contentLongAiLoading.value = true
      break
  }

  try {
    // For category field, we'll select from predefined categories
    if (field === 'category') {
      const prompt = `با توجه به متن زیر، مناسب‌ترین دسته‌بندی را از بین گزینه‌های زیر انتخاب کن. فقط نام دسته‌بندی را برگردان و هیچ چیز دیگری ننویس.\n\nمتن: ${
        title.value || description.value || 'بدون عنوان'
      }\n\nدسته‌بندی‌های موجود: ${categories.map((c) => c.value).join('، ')}`
      const messages = [{ role: 'user', content: prompt }]

      let suggestion = ''
      categoryAiLoading.value = true

      try {
        await streamChat(messages, {}, (chunk) => {
          const content = chunk
          if (content) {
            suggestion += content
            // Find the best matching category from our predefined list
            const matchedCategory = categories.find(
              (cat) =>
                cat.value
                  .toLowerCase()
                  .includes(suggestion.trim().toLowerCase()) ||
                suggestion
                  .trim()
                  .toLowerCase()
                  .includes(cat.value.toLowerCase()),
            )
            if (matchedCategory) {
              category.value = matchedCategory.value
            }
            console.log(category.value)
          }
        })

        // Show success toast
        toaster.show({
          title: 'موفقیت',
          message: 'دسته‌بندی با موفقیت پیشنهاد شد.',
          color: 'success',
          icon: 'ph:check-circle',
          closable: true,
        })

        return // Exit early after handling category
      } catch (e: any) {
        toaster.show({
          title: 'خطا',
          message: `خطا در دریافت پیشنهاد دسته‌بندی: ${
            e.message || 'خطای ناشناخته'
          }`,
          color: 'danger',
          icon: 'ph:warning',
          closable: true,
        })
        throw e
      } finally {
        categoryAiLoading.value = false
      }
    }

    // For tags field specifically
    if (field === 'tags') {
      const prompt = `چند برچسب مرتبط با این مقاله پیشنهاد بده. فقط برچسب‌ها را با کاما (،) جدا کن و چیز دیگری ننویس.\n\nعنوان: ${
        title.value || 'بدون عنوان'
      }\nتوضیحات: ${description.value || 'بدون توضیحات'}`
      const messages = [{ role: 'user', content: prompt }]

      let suggestion = ''
      tagsAiLoading.value = true

      try {
        // First, collect the complete suggestion
        await new Promise<void>((resolve, reject) => {
          streamChat(messages, {}, (chunk) => {
            if (chunk) {
              suggestion += chunk
            }
          })
            .then(resolve)
            .catch(reject)
        })

        // After complete message is received, process tags
        if (suggestion) {
          // Split by both English and Persian commas, then clean up
          const newTags = suggestion
            .split(/[،,]/)
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)

          // Update tags with new unique values
          if (newTags.length > 0) {
            tags.value = [...new Set(newTags)]
          }
        }

        // Show success toast
        toaster.show({
          title: 'موفقیت',
          message: 'برچسب‌ها با موفقیت پیشنهاد شدند.',
          color: 'success',
          icon: 'ph:check-circle',
          closable: true,
        })

        return // Exit early after handling tags
      } catch (e: any) {
        toaster.show({
          title: 'خطا',
          message: `خطا در دریافت پیشنهاد برچسب‌ها: ${
            e.message || 'خطای ناشناخته'
          }`,
          color: 'danger',
          icon: 'ph:warning',
          closable: true,
        })
        throw e
      } finally {
        tagsAiLoading.value = false
      }
    }

    // For other fields, use the existing logic
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
      title:
        'یک عنوان مناسب برای مقاله پیشنهاد بده که حتماً با ساختار مارک‌داون و با استفاده از # در ابتدای خط نوشته شود. فقط عنوان را به صورت مارک‌داون بازگردان.',
      secretMessage: `یک پیام مخفی کوتاه، بسیار دقیق، مرتبط و عمیق فقط برای همین مقاله پیشنهاد بده. پیام باید کاملاً متناسب با موضوع عنوان و سایر اطلاعات مقاله باشد و به خواننده حس خاص و الهام‌بخش منتقل کند. از پیام‌های کلیشه‌ای و بی‌ربط یا جملات بی‌معنی خودداری کن. فقط یک پیام کاملاً مرتبط و معنی‌دار ارائه بده که واقعا به دل خواننده بنشیند.`,
      tags: 'چند برچسب مرتبط فقط با همین مقاله پیشنهاد بده (با ویرگول جدا کن). فقط لیست برچسب‌ها را بنویس.',
      excerpt:
        'یک خلاصه کوتاه و مناسب فقط برای همین مقاله پیشنهاد بده. فقط خلاصه را بنویس.',
      slug: 'یک اسلاگ مناسب (لاتین و بدون فاصله) فقط برای همین مقاله پیشنهاد بده. فقط اسلاگ را بنویس.',
      readTime:
        'زمان تقریبی مطالعه (بر حسب دقیقه) فقط برای همین مقاله پیشنهاد بده. فقط یک عدد بنویس.',
      description:
        'یک توضیح کوتاه فقط برای همین مقاله پیشنهاد بده. فقط توضیح را بنویس.',
      contentLong: `یک متن کامل و منسجم برای مقاله بنویس. حتماً فقط و فقط با مارک‌داون بنویس. متن باید حداقل ۵۰۰۰ کلمه باشد و تا حد ممکن از ساختارها و امکانات مختلف مارک‌داون (سرفصل، لیست، چک‌لیست، نقل‌قول، جدول، کد، تصویر، پیوند و غیره) استفاده کن. پاسخ نهایی باید حتماً ساختار مارک‌داون داشته باشد و نشانه‌های مارک‌داون (مثل # برای عنوان، - یا * برای لیست و ...) به‌درستی رعایت شود. مثال‌های زیر را برای تنوع ساختار ببین:
${markdownGuide}`,
      goals:
        'اهداف آموزشی و روانشناختی مقاله را بنویسید. هدف روانشناس از نگارش مقاله، دستاوردها و مطالبی که خواننده یاد می‌گیرد را اینجا بنویسید...',
    }
    const prompt = prompts[field] || 'یک مقدار مناسب پیشنهاد بده.'
    const userContent = context[field]
    const messages = [
      {
        role: 'user',
        content: userContent
          ? `${prompt}\nمقدار فعلی: ${userContent}\nاطلاعات دیگر مقاله:\n${contextString}`
          : `${prompt}\nاطلاعات دیگر مقاله:\n${contextString}`,
      },
    ]
    try {
      let suggestion = ''
      // For all fields, update in real-time as chunks arrive
      const initialContent = getFieldValue(field)

      // Create a promise that resolves when streaming is complete
      await new Promise((resolve, reject) => {
        streamChat(messages, {}, (chunk) => {
          const content = chunk
          if (content) {
            suggestion += content

            // Update the field in real-time
            switch (field) {
              case 'title':
                title.value = (initialContent + ' ' + suggestion).trim()
                break
              case 'description':
                description.value = (initialContent + ' ' + suggestion).trim()
                break
              case 'excerpt':
                excerpt.value = (initialContent + ' ' + suggestion).trim()
                break
              case 'slug':
                slug.value = (initialContent + ' ' + suggestion).trim()
                break
              // case 'category':
              //   category.value = (initialContent + ' ' + suggestion).trim()
              //   break
              case 'secretMessage':
                secretMessage.value = (initialContent + ' ' + suggestion).trim()
                break
              case 'goals':
                goals.value = (initialContent + '\n' + suggestion).trim()
                break
              case 'contentLong':
                contentLong.value = (initialContent + '\n' + suggestion).trim()
                break
              case 'tags':
                const newTags =
                  (initialContent ? initialContent + ', ' : '') + suggestion
                tags.value = newTags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                break
            }
          }
        })
          .then(resolve)
          .catch(reject)
      })

      // Show success toast
      toaster.show({
        title: 'موفقیت',
        message: `پیشنهاد هوش مصنوعی با موفقیت اعمال شد.`,
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      })
    } catch (e: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در دریافت پیشنهاد هوش مصنوعی: ${
          e.message || 'خطای ناشناخته'
        }`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      })
      throw e // Re-throw to be caught by outer try-catch
    }
  } finally {
    // Ensure loading state is always reset
    switch (field) {
      case 'title':
        titleAiLoading.value = false
        break
      case 'secretMessage':
        secretMessageAiLoading.value = false
        break
      case 'goals':
        goalsAiLoading.value = false
        break
      case 'category':
        categoryAiLoading.value = false
        break
      case 'tags':
        tagsAiLoading.value = false
        break
      case 'excerpt':
        excerptAiLoading.value = false
        break
      case 'slug':
        slugAiLoading.value = false
        break
      case 'contentLong':
        contentLongAiLoading.value = false
        break
    }
  }
}
function getFieldValue(field) {
  switch (field) {
    case 'title':
      return title.value
    case 'description':
      return description.value
    case 'excerpt':
      return excerpt.value
    case 'slug':
      return slug.value
    case 'category':
      return category.value
    case 'tags':
      return tags.value.join('، ')
    case 'secretMessage':
      return secretMessage.value
    case 'contentLong':
      return contentLong.value
    case 'goals':
      return goals.value
    // ...other fields
    default:
      return ''
  }
}
function setFieldValue(field, value) {
  switch (field) {
    case 'tags':
      // اگر مقدار یک رشته است، به آرایه جداگانه تبدیل کن:
      if (typeof value === 'string') {
        tags.value = value
          .split('،')
          .map((t) => t.trim())
          .filter(Boolean)
      } else if (Array.isArray(value)) {
        tags.value = value
      } else {
        tags.value = []
      }
      break
    case 'title':
      title.value = value
      break
    case 'description':
      description.value = value
      break
    case 'excerpt':
      excerpt.value = value
      break
    case 'slug':
      slug.value = value
      break
    case 'category':
      category.value = value
      break
    case 'secretMessage':
      secretMessage.value = value
      break
    case 'contentLong':
      contentLong.value = value
      break
    case 'goals':
      goals.value = value
      break
    // ...other fields
  }
}
const showMarkdownAiEdit = ref(false)
const selectedMarkdownText = ref('')
const markdownAiEditDesc = ref('')
const markdownTextarea = ref<HTMLTextAreaElement | null>(null)

// Floating menu state
const showFloatingMenu = ref(false)
const floatingMenuPosition = ref({ x: 0, y: 0 })
const selectedTextRange = ref({ start: 0, end: 0 })

// Track which AI action is currently active
const activeAction = ref('')

// Custom AI actions configuration
const aiActions = ref([
  {
    icon: 'ph:sparkle',
    action: 'improve',
    title: 'بهبود متن',
    loading: false,
    prompt:
      'متن زیر را بهبود بده و آن را خواناتر و جذاب‌تر کن. متن را به فارسی روان و واضح بازنویسی کن:\n\n{text}',
  },
  {
    icon: 'ph:arrows-out-simple',
    action: 'simplify',
    title: 'ساده‌نویسی',
    loading: false,
    prompt:
      'متن زیر را ساده‌نویسی کن تا برای مخاطب عادی قابل فهم‌تر باشد. از کلمات و جملات ساده‌تر استفاده کن:\n\n{text}',
  },
  {
    icon: 'ph:arrows-in',
    action: 'expand',
    title: 'بسط دادن',
    loading: false,
    prompt:
      'متن زیر را با جزئیات بیشتر و توضیحات تکمیلی گسترش بده. حدود ۱.۵ تا ۲ برابر طولانی‌تر شود:\n\n{text}',
  },
  {
    icon: 'ph:note-pencil',
    action: 'summarize',
    title: 'خلاصه‌نویسی',
    loading: false,
    prompt:
      'متن زیر را به صورت خلاصه و مختصر بازنویسی کن. فقط نکات کلیدی و مهم را حفظ کن:\n\n{text}',
  },
])

// ویرایشگر عملیات هوش مصنوعی
const showActionEditor = ref(false)
const editingActionIndex = ref(null)
const editingAction = ref({})

// تابع ذخیره تغییرات عملیات
const saveActionEdit = () => {
  if (editingActionIndex.value !== null) {
    aiActions.value[editingActionIndex.value] = { ...editingAction.value }
    cancelActionEdit()
  }
}

// تابع لغو ویرایش عملیات
const cancelActionEdit = () => {
  editingActionIndex.value = null
  editingAction.value = {}
  showActionEditor.value = false
}

function openActionEditor() {
  showActionEditor.value = true
  editingActionIndex.value = -1
  editingAction.value = {
    icon: '',
    action: '',
    title: '',
    prompt: '',
    loading: false,
  }
}
const newAction = ref({
  icon: '',
  action: '',
  title: '',
  prompt: '',
  loading: false,
})

function openMarkdownAiEditPopup() {
  showMarkdownAiEdit.value = true
}

// Delete an AI action button
function deleteAction(index) {
  aiActions.value.splice(index, 1)
  // Reset editing state if we're editing the deleted action
  if (editingActionIndex.value === index) {
    cancelEdit()
  }
}

// Save a new or edited AI action button
function saveAction() {
  if (!editingAction.value) return

  // Validate required fields
  if (
    !editingAction.value.title ||
    !editingAction.value.action ||
    !editingAction.value.icon ||
    !editingAction.value.prompt
  ) {
    return
  }

  if (editingActionIndex.value > -1) {
    // Update existing action
    aiActions.value[editingActionIndex.value] = { ...editingAction.value }
  } else {
    // Add new action
    aiActions.value.push({ ...editingAction.value })
  }

  // Show success toast
  toaster.show({
    title: 'انجام شد',
    message:
      editingActionIndex.value > -1
        ? 'دکمه هوش مصنوعی با موفقیت به‌روزرسانی شد'
        : 'دکمه هوش مصنوعی جدید با موفقیت اضافه شد',
    color: 'success',
    icon: 'ph:check-circle',
    timeout: 3000,
  })

  // Reset editing state
  cancelEdit()
}

// Cancel editing and reset form
function cancelEdit() {
  editingAction.value = {
    icon: '',
    action: '',
    title: '',
    prompt: '',
    loading: false,
  }
  editingActionIndex.value = -1
}
function applyMarkdownAiEdit() {
  // Call AI API with selectedMarkdownText and markdownAiEditDesc
  const prompt = `یک پاراگراف مارک‌داون برای این متن پیشنهاد بده.\nمتن فعلی:\n${selectedMarkdownText.value}\nتوضیحات:\n${markdownAiEditDesc.value}`
  const messages = [{ role: 'user', content: prompt }]
  streamChat(messages, {}, (chunk) => {
    const suggestion = chunk
    contentLong.value = contentLong.value.replace(
      selectedMarkdownText.value,
      suggestion,
    )
    showMarkdownAiEdit.value = false
    markdownAiEditDesc.value = ''
    selectedMarkdownText.value = ''
  })
}
// Handle text selection in markdown textarea
function handleMarkdownSelection(event: Event) {
  // We need to use setTimeout to ensure the selection is stable
  setTimeout(() => {
    const textarea = markdownTextarea.value?.$el?.querySelector('textarea')
    if (!textarea) {
      selectedMarkdownText.value = ''
      showFloatingMenu.value = false
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start !== end) {
      const selectedText = textarea.value.substring(start, end).trim()
      if (selectedText) {
        console.log('Selected text:', selectedText) // Debug log
        selectedMarkdownText.value = selectedText
        selectedTextRange.value = { start, end }

        // Show the inline buttons when text is selected
        showFloatingMenu.value = true
        return
      }
    }

    // No valid selection
    selectedMarkdownText.value = ''
    showFloatingMenu.value = false
  }, 10) // Small delay to ensure selection is available
}

// Handle AI rewrite actions
async function handleAIAction(action: string) {
  // Set active action for highlighting
  activeAction.value = action
  const textarea = markdownTextarea.value?.$el?.querySelector('textarea')
  if (!textarea) return

  const { start, end } = selectedTextRange.value
  const selectedText = textarea.value.substring(start, end)

  // Create a local loading state for this action
  const actionLoading = ref(true)

  try {
    // Find the action configuration
    const actionConfig = aiActions.value.find((a) => a.action === action)
    if (!actionConfig) return

    // Use the prompt from the action configuration
    let prompt = actionConfig.prompt.replace('{text}', selectedText)

    const messages = [{ role: 'user', content: prompt }]

    let result = ''

    // Show loading state in toast notification
    const toastId = toaster.show({
      title: 'در حال پردازش',
      message: `بازنویسی متن با ${
        action === 'improve'
          ? 'بهبود'
          : action === 'simplify'
          ? 'ساده‌سازی'
          : action === 'expand'
          ? 'بسط'
          : 'خلاصه‌سازی'
      }...`,
      color: 'info',
      icon: 'svg-spinners:90-ring-with-bg',
      closable: true,
      timeout: 0,
    }).id

    // Call AI API
    await streamChat(messages, {}, (chunk) => {
      result += chunk // Accumulate chunks instead of replacing
    })

    // Update the textarea with the AI result
    if (result) {
      const currentValue = textarea.value
      const beforeText = currentValue.substring(0, start)
      const afterText = currentValue.substring(end)
      contentLong.value = beforeText + result + afterText

      // Show success toast (skip clearing previous toast as it causes errors)
      toaster.show({
        title: 'انجام شد',
        message: 'متن با موفقیت بازنویسی شد',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
        timeout: 3000,
      })
    }
  } catch (error) {
    console.error('AI rewrite error:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در پردازش متن. لطفاً دوباره امتحان کنید.',
      color: 'danger',
      icon: 'ph:warning-circle',
      closable: true,
    })
  } finally {
    // Hide buttons after action completes
    showFloatingMenu.value = false
    textarea.focus()
    // Reset active action
    activeAction.value = ''
  }
}
// Show/hide clear confirmation modal
const showClearConfirm = ref(false)

// Reset all form fields
function resetForm() {
  title.value = ''
  description.value = ''
  excerpt.value = ''
  slug.value = ''
  readTime.value = ''
  category.value = ''
  secretMessage.value = ''
  contentLong.value = ''
  goals.value = ''
  tags.value = []
  uploadedFiles.value = null

  // Close the modal after resetting
  showClearConfirm.value = false

  // Show success message
  toaster.show({
    title: 'موفقیت',
    message: 'همه‌ی فیلدهای فرم با موفقیت پاک شدند',
    icon: 'ph:check-circle',
    color: 'success',
    timeout: 3000,
  })
}

// Load preview data from localStorage
const loadPreviewFromLocalStorage = () => {
  const savedData = localStorage.getItem('postPreview')
  if (savedData) {
    const data = JSON.parse(savedData)
    title.value = data.title || ''
    description.value = data.description || ''
    contentLong.value = data.contentLong || ''
    excerpt.value = data.excerpt || ''
    slug.value = data.slug || ''
    category.value = data.category || ''
    tags.value = data.tags || []
    publishDate.value = data.publishDate || ''
    readTime.value = data.readTime || ''
    isFeatured.value = data.isFeatured || false
    allowComments.value = data.allowComments ?? true
    secretMessage.value = data.secretMessage || ''
    goals.value = data.goals || ''
    uploadedFiles.value = data.uploadedFiles || null
  }
}

// Attach selection handler and load saved data
onMounted(() => {
  // Need to wait until the DOM is fully loaded
  setTimeout(() => {
    const textarea = markdownTextarea.value?.$el?.querySelector('textarea')
    if (textarea) {
      console.log('Adding event listeners to textarea')
      textarea.addEventListener('mouseup', handleMarkdownSelection)
      textarea.addEventListener('keyup', handleMarkdownSelection)
      textarea.addEventListener('click', handleMarkdownSelection)
      textarea.addEventListener('select', handleMarkdownSelection)
    } else {
      console.warn('Textarea element not found')
    }
  }, 500) // Give it some time to render

  // Load saved data when component mounts
  loadPreviewFromLocalStorage()
})

const generateGoalsListAI = async () => {
  generateGoalsAiLoading.value = true

  try {
    const topic = title.value.trim()
    if (!topic) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا عنوان مقاله را وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      })
      return
    }

    goals.value = ''
    const prompt = `با توجه به عنوان مقاله زیر، یک لیست از اهداف آموزشی و روانشناختی مرتبط با همان عنوان که خواننده پس از مطالعه این مقاله به دست می‌آورد به زبان فارسی بنویس. تاکید: خروجی باید فقط یک لیست باشد و هر هدف در یک خط مجزا نوشته شود.\nعنوان مقاله: ${topic}`

    const messages = [
      {
        role: 'system',
        content: 'شما یک دستیار متخصص تولید محتوای روانشناسی هستید.',
      },
      { role: 'user', content: prompt },
    ]

    const { streamChat } = useOpenRouter()
    let result = ''

    await streamChat(messages, {}, (chunk) => {
      const content = chunk
      result += content
      goals.value = result // Update in real-time
    })

    toaster.show({
      title: 'موفقیت',
      message: 'اهداف آموزشی با موفقیت تولید شدند.',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    })
  } catch (e: any) {
    toaster.show({
      title: 'خطا',
      message: `خطا در تولید اهداف: ${e.message || 'خطای ناشناخته'}`,
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
    goals.value = 'خطا در دریافت اهداف از هوش مصنوعی.'
    throw e
  } finally {
    generateGoalsAiLoading.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/posts/list"
          class="text-primary-500 hover:text-primary-600"
        >
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
                          :disabled="titleAiLoading"
                          @click="suggestAIField('title')"
                        >
                          <Icon
                            v-if="!titleAiLoading"
                            name="ph:sparkle"
                            class="size-4"
                          />
                          <Icon
                            v-else
                            name="svg-spinners:90-ring-with-bg"
                            class="size-4 animate-spin"
                          />
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
                          :disabled="secretMessageAiLoading"
                          @click="suggestAIField('secretMessage')"
                        >
                          <Icon
                            v-if="!secretMessageAiLoading"
                            name="ph:sparkle"
                            class="size-4"
                          />
                          <Icon
                            v-else
                            name="svg-spinners:90-ring-with-bg"
                            class="size-4 animate-spin"
                          />
                        </button>
                      </template>
                    </BaseInput>
                  </div>
                </div>
                <!-- Educational and Psychological Goals -->
                <div class="mb-6">
                  <div class="mb-2 flex items-center justify-between">
                    <label
                      class="text-muted-800 dark:text-muted-100 font-semibold"
                      >اهداف آموزشی و روانشناختی مقاله</label
                    >
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="generateGoalsAiLoading"
                      @click="generateGoalsListAI"
                    >
                      <Icon
                        v-if="!generateGoalsAiLoading"
                        name="ph:sparkle"
                        class="size-4"
                      />
                      <Icon
                        v-else
                        name="svg-spinners:90-ring-with-bg"
                        class="size-4 animate-spin"
                      />
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
                        :disabled="goalsAiLoading"
                        @click="suggestAIField('goals')"
                      >
                        <Icon
                          v-if="!goalsAiLoading"
                          name="ph:sparkle"
                          class="size-4"
                        />
                        <Icon
                          v-else
                          name="svg-spinners:90-ring-with-bg"
                          class="size-4 animate-spin"
                        />
                      </button>
                    </template>
                  </BaseTextarea>
                  <div class="text-primary-600 mt-1 text-xs">
                    (تأکید: خروجی حتماً باید به صورت لیست اهداف باشد)
                  </div>
                </div>
                <!-- Category Selection -->
                <div class="mb-6">
                  <div class="mb-2 flex items-center justify-between">
                    <label
                      class="text-muted-800 dark:text-muted-100 font-semibold"
                      >دسته بندی {{ category }}</label
                    >
                    <button
                      type="button"
                      class="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm transition-colors duration-300"
                      :disabled="categoryAiLoading"
                      @click="suggestAIField('category')"
                    >
                      <Icon
                        v-if="!categoryAiLoading"
                        name="ph:sparkle"
                        class="size-4"
                      />
                      <Icon
                        v-else
                        name="svg-spinners:90-ring-with-bg"
                        class="size-4 animate-spin"
                      />
                    </button>
                  </div>
                  <div
                    class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
                  >
                    <BaseRadioHeadless
                      v-for="cat in categories"
                      :key="cat.value"
                      v-model="category"
                      :name="'category'"
                      :value="cat.value"
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
                  <div
                    v-if="errors.category"
                    class="text-danger-500 mt-1 text-sm"
                  >
                    {{ errors.category }}
                  </div>
                </div>

                <!-- Tags -->
                <div
                  class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 mb-6 rounded-xl border bg-white p-4"
                >
                  <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Icon name="ph:tag" class="text-primary-500 size-5" />
                      <h3
                        class="text-muted-800 text-lg font-medium dark:text-white"
                      >
                        برچسب‌ها
                      </h3>
                      <button
                        type="button"
                        data-nui-tooltip="پیشنهاد هوش مصنوعی"
                        class="text-muted-400 hover:text-primary-500 ml-2 flex size-8 items-center justify-center transition-colors duration-300"
                        :disabled="tagsAiLoading"
                        @click="suggestAIField('tags')"
                      >
                        <Icon
                          v-if="!tagsAiLoading"
                          name="ph:sparkle"
                          class="size-4"
                        />
                        <Icon
                          v-else
                          name="svg-spinners:90-ring-with-bg"
                          class="size-4 animate-spin"
                        />
                      </button>
                    </div>
                    <button
                      v-if="tags.length > 0"
                      type="button"
                      class="text-danger-500 hover:text-danger-600 flex items-center gap-1 text-sm transition-colors"
                      @click="removeAllTags"
                    >
                      <Icon name="ph:trash" class="size-4" />
                      <span>حذف همه</span>
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
                    <BaseButton color="primary" size="sm" @click="addTag">
                      افزودن
                    </BaseButton>
                  </div>
                </div>

                <!-- Image Upload with Preview (Headless) -->
                <div class="mb-6 w-full">
                  <label
                    class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold"
                    >تصویر مقاله (آپلود)</label
                  >
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
                          <Icon
                            name="mdi-light:cloud-upload"
                            class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 mb-2 size-10 transition-colors duration-300"
                          />
                          <h4 class="text-muted-400 font-sans text-sm">
                            فایل تصویر را بکشید و رها کنید
                          </h4>
                          <div>
                            <span
                              class="text-muted-400 font-sans text-[0.7rem] font-semibold uppercase"
                              >یا</span
                            >
                          </div>
                          <label
                            class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 cursor-pointer font-sans text-sm underline underline-offset-4 transition-colors duration-300"
                            >انتخاب فایل</label
                          >
                        </div>
                      </div>
                      <ul v-else class="mt-6 space-y-2">
                        <li v-for="file in files" :key="file.name">
                          <div
                            class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative flex items-center justify-end gap-2 rounded-xl border bg-white p-3"
                          >
                            <div class="flex items-center gap-2">
                              <div class="shrink-0">
                                <img
                                  v-if="file.type.startsWith('image')"
                                  class="size-14 rounded-xl object-cover object-center"
                                  :src="preview(file).value"
                                  alt="Image preview"
                                />
                                <img
                                  v-else
                                  class="size-14 rounded-xl object-cover object-center"
                                  src="/img/avatars/placeholder-file.png"
                                  alt="Image preview"
                                />
                              </div>
                              <div class="font-sans">
                                <span
                                  class="text-muted-800 dark:text-muted-100 line-clamp-1 block text-sm"
                                  >{{ file.name }}</span
                                >
                                <span class="text-muted-400 block text-xs">{{
                                  formatFileSize(file.size)
                                }}</span>
                              </div>
                            </div>
                            <div class="flex gap-2">
                              <button
                                class="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex size-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                                type="button"
                                tooltip="Remove"
                                @click.prevent="remove(file)"
                              >
                                <Icon name="lucide:x" class="size-4" /><span
                                  class="sr-only"
                                  >Remove</span
                                >
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
                      :disabled="excerptAiLoading"
                      @click="suggestAIField('excerpt')"
                    >
                      <Icon
                        v-if="!excerptAiLoading"
                        name="ph:sparkle"
                        class="size-5"
                      />
                      <Icon
                        v-else
                        name="svg-spinners:90-ring-with-bg"
                        class="size-5 animate-spin"
                      />
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
                      :disabled="slugAiLoading"
                      @click="suggestAIField('slug')"
                    >
                      <Icon
                        v-if="!slugAiLoading"
                        name="ph:sparkle"
                        class="size-4"
                      />
                      <Icon
                        v-else
                        name="svg-spinners:90-ring-with-bg"
                        class="size-4 animate-spin"
                      />
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
                    <label
                      class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold"
                      >تاریخ انتشار</label
                    >
                    <PersianCalendar v-model="publishDate" class="w-full" />
                    <div
                      v-if="errors.publishDate"
                      class="text-danger-500 mt-1 text-sm"
                    >
                      {{ errors.publishDate }}
                    </div>
                  </div>
                  <div>
                    <label
                      class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold"
                      >زمان مطالعه (دقیقه)</label
                    >
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
                    <label
                      class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold"
                      >متن کامل مقاله (مارک‌داون)</label
                    >
                    <button
                      type="button"
                      data-nui-tooltip="پیشنهاد هوش مصنوعی"
                      class="text-muted-400 hover:text-primary-500 ml-2 flex size-8 items-center justify-center transition-colors duration-300"
                      :disabled="contentLongAiLoading"
                      @click="suggestAIField('contentLong')"
                    >
                      <Icon
                        v-if="!contentLongAiLoading"
                        name="ph:sparkle"
                        class="size-4"
                      />
                      <Icon
                        v-else
                        name="svg-spinners:90-ring-with-bg"
                        class="size-4 animate-spin"
                      />
                    </button>
                  </div>
                  <BaseTextarea
                    ref="markdownTextarea"
                    v-model="contentLong"
                    label=""
                    placeholder="متن کامل مقاله را وارد کنید... (Markdown)"
                    rows="12"
                    icon="ph:file-text"
                    :error="errors.contentLong"
                    class="mb-6"
                    @mouseup="handleMarkdownSelection"
                    @keyup="handleMarkdownSelection"
                    @click="handleMarkdownSelection"
                    addon
                    @select="handleMarkdownSelection"
                  >
                    <template #addon>
                      <span
                        class="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400"
                      >
                        برای بهبود متن، بخشی از آن را انتخاب نمایید
                      </span>

                      <div class="mb-1 flex flex-wrap gap-1">
                        <button
                          v-for="action in aiActions"
                          :key="action.action"
                          :disabled="processing || !selectedMarkdownText"
                          :class="[
                            'flex items-center gap-1 px-2 py-1 text-xs text-right rounded-md transition-colors border',
                            activeAction === action.action
                              ? 'bg-primary-100 border-primary-500 dark:bg-primary-900 dark:border-primary-500'
                              : 'border-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700',
                          ]"
                          :title="action.title"
                          @click="handleAIAction(action.action)"
                        >
                          <Icon
                            v-if="processing"
                            name="svg-spinners:90-ring-with-bg"
                            class="size-3 flex-shrink-0"
                          />
                          <Icon
                            v-else
                            :name="action.icon"
                            class="text-primary-500 size-3 flex-shrink-0"
                          />
                          <span>{{ action.title }}</span>
                        </button>
                      </div>
                    </template>
                  </BaseTextarea>
                  <!-- Markdown Preview -->
                  <div
                    v-if="contentLong"
                    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800/50 rounded-xl border p-4"
                  >
                    <div class="mb-2 flex items-center gap-2">
                      <Icon name="ph:eye" class="text-primary-500 size-4" />
                      <h3
                        class="text-muted-800 text-sm font-medium dark:text-white"
                      >
                        پیش‌نمایش
                      </h3>
                    </div>
                    <div
                      class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl max-w-none"
                    >
                      <div
                        class="text-muted-500 dark:text-muted-400 leading-relaxed"
                      >
                        <AddonMarkdownRemark
                          :source="formatLongContent(contentLong)"
                        />
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
        <BaseCard
          rounded="xl"
          class="mb-6 border border-[#E5D8FA] bg-[#F6F0FF] p-4 shadow-sm"
        >
          <div class="grid grid-cols-2 gap-3">
            <!-- Row 1 -->
            <BaseButton
              color="muted"
              :loading="loading"
              :disabled="loading"
              class="w-full rounded-xl px-4 py-3 text-base font-bold"
              @click="backToPosts"
            >
              <Icon name="ph:arrow-right" class="ml-2 size-4" />
              انصراف
            </BaseButton>
            <BaseButton
              color="info"
              :disabled="loading || isPreviewDisabled"
              class="w-full rounded-xl px-4 py-3 text-base font-bold"
              @click="goToPreview"
            >
              <Icon name="ph:eye" class="ml-2 size-4" />
              پیش‌نمایش
            </BaseButton>

            <!-- Row 2 -->
            <BaseButton
              color="primary"
              :loading="loading"
              :disabled="loading"
              class="w-full rounded-xl px-4 py-3 text-base font-bold"
              @click="submit"
            >
              <Icon name="ph:check-circle" class="ml-2 size-4" />
              ایجاد
            </BaseButton>
            <BaseButton
              color="danger"
              :disabled="!title.trim()"
              class="w-full rounded-xl px-4 py-3 text-base font-bold"
              @click="showClearConfirm = true"
            >
              <Icon name="ph:trash" class="ml-2 size-4" />
              پاک کردن همه
            </BaseButton>
            <BaseButton
              title="ویرایش دکمه‌های هوش مصنوعی"
              class="mb-2 flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-right text-xs transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              @click="openActionEditor"
            >
              <Icon
                name="ph:pencil-simple"
                class="text-primary-500 size-3 flex-shrink-0"
              />
              <span>ویرایش دکمه‌ها</span>
            </BaseButton>
          </div>
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

  <!-- Clear All Confirmation Modal -->
  <TairoModal
    :open="showClearConfirm"
    size="sm"
    @close="showClearConfirm = false"
    rounded="lg"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4">
        <h2 class="text-danger-500 text-lg font-bold">
          <Icon name="ph:warning-circle" class="mr-2 inline-block size-5" />
          پاک کردن همه‌ی اطلاعات
        </h2>
        <button
          type="button"
          class="text-muted-400 hover:text-muted-500 dark:hover:text-muted-300 transition-colors"
          @click="showClearConfirm = false"
        >
          <Icon name="ph:x" class="size-5" />
        </button>
      </div>
    </template>

    <div class="px-6 pb-6">
      <div class="mb-6">
        <p class="text-muted-600 dark:text-muted-400 text-sm leading-relaxed">
          آیا مطمئن هستید که می‌خواهید همه‌ی اطلاعات فرم را پاک کنید؟ این عمل
          تمامی متن‌ها، تصاویر و تنظیمات وارد شده را حذف خواهد کرد.
        </p>
      </div>

      <div class="flex items-center justify-end gap-3">
        <BaseButton
          color="muted"
          variant="pastel"
          class="px-4 py-2 text-sm font-medium"
          @click="showClearConfirm = false"
        >
          <Icon name="ph:arrow-counter-clockwise" class="ml-1.5 size-4" />
          انصراف
        </BaseButton>
        <BaseButton
          color="danger"
          class="px-4 py-2 text-sm font-medium"
          @click="resetForm"
        >
          <Icon name="ph:trash" class="ml-1.5 size-4" />
          بله، پاک کن
        </BaseButton>
      </div>
    </div>
  </TairoModal>

  <!-- Markdown AI edit popup -->
  <TairoModal v-model="showMarkdownAiEdit" size="md">
    <template #header>
      <h2 class="text-lg font-bold">ویرایش هوشمند بخش انتخابی</h2>
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

  <!-- AI Action Editor Modal -->
  <TairoModal
    :open="showActionEditor"
    size="sm"
    @close="showActionEditor = false"
    rounded="lg"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4">
        <h2 class="text-primary-500 text-lg font-bold">
          <Icon name="ph:sparkle" class="mr-2 inline-block size-5" />
          ویرایش عملیات هوش مصنوعی
        </h2>
        <button
          type="button"
          class="text-muted-400 hover:text-muted-500 dark:hover:text-muted-300 transition-colors"
          @click="showActionEditor = false"
        >
          <Icon name="ph:x" class="size-5" />
        </button>
      </div>
    </template>

    <div class="px-6 pb-6">
      <div v-if="editingActionIndex !== null">
        <div class="mb-4">
          <BaseInput
            v-model="editingAction.icon"
            label="آیکون"
            placeholder="نام آیکون (مثال: ph:sparkle)"
          />
        </div>

        <div class="mb-4">
          <BaseInput
            v-model="editingAction.title"
            label="عنوان"
            placeholder="عنوان عملیات"
          />
        </div>

        <div class="mb-4">
          <BaseInput
            v-model="editingAction.action"
            label="کد عملیات"
            placeholder="نام کوتاه انگلیسی عملیات"
          />
        </div>

        <div class="mb-4">
          <BaseTextarea
            v-model="editingAction.prompt"
            label="پرامپت"
            placeholder="متن پرامپت برای ارسال به هوش مصنوعی"
            rows="6"
          />
        </div>

        <div class="flex items-center justify-end gap-3">
          <BaseButton
            color="muted"
            variant="pastel"
            class="px-4 py-2 text-sm font-medium"
            @click="cancelActionEdit"
          >
            <Icon name="ph:arrow-counter-clockwise" class="ml-1.5 size-4" />
            انصراف
          </BaseButton>
          <BaseButton
            color="primary"
            class="px-4 py-2 text-sm font-medium"
            @click="saveActionEdit"
          >
            <Icon name="ph:check" class="ml-1.5 size-4" />
            ذخیره تغییرات
          </BaseButton>
        </div>
      </div>
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
