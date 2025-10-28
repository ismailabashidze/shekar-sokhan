<script setup lang="ts">
export interface FlexTableSection {
  title: string
  type?: 'grow' | 'shrink' | 'stable'
  width?: string
}

const props = defineProps<{
  /**
   * The radius of the row.
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Whether to show a header with section titles.
   */
  showHeader?: boolean
  /**
   * Array of section definitions for the header.
   */
  sections?: FlexTableSection[]
  /**
   * Whether to hide the header on mobile devices.
   */
  hideHeaderOnMobile?: boolean
}>()

const hasSections = computed(() => {
  return props.showHeader && props.sections && props.sections.length > 0
})
</script>

<template>
  <div
    class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 flex flex-col border bg-white"
    :class="[
      props.rounded === 'sm' && 'rounded-md',
      props.rounded === 'md' && 'rounded-lg',
      props.rounded === 'lg' && 'rounded-xl',
    ]"
  >
    <!-- Header Section -->
    <div
      v-if="hasSections"
      class="border-muted-200 dark:border-muted-700 bg-muted-50 dark:bg-muted-900/50 border-b px-4 py-3"
      :class="[
        props.hideHeaderOnMobile && 'hidden md:block',
      ]"
    >
      <div class="flex flex-col gap-2 md:flex-row md:items-center">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="text-muted-600 dark:text-muted-300 font-sans text-xs font-medium uppercase"
          :class="[
            section.type === 'grow' && 'md:grow',
            section.type === 'shrink' && 'md:shrink',
            section.type === 'stable' && 'md:w-[110px] md:shrink-0',
            section.width && `md:${section.width}`,
          ]"
        >
          {{ section.title }}
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <slot />
    </div>
  </div>
</template>
