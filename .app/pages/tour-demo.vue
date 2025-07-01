 <template>
  <div>
    <TairoContentWrapper>
      <div class="mb-6">
        <BaseHeading
          tag="h1"
          size="xl"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          نمایشگاه سیستم راهنما
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400 mt-2">
          اینجا می‌توانید تمام راهنماهای موجود را تست کنید
        </BaseParagraph>
      </div>

      <!-- Tour Controls -->
      <div class="mb-8">
        <BaseCard class="p-6">
          <BaseHeading
            tag="h2"
            size="lg"
            weight="medium"
            class="text-muted-800 dark:text-white mb-4"
          >
            کنترل راهنماها
          </BaseHeading>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="tour in tours"
              :key="tour.id"
              class="p-4 bg-muted-50 dark:bg-muted-800 rounded-lg"
            >
              <div class="flex items-center justify-between mb-3">
                <BaseHeading
                  tag="h3"
                  size="sm"
                  weight="medium"
                  class="text-muted-800 dark:text-white"
                >
                  {{ tour.name }}
                </BaseHeading>
                <BaseTag
                  :color="hasSeen(tour.id) ? 'success' : 'muted'"
                  size="sm"
                >
                  {{ hasSeen(tour.id) ? 'دیده شده' : 'جدید' }}
                </BaseTag>
              </div>
              
              <BaseParagraph
                size="xs"
                class="text-muted-500 dark:text-muted-400 mb-4"
              >
                {{ tour.steps.length }} مرحله
              </BaseParagraph>
              
              <div class="flex gap-2">
                <BaseButton
                  size="sm"
                  color="primary"
                  @click="startTour(tour.id)"
                >
                  شروع راهنما
                </BaseButton>
                <BaseButton
                  v-if="hasSeen(tour.id)"
                  size="sm"
                  color="muted"
                  @click="resetTour(tour.id)"
                >
                  بازنشانی
                </BaseButton>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton
              color="danger"
              variant="outline"
              @click="resetAllToursWithConfirm"
            >
              <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" />
              بازنشانی همه راهنماها
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Sample Elements for Testing -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Dashboard Elements -->
        <BaseCard class="p-6">
          <BaseHeading
            tag="h2"
            size="lg"
            weight="medium"
            class="text-muted-800 dark:text-white mb-4"
            data-tour="welcome-section"
          >
            🏠 بخش خوش‌آمدگویی
          </BaseHeading>
          
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg" data-tour="statistics">
              <Icon name="ph:chart-bar" class="w-8 h-8 text-primary-500" />
              <div>
                <BaseHeading tag="h3" size="sm" weight="medium">آمار و ارقام</BaseHeading>
                <BaseParagraph size="xs" class="text-muted-500">نمایش آمار فعالیت‌ها</BaseParagraph>
              </div>
            </div>
            
            <div class="flex gap-2" data-tour="quick-actions">
              <BaseButton
                size="sm"
                color="primary"
                data-tour="therapists-button"
              >
                <Icon name="ph:robot" class="w-4 h-4 mr-2" />
                روانشناسان هوش مصنوعی
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Onboarding Elements -->
        <BaseCard class="p-6">
          <BaseHeading
            tag="h2"
            size="lg"
            weight="medium"
            class="text-muted-800 dark:text-white mb-4"
            data-tour="welcome"
          >
            🎉 بخش پرداخت
          </BaseHeading>
          
          <div class="space-y-4">
            <div class="flex gap-2" data-tour="payment-options">
              <BaseButton
                size="sm"
                color="success"
                data-tour="payment-button"
              >
                💎 پرداخت اشتراک
              </BaseButton>
              <BaseButton
                size="sm"
                color="muted"
                data-tour="coupon-button"
              >
                🎟️ کد تخفیف
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Additional Test Elements -->
      <BaseCard class="p-6 mb-6" data-tour="new-features">
        <BaseHeading
          tag="h2"
          size="lg"
          weight="medium"
          class="text-muted-800 dark:text-white mb-4"
        >
          ✨ امکانات جدید
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400">
          این بخش برای نمایش امکانات جدید در نظر گرفته شده است.
        </BaseParagraph>
      </BaseCard>

      <BaseCard class="p-6" data-tour="video-section">
        <BaseHeading
          tag="h2"
          size="lg"
          weight="medium"
          class="text-muted-800 dark:text-white mb-4"
        >
          🎥 ویدئوهای آموزشی
        </BaseHeading>
        <BaseParagraph class="text-muted-500 dark:text-muted-400">
          ویدئوهای آموزشی و محتوای مفید در این بخش قرار دارد.
        </BaseParagraph>
      </BaseCard>

      <!-- Single Element Highlight Test -->
      <div class="mt-8">
        <BaseButton
          color="info"
          @click="testHighlight"
        >
          <Icon name="ph:lightbulb" class="w-4 h-4 mr-2" />
          تست هایلایت تک المان
        </BaseButton>
      </div>
    </TairoContentWrapper>

    <!-- Tour Button Component -->
    <TourButton />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'تست سیستم راهنما',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { tours, startTour, hasSeen, resetTour, resetAllTours, highlight } = useTour()
const toaster = useToaster()

// Reset all tours with confirmation
const resetAllToursWithConfirm = () => {
  resetAllTours()
  toaster.show({
    title: 'بازنشانی موفق',
    message: 'همه راهنماها بازنشانی شدند',
    color: 'success',
    icon: 'ph:check',
    closable: true,
  })
}

// Test single element highlight
const testHighlight = () => {
  highlight('[data-tour="video-section"]', {
    title: 'تست هایلایت',
    description: 'این یک تست برای هایلایت کردن یک المان است.',
    side: 'top'
  })
}
</script> 