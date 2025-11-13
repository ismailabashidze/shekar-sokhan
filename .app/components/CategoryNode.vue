<template>
  <div
    class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
    :style="{ marginLeft: `${level * 24}px` }"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="toggleExpand"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Icon
            :name="isExpanded ? 'lucide:chevron-down' : 'lucide:chevron-right'"
            class="w-4 h-4"
          />
        </button>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900">{{ category.name }}</span>
            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              Level {{ category.level }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-1">{{ category.description }}</p>
          <p class="text-xs text-gray-500 mt-1">ID: {{ category.id }}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="addChild"
          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Add child"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
        </button>
        <button
          @click="editCategory"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <Icon name="lucide:edit" class="w-4 h-4" />
        </button>
        <button
          @click="deleteCategory"
          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Icon name="lucide:trash-2" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Children -->
    <div v-if="isExpanded && category.children && category.children.length > 0" class="mt-3 space-y-2">
      <CategoryNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :level="level + 1"
        @update="(id, updates) => $emit('update', id, updates)"
        @delete="(id) => $emit('delete', id)"
        @add-child="(parentId) => $emit('add-child', parentId)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update', 'delete', 'add-child'])

const isExpanded = ref(props.level < 2) // Auto-expand first two levels

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const addChild = () => {
  emit('add-child', props.category.id)
}

const editCategory = () => {
  emit('update', props.category.id, { 
    isEditing: true,
    originalId: props.category.id,
    id: props.category.id,
    name: props.category.name,
    description: props.category.description,
    level: props.category.level
  })
}

const deleteCategory = () => {
  if (confirm(`Are you sure you want to delete "${props.category.name}" and all its children?`)) {
    emit('delete', props.category.id)
  }
}
</script>