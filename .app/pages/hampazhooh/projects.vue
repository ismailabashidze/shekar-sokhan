<script setup lang="ts">
  interface ResearchProject {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    participants: number;
    maxParticipants: number;
    researcher: string;
    institution: string;
    category: string;
    progress: number;
  }

  definePageMeta({
    title: 'پروژه‌های پژوهشی',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

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
  ]);

  const router = useRouter();
  const toaster = useToaster();

  const searchQuery = ref('');
  const selectedStatus = ref('همه');
  const selectedCategory = ref('همه');
  const viewMode = ref<'grid' | 'list'>('grid');
  const sortBy = ref<'recent' | 'title' | 'progress' | 'participants'>('recent');

  const statusOptions = ['همه', 'برنامه‌ریزی شده', 'در حال انجام', 'تکمیل شده', 'متوقف شده'];

  const categoryOptions = [
    'همه',
    'روانشناسی بالینی',
    'روانشناسی اجتماعی',
    'روانشناسی رشد',
    'سلامت روان',
    'روانشناسی شناختی',
  ];

  const sortOptions = [
    { label: 'جدیدترین', value: 'recent' },
    { label: 'عنوان', value: 'title' },
    { label: 'پیشرفت', value: 'progress' },
    { label: 'شرکت‌کنندگان', value: 'participants' },
  ];

  const statistics = computed(() => {
    const total = projects.value.length;
    const planned = projects.value.filter(p => p.status === 'برنامه‌ریزی شده').length;
    const ongoing = projects.value.filter(p => p.status === 'در حال انجام').length;
    const completed = projects.value.filter(p => p.status === 'تکمیل شده').length;
    const paused = projects.value.filter(p => p.status === 'متوقف شده').length;

    return { total, planned, ongoing, completed, paused };
  });

  const filteredProjects = computed(() => {
    let filtered = projects.value.filter((project) => {
      const matchesSearch
        = project.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        || project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        || project.researcher.toLowerCase().includes(searchQuery.value.toLowerCase());

      const matchesStatus = selectedStatus.value === 'همه' || project.status === selectedStatus.value;
      const matchesCategory = selectedCategory.value === 'همه' || project.category === selectedCategory.value;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortBy.value === 'title') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
    }
 else if (sortBy.value === 'progress') {
      filtered = filtered.sort((a, b) => b.progress - a.progress);
    }
 else if (sortBy.value === 'participants') {
      filtered = filtered.sort((a, b) => b.participants - a.participants);
    }

    return filtered;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'برنامه‌ریزی شده': 'info',
      'در حال انجام': 'warning',
      'تکمیل شده': 'success',
      'متوقف شده': 'danger',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      'برنامه‌ریزی شده': 'ph:calendar-plus',
      'در حال انجام': 'ph:play-circle',
      'تکمیل شده': 'ph:check-circle',
      'متوقف شده': 'ph:pause-circle',
    };
    return icons[status] || 'ph:circle';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'روانشناسی بالینی': 'ph:stethoscope',
      'روانشناسی اجتماعی': 'ph:users-three',
      'روانشناسی رشد': 'ph:plant',
      'سلامت روان': 'ph:heart',
      'روانشناسی شناختی': 'ph:brain',
    };
    return icons[category] || 'ph:clipboard-text';
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'success';
    if (progress >= 60) return 'warning';
    if (progress > 0) return 'info';
    return 'muted';
  };

  const createNewProject = () => {
    router.push('/hampazhooh/create');
  };

  const viewProject = (projectId: string) => {
    router.push(`/hampazhooh/project/${projectId}`);
  };

  const editProject = (projectId: string) => {
    router.push(`/hampazhooh/project/${projectId}/edit`);
  };

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
            projects.value = projects.value.filter(p => p.id !== projectId);
            toaster.show({
              title: 'موفق',
              message: 'پروژه با موفقیت حذف شد',
              color: 'success',
              icon: 'ph:check-fill',
              closable: true,
            });
          },
        },
      ],
    });
  };
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BaseHeading
              as="h1"
              size="2xl"
              weight="bold"
              class="text-gray-900 dark:text-white"
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
            class="shadow-primary-500/30 shadow-lg"
            @click="createNewProject"
          >
            <Icon name="ph:plus-fill" class="ml-2 size-5" />
            پروژه جدید
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="px-4 py-6 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <!-- Total Projects -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 mb-1 text-sm font-medium">
                کل پروژه‌ها
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ statistics.total }}
              </p>
            </div>
            <div class="bg-primary-500/10 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Icon name="ph:clipboard-text-fill" class="text-primary-500 size-6" />
            </div>
          </div>
        </div>

        <!-- Planned -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 mb-1 text-sm font-medium">
                برنامه‌ریزی شده
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ statistics.planned }}
              </p>
            </div>
            <div class="bg-info-500/10 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Icon name="ph:calendar-plus-fill" class="text-info-500 size-6" />
            </div>
          </div>
        </div>

        <!-- Ongoing -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 mb-1 text-sm font-medium">
                در حال انجام
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ statistics.ongoing }}
              </p>
            </div>
            <div class="bg-warning-500/10 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Icon name="ph:play-circle-fill" class="text-warning-500 size-6" />
            </div>
          </div>
        </div>

        <!-- Completed -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 mb-1 text-sm font-medium">
                تکمیل شده
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ statistics.completed }}
              </p>
            </div>
            <div class="bg-success-500/10 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Icon name="ph:check-circle-fill" class="text-success-500 size-6" />
            </div>
          </div>
        </div>

        <!-- Paused -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 mb-1 text-sm font-medium">
                متوقف شده
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ statistics.paused }}
              </p>
            </div>
            <div class="bg-danger-500/10 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Icon name="ph:pause-circle-fill" class="text-danger-500 size-6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Controls -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="p-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <!-- Search -->
            <div class="flex-1 lg:max-w-md">
              <BaseInput
                v-model="searchQuery"
                placeholder="جستجو در عنوان، توضیحات یا محقق..."
                shape="curved"
                :classes="{ input: 'h-11' }"
              >
                <template #prefix>
                  <Icon name="ph:magnifying-glass" class="text-muted-400 size-5" />
                </template>
              </BaseInput>
            </div>

            <!-- View Mode & Sort -->
            <div class="flex items-center gap-3">
              <!-- Sort Dropdown -->
              <BaseListbox
                v-model="sortBy"
                :items="sortOptions"
                placeholder="مرتب‌سازی"
                shape="curved"
                :classes="{ input: 'h-11' }"
                class="w-full lg:w-40"
              />

              <!-- View Mode Toggle -->
              <div class="dark:bg-muted-700 flex rounded-xl bg-gray-100 p-1">
                <button
                  :class="[
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    viewMode === 'grid'
                      ? 'text-primary-500 dark:bg-muted-800 bg-white shadow-sm'
                      : 'text-muted-500 hover:text-muted-700 dark:hover:text-muted-300',
                  ]"
                  @click="viewMode = 'grid'"
                >
                  <Icon name="ph:squares-four" class="size-5" />
                  <span class="hidden sm:inline">شبکه‌ای</span>
                </button>
                <button
                  :class="[
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    viewMode === 'list'
                      ? 'text-primary-500 dark:bg-muted-800 bg-white shadow-sm'
                      : 'text-muted-500 hover:text-muted-700 dark:hover:text-muted-300',
                  ]"
                  @click="viewMode = 'list'"
                >
                  <Icon name="ph:list" class="size-5" />
                  <span class="hidden sm:inline">لیستی</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap gap-3">
            <!-- Status Filter -->
            <BaseListbox
              v-model="selectedStatus"
              :items="statusOptions"
              placeholder="وضعیت"
              shape="curved"
              :classes="{ input: 'h-10' }"
              class="w-full sm:w-auto sm:min-w-[180px]"
            />

            <!-- Category Filter -->
            <BaseListbox
              v-model="selectedCategory"
              :items="categoryOptions"
              placeholder="دسته‌بندی"
              shape="curved"
              :classes="{ input: 'h-10' }"
              class="w-full sm:w-auto sm:min-w-[180px]"
            />

            <!-- Active Filters Count -->
            <div
              v-if="selectedStatus !== 'همه' || selectedCategory !== 'همه'"
              class="flex items-center gap-2"
            >
              <BaseTag
                color="primary"
                size="sm"
                shape="curved"
                class="cursor-pointer"
                @click="selectedStatus = 'همه'; selectedCategory = 'همه'"
              >
                <Icon name="ph:x" class="ml-1 size-3" />
                پاک کردن فیلترها
              </BaseTag>
            </div>

            <!-- Results Count -->
            <div class="text-muted-500 mr-auto flex items-center gap-2 text-sm">
              <Icon name="ph:funnel" class="size-4" />
              <span>{{ filteredProjects.length }} پروژه</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects List -->
    <div class="px-4 py-6 sm:px-6 lg:px-8">
      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="flex min-h-[400px] items-center justify-center py-12">
        <div class="text-center">
          <div class="bg-muted-100 dark:bg-muted-800 mx-auto mb-6 flex size-24 items-center justify-center rounded-full">
            <Icon name="ph:clipboard-text" class="text-muted-400 size-12" />
          </div>
          <BaseHeading
            as="h3"
            size="xl"
            weight="semibold"
            class="text-muted-700 dark:text-muted-200 mb-2"
          >
            پروژه‌ای یافت نشد
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 mb-6 max-w-md">
            {{ projects.length === 0
              ? 'هنوز پروژه‌ای ایجاد نکرده‌اید. اولین پروژه پژوهشی خود را ایجاد کنید.'
              : 'هیچ پروژه‌ای با فیلترهای انتخابی مطابقت ندارد. فیلترها را تغییر دهید.'
            }}
          </BaseParagraph>
          <BaseButton
            v-if="projects.length === 0"
            color="primary"
            shape="curved"
            size="lg"
            class="shadow-primary-500/30 shadow-lg"
            @click="createNewProject"
          >
            <Icon name="ph:plus-fill" class="ml-2 size-5" />
            اولین پروژه را بسازید
          </BaseButton>
          <BaseButton
            v-else
            color="muted"
            shape="curved"
            @click="selectedStatus = 'همه'; selectedCategory = 'همه'; searchQuery = ''"
          >
            <Icon name="ph:arrows-counter-clockwise" class="ml-2 size-4" />
            پاک کردن همه فیلترها
          </BaseButton>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="dark:bg-muted-800 dark:border-muted-700 group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/50"
        >
          <!-- Status Badge - Top Right -->
          <div class="absolute left-4 top-4 z-10">
            <BaseTag
              :color="getStatusColor(project.status)"
              size="sm"
              shape="full"
              class="shadow-lg"
            >
              <Icon :name="getStatusIcon(project.status)" class="ml-1 size-3.5" />
              {{ project.status }}
            </BaseTag>
          </div>

          <!-- Category Badge - Top Left -->
          <div class="absolute right-4 top-4 z-10">
            <BaseTag
              color="muted"
              size="sm"
              shape="full"
              class="dark:bg-muted-700 bg-white/90 shadow-lg backdrop-blur-sm"
            >
              <Icon :name="getCategoryIcon(project.category)" class="ml-1 size-3.5" />
              {{ project.category }}
            </BaseTag>
          </div>

          <div class="p-6 pt-16">
            <!-- Title -->
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 group-hover:text-primary-500 mb-3 line-clamp-2 cursor-pointer transition-colors duration-200 dark:text-white"
              @click="viewProject(project.id)"
            >
              {{ project.title }}
            </BaseHeading>

            <!-- Description -->
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-4 line-clamp-2">
              {{ project.description }}
            </BaseParagraph>

            <!-- Meta Information -->
            <div class="mb-6 space-y-2">
              <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2 text-sm">
                <Icon name="ph:user-circle" class="text-primary-500 size-5" />
                <span class="font-medium">{{ project.researcher }}</span>
              </div>
              <div class="text-muted-600 dark:text-muted-400 flex items-center gap-2 text-sm">
                <Icon name="ph:buildings" class="text-info-500 size-5" />
                <span>{{ project.institution }}</span>
              </div>
            </div>

            <!-- Progress Section -->
            <div class="dark:border-muted-700 dark:bg-muted-900/50 mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-muted-700 dark:text-muted-300 text-sm font-semibold">پیشرفت</span>
                <span class="text-primary-500 text-lg font-bold">{{ project.progress }}%</span>
              </div>
              <BaseProgressbar
                :value="project.progress"
                :color="getProgressColor(project.progress)"
                size="md"
                shape="full"
                class="mb-3"
              />
              <div class="flex items-center justify-between text-xs">
                <div class="text-muted-500 flex items-center gap-1.5">
                  <Icon name="ph:users" class="size-4" />
                  <span>{{ project.participants }} / {{ project.maxParticipants }} شرکت‌کننده</span>
                </div>
                <div
                  :class="[
                    'font-medium',
                    project.participants >= project.maxParticipants ? 'text-success-500' : 'text-muted-500'
                  ]"
                >
                  {{ project.participants >= project.maxParticipants ? 'تکمیل' : `${project.maxParticipants - project.participants} باقیمانده` }}
                </div>
              </div>
            </div>

            <!-- Dates -->
            <div class="text-muted-500 dark:text-muted-400 mb-5 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5">
                <Icon name="ph:calendar" class="size-4" />
                <span>{{ project.startDate }}</span>
              </div>
              <Icon name="ph:arrow-left" class="size-3" />
              <div class="flex items-center gap-1.5">
                <Icon name="ph:calendar-check" class="size-4" />
                <span>{{ project.endDate }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <BaseButton
                color="primary"
                size="sm"
                shape="curved"
                class="flex-1"
                @click="viewProject(project.id)"
              >
                <Icon name="ph:eye" class="ml-1 size-4" />
                مشاهده
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
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="dark:bg-muted-800 dark:border-muted-700 group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl"
        >
          <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
            <!-- Left: Project Info -->
            <div class="flex-1">
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <BaseHeading
                  as="h3"
                  size="lg"
                  weight="semibold"
                  class="text-muted-800 group-hover:text-primary-500 cursor-pointer transition-colors duration-200 dark:text-white"
                  @click="viewProject(project.id)"
                >
                  {{ project.title }}
                </BaseHeading>
                <BaseTag
                  :color="getStatusColor(project.status)"
                  size="sm"
                  shape="full"
                >
                  <Icon :name="getStatusIcon(project.status)" class="ml-1 size-3.5" />
                  {{ project.status }}
                </BaseTag>
                <BaseTag
                  color="muted"
                  size="sm"
                  shape="full"
                >
                  <Icon :name="getCategoryIcon(project.category)" class="ml-1 size-3.5" />
                  {{ project.category }}
                </BaseTag>
              </div>

              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-3 line-clamp-2">
                {{ project.description }}
              </BaseParagraph>

              <div class="text-muted-600 dark:text-muted-400 flex flex-wrap gap-4 text-sm">
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:user-circle" class="text-primary-500 size-4" />
                  <span>{{ project.researcher }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:buildings" class="text-info-500 size-4" />
                  <span>{{ project.institution }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:calendar" class="size-4" />
                  <span>{{ project.startDate }} - {{ project.endDate }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:users" class="size-4" />
                  <span>{{ project.participants }} / {{ project.maxParticipants }}</span>
                </div>
              </div>
            </div>

            <!-- Right: Progress & Actions -->
            <div class="flex flex-col gap-4 lg:w-64 lg:items-end">
              <!-- Progress -->
              <div class="w-full">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-muted-600 dark:text-muted-400 text-xs">پیشرفت</span>
                  <span class="text-primary-500 text-sm font-bold">{{ project.progress }}%</span>
                </div>
                <BaseProgressbar
                  :value="project.progress"
                  :color="getProgressColor(project.progress)"
                  size="sm"
                  shape="full"
                />
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <BaseButton
                  color="primary"
                  size="sm"
                  shape="curved"
                  @click="viewProject(project.id)"
                >
                  <Icon name="ph:eye" class="ml-1 size-4" />
                  مشاهده
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
