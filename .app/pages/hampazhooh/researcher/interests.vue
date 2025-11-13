<script setup lang="ts">
  import type { ResearchInterest, ResearcherProfile } from '~/composables/useResearcher';

  definePageMeta({
    title: 'علایق پژوهشی',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();

  // AI Evaluation state
  const aiEvaluation = ref<string | null>(null);
  const isGeneratingEvaluation = ref(false);
  const evaluationError = ref<string | null>(null);

  // Use the researcher composable
  const {
    researchCategories,
    selectedInterests,
    expandedNodes,
    currentStep,
    wizardSteps,
    getCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    toggleNode,
    expandNode,
    collapseNode,
    isNodeExpanded,
    filterNodes,
    getSelectionSummary,
    saveResearchProfile,
    resetWizard,
    loadResearchData,
  } = useResearcher();

  // Use OpenRouter for AI evaluation
  const { generateStructuredResponse } = useOpenRouter();

  // Filter states
  const searchQuery = ref('');
  const activeCategory = ref('all');

  // Selected categories (level 1)
  const selectedCategories = ref<Set<string>>(new Set());

  // Custom interest addition
  const customInterestName = ref('');
  const customInterestDescription = ref('');
  const showCustomInterestForm = ref(false);

  // Computed filtered interests
  const filteredInterests = computed(() => {
    // Get selected level 1 categories
    const selectedCategories = researchCategories.value.filter((cat) =>
      selectedInterests.value.some((i) => i.path[0] === cat.id),
    );

    // Get level 2 interests from selected categories
    const level2Interests = selectedCategories.flatMap((cat) => cat.children || []);

    // Apply search filter
    return level2Interests.filter(
      (interest) =>
        !searchQuery.value ||
        interest.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        interest.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  });

  // Computed filtered detailed interests (level 3)
  const filteredDetailedInterests = computed(() => {
    // Get selected level 2 interests
    const selectedLevel2Interests = selectedInterests.value.filter((i) => i.depth === 1);

    // Get level 3 interests from selected level 2 interests
    const level3Interests = selectedLevel2Interests.flatMap((interest) => interest.children || []);

    // Apply search filter
    return level3Interests.filter(
      (interest) =>
        !searchQuery.value ||
        interest.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        interest.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  });

  // Group detailed interests by their level 2 parent categories
  const groupedDetailedInterests = computed(() => {
    const groups: { [key: string]: { category: any; interests: any[] } } = {};

    filteredDetailedInterests.value.forEach((interest) => {
      const level2Id = interest.path[1];
      if (!groups[level2Id]) {
        // Find the level 2 category
        const level2Category = selectedInterests.value.find((i) => i.id === level2Id && i.depth === 1);
        groups[level2Id] = {
          category: level2Category,
          interests: [],
        };
      }
      groups[level2Id].interests.push(interest);
    });

    return Object.values(groups);
  });

  // Group specific interests by their level 1 parent categories
  const groupedSpecificInterests = computed(() => {
    const groups: { [key: string]: { category: any; interests: any[] } } = {};

    filteredInterests.value.forEach((interest) => {
      const level1Id = interest.path[0];
      if (!groups[level1Id]) {
        // Find the level 1 category
        const level1Category = researchCategories.value.find((cat) => cat.id === level1Id);
        groups[level1Id] = {
          category: level1Category,
          interests: [],
        };
      }
      groups[level1Id].interests.push(interest);
    });

    return Object.values(groups);
  });

  // Categories for filter dropdown
  const categories = computed(() => [
    { value: 'all', label: 'همه حوزه‌ها' },
    ...researchCategories.value.map((cat) => ({ value: cat.id, label: cat.name })),
  ]);

  // Helper functions
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'welcome':
        return 'ph:lightbulb';
      case 'broad-categories':
        return 'ph:folder';
      case 'specific-interests':
        return 'ph:target';
      case 'detailed-interests':
        return 'ph:magnifying-glass';
      case 'confirmation':
        return 'ph:check-circle';
      default:
        return 'ph:circle';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'success';
      case 'advanced':
        return 'primary';
      case 'intermediate':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'expert':
        return 'متخصص';
      case 'advanced':
        return 'پیشرفته';
      case 'intermediate':
        return 'متوسط';
      default:
        return 'شروع';
    }
  };

  // Additional functions for wizard
  const toggleCategory = (category: any) => {
    const categoryId = category.id;
    const isSelected = selectedCategories.value.has(categoryId);

    if (isSelected) {
      // Remove category from selected categories
      selectedCategories.value.delete(categoryId);
      // Remove all interests from this category
      selectedInterests.value = selectedInterests.value.filter((i) => i.path[0] !== categoryId);
      // Also update the original data to reflect deselection
      const categoryChildren = category.children || [];
      categoryChildren.forEach((interest: any) => {
        interest.selected = false;
      });
    } else {
      // Add category to selected categories
      selectedCategories.value.add(categoryId);
      // Add all interests from this category
      const categoryChildren = category.children || [];
      categoryChildren.forEach((interest: any) => {
        if (!selectedInterests.value.some((i) => i.id === interest.id)) {
          interest.selected = true;
          selectedInterests.value.push(interest);
        }
      });
    }
  };

  const isInterestSelected = (interestName: string) => {
    return selectedInterests.value.some((i) => i.name === interestName);
  };

  // Helper functions for the specific interests step
  const getAverageLevel = () => {
    if (selectedInterests.value.length === 0) return 'beginner';

    const levels = selectedInterests.value.map((i) => {
      switch (i.level) {
        case 'expert':
          return 4;
        case 'advanced':
          return 3;
        case 'intermediate':
          return 2;
        case 'beginner':
          return 1;
        default:
          return 1;
      }
    });

    const average = levels.reduce((a, b) => a + b, 0) / levels.length;

    if (average >= 3.5) return 'expert';
    if (average >= 2.5) return 'advanced';
    if (average >= 1.5) return 'intermediate';
    return 'beginner';
  };

  const getAverageLevelLabel = () => {
    return getLevelLabel(getAverageLevel());
  };

  // Wizard navigation
  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const canProceed = computed(() => {
    switch (currentStep.value) {
      case 0: // Welcome
        return true;
      case 1: // Broad categories
        return selectedInterests.value.length > 0;
      case 2: // Specific interests
        return selectedInterests.value.length > 0;
      case 3: // Detailed interests
        return selectedInterests.value.length > 0;
      case 4: // Confirmation
        return true;
      default:
        return false;
    }
  });

  // Save and navigation
  const saveInterests = async () => {
    try {
      const profile: ResearcherProfile & { aiEvaluation?: string } = {
        id: '1',
        name: 'کاربر',
        field: 'عمومی',
        experience: 'تجربه کاربر',
        interests: selectedInterests.value,
        priorities: selectedInterests.value,
        aiEvaluation: aiEvaluation.value || undefined,
      };

      await saveResearchProfile(profile);

      toaster.show({
        title: 'ذخیره شد',
        message: 'علایق پژوهشی و ارزیابی هوش مصنوعی شما ذخیره شد.',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      });

      // Navigate to priorities page
      await router.push('/hampazhooh/researcher/priorities');
    } catch (error) {
      toaster.show({
        title: 'خطا',
        message: 'متاسفانه مشکلی پیش آمد. لطفا دوباره تلاش کنید.',
        color: 'danger',
        icon: 'ph:warning-fill',
        closable: true,
      });
    }
  };

  // Generate evaluation when entering confirmation step
  watch(currentStep, async (newStep) => {
    if (newStep === 4 && selectedInterests.value.length > 0 && !aiEvaluation.value && !isGeneratingEvaluation.value) {
      await generateAIEvaluation();
    }
  });

  // Loading states
  const isSaving = ref(false);
  const isLoadingData = ref(true);

  // Enhanced save function with loading state
  const saveInterestsWithLoading = async () => {
    isSaving.value = true;
    try {
      await saveInterests();
    } finally {
      isSaving.value = false;
    }
  };

  // Initialize data on component mount
  onMounted(async () => {
    try {
      await loadResearchData();
      isLoadingData.value = false;
    } catch (error) {
      console.error('Error loading research data:', error);
      isLoadingData.value = false;
    }
    // Reset selected categories when component mounts
    selectedCategories.value.clear();
  });

  const navigateBack = () => {
    router.push('/hampazhooh/researcher');
  };

  const addCustomInterest = () => {
    if (customInterestName.value.trim()) {
      const newInterest: ResearchInterest = {
        id: `custom-${Date.now()}`,
        name: customInterestName.value.trim(),
        description: customInterestDescription.value.trim() || 'علاقه پژوهشی سفارشی',
        level: 'intermediate',
        priority: 3,
        selected: true,
        type: 'interest',
        path: ['custom'],
        depth: 2,
      };

      // Add to selected interests
      selectedInterests.value.push(newInterest);

      // Reset form
      customInterestName.value = '';
      customInterestDescription.value = '';
      showCustomInterestForm.value = false;

      toaster.show({
        title: 'علاقه اضافه شد',
        message: 'علاقه پژوهشی سفارشی شما اضافه شد.',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      });
    }
  };

  // AI Evaluation Schema
  const evaluationSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'عنوان جذاب و الهام‌بخش برای ارزیابی',
      },
      overview: {
        type: 'string',
        description: 'مرور کلی و مثبت از علایق انتخاب شده',
      },
      strengths: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'نقاط قوت و پتانسیل‌های کشف شده در علایق',
      },
      combinedPotential: {
        type: 'string',
        description: 'بیان اینکه این علایق با هم چه پتانسیلی ایجاد می‌کنند',
      },
      insights: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'بینش‌های جالب و الهام‌بخش درباره علایق',
      },
      recommendations: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'پیشنهادهای عملی برای توسعه علایق',
      },
    },
    required: ['title', 'overview', 'strengths', 'combinedPotential', 'insights', 'recommendations'],
    additionalProperties: false,
  };

  // Generate AI Evaluation
  const generateAIEvaluation = async () => {
    if (selectedInterests.value.length === 0) {
      evaluationError.value = 'لطفا ابتدا علایق پژوهشی خود را انتخاب کنید.';
      return;
    }

    isGeneratingEvaluation.value = true;
    evaluationError.value = null;
    aiEvaluation.value = null;

    try {
      const interestsText = selectedInterests.value
        .map((interest) => `${interest.name}: ${interest.description}`)
        .join('\n');

      const result = await generateStructuredResponse({
        messages: [
          {
            role: 'system',
            content: `شما یک تحلیلگر علمی متخصص هستید. بر اساس علایق پژوهشی انتخاب شده توسط کاربر، یک ارزیابی علمی، تحلیلی و مبتنی بر شواهد ایجاد کنید.

دستورالعمل‌های کلیدی:
- از زبان علمی و تحلیلی استفاده کنید
- تحلیل‌های مبتنی بر شواهد ارائه دهید
- از ایموجی‌ها استفاده نکنید
- به زبان فارسی و به صورت رسمی بنویسید
- ارزیابی باید علمی و دقیق باشد`,
          },
          {
            role: 'user',
            content: `علایق پژوهشی انتخاب شده توسط کاربر:

${interestsText}

لطفا یک ارزیابی جامع و مثبت از این علایق ایجاد کنید که شامل موارد زیر باشد:
1. عنوان جذاب
2. مرور کلی مثبت
3. نقاط قوت و پتانسیل‌ها
4. پتانسیل ترکیبی علایق
5. بینش‌های جالب
6. پیشنهادهای عملی برای توسعه

ارزیابی باید بسیار مثبت، الهام‌بخش و کشف‌کننده پتانسیل باشد.`,
          },
        ],
        schema: evaluationSchema,
        schemaName: 'research_interests_evaluation',
        model: 'mistralai/mistral-saba',
        maxTokens: 2000,
        temperature: 0.8,
      });

      // Format the evaluation for display
      aiEvaluation.value = `
# ${result.title} 🌟

## نمای کلی
${result.overview}

## نقاط قوت و پتانسیل‌های شما 💪
${result.strengths.map((strength) => `• ${strength}`).join('\n')}

## پتانسیل ترکیبی علایق ✨
${result.combinedPotential}

## بینش‌های جالب 🔍
${result.insights.map((insight) => `• ${insight}`).join('\n')}

## پیشنهادهای عملی برای توسعه 🚀
${result.recommendations.map((rec) => `• ${rec}`).join('\n')}
      `.trim();
    } catch (error) {
      console.error('Error generating AI evaluation:', error);
      evaluationError.value = 'متاسفانه در تولید ارزیابی هوش مصنوعی خطایی رخ داد. لطفا دوباره تلاش کنید.';
    } finally {
      isGeneratingEvaluation.value = false;
    }
  };
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen" role="main" aria-label="صفحه شناسایی علایق پژوهشی">
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <!-- Wizard Progress -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <BaseHeading as="h1" size="3xl" weight="bold">شناسایی علایق پژوهشی</BaseHeading>
          <BaseButton size="sm" shape="curved" @click="navigateBack">
            <Icon name="ph:arrow-right" class="size-4" />
            <span>بازگشت به پروفایل</span>
          </BaseButton>
        </div>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              مرحله {{ currentStep + 1 }} از {{ wizardSteps.length }}
            </BaseParagraph>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              {{ Math.round(((currentStep + 1) / wizardSteps.length) * 100) }}%
            </BaseParagraph>
          </div>
          <div class="bg-muted-200 dark:bg-muted-700 h-3 w-full overflow-hidden rounded-full shadow-inner">
            <div
              class="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              :style="{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }"
            />
          </div>
        </div>

        <!-- Step Indicator -->
        <div class="flex items-center gap-2 mb-6">
          <div v-for="(step, index) in wizardSteps" :key="step.id" class="flex items-center">
            <div
              class="flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 shadow-sm"
              :class="
                index <= currentStep
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-200 dark:shadow-primary-900'
                  : 'bg-muted-200 dark:bg-muted-700 text-muted-500'
              "
            >
              <Icon
                :name="getStepIcon(step.id)"
                class="size-5"
                :class="index <= currentStep ? 'text-white' : 'text-muted-400'"
              />
            </div>
            <span
              class="mr-3 text-sm font-medium transition-colors"
              :class="index <= currentStep ? 'text-primary-600 dark:text-primary-400' : 'text-muted-500'"
            >
              {{ step.title }}
            </span>
            <Icon v-if="index < wizardSteps.length - 1" name="ph:caret-left" class="size-4 text-muted-400" />
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="space-y-6">
        <!-- Welcome Step -->
        <div v-if="currentStep === 0" class="text-center transition-all duration-500 ease-in-out">
          <BaseCard class="p-8" shape="curved">
            <Icon name="ph:lightbulb" class="mx-auto mb-6 size-16 text-primary-500" />
            <BaseHeading as="h2" size="2xl" weight="bold" class="mb-4">
              {{ getCurrentStep().title }}
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-6 leading-relaxed">
              {{ getCurrentStep().description }}
            </BaseParagraph>
            <BaseParagraph class="text-muted-500 dark:text-muted-400 text-sm">
              این فرآیند به صورت مرحله به مرحله شما را راهنمایی می‌کند تا علایق پژوهشی خود را به بهترین شکل شناسایی و
              اولویت‌بندی کنید. در هر مرحله می‌توانید به عقب برگردید و تغییرات اعمال کنید.
            </BaseParagraph>
          </BaseCard>
        </div>

        <!-- Broad Categories Step -->
        <div v-if="currentStep === 1" class="transition-all duration-500 ease-in-out">
          <BaseCard class="p-6" shape="curved">
            <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">
              {{ getCurrentStep().title }}
            </BaseHeading>
            <BaseParagraph class="text-muted-600 dark:text-muted-400 mb-6">
              {{ getCurrentStep().description }}
            </BaseParagraph>

            <!-- Selection Instructions -->
            <div
              class="mb-6 p-4 bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary-200 dark:border-primary-800"
            >
              <div class="flex items-start gap-3">
                <Icon name="ph:info" class="size-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                <div>
                  <BaseParagraph size="sm" weight="medium" class="text-primary-800 dark:text-primary-200 mb-1">
                    نحوه انتخاب حوزه‌ها
                  </BaseParagraph>
                  <BaseParagraph size="xs" class="text-primary-700 dark:text-primary-300">
                    روی هر حوزه کلیک کنید تا آن را انتخاب یا لغو انتخاب کنید. می‌توانید چندین حوزه را همزمان انتخاب
                    کنید.
                  </BaseParagraph>
                </div>
              </div>
            </div>

            <!-- Categories Grid -->
            <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              <BaseCard
                v-for="category in researchCategories"
                :key="category.id"
                shape="curved"
                class="cursor-pointer p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border-2"
                :class="
                  selectedCategories.has(category.id)
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950 border-primary-300 dark:border-primary-700 shadow-lg'
                    : 'border-muted-200 dark:border-muted-700 hover:border-primary-300 dark:hover:border-primary-600'
                "
                @click="toggleCategory(category)"
                role="button"
                :aria-pressed="selectedCategories.has(category.id)"
                :aria-label="`انتخاب حوزه ${category.name}`"
                tabindex="0"
                @keydown.enter="toggleCategory(category)"
                @keydown.space.prevent="toggleCategory(category)"
              >
                <div class="flex items-center gap-3">
                  <Icon
                    name="ph:folder"
                    class="size-6 transition-colors"
                    :class="selectedCategories.has(category.id) ? 'text-primary-600' : 'text-primary-500'"
                  />
                  <div class="flex-1">
                    <BaseHeading as="h4" size="md" weight="medium" class="mb-1">
                      {{ category.name }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                      {{ category.description }}
                    </BaseParagraph>
                    <div class="mt-2 flex items-center gap-2">
                      <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                        {{ (category.children || []).length }} زیرحوزه
                      </BaseParagraph>
                      <div v-if="selectedCategories.has(category.id)" class="flex items-center gap-1">
                        <Icon name="ph:check-circle" class="size-3 text-success-500" />
                        <BaseParagraph size="xs" class="text-success-600 dark:text-success-400">
                          انتخاب شده
                        </BaseParagraph>
                      </div>
                    </div>
                  </div>
                  <BaseCheckbox
                    :model-value="selectedCategories.has(category.id)"
                    @update:model-value="toggleCategory(category)"
                  >
                    <template #label>
                      <BaseTooltip content="این حوزه را انتخاب کنید تا زیرحوزه‌های آن نمایش داده شوند">
                        <span>انتخاب حوزه</span>
                      </BaseTooltip>
                    </template>
                  </BaseCheckbox>
                </div>
              </BaseCard>
            </div>

            <!-- Selection Summary -->
            <div class="mt-6 p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
              <div class="flex items-center justify-between">
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                  حوزه‌های انتخاب شده: {{ selectedCategories.size }}
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                  کل حوزه‌ها: {{ researchCategories.length }}
                </BaseParagraph>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Specific Interests Step -->
        <div v-if="currentStep === 2" class="transition-all duration-500 ease-in-out">
          <div class="space-y-6">
            <BaseCard class="p-6" shape="curved">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">
                {{ getCurrentStep().title }}
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-400 mb-6">
                {{ getCurrentStep().description }}
              </BaseParagraph>

              <!-- Selected Categories Summary -->
              <div class="mb-6">
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
                  حوزه‌های انتخاب شده شما:
                </BaseParagraph>
                <div class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="category in researchCategories.filter((c) =>
                      selectedInterests.some((i) => i.path[0] === c.id),
                    )"
                    :key="category.id"
                    color="primary"
                    shape="curved"
                  >
                    {{ category.name }}
                  </BaseTag>
                </div>
              </div>

              <!-- Search and Custom Interest -->
              <div class="mb-6 space-y-4">
                <div class="flex flex-col sm:flex-row gap-4">
                  <BaseInput v-model="searchQuery" placeholder="جستجو در علایق پژوهشی..." shape="curved" class="flex-1">
                    <template #icon>
                      <Icon name="ph:magnifying-glass" class="size-4" />
                    </template>
                  </BaseInput>
                  <BaseButton
                    color="primary"
                    shape="curved"
                    variant="outline"
                    @click="showCustomInterestForm = !showCustomInterestForm"
                  >
                    <Icon name="ph:plus" class="size-4" />
                    <span class="hidden sm:inline">علاقه سفارشی</span>
                  </BaseButton>
                </div>

                <!-- Custom Interest Form -->
                <div
                  v-if="showCustomInterestForm"
                  class="p-4 bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary-200 dark:border-primary-800"
                >
                  <BaseHeading as="h4" size="sm" weight="medium" class="mb-3 text-primary-800 dark:text-primary-200">
                    اضافه کردن علاقه پژوهشی سفارشی
                  </BaseHeading>
                  <div class="space-y-3">
                    <BaseInput
                      v-model="customInterestName"
                      placeholder="نام علاقه پژوهشی"
                      shape="curved"
                      class="w-full"
                    />
                    <BaseTextarea
                      v-model="customInterestDescription"
                      placeholder="توضیحات (اختیاری)"
                      shape="curved"
                      class="w-full"
                      rows="2"
                    />
                    <div class="flex gap-2">
                      <BaseButton
                        color="success"
                        shape="curved"
                        size="sm"
                        :disabled="!customInterestName.trim()"
                        @click="addCustomInterest"
                      >
                        <Icon name="ph:check" class="size-4" />
                        اضافه کردن
                      </BaseButton>
                      <BaseButton
                        color="default"
                        shape="curved"
                        size="sm"
                        variant="outline"
                        @click="showCustomInterestForm = false"
                      >
                        <Icon name="ph:x" class="size-4" />
                        لغو
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>

            <!-- Grouped Specific Interests by Level 1 Categories -->
            <div class="space-y-8">
              <div v-for="group in groupedSpecificInterests" :key="group.category.id" class="space-y-4">
                <!-- Level 1 Category Header -->
                <div
                  class="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary-200 dark:border-primary-800"
                >
                  <Icon name="ph:folder" class="size-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <BaseHeading as="h4" size="md" weight="medium" class="text-primary-800 dark:text-primary-200">
                      {{ group.category.name }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-primary-700 dark:text-primary-300">
                      {{ group.category.description }}
                    </BaseParagraph>
                  </div>
                </div>

                <!-- Level 2 Interests Grid for this Category -->
                <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <BaseCard
                    v-for="interest in group.interests"
                    :key="interest.id"
                    shape="curved"
                    class="cursor-pointer p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border-2"
                    :class="
                      interest.selected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800'
                        : 'border-muted-200 dark:border-muted-700 hover:border-primary-300 dark:hover:border-primary-600'
                    "
                    @click="toggleNode(interest)"
                    role="button"
                    :aria-pressed="interest.selected"
                    :aria-label="`انتخاب علاقه ${interest.name}`"
                    tabindex="0"
                    @keydown.enter="toggleNode(interest)"
                    @keydown.space.prevent="toggleNode(interest)"
                  >
                    <div class="space-y-3">
                      <!-- Interest Header -->
                      <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                          <BaseHeading as="h5" size="sm" weight="medium" class="mb-1 line-clamp-2">
                            {{ interest.name }}
                          </BaseHeading>
                          <BaseTag :color="getLevelColor(interest.level)" shape="curved" size="sm" class="text-xs">
                            {{ getLevelLabel(interest.level) }}
                          </BaseTag>
                        </div>
                        <BaseCheckbox
                          :model-value="interest.selected"
                          @update:model-value="toggleNode(interest)"
                          class="flex-shrink-0 ml-2"
                        >
                          <template #label>
                            <BaseTooltip :content="`سطح تخصص: ${getLevelLabel(interest.level)}`">
                              <span>انتخاب</span>
                            </BaseTooltip>
                          </template>
                        </BaseCheckbox>
                      </div>

                      <!-- Description -->
                      <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400 line-clamp-3 leading-relaxed">
                        {{ interest.description }}
                      </BaseParagraph>

                      <!-- Interest Metadata -->
                      <div
                        class="flex items-center justify-between pt-2 border-t border-muted-200 dark:border-muted-700"
                      >
                        <div class="flex items-center gap-2">
                          <Icon name="ph:book-open" class="size-3 text-muted-500" />
                          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                            اولویت {{ interest.priority }}
                          </BaseParagraph>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              </div>
            </div>

            <!-- Selection Summary -->
            <BaseCard class="p-6" shape="curved">
              <div class="flex items-center justify-between">
                <div>
                  <BaseHeading as="h4" size="md" weight="medium" class="mb-1">خلاصه انتخاب‌ها</BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    {{ selectedInterests.length }} علاقه پژوهشی انتخاب شده است
                  </BaseParagraph>
                </div>
                <div class="text-left">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">میانگین سطح تخصص</BaseParagraph>
                  <BaseTag :color="getLevelColor(getAverageLevel())" shape="curved" size="sm">
                    {{ getAverageLevelLabel() }}
                  </BaseTag>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Detailed Interests Step -->
        <div v-if="currentStep === 3" class="transition-all duration-500 ease-in-out">
          <div class="space-y-6">
            <BaseCard class="p-6" shape="curved">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">
                {{ getCurrentStep().title }}
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-400 mb-6">
                {{ getCurrentStep().description }}
              </BaseParagraph>

              <!-- Selected Level 2 Interests Summary -->
              <div class="mb-6">
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
                  علایق انتخاب شده شما:
                </BaseParagraph>
                <div class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="interest in selectedInterests.filter((i) => i.depth === 1)"
                    :key="interest.id"
                    color="primary"
                    shape="curved"
                  >
                    {{ interest.name }}
                  </BaseTag>
                </div>
              </div>

              <!-- Search -->
              <div class="mb-6">
                <div class="relative">
                  <div class="relative">
                    <BaseInput
                      v-model="searchQuery"
                      placeholder="جستجو در علایق جزئی..."
                      shape="curved"
                      class="w-full max-w-md"
                    >
                      <template #icon>
                        <Icon name="ph:magnifying-glass" class="size-4" />
                      </template>
                    </BaseInput>
                    <div
                      v-if="searchQuery"
                      class="absolute inset-y-0 left-3 flex items-center gap-2 pointer-events-none"
                    >
                      <BaseButton
                        size="xs"
                        color="default"
                        variant="ghost"
                        shape="curved"
                        class="pointer-events-auto"
                        @click="searchQuery = ''"
                      >
                        <Icon name="ph:x" class="size-3" />
                      </BaseButton>
                      <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                        {{ filteredDetailedInterests.length }} نتیجه
                      </BaseParagraph>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>

            <!-- Grouped Detailed Interests by Level 2 Categories -->
            <div class="space-y-8">
              <div v-for="group in groupedDetailedInterests" :key="group.category.id" class="space-y-4">
                <!-- Level 2 Category Header -->
                <div
                  class="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary-200 dark:border-primary-800"
                >
                  <Icon name="ph:folder" class="size-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <BaseHeading as="h4" size="md" weight="medium" class="text-primary-800 dark:text-primary-200">
                      {{ group.category.name }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-primary-700 dark:text-primary-300">
                      {{ group.category.description }}
                    </BaseParagraph>
                  </div>
                </div>

                <!-- Level 3 Interests Grid for this Category -->
                <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <BaseCard
                    v-for="interest in group.interests"
                    :key="interest.id"
                    shape="curved"
                    class="cursor-pointer p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 border-2"
                    :class="
                      interest.selected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800'
                        : 'border-muted-200 dark:border-muted-700 hover:border-primary-300 dark:hover:border-primary-600'
                    "
                    @click="toggleNode(interest)"
                    role="button"
                    :aria-pressed="interest.selected"
                    :aria-label="`انتخاب علاقه ${interest.name}`"
                    tabindex="0"
                    @keydown.enter="toggleNode(interest)"
                    @keydown.space.prevent="toggleNode(interest)"
                  >
                    <div class="space-y-3">
                      <!-- Interest Header -->
                      <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                          <BaseHeading as="h5" size="sm" weight="medium" class="mb-1 line-clamp-2">
                            {{ interest.name }}
                          </BaseHeading>
                          <BaseTag :color="getLevelColor(interest.level)" shape="curved" size="sm" class="text-xs">
                            {{ getLevelLabel(interest.level) }}
                          </BaseTag>
                        </div>
                        <BaseCheckbox
                          :model-value="interest.selected"
                          @update:model-value="toggleNode(interest)"
                          class="flex-shrink-0 ml-2"
                        >
                          <template #label>
                            <BaseTooltip :content="`سطح تخصص: ${getLevelLabel(interest.level)}`">
                              <span>انتخاب</span>
                            </BaseTooltip>
                          </template>
                        </BaseCheckbox>
                      </div>

                      <!-- Description -->
                      <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400 line-clamp-3 leading-relaxed">
                        {{ interest.description }}
                      </BaseParagraph>

                      <!-- Interest Metadata -->
                      <div
                        class="flex items-center justify-between pt-2 border-t border-muted-200 dark:border-muted-700"
                      >
                        <div class="flex items-center gap-2">
                          <Icon name="ph:book-open" class="size-3 text-muted-500" />
                          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                            اولویت {{ interest.priority }}
                          </BaseParagraph>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              </div>
            </div>

            <!-- Selection Summary -->
            <BaseCard class="p-6" shape="curved">
              <div class="flex items-center justify-between">
                <div>
                  <BaseHeading as="h4" size="md" weight="medium" class="mb-1">خلاصه انتخاب‌ها</BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    {{ selectedInterests.length }} علاقه پژوهشی انتخاب شده است
                  </BaseParagraph>
                </div>
                <div class="text-left">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">میانگین سطح تخصص</BaseParagraph>
                  <BaseTag :color="getLevelColor(getAverageLevel())" shape="curved" size="sm">
                    {{ getAverageLevelLabel() }}
                  </BaseTag>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Confirmation Step -->
        <div v-if="currentStep === 4" class="transition-all duration-500 ease-in-out">
          <div class="space-y-6">
            <BaseCard class="p-6" shape="curved">
              <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">
                {{ getCurrentStep().title }}
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-400 mb-6">
                {{ getCurrentStep().description }}
              </BaseParagraph>

              <div class="space-y-6">
                <div>
                  <BaseHeading as="h4" size="md" weight="medium" class="mb-3">
                    علایق انتخاب شده ({{ selectedInterests.length }})
                  </BaseHeading>
                  <div class="flex flex-wrap gap-2">
                    <BaseTag v-for="interest in selectedInterests" :key="interest.id" color="primary" shape="curved">
                      {{ interest.name }}
                    </BaseTag>
                  </div>
                </div>

                <div class="border-t border-muted-200 dark:border-muted-700 pt-6">
                  <BaseParagraph class="text-muted-600 dark:text-muted-400 text-sm">
                    با کلیک روی دکمه "تکمیل و ذخیره"، علایق پژوهشی شما ذخیره خواهد شد و می‌توانید در صفحه اولویت‌ها آنها
                    را مدیریت کنید.
                  </BaseParagraph>
                </div>
              </div>
            </BaseCard>

            <!-- AI Evaluation Section -->
            <BaseCard class="p-6" shape="curved">
              <div class="flex items-center gap-3 mb-4">
                <Icon name="ph:brain" class="size-6 text-primary-500" />
                <BaseHeading as="h3" size="lg" weight="medium">ارزیابی هوش مصنوعی از علایق شما</BaseHeading>
              </div>

              <BaseParagraph class="text-muted-600 dark:text-muted-400 mb-6">
                بر اساس علایق پژوهشی انتخاب شده، هوش مصنوعی یک ارزیابی شخصی‌سازی شده و الهام‌بخش برای شما ایجاد کرده
                است.
              </BaseParagraph>

              <!-- Loading State -->
              <div v-if="isGeneratingEvaluation" class="text-center py-8">
                <div class="flex items-center justify-center gap-3 mb-4">
                  <Icon name="ph:spinner" class="size-6 animate-spin text-primary-500" />
                  <BaseParagraph class="text-primary-600 dark:text-primary-400">
                    در حال تولید ارزیابی هوش مصنوعی...
                  </BaseParagraph>
                </div>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  این فرآیند ممکن است چند ثانیه طول بکشد
                </BaseParagraph>
              </div>

              <!-- Error State -->
              <div v-else-if="evaluationError" class="text-center py-8">
                <Icon name="ph:warning-circle" class="size-12 text-warning-500 mx-auto mb-4" />
                <BaseHeading as="h4" size="md" weight="medium" class="text-warning-700 dark:text-warning-300 mb-2">
                  خطا در تولید ارزیابی
                </BaseHeading>
                <BaseParagraph class="text-warning-600 dark:text-warning-400 mb-4">
                  {{ evaluationError }}
                </BaseParagraph>
                <BaseButton color="warning" shape="curved" @click="generateAIEvaluation">
                  <Icon name="ph:arrow-clockwise" class="size-4" />
                  تلاش دوباره
                </BaseButton>
              </div>

              <!-- Evaluation Content -->
              <div v-else-if="aiEvaluation" class="space-y-4">
                <div
                  class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-lg p-6 border border-primary-200 dark:border-primary-800"
                >
                  <div
                    class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl max-w-none"
                  >
                    <AddonMarkdownRemark :source="aiEvaluation" fullwidth />
                  </div>
                </div>

                <div class="flex items-center gap-2 text-muted-500 dark:text-muted-400">
                  <Icon name="ph:sparkle" class="size-4" />
                  <BaseParagraph size="xs">
                    این ارزیابی توسط هوش مصنوعی بر اساس علایق انتخاب شده شما تولید شده است
                  </BaseParagraph>
                </div>
              </div>

              <!-- No Evaluation Yet -->
              <div v-else class="text-center py-8">
                <Icon name="ph:brain" class="size-12 text-muted-400 mx-auto mb-4" />
                <BaseHeading as="h4" size="md" weight="medium" class="text-muted-600 dark:text-muted-400 mb-2">
                  ارزیابی آماده نیست
                </BaseHeading>
                <BaseParagraph class="text-muted-500 dark:text-muted-400 mb-4">
                  لطفا منتظر بمانید تا ارزیابی هوش مصنوعی تولید شود
                </BaseParagraph>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-8 flex items-center justify-between">
        <BaseButton :disabled="currentStep === 0" color="default" shape="curved" @click="handlePrev">
          <Icon name="ph:arrow-right" class="size-4" />
          مرحله قبل
        </BaseButton>

        <div class="flex gap-2">
          <BaseButton
            v-if="currentStep === wizardSteps.length - 1"
            color="success"
            shape="curved"
            :loading="isSaving"
            @click="saveInterestsWithLoading"
          >
            <Icon name="ph:check" class="size-4" />
            تکمیل و ذخیره
          </BaseButton>

          <BaseButton v-else :disabled="!canProceed" color="primary" shape="curved" @click="handleNext">
            مرحله بعد
            <Icon name="ph:arrow-left" class="size-4" />
          </BaseButton>
        </div>
      </div>

      <!-- Loading overlay -->
      <div v-if="isLoadingData" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-muted-800 rounded-lg p-6 flex items-center gap-4">
          <Icon name="ph:spinner" class="size-6 animate-spin text-primary-500" />
          <span class="text-muted-700 dark:text-muted-300">در حال بارگذاری داده‌ها...</span>
        </div>
      </div>
    </div>
  </div>
</template>
