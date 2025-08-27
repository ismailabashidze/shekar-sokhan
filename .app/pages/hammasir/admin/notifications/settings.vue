<template>
  <div class="admin-notification-settings">
    <h1 class="mb-6 text-2xl font-bold">
      تنظیمات اعلان‌ها
    </h1>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Notification Templates -->
      <div class="rounded-lg bg-white shadow lg:col-span-2">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            قالب‌های اعلان
          </h2>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div
              v-for="template in templates"
              :key="template.id"
              class="rounded-lg border border-gray-200 p-4"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">
                    {{ template.name }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ template.description }}
                  </p>
                </div>
                <button
                  class="text-blue-600 hover:text-blue-900"
                  @click="editTemplate(template)"
                >
                  ویرایش
                </button>
              </div>
              <div class="mt-3 flex items-center">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="getNotificationTypeClass(template.type)"
                >
                  {{ getNotificationTypeText(template.type) }}
                </span>
                <span class="mr-2 text-sm text-gray-500">
                  {{ template.recipients }} گیرنده
                </span>
              </div>
            </div>
          </div>

          <button
            class="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            @click="openCreateTemplateModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-1 size-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            افزودن قالب جدید
          </button>
        </div>
      </div>

      <!-- General Settings -->
      <div class="rounded-lg bg-white shadow">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-medium text-gray-900">
            تنظیمات عمومی
          </h2>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-md mb-3 font-medium text-gray-900">
                تنظیمات ارسال
              </h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">ارسال ایمیل</span>
                  <button
                    :class="[
                      emailNotificationsEnabled ? 'bg-blue-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    ]"
                    @click="toggleEmailNotifications"
                  >
                    <span
                      :class="[
                        emailNotificationsEnabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none relative inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      ]"
                    >
                      <span
                        :class="[
                          emailNotificationsEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
                          'absolute inset-0 flex size-full items-center justify-center transition-opacity'
                        ]"
                        aria-hidden="true"
                      >
                        <svg
                          class="size-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span
                        :class="[
                          emailNotificationsEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
                          'absolute inset-0 flex size-full items-center justify-center transition-opacity'
                        ]"
                        aria-hidden="true"
                      >
                        <svg
                          class="size-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.707a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">ارسال پیامک</span>
                  <button
                    :class="[
                      smsNotificationsEnabled ? 'bg-blue-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    ]"
                    @click="toggleSmsNotifications"
                  >
                    <span
                      :class="[
                        smsNotificationsEnabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none relative inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      ]"
                    >
                      <span
                        :class="[
                          smsNotificationsEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
                          'absolute inset-0 flex size-full items-center justify-center transition-opacity'
                        ]"
                        aria-hidden="true"
                      >
                        <svg
                          class="size-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span
                        :class="[
                          smsNotificationsEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
                          'absolute inset-0 flex size-full items-center justify-center transition-opacity'
                        ]"
                        aria-hidden="true"
                      >
                        <svg
                          class="size-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.707a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">ارسال پوش‌نوتیفیکیشن</span>
                  <button
                    :class="[
                      pushNotificationsEnabled ? 'bg-blue-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    ]"
                    @click="togglePushNotifications"
                  >
                    <span
                      :class="[
                        pushNotificationsEnabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none relative inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      ]"
                    >
                      <span
                        :class="[
                          pushNotificationsEnabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
                          'absolute inset-0 flex size-full items-center justify-center transition-opacity'
                        ]"
                        aria-hidden="true"
                      >
                        <svg
                          class="size-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span
                        :class="[
                          pushNotificationsEnabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
                          'absolute inset-0 flex size-full items-center justify-center transition-opacity'
                        ]"
                        aria-hidden="true"
                      >
                        <svg
                          class="size-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-5.707a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-md mb-3 font-medium text-gray-900">
                محدودیت‌ها
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="mb-1 block text-sm font-medium text-gray-700">حداکثر اعلان در ساعت</label>
                  <input
                    v-model="maxNotificationsPerHour"
                    type="number"
                    min="1"
                    max="1000"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                <div>
                  <label class="mb-1 block text-sm font-medium text-gray-700">حداکثر اعلان در روز</label>
                  <input
                    v-model="maxNotificationsPerDay"
                    type="number"
                    min="1"
                    max="10000"
                    class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button
                :disabled="isSaving"
                class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                @click="saveSettings"
              >
                {{ isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Template Modal -->
    <div v-if="showTemplateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div class="border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingTemplate ? 'ویرایش قالب' : 'ایجاد قالب جدید' }}
          </h3>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="saveTemplate">
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">نام *</label>
              <input
                v-model="templateForm.name"
                type="text"
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">توضیحات</label>
              <textarea
                v-model="templateForm.description"
                rows="2"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">عنوان *</label>
              <input
                v-model="templateForm.title"
                type="text"
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">پیام *</label>
              <textarea
                v-model="templateForm.message"
                rows="3"
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">نوع *</label>
              <select
                v-model="templateForm.type"
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">
                  اطلاعاتی
                </option>
                <option value="success">
                  موفقیت
                </option>
                <option value="warning">
                  هشدار
                </option>
                <option value="error">
                  خطا
                </option>
                <option value="system">
                  سیستمی
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="mb-1 block text-sm font-medium text-gray-700">گیرندگان پیش‌فرض</label>
              <input
                v-model="templateForm.defaultRecipients"
                type="text"
                placeholder="user1,user2,user3"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </form>
        </div>
        <div class="flex justify-end space-x-3 space-x-reverse border-t border-gray-200 px-6 py-4">
          <button
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeTemplateModal"
          >
            انصراف
          </button>
          <button
            :disabled="isSavingTemplate"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            @click="saveTemplate"
          >
            {{ isSavingTemplate ? 'در حال ذخیره...' : 'ذخیره قالب' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

import { ref, onMounted } from 'vue'

// State
const showTemplateModal = ref(false)
const isSaving = ref(false)
const isSavingTemplate = ref(false)
const editingTemplate = ref(false)
const emailNotificationsEnabled = ref(true)
const smsNotificationsEnabled = ref(false)
const pushNotificationsEnabled = ref(true)
const maxNotificationsPerHour = ref(100)
const maxNotificationsPerDay = ref(1000)

// Template form
const templateForm = ref({
  id: '',
  name: '',
  description: '',
  title: '',
  message: '',
  type: 'info',
  defaultRecipients: '',
})

// Sample templates data
const templates = ref([
  {
    id: '1',
    name: 'خوش‌آمدگویی',
    description: 'قالب برای کاربران جدید',
    type: 'success',
    recipients: 1245,
  },
  {
    id: '2',
    name: 'یادآوری جلسه',
    description: 'قالب برای یادآوری جلسات مشاوره',
    type: 'warning',
    recipients: 876,
  },
  {
    id: '3',
    name: 'تعمیرات سیستم',
    description: 'قالب برای اطلاع‌رسانی تعمیرات',
    type: 'info',
    recipients: 5432,
  },
])

// Initialize
onMounted(() => {
  // Load settings from API in a real implementation
  loadSettings()
})

// Methods
const loadSettings = () => {
  // In a real implementation, load settings from API
  console.log('Loading notification settings...')
}

const getNotificationTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    info: 'اطلاعاتی',
    success: 'موفقیت',
    warning: 'هشدار',
    error: 'خطا',
    system: 'سیستمی',
  }
  return typeMap[type] || type
}

const getNotificationTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    system: 'bg-purple-100 text-purple-800',
  }
  return classMap[type] || 'bg-gray-100 text-gray-800'
}

const toggleEmailNotifications = () => {
  emailNotificationsEnabled.value = !emailNotificationsEnabled.value
}

const toggleSmsNotifications = () => {
  smsNotificationsEnabled.value = !smsNotificationsEnabled.value
}

const togglePushNotifications = () => {
  pushNotificationsEnabled.value = !pushNotificationsEnabled.value
}

const saveSettings = async () => {
  isSaving.value = true

  try {
    // Save settings to API in a real implementation
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Settings saved successfully')
  }
  catch (err: any) {
    console.error('Error saving settings:', err)
  }
  finally {
    isSaving.value = false
  }
}

const openCreateTemplateModal = () => {
  editingTemplate.value = false
  templateForm.value = {
    id: '',
    name: '',
    description: '',
    title: '',
    message: '',
    type: 'info',
    defaultRecipients: '',
  }
  showTemplateModal.value = true
}

const editTemplate = (template: any) => {
  editingTemplate.value = true
  templateForm.value = {
    id: template.id,
    name: template.name,
    description: template.description,
    title: 'عنوان پیش‌فرض',
    message: 'پیام پیش‌فرض',
    type: template.type,
    defaultRecipients: '',
  }
  showTemplateModal.value = true
}

const closeTemplateModal = () => {
  showTemplateModal.value = false
}

const saveTemplate = async () => {
  isSavingTemplate.value = true

  try {
    // Save template to API in a real implementation
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingTemplate.value) {
      // Update existing template
      const index = templates.value.findIndex(t => t.id === templateForm.value.id)
      if (index !== -1) {
        templates.value[index] = {
          ...templates.value[index],
          name: templateForm.value.name,
          description: templateForm.value.description,
          type: templateForm.value.type,
        }
      }
    }
    else {
      // Add new template
      templates.value.push({
        id: Date.now().toString(),
        name: templateForm.value.name,
        description: templateForm.value.description,
        type: templateForm.value.type,
        recipients: 0,
      })
    }

    closeTemplateModal()
  }
  catch (err: any) {
    console.error('Error saving template:', err)
  }
  finally {
    isSavingTemplate.value = false
  }
}
</script>

<style scoped>
.admin-notification-settings {
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .admin-notification-settings {
    padding: 1rem;
  }
}
</style>
