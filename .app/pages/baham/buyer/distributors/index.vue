<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  title: 'توزیع‌کنندگان من - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'توزیع‌کنندگان من - با هم',
  meta: [
    { name: 'description', content: 'لیست توزیع‌کنندگان تأیید شده شما در پلتفرم با هم' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Reactive states
const searchQuery = ref('')

// Sample distributor data
const distributors = ref([
  {
    id: 1,
    companyName: 'شرکت توزیع شمال',
    serviceArea: 'تهران، البرز، قزوین',
    contactInfo: '021-12345678',
    status: 'verified',
    rating: 4.8,
    totalOrders: 124,
    joinedDate: '2022-03-15',
    initials: 'ش.ت'
  },
  {
    id: 2,
    companyName: 'توزیع‌کننده مرکزی',
    serviceArea: 'اصفهان، کرمان، یزد',
    contactInfo: '031-87654321',
    status: 'verified',
    rating: 4.6,
    totalOrders: 98,
    joinedDate: '2021-11-22',
    initials: 'ت.م'
  },
  {
    id: 3,
    companyName: 'خدمات لاجستیک شرق',
    serviceArea: 'خراسان رضوی، سمنان، قم',
    contactInfo: '051-11223344',
    status: 'verified',
    rating: 4.9,
    totalOrders: 156,
    joinedDate: '2023-01-10',
    initials: 'خ.ل'
  },
  {
    id: 4,
    companyName: 'توزیع پایا',
    serviceArea: 'آذربایجان شرقی، غربی، اردبیل',
    contactInfo: '041-55667788',
    status: 'verified',
    rating: 4.7,
    totalOrders: 87,
    joinedDate: '2022-07-18',
    initials: 'ت.پ'
  },
  {
    id: 5,
    companyName: 'سامان لاجستیک',
    serviceArea: 'فارس، بوشهر، خوزستان',
    contactInfo: '071-99887766',
    status: 'verified',
    rating: 4.5,
    totalOrders: 65,
    joinedDate: '2023-03-05',
    initials: 'س.ل'
  },
  {
    id: 6,
    companyName: 'حمل و نقل البرز',
    serviceArea: 'مازندران، گیلان، گلستان',
    contactInfo: '011-33445566',
    status: 'verified',
    rating: 4.4,
    totalOrders: 72,
    joinedDate: '2022-09-30',
    initials: 'ح.ا'
  }
])

// Filtered distributors based on search query
const filteredDistributors = computed(() => {
  if (!searchQuery.value) {
    return distributors.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return distributors.value.filter(distributor => 
    distributor.companyName.toLowerCase().includes(query) ||
    distributor.serviceArea.toLowerCase().includes(query)
  )
})

// Methods
const viewDistributorDetails = (id) => {
  console.log('View details for distributor:', id)
  // Implementation for viewing distributor details
}

const searchDistributors = () => {
  // Search is automatically handled by the computed property
}

// Get color based on rating
const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-success-500'
  if (rating >= 4.0) return 'text-warning-500'
  return 'text-danger-500'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:truck-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">توزیع‌کنندگان من</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">لیست توزیع‌کنندگان تأیید شده شما</p>
    </div>
    
    <!-- Search -->
    <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm mb-8">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-2">
            <BaseInput
              v-model="searchQuery"
              placeholder="جستجوی نام شرکت یا منطقه خدمات..."
              icon="ph:magnifying-glass-duotone"
              rounded="lg"
            />
          </div>
          <div class="flex gap-2">
            <BaseButton 
              variant="solid" 
              color="primary" 
              size="lg"
              class="flex-1"
            >
              <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
              جستجوی توزیع‌کننده جدید
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <!-- Distributor Listings -->
    <div v-if="filteredDistributors.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="distributor in filteredDistributors"
        :key="distributor.id"
        rounded="xl"
        class="dark:!bg-muted-900 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
      >
        <div class="p-6">
          <div class="flex items-start mb-4">
            <BaseAvatar 
              :text="distributor.initials" 
              color="primary" 
              size="lg"
              class="mr-3"
            />
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">{{ distributor.companyName }}</h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 mr-2">
                  <Icon name="ph:check-circle-duotone" class="h-3 w-3 ml-1" />
                  تأیید شده
                </span>
              </div>
              <div class="flex items-center mt-2">
                <Icon name="ph:map-pin-duotone" class="h-4 w-4 text-gray-400 dark:text-gray-500 ml-1" />
                <span class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ distributor.serviceArea }}</span>
              </div>
            </div>
          </div>
          
          <div class="space-y-3 mb-6">
            <div class="flex items-center">
              <Icon name="ph:phone-duotone" class="h-4 w-4 text-gray-400 dark:text-gray-500 ml-1" />
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ distributor.contactInfo }}</span>
            </div>
            
            <div class="flex items-center">
              <Icon 
                name="ph:star-duotone" 
                class="h-4 w-4 ml-1" 
                :class="getRatingColor(distributor.rating)"
              />
              <span class="text-sm text-gray-600 dark:text-gray-400 ml-1">{{ distributor.rating }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-500">({{ distributor.totalOrders }} سفارش)</span>
            </div>
          </div>
          
          <BaseButton
            @click="viewDistributorDetails(distributor.id)"
            variant="solid"
            color="primary"
            size="md"
            class="w-full"
          >
            مشاهده جزئیات
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    
    <BaseCard 
      v-else 
      rounded="xl" 
      class="dark:!bg-muted-900 shadow-sm text-center py-16"
    >
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6 mx-auto">
        <Icon name="ph:truck-duotone" class="h-10 w-10 text-primary-500" />
      </div>
      <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">توزیع‌کننده‌ای یافت نشد</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        با معیارهای جستجوی فعلی توزیع‌کننده‌ای یافت نشد. لطفاً فیلترهای جستجو را تغییر دهید.
      </p>
      <BaseButton 
        variant="solid" 
        color="primary" 
        @click="searchQuery = ''"
      >
        <Icon name="ph:x-duotone" class="h-4 w-4 ml-2" />
        پاک کردن فیلترها
      </BaseButton>
    </BaseCard>
  </div>
</template>