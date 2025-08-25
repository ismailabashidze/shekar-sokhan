<script setup lang="ts">
definePageMeta({
  title: 'صفحه اصلی - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'صفحه اصلی - با هم',
  meta: [
    { name: 'description', content: 'پلتفرم اشتراک‌گذاری محصولات کشاورزی - اتصال مستقیم تولیدکنندگان با مصرف‌کنندگان' }
  ],
   htmlAttrs: { dir: 'rtl' } 
})

// Animation states
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

const stats = [
  { value: '۱۲۰۰+', label: 'تولیدکننده', icon: 'ph:person-duotone', color: 'primary' },
  { value: '۸۵۰+', label: 'توزیع‌کننده', icon: 'ph:truck-duotone', color: 'success' },
  { value: '۵۰۰۰+', label: 'خریدار فعال', icon: 'ph:storefront-duotone', color: 'info' },
  { value: '۴۲۰+', label: 'شهر فعال', icon: 'ph:map-pin-duotone', color: 'warning' }
]

const features = [
  {
    title: 'اتصال مستقیم',
    description: 'برقراری ارتباط مستقیم بین تولیدکنندگان و مصرف‌کنندگان بدون واسطه',
    icon: 'ph:link-duotone',
    color: 'primary'
  },
  {
    title: 'کاهش هزینه‌ها',
    description: 'کاهش هزینه‌های واسطه‌گری و قیمت مناسب برای همه ذی‌نفعان',
    icon: 'ph:currency-circle-dollar-duotone',
    color: 'success'
  },
  {
    title: 'تضمین کیفیت',
    description: 'تضمین کیفیت محصولات از مبدا تا مقصد با سیستم بازرسی',
    icon: 'ph:shield-check-duotone',
    color: 'info'
  },
  {
    title: 'پشتیبانی از محلی‌ها',
    description: 'حمایت از تولیدکنندگان محلی و توسعه پایدار بخش کشاورزی',
    icon: 'ph:heart-duotone',
    color: 'warning'
  },
  {
    title: 'شفافیت',
    description: 'شفافیت کامل در قیمت‌گذاری و مراحل تراکنش',
    icon: 'ph:eye-duotone',
    color: 'primary'
  },
  {
    title: 'تحویل سریع',
    description: 'تحویل به موقع محصولات با شبکه توزیع گسترده',
    icon: 'ph:lightning-duotone',
    color: 'success'
  }
]

const testimonials = [
  {
    name: 'مرتضی محمدی',
    role: 'تولیدکننده سبزیجات',
    content: 'با استفاده از پلتفرم با هم، درآمدم ۳۰٪ افزایش یافت و دیگر نگران واسطه‌ها نیستم.',
    avatar: 'MM'
  },
  {
    name: 'فاطمه رضایی',
    role: 'مدیر فروشگاه ارگانیک',
    content: 'محصولات تازه و باکیفیت را با قیمت منصفانه از تولیدکنندگان محلی تهیه می‌کنم.',
    avatar: 'FR'
  },
  {
    name: 'حسین کریمی',
    role: 'توزیع‌کننده محصولات کشاورزی',
    content: 'پلتفرم با هم به من کمک کرد تا چندین مشتری جدید پیدا کنم و کسب‌وکارم رشد کند.',
    avatar: 'HK'
  }
]

const steps = [
  {
    number: '۱',
    title: 'ثبت نام',
    description: 'با انتخاب نقش خود در پلتفرم ثبت نام کنید',
    icon: 'ph:user-plus-duotone'
  },
  {
    number: '۲',
    title: 'ارائه/درخواست',
    description: 'محصولات خود را عرضه کنید یا سفارش دهید',
    icon: 'ph:package-duotone'
  },
  {
    number: '۳',
    title: 'هماهنگی',
    description: 'با توزیع‌کنندگان هماهنگ کنید',
    icon: 'ph:arrows-left-right-duotone'
  },
  {
    number: '۴',
    title: 'تحویل و پرداخت',
    description: 'محصولات را دریافت کرده و پرداخت کنید',
    icon: 'ph:truck-duotone'
  }
]
</script>

<template>
  <!-- Navigation Links -->
    <div class="mt-6">
      <BahamNavigation />
    </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section with Animation -->
    <div 
      class="text-center mb-20 transition-all duration-1000 ease-out"
      :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible }"
    >
      <div class="inline-block p-4 rounded-full bg-gradient-to-br from-primary-500/20 to-success-500/20 mb-8">
        <Icon name="ph:handshake-duotone" class="text-primary-600 size-20" />
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
        به <span class="font-bold">«باهم»</span>
        <span class="block text-transparent bg-clip-text bg-gradient-to-l from-primary-600 to-success-600 py-4 font-normal">
          خوش آمدید
        </span>
      </h1>
      <p class="mt-6 max-w-2xl mx-auto text-xl text-muted-700 dark:text-muted-300">
        اتصال مستقیم تولیدکنندگان کشاورزی با مصرف‌کنندگان نهایی
      </p>
      <p class="mt-4 max-w-3xl mx-auto text-lg text-muted-600 dark:text-muted-400">
        پلتفرمی برای خرید محصولات تازه و با کیفیت مستقیم از مزرعه تا میز شما، بدون واسطه و با قیمت منصفانه
      </p>
      <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/baham/auth/register/buyer">
          <BaseButton color="primary" size="lg" class="px-8 py-3 text-base">
            <Icon name="ph:user-plus-duotone" class="ml-2" />
            ثبت نام رایگان
          </BaseButton>
        </NuxtLink>
        <NuxtLink to="/baham/how-it-works">
          <BaseButton color="success" variant="outline" size="lg" class="px-8 py-3 text-base">
            نحوه کار پلتفرم
            <Icon name="ph:arrow-left" class="mr-2" />
          </BaseButton>
        </NuxtLink>
      </div>
      
      <!-- Trust indicators -->
      <div class="mt-16 flex flex-wrap justify-center gap-10 text-base text-muted-700 dark:text-muted-300">
        <div class="flex items-center">
          <Icon name="ph:check-circle-fill" class="text-success-500 mr-3 text-xl" />
          <span>ضمانت کیفیت محصولات</span>
        </div>
        <div class="flex items-center">
          <Icon name="ph:truck-fill" class="text-primary-500 mr-3 text-xl" />
          <span>تحویل سریع و مطمئن</span>
        </div>
        <div class="flex items-center">
          <Icon name="ph:shield-star-fill" class="text-warning-500 mr-3 text-xl" />
          <span>پشتیبانی ۲۴ ساعته</span>
        </div>
      </div>
    </div>

    <!-- User Roles Section - Moved to be more prominent -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3 mb-24">
      <BaseCard rounded="2xl" elevated class="hover:shadow-2xl transition-all duration-300 border border-primary-100 dark:border-muted-800 bg-gradient-to-b from-white to-primary-50/30 dark:from-muted-900 dark:to-primary-900/10">
        <div class="p-8">
          <div class="flex justify-center mb-6">
            <div class="nui-mask nui-mask-hexed bg-primary-500/15 flex size-20 items-center justify-center">
              <Icon name="ph:shopping-cart-duotone" class="text-primary-600 size-10" />
            </div>
          </div>
          <BaseHeading tag="h3" size="xl" weight="bold" class="text-center mb-4">
            خریداران
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 text-center mb-8">
            محصولات تازه و با کیفیت را با قیمت مناسب بخرید
          </BaseParagraph>
          <NuxtLink to="/baham/auth/register/buyer">
            <BaseButton color="primary" class="w-full py-3 text-base" rounded="lg">
              ثبت نام به عنوان خریدار
            </BaseButton>
          </NuxtLink>
        </div>
      </BaseCard>

      <BaseCard rounded="2xl" elevated class="hover:shadow-2xl transition-all duration-300 border border-success-100 dark:border-muted-800 bg-gradient-to-b from-white to-success-50/30 dark:from-muted-900 dark:to-success-900/10">
        <div class="p-8">
          <div class="flex justify-center mb-6">
            <div class="nui-mask nui-mask-hexed bg-success-500/15 flex size-20 items-center justify-center">
              <Icon name="ph:truck-duotone" class="text-success-600 size-10" />
            </div>
          </div>
          <BaseHeading tag="h3" size="xl" weight="bold" class="text-center mb-4">
            توزیع‌کنندگان
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 text-center mb-8">
            به عنوان واسطه بین تولیدکنندگان و مصرف‌کنندگان فعالیت کنید
          </BaseParagraph>
          <NuxtLink to="/baham/auth/register/distributor">
            <BaseButton color="success" class="w-full py-3 text-base" rounded="lg">
              ثبت نام به عنوان توزیع‌کننده
            </BaseButton>
          </NuxtLink>
        </div>
      </BaseCard>

      <BaseCard rounded="2xl" elevated class="hover:shadow-2xl transition-all duration-300 border border-info-100 dark:border-muted-800 bg-gradient-to-b from-white to-info-50/30 dark:from-muted-900 dark:to-info-900/10">
        <div class="p-8">
          <div class="flex justify-center mb-6">
            <div class="nui-mask nui-mask-hexed bg-info-500/15 flex size-20 items-center justify-center">
              <Icon name="ph:leaf-duotone" class="text-info-600 size-10" />
            </div>
          </div>
          <BaseHeading tag="h3" size="xl" weight="bold" class="text-center mb-4">
            ارائه‌دهندگان
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 text-center mb-8">
            محصولات خود را به بازار عرضه کنید
          </BaseParagraph>
          <NuxtLink to="/baham/auth/register/provider">
            <BaseButton color="info" class="w-full py-3 text-base" rounded="lg">
              ثبت نام به عنوان ارائه‌دهنده
            </BaseButton>
          </NuxtLink>
        </div>
      </BaseCard>
    </div>

    <!-- Stats Section -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
      <BaseCard 
        v-for="(stat, index) in stats" 
        :key="index"
        rounded="xl" 
        elevated
        class="dark:!bg-muted-900 p-6 text-center hover:shadow-xl transition-all duration-300 border border-muted-200 dark:border-muted-800"
      >
        <div class="flex justify-center mb-5">
          <div 
            :class="`nui-mask nui-mask-hexed bg-${stat.color}-500/15 flex size-20 items-center justify-center`"
          >
            <Icon 
              :name="stat.icon" 
              :class="`text-${stat.color}-600 size-10`" 
            />
          </div>
        </div>
        <div class="text-4xl font-bold mb-2" :class="`text-${stat.color}-600`">{{ stat.value }}</div>
        <div class="text-muted-700 dark:text-muted-300 font-medium">{{ stat.label }}</div>
      </BaseCard>
    </div>

    <!-- How It Works Section -->
    <BaseCard rounded="2xl" class="dark:!bg-gradient-to-br from-muted-900 to-muted-800 p-8 md:p-12 mb-24 border border-muted-200 dark:border-muted-700">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="text-center mb-4">
        نحوه کار پلتفرم
      </BaseHeading>
      <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-400 text-center mb-16 max-w-3xl mx-auto">
        فرآیند اشتراک‌گذاری محصولات کشاورزی از تولید تا مصرف
      </BaseParagraph>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="text-center relative pt-8"
        >
          <div class="relative z-10">
            <div class="nui-mask nui-mask-hexed bg-primary-500/15 flex size-20 items-center justify-center mx-auto mb-6">
              <Icon :name="step.icon" class="text-primary-600 size-10" />
            </div>
            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-white dark:bg-muted-900 flex items-center justify-center text-primary-600 font-bold text-2xl border-4 border-primary-100 dark:border-muted-800 shadow-lg">
              {{ step.number }}
            </div>
            <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-4 mt-2">
              {{ step.title }}
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              {{ step.description }}
            </BaseParagraph>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Features Section -->
    <BaseCard rounded="2xl" class="dark:!bg-muted-900 p-8 md:p-12 mb-24 border border-muted-200 dark:border-muted-700">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="text-center mb-4">
        چرا با هم؟
      </BaseHeading>
      <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-400 text-center mb-16 max-w-3xl mx-auto">
        مزایای استفاده از پلتفرم با هم برای همه ذی‌نفعان
      </BaseParagraph>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="flex items-start p-6 bg-white dark:bg-muted-800 rounded-2xl hover:shadow-lg transition-all duration-300 border border-muted-100 dark:border-muted-700"
        >
          <div 
            :class="`nui-mask nui-mask-hexed bg-${feature.color}-500/15 flex size-16 items-center justify-center ml-5 shrink-0 mt-1`"
          >
            <Icon 
              :name="feature.icon" 
              :class="`text-${feature.color}-600 size-8`" 
            />
          </div>
          <div>
            <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
              {{ feature.title }}
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              {{ feature.description }}
            </BaseParagraph>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Testimonials Section -->
    <BaseCard rounded="2xl" class="dark:!bg-muted-900 p-8 md:p-12 mb-24 border border-muted-200 dark:border-muted-700">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="text-center mb-4">
        نظرات کاربران
      </BaseHeading>
      <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-400 text-center mb-16 max-w-3xl mx-auto">
        تجربیات کاربران ما از پلتفرم با هم
      </BaseParagraph>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BaseCard 
          v-for="(testimonial, index) in testimonials" 
          :key="index"
          rounded="xl" 
          elevated
          class="dark:!bg-muted-800 p-6 hover:shadow-xl transition-all duration-300 border border-muted-200 dark:border-muted-700"
        >
          <div class="flex items-center mb-5">
            <div class="nui-mask nui-mask-hexed bg-primary-500/15 flex size-14 items-center justify-center ml-4">
              <span class="text-primary-600 font-bold text-lg">{{ testimonial.avatar }}</span>
            </div>
            <div>
              <BaseHeading tag="h3" size="lg" weight="semibold">
                {{ testimonial.name }}
              </BaseHeading>
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                {{ testimonial.role }}
              </BaseParagraph>
            </div>
          </div>
          <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300 italic">
            "{{ testimonial.content }}"
          </BaseParagraph>
        </BaseCard>
      </div>
    </BaseCard>

    <!-- CTA Section -->
    <BaseCard rounded="2xl" class="dark:!bg-gradient-to-br from-primary-600/10 to-success-600/10 p-12 text-center border-2 border-primary-200 dark:border-primary-800/50 mb-24">
      <div class="max-w-4xl mx-auto">
        <div class="inline-block p-4 rounded-full bg-white dark:bg-muted-900 mb-8">
          <Icon name="ph:hand-heart-duotone" class="text-primary-600 size-16" />
        </div>
        <BaseHeading tag="h2" size="3xl" weight="bold" class="mb-6">
          آماده برای شروع هستید؟
        </BaseHeading>
        <BaseParagraph size="lg" class="text-muted-700 dark:text-muted-300 mb-10 max-w-2xl mx-auto">
          به جامعه با هم بپیوندید و تجربه خرید و فروش محصولات کشاورزی را متحول کنید
        </BaseParagraph>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/baham/auth/register/buyer">
            <BaseButton color="primary" size="lg" class="px-8 py-4 text-base">
              <Icon name="ph:user-plus-duotone" class="ml-2" />
              ثبت نام به عنوان خریدار
            </BaseButton>
          </NuxtLink>
          <NuxtLink to="/baham/auth/register/provider">
            <BaseButton color="success" variant="outline" size="lg" class="px-8 py-4 text-base">
              <Icon name="ph:leaf-duotone" class="ml-2" />
              ثبت نام به عنوان ارائه‌دهنده
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </BaseCard>
  </div>
</template>