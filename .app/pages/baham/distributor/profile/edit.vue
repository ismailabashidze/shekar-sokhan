<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">ویرایش پروفایل کسب‌وکار</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">اطلاعات کسب‌وکار خود را به‌روز کنید</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
            <Icon name="ph:briefcase-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>
    </div>
    
    <form @submit.prevent="saveProfile">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Basic Info -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Business Information Card -->
          <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="ph:buildings-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                اطلاعات کسب‌وکار
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TairoInput 
                  v-model="profileForm.companyName" 
                  label="نام شرکت"
                  placeholder="نام شرکت یا کسب‌وکار خود را وارد کنید"
                  required
                  rounded="lg"
                />
                
                <TairoInput 
                  v-model="profileForm.licenseNumber" 
                  label="شماره پروانه کسب"
                  placeholder="شماره پروانه کسب خود را وارد کنید"
                  required
                  rounded="lg"
                />
                
                <TairoInput 
                  v-model="profileForm.capacity" 
                  label="ظرفیت حمل (کیلوگرم)"
                  type="number"
                  placeholder="ظرفیت حمل روزانه خود را وارد کنید"
                  required
                  rounded="lg"
                />
                
                <TairoInput 
                  v-model="profileForm.serviceArea" 
                  label="منطقه خدماتی"
                  placeholder="مناطقی که خدمات ارائه می‌دهید"
                  required
                  rounded="lg"
                />
                
                <TairoSelect
                  v-model="profileForm.vehicleType"
                  label="نوع وسیله نقلیه"
                  :options="vehicleTypes"
                  rounded="lg"
                  class="md:col-span-2"
                />
                
                <TairoInput 
                  v-model="profileForm.yearsOfExperience" 
                  label="سابقه کار (سال)"
                  type="number"
                  placeholder="سابقه کار خود را به سال وارد کنید"
                  rounded="lg"
                />
              </div>
            </div>
          </BaseCard>
          
          <!-- Description Card -->
          <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="ph:note-pencil-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                توضیحات
              </h2>
            </div>
            
            <div class="p-6">
              <TairoTextarea 
                v-model="profileForm.description" 
                label="توضیحات"
                placeholder="توضیحاتی درباره خدمات و ویژگی‌های شرکت شما"
                :rows="5"
                rounded="lg"
              />
            </div>
          </BaseCard>
          
          <!-- Services Card -->
          <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="ph:toolbox-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                خدمات ارائه شده
              </h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <TairoCheckbox 
                  v-for="service in allServices" 
                  :key="service"
                  v-model="profileForm.services"
                  :value="service"
                  rounded="lg"
                >
                  {{ service }}
                </TairoCheckbox>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <TairoInput 
                  v-model="newService" 
                  placeholder="نام خدمت جدید"
                  class="flex-grow"
                  rounded="lg"
                />
                <TairoButton 
                  @click="addService" 
                  variant="solid" 
                  color="primary"
                  rounded="lg"
                >
                  <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
                  افزودن
                </TairoButton>
              </div>
            </div>
          </BaseCard>
        </div>
        
        <!-- Right Column - Profile Image and Contact -->
        <div class="space-y-8">
          <!-- Logo Card -->
          <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="ph:image-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                لوگو شرکت
              </h2>
            </div>
            
            <div class="p-6">
              <div class="flex flex-col items-center">
                <div class="bg-gray-100 dark:bg-muted-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-32 h-32 flex items-center justify-center mb-4">
                  <Icon v-if="!profileForm.logoUrl" name="ph:camera-duotone" class="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <img v-else :src="profileForm.logoUrl" alt="لوگو شرکت" class="w-full h-full object-cover rounded-xl" />
                </div>
                <TairoButton 
                  variant="outline" 
                  color="primary" 
                  rounded="lg"
                  class="w-full"
                  @click="uploadLogo"
                >
                  <Icon name="ph:upload-duotone" class="h-4 w-4 ml-2" />
                  آپلود لوگو جدید
                </TairoButton>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  فرمت‌های پشتیبانی شده: JPG, PNG<br>
                  حداکثر حجم: 2MB
                </p>
              </div>
            </div>
          </BaseCard>
          
          <!-- Contact Information Card -->
          <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="ph:address-book-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                اطلاعات تماس
              </h2>
            </div>
            
            <div class="p-6 space-y-4">
              <TairoInput 
                v-model="profileForm.contact.phone" 
                label="شماره تماس"
                placeholder="شماره تماس اصلی شرکت"
                rounded="lg"
              />
              
              <TairoInput 
                v-model="profileForm.contact.email" 
                label="ایمیل"
                type="email"
                placeholder="آدرس ایمیل شرکت"
                rounded="lg"
              />
              
              <TairoInput 
                v-model="profileForm.contact.address" 
                label="آدرس"
                placeholder="آدرس دفتر یا انبار اصلی"
                rounded="lg"
              />
              
              <TairoInput 
                v-model="profileForm.contact.website" 
                label="وب‌سایت"
                placeholder="آدرس وب‌سایت شرکت"
                rounded="lg"
              />
            </div>
          </BaseCard>
          
          <!-- Performance Metrics Card -->
          <BaseCard rounded="lg" class="dark:!bg-muted-900 border border-gray-200 dark:border-gray-700">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="ph:chart-bar-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                عملکرد
              </h2>
            </div>
            
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">امتیاز</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ profileForm.rating }}/5</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-yellow-500 h-2 rounded-full" 
                      :style="{ width: `${(profileForm.rating / 5) * 100}%` }"
                    ></div>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p class="text-xs text-gray-600 dark:text-gray-400">تعداد نظرات</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ profileForm.reviews }}</p>
                  </div>
                  
                  <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p class="text-xs text-gray-600 dark:text-gray-400">سفارشات موفق</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <NuxtLink to="/baham/distributor/profile">
          <TairoButton variant="outline" color="secondary" rounded="lg">
            <Icon name="ph:arrow-left-duotone" class="h-4 w-4 ml-2" />
            بازگشت به پروفایل
          </TairoButton>
        </NuxtLink>
        <div class="flex flex-col sm:flex-row gap-3">
          <TairoButton 
            @click="cancelEdit" 
            variant="outline" 
            color="secondary"
            rounded="lg"
          >
            انصراف
          </TairoButton>
          <TairoButton 
            type="submit"
            variant="solid" 
            color="primary"
            rounded="lg"
          >
            <Icon name="ph:floppy-disk-duotone" class="h-4 w-4 ml-2" />
            ذخیره تغییرات
          </TairoButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'ویرایش پروفایل کسب‌وکار',
  icon: 'mdi:account-edit',
  layout: 'distributor'
})

useHead({
  title: 'ویرایش پروفایل کسب‌وکار - با هم',
  meta: [
    { name: 'description', content: 'ویرایش پروفایل کسب‌وکار توزیع‌کننده در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

// Mock data for the form
const profileForm = ref({
  companyName: 'توزیع‌کننده البرز',
  description: 'توزیع کالاهای کشاورزی در مناطق شمالی و ش-eastی تهران با کامیون‌های م refrigerated',
  licenseNumber: '123456789',
  capacity: 2500,
  serviceArea: 'منطقه شمالی و ش-eastی تهران',
  rating: 4.8,
  reviews: 42,
  logoUrl: '',
  vehicleType: 'کامیون سردخانه‌دار',
  yearsOfExperience: 5,
  services: ['حمل و نقل سرد', 'تحویل درب به درب', 'بسته‌بندی حرفه‌ای', 'تحویل 24 ساعته'],
  contact: {
    phone: '021-12345678',
    email: 'info@alborzdistribution.com',
    address: 'تهران، خیابان ولیعصر، پلاک 1234',
    website: 'www.alborzdistribution.com'
  }
})

const allServices = [
  'حمل و نقل سرد',
  'تحویل درب به درب',
  'بسته‌بندی حرفه‌ای',
  'تحویل 24 ساعته',
  'حمل حجمی',
  'تحویل در تعطیلات',
  'بیمه کالا',
  'خدمات بعد از فروش'
]

const vehicleTypes = [
  { label: 'انتخاب کنید', value: '' },
  { label: 'وانت', value: 'van' },
  { label: 'کامیون سردخانه‌دار', value: 'refrigerated_truck' },
  { label: 'کامیون معمولی', value: 'regular_truck' },
  { label: 'کامیونت', value: 'pickup_truck' },
  { label: 'تریلر', value: 'trailer' }
]

const newService = ref('')

const addService = () => {
  if (newService.value && !profileForm.value.services.includes(newService.value)) {
    profileForm.value.services.push(newService.value)
    newService.value = ''
  }
}

const uploadLogo = () => {
  console.log('Upload logo clicked')
  // Implementation for uploading logo
}

const saveProfile = () => {
  console.log('Saving profile:', profileForm.value)
  // Show success message
  const toast = useToaster()
  toast.show({
    title: 'پروفایل به‌روز شد',
    message: 'اطلاعات پروفایل کسب‌وکار شما با موفقیت به‌روزرسانی شد.',
    color: 'success',
    icon: 'ph:check-circle-duotone',
    closable: true,
  })
  
  // In a real app, we would send the data to the backend
}

const cancelEdit = () => {
  const toast = useToaster()
  toast.show({
    title: 'عملیات لغو شد',
    message: 'تغییرات شما لغو شد و اطلاعات قبلی حفظ شد.',
    color: 'warning',
    icon: 'ph:x-circle-duotone',
    closable: true,
  })
  
  // In a real app, we would reset the form to original values
}
</script>