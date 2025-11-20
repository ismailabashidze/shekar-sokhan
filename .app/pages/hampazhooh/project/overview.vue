<script setup lang="ts">
  type ProjectStatus =
    | 'created'
    | 'collectingRelatedArticles'
    | 'Analyzing'
    | 'readyForContinue'
    | 'inProgress'
    | 'done';

  type ProjectType = 'project' | 'doctoral' | 'masters' | 'article';

  definePageMeta({
    title: 'نمای کلی پروژه',
    layout: 'sidebar',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const route = useRoute();
  const toaster = useToaster();
  const { getResearchProject } = useResearchProject();

  const projectId = computed(() => (route.query.projectId as string) || '');
  const project = ref<Record<string, any> | null>(null);
  const isLoading = ref(false);
  const loadError = ref('');

  const statusDictionary: Record<
    ProjectStatus,
    { label: string; color: string; icon: string; helper: string }
  > = {
    created: {
      label: 'ثبت اولیه',
      color: 'info',
      icon: 'ph:clock',
      helper: 'پروژه تازه ثبت شده است.',
    },
    collectingRelatedArticles: {
      label: 'جمع‌آوری منابع',
      color: 'warning',
      icon: 'ph:books',
      helper: 'جمع‌آوری مقالات و داده‌های مورد نیاز در حال انجام است.',
    },
    Analyzing: {
      label: 'تحلیل داده‌ها',
      color: 'primary',
      icon: 'ph:chart-line-up',
      helper: 'تیم پژوهشی در حال تحلیل داده‌ها است.',
    },
    readyForContinue: {
      label: 'آماده ادامه',
      color: 'info',
      icon: 'ph:arrow-fat-lines-right',
      helper: 'پروژه برای مرحله بعدی آماده شده است.',
    },
    inProgress: {
      label: 'در حال اجرا',
      color: 'success',
      icon: 'ph:play-circle',
      helper: 'پروژه در حال پیشرفت است.',
    },
    done: {
      label: 'تکمیل شده',
      color: 'success',
      icon: 'ph:check-circle',
      helper: 'پروژه با موفقیت به پایان رسیده است.',
    },
  };

  const projectTypeDictionary: Record<ProjectType, { label: string; icon: string }> = {
    project: {
      label: 'پروژه پژوهشی',
      icon: 'ph:folder-open',
    },
    doctoral: {
      label: 'رساله دکتری',
      icon: 'ph:graduation-cap',
    },
    masters: {
      label: 'پایان‌نامه ارشد',
      icon: 'ph:student',
    },
    article: {
      label: 'پروژه مقاله',
      icon: 'ph:article',
    },
  };

  const normalizeArray = (value: unknown) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value ? [value] : [];
    return [];
  };

  const formattedProject = computed(() => {
    if (!project.value) return null;
    const statusKey = (project.value.status as ProjectStatus) || 'created';
    const statusMeta = statusDictionary[statusKey] || statusDictionary.created;
    const projectTypeKey = (project.value.projectType as ProjectType) || 'project';
    const projectTypeMeta = projectTypeDictionary[projectTypeKey];

    return {
      ...project.value,
      statusMeta,
      projectTypeMeta,
      researchDomain: normalizeArray(project.value.researchDomain),
      keywords: normalizeArray(project.value.keywords),
      researchGoals: normalizeArray(project.value.researchGoals),
      created: project.value.created
        ? new Date(project.value.created).toLocaleDateString('fa-IR')
        : '',
      updated: project.value.updated
        ? new Date(project.value.updated).toLocaleDateString('fa-IR')
        : '',
    };
  });

  const loadProject = async () => {
    if (!projectId.value) {
      loadError.value = 'شناسه پروژه نامعتبر است.';
      return;
    }
    loadError.value = '';
    isLoading.value = true;
    try {
      project.value = await getResearchProject(projectId.value);
    } catch (error: any) {
      const message = error?.message || 'خطا در دریافت اطلاعات پروژه';
      loadError.value = message;
      toaster.show({
        title: 'خطا',
        message,
        color: 'danger',
        icon: 'ph:warning',
        closable: true,
      });
    } finally {
      isLoading.value = false;
    }
  };

  watch(
    () => projectId.value,
    (value) => {
      if (value) {
        loadProject();
      }
    },
    { immediate: true },
  );

  const goBackToProjects = () => {
    router.push('/hampazhooh/projects');
  };

  const goToResourceCollection = () => {
    router.push({
      path: '/hampazhooh/resource-collection',
      query: { projectId: projectId.value },
    });
  };

  const isCollectingStatus = computed(() => {
    return formattedProject.value?.status === 'collectingRelatedArticles';
  });
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gray-50">
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BaseHeading as="h1" size="2xl" weight="bold" class="text-gray-900 dark:text-white">
              نمای کلی پروژه
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-400 mt-1">
              شناسه پروژه: {{ projectId || '---' }}
            </BaseParagraph>
          </div>
          <div class="flex gap-3">
            <BaseButton color="muted" shape="curved" @click="goBackToProjects">
              <Icon name="ph:arrow-right" class="ml-2 size-5" />
              بازگشت به پروژه‌ها
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div
        v-if="isLoading"
        class="dark:bg-muted-800 dark:border-muted-700 flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white"
      >
        <div class="text-center">
          <Icon name="svg-spinners:90-ring-with-bg" class="text-primary-500 mx-auto mb-4 size-12" />
          <BaseHeading as="h3" size="lg" class="text-gray-900 dark:text-white">در حال بارگذاری...</BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 mt-1">
            لطفاً چند لحظه صبر کنید
          </BaseParagraph>
        </div>
      </div>

      <div
        v-else-if="loadError || !formattedProject"
        class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-8 text-center"
      >
        <Icon name="ph:warning" class="text-danger-500 mx-auto mb-4 size-12" />
        <BaseHeading as="h3" size="lg" class="text-gray-900 dark:text-white">
          {{ loadError || 'اطلاعاتی یافت نشد' }}
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 mt-2">
          اطمینان حاصل کنید لینک پروژه صحیح است و سپس مجدداً تلاش کنید.
        </BaseParagraph>
      </div>

      <div v-else class="space-y-6">
        <!-- Resource Collection Action Card -->
        <div
          v-if="isCollectingStatus"
          class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-gradient-to-br from-warning-50 via-orange-50 to-amber-50 dark:from-warning-900/30 dark:via-orange-900/20 dark:to-amber-900/30 p-6 lg:p-8"
        >
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-4">
              <div class="bg-warning-500/10 rounded-2xl p-4">
                <Icon name="ph:magnifying-glass" class="text-warning-500 size-10" />
              </div>
              <div>
                <BaseParagraph size="xs" class="text-muted-500 mb-1">
                  وضعیت کنونی:
                </BaseParagraph>
                <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-900 dark:text-white">
                  جمع‌آوری منابع علمی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 mt-1">
                  پروژه شما در مرحله جمع‌آوری منابع است. برای مشاهده روند جمع‌آوری و نتایج، روی دکمه زیر کلیک کنید.
                </BaseParagraph>
              </div>
            </div>
            <div>
              <BaseButton
                color="warning"
                size="lg"
                shape="curved"
                @click="goToResourceCollection"
                class="shadow-lg"
              >
                <Icon name="ph:arrow-left" class="ml-2 size-5" />
                مشاهده روند جمع‌آوری منابع
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Status Card -->
        <div
          class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6 lg:p-8"
        >
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-4">
              <div
                :class="[
                  `bg-${formattedProject.statusMeta.color}-500/10`,
                  'rounded-2xl p-4'
                ]"
              >
                <Icon
                  :name="formattedProject.statusMeta.icon"
                  :class="[`text-${formattedProject.statusMeta.color}-500`, 'size-10']"
                />
              </div>
              <div>
                <BaseHeading as="h2" size="xl" weight="semibold" class="text-gray-900 dark:text-white">
                  {{ formattedProject.title || formattedProject.projectTypeMeta.label }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 mt-1">
                  {{ formattedProject.statusMeta.helper }}
                </BaseParagraph>
              </div>
            </div>
            <div class="flex flex-wrap gap-3">
              <BaseTag :color="formattedProject.statusMeta.color" size="md" shape="full">
                <Icon :name="formattedProject.statusMeta.icon" class="ml-2 size-4" />
                وضعیت: {{ formattedProject.statusMeta.label }}
              </BaseTag>
              <BaseTag color="muted" size="md" shape="full">
                <Icon :name="formattedProject.projectTypeMeta.icon" class="ml-2 size-4" />
                {{ formattedProject.projectTypeMeta.label }}
              </BaseTag>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid gap-6 lg:grid-cols-2">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6">
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white mb-4">
              حوزه‌ها و کلیدواژه‌ها
            </BaseHeading>
            <div class="space-y-4">
              <div>
                <p class="text-muted-500 text-sm mb-2">حوزه‌های دانشی</p>
                <div v-if="formattedProject.researchDomain.length" class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="domain in formattedProject.researchDomain"
                    :key="domain"
                    color="primary"
                    size="sm"
                    shape="full"
                  >
                    {{ domain }}
                  </BaseTag>
                </div>
                <BaseParagraph v-else size="xs" class="text-muted-400">
                  حوزه‌ای ثبت نشده است.
                </BaseParagraph>
              </div>

              <div>
                <p class="text-muted-500 text-sm mb-2">کلیدواژه‌ها</p>
                <div v-if="formattedProject.keywords.length" class="flex flex-wrap gap-2">
                  <BaseTag
                    v-for="keyword in formattedProject.keywords"
                    :key="keyword"
                    color="warning"
                    size="sm"
                    shape="full"
                  >
                    {{ keyword }}
                  </BaseTag>
                </div>
                <BaseParagraph v-else size="xs" class="text-muted-400">
                  کلیدواژه‌ای ثبت نشده است.
                </BaseParagraph>
              </div>
            </div>
          </div>

          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6">
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white mb-4">
              زمان‌بندی و وضعیت
            </BaseHeading>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-muted-500 text-sm">تاریخ ایجاد</div>
                <div class="text-gray-900 dark:text-muted-100 font-medium">
                  {{ formattedProject.created || '---' }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-muted-500 text-sm">آخرین بروزرسانی</div>
                <div class="text-gray-900 dark:text-muted-100 font-medium">
                  {{ formattedProject.updated || '---' }}
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-muted-500 text-sm">تایید کمیته اخلاق</div>
                <div
                  :class="[
                    formattedProject.ethicsApproval ? 'text-success-500' : 'text-muted-500',
                    'font-semibold'
                  ]"
                >
                  {{ formattedProject.ethicsApproval ? 'دارد' : 'ندارد / نامشخص' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Research Goals -->
        <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6">
          <div class="flex items-center justify-between mb-4">
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
              اهداف پژوهش
            </BaseHeading>
            <BaseTag color="success" size="sm" shape="full">
              {{ formattedProject.researchGoals.length }} هدف
            </BaseTag>
          </div>
          <div v-if="formattedProject.researchGoals.length" class="space-y-3">
            <div
              v-for="(goal, index) in formattedProject.researchGoals"
              :key="index"
              class="dark:bg-muted-900/60 border-muted-200 dark:border-muted-700 flex items-start gap-3 rounded-xl border bg-gray-50 p-4"
            >
              <div class="bg-success-500/10 rounded-full p-2">
                <Icon name="ph:check" class="text-success-500 size-4" />
              </div>
              <div class="text-sm text-gray-800 dark:text-muted-100">
                {{ goal }}
              </div>
            </div>
          </div>
          <BaseParagraph v-else size="sm" class="text-muted-500">
            هدفی ثبت نشده است.
          </BaseParagraph>
        </div>

        <!-- Necessity & Importance -->
        <div class="grid gap-6 lg:grid-cols-2">
          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6">
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white mb-4">
              ضرورت تحقیق
            </BaseHeading>
            <BaseParagraph
              v-if="formattedProject.necessity"
              size="sm"
              class="text-muted-700 dark:text-muted-100 leading-relaxed whitespace-pre-line"
            >
              {{ formattedProject.necessity }}
            </BaseParagraph>
            <BaseParagraph v-else size="sm" class="text-muted-500">
              توضیحی ثبت نشده است.
            </BaseParagraph>
          </div>

          <div class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6">
            <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white mb-4">
              اهمیت تحقیق
            </BaseHeading>
            <BaseParagraph
              v-if="formattedProject.importance"
              size="sm"
              class="text-muted-700 dark:text-muted-100 leading-relaxed whitespace-pre-line"
            >
              {{ formattedProject.importance }}
            </BaseParagraph>
            <BaseParagraph v-else size="sm" class="text-muted-500">
              توضیحی ثبت نشده است.
            </BaseParagraph>
          </div>
        </div>

        <!-- Brainstorm Results -->
        <div
          v-if="formattedProject.brainstormResults"
          class="dark:bg-muted-800 dark:border-muted-700 rounded-2xl border border-gray-200 bg-white p-6"
        >
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white mb-4">
            نتایج طوفان فکری
          </BaseHeading>
          <div class="dark:bg-muted-900/60 border-muted-200 dark:border-muted-700 rounded-xl border bg-gray-50 p-6">
            <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-100 whitespace-pre-line leading-relaxed">
              {{ formattedProject.brainstormResults }}
            </BaseParagraph>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

