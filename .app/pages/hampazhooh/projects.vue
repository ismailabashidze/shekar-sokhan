<script setup lang="ts">
  type ProjectStatus =
    | 'created'
    | 'collectingRelatedArticles'
    | 'Analyzing'
    | 'readyForContinue'
    | 'inProgress'
    | 'done';

  type ProjectType = 'project' | 'doctoral' | 'masters' | 'article';

  const colorClassLookup: Record<
    string,
    {
      bg: string;
      text: string;
    }
  > = {
    primary: {
      bg: 'bg-primary-500/10',
      text: 'text-primary-500',
    },
    info: {
      bg: 'bg-info-500/10',
      text: 'text-info-500',
    },
    warning: {
      bg: 'bg-warning-500/10',
      text: 'text-warning-500',
    },
    success: {
      bg: 'bg-success-500/10',
      text: 'text-success-500',
    },
    danger: {
      bg: 'bg-danger-500/10',
      text: 'text-danger-500',
    },
    muted: {
      bg: 'bg-muted-500/10',
      text: 'text-muted-500',
    },
  };

  const getBgClass = (color: string) => colorClassLookup[color]?.bg || colorClassLookup.primary.bg;
  const getTextClass = (color: string) => colorClassLookup[color]?.text || colorClassLookup.primary.text;

  interface DisplayProject {
    id: string;
    title: string;
    description: string;
    statusKey: ProjectStatus;
    statusLabel: string;
    statusColor: string;
    statusIcon: string;
    statusHelper: string;
    statusBgClass: string;
    statusTextClass: string;
    projectType: ProjectType;
    projectTypeLabel: string;
    projectTypeIcon: string;
    projectTypeColor: string;
    researchDomains: string[];
    keywords: string[];
    researchGoals: string[];
    necessity: string;
    importance: string;
    createdAt: string;
    updatedAt: string;
    createdTimestamp: number;
    updatedTimestamp: number;
    searchableText: string;
  }

  const statusDictionary: Record<ProjectStatus, { label: string; color: string; icon: string; helper: string }> = {
    created: {
      label: 'ثبت اولیه',
      color: 'info',
      icon: 'ph:clock',
      helper: 'پروژه تازه ایجاد شده است',
    },
    collectingRelatedArticles: {
      label: 'جمع‌آوری منابع',
      color: 'warning',
      icon: 'ph:books',
      helper: 'در حال جمع‌آوری مقالات و منابع مرتبط',
    },
    Analyzing: {
      label: 'تحلیل داده‌ها',
      color: 'primary',
      icon: 'ph:chart-line-up',
      helper: 'مرحله تحلیل و نتیجه‌گیری در حال انجام است',
    },
    readyForContinue: {
      label: 'آماده ادامه',
      color: 'info',
      icon: 'ph:arrow-fat-lines-right',
      helper: 'پروژه برای مراحل بعدی آماده است',
    },
    inProgress: {
      label: 'در حال اجرا',
      color: 'success',
      icon: 'ph:play-circle',
      helper: 'محقق در حال پیشبرد پروژه است',
    },
    done: {
      label: 'تکمیل شده',
      color: 'success',
      icon: 'ph:check-circle',
      helper: 'پروژه به پایان رسیده است',
    },
  };

  const projectTypeDictionary: Record<ProjectType, { label: string; icon: string; color: string }> = {
    project: {
      label: 'پروژه پژوهشی',
      icon: 'ph:folder-open',
      color: 'primary',
    },
    doctoral: {
      label: 'رساله دکتری',
      icon: 'ph:graduation-cap',
      color: 'info',
    },
    masters: {
      label: 'پایان‌نامه ارشد',
      icon: 'ph:student',
      color: 'success',
    },
    article: {
      label: 'پروژه مقاله',
      icon: 'ph:article',
      color: 'warning',
    },
  };

  definePageMeta({
    title: 'پروژه‌های پژوهشی',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();
  const { user } = useUser();
  const { getResearchProjectsByUser, deleteResearchProject } = useResearchProject();

  const projects = ref<DisplayProject[]>([]);
  const isLoading = ref(false);
  const loadError = ref('');

  const searchQuery = ref('');
  const selectedStatus = ref<'all' | ProjectStatus>('all');
  const selectedProjectType = ref<'all' | ProjectType>('all');
  const viewMode = ref<'grid' | 'list'>('grid');
  const sortBy = ref<'recent' | 'title' | 'status'>('recent');

  const statusOptions = [
    { label: 'همه وضعیت‌ها', value: 'all' },
    ...Object.entries(statusDictionary).map(([value, config]) => ({
      label: config.label,
      value,
    })),
  ];

  const projectTypeOptions = [
    { label: 'همه انواع پروژه', value: 'all' },
    ...Object.entries(projectTypeDictionary).map(([value, config]) => ({
      label: config.label,
      value,
    })),
  ];

  const sortOptions = [
    { label: 'جدیدترین', value: 'recent' },
    { label: 'عنوان', value: 'title' },
    { label: 'وضعیت', value: 'status' },
  ];

  const statusCardOrder: ProjectStatus[] = [
    'created',
    'collectingRelatedArticles',
    'Analyzing',
    'readyForContinue',
    'inProgress',
    'done',
  ];

  const truncateText = (text: string, limit = 160) => {
    if (!text) return '';
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  };

  const formatDateToFa = (value?: string) => {
    if (!value) return 'نامشخص';
    try {
      return new Date(value).toLocaleDateString('fa-IR');
    } catch {
      return 'نامشخص';
    }
  };

  const normalizeArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === 'string' ? item : JSON.stringify(item))).filter(Boolean);
    }
    if (typeof value === 'string' && value.trim()) return [value.trim()];
    return [];
  };

  const buildProjectTitle = (project: any): string => {
    const domains = normalizeArray(project.researchDomain);
    if (project.customTitle?.trim()) return project.customTitle.trim();
    if (domains.length > 0) {
      return `پروژه در حوزه ${domains[0]}`;
    }
    const projectTypeKey = (project.projectType as ProjectType) || 'project';
    const projectTypeMeta = projectTypeDictionary[projectTypeKey] || projectTypeDictionary.project;
    return projectTypeMeta.label;
  };

  const formatProjectRecord = (record: any): DisplayProject => {
    const statusKey = (record.status as ProjectStatus) || 'created';
    const statusMeta = statusDictionary[statusKey] || statusDictionary.created;
    const projectTypeKey = (record.projectType as ProjectType) || 'project';
    const projectTypeMeta = projectTypeDictionary[projectTypeKey] || projectTypeDictionary.project;
    const statusColorClasses = {
      bg: getBgClass(statusMeta.color),
      text: getTextClass(statusMeta.color),
    };

    const researchDomains = normalizeArray(record.researchDomain);
    const keywords = normalizeArray(record.keywords);
    const researchGoals = normalizeArray(record.researchGoals);

    const createdTimestamp = record.created ? new Date(record.created).getTime() : Date.now();
    const updatedTimestamp = record.updated ? new Date(record.updated).getTime() : createdTimestamp;

    const descriptionSource = record.importance || record.necessity || record.brainstormResults || '';
    const description = descriptionSource
      ? truncateText(descriptionSource, 220)
      : 'برای این پروژه هنوز توضیحی ثبت نشده است.';

    const searchableText = [
      buildProjectTitle(record),
      descriptionSource,
      researchDomains.join(' '),
      keywords.join(' '),
      researchGoals.join(' '),
    ]
      .join(' ')
      .toLowerCase();

    const fallbackId =
      record.id ||
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`);

    return {
      id: fallbackId,
      title: buildProjectTitle(record),
      description,
      statusKey,
      statusLabel: statusMeta.label,
      statusColor: statusMeta.color,
      statusIcon: statusMeta.icon,
      statusHelper: statusMeta.helper,
      statusBgClass: statusColorClasses.bg,
      statusTextClass: statusColorClasses.text,
      projectType: projectTypeKey,
      projectTypeLabel: projectTypeMeta.label,
      projectTypeIcon: projectTypeMeta.icon,
      projectTypeColor: projectTypeMeta.color,
      researchDomains,
      keywords,
      researchGoals,
      necessity: record.necessity || '',
      importance: record.importance || '',
      createdAt: formatDateToFa(record.created),
      updatedAt: formatDateToFa(record.updated),
      createdTimestamp,
      updatedTimestamp,
      searchableText,
    };
  };

  const loadProjects = async () => {
    if (!user.value?.id) return;
    isLoading.value = true;
    loadError.value = '';
    try {
      const items = await getResearchProjectsByUser(user.value.id);
      projects.value = items.map((item: any) => formatProjectRecord(item));
    } catch (error: any) {
      loadError.value = error?.message || 'خطا در دریافت پروژه‌ها';
      toaster.show({
        title: 'خطا',
        message: loadError.value,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      isLoading.value = false;
    }
  };

  watch(
    () => user.value?.id,
    (value) => {
      if (value) {
        loadProjects();
      }
    },
    { immediate: true },
  );

  const statistics = computed(() => {
    const stats = {
      total: projects.value.length,
      created: 0,
      collectingRelatedArticles: 0,
      Analyzing: 0,
      readyForContinue: 0,
      inProgress: 0,
      done: 0,
    } as Record<'total' | ProjectStatus, number>;

    projects.value.forEach((project) => {
      stats[project.statusKey] = (stats[project.statusKey] || 0) + 1;
    });

    return stats;
  });

  const filteredProjects = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    let filtered = projects.value.filter((project) => {
      const matchesSearch = !query || project.searchableText.includes(query);
      const matchesStatus = selectedStatus.value === 'all' || project.statusKey === selectedStatus.value;
      const matchesType = selectedProjectType.value === 'all' || project.projectType === selectedProjectType.value;
      return matchesSearch && matchesStatus && matchesType;
    });

    if (sortBy.value === 'title') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
    } else if (sortBy.value === 'status') {
      filtered = filtered.sort((a, b) => a.statusLabel.localeCompare(b.statusLabel, 'fa'));
    } else {
      filtered = filtered.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
    }

    return filtered;
  });

  const createNewProject = () => {
    router.push('/hampazhooh/create');
  };

  const viewProject = (projectId: string) => {
    router.push({
      path: '/hampazhooh/project/overview',
      query: { projectId },
    });
  };

  const editProject = (projectId: string) => {
    router.push(`/hampazhooh/project/${projectId}/edit`);
  };

  const isDeleteModalOpen = ref(false);
  const projectPendingDelete = ref<DisplayProject | null>(null);
  const deleteLoading = ref(false);

  const openDeleteModal = (project: DisplayProject) => {
    projectPendingDelete.value = project;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = (force = false) => {
    if (!force && deleteLoading.value) return;
    deleteLoading.value = false;
    isDeleteModalOpen.value = false;
    projectPendingDelete.value = null;
  };

  const confirmDeleteProject = async () => {
    if (!projectPendingDelete.value) return;
    deleteLoading.value = true;
    try {
      await deleteResearchProject(projectPendingDelete.value.id);
      await loadProjects();
      toaster.show({
        title: 'موفق',
        message: 'پروژه با موفقیت حذف شد',
        color: 'success',
        icon: 'ph:check-fill',
        closable: true,
      });
      closeDeleteModal(true);
    } catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: error?.message || 'حذف پروژه ناموفق بود',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      deleteLoading.value = false;
    }
  };
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
              پروژه‌های پژوهشی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-400 mt-1">مدیریت و مشاهده پروژه‌های پژوهشی خود</BaseParagraph>
          </div>
          <BaseButton color="primary" shape="curved" class="shadow-primary-500/30 shadow-lg" @click="createNewProject">
            <Icon name="ph:plus-fill" class="ml-2 size-5" />
            پروژه جدید
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="px-4 py-6 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <!-- Total Projects -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 mb-1 text-sm font-medium">کل پروژه‌ها</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ statistics.total }}
              </p>
            </div>
            <div
              class="bg-primary-500/10 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            >
              <Icon name="ph:clipboard-text-fill" class="text-primary-500 size-6" />
            </div>
          </div>
        </div>

        <!-- Status Cards -->
        <div
          v-for="statusKey in statusCardOrder"
          :key="statusKey"
          class="dark:bg-muted-800 dark:border-muted-700 group overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-500 mb-1 text-sm font-medium">
                {{ statusDictionary[statusKey].label }}
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ statistics[statusKey] }}
              </p>
            </div>
            <div
              :class="[
                'flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                getBgClass(statusDictionary[statusKey].color),
              ]"
            >
              <Icon
                :name="statusDictionary[statusKey].icon"
                :class="[getTextClass(statusDictionary[statusKey].color), 'size-6']"
              />
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
              class="w-full sm:w-auto sm:min-w-[200px]"
            />

            <!-- Project Type Filter -->
            <BaseListbox
              v-model="selectedProjectType"
              :items="projectTypeOptions"
              placeholder="نوع پروژه"
              shape="curved"
              :classes="{ input: 'h-10' }"
              class="w-full sm:w-auto sm:min-w-[200px]"
            />

            <!-- Active Filters Count -->
            <div v-if="selectedStatus !== 'all' || selectedProjectType !== 'all'" class="flex items-center gap-2">
              <BaseTag
                color="primary"
                size="sm"
                shape="curved"
                class="cursor-pointer"
                @click="
                  selectedStatus = 'all';
                  selectedProjectType = 'all';
                "
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
      <!-- Loading State -->
      <div v-if="isLoading" class="flex min-h-[300px] items-center justify-center py-12">
        <div class="text-center">
          <div
            class="bg-muted-100 dark:bg-muted-800 mx-auto mb-6 flex size-20 items-center justify-center rounded-full"
          >
            <Icon name="svg-spinners:90-ring-with-bg" class="text-primary-500 size-10" />
          </div>
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-muted-700 dark:text-muted-200 mb-2">
            در حال بارگذاری پروژه‌ها...
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500">لطفاً چند لحظه صبر کنید</BaseParagraph>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProjects.length === 0" class="flex min-h-[400px] items-center justify-center py-12">
        <div class="text-center">
          <div
            class="bg-muted-100 dark:bg-muted-800 mx-auto mb-6 flex size-24 items-center justify-center rounded-full"
          >
            <Icon name="ph:clipboard-text" class="text-muted-400 size-12" />
          </div>
          <BaseHeading as="h3" size="xl" weight="semibold" class="text-muted-700 dark:text-muted-200 mb-2">
            پروژه‌ای یافت نشد
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 mb-6 max-w-md">
            {{
              projects.length === 0
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
            @click="
              selectedStatus = 'all';
              selectedProjectType = 'all';
              searchQuery = '';
            "
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
            <BaseTag :color="project.statusColor" size="sm" shape="full" class="shadow-lg">
              <Icon :name="project.statusIcon" class="ml-1 size-3.5" />
              {{ project.statusLabel }}
            </BaseTag>
          </div>

          <!-- Category Badge - Top Left -->
          <div class="absolute right-4 top-4 z-10">
            <BaseTag
              :color="project.projectTypeColor"
              size="sm"
              shape="full"
              class="dark:bg-muted-700 bg-white/90 shadow-lg backdrop-blur-sm"
            >
              <Icon :name="project.projectTypeIcon" class="ml-1 size-3.5" />
              {{ project.projectTypeLabel }}
            </BaseTag>
          </div>

          <div class="p-6 pt-16">
            <!-- Title -->
            <BaseHeading
              as="h3"
              size="lg"
              weight="semibold"
              class="text-muted-800 group-hover:text-primary-500 mb-3 cursor-pointer transition-colors duration-200 dark:text-white"
              @click="viewProject(project.id)"
            >
              {{ project.title }}
            </BaseHeading>

            <!-- Description -->
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-5 leading-relaxed">
              {{ project.description }}
            </BaseParagraph>

            <!-- Status Helper -->
            <div
              class="dark:border-muted-700 dark:bg-muted-900/50 mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div class="mb-4 flex items-center gap-3">
                <div :class="[project.statusBgClass, 'rounded-xl p-3']">
                  <Icon :name="project.statusIcon" :class="[project.statusTextClass, 'size-6']" />
                </div>
                <div>
                  <p class="text-muted-700 dark:text-muted-200 text-sm font-semibold">
                    {{ project.statusLabel }}
                  </p>
                  <p class="text-muted-500 dark:text-muted-400 text-xs">
                    {{ project.statusHelper }}
                  </p>
                </div>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="dark:bg-muted-800 rounded-lg bg-white/70 p-3 text-sm">
                  <div class="text-muted-500 mb-1 flex items-center gap-2">
                    <Icon name="ph:target" class="size-4" />
                    <span>اهداف پژوهش</span>
                  </div>
                  <p class="text-muted-700 dark:text-muted-200 font-semibold">
                    {{ project.researchGoals.length }} هدف ثبت شده
                  </p>
                </div>
                <div class="dark:bg-muted-800 rounded-lg bg-white/70 p-3 text-sm">
                  <div class="text-muted-500 mb-1 flex items-center gap-2">
                    <Icon name="ph:key" class="size-4" />
                    <span>کلیدواژه‌ها</span>
                  </div>
                  <p class="text-muted-700 dark:text-muted-200 font-semibold">
                    {{ project.keywords.length }} کلیدواژه انتخاب شده
                  </p>
                </div>
              </div>
            </div>

            <!-- Domains & Keywords -->
            <div class="mb-5 space-y-4">
              <div>
                <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Icon name="ph:books" class="text-primary-500 size-4" />
                  حوزه‌های دانشی
                </div>
                <div v-if="project.researchDomains.length > 0" class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="domain in project.researchDomains"
                    :key="domain"
                    color="primary"
                    size="sm"
                    shape="full"
                  >
                    {{ domain }}
                  </BaseTag>
                </div>
                <BaseParagraph v-else size="xs" class="text-muted-500">هنوز حوزه‌ای انتخاب نشده است.</BaseParagraph>
              </div>

              <div>
                <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm font-semibold">
                  <Icon name="ph:key" class="text-warning-500 size-4" />
                  کلیدواژه‌ها
                </div>
                <div v-if="project.keywords.length > 0" class="flex flex-wrap gap-2">
                  <BaseTag v-for="keyword in project.keywords" :key="keyword" color="warning" size="sm" shape="full">
                    {{ keyword }}
                  </BaseTag>
                </div>
                <BaseParagraph v-else size="xs" class="text-muted-500">کلیدواژه‌ای ثبت نشده است.</BaseParagraph>
              </div>
            </div>

            <!-- Research Goals -->
            <div v-if="project.researchGoals.length > 0" class="mb-5">
              <div class="text-muted-600 dark:text-muted-300 mb-2 flex items-center gap-2 text-sm font-semibold">
                <Icon name="ph:target" class="text-success-500 size-4" />
                اهداف پژوهش
              </div>
              <div class="space-y-2">
                <div
                  v-for="goal in project.researchGoals.slice(0, 3)"
                  :key="goal"
                  class="dark:bg-muted-800 dark:border-muted-700 border border-gray-200 rounded-lg p-3 text-sm text-muted-700 dark:text-muted-200"
                >
                  {{ goal }}
                </div>
              </div>
              <BaseParagraph v-if="project.researchGoals.length > 3" size="xs" class="text-muted-500 mt-1">
                {{ project.researchGoals.length - 3 }} هدف دیگر...
              </BaseParagraph>
            </div>

            <!-- Dates -->
            <div class="text-muted-500 dark:text-muted-400 mb-5 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5">
                <Icon name="ph:calendar" class="size-4" />
                <span>ایجاد: {{ project.createdAt }}</span>
              </div>
              <Icon name="ph:arrow-left" class="size-3" />
              <div class="flex items-center gap-1.5">
                <Icon name="ph:calendar-check" class="size-4" />
                <span>آخرین بروزرسانی: {{ project.updatedAt }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <BaseButton color="primary" size="sm" shape="curved" class="flex-1" @click="viewProject(project.id)">
                <Icon name="ph:eye" class="ml-1 size-4" />
                مشاهده
              </BaseButton>
              <BaseButton color="muted" size="sm" shape="curved" @click="editProject(project.id)">
                <Icon name="ph:pencil-simple" class="size-4" />
              </BaseButton>
              <BaseButton color="danger" size="sm" shape="curved" @click="openDeleteModal(project)">
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
                <BaseTag :color="project.statusColor" size="sm" shape="full">
                  <Icon :name="project.statusIcon" class="ml-1 size-3.5" />
                  {{ project.statusLabel }}
                </BaseTag>
                <BaseTag :color="project.projectTypeColor" size="sm" shape="full">
                  <Icon :name="project.projectTypeIcon" class="ml-1 size-3.5" />
                  {{ project.projectTypeLabel }}
                </BaseTag>
              </div>

              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-3 line-clamp-2">
                {{ project.description }}
              </BaseParagraph>

              <div class="text-muted-600 dark:text-muted-400 flex flex-wrap gap-4 text-sm">
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:books" class="text-primary-500 size-4" />
                  <span>
                    {{ project.researchDomains.length > 0 ? project.researchDomains.join('، ') : 'حوزه‌ای ثبت نشده' }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:key" class="text-warning-500 size-4" />
                  <span>{{ project.keywords.length }} کلیدواژه</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:calendar" class="size-4" />
                  <span>ایجاد: {{ project.createdAt }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Icon name="ph:calendar-check" class="size-4" />
                  <span>بروزرسانی: {{ project.updatedAt }}</span>
                </div>
              </div>
            </div>

            <!-- Right: Progress & Actions -->
            <div class="flex flex-col gap-4 lg:w-72 lg:items-end">
              <!-- Status Summary -->
              <div class="w-full space-y-3">
                <div class="dark:bg-muted-900/50 rounded-xl bg-gray-50 p-4">
                  <div class="text-muted-500 mb-1 text-xs">وضعیت فعلی</div>
                  <div class="flex items-center gap-2">
                    <Icon :name="project.statusIcon" :class="[project.statusTextClass, 'size-5']" />
                    <div>
                      <p class="text-sm font-semibold text-muted-800 dark:text-muted-100">
                        {{ project.statusLabel }}
                      </p>
                      <p class="text-xs text-muted-500">
                        {{ project.statusHelper }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="dark:bg-muted-800 rounded-lg bg-gray-50 p-3 text-sm">
                    <div class="text-muted-500 mb-1 flex items-center gap-2">
                      <Icon name="ph:target" class="size-4" />
                      اهداف
                    </div>
                    <p class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
                      {{ project.researchGoals.length }}
                    </p>
                  </div>
                  <div class="dark:bg-muted-800 rounded-lg bg-gray-50 p-3 text-sm">
                    <div class="text-muted-500 mb-1 flex items-center gap-2">
                      <Icon name="ph:key" class="size-4" />
                      کلیدواژه‌ها
                    </div>
                    <p class="text-muted-800 dark:text-muted-100 text-lg font-semibold">
                      {{ project.keywords.length }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <BaseButton color="primary" size="sm" shape="curved" @click="viewProject(project.id)">
                  <Icon name="ph:eye" class="ml-1 size-4" />
                  مشاهده
                </BaseButton>
                <BaseButton color="muted" size="sm" shape="curved" @click="editProject(project.id)">
                  <Icon name="ph:pencil-simple" class="size-4" />
                </BaseButton>
                <BaseButton color="danger" size="sm" shape="curved" @click="openDeleteModal(project)">
                  <Icon name="ph:trash" class="size-4" />
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TairoModal :open="isDeleteModalOpen" size="md" @close="closeDeleteModal">
    <template #header>
      <div class="flex items-center gap-3 p-6 pb-0">
        <div class="bg-danger-500 flex size-12 items-center justify-center rounded-xl">
          <Icon name="ph:warning" class="size-6 text-white" />
        </div>
        <div class="text-right">
          <BaseHeading as="h2" size="xl" weight="bold">حذف پروژه</BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500">آیا از حذف این پروژه اطمینان دارید؟</BaseParagraph>
        </div>
      </div>
    </template>

    <div class="p-6 space-y-4 text-right">
      <div
        class="dark:bg-muted-900/50 border border-danger-100 dark:border-danger-500/30 rounded-xl bg-danger-50/60 p-4"
      >
        <BaseParagraph size="sm" class="text-danger-600 dark:text-danger-200">
          حذف پروژه قابل بازگشت نیست. تمام اطلاعات مرتبط با این پروژه از سیستم پاک خواهد شد.
        </BaseParagraph>
      </div>

      <div
        v-if="projectPendingDelete"
        class="dark:bg-muted-800 border border-gray-200 dark:border-muted-700 rounded-xl bg-white p-4 space-y-2"
      >
        <div class="text-muted-500 text-xs">عنوان پروژه</div>
        <div class="text-gray-900 dark:text-white font-semibold">
          {{ projectPendingDelete.title }}
        </div>
        <div class="text-muted-500 text-xs mt-3">وضعیت فعلی</div>
        <div class="flex items-center gap-2 text-sm text-muted-700 dark:text-muted-200">
          <Icon :name="projectPendingDelete.statusIcon" class="size-4" />
          {{ projectPendingDelete.statusLabel }}
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton color="muted" shape="curved" :disabled="deleteLoading" @click="closeDeleteModal">انصراف</BaseButton>
        <BaseButton color="danger" shape="curved" :loading="deleteLoading" @click="confirmDeleteProject">
          حذف پروژه
        </BaseButton>
      </div>
    </div>
  </TairoModal>
</template>
