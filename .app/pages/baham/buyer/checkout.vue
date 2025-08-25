<script setup lang="ts">
definePageMeta({
  title: 'پرداخت - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'پرداخت - با هم',
  meta: [
    { name: 'description', content: 'تکمیل فرآیند خرید و پرداخت امن' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Delivery method selection
const deliveryMethod = ref('direct_delivery')

// Selected address
const selectedAddress = ref(1)

// Delivery time preferences
const deliveryTime = ref('morning')
const deliveryDate = ref('')

// Sample addresses data
const addresses = ref([
  {
    id: 1,
    title: 'خانه',
    addressLine: 'خیابان ولیعصر، پلاک 123',
    city: 'تهران',
    postalCode: '1234567890',
    isDefault: true
  },
  {
    id: 2,
    title: 'دفتر کار',
    addressLine: 'محله شهید بهشتی، خیابان پاکستان، پلاک 45',
    city: 'تهران',
    postalCode: '0987654321',
    isDefault: false
  }
])

// New address form
const newAddress = reactive({
  title: '',
  addressLine: '',
  city: '',
  postalCode: '',
  isDefault: false
})

const showNewAddressForm = ref(false)

// Order summary data
const orderSummary = reactive({
  items: [
    {
      id: 1,
      name: 'گوجه فرنگی',
      quantity: 5,
      price: 25000,
      total: 125000
    },
    {
      id: 2,
      name: 'سیب زمینی',
      quantity: 3,
      price: 15000,
      total: 45000
    },
    {
      id: 3,
      name: 'پیاز',
      quantity: 2,
      price: 15000,
      total: 30000
    }
  ],
  subtotal: 200000,
  shipping: 25000,
  discount: 0,
  total: 225000
})

// Discount code
const discountCode = ref('')
const discountError = ref('')
const discountApplied = ref(false)

// Payment method
const paymentMethod = ref('online')

// Terms acceptance
const acceptTerms = ref(false)

// Notes for seller
const orderNotes = ref('')

// Contact information
const contactInfo = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
})

// Add new address
const addNewAddress = () => {
  if (newAddress.title && newAddress.addressLine && newAddress.city && newAddress.postalCode) {
    const newId = Math.max(...addresses.value.map(a => a.id)) + 1
    addresses.value.push({
      id: newId,
      ...newAddress
    })
    
    // Reset form
    Object.assign(newAddress, {
      title: '',
      addressLine: '',
      city: '',
      postalCode: '',
      isDefault: false
    })
    
    showNewAddressForm.value = false
    
    const toaster = useToaster()
    toaster.show({
      title: 'آدرس جدید اضافه شد',
      message: 'آدرس جدید با موفقیت به لیست شما اضافه شد',
      color: 'success',
      icon: 'ph:check-circle-duotone',
      closable: true,
    })
  }
}

// Apply discount code
const applyDiscount = () => {
  discountError.value = ''
  
  // Mock discount validation
  if (discountCode.value.toLowerCase() === 'baham10') {
    orderSummary.discount = orderSummary.subtotal * 0.1
    orderSummary.total = orderSummary.subtotal + orderSummary.shipping - orderSummary.discount
    discountApplied.value = true
    
    const toaster = useToaster()
    toaster.show({
      title: 'کد تخفیف اعمال شد',
      message: 'کد تخفیف با موفقیت اعمال شد',
      color: 'success',
      icon: 'ph:ticket-duotone',
      closable: true,
    })
  } else {
    discountError.value = 'کد تخفیف نامعتبر است'
  }
}

// Remove discount
const removeDiscount = () => {
  orderSummary.discount = 0
  orderSummary.total = orderSummary.subtotal + orderSummary.shipping
  discountCode.value = ''
  discountApplied.value = false
}

// Payment processing function
const processPayment = () => {
  if (!acceptTerms.value) {
    const toaster = useToaster()
    toaster.show({
      title: 'خطا در پرداخت',
      message: 'لطفاً قوانین و مقررات را تأیید کنید',
      color: 'danger',
      icon: 'ph:x-circle-duotone',
      closable: true,
    })
    return
  }
  
  // In a real app, this would integrate with a payment gateway
  const toaster = useToaster()
  toaster.show({
    title: 'انتقال به درگاه پرداخت',
    message: 'در حال انتقال به درگاه پرداخت امن...',
    color: 'success',
    icon: 'ph:shield-check-duotone',
    closable: true,
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
        پرداخت
      </BaseHeading>
      <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mt-2">
        تکمیل فرآیند خرید و پرداخت امن
      </BaseParagraph>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Customer Information -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Customer Information -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات تماس
          </BaseHeading>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="contactInfo.firstName"
              label="نام"
              placeholder="نام خود را وارد کنید"
            />
            <BaseInput
              v-model="contactInfo.lastName"
              label="نام خانوادگی"
              placeholder="نام خانوادگی خود را وارد کنید"
            />
            <BaseInput
              v-model="contactInfo.phone"
              label="تلفن همراه"
              dir="ltr"
              placeholder="09123456789"
            />
            <BaseInput
              v-model="contactInfo.email"
              label="ایمیل"
              type="email"
              dir="ltr"
              placeholder="example@domain.com"
            />
          </div>
        </BaseCard>
        
        <!-- Delivery Method -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            روش تحویل
          </BaseHeading>
          <div class="space-y-4">
            <BaseRadio
              v-model="deliveryMethod"
              name="deliveryMethod"
              value="direct_delivery"
              label="تحویل مستقیم"
              sublabel="دریافت مستقیم از ارائه‌دهنده"
            />
            <BaseRadio
              v-model="deliveryMethod"
              name="deliveryMethod"
              value="pickup_from_distributor"
              label="دریافت از توزیع‌کننده"
              sublabel="دریافت از توزیع‌کننده نزدیک به شما"
            />
          </div>
          
          <!-- Delivery Time Preferences -->
          <div class="mt-6 pt-6 border-t border-muted-200 dark:border-muted-700">
            <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
              زمان تحویل
            </BaseHeading>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <BaseRadio
                v-model="deliveryTime"
                name="deliveryTime"
                value="morning"
                label="صبح (۸ تا ۱۲ ظهر)"
              />
              <BaseRadio
                v-model="deliveryTime"
                name="deliveryTime"
                value="afternoon"
                label="بعد از ظهر (۱۲ تا ۱۸)"
              />
            </div>
            <BaseInput
              v-model="deliveryDate"
              type="date"
              label="تاریخ تحویل"
              placeholder="انتخاب تاریخ"
            />
          </div>
        </BaseCard>
        
        <!-- Address Selection -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            آدرس تحویل
          </BaseHeading>
          <div class="space-y-4">
            <BaseRadio
              v-for="address in addresses"
              :key="address.id"
              v-model="selectedAddress"
              name="address"
              :value="address.id"
              :label="address.title"
              :sublabel="`${address.addressLine}, ${address.city}, کد پستی: ${address.postalCode} ${address.isDefault ? '(پیش‌فرض)' : ''}`"
            />
          </div>
          
          <div class="mt-6 pt-6 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              variant="outline" 
              color="primary" 
              @click="showNewAddressForm = !showNewAddressForm"
            >
              <Icon name="ph:plus-duotone" class="size-5 ml-2" />
              {{ showNewAddressForm ? 'انصراف' : 'افزودن آدرس جدید' }}
            </BaseButton>
            
            <!-- New Address Form -->
            <div v-if="showNewAddressForm" class="mt-6 p-4 border border-muted-200 dark:border-muted-700 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="newAddress.title"
                  label="عنوان آدرس"
                  placeholder="مثال: خانه، دفتر کار"
                />
                <BaseInput
                  v-model="newAddress.city"
                  label="شهر"
                  placeholder="نام شهر"
                />
                <div class="md:col-span-2">
                  <BaseInput
                    v-model="newAddress.addressLine"
                    label="آدرس کامل"
                    placeholder="نشانی دقیق"
                  />
                </div>
                <BaseInput
                  v-model="newAddress.postalCode"
                  label="کد پستی"
                  placeholder="کد پستی ۱۰ رقمی"
                />
                <BaseCheckbox
                  v-model="newAddress.isDefault"
                  label="تنظیم به عنوان آدرس پیش‌فرض"
                />
              </div>
              <BaseButton 
                class="mt-4" 
                color="primary" 
                @click="addNewAddress"
              >
                ذخیره آدرس
              </BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Order Notes -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            یادداشت سفارش
          </BaseHeading>
          <BaseTextarea
            v-model="orderNotes"
            placeholder="هر یادداشتی برای فروشنده دارید، اینجا بنویسید..."
            :rows="3"
          />
        </BaseCard>
      </div>
      
      <!-- Right Column - Order Summary -->
      <div class="lg:col-span-1">
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 sticky top-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            خلاصه سفارش
          </BaseHeading>
          
          <!-- Order Items Summary -->
          <div class="space-y-4 mb-6">
            <div
              v-for="item in orderSummary.items"
              :key="item.id"
              class="flex justify-between border-b border-muted-200 dark:border-muted-700 pb-4"
            >
              <div>
                <BaseHeading tag="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white">
                  {{ item.name }}
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  {{ item.quantity }} × {{ new Intl.NumberFormat('fa-IR').format(item.price) }} ریال
                </BaseParagraph>
              </div>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ new Intl.NumberFormat('fa-IR').format(item.total) }} ریال
              </BaseParagraph>
            </div>
          </div>
          
          <!-- Discount Code -->
          <div class="mb-6">
            <BaseHeading tag="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-white">
              کد تخفیف
            </BaseHeading>
            <div class="flex gap-2">
              <BaseInput
                v-model="discountCode"
                placeholder="کد تخفیف"
                :disabled="discountApplied"
                class="flex-1"
              />
              <BaseButton 
                v-if="!discountApplied"
                color="primary" 
                @click="applyDiscount"
              >
                اعمال
              </BaseButton>
              <BaseButton 
                v-else
                color="danger" 
                variant="outline"
                @click="removeDiscount"
              >
                حذف
              </BaseButton>
            </div>
            <BaseParagraph 
              v-if="discountError" 
              size="sm" 
              class="text-danger-600 dark:text-danger-400 mt-2"
            >
              {{ discountError }}
            </BaseParagraph>
          </div>
          
          <!-- Order Totals -->
          <div class="space-y-4 mb-6">
            <div class="flex justify-between">
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                جمع کل:
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ new Intl.NumberFormat('fa-IR').format(orderSummary.subtotal) }} ریال
              </BaseParagraph>
            </div>
            <div class="flex justify-between">
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                هزینه ارسال:
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ new Intl.NumberFormat('fa-IR').format(orderSummary.shipping) }} ریال
              </BaseParagraph>
            </div>
            <div v-if="orderSummary.discount > 0" class="flex justify-between">
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                تخفیف:
              </BaseParagraph>
              <BaseParagraph size="sm" weight="medium" class="text-success-600 dark:text-success-400">
                - {{ new Intl.NumberFormat('fa-IR').format(orderSummary.discount) }} ریال
              </BaseParagraph>
            </div>
            <div class="flex justify-between pt-4 border-t border-muted-200 dark:border-muted-700">
              <BaseHeading tag="h3" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
                قابل پرداخت:
              </BaseHeading>
              <BaseHeading tag="h3" size="lg" weight="bold" class="text-primary-600 dark:text-primary-400">
                {{ new Intl.NumberFormat('fa-IR').format(orderSummary.total) }} ریال
              </BaseHeading>
            </div>
          </div>
          
          <!-- Payment Method -->
          <div class="mb-6">
            <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
              روش پرداخت
            </BaseHeading>
            <div class="space-y-3">
              <BaseRadio
                v-model="paymentMethod"
                name="paymentMethod"
                value="online"
                label="پرداخت آنلاین"
                sublabel="پرداخت از طریق کارت بانکی"
              />
              <BaseRadio
                v-model="paymentMethod"
                name="paymentMethod"
                value="cod"
                label="پرداخت در محل"
                sublabel="پرداخت نقدی به هنگام تحویل"
              />
            </div>
          </div>
          
          <!-- Terms and Conditions -->
          <div class="mb-6">
            <BaseCheckbox
              v-model="acceptTerms"
              label="قوانین و مقررات سایت را مطالعه کرده و می‌پذیرم"
            />
          </div>
          
          <!-- Payment Button -->
          <BaseButton
            @click="processPayment"
            variant="solid"
            color="success"
            size="lg"
            class="w-full"
            :disabled="!acceptTerms"
          >
            <Icon name="ph:shield-check-duotone" class="size-5 ml-2" />
            پرداخت امن
          </BaseButton>
          
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 mt-4 text-center">
            پرداخت شما از طریق درگاه امن انجام می‌شود
          </BaseParagraph>
        </BaseCard>
      </div>
    </div>
  </div>
</template>