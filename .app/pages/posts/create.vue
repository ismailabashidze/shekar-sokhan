<script setup lang="ts">
// --- راهنمای جامع مارک‌داون برای ایجاد محتوای متنوع و تأثیرگذار ---
const markdownGuide = `# راهنمای کامل نگارش مارک‌داون

## ساختار سرفصل‌ها (استفاده اجباری)
# عنوان اصلی مقاله (H1) - فقط یکی
## سرفصل اصلی (H2) - برای بخش‌های اصلی
### زیرعنوان (H3) - برای زیربخش‌ها  
#### جزئیات (H4) - برای نکات خاص
##### نکته فرعی (H5)
###### جزئیات کوچک (H6)

## انواع تأکیدات متنی (استفاده کنید)
- **متن پررنگ و مهم** با **متن**
- *متن مورب برای تأکید* با *متن*
- ***متن بسیار مهم*** با ***متن***
- ~~متن اشتباه یا منسوخ~~ با ~~متن~~
- \`کد یا اصطلاح خاص\` با \`کد\`
- ==متن برجسته== با ==متن==

## انواع لیست‌ها (حتماً استفاده کنید)
### لیست نامرتب برای نکات کلیدی
- نکته اول
  - جزئیات نکته اول
    - زیرجزئیات
  - جزئیات دیگر
- نکته دوم
* می‌توانید از * استفاده کنید
+ یا از + برای تنوع

### لیست مرتب برای مراحل و گام‌ها
1. مرحله اول
2. مرحله دوم
   1. زیرمرحله اول
   2. زیرمرحله دوم
3. مرحله سوم

### چک‌لیست عملی (بسیار مفید)
- [ ] کار انجام نشده
- [x] کار انجام شده
- [ ] تمرین شماره ۱
- [ ] تمرین شماره ۲

## نقل‌قول‌های الهام‌بخش (استفاده کنید)
> این یک نقل‌قول ساده است

> نقل‌قول چندخطی
> که ادامه دارد
> و بیشتر تأثیرگذار است

>> نقل‌قول تو در تو
>> برای تأکید بیشتر

> **نقل‌قول پررنگ**
> *برای جملات کلیدی*

## جدول‌های کاربردی (حتماً استفاده کنید)
### جدول ساده
| موضوع | توضیح | مثال |
|--------|-------|-------|
| مفهوم اول | توضیح اول | نمونه اول |
| مفهوم دوم | توضیح دوم | نمونه دوم |

### جدول با تراز متن
| راست | وسط | چپ |
|------:|:----:|:----|
| راست‌چین | وسط‌چین | چپ‌چین |
| ۱۲۳ | ۴۵۶ | ۷۸۹ |

## کدها و مثال‌ها
### کد تک خطی
برای \`متغیر خاص\` یا \`کلیدواژه\` استفاده کنید.

### کد چندخطی
\`\`\`
این یک مثال کد است
که چندین خط دارد
و قابل خواندن است
\`\`\`

## پیوندها و ارجاعات
- [لینک ساده](https://example.com)
- [لینک با توضیح](https://example.com "توضیح ضروری")
- [لینک داخلی](#بخش-مربوطه)
- <https://example.com> برای نمایش مستقیم
- [لینک مرجع][1] برای ارجاع

[1]: https://example.com "توضیح مرجع"

## تصاویر و رسانه
![توضیح مهم تصویر](https://picsum.photos/400/200 "عنوان تصویر")

[![تصویر با لینک](https://picsum.photos/200/100)](https://example.com)

## خطوط جداکننده (برای بخش‌بندی)
---
***
___

## ترکیبات پیشرفته
### لیست با نقل‌قول
1. نکته اول
   > نقل‌قول مربوطه
2. نکته دوم
   > نقل‌قول دیگر

### جدول با لیست
| عنوان | جزئیات |
|--------|---------|
| مورد اول | - نکته ۱<br>- نکته ۲ |
| مورد دوم | - نکته ۳<br>- نکته ۴ |

## پانویس‌ها برای ارجاعات
متن با پانویس[^1] و ارجاع دیگر[^مرجع-مهم]

[^1]: توضیح کامل در پانویس
[^مرجع-مهم]: مرجع مهم و معتبر

## نکات مهم برای مقالات روانشناسی:
- از سرفصل‌بندی منطقی استفاده کنید
- نقل‌قول‌های الهام‌بخش بگنجانید  
- چک‌لیست‌های عملی ارائه دهید
- جدول‌های مقایسه‌ای بسازید
- از تأکیدات متنی برای نکات کلیدی استفاده کنید
- بخش‌ها را با خط افقی از هم جدا کنید
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
const { createPost, loading: postsLoading, error: postsError } = usePosts()
const { user } = useUser()

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
const syncAllFieldsLoading = ref(false)

// کنترل طول متن
const contentLengthTarget = ref(5000) // طول پیش‌فرض ۵۰۰۰ کلمه
const minContentLength = 1000
const maxContentLength = 15000

// تولید و افزودن تصویر
const imageGenerationLoading = ref(false)
const showImageModal = ref(false)
const selectedTextForImage = ref('')
const imageCaption = ref('')
const imagePrompt = ref('')

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

  try {
    // تبدیل tags از رشته به آرایه اگر ضروری باشد
    const tagsArray = Array.isArray(tags.value) ? tags.value : []

    // داده‌های مقاله برای ایجاد
    const postData = {
      title: title.value.trim(),
      description: description.value.trim(),
      secretMessage: secretMessage.value.trim() || undefined,
      goals: goals.value.trim() || undefined,
      excerpt: excerpt.value.trim() || undefined,
      contentLong: contentLong.value.trim(),
      category: category.value,
      tags: tagsArray,
      slug: slug.value.trim() || undefined,
      publishDate: publishDate.value || new Date().toISOString().split('T')[0],
      readTime: readTime.value ? parseInt(readTime.value) : undefined,
      featuredImage: uploadedFiles.value?.[0] || null,
      isFeatured: isFeatured.value || false,
      allowComments: allowComments.value !== false,
      status: 'draft' as const, // پیش‌فرض روی draft
      contentLengthTarget: contentLengthTarget.value || undefined,
      author: user.value?.id || '',
      viewCount: 0,
      likeCount: 0,
    }

    // ایجاد مقاله با استفاده از کامپوزبل
    const newPost = await createPost(postData)

    success.value = true

    // نمایش پیام موفقیت
    toaster.show({
      title: 'موفقیت آمیز',
      message: 'مقاله با موفقیت ایجاد شد',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    })

    // انتقال به صفحه لیست پس از تأخیر کوتاه
    setTimeout(() => {
      router.push('/posts/list')
    }, 1000)
  }
  catch (error: any) {
    // مدیریت خطا
    toaster.show({
      title: 'خطا در ایجاد مقاله',
      message: error.message || 'خطای ناشناخته رخ داد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })

    console.error('Error creating post:', error)
  }
  finally {
    loading.value = false
  }
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
    contentLengthTarget: contentLengthTarget.value,
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
    !title.value.trim()
    && !contentLong.value.trim()
    && !description.value.trim()
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
    contentLengthTarget,
  ],
  savePreviewToLocalStorage,
)

// پیشنهاد همگام‌سازی هنگام تغییر فیلدهای کلیدی
const syncSuggestionShown = ref(false)

watch([title, secretMessage, category], () => {
  // فقط اگر حداقل عنوان و یکی از فیلدهای دیگر پر باشد
  if (!syncSuggestionShown.value && title.value.trim()
    && (secretMessage.value.trim() || category.value)) {
    // نمایش پیشنهاد همگام‌سازی با تأخیر کوتاه
    setTimeout(() => {
      if (!syncSuggestionShown.value) {
        toaster.show({
          title: '💡 پیشنهاد هوشمند',
          message: 'برای همخوانی بهتر فیلدها، از دکمه "همگام‌سازی هوشمند" استفاده کنید.',
          color: 'info',
          icon: 'ph:lightbulb',
          timeout: 5000,
          closable: true,
        })
        syncSuggestionShown.value = true
      }
    }, 2000) // تأخیر ۲ ثانیه‌ای
  }
}, { debounce: 1000 }) // debounce برای جلوگیری از فراخوانی مکرر

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
      }\n\nدسته‌بندی‌های موجود: ${categories.map(c => c.value).join('، ')}`
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
              cat =>
                cat.value
                  .toLowerCase()
                  .includes(suggestion.trim().toLowerCase())
                  || suggestion
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
      }
      catch (e: any) {
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
      }
      finally {
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
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)

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
      }
      catch (e: any) {
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
      }
      finally {
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
      category: category.value,
    }
    // Compose context string (exclude the current field)
    const contextMapping = {
      title: 'عنوان مقاله',
      secretMessage: 'پیام مخفی',
      tags: 'برچسب‌ها',
      excerpt: 'خلاصه کوتاه',
      slug: 'اسلاگ',
      readTime: 'زمان مطالعه',
      description: 'توضیحات',
      contentLong: 'متن کامل',
      goals: 'اهداف آموزشی',
      category: 'دسته‌بندی',
    }

    // Add category label if selected
    let enrichedContext = { ...context }
    if (enrichedContext.category) {
      const selectedCategory = categories.find(c => c.value === enrichedContext.category)
      if (selectedCategory) {
        enrichedContext.category = `${selectedCategory.label} (${enrichedContext.category})`
      }
    }

    const contextString = Object.entries(enrichedContext)
      .filter(([key]) => key !== field && enrichedContext[key])
      .map(([key, val]) => `${contextMapping[key] || key}: ${val}`)
      .join('\n')

    const prompts = {
      title:
        `یک عنوان قوی، جذاب و هوک‌دار برای مقاله پیشنهاد بده که حتماً با ساختار مارک‌داون و با استفاده از # در ابتدای خط نوشته شود. عنوان باید:
        - کاملاً متناسب با پیام مخفی و اهداف آموزشی باشد
        - برای دسته‌بندی انتخاب شده مناسب باشد  
        - احساسات خواننده را برانگیزد
        - کنجکاوی ایجاد کند
        فقط عنوان را به صورت مارک‌داون بازگردان.`,
      secretMessage: `یک پیام مخفی عمیق، تأثیرگذار و کاملاً منحصربه‌فرد برای این مقاله خاص پیشنهاد بده. پیام باید:
        - از صمیم قلب و روح موضوع مقاله باشد
        - با عنوان، اهداف آموزشی و دسته‌بندی کاملاً همخوان باشد
        - به‌گونه‌ای باشد که در متن کامل مقاله به صورت طبیعی و زیبا منعکس شود
        - تحول‌آفرین و الهام‌بخش باشد
        - خواننده را به تفکر عمیق وادارد
        از کلیشه‌ها و پیام‌های عمومی خودداری کن. پیام باید منحصراً برای همین موضوع باشد.`,
      tags: `برچسب‌هایی پیشنهاد بده که:
        - کاملاً با عنوان، پیام مخفی و اهداف مقاله همخوان باشند
        - برای دسته‌بندی انتخابی مناسب باشند
        - جستجوپذیری مقاله را افزایش دهند
        - ترکیبی از کلیدواژه‌های اصلی و احساسی باشند
        برچسب‌ها را با ویرگول جدا کن. فقط لیست برچسب‌ها را بنویس.`,
      excerpt:
        `یک خلاصه جذاب و هوک‌دار بنویس که:
        - جوهره پیام مخفی را منعکس کند
        - خواننده را تشویق به مطالعه کند  
        - با اهداف آموزشی همخوان باشد
        - تیزر مناسبی برای محتوای اصلی باشد
        فقط خلاصه را بنویس.`,
      slug: `یک اسلاگ SEO-friendly پیشنهاد بده که:
        - کاملاً با عنوان و موضوع اصلی مرتبط باشد
        - لاتین و بدون فاصله باشد
        - جستجوپذیری بالایی داشته باشد
        فقط اسلاگ را بنویس.`,
      readTime:
        'بر اساس محتوای موجود و پیچیدگی موضوع، زمان تقریبی مطالعه (بر حسب دقیقه) را محاسبه کن. فقط یک عدد بنویس.',
      description:
        `یک توضیح جامع و جذاب بنویس که:
        - خلاصه‌ای از مطالبی که خواننده یاد می‌گیرد باشد
        - با پیام مخفی و اهداف آموزشی همخوان باشد
        - انگیزه مطالعه ایجاد کند
        فقط توضیح را بنویس.`,
      contentLong: `یک متن کامل، جامع و تأثیرگذار برای مقاله بنویس که:

**الزامات اساسی:**
- حتماً فقط و فقط با مارک‌داون نوشته شود
- تقریباً ${contentLengthTarget.value} کلمه باشد (حداقل ${Math.floor(contentLengthTarget.value * 0.8)} و حداکثر ${Math.floor(contentLengthTarget.value * 1.2)} کلمه)
- کاملاً با عنوان، پیام مخفی، اهداف آموزشی و دسته‌بندی همخوان باشد

**ساختار مطلوب:**
- پیام مخفی به صورت طبیعی و زیبا در طول متن منعکس شود (نه به صورت مستقیم)
- هر یک از اهداف آموزشی در بخش‌های مختلف مقاله پوشش داده شود
- تناسب کامل با دسته‌بندی انتخابی داشته باشد

**تنوع مارک‌داون (حتماً استفاده کن):**
- سرفصل‌های مختلف (H1, H2, H3, H4)
- لیست‌های مرتب و نامرتب  
- چک‌لیست‌های عملی
- نقل‌قول‌های الهام‌بخش
- جدول‌های مفید
- کدهای نمونه (در صورت نیاز)
- پیوندهای مرجع
- تأکیدات متنی (bold, italic)
- بخش‌بندی با خط افقی

راهنمای مارک‌داون:
${markdownGuide}

متن نهایی باید خواننده را تحت تأثیر قرار دهد و احساس رضایت و دستاورد به او بدهد.`,
      goals:
        `بر اساس عنوان، پیام مخفی و دسته‌بندی مقاله، اهداف آموزشی و روانشناختی مشخص و قابل اندازه‌گیری بنویس که:
        - مستقیماً با موضوع اصلی مرتبط باشند
        - قابل دستیابی و عملی باشند  
        - شامل جنبه‌های عاطفی، شناختی و رفتاری باشند
        - تحول مثبت در زندگی خواننده ایجاد کنند
        هر هدف را در یک خط مجزا بنویس.`,
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
                const newTags
                  = (initialContent ? initialContent + ', ' : '') + suggestion
                tags.value = newTags
                  .split(',')
                  .map(t => t.trim())
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
    }
    catch (e: any) {
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
  }
  finally {
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
          .map(t => t.trim())
          .filter(Boolean)
      }
      else if (Array.isArray(value)) {
        tags.value = value
      }
      else {
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
    !editingAction.value.title
    || !editingAction.value.action
    || !editingAction.value.icon
    || !editingAction.value.prompt
  ) {
    return
  }

  if (editingActionIndex.value > -1) {
    // Update existing action
    aiActions.value[editingActionIndex.value] = { ...editingAction.value }
  }
  else {
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
        selectedTextForImage.value = selectedText // برای تولید تصویر
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
    const actionConfig = aiActions.value.find(a => a.action === action)
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
  }
  catch (error) {
    console.error('AI rewrite error:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در پردازش متن. لطفاً دوباره امتحان کنید.',
      color: 'danger',
      icon: 'ph:warning-circle',
      closable: true,
    })
  }
  finally {
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
  contentLengthTarget.value = 5000

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
    contentLengthTarget.value = data.contentLengthTarget || 5000
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
    }
    else {
      console.warn('Textarea element not found')
    }
  }, 500) // Give it some time to render

  // Load saved data when component mounts
  loadPreviewFromLocalStorage()
})

// همگام‌سازی هوشمند تمام فیلدها
const syncAllFieldsAI = async () => {
  syncAllFieldsLoading.value = true

  try {
    if (!title.value.trim()) {
      toaster.show({
        title: 'هشدار',
        message: 'برای همگام‌سازی، ابتدا عنوان مقاله را وارد کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      })
      return
    }

    // توضیح برای کاربر
    toaster.show({
      title: 'در حال همگام‌سازی',
      message: 'تمام فیلدها بر اساس عنوان و اطلاعات موجود به‌روزرسانی می‌شوند...',
      color: 'info',
      icon: 'svg-spinners:90-ring-with-bg',
      timeout: 0,
    })

    // ترتیب بهینه برای همگام‌سازی
    const syncOrder = [
      'secretMessage',
      'category',
      'description',
      'goals',
      'tags',
      'excerpt',
      'slug',
      'contentLong',
    ]

    // همگام‌سازی با تأخیر برای جلوگیری از بارگذاری زیاد سرور
    for (const fieldName of syncOrder) {
      try {
        await suggestAIField(fieldName)
        // تأخیر کوتاه بین درخواست‌ها
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      catch (error) {
        console.warn(`خطا در همگام‌سازی ${fieldName}:`, error)
        // ادامه با فیلد بعدی حتی در صورت خطا
      }
    }

    toaster.show({
      title: 'موفقیت',
      message: 'همگام‌سازی با موفقیت انجام شد. تمام فیلدها به‌روزرسانی شدند.',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
      timeout: 5000,
    })
  }
  catch (error) {
    console.error('خطا در همگام‌سازی:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در همگام‌سازی فیلدها. لطفاً دوباره امتحان کنید.',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  finally {
    syncAllFieldsLoading.value = false
  }
}

// تولید تصویر متناسب با متن انتخابی
const generateImageForText = async () => {
  if (!selectedTextForImage.value.trim()) {
    toaster.show({
      title: 'هشدار',
      message: 'ابتدا بخشی از متن را انتخاب کنید.',
      color: 'warning',
      icon: 'ph:warning',
      closable: true,
    })
    return
  }

  imageGenerationLoading.value = true

  try {
    // تولید prompt برای تصویر
    const prompt = `بر اساس متن زیر، یک توضیح دقیق و جذاب برای تولید تصویر بنویس. توضیح باید شامل عناصر بصری، رنگ‌ها، ترکیب‌بندی و حالت کلی تصویر باشد:

${selectedTextForImage.value}

همچنین یک زیرنویس مناسب و جذاب برای این تصویر پیشنهاد بده که با محتوای متن هماهنگ باشد.

فرمت پاسخ:
PROMPT: [توضیح تصویر]
CAPTION: [زیرنویس تصویر]`

    const messages = [{ role: 'user', content: prompt }]

    let result = ''
    await streamChat(messages, {}, (chunk) => {
      result += chunk
    })

    if (result) {
      // استخراج prompt و caption از پاسخ
      const promptMatch = result.match(/PROMPT:\s*(.+?)(?=CAPTION:|$)/s)
      const captionMatch = result.match(/CAPTION:\s*(.+)$/s)

      if (promptMatch) {
        imagePrompt.value = promptMatch[1].trim()
      }
      if (captionMatch) {
        imageCaption.value = captionMatch[1].trim()
      }

      showImageModal.value = true
    }
  }
  catch (error) {
    console.error('خطا در تولید prompt تصویر:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در تولید اطلاعات تصویر. لطفاً دوباره امتحان کنید.',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
  }
  finally {
    imageGenerationLoading.value = false
  }
}

// افزودن markdown تصویر به متن
const insertImageMarkdown = () => {
  if (!imagePrompt.value.trim() || !imageCaption.value.trim()) {
    toaster.show({
      title: 'هشدار',
      message: 'لطفاً prompt و زیرنویس تصویر را کامل کنید.',
      color: 'warning',
      icon: 'ph:warning',
      closable: true,
    })
    return
  }

  // تولید URL ساختگی برای نمونه - در عمل باید از API تولید تصویر استفاده شود
  const imageUrl = `https://picsum.photos/600/400?random=${Date.now()}`

  const imageMarkdown = `\n\n![${imageCaption.value}](${imageUrl})\n*${imageCaption.value}*\n\n`

  // افزودن به محل انتخاب یا انتهای متن
  const textarea = markdownTextarea.value?.$el?.querySelector('textarea')
  if (textarea && selectedTextRange.value.end > 0) {
    const currentValue = textarea.value
    const beforeText = currentValue.substring(0, selectedTextRange.value.end)
    const afterText = currentValue.substring(selectedTextRange.value.end)
    contentLong.value = beforeText + imageMarkdown + afterText
  }
  else {
    contentLong.value += imageMarkdown
  }

  // بستن modal و پاک کردن فیلدها
  showImageModal.value = false
  selectedTextForImage.value = ''
  imagePrompt.value = ''
  imageCaption.value = ''

  toaster.show({
    title: 'موفقیت',
    message: 'تصویر با موفقیت به متن اضافه شد.',
    color: 'success',
    icon: 'ph:check-circle',
    closable: true,
  })
}

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

    // جمع‌آوری اطلاعات موجود برای ایجاد زمینه بهتر
    const contextInfo = []
    if (title.value.trim()) contextInfo.push(`عنوان: ${title.value}`)
    if (secretMessage.value.trim()) contextInfo.push(`پیام مخفی: ${secretMessage.value}`)
    if (category.value) {
      const selectedCategory = categories.find(c => c.value === category.value)
      if (selectedCategory) contextInfo.push(`دسته‌بندی: ${selectedCategory.label}`)
    }
    if (tags.value.length > 0) contextInfo.push(`برچسب‌ها: ${tags.value.join('، ')}`)
    if (description.value.trim()) contextInfo.push(`توضیحات: ${description.value}`)

    const contextString = contextInfo.join('\n')

    const prompt = `بر اساس اطلاعات زیر، اهداف آموزشی و روانشناختی دقیق و قابل اندازه‌گیری بنویس که خواننده پس از مطالعه این مقاله به دست خواهد آورد:

${contextString}

اهداف باید:
- مستقیماً با عنوان و پیام مخفی مرتبط باشند
- برای دسته‌بندی انتخابی مناسب باشند
- شامل ابعاد شناختی، عاطفی و رفتاری باشند
- عملی و قابل دستیابی باشند
- تحول مثبت در زندگی خواننده ایجاد کنند

هر هدف را در یک خط مجزا و به صورت مشخص بنویس. حداقل ۵ و حداکثر ۱۰ هدف ارائه دهید.`

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
  }
  catch (e: any) {
    toaster.show({
      title: 'خطا',
      message: `خطا در تولید اهداف: ${e.message || 'خطای ناشناخته'}`,
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    })
    goals.value = 'خطا در دریافت اهداف از هوش مصنوعی.'
    throw e
  }
  finally {
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
                    >اهداف آموزشی و روانشناختی مقاله</label>
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
                    >دسته بندی {{ category }}</label>
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
                  <label
                    class="text-muted-800 dark:text-muted-100 mb-2 block font-semibold"
                  >تصویر مقاله (آپلود)</label>
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
                            >یا</span>
                          </div>
                          <label
                            class="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 cursor-pointer font-sans text-sm underline underline-offset-4 transition-colors duration-300"
                          >انتخاب فایل</label>
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
                                >
                                <img
                                  v-else
                                  class="size-14 rounded-xl object-cover object-center"
                                  src="/img/avatars/placeholder-file.png"
                                  alt="Image preview"
                                >
                              </div>
                              <div class="font-sans">
                                <span
                                  class="text-muted-800 dark:text-muted-100 line-clamp-1 block text-sm"
                                >{{ file.name }}</span>
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
                                >Remove</span>
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
                    >تاریخ انتشار</label>
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
                    >زمان مطالعه (دقیقه)</label>
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
                    >متن کامل مقاله (مارک‌داون)</label>
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

                  <!-- Content Length Control -->
                  <div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
                    <div class="mb-3 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Icon name="ph:text-aa" class="text-primary-500 size-5" />
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          طول متن مطلوب: <span class="text-primary-600 dark:text-primary-400 font-bold">{{ contentLengthTarget.toLocaleString() }}</span> کلمه
                        </label>
                      </div>
                      <span class="rounded-full border bg-white px-2 py-1 text-xs text-gray-500 dark:bg-gray-700">
                        {{ minContentLength.toLocaleString() }} - {{ maxContentLength.toLocaleString() }}
                      </span>
                    </div>

                    <!-- Custom Slider -->
                    <div class="relative mb-3">
                      <input
                        v-model.number="contentLengthTarget"
                        type="range"
                        :min="minContentLength"
                        :max="maxContentLength"
                        :step="500"
                        class="content-length-slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      >
                      <div class="mt-2 flex justify-between px-1 text-xs text-gray-500">
                        <span class="rounded border bg-white px-2 py-1 dark:bg-gray-700">کوتاه</span>
                        <span class="rounded border bg-white px-2 py-1 dark:bg-gray-700">متوسط</span>
                        <span class="rounded border bg-white px-2 py-1 dark:bg-gray-700">بلند</span>
                      </div>
                    </div>

                    <!-- Length Indicators -->
                    <div class="grid grid-cols-3 gap-2 text-xs">
                      <div class="rounded border bg-white p-2 text-center dark:bg-gray-700">
                        <div class="font-semibold text-orange-500">
                          کوتاه
                        </div>
                        <div class="text-gray-500">
                          ۱,۰۰۰ - ۳,۰۰۰
                        </div>
                      </div>
                      <div class="rounded border bg-white p-2 text-center dark:bg-gray-700">
                        <div class="font-semibold text-blue-500">
                          متوسط
                        </div>
                        <div class="text-gray-500">
                          ۳,۰۰۰ - ۸,۰۰۰
                        </div>
                      </div>
                      <div class="rounded border bg-white p-2 text-center dark:bg-gray-700">
                        <div class="font-semibold text-green-500">
                          بلند
                        </div>
                        <div class="text-gray-500">
                          ۸,۰۰۰ - ۱۵,۰۰۰
                        </div>
                      </div>
                    </div>
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
                    addon
                    @mouseup="handleMarkdownSelection"
                    @keyup="handleMarkdownSelection"
                    @click="handleMarkdownSelection"
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
                            'flex items-center gap-1 rounded-md border px-2 py-1 text-right text-xs transition-colors',
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
                            class="size-3 shrink-0"
                          />
                          <Icon
                            v-else
                            :name="action.icon"
                            class="text-primary-500 size-3 shrink-0"
                          />
                          <span>{{ action.title }}</span>
                        </button>

                        <!-- دکمه تولید تصویر -->
                        <button
                          :disabled="imageGenerationLoading || !selectedTextForImage"
                          :class="[
                            'flex items-center gap-1 rounded-md border px-2 py-1 text-right text-xs transition-colors',
                            'border-green-200 hover:bg-green-100 dark:border-green-600 dark:hover:bg-green-700',
                          ]"
                          title="تولید تصویر متناسب"
                          @click="generateImageForText"
                        >
                          <Icon
                            v-if="imageGenerationLoading"
                            name="svg-spinners:90-ring-with-bg"
                            class="size-3 shrink-0"
                          />
                          <Icon
                            v-else
                            name="ph:image"
                            class="size-3 shrink-0 text-green-500"
                          />
                          <span>افزودن تصویر</span>
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
                      class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl prose-p:text-right prose-ul:text-right prose-ol:text-right max-w-none"
                      style="margin-left: 0 !important; padding-left: 0 !important;"
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
              color="success"
              :loading="syncAllFieldsLoading"
              :disabled="!title.trim() || syncAllFieldsLoading"
              class="mb-3 w-full rounded-xl px-4 py-3 text-base font-bold"
              data-nui-tooltip="تمام فیلدها را بر اساس عنوان و اطلاعات موجود به‌روزرسانی می‌کند"
              @click="syncAllFieldsAI"
            >
              <Icon name="ph:arrows-clockwise" class="ml-2 size-4" />
              همگام‌سازی هوشمند
            </BaseButton>
            <BaseButton
              title="ویرایش دکمه‌های هوش مصنوعی"
              class="mb-2 flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-right text-xs transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              @click="openActionEditor"
            >
              <Icon
                name="ph:pencil-simple"
                class="text-primary-500 size-3 shrink-0"
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
                <ul class="list-inside list-disc space-y-2 text-sm">
                  <li><strong>عنوان</strong> پایه تمام فیلدهای دیگر است</li>
                  <li><strong>پیام مخفی</strong> باید در کل متن منعکس شود</li>
                  <li><strong>همگام‌سازی هوشمند</strong> تمام فیلدها را هماهنگ می‌کند</li>
                  <li><strong>کنترل طول متن</strong> با slider قابل تنظیم است</li>
                  <li><strong>تولید تصویر:</strong> متن را انتخاب کنید و "افزودن تصویر" کلیک کنید</li>
                  <li>متن کامل باید با اهداف آموزشی همخوان باشد</li>
                  <li>برچسب‌ها باید با دسته‌بندی مرتبط باشند</li>
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
    rounded="lg"
    @close="showClearConfirm = false"
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

  <!-- Image Generation Modal -->
  <TairoModal
    :open="showImageModal"
    size="lg"
    rounded="lg"
    @close="showImageModal = false"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4">
        <h2 class="text-primary-500 text-lg font-bold">
          <Icon name="ph:image" class="mr-2 inline-block size-5" />
          تولید تصویر متناسب با متن
        </h2>
        <button
          type="button"
          class="text-muted-400 hover:text-muted-500 dark:hover:text-muted-300 transition-colors"
          @click="showImageModal = false"
        >
          <Icon name="ph:x" class="size-5" />
        </button>
      </div>
    </template>

    <div class="space-y-4 px-6 pb-6">
      <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <h3 class="mb-2 text-sm font-medium">
          متن انتخاب شده:
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ selectedTextForImage }}
        </p>
      </div>

      <div>
        <BaseTextarea
          v-model="imagePrompt"
          label="توضیح تصویر (Prompt)"
          placeholder="توضیح دقیق تصویر مورد نظر..."
          rows="4"
          class="mb-4"
        />
      </div>

      <div>
        <BaseInput
          v-model="imageCaption"
          label="زیرنویس تصویر"
          placeholder="زیرنویس جذاب برای تصویر..."
        />
      </div>

      <div class="flex items-center justify-end gap-3 pt-4">
        <BaseButton
          color="muted"
          variant="pastel"
          class="px-4 py-2 text-sm font-medium"
          @click="showImageModal = false"
        >
          <Icon name="ph:arrow-counter-clockwise" class="ml-1.5 size-4" />
          انصراف
        </BaseButton>
        <BaseButton
          color="primary"
          :disabled="!imagePrompt.trim() || !imageCaption.trim()"
          class="px-4 py-2 text-sm font-medium"
          @click="insertImageMarkdown"
        >
          <Icon name="ph:plus-circle" class="ml-1.5 size-4" />
          افزودن تصویر به متن
        </BaseButton>
      </div>
    </div>
  </TairoModal>

  <!-- AI Action Editor Modal -->
  <TairoModal
    :open="showActionEditor"
    size="sm"
    rounded="lg"
    @close="showActionEditor = false"
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

/* Fix for markdown preview spacing */
.prose {
  margin-left: 0 !important;
  padding-left: 0 !important;
  direction: rtl;
  text-align: right;
}

.prose > * {
  margin-left: 0 !important;
  padding-left: 0 !important;
  text-align: right;
}

.prose p,
.prose li,
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  text-align: right !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
}

.prose ul,
.prose ol {
  text-align: right !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
  padding-right: 1.5rem;
}

.prose blockquote {
  text-align: right !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
  padding-right: 1rem;
  border-right: 4px solid;
  border-left: none;
}

.prose table {
  text-align: right !important;
  margin-left: 0 !important;
}

.prose th,
.prose td {
  text-align: right !important;
}

/* Custom Slider Styles */
.content-length-slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.content-length-slider::-webkit-slider-track {
  background: linear-gradient(90deg, #f59e0b 0%, #3b82f6 50%, #10b981 100%);
  height: 8px;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.content-length-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.content-length-slider::-webkit-slider-thumb:hover {
  background: #3b82f6;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.content-length-slider::-moz-range-track {
  background: linear-gradient(90deg, #f59e0b 0%, #3b82f6 50%, #10b981 100%);
  height: 8px;
  border-radius: 5px;
  border: none;
}

.content-length-slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.content-length-slider::-moz-range-thumb:hover {
  background: #3b82f6;
  transform: scale(1.1);
}

/* Dark mode adjustments */
.dark .content-length-slider::-webkit-slider-thumb {
  background: #1f2937;
  border-color: #60a5fa;
}

.dark .content-length-slider::-webkit-slider-thumb:hover {
  background: #60a5fa;
}

.dark .content-length-slider::-moz-range-thumb {
  background: #1f2937;
  border-color: #60a5fa;
}

.dark .content-length-slider::-moz-range-thumb:hover {
  background: #60a5fa;
}
</style>
