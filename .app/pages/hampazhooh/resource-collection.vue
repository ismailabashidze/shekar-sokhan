<script setup lang="ts">
definePageMeta({
	title: "جمع‌آوری منابع علمی",
	layout: "sidebar",
});

useHead({ htmlAttrs: { dir: "rtl" } });

const router = useRouter();
const toaster = useToaster();

// Collection stages
interface CollectionStage {
	id: string;
	title: string;
	description: string;
	icon: string;
	status: "pending" | "in-progress" | "completed" | "error";
	progress: number;
	details?: string[];
}

const collectionStages = ref<CollectionStage[]>([
	{
		id: "1",
		title: "استخراج کلمات کلیدی",
		description: "تحلیل متن و شناسایی مفاهیم اصلی",
		icon: "ph:key",
		status: "pending",
		progress: 0,
		details: [
			"تحلیل متن ورودی",
			"شناسایی اصطلاحات تخصصی",
			"استخراج مفاهیم کلیدی",
		],
	},
	{
		id: "2",
		title: "جستجوی منابع علمی",
		description: "پیدا کردن مقالات و کتاب‌های مرتبط",
		icon: "ph:magnifying-glass",
		status: "pending",
		progress: 0,
		details: [
			"جستجو در پایگاه‌های علمی",
			"فیلتر کردن منابع معتبر",
			"بررسی سال انتشار",
		],
	},
	{
		id: "3",
		title: "تحلیل نظریه‌ها",
		description: "بررسی و تحلیل چارچوب‌های نظری",
		icon: "ph:brain",
		status: "pending",
		progress: 0,
		details: [
			"شناسایی نظریه‌های مرتبط",
			"تحلیل ارتباط بین نظریه‌ها",
			"ارزیابی اعتبار نظریه‌ها",
		],
	},
	{
		id: "4",
		title: "دسته‌بندی منابع",
		description: "گروه‌بندی مقالات بر اساس موضوع",
		icon: "ph:folders",
		status: "pending",
		progress: 0,
		details: [
			"طبقه‌بندی بر اساس موضوع",
			"بررسی روش تحقیق",
			"تفکیک منابع کیفی و کمی",
		],
	},
	{
		id: "5",
		title: "استخراج چکیده‌ها",
		description: "خلاصه‌سازی محتوای منابع یافت شده",
		icon: "ph:file-text",
		status: "pending",
		progress: 0,
		details: ["خواندن چکیده مقالات", "استخراج نکات کلیدی", "ترجمه و خلاصه‌سازی"],
	},
	{
		id: "6",
		title: "آماده‌سازی نهایی",
		description: "ایجاد گزارش جامع از منابع جمع‌آوری شده",
		icon: "ph:check-circle",
		status: "pending",
		progress: 0,
		details: ["ایجاد ساختار گزارش", "مرتب‌سازی منابع", "آماده‌سازی برای دانلود"],
	},
]);

const currentStageIndex = ref(0);
const isCollecting = ref(false);
const isCompleted = ref(false);
const overallProgress = ref(0);
const estimatedTime = ref(0);
const startTime = ref<Date | null>(null);

// Fun animations and messages
const funMessages = [
	"در حال جستجوی گنجینه‌های علمی... 📚",
	"کشف مقالات پژوهشی جدید... 🔬",
	"تحلیل نظریه‌های علمی... 🧠",
	"دسته‌بندی منابع ارزشمند... 📁",
	"ایجاد شبکه دانش علمی... 🕸️",
	"نزدیک به اتمام جمع‌آوری... 🎯",
];

const currentMessage = ref(funMessages[0]);

// Calculate overall progress
const updateOverallProgress = () => {
	const totalProgress = collectionStages.value.reduce(
		(sum, stage) => sum + stage.progress,
		0,
	);
	overallProgress.value = Math.round(
		totalProgress / collectionStages.value.length,
	);
};

// Update estimated time
const updateEstimatedTime = () => {
	if (startTime.value && !isCompleted.value) {
		const elapsed = (Date.now() - startTime.value.getTime()) / 1000; // seconds
		const remaining =
			(elapsed / overallProgress.value) * (100 - overallProgress.value);
		estimatedTime.value = Math.round(remaining / 60); // convert to minutes
	}
};

// Simulate the collection process
const startCollection = async () => {
	isCollecting.value = true;
	startTime.value = new Date();

	for (let i = 0; i < collectionStages.value.length; i++) {
		currentStageIndex.value = i;
		const stage = collectionStages.value[i];

		// Update message
		currentMessage.value = funMessages[i % funMessages.length];

		// Set stage to in-progress
		stage.status = "in-progress";

		// Simulate progress for this stage
		const progressSteps = 20;
		for (let j = 0; j <= progressSteps; j++) {
			stage.progress = (j / progressSteps) * 100;
			updateOverallProgress();
			updateEstimatedTime();

			// Add some randomness to make it feel more realistic
			await new Promise((resolve) =>
				setTimeout(resolve, 200 + Math.random() * 300),
			);
		}

		// Mark stage as completed
		stage.status = "completed";
		stage.progress = 100;
		updateOverallProgress();

		// Small delay between stages
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	// Collection completed
	isCollecting.value = false;
	isCompleted.value = true;
	currentMessage.value = "جمع‌آوری منابع با موفقیت انجام شد! 🎉";

	// Show success notification
	toaster.show({
		title: "موفقیت",
		message: "منابع علمی با موفقیت جمع‌آوری شدند. آماده مشاهده هستید!",
		color: "success",
		icon: "ph:check-circle-fill",
		closable: true,
		actions: [
			{
				label: "مشاهده نتایج",
				color: "primary",
				action: () => {
					router.push("/hampazhooh/research-results");
				},
			},
		],
	});
};

// Navigate back
const navigateBack = () => {
	if (isCollecting.value) {
		toaster.show({
			title: "توجه",
			message:
				"فرآیند جمع‌آوری در حال انجام است. با خروج، پیشرفت از بین خواهد رفت.",
			color: "warning",
			icon: "ph:warning-fill",
			closable: true,
			actions: [
				{
					label: "ادامه فرآیند",
					color: "primary",
					action: () => {},
				},
				{
					label: "بازگشت به پروژه‌ها",
					color: "muted",
					action: () => {
						router.push("/hampazhooh/projects");
					},
				},
			],
		});
	} else {
		router.push("/hampazhooh/projects");
	}
};

// Get status color
const getStatusColor = (status: string) => {
	const colors: Record<string, string> = {
		pending: "muted",
		"in-progress": "warning",
		completed: "success",
		error: "danger",
	};
	return colors[status] || "muted";
};

// Get status icon
const getStatusIcon = (status: string) => {
	const icons: Record<string, string> = {
		pending: "ph:circle",
		"in-progress": "ph:spinner-gap",
		completed: "ph:check-circle-fill",
		error: "ph:x-circle-fill",
	};
	return icons[status] || "ph:circle";
};

// Auto-start collection when page loads
onMounted(() => {
	// Start collection after a short delay for dramatic effect
	setTimeout(() => {
		startCollection();
	}, 1000);
});
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <div class="dark:bg-muted-800 dark:border-muted-700 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Back Button -->
            <BaseButton
              color="muted"
              size="sm"
              shape="curved"
              @click="navigateBack"
              :disabled="isCollecting"
            >
              <Icon name="ph:arrow-right" class="ml-1 size-4" />
              بازگشت به پروژه‌ها
            </BaseButton>
            
            <div>
              <BaseHeading
                as="h1"
                size="2xl"
                weight="bold"
                class="text-gray-900 dark:text-white"
              >
                جمع‌آوری منابع علمی
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-400 mt-1">
                استخراج و تحلیل منابع علمی مرتبط با پژوهش شما
              </BaseParagraph>
            </div>
          </div>
          
          <!-- Status Badge -->
          <div class="flex items-center gap-3">
            <BaseTag
              :color="isCompleted ? 'success' : isCollecting ? 'warning' : 'muted'"
              size="md"
              shape="full"
              class="shadow-lg"
            >
              <Icon 
                :name="isCompleted ? 'ph:check-circle-fill' : isCollecting ? 'ph:spinner-gap' : 'ph:clock'" 
                class="ml-2 size-5"
                :class="isCollecting && 'animate-spin'"
              />
              {{ isCompleted ? 'تکمیل شده' : isCollecting ? 'در حال انجام' : 'آماده شروع' }}
            </BaseTag>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl">
        <!-- Progress Overview -->
        <div class="dark:bg-muted-800 dark:border-muted-700 mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div class="p-6">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
                  پیشرفت کلی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 mt-1">
                  {{ currentMessage }}
                </BaseParagraph>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-primary-500">{{ overallProgress }}%</div>
                <div class="text-muted-500 text-sm">
                  {{ isCompleted ? 'تکمیل شده' : estimatedTime > 0 ? `حدود ${estimatedTime} دقیقه باقی مانده` : 'در حال برآورد...' }}
                </div>
              </div>
            </div>
            
            <!-- Overall Progress Bar -->
            <div class="relative">
              <BaseProgressbar
                :value="overallProgress"
                color="primary"
                size="lg"
                shape="full"
                class="mb-2"
              />
              <div class="text-muted-500 flex justify-between text-xs">
                <span>شروع فرآیند</span>
                <span>جمع‌آوری منابع علمی</span>
                <span>تکمیل</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Collection Stages -->
        <div class="space-y-4">
          <div
            v-for="(stage, index) in collectionStages"
            :key="stage.id"
            class="dark:bg-muted-800 dark:border-muted-700 group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300"
            :class="{
              'ring-2 ring-primary-500 ring-opacity-50 shadow-lg': index === currentStageIndex && isCollecting,
              'opacity-50': index > currentStageIndex && !isCollecting,
              'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20': stage.status === 'completed'
            }"
          >
            <div class="p-6">
              <div class="flex items-start gap-4">
                <!-- Stage Icon & Status -->
                <div class="flex-shrink-0">
                  <div
                    class="flex size-12 items-center justify-center rounded-xl transition-all duration-300"
                    :class="{
                      'bg-primary-100 dark:bg-primary-900/30': stage.status === 'in-progress',
                      'bg-success-100 dark:bg-success-900/30': stage.status === 'completed',
                      'bg-muted-100 dark:bg-muted-700': stage.status === 'pending',
                      'bg-danger-100 dark:bg-danger-900/30': stage.status === 'error'
                    }"
                  >
                    <Icon
                      :name="stage.status === 'in-progress' ? getStatusIcon(stage.status) : stage.icon"
                      class="size-6 transition-all duration-300"
                      :class="{
                        'text-primary-500 animate-spin': stage.status === 'in-progress',
                        'text-success-500': stage.status === 'completed',
                        'text-muted-400': stage.status === 'pending',
                        'text-danger-500': stage.status === 'error'
                      }"
                    />
                  </div>
                </div>

                <!-- Stage Content -->
                <div class="flex-1">
                  <div class="mb-2 flex items-center justify-between">
                    <div>
                      <BaseHeading
                        as="h4"
                        size="md"
                        weight="semibold"
                        class="text-gray-900 dark:text-white"
                        :class="{ 'text-primary-500': stage.status === 'in-progress' }"
                      >
                        {{ stage.title }}
                      </BaseHeading>
                      <BaseParagraph size="sm" class="text-muted-500">
                        {{ stage.description }}
                      </BaseParagraph>
                    </div>
                    
                    <!-- Stage Status Badge -->
                    <BaseTag
                      :color="getStatusColor(stage.status)"
                      size="sm"
                      shape="full"
                    >
                      <Icon :name="getStatusIcon(stage.status)" class="ml-1 size-3" />
                      {{ stage.status === 'pending' ? 'در انتظار' : stage.status === 'in-progress' ? 'در حال انجام' : stage.status === 'completed' ? 'تکمیل شده' : 'خطا' }}
                    </BaseTag>
                  </div>

                  <!-- Stage Progress -->
                  <div v-if="stage.status !== 'pending'" class="mb-3">
                    <div class="mb-1 flex items-center justify-between">
                      <span class="text-muted-600 dark:text-muted-400 text-xs">پیشرفت مرحله</span>
                      <span class="text-primary-500 text-xs font-semibold">{{ Math.round(stage.progress) }}%</span>
                    </div>
                    <BaseProgressbar
                      :value="stage.progress"
                      :color="stage.status === 'error' ? 'danger' : stage.status === 'completed' ? 'success' : 'primary'"
                      size="sm"
                      shape="full"
                    />
                  </div>

                  <!-- Stage Details -->
                  <div v-if="stage.details && (stage.status === 'in-progress' || stage.status === 'completed')" class="mt-3">
                    <div class="dark:bg-muted-700/50 rounded-lg bg-gray-50 p-3">
                      <div class="text-muted-600 dark:text-muted-400 text-xs font-medium mb-2">جزئیات:</div>
                      <div class="space-y-1">
                        <div
                          v-for="(detail, detailIndex) in stage.details"
                          :key="detailIndex"
                          class="text-muted-500 dark:text-muted-400 flex items-center gap-2 text-xs"
                        >
                          <Icon
                            :name="stage.status === 'completed' || (stage.status === 'in-progress' && detailIndex < Math.floor((stage.progress / 100) * stage.details.length)) ? 'ph:check-circle-fill' : 'ph:circle'"
                            class="size-3"
                            :class="{
                              'text-success-500': stage.status === 'completed' || (stage.status === 'in-progress' && detailIndex < Math.floor((stage.progress / 100) * stage.details.length)),
                              'text-muted-300': !(stage.status === 'completed' || (stage.status === 'in-progress' && detailIndex < Math.floor((stage.progress / 100) * stage.details.length)))
                            }"
                          />
                          {{ detail }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Animated Border for Active Stage -->
            <div
              v-if="index === currentStageIndex && isCollecting"
              class="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 opacity-10 animate-pulse"
            />
          </div>
        </div>

        <!-- Completion Section -->
        <div v-if="isCompleted" class="mt-8">
          <div class="dark:bg-muted-800 dark:border-muted-700 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div class="bg-gradient-to-r from-success-500 to-emerald-500 p-6 text-white">
              <div class="flex items-center gap-4">
                <div class="bg-white/20 flex size-16 items-center justify-center rounded-full">
                  <Icon name="ph:check-circle-fill" class="size-8" />
                </div>
                <div>
                  <BaseHeading as="h3" size="xl" weight="bold" class="text-white">
                    جمع‌آوری منابع با موفقیت انجام شد!
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-white/90 mt-1">
                    {{ collectionStages.length }} مرحله با موفقیت تکمیل شد. آماده مشاهده نتایج هستید.
                  </BaseParagraph>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="flex flex-col gap-4 sm:flex-row">
                <BaseButton
                  color="primary"
                  size="lg"
                  shape="curved"
                  class="flex-1 shadow-primary-500/30 shadow-lg"
                  @click="router.push('/hampazhooh/research-results')"
                >
                  <Icon name="ph:eye" class="ml-2 size-5" />
                  مشاهده نتایج
                </BaseButton>
                
                <BaseButton
                  color="muted"
                  size="lg"
                  shape="curved"
                  @click="router.push('/hampazhooh/projects')"
                >
                  <Icon name="ph:arrow-right" class="ml-2 size-5" />
                  بازگشت به پروژه‌ها
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Fun Loading Animation -->
        <div v-if="isCollecting && !isCompleted" class="mt-8 text-center">
          <div class="inline-flex items-center gap-2 text-muted-500">
            <div class="flex gap-1">
              <div class="bg-primary-500 h-2 w-2 animate-bounce rounded-full" style="animation-delay: 0ms"></div>
              <div class="bg-primary-500 h-2 w-2 animate-bounce rounded-full" style="animation-delay: 150ms"></div>
              <div class="bg-primary-500 h-2 w-2 animate-bounce rounded-full" style="animation-delay: 300ms"></div>
            </div>
            <span class="text-sm">در حال پردازش هوشمند منابع علمی...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>