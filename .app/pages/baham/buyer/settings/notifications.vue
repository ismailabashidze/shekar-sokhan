<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات اعلان‌ها - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'تنظیمات اعلان‌ها - با هم',
  meta: [
    { name: 'description', content: 'مدیریت تنظیمات اعلان‌ها و پیام‌ها' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Notification categories
const notificationCategories = ref([
  {
    id: 'orders',
    title: 'سفارشات',
    description: 'اعلان‌های مربوط به سفارشات شما',
    icon: 'ph:package',
    enabled: true,
    channels: {
      push: true,
      email: true,
      sms: false
    }
  },
  {
    id: 'payments',
    title: 'پرداخت‌ها',
    description: 'اعلان‌های مربوط به پرداخت‌ها و کیف پول',
    icon: 'ph:wallet',
    enabled: true,
    channels: {
      push: true,
      email: true,
      sms: true
    }
  },
  {
    id: 'promotions',
    title: 'پیشنهادات ویژه',
    description: 'تخفیف‌ها و پیشنهادات ویژه برای شما',
    icon: 'ph:gift',
    enabled: false,
    channels: {
      push: false,
      email: false,
      sms: false
    }
  },
  {
    id: 'system',
    title: 'پیام‌های سیستمی',
    description: 'به‌روزرسانی‌ها و پیام‌های مهم سیستم',
    icon: 'ph:warning',
    enabled: true,
    channels: {
      push: true,
      email: false,
      sms: false
    }
  }
])

// Notification frequency
const frequency = ref('immediate')

// Channel preferences
const channels = reactive({
  push: true,
  email: true,
  sms: false
})

// Toggle category
const toggleCategory = (categoryId: string) => {
  const category = notificationCategories.value.find(c => c.id === categoryId)
  if (category) {
    category.enabled = !category.enabled
  }
}

// Toggle channel for a category
const toggleCategoryChannel = (categoryId: string, channel: string) => {
  const category = notificationCategories.value.find(c => c.id === categoryId)
  if (category && category.channels.hasOwnProperty(channel)) {
    category.channels[channel] = !category.channels[channel]
  }
}

// Toggle global channel
const toggleChannel = (channel: string) => {
  channels[channel] = !channels[channel]
  
  // Update all categories that use this channel
  notificationCategories.value.forEach(category => {
    if (category.enabled) {
      category.channels[channel] = channels[channel]
    }
  })
}

// Save settings
const saveSettings = () => {
  const toaster = useToaster()
  toaster.show({
    title: 'تنظیمات ذخیره شد',
    message: 'تغییرات تنظیمات اعلان‌ها با موفقیت ذخیره شد',
    color: 'success',
    icon: 'ph:check-circle',
    closable: true,
  })
}

// Reset to default settings
const resetSettings = () => {
  notificationCategories.value = [
    {
      id: 'orders',
      title: 'سفارشات',
      description: 'اعلان‌های مربوط به سفارشات شما',
      icon: 'ph:package',
      enabled: true,
      channels: {
        push: true,
        email: true,
        sms: false
      }
    },
    {
      id: 'payments',
      title: 'پرداخت‌ها',
      description: 'اعلان‌های مربوط به پرداخت‌ها و کیف پول',
      icon: 'ph:wallet',
      enabled: true,
      channels: {
        push: true,
        email: true,
        sms: true
      }
    },
    {
      id: 'promotions',
      title: 'پیشنهادات ویژه',
      description: 'تخفیف‌ها و پیشنهادات ویژه برای شما',
      icon: 'ph:gift',
      enabled: false,
      channels: {
        push: false,
        email: false,
        sms: false
      }
    },
    {
      id: 'system',
      title: 'پیام‌های سیستمی',
      description: 'به‌روزرسانی‌ها و پیام‌های مهم سیستم',
      icon: 'ph:warning',
      enabled: true,
      channels: {
        push: true,
        email: false,
        sms: false
      }
    }
  ]
  
  frequency.value = 'immediate'
  channels.push = true
  channels.email = true
  channels.sms = false
  
  const toaster = useToaster()
  toaster.show({
    title: 'تنظیمات بازنشانی شد',
    message: 'تنظیمات به حالت پیش‌فرض بازگشت',
    color: 'info',
    icon: 'ph:arrow-counter-clockwise',
    closable: true,
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
        تنظیمات اعلان‌ها
      </BaseHeading>
      <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mt-2">
        مدیریت اعلان‌ها و پیام‌های خود را سفارشی کنید
      </BaseParagraph>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Notification Categories -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <div class="flex items-center justify-between mb-6">
            <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
              دسته‌بندی اعلان‌ها
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
              {{ notificationCategories.filter(c => c.enabled).length }} فعال
            </BaseParagraph>
          </div>
          
          <div class="space-y-5">
            <div 
              v-for="category in notificationCategories" 
              :key="category.id"
              class="border border-muted-200 dark:border-muted-700 rounded-lg p-5 transition-all hover:shadow-sm"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start">
                  <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-12 items-center justify-center ml-4">
                    <Icon :name="category.icon" class="text-primary-500 size-6" />
                  </div>
                  <div>
                    <BaseHeading tag="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-1">
                      {{ category.title }}
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                      {{ category.description }}
                    </BaseParagraph>
                  </div>
                </div>
                <BaseToggle
                  :model-value="category.enabled"
                  @update:model-value="toggleCategory(category.id)"
                />
              </div>
              
              <!-- Special case for promotions - show clear on/off switch -->
              <div 
                v-if="category.id === 'promotions'" 
                class="mt-4"
              >
                <div class="flex items-center justify-between p-3 bg-muted-100 dark:bg-muted-800 rounded-lg">
                  <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                    دریافت پیشنهادات ویژه
                  </BaseParagraph>
                  <BaseToggle
                    :model-value="category.enabled"
                    @update:model-value="toggleCategory(category.id)"
                  />
                </div>
              </div>
              
              <!-- Channel Selection for Category -->
              <div 
                v-if="category.enabled && category.id !== 'promotions'" 
                class="mt-5 pt-5 border-t border-muted-200 dark:border-muted-700 grid grid-cols-3 gap-3"
              >
                <button
                  @click="toggleCategoryChannel(category.id, 'push')"
                  :class="[
                    'flex flex-col items-center justify-center p-3 rounded-lg border transition-all',
                    category.channels.push 
                      ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400' 
                      : 'border-muted-200 dark:border-muted-700 text-muted-500 hover:border-muted-300 dark:hover:border-muted-600'
                  ]"
                >
                  <Icon name="ph:bell" class="size-5 mb-1" />
                  <span class="text-xs">اپلیکیشن</span>
                </button>
                
                <button
                  @click="toggleCategoryChannel(category.id, 'email')"
                  :class="[
                    'flex flex-col items-center justify-center p-3 rounded-lg border transition-all',
                    category.channels.email 
                      ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400' 
                      : 'border-muted-200 dark:border-muted-700 text-muted-500 hover:border-muted-300 dark:hover:border-muted-600'
                  ]"
                >
                  <Icon name="ph:envelope" class="size-5 mb-1" />
                  <span class="text-xs">ایمیل</span>
                </button>
                
                <button
                  @click="toggleCategoryChannel(category.id, 'sms')"
                  :class="[
                    'flex flex-col items-center justify-center p-3 rounded-lg border transition-all',
                    category.channels.sms 
                      ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400' 
                      : 'border-muted-200 dark:border-muted-700 text-muted-500 hover:border-muted-300 dark:hover:border-muted-600'
                  ]"
                >
                  <Icon name="ph:chat-circle" class="size-5 mb-1" />
                  <span class="text-xs">پیامک</span>
                </button>
              </div>
            </div>
          </div>
        </BaseCard>
        
        <!-- Frequency Settings -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            فرکانس اعلان‌ها
          </BaseHeading>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseCard 
              rounded="lg"
              class="dark:!bg-muted-800 p-5 cursor-pointer border-2 transition-all"
              :class="frequency === 'immediate' ? 'border-primary-500 bg-primary-500/10' : 'border-muted-200 dark:border-muted-700 hover:border-muted-300 dark:hover:border-muted-600'"
              @click="frequency = 'immediate'"
            >
              <div class="flex items-center mb-3">
                <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-10 items-center justify-center ml-3">
                  <Icon name="ph:lightning" class="text-success-500 size-5" />
                </div>
                <BaseHeading tag="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                  فوری
                </BaseHeading>
              </div>
              <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                دریافت اعلان‌ها به صورت فوری
              </BaseParagraph>
            </BaseCard>
            
            <BaseCard 
              rounded="lg"
              class="dark:!bg-muted-800 p-5 cursor-pointer border-2 transition-all"
              :class="frequency === 'daily' ? 'border-primary-500 bg-primary-500/10' : 'border-muted-200 dark:border-muted-700 hover:border-muted-300 dark:hover:border-muted-600'"
              @click="frequency = 'daily'"
            >
              <div class="flex items-center mb-3">
                <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-10 items-center justify-center ml-3">
                  <Icon name="ph:sun" class="text-info-500 size-5" />
                </div>
                <BaseHeading tag="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                  روزانه
                </BaseHeading>
              </div>
              <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                خلاصه روزانه اعلان‌ها
              </BaseParagraph>
            </BaseCard>
            
            <BaseCard 
              rounded="lg"
              class="dark:!bg-muted-800 p-5 cursor-pointer border-2 transition-all"
              :class="frequency === 'weekly' ? 'border-primary-500 bg-primary-500/10' : 'border-muted-200 dark:border-muted-700 hover:border-muted-300 dark:hover:border-muted-600'"
              @click="frequency = 'weekly'"
            >
              <div class="flex items-center mb-3">
                <div class="nui-mask nui-mask-hexed bg-warning-500/10 flex size-10 items-center justify-center ml-3">
                  <Icon name="ph:calendar" class="text-warning-500 size-5" />
                </div>
                <BaseHeading tag="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                  هفتگی
                </BaseHeading>
              </div>
              <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                خلاصه هفتگی اعلان‌ها
              </BaseParagraph>
            </BaseCard>
          </div>
        </BaseCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Global Channels -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            کانال‌های اعلان
          </BaseHeading>
          
          <div class="space-y-5">
            <div 
              class="flex items-center justify-between p-4 rounded-lg border border-muted-200 dark:border-muted-700"
              :class="channels.push ? 'bg-primary-500/10 border-primary-500' : ''"
            >
              <div class="flex items-center">
                <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-10 items-center justify-center ml-3">
                  <Icon name="ph:bell" class="text-primary-500 size-5" />
                </div>
                <div>
                  <BaseHeading tag="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                    اعلان‌های فشاری
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    در دستگاه شما
                  </BaseParagraph>
                </div>
              </div>
              <BaseToggle
                v-model="channels.push"
                @update:model-value="toggleChannel('push')"
              />
            </div>
            
            <div 
              class="flex items-center justify-between p-4 rounded-lg border border-muted-200 dark:border-muted-700"
              :class="channels.email ? 'bg-primary-500/10 border-primary-500' : ''"
            >
              <div class="flex items-center">
                <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-10 items-center justify-center ml-3">
                  <Icon name="ph:envelope" class="text-info-500 size-5" />
                </div>
                <div>
                  <BaseHeading tag="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                    ایمیل
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    به صندوق پستی شما
                  </BaseParagraph>
                </div>
              </div>
              <BaseToggle
                v-model="channels.email"
                @update:model-value="toggleChannel('email')"
              />
            </div>
            
            <div 
              class="flex items-center justify-between p-4 rounded-lg border border-muted-200 dark:border-muted-700"
              :class="channels.sms ? 'bg-primary-500/10 border-primary-500' : ''"
            >
              <div class="flex items-center">
                <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-10 items-center justify-center ml-3">
                  <Icon name="ph:chat-circle" class="text-success-500 size-5" />
                </div>
                <div>
                  <BaseHeading tag="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                    پیامک
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                    به شماره همراه شما
                  </BaseParagraph>
                </div>
              </div>
              <BaseToggle
                v-model="channels.sms"
                @update:model-value="toggleChannel('sms')"
              />
            </div>
          </div>
        </BaseCard>
        
        <!-- Quick Actions -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            عملیات سریع
          </BaseHeading>
          
          <div class="grid grid-cols-2 gap-3">
            <BaseButton
              @click="saveSettings"
              variant="solid"
              color="primary"
              class="flex flex-col items-center justify-center p-4 h-auto"
            >
              <Icon name="ph:floppy-disk" class="size-6 mb-2" />
              <span>ذخیره</span>
            </BaseButton>
            
            <BaseButton
              @click="resetSettings"
              variant="outline"
              color="secondary"
              class="flex flex-col items-center justify-center p-4 h-auto"
            >
              <Icon name="ph:arrow-counter-clockwise" class="size-6 mb-2" />
              <span>بازنشانی</span>
            </BaseButton>
          </div>
        </BaseCard>
        
        <!-- Help Info -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-4">
            راهنمایی
          </BaseHeading>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <Icon name="ph:info" class="size-5 text-info-500 ml-3 mt-0.5 flex-shrink-0" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                اعلان‌های سفارشات همیشه به صورت فوری ارسال می‌شوند
              </BaseParagraph>
            </div>
            
            <div class="flex items-start">
              <Icon name="ph:shield" class="size-5 text-success-500 ml-3 mt-0.5 flex-shrink-0" />
              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                اطلاعات شما به هیچ عنوان با دیگران به اشتراک گذاشته نمی‌شود
              </BaseParagraph>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>