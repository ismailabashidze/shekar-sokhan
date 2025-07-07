<script setup lang="ts">
definePageMeta({
  title: 'ایجاد یادداشت جدید',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const router = useRouter()

const note = reactive({
  title: '',
  content: '',
})

const submitting = ref(false)
const error = ref<string | null>(null)

async function saveNote() {
  if (!note.title || !note.content) {
    error.value = 'لطفا عنوان و محتوای یادداشت را وارد کنید'
    return
  }

  error.value = null
  submitting.value = true

  try {
    const response = await $fetch('/api/notes', {
      method: 'POST',
      body: note,
    })

    if (response && response.id) {
      router.push(`/notes/${response.id}`)
    }
    else {
      throw new Error('خطا در ذخیره یادداشت')
    }
  }
  catch (err: any) {
    error.value = err.message || 'خطا در ذخیره یادداشت'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto max-w-3xl px-4 py-8">
    <div class="mb-6 flex items-center">
      <NuxtLink to="/notes/list" class="text-primary mr-3">
        <span class="i-heroicons-arrow-right size-6" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">
        ایجاد یادداشت جدید
      </h1>
    </div>

    <div v-if="error" class="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
      {{ error }}
    </div>

    <form class="rounded-lg bg-white p-6 shadow-md" @submit.prevent="saveNote">
      <div class="mb-4">
        <label for="title" class="mb-1 block text-sm font-medium text-gray-700">عنوان</label>
        <input
          id="title"
          v-model="note.title"
          type="text"
          class="focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
          placeholder="عنوان یادداشت را وارد کنید"
          required
        >
      </div>

      <div class="mb-6">
        <label for="content" class="mb-1 block text-sm font-medium text-gray-700">محتوا</label>
        <textarea
          id="content"
          v-model="note.content"
          rows="12"
          class="focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
          placeholder="متن یادداشت را وارد کنید"
          required
        />
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-primary hover:bg-primary-dark rounded-md px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="submitting"
        >
          <span v-if="submitting">در حال ذخیره...</span>
          <span v-else>ذخیره</span>
        </button>
      </div>
    </form>
  </div>
</template>
