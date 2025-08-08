<template>
  <div class="relative">
    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <div class="bg-primary-800 flex animate-pulse flex-col items-center rounded-2xl p-4 sm:flex-row">
          <div class="bg-primary-700/50 relative h-[168px] w-[280px] shrink-0" />
          <div class="mt-6 w-full grow sm:mt-0">
            <div class="flex flex-col gap-4 text-center sm:text-right">
              <div class="bg-primary-700/50 mx-auto h-8 w-1/2 rounded-md sm:mr-0" />
              <div class="bg-primary-700/50 mx-auto h-4 w-3/4 rounded-md sm:mr-0" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12">
        <div class="animate-pulse space-y-4">
          <div class="bg-muted-200 dark:bg-muted-800 h-32 rounded-2xl" />
          <div class="bg-muted-200 dark:bg-muted-800 h-32 rounded-2xl" />
          <div class="bg-muted-200 dark:bg-muted-800 h-32 rounded-2xl" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-12 gap-6">
      <!-- Header -->
      <div class="col-span-12">
        <div class="bg-gradient-to-r from-primary-600 to-primary-800 flex flex-col items-center rounded-2xl p-6 sm:flex-row">
          <div class="relative h-[120px] w-[200px] shrink-0">
            <img
              class="pointer-events-none absolute -start-4 -top-8"
              src="/img/illustrations/dashboards/health/doctor.svg"
              alt="Memory illustration"
            >
          </div>
          <div class="mt-6 grow sm:mt-0">
            <div class="text-center sm:text-right">
              <BaseHeading tag="h1" class="text-white">
                <span>خاطرات من</span>
              </BaseHeading>
              <BaseParagraph size="sm" class="text-white/70">
                <span>مدیریت اطلاعات و خاطرات مهم شما در طول جلسات مشاوره</span>
              </BaseParagraph>
              <div class="mt-4 flex flex-wrap gap-4 text-center sm:text-right">
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-medium text-white/60">کل خاطرات</span>
                  <div class="text-white">
                    <span class="text-lg font-bold">{{ stats.total }}</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-medium text-white/60">اطلاعات شخصی</span>
                  <div class="text-white">
                    <span class="text-lg font-bold">{{ stats.byCategory?.personal_info || 0 }}</span>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-medium text-white/60">اهداف</span>
                  <div class="text-white">
                    <span class="text-lg font-bold">{{ stats.byCategory?.goals || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="col-span-12">
        <BaseCard class="p-6" shape="curved">
          <div class="grid grid-cols-12 gap-4">
            <!-- Search -->
            <div class="col-span-12 md:col-span-6">
              <BaseInput
                v-model="searchQuery"
                icon="ph:magnifying-glass-duotone"
                placeholder="جستجو در خاطرات..."
                @input="debouncedSearch"
              />
            </div>

            <!-- Category Filter -->
            <div class="col-span-12 sm:col-span-6 md:col-span-3">
              <BaseSelect v-model="selectedCategory">
                <option value="">همه دسته‌ها</option>
                <option value="personal_info">اطلاعات شخصی</option>
                <option value="goals">اهداف</option>
                <option value="symptoms">علائم</option>
                <option value="triggers">محرک‌ها</option>
                <option value="relationships">روابط</option>
                <option value="progress">پیشرفت</option>
                <option value="preferences">تنظیمات</option>
                <option value="therapy_notes">یادداشت‌های درمانی</option>
                <option value="important_events">رویدادهای مهم</option>
                <option value="other">سایر</option>
              </BaseSelect>
            </div>

            <!-- Importance Filter -->
            <div class="col-span-12 sm:col-span-6 md:col-span-3">
              <BaseSelect v-model="minImportance">
                <option value="1">همه سطوح اهمیت</option>
                <option value="6">مهم (6+)</option>
                <option value="8">خیلی مهم (8+)</option>
                <option value="10">بحرانی (10)</option>
              </BaseSelect>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <BaseButton 
              @click="openAddMemoryModal" 
              color="primary" 
              size="sm"
            >
              <Icon name="ph:plus-circle-duotone" class="me-1 size-4" />
              افزودن خاطره جدید
            </BaseButton>
            <BaseButton 
              @click="exportMemories" 
              color="muted" 
              size="sm"
              :loading="isExporting"
            >
              <Icon name="ph:download-duotone" class="me-1 size-4" />
              دریافت فایل
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Memory List -->
      <div class="col-span-12">
        <div v-if="memories.length === 0" class="text-center py-12">
          <BaseCard class="p-10" shape="curved">
            <div class="flex flex-col items-center text-center">
              <img
                src="/img/illustrations/placeholders/flat/placeholder-search-1.svg"
                alt="No memories"
                class="mb-6 w-72"
              >
              <BaseHeading
                tag="h2"
                size="xl"
                weight="medium"
                class="text-muted-800 mb-2 dark:text-white"
              >
                خاطره‌ای یافت نشد
              </BaseHeading>
              <BaseParagraph size="md" class="text-muted-400 mb-6">
                هنوز خاطره‌ای ثبت نشده است. اولین خاطره خود را اضافه کنید.
              </BaseParagraph>
              <BaseButton color="primary" @click="openAddMemoryModal">
                <Icon name="ph:plus-circle-duotone" class="me-2 size-5" />
                افزودن خاطره جدید
              </BaseButton>
            </div>
          </BaseCard>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="memory in memories"
            :key="memory.id"
            class="group relative"
          >
            <BaseCard
              shape="rounded"
              class="border-2 p-6 transition-all duration-300 hover:shadow-lg"
              :class="getCategoryBorderClass(memory.category)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <!-- Memory Header -->
                  <div class="mb-4 flex items-center gap-3">
                    <div 
                      class="rounded-lg p-2"
                      :class="getCategoryBgClass(memory.category)"
                    >
                      <Icon 
                        :name="getCategoryIcon(memory.category)" 
                        class="size-5"
                        :class="getCategoryTextClass(memory.category)"
                      />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <BaseText size="xs" class="text-muted-500 font-medium uppercase">
                          {{ getCategoryLabel(memory.category) }}
                        </BaseText>
                        <div 
                          class="rounded-full px-2 py-0.5 text-xs font-medium"
                          :class="getImportanceClass(memory.importance)"
                        >
                          اهمیت {{ memory.importance }}/10
                        </div>
                      </div>
                      <BaseText size="xs" class="text-muted-400 mt-1">
                        {{ formatDate(memory.created) }}
                        <span v-if="memory.access_count > 0">
                          · {{ memory.access_count }} بار استفاده
                        </span>
                      </BaseText>
                    </div>
                  </div>

                  <!-- Memory Content -->
                  <BaseText size="sm" class="text-muted-700 dark:text-muted-300 mb-4 leading-relaxed">
                    {{ memory.content }}
                  </BaseText>

                  <!-- Tags -->
                  <div v-if="memory.tags && memory.tags.length > 0" class="mb-4 flex flex-wrap gap-2">
                    <span
                      v-for="tag in memory.tags"
                      :key="tag"
                      class="bg-muted-100 dark:bg-muted-800 text-muted-600 dark:text-muted-400 rounded-full px-2 py-1 text-xs"
                    >
                      #{{ tag }}
                    </span>
                  </div>

                  <!-- Session Link -->
                  <div v-if="memory.expand?.session_id" class="mb-4">
                    <BaseButton
                      @click="goToSession(memory.session_id)"
                      color="muted"
                      size="sm"
                    >
                      <Icon name="ph:chat-circle-duotone" class="me-1 size-4" />
                      مشاهده جلسه
                    </BaseButton>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <BaseButton
                    @click="openEditMemoryModal(memory)"
                    color="muted"
                    size="sm"
                  >
                    <Icon name="ph:pencil-duotone" class="size-4" />
                  </BaseButton>
                  <BaseButton
                    @click="openDeleteModal(memory)"
                    color="danger"
                    size="sm"
                  >
                    <Icon name="ph:trash-duotone" class="size-4" />
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMore" class="text-center py-6">
            <BaseButton
              @click="loadMore"
              color="muted"
              :loading="isLoadingMore"
            >
              نمایش بیشتر
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Memory Modal -->
    <TairoModal
      :open="isMemoryModalOpen"
      size="md"
      @close="closeMemoryModal"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 md:p-6">
          <BaseHeading
            tag="h3"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            {{ editingMemory ? 'ویرایش خاطره' : 'افزودن خاطره جدید' }}
          </BaseHeading>
          <ButtonClose @click="closeMemoryModal" />
        </div>
      </template>

      <div class="p-4 md:p-6">
        <div class="space-y-6">
          <!-- Content -->
          <BaseTextarea
            v-model="memoryForm.content"
            label="محتوای خاطره"
            placeholder="محتوای خاطره خود را بنویسید..."
            rows="4"
            :error="memoryForm.contentError"
          />

          <!-- Category -->
          <BaseSelect
            v-model="memoryForm.category"
            label="دسته‌بندی"
          >
            <option value="personal_info">اطلاعات شخصی</option>
            <option value="goals">اهداف</option>
            <option value="symptoms">علائم</option>
            <option value="triggers">محرک‌ها</option>
            <option value="relationships">روابط</option>
            <option value="progress">پیشرفت</option>
            <option value="preferences">تنظیمات</option>
            <option value="therapy_notes">یادداشت‌های درمانی</option>
            <option value="important_events">رویدادهای مهم</option>
            <option value="other">سایر</option>
          </BaseSelect>

          <!-- Importance -->
          <div>
            <label class="text-muted-600 dark:text-muted-400 mb-2 block text-sm font-medium">
              سطح اهمیت: {{ memoryForm.importance }}/10
            </label>
            <input
              v-model="memoryForm.importance"
              type="range"
              min="1"
              max="10"
              class="w-full"
            >
          </div>

          <!-- Tags -->
          <BaseInput
            v-model="tagsInput"
            label="برچسب‌ها (با کاما جدا کنید)"
            placeholder="مثال: مهم، درمان، خانواده"
            @keyup.enter="addTagsFromInput"
          />

          <div v-if="memoryForm.tags.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in memoryForm.tags"
              :key="index"
              class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 flex items-center gap-1 rounded-full px-3 py-1 text-xs"
            >
              {{ tag }}
              <button
                @click="removeTag(index)"
                class="hover:text-primary-900 dark:hover:text-primary-100"
              >
                <Icon name="ph:x" class="size-3" />
              </button>
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2 p-4 sm:p-6">
          <BaseButton @click="closeMemoryModal">
            انصراف
          </BaseButton>
          <BaseButton
            color="primary"
            :loading="isSaving"
            @click="saveMemory"
          >
            {{ editingMemory ? 'ذخیره تغییرات' : 'افزودن خاطره' }}
          </BaseButton>
        </div>
      </template>
    </TairoModal>

    <!-- Delete Confirmation Modal -->
    <TairoModal
      :open="isDeleteModalOpen"
      size="sm"
      @close="isDeleteModalOpen = false"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 md:p-6">
          <BaseHeading
            tag="h3"
            size="md"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            تایید حذف
          </BaseHeading>
          <ButtonClose @click="isDeleteModalOpen = false" />
        </div>
      </template>

      <div class="p-4 text-center md:p-6">
        <div class="relative mx-auto mb-4 flex size-24 justify-center">
          <Icon
            name="ph:trash-duotone"
            class="text-danger-500 size-24"
          />
        </div>
        <BaseParagraph class="text-muted-700 dark:text-muted-300 mb-4">
          آیا از حذف این خاطره اطمینان دارید؟
        </BaseParagraph>
        <BaseParagraph class="text-muted-500 mb-4 text-sm">
          پس از حذف، امکان بازیابی وجود ندارد.
        </BaseParagraph>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2 p-4 sm:p-6">
          <BaseButton @click="isDeleteModalOpen = false">
            انصراف
          </BaseButton>
          <BaseButton
            color="danger"
            :loading="isDeleting"
            @click="confirmDelete"
          >
            حذف
          </BaseButton>
        </div>
      </template>
    </TairoModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { MemoryItem, MemoryCategory } from '~/types/memory'

definePageMeta({
  title: 'خاطرات من',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { 
  getUserMemories, 
  getMemoryStats, 
  addMemory, 
  updateMemory, 
  deleteMemory,
  searchMemories
} = useMem0()

const router = useRouter()
const toaster = useToaster()

// State
const isLoading = ref(true)
const isLoadingMore = ref(false)
const isExporting = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)

const memories = ref<MemoryItem[]>([])
const stats = ref({ total: 0, byCategory: {} })
const currentPage = ref(1)
const hasMore = ref(false)

// Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const minImportance = ref('1')

// Modals
const isMemoryModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingMemory = ref<MemoryItem | null>(null)
const memoryToDelete = ref<MemoryItem | null>(null)

// Form data
const memoryForm = reactive({
  content: '',
  category: 'other' as MemoryCategory,
  importance: 5,
  tags: [] as string[],
  contentError: ''
})

const tagsInput = ref('')

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      performSearch()
    } else {
      fetchMemories()
    }
  }, 500)
}

// Methods
const fetchMemories = async (reset = true) => {
  try {
    if (reset) {
      isLoading.value = true
      currentPage.value = 1
      memories.value = []
    } else {
      isLoadingMore.value = true
    }

    const filters: any = {}
    if (selectedCategory.value) filters.category = selectedCategory.value
    if (minImportance.value !== '1') filters.minImportance = parseInt(minImportance.value)

    const result = await getUserMemories(currentPage.value, 20, filters)
    
    if (reset) {
      memories.value = result.items
    } else {
      memories.value.push(...result.items)
    }
    
    hasMore.value = result.page < result.totalPages
    
  } catch (error) {
    console.error('Error fetching memories:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در بارگذاری خاطرات',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true
    })
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const performSearch = async () => {
  try {
    isLoading.value = true
    
    const searchOptions: any = { limit: 50 }
    if (selectedCategory.value) searchOptions.category = selectedCategory.value
    if (minImportance.value !== '1') searchOptions.minImportance = parseInt(minImportance.value)
    
    const result = await searchMemories(searchQuery.value, searchOptions)
    
    // Combine and deduplicate results
    const allResults = [...result.localResults]
    memories.value = allResults
    hasMore.value = false
    
  } catch (error) {
    console.error('Error searching memories:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchStats = async () => {
  try {
    const result = await getMemoryStats()
    stats.value = result
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const loadMore = () => {
  currentPage.value++
  fetchMemories(false)
}

const openAddMemoryModal = () => {
  editingMemory.value = null
  resetForm()
  isMemoryModalOpen.value = true
}

const openEditMemoryModal = (memory: MemoryItem) => {
  editingMemory.value = memory
  memoryForm.content = memory.content
  memoryForm.category = memory.category
  memoryForm.importance = memory.importance
  memoryForm.tags = [...memory.tags]
  isMemoryModalOpen.value = true
}

const closeMemoryModal = () => {
  isMemoryModalOpen.value = false
  editingMemory.value = null
  resetForm()
}

const resetForm = () => {
  memoryForm.content = ''
  memoryForm.category = 'other'
  memoryForm.importance = 5
  memoryForm.tags = []
  memoryForm.contentError = ''
  tagsInput.value = ''
}

const addTagsFromInput = () => {
  if (tagsInput.value.trim()) {
    const newTags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !memoryForm.tags.includes(tag))
    
    memoryForm.tags.push(...newTags)
    tagsInput.value = ''
  }
}

const removeTag = (index: number) => {
  memoryForm.tags.splice(index, 1)
}

const saveMemory = async () => {
  // Validate
  if (!memoryForm.content.trim()) {
    memoryForm.contentError = 'محتوای خاطره الزامی است'
    return
  }
  
  memoryForm.contentError = ''
  isSaving.value = true

  try {
    if (editingMemory.value) {
      // Update existing memory
      await updateMemory(editingMemory.value.id!, {
        content: memoryForm.content,
        category: memoryForm.category,
        importance: memoryForm.importance,
        tags: memoryForm.tags
      })
      
      toaster.show({
        title: 'موفق',
        message: 'خاطره با موفقیت بروزرسانی شد',
        color: 'success',
        icon: 'ph:check-circle-duotone',
        closable: true
      })
    } else {
      // Add new memory
      await addMemory(memoryForm.content, memoryForm.category, {
        importance: memoryForm.importance,
        tags: memoryForm.tags,
        sourceType: 'user_input'
      })
      
      toaster.show({
        title: 'موفق',
        message: 'خاطره جدید اضافه شد',
        color: 'success',
        icon: 'ph:plus-circle-duotone',
        closable: true
      })
    }
    
    closeMemoryModal()
    // Only refresh if we're not searching
    if (!searchQuery.value.trim()) {
      await Promise.all([fetchMemories(), fetchStats()])
    } else {
      // If searching, just refresh search results
      await performSearch()
      await fetchStats()
    }
    
  } catch (error) {
    console.error('Error saving memory:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در ذخیره خاطره',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true
    })
  } finally {
    isSaving.value = false
  }
}

const openDeleteModal = (memory: MemoryItem) => {
  memoryToDelete.value = memory
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!memoryToDelete.value) return
  
  isDeleting.value = true
  
  try {
    await deleteMemory(memoryToDelete.value.id!)
    
    toaster.show({
      title: 'موفق',
      message: 'خاطره حذف شد',
      color: 'success',
      icon: 'ph:trash-duotone',
      closable: true
    })
    
    isDeleteModalOpen.value = false
    // Only refresh if we're not searching
    if (!searchQuery.value.trim()) {
      await Promise.all([fetchMemories(), fetchStats()])
    } else {
      // If searching, just refresh search results
      await performSearch()
      await fetchStats()
    }
    
  } catch (error) {
    console.error('Error deleting memory:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف خاطره',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true
    })
  } finally {
    isDeleting.value = false
    memoryToDelete.value = null
  }
}

const exportMemories = async () => {
  isExporting.value = true
  
  try {
    // Get all memories for export
    const allMemories = await getUserMemories(1, 1000)
    
    // Create CSV content
    const headers = ['محتوا', 'دسته‌بندی', 'اهمیت', 'تاریخ ایجاد', 'برچسب‌ها']
    const csvRows = [headers.join(',')]
    
    allMemories.items.forEach((memory: MemoryItem) => {
      const row = [
        `"${memory.content.replace(/"/g, '""')}"`,
        getCategoryLabel(memory.category),
        memory.importance.toString(),
        formatDate(memory.created),
        `"${memory.tags.join(', ')}"`
      ]
      csvRows.push(row.join(','))
    })
    
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `memories-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
  } catch (error) {
    console.error('Error exporting memories:', error)
    toaster.show({
      title: 'خطا',
      message: 'خطا در دریافت فایل',
      color: 'danger',
      icon: 'ph:warning-circle-duotone',
      closable: true
    })
  } finally {
    isExporting.value = false
  }
}

const goToSession = (sessionId: string) => {
  router.push(`/mana/chat?session=${sessionId}`)
}

// Helper functions for styling
const getCategoryBorderClass = (category: MemoryCategory) => {
  const classes = {
    personal_info: 'border-blue-200 dark:border-blue-500/20',
    goals: 'border-green-200 dark:border-green-500/20',
    symptoms: 'border-red-200 dark:border-red-500/20',
    triggers: 'border-orange-200 dark:border-orange-500/20',
    relationships: 'border-pink-200 dark:border-pink-500/20',
    progress: 'border-emerald-200 dark:border-emerald-500/20',
    preferences: 'border-purple-200 dark:border-purple-500/20',
    therapy_notes: 'border-indigo-200 dark:border-indigo-500/20',
    important_events: 'border-yellow-200 dark:border-yellow-500/20',
    other: 'border-gray-200 dark:border-gray-500/20'
  }
  return classes[category] || classes.other
}

const getCategoryBgClass = (category: MemoryCategory) => {
  const classes = {
    personal_info: 'bg-blue-100 dark:bg-blue-500/20',
    goals: 'bg-green-100 dark:bg-green-500/20',
    symptoms: 'bg-red-100 dark:bg-red-500/20',
    triggers: 'bg-orange-100 dark:bg-orange-500/20',
    relationships: 'bg-pink-100 dark:bg-pink-500/20',
    progress: 'bg-emerald-100 dark:bg-emerald-500/20',
    preferences: 'bg-purple-100 dark:bg-purple-500/20',
    therapy_notes: 'bg-indigo-100 dark:bg-indigo-500/20',
    important_events: 'bg-yellow-100 dark:bg-yellow-500/20',
    other: 'bg-gray-100 dark:bg-gray-500/20'
  }
  return classes[category] || classes.other
}

const getCategoryTextClass = (category: MemoryCategory) => {
  const classes = {
    personal_info: 'text-blue-600 dark:text-blue-400',
    goals: 'text-green-600 dark:text-green-400',
    symptoms: 'text-red-600 dark:text-red-400',
    triggers: 'text-orange-600 dark:text-orange-400',
    relationships: 'text-pink-600 dark:text-pink-400',
    progress: 'text-emerald-600 dark:text-emerald-400',
    preferences: 'text-purple-600 dark:text-purple-400',
    therapy_notes: 'text-indigo-600 dark:text-indigo-400',
    important_events: 'text-yellow-600 dark:text-yellow-400',
    other: 'text-gray-600 dark:text-gray-400'
  }
  return classes[category] || classes.other
}

const getCategoryIcon = (category: MemoryCategory) => {
  const icons = {
    personal_info: 'ph:user-duotone',
    goals: 'ph:target-duotone',
    symptoms: 'ph:heart-duotone',
    triggers: 'ph:warning-duotone',
    relationships: 'ph:users-duotone',
    progress: 'ph:trend-up-duotone',
    preferences: 'ph:gear-duotone',
    therapy_notes: 'ph:notepad-duotone',
    important_events: 'ph:calendar-star-duotone',
    other: 'ph:folder-duotone'
  }
  return icons[category] || icons.other
}

const getCategoryLabel = (category: MemoryCategory) => {
  const labels = {
    personal_info: 'اطلاعات شخصی',
    goals: 'اهداف',
    symptoms: 'علائم',
    triggers: 'محرک‌ها',
    relationships: 'روابط',
    progress: 'پیشرفت',
    preferences: 'تنظیمات',
    therapy_notes: 'یادداشت‌های درمانی',
    important_events: 'رویدادهای مهم',
    other: 'سایر'
  }
  return labels[category] || labels.other
}

const getImportanceClass = (importance: number) => {
  if (importance >= 8) return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  if (importance >= 6) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
  return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fa-IR', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Watchers - Add debouncing to prevent too many requests
let filterTimeout: NodeJS.Timeout
watch([selectedCategory, minImportance], () => {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    fetchMemories()
  }, 300) // 300ms debounce
})

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchMemories(),
    fetchStats()
  ])
})
</script>

<style scoped>
/* Custom styles for memory categories */
input[type="range"] {
  @apply appearance-none bg-muted-200 dark:bg-muted-700 h-2 rounded-lg;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-primary-500 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 bg-primary-500 rounded-full cursor-pointer border-none;
}
</style>