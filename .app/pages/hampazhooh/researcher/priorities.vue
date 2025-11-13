<script setup lang="ts">
  import type { ResearchInterest } from '~/composables/useResearcher';

  definePageMeta({
    title: 'اولویت‌های پژوهشی',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const router = useRouter();
  const toaster = useToaster();

  // Use the researcher composable
  const { selectedInterests, updatePriorities, saveResearchProfile, loadResearchData } = useResearcher();

  // Drag and drop state
  const draggedItem = ref<ResearchInterest | null>(null);
  const dragOverIndex = ref<number | null>(null);

  // Group interests by depth
  const groupedInterests = computed(() => {
    const groups: { [key: number]: ResearchInterest[] } = {};
    selectedInterests.value.forEach((interest) => {
      if (!groups[interest.depth]) {
        groups[interest.depth] = [];
      }
      groups[interest.depth].push(interest);
    });

    // Sort each group by priority
    Object.keys(groups).forEach((key) => {
      groups[Number(key)].sort((a, b) => a.priority - b.priority);
    });

    return groups;
  });

  // Generate priority options for each group
  const getPriorityOptions = (groupSize: number) => {
    return Array.from({ length: groupSize }, (_, i) => ({
      value: i + 1,
      label: `اولویت ${i + 1}${i === 0 ? ' (بالاترین)' : i === groupSize - 1 ? ' (پایین‌ترین)' : ''}`,
    }));
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

  const getDepthLabel = (depth: number) => {
    switch (depth) {
      case 0:
        return 'حوزه‌های اصلی';
      case 1:
        return 'زیرحوزه‌ها';
      case 2:
        return 'علایق جزئی';
      default:
        return `سطح ${depth}`;
    }
  };

  const getDepthDescription = (depth: number) => {
    switch (depth) {
      case 0:
        return 'این حوزه‌های اصلی نشان‌دهنده زمینه‌های کلی پژوهشی شما هستند. اولویت‌بندی آنها به شما کمک می‌کند تا مسیر پژوهشی اصلی خود را مشخص کنید.';
      case 1:
        return 'زیرحوزه‌ها شاخه‌های تخصصی‌تری از حوزه‌های اصلی هستند. تعیین اولویت در این سطح به شما کمک می‌کند تا تمرکز پژوهشی خود را دقیق‌تر کنید.';
      case 2:
        return 'علایق جزئی موضوعات بسیار تخصصی هستند. اولویت‌بندی آنها به شما کمک می‌کند تا موضوعات پژوهشی بسیار دقیق و کاربردی را مشخص کنید.';
      default:
        return '';
    }
  };

  const getDepthIcon = (depth: number) => {
    switch (depth) {
      case 0:
        return 'ph:folder';
      case 1:
        return 'ph:folder-open';
      case 2:
        return 'ph:magnifying-glass';
      default:
        return 'ph:circle';
    }
  };

  const getPriorityColor = (priority: number, total: number) => {
    if (priority === 1) return 'success';
    if (priority === total) return 'muted';
    return 'primary';
  };

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1:
        return 'ph:crown';
      case 2:
        return 'ph:medal';
      case 3:
        return 'ph:star';
      default:
        return 'ph:circle';
    }
  };

  const updatePriority = (interest: ResearchInterest, priority: number) => {
    // Ensure priority is within the valid range for this interest's depth level
    const groupSize = groupedInterests.value[interest.depth]?.length || 1;
    if (priority >= 1 && priority <= groupSize) {
      interest.priority = priority;
      // Re-sort the group after priority change
      groupedInterests.value[interest.depth]?.sort((a, b) => a.priority - b.priority);
    }
  };

  // Drag and drop handlers
  const onDragStart = (event: DragEvent, item: ResearchInterest) => {
    draggedItem.value = item;
    event.dataTransfer!.effectAllowed = 'move';
  };

  const onDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    dragOverIndex.value = index;
  };

  const onDragEnd = () => {
    draggedItem.value = null;
    dragOverIndex.value = null;
  };

  const onDrop = (event: DragEvent, targetIndex: number, depth: number) => {
    event.preventDefault();

    if (!draggedItem.value || draggedItem.value.depth !== depth) return;

    const group = groupedInterests.value[depth];
    const draggedIndex = group.findIndex((item) => item.id === draggedItem.value!.id);

    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    // Reorder the array
    const newGroup = [...group];
    const [removed] = newGroup.splice(draggedIndex, 1);
    newGroup.splice(targetIndex, 0, removed);

    // Update priorities based on new order
    newGroup.forEach((item, index) => {
      item.priority = index + 1;
    });

    // Update the reactive array
    groupedInterests.value[depth] = newGroup;

    draggedItem.value = null;
    dragOverIndex.value = null;
  };

  const savePriorities = async () => {
    try {
      const profile = {
        id: '1',
        name: 'کاربر',
        field: 'عمومی',
        experience: 'تجربه کاربر',
        interests: selectedInterests.value,
        priorities: selectedInterests.value,
      };

      await saveResearchProfile(profile);

      toaster.show({
        title: 'ذخیره شد',
        message: 'اولویت‌های پژوهشی شما بروزرسانی شد.',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      });
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

  const navigateBack = () => {
    router.push('/hampazhooh/researcher');
  };

  // Mock data for testing different levels
  const mockInterests: ResearchInterest[] = [
    // Level 0 (categories)
    {
      id: 'psychology',
      name: 'روانشناسی',
      description: 'مطالعات علمی رفتار و فرآیندهای روانی انسان',
      level: 'intermediate',
      priority: 1,
      selected: true,
      type: 'category',
      path: ['psychology'],
      depth: 0,
    },
    // Level 1 (subcategories)
    {
      id: 'biological_neuropsychology',
      name: 'روان‌شناسی زیستی و عصب‌روان‌شناسی',
      description: 'مطالعه رابطه بین مغز، سیستم عصبی و رفتار',
      level: 'advanced',
      priority: 1,
      selected: true,
      type: 'subcategory',
      path: ['psychology', 'biological_neuropsychology'],
      depth: 1,
    },
    {
      id: 'cognitive_psychology',
      name: 'روان‌شناسی شناختی',
      description: 'مطالعه فرآیندهای ذهنی مانند تفکر، یادگیری و حافظه',
      level: 'expert',
      priority: 2,
      selected: true,
      type: 'subcategory',
      path: ['psychology', 'cognitive_psychology'],
      depth: 1,
    },
    // Level 2 (detailed interests)
    {
      id: 'neuroendocrinology',
      name: 'نورواندوکرینولوژی',
      description: 'مطالعه رابطه بین سیستم عصبی و هورمونی',
      level: 'intermediate',
      priority: 1,
      selected: true,
      type: 'interest',
      path: ['psychology', 'biological_neuropsychology', 'neuroendocrinology'],
      depth: 2,
    },
    {
      id: 'attention',
      name: 'توجه',
      description: 'مطالعه مکانیسم‌های توجه و تمرکز',
      level: 'advanced',
      priority: 2,
      selected: true,
      type: 'interest',
      path: ['psychology', 'cognitive_psychology', 'attention'],
      depth: 2,
    },
    {
      id: 'perception',
      name: 'ادراک',
      description: 'مطالعه نحوه پردازش اطلاعات حسی',
      level: 'intermediate',
      priority: 3,
      selected: true,
      type: 'interest',
      path: ['psychology', 'cognitive_psychology', 'perception'],
      depth: 2,
    },
  ];

  // Initialize data on component mount
  onMounted(() => {
    loadResearchData();
    // If no selected interests, use mock data for testing
    if (selectedInterests.value.length === 0) {
      selectedInterests.value = mockInterests;
    }
  });
</script>

<template>
  <div class="min-h-screen bg-muted-100 dark:bg-muted-900">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="mb-4 flex items-center justify-between">
          <BaseButton size="sm" shape="curved" @click="navigateBack">
            <Icon name="ph:arrow-right" class="size-4" />
            <span>بازگشت به پروفایل</span>
          </BaseButton>
        </div>
        <BaseHeading as="h1" size="3xl" weight="bold">اولویت‌های پژوهشی</BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-2">
          اولویت‌های خود را برای حوزه‌های پژوهشی مورد علاقه تعیین کنید
        </BaseParagraph>
      </div>

      <!-- Priorities List Grouped by Depth -->
      <div v-if="selectedInterests.length > 0" class="space-y-8">
        <div v-for="(interests, depth) in groupedInterests" :key="depth" class="space-y-6">
          <!-- Level Header with Description -->
          <div class="relative overflow-hidden">
            <div
              class="flex items-center gap-4 p-6 bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 dark:from-primary-950 dark:via-primary-900 dark:to-primary-950 rounded-xl border border-primary-200 dark:border-primary-800 shadow-lg"
            >
              <div class="flex-shrink-0">
                <div class="size-12 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                  <Icon :name="getDepthIcon(Number(depth))" class="size-6 text-white" />
                </div>
              </div>
              <div class="flex-1">
                <BaseHeading as="h3" size="xl" weight="bold" class="text-primary-800 dark:text-primary-200 mb-1">
                  {{ getDepthLabel(Number(depth)) }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-primary-700 dark:text-primary-300 mb-2">
                  {{ getDepthDescription(Number(depth)) }}
                </BaseParagraph>
                <div class="flex items-center gap-4">
                  <BaseTag color="primary" shape="curved" size="sm" class="font-medium">
                    {{ interests.length }} مورد انتخاب شده
                  </BaseTag>
                  <BaseParagraph size="xs" class="text-primary-600 dark:text-primary-400">
                    اولویت‌ها را با کشیدن و رها کردن یا انتخاب از لیست تعیین کنید
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>

          <!-- Drag and Drop Priority List -->
          <div class="space-y-3">
            <div
              v-for="(interest, index) in interests"
              :key="interest.id"
              class="group relative"
              draggable="true"
              @dragstart="onDragStart($event, interest)"
              @dragover="onDragOver($event, index)"
              @drop="onDrop($event, index, Number(depth))"
              @dragend="onDragEnd"
            >
              <!-- Drop indicator -->
              <div
                v-if="dragOverIndex === index && draggedItem?.id !== interest.id"
                class="absolute -top-2 left-0 right-0 h-1 bg-primary-500 rounded-full z-10 animate-pulse"
              />

              <!-- Interest Card -->
              <BaseCard
                shape="curved"
                class="p-6 transition-all duration-300 cursor-move hover:shadow-xl hover:scale-[1.02] border-2 group-hover:border-primary-300 dark:group-hover:border-primary-600"
                :class="{
                  'border-primary-500 bg-primary-50 dark:bg-primary-950 shadow-lg': draggedItem?.id === interest.id,
                  'border-muted-200 dark:border-muted-700': draggedItem?.id !== interest.id,
                }"
              >
                <div class="flex items-start gap-4">
                  <!-- Priority Badge -->
                  <div class="flex-shrink-0">
                    <div
                      class="size-10 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all duration-300"
                      :class="{
                        'bg-success-500': interest.priority === 1,
                        'bg-warning-500': interest.priority === 2,
                        'bg-primary-500': interest.priority === 3,
                        'bg-muted-500': interest.priority > 3,
                      }"
                    >
                      <Icon v-if="interest.priority <= 3" :name="getPriorityIcon(interest.priority)" class="size-5" />
                      <span v-else>{{ interest.priority }}</span>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1 min-w-0">
                        <BaseHeading as="h4" size="md" weight="medium" class="mb-1 line-clamp-1">
                          {{ interest.name }}
                        </BaseHeading>
                        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 line-clamp-2">
                          {{ interest.description }}
                        </BaseParagraph>
                      </div>
                      <BaseTag
                        :color="getLevelColor(interest.level)"
                        shape="curved"
                        size="sm"
                        class="ml-3 flex-shrink-0"
                      >
                        {{ getLevelLabel(interest.level) }}
                      </BaseTag>
                    </div>

                    <!-- Priority Selector -->
                    <div class="flex items-center gap-3">
                      <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 font-medium">
                        تغییر اولویت:
                      </BaseParagraph>
                      <BaseListbox
                        :model-value="interest.priority"
                        :items="getPriorityOptions(interests.length)"
                        placeholder="انتخاب اولویت"
                        shape="curved"
                        size="sm"
                        class="w-48"
                        @update:model-value="updatePriority(interest, $event)"
                      />
                    </div>
                  </div>

                  <!-- Drag Handle -->
                  <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Icon name="ph:dots-six-vertical" class="size-5 text-muted-400 cursor-move" />
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>

          <!-- Level Summary -->
          <BaseCard class="p-4 bg-muted-50 dark:bg-muted-800 border-muted-200 dark:border-muted-700">
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                <Icon name="ph:info" class="size-4 inline ml-2" />
                اولویت‌ها در این سطح به صورت مستقل تعیین می‌شوند و بر سطوح دیگر تأثیر نمی‌گذارند.
              </BaseParagraph>
              <BaseTag color="success" shape="curved" size="sm">اولویت‌ها تنظیم شد</BaseTag>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Icon name="ph:folder-open" class="mx-auto mb-6 size-16 text-muted-400" />
        <BaseHeading as="h3" size="lg" weight="medium" class="mb-4">هیچ علاقه‌ای انتخاب نشده</BaseHeading>
        <BaseParagraph class="text-muted-600 dark:text-muted-400 mb-6">
          برای تعیین اولویت‌ها ابتدا باید علایق پژوهشی خود را انتخاب کنید.
        </BaseParagraph>
        <BaseButton color="primary" shape="curved" @click="router.push('/hampazhooh/researcher/interests')">
          <Icon name="ph:plus" class="size-4" />
          انتخاب علایق پژوهشی
        </BaseButton>
      </div>

      <!-- Save Button -->
      <div v-if="selectedInterests.length > 0" class="mt-6 flex justify-center">
        <BaseButton color="primary" shape="curved" @click="savePriorities">
          <Icon name="ph:floppy-disk" class="size-4 ml-2" />
          ذخیره اولویت‌ها
        </BaseButton>
      </div>
    </div>
  </div>
</template>
