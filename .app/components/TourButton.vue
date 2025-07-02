<template>
  <div class="tour-button-container">
    <!-- Floating Help Button -->
    <button
      v-if="showFloatingButton"
      @click="openTourModal"
      class="fixed bottom-6 left-6 z-50 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      title="راهنما"
    >
      <Icon name="ph:question" class="w-6 h-6" />
    </button>

    <!-- Tour Selection Modal -->
    <TairoModal
      :open="isModalOpen"
      size="md"
      @close="closeModal"
    >
      <template #header>
        <div class="flex items-center justify-between p-6 border-b border-muted-200 dark:border-muted-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
              <Icon name="ph:compass-duotone" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 class="font-heading text-muted-900 text-xl font-bold leading-6 dark:text-white">
                راهنمای آموزشی
              </h3>
              <p class="text-muted-500 dark:text-muted-400 text-sm mt-1">
                آموزش گام به گام استفاده از سیستم
              </p>
            </div>
          </div>
          <BaseButtonClose @click="closeModal" />
        </div>
      </template>

      <div class="p-6 tour-modal-content">
        <div class="mb-8">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
              <Icon name="ph:graduation-cap-duotone" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-2">
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
            class="group relative overflow-hidden bg-gradient-to-r from-muted-50 to-muted-100 dark:from-muted-800 dark:to-muted-700 rounded-2xl border border-muted-200 dark:border-muted-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary-500/10 hover:scale-[1.02] tour-card-mobile"
            @click="startSelectedTour(tour.id)"
          >
            <div class="flex items-center justify-between p-5">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon name="ph:play-fill" class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 class="font-semibold text-muted-900 dark:text-white text-base mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ tour.name }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <Icon name="ph:steps" class="w-3 h-3 text-muted-400" />
                      <span class="text-sm text-muted-500 dark:text-muted-400">{{ tour.steps.length }} مرحله</span>
                    </div>
                    <span class="text-muted-300 dark:text-muted-600">•</span>
                    <div class="flex items-center gap-1">
                      <Icon name="ph:clock" class="w-3 h-3 text-muted-400" />
                      <span class="text-sm text-muted-500 dark:text-muted-400">{{ Math.ceil(tour.steps.length * 0.5) }} دقیقه</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <Icon name="ph:arrow-left" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>
            
            <!-- Hover gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shimmer-effect"></div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-muted-200 dark:border-muted-700">
          <div class="flex gap-3">
            <BaseButton
              @click="resetAllToursAndClose"
              variant="outline"
              color="muted"
              class="flex-1 h-12"
              shape="curved"
            >
              <Icon name="ph:arrow-clockwise-duotone" class="w-4 h-4 mr-2" />
              <span>بازنشانی همه راهنماها</span>
            </BaseButton>
            <BaseButton
              @click="closeModal"
              color="primary"
              class="flex-1 h-12"
              shape="curved"
            >
              <Icon name="ph:x" class="w-4 h-4 mr-2" />
              <span>بستن</span>
            </BaseButton>
          </div>
          
          <div class="mt-4 text-center">
            <p class="text-xs text-muted-400">
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
  showFloatingButton: true
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