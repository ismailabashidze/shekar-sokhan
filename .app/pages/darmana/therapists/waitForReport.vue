<script setup lang="ts">
import HorizontalSideBar from '~/components/global/HorizontalSideBar.vue'
import { useSessionAnalysis } from '~/composables/useSessionAnalysis'
import { ref, onMounted, onUnmounted } from 'vue'
import { navigateTo } from '#imports'

definePageMeta({
  title: 'در حال آماده سازی گزارش',
  // layout: 'sidebar',
  layout: 'empty',
  preview: {
    title: 'در حال آماده سازی گزارش',
    description: 'گزارش جلسه در حال آماده سازی است. لطفا صبر کنید.',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-notifications.png',
    srcDark: '/img/screens/layouts-subpages-notifications-dark.png',
    order: 80,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { getAnalysisForSession } = useSessionAnalysis()
const toaster = useToaster()
const isModalOpen = ref(false)
const analysisId = ref('')
const isLoading = ref(true)
const checkInterval = ref(null)
const sessionId = ref('')

onMounted(async () => {
  // Get session ID from localStorage
  sessionId.value = localStorage.getItem('pendingAnalysisSessionId')

  if (!sessionId.value) {
    toaster.show({
      title: 'خطا',
      message: 'اطلاعات جلسه یافت نشد. لطفا دوباره تلاش کنید.',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
    isLoading.value = false
    return
  }

  // Start checking for analysis
  checkForAnalysis()

  // Set up interval to check every 5 seconds
  checkInterval.value = setInterval(checkForAnalysis, 5000)
})

onUnmounted(() => {
  // Clear interval when component is unmounted
  if (checkInterval.value) {
    clearInterval(checkInterval.value)
  }
})

const checkForAnalysis = async () => {
  if (!sessionId.value) return

  try {
    // Check if analysis exists for this session
    const analysis = await getAnalysisForSession(sessionId.value)

    if (analysis && analysis.id) {
      // Analysis is ready
      analysisId.value = analysis.id
      isLoading.value = false

      // Clear interval
      if (checkInterval.value) {
        clearInterval(checkInterval.value)
        checkInterval.value = null
      }

      // Show modal
      isModalOpen.value = true

      // Clear localStorage
      localStorage.removeItem('pendingAnalysisSessionId')
    }
  }
  catch (error) {
    console.error('Error checking for analysis:', error)
  }
}

const goToAnalysis = () => {
  if (analysisId.value) {
    navigateTo(`/darmana/therapists/analysis?analysis_id=${analysisId.value}`)
  }
}
</script>

<template>
  <div class="flex flex-col md:flex-row">
    <VerticalSideBar />
    <HorizontalSideBar />
    <div class="grow">
      <FullscreenLoading v-if="isLoading" loader-type="user" />
      <div class="m-5">
        <BaseMessage color="primary" class="align-center justify-center">
          <div class="m-3 text-center text-lg">
            هوش مصنوعی در حال طراحی گزارش شماست. به محض آماده شدن، از طریق پیامک، رایانامه و پیام درون برنامه ای به شما اطلاع رسانی خواهد شد.
          </div>
        </BaseMessage>
      </div>

      <!-- Modal for analysis ready notification -->
      <TairoModal :open="isModalOpen" size="sm">
        <template #header>
          <div class="flex w-full items-center justify-between p-4 md:p-6">
            <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              گزارش آماده است
            </h3>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="text-muted-400 hover:text-muted-600 dark:text-muted-400 dark:hover:text-muted-200 flex size-9 items-center justify-center"
                @click="isModalOpen = false"
              >
                <Icon name="lucide:x" class="size-6" />
              </button>
            </div>
          </div>
        </template>
        <div class="p-4 md:p-6">
          <div class="text-center">
            <div class="bg-success-50 dark:bg-success-500/20 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:check-circle-fill" class="text-success-500 size-6" />
            </div>
            <h3 class="text-muted-800 dark:text-muted-100 mb-1 text-lg font-medium">
              گزارش تحلیلی جلسه آماده شد
            </h3>
            <p class="text-muted-500 dark:text-muted-400 mb-6">
              گزارش تحلیلی جلسه شما با موفقیت ساخته شد و آماده مشاهده است.
            </p>
            <div class="flex justify-center">
              <BaseButton color="primary" @click="goToAnalysis">
                مشاهده گزارش
              </BaseButton>
            </div>
          </div>
        </div>
      </TairoModal>
    </div>
  </div>
</template>
