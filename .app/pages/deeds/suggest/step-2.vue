<script setup lang="ts">
import type { DeedCategory } from '~/composables/useDeedCategory'
import type { Deed } from '~/composables/useDeed'

definePageMeta({
  title: 'پیشنهاد کار نیک - مرحله ۲',
  preview: {
    title: 'پیشنهاد کار نیک - مرحله ۲',
    description: 'برای پیشنهاد کارهای نیک',
    categories: ['dashboards', 'wizards', 'forms'],
    src: '/img/screens/wizard-2.png',
    srcDark: '/img/screens/wizard-2-dark.png',
    order: 31,
  },
})
useHead({
  title: 'انتخاب دسته‌بندی',
  htmlAttrs: { dir: 'rtl' },
})

const { deed } = useDeed()
const { getCategories } = useDeedCategory()

const categories = ref<DeedCategory[]>([])
const selectedCategory = ref('')

onMounted(async () => {
  categories.value = await getCategories()
})

function onSubmit() {
  deed.value.category_deed = selectedCategory.value
  navigateTo('/deeds/suggest/step-3')
}
</script>

<template>
  <div>
    <DemoWizardStepTitle />

    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4">
      <div class="flex items-center justify-between">
        <BaseHeading
          as="h3"
          size="sm"
          weight="medium"
          class="text-muted-800 dark:text-muted-100"
        >
          <span>انتخاب دسته‌بندی</span>
        </BaseHeading>
        <BaseButton
          to="/deeds/categories/new"
          color="primary"
          rounded="lg"
        >
          دسته‌بندی جدید
        </BaseButton>
      </div>

      <div v-if="categories.length === 0" class="text-center">
        <BaseParagraph size="sm" class="text-muted-400">
          هنوز دسته‌بندی‌ای ایجاد نشده است. برای شروع یک دسته‌بندی جدید ایجاد کنید.
        </BaseParagraph>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="category in categories"
          :key="category.title"
          class="relative"
        >
          <input
            :id="category.title"
            v-model="selectedCategory"
            type="radio"
            :value="category.title"
            name="category"
            class="peer absolute start-0 top-0 z-20 size-full cursor-pointer opacity-0"
          >
          <label
            :for="category.title"
            class="hover:bg-muted-50 peer-checked:border-primary-500 dark:border-muted-600 dark:bg-muted-700 dark:hover:bg-muted-600 dark:peer-checked:border-primary-500 relative block w-full cursor-pointer rounded-xl border bg-white p-4 peer-checked:border-2"
          >
            <div class="flex flex-col gap-2">
              <span class="text-muted-800 dark:text-muted-100 font-sans text-lg font-medium">
                {{ category.title }}
              </span>
              <div class="flex flex-wrap gap-2">
                <span class="bg-primary-100 text-primary-500 dark:bg-primary-500/20 rounded-full px-2 py-1 text-xs">
                  {{ category.difficulty === 'simple' ? 'ساده' : category.difficulty === 'medium' ? 'متوسط' : 'چالش‌برانگیز' }}
                </span>
                <span class="bg-info-100 text-info-500 dark:bg-info-500/20 rounded-full px-2 py-1 text-xs">
                  {{ category.timeRequired === 'below_15' ? 'کمتر از ۱۵ دقیقه' : category.timeRequired === '15_to_60' ? '۱۵ تا ۶۰ دقیقه' : 'بیش از ۱ ساعت' }}
                </span>
              </div>
              <div v-if="category.tags.length > 0" class="flex flex-wrap gap-1">
                <span
                  v-for="tag in category.tags"
                  :key="tag"
                  class="bg-muted-100 text-muted-500 dark:bg-muted-800 dark:text-muted-300 rounded-full px-2 py-0.5 text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-end gap-2">
        <BaseButton
          to="/deeds/suggest"
          variant="outline"
          rounded="lg"
        >
          بازگشت
        </BaseButton>
        <BaseButton
          color="primary"
          rounded="lg"
          :disabled="!selectedCategory"
          @click="onSubmit"
        >
          ادامه
        </BaseButton>
      </div>
    </div>
  </div>
</template>
