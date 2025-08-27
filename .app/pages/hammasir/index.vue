<script setup lang="ts">
definePageMeta({
  title: 'همسیر - آمادگی برای ازدواج',
  layout: 'auth',
})

useHead({ htmlAttrs: { dir: 'rtl' } })
</script>

<template>
  <div class="animated-gradient-bg flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="relative z-10 w-full max-w-4xl space-y-12">
      <!-- Theme toggle button -->
      <div class="absolute left-4 top-4">
        <BaseThemeToggle />
      </div>

      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white md:text-6xl">
          <span class="block">همسیر</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-400">
          مسیر آگاهانه به سوی ازدواج موفق و پایدار
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900">
            <svg
              class="size-8 text-indigo-600 dark:text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            خودشناسی عمیق
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            با استفاده از آزمون‌های علمی و روان‌شناختی، خود و نیازهای واقعی خود را بشناسید.
          </p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900">
            <svg
              class="size-8 text-green-600 dark:text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            آمادگی روانی
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            مهارت‌های لازم برای ایجاد و حفظ یک رابطه سالم و پایدار را یاد بگیرید.
          </p>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900">
            <svg
              class="size-8 text-purple-600 dark:text-purple-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 class="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            هماهنگی و سازگاری
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            با استفاده از الگوریتم‌های پیشرفته، همسر هماهنگ و سازگار با خود را پیدا کنید.
          </p>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink
          to="/hammasir/auth/register"
          class="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-medium text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          شروع مسیر همسان‌یابی
          <Icon name="gg:arrow-long-left" class="mr-2 size-5" />
        </NuxtLink>

        <p class="mt-6 text-sm text-gray-600 dark:text-gray-400">
          قبلاً حساب کاربری دارید؟
          <NuxtLink to="/hammasir/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            وارد شوید
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animated-gradient-bg {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4);
  background-size: 400% 400%;
  animation: gradientShift 30s ease infinite;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .animated-gradient-bg {
  background: linear-gradient(-45deg, #1e40af, #7c3aed, #be185d, #d97706, #059669, #0284c7);
  background-size: 400% 400%;
  animation: gradientShift 30s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Add some subtle floating animation for enhanced effect */
.animated-gradient-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  animation: floatingBubbles 45s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes floatingBubbles {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  33% {
    transform: translate(15px, -15px) rotate(60deg);
    opacity: 0.4;
  }
  66% {
    transform: translate(-10px, 10px) rotate(120deg);
    opacity: 0.35;
  }
}

/* Ensure content stays above the animated background */
.animated-gradient-bg > * {
  position: relative;
  z-index: 1;
}

/* Mobile specific adjustments */
@media (max-width: 768px) {
  .animated-gradient-bg {
    padding: 1rem;
    min-height: 100%;
  }

  .space-y-12 {
    space-y: 2rem;
  }

  .grid {
    gap: 1.5rem;
  }
}
</style>
