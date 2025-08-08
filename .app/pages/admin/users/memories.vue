<script setup lang="ts">
definePageMeta({
  title: 'حافظه‌های کاربران',
  layout: 'sidebar',
  middleware: 'auth',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const nuxtApp = useNuxtApp()
const route = useRoute()
const userId = computed(() => (route.query.user as string) || nuxtApp.$pb?.authStore?.model?.id)

const loading = ref(false)
const memories = ref<any[]>([])
const page = ref(1)
const perPage = ref(20)
const total = ref(0)

async function loadMemories() {
  if (!userId.value) return
  loading.value = true
  try {
    const res = await nuxtApp.$pb.collection('gpt_5_memories').getList(page.value, perPage.value, {
      filter: `user="${userId.value}"`,
      sort: '-importance,-created',
    })
    memories.value = res.items
    total.value = res.totalItems
  }
  finally {
    loading.value = false
  }
}

onMounted(loadMemories)
watch([page, perPage, userId], loadMemories)

async function removeMemory(id: string) {
  await nuxtApp.$pb.collection('gpt_5_memories').delete(id)
  await loadMemories()
}
</script>

<template>
  <div class="p-6">
    <BaseHeading size="lg" class="mb-4">حافظه‌های کاربر</BaseHeading>
    <div class="flex items-center gap-3 mb-4">
      <BaseInput v-model="(route.query.user as any)" placeholder="شناسه کاربر" readonly />
      <BaseTag color="info">{{ total }} مورد</BaseTag>
    </div>

    <div v-if="loading">
      <BaseProgress />
    </div>
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


