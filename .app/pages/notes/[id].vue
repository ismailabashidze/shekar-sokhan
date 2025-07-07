<script setup lang="ts">
definePageMeta({
  title: 'جزئیات یادداشت',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const isEditing = ref(false)

const { data: note, pending, error, refresh } = await useFetch(`/api/notes/${id.value}`)

const editableNote = reactive({
  title: '',
  content: '',
})

const submitting = ref(false)
const saveError = ref<string | null>(null)

function startEditing() {
  editableNote.title = note.value?.title || ''
  editableNote.content = note.value?.content || ''
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
  saveError.value = null
}

async function deleteNote() {
  if (!confirm('آیا از حذف این یادداشت اطمینان دارید؟')) {
    return
  }

  submitting.value = true

  try {
    await $fetch(`/api/notes/${id.value}`, {
      method: 'DELETE',
    })

    router.push('/notes/list')
  }
  catch (err: any) {
    saveError.value = 'خطا در حذف یادداشت'
  }
  finally {
    submitting.value = false
  }
}

async function saveNote() {
  if (!editableNote.title || !editableNote.content) {
    saveError.value = 'لطفا عنوان و محتوای یادداشت را وارد کنید'
    return
  }

  saveError.value = null
  submitting.value = true

  try {
    await $fetch(`/api/notes/${id.value}`, {
      method: 'PUT',
      body: editableNote,
    })

    isEditing.value = false
    refresh()
  }
  catch (err: any) {
    saveError.value = err.message || 'خطا در بروزرسانی یادداشت'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <div class="mb-6 flex items-center">
      <NuxtLink to="/notes/list" class="text-primary mr-3">
        <span class="i-heroicons-arrow-right size-6" />
      </NuxtLink>
      <h1 v-if="!isEditing && note" class="text-2xl font-bold">
        {{ note.title }}
      </h1>
      <h1 v-if="isEditing" class="text-2xl font-bold">
        ویرایش یادداشت
      </h1>
    </div>

    <div v-if="pending" class="flex justify-center py-10">
      <div class="loader" />
    </div>

    <div v-else-if="error" class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
      خطا در بارگذاری یادداشت
    </div>

    <template v-else-if="note">
      <!-- نمایش یادداشت -->
      <div v-if="!isEditing" class="rounded-lg bg-white p-6 shadow-md">
        <div class="mb-6 flex justify-between">
          <div class="text-sm text-gray-500">
            {{ new Date(note.createdAt).toLocaleDateString('fa-IR') }}
            {{ note.updatedAt && note.updatedAt !== note.createdAt ?
              `(آخرین ویرایش: ${new Date(note.updatedAt).toLocaleDateString('fa-IR')})` : '' }}
          </div>
          <div class="flex space-x-2 space-x-reverse">
            <button class="text-primary hover:text-primary-dark" @click="startEditing">
              <span class="i-heroicons-pencil-square size-5" />
            </button>
            <button class="text-red-500 hover:text-red-700" @click="deleteNote">
              <span class="i-heroicons-trash size-5" />
            </button>
          </div>
        </div>

        <div class="prose max-w-none">
          <p class="whitespace-pre-wrap">
            {{ note.content }}
          </p>
        </div>
      </div>

      <!-- فرم ویرایش -->
      <form
        v-else
        class="rounded-lg bg-white p-6 shadow-md"
        @submit.prevent="saveNote"
      >
        <div v-if="saveError" class="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {{ saveError }}
        </div>

        <div class="mb-4">
          <label for="title" class="mb-1 block text-sm font-medium text-gray-700">عنوان</label>
          <input
            id="title"
            v-model="editableNote.title"
            type="text"
            class="focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            required
          >
        </div>

        <div class="mb-6">
          <label for="content" class="mb-1 block text-sm font-medium text-gray-700">محتوا</label>
          <textarea
            id="content"
            v-model="editableNote.content"
            rows="12"
            class="focus:ring-primary focus:border-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            required
          />
        </div>

        <div class="flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            :disabled="submitting"
            @click="cancelEditing"
          >
            انصراف
          </button>
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
    </template>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
