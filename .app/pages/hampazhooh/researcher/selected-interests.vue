<script setup lang="ts">
  definePageMeta({
    title: 'علایق پژوهشی انتخاب شده',
  });

  useHead({ htmlAttrs: { dir: 'rtl' } });

  const { getOrganizedCategories } = useResearcher();

  const organizedCategories = computed(() => {
    return getOrganizedCategories(['philosophy', 'sociology']);
  });
</script>

<template>
  <div class="bg-muted-100 dark:bg-muted-900 min-h-screen">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <BaseHeading as="h1" size="3xl" weight="bold">علایق پژوهشی انتخاب شده</BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-2">
          نمایش علایق پژوهشی سطح سوم به صورت دسته‌بندی شده
        </BaseParagraph>
      </div>

      <!-- Categories -->
      <div v-for="(category, catId) in organizedCategories" :key="catId" class="mb-8">
        <BaseHeading as="h2" size="xl" weight="medium" class="mb-4">
          {{ category.name }}
        </BaseHeading>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BaseCard
            v-for="item in category.level3"
            :key="item.id"
            shape="curved"
            class="p-4 transition-all hover:shadow-lg"
          >
            <BaseHeading as="h3" size="md" weight="medium" class="mb-2">
              {{ item.name }}
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              {{ item.description }}
            </BaseParagraph>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
