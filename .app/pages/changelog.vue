<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen px-4 pb-10 pt-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <div class="dark:bg-muted-800 rounded-lg bg-white p-6 shadow">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-muted-900 text-2xl font-bold dark:text-white">
              تاریخچه تغییرات
            </h1>
            <p v-if="latestRelease" class="text-muted-500 dark:text-muted-400 text-sm">
              آخرین نسخه منتشر شده: {{ latestRelease.version }} ({{ formatDate(latestRelease.releaseDate) }})
            </p>
          </div>
          <div class="text-muted-500 dark:text-muted-400 text-xs">
            نسخه نصب شده شما: {{ appVersion }}
          </div>
        </div>

        <div v-if="error" class="text-danger-600 mt-6 text-sm">
          خطا در دریافت اطلاعات تغییرات. لطفاً کمی بعد دوباره تلاش کنید.
        </div>

        <div v-else class="mt-6 space-y-8">
          <div v-if="!releases.length" class="text-muted-500 dark:text-muted-400 text-sm">
            هنوز اطلاعاتی برای نمایش وجود ندارد.
          </div>

          <div
            v-for="release in releases"
            :key="release.version"
            class="border-muted-200 dark:border-muted-700 border-b pb-6 last:border-b-0"
          >
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 class="text-primary-500 text-xl font-semibold">
                  نسخه {{ release.version }}
                </h2>
                <p class="text-muted-400 text-sm">
                  {{ formatDate(release.releaseDate) }}
                </p>
              </div>
              <div v-if="release.product?.codename" class="text-xs font-medium uppercase tracking-wide text-purple-500">
                {{ release.product.codename }}
              </div>
            </div>

            <p v-if="release.product?.summary" class="text-muted-600 dark:text-muted-300 mt-4 text-sm leading-6">
              {{ release.product.summary }}
            </p>

            <div class="mt-6 grid gap-6 md:grid-cols-2">
              <div v-if="release.product?.highlights?.length" class="space-y-3">
                <h3 class="text-success-500 text-lg font-medium">
                  نکات محصولی
                </h3>
                <ul class="text-muted-500 dark:text-muted-400 space-y-2 text-sm leading-6">
                  <li
                    v-for="item in release.product.highlights"
                    :key="item"
                    class="flex items-start gap-2"
                  >
                    <Icon name="ph:sparkle" class="text-success-500 mt-1 size-4" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="release.technical?.changes?.length" class="space-y-3">
                <h3 class="text-info-500 text-lg font-medium">
                  تغییرات فنی
                </h3>
                <ul class="text-muted-500 dark:text-muted-400 space-y-2 text-sm leading-6">
                  <li
                    v-for="item in release.technical.changes"
                    :key="item"
                    class="flex items-start gap-2"
                  >
                    <Icon name="ph:code" class="text-info-500 mt-1 size-4" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="release.technical?.fixes?.length" class="space-y-3 md:col-span-2">
                <h3 class="text-warning-500 text-lg font-medium">
                  رفع اشکالات
                </h3>
                <ul class="text-muted-500 dark:text-muted-400 space-y-2 text-sm leading-6">
                  <li
                    v-for="item in release.technical.fixes"
                    :key="item"
                    class="flex items-start gap-2"
                  >
                    <Icon name="ph:wrench" class="text-warning-500 mt-1 size-4" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="release.rollout?.checks?.length || release.rollout?.announcement" class="space-y-3 md:col-span-2">
                <h3 class="text-primary-500 text-lg font-medium">
                  برنامه انتشار
                </h3>
                <p v-if="release.rollout?.announcement" class="text-muted-500 dark:text-muted-400 text-sm">
                  {{ release.rollout.announcement }}
                </p>
                <ul v-if="release.rollout?.checks?.length" class="text-muted-500 dark:text-muted-400 space-y-2 text-sm leading-6">
                  <li
                    v-for="item in release.rollout.checks"
                    :key="item"
                    class="flex items-start gap-2"
                  >
                    <Icon name="ph:list-checks" class="text-primary-500 mt-1 size-4" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { version: appVersion } = useAppVersion();
const { releases, latestRelease, error } = await useReleaseNotes();

const pageTitle = computed(() => latestRelease.value
  ? `تاریخچه تغییرات - نسخه ${latestRelease.value.version}`
  : 'تاریخچه تغییرات',
);

const metaDescription = computed(() => latestRelease.value?.product?.summary ?? 'نمایش کامل تغییرات محصول و نسخه‌های منتشر شده.');

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: metaDescription.value },
  ],
}));

const formatDate = (value?: string) => {
  if (!value) return 'تاریخ نامشخص';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
};
</script>
