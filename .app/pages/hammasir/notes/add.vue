<script setup lang="ts">
definePageMeta({
  title: 'افزودن یادداشت',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useNotes } from '~/composables/hammasir/useNotes'

const router = useRouter()
const successMessage = ref('')
const showSuccess = ref(false)

const form = reactive({
  clientId: '',
  content: ''
})

const {
  // State
  notesError,
  isNotesCreating,
  
  // Methods
  addClientNote
} = useNotes()

const handleSubmit = async () => {
  if (!form.clientId || !form.content) return
  
  const result = await addClientNote(form.clientId, form.content)
  if (result) {
    showSuccess.value = true
    successMessage.value = 'یادداشت با موفقیت اضافه شد.'
    
    // Reset form
    form.clientId = ''
    form.content = ''
    
    // Redirect to the client's notes page after a short delay
    setTimeout(() => {
      router.push(`/hammasir/notes/${result.clientId || form.clientId}`)
    }, 2000)
  }
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              افزودن یادداشت جدید
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              ایجاد یادداشت برای کاربر مشاوره‌ای
            </p>
          </div>
          
          <NuxtLink 
            to="/hammasir/notes" 
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <Icon name="ph:arrow-left" class="ml-2 h-4 w-4" />
            بازگشت
          </NuxtLink>
        </div>
      </div>
      
      <div class="mt-6">
        <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div class="px-4 py-5 sm:p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label for="clientId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  شناسه کاربر
                </label>
                <div class="mt-1">
                  <input
                    id="clientId"
                    v-model="form.clientId"
                    type="text"
                    required
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="شناسه کاربر"
                  />
                </div>
              </div>
              
              <div>
                <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  محتوای یادداشت
                </label>
                <div class="mt-1">
                  <textarea
                    id="content"
                    v-model="form.content"
                    rows="8"
                    required
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="محتوای یادداشت"
                  ></textarea>
                </div>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  یادداشت خود را به صورت کامل و واضح بنویسید.
                </p>
              </div>
              
              <!-- Error Message -->
              <div v-if="notesError" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <Icon name="ph:x-circle" class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="mr-3">
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                      خطا در ایجاد یادداشت
                    </h3>
                    <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{{ notesError }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Success Message -->
              <div v-if="showSuccess" class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <Icon name="ph:check-circle" class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="mr-3">
                    <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                      عملیات موفق
                    </h3>
                    <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>{{ successMessage }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isNotesCreating || !form.clientId || !form.content"
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <Icon 
                    v-if="isNotesCreating" 
                    name="ph:spinner" 
                    class="ml-2 h-4 w-4 animate-spin" 
                  />
                  <span>{{ isNotesCreating ? 'در حال ایجاد...' : 'افزودن یادداشت' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>