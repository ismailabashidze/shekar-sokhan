<script setup lang="ts">
defineProps<{
  keyPoints: Array<{
    title: string
    icon: string
  }>
}>()
</script>

<template>
  <div class="mt-6">
    <BaseHeading
      tag="h3"
      size="lg"
      weight="medium"
      class="mb-4"
    >
      نکات کلیدی جلسه
    </BaseHeading>
    <div class="flex flex-wrap gap-3">
      <BaseTag
        v-for="point in keyPoints"
        :key="point.title"
        color="default"
        flavor="pastel"
        size="md"
        class="mb-2 ltr:mr-2 rtl:ml-2"
      >
        {{ point.icon }} {{ point.title }}
      </BaseTag>
    </div>
  </div>
</template>
