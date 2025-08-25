<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">هماهنگی با ارائه‌دهندگان</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">مدیریت دریافت و تحویل بارها</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
            <Icon name="ph:handshake-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">مجموع همکاری‌ها</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">20</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3 ml-4">
            <Icon name="ph:package-duotone" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">بارهای فعال</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">5</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-3 ml-4">
            <Icon name="ph:clock-duotone" class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">در انتظار تحویل</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">3</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-green-100 dark:bg-green-900/30 p-3 ml-4">
            <Icon name="ph:truck-duotone" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">تحویل شده</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">12</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center">
          <div class="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3 ml-4">
            <Icon name="ph:calendar-duotone" class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">زمان‌بندی‌های امروز</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">2</p>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Assigned Loads Section -->
      <div class="lg:col-span-2">
        <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700 mb-8">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">بارهای اختصاص یافته</h2>
              <div class="flex gap-2">
                <TairoInput
                  placeholder="جستجو در بارها..."
                  icon="ph:magnifying-glass-duotone"
                  rounded="lg"
                  class="w-full md:w-64"
                />
                <TairoButton 
                  variant="outline" 
                  color="secondary" 
                  rounded="lg"
                  @click="refreshLoads"
                >
                  <Icon name="ph:arrows-clockwise-duotone" class="h-4 w-4" />
                </TairoButton>
              </div>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-muted-800">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">شناسه بار</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">محصول</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">مقدار کل</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">اختصاص‌یافته</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاریخ تحویل</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">عملیات</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-muted-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr 
                  v-for="load in assignedLoads" 
                  :key="load.loadId"
                  class="hover:bg-gray-50 dark:hover:bg-muted-800 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ load.loadId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ load.productName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('fa-IR').format(load.totalQuantity) }} کیلوگرم
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('fa-IR').format(load.assignedQuantity) }} کیلوگرم
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ load.expectedDeliveryDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <TairoButton 
                      @click="schedulePickup(load.loadId)" 
                      variant="solid" 
                      color="primary" 
                      size="sm"
                      rounded="lg"
                    >
                      <Icon name="ph:calendar-plus-duotone" class="h-4 w-4 ml-1" />
                      زمان‌بندی
                    </TairoButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="assignedLoads.length === 0" class="text-center py-12">
            <Icon name="ph:package-duotone" class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">باری یافت نشد</h3>
            <p class="text-gray-600 dark:text-gray-400">در حال حاضر باری برای شما اختصاص داده نشده است</p>
          </div>
          
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              نمایش {{ assignedLoads.length }} بار
            </div>
            <div class="flex gap-2">
              <TairoButton variant="outline" color="primary" size="sm" rounded="lg" disabled>
                <Icon name="ph:caret-left-duotone" class="h-4 w-4 ml-1" />
                قبلی
              </TairoButton>
              <TairoButton variant="outline" color="primary" size="sm" rounded="lg" disabled>
                بعدی
                <Icon name="ph:caret-right-duotone" class="h-4 w-4 mr-1" />
              </TairoButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Coordination Guide -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">راهنمای هماهنگی</h2>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="mt-1 flex-shrink-0">
                  <div class="rounded-full bg-primary-100 dark:bg-primary-900/30 p-2">
                    <Icon name="ph:number-circle-one-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">دریافت اعلان بار جدید</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">هنگامی که بار جدیدی برای شما اختصاص داده شود، اعلان دریافت خواهید کرد</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="mt-1 flex-shrink-0">
                  <div class="rounded-full bg-primary-100 dark:bg-primary-900/30 p-2">
                    <Icon name="ph:number-circle-two-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">زمان‌بندی دریافت</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">برای دریافت بار، زمان مناسبی را با ارائه‌دهنده هماهنگ کنید</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="mt-1 flex-shrink-0">
                  <div class="rounded-full bg-primary-100 dark:bg-primary-900/30 p-2">
                    <Icon name="ph:number-circle-three-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">تحویل و گزارش</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">پس از دریافت، وضعیت تحویل را در سیستم ثبت کنید</p>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      
      <!-- Calendar and Quick Actions -->
      <div class="space-y-8">
        <!-- Calendar Section -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">تقویم زمان‌بندی</h2>
            <div class="h-80 bg-gray-50 dark:bg-muted-800 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <Icon name="ph:calendar-blank-duotone" class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p class="text-gray-600 dark:text-gray-400">تقویم تعاملی</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">برای انتخاب تاریخ کلیک کنید</p>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-muted-800 rounded-lg cursor-pointer">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span class="text-sm text-gray-900 dark:text-white">دریافت سیب زمینی</span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">1403/05/25</span>
              </div>
              <div class="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-muted-800 rounded-lg cursor-pointer">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  <span class="text-sm text-gray-900 dark:text-white">تحویل گوجه فرنگی</span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">1403/05/26</span>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Quick Actions -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">عملیات سریع</h2>
            <div class="space-y-3">
              <TairoButton 
                variant="solid" 
                color="primary" 
                class="w-full"
                rounded="lg"
                @click="requestNewLoad"
              >
                <Icon name="ph:package-duotone" class="h-5 w-5 ml-2" />
                درخواست بار جدید
              </TairoButton>
              <TairoButton 
                variant="outline" 
                color="primary" 
                class="w-full"
                rounded="lg"
                @click="viewProviderList"
              >
                <Icon name="ph:users-duotone" class="h-5 w-5 ml-2" />
                لیست ارائه‌دهندگان
              </TairoButton>
              <TairoButton 
                variant="outline" 
                color="secondary" 
                class="w-full"
                rounded="lg"
                @click="viewDeliveryHistory"
              >
                <Icon name="ph:truck-duotone" class="h-5 w-5 ml-2" />
                تاریخچه تحویل‌ها
              </TairoButton>
            </div>
          </div>
        </BaseCard>
        
        <!-- Important Notes -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">نکات مهم</h2>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <Icon name="ph:warning-duotone" class="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  حتماً قبل از دریافت بار، وضعیت کالا را بررسی کنید
                </p>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:info-duotone" class="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  در صورت بروز مشکل در زمان‌بندی، با پشتیبانی تماس بگیرید
                </p>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="ph:clock-duotone" class="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  حداکثر 24 ساعت قبل از تاریخ تحویل، زمان‌بندی خود را ثبت کنید
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'هماهنگی با ارائه‌دهندگان',
  icon: 'mdi:handshake',
  layout: 'distributor'
})

useHead({
  title: 'هماهنگی با ارائه‌دهندگان - با هم',
  meta: [
    { name: 'description', content: 'هماهنگی توزیع‌کننده با ارائه‌دهندگان در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

// Mock data for assigned loads
const assignedLoads = ref([
  {
    loadId: 'LOAD-001',
    productName: 'سیب زمینی مرغوب',
    totalQuantity: 1000,
    assignedQuantity: 450,
    expectedDeliveryDate: '1403/05/25'
  },
  {
    loadId: 'LOAD-002',
    productName: 'پیاز زرد',
    totalQuantity: 800,
    assignedQuantity: 300,
    expectedDeliveryDate: '1403/05/26'
  },
  {
    loadId: 'LOAD-003',
    productName: 'گوجه فرنگی',
    totalQuantity: 500,
    assignedQuantity: 200,
    expectedDeliveryDate: '1403/05/27'
  },
  {
    loadId: 'LOAD-004',
    productName: 'هویج',
    totalQuantity: 1200,
    assignedQuantity: 600,
    expectedDeliveryDate: '1403/05/28'
  },
  {
    loadId: 'LOAD-005',
    productName: 'سیر خشک',
    totalQuantity: 600,
    assignedQuantity: 150,
    expectedDeliveryDate: '1403/05/29'
  }
])

const schedulePickup = (loadId: string) => {
  console.log(`زمان‌بندی دریافت برای بار ${loadId} باز شد`)
  // Implementation for scheduling pickup
}

const refreshLoads = () => {
  console.log('بارها مجدداً بارگذاری شدند')
  // Implementation for refreshing loads
}

const requestNewLoad = () => {
  console.log('درخواست بار جدید باز شد')
  // Implementation for requesting new load
}

const viewProviderList = () => {
  console.log('لیست ارائه‌دهندگان باز شد')
  // Implementation for viewing provider list
}

const viewDeliveryHistory = () => {
  console.log('تاریخچه تحویل‌ها باز شد')
  // Implementation for viewing delivery history
}
</script>