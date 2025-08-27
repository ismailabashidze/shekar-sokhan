<script setup lang="ts">
defineProps({
  error: {
    type: Object,
    default: null,
  },
})

useHead({ htmlAttrs: { dir: 'rtl' } })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-gray-900 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h1 class="text-9xl font-extrabold text-gray-900 dark:text-white">
          404
        </h1>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          صفحه مورد نظر یافت نشد!
        </h2>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          متاسفانه صفحه‌ای که به دنبال آن بودید یافت نشد.
        </p>

        <div class="mt-10">
          <NuxtLink
            to="/hammasir"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              class="mx-3 size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            بازگشت به صفحه اصلی
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
