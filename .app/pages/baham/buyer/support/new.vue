<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

definePageMeta({
  title: 'ایجاد تیکت جدید - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'ایجاد تیکت جدید - با هم',
  meta: [
    { name: 'description', content: 'ارسال درخواست پشتیبانی جدید' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Ticket form data
const ticketForm = reactive({
  subject: '',
  category: '',
  priority: '',
  orderId: '',
  description: '',
  attachment: null as File | null
})

// Categories
const categories = [
  { id: 'order', name: 'سفارشات', description: 'مشکلات مربوط به سفارشات و تحویل' },
  { id: 'payment', name: 'پرداخت', description: 'مشکلات مربوط به پرداخت و تراکنش‌ها' },
  { id: 'account', name: 'حساب کاربری', description: 'مشکلات مربوط به حساب کاربری و اطلاعات' },
  { id: 'technical', name: 'فنی', description: 'مشکلات فنی و استفاده از سایت' },
  { id: 'product', name: 'کیفیت محصول', description: 'مشکلات مربوط به کیفیت محصولات' },
  { id: 'other', name: 'سایر', description: 'سایر موارد که در دسته‌بندی‌های بالا نیست' }
]

// Priorities
const priorities = [
  { id: 'low', name: 'کم', description: 'مشکلات غیر ضروری و غیر فوری' },
  { id: 'medium', name: 'متوسط', description: 'مشکلات معمولی که نیاز به بررسی دارند' },
  { id: 'high', name: 'زیاد', description: 'مشکلات فوری و ضروری که نیاز به رسیدگی سریع دارند' }
]

// Order suggestions
const orderSuggestions = [
  { id: 'ORD-12345', product: 'گوجه فرنگی تازه', date: new Date('2023-05-15'), amount: 150000 },
  { id: 'ORD-12346', product: 'سیب زمینی', date: new Date('2023-05-10'), amount: 80000 },
  { id: 'ORD-12347', product: 'پیاز', date: new Date('2023-05-05'), amount: 60000 }
]

// Toast for notifications
const toast = useToaster()

// Form validation
const formErrors = ref({
  subject: '',
  category: '',
  priority: '',
  description: ''
})

// Format date function
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

// Format currency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال'
}

// Validate form
const validateForm = () => {
  let isValid = true
  formErrors.value = {
    subject: '',
    category: '',
    priority: '',
    description: ''
  }

  if (!ticketForm.subject.trim()) {
    formErrors.value.subject = 'موضوع تیکت الزامی است'
    isValid = false
  }

  if (!ticketForm.category) {
    formErrors.value.category = 'انتخاب دسته‌بندی الزامی است'
    isValid = false
  }

  if (!ticketForm.priority) {
    formErrors.value.priority = 'انتخاب اولویت الزامی است'
    isValid = false
  }

  if (!ticketForm.description.trim()) {
    formErrors.value.description = 'توضیحات تیکت الزامی است'
    isValid = false
  }

  return isValid
}

// Handle file upload
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از 5MB باشد')
      target.value = '' // Reset input
      return
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error('فقط فایل‌های JPG، PNG و PDF مجاز هستند')
      target.value = '' // Reset input
      return
    }
    
    ticketForm.attachment = file
  }
}

// Remove attachment
const removeAttachment = () => {
  ticketForm.attachment = null
  // Reset file input
  const fileInput = document.getElementById('attachment') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Submit ticket function
const submitTicket = () => {
  if (!validateForm()) {
    toast.error('لطفاً خطاهای فرم را برطرف کنید')
    return
  }
  
  // In a real app, this would send data to the server
  console.log('Submitting ticket:', ticketForm)
  toast.success('تیکت شما با موفقیت ارسال شد')
  
  // Reset form
  ticketForm.subject = ''
  ticketForm.category = ''
  ticketForm.priority = ''
  ticketForm.orderId = ''
  ticketForm.description = ''
  ticketForm.attachment = null
  
  // Reset file input
  const fileInput = document.getElementById('attachment') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
  
  // Clear errors
  formErrors.value = {
    subject: '',
    category: '',
    priority: '',
    description: ''
  }
}

// Watch for form changes to clear errors
watch(() => ticketForm.subject, () => {
  if (formErrors.value.subject && ticketForm.subject.trim()) {
    formErrors.value.subject = ''
  }
})

watch(() => ticketForm.category, () => {
  if (formErrors.value.category && ticketForm.category) {
    formErrors.value.category = ''
  }
})

watch(() => ticketForm.priority, () => {
  if (formErrors.value.priority && ticketForm.priority) {
    formErrors.value.priority = ''
  }
})

watch(() => ticketForm.description, () => {
  if (formErrors.value.description && ticketForm.description.trim()) {
    formErrors.value.description = ''
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:ticket-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">ایجاد تیکت جدید</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">ارسال درخواست پشتیبانی جدید</p>
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
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Ticket Form -->
      <div class="lg:col-span-2">
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:plus-circle-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              اطلاعات تیکت
            </h2>
          </div>
          <div class="p-6">
            <form @submit.prevent="submitTicket" class="space-y-6">
              <div>
                <BaseLabel for="subject" class="mb-2">موضوع *</BaseLabel>
                <BaseInput
                  id="subject"
                  v-model="ticketForm.subject"
                  placeholder="موضوع تیکت را وارد کنید"
                  required
                  rounded="lg"
                  :class="{ 'border-red-500': formErrors.subject }"
                />
                <p v-if="formErrors.subject" class="text-red-500 text-sm mt-1">{{ formErrors.subject }}</p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <BaseLabel for="category" class="mb-2">دسته‌بندی *</BaseLabel>
                  <BaseSelect
                    id="category"
                    v-model="ticketForm.category"
                    :options="categories.map(c => ({ label: c.name, value: c.id }))"
                    placeholder="انتخاب دسته‌بندی"
                    required
                    rounded="lg"
                    :class="{ 'border-red-500': formErrors.category }"
                  />
                  <p v-if="formErrors.category" class="text-red-500 text-sm mt-1">{{ formErrors.category }}</p>
                </div>
                
                <div>
                  <BaseLabel for="priority" class="mb-2">اولویت *</BaseLabel>
                  <BaseSelect
                    id="priority"
                    v-model="ticketForm.priority"
                    :options="priorities.map(p => ({ label: p.name, value: p.id }))"
                    placeholder="انتخاب اولویت"
                    required
                    rounded="lg"
                    :class="{ 'border-red-500': formErrors.priority }"
                  />
                  <p v-if="formErrors.priority" class="text-red-500 text-sm mt-1">{{ formErrors.priority }}</p>
                </div>
              </div>
              
              <div>
                <BaseLabel for="orderId" class="mb-2">شماره سفارش (در صورت وجود)</BaseLabel>
                <BaseInput
                  id="orderId"
                  v-model="ticketForm.orderId"
                  placeholder="شماره سفارش مرتبط را وارد کنید"
                  rounded="lg"
                />
                <div class="mt-3" v-if="!ticketForm.orderId">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">سفارشات اخیر شما:</p>
                  <div class="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-muted-800 rounded-lg">
                    <div
                      v-for="order in orderSuggestions"
                      :key="order.id"
                      class="flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-muted-700 rounded cursor-pointer transition-colors"
                      @click="ticketForm.orderId = order.id"
                    >
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">#{{ order.id }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ order.product }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(order.date) }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatCurrency(order.amount) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <BaseLabel for="description" class="mb-2">توضیحات *</BaseLabel>
                <BaseTextarea
                  id="description"
                  v-model="ticketForm.description"
                  placeholder="توضیحات کامل تیکت را وارد کنید"
                  rows="6"
                  required
                  rounded="lg"
                  :class="{ 'border-red-500': formErrors.description }"
                />
                <p v-if="formErrors.description" class="text-red-500 text-sm mt-1">{{ formErrors.description }}</p>
              </div>
              
              <div>
                <BaseLabel for="attachment" class="mb-2">پیوست فایل</BaseLabel>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div class="space-y-1 text-center">
                    <Icon name="ph:cloud-arrow-up-duotone" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <div class="flex text-sm text-gray-600 dark:text-gray-400">
                      <label 
                        class="relative cursor-pointer bg-white dark:bg-muted-800 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                      >
                        <span>فایل را آپلود کنید</span>
                        <input 
                          id="attachment"
                          type="file" 
                          class="sr-only" 
                          @change="handleFileUpload"
                          accept="image/jpeg,image/png,application/pdf"
                        />
                      </label>
                      <p class="pl-1">یا فایل را اینجا بکشید</p>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, PDF تا حداکثر 5MB
                    </p>
                  </div>
                </div>
                <div v-if="ticketForm.attachment" class="mt-3 flex items-center justify-between p-3 bg-gray-50 dark:bg-muted-800 rounded-lg">
                  <div class="flex items-center">
                    <Icon 
                      name="ph:file-pdf-duotone" 
                      class="h-5 w-5 text-red-500 ml-2" 
                      v-if="ticketForm.attachment.type?.includes('pdf')"
                    />
                    <Icon 
                      name="ph:image-duotone" 
                      class="h-5 w-5 text-blue-500 ml-2" 
                      v-else
                    />
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ ticketForm.attachment.name }}</span>
                  </div>
                  <BaseButton 
                    variant="ghost" 
                    color="danger" 
                    size="sm"
                    rounded="lg"
                    @click="removeAttachment"
                  >
                    <Icon name="ph:x-duotone" class="h-4 w-4" />
                  </BaseButton>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-4">
                <BaseButton 
                  type="button" 
                  variant="outline" 
                  color="default" 
                  size="lg"
                  rounded="lg"
                  @click="$router.back()"
                >
                  انصراف
                </BaseButton>
                <BaseButton 
                  type="submit" 
                  variant="solid" 
                  color="primary"
                  size="lg"
                  rounded="lg"
                >
                  <Icon name="ph:paper-plane-tilt-duotone" class="h-4 w-4 ml-2" />
                  ارسال تیکت
                </BaseButton>
              </div>
            </form>
          </div>
        </BaseCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Category Information -->
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:folder-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              راهنمای دسته‌بندی‌ها
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                :class="ticketForm.category === category.id ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700' : ''"
              >
                <h3 class="font-medium text-gray-900 dark:text-white">{{ category.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ category.description }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Priority Information -->
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:flag-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              راهنمای اولویت‌ها
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div 
                v-for="priority in priorities" 
                :key="priority.id"
                class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                :class="ticketForm.priority === priority.id ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700' : ''"
              >
                <div class="flex justify-between items-center">
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ priority.name }}</h3>
                  <span 
                    class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="priority.id === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 
                            priority.id === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 
                            'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'"
                  >
                    {{ priority.name }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ priority.description }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Help Info -->
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:info-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              راهنمایی
            </h2>
          </div>
          <div class="p-6">
            <ul class="space-y-3 text-gray-600 dark:text-gray-400">
              <li class="flex items-start">
                <Icon name="ph:check-circle-duotone" class="h-5 w-5 text-green-500 mt-0.5 ml-2 flex-shrink-0" />
                <span>لطفاً موضوع تیکت را به طور واضح و مختصر وارد کنید</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle-duotone" class="h-5 w-5 text-green-500 mt-0.5 ml-2 flex-shrink-0" />
                <span>در توضیحات، مشکل خود را به طور کامل و با جزئیات توضیح دهید</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle-duotone" class="h-5 w-5 text-green-500 mt-0.5 ml-2 flex-shrink-0" />
                <span>در صورت وجود، شماره سفارش مرتبط را وارد کنید</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle-duotone" class="h-5 w-5 text-green-500 mt-0.5 ml-2 flex-shrink-0" />
                <span>برای بهتر درک مشکل، می‌توانید تصاویر یا فایل‌های مرتبط را پیوست کنید</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle-duotone" class="h-5 w-5 text-green-500 mt-0.5 ml-2 flex-shrink-0" />
                <span>اولویت "زیاد" را فقط برای موارد ضروری و فوری انتخاب کنید</span>
              </li>
              <li class="flex items-start">
                <Icon name="ph:check-circle-duotone" class="h-5 w-5 text-green-500 mt-0.5 ml-2 flex-shrink-0" />
                <span>پاسخ به تیکت‌ها معمولاً ظرف 24 ساعت انجام می‌شود</span>
              </li>
            </ul>
          </div>
        </BaseCard>
        
        <!-- FAQ -->
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:question-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              سؤالات متداول
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <details class="group">
                <summary class="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 dark:text-white">
                  <span>چقدر طول می‌کشد تا تیکت من پاسخ داده شود؟</span>
                  <Icon name="ph:caret-down-duotone" class="h-4 w-4 group-open:rotate-180 transition-transform" />
                </summary>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  زمان پاسخگویی بستگی به اولویت تیکت دارد. تیکت‌های با اولویت بالا ظرف 2 ساعت، 
                  اولویت متوسط ظرف 24 ساعت و اولویت پایین ظرف 72 ساعت پاسخ داده می‌شوند.
                </p>
              </details>
              <details class="group">
                <summary class="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 dark:text-white">
                  <span>چگونه می‌توانم وضعیت تیکت خود را پیگیری کنم؟</span>
                  <Icon name="ph:caret-down-duotone" class="h-4 w-4 group-open:rotate-180 transition-transform" />
                </summary>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  می‌توانید از طریق صفحه "مرکز پشتیبانی" وضعیت تیکت‌های خود را پیگیری کنید. 
                  همچنین پس از هر پاسخ، اعلان دریافت خواهید کرد.
                </p>
              </details>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>