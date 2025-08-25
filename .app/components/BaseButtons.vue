<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  align?: 'left' | 'center' | 'right'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  vertical?: boolean
  wrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: 'left',
  justify: 'start',
  gap: 'md',
  vertical: false,
  wrap: false
})

const alignmentClass = computed(() => {
  const classes = []
  
  // Flex direction
  if (props.vertical) {
    classes.push('flex-col')
  } else {
    classes.push('flex-row')
  }
  
  // Justify content
  switch (props.justify) {
    case 'start':
      classes.push('justify-start')
      break
    case 'end':
      classes.push('justify-end')
      break
    case 'center':
      classes.push('justify-center')
      break
    case 'between':
      classes.push('justify-between')
      break
    case 'around':
      classes.push('justify-around')
      break
  }
  
  // Align items
  switch (props.align) {
    case 'left':
      classes.push('items-start')
      break
    case 'center':
      classes.push('items-center')
      break
    case 'right':
      classes.push('items-end')
      break
  }
  
  // Flex wrap
  if (props.wrap) {
    classes.push('flex-wrap')
  }
  
  return classes.join(' ')
})

const gapClass = computed(() => {
  switch (props.gap) {
    case 'xs':
      return props.vertical ? 'gap-y-1' : 'gap-x-1'
    case 'sm':
      return props.vertical ? 'gap-y-2' : 'gap-x-2'
    case 'md':
      return props.vertical ? 'gap-y-3' : 'gap-x-3'
    case 'lg':
      return props.vertical ? 'gap-y-4' : 'gap-x-4'
    case 'xl':
      return props.vertical ? 'gap-y-6' : 'gap-x-6'
    default:
      return props.vertical ? 'gap-y-3' : 'gap-x-3'
  }
})
</script>

<template>
  <div 
    class="flex" 
    :class="[alignmentClass, gapClass]"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>