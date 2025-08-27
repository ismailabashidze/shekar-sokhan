<script setup lang="ts">
definePageMeta({
  title: 'داشبورد یادداشت‌ها',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

import { ref, onMounted } from 'vue'
import { useNotes } from '~/composables/hammasir/useNotes'
import NoteSummaryCard from '~/components/hammasir/NoteSummaryCard.vue'

const {
  // State
  notesError,
  isNotesLoading,
  
  // Computed
  clientNotes,
  
  // Methods
  getClientNotes
} = useNotes()

const selectedClientId = ref('')
const totalNotes = ref(0)
const recentNotes = ref<any[]>([])

// Load notes for a specific client
const loadClientNotes = async () => {
  if (selectedClientId.value) {
    await getClientNotes(selectedClientId.value)
  }
}

// Calculate summary statistics
const calculateSummary = () => {
  totalNotes.value = clientNotes.value.length
  recentNotes.value = clientNotes.value.slice(0, 5)
}

onMounted(() => {
  // Initialize with a sample client ID if needed for demo
  // selectedClientId.value = 'sample-client-id'
  // loadClientNotes()
})
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Header -->
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          داشبورد یادداشت‌ها
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          نمای کلی از یادداشت‌های کاربران
        </p>
      </div>
      
      <!-- Client Selection -->
      <div class="mt-6">
        <div class="w-full sm:w-96">
          <div class="relative rounded-md shadow-sm">
            <input
              v-model="selectedClientId"
              @keyup.enter="loadClientNotes"
              type="text"
              class="block w-full rounded-md border-gray-300 pr-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm"
              placeholder="شناسه کاربر"
            />
            <div class="absolute inset-y-0 left-0 flex items-center">
              <button
                @click="loadClientNotes"
                :disabled="!selectedClientId || isNotesLoading"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Icon 
                  v-if="isNotesLoading" 
                  name="ph:spinner" 
                  class="h-4 w-4 animate-spin" 
                />
                <Icon 
                  v-else 
                  name="ph:arrow-clockwise" 
                  class="h-4 w-4" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Summary Cards -->
      <div v-if="selectedClientId && !isNotesLoading" class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <NoteSummaryCard
          title="تعداد کل یادداشت‌ها"
          :value="totalNotes"
          icon="ph:note"
        />
        <NoteSummaryCard
          title="یادداشت‌های امروز"
          value="0"
          icon="ph:calendar"
          :change="0"
          description="در 24 ساعت گذشته"
        />
        <NoteSummaryCard
          title="میانگین طول یادداشت‌ها"
          value="120 کلمه"
          icon="ph:text-align-right"
        />
        <NoteSummaryCard
          title="کاربران فعال"
          value="1"
          icon="ph:users"
        />
      </div>
      
      <!-- Recent Notes -->
      <div v-if="selectedClientId && recentNotes.length > 0" class="mt-8">
        <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            یادداشت‌های اخیر
          </h2>
        </div>
        <div class="mt-4 space-y-4">
          <div
            v-for="(note, index) in recentNotes"
            :key="index"
            class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
          >
            <div class="px-4 py-5 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex size-8 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-900">
                    <Icon name="ph:note" class="size-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 class="mr-3 text-sm font-medium text-gray-900 dark:text-white">
                    یادداشت #{{ totalNotes - index }}
                  </h3>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ new Date(note.createdAt).toLocaleDateString('fa-IR') }}
                </span>
              </div>
              <div class="mt-4">
                <p class="text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
                  {{ note.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!selectedClientId" class="mt-12 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <Icon name="ph:note" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          هیچ کاربری انتخاب نشده است
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          برای مشاهده داشبورد یادداشت‌ها، شناسه کاربر را وارد کنید.
        </p>
      </div>
      
      <div v-else-if="selectedClientId && totalNotes === 0 && !isNotesLoading" class="mt-12 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <Icon name="ph:note" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          یادداشتی یافت نشد
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          برای این کاربر یادداشتی ثبت نشده است.
        </p>
        <div class="mt-6">
          <NuxtLink
            :to="`/hammasir/notes/add?clientId=${selectedClientId}`"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Icon name="ph:plus" class="ml-2 h-4 w-4" />
            افزودن یادداشت اول
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>