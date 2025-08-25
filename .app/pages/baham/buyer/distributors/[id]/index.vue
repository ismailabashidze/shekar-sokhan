<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  title: 'جزئیات توزیع‌کننده - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'جزئیات توزیع‌کننده - با هم',
  meta: [
    { name: 'description', content: 'مشاهده جزئیات توزیع‌کننده در پلتفرم با هم' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

const route = useRoute()
const router = useRouter()

// Mock data for the distributor
const distributor = ref({
  id: route.params.id,
  companyName: 'توزیع‌کننده پیشتاز',
  description: 'توزیع کالاهای کشاورزی با کیفیت بالا و تحویل به موقع',
  rating: 4.8,
  memberSince: new Date('2022-01-15'),
  contactPerson: 'احمد رضایی',
  phone: '021-12345678',
  mobile: '09123456789',
  email: 'info@paytaz.com',
  address: 'خیابان آزادی، کوچه ۵، پلاک ۱۲',
  city: 'تهران',
  serviceArea: 'تهران و مناطق اطراف',
  serviceRadius: '۲۰ کیلومتر',
  deliveryHours: '۸:۰۰ تا ۲۰:۰۰',
  deliveryDays: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه'],
  services: [
    'تحویل سریع',
    'بسته‌بندی تخصصی',
    'انبارداری',
    'پشتیبانی ۲۴ ساعته'
  ],
  certifications: [
    'گواهی کیفیت ISO 9001',
    'مجوز حمل و نقل کالاهای خوراکی',
    'گواهی بهداشت و سلامت'
  ],
  totalDeliveries: 1240,
  minimumOrder: 500000,
  deliveryFee: 25000
})

const performanceStats = ref({
  onTimeDelivery: 96,
  customerSatisfaction: 92,
  averageDeliveryTime: '۲ ساعت',
  returnRate: '۲.۵%'
})

const connectionStatus = ref('not_connected') // 'not_connected', 'pending', 'connected'

const recentOrders = ref([
  { id: 'ORD-1001', product: 'سیب زمینی', quantity: '۱۰۰ کیلو', status: 'delivered', date: new Date('2023-05-20') },
  { id: 'ORD-1002', product: 'گوجه فرنگی', quantity: '۵۰ کیلو', status: 'delivered', date: new Date('2023-05-18') },
  { id: 'ORD-1003', product: 'پیاز', quantity: '۷۵ کیلو', status: 'delivered', date: new Date('2023-05-15') },
  { id: 'ORD-1004', product: 'هویج', quantity: '۶۰ کیلو', status: 'pending', date: new Date('2023-05-22') }
])

const reviews = ref([
  { id: 1, user: 'مرتضی محمدی', rating: 5, comment: 'تحویل سریع و کالای با کیفیت', date: new Date('2023-05-10') },
  { id: 2, user: 'فاطمه رضایی', rating: 4, comment: 'خدمات خوب اما زمان تحویل گاهی طولانی است', date: new Date('2023-04-28') },
  { id: 3, user: 'حسین کریمی', rating: 5, comment: 'همیشه راضی بوده‌ام از خدمات آنها', date: new Date('2023-04-15') }
])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fa-IR').format(date)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

const sendMessage = () => {
  console.log('Sending message to distributor')
  // Implement message sending functionality
}

const requestConnection = () => {
  connectionStatus.value = 'pending'
  console.log('Connection request sent')
  // Implement connection request functionality
}

const disconnect = () => {
  connectionStatus.value = 'not_connected'
  console.log('Disconnected from distributor')
  // Implement disconnection functionality
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          جزئیات توزیع‌کننده
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          اطلاعات و ارتباط با توزیع‌کننده
        </BaseParagraph>
      </div>
      <div class="flex gap-3">
        <BaseButton 
          variant="outline" 
          color="primary" 
          size="lg"
          rounded="lg"
          @click="$router.back()"
        >
          <Icon name="ph:arrow-right" class="size-5 ml-2" />
          بازگشت
        </BaseButton>
        <BaseButton 
          variant="outline" 
          color="primary" 
          size="lg"
          rounded="lg"
          @click="sendMessage"
        >
          <Icon name="ph:envelope" class="size-5 ml-2" />
          ارسال پیام
        </BaseButton>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Distributor Info -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Main Info -->
        <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div class="flex items-start">
              <div class="bg-muted-200 dark:bg-muted-700 border-2 border-dashed border-muted-300 dark:border-muted-600 rounded-xl size-20 flex items-center justify-center mr-6">
                <Icon name="ph:truck" class="size-10 text-muted-400 dark:text-muted-500" />
              </div>
              <div>
                <BaseHeading tag="h2" size="2xl" weight="bold" class="text-muted-800 dark:text-white mb-2">
                  {{ distributor.companyName }}
                </BaseHeading>
                <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-400 mb-4">
                  {{ distributor.description }}
                </BaseParagraph>
                <div class="flex flex-wrap gap-3">
                  <BaseTag color="primary" variant="solid" size="lg">
                    <Icon name="ph:star" class="size-4 ml-2" />
                    {{ distributor.rating }} امتیاز
                  </BaseTag>
                  <BaseTag color="success" variant="solid" size="lg">
                    <Icon name="ph:check-circle" class="size-4 ml-2" />
                    تأیید شده
                  </BaseTag>
                  <BaseTag color="info" variant="solid" size="lg">
                    <Icon name="ph:calendar-plus" class="size-4 ml-2" />
                    عضو از {{ formatDate(distributor.memberSince) }}
                  </BaseTag>
                </div>
              </div>
            </div>
            
            <div class="flex flex-col items-end">
              <div class="mb-4">
                <div v-if="connectionStatus === 'connected'" class="bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200 px-4 py-2 rounded-full text-base font-medium">
                  متصل شده
                </div>
                <div v-else-if="connectionStatus === 'pending'" class="bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200 px-4 py-2 rounded-full text-base font-medium">
                  در انتظار تأیید
                </div>
                <div v-else class="bg-muted-100 dark:bg-muted-800 text-muted-800 dark:text-muted-200 px-4 py-2 rounded-full text-base font-medium">
                  متصل نشده
                </div>
              </div>
              <div class="flex flex-wrap gap-3">
                <BaseButton
                  v-if="connectionStatus === 'not_connected'"
                  @click="requestConnection"
                  variant="solid"
                  color="primary"
                  size="md"
                  rounded="lg"
                >
                  <Icon name="ph:link" class="size-5 ml-2" />\n                  درخواست اتصال
                </BaseButton>
                <BaseButton
                  v-else-if="connectionStatus === 'connected'"
                  @click="disconnect"
                  variant="outline"
                  color="danger"
                  size="md"
                  rounded="lg"
                >
                  <Icon name="ph:link-break" class="size-5 ml-2" />
                  قطع اتصال
                </BaseButton>
                <BaseButton
                  v-else
                  disabled
                  variant="outline"
                  color="primary"
                  size="md"
                  rounded="lg"
                >
                  <Icon name="ph:clock" class="size-5 ml-2" />
                  در انتظار تأیید
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Contact Info -->
        <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            اطلاعات تماس
          </BaseHeading>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <BaseHeading tag="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white mb-4">
                اطلاعات تماس
              </BaseHeading>
              <div class="space-y-5">
                <div class="flex items-start">
                  <Icon name="ph:user" class="size-6 text-muted-400 dark:text-muted-500 ml-4 mt-1" />
                  <div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                      نماینده
                    </BaseParagraph>
                    <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ distributor.representative }}
                    </BaseParagraph>
                  </div>
                </div>
                <div class="flex items-start">
                  <Icon name="ph:phone" class="size-6 text-muted-400 dark:text-muted-500 ml-4 mt-1" />
                  <div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                      تلفن
                    </BaseParagraph>
                    <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ distributor.phone }}
                    </BaseParagraph>
                  </div>
                </div>
                <div class="flex items-start">
                  <Icon name="ph:cellphone" class="size-6 text-muted-400 dark:text-muted-500 ml-4 mt-1" />
                  <div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                      موبایل
                    </BaseParagraph>
                    <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ distributor.mobile }}
                    </BaseParagraph>
                  </div>
                </div>
                <div class="flex items-start">
                  <Icon name="ph:envelope" class="size-6 text-muted-400 dark:text-muted-500 ml-4 mt-1" />
                  <div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                      ایمیل
                    </BaseParagraph>
                    <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ distributor.email }}
                    </BaseParagraph>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <BaseHeading tag="h3" size="lg" weight="medium" class="text-muted-800 dark:text-white mb-4">
                آدرس و خدمات
              </BaseHeading>
              <div class="space-y-5">
                <div class="flex items-start">
                  <Icon name="ph:map-pin" class="size-6 text-muted-400 dark:text-muted-500 ml-4 mt-1" />
                  <div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                      آدرس
                    </BaseParagraph>
                    <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ distributor.address }}
                    </BaseParagraph>
                    <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                      {{ distributor.city }}
                    </BaseParagraph>
                  </div>
                </div>
                <div class="flex items-start">
                  <Icon name="ph:map" class="size-6 text-muted-400 dark:text-muted-500 ml-4 mt-1" />
                  <div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-500 mb-1">
                      منطقه خدمات
                    </BaseParagraph>
                    <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ distributor.serviceArea }}
                    </BaseParagraph>
                    <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                      شعاع: {{ distributor.serviceRadius }}
                    </BaseParagraph>
                  </div>
                </div>
                <div class="flex items-start">
                  <Icon name="ph:clock" class="size-6 text-muted-400 dark:text-muted-500 ml-4 mt-1" />
                  <div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                      ساعات تحویل
                    </BaseParagraph>
                    <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                      {{ distributor.deliveryHours }}
                    </BaseParagraph>
                    <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                      روزهای کاری: {{ distributor.deliveryDays.join(', ') }}
                    </BaseParagraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Services and Certifications -->
        <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
                خدمات ارائه شده
              </BaseHeading>
              <div class="space-y-3">
                <div 
                  v-for="(service, index) in distributor.services" 
                  :key="index"
                  class="flex items-center"
                >
                  <Icon name="ph:check" class="size-5 text-success-500 ml-3" />
                  <BaseParagraph size="md" class="text-muted-700 dark:text-muted-300">
                    {{ service }}
                  </BaseParagraph>
                </div>
              </div>
            </div>
            <div>
              <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
                گواهی‌ها
              </BaseHeading>
              <div class="space-y-3">
                <div 
                  v-for="(cert, index) in distributor.certifications" 
                  :key="index"
                  class="flex items-center"
                >
                  <Icon name="ph:certificate" class="size-5 text-info-500 ml-3" />
                  <BaseParagraph size="md" class="text-muted-700 dark:text-muted-300">
                    {{ cert }}
                  </BaseParagraph>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Map -->
        <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            نقشه منطقه خدمات
          </BaseHeading>
          <div class="bg-muted-100 dark:bg-muted-800 border-2 border-dashed border-muted-200 dark:border-muted-700 rounded-xl w-full h-72 flex items-center justify-center">
            <div class="text-center">
              <Icon name="ph:map-pin" class="size-14 text-muted-400 dark:text-muted-500 mx-auto mb-3" />
              <BaseParagraph size="lg" class="text-muted-500 dark:text-muted-400">
                نقشه منطقه خدمات
              </BaseParagraph>
              <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
                منطقه خدمات: {{ distributor.serviceArea }}
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Performance Stats -->
        <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            آمار عملکرد
          </BaseHeading>
          <div class="space-y-5">
            <div>
              <div class="flex justify-between mb-2">
                <BaseParagraph size="md" weight="medium" class="text-muted-700 dark:text-muted-300">
                  تحویل به موقع
                </BaseParagraph>
                <BaseParagraph size="md" weight="medium" class="text-muted-700 dark:text-muted-300">
                  {{ performanceStats.onTimeDelivery }}%
                </BaseParagraph>
              </div>
              <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-3">
                <div 
                  class="bg-success-600 h-3 rounded-full" 
                  :style="{ width: performanceStats.onTimeDelivery + '%' }"
                ></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-2">
                <BaseParagraph size="md" weight="medium" class="text-muted-700 dark:text-muted-300">
                  رضایت مشتریان
                </BaseParagraph>
                <BaseParagraph size="md" weight="medium" class="text-muted-700 dark:text-muted-300">
                  {{ performanceStats.customerSatisfaction }}%
                </BaseParagraph>
              </div>
              <div class="w-full bg-muted-200 dark:bg-muted-700 rounded-full h-3">
                <div 
                  class="bg-info-600 h-3 rounded-full" 
                  :style="{ width: performanceStats.customerSatisfaction + '%' }"
                ></div>
              </div>
            </div>
            
            <div class="pt-5 border-t border-muted-200 dark:border-muted-700 space-y-4">
              <div class="flex justify-between">
                <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                  مجموع تحویل‌ها
                </BaseParagraph>
                <BaseParagraph size="md" weight="medium" class="text-muted-800 dark:text-white">
                  {{ distributor.totalDeliveries }}
                </BaseParagraph>
              </div>
              <div class="flex justify-between">
                <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                  زمان میانگین تحویل
                </BaseParagraph>
                <BaseParagraph size="md" weight="medium" class="text-muted-800 dark:text-white">
                  {{ performanceStats.averageDeliveryTime }}
                </BaseParagraph>
              </div>
              <div class="flex justify-between">
                <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                  نرخ بازگشت
                </BaseParagraph>
                <BaseParagraph size="md" weight="medium" class="text-muted-800 dark:text-white">
                  {{ performanceStats.returnRate }}
                </BaseParagraph>
              </div>
              <div class="flex justify-between">
                <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                  حداقل سفارش
                </BaseParagraph>
                <BaseParagraph size="md" weight="medium" class="text-muted-800 dark:text-white">
                  {{ formatCurrency(distributor.minimumOrder) }}
                </BaseParagraph>
              </div>
              <div class="flex justify-between">
                <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                  هزینه تحویل
                </BaseParagraph>
                <BaseParagraph size="md" weight="medium" class="text-muted-800 dark:text-white">
                  {{ formatCurrency(distributor.deliveryFee) }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Recent Orders -->
        <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            سفارشات اخیر
          </BaseHeading>
          <div class="space-y-4">
            <div 
              v-for="order in recentOrders" 
              :key="order.id"
              class="flex justify-between items-center pb-4 border-b border-muted-200 dark:border-muted-700 last:border-0 last:pb-0"
            >
              <div>
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                  #{{ order.id }}
                </BaseParagraph>
                <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400">
                  {{ order.product }}
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                  {{ formatDate(order.date) }}
                </BaseParagraph>
              </div>
              <div class="text-right">
                <BaseParagraph size="md" weight="medium" class="text-muted-800 dark:text-white mb-2">
                  {{ order.quantity }}
                </BaseParagraph>
                <BaseTag 
                  :color="order.status === 'delivered' ? 'success' : 'warning'" 
                  variant="solid" 
                  size="md"
                >
                  {{ order.status === 'delivered' ? 'تحویل داده شده' : order.status }}
                </BaseTag>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Reviews -->
        <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
          <BaseHeading tag="h2" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            نظرات کاربران
          </BaseHeading>
          <div class="space-y-5">
            <div 
              v-for="review in reviews" 
              :key="review.id"
              class="border-b border-muted-200 dark:border-muted-700 pb-5 last:border-0 last:pb-0"
            >
              <div class="flex justify-between mb-2">
                <BaseParagraph size="lg" weight="medium" class="text-muted-800 dark:text-white">
                  {{ review.user }}
                </BaseParagraph>
                <div class="flex">
                  <Icon 
                    v-for="i in 5" 
                    :key="i"
                    name="ph:star" 
                    class="size-5"
                    :class="i <= review.rating ? 'text-warning-400' : 'text-muted-300'"
                  />
                </div>
              </div>
              <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mb-2">
                {{ review.comment }}
              </BaseParagraph>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                {{ formatDate(review.date) }}
              </BaseParagraph>
            </div>
          </div>
          <div class="mt-6 pt-6 border-t border-muted-200 dark:border-muted-700">
            <BaseButton variant="ghost" color="primary" class="w-full" size="lg">
              مشاهده همه نظرات
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>