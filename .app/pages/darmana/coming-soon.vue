<script setup lang="ts">
definePageMeta({
  title: 'به زودی',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// Animation states
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center">
    <!-- Background gradient -->
    <div class="from-primary-50 to-info-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 absolute inset-0 bg-gradient-to-br via-white" />

    <!-- Content container -->
    <div class="relative z-10 mx-auto w-full max-w-4xl px-4">
      <Transition
        enter-active-class="transition-all duration-1000 ease-out"
        enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="isVisible" class="text-center">
          <!-- Illustration -->
          <div class="mb-8 flex justify-center">
            <div class="relative">
              <!-- Main illustration container -->
              <div class="bg-primary-100 dark:bg-primary-900/30 flex size-64 items-center justify-center rounded-full p-8">
                <!-- Animated icon -->
                <div class="animate-pulse">
                  <Icon name="ph:wrench-duotone" class="text-primary-500 size-24" />
                </div>

                <!-- Floating elements -->
                <div class="bg-warning-100 dark:bg-warning-900/30 absolute -right-4 -top-4 animate-bounce rounded-full p-3">
                  <Icon name="ph:hammer-duotone" class="text-warning-500 size-6" />
                </div>

                <div class="bg-success-100 dark:bg-success-900/30 absolute -bottom-4 -left-4 animate-bounce rounded-full p-3" style="animation-delay: 0.5s">
                  <Icon name="ph:gear-duotone" class="text-success-500 size-6" />
                </div>
              </div>
            </div>
          </div>

          <!-- Main heading -->
          <BaseHeading
            tag="h1"
            size="4xl"
            weight="bold"
            class="text-muted-800 mb-4 dark:text-white"
          >
            گفت و گوی درمانی
          </BaseHeading>

          <BaseHeading
            tag="h2"
            size="2xl"
            weight="medium"
            class="text-primary-600 dark:text-primary-400 mb-6"
          >
            به زودی در دسترس خواهد بود
          </BaseHeading>

          <!-- Description -->
          <div class="mx-auto mb-8 max-w-2xl space-y-4">
            <BaseParagraph
              size="lg"
              class="text-muted-600 dark:text-muted-300 leading-relaxed"
            >
              ما در حال توسعه یک سیستم پیشرفته گفت و گوی درمانی هستیم که شامل ویژگی‌های منحصر به فرد برای ارائه بهترین تجربه درمانی خواهد بود.
            </BaseParagraph>

            <BaseParagraph
              size="base"
              class="text-muted-500 dark:text-muted-400"
            >
              این بخش شامل جلسات درمانی تخصصی، ارزیابی‌های روانشناختی دقیق، و ابزارهای پیشرفته تحلیل عملکرد خواهد بود.
            </BaseParagraph>
          </div>

          <!-- Features preview -->
          <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <BaseCard class="border-primary-200 dark:border-primary-800 border p-6 text-center">
              <div class="bg-primary-100 dark:bg-primary-900/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Icon name="ph:brain-duotone" class="text-primary-500 size-6" />
              </div>
              <BaseHeading
                tag="h3"
                size="md"
                weight="medium"
                class="text-muted-800 mb-2 dark:text-white"
              >
                جلسات تخصصی
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                گفت و گوهای درمانی با روانشناسان متخصص
              </BaseParagraph>
            </BaseCard>

            <BaseCard class="border-info-200 dark:border-info-800 border p-6 text-center">
              <div class="bg-info-100 dark:bg-info-900/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Icon name="ph:chart-line-duotone" class="text-info-500 size-6" />
              </div>
              <BaseHeading
                tag="h3"
                size="md"
                weight="medium"
                class="text-muted-800 mb-2 dark:text-white"
              >
                تحلیل پیشرفته
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                ارزیابی و تحلیل دقیق پیشرفت درمانی
              </BaseParagraph>
            </BaseCard>

            <BaseCard class="border-success-200 dark:border-success-800 border p-6 text-center">
              <div class="bg-success-100 dark:bg-success-900/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <Icon name="ph:shield-check-duotone" class="text-success-500 size-6" />
              </div>
              <BaseHeading
                tag="h3"
                size="md"
                weight="medium"
                class="text-muted-800 mb-2 dark:text-white"
              >
                امنیت بالا
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                حفاظت کامل از اطلاعات شخصی و درمانی
              </BaseParagraph>
            </BaseCard>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BaseButton
              color="primary"
              size="lg"
              to="/dashboard"
              class="w-full sm:w-auto"
            >
              <Icon name="ph:arrow-right" class="ml-2 size-5" />
              بازگشت به داشبورد
            </BaseButton>

            <BaseButton
              color="muted"
              variant="outline"
              size="lg"
              to="/darmana/therapists/sessions"
              class="w-full sm:w-auto"
            >
              <Icon name="ph:chat-circle-text-duotone" class="ml-2 size-5" />
              گفت و گوی آزاد
            </BaseButton>
          </div>

          <!-- Timeline info -->
          <div class="bg-muted-50 dark:bg-muted-800/50 border-muted-200 dark:border-muted-700 mt-12 rounded-xl border p-6">
            <BaseHeading
              tag="h3"
              size="md"
              weight="medium"
              class="text-muted-800 mb-3 dark:text-white"
            >
              زمان‌بندی توسعه
            </BaseHeading>
            <div class="flex flex-col gap-4 text-center sm:flex-row">
              <div class="flex-1">
                <div class="bg-warning-100 dark:bg-warning-900/30 mx-auto mb-2 flex size-8 items-center justify-center rounded-full">
                  <Icon name="ph:clock-duotone" class="text-warning-500 size-4" />
                </div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                  در حال توسعه
                </BaseParagraph>
              </div>
              <div class="flex-1">
                <div class="bg-info-100 dark:bg-info-900/30 mx-auto mb-2 flex size-8 items-center justify-center rounded-full">
                  <Icon name="ph:test-tube-duotone" class="text-info-500 size-4" />
                </div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                  مرحله تست
                </BaseParagraph>
              </div>
              <div class="flex-1">
                <div class="bg-success-100 dark:bg-success-900/30 mx-auto mb-2 flex size-8 items-center justify-center rounded-full">
                  <Icon name="ph:rocket-launch-duotone" class="text-success-500 size-4" />
                </div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                  عرضه نهایی
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
