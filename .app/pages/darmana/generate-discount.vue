<script setup lang="ts">
definePageMeta({
  title: 'ایجاد کد',
  layout: 'sidebar',

});
useHead({ htmlAttrs: { dir: 'rtl' } });

const { generateCoupon, generateBatchCoupons, getCoupons, deleteCoupons } = useDiscountCopoun();
const loading = ref(false);
const coupons = ref<any[]>([]);
const selectedCoupons = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const statusFilter = ref('all');
const prefixFilter = ref('');

const amount = ref<number>();
const code = ref('');
const duration = ref<number>();
const prefix = ref('');
const value = ref('value_1');
const isCustomModalOpen = ref(false);
const customCount = ref(1);
const codeMode = ref('manual');

// Validation
const errors = reactive({
  amount: '',
  duration: '',
  code: '',
});

const validateForm = () => {
  let isValid = true;
  errors.amount = '';
  errors.duration = '';
  errors.code = '';

  if (!amount.value || amount.value <= 0) {
    errors.amount = 'مبلغ تخفیف باید بیشتر از صفر باشد';
    isValid = false;
  }

  if (!duration.value || duration.value <= 0) {
    errors.duration = 'مدت اعتبار باید بیشتر از صفر باشد';
    isValid = false;
  }

  if (!isRandomMode.value && (!code.value || code.value.length < 3)) {
    errors.code = 'کد تخفیف باید حداقل 3 کاراکتر باشد';
    isValid = false;
  }

  return isValid;
};

const isFormValid = computed(() =>
  amount.value > 0
  && duration.value > 0
  && (isRandomMode.value || (code.value && code.value.length >= 3)),
);

// Map radio values to number of codes
const codeCountMap = {
  value_1: 1,
  value_2: 5,
  value_3: 10,
  value_4: 20,
  custom: 0, // Will be replaced by customCount
};

const batchCount = computed(() => {
  if (value.value === 'custom') {
    return customCount.value;
  }
  return codeCountMap[value.value] || 1;
});

const isRandomMode = computed(() => batchCount.value > 1 || codeMode.value === 'random');

const openCustomModal = () => {
  isCustomModalOpen.value = true;
};

const closeCustomModal = () => {
  isCustomModalOpen.value = false;
};

const applyCustomCount = () => {
  if (customCount.value >= 1 && customCount.value <= 100) {
    value.value = 'custom';
    closeCustomModal();
  }
};

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix.value;
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code.value = result;
};

watch([batchCount, codeMode], ([newBatchCount, newCodeMode]) => {
  if (newBatchCount > 1 || newCodeMode === 'random') {
    generateRandomCode();
  }
});

const generateCode = async () => {
  if (!validateForm()) {
    toaster.show({
      title: 'خطا',
      message: 'لطفا تمام فیلدها را به درستی پر کنید',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
    return;
  }

  loading.value = true;
  try {
    if (batchCount.value > 1) {
      await generateBatchCoupons(amount.value!, duration.value!, batchCount.value, prefix.value);
    }
    else {
      await generateCoupon({
        amount: amount.value!,
        duration: duration.value!,
        code: code.value,
        type: 'admin',
      });
    }
    toaster.show({
      title: 'موفق',
      message: 'کد تخفیف با موفقیت ایجاد شد',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    });
    await loadCoupons();
    // Reset form
    if (batchCount.value === 1) {
      amount.value = 0;
      code.value = '';
      duration.value = 0;
    }
  }
  catch (error) {
    console.error('Error generating coupon:', error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در ایجاد کد تخفیف',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};

const loadCoupons = async () => {
  loading.value = true;
  try {
    const result = await getCoupons();
    console.log('Loaded coupons:', result);
    coupons.value = result;
  }
  catch (error) {
    console.error('Error loading coupons:', error);
  }
  finally {
    loading.value = false;
  }
};

const filteredCoupons = computed(() => {
  let filtered = [...coupons.value];

  // Filter by status
  if (statusFilter.value !== 'all') {
    const isUsed = statusFilter.value === 'used';
    filtered = filtered.filter(coupon => coupon.isUsed === isUsed);
  }

  // Filter by prefix
  if (prefixFilter.value) {
    filtered = filtered.filter(coupon =>
      coupon.code.toLowerCase().startsWith(prefixFilter.value.toLowerCase()),
    );
  }

  return filtered.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
});

const paginatedCoupons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCoupons.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredCoupons.value.length / itemsPerPage.value),
);

const copySelectedCodes = async () => {
  const codes = selectedCoupons.value.map(id =>
    coupons.value.find(c => c.id === id)?.code,
  ).filter(Boolean).join('\n');

  if (codes) {
    await navigator.clipboard.writeText(codes);
    toaster.show({
      title: 'موفق',
      message: 'کدهای انتخاب شده کپی شدند',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    });
  }
};

const deleteSelectedCoupons = async () => {
  try {
    loading.value = true;
    const success = await deleteCoupons(selectedCoupons.value);

    if (success) {
      toaster.show({
        title: 'موفق',
        message: 'کدهای انتخاب شده با موفقیت حذف شدند',
        color: 'success',
        icon: 'ph:check-circle-fill',
        closable: true,
      });

      // Remove deleted coupons from the list
      coupons.value = coupons.value.filter(
        coupon => !selectedCoupons.value.includes(coupon.id),
      );
      selectedCoupons.value = [];
    }
  }
  catch (error: any) {
    console.error('Error deleting coupons:', error);
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف کدهای تخفیف',
      color: 'danger',
      icon: 'ph:x-circle-fill',
      closable: true,
    });
  }
  finally {
    loading.value = false;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price);
};

const toggleAllCoupons = (checked: boolean) => {
  selectedCoupons.value = checked ? paginatedCoupons.value.map(c => c.id) : [];
};

const resetFilters = () => {
  statusFilter.value = 'all';
  prefixFilter.value = '';
  currentPage.value = 1;
  selectedCoupons.value = [];
};

watch([statusFilter, prefixFilter, itemsPerPage], () => {
  currentPage.value = 1;
});

onMounted(() => {
  console.log('Component mounted, loading coupons...');
  loadCoupons();
});

const toaster = useToaster();
</script>

<template>
  <div class="pb-20">
    <div class="grid grid-cols-12 gap-6">
      <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
        <div class="flex flex-col gap-6">
          <BaseCard rounded="md" class="p-6">
            <div class="mb-8 flex items-center gap-4">
              <BaseAvatar
                src="/img/icons/banking/bank-1.svg"
                alt="Discount"
                size="md"
                rounded="none"
                mask="blob"
                class="bg-muted-100 dark:bg-muted-900"
              />
              <div>
                <BaseHeading
                  weight="medium"
                  size="lg"
                  lead="none"
                  class="line-clamp-1"
                >
                  کد تخفیف جدید
                </BaseHeading>
                <BaseParagraph size="xs" class="text-muted-400 line-clamp-1">
                  ایجاد کد تخفیف برای کاربران
                </BaseParagraph>
              </div>
            </div>

            <div class="bg-primary-800 relative flex flex-col justify-between gap-y-6 overflow-hidden rounded-2xl p-8 sm:flex-row">
              <div class="absolute -bottom-10 -start-10 size-48 rounded-full bg-white/10" />
              <div class="absolute -end-24 -top-10 hidden size-80 rounded-full bg-white/10 sm:block" />
              <div class="relative z-20">
                <BaseHeading
                  as="h5"
                  weight="medium"
                  size="sm"
                  lead="none"
                  class="mb-1 text-white"
                >
                  مقدار تخفیف
                </BaseHeading>
                <BaseParagraph weight="semibold" class="mb-2 text-white">
                  {{ amount || 0 }} تومان
                </BaseParagraph>
                <BaseParagraph size="sm" class="mb-1 text-white">
                  کد: {{ code || '---' }}
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-white">
                  مدت اعتبار: {{ duration || 0 }} دقیقه
                </BaseParagraph>
              </div>
            </div>

            <div class="py-6">
              <div class="mb-8 flex items-center">
                <div>
                  <BaseHeading
                    weight="medium"
                    size="sm"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    مشخصات کد تخفیف
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-400">
                    اطلاعات کد تخفیف را وارد کنید
                  </BaseParagraph>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <!-- Code Input -->
                <div class="col-span-1">
                  <div class="flex flex-col gap-2">
                    <label class="text-muted-500 dark:text-muted-400 text-sm font-medium">کد تخفیف</label>
                    <BaseButtonGroup>
                      <BaseButton
                        :color="codeMode === 'manual' ? 'primary' : 'muted'"
                        :disabled="batchCount > 1"
                        @click="codeMode = 'manual'"
                      >
                        <Icon name="ph:hand" class="ml-2 size-4" />
                        <span>دستی</span>
                      </BaseButton>

                      <BaseInput
                        v-model="code"
                        :disabled="isRandomMode"
                        :classes="{
                          wrapper: 'w-48',
                        }"
                        placeholder="مثال: WELCOME2024"
                        :error="errors.code"
                      />

                      <BaseButton
                        :color="codeMode === 'random' ? 'primary' : 'muted'"
                        :disabled="batchCount > 1"
                        @click="codeMode = 'random'"
                      >
                        <Icon name="ph:shuffle-duotone" class="ml-2 size-4" />
                        <span>تصادفی</span>
                      </BaseButton>
                    </BaseButtonGroup>
                    <p v-if="batchCount > 1" class="text-muted-400 text-xs">
                      در حالت تولید انبوه، کدها به صورت تصادفی تولید می‌شوند
                    </p>
                  </div>
                </div>

                <!-- Amount Input -->
                <div class="col-span-1">
                  <BaseInput
                    v-model="amount"
                    type="number"
                    label="مبلغ تخفیف (تومان)"
                    placeholder="مثال: 100000"
                    :error="errors.amount"
                  />
                </div>

                <!-- Duration Input -->
                <div class="col-span-1">
                  <BaseInput
                    v-model="duration"
                    type="number"
                    label="مدت اعتبار (دقیقه)"
                    placeholder="مثال: 30"
                    :error="errors.duration"
                  />
                </div>

                <!-- Prefix Input -->
                <div class="col-span-1">
                  <BaseInput
                    v-model="prefix"
                    label="پیشوند کد (اختیاری)"
                    placeholder="مثال: SUMMER"
                  />
                </div>
              </div>
              <form class="mx-auto w-full">
                <fieldset class="w-full space-y-6">
                  <div
                    class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-b py-4"
                  >
                    <legend class="text-muted-800 dark:text-muted-100 font-sans text-xl font-medium">
                      تعداد کد
                    </legend>

                    <button
                      class="text-primary-500 font-sans text-sm font-medium underline-offset-4 hover:underline"
                      @click.prevent="openCustomModal"
                    >
                      وارد کردن مقدار سفارشی
                    </button>
                  </div>

                  <div class="grid gap-6 sm:grid-cols-4">
                    <BaseRadioHeadless
                      v-model="value"
                      name="radio_custom"
                      value="value_1"
                    >
                      <BaseCard
                        rounded="lg"
                        class="peer-checked:!border-success-500 peer-checked:!bg-success-500/10 relative border-2 p-5 peer-checked:[&_.child]:!opacity-100"
                      >
                        <div class="flex flex-col">
                          <h4
                            class="text-muted-500 dark:text-muted-200 mb-3 font-sans text-sm font-medium uppercase leading-tight"
                          >
                            پایه
                          </h4>

                          <h3 class="text-muted-800 dark:text-muted-100 font-sans font-bold">
                            <span class="text-4xl">1</span>

                            <span class="text-2xl uppercase"> عدد</span>
                          </h3>

                          <div class="font-sans">
                            <span class="text-muted-500 dark:text-muted-400 text-sm font-medium">برای یک بار استفاده</span>
                          </div>
                        </div>

                        <div class="child absolute end-2 top-3 opacity-0">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-7" />
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>

                    <BaseRadioHeadless
                      v-model="value"
                      name="radio_custom"
                      value="value_2"
                    >
                      <BaseCard
                        rounded="lg"
                        class="peer-checked:!border-success-500 peer-checked:!bg-success-500/10 relative border-2 p-5 peer-checked:[&_.child]:!opacity-100"
                      >
                        <div class="flex flex-col">
                          <h4
                            class="text-muted-500 dark:text-muted-200 mb-3 font-sans text-sm font-medium uppercase leading-tight"
                          >
                            پیشرفته
                          </h4>

                          <h3 class="text-muted-800 dark:text-muted-100 font-sans font-bold">
                            <span class="text-4xl">5</span>

                            <span class="text-2xl uppercase"> عدد</span>
                          </h3>

                          <div class="font-sans">
                            <span class="text-muted-500 dark:text-muted-400 text-sm font-medium">برای 5 بار استفاده</span>
                          </div>
                        </div>

                        <div class="child absolute end-2 top-3 opacity-0">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-7" />
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>

                    <BaseRadioHeadless
                      v-model="value"
                      name="radio_custom"
                      value="value_3"
                    >
                      <BaseCard
                        rounded="lg"
                        class="peer-checked:!border-success-500 peer-checked:!bg-success-500/10 relative border-2 p-5 peer-checked:[&_.child]:!opacity-100"
                      >
                        <div class="flex flex-col">
                          <h4
                            class="text-muted-500 dark:text-muted-200 mb-3 font-sans text-sm font-medium uppercase leading-tight"
                          >
                            کسب و کار
                          </h4>

                          <h3 class="text-muted-800 dark:text-muted-100 font-sans font-bold">
                            <span class="text-4xl">10</span>

                            <span class="text-2xl uppercase"> عدد</span>
                          </h3>

                          <div class="font-sans">
                            <span class="text-muted-500 dark:text-muted-400 text-sm font-medium">برای 10 بار استفاده</span>
                          </div>
                        </div>

                        <div class="child absolute end-2 top-3 opacity-0">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-7" />
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>

                    <BaseRadioHeadless
                      v-model="value"
                      name="radio_custom"
                      value="value_4"
                    >
                      <BaseCard
                        rounded="lg"
                        class="peer-checked:!border-success-500 peer-checked:!bg-success-500/10 relative border-2 p-5 peer-checked:[&_.child]:!opacity-100"
                      >
                        <div class="flex flex-col">
                          <h4
                            class="text-muted-500 dark:text-muted-200 mb-3 font-sans text-sm font-medium uppercase leading-tight"
                          >
                            سازمانی
                          </h4>

                          <h3 class="text-muted-800 dark:text-muted-100 font-sans font-bold">
                            <span class="text-4xl">20</span>

                            <span class="text-2xl uppercase"> عدد</span>
                          </h3>

                          <div class="font-sans">
                            <span class="text-muted-500 dark:text-muted-400 text-sm font-medium">برای 20 بار استفاده</span>
                          </div>
                        </div>

                        <div class="child absolute end-2 top-3 opacity-0">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-7" />
                        </div>
                      </BaseCard>
                    </BaseRadioHeadless>

                    <!-- Custom Value Card -->
                    <BaseRadioHeadless
                      v-if="value === 'custom'"
                      v-model="value"
                      name="radio_custom"
                      value="custom"
                    >
                      <BaseCard
                        rounded="lg"
                        class="peer-checked:!border-success-500 peer-checked:!bg-success-500/10 relative border-2 p-5 peer-checked:[&_.child]:!opacity-100"
                      >
                        <div class="flex flex-col">
                          <h4
                            class="text-muted-500 dark:text-muted-200 mb-3 font-sans text-sm font-medium uppercase leading-tight"
                          >
                            سفارشی
                          </h4>

                          <h3 class="text-muted-800 dark:text-muted-100 font-sans font-bold">
                            <span class="text-4xl">{{ customCount }}</span>

                            <span class="text-2xl uppercase"> عدد</span>
                          </h3>

                          <div class="font-sans">
                            <span class="text-muted-500 dark:text-muted-400 text-sm font-medium">
                              برای {{ customCount }} بار استفاده
                            </span>
                          </div>
                        </div>

                        <div class="child absolute end-2 top-3 opacity-0">
                          <Icon name="ph:check-circle-duotone" class="text-success-500 size-7" />
                        </div>

                        <button
                          class="text-primary-500 hover:text-primary-600 absolute bottom-2 end-2"
                          @click.prevent="openCustomModal"
                        >
                          <Icon name="ph:pencil-duotone" class="size-5" />
                        </button>
                      </BaseCard>
                    </BaseRadioHeadless>
                  </div>
                </fieldset>
              </form>
            </div>
          </BaseCard>

          <!-- Coupons List -->
          <BaseCard rounded="md" class="p-6">
            <div class="mb-6">
              <BaseHeading
                weight="medium"
                size="lg"
                lead="none"
                class="mb-2"
              >
                لیست کدهای تخفیف
              </BaseHeading>
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <BaseParagraph size="sm" class="text-muted-400">
                    {{ filteredCoupons.length ? `${filteredCoupons.length} کد تخفیف موجود است` : 'هیچ کد تخفیفی موجود نیست' }}
                  </BaseParagraph>
                  <BaseButton
                    v-if="statusFilter !== 'all' || prefixFilter"
                    color="muted"
                    size="sm"
                    @click="resetFilters"
                  >
                    <Icon name="ph:x" class="size-4" />
                    <span>حذف فیلترها</span>
                  </BaseButton>
                </div>
                <div class="flex items-center gap-4">
                  <BaseInput
                    v-model="prefixFilter"
                    placeholder="جستجو با پیشوند..."
                    :classes="{
                      wrapper: 'w-48',
                    }"
                  >
                    <template #prefix>
                      <Icon name="ph:magnifying-glass" class="text-muted-400 size-4" />
                    </template>
                    <template v-if="prefixFilter" #suffix>
                      <button
                        class="text-muted-400 hover:text-primary-500"
                        @click="prefixFilter = ''"
                      >
                        <Icon name="ph:x" class="size-4" />
                      </button>
                    </template>
                  </BaseInput>
                  <BaseSelect v-model="statusFilter" :classes="{ wrapper: 'w-36' }">
                    <option value="all">
                      همه کدها
                    </option>
                    <option value="active">
                      کدهای فعال
                    </option>
                    <option value="used">
                      کدهای استفاده شده
                    </option>
                  </BaseSelect>
                  <BaseButton
                    v-if="selectedCoupons.length"
                    color="primary"
                    class="ml-2"
                    @click="copySelectedCodes"
                  >
                    <Icon name="ph:copy" class="ml-2 size-4" />
                    <span>کپی {{ selectedCoupons.length }} کد</span>
                  </BaseButton>
                  <BaseButton
                    v-if="selectedCoupons.length"
                    color="danger"
                    @click="deleteSelectedCoupons"
                  >
                    <Icon name="ph:trash" class="ml-2 size-4" />
                    <span>حذف {{ selectedCoupons.length }} کد</span>
                  </BaseButton>
                </div>
              </div>
            </div>
            <div v-if="filteredCoupons.length" class="overflow-x-auto">
              <table class="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                      <BaseCheckbox
                        :model-value="selectedCoupons.length === paginatedCoupons.length && paginatedCoupons.length > 0"
                        :indeterminate="selectedCoupons.length > 0 && selectedCoupons.length < paginatedCoupons.length"
                        @update:model-value="toggleAllCoupons"
                      />
                    </th>
                    <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                      <div class="text-muted-400 font-normal">
                        کد تخفیف
                      </div>
                    </th>
                    <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                      <div class="text-muted-400 font-normal">
                        مبلغ (تومان)
                      </div>
                    </th>
                    <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                      <div class="text-muted-400 font-normal">
                        مدت (روز)
                      </div>
                    </th>
                    <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                      <div class="text-muted-400 font-normal">
                        وضعیت
                      </div>
                    </th>
                    <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                      <div class="text-muted-400 font-normal">
                        تاریخ ایجاد
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="coupon in paginatedCoupons" :key="coupon.id">
                    <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                      <BaseCheckbox
                        v-model="selectedCoupons"
                        :value="coupon.id"
                      />
                    </td>
                    <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                      <BaseText>{{ coupon.code }}</BaseText>
                    </td>
                    <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                      <BaseText>{{ formatPrice(coupon.amount) }}</BaseText>
                    </td>
                    <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                      <BaseText>{{ coupon.duration }}</BaseText>
                    </td>
                    <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                      <BaseTag :color="coupon.isUsed ? 'danger' : 'success'" rounded="lg">
                        {{ coupon.isUsed ? 'استفاده شده' : 'فعال' }}
                      </BaseTag>
                    </td>
                    <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                      <BaseText>{{ new Date(coupon.created).toLocaleDateString('fa-IR') }}</BaseText>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-2">
                  <BaseSelect
                    v-model="itemsPerPage"
                    :classes="{
                      wrapper: 'w-24',
                    }"
                  >
                    <option :value="10">
                      10
                    </option>
                    <option :value="20">
                      20
                    </option>
                    <option :value="50">
                      50
                    </option>
                  </BaseSelect>
                  <span class="text-muted-400 text-sm">مورد در هر صفحه</span>
                </div>

                <div class="flex items-center gap-2">
                  <BaseButton
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                  >
                    <Icon name="lucide:chevron-right" class="size-4" />
                  </BaseButton>
                  <span class="text-muted-500 dark:text-muted-400 text-sm">
                    صفحه {{ currentPage }} از {{ totalPages }}
                  </span>
                  <BaseButton
                    :disabled="currentPage === totalPages"
                    @click="currentPage++"
                  >
                    <Icon name="lucide:chevron-left" class="size-4" />
                  </BaseButton>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center py-6">
              <BaseParagraph size="sm" class="text-muted-400">
                هیچ کد تخفیفی موجود نیست
              </BaseParagraph>
            </div>
          </BaseCard>
        </div>
      </div>
      <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
        <div class="flex flex-col gap-6">
          <!-- Stats -->
          <BaseCard
            rounded="md"
            elevated
            class="p-6"
          >
            <div class="mb-6 flex items-center justify-between">
              <BaseHeading
                weight="medium"
                size="sm"
                class="text-muted-800 dark:text-muted-100"
              >
                آمار کدهای تخفیف
              </BaseHeading>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <BaseParagraph size="sm" class="text-muted-400">
                  تعداد کل
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  weight="semibold"
                  class="text-muted-800 dark:text-muted-100"
                >
                  {{ coupons.length }}
                </BaseParagraph>
              </div>
              <div class="flex items-center justify-between">
                <BaseParagraph size="sm" class="text-muted-400">
                  استفاده شده
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  weight="semibold"
                  class="text-muted-800 dark:text-muted-100"
                >
                  {{ coupons.filter(c => c.isUsed).length }}
                </BaseParagraph>
              </div>
              <div class="flex items-center justify-between">
                <BaseParagraph size="sm" class="text-muted-400">
                  فعال
                </BaseParagraph>
                <BaseParagraph
                  size="sm"
                  weight="semibold"
                  class="text-muted-800 dark:text-muted-100"
                >
                  {{ coupons.filter(c => !c.isUsed).length }}
                </BaseParagraph>
              </div>
            </div>
          </BaseCard>

          <!-- Submit -->
          <BaseButton
            rounded="md"
            color="primary"
            size="lg"
            class="w-full"
            :loading="loading"
            :disabled="!isFormValid"
            @click="generateCode"
          >
            <Icon name="lucide:plus" class="size-4" />
            <span>ایجاد کد تخفیف</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Custom Count Modal -->
  <TairoModal
    size="sm"
    :open="isCustomModalOpen"
    @close="closeCustomModal"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          تعداد سفارشی کد
        </h3>
        <button
          class="text-muted-400 hover:text-primary-500 flex size-9 items-center justify-center"
          @click="closeCustomModal"
        >
          <Icon name="lucide:x" class="size-4" />
        </button>
      </div>
    </template>
    <template #default>
      <div class="p-4">
        <BaseInput
          v-model="customCount"
          type="number"
          min="1"
          max="100"
          label="تعداد کد"
          placeholder="مثال: 15"
        />
        <p class="text-muted-400 mt-2 text-sm">
          تعداد کد باید بین 1 تا 100 باشد
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-x-2 p-4">
        <BaseButton
          variant="solid"
          color="muted"
          @click="closeCustomModal"
        >
          انصراف
        </BaseButton>
        <BaseButton
          variant="solid"
          color="primary"
          :disabled="customCount < 1 || customCount > 100"
          @click="applyCustomCount"
        >
          تایید
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>
