<script setup lang="ts">
definePageMeta({
  title: 'ویرایش مقاله',
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const route = useRoute();
const router = useRouter();
const toaster = useToaster();

const {
  currentPost,
  loading,
  error,
  getPost,
  updatePost,
} = usePosts();

const { user } = useUser();

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
});

const uploadedFiles = ref<FileList | null>(null);
const newTag = ref('');
const submitting = ref(false);

// Categories
const categories = [
  { value: 'meditation', label: 'مدیتیشن', icon: 'ph:person-simple-duotone' },
  { value: 'yoga', label: 'یوگا', icon: 'ph:person-simple-walk-duotone' },
  { value: 'mental-health', label: 'سلامت روان', icon: 'ph:heartbeat-duotone' },
  { value: 'self-help', label: 'خودیاری', icon: 'ph:hand-heart-duotone' },
  { value: 'motivation', label: 'انگیزشی', icon: 'ph:star-duotone' },
  { value: 'relationship', label: 'روابط', icon: 'ph:users-duotone' },
  { value: 'stress-management', label: 'مدیریت استرس', icon: 'ph:heart-duotone' },
  { value: 'mindfulness', label: 'ذهن‌آگاهی', icon: 'ph:brain-duotone' },
];

// Status options
const statusOptions = [
  { value: 'draft', label: 'پیش‌نویس', color: 'muted' },
  { value: 'published', label: 'منتشر شده', color: 'success' },
  { value: 'archived', label: 'بایگانی شده', color: 'warning' },
  { value: 'scheduled', label: 'زمان‌بندی شده', color: 'info' },
];

// Load post data
const loadPost = async () => {
  try {
    const postId = route.params.id as string;
    await getPost(postId);

    if (currentPost.value) {
      const post = currentPost.value;

      // Populate form data
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
      };
    }
  }
  catch (err) {
    console.error('Error loading post:', err);
    toaster.show({
      title: 'خطا',
      message: 'خطا در بارگیری مقاله',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    });
  }
};

// Validation
const validate = () => {
  const errors: Record<string, string> = {};

  if (!formData.value.title.trim()) {
    errors.title = 'عنوان الزامی است';
  }

  if (!formData.value.description.trim()) {
    errors.description = 'توضیحات الزامی است';
  }

  if (!formData.value.contentLong.trim()) {
    errors.contentLong = 'متن کامل الزامی است';
  }

  if (!formData.value.category) {
    errors.category = 'دسته‌بندی الزامی است';
  }

  if (Object.keys(errors).length > 0) {
    toaster.show({
      title: 'خطا در فرم',
      message: 'لطفاً فیلدهای الزامی را پر کنید',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    });
    return false;
  }

  return true;
};

// Submit form
const submit = async () => {
  if (!validate()) return;

  submitting.value = true;

  try {
    const postId = route.params.id as string;

    // Prepare update data
    const updateData = {
      id: postId,
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      secretMessage: formData.value.secretMessage.trim() || undefined,
      goals: formData.value.goals.trim() || undefined,
      excerpt: formData.value.excerpt.trim() || undefined,
      contentLong: formData.value.contentLong.trim(),
      category: formData.value.category,
      tags: formData.value.tags,
      slug: formData.value.slug.trim() || undefined,
      publishDate: formData.value.publishDate || new Date().toISOString().split('T')[0],
      readTime: formData.value.readTime || undefined,
      featuredImage: uploadedFiles.value?.[0] || null,
      isFeatured: formData.value.isFeatured,
      allowComments: formData.value.allowComments,
      status: formData.value.status,
      contentLengthTarget: formData.value.contentLengthTarget || undefined,
      seoTitle: formData.value.seoTitle.trim() || undefined,
      seoDescription: formData.value.seoDescription.trim() || undefined,
    };

    await updatePost(updateData);

    toaster.show({
      title: 'موفقیت',
      message: 'مقاله با موفقیت به‌روزرسانی شد',
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    });

    setTimeout(() => {
      router.push('/posts/list');
    }, 1000);
  }
  catch (error: any) {
    toaster.show({
      title: 'خطا در به‌روزرسانی',
      message: error.message || 'خطای ناشناخته رخ داد',
      color: 'danger',
      icon: 'ph:warning',
      closable: true,
    });
  }
  finally {
    submitting.value = false;
  }
};

// Tag management
const addTag = () => {
  if (newTag.value && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (tag: string) => {
  formData.value.tags = formData.value.tags.filter(t => t !== tag);
};

// Load post on mount
onMounted(() => {
  loadPost();
});
</script>

<template>
  <div>
    <BasePageHeading
      title="ویرایش مقاله"
      subtitle="ویرایش اطلاعات مقاله موجود"
    >
      <template #pageTitle>
        <div class="flex items-center">
          <Icon name="ph:pencil-duotone" class="text-primary-500 me-2 size-6" />
          <span>ویرایش مقاله</span>
        </div>
      </template>
    </BasePageHeading>

    <div class="pb-20">
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
        <BaseButton
          color="primary"
          variant="pastel"
          @click="loadPost"
        >
          تلاش مجدد
        </BaseButton>
      </div>

      <!-- Form -->
      <BaseCard v-else class="p-6">
        <form class="space-y-6" @submit.prevent="submit">
          <!-- Header Actions -->
          <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-b pb-4">
            <div class="flex items-center gap-3">
              <NuxtLink
                to="/posts/list"
                class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-700 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors"
              >
                <Icon name="ph:arrow-right-duotone" class="text-muted-500 size-4" />
                <span class="text-muted-500">بازگشت</span>
              </NuxtLink>
              <h1 class="text-muted-800 text-xl font-bold dark:text-white">
                ویرایش: {{ formData.title || 'مقاله' }}
              </h1>
            </div>

            <div class="flex items-center gap-3">
              <BaseButton
                type="button"
                color="muted"
                variant="pastel"
                @click="router.push('/posts/list')"
              >
                <Icon name="ph:x" class="size-4" />
                انصراف
              </BaseButton>
              <BaseButton
                type="submit"
                color="primary"
                :loading="submitting"
              >
                <Icon name="ph:check" class="size-4" />
                به‌روزرسانی مقاله
              </BaseButton>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="grid gap-6 lg:grid-cols-3">
            <!-- Main Content -->
            <div class="space-y-6 lg:col-span-2">
              <!-- Title -->
              <BaseInput
                v-model="formData.title"
                label="عنوان مقاله"
                placeholder="عنوان جذاب و توصیفی برای مقاله"
                required
              />

              <!-- Description -->
              <BaseTextarea
                v-model="formData.description"
                label="توضیح کوتاه"
                placeholder="توضیح مختصری درباره مقاله"
                rows="3"
                required
              />

              <!-- Secret Message -->
              <BaseTextarea
                v-model="formData.secretMessage"
                label="پیام مخفی (اختیاری)"
                placeholder="پیامی که باید به‌طور طبیعی در متن منعکس شود"
                rows="2"
              />

              <!-- Goals -->
              <BaseTextarea
                v-model="formData.goals"
                label="اهداف آموزشی (اختیاری)"
                placeholder="اهداف یادگیری که این مقاله دنبال می‌کند"
                rows="3"
              />

              <!-- Content -->
              <BaseTextarea
                v-model="formData.contentLong"
                label="متن کامل مقاله"
                placeholder="متن کامل مقاله با استفاده از مارک‌داون"
                rows="20"
                required
              />
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Status -->
              <BaseListbox
                v-model="formData.status"
                label="وضعیت"
                :items="statusOptions"
                :properties="{ value: 'value', label: 'label' }"
              />

              <!-- Category -->
              <BaseListbox
                v-model="formData.category"
                label="دسته‌بندی"
                :items="categories"
                :properties="{ value: 'value', label: 'label' }"
                required
              />

              <!-- Tags -->
              <div>
                <label class="text-muted-800 mb-2 block text-sm font-medium dark:text-white">
                  برچسب‌ها
                </label>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <BaseInput
                      v-model="newTag"
                      placeholder="برچسب جدید"
                      class="flex-1"
                      @keyup.enter="addTag"
                    />
                    <BaseButton
                      type="button"
                      color="primary"
                      variant="pastel"
                      size="sm"
                      @click="addTag"
                    >
                      <Icon name="ph:plus" class="size-4" />
                    </BaseButton>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in formData.tags"
                      :key="tag"
                      class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                    >
                      {{ tag }}
                      <button
                        type="button"
                        @click="removeTag(tag)"
                      >
                        <Icon name="ph:x" class="size-3" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Settings -->
              <div class="space-y-4">
                <h3 class="text-muted-800 text-sm font-medium dark:text-white">
                  تنظیمات
                </h3>

                <BaseCheckbox
                  v-model="formData.isFeatured"
                  label="مقاله ویژه"
                />

                <BaseCheckbox
                  v-model="formData.allowComments"
                  label="اجازه نظردهی"
                />
              </div>

              <!-- SEO -->
              <div class="space-y-4">
                <h3 class="text-muted-800 text-sm font-medium dark:text-white">
                  سئو
                </h3>

                <BaseInput
                  v-model="formData.slug"
                  label="آدرس URL"
                  placeholder="url-slug"
                />

                <BaseInput
                  v-model="formData.seoTitle"
                  label="عنوان سئو"
                  placeholder="عنوان برای موتورهای جستجو"
                />

                <BaseTextarea
                  v-model="formData.seoDescription"
                  label="توضیح سئو"
                  placeholder="توضیح برای موتورهای جستجو"
                  rows="2"
                />
              </div>

              <!-- Publishing -->
              <div class="space-y-4">
                <h3 class="text-muted-800 text-sm font-medium dark:text-white">
                  انتشار
                </h3>

                <BaseInput
                  v-model="formData.publishDate"
                  type="date"
                  label="تاریخ انتشار"
                />

                <BaseInput
                  v-model="formData.readTime"
                  type="number"
                  label="زمان مطالعه (دقیقه)"
                  placeholder="5"
                />
              </div>

              <!-- Image Upload -->
              <div>
                <label class="text-muted-800 mb-2 block text-sm font-medium dark:text-white">
                  تصویر شاخص
                </label>
                <BaseInputFile
                  v-model="uploadedFiles"
                  accept="image/*"
                  placeholder="انتخاب تصویر"
                />
              </div>
            </div>
          </div>
        </form>
      </BaseCard>
    </div>
  </div>
</template>
