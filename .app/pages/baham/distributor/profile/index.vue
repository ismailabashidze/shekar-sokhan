<template>
  <div class="business-profile space-y-8">
    <BaseCard class="p-6">
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
            پروفایل کسب‌وکار
          </BaseHeading>
          <NuxtLink to="/baham/distributor/profile/edit">
            <BaseButton variant="solid" color="primary" size="lg" rounded="lg">
              ویرایش پروفایل
            </BaseButton>
          </NuxtLink>
        </div>
      </template>
      
      <div class="flex flex-col md:flex-row gap-8 pt-2">
        <div class="flex-shrink-0">
          <div class="bg-muted-200 dark:bg-muted-700 border-2 border-dashed border-muted-300 dark:border-muted-600 rounded-xl w-40 h-40 flex items-center justify-center">
            <Icon name="mdi:account-circle" class="w-20 h-20 text-muted-400 dark:text-muted-500" />
          </div>
        </div>
        
        <div class="flex-grow">
          <BaseHeading tag="h2" size="3xl" weight="bold" class="text-muted-800 dark:text-white mb-3">
            {{ businessProfile.companyName }}
          </BaseHeading>
          <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-400 mb-6">
            {{ businessProfile.description }}
          </BaseParagraph>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <BaseCard class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
                شماره پروانه کسب
              </BaseParagraph>
              <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                {{ businessProfile.licenseNumber }}
              </BaseParagraph>
            </BaseCard>
            <BaseCard class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
                ظرفیت حمل
              </BaseParagraph>
              <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                {{ businessProfile.capacity }} کیلوگرم
              </BaseParagraph>
            </BaseCard>
            <BaseCard class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
                منطقه خدمات‌رسانی
              </BaseParagraph>
              <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                {{ businessProfile.serviceArea }}
              </BaseParagraph>
            </BaseCard>
            <BaseCard class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
                امتیاز
              </BaseParagraph>
              <div class="flex items-center">
                <div class="flex text-warning-400">
                  <Icon name="mdi:star" v-for="star in 5" :key="star" class="w-6 h-6" />
                </div>
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white mr-3">
                  {{ businessProfile.rating }} از 5 ({{ businessProfile.reviews }} نظر)
                </BaseParagraph>
              </div>
            </BaseCard>
          </div>
          
          <div class="mt-6">
            <BaseHeading tag="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-4">
              خدمات ارائه شده
            </BaseHeading>
            <div class="flex flex-wrap gap-3">
              <BaseTag 
                v-for="service in businessProfile.services" 
                :key="service" 
                color="primary"
                variant="solid"
                size="lg"
              >
                {{ service }}
              </BaseTag>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BaseCard class="p-6">
        <template #header>
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            عملکرد اخیر
          </BaseHeading>
        </template>
        <div class="grid grid-cols-3 gap-6 text-center">
          <div>
            <BaseHeading tag="h3" size="4xl" weight="bold" class="text-primary-600 dark:text-primary-400 mb-2">
              {{ performanceMetrics.ordersCompleted }}
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
              سفارش تکمیل شده
            </BaseParagraph>
          </div>
          <div>
            <BaseHeading tag="h3" size="4xl" weight="bold" class="text-success-600 dark:text-success-400 mb-2">
              {{ performanceMetrics.onTimeDelivery }}%
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
              تحویل به‌موقع
            </BaseParagraph>
          </div>
          <div>
            <BaseHeading tag="h3" size="4xl" weight="bold" class="text-purple-600 dark:text-purple-400 mb-2">
              {{ performanceMetrics.customerSatisfaction }}%
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
              رضایت مشتری
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="p-6">
        <template #header>
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            آمار کلی
          </BaseHeading>
        </template>
        <div class="grid grid-cols-2 gap-5">
          <div class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
              کل سفارشات
            </BaseParagraph>
            <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
              1,248
            </BaseHeading>
          </div>
          <div class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
              کل درآمد
            </BaseParagraph>
            <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
              42,500,000 تومان
            </BaseHeading>
          </div>
          <div class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
              مشتریان فعال
            </BaseParagraph>
            <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
              86
            </BaseHeading>
          </div>
          <div class="bg-muted-50 dark:bg-muted-800 p-5 rounded-xl">
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
              ارائه‌دهندگان
            </BaseParagraph>
            <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
              24
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <BaseCard class="p-6">
      <template #header>
        <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
          نظرات مشتریان
        </BaseHeading>
      </template>
      
      <div v-if="reviews.length === 0" class="text-center py-12 text-muted-500 dark:text-muted-400">
        <Icon name="mdi:comment-outline" class="w-16 h-16 text-muted-400 dark:text-muted-500 mx-auto mb-4" />
        <BaseHeading tag="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white mb-2">
          هنوز نظری ثبت نشده است
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
          پس از انجام سفارشات، مشتریان می‌توانند نظر خود را ثبت کنند
        </BaseParagraph>
      </div>
      
      <div v-else class="space-y-5">
        <BaseCard 
          v-for="review in reviews" 
          :key="review.id" 
          class="border border-muted-200 dark:border-muted-700 p-5 rounded-xl"
        >
          <div class="flex justify-between mb-3">
            <BaseHeading tag="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white">
              {{ review.customerName }}
            </BaseHeading>
            <div class="flex text-warning-400">
              <Icon name="mdi:star" v-for="star in 5" :key="star" class="w-5 h-5" />
            </div>
          </div>
          <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mb-3">
            {{ review.comment }}
          </BaseParagraph>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            {{ review.date }}
          </BaseParagraph>
        </BaseCard>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import type { BusinessProfile, PerformanceMetrics, Review } from './types'

definePageMeta({
  title: 'پروفایل کسب‌وکار',
  icon: 'mdi:account-card-details',
  layout: 'distributor'
})

useHead({
  title: 'پروفایل کسب‌وکار - با هم',
  meta: [
    { name: 'description', content: 'پروفایل کسب‌وکار توزیع‌کننده در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

// Mock data for business profile
const businessProfile: BusinessProfile = {
  companyName: 'توزیع‌کننده البرز',
  description: 'توزیع کالاهای کشاورزی در مناطق شمالی و شرقی تهران با کامیون‌های م refrigerated',
  licenseNumber: '123456789',
  capacity: 2500,
  serviceArea: 'منطقه شمالی و شرقی تهران',
  rating: 4.8,
  reviews: 42,
  services: ['حمل و نقل سرد', 'تحویل درب به درب', 'بسته‌بندی حرفه‌ای', 'تحویل 24 ساعته']
}

const performanceMetrics: PerformanceMetrics = {
  ordersCompleted: 128,
  onTimeDelivery: 96,
  customerSatisfaction: 94
}

const reviews: Review[] = [
  {
    id: 'REV-001',
    customerName: 'فروشگاه سبز',
    rating: 5,
    comment: 'خدمات عالی و تحویل به‌موقع. حتماً دوباره از این توزیع‌کننده استفاده خواهیم کرد.',
    date: '1403/05/18'
  },
  {
    id: 'REV-002',
    customerName: 'سوپرمارکت طلایی',
    rating: 5,
    comment: 'کالاها با کیفیت بالا و در شرایط مناسب تحویل شدند.',
    date: '1403/05/15'
  },
  {
    id: 'REV-003',
    customerName: 'رستوران آبی',
    rating: 4,
    comment: 'به‌جز یک مورد کوچک در زمان تحویل، تجربه خوبی داشتیم.',
    date: '1403/05/10'
  }
]
</script>