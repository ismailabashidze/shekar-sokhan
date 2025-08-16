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
  <div class="relative min-h-screen flex items-center justify-center">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-info-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900" />
    
    <!-- Content container -->
    <div class="relative z-10 w-full max-w-4xl mx-auto px-4">
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
              <div class="bg-primary-100 dark:bg-primary-900/30 rounded-full p-8 w-64 h-64 flex items-center justify-center">
                <!-- Animated icon -->
                <div class="animate-pulse">
                  <Icon name="ph:wrench-duotone" class="w-24 h-24 text-primary-500" />
                </div>
                
                <!-- Floating elements -->
                <div class="absolute -top-4 -right-4 bg-warning-100 dark:bg-warning-900/30 rounded-full p-3 animate-bounce">
                  <Icon name="ph:hammer-duotone" class="w-6 h-6 text-warning-500" />
                </div>
                
                <div class="absolute -bottom-4 -left-4 bg-success-100 dark:bg-success-900/30 rounded-full p-3 animate-bounce" style="animation-delay: 0.5s">
                  <Icon name="ph:gear-duotone" class="w-6 h-6 text-success-500" />
                </div>
              </div>
            </div>
          </div>

          <!-- Main heading -->
          <BaseHeading 
            tag="h1" 
            size="4xl" 
            weight="bold" 
            class="text-muted-800 dark:text-white mb-4"
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
          <div class="max-w-2xl mx-auto mb-8 space-y-4">
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <BaseCard class="p-6 text-center border border-primary-200 dark:border-primary-800">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="ph:brain-duotone" class="w-6 h-6 text-primary-500" />
              </div>
              <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white mb-2">
                جلسات تخصصی
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                گفت و گوهای درمانی با روانشناسان متخصص
              </BaseParagraph>
            </BaseCard>

            <BaseCard class="p-6 text-center border border-info-200 dark:border-info-800">
              <div class="w-12 h-12 bg-info-100 dark:bg-info-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="ph:chart-line-duotone" class="w-6 h-6 text-info-500" />
              </div>
              <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white mb-2">
                تحلیل پیشرفته
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                ارزیابی و تحلیل دقیق پیشرفت درمانی
              </BaseParagraph>
            </BaseCard>

            <BaseCard class="p-6 text-center border border-success-200 dark:border-success-800">
              <div class="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="ph:shield-check-duotone" class="w-6 h-6 text-success-500" />
              </div>
              <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white mb-2">
                امنیت بالا
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                حفاظت کامل از اطلاعات شخصی و درمانی
              </BaseParagraph>
            </BaseCard>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BaseButton 
              color="primary" 
              size="lg" 
              to="/dashboard"
              class="w-full sm:w-auto"
            >
              <Icon name="ph:arrow-right" class="w-5 h-5 ml-2" />
              بازگشت به داشبورد
            </BaseButton>
            
            <BaseButton 
              color="muted" 
              variant="outline" 
              size="lg" 
              to="/darmana/therapists/sessions"
              class="w-full sm:w-auto"
            >
              <Icon name="ph:chat-circle-text-duotone" class="w-5 h-5 ml-2" />
              گفت و گوی آزاد
            </BaseButton>
          </div>

          <!-- Timeline info -->
          <div class="mt-12 p-6 bg-muted-50 dark:bg-muted-800/50 rounded-xl border border-muted-200 dark:border-muted-700">
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white mb-3">
              زمان‌بندی توسعه
            </BaseHeading>
            <div class="flex flex-col sm:flex-row gap-4 text-center">
              <div class="flex-1">
                <div class="w-8 h-8 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="ph:clock-duotone" class="w-4 h-4 text-warning-500" />
                </div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                  در حال توسعه
                </BaseParagraph>
              </div>
              <div class="flex-1">
                <div class="w-8 h-8 bg-info-100 dark:bg-info-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="ph:test-tube-duotone" class="w-4 h-4 text-info-500" />
                </div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                  مرحله تست
                </BaseParagraph>
              </div>
              <div class="flex-1">
                <div class="w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Icon name="ph:rocket-launch-duotone" class="w-4 h-4 text-success-500" />
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