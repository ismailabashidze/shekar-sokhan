<template>
  <div class="distributor-settings">
    <BaseCard class="mb-6">
      <template #header>
        <h1 class="text-xl font-bold">تنظیمات سیستم</h1>
      </template>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold">تنظیمات اعلان‌ها</h2>
          </template>
          
          <div class="space-y-4">
            <TairoSwitch 
              v-for="notification in notificationSettings" 
              :key="notification.id"
              v-model="notification.enabled"
              :label="notification.title"
            >
              <p class="text-sm text-gray-500 mt-1">{{ notification.description }}</p>
            </TairoSwitch>
          </div>
        </BaseCard>
        
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold">تنظیمات حساب کاربری</h2>
          </template>
          
          <div class="space-y-4">
            <TairoInput 
              v-model="accountSettings.phone" 
              label="شماره تلفن"
              type="tel"
            />
            
            <TairoInput 
              v-model="accountSettings.email" 
              label="ایمیل"
              type="email"
            />
            
            <TairoButton 
              @click="changePassword" 
              variant="outline" 
              color="primary"
              class="w-full"
            >
              درخواست تغییر رمز عبور
            </TairoButton>
            
            <TairoButton 
              @click="saveAccountSettings" 
              variant="solid" 
              color="primary"
              class="w-full"
            >
              ذخیره تنظیمات حساب
            </TairoButton>
          </div>
        </BaseCard>
      </div>
    </BaseCard>
    
    <BaseCard class="border border-red-200">
      <template #header>
        <h2 class="text-lg font-semibold text-red-600">ناحیه خطر</h2>
      </template>
      
      <div class="space-y-4">
        <div>
          <h3 class="font-medium mb-2">حذف حساب کاربری</h3>
          <p class="text-gray-600 text-sm mb-3">با حذف حساب کاربری، تمام اطلاعات شما از سیستم حذف خواهد شد. این عمل قابل بازگشت نیست.</p>
          <TairoButton 
            @click="deleteAccount" 
            variant="solid" 
            color="danger"
          >
            حذف حساب کاربری
          </TairoButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import type { NotificationSetting, AccountSettings } from './types'

definePageMeta({
  title: 'تنظیمات سیستم',
  icon: 'mdi:cog',
  layout: 'distributor'
})

useHead({
  title: 'تنظیمات سیستم - با هم',
  meta: [
    { name: 'description', content: 'تنظیمات سیستم توزیع‌کننده در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

// Mock data for notification settings
const notificationSettings = ref<NotificationSetting[]>([
  {
    id: 'new_order',
    title: 'سفارش جدید',
    description: 'دریافت اعلان هنگام ثبت سفارش جدید',
    enabled: true
  },
  {
    id: 'order_status_change',
    title: 'تغییر وضعیت سفارش',
    description: 'دریافت اعلان هنگام تغییر وضعیت سفارش',
    enabled: true
  },
  {
    id: 'load_assignment',
    title: 'تخصیص بار جدید',
    description: 'دریافت اعلان هنگام تخصیص بار جدید',
    enabled: true
  },
  {
    id: 'settlement',
    title: 'تسویه حساب',
    description: 'دریافت اعلان هنگام انجام تسویه حساب',
    enabled: true
  },
  {
    id: 'support_ticket',
    title: 'تیکت پشتیبانی',
    description: 'دریافت اعلان هنگام ثبت یا پاسخ به تیکت',
    enabled: true
  }
])

// Mock data for account settings
const accountSettings = ref<AccountSettings>({
  phone: '09123456789',
  email: 'distributor@example.com'
})

const saveAccountSettings = () => {
  alert('تنظیمات حساب کاربری ذخیره شد')
  // In a real app, we would send the data to the backend
}

const changePassword = () => {
  alert('لینک تغییر رمز عبور به ایمیل شما ارسال شد')
}

const deleteAccount = () => {
  if (confirm('آیا از حذف حساب کاربری خود اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
    alert('درخواست حذف حساب کاربری ثبت شد. پس از تأیید ادمین، حساب شما حذف خواهد شد.')
  }
}
</script>