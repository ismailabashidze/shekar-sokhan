<template>
  <div class="space-y-5">
    <ClientNoteCard
      v-for="(note, index) in notes"
      :key="index"
      :note="note"
      :note-title="`یادداشت #${notes.length - index}`"
      :editable="editable"
      :deletable="deletable"
      :selectable="selectable"
      :is-selected="selectedNotes.includes(index)"
      @click="handleNoteClick(index)"
      @edit="$emit('edit', note, index)"
      @delete="$emit('delete', note, index)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ClientNoteDto } from '~/types/api'
import ClientNoteCard from '~/components/hammasir/ClientNoteCard.vue'

interface Props {
  notes: ClientNoteDto[]
  editable?: boolean
  deletable?: boolean
  selectable?: boolean
}

interface Emits {
  (e: 'edit', note: ClientNoteDto, index: number): void
  (e: 'delete', note: ClientNoteDto, index: number): void
  (e: 'select', indices: number[]): void
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  deletable: false,
  selectable: false
})

const emit = defineEmits<Emits>()

const selectedNotes = ref<number[]>([])

const handleNoteClick = (index: number) => {
  if (!props.selectable) return
  
  const selectedIndex = selectedNotes.value.indexOf(index)
  if (selectedIndex === -1) {
    selectedNotes.value.push(index)
  } else {
    selectedNotes.value.splice(selectedIndex, 1)
  }
  
  emit('select', selectedNotes.value)
}
</script>