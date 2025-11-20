<script setup lang="ts">
definePageMeta({
	title: "همدل - تحلیل عملیاتی",
	layout: "sidebar",
});

// Mock data for operational analytics
const therapistPerformanceDetails = ref([
	{
		id: 1,
		name: "دکتر احمدی",
		avatar: "DA",
		score: 92.5,
		totalSessions: 156,
		averageSessionDuration: 47,
		patientSatisfaction: 9.2,
		responseTime: 1.8,
		positiveBehaviors: ["همدلی فعال", "گوش دادن فعال", "بازخورد سازنده"],
		improvementAreas: ["مدیریت زمان", "پایان جلسه"],
		monthlyTrend: [88, 90, 89, 92, 91, 93, 92.5],
		patientDemographics: {
			ageGroups: { "18-24": 23, "25-34": 45, "35-44": 38, "45+": 50 },
			genders: { male: 78, female: 78 },
			riskLevels: { high: 8, medium: 34, low: 114 },
		},
	},
	{
		id: 2,
		name: "دکتر محمدی",
		avatar: "DM",
		score: 88.3,
		totalSessions: 142,
		averageSessionDuration: 43,
		patientSatisfaction: 8.7,
		responseTime: 2.1,
		positiveBehaviors: ["سوالات باز", "تکنیک‌های شناختی", "ایمن‌سازی"],
		improvementAreas: ["همدلی عمیق", "تنظیم هیجان"],
		monthlyTrend: [85, 87, 86, 88, 89, 87, 88.3],
		patientDemographics: {
			ageGroups: { "18-24": 31, "25-34": 42, "35-44": 35, "45+": 34 },
			genders: { male: 68, female: 74 },
			riskLevels: { high: 12, medium: 28, low: 102 },
		},
	},
	{
		id: 3,
		name: "دکتر رضایی",
		avatar: "DR",
		score: 85.7,
		totalSessions: 128,
		averageSessionDuration: 51,
		patientSatisfaction: 8.1,
		responseTime: 2.4,
		positiveBehaviors: ["تحلیل عمیق", "شناسایی الگوها"],
		improvementAreas: ["سرعت پاسخ", "زبان ساده‌تر"],
		monthlyTrend: [87, 86, 84, 85, 83, 86, 85.7],
		patientDemographics: {
			ageGroups: { "18-24": 18, "25-34": 38, "35-44": 32, "45+": 40 },
			genders: { male: 62, female: 66 },
			riskLevels: { high: 15, medium: 31, low: 82 },
		},
	},
]);

const userJourneyAnalysis = ref([
	{
		userId: 1234,
		userName: "علی رضایی",
		age: 28,
		gender: "male",
		registrationDate: "۲۰۲۴/۰۳/۱۵",
		totalSessions: 12,
		totalDuration: 540,
		averageSessionDuration: 45,
		riskProgression: [
			{ session: 1, riskLevel: "medium", score: 65 },
			{ session: 3, riskLevel: "low", score: 78 },
			{ session: 6, riskLevel: "low", score: 82 },
			{ session: 9, riskLevel: "low", score: 85 },
			{ session: 12, riskLevel: "low", score: 88 },
		],
		emotionalProgression: [
			{ session: 1, primary: "اضطراب", intensity: 8 },
			{ session: 3, primary: "اضطراب", intensity: 6 },
			{ session: 6, primary: "امید", intensity: 7 },
			{ session: 9, primary: "امید", intensity: 8 },
			{ session: 12, primary: "امید", intensity: 9 },
		],
		detectedSchemas: ["بی‌اعتمادی/سوءظن", "نقص/شرم"],
		defenseMechanisms: ["انکار", "فرافکنی"],
		currentStatus: "improving",
		lastSessionDate: "۲۰۲۴/۱۱/۱۰",
	},
	{
		userId: 5678,
		userName: "سارا محمدی",
		age: 34,
		gender: "female",
		registrationDate: "۲۰۲۴/۰۴/۲۰",
		totalSessions: 8,
		totalDuration: 360,
		averageSessionDuration: 45,
		riskProgression: [
			{ session: 1, riskLevel: "high", score: 35 },
			{ session: 3, riskLevel: "medium", score: 55 },
			{ session: 5, riskLevel: "medium", score: 62 },
			{ session: 8, riskLevel: "low", score: 72 },
		],
		emotionalProgression: [
			{ session: 1, primary: "افسردگی", intensity: 9 },
			{ session: 3, primary: "افسردگی", intensity: 7 },
			{ session: 5, primary: "اضطراب", intensity: 6 },
			{ session: 8, primary: "امید", intensity: 7 },
		],
		detectedSchemas: ["رهاشدگی/بی‌ثباتی", "وابستگی/ناتوانی"],
		defenseMechanisms: ["درون‌فکنی", "جابجایی"],
		currentStatus: "improving",
		lastSessionDate: "۲۰۲۴/۱۱/۰۸",
	},
]);

const resourceUtilization = ref({
	sessionStatistics: {
		totalSessions: 1247,
		averageDuration: 45.3,
		peakHours: ["۱۹:۰۰-۲۱:۰۰", "۱۰:۰۰-۱۲:۰۰"],
		peakDays: ["دوشنبه", "چهارشنبه"],
		completionRate: 87.3,
		averageMessagesPerSession: 18.5,
	},
	aiUsagePatterns: {
		totalAnalyses: 8934,
		averageResponseTime: 1.2,
		successRate: 98.7,
		peakUsage: ["۱۹:۰۰-۲۳:۰۰"],
		analysisTypes: {
			emotional: 4567,
			risk: 2341,
			behavioral: 1234,
			schema: 792,
		},
	},
	systemLoad: {
		cpuUsage: 67.3,
		memoryUsage: 72.8,
		databaseConnections: 145,
		apiRequests: 234567,
		storageUsed: 78.9,
	},
});

const outcomeCorrelations = ref([
	{
		demographic: "سن ۱۸-۲۴",
		averageImprovement: 23.5,
		averageSessions: 14,
		commonIssues: ["اضطراب اجتماعی", "بحران هویت"],
		successRate: 82.3,
		preferredTechniques: ["درمان شناختی-رفتاری", "درمان ذهن‌آگاهی"],
	},
	{
		demographic: "سن ۲۵-۳۴",
		averageImprovement: 28.7,
		averageSessions: 12,
		commonIssues: ["اضطراب", "افسردگی", "استرس شغلی"],
		successRate: 87.1,
		preferredTechniques: ["درمان پذیرش و تعهد", "درمان شناختی-رفتاری"],
	},
	{
		demographic: "سن ۳۵-۴۴",
		averageImprovement: 25.2,
		averageSessions: 16,
		commonIssues: ["افسردگی", "بحران میانسالی", "مسائل زناشویی"],
		successRate: 79.8,
		preferredTechniques: ["درمان روان‌پویشی", "درمان شناختی-رفتاری"],
	},
	{
		demographic: "سن ۴۵+",
		averageImprovement: 21.8,
		averageSessions: 18,
		commonIssues: ["افسردگی", "تنهایی", "بیماری‌های مزمن"],
		successRate: 76.5,
		preferredTechniques: ["درمان پذیرش و تعهد", "درمان ذهن‌آگاهی"],
	},
]);

// Computed properties
const getStatusColor = (status: string) => {
	switch (status) {
		case "improving":
			return "success";
		case "stable":
			return "info";
		case "declining":
			return "danger";
		default:
			return "muted";
	}
};

const getStatusText = (status: string) => {
	switch (status) {
		case "improving":
			return "در حال بهبودی";
		case "stable":
			return "پایدار";
		case "declining":
			return "در حال کاهش";
		default:
			return "نامشخص";
	}
};

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
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-muted-800 dark:text-white">
          تحلیل عملیاتی
        </h1>
        <p class="text-muted-500 dark:text-muted-400">
          تحلیل عملکرد درمانگران و سفر درمانی کاربران
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton color="primary" shape="curved">
          <Icon name="ph:download-duotone" class="ml-2 size-4" />
          export گزارش
        </BaseButton>
        <BaseButton color="muted" shape="curved">
          <Icon name="ph:funnel-duotone" class="ml-2 size-4" />
          فیلتر پیشرفته
        </BaseButton>
      </div>
    </div>

    <!-- Therapist Performance Details -->
    <BaseCard class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          جزئیات عملکرد درمانگران
        </h3>
        <BaseButton color="muted" size="sm" shape="curved">
          مشاهده همه درمانگران
        </BaseButton>
      </div>

      <div class="space-y-6">
        <div
          v-for="therapist in therapistPerformanceDetails"
          :key="therapist.id"
          class="border-muted-200 dark:border-muted-700 rounded-lg border p-6"
        >
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Therapist Info & Score -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <BaseAvatar size="lg" :text="therapist.avatar" class="bg-primary-500 text-white" />
                <div>
                  <h4 class="text-lg font-semibold">{{ therapist.name }}</h4>
                  <p class="text-muted-500 text-sm">کد درمانگر: {{ therapist.id }}</p>
                </div>
              </div>
              
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-500">{{ therapist.score }}</div>
                <p class="text-muted-500 text-sm">امتیاز کلی</p>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-500">جلسات کامل:</span>
                  <span class="font-medium">{{ therapist.totalSessions }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">میانگین مدت:</span>
                  <span class="font-medium">{{ therapist.averageSessionDuration }} دقیقه</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">رضایت مراجع:</span>
                  <span class="font-medium">{{ therapist.patientSatisfaction }}/10</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">زمان پاسخ:</span>
                  <span class="font-medium">{{ therapist.responseTime }} ثانیه</span>
                </div>
              </div>
            </div>

            <!-- Performance Trend -->
            <div class="space-y-4">
              <h5 class="font-medium">روند عملکرد ۷ ماه اخیر</h5>
              <div class="flex items-end gap-1 h-24">
                <div
                  v-for="(score, index) in therapist.monthlyTrend"
                  :key="index"
                  class="bg-primary-500 w-full rounded-t transition-all hover:bg-primary-600"
                  :style="{ height: `${(score / 100) * 100}%` }"
                  :title="`ماه ${index + 1}: ${score}`"
                />
              </div>
              <div class="mt-2 text-xs text-muted-500 text-center">
                ۷ ماه گذشته
              </div>
            </div>

            <!-- Patient Demographics -->
            <div class="space-y-4">
              <h5 class="font-medium">دموگرافیک مراجعان</h5>
              
              <!-- Age Groups -->
              <div>
                <p class="text-muted-500 text-sm mb-2">گروه‌های سنی:</p>
                <div class="space-y-1">
                  <div
                    v-for="(count, ageGroup) in therapist.patientDemographics.ageGroups"
                    :key="ageGroup"
                    class="flex items-center justify-between text-sm"
                  >
                    <span>{{ ageGroup }}:</span>
                    <span class="font-medium">{{ count }} نفر</span>
                  </div>
                </div>
              </div>

              <!-- Genders -->
              <div>
                <p class="text-muted-500 text-sm mb-2">جنسیت:</p>
                <div class="flex gap-4 text-sm">
                  <span>مرد: {{ therapist.patientDemographics.genders.male }}</span>
                  <span>زن: {{ therapist.patientDemographics.genders.female }}</span>
                </div>
              </div>

              <!-- Risk Levels -->
              <div>
                <p class="text-muted-500 text-sm mb-2">سطوح ریسک:</p>
                <div class="space-y-1">
                  <div
                    v-for="(count, riskLevel) in therapist.patientDemographics.riskLevels"
                    :key="riskLevel"
                    class="flex items-center justify-between text-sm"
                  >
                    <span class="flex items-center gap-1">
                      <div
                        :class="`w-2 h-2 rounded-full bg-${getRiskColor(riskLevel)}-500`"
                      />
                      {{ riskLevel === 'high' ? 'بالا' : riskLevel === 'medium' ? 'متوسط' : 'پایین' }}:
                    </span>
                    <span class="font-medium">{{ count }} نفر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Positive Behaviors & Improvement Areas -->
          <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h5 class="mb-2 font-medium text-success-600">رفتارهای مثبت</h5>
              <div class="space-y-1">
                <div
                  v-for="behavior in therapist.positiveBehaviors"
                  :key="behavior"
                  class="bg-success-500/10 text-success-700 dark:text-success-300 rounded-lg px-3 py-2 text-sm"
                >
                  ✓ {{ behavior }}
                </div>
              </div>
            </div>
            <div>
              <h5 class="mb-2 font-medium text-warning-600">نواحی نیاز به بهبود</h5>
              <div class="space-y-1">
                <div
                  v-for="area in therapist.improvementAreas"
                  :key="area"
                  class="bg-warning-500/10 text-warning-700 dark:text-warning-300 rounded-lg px-3 py-2 text-sm"
                >
                  → {{ area }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- User Journey Analysis -->
    <BaseCard class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          تحلیل سفر درمانی کاربران
        </h3>
        <BaseButton color="muted" size="sm" shape="curved">
          مشاهده همه کاربران
        </BaseButton>
      </div>

      <div class="space-y-6">
        <div
          v-for="user in userJourneyAnalysis"
          :key="user.userId"
          class="border-muted-200 dark:border-muted-700 rounded-lg border p-6"
        >
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- User Info & Summary -->
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <BaseAvatar size="lg" :text="user.userName.substring(0, 2)" class="bg-info-500 text-white" />
                <div>
                  <h4 class="text-lg font-semibold">{{ user.userName }}</h4>
                  <p class="text-muted-500 text-sm">کد کاربر: {{ user.userId }}</p>
                </div>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-500">سن:</span>
                  <span class="font-medium">{{ user.age }} سال</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">جنسیت:</span>
                  <span class="font-medium">{{ user.gender === 'male' ? 'مرد' : 'زن' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">تاریخ عضویت:</span>
                  <span class="font-medium">{{ user.registrationDate }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">جلسات:</span>
                  <span class="font-medium">{{ user.totalSessions }} جلسه</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">مدت کل:</span>
                  <span class="font-medium">{{ user.totalDuration }} دقیقه</span>
                </div>
              </div>

              <div class="text-center">
                <div
                  :class="`bg-${getStatusColor(user.currentStatus)}-500/10 text-${getStatusColor(user.currentStatus)}-500 rounded-lg px-3 py-2 text-sm font-medium`"
                >
                  {{ getStatusText(user.currentStatus) }}
                </div>
              </div>
            </div>

            <!-- Progress Charts -->
            <div class="space-y-4">
              <h5 class="font-medium">پیشرفت سطح ریسک</h5>
              <div class="space-y-2">
                <div
                  v-for="point in user.riskProgression"
                  :key="point.session"
                  class="flex items-center gap-3"
                >
                  <span class="text-muted-500 text-sm w-12">جلسه {{ point.session }}:</span>
                  <div class="flex-1">
                    <div class="bg-muted-200 dark:bg-muted-700 h-2 rounded-full overflow-hidden">
                      <div
                        :class="`h-full rounded-full ${
                          point.score >= 80 ? 'bg-success-500' :
                          point.score >= 60 ? 'bg-warning-500' :
                          'bg-danger-500'
                        }`"
                        :style="{ width: `${point.score}%` }"
                      />
                    </div>
                  </div>
                  <span class="text-sm font-medium w-12">{{ point.score }}</span>
                </div>
              </div>

              <h5 class="mt-4 font-medium">پیشرفت هیجانی</h5>
              <div class="space-y-2">
                <div
                  v-for="point in user.emotionalProgression"
                  :key="point.session"
                  class="flex items-center gap-3"
                >
                  <span class="text-muted-500 text-sm w-12">جلسه {{ point.session }}:</span>
                  <span class="text-sm font-medium">{{ point.primary }}</span>
                  <div class="flex-1">
                    <div class="bg-muted-200 dark:bg-muted-700 h-2 rounded-full overflow-hidden">
                      <div
                        class="bg-primary-500 h-full rounded-full"
                        :style="{ width: `${(point.intensity / 10) * 100}%` }"
                      />
                    </div>
                  </div>
                  <span class="text-sm font-medium w-8">{{ point.intensity }}/10</span>
                </div>
              </div>
            </div>

            <!-- Psychological Analysis -->
            <div class="space-y-4">
              <h5 class="font-medium">تحلیل روانشناختی</h5>
              
              <div>
                <p class="text-muted-500 text-sm mb-2">طرحواره‌های شناسایی شده:</p>
                <div class="space-y-1">
                  <div
                    v-for="schema in user.detectedSchemas"
                    :key="schema"
                    class="bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {{ schema }}
                  </div>
                </div>
              </div>

              <div>
                <p class="text-muted-500 text-sm mb-2">مکانیزم‌های دفاعی:</p>
                <div class="space-y-1">
                  <div
                    v-for="mechanism in user.defenseMechanisms"
                    :key="mechanism"
                    class="bg-orange-500/10 text-orange-700 dark:text-orange-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {{ mechanism }}
                  </div>
                </div>
              </div>

              <div class="text-sm text-muted-500">
                آخرین جلسه: {{ user.lastSessionDate }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Resource Utilization & Outcome Correlations -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Resource Utilization -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            استفاده از منابع
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:activity-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="space-y-6">
          <!-- Session Statistics -->
          <div>
            <h5 class="mb-3 font-medium">آمار جلسات</h5>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-3">
                <p class="text-muted-500 text-sm">کل جلسات</p>
                <p class="text-lg font-bold">{{ resourceUtilization.sessionStatistics.totalSessions }}</p>
              </div>
              <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-3">
                <p class="text-muted-500 text-sm">میانگین مدت</p>
                <p class="text-lg font-bold">{{ resourceUtilization.sessionStatistics.averageDuration }} دقیقه</p>
              </div>
              <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-3">
                <p class="text-muted-500 text-sm">نرخ تکمیل</p>
                <p class="text-lg font-bold">{{ resourceUtilization.sessionStatistics.completionRate }}%</p>
              </div>
              <div class="bg-muted-50 dark:bg-muted-800 rounded-lg p-3">
                <p class="text-muted-500 text-sm">میانگین پیام</p>
                <p class="text-lg font-bold">{{ resourceUtilization.sessionStatistics.averageMessagesPerSession }}</p>
              </div>
            </div>
          </div>

          <!-- AI Usage Patterns -->
          <div>
            <h5 class="mb-3 font-medium">الگوهای استفاده هوش مصنوعی</h5>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted-500">کل تحلیل‌ها:</span>
                <span class="font-medium">{{ resourceUtilization.aiUsagePatterns.totalAnalyses.toLocaleString('fa-IR') }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-500">زمان پاسخ:</span>
                <span class="font-medium">{{ resourceUtilization.aiUsagePatterns.averageResponseTime }} ثانیه</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-500">نرخ موفقیت:</span>
                <span class="font-medium">{{ resourceUtilization.aiUsagePatterns.successRate }}%</span>
              </div>
            </div>
          </div>

          <!-- System Load -->
          <div>
            <h5 class="mb-3 font-medium">بار سیستم</h5>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted-500">استفاده CPU:</span>
                <span class="font-medium">{{ resourceUtilization.systemLoad.cpuUsage }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-500">استفاده حافظه:</span>
                <span class="font-medium">{{ resourceUtilization.systemLoad.memoryUsage }}%</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-500">درخواست‌های API:</span>
                <span class="font-medium">{{ resourceUtilization.systemLoad.apiRequests.toLocaleString('fa-IR') }}</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Outcome Correlations -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            همبستگی نتایج درمانی
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:chart-line-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="correlation in outcomeCorrelations"
            :key="correlation.demographic"
            class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
          >
            <div class="mb-3 flex items-center justify-between">
              <h5 class="font-medium">{{ correlation.demographic }}</h5>
              <div class="bg-success-500/20 text-success-600 dark:text-success-400 rounded px-2 py-1 text-sm">
                {{ correlation.successRate }}% موفقیت
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-muted-500">بهبودی میانگین:</span>
                <span class="font-medium">{{ correlation.averageImprovement }}%</span>
              </div>
              <div>
                <span class="text-muted-500">جلسات میانگین:</span>
                <span class="font-medium">{{ correlation.averageSessions }}</span>
              </div>
            </div>

            <div class="mt-3">
              <p class="text-muted-500 text-sm mb-1">مسائل رایج:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="issue in correlation.commonIssues"
                  :key="issue"
                  class="bg-muted-100 dark:bg-muted-700 rounded px-2 py-1 text-xs"
                >
                  {{ issue }}
                </span>
              </div>
            </div>

            <div class="mt-2">
              <p class="text-muted-500 text-sm mb-1">تکنیک‌های ترجیحی:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="technique in correlation.preferredTechniques"
                  :key="technique"
                  class="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded px-2 py-1 text-xs"
                >
                  {{ technique }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>