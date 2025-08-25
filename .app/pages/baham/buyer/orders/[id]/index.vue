<script setup lang="ts">
definePageMeta({
  title: 'جزئیات سفارش - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'جزئیات سفارش - با هم',
  meta: [
    { name: 'description', content: 'جزئیات سفارش شما' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

const route = useRoute()

// Mock data for the order
const order = ref({
  id: route.params.id || '12345',
  status: 'delivered',
  totalPrice: 2500000,
  quantityKg: 10,
  createdAt: '2023-05-15',
  updatedAt: '2023-05-20',
  deliveryMethod: 'pickup_from_distributor',
  deliveryAddress: {
    title: 'خانه',
    addressLine: 'خیابان ولیعصر، پلاک 123',
    city: 'تهران'
  }
})

const product = ref({
  name: 'گوجه فرنگی',
  category: 'سبزیجات',
  origin: 'کرج',
  quality: 'مرغوب',
  packaging: 'کارتن ۱۰ کیلویی',
  certifications: ['ISO 22000', 'HALAL'],
  description: 'گوجه فرنگی تازه با کیفیت عالی از مزارع کرج'
})

const payment = ref({
  id: 'PAY-20230515-001',
  amount: 2500000,
  method: 'کارت بانکی',
  status: 'موفق',
  reference: 'TRX-789456123'
})

const provider = ref({
  companyName: 'باغچه سبز',
  contactPerson: 'علی محمدی',
  phone: '021-12345678',
  rating: 4.8
})

const distributor = ref({
  companyName: 'توزیع شمال',
  contactPerson: 'مرتضی حسینی',
  phone: '021-87654321'
})

const timeline = ref([
  {
    status: 'processing',
    title: 'در حال پردازش',
    date: '15 خرداد 1402',
    description: 'سفارش شما ثبت و در حال بررسی است',
    performedBy: 'سیستم'
  },
  {
    status: 'confirmed',
    title: 'تأیید سفارش',
    date: '16 خرداد 1402',
    description: 'سفارش توسط ارائه‌دهنده تأیید شد',
    performedBy: 'باغچه سبز'
  },
  {
    status: 'shipped',
    title: 'ارسال شده',
    date: '17 خرداد 1402',
    description: 'سفارش به توزیع‌کننده تحویل داده شد',
    performedBy: 'توزیع شمال'
  },
  {
    status: 'delivered',
    title: 'تحویل داده شده',
    date: '20 خرداد 1402',
    description: 'سفارش با موفقیت تحویل گرفته شد',
    performedBy: 'خریدار'
  }
])

const statusTranslations = {
  processing: 'در حال پردازش',
  confirmed: 'تأیید شده',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده'
}

// Format currency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال'
}

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

// Get status class for styling
const getStatusClass = (status: string) => {
  const classes = {
    processing: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Download invoice
const downloadInvoice = () => {
  const toaster = useToaster()
  toaster.show({
    title: 'دانلود فاکتور',
    message: 'فاکتور سفارش شما در حال دانلود است',
    color: 'info',
    icon: 'ph:download-duotone',
    closable: true,
  })
}

// Repeat order
const repeatOrder = () => {
  const toaster = useToaster()
  toaster.show({
    title: 'سفارش مجدد',
    message: 'سفارش مجدد با موفقیت ایجاد شد',
    color: 'success',
    icon: 'ph:repeat-duotone',
    closable: true,
  })
}

// Create support ticket
const createSupportTicket = () => {
  const toaster = useToaster()
  toaster.show({
    title: 'تیکت پشتیبانی',
    message: 'تیکت پشتیبانی با موفقیت ایجاد شد',
    color: 'info',
    icon: 'ph:ticket-duotone',
    closable: true,
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          جزئیات سفارش #{{ order.id }}
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mt-2">
          پیگیری وضعیت سفارش شما
        </BaseParagraph>
      </div>
      <div class="flex flex-wrap gap-3">
        <BaseButton 
          variant="outline" 
          color="primary" 
          @click="$router.back()"
        >
          <Icon name="ph:arrow-right-duotone" class="size-5 ml-2" />
          بازگشت
        </BaseButton>
        <BaseButton 
          variant="outline" 
          color="primary" 
          @click="downloadInvoice"
        >
          <Icon name="ph:file-pdf-duotone" class="size-5 ml-2" />
          دانلود فاکتور
        </BaseButton>
        <BaseButton 
          variant="solid" 
          color="primary" 
          @click="repeatOrder"
        >
          <Icon name="ph:repeat-duotone" class="size-5 ml-2" />
          سفارش مجدد
        </BaseButton>
      </div>
    </div>
    
    <!-- Order Status Banner -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 bg-gradient-to-br from-primary-500/10 to-indigo-500/10 border border-primary-200 dark:border-primary-800">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center">
          <div class="mr-6">
            <Icon 
              name="ph:check-circle-duotone" 
              class="size-14 text-success-500" 
              v-if="order.status === 'delivered'"
            />
            <Icon 
              name="ph:truck-duotone" 
              class="size-14 text-primary-500" 
              v-else-if="order.status === 'shipped'"
            />
            <Icon 
              name="ph:hourglass-duotone" 
              class="size-14 text-warning-500" 
              v-else
            />
          </div>
          <div>
            <BaseHeading tag="h2" size="xl" weight="bold" class="text-muted-800 dark:text-white">
              سفارش {{ statusTranslations[order.status] }}
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mt-1">
              <span v-if="order.status === 'delivered'">سفارش شما با موفقیت تحویل داده شد</span>
              <span v-else-if="order.status === 'shipped'">سفارش شما در مسیر تحویل است</span>
              <span v-else>سفارش شما در حال پردازش است</span>
            </BaseParagraph>
          </div>
        </div>
        <div class="text-center md:text-right">
          <BaseHeading tag="h3" size="xl" weight="bold" class="text-muted-800 dark:text-white">
            {{ formatCurrency(order.totalPrice) }}
          </BaseHeading>
          <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
            {{ order.quantityKg }} کیلوگرم {{ product.name }}
          </BaseParagraph>
        </div>
      </div>
    </BaseCard>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- Order Details -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Timeline -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            پیگیری سفارش
          </BaseHeading>
          <div class="flow-root">
            <ul class="relative border-l border-muted-200 dark:border-muted-700 mr-3">
              <li 
                v-for="(item, index) in timeline" 
                :key="index" 
                class="mb-10 mr-6"
                :class="{ 'opacity-50': item.status !== order.status && index > timeline.findIndex(t => t.status === order.status) }"
              >
                <div class="absolute -left-3 mt-1.5">
                  <div 
                    class="size-6 rounded-full flex items-center justify-center"
                    :class="item.status === order.status ? 'bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-900' : 
                            item.status !== order.status && index < timeline.findIndex(t => t.status === order.status) ? 'bg-success-500' : 'bg-muted-300 dark:bg-muted-600'"
                  >
                    <Icon 
                      v-if="item.status === order.status || (item.status !== order.status && index < timeline.findIndex(t => t.status === order.status))"
                      name="ph:check-duotone" 
                      class="size-3 text-white"
                    />
                  </div>
                </div>
                <div class="pr-4">
                  <div class="flex justify-between items-start">
                    <BaseHeading tag="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                      {{ item.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                      {{ item.date }}
                    </BaseParagraph>
                  </div>
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mt-2">
                    {{ item.description }}
                  </BaseParagraph>
                  <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 mt-1">
                    توسط: {{ item.performedBy }}
                  </BaseParagraph>
                </div>
              </li>
            </ul>
          </div>
        </BaseCard>
        
        <!-- Product Information -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات محصول
          </BaseHeading>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="flex items-center mb-6">
                <div class="bg-muted-200 dark:bg-muted-700 border-2 border-dashed border-muted-300 dark:border-muted-600 rounded-xl size-16 flex items-center justify-center mr-4">
                  <Icon name="ph:carrot-duotone" class="size-8 text-muted-400 dark:text-muted-500" />
                </div>
                <div>
                  <BaseHeading tag="h3" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
                    {{ product.name }}
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    {{ product.category }}
                  </BaseParagraph>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    مقدار:
                  </BaseParagraph>
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ order.quantityKg }} کیلوگرم
                  </BaseParagraph>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    قیمت واحد:
                  </BaseParagraph>
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ formatCurrency(order.totalPrice / order.quantityKg) }}/کیلو
                  </BaseParagraph>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    قیمت کل:
                  </BaseParagraph>
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ formatCurrency(order.totalPrice) }}
                  </BaseParagraph>
                </div>
              </div>
            </div>
            <div>
              <BaseHeading tag="h4" size="md" weight="medium" class="text-muted-800 dark:text-white mb-3">
                جزئیات محصول
              </BaseHeading>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    منشاء:
                  </BaseParagraph>
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ product.origin }}
                  </BaseParagraph>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    کیفیت:
                  </BaseParagraph>
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ product.quality }}
                  </BaseParagraph>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    بسته‌بندی:
                  </BaseParagraph>
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ product.packaging }}
                  </BaseParagraph>
                </div>
                <div class="flex justify-between">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    گواهی‌ها:
                  </BaseParagraph>
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ product.certifications.join(', ') }}
                  </BaseParagraph>
                </div>
              </div>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mt-4">
                {{ product.description }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Order Info -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات سفارش
          </BaseHeading>
          <div class="space-y-4">
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                شماره سفارش
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                #{{ order.id }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                تاریخ سفارش
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ formatDate(order.createdAt) }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                آخرین به‌روزرسانی
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ formatDate(order.updatedAt) }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                وضعیت
              </BaseParagraph>
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(order.status)"
              >
                {{ statusTranslations[order.status] }}
              </span>
            </div>
          </div>
        </BaseCard>
        
        <!-- Payment Info -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات پرداخت
          </BaseHeading>
          <div class="space-y-4">
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                شماره پرداخت
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ payment.id }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                مبلغ
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ formatCurrency(payment.amount) }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                روش پرداخت
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ payment.method }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                وضعیت
              </BaseParagraph>
              <span class="px-2 py-1 text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400 rounded-full">
                {{ payment.status }}
              </span>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                شماره مرجع
              </BaseParagraph>
              <BaseParagraph size="xs" weight="medium" class="text-muted-800 dark:text-white bg-muted-100 dark:bg-muted-800 px-2 py-1 rounded">
                {{ payment.reference }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
        
        <!-- Provider Info -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات ارائه‌دهنده
          </BaseHeading>
          <div class="space-y-4">
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                نام شرکت
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ provider.companyName }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                شخص تماس
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ provider.contactPerson }}
              </BaseParagraph>
            </div>
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                تلفن
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ provider.phone }}
              </BaseParagraph>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                  امتیاز
                </BaseParagraph>
                <div class="flex items-center">
                  <Icon name="ph:star-duotone" class="size-4 text-warning-400 ml-1" />
                  <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                    {{ provider.rating }}
                  </BaseParagraph>
                </div>
              </div>
              <BaseButton variant="ghost" color="primary" size="sm">
                مشاهده پروفایل
              </BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Delivery Info -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات تحویل
          </BaseHeading>
          <div class="space-y-4">
            <div>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                روش تحویل
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ order.deliveryMethod === 'pickup_from_distributor' ? 'دریافت از توزیع‌کننده' : 'تحویل مستقیم' }}
              </BaseParagraph>
            </div>
            <div v-if="order.deliveryAddress">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                آدرس تحویل
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ order.deliveryAddress.title }}
              </BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                {{ order.deliveryAddress.addressLine }}
              </BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                {{ order.deliveryAddress.city }}
              </BaseParagraph>
            </div>
            <div v-if="order.deliveryMethod === 'pickup_from_distributor'">
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                توزیع‌کننده
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ distributor.companyName }}
              </BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                {{ distributor.contactPerson }}
              </BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                {{ distributor.phone }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
        
        <!-- Actions -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            عملیات
          </BaseHeading>
          <div class="space-y-3">
            <BaseButton 
              variant="solid" 
              color="primary" 
              class="w-full"
              @click="createSupportTicket"
            >
              <Icon name="ph:ticket-duotone" class="size-5 ml-2" />
              ایجاد تیکت پشتیبانی
            </BaseButton>
            <BaseButton 
              variant="outline" 
              color="primary" 
              class="w-full"
              @click="downloadInvoice"
            >
              <Icon name="ph:printer-duotone" class="size-5 ml-2" />
              چاپ فاکتور
            </BaseButton>
            <BaseButton 
              variant="outline" 
              color="primary" 
              class="w-full"
              @click="repeatOrder"
            >
              <Icon name="ph:repeat-duotone" class="size-5 ml-2" />
              سفارش مجدد
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
    
    <!-- Related Orders -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 mt-8">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
        سفارشات مرتبط
      </BaseHeading>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-muted-200 dark:divide-muted-700">
          <thead class="bg-muted-50 dark:bg-muted-800">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                شماره سفارش
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                تاریخ
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                محصول
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                مبلغ
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-500 dark:text-muted-400 uppercase tracking-wider">
                وضعیت
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-muted-900 divide-y divide-muted-200 dark:divide-muted-700">
            <tr class="hover:bg-muted-50 dark:hover:bg-muted-800 cursor-pointer">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-800 dark:text-white">
                #12344
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                ۱۴ خرداد ۱۴۰۲
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                پیاز
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                ۱,۸۰۰,۰۰۰ ریال
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400">
                  تحویل داده شده
                </span>
              </td>
            </tr>
            <tr class="hover:bg-muted-50 dark:hover:bg-muted-800 cursor-pointer">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-800 dark:text-white">
                #12343
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                ۱۰ خرداد ۱۴۰۲
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                گوجه فرنگی
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-500 dark:text-muted-400">
                ۲,۰۰۰,۰۰۰ ریال
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400">
                  تحویل داده شده
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>