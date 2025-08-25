<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  title: 'جزئیات محصول - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'جزئیات محصول - با هم',
  meta: [
    { name: 'description', content: 'مشاهده جزئیات محصول در بازار با هم' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Define types
interface Product {
  id: number
  name: string
  category: string
  description: string
}

interface Load {
  id: number
  productId: number
  product: Product
  pricePerKg: number
  availableQuantityKg: number
  expiryDate: Date
  providerId: string
  providerName: string
  providerRating: number
  providerReviewsCount: number
  harvestDate: Date
  origin: string
  quality: 'A' | 'B' | 'C'
  certifications: string[]
}

interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: Date
}

// Reactive data
const load = ref<Load | null>(null)
const reviews = ref<Review[]>([])
const quantity = ref(1)
const activeTab = ref('details')
const cartItemsCount = ref(0)

// Route and router
const route = useRoute()
const router = useRouter()

// Toast for notifications
const toast = useToaster()

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

const daysUntilExpiry = (date: Date) => {
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

const getQualityClass = (quality: string) => {
  const classes = {
    A: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    B: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    C: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  }
  return classes[quality] || 'bg-gray-100 text-gray-800'
}

const getQualityLabel = (quality: string) => {
  const labels = {
    A: 'درجه یک',
    B: 'درجه دو',
    C: 'درجه سه'
  }
  return labels[quality] || 'نامشخص'
}

// Initialize with mock data
const initializeData = () => {
  const loadId = Number(route.params.id)
  
  // Mock product
  const product: Product = {
    id: 1,
    name: 'گوجه فرنگی تازه',
    category: 'سبزیجات',
    description: 'گوجه فرنگی تازه و باکیفیت از مزرعه محلی'
  }
  
  // Mock load data
  load.value = {
    id: loadId,
    productId: 1,
    product: product,
    pricePerKg: 25000,
    availableQuantityKg: 50,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    providerId: 'PRV001',
    providerName: 'مزرعه سبز',
    providerRating: 4.8,
    providerReviewsCount: 124,
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    origin: 'شهریار، البرز',
    quality: 'A',
    certifications: ['ISO 22000', ' organic']
  }
  
  // Mock reviews
  reviews.value = [
    {
      id: 1,
      userName: 'علی محمدی',
      rating: 5,
      comment: 'کیفیت عالی و تازگی فوق‌العاده. حتماً توصیه می‌کنم.',
      date: new Date('2023-05-10')
    },
    {
      id: 2,
      userName: 'فاطمه رضایی',
      rating: 4,
      comment: 'محصول خوبی بود، فقط کمی گرون بود نسبت به هفته قبل.',
      date: new Date('2023-05-08')
    },
    {
      id: 3,
      userName: 'حسین کریمی',
      rating: 5,
      comment: 'همیشه از این فروشنده خرید می‌کنم. رضایت کامل.',
      date: new Date('2023-05-05')
    }
  ]
  
  // Mock cart items count
  cartItemsCount.value = 3
}

// Add to cart
const addToCart = () => {
  if (!load.value) return
  
  if (quantity.value <= 0) {
    toast.error('تعداد باید بیشتر از صفر باشد')
    return
  }
  
  if (quantity.value > load.value.availableQuantityKg) {
    toast.error('تعداد درخواستی بیشتر از موجودی است')
    return
  }
  
  // In a real app, this would send data to the server
  console.log('Adding to cart:', {
    loadId: load.value.id,
    quantity: quantity.value,
    price: load.value.pricePerKg * quantity.value
  })
  
  cartItemsCount.value++
  toast.success('محصول با موفقیت به سبد خرید اضافه شد')
}

// Buy now
const buyNow = () => {
  if (!load.value) return
  
  if (quantity.value <= 0) {
    toast.error('تعداد باید بیشتر از صفر باشد')
    return
  }
  
  if (quantity.value > load.value.availableQuantityKg) {
    toast.error('تعداد درخواستی بیشتر از موجودی است')
    return
  }
  
  // In a real app, this would redirect to checkout
  router.push('/baham/buyer/checkout')
}

// Lifecycle
onMounted(() => {
  initializeData()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <BaseButton 
        variant="outline" 
        color="default" 
        @click="$router.back()"
        rounded="lg"
      >
        <Icon name="ph:arrow-right-duotone" class="h-4 w-4 ml-2" />
        بازگشت به بازار
      </BaseButton>
    </div>
    
    <div v-if="load" class="space-y-8">
      <!-- Product Header -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product Image -->
        <div class="bg-gray-100 dark:bg-muted-800 rounded-2xl overflow-hidden flex items-center justify-center aspect-square">
          <img 
            src="https://placehold.co/400x400/4F46E5/FFFFFF?text=گوجه+فرنگی" 
            :alt="load.product.name"
            class="object-contain w-full h-full"
          >
        </div>
        
        <!-- Product Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ load.product.name }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">{{ load.product.category }}</p>
          </div>
          
          <div class="flex flex-wrap items-center gap-3">
            <span
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="getQualityClass(load.quality)"
            >
              {{ getQualityLabel(load.quality) }}
            </span>
            <div class="flex items-center">
              <Icon name="ph:star-fill" class="h-5 w-5 text-yellow-400" />
              <span class="mr-1 text-gray-900 dark:text-white font-medium">{{ load.providerRating }}</span>
              <span class="mx-1 text-gray-400 dark:text-gray-500">•</span>
              <span class="text-gray-600 dark:text-gray-400 text-sm">{{ load.providerReviewsCount }} نظر</span>
            </div>
          </div>
          
          <p class="text-gray-700 dark:text-gray-300">{{ load.product.description }}</p>
          
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400">قیمت</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(load.pricePerKg) }} <span class="text-lg">ریال / کیلوگرم</span></p>
              </div>
              <div class="text-left">
                <p class="text-gray-600 dark:text-gray-400">موجودی</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ load.availableQuantityKg }} <span class="text-lg">کیلوگرم</span></p>
              </div>
            </div>
          </div>
          
          <!-- Quantity Selector -->
          <div class="flex items-center gap-4">
            <p class="text-gray-700 dark:text-gray-300">تعداد (کیلوگرم):</p>
            <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted-700 rounded-r-lg"
                @click="quantity = Math.max(1, quantity - 1)"
                :disabled="quantity <= 1"
              >
                <Icon name="ph:minus" class="h-4 w-4" />
              </button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="load.availableQuantityKg"
                class="w-16 text-center bg-transparent border-0 focus:ring-0"
              />
              <button
                class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted-700 rounded-l-lg"
                @click="quantity = Math.min(load.availableQuantityKg, quantity + 1)"
                :disabled="quantity >= load.availableQuantityKg"
              >
                <Icon name="ph:plus" class="h-4 w-4" />
              </button>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mr-2">حداکثر: {{ load.availableQuantityKg }} کیلوگرم</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <BaseButton
              @click="addToCart"
              variant="solid"
              color="primary"
              size="lg"
              class="flex-1"
              rounded="lg"
            >
              <Icon name="ph:shopping-cart-simple-duotone" class="h-5 w-5 ml-2" />
              افزودن به سبد خرید
            </BaseButton>
            <BaseButton
              @click="buyNow"
              variant="outline"
              color="primary"
              size="lg"
              class="flex-1"
              rounded="lg"
            >
              <Icon name="ph:lightning-duotone" class="h-5 w-5 ml-2" />
              خرید فوری
            </BaseButton>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'details'"
            :class="[
              activeTab === 'details' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium'
            ]"
          >
            جزئیات محصول
          </button>
          <button
            @click="activeTab = 'reviews'"
            :class="[
              activeTab === 'reviews' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium'
            ]"
          >
            نظرات کاربران
          </button>
          <button
            @click="activeTab = 'provider'"
            :class="[
              activeTab === 'provider' 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium'
            ]"
          >
            اطلاعات فروشنده
          </button>
        </nav>
      </div>
      
      <!-- Tab Content -->
      <div class="py-6">
        <!-- Details Tab -->
        <div v-show="activeTab === 'details'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">اطلاعات محصول</h3>
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">تاریخ برداشت</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(load.harvestDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">تاریخ انقضا</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(load.expiryDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">انقضا تا</span>
                  <span 
                    :class="[
                      'font-medium',
                      daysUntilExpiry(load.expiryDate) <= 3 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-900 dark:text-white'
                    ]"
                  >
                    {{ daysUntilExpiry(load.expiryDate) }} روز
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">مبدا</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ load.origin }}</span>
                </div>
              </div>
            </BaseCard>
            
            <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">گواهی‌ها</h3>
              <div class="space-y-3">
                <div 
                  v-for="(cert, index) in load.certifications" 
                  :key="index"
                  class="flex items-center p-3 bg-gray-50 dark:bg-muted-800 rounded-lg"
                >
                  <Icon name="ph:certificate-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400 ml-2" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ cert }}</span>
                </div>
              </div>
            </BaseCard>
          </div>
          
          <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">توضیحات کامل</h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              گوجه فرنگی تازه‌ای که در مزرعه سبز کشت شده است. این محصول با رعایت کامل استانداردهای بهداشتی و کشاورزی ارگانیک تولید شده است. 
              برداشت این محصول به‌صورت دستی و در زمان مناسب انجام شده تا حداکثر تازگی و کیفیت را داشته باشد. 
              این محصول دارای گواهی‌های معتبر کشاورزی ارگانیک و ISO 22000 می‌باشد.
            </p>
          </BaseCard>
        </div>
        
        <!-- Reviews Tab -->
        <div v-show="activeTab === 'reviews'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">نظرات کاربران</h3>
            <BaseButton variant="outline" color="primary" rounded="lg">
              <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
              ثبت نظر
            </BaseButton>
          </div>
          
          <div class="space-y-6">
            <BaseCard 
              v-for="review in reviews" 
              :key="review.id"
              rounded="xl" 
              class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6"
            >
              <div class="flex justify-between">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ review.userName }}</h4>
                  <div class="flex items-center mt-1">
                    <div class="flex">
                      <Icon 
                        v-for="i in 5" 
                        :key="i"
                        :name="i <= review.rating ? 'ph:star-fill' : 'ph:star'"
                        class="h-4 w-4 text-yellow-400"
                      />
                    </div>
                    <span class="mr-2 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(review.date) }}</span>
                  </div>
                </div>
              </div>
              <p class="mt-4 text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
            </BaseCard>
          </div>
          
          <div class="text-center py-8">
            <BaseButton variant="outline" color="primary" rounded="lg">
              مشاهده همه نظرات
            </BaseButton>
          </div>
        </div>
        
        <!-- Provider Tab -->
        <div v-show="activeTab === 'provider'" class="space-y-6">
          <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-start gap-6">
              <div class="bg-gray-200 dark:bg-muted-700 border-2 border-dashed rounded-xl w-16 h-16" />
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ load.providerName }}</h3>
                <div class="flex items-center mt-2">
                  <div class="flex">
                    <Icon 
                      v-for="i in 5" 
                      :key="i"
                      name="ph:star-fill"
                      class="h-5 w-5 text-yellow-400"
                    />
                  </div>
                  <span class="mr-2 font-medium text-gray-900 dark:text-white">{{ load.providerRating }}</span>
                  <span class="mx-1 text-gray-400 dark:text-gray-500">•</span>
                  <span class="text-gray-600 dark:text-gray-400">{{ load.providerReviewsCount }} نظر</span>
                </div>
                <p class="mt-3 text-gray-600 dark:text-gray-400">مبدا: {{ load.origin }}</p>
              </div>
              <BaseButton variant="outline" color="primary" rounded="lg">
                مشاهده پروفایل
              </BaseButton>
            </div>
          </BaseCard>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Icon name="ph:package-duotone" class="h-10 w-10 text-primary-600 dark:text-primary-400 mx-auto" />
              <p class="mt-3 text-gray-600 dark:text-gray-400">محصولات فعال</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</p>
            </BaseCard>
            
            <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Icon name="ph:truck-duotone" class="h-10 w-10 text-primary-600 dark:text-primary-400 mx-auto" />
              <p class="mt-3 text-gray-600 dark:text-gray-400">سفارشات موفق</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,248</p>
            </BaseCard>
            
            <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Icon name="ph:clock-duotone" class="h-10 w-10 text-primary-600 dark:text-primary-400 mx-auto" />
              <p class="mt-3 text-gray-600 dark:text-gray-400">زمان تحویل</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">2 روز</p>
            </BaseCard>
          </div>
          
          <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">درباره مزرعه</h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              مزرعه سبز با بیش از 15 سال سابقه در زمینه کشت محصولات کشاورزی فعالیت می‌کند. 
              این مزرعه با رعایت کامل استانداردهای کشاورزی ارگانیک و بهداشتی محصولات باکیفیتی را ارائه می‌دهد. 
              تیم کارشناسی ما به‌طور مداوم کیفیت محصولات این مزرعه را بررسی و نظارت می‌کند.
            </p>
          </BaseCard>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <Icon name="ph:warning-duotone" class="h-16 w-16 text-yellow-500 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">محصول یافت نشد</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">محصول مورد نظر یافت نشد.</p>
      <BaseButton 
        variant="solid" 
        color="primary" 
        rounded="lg"
        @click="$router.push('/baham/buyer/marketplace')"
      >
        <Icon name="ph:arrow-left-duotone" class="h-4 w-4 ml-2" />
        بازگشت به بازار
      </BaseButton>
    </div>
  </div>
</template>