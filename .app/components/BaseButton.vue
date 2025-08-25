<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'solid' | 'outline' | 'ghost'
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'muted'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  disabled?: boolean
  loading?: boolean
  icon?: string
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  rounded: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

const buttonClasses = computed(() => {
  const classes = []
  
  // Base classes
  classes.push('inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2')
  
  // Size classes
  switch (props.size) {
    case 'xs':
      classes.push('text-xs px-2 py-1')
      break
    case 'sm':
      classes.push('text-sm px-3 py-1.5')
      break
    case 'md':
      classes.push('text-sm px-4 py-2')
      break
    case 'lg':
      classes.push('text-base px-5 py-2.5')
      break
    case 'xl':
      classes.push('text-lg px-6 py-3')
      break
  }
  
  // Rounded classes
  switch (props.rounded) {
    case 'none':
      classes.push('rounded-none')
      break
    case 'sm':
      classes.push('rounded-sm')
      break
    case 'md':
      classes.push('rounded-md')
      break
    case 'lg':
      classes.push('rounded-lg')
      break
    case 'full':
      classes.push('rounded-full')
      break
  }
  
  // Variant and color classes
  if (props.disabled || props.loading) {
    classes.push('opacity-70 cursor-not-allowed')
  } else {
    switch (props.variant) {
      case 'solid':
        switch (props.color) {
          case 'primary':
            classes.push('bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500')
            break
          case 'secondary':
            classes.push('bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500')
            break
          case 'success':
            classes.push('bg-success-500 hover:bg-success-600 text-white focus:ring-success-500')
            break
          case 'danger':
            classes.push('bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-500')
            break
          case 'warning':
            classes.push('bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500')
            break
          case 'info':
            classes.push('bg-info-500 hover:bg-info-600 text-white focus:ring-info-500')
            break
          case 'muted':
            classes.push('bg-muted-500 hover:bg-muted-600 text-white focus:ring-muted-500')
            break
        }
        break
      case 'outline':
        switch (props.color) {
          case 'primary':
            classes.push('border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500')
            break
          case 'secondary':
            classes.push('border border-secondary-500 text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 focus:ring-secondary-500')
            break
          case 'success':
            classes.push('border border-success-500 text-success-500 hover:bg-success-50 dark:hover:bg-success-900/20 focus:ring-success-500')
            break
          case 'danger':
            classes.push('border border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 focus:ring-danger-500')
            break
          case 'warning':
            classes.push('border border-warning-500 text-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/20 focus:ring-warning-500')
            break
          case 'info':
            classes.push('border border-info-500 text-info-500 hover:bg-info-50 dark:hover:bg-info-900/20 focus:ring-info-500')
            break
          case 'muted':
            classes.push('border border-muted-500 text-muted-500 hover:bg-muted-50 dark:hover:bg-muted-900/20 focus:ring-muted-500')
            break
        }
        break
      case 'ghost':
        switch (props.color) {
          case 'primary':
            classes.push('text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500')
            break
          case 'secondary':
            classes.push('text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 focus:ring-secondary-500')
            break
          case 'success':
            classes.push('text-success-500 hover:bg-success-50 dark:hover:bg-success-900/20 focus:ring-success-500')
            break
          case 'danger':
            classes.push('text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 focus:ring-danger-500')
            break
          case 'warning':
            classes.push('text-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/20 focus:ring-warning-500')
            break
          case 'info':
            classes.push('text-info-500 hover:bg-info-50 dark:hover:bg-info-900/20 focus:ring-info-500')
            break
          case 'muted':
            classes.push('text-muted-500 hover:bg-muted-50 dark:hover:bg-muted-900/20 focus:ring-muted-500')
            break
        }
        break
    }
  }
  
  return classes.join(' ')
})

const isLink = computed(() => props.to || props.href)
</script>

<template>
  <button
    v-if="!isLink"
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <Icon v-if="loading" name="fa6-solid:spinner" class="h-4 w-4 animate-spin ml-2" />
    <Icon v-else-if="icon" :name="icon" class="h-4 w-4 ml-2" />
    <span>
      <slot />
    </span>
  </button>
  
  <NuxtLink
    v-else-if="to"
    :to="to"
    :class="buttonClasses"
  >
    <Icon v-if="loading" name="fa6-solid:spinner" class="h-4 w-4 animate-spin ml-2" />
    <Icon v-else-if="icon" :name="icon" class="h-4 w-4 ml-2" />
    <span>
      <slot />
    </span>
  </NuxtLink>
  
  <a
    v-else-if="href"
    :href="href"
    :class="buttonClasses"
  >
    <Icon v-if="loading" name="fa6-solid:spinner" class="h-4 w-4 animate-spin ml-2" />
    <Icon v-else-if="icon" :name="icon" class="h-4 w-4 ml-2" />
    <span>
      <slot />
    </span>
  </a>
</template>

<style scoped>
/* Additional styling if needed */
</style>