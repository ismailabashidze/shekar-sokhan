<script setup lang="ts">
import { useBugReportApi, type BugReport } from '~/composables/useBugReportApi';

const route = useRoute();
const id = route.params.id as string;
const router = useRouter();
const toaster = useToaster();

definePageMeta({
  title: 'جزئیات گزارش خطا',
  layout: 'sidebar',
});
useHead({ htmlAttrs: { dir: 'rtl' } });

const { getBugReportById, markAsSeen, markAsResolved, markAsUnresolved } = useBugReportApi();
const bugReport = ref<BugReport | null>(null);
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

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR');
};

// Load bug report details
const loadBugReport = async () => {
  isLoading.value = true;
  try {
    const report = await getBugReportById(id);
    bugReport.value = report;

    // Mark as seen automatically when viewed
    if (!report.seen) {
      await markAsSeen(id);
    }
  }
  catch (error) {
    console.error('Error loading bug report:', error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در بارگذاری جزئیات گزارش',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    });
    router.push('/bug-reports');
  }
  finally {
    isLoading.value = false;
  }
};

// Update bug report status
const updateStatus = async (action: 'resolved' | 'unresolved') => {
  try {
    if (action === 'resolved') {
      await markAsResolved(id);
      bugReport.value!.resolved = true;
      toaster.show({
        title: 'موفق',
        message: 'گزارش به عنوان حل شده علامت‌گذاری شد',
        color: 'success',
        icon: 'lucide:check-circle',
        closable: true,
      });
    }
    else {
      await markAsUnresolved(id);
      bugReport.value!.resolved = false;
      toaster.show({
        title: 'موفق',
        message: 'گزارش به عنوان حل نشده علامت‌گذاری شد',
        color: 'success',
        icon: 'lucide:check-circle',
        closable: true,
      });
    }
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

// Load data on component mount
onMounted(() => {
  loadBugReport();
});
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
          جزئیات گزارش خطا
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400">
          مشاهده و بررسی جزئیات گزارش خطا
        </BaseText>
      </div>
      <div>
        <BaseButton
          color="primary"
          icon="ph:arrow-left"
          rounded="lg"
          @click="router.push('/bug-reports')"
        >
          بازگشت به لیست
        </BaseButton>
      </div>
    </div>

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

    <div v-else-if="!bugReport" class="py-8">
      <BasePlaceholderPage
        title="گزارش یافت نشد"
        subtitle="گزارش خطای مورد نظر یافت نشد"
        class="max-w-sm"
      >
        <template #action>
          <BaseButton
            color="primary"
            @click="router.push('/bug-reports')"
          >
            بازگشت به لیست
          </BaseButton>
        </template>
      </BasePlaceholderPage>
    </div>

    <div v-else class="grid grid-cols-12 gap-4">
      <!-- Bug Report Details -->
      <BaseCard class="col-span-12 p-4 sm:p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="bg-danger-500/20 text-danger-500 flex size-12 shrink-0 items-center justify-center rounded-full font-sans text-xl"
            >
              <Icon name="ph:bug-duotone" class="size-6" />
            </div>
            <div>
              <BaseHeading
                tag="h2"
                size="lg"
                weight="medium"
                class="mb-1"
              >
                {{ bugReport.title }}
              </BaseHeading>
              <div class="flex flex-wrap items-center gap-2">
                <BaseBadge
                  :color="priorityColors[bugReport.priority as keyof typeof priorityColors]"
                  variant="subtle"
                  rounded="full"
                >
                  {{ bugReport.priority === 'critical' ? 'بحرانی' :
                    bugReport.priority === 'high' ? 'بالا' :
                    bugReport.priority === 'medium' ? 'متوسط' : 'پایین' }}
                </BaseBadge>
                <BaseBadge
                  color="info"
                  variant="subtle"
                  rounded="full"
                >
                  {{ categoryLabels[bugReport.category as keyof typeof categoryLabels] }}
                </BaseBadge>
                <BaseBadge
                  :color="bugReport.resolved ? 'success' : 'warning'"
                  variant="subtle"
                  rounded="full"
                >
                  {{ bugReport.resolved ? 'حل شده' : 'در انتظار بررسی' }}
                </BaseBadge>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <BaseButton
              v-if="!bugReport.resolved"
              color="success"
              rounded="lg"
              @click="updateStatus('resolved')"
            >
              <Icon name="ph:check-circle" class="me-1 size-4" />
              علامت‌گذاری به عنوان حل شده
            </BaseButton>
            <BaseButton
              v-else
              color="warning"
              rounded="lg"
              @click="updateStatus('unresolved')"
            >
              <Icon name="ph:x-circle" class="me-1 size-4" />
              علامت‌گذاری به عنوان حل نشده
            </BaseButton>
          </div>
        </div>

        <div class="mb-6 grid grid-cols-12 gap-4">
          <div class="col-span-12 sm:col-span-6">
            <BaseCard class="dark:bg-muted-800 p-3">
              <div class="flex items-center gap-2">
                <Icon name="ph:calendar" class="text-muted-400 size-5" />
                <BaseText size="sm" class="text-muted-400">
                  تاریخ ثبت:
                </BaseText>
                <BaseText>{{ bugReport.created ? formatDate(bugReport.created) : '-' }}</BaseText>
              </div>
            </BaseCard>
          </div>
          <div class="col-span-12 sm:col-span-6">
            <BaseCard class="dark:bg-muted-800 p-3">
              <div class="flex items-center gap-2">
                <Icon name="ph:user" class="text-muted-400 size-5" />
                <BaseText size="sm" class="text-muted-400">
                  گزارش‌دهنده:
                </BaseText>
                <BaseText>{{ bugReport.user ? bugReport.user : 'کاربر ناشناس' }}</BaseText>
              </div>
            </BaseCard>
          </div>
        </div>

        <div class="mb-6">
          <BaseHeading
            tag="h3"
            size="md"
            weight="medium"
            class="mb-2"
          >
            توضیح مختصر
          </BaseHeading>
          <BaseCard class="dark:bg-muted-800 p-4">
            <BaseText>{{ bugReport.shortDesc }}</BaseText>
          </BaseCard>
        </div>

        <div>
          <BaseHeading
            tag="h3"
            size="md"
            weight="medium"
            class="mb-2"
          >
            توضیح کامل
          </BaseHeading>
          <BaseCard class="dark:bg-muted-800 p-4">
            <BaseText class="whitespace-pre-line">
              {{ bugReport.longDesc }}
            </BaseText>
          </BaseCard>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
