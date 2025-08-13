<script setup lang="ts">
interface Props {
  modelValue?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  required?: boolean
  helperText?: string
  error?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'upload:start'): void
  (e: 'upload:success', url: string): void
  (e: 'upload:error', error: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  size: 'lg',
  disabled: false,
  required: false,
  helperText: '',
  error: ''
})

const emit = defineEmits<Emits>()

const { uploadProfilePicture, state: uploadState } = useProfileUpload({
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  compress: true,
  quality: 0.8
})

const fileInput = ref<HTMLInputElement>()
const previewUrl = ref<string>('')
const isUploading = ref(false)

// Size mappings
const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40'
}

const iconSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12'
}

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && !previewUrl.value) {
    previewUrl.value = newValue
  }
})

// Initialize preview
onMounted(() => {
  if (props.modelValue) {
    previewUrl.value = props.modelValue
  }
})

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  try {
    isUploading.value = true
    emit('upload:start')

    // Show immediate preview
    previewUrl.value = URL.createObjectURL(file)

    // Upload file
    const url = await uploadProfilePicture(file)
    
    // Update model
    emit('update:modelValue', url)
    emit('upload:success', url)
    
    // Update preview with final URL
    previewUrl.value = url
    
  } catch (error: any) {
    // Revert preview on error
    previewUrl.value = props.modelValue
    emit('upload:error', error.message)
  } finally {
    isUploading.value = false
  }
}

const openFilePicker = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

const removeImage = () => {
  previewUrl.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col items-center space-y-4">
    <!-- Avatar Display -->
    <div 
      class="relative rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden transition-all duration-200 hover:border-primary-400"
      :class="[
        sizeClasses[size],
        {
          'border-red-300 dark:border-red-600': error,
          'border-gray-200 dark:border-gray-700': disabled,
          'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700': !disabled,
          'bg-gray-100 dark:bg-gray-800': !previewUrl && !isUploading,
        }
      ]"
      @click="openFilePicker"
    >
      <!-- Loading State -->
      <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80">
        <div class="flex flex-col items-center space-y-2">
          <div class="animate-spin rounded-full border-2 border-primary-500 border-t-transparent w-6 h-6"></div>
          <span class="text-xs text-gray-600 dark:text-gray-400">بارگذاری...</span>
        </div>
      </div>

      <!-- Image Preview -->
      <img
        v-else-if="previewUrl"
        :src="previewUrl"
        alt="تصویر پروفایل"
        class="w-full h-full object-cover"
      />

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <Icon name="ph:camera" :class="iconSizes[size]" />
        <span class="text-xs mt-1">تصویر پروفایل</span>
      </div>

      <!-- Remove Button -->
      <BaseButton
        v-if="previewUrl && !isUploading && !disabled"
        size="xs"
        variant="solid"
        class="absolute -top-2 -right-2 rounded-full bg-red-500 text-white hover:bg-red-600 w-6 h-6 p-0 shadow-lg"
        @click.stop="removeImage"
      >
        <Icon name="ph:x" class="w-3 h-3" />
      </BaseButton>

      <!-- Edit Overlay -->
      <div
        v-if="!disabled && !isUploading"
        class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
      >
        <Icon name="ph:pencil-simple" class="w-6 h-6 text-white" />
      </div>
    </div>

    <!-- Upload Button (Alternative) -->
    <div class="flex flex-col items-center space-y-2">
      <BaseButton
        v-if="!previewUrl && !isUploading"
        size="sm"
        variant="outline"
        :disabled="disabled"
        @click="openFilePicker"
      >
        <Icon name="ph:upload" class="w-4 h-4 me-2" />
        انتخاب تصویر
      </BaseButton>

      <BaseButton
        v-else-if="previewUrl && !isUploading && !disabled"
        size="sm"
        variant="outline"
        @click="openFilePicker"
      >
        <Icon name="ph:pencil" class="w-4 h-4 me-2" />
        تغییر تصویر
      </BaseButton>

      <!-- File Input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- Helper Text -->
    <div v-if="helperText || error" class="text-center">
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
      <p v-else-if="helperText" class="text-sm text-gray-500 dark:text-gray-400">
        {{ helperText }}
      </p>
    </div>

    <!-- Requirements -->
    <div class="text-center">
      <p class="text-xs text-gray-400 dark:text-gray-500">
        حداکثر 5MB • JPG, PNG, WebP
      </p>
      <span v-if="required" class="text-xs text-red-500">*</span>
    </div>
  </div>
</template>