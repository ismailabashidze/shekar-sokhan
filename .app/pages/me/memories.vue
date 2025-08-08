<script setup lang="ts">
definePageMeta({ title: 'حافظه‌های من', layout: 'sidebar' })
useHead({ htmlAttrs: { dir: 'rtl' } })

const nuxtApp = useNuxtApp()
const loading = ref(false)
const memories = ref<any[]>([])
const page = ref(1)
const perPage = ref(20)
const total = ref(0)

async function load() {
  if (!nuxtApp.$pb?.authStore?.isValid) return
  loading.value = true
  try {
    const uid = nuxtApp.$pb.authStore.model.id
    const res = await nuxtApp.$pb.collection('gpt-5-memories').getList(page.value, perPage.value, {
      filter: `user="${uid}"`,
      sort: '-importance,-created',
    })
    memories.value = res.items
    total.value = res.totalItems
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch([page, perPage], load)

async function removeMemory(id: string) {
  await nuxtApp.$pb.collection('gpt-5-memories').delete(id)
  await load()
}
</script>

<template>
  <div class="p-6">
    <BaseHeading size="lg" class="mb-4">حافظه‌های من</BaseHeading>
    <BaseTag color="info" class="mb-4">{{ total }} مورد</BaseTag>
    <div v-if="loading"><BaseProgress /></div>
    <div v-else class="space-y-3">
      <div v-for="m in memories" :key="m.id" class="border border-muted-200 dark:border-muted-700 rounded-lg p-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <BaseTag color="primary">{{ m.importance }}/100</BaseTag>
            <div class="flex gap-1 flex-wrap">
              <BaseTag v-for="c in (m.categories || [])" :key="c" color="info" size="sm">{{ c }}</BaseTag>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <BaseButton color="danger" size="sm" @click="removeMemory(m.id)">حذف</BaseButton>
          </div>
        </div>
        <div class="mt-2 text-sm">{{ m.text }}</div>
        <div class="mt-1 text-xs text-muted-500">{{ new Date(m.created).toLocaleString('fa') }}</div>
      </div>
    </div>
  </div>
</template>


