<script setup lang="ts">
const route = useRoute()
const app = useAppConfig()

/**
 * Global head configuration
 * @see https://unhead.harlanzw.com/
 * @see https://github.com/unjs/unhead/tree/main
 */
useHead({
  title: route.meta.title,
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - ${app.tairo.title}`
      : `${app.tairo.title || 'Tairo'}`
  },
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="var(--color-primary-500)" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
@font-face {
  font-family: IRANSans;
  font-style: normal;
  font-weight: 900;
  src: url('./fonts/IRANSansWeb_Black.ttf') format('truetype');
}
@font-face {
  font-family: IRANSans;
  font-style: normal;
  font-weight: bold;
  src: format('truetype');
}
@font-face {
  font-family: IRANSans;
  font-style: normal;
  font-weight: 500;
  src: url('./fonts/IRANSansWeb_Medium.ttf') format('truetype');
}
@font-face {
  font-family: IRANSans;
  font-style: normal;
  font-weight: 300;
  src: url('./fonts/IRANSansWeb_Light.ttf') format('truetype');
}
@font-face {
  font-family: IRANSans;
  font-style: normal;
  font-weight: 200;
  src: url('./fonts/IRANSansWeb_UltraLight.ttf') format('truetype');
}
html * {
  font-family: IRANSans !important;
}
</style>
