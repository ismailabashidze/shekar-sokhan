<script setup lang="ts">
import type { ClinicRegistration } from '~/types/wizard'
import type { User } from '~/composables/user'

definePageMeta({
  title: 'ثبت کلینیک جدید',
  layout: 'empty',
})

useHead({
  title: 'ثبت کلینیک جدید',
  htmlAttrs: { dir: 'rtl' },
})

const toaster = useToaster()
const router = useRouter()
const nuxtApp = useNuxtApp()
const { getUserAvatarUrl } = useAvatarManager()

// Check if current user is admin
const isAdmin = computed(() => nuxtApp.$pb.authStore.model?.role === 'admin')

// Users list for admin owner selection
const users = ref<any[]>([])
const filteredUsers = ref<any[]>([])
const loadingUsers = ref(false)
const searchQuery = ref('')
const selectedUser = ref<any>(null)
const showUserList = ref(false)

// Search and filter functions
const searchUsers = async (query: string) => {
  if (!query.trim()) {
    filteredUsers.value = []
    return
  }
  
  try {
    loadingUsers.value = true
    const filter = [
      `meta.name ~ "${query}"`,
      `meta.email ~ "${query}"`,
      `username ~ "${query}"`,
    ].join(' || ')
    
    const resultList = await nuxtApp.$pb.collection('users').getList(1, 10, {
      sort: '-created',
      filter,
    })
    
    filteredUsers.value = resultList.items.map(item => ({
      id: item.id,
      avatarUrl: getUserAvatarUrl(item),
      name: item.meta?.name || item.name,
      username: item.username,
      email: item.meta?.email || item.email,
      role: item.role,
      initials: (item.meta?.name || item.name || item.username || 'کا').substring(0, 2),
      avatar: getUserAvatarUrl(item),
      meta: item.meta, // Keep meta for backward compatibility
    }))
  } catch (error) {
    console.error('Error searching users:', error)
  } finally {
    loadingUsers.value = false
  }
}

let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = (query: string) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    searchUsers(query)
  }, 300)
}

// Handle user selection
const selectUser = (user: any) => {
  selectedUser.value = user
  form.value.owner = user.id
  searchQuery.value = user.name || user.meta?.name || user.email || user.username
  showUserList.value = false
  
  // Auto-fill owner information
  const fullName = user.name || user.meta?.name || ''
  if (fullName) {
    const nameParts = fullName.split(' ')
    form.value.ownerFirstName = nameParts[0] || ''
    form.value.ownerLastName = nameParts.slice(1).join(' ') || ''
  } else {
    // If no name available, use username
    form.value.ownerFirstName = user.username || ''
    form.value.ownerLastName = ''
  }
  
  form.value.ownerEmail = user.email || user.meta?.email || ''
  // Clear phone as it's not available in user data
  form.value.ownerPhone = ''
  
  console.log('Selected user:', user)
  console.log('Form after selection:', form.value)
}

// Clear selection
const clearSelection = () => {
  selectedUser.value = null
  form.value.owner = undefined
  searchQuery.value = ''
  showUserList.value = false
  filteredUsers.value = []
  
  // Clear auto-filled data
  form.value.ownerFirstName = ''
  form.value.ownerLastName = ''
  form.value.ownerEmail = ''
  form.value.ownerPhone = ''
}

// Handle search input
const handleSearchUpdate = (value: string) => {
  searchQuery.value = value
  
  // Clear selection if user is typing new value
  if (selectedUser.value && value !== (selectedUser.value.name || selectedUser.value.meta?.name || selectedUser.value.email || selectedUser.value.username)) {
    selectedUser.value = null
    form.value.owner = undefined
  }
  
  if (value.trim()) {
    showUserList.value = true
    debouncedSearch(value)
  } else {
    showUserList.value = false
    filteredUsers.value = []
  }
}

// Handle focus and blur events
const handleSearchFocus = () => {
  if (searchQuery.value.trim() && !selectedUser.value) {
    showUserList.value = true
  }
}

const handleSearchBlur = () => {
  // Delay hiding to allow selection
  setTimeout(() => {
    showUserList.value = false
  }, 200)
}

const form = ref<ClinicRegistration>({
  name: '',
  address: '',
  phone: '',
  email: '',
  license: '',
  description: '',
  logo: null,
  owner: undefined,
  ownerFirstName: '',
  ownerLastName: '',
  ownerEmail: '',
  ownerPhone: ''
})

const loading = ref(false)
const errors = ref<Record<string, string>>({})
const logoPreview = ref<string | null>(null)

// Initialize component
onMounted(() => {
  // No need to load all users initially - we'll search as needed
})

// Watch for selectedUser changes
watch(selectedUser, (newUser) => {
  console.log('Selected user changed:', newUser)
})

// Watch for form changes
watch(() => form.value, (newForm) => {
  console.log('Form changed:', newForm)
}, { deep: true })

// Handle logo upload
function handleLogoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toaster.show({
        title: 'خطا',
        message: 'فقط فایل‌های تصویری مجاز هستند',
        color: 'danger',
        icon: 'lucide:alert-triangle',
        closable: true,
      })
      return
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toaster.show({
        title: 'خطا',
        message: 'حجم فایل نباید بیش از ۲ مگابایت باشد',
        color: 'danger',
        icon: 'lucide:alert-triangle',
        closable: true,
      })
      return
    }
    
    form.value.logo = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

function removeLogo() {
  form.value.logo = null
  logoPreview.value = null
}

// Handle owner selection change
function onOwnerChange(ownerId: string) {
  const selectedUser = users.value.find(u => u.id === ownerId)
  if (selectedUser) {
    form.value.owner = ownerId
    // Auto-fill owner info if available
    if (selectedUser.meta?.name) {
      const nameParts = selectedUser.meta.name.split(' ')
      form.value.ownerFirstName = nameParts[0] || ''
      form.value.ownerLastName = nameParts.slice(1).join(' ') || ''
    }
    form.value.ownerEmail = selectedUser.email || ''
    // Note: phone number might not be available in user object
  }
}

function fillWithMockData() {
  form.value = {
    name: 'کلینیک روان‌شناسی آرامش',
    address: 'تهران، خیابان ولی‌عصر، نرسیده به پل کردستان، پلاک ۱۲۳، طبقه ۲، واحد ۵',
    phone: '021-88776655',
    email: 'info@aramesh-clinic.com',
    license: 'LIC-2024-PSY-001234',
    description: 'کلینیک تخصصی روان‌شناسی و روان‌درمانی با تیم متخصص و مجرب در زمینه درمان اختلالات روانی، مشاوره خانواده و روان‌درمانی کودکان و نوجوانان. ارائه خدمات حضوری و آنلاین با استفاده از جدیدترین روش‌های درمانی مبتنی بر شواهد علمی.',
    logo: null,
    owner: undefined,
    ownerFirstName: 'دکتر علی',
    ownerLastName: 'محمدی',
    ownerEmail: 'dr.mohammadi@aramesh-clinic.com',
    ownerPhone: '09123456789'
  }
}

function validateForm() {
  errors.value = {}
  
  if (!form.value.name) errors.value.name = 'نام کلینیک اجباری است'
  if (!form.value.address) errors.value.address = 'آدرس اجباری است'
  if (!form.value.phone) errors.value.phone = 'شماره تلفن اجباری است'
  if (!form.value.email) errors.value.email = 'ایمیل اجباری است'
  if (!form.value.license) errors.value.license = 'شماره پروانه اجباری است'
  if (!form.value.ownerFirstName) errors.value.ownerFirstName = 'نام مدیر اجباری است'
  if (!form.value.ownerLastName) errors.value.ownerLastName = 'نام خانوادگی مدیر اجباری است'
  if (!form.value.ownerEmail) errors.value.ownerEmail = 'ایمیل مدیر اجباری است'
  if (!form.value.ownerPhone) errors.value.ownerPhone = 'شماره تلفن مدیر اجباری است'
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Create FormData for file upload
    const formData = new FormData()
    
    // Add all form fields
    formData.append('name', form.value.name)
    formData.append('address', form.value.address)
    formData.append('phone', form.value.phone)
    formData.append('email', form.value.email)
    formData.append('license', form.value.license)
    formData.append('description', form.value.description || '')
    
    // Add logo if present
    if (form.value.logo) {
      formData.append('logo', form.value.logo)
    }
    
    // Add owner info based on user type
    if (isAdmin.value && form.value.owner) {
      formData.append('owner', form.value.owner)
    }
    
    formData.append('ownerFirstName', form.value.ownerFirstName)
    formData.append('ownerLastName', form.value.ownerLastName)
    formData.append('ownerEmail', form.value.ownerEmail)
    formData.append('ownerPhone', form.value.ownerPhone)
    
    const { data } = await $fetch('/api/clinics', {
      method: 'POST',
      body: formData
    })
    
    toaster.show({
      title: 'ثبت موفق',
      message: 'کلینیک با موفقیت ثبت شد و در انتظار تایید است',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    await router.push('/clinic/dashboard')
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در ثبت کلینیک',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="dark:bg-muted-900 min-h-screen bg-white">
    <NavigationTop title="ثبت کلینیک جدید" close-to="/" />
    
    <div class="w-full pb-20 pt-32">
      <div class="mx-auto w-full max-w-2xl px-4">
        <div class="bg-white dark:bg-muted-800 rounded-xl p-8 shadow-lg">
          <div class="mb-8 text-center">
            <h1 class="text-muted-800 dark:text-muted-100 text-2xl font-semibold mb-2">
              ثبت کلینیک جدید
            </h1>
            <p class="text-muted-500 text-sm">
              اطلاعات کلینیک و مدیر مسئول را وارد کنید
            </p>
          </div>

          <!-- Test Button -->
          <div class="flex justify-center mb-6">
            <BaseButton
              type="button"
              color="muted"
              size="sm"
              variant="outline"
              @click="fillWithMockData"
              class="text-xs"
            >
              <Icon name="lucide:test-tube" class="ml-2 size-3" />
              پر کردن با داده‌های تست
            </BaseButton>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Clinic Information -->
            <div class="space-y-4">
              <h2 class="text-muted-800 dark:text-muted-100 text-lg font-medium border-b pb-2">
                اطلاعات کلینیک
              </h2>
              
              <BaseInput
                v-model="form.name"
                label="نام کلینیک"
                placeholder="نام کلینیک را وارد کنید"
                :error="errors.name"
                required
              />
              
              <BaseTextarea
                v-model="form.address"
                label="آدرس"
                placeholder="آدرس کامل کلینیک را وارد کنید"
                :error="errors.address"
                required
              />
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="form.phone"
                  label="شماره تلفن"
                  placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
                  :error="errors.phone"
                  required
                />
                
                <BaseInput
                  v-model="form.email"
                  label="ایمیل"
                  type="email"
                  placeholder="clinic@example.com"
                  :error="errors.email"
                  required
                />
              </div>
              
              <BaseInput
                v-model="form.license"
                label="شماره پروانه"
                placeholder="شماره پروانه کلینیک را وارد کنید"
                :error="errors.license"
                required
              />
              
              <BaseTextarea
                v-model="form.description"
                label="توضیحات (اختیاری)"
                placeholder="توضیحات اضافی در مورد کلینیک"
                rows="3"
              />
              
              <!-- Logo Upload -->
              <div class="space-y-4">
                <BaseHeading as="h3" size="sm" class="text-muted-800 dark:text-muted-100">
                  لوگو کلینیک (اختیاری)
                </BaseHeading>
                
                <div class="flex items-center gap-4">
                  <!-- Logo Preview -->
                  <div v-if="logoPreview" class="relative">
                    <img 
                      :src="logoPreview" 
                      alt="Logo preview" 
                      class="w-20 h-20 object-cover rounded-lg border border-muted-200 dark:border-muted-700"
                    />
                    <BaseButton
                      type="button"
                      size="xs"
                      color="danger"
                      variant="solid"
                      rounded="full"
                      class="absolute -top-2 -right-2"
                      @click="removeLogo"
                    >
                      <Icon name="lucide:x" class="size-3" />
                    </BaseButton>
                  </div>
                  
                  <!-- Upload Button -->
                  <div class="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleLogoUpload"
                      class="hidden"
                      ref="logoInput"
                    />
                    <BaseButton
                      type="button"
                      color="muted"
                      variant="outline"
                      size="sm"
                      @click="$refs.logoInput?.click()"
                    >
                      <Icon name="lucide:upload" class="ml-2 size-4" />
                      {{ logoPreview ? 'تغییر لوگو' : 'انتخاب لوگو' }}
                    </BaseButton>
                    <p class="text-xs text-muted-500 mt-1">
                      حداکثر حجم: ۲ مگابایت | فرمت‌های مجاز: JPG، PNG، GIF
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Owner Selection -->
            <div v-if="isAdmin" class="space-y-4">
              <h2 class="text-muted-800 dark:text-muted-100 text-lg font-medium border-b pb-2">
                انتخاب مالک کلینیک
              </h2>
              
              <div class="relative">
                <BaseInput
                  v-model="searchQuery"
                  label="جستجوی کاربر"
                  placeholder="نام، ایمیل یا نام کاربری را وارد کنید..."
                  icon="lucide:search"
                  :loading="loadingUsers"
                  @update:model-value="handleSearchUpdate"
                  @focus="handleSearchFocus"
                  @blur="handleSearchBlur"
                />
                
                <!-- Clear selection button -->
                <div v-if="selectedUser" class="absolute left-2 top-9 flex items-center">
                  <BaseButton
                    type="button"
                    size="xs"
                    color="danger"
                    variant="ghost"
                    @click="clearSelection"
                  >
                    <Icon name="lucide:x" class="size-3" />
                  </BaseButton>
                </div>
                
                <!-- User list dropdown -->
                <div
                  v-if="showUserList && (filteredUsers.length > 0 || loadingUsers)"
                  class="absolute z-10 w-full mt-1 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  <div v-if="loadingUsers" class="p-3 text-center text-muted-500">
                    در حال جستجو...
                  </div>
                  
                  <div v-else-if="filteredUsers.length === 0" class="p-3 text-center text-muted-500">
                    کاربری یافت نشد
                  </div>
                  
                  <div v-else>
                    <div
                      v-for="user in filteredUsers"
                      :key="user.id"
                      class="flex items-center gap-3 p-3 hover:bg-muted-50 dark:hover:bg-muted-700 cursor-pointer border-b border-muted-100 dark:border-muted-600 last:border-b-0"
                      @click="selectUser(user)"
                    >
                      <BaseAvatar
                        :src="user.avatar"
                        :text="user.initials"
                        size="sm"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-muted-800 dark:text-muted-100 truncate">
                          {{ user.name || user.username || 'کاربر بدون نام' }}
                        </div>
                        <div class="text-xs text-muted-500 truncate">
                          {{ user.email || 'ایمیل موجود نیست' }}
                        </div>
                      </div>
                      <BaseBadge
                        :color="user.role === 'admin' ? 'primary' : user.role === 'therapist' ? 'success' : 'muted'"
                        size="sm"
                      >
                        {{ user.role }}
                      </BaseBadge>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Selected user display -->
              <div v-if="selectedUser" class="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <div class="flex items-center gap-3 mb-2">
                  <BaseAvatar
                    :src="selectedUser.avatar"
                    :text="selectedUser.initials"
                    size="sm"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-success-700 dark:text-success-300">
                      {{ selectedUser.name || selectedUser.username }}
                    </div>
                    <div class="text-xs text-success-600 dark:text-success-400">
                      {{ selectedUser.email }}
                    </div>
                  </div>
                  <BaseBadge
                    :color="selectedUser.role === 'admin' ? 'primary' : selectedUser.role === 'therapist' ? 'success' : 'muted'"
                    size="sm"
                  >
                    {{ selectedUser.role }}
                  </BaseBadge>
                </div>
                <p class="text-sm text-success-700 dark:text-success-300">
                  این کاربر به عنوان مالک کلینیک انتخاب شده است.
                </p>
              </div>
              
              <div v-if="!selectedUser" class="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                <p class="text-sm text-warning-700 dark:text-warning-300">
                  اگر مالک خاصی انتخاب نکنید، شما به عنوان مالک کلینیک ثبت خواهید شد.
                </p>
              </div>
            </div>

            <!-- Owner Information -->
            <div class="space-y-4">
              <h2 class="text-muted-800 dark:text-muted-100 text-lg font-medium border-b pb-2">
                اطلاعات مدیر مسئول
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="form.ownerFirstName"
                  label="نام"
                  placeholder="نام مدیر"
                  :error="errors.ownerFirstName"
                  required
                />
                
                <BaseInput
                  v-model="form.ownerLastName"
                  label="نام خانوادگی"
                  placeholder="نام خانوادگی مدیر"
                  :error="errors.ownerLastName"
                  required
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="form.ownerEmail"
                  label="ایمیل"
                  type="email"
                  placeholder="manager@example.com"
                  :error="errors.ownerEmail"
                  required
                />
                
                <BaseInput
                  v-model="form.ownerPhone"
                  label="شماره تلفن"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  :error="errors.ownerPhone"
                  required
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-center pt-6">
              <BaseButton
                type="submit"
                color="primary"
                size="lg"
                :loading="loading"
                :disabled="loading"
                class="w-full md:w-auto px-12"
              >
                ثبت کلینیک
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>