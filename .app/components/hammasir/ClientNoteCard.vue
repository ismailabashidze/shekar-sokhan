<template>
  <div 
    class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    :class="{
      'ring-2 ring-blue-500': isSelected,
      'cursor-pointer': selectable
    }"
    @click="handleClick"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900 truncate dark:text-white">
            {{ noteTitle }}
          </h3>
          <span class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 mr-2">
            {{ formattedDate }}
          </span>
        </div>
        
        <div class="mt-3">
          <p 
            class="text-sm text-gray-600 whitespace-pre-wrap dark:text-gray-300"
            :class="{ 'line-clamp-3': !expanded }"
          >
            {{ noteContent }}
          </p>
          
          <button
            v-if="noteContent.length > 150"
            @click.stop="toggleExpand"
            class="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ expanded ? 'نمایش کمتر' : 'نمایش بیشتر' }}
          </button>
        </div>
      </div>
      
      <div v-if="actionsVisible" class="flex space-x-2 mr-2 space-x-reverse">
        <button
          v-if="editable"
          @click.stop="$emit('edit')"
          class="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
        >
          <Icon name="ph:pencil-simple" class="w-4 h-4" />
        </button>
        <button
          v-if="deletable"
          @click.stop="$emit('delete')"
          class="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
        >
          <Icon name="ph:trash" class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div v-if="tags && tags.length" class="mt-3 flex flex-wrap gap-1">
      <span
        v-for="tag in tags"
        :key="tag"
        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ClientNoteDto } from '~/types/api'

interface Props {
  note: ClientNoteDto
  noteTitle?: string
  selectable?: boolean
  isSelected?: boolean
  editable?: boolean
  deletable?: boolean
  actionsVisible?: boolean
  tags?: string[]
}

interface Emits {
  (e: 'click'): void
  (e: 'edit'): void
  (e: 'delete'): void
}

const props = withDefaults(defineProps<Props>(), {
  noteTitle: 'یادداشت',
  selectable: false,
  isSelected: false,
  editable: false,
  deletable: false,
  actionsVisible: true,
  tags: () => []
})

const emit = defineEmits<Emits>()

const expanded = ref(false)

const noteContent = computed(() => props.note.content || 'بدون محتوا')

const formattedDate = computed(() => {
  if (!props.note.createdAt) return ''
  
  const date = new Date(props.note.createdAt)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
})

const toggleExpand = () => {
  expanded.value = !expanded.value
}

const handleClick = () => {
  if (props.selectable) {
    emit('click')
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>