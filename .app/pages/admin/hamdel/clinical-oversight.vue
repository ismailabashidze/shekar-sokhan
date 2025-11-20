<script setup lang="ts">
definePageMeta({
	title: "همدل - نظارت بالینی",
	layout: "sidebar",
});

// Mock data for clinical oversight
const riskHeatmap = ref([
	{
		age: "۱۸-۲۴",
		male: { high: 12, medium: 34, low: 89 },
		female: { high: 18, medium: 42, low: 76 },
	},
	{
		age: "۲۵-۳۴",
		male: { high: 8, medium: 28, low: 94 },
		female: { high: 15, medium: 38, low: 82 },
	},
	{
		age: "۳۵-۴۴",
		male: { high: 5, medium: 22, low: 78 },
		female: { high: 11, medium: 31, low: 69 },
	},
	{
		age: "۴۵-۵۴",
		male: { high: 3, medium: 18, low: 65 },
		female: { high: 7, medium: 25, low: 58 },
	},
	{
		age: "۵۵+",
		male: { high: 2, medium: 12, low: 43 },
		female: { high: 4, medium: 18, low: 37 },
	},
]);

const emotionalPatterns = ref([
	{
		emotion: "اضطراب",
		frequency: 342,
		trend: "up",
		percentage: 28.5,
		color: "warning",
	},
	{
		emotion: "افسردگی",
		frequency: 287,
		trend: "stable",
		percentage: 23.9,
		color: "info",
	},
	{
		emotion: "خشم",
		frequency: 198,
		trend: "down",
		percentage: 16.5,
		color: "danger",
	},
	{
		emotion: "ترس",
		frequency: 176,
		trend: "up",
		percentage: 14.6,
		color: "muted",
	},
	{
		emotion: "امید",
		frequency: 134,
		trend: "up",
		percentage: 11.2,
		color: "success",
	},
	{
		emotion: "شرم",
		frequency: 87,
		trend: "stable",
		percentage: 7.2,
		color: "purple",
	},
]);

const defenseMechanisms = ref([
	{
		name: "انکار",
		frequency: 234,
		percentage: 32.1,
		effectiveness: "low",
		description: "نپذیرفتن واقعیت‌های ناخوشایند",
	},
	{
		name: "فرافکنی",
		frequency: 187,
		percentage: 25.7,
		effectiveness: "medium",
		description: "نسبت دادن احساسات به دیگران",
	},
	{
		name: "درون‌فکنی",
		frequency: 156,
		percentage: 21.4,
		effectiveness: "high",
		description: "برگشت به رفتارهای کودکانه",
	},
	{
		name: "جابجایی",
		frequency: 98,
		percentage: 13.5,
		effectiveness: "medium",
		description: "منتقل کردن هیجان از هدف اصلی",
	},
	{
		name: "واکنش‌سازی",
		frequency: 52,
		percentage: 7.1,
		effectiveness: "low",
		description: "رفتار مخالف احساسات درونی",
	},
]);

const detectedSchemas = ref([
	{
		name: "رهاشدگی/بی‌ثباتی",
		count: 89,
		severity: "high",
		commonAge: "۲۵-۳۴",
		description: "ترس از دست دادن نزدیکان",
	},
	{
		name: "بی‌اعتمادی/سوءظن",
		count: 76,
		severity: "medium",
		commonAge: "۳۵-۴۴",
		description: "انتظار سوءرفتار از دیگران",
	},
	{
		name: "نقص/شرم",
		count: 68,
		severity: "high",
		commonAge: "۱۸-۲۴",
		description: "احساس شرمندگی و بی‌ارزشی",
	},
	{
		name: "وابستگی/ناتوانی",
		count: 54,
		severity: "medium",
		commonAge: "۲۵-۳۴",
		description: "احساس ناتوانی در تصمیم‌گیری",
	},
	{
		name: "انزوا/انقطاع",
		count: 43,
		severity: "high",
		commonAge: "۴۵-۵۴",
		description: "احساس تنهایی و جدایی",
	},
]);

const interventionEffectiveness = ref([
	{
		technique: "درمان شناختی-رفتاری",
		successRate: 87.3,
		usageCount: 456,
		averageSessions: 12,
		patientSatisfaction: 8.7,
	},
	{
		technique: "درمان پذیرش و تعهد",
		successRate: 82.1,
		usageCount: 234,
		averageSessions: 16,
		patientSatisfaction: 8.9,
	},
	{
		technique: "درمان ذهن‌آگاهی",
		successRate: 79.8,
		usageCount: 189,
		averageSessions: 8,
		patientSatisfaction: 9.1,
	},
	{
		technique: "درمان روان‌پویشی",
		successRate: 76.5,
		usageCount: 145,
		averageSessions: 24,
		patientSatisfaction: 7.8,
	},
]);

const flaggedSessions = ref([
	{
		id: 1,
		userId: 1234,
		userName: "علی رضایی",
		therapistId: 2,
		therapistName: "دکتر احمدی",
		riskLevel: "high",
		reason: "افکار خودکشی با برنامه مشخص",
		time: "۲ ساعت پیش",
		status: "intervention_required",
		duration: 45,
		messageCount: 23,
	},
	{
		id: 2,
		userId: 5678,
		userName: "سارا محمدی",
		therapistId: 3,
		therapistName: "دکتر رضایی",
		riskLevel: "medium",
		reason: "نشانه‌های افسردگی شدید",
		time: "۴ ساعت پیش",
		status: "under_review",
		duration: 38,
		messageCount: 18,
	},
	{
		id: 3,
		userId: 9012,
		userName: "مریم حسینی",
		therapistId: 1,
		therapistName: "دکتر محمدی",
		riskLevel: "high",
		reason: "مکانیزم‌های دفاعی ناکارآمد",
		time: "۶ ساعت پیش",
		status: "monitoring",
		duration: 52,
		messageCount: 31,
	},
]);

// Computed properties
const getRiskColor = (level: string) => {
	switch (level) {
		case "high":
			return "danger";
		case "medium":
			return "warning";
		default:
			return "success";
	}
};

const getTrendIcon = (trend: string) => {
	switch (trend) {
		case "up":
			return "ph:trend-up-duotone";
		case "down":
			return "ph:trend-down-duotone";
		default:
			return "ph:minus-duotone";
	}
};

const getEffectivenessColor = (effectiveness: string) => {
	switch (effectiveness) {
		case "high":
			return "success";
		case "medium":
			return "warning";
		default:
			return "danger";
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "intervention_required":
			return "danger";
		case "under_review":
			return "warning";
		case "monitoring":
			return "info";
		default:
			return "muted";
	}
};

const getStatusText = (status: string) => {
	switch (status) {
		case "intervention_required":
			return "نیاز به مداخله";
		case "under_review":
			return "در حال بررسی";
		case "monitoring":
			return "تحت نظر";
		default:
			return "نامشخص";
	}
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-muted-800 dark:text-white">
          نظارت بالینی
        </h1>
        <p class="text-muted-500 dark:text-muted-400">
          تحلیل الگوهای روانشناختی و نظارت بر کیفیت درمان
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton color="primary" shape="curved">
          <Icon name="ph:download-duotone" class="ml-2 size-4" />
          export تحلیل
        </BaseButton>
        <BaseButton color="warning" shape="curved">
          <Icon name="ph:warning-duotone" class="ml-2 size-4" />
          جلسات پرخطر
        </BaseButton>
      </div>
    </div>

    <!-- Risk Heatmap & Emotional Patterns -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Risk Heatmap by Demographics -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            نقشه حرارتی ریسک بر اساس دموگرافیک
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:info-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-muted-200 dark:border-muted-700">
                <th class="pb-3 text-right font-medium">محدوده سنی</th>
                <th class="pb-3 text-center font-medium">مردان (خطر)</th>
                <th class="pb-3 text-center font-medium">مردان (متوسط)</th>
                <th class="pb-3 text-center font-medium">مردان (پایین)</th>
                <th class="pb-3 text-center font-medium">زنان (خطر)</th>
                <th class="pb-3 text-center font-medium">زنان (متوسط)</th>
                <th class="pb-3 text-center font-medium">زنان (پایین)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in riskHeatmap"
                :key="row.age"
                class="border-b border-muted-100 dark:border-muted-800"
              >
                <td class="py-3 font-medium">{{ row.age }}</td>
                <td class="py-3 text-center">
                  <span class="bg-danger-500/20 text-danger-600 dark:text-danger-400 rounded px-2 py-1">
                    {{ row.male.high }}
                  </span>
                </td>
                <td class="py-3 text-center">
                  <span class="bg-warning-500/20 text-warning-600 dark:text-warning-400 rounded px-2 py-1">
                    {{ row.male.medium }}
                  </span>
                </td>
                <td class="py-3 text-center">
                  <span class="bg-success-500/20 text-success-600 dark:text-success-400 rounded px-2 py-1">
                    {{ row.male.low }}
                  </span>
                </td>
                <td class="py-3 text-center">
                  <span class="bg-danger-500/20 text-danger-600 dark:text-danger-400 rounded px-2 py-1">
                    {{ row.female.high }}
                  </span>
                </td>
                <td class="py-3 text-center">
                  <span class="bg-warning-500/20 text-warning-600 dark:text-warning-400 rounded px-2 py-1">
                    {{ row.female.medium }}
                  </span>
                </td>
                <td class="py-3 text-center">
                  <span class="bg-success-500/20 text-success-600 dark:text-success-400 rounded px-2 py-1">
                    {{ row.female.low }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- Emotional Patterns -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            الگوهای هیجانی رایج
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:chart-line-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="space-y-3">
          <div
            v-for="emotion in emotionalPatterns"
            :key="emotion.emotion"
            class="flex items-center gap-3"
          >
            <div class="flex-1">
              <div class="mb-1 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ emotion.emotion }}</span>
                  <Icon
                    :name="getTrendIcon(emotion.trend)"
                    :class="`size-4 text-${emotion.color}-500`"
                  />
                </div>
                <span class="text-muted-500 text-sm">{{ emotion.frequency }} مورد</span>
              </div>
              <div class="bg-muted-200 dark:bg-muted-700 h-2 rounded-full overflow-hidden">
                <div
                  :class="`bg-${emotion.color}-500 h-full rounded-full transition-all duration-500`"
                  :style="{ width: `${emotion.percentage}%` }"
                />
              </div>
            </div>
            <span class="text-muted-500 text-sm w-12 text-left">
              {{ emotion.percentage }}%
            </span>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Defense Mechanisms & Schemas -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Defense Mechanisms -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            مکانیزم‌های دفاعی شناسایی شده
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:shield-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="mechanism in defenseMechanisms"
            :key="mechanism.name"
            class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
          >
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ mechanism.name }}</span>
                <div
                  :class="`bg-${getEffectivenessColor(mechanism.effectiveness)}-500/10 text-${getEffectivenessColor(mechanism.effectiveness)}-500 rounded px-2 py-1 text-xs`"
                >
                  {{ mechanism.effectiveness }}
                </div>
              </div>
              <span class="text-muted-500 text-sm">{{ mechanism.frequency }} مورد</span>
            </div>
            <p class="text-muted-600 dark:text-muted-400 text-sm">
              {{ mechanism.description }}
            </p>
            <div class="mt-2">
              <div class="bg-muted-200 dark:bg-muted-700 h-1.5 rounded-full overflow-hidden">
                <div
                  class="bg-primary-500 h-full rounded-full transition-all duration-500"
                  :style="{ width: `${mechanism.percentage}%` }"
                />
              </div>
              <span class="text-muted-500 mt-1 text-xs">{{ mechanism.percentage }}%</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Detected Schemas -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            طرحواره‌های شناسایی شده
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:tree-structure-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="schema in detectedSchemas"
            :key="schema.name"
            class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
          >
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ schema.name }}</span>
                <div
                  :class="`bg-${getRiskColor(schema.severity)}-500/10 text-${getRiskColor(schema.severity)}-500 rounded px-2 py-1 text-xs`"
                >
                  {{ schema.severity }}
                </div>
              </div>
              <span class="text-muted-500 text-sm">{{ schema.count }} مورد</span>
            </div>
            <p class="text-muted-600 dark:text-muted-400 text-sm mb-2">
              {{ schema.description }}
            </p>
            <div class="flex items-center gap-4 text-xs text-muted-500">
              <span>سن رایج: {{ schema.commonAge }}</span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Intervention Effectiveness -->
    <BaseCard class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          اثربخشی تکنیک‌های درمانی
        </h3>
        <BaseButton color="muted" size="sm" shape="curved">
          <Icon name="ph:chart-bar-horizontal-duotone" class="size-4" />
        </BaseButton>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-muted-200 dark:border-muted-700">
              <th class="pb-3 text-right font-medium">تکنیک درمانی</th>
              <th class="pb-3 text-center font-medium">نرخ موفقیت</th>
              <th class="pb-3 text-center font-medium">تعداد استفاده</th>
              <th class="pb-3 text-center font-medium">میانگین جلسات</th>
              <th class="pb-3 text-center font-medium">رضایت مراجع</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="technique in interventionEffectiveness"
              :key="technique.technique"
              class="border-b border-muted-100 dark:border-muted-800"
            >
              <td class="py-4 font-medium">{{ technique.technique }}</td>
              <td class="py-4 text-center">
                <span class="bg-success-500/20 text-success-600 dark:text-success-400 rounded px-2 py-1">
                  {{ technique.successRate }}%
                </span>
              </td>
              <td class="py-4 text-center">{{ technique.usageCount }}</td>
              <td class="py-4 text-center">{{ technique.averageSessions }}</td>
              <td class="py-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <Icon name="ph:star-fill" class="text-warning-400 size-4" />
                  <span>{{ technique.patientSatisfaction }}/10</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Flagged Sessions for Review -->
    <BaseCard class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          جلسات نیازمند بازبینی
        </h3>
        <BaseButton color="warning" shape="curved">
          <Icon name="ph:eye-duotone" class="ml-2 size-4" />
          مشاهده همه
        </BaseButton>
      </div>

      <div class="space-y-4">
        <div
          v-for="session in flaggedSessions"
          :key="session.id"
          class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 transition-colors hover:bg-muted-50 dark:hover:bg-muted-800"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-4">
              <BaseAvatar size="sm" :text="session.userName.substring(0, 2)" class="bg-primary-500" />
              <div>
                <div class="mb-1 flex items-center gap-2">
                  <span class="font-medium">{{ session.userName }}</span>
                  <div
                    :class="`bg-${getRiskColor(session.riskLevel)}-500/10 text-${getRiskColor(session.riskLevel)}-500 rounded px-2 py-1 text-xs`"
                  >
                    {{ session.riskLevel === 'high' ? 'خطر بالا' : 'خطر متوسط' }}
                  </div>
                  <div
                    :class="`bg-${getStatusColor(session.status)}-500/10 text-${getStatusColor(session.status)}-500 rounded px-2 py-1 text-xs`"
                  >
                    {{ getStatusText(session.status) }}
                  </div>
                </div>
                <p class="text-muted-600 dark:text-muted-400 text-sm mb-2">
                  {{ session.reason }}
                </p>
                <div class="flex items-center gap-4 text-xs text-muted-500">
                  <span>درمانگر: {{ session.therapistName }}</span>
                  <span>مدت: {{ session.duration }} دقیقه</span>
                  <span>{{ session.messageCount }} پیام</span>
                  <span>{{ session.time }}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <BaseButton color="primary" size="sm" shape="curved">
                <Icon name="ph:eye-duotone" class="size-4" />
              </BaseButton>
              <BaseButton color="muted" size="sm" shape="curved">
                <Icon name="ph:note-duotone" class="size-4" />
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>