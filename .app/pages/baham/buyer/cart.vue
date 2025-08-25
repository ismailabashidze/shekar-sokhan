<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: 'سبد خرید - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'سبد خرید - با هم',
  meta: [
    { name: 'description', content: 'ورود به حساب کاربری پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 
})

// Define types
interface Product {
  id: number
  name: string
  category: string
  imageUrl: string
}

interface CartLoad {
  id: number
  productId: number
  product: Product
  pricePerKg: number
  availableQuantity: number
}

interface CartItem {
  id: number
  loadId: number
  quantityKg: number
  totalPrice: number
}

// Reactive data
const cartItems = ref<CartItem[]>([])
const cartLoads = ref<CartLoad[]>([])
const loading = ref(true)
const toast = useToaster()

// Computed properties
const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.totalPrice, 0)
})

const totalItems = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantityKg, 0)
})

// Methods
const removeFromCart = (itemId: number) => {
  const itemIndex = cartItems.value.findIndex(item => item.id === itemId)
  if (itemIndex !== -1) {
    const itemName = cartLoads.value.find(load => load.id === cartItems.value[itemIndex].loadId)?.product.name || 'این محصول'
    cartItems.value.splice(itemIndex, 1)
    toast.success(`${itemName} از سبد خرید حذف شد`)
  }
}

const updateQuantity = (itemId: number, newQuantity: number) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    const load = cartLoads.value.find(load => load.id === item.loadId)
    if (load && newQuantity <= load.availableQuantity && newQuantity > 0) {
      item.quantityKg = newQuantity
      item.totalPrice = newQuantity * load.pricePerKg
    } else if (load) {
      if (newQuantity <= 0) {
        toast.error('مقدار نمی‌تواند کمتر از 1 باشد')
      } else {
        toast.error(`حداکثر مقدار موجود: ${load.availableQuantity} کیلوگرم`)
      }
    }
  }
}

const proceedToCheckout = () => {
  if (cartItems.value.length === 0) {
    toast.error('سبد خرید شما خالی است')
    return
  }
  // Implementation for proceeding to checkout
  toast.info('انتقال به صفحه پرداخت...')
  console.log('Proceeding to checkout with items:', cartItems.value)
}

// Mock data initialization
const initializeCart = () => {
  // Mock cart loads data with images
  cartLoads.value = [
    {
      id: 1,
      productId: 101,
      product: {
        id: 101,
        name: 'گوجه فرنگی تازه',
        category: 'سبزیجات',
        imageUrl: 'https://images.unsplash.com/photo-1518584662324-7fec7f15f7f2?w=150&h=150&fit=crop'
      },
      pricePerKg: 25000,
      availableQuantity: 50
    },
    {
      id: 2,
      productId: 102,
      product: {
        id: 102,
        name: 'سیب زمینی',
        category: 'سبزیجات',
        imageUrl: 'https://images.unsplash.com/photo-1557797158-76748f1c0f4c?w=150&h=150&fit=crop'
      },
      pricePerKg: 18000,
      availableQuantity: 100
    },
    {
      id: 3,
      productId: 103,
      product: {
        id: 103,
        name: 'پیاز',
        category: 'سبزیجات',
        imageUrl: 'https://images.unsplash.com/photo-1586883244472-68c55493f3e9?w=150&h=150&fit=crop'
      },
      pricePerKg: 15000,
      availableQuantity: 80
    },
    {
      id: 4,
      productId: 104,
      product: {
        id: 104,
        name: 'هویج',
        category: 'سبزیجات',
        imageUrl: 'https://images.unsplash.com/photo-1586883244472-68c55493f3e9?w=150&h=150&fit=crop'
      },
      pricePerKg: 20000,
      availableQuantity: 60
    }
  ]

  // Mock cart items data
  cartItems.value = [
    {
      id: 1,
      loadId: 1,
      quantityKg: 2,
      totalPrice: 50000
    },
    {
      id: 2,
      loadId: 2,
      quantityKg: 3,
      totalPrice: 54000
    },
    {
      id: 3,
      loadId: 4,
      quantityKg: 1,
      totalPrice: 20000
    }
  ]
  
  loading.value = false
}

// Lifecycle
onMounted(() => {
  initializeCart()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:shopping-cart-simple-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">سبد خرید</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">مدیریت محصولات انتخاب شده برای خرید</p>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="cartItems.length === 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6">
        <Icon name="ph:shopping-cart-simple-duotone" class="h-12 w-12 text-primary-500" />
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">سبد خرید شما خالی است</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید. برای افزودن محصول به بازار بروید.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton 
          variant="solid" 
          color="primary" 
          size="lg"
          @click="$router.push('/baham/buyer/marketplace')"
        >
          <Icon name="ph:storefront-duotone" class="h-5 w-5 ml-2" />
          مشاهده بازار
        </BaseButton>
        <BaseButton 
          variant="outline" 
          color="default"
          size="lg"
          @click="$router.push('/baham/buyer')"
        >
          <Icon name="ph:house-duotone" class="h-5 w-5 ml-2" />
          بازگشت به خانه
        </BaseButton>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-8">
        <BaseCard rounded="xl" class="dark:!bg-muted-900 overflow-hidden shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50/50 to-success-50/50 dark:from-primary-900/20 dark:to-success-900/20">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  محصولات سبد خرید
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ cartItems.length }} مورد در سبد خرید
                </p>
              </div>
              <div class="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-sm font-medium">
                {{ totalItems }} کیلوگرم
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200"
            >
              <div class="flex gap-4">
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img 
                    :src="cartLoads.find(load => load.id === item.loadId)?.product.imageUrl" 
                    :alt="cartLoads.find(load => load.id === item.loadId)?.product.name"
                    class="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                    loading="lazy"
                  />
                </div>
                
                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {{ cartLoads.find(load => load.id === item.loadId)?.product.name }}
                      </h3>
                      <p class="text-sm text-primary-600 dark:text-primary-400 mt-1">
                        {{ cartLoads.find(load => load.id === item.loadId)?.product.category }}
                      </p>
                      <div class="mt-2 flex flex-wrap items-center gap-2">
                        <span class="text-lg font-bold text-success-600 dark:text-success-400">
                          {{ new Intl.NumberFormat('fa-IR').format(cartLoads.find(load => load.id === item.loadId)?.pricePerKg || 0) }} ریال
                        </span>
                        <span class="text-gray-500 dark:text-gray-400">/ کیلوگرم</span>
                      </div>
                    </div>
                    
                    <!-- Quantity Control -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div class="flex items-center gap-2">
                        <button 
                          @click="updateQuantity(item.id, item.quantityKg - 1)" 
                          :disabled="item.quantityKg <= 1"
                          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Icon name="ph:minus" class="w-4 h-4" />
                        </button>
                        <span class="w-12 text-center font-medium text-gray-900 dark:text-white">
                          {{ item.quantityKg }}
                        </span>
                        <button 
                          @click="updateQuantity(item.id, item.quantityKg + 1)" 
                          :disabled="item.quantityKg >= (cartLoads.find(load => load.id === item.loadId)?.availableQuantity || 0)"
                          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Icon name="ph:plus" class="w-4 h-4" />
                        </button>
                      </div>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">کیلوگرم</span>
                    </div>
                  </div>
                  
                  <!-- Total Price and Actions -->
                  <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div class="text-lg font-bold text-gray-900 dark:text-white">
                      جمع: 
                      <span class="text-success-600 dark:text-success-400">
                        {{ new Intl.NumberFormat('fa-IR').format(item.totalPrice) }} ریال
                      </span>
                    </div>
                    <BaseButton
                      @click="removeFromCart(item.id)"
                      variant="ghost"
                      color="danger"
                      size="sm"
                      class="self-start sm:self-auto"
                    >
                      <Icon name="ph:trash-duotone" class="h-4 w-4 ml-1" />
                      حذف
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      
      <!-- Order Summary -->
      <div class="lg:col-span-4">
        <div class="sticky top-6 space-y-6">
          <!-- Order Summary Card -->
          <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-info-50/50 to-warning-50/50 dark:from-info-900/20 dark:to-warning-900/20">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="ph:receipt-duotone" class="h-5 w-5 text-info-600 dark:text-info-400" />
                خلاصه سفارش
              </h2>
            </div>
            
            <div class="p-6">
              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Icon name="ph:package-duotone" class="h-4 w-4" />
                    تعداد کل اقلام:
                  </span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ totalItems }} کیلوگرم</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Icon name="ph:currency-circle-dollar-duotone" class="h-4 w-4" />
                    جمع کل:
                  </span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ new Intl.NumberFormat('fa-IR').format(totalAmount) }} ریال</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Icon name="ph:truck-duotone" class="h-4 w-4" />
                    هزینه ارسال:
                  </span>
                  <span class="font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Icon name="ph:check-circle-duotone" class="h-4 w-4" />
                    رایگان
                  </span>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Icon name="ph:credit-card-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    قابل پرداخت:
                  </span>
                  <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {{ new Intl.NumberFormat('fa-IR').format(totalAmount) }} ریال
                  </span>
                </div>
              </div>
              
              <BaseButton
                @click="proceedToCheckout"
                variant="solid"
                color="primary"
                size="lg"
                class="w-full py-3"
              >
                <Icon name="ph:credit-card-duotone" class="h-5 w-5 ml-2" />
                ادامه به پرداخت
              </BaseButton>
              
              <div class="mt-4 text-center">
                <button 
                  @click="$router.push('/baham/buyer/marketplace')"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                >
                  <Icon name="ph:arrow-left" class="h-4 w-4" />
                  ادامه خرید
                </button>
              </div>
            </div>
          </BaseCard>
          
          <!-- Discount Code -->
          <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Icon name="ph:ticket-duotone" class="h-5 w-5 text-warning-600 dark:text-warning-400" />
                کد تخفیف
              </h3>
              <div class="flex gap-2">
                <BaseInput 
                  placeholder="کد تخفیف خود را وارد کنید" 
                  class="flex-1"
                  rounded="lg"
                />
                <BaseButton variant="outline" color="default" rounded="lg">
                  اعمال
                </BaseButton>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                کد تخفیف خود را در این قسمت وارد کنید
              </p>
            </div>
          </BaseCard>
          
          <!-- Secure Shopping -->
          <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Icon name="ph:shield-check-duotone" class="h-5 w-5 text-success-600 dark:text-success-400" />
                خرید ایمن
              </h3>
              <ul class="space-y-2">
                <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="ph:check-circle-fill" class="h-4 w-4 text-success-500" />
                  پرداخت امن
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="ph:check-circle-fill" class="h-4 w-4 text-success-500" />
                  تحویل به موقع
                </li>
                <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="ph:check-circle-fill" class="h-4 w-4 text-success-500" />
                  ضمانت کیفیت
                </li>
              </ul>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>