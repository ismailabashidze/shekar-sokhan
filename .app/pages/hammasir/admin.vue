<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

useHead({ htmlAttrs: { dir: 'rtl' } })
</script>

<template>
  <div>
    <slot />
  </div>
</template>
