<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: '200px',
  placeholder: 'متن خود را وارد کنید...'
})

const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Generate unique ID for accessibility
const id = `rich-editor-${Math.random().toString(36).substr(2, 9)}`

// Quill toolbar options with RTL support
const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  [{ 'direction': 'rtl' }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean']
]

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: toolbarOptions
  },
  placeholder: props.placeholder,
  readOnly: props.readonly || props.disabled
}

// Handle content change
const handleTextChange = (content: string) => {
  emits('update:modelValue', content)
}
</script>

<template>
  <div class="base-rich-editor">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="id"
      class="nui-label w-full text-[0.825rem] text-muted-500 dark:text-muted-400"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500 font-medium">*</span>
    </label>

    <!-- Editor Container -->
    <div 
      class="rich-editor-wrapper"
      :class="[
        'border border-muted-300 dark:border-muted-600 rounded-lg overflow-hidden',
        'focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/20',
        { 'opacity-50 cursor-not-allowed': disabled },
        { 'bg-muted-100 dark:bg-muted-800': readonly }
      ]"
    >
      <ClientOnly>
        <QuillEditor
          :id="id"
          :content="modelValue"
          :options="editorOptions"
          content-type="html"
          :style="{ height: height }"
          @update:content="handleTextChange"
        />
        <template #fallback>
          <div 
            class="w-full bg-white dark:bg-muted-900 border border-muted-300 dark:border-muted-600 rounded-lg p-4"
            :style="{ height: height }"
          >
            <div class="flex items-center justify-center h-full">
              <div class="text-center">
                <div class="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent mx-auto mb-2" />
                <p class="text-sm text-muted-500 dark:text-muted-400">در حال بارگذاری ویرایشگر...</p>
              </div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Help Text -->
    <slot name="help">
      <p class="mt-1 text-xs text-muted-500 dark:text-muted-400">
        از toolbar بالا برای فرمت‌دهی متن استفاده کنید
      </p>
    </slot>
  </div>
</template>

<style scoped>
/* Rich Editor Custom Styles */
.rich-editor-wrapper :deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid rgb(var(--color-muted-300)) !important;
  background: rgb(var(--color-muted-50)) !important;
  padding: 0.5rem;
}

.dark .rich-editor-wrapper :deep(.ql-toolbar) {
  border-bottom-color: rgb(var(--color-muted-600)) !important;
  background: rgb(var(--color-muted-800)) !important;
}

.rich-editor-wrapper :deep(.ql-container) {
  border: none !important;
  background: white !important;
  font-family: inherit;
  font-size: 0.875rem;
}

.dark .rich-editor-wrapper :deep(.ql-container) {
  background: rgb(var(--color-muted-900)) !important;
  color: rgb(var(--color-muted-100));
}

.rich-editor-wrapper :deep(.ql-editor) {
  padding: 1rem !important;
  min-height: 120px;
  line-height: 1.6;
  direction: rtl;
  text-align: right;
}

.rich-editor-wrapper :deep(.ql-editor.ql-blank::before) {
  color: rgb(var(--color-muted-400)) !important;
  font-style: normal !important;
  opacity: 0.7;
  right: 1rem !important;
  left: unset !important;
}

/* Toolbar Button Styles */
.rich-editor-wrapper :deep(.ql-toolbar button) {
  color: rgb(var(--color-muted-600)) !important;
  border-radius: 0.25rem;
  padding: 0.25rem;
  margin: 0 0.125rem;
}

.dark .rich-editor-wrapper :deep(.ql-toolbar button) {
  color: rgb(var(--color-muted-300)) !important;
}

.rich-editor-wrapper :deep(.ql-toolbar button:hover) {
  background: rgb(var(--color-muted-100)) !important;
  color: rgb(var(--color-muted-900)) !important;
}

.dark .rich-editor-wrapper :deep(.ql-toolbar button:hover) {
  background: rgb(var(--color-muted-700)) !important;
  color: rgb(var(--color-muted-100)) !important;
}

.rich-editor-wrapper :deep(.ql-toolbar button.ql-active) {
  background: rgb(var(--color-primary-500)) !important;
  color: white !important;
}

/* Dropdown Styles */
.rich-editor-wrapper :deep(.ql-toolbar .ql-picker) {
  color: rgb(var(--color-muted-600)) !important;
}

.dark .rich-editor-wrapper :deep(.ql-toolbar .ql-picker) {
  color: rgb(var(--color-muted-300)) !important;
}

.rich-editor-wrapper :deep(.ql-toolbar .ql-picker-options) {
  background: white !important;
  border: 1px solid rgb(var(--color-muted-300)) !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
}

.dark .rich-editor-wrapper :deep(.ql-toolbar .ql-picker-options) {
  background: rgb(var(--color-muted-800)) !important;
  border-color: rgb(var(--color-muted-600)) !important;
}

/* Content Styles */
.rich-editor-wrapper :deep(.ql-editor h1),
.rich-editor-wrapper :deep(.ql-editor h2),
.rich-editor-wrapper :deep(.ql-editor h3),
.rich-editor-wrapper :deep(.ql-editor h4),
.rich-editor-wrapper :deep(.ql-editor h5),
.rich-editor-wrapper :deep(.ql-editor h6) {
  margin: 0.5rem 0;
  font-weight: 600;
}

.rich-editor-wrapper :deep(.ql-editor p) {
  margin: 0.5rem 0;
}

.rich-editor-wrapper :deep(.ql-editor ul),
.rich-editor-wrapper :deep(.ql-editor ol) {
  padding-right: 1.5rem;
  margin: 0.5rem 0;
}

.rich-editor-wrapper :deep(.ql-editor blockquote) {
  border-right: 4px solid rgb(var(--color-muted-300));
  padding-right: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.dark .rich-editor-wrapper :deep(.ql-editor blockquote) {
  border-right-color: rgb(var(--color-muted-600));
}

.rich-editor-wrapper :deep(.ql-editor a) {
  color: rgb(var(--color-primary-500));
  text-decoration: underline;
}

.rich-editor-wrapper :deep(.ql-editor a:hover) {
  color: rgb(var(--color-primary-600));
}

/* Focus Styles */
.rich-editor-wrapper :deep(.ql-container.ql-snow) {
  border: none !important;
}

.rich-editor-wrapper :deep(.ql-editor:focus) {
  outline: none;
}

/* Size overrides for better mobile experience */
@media (max-width: 768px) {
  .rich-editor-wrapper :deep(.ql-toolbar) {
    padding: 0.375rem;
  }
  
  .rich-editor-wrapper :deep(.ql-toolbar button) {
    padding: 0.125rem;
    margin: 0 0.0625rem;
  }
  
  .rich-editor-wrapper :deep(.ql-editor) {
    padding: 0.75rem !important;
    min-height: 100px;
  }
}
</style> 