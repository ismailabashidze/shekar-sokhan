<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">مدیریت دسته‌بندی‌های پژوهشی</h1>
      <p class="text-gray-600">مدیریت دسته‌بندی‌های سلسله مراتبی پژوهشی با عملیات کامل CRUD</p>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">درخت دسته‌بندی‌ها</h2>
        <div class="flex gap-2">
        <button
          @click="addRootCategory"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          افزودن دسته اصلی
        </button>
        <button
          @click="exportJSON"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          خروجی JSON
        </button>
        <button
          @click="resetData"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          بازنشانی
        </button>
        </div>
      </div>

      <div class="space-y-2">
        <CategoryNode
          v-for="category in categories"
          :key="category.id"
          :category="category"
          :level="0"
          @update="updateCategory"
          @delete="deleteCategory"
          @add-child="(parentId) => addChildCategory(parentId)"
        />
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingCategory"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">ویرایش دسته</h3>
        <form @submit.prevent="saveEdit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">شناسه</label>
            <input
              v-model="editingCategory.id"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">نام (فارسی)</label>
            <input
              v-model="editingCategory.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات (فارسی)</label>
            <textarea
              v-model="editingCategory.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">سطح</label>
            <input
              v-model.number="editingCategory.level"
              type="number"
              min="1"
              max="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div
      v-if="addingCategory"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-2">
          {{ addingCategory.parentId ? 'افزودن زیردسته' : 'افزودن دسته اصلی' }}
        </h3>
        <p v-if="addingCategory.parentName" class="text-sm text-gray-600 mb-4">
          افزودن به: <span class="font-medium">{{ addingCategory.parentName }}</span>
        </p>
        <p class="text-xs text-gray-500 mb-4">
          جزئیات دسته جدید را وارد کنید. شناسه به صورت خودکار تولید می‌شود.
        </p>
        <form @submit.prevent="saveNewCategory">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">شناسه</label>
            <div class="flex gap-2">
              <input
                v-model="addingCategory.id"
                type="text"
                placeholder="شناسه خودکار"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                readonly
              />
              <button
                type="button"
                @click="generateId"
                class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                🔄 تولید مجدد
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">شناسه یکتای خودکار تولید شده</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">نام (فارسی) *</label>
            <input
              v-model="addingCategory.name"
              type="text"
              placeholder="مثال: اقتصاد خرد"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p class="text-xs text-gray-500 mt-1">نام نمایشی به فارسی</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">توضیحات (فارسی) *</label>
            <textarea
              v-model="addingCategory.description"
              rows="3"
              placeholder="مثال: مطالعه رفتار اقتصادی فردی و تصمیم‌گیری"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">توضیح مختصر دسته</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">سطح</label>
            <input
              v-model.number="addingCategory.level"
              type="number"
              min="1"
              max="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              readonly
            />
            <p class="text-xs text-gray-500 mt-1">بر اساس دسته والد به صورت خودکار محاسبه می‌شود</p>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="cancelAdd"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              افزودن دسته
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoryNode from '~/components/CategoryNode.vue'

const categories = ref([])
const editingCategory = ref(null)
const addingCategory = ref(null)
const originalData = ref(null)

// Load initial data
onMounted(async () => {
  try {
    const response = await fetch('/data/research-categories.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (!data.categories || !Array.isArray(data.categories)) {
      throw new Error('Invalid data format: categories array not found')
    }
    categories.value = data.categories
    originalData.value = JSON.parse(JSON.stringify(data.categories))
  } catch (error) {
    console.error('Error loading categories:', error)
    // Show error message to user
    alert('Failed to load research categories. Please check the console for details.')
  }
})

// Add root category
const addRootCategory = () => {
  addingCategory.value = {
    parentId: null,
    parentName: null,
    id: generateCategoryId(),
    name: '',
    description: '',
    level: 1
  }
}

// Update category
const updateCategory = (categoryId, updates) => {
  if (updates.isEditing) {
    editingCategory.value = updates
    return
  }
  
  const findAndUpdate = (cats) => {
    for (let cat of cats) {
      if (cat.id === categoryId) {
        Object.assign(cat, updates)
        return true
      }
      if (cat.children && cat.children.length > 0) {
        if (findAndUpdate(cat.children)) return true
      }
    }
    return false
  }
  findAndUpdate(categories.value)
}

// Delete category
const deleteCategory = (categoryId) => {
  const findAndDelete = (cats) => {
    for (let i = 0; i < cats.length; i++) {
      if (cats[i].id === categoryId) {
        cats.splice(i, 1)
        return true
      }
      if (cats[i].children && cats[i].children.length > 0) {
        if (findAndDelete(cats[i].children)) return true
      }
    }
    return false
  }
  findAndDelete(categories.value)
}

// Add child category
const addChildCategory = (parentId, childData) => {
  // Find parent category to get its name and level
  const findParent = (cats) => {
    for (let cat of cats) {
      if (cat.id === parentId) {
        return cat
      }
      if (cat.children && cat.children.length > 0) {
        const found = findParent(cat.children)
        if (found) return found
      }
    }
    return null
  }
  
  const parent = findParent(categories.value)
  if (!parent) {
    alert('Parent category not found')
    return
  }
  
  addingCategory.value = {
    parentId: parentId,
    parentName: parent.name,
    id: generateCategoryId(),
    name: '',
    description: '',
    level: (parent.level || 1) + 1
  }
}

// Export JSON
const exportJSON = () => {
  try {
    const dataStr = JSON.stringify({ categories: categories.value }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'research-categories-modified.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting JSON:', error)
    alert('Failed to export JSON. Please check the console for details.')
  }
}

// Reset data
const resetData = () => {
  if (confirm('Are you sure you want to reset all changes?')) {
    categories.value = JSON.parse(JSON.stringify(originalData.value))
  }
}

// Modal functions
const saveEdit = () => {
  if (editingCategory.value) {
    const { originalId, isEditing, ...updates } = editingCategory.value
    updateCategory(originalId, updates)
    editingCategory.value = null
  }
}

const cancelEdit = () => {
  editingCategory.value = null
}

const saveNewCategory = () => {
  if (!addingCategory.value) return
  
  const newCategory = {
    id: addingCategory.value.id,
    name: addingCategory.value.name,
    description: addingCategory.value.description,
    level: addingCategory.value.level,
    children: []
  }
  
  if (addingCategory.value.parentId) {
    // Add as child
    const findAndAdd = (cats) => {
      for (let cat of cats) {
        if (cat.id === addingCategory.value.parentId) {
          if (!cat.children) cat.children = []
          cat.children.push(newCategory)
          return true
        }
        if (cat.children && cat.children.length > 0) {
          if (findAndAdd(cat.children)) return true
        }
      }
      return false
    }
    findAndAdd(categories.value)
  } else {
    // Add as root
    categories.value.push(newCategory)
  }
  
  addingCategory.value = null
}

const cancelAdd = () => {
  addingCategory.value = null
}

// Generate unique category ID
const generateCategoryId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `cat_${timestamp}_${random}`
}

const generateId = () => {
  if (addingCategory.value) {
    addingCategory.value.id = generateCategoryId()
  }
}
</script>