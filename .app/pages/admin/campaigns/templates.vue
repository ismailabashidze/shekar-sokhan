<script setup lang="ts">
import type { TemplateForm, TemplateVariable } from '~/types/campaigns'

definePageMeta({
  title: 'مدیریت قالب‌ها',
  layout: 'sidebar',
  // Using global middlewares only
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'مدیریت قالب‌ها - پنل ادمین - ذهنا',
})

const {
  templates,
  isLoading,
  isSaving,
  activeTemplates,
  sessionTemplates,
  adminTemplates,
  systemTemplates,
  fetchTemplates,
  createTemplate,
  updateTemplate,
  toggleTemplateStatus,
  deleteTemplate,
  previewTemplate,
  validateTemplate,
  getAvailableVariables,
} = useTemplateManager()

// State
const showCreateForm = ref(false)
const editingTemplate = ref<string | null>(null)
const selectedCategory = ref<'all' | 'session' | 'admin' | 'system'>('all')
const searchQuery = ref('')
const showPreview = ref(false)
const previewData = ref<any>(null)

const formData = ref<TemplateForm>({
  name: '',
  description: '',
  category: 'session',
  language: 'fa',
  title_template: '',
  body_template: '',
  action_text_template: '',
  action_url_template: '',
  variables: [],
})

// Initialize data
onMounted(async () => {
  try {
    await fetchTemplates()
  }
  catch (error) {
    console.error('خطا در بارگذاری قالب‌ها:', error)
  }
})

// Form methods
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    category: 'session',
    language: 'fa',
    title_template: '',
    body_template: '',
    action_text_template: '',
    action_url_template: '',
    variables: [],
  }
  editingTemplate.value = null
}

const handleCreateTemplate = async () => {
  try {
    const errors = validateTemplate(formData.value)
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    await createTemplate(formData.value)
    showCreateForm.value = false
    resetForm()
  }
  catch (error) {
    console.error('خطا در ایجاد قالب:', error)
  }
}

const handleEditTemplate = (template: any) => {
  formData.value = {
    name: template.name,
    description: template.description,
    category: template.category,
    language: template.language,
    title_template: template.title_template,
    body_template: template.body_template,
    action_text_template: template.action_text_template || '',
    action_url_template: template.action_url_template || '',
    variables: template.variables || [],
  }
  editingTemplate.value = template.id
  showCreateForm.value = true
}

const handleUpdateTemplate = async () => {
  if (!editingTemplate.value) return

  try {
    const errors = validateTemplate(formData.value)
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    await updateTemplate(editingTemplate.value, formData.value)
    showCreateForm.value = false
    resetForm()
  }
  catch (error) {
    console.error('خطا در بروزرسانی قالب:', error)
  }
}

const handleDeleteTemplate = async (templateId: string) => {
  if (confirm('آیا از حذف این قالب اطمینان دارید؟')) {
    try {
      await deleteTemplate(templateId)
    }
    catch (error) {
      console.error('خطا در حذف قالب:', error)
    }
  }
}

const handlePreviewTemplate = (template: any) => {
  const sampleData = {
    user_name: 'علی احمدی',
    app_name: 'ذهنا',
    current_date: new Date().toLocaleDateString('fa-IR'),
    session_date: 'دوشنبه ۱۵ آبان',
    session_time: '۱۰:۳۰',
    therapist_name: 'دکتر مریم رضایی',
  }

  previewData.value = {
    template,
    preview: previewTemplate(template, sampleData),
  }
  showPreview.value = true
}

const addVariable = () => {
  formData.value.variables.push({
    name: '',
    type: 'string',
    source: 'user',
    fallback: '',
    description: '',
  })
}

const removeVariable = (index: number) => {
  formData.value.variables.splice(index, 1)
}

const loadAvailableVariables = () => {
  const availableVars = getAvailableVariables(formData.value.category)
  formData.value.variables = [...availableVars]
}

// Computed
const filteredTemplates = computed(() => {
  let filtered = templates.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(query)
      || t.description.toLowerCase().includes(query),
    )
  }

  return filtered
})

const canSubmit = computed(() => {
  return formData.value.name.trim()
    && formData.value.title_template.trim()
    && formData.value.body_template.trim()
})

const categoryOptions = [
  { label: 'جلسه', value: 'session' },
  { label: 'ادمین', value: 'admin' },
  { label: 'سیستم', value: 'system' },
]

const languageOptions = [
  { label: 'فارسی', value: 'fa' },
  { label: 'انگلیسی', value: 'en' },
]

const variableTypeOptions = [
  { label: 'متن', value: 'string' },
  { label: 'عدد', value: 'number' },
  { label: 'تاریخ', value: 'date' },
  { label: 'بولین', value: 'boolean' },
]

const variableSourceOptions = [
  { label: 'کاربر', value: 'user' },
  { label: 'جلسه', value: 'session' },
  { label: 'سیستم', value: 'system' },
]
</script>

<template>
  <div class="template-management bg-muted-50 dark:bg-muted-900 min-h-screen">
    <div class="container-wrapper mx-auto w-full max-w-7xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-muted-900 mb-4 text-3xl font-bold dark:text-white">
            مدیریت قالب‌ها
          </h1>
          <p class="text-muted-500 dark:text-muted-400">
            ایجاد و مدیریت قالب‌های پیام برای کمپین‌ها
          </p>
        </div>

        <BaseButton
          color="primary"
          @click="showCreateForm = true"
        >
          <Icon name="ph:plus" class="ml-2 size-4" />
          قالب جدید
        </BaseButton>
      </div>

      <!-- Stats -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                کل قالب‌ها
              </p>
              <p class="text-muted-900 text-2xl font-bold dark:text-white">
                {{ templates.length }}
              </p>
            </div>
            <div class="bg-primary-100 dark:bg-primary-900 flex size-12 items-center justify-center rounded-lg">
              <Icon name="ph:template" class="text-primary-600 dark:text-primary-400 size-6" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                قالب‌های جلسه
              </p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                {{ sessionTemplates.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <Icon name="ph:calendar" class="size-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                قالب‌های ادمین
              </p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ adminTemplates.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Icon name="ph:user-gear" class="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                قالب‌های سیستم
              </p>
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {{ systemTemplates.length }}
              </p>
            </div>
            <div class="flex size-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Icon name="ph:gear" class="size-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>      <
      !-- Filters -->
      <div class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 mb-6 rounded-xl border bg-white p-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(tab, key) in { all: 'همه', session: 'جلسه', admin: 'ادمین', system: 'سیستم' }"
              :key="key"
              class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="selectedCategory === key
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-muted-600 hover:bg-muted-100 dark:text-muted-400 dark:hover:bg-muted-700'"
              @click="selectedCategory = key as any"
            >
              {{ tab }}
            </button>
          </div>

          <BaseInput
            v-model="searchQuery"
            placeholder="جستجوی قالب‌ها..."
            icon="ph:magnifying-glass"
            class="w-full md:w-80"
          />
        </div>
      </div>

      <!-- Templates List -->
      <div v-if="isLoading" class="py-12 text-center">
        <p class="text-muted-500 dark:text-muted-400">
          در حال بارگذاری قالب‌ها...
        </p>
      </div>

      <div v-else-if="filteredTemplates.length === 0" class="py-12 text-center">
        <Icon name="ph:template" class="text-muted-400 mx-auto mb-4 size-12" />
        <p class="text-muted-500 dark:text-muted-400 mb-4">
          {{ searchQuery.trim() ? 'قالبی یافت نشد' : 'قالبی در این دسته وجود ندارد' }}
        </p>
        <BaseButton
          color="primary"
          variant="outline"
          @click="showCreateForm = true"
        >
          اولین قالب را ایجاد کنید
        </BaseButton>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 rounded-xl border bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <!-- Template Header -->
          <div class="mb-4 flex items-start justify-between">
            <div class="flex-1">
              <div class="mb-2 flex items-center gap-2">
                <h3 class="text-muted-900 text-lg font-semibold dark:text-white">
                  {{ template.name }}
                </h3>
                <BaseBadge
                  :color="template.category === 'session' ? 'success' :
                    template.category === 'admin' ? 'info' : 'warning'"
                  size="sm"
                >
                  {{ template.category === 'session' ? 'جلسه' :
                    template.category === 'admin' ? 'ادمین' : 'سیستم' }}
                </BaseBadge>
              </div>
              <p class="text-muted-600 dark:text-muted-300 line-clamp-2 text-sm">
                {{ template.description }}
              </p>
            </div>

            <div class="flex items-center gap-1">
              <button
                class="text-muted-400 hover:text-muted-600 dark:hover:text-muted-300 p-1 transition-colors"
                :class="template.is_active ? 'text-green-500' : 'text-muted-400'"
                @click="toggleTemplateStatus(template.id)"
              >
                <Icon :name="template.is_active ? 'ph:toggle-right' : 'ph:toggle-left'" class="size-5" />
              </button>
            </div>
          </div>

          <!-- Template Preview -->
          <div class="bg-muted-50 dark:bg-muted-700 mb-4 rounded-lg p-3">
            <p class="text-muted-900 mb-1 text-sm font-medium dark:text-white">
              {{ template.title_template }}
            </p>
            <p class="text-muted-600 dark:text-muted-300 line-clamp-2 text-xs">
              {{ template.body_template }}
            </p>
          </div>

          <!-- Template Variables -->
          <div v-if="template.variables && template.variables.length > 0" class="mb-4">
            <p class="text-muted-700 dark:text-muted-300 mb-2 text-xs font-medium">
              متغیرها:
            </p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="variable in template.variables.slice(0, 3)"
                :key="variable.name"
                class="bg-muted-200 dark:bg-muted-600 text-muted-700 dark:text-muted-300 rounded px-2 py-1 text-xs"
              >
                {{ variable.name }}
              </span>
              <span
                v-if="template.variables.length > 3"
                class="text-muted-500 dark:text-muted-400 text-xs"
              >
                +{{ template.variables.length - 3 }} بیشتر
              </span>
            </div>
          </div>

          <!-- Template Actions -->
          <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-t pt-4">
            <div class="flex items-center gap-2">
              <BaseButton
                size="sm"
                variant="outline"
                @click="handlePreviewTemplate(template)"
              >
                <Icon name="ph:eye" class="size-4" />
              </BaseButton>

              <BaseButton
                size="sm"
                variant="outline"
                @click="handleEditTemplate(template)"
              >
                <Icon name="ph:pencil" class="size-4" />
              </BaseButton>

              <BaseButton
                size="sm"
                color="danger"
                variant="outline"
                @click="handleDeleteTemplate(template.id)"
              >
                <Icon name="ph:trash" class="size-4" />
              </BaseButton>
            </div>

            <p class="text-muted-500 dark:text-muted-400 text-xs">
              {{ new Date(template.created).toLocaleDateString('fa-IR') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Create/Edit Template Modal -->
    <BaseModal
      v-model="showCreateForm"
      :title="editingTemplate ? 'ویرایش قالب' : 'ایجاد قالب جدید'"
      size="4xl"
    >
      <form @submit.prevent="editingTemplate ? handleUpdateTemplate() : handleCreateTemplate()">
        <div class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BaseInput
              v-model="formData.name"
              label="نام قالب"
              placeholder="نام قالب را وارد کنید"
              required
            />

            <BaseListbox
              v-model="formData.category"
              label="دسته‌بندی"
              :items="categoryOptions"
              @update:model-value="loadAvailableVariables"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BaseTextarea
              v-model="formData.description"
              label="توضیحات"
              placeholder="توضیحات قالب را وارد کنید"
              rows="3"
            />

            <BaseListbox
              v-model="formData.language"
              label="زبان"
              :items="languageOptions"
            />
          </div>

          <!-- Template Content -->
          <div class="space-y-4">
            <BaseInput
              v-model="formData.title_template"
              label="عنوان قالب"
              placeholder="عنوان پیام (می‌توانید از {{متغیر}} استفاده کنید)"
              required
            />

            <BaseTextarea
              v-model="formData.body_template"
              label="متن قالب"
              placeholder="متن پیام (می‌توانید از {{متغیر}} استفاده کنید)"
              rows="4"
              required
            />

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BaseInput
                v-model="formData.action_text_template"
                label="متن دکمه (اختیاری)"
                placeholder="مثال: مشاهده جلسه"
              />

              <BaseInput
                v-model="formData.action_url_template"
                label="لینک دکمه (اختیاری)"
                placeholder="مثال: /sessions/{{session_id}}"
              />
            </div>
          </div>

          <!-- Variables Management -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-muted-700 dark:text-muted-300 block text-sm font-medium">
                متغیرهای قالب
              </label>
              <div class="flex items-center gap-2">
                <BaseButton
                  type="button"
                  size="sm"
                  variant="outline"
                  @click="loadAvailableVariables"
                >
                  بارگذاری متغیرهای پیش‌فرض
                </BaseButton>
                <BaseButton
                  type="button"
                  size="sm"
                  color="primary"
                  @click="addVariable"
                >
                  <Icon name="ph:plus" class="ml-1 size-4" />
                  افزودن متغیر
                </BaseButton>
              </div>
            </div>

            <div v-if="formData.variables.length === 0" class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4 text-center">
              <p class="text-muted-500 dark:text-muted-400 text-sm">
                هنوز متغیری تعریف نشده است
              </p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(variable, index) in formData.variables"
                :key="index"
                class="border-muted-200 dark:border-muted-700 grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-6"
              >
                <BaseInput
                  v-model="variable.name"
                  placeholder="نام متغیر"
                  size="sm"
                />

                <BaseListbox
                  v-model="variable.type"
                  :items="variableTypeOptions"
                  size="sm"
                />

                <BaseListbox
                  v-model="variable.source"
                  :items="variableSourceOptions"
                  size="sm"
                />

                <BaseInput
                  v-model="variable.fallback"
                  placeholder="مقدار پیش‌فرض"
                  size="sm"
                />

                <BaseInput
                  v-model="variable.description"
                  placeholder="توضیحات"
                  size="sm"
                />

                <BaseButton
                  type="button"
                  size="sm"
                  color="danger"
                  variant="outline"
                  @click="removeVariable(index)"
                >
                  <Icon name="ph:trash" class="size-4" />
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="mt-8 flex justify-end gap-3">
          <BaseButton
            type="button"
            variant="outline"
            @click="showCreateForm = false"
          >
            انصراف
          </BaseButton>
          <BaseButton
            type="submit"
            color="primary"
            :disabled="!canSubmit || isSaving"
            :loading="isSaving"
          >
            {{ editingTemplate ? 'بروزرسانی' : 'ایجاد' }} قالب
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Preview Modal -->
    <BaseModal
      v-model="showPreview"
      title="پیش‌نمایش قالب"
      size="2xl"
    >
      <div v-if="previewData" class="space-y-4">
        <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-4">
          <h3 class="text-muted-900 mb-2 text-lg font-semibold dark:text-white">
            {{ previewData.template.name }}
          </h3>
          <p class="text-muted-600 dark:text-muted-300 text-sm">
            {{ previewData.template.description }}
          </p>
        </div>

        <div class="border-muted-200 dark:border-muted-700 rounded-lg border p-4">
          <div class="flex items-start space-x-3 space-x-reverse">
            <div class="bg-primary-100 dark:bg-primary-900 flex size-10 items-center justify-center rounded-lg">
              <Icon name="ph:bell" class="text-primary-600 dark:text-primary-400 size-5" />
            </div>
            <div class="flex-1">
              <h4 class="text-muted-900 mb-2 font-medium dark:text-white">
                {{ previewData.preview.title }}
              </h4>
              <p class="text-muted-600 dark:text-muted-300 mb-3 text-sm">
                {{ previewData.preview.body }}
              </p>

              <div v-if="previewData.preview.actionText" class="flex gap-2">
                <button class="bg-primary-600 hover:bg-primary-700 rounded px-3 py-1 text-sm text-white transition-colors">
                  {{ previewData.preview.actionText }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="previewData.template.variables && previewData.template.variables.length > 0">
          <h4 class="text-muted-700 dark:text-muted-300 mb-2 text-sm font-medium">
            متغیرهای استفاده شده:
          </h4>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="variable in previewData.template.variables"
              :key="variable.name"
              class="bg-muted-100 dark:bg-muted-700 rounded p-2 text-xs"
            >
              <span class="text-muted-900 font-medium dark:text-white">{{ variable.name }}:</span>
              <span class="text-muted-600 dark:text-muted-300">{{ variable.fallback || 'نامشخص' }}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
