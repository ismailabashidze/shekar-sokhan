<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

definePageMeta({
  title: 'مدیریت آدرس‌ها - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مدیریت آدرس‌ها - با هم',
  meta: [
    { name: 'description', content: 'مدیریت آدرس‌های تحویل سفارشات' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// New address form data
const newAddress = reactive({
  title: '',
  city: '',
  addressLine: ''
})

// Edit address form data
const editAddress = reactive({
  id: null,
  title: '',
  city: '',
  addressLine: ''
})

// Sample addresses data
const addresses = ref([
  {
    id: 1,
    title: 'خانه',
    city: 'تهران',
    addressLine: 'تهران، خیابان ولیعصر، پلاک 123',
    isDefault: true,
    lat: 35.6892,
    lng: 51.3890
  },
  {
    id: 2,
    title: 'دفتر کار',
    city: 'اصفهان',
    addressLine: 'اصفهان، میدان نقش جهان، پلاک 456',
    isDefault: false,
    lat: 32.6546,
    lng: 51.6679
  },
  {
    id: 3,
    title: 'خانه والدین',
    city: 'شیراز',
    addressLine: 'شیراز، خیابان زند، پلاک 789',
    isDefault: false,
    lat: 29.5918,
    lng: 52.5837
  }
])

// Modal states
const isMapModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedAddress = ref(null)

// Toast for notifications
const toast = useToaster()

// Add new address function
const addAddress = () => {
  if (!newAddress.title || !newAddress.city || !newAddress.addressLine) {
    toast.error('لطفاً تمام فیلدهای الزامی را پر کنید')
    return
  }
  
  const address = {
    id: addresses.value.length + 1,
    title: newAddress.title,
    city: newAddress.city,
    addressLine: newAddress.addressLine,
    isDefault: false,
    lat: 35.6892, // Default to Tehran coordinates
    lng: 51.3890
  }
  
  addresses.value.push(address)
  
  // Reset form
  newAddress.title = ''
  newAddress.city = ''
  newAddress.addressLine = ''
  
  toast.success('آدرس با موفقیت اضافه شد')
}

// Set address as default
const setAsDefault = (id) => {
  // Reset current default
  addresses.value.forEach(addr => {
    addr.isDefault = false
  })
  
  // Set new default
  const address = addresses.value.find(addr => addr.id === id)
  if (address) {
    address.isDefault = true
    toast.success(`آدرس "${address.title}" به عنوان پیش‌فرض تنظیم شد`)
  }
}

// Delete address
const deleteAddress = (id) => {
  const index = addresses.value.findIndex(addr => addr.id === id)
  if (index !== -1) {
    const address = addresses.value[index]
    if (address.isDefault) {
      toast.error('آدرس پیش‌فرض را نمی‌توان حذف کرد')
      return
    }
    
    addresses.value.splice(index, 1)
    toast.success('آدرس با موفقیت حذف شد')
  }
}

// Open map modal
const openMapModal = (address) => {
  selectedAddress.value = address
  isMapModalOpen.value = true
}

// Open edit modal
const openEditModal = (address) => {
  editAddress.id = address.id
  editAddress.title = address.title
  editAddress.city = address.city
  editAddress.addressLine = address.addressLine
  isEditModalOpen.value = true
}

// Update address function
const updateAddress = () => {
  if (!editAddress.title || !editAddress.city || !editAddress.addressLine) {
    toast.error('لطفاً تمام فیلدهای الزامی را پر کنید')
    return
  }
  
  const index = addresses.value.findIndex(addr => addr.id === editAddress.id)
  if (index !== -1) {
    addresses.value[index].title = editAddress.title
    addresses.value[index].city = editAddress.city
    addresses.value[index].addressLine = editAddress.addressLine
    toast.success('آدرس با موفقیت به‌روزرسانی شد')
    isEditModalOpen.value = false
  }
}

// Close modals
const closeMapModal = () => {
  isMapModalOpen.value = false
  selectedAddress.value = null
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editAddress.id = null
  editAddress.title = ''
  editAddress.city = ''
  editAddress.addressLine = ''
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:map-pin-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">مدیریت آدرس‌ها</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">مدیریت آدرس‌های تحویل سفارشات</p>
    </div>
    
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <BaseButton 
        variant="outline" 
        color="default" 
        @click="$router.back()"
        rounded="lg"
      >
        <Icon name="ph:arrow-right-duotone" class="h-4 w-4 ml-2" />
        بازگشت
      </BaseButton>
    </div>
    
    <!-- Add New Address Form -->
    <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm mb-8">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon name="ph:plus-circle-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
          افزودن آدرس جدید
        </h2>
      </div>
      <div class="p-6">
        <form @submit.prevent="addAddress" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <BaseLabel for="title" class="mb-2">عنوان آدرس *</BaseLabel>
              <BaseInput
                id="title"
                v-model="newAddress.title"
                placeholder="مثال: خانه، دفتر کار"
                required
                rounded="lg"
              />
            </div>
            
            <div>
              <BaseLabel for="city" class="mb-2">شهر *</BaseLabel>
              <BaseInput
                id="city"
                v-model="newAddress.city"
                placeholder="مثال: تهران"
                required
                rounded="lg"
              />
            </div>
            
            <div class="md:col-span-2">
              <BaseLabel for="addressLine" class="mb-2">آدرس کامل *</BaseLabel>
              <BaseInput
                id="addressLine"
                v-model="newAddress.addressLine"
                placeholder="مثال: تهران، خیابان ولیعصر، پلاک 123"
                required
                rounded="lg"
              />
            </div>
          </div>
          
          <div class="flex items-center justify-end pt-4">
            <BaseButton 
              type="submit" 
              variant="solid" 
              color="primary"
              size="lg"
            >
              <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
              افزودن آدرس
            </BaseButton>
          </div>
        </form>
      </div>
    </BaseCard>
    
    <!-- Address List -->
    <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon name="ph:bookmark-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
          آدرس‌های ذخیره شده
        </h2>
      </div>
      <div class="p-6">
        <div v-if="addresses.length > 0" class="space-y-4">
          <BaseCard
            v-for="address in addresses"
            :key="address.id"
            rounded="lg"
            class="dark:!bg-muted-800 border border-gray-200 dark:border-gray-700"
            :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': address.isDefault }"
          >
            <div class="p-5">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center mb-2">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ address.title }}</h3>
                    <span
                      v-if="address.isDefault"
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                    >
                      <Icon name="ph:check-circle-duotone" class="h-3 w-3 ml-1" />
                      پیش‌فرض
                    </span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 mb-1">{{ address.addressLine }}</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ address.city }}</p>
                </div>
                
                <div class="flex space-x-2 rtl:space-x-reverse">
                  <BaseButton
                    @click="openMapModal(address)"
                    variant="ghost"
                    color="info"
                    size="sm"
                    rounded="lg"
                    class="p-2"
                  >
                    <Icon name="ph:map-trifold-duotone" class="h-4 w-4" />
                  </BaseButton>
                  <BaseButton
                    @click="openEditModal(address)"
                    variant="ghost"
                    color="warning"
                    size="sm"
                    rounded="lg"
                    class="p-2"
                  >
                    <Icon name="ph:note-pencil-duotone" class="h-4 w-4" />
                  </BaseButton>
                  <BaseButton
                    v-if="!address.isDefault"
                    @click="setAsDefault(address.id)"
                    variant="outline"
                    color="primary"
                    size="sm"
                    rounded="lg"
                  >
                    تنظیم به عنوان پیش‌فرض
                  </BaseButton>
                  <BaseButton
                    v-if="!address.isDefault"
                    @click="deleteAddress(address.id)"
                    variant="outline"
                    color="danger"
                    size="sm"
                    rounded="lg"
                  >
                    <Icon name="ph:trash-duotone" class="h-4 w-4" />
                  </BaseButton>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6 mx-auto">
            <Icon name="ph:map-pin-duotone" class="h-8 w-8 text-primary-500" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">آدرسی ثبت نشده است</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">برای افزودن آدرس از فرم بالا استفاده کنید</p>
        </div>
      </div>
    </BaseCard>
  </div>
  
  <!-- Map Modal -->
  <TairoModal
    v-model:open="isMapModalOpen"
    size="2xl"
    :closable="true"
    @close="closeMapModal"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:map-pin-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            موقعیت آدرس
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ selectedAddress?.title }}
          </p>
        </div>
      </div>
    </template>
    
    <div class="p-6">
      <div class="bg-gray-100 dark:bg-muted-800 border-2 border-dashed border-gray-300 dark:border-muted-700 rounded-xl w-full h-80 flex items-center justify-center mb-6">
        <div class="text-center">
          <Icon name="ph:map-duotone" class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            نمایش نقشه برای: {{ selectedAddress?.addressLine }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
            مختصات: {{ selectedAddress?.lat }}, {{ selectedAddress?.lng }}
          </p>
        </div>
      </div>
      
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
          <Icon name="ph:info-duotone" class="h-4 w-4" />
          اطلاعات آدرس
        </h4>
        <div class="space-y-1">
          <p class="text-blue-700 dark:text-blue-300">{{ selectedAddress?.addressLine }}</p>
          <p class="text-blue-700 dark:text-blue-300">{{ selectedAddress?.city }}</p>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton
          variant="outline"
          color="default"
          size="lg"
          rounded="lg"
          @click="closeMapModal"
        >
          بستن
        </BaseButton>
      </div>
    </template>
  </TairoModal>
  
  <!-- Edit Address Modal -->
  <TairoModal
    v-model:open="isEditModalOpen"
    size="lg"
    :closable="true"
    @close="closeEditModal"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
          <Icon name="ph:note-pencil-duotone" class="h-5 w-5 text-warning-600 dark:text-warning-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            ویرایش آدرس
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            تغییر اطلاعات آدرس انتخاب شده
          </p>
        </div>
      </div>
    </template>
    
    <div class="p-6">
      <form @submit.prevent="updateAddress" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BaseLabel for="editTitle" class="mb-2">عنوان آدرس *</BaseLabel>
            <BaseInput
              id="editTitle"
              v-model="editAddress.title"
              placeholder="مثال: خانه، دفتر کار"
              required
              rounded="lg"
            />
          </div>
          
          <div>
            <BaseLabel for="editCity" class="mb-2">شهر *</BaseLabel>
            <BaseInput
              id="editCity"
              v-model="editAddress.city"
              placeholder="مثال: تهران"
              required
              rounded="lg"
            />
          </div>
          
          <div class="md:col-span-2">
            <BaseLabel for="editAddressLine" class="mb-2">آدرس کامل *</BaseLabel>
            <BaseInput
              id="editAddressLine"
              v-model="editAddress.addressLine"
              placeholder="مثال: تهران، خیابان ولیعصر، پلاک 123"
              required
              rounded="lg"
            />
          </div>
        </div>
      </form>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton
          variant="outline"
          color="default"
          size="lg"
          rounded="lg"
          @click="closeEditModal"
        >
          انصراف
        </BaseButton>
        <BaseButton
          variant="solid"
          color="primary"
          size="lg"
          rounded="lg"
          @click="updateAddress"
        >
          <Icon name="ph:floppy-disk-duotone" class="h-4 w-4 ml-2" />
          ذخیره تغییرات
        </BaseButton>
      </div>
    </template>
  </TairoModal>
</template>