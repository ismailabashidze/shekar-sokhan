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
    } else {
      throw new Error('خطا در ذخیره یادداشت')
    }
  } catch (err: any) {
    error.value = err.message || 'خطا در ذخیره یادداشت'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="flex items-center mb-6">
      <NuxtLink to="/notes/list" class="text-primary mr-3">
        <span class="i-heroicons-arrow-right h-6 w-6"></span>
      </NuxtLink>
      <h1 class="text-2xl font-bold">ایجاد یادداشت جدید</h1>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
    </div>

    <form @submit.prevent="saveNote" class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
        <input
          id="title"
          v-model="note.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="عنوان یادداشت را وارد کنید"
          required
        />
      </div>

      <div class="mb-6">
        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">محتوا</label>
        <textarea
          id="content"
          v-model="note.content"
          rows="12"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="متن یادداشت را وارد کنید"
          required
        ></textarea>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="submitting"
        >
          <span v-if="submitting">در حال ذخیره...</span>
          <span v-else>ذخیره</span>
        </button>
      </div>
    </form>
  </div>
</template>
