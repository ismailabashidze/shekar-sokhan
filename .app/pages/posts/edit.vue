<script setup lang="ts">
definePageMeta({
  title: 'ویرایش مقاله',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const toaster = useToaster()

const { 
  currentPost, 
  loading, 
  error,
  getPost, 
  updatePost 
} = usePosts()

const { user } = useUser()

// Form data
const formData = ref({
  title: '',
  description: '',
  secretMessage: '',
  goals: '',
  excerpt: '',
  contentLong: '',
  category: '',
  tags: [] as string[],
  slug: '',
  publishDate: '',
  readTime: 0,
  isFeatured: false,
  allowComments: true,
  status: 'draft',
  contentLengthTarget: 5000,
  seoTitle: '',
  seoDescription: '',
})

const uploadedFiles = ref<FileList | null>(null)
const newTag = ref('')
const submitting = ref(false)

// Categories
const categories = [
  { value: 'meditation', label: 'مدیتیشن' },
  { value: 'yoga', label: 'یوگا' },
  { value: 'mental-health', label: 'سلامت روان' },
  { value: 'self-help', label: 'خودیاری' },
  { value: 'motivation', label: 'انگیزشی' },
  { value: 'relationship', label: 'روابط' },
]

// Status options
const statusOptions = [
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'published', label: 'منتشر شده' },
  { value: 'archived', label: 'بایگانی شده' },
  { value: 'scheduled', label: 'زمان‌بندی شده' },
]

// Load post data
const loadPost = async () => {
  try {
    const postId = route.query.id as string
    if (!postId) {
      router.push('/posts/list')
      return
    }
    
    await getPost(postId)
    
    if (currentPost.value) {
      const post = currentPost.value
      
      formData.value = {
        title: post.title || '',
        description: post.description || '',
        secretMessage: post.secretMessage || '',
        goals: post.goals || '',
        excerpt: post.excerpt || '',
        contentLong: post.contentLong || '',
        category: post.category || '',
        tags: post.tags || [],
        slug: post.slug || '',
        publishDate: post.publishDate || '',
        readTime: post.readTime || 0,
        isFeatured: post.isFeatured || false,
        allowComments: post.allowComments !== false,
        status: post.status || 'draft',
        contentLengthTarget: post.contentLengthTarget || 5000,
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
      }
    }
  } catch (err) {
    console.error('Error loading post:', err)
  }
}

// Submit form
const submit = async () => {
  submitting.value = true

  try {
    const postId = route.query.id as string
    
    const updateData = {
      id: postId,
      ...formData.value,
      featuredImage: uploadedFiles.value?.[0] || null,
    }

    await updatePost(updateData)
    router.push('/posts/list')

  } catch (error: any) {
    console.error('Error updating post:', error)
  } finally {
    submitting.value = false
  }
}

// Tag management
const addTag = () => {
  if (newTag.value && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  formData.value.tags = formData.value.tags.filter((t) => t !== tag)
}

onMounted(() => {
  loadPost()
})
</script>

<template>
  <div>
    <BasePageHeading title="ویرایش مقاله" />

    <div class="pb-20">
      <BaseCard v-if="!loading" class="p-6">
        <form class="space-y-6" @submit.prevent="submit">
          <div class="grid gap-6 lg:grid-cols-2">
            <!-- Basic Fields -->
            <div class="space-y-4">
              <BaseInput
                v-model="formData.title"
                label="عنوان"
                required
              />

              <BaseTextarea
                v-model="formData.description"
                label="توضیحات"
                rows="3"
                required
              />

              <BaseListbox
                v-model="formData.category"
                label="دسته‌بندی"
                :items="categories"
                :properties="{ value: 'value', label: 'label' }"
                required
              />

              <BaseListbox
                v-model="formData.status"
                label="وضعیت"
                :items="statusOptions"
                :properties="{ value: 'value', label: 'label' }"
              />
            </div>

            <!-- Additional Fields -->
            <div class="space-y-4">
              <BaseTextarea
                v-model="formData.secretMessage"
                label="پیام مخفی"
                rows="2"
              />

              <BaseTextarea
                v-model="formData.goals"
                label="اهداف"
                rows="3"
              />

              <div class="flex gap-2">
                <BaseInput
                  v-model="newTag"
                  placeholder="برچسب جدید"
                  class="flex-1"
                  @keyup.enter="addTag"
                />
                <BaseButton
                  type="button"
                  @click="addTag"
                >
                  افزودن
                </BaseButton>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in formData.tags"
                  :key="tag"
                  class="bg-primary-100 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm"
                >
                  {{ tag }}
                  <button type="button" @click="removeTag(tag)">×</button>
                </span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <BaseTextarea
            v-model="formData.contentLong"
            label="متن کامل"
            rows="15"
            required
          />

          <!-- Submit -->
          <div class="flex gap-3">
            <BaseButton
              type="submit"
              color="primary"
              :loading="submitting"
            >
              به‌روزرسانی
            </BaseButton>
            <BaseButton
              type="button"
              color="muted"
              @click="router.push('/posts/list')"
            >
              انصراف
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <div v-else class="flex justify-center py-20">
        <BasePlaceload class="size-16" />
      </div>
    </div>
  </div>
</template> 