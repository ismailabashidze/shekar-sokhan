<script setup lang="ts">
definePageMeta({
  title: 'مدیریت محتوا - مدیریت TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const contentItems = ref([
  {
    id: 1,
    title: '۵ راه برای مدیریت خشم کودک',
    type: 'article',
    category: 'رفتار کودک',
    author: 'دکتر مریم ترابی',
    publishDate: '۱۴۰۳/۰۵/۱۰',
    status: 'published',
    views: 1240,
  },
  {
    id: 2,
    title: 'تاثیر بازی بر رشد ذهنی کودک',
    type: 'article',
    category: 'رشد کودک',
    author: 'دکتر علی بهرامی',
    publishDate: '۱۴۰۳/۰۵/۰۵',
    status: 'published',
    views: 980,
  },
  {
    id: 3,
    title: 'راهنمای شروع مشاوره آنلاین',
    type: 'guide',
    category: 'راهنمایی',
    author: 'تیم TogetherMama',
    publishDate: '۱۴۰۳/۰۴/۲۸',
    status: 'draft',
    views: 0,
  },
  {
    id: 4,
    title: 'مصاحبه با دکتر کاملیا مرادزاده',
    type: 'interview',
    category: 'مصاحبه',
    author: 'تیم TogetherMama',
    publishDate: '۱۴۰۳/۰۴/۲۰',
    status: 'published',
    views: 1560,
  },
])

const search = ref('')
const typeFilter = ref('all')
const statusFilter = ref('all')

const filteredContent = computed(() => {
  let result = contentItems.value
  
  if (typeFilter.value !== 'all') {
    result = result.filter(c => c.type === typeFilter.value)
  }
  
  if (statusFilter.value !== 'all') {
    result = result.filter(c => c.status === statusFilter.value)
  }
  
  if (search.value) {
    result = result.filter(c => 
      c.title.includes(search.value) || 
      c.author.includes(search.value) ||
      c.category.includes(search.value)
    )
  }
  
  // Sort by publish date
  result.sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })
  
  return result
})

const createContent = () => {
  // Mock create content functionality
  alert('ایجاد محتوای جدید')
}

const editContent = (id: number) => {
  // Mock edit content functionality
  alert(`ویرایش محتوا با شناسه ${id}`)
}

const deleteContent = (id: number) => {
  // Mock delete content functionality
  if (confirm('آیا مطمئن هستید که می‌خواهید این محتوا را حذف کنید؟')) {
    alert(`محتوا با شناسه ${id} حذف شد`)
  }
}

const toggleStatus = (id: number) => {
  // Mock toggle status functionality
  const content = contentItems.value.find(c => c.id === id)
  if (content) {
    content.status = content.status === 'published' ? 'draft' : 'published'
    alert(`وضعیت محتوا به ${content.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'} تغییر کرد`)
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <BaseHeading
            as="h1"
            size="2xl"
            weight="bold"
            class="text-muted-800 dark:text-white"
          >
            مدیریت محتوا
          </BaseHeading>
          <BaseParagraph class="text-muted-500">
            مشاهده و مدیریت مقالات، راهنماها و محتوای آموزشی
          </BaseParagraph>
        </div>
        <BaseButton color="primary" @click="createContent">
          <Icon name="ph:plus" class="ml-2 size-4" />
          ایجاد محتوا
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <BaseCard class="mb-6 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap gap-3">
          <BaseButton
            :color="typeFilter === 'all' ? 'primary' : 'muted'"
            size="sm"
            @click="typeFilter = 'all'"
          >
            همه انواع
          </BaseButton>
          <BaseButton
            :color="typeFilter === 'article' ? 'primary' : 'muted'"
            size="sm"
            @click="typeFilter = 'article'"
          >
            مقالات
          </BaseButton>
          <BaseButton
            :color="typeFilter === 'guide' ? 'primary' : 'muted'"
            size="sm"
            @click="typeFilter = 'guide'"
          >
            راهنماها
          </BaseButton>
          <BaseButton
            :color="typeFilter === 'interview' ? 'primary' : 'muted'"
            size="sm"
            @click="typeFilter = 'interview'"
          >
            مصاحبه‌ها
          </BaseButton>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <BaseButton
            :color="statusFilter === 'all' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'all'"
          >
            همه وضعیت‌ها
          </BaseButton>
          <BaseButton
            :color="statusFilter === 'published' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'published'"
          >
            منتشر شده
          </BaseButton>
          <BaseButton
            :color="statusFilter === 'draft' ? 'primary' : 'muted'"
            size="sm"
            @click="statusFilter = 'draft'"
          >
            پیش‌نویس
          </BaseButton>
          
          <div class="md:w-64">
            <BaseInput
              v-model="search"
              placeholder="جستجو..."
              shape="curved"
              :classes="{ input: 'h-10' }"
            >
              <template #addon>
                <Icon name="ph:magnifying-glass" class="text-muted-500 size-4" />
              </template>
            </BaseInput>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Content List -->
    <BaseCard class="p-6">
      <div class="border-muted-200 dark:border-muted-700 divide-y rounded-lg border">
        <div
          v-for="content in filteredContent"
          :key="content.id"
          class="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
              {{ content.title }}
            </BaseHeading>
            <BaseParagraph class="text-muted-500 text-sm">
              {{ content.author }} - {{ content.category }}
            </BaseParagraph>
          </div>
          
          <div class="flex-1">
            <BaseTag
              :color="content.type === 'article' ? 'primary' : content.type === 'guide' ? 'success' : 'info'"
              variant="pastel"
              size="sm"
            >
              {{ content.type === 'article' ? 'مقاله' : content.type === 'guide' ? 'راهنما' : 'مصاحبه' }}
            </BaseTag>
          </div>
          
          <div class="flex items-center gap-4">
            <BaseTag
              :color="content.status === 'published' ? 'success' : 'warning'"
              variant="pastel"
              size="sm"
            >
              {{ content.status === 'published' ? 'منتشر شده' : 'پیش‌نویس' }}
            </BaseTag>
            <div class="text-center md:text-right">
              <BaseParagraph class="text-muted-800 dark:text-white text-sm">
                بازدید: {{ content.views }}
              </BaseParagraph>
              <BaseParagraph class="text-muted-500 text-xs">
                {{ content.publishDate }}
              </BaseParagraph>
            </div>
            <div class="flex gap-2">
              <BaseButtonIcon size="sm" color="muted" @click="editContent(content.id)">
                <Icon name="ph:pencil-simple" class="size-4" />
              </BaseButtonIcon>
              <BaseButtonIcon 
                size="sm" 
                :color="content.status === 'published' ? 'warning' : 'success'"
                @click="toggleStatus(content.id)"
              >
                <Icon 
                  :name="content.status === 'published' ? 'ph:eye-slash' : 'ph:eye'" 
                  class="size-4" 
                />
              </BaseButtonIcon>
              <BaseButtonIcon size="sm" color="danger" @click="deleteContent(content.id)">
                <Icon name="ph:trash" class="size-4" />
              </BaseButtonIcon>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>