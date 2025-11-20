<script setup lang="ts">
definePageMeta({
	title: "همدل - انطباق و ایمنی",
	layout: "sidebar",
});

// Mock data for compliance and safety
const riskIncidents = ref([
	{
		id: 1,
		incidentId: "INC-2024-001",
		userId: 1234,
		userName: "علی رضایی",
		therapistId: 2,
		therapistName: "دکتر احمدی",
		riskLevel: "critical",
		incidentType: "suicidal_ideation_with_plan",
		description:
			"کاربر بیان کرده که برنامه مشخصی برای خودکشی دارد و به ابزار دسترسی دارد",
		detectionTime: "۲۰۲۴/۱۱/۱۵ ۱۴:۳۰",
		responseTime: "۲۰۲۴/۱۱/۱۵ ۱۴:۳۲",
		interventionType: "emergency_protocol",
		interventionDetails: "تماس فوری با خدمات اورژانسی و فعال‌سازی شبکه حمایت",
		status: "resolved",
		resolutionTime: "۲۰۲۴/۱۱/۱۵ ۱۵:۴۵",
		outcome: "user_safe",
		followUpRequired: true,
		followUpDate: "۲۰۲۴/۱۱/۱۶",
		severity: "critical",
		location: "تهران",
		previousIncidents: 0,
		notes: "کاربر تحت نظر قرار گرفت و با خانواده تماس گرفته شد",
	},
	{
		id: 2,
		incidentId: "INC-2024-002",
		userId: 5678,
		userName: "سارا محمدی",
		therapistId: 3,
		therapistName: "دکتر رضایی",
		riskLevel: "high",
		incidentType: "severe_depression_with_hopelessness",
		description:
			"نشانه‌های شدید افسردگی و ناامیدی عمیق با اشاره به بی‌معنایی زندگی",
		detectionTime: "۲۰۲۴/۱۱/۱۴ ۱۰:۱۵",
		responseTime: "۲۰۲۴/۱۱/۱۴ ۱۰:۲۰",
		interventionType: "increased_monitoring",
		interventionDetails: "افزایش تعداد جلسات و ایجاد برنامه ایمنی",
		status: "monitoring",
		resolutionTime: null,
		outcome: "ongoing",
		followUpRequired: true,
		followUpDate: "۲۰۲۴/۱۱/۱۵",
		severity: "high",
		location: "مشهد",
		previousIncidents: 1,
		notes: "کاربر تحت نظر قرار گرفته و جلسه اضافی تنظیم شد",
	},
	{
		id: 3,
		incidentId: "INC-2024-003",
		userId: 9012,
		userName: "مریم حسینی",
		therapistId: 1,
		therapistName: "دکتر محمدی",
		riskLevel: "medium",
		incidentType: "self_harm_behaviors",
		description: "گزارش آسیب به خود بدون قصد خودکشی (بریدن دست)",
		detectionTime: "۲۰۲۴/۱۱/۱۳ ۱۶:۴۵",
		responseTime: "۲۰۲۴/۱۱/۱۳ ۱۶:۵۰",
		interventionType: "safety_planning",
		interventionDetails: "آموزش مهارت‌های مقابله و ایجاد برنامه ایمنی",
		status: "resolved",
		resolutionTime: "۲۰۲۴/۱۱/۱۴ ۰۹:۰۰",
		outcome: "improved_coping",
		followUpRequired: true,
		followUpDate: "۲۰۲۴/۱۱/۱۷",
		severity: "medium",
		location: "اصفهان",
		previousIncidents: 2,
		notes: "کاربر مهارت‌های جدید یاد گرفت و گزارش بهبودی داده است",
	},
]);

const safetyProtocolCompliance = ref([
	{
		protocolId: "PROT-001",
		protocolName: "پروتکل مداخله اورژانسی خودکشی",
		description: "اقدامات فوری برای موارد خطر قریب‌الوقوع خودکشی",
		totalActivations: 23,
		successfulInterventions: 22,
		averageResponseTime: 2.3, // minutes
		complianceRate: 95.7,
		lastUpdated: "۲۰۲۴/۱۰/۰۱",
		requiredSteps: [
			"ارزیابی فوری سطح خطر",
			"بررسی وجود برنامه و ابزار",
			"ایجاد برنامه ایمنی جامع",
			"فعال‌سازی شبکه حمایت",
			"ارجاع به خدمات اورژانسی",
		],
		commonFailures: [
			"تأخیر در تماس با خدمات اورژانسی",
			"مستندسازی ناقص برنامه ایمنی",
		],
	},
	{
		protocolId: "PROT-002",
		protocolName: "پروتکل گزارش آسیب به خود",
		description: "مدیریت موارد آسیب به خود بدون قصد خودکشی",
		totalActivations: 45,
		successfulInterventions: 41,
		averageResponseTime: 5.8,
		complianceRate: 91.1,
		lastUpdated: "۲۰۲۴/۰۹/۱۵",
		requiredSteps: [
			"ارزیابی شدت و تکرار آسیب",
			"شناسایی محرک‌ها",
			"آموزش مهارت‌های جایگزین",
			"ایجاد برنامه مقابله",
			"برنامه‌ریزی پیگیری",
		],
		commonFailures: ["عدم پیگیری کافی", "عدم آموزش مهارت‌های جایگزین"],
	},
	{
		protocolId: "PROT-003",
		protocolName: "پروتکل حفظ حریم خصوصی",
		description: "حفظ اطلاعات شخصی و حریم خصوصی کاربران",
		totalActivations: 1247, // total sessions
		successfulInterventions: 1247,
		averageResponseTime: 0.1,
		complianceRate: 100.0,
		lastUpdated: "۲۰۲۴/۱۱/۰۱",
		requiredSteps: [
			"رمزنگاری داده‌ها",
			"محدودیت دسترسی",
			"حذف اطلاعات شخصی از تحلیل‌ها",
			"اخذ رضایت آگاهانه",
			"شفافیت در استفاده از داده‌ها",
		],
		commonFailures: [],
	},
]);

const auditTrail = ref([
	{
		id: 1,
		timestamp: "۲۰۲۴/۱۱/۱۵ ۱۴:۳۲:۱۵",
		userId: "system",
		action: "risk_incident_detected",
		details: "شناسایی خطر خودکشی برای کاربر 1234",
		severity: "critical",
		ipAddress: "192.168.1.100",
		userAgent: "System Monitor v2.1",
		sessionId: "sess_1234_1415",
		affectedRecords: ["user_1234", "session_5678", "analysis_9012"],
		previousState: "risk_level: medium",
		newState: "risk_level: critical",
		automated: true,
		reviewed: false,
		reviewerId: null,
	},
	{
		id: 2,
		timestamp: "۲۰۲۴/۱۱/۱۵ ۱۴:۳۲:۴۵",
		userId: "therapist_2",
		action: "emergency_protocol_activated",
		details: "فعال‌سازی پروتکل اورژانسی برای کاربر 1234",
		severity: "critical",
		ipAddress: "192.168.1.105",
		userAgent: "Mozilla/5.0 (Therapist Dashboard)",
		sessionId: "sess_1234_1415",
		affectedRecords: ["user_1234", "incident_INC-2024-001"],
		previousState: "protocol: inactive",
		newState: "protocol: active",
		automated: false,
		reviewed: true,
		reviewerId: "admin_1",
	},
	{
		id: 3,
		timestamp: "۲۰۲۴/۱۱/۱۵ ۱۴:۳۵:۲۰",
		userId: "system",
		action: "emergency_services_notified",
		details: "ارسال اعلان به خدمات اورژانسی برای کاربر 1234",
		severity: "critical",
		ipAddress: "192.168.1.100",
		userAgent: "System Monitor v2.1",
		sessionId: "sess_1234_1415",
		affectedRecords: ["incident_INC-2024-001", "emergency_contact_1234"],
		previousState: "notification: pending",
		newState: "notification: sent",
		automated: true,
		reviewed: false,
		reviewerId: null,
	},
]);

const emergencyResponse = ref([
	{
		id: 1,
		incidentId: "INC-2024-001",
		responseTeam: ["مدیر ایمنی", "روانشناس اورژانسی", "تیم پشتیبانی فنی"],
		activationTime: "۲۰۲۴/۱۱/۱۵ ۱۴:۳۲",
		arrivalTime: "۲۰۲۴/۱۱/۱۵ ۱۴:۴۵",
		resolutionTime: "۲۰۲۴/۱۱/۱۵ ۱۵:۴۵",
		responseDuration: 73, // minutes
		actions: [
			"تماس با خدمات اورژانسی محلی",
			"هماهنگی با خانواده کاربر",
			"ایجاد محیط امن فیزیکی و روانی",
			"ارائه حمایت فوری روانشناختی",
			"برنامه‌ریزی برای مراقبت‌های بعدی",
		],
		outcome: "successful_intervention",
		userStatus: "safe_and_stabilized",
		followUpActions: [
			"جلسه روز بعد با درمانگر اصلی",
			"بررسی هفتگی توسط تیم ایمنی",
			"تماس با خانواده پس از ۲۴ ساعت",
		],
		lessonsLearned: [
			"زمان پاسخ مناسب بود",
			"هماهنگی با خانواده مؤثر بود",
			"نیاز به بهبود مستندسازی",
		],
		teamPerformance: {
			coordination: 9.2,
			communication: 8.8,
			effectiveness: 9.5,
			documentation: 7.5,
		},
	},
]);

const complianceMetrics = ref({
	overallCompliance: 94.7,
	incidentResponseRate: 98.3,
	protocolAdherence: 92.1,
	documentationCompleteness: 89.5,
	trainingCompletion: 96.8,
	auditSuccess: 97.2,
	privacyCompliance: 100.0,
	dataSecurityScore: 98.9,
});

// Computed properties
const getSeverityColor = (severity: string) => {
	switch (severity) {
		case "critical":
			return "danger";
		case "high":
			return "warning";
		case "medium":
			return "info";
		default:
			return "muted";
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "resolved":
			return "success";
		case "monitoring":
			return "warning";
		case "ongoing":
			return "info";
		default:
			return "muted";
	}
};

const getStatusText = (status: string) => {
	switch (status) {
		case "resolved":
			return "حل شده";
		case "monitoring":
			return "تحت نظر";
		case "ongoing":
			return "در حال انجام";
		default:
			return "نامشخص";
	}
};

const getOutcomeText = (outcome: string) => {
	switch (outcome) {
		case "user_safe":
			return "کاربر در امنیت";
		case "improved_coping":
			return "بهبود مهارت‌های مقابله";
		case "ongoing":
			return "در حال پیگیری";
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
          انطباق و ایمنی
        </h1>
        <p class="text-muted-500 dark:text-muted-400">
          نظارت بر رعایت پروتکل‌ها و مدیریت حوادث ایمنی
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton color="danger" shape="curved">
          <Icon name="ph:warning-duotone" class="ml-2 size-4" />
          حوادث فعال
        </BaseButton>
        <BaseButton color="primary" shape="curved">
          <Icon name="ph:download-duotone" class="ml-2 size-4" />
          export گزارش
        </BaseButton>
      </div>
    </div>

    <!-- Compliance Metrics Overview -->
    <BaseCard class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          معیارهای انطباق
        </h3>
        <div class="flex items-center gap-2">
          <div class="bg-success-500 h-2 w-2 rounded-full animate-pulse" />
          <span class="text-success-500 text-sm">سیستم مطابق با استانداردها</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div class="text-center">
          <div class="bg-primary-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:shield-check-duotone" class="text-primary-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">انطباق کلی</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ complianceMetrics.overallCompliance }}%
          </p>
        </div>

        <div class="text-center">
          <div class="bg-success-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:timer-duotone" class="text-success-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">نرخ پاسخ به حوادث</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ complianceMetrics.incidentResponseRate }}%
          </p>
        </div>

        <div class="text-center">
          <div class="bg-info-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:clipboard-text-duotone" class="text-info-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">پایبندی به پروتکل</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ complianceMetrics.protocolAdherence }}%
          </p>
        </div>

        <div class="text-center">
          <div class="bg-warning-500/10 mx-auto mb-2 h-16 w-16 rounded-full flex items-center justify-center">
            <Icon name="ph:file-text-duotone" class="text-warning-500 size-6" />
          </div>
          <p class="text-muted-500 text-sm">کامل بودن مستندات</p>
          <p class="text-lg font-bold text-muted-800 dark:text-white">
            {{ complianceMetrics.documentationCompleteness }}%
          </p>
        </div>
      </div>
    </BaseCard>

    <!-- Risk Incidents & Safety Protocols -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Risk Incidents -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            حوادث ریسک اخیر
          </h3>
          <BaseButton color="danger" size="sm" shape="curved">
            مشاهده همه
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="incident in riskIncidents"
            :key="incident.id"
            class="border-muted-200 dark:border-muted-700 rounded-lg border p-4 transition-colors hover:bg-muted-50 dark:hover:bg-muted-800"
          >
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ incident.incidentId }}</span>
                <div
                  :class="`bg-${getSeverityColor(incident.severity)}-500/10 text-${getSeverityColor(incident.severity)}-500 rounded px-2 py-1 text-xs`"
                >
                  {{ incident.severity === 'critical' ? 'بحرانی' : incident.severity === 'high' ? 'خطر بالا' : 'خطر متوسط' }}
                </div>
                <div
                  :class="`bg-${getStatusColor(incident.status)}-500/10 text-${getStatusColor(incident.status)}-500 rounded px-2 py-1 text-xs`"
                >
                  {{ getStatusText(incident.status) }}
                </div>
              </div>
              <span class="text-muted-500 text-xs">{{ incident.detectionTime }}</span>
            </div>

            <div class="mb-2">
              <p class="text-muted-800 dark:text-muted-200 text-sm font-medium">
                {{ incident.userName }} - {{ incident.therapistName }}
              </p>
              <p class="text-muted-600 dark:text-muted-400 text-sm">
                {{ incident.description }}
              </p>
            </div>

            <div class="flex items-center justify-between text-xs text-muted-500">
              <span>نوع مداخله: {{ incident.interventionType }}</span>
              <span>نتیجه: {{ getOutcomeText(incident.outcome) }}</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Safety Protocol Compliance -->
      <BaseCard class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
            انطباق پروتکل‌های ایمنی
          </h3>
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:gear-duotone" class="size-4" />
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div
            v-for="protocol in safetyProtocolCompliance"
            :key="protocol.protocolId"
            class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
          >
            <div class="mb-3 flex items-center justify-between">
              <div>
                <h5 class="font-medium">{{ protocol.protocolName }}</h5>
                <p class="text-muted-500 text-xs">{{ protocol.protocolId }}</p>
              </div>
              <div class="text-left">
                <div class="text-lg font-bold" :class="protocol.complianceRate >= 95 ? 'text-success-500' : protocol.complianceRate >= 85 ? 'text-warning-500' : 'text-danger-500'">
                  {{ protocol.complianceRate }}%
                </div>
                <p class="text-muted-500 text-xs">انطباق</p>
              </div>
            </div>

            <p class="text-muted-600 dark:text-muted-400 text-sm mb-3">
              {{ protocol.description }}
            </p>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-muted-500">تعداد فعال‌سازی:</span>
                <span class="font-medium">{{ protocol.totalActivations }}</span>
              </div>
              <div>
                <span class="text-muted-500">مداخلات موفق:</span>
                <span class="font-medium">{{ protocol.successfulInterventions }}</span>
              </div>
              <div>
                <span class="text-muted-500">زمان پاسخ:</span>
                <span class="font-medium">{{ protocol.averageResponseTime }} دقیقه</span>
              </div>
              <div>
                <span class="text-muted-500">آخرین به‌روزرسانی:</span>
                <span class="font-medium">{{ protocol.lastUpdated }}</span>
              </div>
            </div>

            <div v-if="protocol.commonFailures.length > 0" class="mt-3">
              <p class="text-muted-500 text-sm mb-1">نقاط ضعف رایج:</p>
              <div class="space-y-1">
                <div
                  v-for="failure in protocol.commonFailures"
                  :key="failure"
                  class="bg-danger-500/10 text-danger-600 dark:text-danger-400 rounded px-2 py-1 text-xs"
                >
                  • {{ failure }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Audit Trail -->
    <BaseCard class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          بازرسی سیستمی (Audit Trail)
        </h3>
        <div class="flex gap-2">
          <BaseButton color="muted" size="sm" shape="curved">
            <Icon name="ph:funnel-duotone" class="size-4" />
          </BaseButton>
          <BaseButton color="primary" size="sm" shape="curved">
            <Icon name="ph:download-duotone" class="size-4" />
          </BaseButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-muted-200 dark:border-muted-700">
              <th class="pb-3 text-right font-medium">زمان</th>
              <th class="pb-3 text-right font-medium">کاربر</th>
              <th class="pb-3 text-right font-medium">عملیات</th>
              <th class="pb-3 text-right font-medium">جزئیات</th>
              <th class="pb-3 text-center font-medium">شدت</th>
              <th class="pb-3 text-center font-medium">خودکار</th>
              <th class="pb-3 text-center font-medium">بازبینی</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="audit in auditTrail"
              :key="audit.id"
              class="border-b border-muted-100 dark:border-muted-800 hover:bg-muted-50 dark:hover:bg-muted-800"
            >
              <td class="py-3">{{ audit.timestamp }}</td>
              <td class="py-3 font-medium">{{ audit.userId }}</td>
              <td class="py-3">{{ audit.action }}</td>
              <td class="py-3 max-w-xs truncate">{{ audit.details }}</td>
              <td class="py-3 text-center">
                <div
                  :class="`bg-${getSeverityColor(audit.severity)}-500/10 text-${getSeverityColor(audit.severity)}-500 rounded px-2 py-1 text-xs`"
                >
                  {{ audit.severity }}
                </div>
              </td>
              <td class="py-3 text-center">
                <Icon
                  :name="audit.automated ? 'ph:robot-duotone' : 'ph:user-duotone'"
                  :class="`size-4 ${audit.automated ? 'text-info-500' : 'text-muted-500'}`"
                />
              </td>
              <td class="py-3 text-center">
                <Icon
                  :name="audit.reviewed ? 'ph:check-circle-duotone' : 'ph:clock-duotone'"
                  :class="`size-4 ${audit.reviewed ? 'text-success-500' : 'text-warning-500'}`"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Emergency Response Details -->
    <BaseCard class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-muted-800 dark:text-white">
          جزئیات پاسخ به موارد اورژانسی
        </h3>
        <BaseButton color="muted" size="sm" shape="curved">
          مشاهده همه موارد
        </BaseButton>
      </div>

      <div class="space-y-6">
        <div
          v-for="response in emergencyResponse"
          :key="response.id"
          class="border-muted-200 dark:border-muted-700 rounded-lg border p-6"
        >
          <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h5 class="mb-2 font-medium">اطلاعات پاسخ</h5>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-500">شناسه حادثه:</span>
                  <span class="font-medium">{{ response.incidentId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">زمان فعال‌سازی:</span>
                  <span class="font-medium">{{ response.activationTime }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">مدت پاسخ:</span>
                  <span class="font-medium">{{ response.responseDuration }} دقیقه</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-500">نتیجه:</span>
                  <span class="font-medium text-success-600">{{ response.userStatus.replace('_', ' ') }}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 class="mb-2 font-medium">تیم پاسخ</h5>
              <div class="space-y-1">
                <div
                  v-for="member in response.responseTeam"
                  :key="member"
                  class="bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded px-2 py-1 text-sm"
                >
                  {{ member }}
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h5 class="mb-2 font-medium">اقدامات انجام شده</h5>
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div
                v-for="action in response.actions"
                :key="action"
                class="bg-success-500/10 text-success-700 dark:text-success-300 rounded-lg px-3 py-2 text-sm"
              >
                ✓ {{ action }}
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h5 class="mb-2 font-medium">ارزیابی عملکرد تیم</h5>
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="(score, metric) in response.teamPerformance"
                :key="metric"
                class="flex items-center gap-2"
              >
                <span class="text-muted-500 text-sm">{{ metric }}:</span>
                <div class="flex-1">
                  <div class="bg-muted-200 dark:bg-muted-700 h-2 rounded-full overflow-hidden">
                    <div
                      class="bg-primary-500 h-full rounded-full"
                      :style="{ width: `${score * 10}%` }"
                    />
                  </div>
                </div>
                <span class="font-medium">{{ score }}/10</span>
              </div>
            </div>
          </div>

          <div>
            <h5 class="mb-2 font-medium">نکات آموخته</h5>
            <div class="space-y-1">
              <div
                v-for="lesson in response.lessonsLearned"
                :key="lesson"
                class="bg-info-500/10 text-info-700 dark:text-info-300 rounded-lg px-3 py-2 text-sm"
              >
                • {{ lesson }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>