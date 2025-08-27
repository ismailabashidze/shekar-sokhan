<script setup lang="ts">
definePageMeta({
  title: 'یادداشت‌های کاربر',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNotes } from '~/composables/hammasir/useNotes'
import ClientNotesList from '~/components/hammasir/ClientNotesList.vue'

const route = useRoute()
const clientId = route.params.clientId as string
const showAddNoteModal = ref(false)
const newNoteContent = ref('')
const searchQuery = ref('')

const {
  // State
  notesError,
  isNotesLoading,
  isNotesCreating,
  
  // Computed
  clientNotes,
  
  // Methods
  getClientNotes,
  addClientNote
} = useNotes()

// Filter notes based on search query
const filteredNotes = computed(() => {
  if (!searchQuery.value) return clientNotes.value
  
  const query = searchQuery.value.toLowerCase()
  return clientNotes.value.filter(note => 
    note.content.toLowerCase().includes(query)
  )
})

// Handle adding a new note
const handleAddNote = async () => {
  if (!newNoteContent.value) return
  
  const result = await addClientNote(clientId, newNoteContent.value)
  if (result) {
    // Reset form
    newNoteContent.value = ''
    showAddNoteModal.value = false
  }
}

// Fetch notes for the client
onMounted(() => {
  if (clientId) {
    getClientNotes(clientId)
  }
})
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              یادداشت‌های کاربر
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              شناسه کاربر: {{ clientId }}
            </p>
          </div>
          
          <div class="mt-4 md:mt-0">
            <button
              @click="showAddNoteModal = true"
              class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              :disabled="isNotesCreating"
            >
              <Icon name="ph:plus" class="ml-2 h-4 w-4" />
              <span>افزودن یادداشت</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Search -->
      <div class="mt-6">
        <div class="relative rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon name="ph:magnifying-glass" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full rounded-md border-gray-300 pr-10 pl-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
            placeholder="جستجو در یادداشت‌ها..."
          />
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isNotesLoading" class="mt-8 flex items-center justify-center py-12">
        <div class="flex flex-col items-center">
          <div class="h-12 w-12 animate-spin rounded-full border-y-2 border-indigo-500"></div>
          <p class="mt-4 text-gray-700 dark:text-gray-300">در حال بارگذاری یادداشت‌ها...</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="notesError" class="mt-8 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="ph:x-circle" class="h-5 w-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا در بارگذاری یادداشت‌ها
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ notesError }}</p>
            </div>
            <div class="mt-4">
              <button
                @click="getClientNotes(clientId)"
                class="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredNotes.length === 0" class="mt-12 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <Icon name="ph:note" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          یادداشتی یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          برای این کاربر یادداشتی ثبت نشده است.
        </p>
        <div class="mt-6">
          <button
            @click="showAddNoteModal = true"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Icon name="ph:plus" class="ml-2 h-4 w-4" />
            افزودن یادداشت اول
          </button>
        </div>
      </div>
      
      <!-- Notes List -->
      <div v-else class="mt-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            یادداشت‌ها ({{ filteredNotes.length }})
          </h2>
        </div>
        
        <ClientNotesList
          :notes="filteredNotes"
          :editable="true"
          :deletable="true"
          @edit="(note, index) => console.log('Edit note', note, index)"
          @delete="(note, index) => console.log('Delete note', note, index)"
        />
      </div>
    </div>
    
    <!-- Add Note Modal -->
    <div v-if="showAddNoteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showAddNoteModal = false"></div>
        
        <div class="inline-block transform overflow-hidden rounded-lg bg-white text-right align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle dark:bg-gray-800">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  افزودن یادداشت جدید
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="handleAddNote" class="space-y-4">
                    <div>
                      <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        محتوای یادداشت
                      </label>
                      <textarea
                        id="content"
                        v-model="newNoteContent"
                        rows="5"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        placeholder="محتوای یادداشت"
                      ></textarea>
                    </div>
                    
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
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700">
            <button
              type="button"
              :disabled="isNotesCreating || !newNoteContent"
              @click="handleAddNote"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 sm:mr-3 sm:w-auto sm:text-sm"
            >
              <span v-if="isNotesCreating" class="flex items-center">
                <Icon name="ph:spinner" class="ml-2 h-4 w-4 animate-spin" />
                در حال ایجاد...
              </span>
              <span v-else>افزودن یادداشت</span>
            </button>
            <button
              type="button"
              @click="showAddNoteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>