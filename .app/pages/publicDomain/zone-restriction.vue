<template>
  <div class="fixed inset-0 z-[9999] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Background Effects -->
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute inset-0 bg-[url('/img/grid.svg')] opacity-20" />
      <div class="absolute left-20 top-20 size-96 animate-pulse rounded-full bg-purple-500 opacity-10 blur-3xl" />
      <div class="absolute bottom-20 right-20 size-96 animate-pulse rounded-full bg-blue-500 opacity-10 blur-3xl" />
      <div
        class="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-500 opacity-5 blur-3xl"
      />
    </div>

    <!-- Main Content -->
    <div class="relative flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
      <div class="mx-auto w-full max-w-2xl">
        <!-- Animated Card -->
        <div class="group relative">
          <!-- Glow Effect -->
          <div
            class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"
          />

          <!-- Main Card -->
          <div class="relative overflow-hidden rounded-2xl bg-white/95 shadow-2xl backdrop-blur-xl">
            <!-- Decorative Border -->
            <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />

            <!-- Header Section -->
            <div class="relative bg-gradient-to-br from-gray-50 to-white px-6 py-8 text-center sm:px-8 sm:py-10">
              <!-- Lock Icon with Animation -->
              <div class="mb-4 flex justify-center">
                <div class="relative">
                  <div class="absolute -inset-3 animate-pulse rounded-full bg-red-500 opacity-20" />
                  <div
                    class="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 p-4 shadow-lg"
                  >
                    <Icon name="ph:lock-simple-fill" class="size-10 text-white" />
                  </div>
                </div>
              </div>

              <!-- Main Title -->
              <div class="space-y-1">
                <h1
                  class="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
                >
                  {{ accessReason === 'auth' ? 'نیاز به احراز هویت' : 'دسترسی محدود' }}
                </h1>
                <p class="text-base text-gray-600 sm:text-lg">
                  {{ accessReason === 'auth' ? 'شما باید وارد حساب کاربری خود شوید' : 'شما به این بخش دسترسی ندارید' }}
                </p>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-6 sm:p-8">
              <!-- Alert Card -->
              <div
                class="mb-6 rounded-xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-sm sm:p-6"
              >
                <div class="flex items-start gap-3">
                  <div class="shrink-0">
                    <div
                      class="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-md"
                    >
                      <Icon name="ph:warning-fill" class="size-5 text-white" />
                    </div>
                  </div>
                  <div class="flex-1 text-right">
                    <h2 class="text-base font-semibold text-gray-900 sm:text-lg">
                      {{ accessReason === 'auth' ? 'نیاز به ورود به سیستم' : 'محدودیت دسترسی' }}
                    </h2>
                    <p class="mt-1.5 text-sm leading-relaxed text-gray-600 sm:text-base">
                      {{
                        accessReason === 'auth'
                          ? 'برای دسترسی به بخش‌های مختلف، باید ابتدا وارد حساب کاربری خود شوید.'
                          : 'شما به این بخش دسترسی ندارید. برای دریافت مجوز از مدیر سیستم درخواست کنید.'
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Requested Zone Information -->
              <div
                v-if="requestedZone"
                class="rounded-xl border border-gray-200/50 bg-gradient-to-br from-gray-50 to-slate-50 p-4 shadow-sm sm:p-5"
              >
                <h3 class="mb-3 text-center text-sm font-semibold text-gray-700 sm:text-base">
                  بخش درخواستی
                </h3>
                <div class="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <div
                    class="flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <Icon
                      :name="getRequestedZoneIcon()"
                      :class="getRequestedZoneClass()"
                      class="size-5"
                    />
                  </div>
                  <span class="text-base font-semibold text-gray-900 sm:text-lg">{{ getRequestedZoneLabel() }}</span>
                  <div class="rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800">
                    <Icon name="ph:x-circle-fill" class="ml-1 inline size-3.5" />
                    غیرمجاز
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="border-t border-gray-200/50 bg-gradient-to-br from-gray-50 to-white px-6 py-5 sm:px-8">
              <div class="flex justify-center">
                <button
                  class="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:text-base"
                  @click="goBack"
                >
                  بازگشت به صفحه قبل
                  <Icon name="ph:arrow-left" class="size-4 transition-transform group-hover:-translate-x-1 sm:size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Help Section -->
        <div class="mt-6 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:mt-8 sm:p-5">
          <div class="text-white">
            <h4 class="mb-3 flex items-center gap-2 text-base font-semibold sm:text-lg">
              <div class="flex size-7 items-center justify-center rounded-full bg-white/20">
                <Icon name="ph:question-fill" class="size-3.5" />
              </div>
              راهنمای دسترسی
            </h4>
            <ul class="space-y-2.5 text-right">
              <li class="flex items-start gap-2.5">
                <div
                  class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-green-400/50 bg-green-500/20"
                >
                  <Icon name="ph:check-fill" class="size-2.5 text-green-400" />
                </div>
                <span class="text-sm leading-relaxed text-white/90">برای دریافت دسترسی به بخش‌های جدید با مدیر سیستم تماس بگیرید</span>
              </li>
              <li class="flex items-start gap-2.5">
                <div
                  class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-green-400/50 bg-green-500/20"
                >
                  <Icon name="ph:check-fill" class="size-2.5 text-green-400" />
                </div>
                <span class="text-sm leading-relaxed text-white/90">می‌توانید از داشبورد به بخش‌های مجاز خود دسترسی داشته باشید</span>
              </li>
              <li class="flex items-start gap-2.5">
                <div
                  class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-green-400/50 bg-green-500/20"
                >
                  <Icon name="ph:check-fill" class="size-2.5 text-green-400" />
                </div>
                <span class="text-sm leading-relaxed text-white/90">بخش عمومی برای همه کاربران بدون نیاز به مجوز قابل دسترسی است</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Public page - no authentication required
definePageMeta({
  layout: false,
});

// Hide body overflow when this page is mounted
onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

const route = useRoute();
const router = useRouter();
const { user } = useUser();
const { userZones, ZONE_CONFIGS } = useZones();

// Get requested zone from query parameters
const requestedZoneName = computed(() => {
  return route.query.zone as string || '';
});

const accessReason = computed(() => {
  return route.query.reason as string || '';
});

const requestedZone = computed(() => {
  if (!requestedZoneName.value) return null;
  return ZONE_CONFIGS[requestedZoneName.value];
});

const getRequestedZoneLabel = () => {
  return requestedZone.value?.label || requestedZoneName.value;
};

const getRequestedZoneIcon = () => {
  return requestedZone.value?.icon || 'ph:lock';
};

const getRequestedZoneClass = () => {
  const color = requestedZone.value?.color;
  return color ? `text-${color}-600` : 'text-gray-600';
};

const getZoneBadgeClass = (color?: string) => {
  if (!color) return 'bg-gray-100 text-gray-800 border border-gray-200';

  const colorMap: Record<string, string> = {
    red: 'bg-red-100 text-red-800 border border-red-200 shadow-sm',
    green: 'bg-green-100 text-green-800 border border-green-200 shadow-sm',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm',
    yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200 shadow-sm',
    pink: 'bg-pink-100 text-pink-800 border border-pink-200 shadow-sm',
    orange: 'bg-orange-100 text-orange-800 border border-orange-200 shadow-sm',
  };

  return colorMap[color] || 'bg-gray-100 text-gray-800 border border-gray-200 shadow-sm';
};

const goBack = () => {
  // Try to go back, if no history, go to dashboard
  if (window.history.length > 1) {
    router.back();
  }
 else {
    router.push('/dashboard');
  }
};
</script>
