<script setup lang="ts">
definePageMeta({
  title: 'تماس با ما - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'تماس با ما - با هم',
  meta: [
    { name: 'description', content: 'با ما تماس بگیرید - پشتیبانی 24 ساعته' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

// Contact information data
const contactInfo = [
  {
    title: 'تلفن',
    details: '+98 21 1234 5678',
    icon: 'ph:phone-duotone'
  },
  {
    title: 'ایمیل',
    details: 'info@baham.ir',
    icon: 'ph:envelope-duotone'
  },
  {
    title: 'آدرس',
    details: 'تهران، خیابان ولیعصر، پلاک 123',
    icon: 'ph:map-pin-duotone'
  },
  {
    title: 'ساعات پشتیبانی',
    details: 'شنبه تا چهارشنبه: ۹ تا ۱۷',
    icon: 'ph:clock-duotone'
  }
]

// Social media links
const socialMedia = [
  { name: 'اینستاگرام', icon: 'ph:instagram-logo', url: '#' },
  { name: 'تلگرام', icon: 'ph:telegram-logo', url: '#' },
  { name: 'توییتر', icon: 'ph:twitter-logo', url: '#' },
  { name: 'لینکدین', icon: 'ph:linkedin-logo', url: '#' }
]

// Form data
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Form submission handler
const submitForm = () => {
  // In a real app, this would send the form data to a backend
  const toaster = useToaster()
  toaster.show({
    title: 'پیام ارسال شد',
    message: 'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
    color: 'success',
    icon: 'ph:check-circle',
    closable: true,
  })
  
  // Reset form
  Object.assign(formData, {
    name: '',
    email: '',
    subject: '',
    message: ''
  })
}

// Feature showcase with animation
const activeFeature = ref(0)
const features = [
  { 
    title: 'پشتیبانی فوری', 
    description: 'تیم پشتیبانی ما 24 ساعته آماده کمک به شماست',
    icon: 'ph:headset',
    color: 'primary'
  },
  { 
    title: 'پاسخ سریع', 
    description: 'میانگین زمان پاسخ به پیام‌ها کمتر از 2 ساعت است',
    icon: 'ph:clock-counter-clockwise',
    color: 'success'
  },
  { 
    title: 'رضایت مشتری', 
    description: '۹۸٪ از کاربران ما از خدمات پشتیبانی راضی هستند',
    icon: 'ph:smiley',
    color: 'info'
  }
]

// Auto rotate features
onMounted(() => {
  setInterval(() => {
    activeFeature.value = (activeFeature.value + 1) % features.length
  }, 4000)
})
</script>

<template>
    <!-- Navigation Links -->
    <div class="mt-6">
      <BahamNavigation />
    </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-20">
      <BaseHeading tag="h1" size="3xl" weight="bold" class="mb-8">
        <span class="bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
          تماس با ما
        </span>
      </BaseHeading>
      <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-400 max-w-3xl mx-auto leading-relaxed">
        سوال، پیشنهاد یا انتقادی دارید؟ تیم ما همیشه آماده کمک به شماست. با ما در تماس باشید.
      </BaseParagraph>
    </div>
    
    <!-- Features Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
      <BaseCard 
        v-for="(feature, index) in features" 
        :key="feature.title"
        rounded="lg" 
        class="dark:!bg-muted-900 p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
        :class="{ 'ring-2 ring-primary-500': index === activeFeature }"
      >
        <div class="flex justify-center mb-6">
          <div 
            :class="`nui-mask nui-mask-hexed ${feature.color === 'primary' ? 'bg-primary-500/10' : feature.color === 'success' ? 'bg-success-500/10' : 'bg-info-500/10'} flex size-16 items-center justify-center`"
          >
            <Icon 
              :name="feature.icon" 
              :class="`${feature.color === 'primary' ? 'text-primary-500' : feature.color === 'success' ? 'text-success-500' : 'text-info-500'} size-8`" 
            />
          </div>
        </div>
        <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-4">
          {{ feature.title }}
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 leading-relaxed">
          {{ feature.description }}
        </BaseParagraph>
      </BaseCard>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <!-- Contact Information -->
      <div>
        <BaseHeading tag="h2" size="2xl" weight="semibold" class="mb-8">
          اطلاعات تماس
        </BaseHeading>
        
        <div class="space-y-8 mb-12">
          <div 
            v-for="(info, index) in contactInfo" 
            :key="index" 
            class="flex items-start group"
          >
            <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-14 items-center justify-center ml-6 transition-all duration-300 group-hover:bg-primary-500/20">
              <Icon :name="info.icon" class="text-primary-500 size-7" />
            </div>
            <div>
              <BaseHeading tag="h3" size="md" weight="medium" class="mb-2">
                {{ info.title }}
              </BaseHeading>
              <BaseParagraph size="md" class="text-muted-600 dark:text-muted-300 leading-relaxed">
                {{ info.details }}
              </BaseParagraph>
            </div>
          </div>
        </div>
        
        <!-- Map Placeholder -->
        <div class="rounded-2xl overflow-hidden shadow-lg mb-12">
          <div class="bg-gradient-to-br from-primary-500/10 to-success-500/10 border-2 border-dashed border-primary-300 dark:border-primary-700 w-full h-72 flex items-center justify-center relative">
            <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div class="text-center relative z-10">
              <Icon name="ph:map-pin-duotone" class="text-primary-500 size-14 mx-auto mb-4" />
              <BaseHeading tag="h3" size="lg" weight="semibold" class="text-primary-700 dark:text-primary-300 mb-2">
                نقشه موقعیت ما
              </BaseHeading>
              <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
                تهران، خیابان ولیعصر
              </BaseParagraph>
            </div>
          </div>
        </div>
        
        <!-- Social Media -->
        <div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-6">
            در شبکه‌های اجتماعی
          </BaseHeading>
          <div class="flex space-x-5">
            <a 
              v-for="(social, index) in socialMedia" 
              :key="index"
              :href="social.url"
              class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-14 items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300 transform hover:scale-110"
              :aria-label="`ما در ${social.name}`"
            >
              <Icon :name="social.icon" class="text-primary-500 hover:text-white size-7" />
            </a>
          </div>
        </div>
      </div>
      
      <!-- Contact Form -->
      <div>
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-10 shadow-lg">
          <div class="flex items-center mb-8">
            <Icon name="ph:chat-centered-text-duotone" class="text-info-500 size-8 ml-4" />
            <BaseHeading tag="h2" size="2xl" weight="semibold">
              فرم تماس
            </BaseHeading>
          </div>
          
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-8 leading-relaxed">
            فرم زیر را پر کنید و تیم ما در اولین فرصت با شما تماس خواهد گرفت.
          </BaseParagraph>
          
          <form @submit.prevent="submitForm" class="space-y-8">
            <div>
              <BaseInput 
                v-model="formData.name"
                label="نام و نام خانوادگی"
                placeholder="نام خود را وارد کنید"
                required
              />
            </div>
            
            <div>
              <BaseInput 
                v-model="formData.email"
                label="ایمیل"
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                required
              />
            </div>
            
            <div>
              <BaseInput 
                v-model="formData.subject"
                label="موضوع"
                placeholder="موضوع پیام را وارد کنید"
                required
              />
            </div>
            
            <div>
              <BaseTextarea 
                v-model="formData.message"
                label="پیام"
                placeholder="پیام خود را وارد کنید"
                :rows="6"
                required
              />
            </div>
            
            <BaseButton variant="solid" color="primary" size="lg" type="submit" class="w-full py-4">
              ارسال پیام
              <Icon name="ph:paper-plane-tilt-duotone" class="ml-2" />
            </BaseButton>
          </form>
        </BaseCard>
        
        <!-- FAQ Link -->
        <div class="mt-10">
          <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex items-center">
                <Icon name="ph:question-duotone" class="text-warning-500 size-7 ml-4" />
                <div>
                  <BaseHeading tag="h3" size="md" weight="semibold">
                    سوالات متداول
                  </BaseHeading>
                  <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-1">
                    پاسخ بیشتر سوالات خود را در صفحه سوالات متداول پیدا کنید.
                  </BaseParagraph>
                </div>
              </div>
              <NuxtLink to="/baham/faq">
                <BaseButton color="primary" variant="pastel" size="md" class="px-6 py-2.5">
                  <Icon name="ph:arrow-left" class="size-4 ml-2" />
                  مشاهده سوالات متداول
                </BaseButton>
              </NuxtLink>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
    
  
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Animation for feature cards */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.pulse-animation {
  animation: pulse 2s infinite;
}
</style>