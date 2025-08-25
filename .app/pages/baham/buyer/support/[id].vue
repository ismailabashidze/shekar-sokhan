<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  title: 'جزئیات تیکت - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'جزئیات تیکت - با هم',
  meta: [
    { name: 'description', content: 'مشاهده جزئیات تیکت پشتیبانی' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Define types
interface TicketMessage {
  id: number
  sender: 'user' | 'support'
  message: string
  createdAt: Date
  attachments?: string[]
}

interface Ticket {
  id: number
  subject: string
  description: string
  category: 'delivery' | 'payment' | 'account' | 'technical' | 'other'
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'closed'
  createdAt: Date
  updatedAt: Date
  assignedTo: string
  messages: TicketMessage[]
}

// Reactive data
const ticket = ref<Ticket | null>(null)
const newMessage = ref('')
const attachment = ref<File | null>(null)
const isSubmitting = ref(false)

// Translations
const statusTranslations = {
  open: 'باز',
  in_progress: 'در حال پیگیری',
  closed: 'بسته شده'
}

const priorityTranslations = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد'
}

const categoryTranslations = {
  delivery: 'تحویل',
  payment: 'پرداخت',
  account: 'حساب کاربری',
  technical: 'فنی',
  other: 'سایر'
}

const route = useRoute()
const router = useRouter()

// Toast for notifications
const toast = useToaster()

// Methods
const getCategoryClass = (category: string) => {
  const classes = {
    delivery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    payment: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    account: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    technical: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority: string) => {
  const classes = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  const classes = {
    open: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    closed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

const formatMessageDate = (date: Date) => {
  if (isToday(date)) {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  return formatDate(date)
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
    
    attachment.value = file
  }
}

// Remove attachment
const removeAttachment = () => {
  attachment.value = null
  // Reset file input
  const fileInput = document.getElementById('attachment') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim() && !attachment.value) {
    toast.error('لطفاً پیام یا فایل پیوست را وارد کنید')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add message to ticket
    if (ticket.value) {
      const message: TicketMessage = {
        id: ticket.value.messages.length + 1,
        sender: 'user',
        message: newMessage.value,
        createdAt: new Date(),
        attachments: attachment.value ? [attachment.value.name] : undefined
      }
      
      ticket.value.messages.push(message)
      ticket.value.status = 'in_progress'
      ticket.value.updatedAt = new Date()
      
      // Reset form
      newMessage.value = ''
      attachment.value = null
      
      // Reset file input
      const fileInput = document.getElementById('attachment') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
      
      toast.success('پیام شما با موفقیت ارسال شد')
    }
  } catch (error) {
    toast.error('خطا در ارسال پیام. لطفاً دوباره تلاش کنید')
  } finally {
    isSubmitting.value = false
  }
}

// Close ticket
const closeTicket = async () => {
  if (!ticket.value) return
  
  if (confirm('آیا مطمئن هستید که می‌خواهید این تیکت را ببندید؟')) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (ticket.value) {
        ticket.value.status = 'closed'
        ticket.value.updatedAt = new Date()
        toast.success('تیکت با موفقیت بسته شد')
      }
    } catch (error) {
      toast.error('خطا در بستن تیکت. لطفاً دوباره تلاش کنید')
    }
  }
}

// Initialize with mock data
const initializeTicket = () => {
  const ticketId = Number(route.params.id)
  
  // Mock ticket data
  ticket.value = {
    id: ticketId,
    subject: 'مشکل در تحویل سفارش',
    description: 'سفارش من هنوز تحویل داده نشده است. لطفاً بررسی کنید.',
    category: 'delivery',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-16'),
    assignedTo: 'محمد رضایی',
    messages: [
      {
        id: 1,
        sender: 'user',
        message: 'سلام، سفارش من هنوز تحویل داده نشده است. لطفاً بررسی کنید.',
        createdAt: new Date('2023-05-15T10:30:00'),
      },
      {
        id: 2,
        sender: 'support',
        message: 'با سلام، از پیگیری شما سپاسگزاریم. در حال بررسی سفارش شما هستیم و نتیجه را در اولین فرصت برای شما ارسال خواهیم کرد.',
        createdAt: new Date('2023-05-15T14:15:00'),
        attachments: ['response.pdf']
      },
      {
        id: 3,
        sender: 'user',
        message: 'تشکر. منتظر پاسخ شما هستم.',
        createdAt: new Date('2023-05-15T16:45:00'),
      },
      {
        id: 4,
        sender: 'support',
        message: 'سفارش شما در مسیر تحویل قرار گرفته و ظرف 2 ساعت آینده تحویل شما خواهد شد.',
        createdAt: new Date('2023-05-16T09:20:00'),
      }
    ]
  }
}

// Lifecycle
onMounted(() => {
  initializeTicket()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-6">
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
      
      <div v-if="ticket" class="space-y-6">
        <!-- Ticket Header -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ ticket.subject }}</h1>
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span
                class="px-3 py-1 text-sm font-medium rounded-full"
                :class="getCategoryClass(ticket.category)"
              >
                {{ categoryTranslations[ticket.category] }}
              </span>
              <span
                class="px-3 py-1 text-sm font-medium rounded-full"
                :class="getPriorityClass(ticket.priority)"
              >
                {{ priorityTranslations[ticket.priority] }}
              </span>
              <span
                class="px-3 py-1 text-sm font-medium rounded-full"
                :class="getStatusClass(ticket.status)"
              >
                {{ statusTranslations[ticket.status] }}
              </span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <BaseButton 
              v-if="ticket.status !== 'closed'"
              variant="outline" 
              color="danger" 
              rounded="lg"
              @click="closeTicket"
            >
              <Icon name="ph:x-duotone" class="h-4 w-4 ml-2" />
              بستن تیکت
            </BaseButton>
          </div>
        </div>
        
        <!-- Ticket Info -->
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">شماره تیکت</p>
                <p class="font-medium text-gray-900 dark:text-white">#{{ ticket.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">تاریخ ایجاد</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(ticket.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">آخرین به‌روزرسانی</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(ticket.updatedAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">واگذار شده به</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ ticket.assignedTo }}</p>
              </div>
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">توضیحات</h3>
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ ticket.description }}</p>
            </div>
          </div>
        </BaseCard>
        
        <!-- Messages -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">پیام‌ها</h2>
          
          <div class="space-y-6">
            <div 
              v-for="message in ticket.messages" 
              :key="message.id"
              class="flex"
              :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-3xl rounded-2xl p-5"
                :class="message.sender === 'user' 
                  ? 'bg-primary-500 text-white rounded-tr-none' 
                  : 'bg-gray-100 dark:bg-muted-800 text-gray-900 dark:text-white rounded-tl-none'"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium">
                    {{ message.sender === 'user' ? 'شما' : 'پشتیبانی' }}
                  </span>
                  <span 
                    class="text-sm"
                    :class="message.sender === 'user' 
                      ? 'text-primary-100' 
                      : 'text-gray-500 dark:text-gray-400'"
                  >
                    {{ formatMessageDate(message.createdAt) }}
                  </span>
                </div>
                
                <p class="whitespace-pre-line">{{ message.message }}</p>
                
                <div v-if="message.attachments" class="mt-3 pt-3 border-t border-opacity-20" :class="message.sender === 'user' ? 'border-primary-400' : 'border-gray-300 dark:border-gray-600'">
                  <div class="flex items-center gap-2">
                    <Icon 
                      name="ph:file-pdf-duotone" 
                      class="h-5 w-5 text-red-500" 
                    />
                    <span class="text-sm">{{ message.attachments[0] }}</span>
                    <BaseButton 
                      variant="ghost" 
                      size="sm"
                      :color="message.sender === 'user' ? 'white' : 'default'"
                      rounded="lg"
                    >
                      <Icon name="ph:download-duotone" class="h-4 w-4 ml-1" />
                      دانلود
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Reply Form -->
        <BaseCard 
          v-if="ticket.status !== 'closed'"
          rounded="xl" 
          class="dark:!bg-muted-900 shadow-sm"
        >
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">ارسال پاسخ</h3>
            
            <form @submit.prevent="sendMessage" class="space-y-6">
              <div>
                <BaseLabel for="message" class="mb-2">پیام شما</BaseLabel>
                <BaseTextarea
                  id="message"
                  v-model="newMessage"
                  placeholder="پیام خود را بنویسید..."
                  rows="4"
                  rounded="lg"
                />
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
                <div v-if="attachment" class="mt-3 flex items-center justify-between p-3 bg-gray-50 dark:bg-muted-800 rounded-lg">
                  <div class="flex items-center">
                    <Icon 
                      name="ph:file-pdf-duotone" 
                      class="h-5 w-5 text-red-500 ml-2" 
                      v-if="attachment.type?.includes('pdf')"
                    />
                    <Icon 
                      name="ph:image-duotone" 
                      class="h-5 w-5 text-blue-500 ml-2" 
                      v-else
                    />
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ attachment.name }}</span>
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
              
              <div class="flex justify-end">
                <BaseButton 
                  type="submit" 
                  variant="solid" 
                  color="primary"
                  rounded="lg"
                  :loading="isSubmitting"
                >
                  <Icon name="ph:paper-plane-tilt-duotone" class="h-4 w-4 ml-2" />
                  ارسال پیام
                </BaseButton>
              </div>
            </form>
          </div>
        </BaseCard>
        
        <!-- Closed Ticket Message -->
        <BaseCard 
          v-else
          rounded="xl" 
          class="dark:!bg-muted-900 shadow-sm text-center py-12"
        >
          <Icon name="ph:check-circle-duotone" class="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">تیکت بسته شده است</h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            این تیکت بسته شده است. در صورت نیاز به پشتیبانی بیشتر، می‌توانید تیکت جدیدی ایجاد کنید.
          </p>
          <div class="mt-6">
            <BaseButton 
              variant="solid" 
              color="primary" 
              rounded="lg"
              @click="$router.push('/baham/buyer/support/new')"
            >
              <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
              ایجاد تیکت جدید
            </BaseButton>
          </div>
        </BaseCard>
      </div>
      
      <div v-else class="text-center py-12">
        <Icon name="ph:warning-duotone" class="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">تیکت یافت نشد</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">تیکت مورد نظر یافت نشد.</p>
        <BaseButton 
          variant="solid" 
          color="primary" 
          rounded="lg"
          @click="$router.push('/baham/buyer/support')"
        >
          <Icon name="ph:arrow-left-duotone" class="h-4 w-4 ml-2" />
          بازگشت به مرکز پشتیبانی
        </BaseButton>
      </div>
    </div>
  </div>
</template>