<script setup lang="ts">
definePageMeta({
  title: 'Test Hammasir Sidebar',
  layout: 'sidebar',
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Test Hammasir Sidebar</h1>
    <p>This page should show the Hammasir sidebar when the URL contains /hammasir/</p>
    <p>Current path: {{ $route.path }}</p>
  </div>
</template>