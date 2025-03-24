<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <BaseHeading
          as="h1"
          size="xl"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          دسته‌بندی‌های کار نیک
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-400">
          مدیریت دسته‌بندی‌های کارهای نیک
        </BaseParagraph>
      </div>
      <BaseButton
        to="/deeds/categories/new"
        color="primary"
        rounded="lg"
      >
        دسته‌بندی جدید
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="category in categories"
        :key="category.title"
        class="relative"
      >
        <div class="dark:border-muted-600 dark:bg-muted-700 rounded-xl border bg-white p-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-500/20">
                <Icon :name="category.icon" class="size-6 text-primary-500" />
              </div>
              <span class="text-muted-800 dark:text-muted-100 font-sans text-lg font-medium">
                {{ category.title }}
              </span>
            </div>
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
        </div>
      </div>

      <div v-if="categories.length === 0" class="col-span-full text-center">
        <BaseParagraph size="sm" class="text-muted-400">
          هنوز دسته‌بندی‌ای ایجاد نشده است.
          <BaseButton
            to="/deeds/categories/new"
            variant="text"
            color="primary"
          >
            یک دسته‌بندی جدید ایجاد کنید
          </BaseButton>
        </BaseParagraph>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeedCategory } from '~/composables/useDeedCategory'

definePageMeta({
  title: 'دسته‌بندی‌های کار نیک',
  layout: 'sidebar',
})

useHead({
  title: 'دسته‌بندی‌های کار نیک',
  htmlAttrs: { dir: 'rtl' },
})

const { getCategories } = useDeedCategory()
const categories = ref<DeedCategory[]>([])

onMounted(async () => {
  categories.value = await getCategories()
})
</script>
