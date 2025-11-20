<script setup lang="ts">
  import type {
    ResearchProject,
    ExtractedPaperInfo,
    HadiStructuredInsights,
  } from '~/composables/useResearchProject';
  import type { SciHubPaperMetadata } from '~/composables/useSciHub';

  definePageMeta({
    title: 'جمع‌آوری مقالات',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const route = useRoute();
  const router = useRouter();
  const toaster = useToaster();
  const {
    getResearchProject,
    extractPaperStructure,
    extractHadiStructuredInsights,
    generateEnglishKeywords: generateEnglishKeywordsAI,
  } = useResearchProject();
  const { searchPapers, downloadPaper } = useSciHub();

  // Get project ID from query
  const projectId = computed(() => route.query.id as string | undefined);

  // Project data
  const project = ref<ResearchProject | null>(null);
  const isLoadingProject = ref(false);

  // Status tracking
  type CollectionStatus = 'idle' | 'generatingKeywords' | 'keywordsGenerated' | 'searching' | 'completed' | 'error';
  const status = ref<CollectionStatus>('idle');

  // Keywords
  const englishKeywords = ref<string[]>([]);
  const isGeneratingKeywords = ref(false);

  // Papers
  const papers = ref<SciHubPaperMetadata[]>([]);
  const isSearching = ref(false);

  // Selected paper for modal
  const selectedPaper = ref<SciHubPaperMetadata | null>(null);
  const isModalOpen = ref(false);
  const isDownloading = ref(false);
  const downloadingPaperId = ref<string | null>(null);
  const paperContent = ref<string>('');
  const paperContentCache = ref<Map<string, string>>(new Map());

  // Extracted paper info
  const extractedInfo = ref<Map<string, ExtractedPaperInfo>>(new Map());
  const isExtracting = ref(false);
  const isInfoModalOpen = ref(false);
  const selectedPaperForInfo = ref<SciHubPaperMetadata | null>(null);
  const selectedPaperForHadi = ref<SciHubPaperMetadata | null>(null);
  const infoModalLanguage = ref<'en' | 'fa'>('fa');
  const showAllReferences = ref(false);
  const hadiInsights = ref<Map<string, HadiStructuredInsights>>(new Map());
  const isHadiModalOpen = ref(false);
  const isExtractingHadi = ref(false);
  const extractingHadiPaperId = ref<string | null>(null);
  const hadiFields: Array<{ key: keyof HadiStructuredInsights; label: string }> = [
    { key: 'researchType', label: 'چه تحقیقاتی' },
    { key: 'variables', label: 'با چه متغیرهایی' },
    { key: 'questionsOrHypotheses', label: 'با چه سوال یا فرضیه‌هایی' },
    { key: 'researchGoals', label: 'مبتنی بر چه هدفی' },
    { key: 'methodology', label: 'با چه روشی' },
    { key: 'results', label: 'با چه نتایجی' },
    { key: 'researchGap', label: 'خلاء پژوهشی' },
  ];
  const currentHadiInsights = computed(() => {
    if (!selectedPaperForHadi.value) return null;
    const paperId = selectedPaperForHadi.value.doi || selectedPaperForHadi.value.url || '';
    if (!paperId) return null;
    return hadiInsights.value.get(paperId) || null;
  });
  const getHadiFieldValue = (key: keyof HadiStructuredInsights) => {
    const insights = currentHadiInsights.value;
    const value = insights?.[key];
    if (!value) {
      return 'اطلاعات موجود نیست.';
    }
    return value;
  };

  // Load project data
  const loadProject = async () => {
    if (!projectId.value) {
      toaster.show({
        title: 'خطا',
        message: 'شناسه پروژه یافت نشد.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      router.push('/hampazhooh/projects');
      return;
    }

    isLoadingProject.value = true;
    try {
      project.value = await getResearchProject(projectId.value);
    } catch (error: any) {
      toaster.show({
        title: 'خطا',
        message: `خطا در بارگذاری پروژه: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      router.push('/hampazhooh/projects');
    } finally {
      isLoadingProject.value = false;
    }
  };

  // Generate English keywords using AI
  const generateEnglishKeywords = async () => {
    if (!project.value) {
      toaster.show({
        title: 'خطا',
        message: 'پروژه یافت نشد.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    isGeneratingKeywords.value = true;
    status.value = 'generatingKeywords';

    try {
      const context = {
        projectType: project.value.projectType || '',
        researchDomain: Array.isArray(project.value.researchDomain)
          ? project.value.researchDomain
          : project.value.researchDomain
          ? [String(project.value.researchDomain)]
          : [],
        keywords: Array.isArray(project.value.keywords)
          ? project.value.keywords
          : project.value.keywords
          ? [String(project.value.keywords)]
          : [],
        researchGoals: Array.isArray(project.value.researchGoals)
          ? project.value.researchGoals
          : project.value.researchGoals
          ? [String(project.value.researchGoals)]
          : [],
      };

      englishKeywords.value = await generateEnglishKeywordsAI(context);

      status.value = 'keywordsGenerated';

      toaster.show({
        title: 'موفق',
        message: `${englishKeywords.value.length} کلیدواژه انگلیسی تولید شد.`,
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      });
    } catch (error: any) {
      console.error('Error generating English keywords:', error);
      toaster.show({
        title: 'خطا',
        message: `خطا در تولید کلیدواژه‌ها: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      status.value = 'error';
    } finally {
      isGeneratingKeywords.value = false;
    }
  };

  // Search for papers
  const searchForPapers = async () => {
    if (englishKeywords.value.length === 0) {
      toaster.show({
        title: 'هشدار',
        message: 'لطفاً ابتدا کلیدواژه‌های انگلیسی را تولید کنید.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    isSearching.value = true;
    status.value = 'searching';

    try {
      // Combine keywords into a search query
      const searchQuery = englishKeywords.value.join(' OR ');

      const response = await searchPapers(searchQuery, {
        limit: 10,
      });

      // Log response for debugging
      console.log('Search response:', response);

      // Handle different response structures
      let papersArray: SciHubPaperMetadata[] = [];

      if (Array.isArray(response)) {
        // Response is directly an array
        papersArray = response;
      } else if (response?.results && Array.isArray(response.results)) {
        // Response has a results property
        papersArray = response.results;
      } else if (response?.papers && Array.isArray(response.papers)) {
        // Response has a papers property
        papersArray = response.papers;
      } else if (response?.data && Array.isArray(response.data)) {
        // Response has a data property
        papersArray = response.data;
      }

      if (papersArray.length > 0) {
        papers.value = papersArray;
        status.value = 'completed';
        toaster.show({
          title: 'موفق',
          message: `${papers.value.length} مقاله یافت شد.`,
          color: 'success',
          icon: 'ph:check-circle',
          closable: true,
        });
      } else {
        papers.value = [];
        status.value = 'error';
        toaster.show({
          title: 'اطلاع',
          message: 'هیچ مقاله‌ای یافت نشد. لطفاً کلیدواژه‌ها را تغییر دهید.',
          color: 'warning',
          icon: 'ph:info',
          closable: true,
        });
      }
    } catch (error: any) {
      console.error('Error searching papers:', error);
      status.value = 'error';
      toaster.show({
        title: 'خطا',
        message: `خطا در جستجوی مقالات: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      isSearching.value = false;
    }
  };

  // Download paper as markdown
  const downloadPaperAsMarkdown = async (paper: SciHubPaperMetadata) => {
    if (!paper.doi && !paper.url) {
      toaster.show({
        title: 'خطا',
        message: 'شناسه مقاله برای دانلود موجود نیست.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    isDownloading.value = true;
    selectedPaper.value = paper;
    downloadingPaperId.value = paper.doi || paper.url || null;

    try {
      const identifier = paper.doi || paper.url || '';
      const result = await downloadPaper<string>(identifier, {
        convert: true,
        responseType: 'text',
      });

      paperContent.value = result.data;
      const paperId = paper.doi || paper.url || '';
      if (paperId) {
        paperContentCache.value.set(paperId, result.data);
      }
      isModalOpen.value = true;
    } catch (error: any) {
      console.error('Error downloading paper:', error);
      toaster.show({
        title: 'خطا',
        message: `خطا در دانلود مقاله: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      isDownloading.value = false;
      downloadingPaperId.value = null;
    }
  };

  // Extract paper structure
  const extractStructure = async () => {
    if (!paperContent.value || !selectedPaper.value) {
      toaster.show({
        title: 'خطا',
        message: 'محتوای مقاله برای استخراج موجود نیست.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    isExtracting.value = true;

    try {
      const projectKeywords = Array.isArray(project.value?.keywords)
        ? project.value.keywords
        : project.value?.keywords
        ? [String(project.value.keywords)]
        : [];

      const info = await extractPaperStructure(paperContent.value, projectKeywords);

      const paperId = selectedPaper.value.doi || selectedPaper.value.url || '';
      if (paperId) {
        extractedInfo.value.set(paperId, info);
      }

      toaster.show({
        title: 'موفق',
        message: 'اطلاعات مقاله با موفقیت استخراج شد.',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      });

      // Close content modal
      closeModal();
    } catch (error: any) {
      console.error('Error extracting structure:', error);
      toaster.show({
        title: 'خطا',
        message: `خطا در استخراج اطلاعات: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      isExtracting.value = false;
    }
  };

  const hasPaperContent = (paper: SciHubPaperMetadata) => {
    const paperId = paper.doi || paper.url || '';
    if (!paperId) return false;
    return paperContentCache.value.has(paperId);
  };

  const extractHadiInfo = async (paper: SciHubPaperMetadata) => {
    const paperId = paper.doi || paper.url || '';

    if (!paperId) {
      toaster.show({
        title: 'خطا',
        message: 'شناسه مقاله معتبر نیست.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    const content = paperContentCache.value.get(paperId);

    if (!content) {
      toaster.show({
        title: 'هشدار',
        message: 'ابتدا مقاله را دانلود کنید تا بتوان اطلاعات هادی را استخراج کرد.',
        color: 'warning',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    isExtractingHadi.value = true;
    extractingHadiPaperId.value = paperId;

    try {
      const insights = await extractHadiStructuredInsights(content);
      hadiInsights.value.set(paperId, insights);
      selectedPaperForHadi.value = paper;
      isHadiModalOpen.value = true;

      toaster.show({
        title: 'موفق',
        message: 'تحلیل هادی با موفقیت انجام شد.',
        color: 'success',
        icon: 'ph:check-circle',
        closable: true,
      });
    } catch (error: any) {
      console.error('Error extracting Hadi insights:', error);
      toaster.show({
        title: 'خطا',
        message: `خطا در استخراج اطلاعات هادی: ${error.message || 'خطای ناشناخته'}`,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      isExtractingHadi.value = false;
      extractingHadiPaperId.value = null;
    }
  };

  const showHadiModal = (paper: SciHubPaperMetadata) => {
    const paperId = paper.doi || paper.url || '';
    if (!paperId || !hadiInsights.value.has(paperId)) {
      toaster.show({
        title: 'اطلاع',
        message: 'ابتدا تحلیل هادی را برای این مقاله انجام دهید.',
        color: 'warning',
        icon: 'ph:info',
        closable: true,
      });
      return;
    }

    selectedPaperForHadi.value = paper;
    isHadiModalOpen.value = true;
  };

  const handleHadiInsights = (paper: SciHubPaperMetadata) => {
    const paperId = paper.doi || paper.url || '';
    if (!paperId) {
      toaster.show({
        title: 'خطا',
        message: 'شناسه مقاله معتبر نیست.',
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
      return;
    }

    if (hadiInsights.value.has(paperId)) {
      showHadiModal(paper);
      return;
    }

    extractHadiInfo(paper);
  };

  // Show extracted info modal
  const showExtractedInfo = (paper: SciHubPaperMetadata) => {
    const paperId = paper.doi || paper.url || '';
    if (!paperId || !extractedInfo.value.has(paperId)) {
      toaster.show({
        title: 'اطلاع',
        message: 'اطلاعات استخراج شده برای این مقاله موجود نیست. لطفاً ابتدا استخراج را انجام دهید.',
        color: 'warning',
        icon: 'ph:info',
        closable: true,
      });
      return;
    }

    selectedPaperForInfo.value = paper;
    isInfoModalOpen.value = true;
  };

  // Close modal
  const closeModal = () => {
    isModalOpen.value = false;
    selectedPaper.value = null;
    paperContent.value = '';
    downloadingPaperId.value = null;
  };

  // Close info modal
  const closeInfoModal = () => {
    isInfoModalOpen.value = false;
    selectedPaperForInfo.value = null;
    showAllReferences.value = false;
  };

  const closeHadiModal = () => {
    isHadiModalOpen.value = false;
    selectedPaperForHadi.value = null;
  };

  // Get relevance color
  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'خیلی زیاد':
        return 'text-success-600 dark:text-success-400';
      case 'زیاد':
        return 'text-primary-600 dark:text-primary-400';
      case 'متوسط':
        return 'text-warning-600 dark:text-warning-400';
      case 'کم':
        return 'text-orange-600 dark:text-orange-400';
      case 'خیلی کم':
        return 'text-muted-600 dark:text-muted-400';
      default:
        return 'text-muted-600 dark:text-muted-400';
    }
  };

  // Status indicator config
  const statusConfig = computed(() => {
    switch (status.value) {
      case 'idle':
        return {
          label: 'آماده',
          color: 'muted',
          icon: 'ph:circle',
        };
      case 'generatingKeywords':
        return {
          label: 'در حال تولید کلیدواژه‌ها',
          color: 'info',
          icon: 'svg-spinners:90-ring-with-bg',
        };
      case 'keywordsGenerated':
        return {
          label: 'کلیدواژه‌های پیشنهادی',
          color: 'success',
          icon: 'ph:check-circle',
        };
      case 'searching':
        return {
          label: 'در حال جستجوی مقالات',
          color: 'primary',
          icon: 'svg-spinners:90-ring-with-bg',
        };
      case 'completed':
        return {
          label: 'تکمیل شده',
          color: 'success',
          icon: 'ph:check-circle',
        };
      case 'error':
        return {
          label: 'خطا',
          color: 'danger',
          icon: 'ph:warning',
        };
      default:
        return {
          label: 'نامشخص',
          color: 'muted',
          icon: 'ph:circle',
        };
    }
  });

  // Format authors
  const formatAuthors = (authors?: string[]) => {
    if (!authors || authors.length === 0) return 'نامشخص';
    if (authors.length <= 3) return authors.join(', ');
    return `${authors.slice(0, 3).join(', ')} و ${authors.length - 3} نفر دیگر`;
  };

  // Remove keyword
  const removeKeyword = (index: number) => {
    if (index >= 0 && index < englishKeywords.value.length) {
      englishKeywords.value.splice(index, 1);
    }
  };

  // Format year
  const formatYear = (date?: string) => {
    if (!date) return 'نامشخص';
    const year = new Date(date).getFullYear();
    return isNaN(year) ? 'نامشخص' : year.toString();
  };

  // Load project on mount
  onMounted(() => {
    loadProject();
  });
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <BaseHeading as="h1" size="2xl" weight="bold" class="mb-2">جمع‌آوری مقالات مرتبط</BaseHeading>
        <BaseParagraph class="text-muted-500">تولید کلیدواژه‌های انگلیسی و جستجوی مقالات مرتبط با پروژه</BaseParagraph>
      </div>
    </div>

    <!-- Loading Project -->
    <div v-if="isLoadingProject" class="flex items-center justify-center py-12">
      <BaseProgress />
    </div>

    <!-- Project Info -->
    <div
      v-else-if="project"
      class="dark:bg-muted-800 rounded-xl border border-muted-200 bg-white p-6 dark:border-muted-700"
    >
      <div class="mb-4 flex items-center justify-between">
        <div>
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-2">اطلاعات پروژه</BaseHeading>
          <div class="space-y-2 text-sm text-muted-600 dark:text-muted-400">
            <div v-if="project.projectType" class="flex items-center gap-2">
              <Icon name="ph:folder" class="size-4" />
              <span>نوع پروژه: {{ project.projectType }}</span>
            </div>
            <div v-if="project.researchDomain" class="flex items-center gap-2">
              <Icon name="ph:book" class="size-4" />
              <span>
                حوزه دانشی:
                {{
                  Array.isArray(project.researchDomain)
                    ? project.researchDomain.join(', ')
                    : String(project.researchDomain)
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Indicator -->
      <div
        class="mb-6 flex items-center gap-3 rounded-lg border border-muted-200 bg-muted-50 p-4 dark:border-muted-700 dark:bg-muted-900/50"
      >
        <Icon :name="statusConfig.icon" class="size-5" :class="`text-${statusConfig.color}-500`" />
        <span class="font-medium" :class="`text-${statusConfig.color}-600 dark:text-${statusConfig.color}-400`">
          وضعیت: {{ statusConfig.label }}
        </span>
      </div>

      <!-- Keywords Section -->
      <div class="mb-6 space-y-4">
        <div class="flex items-center justify-between">
          <BaseHeading as="h3" size="md" weight="semibold">کلیدواژه‌های انگلیسی</BaseHeading>
          <BaseButton
            color="primary"
            :loading="isGeneratingKeywords"
            :disabled="isGeneratingKeywords || isSearching"
            @click="generateEnglishKeywords"
          >
            <Icon v-if="!isGeneratingKeywords" name="ph:sparkle" class="size-4" />
            <span>تولید کلیدواژه‌ها</span>
          </BaseButton>
        </div>

        <div v-if="englishKeywords.length > 0" class="flex flex-wrap gap-2">
          <div
            v-for="(keyword, index) in englishKeywords"
            :key="index"
            class="bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium"
          >
            <span>{{ keyword }}</span>
            <button
              type="button"
              class="hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center rounded-full transition-colors"
              :disabled="isSearching"
              @click="removeKeyword(index)"
            >
              <Icon name="ph:x" class="size-4" />
            </button>
          </div>
        </div>
        <div v-else class="text-muted-500 text-sm">هنوز کلیدواژه‌ای تولید نشده است.</div>
      </div>

      <!-- Search Button -->
      <div class="mb-6">
        <BaseButton
          color="success"
          :loading="isSearching"
          :disabled="englishKeywords.length === 0 || isGeneratingKeywords"
          @click="searchForPapers"
        >
          <Icon v-if="!isSearching" name="ph:magnifying-glass" class="size-4" />
          <span>جستجوی مقالات ({{ papers.length }})</span>
        </BaseButton>
      </div>
    </div>

    <!-- Papers Table -->
    <div
      v-if="papers.length > 0"
      class="dark:bg-muted-800 rounded-xl border border-muted-200 bg-white dark:border-muted-700"
    >
      <div class="border-b border-muted-200 p-6 dark:border-muted-700">
        <BaseHeading as="h2" size="lg" weight="semibold">مقالات یافت شده ({{ papers.length }})</BaseHeading>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted-50 dark:bg-muted-900/50">
            <tr>
              <th
                class="border-b border-muted-200 px-6 py-4 text-right text-sm font-semibold text-muted-700 dark:border-muted-700 dark:text-muted-300"
              >
                عنوان
              </th>
              <th
                class="border-b border-muted-200 px-6 py-4 text-right text-sm font-semibold text-muted-700 dark:border-muted-700 dark:text-muted-300"
              >
                استناد
              </th>
              <th
                class="border-b border-muted-200 px-6 py-4 text-right text-sm font-semibold text-muted-700 dark:border-muted-700 dark:text-muted-300"
              >
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(paper, index) in papers"
              :key="index"
              class="border-b border-muted-100 transition-colors hover:bg-muted-50 dark:border-muted-700 dark:hover:bg-muted-900/30"
            >
              <td class="px-6 py-4">
                <div class="max-w-md font-medium text-muted-900 dark:text-white">
                  {{ (paper as any).name || paper.title || 'بدون عنوان' }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-muted-600 dark:text-muted-400">
                <div v-if="paper.url" class="max-w-xs truncate" :title="paper.url">
                  {{ paper.url }}
                </div>
                <span v-else class="text-muted-400">نامشخص</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <BaseButton
                    color="primary"
                    size="sm"
                    :loading="isDownloading && downloadingPaperId === (paper.doi || paper.url)"
                    :disabled="isDownloading"
                    @click="downloadPaperAsMarkdown(paper)"
                  >
                    <Icon name="ph:download" class="size-4" />
                    <span>دانلود</span>
                  </BaseButton>
                  <BaseButton
                    color="warning"
                    size="sm"
                    :loading="extractingHadiPaperId === (paper.doi || paper.url)"
                    :disabled="!hasPaperContent(paper) || (isExtractingHadi && extractingHadiPaperId !== (paper.doi || paper.url))"
                    @click="handleHadiInsights(paper)"
                  >
                    <Icon name="ph:brain" class="size-4" />
                    <span>استخراج هادی</span>
                  </BaseButton>
                  <BaseButton
                    v-if="extractedInfo.has(paper.doi || paper.url || '')"
                    color="success"
                    size="sm"
                    @click="showExtractedInfo(paper)"
                  >
                    <Icon name="ph:info" class="size-4" />
                    <span>نمایش اطلاعات</span>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="status === 'completed'"
      class="dark:bg-muted-800 flex flex-col items-center justify-center rounded-xl border border-muted-200 bg-white py-12 dark:border-muted-700"
    >
      <Icon name="ph:file-x" class="text-muted-400 mb-4 size-16" />
      <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2">هیچ مقاله‌ای یافت نشد</BaseHeading>
      <BaseParagraph class="text-muted-500">لطفاً کلیدواژه‌ها را تغییر دهید و دوباره جستجو کنید.</BaseParagraph>
    </div>
  </div>

  <!-- Paper Content Modal -->
  <TairoModal :open="isModalOpen" size="3xl" @close="closeModal">
    <template #header>
      <div class="flex w-full items-center justify-between p-4 sm:p-6">
        <div class="flex-1">
          <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2">
            {{ selectedPaper?.title || 'مقاله' }}
          </BaseHeading>
          <div v-if="selectedPaper" class="text-muted-500 text-sm">
            <div v-if="selectedPaper.authors?.length">نویسندگان: {{ formatAuthors(selectedPaper.authors) }}</div>
            <div v-if="selectedPaper.journal">مجله: {{ selectedPaper.journal }}</div>
            <div v-if="selectedPaper.publicationDate">سال: {{ formatYear(selectedPaper.publicationDate) }}</div>
          </div>
        </div>
        <BaseButtonClose @click="closeModal" />
      </div>
    </template>

    <div class="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
      <div v-if="isDownloading" class="flex items-center justify-center py-12">
        <BaseProgress />
        <span class="text-muted-500 mr-3">در حال دانلود مقاله...</span>
      </div>
      <div v-else-if="paperContent" class="prose prose-sm dark:prose-invert max-w-none">
        <pre class="whitespace-pre-wrap font-sans text-sm">{{ paperContent }}</pre>
      </div>
      <div v-else class="text-muted-500 text-center">محتوای مقاله در دسترس نیست.</div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-3 p-4 sm:p-6">
        <BaseButton
          color="primary"
          :loading="isExtracting"
          :disabled="!paperContent || isExtracting"
          @click="extractStructure"
        >
          <Icon v-if="!isExtracting" name="ph:magic-wand" class="size-4" />
          <span>استخراج ساختار و مطالب</span>
        </BaseButton>
        <BaseButton color="muted" @click="closeModal">بستن</BaseButton>
      </div>
    </template>
  </TairoModal>

  <!-- Extracted Info Modal -->
  <TairoModal :open="isInfoModalOpen" size="3xl" @close="closeInfoModal">
    <template #header>
      <div class="flex w-full items-center justify-between p-4 sm:p-6">
        <div class="flex-1 text-right">
          <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2">اطلاعات استخراج شده</BaseHeading>
          <div v-if="selectedPaperForInfo" class="text-muted-500 text-sm">
            {{ (selectedPaperForInfo as any).name || selectedPaperForInfo.title || 'مقاله' }}
          </div>
        </div>
        <BaseButtonClose @click="closeInfoModal" />
      </div>
    </template>

    <div
      v-if="selectedPaperForInfo"
      class="max-h-[70vh] overflow-y-auto p-6 sm:p-8"
      :class="infoModalLanguage === 'fa' ? 'text-right' : 'text-left'"
    >
      <div v-if="extractedInfo.has(selectedPaperForInfo.doi || selectedPaperForInfo.url || '')">
        <div
          v-for="(info, paperId) in [extractedInfo.get(selectedPaperForInfo.doi || selectedPaperForInfo.url || '')]"
          :key="paperId"
          class="space-y-16"
        >
          <!-- Basic Info -->
          <BaseCard class="p-6 sm:p-8">
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'اطلاعات پایه' : 'Basic Information' }}
            </BaseHeading>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-2">
                <div class="text-muted-500 text-sm font-medium">
                  {{ infoModalLanguage === 'fa' ? 'نویسندگان' : 'Authors' }}
                </div>
                <div class="font-medium leading-relaxed">
                  {{ info.authors.join(', ') || (infoModalLanguage === 'fa' ? 'نامشخص' : 'N/A') }}
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-muted-500 text-sm font-medium">
                  {{ infoModalLanguage === 'fa' ? 'سال انتشار' : 'Year' }}
                </div>
                <div class="font-medium">
                  {{ info.year || (infoModalLanguage === 'fa' ? 'نامشخص' : 'N/A') }}
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-muted-500 text-sm font-medium">
                  {{ infoModalLanguage === 'fa' ? 'پژوهشگاه/مؤسسه' : 'Institution' }}
                </div>
                <div class="font-medium leading-relaxed">
                  {{ info.institution || (infoModalLanguage === 'fa' ? 'نامشخص' : 'N/A') }}
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-muted-500 text-sm font-medium">
                  {{ infoModalLanguage === 'fa' ? 'کشور' : 'Country' }}
                </div>
                <div class="font-medium">
                  {{ info.country || (infoModalLanguage === 'fa' ? 'نامشخص' : 'N/A') }}
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Abstract -->
          <BaseCard
            v-if="(infoModalLanguage === 'fa' ? info.abstractFa : info.abstract) || info.abstract"
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'چکیده' : 'Abstract' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{ infoModalLanguage === 'fa' && info.abstractFa ? info.abstractFa : info.abstract }}
            </BaseParagraph>
          </BaseCard>

          <!-- Problem Statement -->
          <BaseCard
            v-if="
              (infoModalLanguage === 'fa' ? info.problemStatementFa : info.problemStatement) || info.problemStatement
            "
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'بیان مسئله' : 'Problem Statement' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{
                infoModalLanguage === 'fa' && info.problemStatementFa ? info.problemStatementFa : info.problemStatement
              }}
            </BaseParagraph>
          </BaseCard>

          <!-- Theories -->
          <BaseCard
            v-if="(infoModalLanguage === 'fa' ? info.theoriesFa : info.theories)?.length || info.theories?.length"
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'نظریه‌های استفاده شده' : 'Theories Used' }}
            </BaseHeading>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div
                v-for="(theory, idx) in infoModalLanguage === 'fa' && info.theoriesFa ? info.theoriesFa : info.theories"
                :key="idx"
                class="border-muted-200 dark:border-muted-700 rounded-lg border-l-4 bg-muted-50 p-4 dark:bg-muted-900/50"
                :class="infoModalLanguage === 'fa' ? 'text-right' : 'text-left'"
              >
                <div class="font-medium text-muted-900 dark:text-white leading-relaxed">
                  {{ theory }}
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Research Evidence -->
          <BaseCard
            v-if="
              (infoModalLanguage === 'fa' ? info.researchEvidenceFa : info.researchEvidence) || info.researchEvidence
            "
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'شواهد پژوهشی' : 'Research Evidence' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{
                infoModalLanguage === 'fa' && info.researchEvidenceFa ? info.researchEvidenceFa : info.researchEvidence
              }}
            </BaseParagraph>
          </BaseCard>

          <!-- Related Variables -->
          <BaseCard
            v-if="
              (infoModalLanguage === 'fa' ? info.relatedVariablesFa : info.relatedVariables)?.length ||
              info.relatedVariables?.length
            "
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'متغیرهای مرتبط' : 'Related Variables' }}
            </BaseHeading>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="(variable, idx) in infoModalLanguage === 'fa' && info.relatedVariablesFa
                  ? info.relatedVariablesFa
                  : info.relatedVariables"
                :key="idx"
                class="bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg px-4 py-2 text-sm font-medium"
                :class="infoModalLanguage === 'fa' ? 'text-right' : 'text-left'"
              >
                {{ variable }}
              </div>
            </div>
          </BaseCard>

          <!-- Variable Relationships -->
          <BaseCard
            v-if="
              (infoModalLanguage === 'fa' ? info.variableRelationshipsFa : info.variableRelationships) ||
              info.variableRelationships
            "
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'روابط بین متغیرها' : 'Variable Relationships' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{
                infoModalLanguage === 'fa' && info.variableRelationshipsFa
                  ? info.variableRelationshipsFa
                  : info.variableRelationships
              }}
            </BaseParagraph>
          </BaseCard>

          <!-- Relationship Modeling -->
          <BaseCard
            v-if="
              (infoModalLanguage === 'fa' ? info.relationshipModelingFa : info.relationshipModeling) ||
              info.relationshipModeling
            "
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'مدل‌سازی روابط' : 'Relationship Modeling' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{
                infoModalLanguage === 'fa' && info.relationshipModelingFa
                  ? info.relationshipModelingFa
                  : info.relationshipModeling
              }}
            </BaseParagraph>
          </BaseCard>

          <!-- Research Gaps -->
          <BaseCard
            v-if="(infoModalLanguage === 'fa' ? info.researchGapsFa : info.researchGaps) || info.researchGaps"
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'خلاء‌های پژوهشی' : 'Research Gaps' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{ infoModalLanguage === 'fa' && info.researchGapsFa ? info.researchGapsFa : info.researchGaps }}
            </BaseParagraph>
          </BaseCard>

          <!-- Keywords -->
          <BaseCard
            v-if="(infoModalLanguage === 'fa' ? info.keywordsFa : info.keywords)?.length || info.keywords?.length"
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'کلیدواژه‌های مقاله' : 'Keywords' }}
            </BaseHeading>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="(keyword, idx) in infoModalLanguage === 'fa' && info.keywordsFa
                  ? info.keywordsFa
                  : info.keywords"
                :key="idx"
                class="bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg px-4 py-2 text-sm font-medium"
                :class="infoModalLanguage === 'fa' ? 'text-right' : 'text-left'"
              >
                {{ keyword }}
              </div>
            </div>
          </BaseCard>

          <!-- Relevance Scores -->
          <BaseCard v-if="info.relevanceScores?.length" class="p-6 sm:p-8">
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'میزان ارتباط با کلیدواژه‌های پروژه' : 'Relevance to Project Keywords' }}
            </BaseHeading>
            <div class="space-y-3">
              <div
                v-for="(score, idx) in info.relevanceScores"
                :key="idx"
                class="flex items-center justify-between rounded-lg border border-muted-200 bg-muted-50 p-4 dark:border-muted-700 dark:bg-muted-900/50"
              >
                <span class="font-medium">{{ score.keyword }}</span>
                <span :class="getRelevanceColor(score.relevance)" class="font-semibold">
                  {{ score.relevance }}
                </span>
              </div>
            </div>
          </BaseCard>

          <!-- References -->
          <BaseCard v-if="info.references?.length" class="p-6 sm:p-8">
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'مقالات استفاده شده' : 'References' }} ({{ info.references.length }})
            </BaseHeading>
            <div class="space-y-4">
              <div
                v-for="(ref, idx) in showAllReferences ? info.references : info.references.slice(0, 5)"
                :key="idx"
                class="border-muted-200 dark:border-muted-700 rounded-lg border-l-4 bg-muted-50 p-5 dark:bg-muted-900/50"
                :class="infoModalLanguage === 'fa' ? 'text-right' : 'text-left'"
              >
                <div class="font-medium text-muted-900 dark:text-white leading-relaxed mb-2">
                  <a
                    v-if="ref.url || ref.doi"
                    :href="ref.url || `https://doi.org/${ref.doi}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
                  >
                    {{ infoModalLanguage === 'fa' && ref.titleFa ? ref.titleFa : ref.title }}
                  </a>
                  <span v-else>
                    {{ infoModalLanguage === 'fa' && ref.titleFa ? ref.titleFa : ref.title }}
                  </span>
                </div>
                <div v-if="ref.authors?.length" class="text-muted-500 text-sm mb-2">
                  {{ infoModalLanguage === 'fa' ? 'نویسندگان' : 'Authors' }}: {{ ref.authors.join(', ') }}
                </div>
                <div v-if="ref.url || ref.doi" class="flex items-center gap-2 text-sm">
                  <Icon name="ph:link" class="size-4 text-muted-400" />
                  <a
                    :href="ref.url || `https://doi.org/${ref.doi}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors truncate"
                  >
                    {{ ref.url || (ref.doi ? `DOI: ${ref.doi}` : '') }}
                  </a>
                </div>
              </div>
            </div>
            <div v-if="info.references.length > 5" class="mt-6 flex justify-center">
              <BaseButton color="muted" size="sm" @click="showAllReferences = !showAllReferences">
                <Icon :name="showAllReferences ? 'ph:caret-up' : 'ph:caret-down'" class="size-4" />
                <span>
                  {{
                    showAllReferences
                      ? infoModalLanguage === 'fa'
                        ? 'کمتر'
                        : 'Show Less'
                      : infoModalLanguage === 'fa'
                      ? 'بیشتر'
                      : 'Show More'
                  }}
                </span>
              </BaseButton>
            </div>
          </BaseCard>

          <!-- Methodology -->
          <BaseCard
            v-if="(infoModalLanguage === 'fa' ? info.methodologyFa : info.methodology) || info.methodology"
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'روش‌شناسی' : 'Methodology' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{ infoModalLanguage === 'fa' && info.methodologyFa ? info.methodologyFa : info.methodology }}
            </BaseParagraph>
          </BaseCard>

          <!-- Main Findings -->
          <BaseCard
            v-if="(infoModalLanguage === 'fa' ? info.mainFindingsFa : info.mainFindings) || info.mainFindings"
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'یافته‌های اصلی' : 'Main Findings' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{ infoModalLanguage === 'fa' && info.mainFindingsFa ? info.mainFindingsFa : info.mainFindings }}
            </BaseParagraph>
          </BaseCard>

          <!-- Limitations -->
          <BaseCard
            v-if="(infoModalLanguage === 'fa' ? info.limitationsFa : info.limitations) || info.limitations"
            class="p-6 sm:p-8"
          >
            <BaseHeading as="h4" size="md" weight="semibold" class="mb-6">
              {{ infoModalLanguage === 'fa' ? 'محدودیت‌ها' : 'Limitations' }}
            </BaseHeading>
            <BaseParagraph
              :class="infoModalLanguage === 'fa' ? 'text-right leading-relaxed' : 'text-left leading-relaxed'"
            >
              {{ infoModalLanguage === 'fa' && info.limitationsFa ? info.limitationsFa : info.limitations }}
            </BaseParagraph>
          </BaseCard>
        </div>
      </div>
      <div v-else class="text-muted-500 text-center py-12">اطلاعات استخراج شده یافت نشد.</div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-3 p-4 sm:p-6">
        <BaseButton color="muted" size="sm" @click="infoModalLanguage = infoModalLanguage === 'fa' ? 'en' : 'fa'">
          <Icon name="ph:translate" class="size-4" />
          <span>{{ infoModalLanguage === 'fa' ? 'English' : 'فارسی' }}</span>
        </BaseButton>
        <BaseButton color="muted" size="sm" @click="closeInfoModal">بستن</BaseButton>
      </div>
    </template>
  </TairoModal>

  <!-- Hadi Insights Modal -->
  <TairoModal :open="isHadiModalOpen" size="2xl" @close="closeHadiModal">
    <template #header>
      <div class="flex w-full items-center justify-between p-4 sm:p-6">
        <div class="flex-1 text-right">
          <BaseHeading as="h3" size="lg" weight="semibold" class="mb-2">تحلیل هادی</BaseHeading>
          <div v-if="selectedPaperForHadi" class="text-muted-500 text-sm">
            {{ (selectedPaperForHadi as any).name || selectedPaperForHadi.title || 'مقاله' }}
          </div>
        </div>
        <BaseButtonClose @click="closeHadiModal" />
      </div>
    </template>

    <div class="max-h-[70vh] overflow-y-auto p-6">
      <div v-if="currentHadiInsights" class="space-y-4">
        <BaseCard v-for="field in hadiFields" :key="field.key" class="p-4 text-right">
          <div class="text-muted-500 text-sm font-medium mb-2">{{ field.label }}</div>
          <BaseParagraph class="leading-relaxed">
            {{ getHadiFieldValue(field.key) }}
          </BaseParagraph>
        </BaseCard>
      </div>
      <div v-else class="text-muted-500 text-center py-12">اطلاعاتی برای نمایش وجود ندارد.</div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 p-4 sm:p-6">
        <BaseButton color="muted" size="sm" @click="closeHadiModal">بستن</BaseButton>
      </div>
    </template>
  </TairoModal>
</template>
