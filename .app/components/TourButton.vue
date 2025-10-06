<template>
  <div class="tour-button-container">
    <!-- Floating Help Button -->
    <button
      v-if="showFloatingButton"
      class="bg-primary-500 hover:bg-primary-600 flex size-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110"
      title="راهنما"
      @click="openTourModal"
    >
      <Icon name="ph:question" class="size-6" />
    </button>

    <!-- Tour Selection Modal -->
    <TairoModal
      :open="isModalOpen"
      size="md"
      @close="closeModal"
    >
      <template #header>
        <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-b p-6">
          <div class="flex items-center gap-3">
            <div class="bg-primary-100 dark:bg-primary-900 flex size-10 items-center justify-center rounded-xl">
              <Icon name="ph:compass-duotone" class="text-primary-600 dark:text-primary-400 size-5" />
            </div>
            <div>
              <h3 class="font-heading text-muted-900 text-xl font-bold leading-6 dark:text-white">
                راهنمای آموزشی
              </h3>
              <p class="text-muted-500 dark:text-muted-400 mt-1 text-sm">
                آموزش گام به گام استفاده از سیستم
              </p>
            </div>
          </div>
          <BaseButtonClose @click="closeModal" />
        </div>
      </template>

      <div class="tour-modal-content p-6">
        <div class="mb-8">
          <div class="mb-6 text-center">
            <div class="from-primary-500 to-primary-600 shadow-primary-500/25 mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg">
              <Icon name="ph:graduation-cap-duotone" class="size-8 text-white" />
            </div>
            <h4 class="text-muted-800 mb-2 text-lg font-semibold dark:text-white">
              راهنمای مناسب برای شما را انتخاب کنید
            </h4>
            <p class="text-muted-500 dark:text-muted-400 text-sm">
              با کلیک روی هر راهنما، آموزش تعاملی آن شروع خواهد شد
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="tour in availableTours"
            :key="tour.id"
            class="from-muted-50 to-muted-100 dark:from-muted-800 dark:to-muted-700 border-muted-200 dark:border-muted-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-primary-500/10 tour-card-mobile group relative cursor-pointer overflow-hidden rounded-2xl border bg-gradient-to-r transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            @click="startSelectedTour(tour.id)"
          >
            <div class="flex items-center justify-between p-5">
              <div class="flex items-center gap-4">
                <div class="from-primary-500 to-primary-600 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Icon name="ph:play-fill" class="size-5 text-white" />
                </div>
                <div>
                  <h4 class="text-muted-900 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1 text-base font-semibold transition-colors dark:text-white">
                    {{ tour.name }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <Icon name="ph:steps" class="text-muted-400 size-3" />
                      <span class="text-muted-500 dark:text-muted-400 text-sm">{{ tour.steps.length }} مرحله</span>
                    </div>
                    <span class="text-muted-300 dark:text-muted-600">•</span>
                    <div class="flex items-center gap-1">
                      <Icon name="ph:clock" class="text-muted-400 size-3" />
                      <span class="text-muted-500 dark:text-muted-400 text-sm">{{ Math.ceil(tour.steps.length * 0.5) }} دقیقه</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <div class="bg-primary-100 dark:bg-primary-900 flex size-8 items-center justify-center rounded-lg">
                  <Icon name="ph:arrow-left" class="text-primary-600 dark:text-primary-400 size-4" />
                </div>
              </div>
            </div>

            <!-- Hover gradient overlay -->
            <div class="from-primary-500/5 shimmer-effect pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>

        <div class="border-muted-200 dark:border-muted-700 mt-8 border-t pt-6">
          <div class="flex gap-3">
            <BaseButton
              variant="outline"
              color="muted"
              class="h-12 flex-1"
              shape="curved"
              @click="resetAllToursAndClose"
            >
              <Icon name="ph:arrow-clockwise-duotone" class="mr-2 size-4" />
              <span>بازنشانی همه راهنماها</span>
            </BaseButton>
            <BaseButton
              color="primary"
              class="h-12 flex-1"
              shape="curved"
              @click="closeModal"
            >
              <Icon name="ph:x" class="mr-2 size-4" />
              <span>بستن</span>
            </BaseButton>
          </div>

          <div class="mt-4 text-center">
            <p class="text-muted-400 text-xs">
              می‌توانید در هر زمان با کلیک روی دکمه راهنما، این پنجره را مجدداً باز کنید
            </p>
          </div>
        </div>
      </div>
    </TairoModal>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showFloatingButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFloatingButton: true,
})

const { tours, startTour, resetAllTours } = useTour()
const isModalOpen = ref(false)

// Available tours for current page
const availableTours = computed(() => {
  // You can filter tours based on current route
  const route = useRoute()

  if (route.path === '/dashboard') {
    return tours.filter(tour => tour.id === 'dashboard')
  }

  if (route.path.includes('onboarding')) {
    return tours.filter(tour => tour.id === 'onboarding')
  }

  if (route.path.includes('therapists/sessions')) {
    return tours.filter(tour => tour.id === 'sessions')
  }

  if (route.path.includes('therapists')) {
    return tours.filter(tour => ['therapist-selection', 'session-management'].includes(tour.id))
  }

  return tours
})

const openTourModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const startSelectedTour = (tourId: string) => {
  closeModal()
  nextTick(() => {
    startTour(tourId)
  })
}

const resetAllToursAndClose = () => {
  resetAllTours()
  closeModal()

  // Show success message
  const toaster = useToaster()
  toaster.show({
    title: 'بازنشانی موفق',
    message: 'همه راهنماها بازنشانی شدند',
    color: 'success',
    icon: 'ph:check',
    closable: true,
  })
}

// Component is ready - no auto start
</script>

<style scoped>
.tour-button-container {
  position: relative;
}

/* Floating button animations */
.tour-button-container button {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Hover effect for tour cards */
.group:hover .absolute {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
}

/* Custom scrollbar for modal content */
.tour-modal-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.tour-modal-content::-webkit-scrollbar {
  width: 6px;
}

.tour-modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.tour-modal-content::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.tour-modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tour-button-container button {
    bottom: 20px;
    left: 20px;
    padding: 12px;
  }

  /* Make tour cards stack better on mobile */
  .tour-card-mobile {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* Enhanced focus states */
.tour-button-container button:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, transform, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom gradient animations */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.group:hover .shimmer-effect {
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
</style>
