<script setup lang="ts">
import type { ResearchProject } from '@/types'

definePageMeta({
  title: 'پروژه‌های پژوهشی',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// Sample data - replace with actual API call
const projects = ref<ResearchProject[]>([
  {
    id: '1',
    title: 'بررسی اثربخشی درمان شناختی-رفتاری بر اضطراب اجتماعی',
    description: 'این مطالعه به بررسی تأثیر CBT بر کاهش علائم اضطراب اجتماعی در بزرگسالان جوان می‌پردازد.',
    status: 'در حال انجام',
    startDate: '۱۴۰۳/۰۱/۱۵',
    endDate: '۱۴۰۳/۰۶/۱۵',
    participants: 45,
    maxParticipants: 60,
    researcher: 'دکتر احمدی',
    institution: 'دانشگاه تهران',
    category: 'روانشناسی بالینی',
    progress: 75,
  },
  {
    id: '2',
    title: 'رابطه بین سبک‌های دلبستگی و رضایت زناشویی',
    description: 'تحلیل ارتباط بین سبک‌های دلبستگی بزرگسالان و سطح رضایت از روابط زناشویی.',
    status: 'تکمیل شده',
    startDate: '۱۴۰۲/۰۹/۰۱',
    endDate: '۱۴۰۳/۰۲/۰۱',
    participants: 120,
    maxParticipants: 120,
    researcher: 'دکتر محمدی',
    institution: 'دانشگاه شهید بهشتی',
    category: 'روانشناسی اجتماعی',
    progress: 100,
  },
  {
    id: '3',
    title: 'تأثیر مدیتیشن mindfulness بر استرس شغلی',
    description: 'ارزیابی اثربخشی برنامه‌های مدیتیشن بر کاهش استرس و فرسودگی شغلی در پرستاران.',
    status: 'برنامه‌ریزی شده',
    startDate: '۱۴۰۳/۰۴/۰۱',
    endDate: '۱۴۰۳/۱۰/۰۱',
    participants: 0,
    maxParticipants: 80,
    researcher: 'دکتر رضایی',
    institution: 'دانشگاه علوم پزشکی',
    category: 'سلامت روان',
    progress: 0,
  },
])

const router = useRouter()
const toaster = useToaster()

// Filter states
const searchQuery = ref('')
const selectedStatus = ref('همه')
const selectedCategory = ref('همه')

// Filter options
const statusOptions = [
  'همه',
  'برنامه‌ریزی شده',
  'در حال انجام',
  'تکمیل شده',
  'متوقف شده',
]

const categoryOptions = [
  'همه',
  'روانشناسی بالینی',
  'روانشناسی اجتماعی',
  'روانشناسی رشد',
  'سلامت روان',
  'روانشناسی شناختی',
]

// Computed filtered projects
const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      || project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      || project.researcher.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = selectedStatus.value === 'همه' || project.status === selectedStatus.value
    const matchesCategory = selectedCategory.value === 'همه' || project.category === selectedCategory.value

    return matchesSearch && matchesStatus && matchesCategory
  })
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'برنامه‌ریزی شده': 'info',
    'در حال انجام': 'warning',
    'تکمیل شده': 'success',
    'متوقف شده': 'danger',
  }
  return colors[status] || 'default'
}

const getProgressColor = (progress: number) => {
  if (progress === 100) return 'success'
  if (progress >= 60) return 'warning'
  if (progress > 0) return 'info'
  return 'muted'
}

const createNewProject = () => {
  router.push('/hampazhooh/create')
}

const viewProject = (projectId: string) => {
  router.push(`/hampazhooh/project/${projectId}`)
}

const editProject = (projectId: string) => {
  router.push(`/hampazhooh/project/${projectId}/edit`)
}

const deleteProject = (projectId: string) => {
  // Implement delete functionality
  toaster.show({
    title: 'حذف پروژه',
    message: 'آیا از حذف این پروژه اطمینان دارید؟',
    color: 'danger',
    icon: 'ph:warning-fill',
    closable: true,
    actions: [
      {
        label: 'بله، حذف کن',
        color: 'danger',
        action: () => {
          projects.value = projects.value.filter(p => p.id !== projectId)
          toaster.show({
            title: 'موفق',
            message: 'پروژه با موفقیت حذف شد',
            color: 'success',
            icon: 'ph:check-fill',
            closable: true,
          })
        },
      },
    ],
  })
}
</script>

<template>
  <div class="dark:bg-muted-800 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BaseHeading
              as="h1"
              size="2xl"
              weight="medium"
            >
              پروژه‌های پژوهشی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-400 mt-1">
              مدیریت و مشاهده پروژه‌های پژوهشی خود
            </BaseParagraph>
          </div>
          <BaseButton
            color="primary"
            shape="curved"
            @click="createNewProject"
          >
            <Icon name="ph:plus-fill" class="ml-2 size-4" />
            پروژه جدید
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="p-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 lg:flex-row">
          <!-- Search -->
          <div class="flex-1">
            <BaseInput
              v-model="searchQuery"
              placeholder="جستجو در پروژه‌ها..."
              shape="curved"
              :classes="{ input: 'h-10' }"
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass" class="text-muted-400 size-4" />
              </template>
            </BaseInput>
          </div>

          <!-- Status Filter -->
          <div class="w-full lg:w-48">
            <BaseListbox
              v-model="selectedStatus"
              :items="statusOptions"
              placeholder="وضعیت"
              shape="curved"
              :classes="{ input: 'h-10' }"
            />
          </div>

          <!-- Category Filter -->
          <div class="w-full lg:w-48">
            <BaseListbox
              v-model="selectedCategory"
              :items="categoryOptions"
              placeholder="دسته‌بندی"
              shape="curved"
              :classes="{ input: 'h-10' }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Projects List -->
    <div class="px-4 py-6 sm:px-6 lg:px-8">
      <div v-if="filteredProjects.length === 0" class="py-12 text-center">
        <Icon name="ph:clipboard-text" class="text-muted-300 mx-auto size-16" />
        <BaseHeading
          as="h3"
          size="lg"
          weight="medium"
          class="text-muted-600 mt-4"
        >
          پروژه‌ای یافت نشد
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-400 mt-2">
          هنوز پروژه‌ای ایجاد نکرده‌اید یا با فیلترهای موجود مطابقت ندارد.
        </BaseParagraph>
        <BaseButton
          color="primary"
          shape="curved"
          class="mt-6"
          @click="createNewProject"
        >
          <Icon name="ph:plus-fill" class="ml-2 size-4" />
          اولین پروژه را بسازید
        </BaseButton>
      </div>

      <div v-else class="grid gap-6">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="dark:bg-muted-800 dark:border-muted-700 overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-lg"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-3">
                  <BaseHeading
                    as="h3"
                    size="lg"
                    weight="medium"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ project.title }}
                  </BaseHeading>
                  <BaseTag
                    :color="getStatusColor(project.status)"
                    size="sm"
                    shape="curved"
                  >
                    {{ project.status }}
                  </BaseTag>
                </div>
                <BaseParagraph size="sm" class="text-muted-500 mb-3">
                  {{ project.description }}
                </BaseParagraph>
                <div class="text-muted-600 flex flex-wrap gap-4 text-sm">
                  <div class="flex items-center gap-1">
                    <Icon name="ph:user" class="size-4" />
                    <span>{{ project.researcher }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon name="ph:buildings" class="size-4" />
                    <span>{{ project.institution }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon name="ph:tag" class="size-4" />
                    <span>{{ project.category }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <BaseButton
                  color="muted"
                  size="sm"
                  shape="curved"
                  @click="viewProject(project.id)"
                >
                  <Icon name="ph:eye" class="size-4" />
                </BaseButton>
                <BaseButton
                  color="muted"
                  size="sm"
                  shape="curved"
                  @click="editProject(project.id)"
                >
                  <Icon name="ph:pencil-simple" class="size-4" />
                </BaseButton>
                <BaseButton
                  color="danger"
                  size="sm"
                  shape="curved"
                  @click="deleteProject(project.id)"
                >
                  <Icon name="ph:trash" class="size-4" />
                </BaseButton>
              </div>
            </div>

            <!-- Progress & Details -->
            <div class="dark:border-muted-700 mt-6 border-t border-gray-200 pt-6">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <!-- Progress -->
                <div class="col-span-1 md:col-span-2">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-muted-700 dark:text-muted-300 text-sm font-medium">
                      پیشرفت پروژه
                    </span>
                    <span class="text-muted-500 text-sm">{{ project.progress }}%</span>
                  </div>
                  <BaseProgressbar
                    :value="project.progress"
                    :color="getProgressColor(project.progress)"
                    size="sm"
                    shape="curved"
                  />
                </div>

                <!-- Participants -->
                <div class="text-center md:text-left">
                  <div class="text-muted-500 mb-1 text-sm">
                    شرکت‌کنندگان
                  </div>
                  <div class="flex items-center justify-center gap-1 md:justify-start">
                    <span class="text-muted-800 dark:text-muted-100 font-medium">
                      {{ project.participants }}
                    </span>
                    <span class="text-muted-400">/</span>
                    <span class="text-muted-500">{{ project.maxParticipants }}</span>
                  </div>
                </div>
              </div>

              <!-- Dates -->
              <div class="text-muted-500 mt-4 flex flex-wrap gap-4 text-sm">
                <div class="flex items-center gap-1">
                  <Icon name="ph:calendar" class="size-4" />
                  <span>شروع: {{ project.startDate }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="ph:calendar-check" class="size-4" />
                  <span>پایان: {{ project.endDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
