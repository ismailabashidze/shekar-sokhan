<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'پروفایل و تنظیمات - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'پروفایل و تنظیمات - با هم',
  meta: [
    { name: 'description', content: 'مدیریت اطلاعات پروفایل و تنظیمات حساب کاربری' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// User profile data
const userProfile = ref({
  firstName: 'علی',
  lastName: 'محمدی',
  email: 'ali.mohammadi@example.com',
  phone: '09123456789'
})

// Toast for notifications
const toast = useToaster()

// Update profile function
const updateProfile = () => {
  // In a real app, this would send data to the server
  console.log('Updating profile:', userProfile.value)
  toast.success('پروفایل با موفقیت به‌روزرسانی شد')
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:user-circle-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">پروفایل و تنظیمات</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">مدیریت اطلاعات پروفایل و تنظیمات حساب کاربری</p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Settings -->
      <div class="lg:col-span-2">
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:user-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              اطلاعات شخصی
            </h2>
          </div>
          <div class="p-6">
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <BaseLabel for="firstName" class="mb-2">نام *</BaseLabel>
                  <BaseInput
                    id="firstName"
                    v-model="userProfile.firstName"
                    required
                    rounded="lg"
                  />
                </div>
                
                <div>
                  <BaseLabel for="lastName" class="mb-2">نام خانوادگی *</BaseLabel>
                  <BaseInput
                    id="lastName"
                    v-model="userProfile.lastName"
                    required
                    rounded="lg"
                  />
                </div>
                
                <div>
                  <BaseLabel for="email" class="mb-2">ایمیل *</BaseLabel>
                  <BaseInput
                    id="email"
                    v-model="userProfile.email"
                    type="email"
                    required
                    rounded="lg"
                  />
                </div>
                
                <div>
                  <BaseLabel for="phone" class="mb-2">شماره تلفن *</BaseLabel>
                  <BaseInput
                    id="phone"
                    v-model="userProfile.phone"
                    type="tel"
                    required
                    rounded="lg"
                  />
                </div>
              </div>
              
              <div class="flex items-center justify-end pt-4">
                <BaseButton 
                  type="submit" 
                  variant="solid" 
                  color="primary"
                  size="lg"
                >
                  <Icon name="ph:floppy-disk-duotone" class="h-4 w-4 ml-2" />
                  به‌روزرسانی پروفایل
                </BaseButton>
              </div>
            </form>
          </div>
        </BaseCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:gear-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              تنظیمات سریع
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <BaseButton 
                variant="ghost" 
                color="primary" 
                class="w-full justify-between"
                @click="$router.push('/baham/buyer/settings/addresses')"
                rounded="lg"
              >
                <span class="flex items-center">
                  <Icon name="ph:map-pin-duotone" class="h-4 w-4 ml-2" />
                  مدیریت آدرس‌ها
                </span>
                <Icon name="ph:caret-left-duotone" class="h-4 w-4" />
              </BaseButton>
              
              <BaseButton 
                variant="ghost" 
                color="primary" 
                class="w-full justify-between"
                @click="$router.push('/baham/buyer/settings/notifications')"
                rounded="lg"
              >
                <span class="flex items-center">
                  <Icon name="ph:bell-duotone" class="h-4 w-4 ml-2" />
                  تنظیمات اعلان‌ها
                </span>
                <Icon name="ph:caret-left-duotone" class="h-4 w-4" />
              </BaseButton>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:shield-check-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              امنیت حساب
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <BaseButton 
                variant="outline" 
                color="primary" 
                class="w-full"
                rounded="lg"
              >
                <Icon name="ph:key-duotone" class="h-4 w-4 ml-2" />
                تغییر رمز عبور
              </BaseButton>
              
              <BaseButton 
                variant="outline" 
                color="primary" 
                class="w-full"
                rounded="lg"
              >
                <Icon name="ph:shield-plus-duotone" class="h-4 w-4 ml-2" />
                دو عاملی سازی
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>