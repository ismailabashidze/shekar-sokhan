<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  title: 'بازار - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'بازار - با هم',
  meta: [
    { name: 'description', content: 'بازار محصولات کشاورزی پلتفرم با هم' }
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
}

interface Category {
  id: number
  name: string
}

// Reactive data
const allLoads = ref<Load[]>([])
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const cartItemsCount = ref(0)
const searchHistory = ref<string[]>([])

// Search suggestions
const searchSuggestions = ref<string[]>([
  'گوجه فرنگی',
  'سیب زمینی',
  'پیاز',
  'هویج',
  'سبزیجات',
  'میوه‌ها'
])

// Initialize with mock data
// Filter states
const searchQuery = ref('')
const selectedCategory = ref<number | ''>('')
const selectedProduct = ref<number | ''>('')
const sortBy = ref('price_asc')
const minPrice = ref<number | ''>('')
const maxPrice = ref<number | ''>('')

// Debounce timer for search
let searchDebounce: NodeJS.Timeout | null = null

// Initialize with mock data
const initializeData = () => {
  // Mock categories
  categories.value = [
    { id: 0, name: 'همه دسته‌بندی‌ها' },
    { id: 1, name: 'سبزیجات' },
    { id: 2, name: 'میوه‌ها' },
    { id: 3, name: 'حبوبات' },
    { id: 4, name: 'غلات' }
  ]
  
  // Mock products
  products.value = [
    { id: 1, name: 'گوجه فرنگی', category: 'سبزیجات', description: 'گوجه فرنگی تازه و باکیفیت' },
    { id: 2, name: 'سیب زمینی', category: 'سبزیجات', description: 'سیب زمینی محلی با کیفیت عالی' },
    { id: 3, name: 'پیاز', category: 'سبزیجات', description: 'پیاز خشک با عطر و طعم عالی' },
    { id: 4, name: 'هویج', category: 'سبزیجات', description: 'هویج تازه و شیرین' }
  ]
  
  // Mock loads
  allLoads.value = [
    {
      id: 1,
      productId: 1,
      product: products.value[0],
      pricePerKg: 25000,
      availableQuantityKg: 50,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      providerId: 'PRV001'
    },
    {
      id: 2,
      productId: 2,
      product: products.value[1],
      pricePerKg: 18000,
      availableQuantityKg: 100,
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      providerId: 'PRV002'
    },
    {
      id: 3,
      productId: 3,
      product: products.value[2],
      pricePerKg: 15000,
      availableQuantityKg: 80,
      expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      providerId: 'PRV003'
    },
    {
      id: 4,
      productId: 4,
      product: products.value[3],
      pricePerKg: 20000,
      availableQuantityKg: 60,
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      providerId: 'PRV004'
    }
  ]
  
  // Mock cart items count
  cartItemsCount.value = 3
}

// Computed properties
const filteredLoads = computed(() => {
  let result = [...allLoads.value]
  
  // Apply search filter with improved algorithm
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    const queries = query.split(' ').filter(q => q.length > 0)
    
    result = result.filter(load => {
      const productName = load.product.name.toLowerCase()
      const productCategory = load.product.category.toLowerCase()
      const productDescription = load.product.description.toLowerCase()
      
      // Check if all search terms match
      return queries.every(q => 
        productName.includes(q) || 
        productCategory.includes(q) || 
        productDescription.includes(q)
      )
    })
  }
  
  // Apply category filter
  if (selectedCategory.value !== '') {
    result = result.filter(load => load.product.category === categories.value.find(c => c.id === selectedCategory.value)?.name)
  }
  
  // Apply product filter
  if (selectedProduct.value !== '') {
    result = result.filter(load => load.productId === selectedProduct.value)
  }
  
  // Apply price filters
  if (minPrice.value !== '') {
    result = result.filter(load => load.pricePerKg >= minPrice.value!)
  }
  
  if (maxPrice.value !== '') {
    result = result.filter(load => load.pricePerKg <= maxPrice.value!)
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'price_asc':
      result.sort((a, b) => a.pricePerKg - b.pricePerKg)
      break
    case 'price_desc':
      result.sort((a, b) => b.pricePerKg - a.pricePerKg)
      break
    case 'quantity':
      result.sort((a, b) => b.availableQuantityKg - a.availableQuantityKg)
      break
    case 'expiry':
      result.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime())
      break
  }
  
  return result
})

const productOptions = computed(() => {
  return [
    { label: 'همه محصولات', value: '' },
    ...products.value.map(p => ({ label: p.name, value: p.id }))
  ]
})

const categoryOptions = computed(() => {
  return categories.value.map(c => ({ label: c.name, value: c.id }))
})

const sortOptions = computed(() => {
  return [
    { label: 'قیمت صعودی', value: 'price_asc' },
    { label: 'قیمت نزولی', value: 'price_desc' },
    { label: 'موجودی', value: 'quantity' },
    { label: 'تاریخ انقضا', value: 'expiry' }
  ]
})

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

// Highlight search text in description
const highlightSearchText = (text: string) => {
  if (!searchQuery.value) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-400/30 font-semibold">$1</span>')
}

const addToCart = (load: Load) => {
  console.log('Adding to cart:', load)
  // Implementation for adding to cart
  cartItemsCount.value++
}

const viewProductDetails = (load: Load) => {
  const router = useRouter()
  router.push(`/baham/buyer/marketplace/${load.id}`)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedProduct.value = ''
  sortBy.value = 'price_asc'
  minPrice.value = ''
  maxPrice.value = ''
}

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedCategory.value !== '') count++
  if (selectedProduct.value !== '') count++
  if (minPrice.value !== '') count++
  if (maxPrice.value !== '') count++
  return count
})

const exportResults = () => {
  console.log('Exporting results')
  // Implementation for exporting results
}

// Perform search immediately
const performSearch = () => {
  // This will automatically trigger through computed property
  console.log('Performing search for:', searchQuery.value)
  
  // Save to search history (max 5 items)
  if (searchQuery.value && !searchHistory.value.includes(searchQuery.value)) {
    searchHistory.value.unshift(searchQuery.value)
    if (searchHistory.value.length > 5) {
      searchHistory.value.pop()
    }
  }
}

// Handle search input for immediate feedback
const onSearchInput = () => {
  // Trigger search immediately for better UX
  if (searchQuery.value.length > 2) {
    performSearch()
  }
}

// Apply search suggestion
const applySearchSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  performSearch()
}

// Show all products
const showAllProducts = () => {
  resetFilters()
  performSearch()
}

// Clear search history
const clearSearchHistory = () => {
  searchHistory.value = []
}

// Calculate search time (mock implementation)
const calculateSearchTime = () => {
  // In a real implementation, you would measure the actual search time
  return Math.floor(Math.random() * 10) + 1
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  console.log('Search cleared')
}

// Select from search history
const selectSearchHistory = (item: string) => {
  searchQuery.value = item
  performSearch()
}

// Debounced search
const debouncedSearch = () => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
  searchDebounce = setTimeout(() => {
    // Search will automatically trigger through computed property
    console.log('Searching for:', searchQuery.value)
  }, 300)
}

// Watch search query for debouncing
watch(searchQuery, () => {
  debouncedSearch()
})

// Lifecycle
onMounted(() => {
  initializeData()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <TairoHeading tag="h1" size="xl" weight="bold" class="text-gray-900 dark:text-white">
            بازار محصولات کشاورزی
          </TairoHeading>
          <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400 mt-1">
            مرور بارهای فعال و ثبت سفارش جدید
          </TairoParagraph>
        </div>
        <BaseButtons justify="end">
          <BaseButton 
            color="primary" 
            size="md"
            rounded="full"
            class="shadow-lg hover:shadow-xl transition-shadow duration-300"
            @click="$router.push('/baham/buyer/cart')"
          >
            <Icon name="fa6-solid:cart-shopping" class="h-4 w-4 ml-2" />
            سبد خرید ({{ cartItemsCount }})
          </BaseButton>
        </BaseButtons>
      </div>
    </div>
    
    <!-- Market Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center">
          <div class="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3">
            <Icon name="fa6-solid:boxes-stacked" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4 flex-1">
            <TairoParagraph size="sm" weight="medium" class="text-gray-600 dark:text-gray-400">
              تعداد بارهای فعال
            </TairoParagraph>
            <TairoHeading tag="p" size="xl" weight="bold" class="text-gray-900 dark:text-white">
              {{ allLoads.length }}
            </TairoHeading>
            <div class="mt-1 flex items-center">
              <Icon name="fa6-solid:arrow-up" class="h-3 w-3 text-green-500" />
              <TairoParagraph size="xs" class="text-green-500 ml-1">12%</TairoParagraph>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400 ml-1">از ماه گذشته</TairoParagraph>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center">
          <div class="rounded-xl bg-green-100 dark:bg-green-900/30 p-3">
            <Icon name="fa6-solid:seedling" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4 flex-1">
            <TairoParagraph size="sm" weight="medium" class="text-gray-600 dark:text-gray-400">
              دسته‌بندی‌ها
            </TairoParagraph>
            <TairoHeading tag="p" size="xl" weight="bold" class="text-gray-900 dark:text-white">
              {{ categories.length - 1 }}
            </TairoHeading>
            <div class="mt-1 flex items-center">
              <Icon name="fa6-solid:arrow-up" class="h-3 w-3 text-green-500" />
              <TairoParagraph size="xs" class="text-green-500 ml-1">3</TairoParagraph>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400 ml-1">دسته‌بندی جدید</TairoParagraph>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center">
          <div class="rounded-xl bg-purple-100 dark:bg-purple-900/30 p-3">
            <Icon name="fa6-solid:users" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4 flex-1">
            <TairoParagraph size="sm" weight="medium" class="text-gray-600 dark:text-gray-400">
              تعداد ارائه‌دهندگان
            </TairoParagraph>
            <TairoHeading tag="p" size="xl" weight="bold" class="text-gray-900 dark:text-white">
              12
            </TairoHeading>
            <div class="mt-1 flex items-center">
              <Icon name="fa6-solid:arrow-up" class="h-3 w-3 text-green-500" />
              <TairoParagraph size="xs" class="text-green-500 ml-1">2</TairoParagraph>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400 ml-1">ارائه‌دهنده جدید</TairoParagraph>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center">
          <div class="rounded-xl bg-orange-100 dark:bg-orange-900/30 p-3">
            <Icon name="fa6-solid:tag" class="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div class="ml-4 flex-1">
            <TairoParagraph size="sm" weight="medium" class="text-gray-600 dark:text-gray-400">
              میانگین قیمت
            </TairoParagraph>
            <TairoHeading tag="p" size="xl" weight="bold" class="text-gray-900 dark:text-white">
              65,000 ریال
            </TairoHeading>
            <div class="mt-1 flex items-center">
              <Icon name="fa6-solid:arrow-down" class="h-3 w-3 text-red-500" />
              <TairoParagraph size="xs" class="text-red-500 ml-1">5%</TairoParagraph>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400 ml-1">از ماه گذشته</TairoParagraph>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Filters -->
    <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <TairoLabel>جستجو</TairoLabel>
          <div class="relative">
            <div class="flex gap-2">
              <TairoInput
                v-model="searchQuery"
                placeholder="نام محصول، دسته‌بندی یا توضیحات"
                icon="fa6-solid:magnifying-glass"
                rounded="lg"
                class="focus:ring-2 focus:ring-primary-500 flex-1"
                @keyup.enter="performSearch"
                @input="onSearchInput"
              />
              <BaseButton
                v-if="searchQuery"
                color="secondary"
                variant="outline"
                rounded="lg"
                class="h-full"
                @click="clearSearch"
              >
                <Icon name="fa6-solid:xmark" class="h-4 w-4" />
              </BaseButton>
              <BaseButton
                color="primary"
                rounded="lg"
                class="h-full"
                @click="performSearch"
              >
                <Icon name="fa6-solid:magnifying-glass" class="h-4 w-4" />
              </BaseButton>
            </div>
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              جستجو در نام محصول، دسته‌بندی یا توضیحات
            </div>
            <div class="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Icon name="fa6-solid:lightbulb" class="h-3 w-3 ml-1 text-yellow-500" />
              نکات: برای نتایج بهتر از کلمات کلیدی استفاده کنید
            </div>
            
            <!-- Search history dropdown -->
            <div 
              v-if="searchHistory.length > 0 && !searchQuery" 
              class="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-muted-800 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div class="py-1">
                <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  جستجوهای اخیر
                </div>
                <div 
                  v-for="(historyItem, index) in searchHistory" 
                  :key="index"
                  class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-muted-700 cursor-pointer flex items-center"
                  @click="selectSearchHistory(historyItem)"
                >
                  <Icon name="fa6-solid:clock-rotate-left" class="h-4 w-4 ml-2 text-gray-400" />
                  {{ historyItem }}
                </div>
                <div class="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    class="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-muted-700"
                    @click="clearSearchHistory"
                  >
                    <Icon name="fa6-solid:trash" class="h-3 w-3 ml-2" />
                    پاک کردن تاریخچه جستجو
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <TairoLabel>دسته‌بندی</TairoLabel>
          <TairoSelect
            v-model="selectedCategory"
            :options="categoryOptions"
            rounded="lg"
            class="focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <TairoLabel>محصول</TairoLabel>
          <TairoSelect
            v-model="selectedProduct"
            :options="productOptions"
            rounded="lg"
            class="focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <TairoLabel>مرتب‌سازی</TairoLabel>
          <TairoSelect
            v-model="sortBy"
            :options="sortOptions"
            rounded="lg"
            class="focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div class="flex items-end">
          <BaseButton 
            variant="outline" 
            color="secondary" 
            class="w-full hover:bg-muted-100 dark:hover:bg-muted-800 transition-colors duration-200"
            rounded="lg"
            @click="resetFilters"
          >
            <Icon name="fa6-solid:rotate" class="h-4 w-4 ml-2" />
            بازنشانی
            <span v-if="activeFiltersCount > 0" class="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs ml-2">
              {{ activeFiltersCount }}
            </span>
          </BaseButton>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <TairoLabel>حداقل قیمت (ریال)</TairoLabel>
          <TairoInput
            v-model.number="minPrice"
            type="number"
            placeholder="0"
            rounded="lg"
            class="focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <TairoLabel>حداکثر قیمت (ریال)</TairoLabel>
          <TairoInput
            v-model.number="maxPrice"
            type="number"
            placeholder="200000"
            rounded="lg"
            class="focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <!-- Active filters display -->
      <div v-if="activeFiltersCount > 0" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <TairoParagraph size="sm" weight="medium" class="text-gray-700 dark:text-gray-300 mb-2">
          فیلترهای اعمال شده:
        </TairoParagraph>
        <div class="flex flex-wrap gap-2">
          <div v-if="searchQuery" class="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center">
            <Icon name="fa6-solid:magnifying-glass" class="h-3 w-3 ml-1" />
            {{ searchQuery }}
            <button @click="searchQuery = ''" class="ml-1 hover:text-blue-900 dark:hover:text-blue-100">
              <Icon name="fa6-solid:xmark" class="h-3 w-3" />
            </button>
          </div>
          <div v-if="selectedCategory" class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm flex items-center">
            <Icon name="fa6-solid:tag" class="h-3 w-3 ml-1" />
            {{ categories.find(c => c.id === selectedCategory)?.name }}
            <button @click="selectedCategory = ''" class="ml-1 hover:text-green-900 dark:hover:text-green-100">
              <Icon name="fa6-solid:xmark" class="h-3 w-3" />
            </button>
          </div>
          <div v-if="selectedProduct" class="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm flex items-center">
            <Icon name="fa6-solid:carrot" class="h-3 w-3 ml-1" />
            {{ products.find(p => p.id === selectedProduct)?.name }}
            <button @click="selectedProduct = ''" class="ml-1 hover:text-purple-900 dark:hover:text-purple-100">
              <Icon name="fa6-solid:xmark" class="h-3 w-3" />
            </button>
          </div>
          <div v-if="minPrice" class="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm flex items-center">
            <Icon name="fa6-solid:arrow-up" class="h-3 w-3 ml-1" />
            حداقل: {{ formatCurrency(minPrice) }}
            <button @click="minPrice = ''" class="ml-1 hover:text-orange-900 dark:hover:text-orange-100">
              <Icon name="fa6-solid:xmark" class="h-3 w-3" />
            </button>
          </div>
          <div v-if="maxPrice" class="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm flex items-center">
            <Icon name="fa6-solid:arrow-down" class="h-3 w-3 ml-1" />
            حداکثر: {{ formatCurrency(maxPrice) }}
            <button @click="maxPrice = ''" class="ml-1 hover:text-orange-900 dark:hover:text-orange-100">
              <Icon name="fa6-solid:xmark" class="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <!-- Results Info -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div class="flex flex-col">
        <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400">
          نمایش {{ filteredLoads.length }} بار از مجموع {{ allLoads.length }} بار فعال
          <span v-if="searchQuery">برای "{{ searchQuery }}"</span>
        </TairoParagraph>
        <TairoParagraph v-if="searchQuery" size="xs" class="text-gray-500 dark:text-gray-400 mt-1">
          {{ calculateSearchTime() }} میلی‌ثانیه زمان جستجو
        </TairoParagraph>
      </div>
      <BaseButtons gap="sm">
        <BaseButton 
          variant="outline" 
          color="primary" 
          size="sm"
          rounded="lg"
          class="border-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
          @click="exportResults"
        >
          <Icon name="fa6-solid:download" class="h-4 w-4 ml-2" />
          خروجی اکسل
        </BaseButton>
      </BaseButtons>
    </div>
    
    <!-- Load Listings -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <BaseCard
        v-for="load in filteredLoads"
        :key="load.id"
        rounded="xl"
        class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <TairoHeading tag="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white" v-html="highlightSearchText(load.product.name)"></TairoHeading>
              <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400" v-html="highlightSearchText(load.product.category)"></TairoParagraph>
            </div>
            <div class="text-left">
              <TairoHeading tag="div" size="lg" weight="bold" class="text-primary-600 dark:text-primary-400">
                {{ formatCurrency(load.pricePerKg) }}
              </TairoHeading>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400">
                /کیلوگرم
              </TairoParagraph>
            </div>
          </div>
          
          <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2" v-html="highlightSearchText(load.product.description)"></TairoParagraph>
          
          <div class="space-y-4 mb-6">
            <div class="flex justify-between items-center">
              <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400">
                موجودی:
              </TairoParagraph>
              <TairoParagraph size="sm" weight="medium" class="text-gray-900 dark:text-white">
                {{ load.availableQuantityKg }} کیلوگرم
              </TairoParagraph>
            </div>
            <div class="flex justify-between items-center">
              <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400">
                تاریخ انقضا:
              </TairoParagraph>
              <TairoParagraph size="sm" weight="medium" class="text-gray-900 dark:text-white">
                {{ load.expiryDate.toLocaleDateString('fa-IR') }}
              </TairoParagraph>
            </div>
            <div class="flex justify-between items-center">
              <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400">
                انقضا تا:
              </TairoParagraph>
              <TairoParagraph 
                size="sm"
                weight="medium"
                :class="daysUntilExpiry(load.expiryDate) <= 3 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'"
              >
                {{ daysUntilExpiry(load.expiryDate) }} روز
              </TairoParagraph>
            </div>
            <div class="flex justify-between items-center">
              <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400">
                کد ارائه‌دهنده:
              </TairoParagraph>
              <TairoParagraph size="xs" weight="medium" class="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {{ load.providerId }}
              </TairoParagraph>
            </div>
          </div>
          
          <!-- Progress bar for quantity -->
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">پیشرفت موجودی</span>
              <span class="font-medium">{{ Math.min(100, Math.round((load.availableQuantityKg / 200) * 100)) }}%</span>
            </div>
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full"
                :class="{
                  'bg-green-500': load.availableQuantityKg > 50,
                  'bg-yellow-500': load.availableQuantityKg <= 50 && load.availableQuantityKg > 20,
                  'bg-red-500': load.availableQuantityKg <= 20
                }"
                :style="{ width: Math.min(100, Math.round((load.availableQuantityKg / 200) * 100)) + '%' }"
              ></div>
            </div>
          </div>
          
          <BaseButtons gap="sm">
            <BaseButton
              @click="addToCart(load)"
              color="primary"
              class="flex-1 hover:shadow-md transition-shadow duration-200"
              rounded="lg"
            >
              <Icon name="fa6-solid:cart-plus" class="h-4 w-4 ml-2" />
              افزودن به سبد
            </BaseButton>
            <BaseButton
              @click="viewProductDetails(load)"
              variant="outline"
              color="primary"
              size="sm"
              rounded="lg"
              class="hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
            >
              <Icon name="ph:info" class="h-4 w-4" />
            </BaseButton>
          </BaseButtons>
        </div>
      </BaseCard>
    </div>
    
    <BaseCard 
      v-if="filteredLoads.length === 0" 
      rounded="xl"
      class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 text-center py-12 shadow-sm"
    >
      <Icon name="fa6-solid:box-open" class="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <TairoHeading tag="h3" size="xl" weight="medium" class="text-gray-900 dark:text-white mb-2">
        محصولی یافت نشد
      </TairoHeading>
      <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400 mb-6">
        بر اساس فیلترهای انتخابی شما، محصولی یافت نشد
      </TairoParagraph>
      
      <!-- Search suggestions -->
      <div v-if="searchQuery" class="mb-6">
        <TairoParagraph size="sm" class="text-gray-700 dark:text-gray-300 mb-3">
          پیشنهادات جستجو:
        </TairoParagraph>
        <div class="flex flex-wrap justify-center gap-2">
          <BaseButton 
            v-for="suggestion in searchSuggestions" 
            :key="suggestion" 
            variant="outline" 
            size="sm" 
            class="rounded-full"
            @click="applySearchSuggestion(suggestion)"
          >
            {{ suggestion }}
          </BaseButton>
        </div>
      </div>
      
      <BaseButtons justify="center" gap="sm">
        <BaseButton 
          variant="solid" 
          color="primary" 
          rounded="lg"
          class="px-6 py-2 hover:shadow-md transition-shadow duration-200"
          @click="resetFilters"
        >
          <Icon name="fa6-solid:rotate" class="h-4 w-4 ml-2" />
          بازنشانی فیلترها
        </BaseButton>
        <BaseButton 
          variant="outline" 
          color="secondary" 
          rounded="lg"
          class="px-6 py-2"
          @click="showAllProducts"
        >
          <Icon name="fa6-solid:eye" class="h-4 w-4 ml-2" />
          نمایش همه محصولات
        </BaseButton>
      </BaseButtons>
    </BaseCard>
    
    <!-- Market Insights -->
    <BaseCard rounded="xl" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <TairoHeading tag="h2" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
          بینش بازار
        </TairoHeading>
        <BaseButton variant="ghost" size="sm" color="primary">
          <Icon name="fa6-solid:ellipsis" class="h-4 w-4" />
        </BaseButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:shadow-md transition-shadow duration-300 border border-blue-100 dark:border-blue-800/30">
          <div class="flex items-center mb-3">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg ml-3">
              <Icon name="fa6-solid:chart-line" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <TairoHeading tag="h3" size="sm" weight="medium" class="text-gray-900 dark:text-white">
                روند قیمت
              </TairoHeading>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400">
                هفته گذشته
              </TairoParagraph>
            </div>
          </div>
          <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400 mb-3">
            قیمت سیب زمینی در هفته گذشته 5% افزایش یافته است.
          </TairoParagraph>
          <div class="flex items-center text-green-600 dark:text-green-400">
            <Icon name="fa6-solid:arrow-trend-up" class="h-4 w-4 ml-1" />
            <TairoParagraph size="xs" weight="medium">+5% افزایش</TairoParagraph>
          </div>
        </div>
        <div class="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl hover:shadow-md transition-shadow duration-300 border border-green-100 dark:border-green-800/30">
          <div class="flex items-center mb-3">
            <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg ml-3">
              <Icon name="fa6-solid:calendar-days" class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <TairoHeading tag="h3" size="sm" weight="medium" class="text-gray-900 dark:text-white">
                فصل برداشت
              </TairoHeading>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400">
                پیاز شمالی
              </TairoParagraph>
            </div>
          </div>
          <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400 mb-3">
            فصل برداشت پیاز در مناطق شمالی از 15 تیر آغاز می‌شود.
          </TairoParagraph>
          <div class="flex items-center text-blue-600 dark:text-blue-400">
            <Icon name="fa6-solid:clock" class="h-4 w-4 ml-1" />
            <TairoParagraph size="xs" weight="medium">2 هفته دیگر</TairoParagraph>
          </div>
        </div>
        <div class="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:shadow-md transition-shadow duration-300 border border-purple-100 dark:border-purple-800/30">
          <div class="flex items-center mb-3">
            <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg ml-3">
              <Icon name="fa6-solid:fire" class="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <TairoHeading tag="h3" size="sm" weight="medium" class="text-gray-900 dark:text-white">
                پیشنهاد ویژه
              </TairoHeading>
              <TairoParagraph size="xs" class="text-gray-500 dark:text-gray-400">
                محدود در زمان
              </TairoParagraph>
            </div>
          </div>
          <TairoParagraph size="sm" class="text-gray-600 dark:text-gray-400 mb-3">
            خرید بیش از 100 کیلوگرم گوجه فرنگی با 10% تخفیف.
          </TairoParagraph>
          <div class="flex items-center text-orange-600 dark:text-orange-400">
            <Icon name="fa6-solid:tag" class="h-4 w-4 ml-1" />
            <TairoParagraph size="xs" weight="medium">10% تخفیف</TairoParagraph>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>