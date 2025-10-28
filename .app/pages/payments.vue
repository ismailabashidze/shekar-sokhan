<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PaymentStatus } from '~/composables/payment';

definePageMeta({
  title: 'پرداختی ها',
  layout: 'sidebar',
});
useHead({ htmlAttrs: { dir: 'rtl' } });

const { user, role } = useUser();
const route = useRoute();
const router = useRouter();
const nuxtApp = useNuxtApp();
const { getPayments } = usePayment();

// Check if user is admin
const isAdmin = computed(() => role.value === 'admin');

// Get target user ID from query params or use current user
const targetUserId = computed(() => {
  const queryUserId = Array.isArray(route.query.userId)
    ? route.query.userId[0]
    : route.query.userId;

  return queryUserId || nuxtApp.$pb.authStore.model?.id;
});

// States
const isLoading = ref(false);
const error = ref<string | null>(null);
const payments = ref<Array<any>>([]);

// Pagination
const page = computed(() => parseInt((route.query.page as string) ?? '1'));
const perPage = ref(10);
const totalItems = ref(0);

// Filters
const filter = ref('');
const statusFilter = ref<PaymentStatus | 'all'>('all');

// Fetch payments
const fetchPayments = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Check if user is trying to access another user's payments without admin rights
    const queryUserId = Array.isArray(route.query.userId)
      ? route.query.userId[0]
      : route.query.userId;

    if (queryUserId && !isAdmin.value) {
      // Non-admin trying to access another user's payments - redirect to their own payments
      router.push('/payments');
      return;
    }

    const filterObj: any = {};

    // Apply status filter if not 'all'
    if (statusFilter.value !== 'all') {
      filterObj.status = statusFilter.value;
    }

    // Apply user filter for admin
    if (isAdmin.value && route.query.userId) {
      filterObj.userId = targetUserId.value;
    }

    const result = await getPayments(filterObj);
    payments.value = result;
    totalItems.value = result.length;
  }
  catch (err: any) {
    console.error('Error fetching payments:', err);
    error.value = 'خطا در دریافت لیست پرداختی‌ها. لطفاً دوباره تلاش کنید.';
    payments.value = [];
  }
  finally {
    isLoading.value = false;
  }
};

// Filter payments locally
const filteredPayments = computed(() => {
  return payments.value
    .filter((payment) => {
      if (statusFilter.value !== 'all' && payment.status !== statusFilter.value) {
        return false;
      }
      if (filter.value && !payment.description?.toLowerCase().includes(filter.value.toLowerCase())) {
        return false;
      }
      return true;
    });
});

// Paginated payments
const paginatedPayments = computed(() => {
  const start = (page.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredPayments.value.slice(start, end);
});

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price);
};

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fa-IR');
};

// Get status badge class
const getStatusBadgeClass = (status: PaymentStatus) => {
  const classes = {
    success: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-100',
    pending: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-100',
    failed: 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-100',
    refunded: 'bg-info-100 text-info-800 dark:bg-info-900/20 dark:text-info-100',
    cancelled: 'bg-muted-100 text-muted-800 dark:bg-muted-900/20 dark:text-muted-100',
  };
  return classes[status] || 'bg-muted-100 text-muted-800';
};

// Get status icon
const getStatusIcon = (status: PaymentStatus) => {
  const icons = {
    success: 'ph:check-circle-duotone',
    pending: 'ph:clock-duotone',
    failed: 'ph:x-circle-duotone',
    refunded: 'ph:arrows-counter-clockwise-duotone',
    cancelled: 'ph:prohibit-duotone',
  };
  return icons[status] || 'ph:warning-duotone';
};

// Get status text in Persian
const getStatusText = (status: PaymentStatus) => {
  const texts = {
    success: 'موفق',
    pending: 'در انتظار',
    failed: 'ناموفق',
    refunded: 'مسترد شده',
    cancelled: 'لغو شده',
  };
  return texts[status] || status;
};
// Reset filters
const resetFilters = () => {
  filter.value = '';
  statusFilter.value = 'all';
  router.push({
    query: {
      ...route.query,
      page: '1',
    },
  });
};

// Handle page change
const onPageChange = (newPage: number) => {
  router.push({
    query: {
      ...route.query,
      page: newPage.toString(),
    },
  });
};

// Watch for filter changes
watch([filter, statusFilter], () => {
  router.push({
    query: {
      ...route.query,
      page: '1',
    },
  });
});

// Watch for route query changes to refresh data
watch([() => route.query.userId, () => route.query.page], () => {
  fetchPayments();
}, { immediate: true });

// Initial fetch
onMounted(() => {
  fetchPayments();
});
</script>

<template>
  <div class="py-6">
    <div class="container-fluid">
      <!-- Header -->
      <div class="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-muted-800 text-2xl font-bold dark:text-white">
            تاریخچه پرداختی ها
          </h1>
          <p class="text-muted-400 mt-1">
            مدیریت و مشاهده پرداختی های شما
          </p>
        </div>
      </div>

      <!-- User context if admin -->
      <div v-if="isAdmin && route.query.userId" class="mb-4">
        <BaseCard class="border-primary-500 border p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="ph:info-duotone" class="text-primary-500 size-5" />
              <span class="text-primary-600 font-medium">در حال مشاهده پرداخت‌های کاربر دیگر</span>
            </div>
            <BaseButton
              color="muted"
              size="sm"
              to="/payments"
            >
              <Icon name="ph:arrow-left-duotone" class="me-1 size-4" />
              بازگشت به پرداخت‌های خود
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Filters -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative">
            <BaseInput
              v-model="filter"
              icon="ph:magnifying-glass-duotone"
              placeholder="جستجو در توضیحات..."
              class="w-64"
            />
          </div>
          <div class="relative">
            <BaseSelect v-model="statusFilter" class="w-40">
              <option value="all">
                همه وضعیت‌ها
              </option>
              <option value="success">
                موفق
              </option>
              <option value="pending">
                در انتظار
              </option>
              <option value="failed">
                ناموفق
              </option>
              <option value="refunded">
                مسترد شده
              </option>
              <option value="cancelled">
                لغو شده
              </option>
            </BaseSelect>
          </div>
          <BaseButton
            color="muted"
            flavor="pastel"
            @click="resetFilters"
          >
            <Icon name="ph:x-duotone" class="size-4" />
            <span>حذف فیلترها</span>
          </BaseButton>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-muted-200 dark:bg-muted-800 h-16 animate-pulse rounded-lg"
        />
      </div>

      <!-- Error State -->
      <BaseCard v-else-if="error" class="bg-danger-50 dark:bg-danger-900/20">
        <div class="flex flex-col items-center justify-center p-6 text-center">
          <Icon name="ph:warning-circle-duotone" class="text-danger-500 mb-3 size-12" />
          <h3 class="text-danger-800 dark:text-danger-100 mb-2 text-lg font-medium">
            خطا در دریافت اطلاعات
          </h3>
          <p class="text-danger-700 dark:text-danger-200 mb-4">
            {{ error }}
          </p>
          <BaseButton
            color="danger"
            @click="fetchPayments"
          >
            <Icon name="ph:arrows-counter-clockwise-duotone" class="size-4" />
            <span>تلاش مجدد</span>
          </BaseButton>
        </div>
      </BaseCard>

      <!-- Empty State -->
      <BaseCard v-else-if="!isLoading && filteredPayments.length === 0" class="bg-muted-50 dark:bg-muted-900/50">
        <div class="flex flex-col items-center justify-center p-12 text-center">
          <Icon name="ph:credit-card-duotone" class="text-muted-400 mb-4 size-12" />
          <h3 class="text-muted-800 dark:text-muted-100 mb-2 text-lg font-medium">
            تراکنشی یافت نشد
          </h3>
          <p class="text-muted-500 dark:text-muted-400 max-w-md">
            هیچ تراکنشی مطابق با فیلترهای انتخابی شما یافت نشد. لطفاً فیلترها را تغییر دهید یا دوباره تلاش کنید.
          </p>
        </div>
      </BaseCard>

      <!-- Payments table -->
      <BaseCard v-else class="relative overflow-x-auto">
        <div class="min-w-full align-middle">
          <table class="min-w-full">
            <thead>
              <tr class="bg-muted-100 dark:bg-muted-800">
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-center text-xs font-semibold uppercase first:rounded-tr"
                >
                  #
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  تاریخ
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  شرح
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  مبلغ (تومان)
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  شماره تراکنش
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading p-3 text-right text-xs font-semibold uppercase"
                >
                  وضعیت
                </th>
                <th
                  class="text-muted-400 border-muted-200 dark:border-muted-700 font-heading w-32 p-3 text-center text-xs font-semibold uppercase last:rounded-tl"
                >
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody class="divide-muted-200 dark:divide-muted-700 divide-y">
              <tr
                v-for="(payment, index) in paginatedPayments"
                :key="payment.id"
                class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800/50 border-b transition-colors duration-300"
              >
                <td class="text-muted-500 dark:text-muted-300 whitespace-nowrap p-3 text-center text-sm">
                  {{ (page - 1) * perPage + index + 1 }}
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <span class="bg-muted-100 dark:bg-muted-800 rounded px-2 py-1">{{ formatDate(payment.created) }}</span>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <Icon name="ph:note-duotone" class="text-primary-500 size-4" />
                    {{ payment.description }}
                  </div>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <span class="text-success-600 dark:text-success-400 font-mono font-medium">
                    {{ formatPrice(payment.amount) }}
                  </span>
                </td>
                <td class="text-muted-700 dark:text-muted-300 whitespace-nowrap p-3 text-sm">
                  <span class="bg-muted-100 dark:bg-muted-800 rounded px-2 py-1 font-mono text-xs">
                    {{ payment.transactionId }}
                  </span>
                </td>
                <td class="whitespace-nowrap p-3 text-sm">
                  <div
                    class="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1"
                    :class="getStatusBadgeClass(payment.status)"
                  >
                    <Icon
                      :name="getStatusIcon(payment.status)"
                      class="size-4"
                    />
                    <span class="text-xs font-medium">
                      {{ getStatusText(payment.status) }}
                    </span>
                  </div>
                </td>
                <td class="whitespace-nowrap p-2">
                  <div class="flex items-center justify-end gap-1">
                    <BaseButton
                      size="sm"
                      color="info"
                      variant="pastel"
                      class="size-8 p-0"
                      :to="`/payments/${payment.id}`"
                      :title="'مشاهده جزئیات'"
                      @click.stop
                    >
                      <Icon name="ph:eye" class="size-4" />
                    </BaseButton>
                    <BaseButton
                      v-if="payment.status === 'pending'"
                      size="sm"
                      color="success"
                      variant="pastel"
                      class="size-8 p-0"
                      :title="'تایید پرداخت'"
                      @click.stop="confirmPayment(payment)"
                    >
                      <Icon name="ph:check" class="size-4" />
                    </BaseButton>
                    <BaseButton
                      v-if="payment.status === 'pending'"
                      size="sm"
                      color="danger"
                      variant="pastel"
                      class="size-8 p-0"
                      :title="'رد پرداخت'"
                      @click.stop="rejectPayment(payment)"
                    >
                      <Icon name="ph:x" class="size-4" />
                    </BaseButton>
                    <BaseButton
                      v-if="['success', 'refunded', 'cancelled'].includes(payment.status)"
                      size="sm"
                      color="muted"
                      variant="pastel"
                      class="size-8 p-0"
                      :title="'دریافت فاکتور'"
                      @click.stop="downloadInvoice(payment)"
                    >
                      <Icon name="ph:receipt" class="size-4" />
                    </BaseButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- Pagination -->
      <div v-if="filteredPayments.length > 0" class="mt-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <BaseSelect v-model="perPage" class="min-w-32">
            <option :value="10">
              10
            </option>
            <option :value="25">
              25
            </option>
            <option :value="50">
              50
            </option>
          </BaseSelect>
          <p class="text-muted-400 min-w-32 text-sm">
            مورد در هر صفحه
          </p>
        </div>
        <BasePagination
          :total="filteredPayments.length"
          :per-page="perPage"
          :current-page="page"
          class="justify-end"
        />
      </div>
    </div>
  </div>
</template>
