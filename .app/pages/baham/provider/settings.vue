<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'تنظیمات کسب‌وکار',
  layout: 'sidebar',
})

useHead({
  title: 'تنظیمات کسب‌وکار | با هم',
  htmlAttrs: { dir: 'rtl' },
})

// Mock data for provider profile
const providerProfile = ref({
  companyName: 'شرکت کشاورزی سبزپویان',
  licenseNumber: '123456789',
  description: 'تولیدکننده محصولات عضوی با کیفیت بالا',
  address: 'تهران، خیابان ولیعصر، کوچه گلستان، پلاک 45',
  phone: '021-12345678',
  mobile: '09123456789',
  email: 'info@sabzpooyan.com',
  website: 'www.sabzpooyan.com',
  productionCapacity: '5 تن در روز'
})

const businessHours = ref({
  saturday: { open: '08:00', close: '18:00' },
  sunday: { open: '08:00', close: '18:00' },
  monday: { open: '08:00', close: '18:00' },
  tuesday: { open: '08:00', close: '18:00' },
  wednesday: { open: '08:00', close: '18:00' },
  thursday: { open: '08:00', close: '14:00' },
  friday: { open: 'بسته', close: 'بسته' }
})

const serviceAreas = ref([
  { id: 1, city: 'تهران', regions: ['منطقه 1', 'منطقه 2', 'منطقه 3'] },
  { id: 2, city: 'کرج', regions: ['مرکزی', 'محمدشهر'] }
])

const notifications = ref({
  orderRequests: true,
  paymentConfirmations: true,
  settlementStatus: true,
  platformUpdates: false
})

const saveProfile = () => {
  // In a real app, this would send data to the server
  console.log('Profile saved:', providerProfile.value)
  
  // Show success message
  const toaster = useToaster()
  toaster.show({
    title: 'موفقیت',
    message: 'تغییرات با موفقیت ذخیره شد',
    color: 'success',
    icon: 'ph:check-circle',
    closable: true,
  })
}

const addServiceArea = () => {
  serviceAreas.value.push({ id: serviceAreas.value.length + 1, city: '', regions: [] })
}

const removeServiceArea = (id) => {
  serviceAreas.value = serviceAreas.value.filter(area => area.id !== id)
}

// Day names mapping
const dayNames = {
  saturday: 'شنبه',
  sunday: 'یکشنبه',
  monday: 'دوشنبه',
  tuesday: 'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday: 'پنجشنبه',
  friday: 'جمعه'
} as const
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          تنظیمات کسب‌وکار
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          مدیریت اطلاعات کسب‌وکار و تنظیمات حساب
        </BaseText>
      </template>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Information -->
        <div class="lg:col-span-2">
          <TairoFormGroup>
            <template #label>
              <BaseHeading as="h2" size="lg" weight="medium">
                اطلاعات کسب‌وکار
              </BaseHeading>
              <BaseText size="sm" class="text-muted-400 mt-1">
                اطلاعات عمومی کسب‌وکار شما
              </BaseText>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="providerProfile.companyName"
                label="نام شرکت"
                placeholder="نام شرکت یا کسب‌وکار"
                icon="ph:office"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
              
              <BaseInput
                v-model="providerProfile.licenseNumber"
                label="شماره پروانه کسب"
                placeholder="شماره پروانه کسب"
                icon="ph:identification-card"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
              
              <div class="md:col-span-2">
                <BaseTextarea
                  v-model="providerProfile.description"
                  label="توضیحات"
                  placeholder="توضیحات درباره کسب‌وکار شما"
                  rows="3"
                  :classes="{
                    wrapper: 'w-full'
                  }"
                />
              </div>
              
              <BaseInput
                v-model="providerProfile.address"
                label="آدرس"
                placeholder="آدرس کسب‌وکار"
                icon="ph:map-pin"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
              
              <BaseInput
                v-model="providerProfile.productionCapacity"
                label="ظرفیت تولید روزانه"
                placeholder="مثال: 5 تن در روز"
                icon="ph:factory"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
              
              <BaseInput
                v-model="providerProfile.phone"
                label="تلفن ثابت"
                placeholder="021-12345678"
                icon="ph:phone"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
              
              <BaseInput
                v-model="providerProfile.mobile"
                label="تلفن همراه"
                placeholder="09123456789"
                icon="ph:cellphone"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
              
              <BaseInput
                v-model="providerProfile.email"
                label="ایمیل"
                type="email"
                placeholder="info@example.com"
                icon="ph:envelope"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
              
              <BaseInput
                v-model="providerProfile.website"
                label="وب‌سایت"
                placeholder="www.example.com"
                icon="ph:globe"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </div>
          </TairoFormGroup>
          
          <!-- Service Areas -->
          <TairoFormGroup>
            <template #label>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <BaseHeading as="h2" size="lg" weight="medium">
                    مناطق خدمات‌رسانی
                  </BaseHeading>
                  <BaseText size="sm" class="text-muted-400 mt-1">
                    مناطقی که خدمات‌رسانی می‌کنید
                  </BaseText>
                </div>
                <BaseButton 
                  @click="addServiceArea"
                  color="primary" 
                  variant="solid" 
                  size="sm"
                >
                  <Icon name="ph:plus" class="size-4" />
                  <span>افزودن منطقه</span>
                </BaseButton>
              </div>
            </template>
            
            <div v-for="area in serviceAreas" :key="area.id" class="border border-muted-200 dark:border-muted-700 rounded-lg p-4 mb-4">
              <div class="flex justify-between items-center mb-3">
                <BaseHeading as="h3" size="sm" weight="medium">
                  منطقه خدمات‌رسانی {{ area.id }}
                </BaseHeading>
                <BaseButton 
                  @click="removeServiceArea(area.id)"
                  color="danger" 
                  variant="pastel" 
                  size="sm"
                  :disabled="serviceAreas.length <= 1"
                >
                  <Icon name="ph:trash" class="size-4" />
                </BaseButton>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="area.city"
                  label="شهر"
                  placeholder="نام شهر"
                  icon="ph:buildings"
                  :classes="{
                    wrapper: 'w-full'
                  }"
                />
                
                <BaseInput
                  v-model="area.regions"
                  label="مناطق"
                  placeholder="مثال: منطقه 1, منطقه 2"
                  icon="ph:map-trifold"
                  :classes="{
                    wrapper: 'w-full'
                  }"
                />
              </div>
            </div>
          </TairoFormGroup>
          
          <!-- Business Hours -->
          <TairoFormGroup>
            <template #label>
              <BaseHeading as="h2" size="lg" weight="medium">
                ساعات کاری
              </BaseHeading>
              <BaseText size="sm" class="text-muted-400 mt-1">
                ساعات کاری کسب‌وکار شما
              </BaseText>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="(hours, day) in businessHours" 
                :key="day" 
                class="flex items-center justify-between py-3 border-b border-muted-200 dark:border-muted-700"
              >
                <BaseText size="sm" weight="medium">
                  {{ dayNames[day] }}
                </BaseText>
                <div class="flex items-center gap-2">
                  <BaseTag 
                    v-if="hours.open === 'بسته'" 
                    color="danger" 
                    variant="pastel" 
                    rounded="full" 
                    size="sm"
                  >
                    بسته
                  </BaseTag>
                  <div v-else class="flex items-center gap-1">
                    <BaseText size="sm">{{ hours.open }}</BaseText>
                    <BaseText size="sm" class="text-muted-400">-</BaseText>
                    <BaseText size="sm">{{ hours.close }}</BaseText>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <BaseButton color="primary" variant="pastel">
                <Icon name="ph:pencil-simple" class="size-4" />
                <span>ویرایش ساعات کاری</span>
              </BaseButton>
            </div>
          </TairoFormGroup>
        </div>
        
        <!-- Sidebar -->
        <div>
          <!-- Notifications -->
          <BaseCard rounded="sm" class="p-6 mb-6">
            <BaseHeading as="h2" size="lg" weight="medium" class="mb-4">
              تنظیمات اعلان‌ها
            </BaseHeading>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <BaseText size="sm" weight="medium">
                  درخواست‌های سفارش
                </BaseText>
                <BaseSwitchThin
                  v-model="notifications.orderRequests"
                  color="primary"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <BaseText size="sm" weight="medium">
                  تأییدیه‌های پرداخت
                </BaseText>
                <BaseSwitchThin
                  v-model="notifications.paymentConfirmations"
                  color="primary"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <BaseText size="sm" weight="medium">
                  وضعیت تسویه‌حساب
                </BaseText>
                <BaseSwitchThin
                  v-model="notifications.settlementStatus"
                  color="primary"
                />
              </div>
              
              <div class="flex items-center justify-between">
                <BaseText size="sm" weight="medium">
                  به‌روزرسانی‌های پلتفرم
                </BaseText>
                <BaseSwitchThin
                  v-model="notifications.platformUpdates"
                  color="primary"
                />
              </div>
            </div>
          </BaseCard>
          
          <!-- Account Settings -->
          <BaseCard rounded="sm" class="p-6">
            <BaseHeading as="h2" size="lg" weight="medium" class="mb-4">
              تنظیمات حساب
            </BaseHeading>
            
            <div class="space-y-3">
              <BaseButton 
                color="muted" 
                variant="pastel" 
                class="w-full justify-start"
              >
                <Icon name="ph:lock" class="size-4" />
                <span>تغییر رمز عبور</span>
              </BaseButton>
              
              <BaseButton 
                color="muted" 
                variant="pastel" 
                class="w-full justify-start"
              >
                <Icon name="ph:shield" class="size-4" />
                <span>تنظیمات امنیتی</span>
              </BaseButton>
              
              <BaseButton 
                color="danger" 
                variant="pastel" 
                class="w-full justify-start"
              >
                <Icon name="ph:trash" class="size-4" />
                <span>حذف حساب کاربری</span>
              </BaseButton>
            </div>
          </BaseCard>
          
          <!-- Save Button -->
          <div class="mt-6">
            <BaseButton 
              @click="saveProfile"
              color="primary" 
              variant="solid" 
              class="w-full"
            >
              <Icon name="ph:floppy-disk" class="size-4" />
              <span>ذخیره تغییرات</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>