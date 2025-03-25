<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta } from '#imports'
import { useDiscountCoupon } from '~/composables/useDiscountCoupon'
import { useClipboard } from '@vueuse/core'
import type { Deed } from '~/composables/useDeed'

definePageMeta({
  title: 'جزئیات عمل نیک',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const id = route.params.id as string
const { getDeed, updateDeed } = useDeed()
const { createCoupon } = useDiscountCoupon()
const { copy } = useClipboard()
const toaster = useToaster()

// Initialize deed with default values
const deed = ref<Deed>({
  id: '',
  emoji: '',
  title: '',
  description: '',
  shortDescription: '',
  longDescription: '',
  type: 'family',
  status: 'pending',
  author: '',
  approvedBy: '',
  approvedAt: '',
  views: 0,
  completions: 0,
  category_deed: '',
  tags: [],
  difficulty: 'simple',
  timeRequired: 'below_15',
})

const loading = ref(true)
const error = ref<Error | null>(null)
const showDiscountModal = ref(false)
const discountCode = ref<string | null>(null)
const discountError = ref<string | null>(null)
const showSuccessModal = ref(false)

// Convert HTML content to markdown
const convertHtmlToMarkdown = (html: string) => {
  if (!html) return ''

  return html
    // Convert divs with # to headings
    .replace(/<div>#+ ([^<]+)<\/div>/g, (_, title) => `# ${title}\n`)
    .replace(/<div>##+ ([^<]+)<\/div>/g, (_, title) => `## ${title}\n`)
    // Convert lists
    .replace(/<div>&nbsp; &nbsp;\* ([^<]+)<\/div>/g, (_, item) => `* ${item}\n`)
    .replace(/<div>\d+\. ([^<]+)<\/div>/g, (_, item) => `1. ${item}\n`)
    // Convert regular divs to paragraphs
    .replace(/<div>([^<]+)<\/div>/g, (_, text) => `${text}\n`)
    // Clean up
    .replace(/<br>/g, '\n')
    .replace(/&zwnj;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()
}

interface Deed {
  emoji: string
  title: string
  shortDescription: string
  description: string
  longDescription: string
  type: 'family' | 'society' | 'spiritual'
  status: 'draft' | 'pending' | 'approved' | 'reject'
  author: string
  approvedBy: string
  approvedAt: string
  views: number
  completions: number
  tags: string[]
  difficulty: 'simple' | 'moderate' | 'hard'
  timeRequired: 'below_15' | 'between_15_60' | 'more_60'
}

const statusMap = {
  draft: 'پیش‌نویس',
  pending: 'در انتظار تایید',
  approved: 'تایید شده',
  reject: 'رد شده',
}

const typeMap = {
  family: 'خانواده',
  society: 'اجتماعی',
  spiritual: 'معنوی',
}

const difficultyMap = {
  simple: 'ساده',
  moderate: 'متوسط',
  hard: 'چالش‌برانگیز',
}

const timeMap = {
  below_15: 'کمتر از ۱۵ دقیقه',
  between_15_60: '۱۵ تا ۶۰ دقیقه',
  more_60: 'بیش از ۶۰ دقیقه',
}

// Add duration map based on timeRequired
const durationMap = {
  below_15: 15,
  between_15_60: 60,
  more_60: 120,
}

onMounted(async () => {
  try {
    const data = await getDeed(id)
    if (data) {
      // Update all properties
      deed.value = {
        ...deed.value,
        ...data,
        // Ensure these are always numbers
        views: Number(data.views) || 0,
        completions: Number(data.completions) || 0,
      }
      // Increment views
      updateDeed(id, { views: deed.value.views + 1 })
    }
    else {
      error.value = 'کار نیک مورد نظر یافت نشد'
    }
  }
  catch (e: any) {
    error.value = e.message || 'خطا در بارگذاری اطلاعات'
  }
  finally {
    loading.value = false
  }
})

const formattedDate = computed(() => {
  return new Date(deed.value.approvedAt).toLocaleDateString('fa-IR')
})

const statusColor = computed(() => {
  switch (deed.value.status) {
    case 'approved':
      return 'success'
    case 'pending':
      return 'warning'
    case 'reject':
      return 'danger'
    default:
      return 'info'
  }
})

const handleDiscountRequest = async () => {
  try {
    // Generate code
    const code = 'DEED-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    discountCode.value = code

    // Create coupon
    await createCoupon({
      code,
      amount: 100000,
      isUsed: false,
      duration: durationMap[deed.value.timeRequired] || 60,
    })

    // Update deed completions
    await updateDeed(id, { completions: (deed.value.completions || 0) + 1 })
    deed.value.completions++

    showDiscountModal.value = false
    showSuccessModal.value = true
  }
  catch (e: any) {
    discountError.value = e.message || 'خطا در درخواست کد تخفیف'
  }
}

const copyCode = async () => {
  if (discountCode.value) {
    await copy(discountCode.value)
    toaster.clearAll()
    toaster.show({
      title: 'کپی شد',
      message: 'کد تخفیف با موفقیت کپی شد',
      color: 'success',
      icon: 'ph:copy',
      closable: true,
      classes: 'z-[60]', // Higher than modal overlay which is usually z-50
    })
  }
}

const formatLongDescription = (html: string) => {
  return convertHtmlToMarkdown(html)
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/deeds/list" class="text-primary-500 hover:text-primary-600">
          <Icon name="ph:arrow-right" class="size-6" />
        </NuxtLink>
        <BaseHeading
          tag="h1"
          size="2xl"
          weight="medium"
          class="text-muted-800 dark:text-white"
        >
          کارهای نیک
        </BaseHeading>
      </div>
    </div>

    <!-- Loading State -->
    <template v-if="loading">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <BaseCard rounded="lg" class="mb-6">
            <div class="relative">
              <!-- Status Badge -->
              <div class="absolute left-4 top-4 flex flex-col justify-end">
                <div class="text-left">
                  <div class="nui-placeload animate-nui-placeload h-8 w-24 rounded-full" />
                </div>
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 pt-3">
                  <div
                    v-for="n in 3"
                    :key="n"
                    class="nui-placeload animate-nui-placeload h-6 w-16 rounded-lg"
                  />
                </div>
              </div>

              <!-- Main Content -->
              <div class="p-6">
                <div class="mb-8 flex items-start gap-6">
                  <div class="nui-placeload animate-nui-placeload size-20 rounded-xl" />
                  <div class="grow space-y-4">
                    <div class="nui-placeload animate-nui-placeload h-8 w-3/4 rounded-lg" />
                    <div class="nui-placeload animate-nui-placeload h-6 w-1/2 rounded-lg" />
                  </div>
                </div>

                <!-- Description -->
                <div class="mb-6 space-y-8">
                  <!-- Main Description -->
                  <div class="bg-muted-50 dark:bg-muted-800/50 rounded-xl p-6">
                    <div class="mb-4 flex items-center gap-2">
                      <div class="nui-placeload animate-nui-placeload size-5 rounded-full" />
                      <div class="nui-placeload animate-nui-placeload h-6 w-24 rounded-lg" />
                    </div>
                    <div class="space-y-3">
                      <div class="nui-placeload animate-nui-placeload h-4 w-full rounded-lg" />
                      <div class="nui-placeload animate-nui-placeload h-4 w-full rounded-lg" />
                      <div class="nui-placeload animate-nui-placeload h-4 w-3/4 rounded-lg" />
                    </div>
                  </div>

                  <!-- Additional Info -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <!-- Stats -->
                    <div class="bg-muted-50 dark:bg-muted-800/50 rounded-xl p-6">
                      <div class="mb-4 flex items-center gap-2">
                        <div class="nui-placeload animate-nui-placeload size-5 rounded-full" />
                        <div class="nui-placeload animate-nui-placeload h-6 w-24 rounded-lg" />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="dark:bg-muted-800 rounded-lg bg-white p-4">
                          <div class="nui-placeload animate-nui-placeload mb-2 h-4 w-16 rounded-lg" />
                          <div class="nui-placeload animate-nui-placeload h-8 w-12 rounded-lg" />
                        </div>
                        <div class="dark:bg-muted-800 rounded-lg bg-white p-4">
                          <div class="nui-placeload animate-nui-placeload mb-2 h-4 w-16 rounded-lg" />
                          <div class="nui-placeload animate-nui-placeload h-8 w-12 rounded-lg" />
                        </div>
                      </div>
                    </div>

                    <!-- Requirements -->
                    <div class="bg-muted-50 dark:bg-muted-800/50 rounded-xl p-6">
                      <div class="mb-4 flex items-center gap-2">
                        <div class="nui-placeload animate-nui-placeload size-5 rounded-full" />
                        <div class="nui-placeload animate-nui-placeload h-6 w-24 rounded-lg" />
                      </div>
                      <div class="space-y-4">
                        <div class="flex items-center gap-3">
                          <div class="nui-placeload animate-nui-placeload size-5 rounded-full" />
                          <div class="nui-placeload animate-nui-placeload h-4 w-32 rounded-lg" />
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="nui-placeload animate-nui-placeload size-5 rounded-full" />
                          <div class="nui-placeload animate-nui-placeload h-4 w-24 rounded-lg" />
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="nui-placeload animate-nui-placeload size-5 rounded-full" />
                          <div class="nui-placeload animate-nui-placeload h-4 w-28 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Action Buttons -->
          <BaseCard rounded="lg" class="mb-6">
            <div class="space-y-3 p-6">
              <div class="nui-placeload animate-nui-placeload h-10 w-full rounded-lg" />
            </div>
          </BaseCard>

          <!-- Info Card -->
          <BaseCard rounded="lg">
            <div class="divide-muted-200 dark:divide-muted-700 divide-y">
              <div
                v-for="n in 5"
                :key="n"
                class="p-4"
              >
                <div class="nui-placeload animate-nui-placeload mb-3 h-4 w-24 rounded-lg" />
                <div class="flex items-center gap-2">
                  <div class="nui-placeload animate-nui-placeload size-5 rounded-full" />
                  <div class="nui-placeload animate-nui-placeload h-4 w-32 rounded-lg" />
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-else-if="error" class="bg-danger-50 dark:bg-danger-500/20 text-danger-500 rounded-lg p-4 text-center">
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <BaseCard rounded="lg" class="mb-6">
          <div class="relative">
            <!-- Status Badge -->
            <div v-if="deed" class="absolute left-4 top-4 flex flex-col justify-end">
              <div class="text-left">
                <BaseTag
                  :color="statusColor"
                  rounded="full"
                  class="px-4"
                >
                  {{ statusMap[deed.status] }}
                </BaseTag>
              </div>
              <!-- Tags -->
              <div v-if="deed.tags?.length" class="flex flex-wrap gap-2 pt-3">
                <BaseTag
                  v-for="tag in deed.tags"
                  :key="tag"
                  color="default"
                  rounded="lg"
                >
                  {{ tag }}
                </BaseTag>
              </div>
            </div>

            <!-- Main Content -->
            <div class="p-6">
              <div v-if="deed" class="mb-8 flex items-start gap-6">
                <div class="bg-primary-100 dark:bg-primary-500/20 flex size-20 shrink-0 items-center justify-center rounded-xl text-4xl">
                  {{ deed.emoji }}
                </div>
                <div class="grow">
                  <BaseHeading
                    tag="h1"
                    size="2xl"
                    weight="medium"
                    class="text-muted-800 mb-2 dark:text-white"
                  >
                    {{ deed.title }}
                  </BaseHeading>
                  <p class="text-muted-400 text-lg">
                    {{ deed.shortDescription }}
                  </p>
                </div>
              </div>

              <!-- Description -->
              <div v-if="deed" class="mb-6 space-y-8">
                <!-- Main Description -->
                <div class="bg-muted-50 dark:bg-muted-800/50 rounded-xl p-6">
                  <div class="mb-4 flex items-center gap-2">
                    <Icon name="ph:article" class="text-primary-500 size-5" />
                    <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                      توضیحات
                    </h3>
                  </div>
                  <p class="text-muted-500 dark:text-muted-400 leading-relaxed">
                    {{ deed.description }}
                  </p>
                </div>

                <!-- Detailed Description -->
                <div class="border-muted-200 dark:border-muted-700 rounded-xl border p-6">
                  <div class="mb-4 flex items-center gap-2">
                    <Icon name="ph:list-bullets" class="text-primary-500 size-5" />
                    <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                      جزئیات بیشتر
                    </h3>
                  </div>
                  <div class="prose prose-sm dark:prose-invert prose-headings:mb-4 prose-ul:list-disc prose-ol:list-decimal prose-li:mr-4 rtl max-w-none">
                    <div
                      v-if="deed.longDescription"
                      class="text-muted-500 dark:text-muted-400 leading-relaxed"
                    >
                      <AddonMarkdownRemark :source="formatLongDescription(deed.longDescription)" />
                    </div>
                    <div v-else class="text-muted-500">
                      توضیحات تکمیلی موجود نیست
                    </div>
                  </div>
                </div>

                <!-- Additional Info -->
                <div class="grid gap-6 md:grid-cols-2">
                  <!-- Stats -->
                  <div class="bg-muted-50 dark:bg-muted-800/50 rounded-xl p-6">
                    <div class="mb-4 flex items-center gap-2">
                      <Icon name="ph:chart-line" class="text-primary-500 size-5" />
                      <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                        آمار
                      </h3>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="dark:bg-muted-800 rounded-lg bg-white p-4">
                        <div class="text-muted-400 mb-1 text-sm">
                          بازدید
                        </div>
                        <div class="text-2xl font-semibold">
                          {{ deed.views }}
                        </div>
                      </div>
                      <div class="dark:bg-muted-800 rounded-lg bg-white p-4">
                        <div class="text-muted-400 mb-1 text-sm">
                          تکمیل شده
                        </div>
                        <div class="text-2xl font-semibold">
                          {{ deed.completions }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Requirements -->
                  <div class="bg-muted-50 dark:bg-muted-800/50 rounded-xl p-6">
                    <div class="mb-4 flex items-center gap-2">
                      <Icon name="ph:info" class="text-primary-500 size-5" />
                      <h3 class="text-muted-800 text-lg font-medium dark:text-white">
                        نیازمندی‌ها
                      </h3>
                    </div>
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <Icon name="ph:clock" class="text-primary-500" />
                        <span>{{ timeMap[deed.timeRequired] }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <Icon name="ph:gauge" class="text-primary-500" />
                        <span>{{ difficultyMap[deed.difficulty] }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <Icon name="ph:folder" class="text-primary-500" />
                        <span>{{ typeMap[deed.type] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div v-if="deed" class="lg:col-span-1">
        <!-- Action Buttons -->
        <BaseCard rounded="lg" class="mb-6">
          <div class="space-y-3 p-6">
            <BaseButton
              color="success"
              class="w-full"
              rounded="lg"
              @click="showDiscountModal = true"
            >
              <Icon name="ph:ticket" class="me-2" />
              درخواست کد تخفیف
            </BaseButton>
          </div>
        </BaseCard>

        <!-- Info Card -->
        <BaseCard rounded="lg">
          <div class="divide-muted-200 dark:divide-muted-700 divide-y">
            <div class="p-4">
              <h3 class="text-muted-400 mb-2 text-sm font-medium">
                نوع کار نیک
              </h3>
              <div class="flex items-center gap-2">
                <Icon name="ph:folder-simple" class="text-primary-500" />
                <span>{{ typeMap[deed.type] }}</span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-muted-400 mb-2 text-sm font-medium">
                سطح دشواری
              </h3>
              <div class="flex items-center gap-2">
                <Icon name="ph:gauge" class="text-primary-500" />
                <span>{{ difficultyMap[deed.difficulty] }}</span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-muted-400 mb-2 text-sm font-medium">
                زمان مورد نیاز
              </h3>
              <div class="flex items-center gap-2">
                <Icon name="ph:clock" class="text-primary-500" />
                <span>{{ timeMap[deed.timeRequired] }}</span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-muted-400 mb-2 text-sm font-medium">
                تاریخ تایید
              </h3>
              <div class="flex items-center gap-2">
                <Icon name="ph:calendar" class="text-primary-500" />
                <span>{{ formattedDate }}</span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-muted-400 mb-2 text-sm font-medium">
                آمار کلی
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-3">
                  <div class="text-muted-400 mb-1 text-xs">
                    بازدید
                  </div>
                  <div class="font-semibold">
                    {{ deed.views }}
                  </div>
                </div>
                <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-3">
                  <div class="text-muted-400 mb-1 text-xs">
                    تکمیل شده
                  </div>
                  <div class="font-semibold">
                    {{ deed.completions }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>

  <!-- Discount Warning Modal -->
  <TairoModal
    :open="showDiscountModal"
    size="md"
    @close="showDiscountModal = false"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          تایید صداقت
        </h3>
        <BaseButtonClose @click="showDiscountModal = false" />
      </div>
    </template>

    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24 justify-center">
          <Icon
            name="ph:scales-duotone"
            class="text-warning-500 size-24"
          />
        </div>

        <h3 class="font-heading text-muted-800 mb-3 text-lg font-medium leading-6 dark:text-white">
          تعهد به راستگویی
        </h3>

        <p class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-6">
          برای دریافت کد تخفیف، لازم است تایید کنید که این کار نیک را به طور کامل انجام داده‌اید.
        </p>

        <p class="font-alt text-muted-500 dark:text-muted-400 mt-2 text-sm leading-6">
          اعتماد متقابل، پایه‌ی اصلی فعالیت‌های ما است. لطفاً با صداقت و درستکاری خود، به حفظ این اعتماد کمک کنید.
        </p>

        <p v-if="discountError" class="text-danger-500 mt-3 text-sm">
          {{ discountError }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex gap-x-2">
          <BaseButton @click="showDiscountModal = false">
            انصراف
          </BaseButton>

          <BaseButton
            color="primary"
            variant="solid"
            @click="handleDiscountRequest"
          >
            تایید می‌کنم
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>

  <!-- Success Modal -->
  <TairoModal
    :open="showSuccessModal"
    size="sm"
    @close="showSuccessModal = false"
  >
    <template #header>
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
          کد تخفیف شما
        </h3>
        <BaseButtonClose @click="showSuccessModal = false" />
      </div>
    </template>

    <div class="p-4 md:p-6">
      <div class="mx-auto w-full max-w-xs text-center">
        <div class="relative mx-auto mb-4 flex size-24 justify-center">
          <Icon
            name="ph:ticket-duotone"
            class="text-success-500 size-24"
          />
        </div>

        <div class="bg-muted-100 dark:bg-muted-800 mb-4 rounded-lg p-4 text-center">
          <div class="flex items-center justify-center gap-2">
            <span class="font-mono text-xl font-bold">{{ discountCode }}</span>
            <BaseButtonIcon
              color="primary"
              rounded="full"
              @click="copyCode"
            >
              <Icon name="ph:copy" class="size-5" />
            </BaseButtonIcon>
          </div>
        </div>

        <p class="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5">
          این کد را در صفحه پرداخت وارد نمایید تا تخفیف شما اعمال شود.
        </p>
      </div>
    </div>

    <template #footer>
      <div class="p-4 md:p-6">
        <div class="flex justify-end gap-x-2">
          <BaseButton
            color="primary"
            variant="solid"
            @click="showSuccessModal = false"
          >
            متوجه شدم
          </BaseButton>
          <BaseButton
            color="success"
            variant="solid"
            @click="navigateTo('/onboarding')"
          >
            رفتن به صفحه پرداخت
          </BaseButton>
        </div>
      </div>
    </template>
  </TairoModal>
</template>

<style>
.long-description {
  @apply space-y-6 text-muted-500 dark:text-muted-400 leading-relaxed;
}

.long-description div:has(> div:first-child:contains('#')) {
  @apply text-muted-800 dark:text-white font-medium text-lg;
}

.long-description div:has(> div:first-child:contains('##')) {
  @apply text-muted-800 dark:text-white font-medium text-base;
}

.long-description div:has(> div:contains('*')) {
  @apply mr-4;
}

.long-description div:has(> div:contains('1.')) {
  @apply mr-4;
}

.long-description br {
  @apply hidden;
}

.long-description div:has(> div:empty) {
  @apply hidden;
}
</style>
