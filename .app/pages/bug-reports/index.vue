<script setup lang="ts">
import { useBugReportApi, type BugReport } from '~/composables/useBugReportApi';

definePageMeta({
  title: 'لیست گزارش‌های خطا',
  layout: 'sidebar',
});
useHead({ htmlAttrs: { dir: 'rtl' } });

const router = useRouter();
const toaster = useToaster();
const { user } = useUser();

// Check for admin access
onMounted(() => {
  if (!user.value?.meta?.isAdmin) {
    toaster.show({
      title: 'دسترسی محدود',
      message: 'شما به این بخش دسترسی ندارید',
      color: 'danger',
      icon: 'ph:lock-key',
      closable: true,
    });
    router.push('/dashboard');
    return;
  }
  loadBugReports();
});

const { getBugReports, markAsSeen, markAsResolved, markAsUnresolved } = useBugReportApi();
const bugReports = ref<BugReport[]>([]);
const isLoading = ref(true);

// Priority colors
const priorityColors = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'success',
};

// Category labels
const categoryLabels = {
  ui: 'رابط کاربری',
  functionality: 'عملکرد',
  efficiency: 'کارایی',
  security: 'امنیت',
  other: 'سایر',
};

// Load bug reports
const loadBugReports = async () => {
  isLoading.value = true;
  try {
    const response = await getBugReports();
    bugReports.value = response.items;
  }
  catch (error) {
    console.error('Error loading bug reports:', error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در بارگذاری گزارش‌ها',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    });
  }
  finally {
    isLoading.value = false;
  }
};

// Update bug report status
const updateStatus = async (id: string, action: 'seen' | 'resolved' | 'unresolved') => {
  try {
    if (action === 'seen') {
      await markAsSeen(id);
      toaster.show({
        title: 'موفقیت',
        message: 'گزارش به عنوان مشاهده شده علامت‌گذاری شد',
        color: 'success',
        icon: 'lucide:check-circle',
        closable: true,
      });
    }
    else if (action === 'resolved') {
      await markAsResolved(id);
      toaster.show({
        title: 'موفقیت',
        message: 'گزارش به عنوان حل شده علامت‌گذاری شد',
        color: 'success',
        icon: 'lucide:check-circle',
        closable: true,
      });
    }
    else if (action === 'unresolved') {
      await markAsUnresolved(id);
      toaster.show({
        title: 'موفقیت',
        message: 'گزارش به عنوان حل نشده علامت‌گذاری شد',
        color: 'success',
        icon: 'lucide:check-circle',
        closable: true,
      });
    }

    // Refresh the list
    await loadBugReports();
  }
  catch (error) {
    console.error(`Error updating bug report status:`, error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در بروزرسانی وضعیت گزارش',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    });
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR');
};

// Navigate to bug report details
const viewBugReport = (id: string) => {
  router.push(`/bug-reports/${id}`);
};

</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <BaseHeading
          tag="h1"
          size="xl"
          weight="medium"
          class="mb-1"
        >
          لیست گزارش‌های خطا
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400">
          مدیریت و بررسی گزارش‌های خطای سیستم
        </BaseText>
      </div>
      <div>
        <BaseButton
          color="primary"
          icon="ph:plus"
          rounded="lg"
          @click="router.push('/bug-reports/new')"
        >
          گزارش خطای جدید
        </BaseButton>
      </div>
    </div>

    <BaseCard class="p-4 sm:p-6">
      <div v-if="isLoading" class="flex justify-center py-8">
        <BasePlaceholderPage
          title="در حال بارگذاری..."
          subtitle="لطفاً منتظر بمانید"
          class="max-w-sm"
        >
          <template #image>
            <div class="mx-auto flex justify-center">
              <BaseLoading size="lg" />
            </div>
          </template>
        </BasePlaceholderPage>
      </div>

      <div v-else-if="bugReports.length === 0" class="py-8">
        <BasePlaceholderPage
          title="گزارشی یافت نشد"
          subtitle="هنوز هیچ گزارش خطایی ثبت نشده است"
          class="max-w-sm"
        >
          <template #action>
            <BaseButton
              color="primary"
              @click="router.push('/bug-report')"
            >
              ثبت گزارش خطا
            </BaseButton>
          </template>
        </BasePlaceholderPage>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="border-muted-200 dark:border-muted-700 border-b">
                <th class="text-muted-400 whitespace-nowrap px-4 py-3 text-right font-medium">
                  عنوان
                </th>
                <th class="text-muted-400 whitespace-nowrap px-4 py-3 text-right font-medium">
                  اولویت
                </th>
                <th class="text-muted-400 whitespace-nowrap px-4 py-3 text-right font-medium">
                  دسته‌بندی
                </th>
                <th class="text-muted-400 whitespace-nowrap px-4 py-3 text-right font-medium">
                  تاریخ ثبت
                </th>
                <th class="text-muted-400 whitespace-nowrap px-4 py-3 text-right font-medium">
                  وضعیت
                </th>
                <th class="text-muted-400 whitespace-nowrap px-4 py-3 text-right font-medium">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="report in bugReports"
                :key="report.id"
                class="border-muted-200 hover:bg-muted-100 dark:border-muted-700 dark:hover:bg-muted-900 border-b"
                :class="{ 'bg-muted-50 dark:bg-muted-800': !report.seen }"
              >
                <td class="whitespace-nowrap px-4 py-3 font-medium">
                  <div class="flex items-center gap-2">
                    <div
                      v-if="!report.seen"
                      class="bg-primary-500 size-2 rounded-full"
                      title="جدید"
                    />
                    <span>{{ report.title }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <BaseBadge
                    :color="priorityColors[report.priority as keyof typeof priorityColors]"
                    variant="subtle"
                    rounded="full"
                  >
                    {{ report.priority === 'critical' ? 'بحرانی' :
                      report.priority === 'high' ? 'بالا' :
                      report.priority === 'medium' ? 'متوسط' : 'پایین' }}
                  </BaseBadge>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  {{ categoryLabels[report.category as keyof typeof categoryLabels] }}
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  {{ report.created ? formatDate(report.created) : '-' }}
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <BaseBadge
                    :color="report.resolved ? 'success' : 'warning'"
                    variant="subtle"
                    rounded="full"
                  >
                    {{ report.resolved ? 'حل شده' : 'در انتظار بررسی' }}
                  </BaseBadge>
                </td>
                <td class="whitespace-nowrap px-4 py-3">
                  <div class="flex items-center gap-3">
                    <BaseTooltip text="مشاهده جزئیات">
                      <BaseButton
                        color="primary"
                        rounded="full"
                        size="sm"
                        @click="router.push(`/bug-reports/${report.id}`)"
                      >
                        <Icon name="ph:eye" class="size-4" />
                      </BaseButton>
                    </BaseTooltip>

                    <BaseTooltip :text="report.resolved ? 'علامت‌گذاری به عنوان حل نشده' : 'علامت‌گذاری به عنوان حل شده'">
                      <BaseButton
                        :color="report.resolved ? 'warning' : 'success'"
                        rounded="full"
                        size="sm"
                        @click="updateStatus(report.id, report.resolved ? 'unresolved' : 'resolved')"
                      >
                        <Icon :name="report.resolved ? 'ph:arrow-counter-clockwise' : 'ph:check-circle'" class="size-4" />
                      </BaseButton>
                    </BaseTooltip>

                    <BaseTooltip v-if="!report.seen" text="علامت‌گذاری به عنوان مشاهده شده">
                      <BaseButton
                        color="info"
                        rounded="full"
                        size="sm"
                        @click="updateStatus(report.id, 'seen')"
                      >
                        <Icon name="ph:eye-closed" class="size-4" />
                      </BaseButton>
                    </BaseTooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
