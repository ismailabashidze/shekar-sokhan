<script setup lang="ts">
definePageMeta({
  title: 'نحوه کار - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'نحوه کار - با هم',
  meta: [
    { name: 'description', content: 'نحوه کار پلتفرم اشتراک‌گذاری محصولات کشاورزی با هم' }
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
</script>

<template>
  <!-- Navigation Links -->
    <div class="mt-6">
      <BahamNavigation />
    </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section with Animation -->
    <div 
      class="text-center mb-16 transition-all duration-1000 ease-out"
      :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-10': !isVisible }"
    >
      <div class="inline-block p-4 rounded-full bg-primary-500/10 mb-6">
        <Icon name="ph:flow-arrow-duotone" class="text-primary-500 size-16" />
      </div>
      <BaseHeading tag="h1" size="3xl" weight="bold" class="mb-6">
        نحوه کار
        <span class="text-primary-500"> با هم</span>
      </BaseHeading>
      <BaseParagraph size="xl" class="max-w-3xl mx-auto text-muted-600 dark:text-muted-300">
        فرآیند اشتراک‌گذاری محصولات کشاورزی از تولید تا مصرف
      </BaseParagraph>
    </div>

    <!-- How It Works Steps -->
    <div class="mb-16">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="text-center mb-12">
        مراحل کار با پلتفرم
      </BaseHeading>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Step 1 -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 text-center hover:shadow-lg transition-shadow">
          <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-16 items-center justify-center mx-auto mb-6">
            <Icon name="ph:user-plus-duotone" class="text-primary-500 size-8" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            1. ثبت نام
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            کاربران با توجه به نقش خود (خریدار، توزیع‌کننده یا ارائه‌دهنده) در پلتفرم ثبت نام می‌کنند.
          </BaseParagraph>
        </BaseCard>
        
        <!-- Step 2 -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 text-center hover:shadow-lg transition-shadow">
          <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-16 items-center justify-center mx-auto mb-6">
            <Icon name="ph:package-duotone" class="text-success-500 size-8" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            2. عرضه بار
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            ارائه‌دهندگان محصولات خود را به صورت بارهای مشخص در پلتفرم عرضه می‌کنند.
          </BaseParagraph>
        </BaseCard>
        
        <!-- Step 3 -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 text-center hover:shadow-lg transition-shadow">
          <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-16 items-center justify-center mx-auto mb-6">
            <Icon name="ph:shopping-cart-duotone" class="text-info-500 size-8" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            3. ثبت سفارش
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            خریداران بارهای مورد نظر خود را انتخاب کرده و سفارش می‌دهند.
          </BaseParagraph>
        </BaseCard>
        
        <!-- Step 4 -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 text-center hover:shadow-lg transition-shadow">
          <div class="nui-mask nui-mask-hexed bg-warning-500/10 flex size-16 items-center justify-center mx-auto mb-6">
            <Icon name="ph:truck-duotone" class="text-warning-500 size-8" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            4. تحویل و تسویه
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            سفارشات توسط توزیع‌کنندگان تحویل داده شده و تسویه‌حساب انجام می‌شود.
          </BaseParagraph>
        </BaseCard>
      </div>
    </div>

    <!-- Platform Roles -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8 mb-16">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="text-center mb-12">
        نقش‌های پلتفرم
      </BaseHeading>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Provider -->
        <div class="text-center">
          <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-20 items-center justify-center mx-auto mb-6">
            <Icon name="ph:leaf-duotone" class="text-primary-500 size-10" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            ارائه‌دهنده
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-4">
            تولیدکنندگان کشاورزی که محصولات خود را در پلتفرم عرضه می‌کنند.
          </BaseParagraph>
          <ul class="text-right space-y-2 text-sm text-muted-600 dark:text-muted-400">
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>ثبت بارهای محصولات</span>
            </li>
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>مدیریت موجودی</span>
            </li>
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>بررسی درخواست‌های خرید</span>
            </li>
          </ul>
        </div>
        
        <!-- Distributor -->
        <div class="text-center">
          <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-20 items-center justify-center mx-auto mb-6">
            <Icon name="ph:truck-duotone" class="text-success-500 size-10" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            توزیع‌کننده
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-4">
            واسطه‌های حمل و نقل که محصولات را از تولیدکنندگان به خریداران منتقل می‌کنند.
          </BaseParagraph>
          <ul class="text-right space-y-2 text-sm text-muted-600 dark:text-muted-400">
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>مدیریت سفارشات</span>
            </li>
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>هماهنگی تحویل</span>
            </li>
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>گزارش‌های مالی</span>
            </li>
          </ul>
        </div>
        
        <!-- Buyer -->
        <div class="text-center">
          <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-20 items-center justify-center mx-auto mb-6">
            <Icon name="ph:shopping-cart-duotone" class="text-info-500 size-10" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            خریدار
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-4">
            مصرف‌کنندگان نهایی که محصولات را خریداری می‌کنند.
          </BaseParagraph>
          <ul class="text-right space-y-2 text-sm text-muted-600 dark:text-muted-400">
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>جستجو و خرید محصولات</span>
            </li>
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>پیگیری سفارشات</span>
            </li>
            <li class="flex items-start">
              <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-0.5 ml-2" />
              <span>ارتباط با فروشندگان</span>
            </li>
          </ul>
        </div>
      </div>
    </BaseCard>

    <!-- Process Flow Diagram -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8 mb-16">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="text-center mb-8">
        فرآیند کلی پلتفرم
      </BaseHeading>
      
      <div class="relative">
        <!-- Flow Diagram -->
        <div class="flex flex-col md:flex-row items-center justify-between py-8">
          <!-- Provider -->
          <div class="text-center mb-8 md:mb-0">
            <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-24 items-center justify-center mx-auto mb-4">
              <Icon name="ph:leaf-duotone" class="text-primary-500 size-12" />
            </div>
            <BaseHeading tag="h3" size="md" weight="semibold">
              ارائه‌دهنده
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              عرضه بار
            </BaseParagraph>
          </div>
          <!-- Platform -->
          <div class="text-center mb-8 md:mb-0">
            <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-24 items-center justify-center mx-auto mb-4">
              <Icon name="ph:cloud-duotone" class="text-info-500 size-12" />
            </div>
            <BaseHeading tag="h3" size="md" weight="semibold">
              پلتفرم با هم
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              مدیریت و هماهنگی
            </BaseParagraph>
          </div>
          <!-- Buyer -->
          <div class="text-center">
            <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-24 items-center justify-center mx-auto mb-4">
              <Icon name="ph:shopping-cart-duotone" class="text-success-500 size-12" />
            </div>
            <BaseHeading tag="h3" size="md" weight="semibold">
              خریدار
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              ثبت سفارش
            </BaseParagraph>
          </div>
        </div>
        <!-- Distributor -->
        <div class="text-center pt-8 border-t border-muted-200 dark:border-muted-700">
          <div class="nui-mask nui-mask-hexed bg-warning-500/10 flex size-24 items-center justify-center mx-auto mb-4">
            <Icon name="ph:truck-duotone" class="text-warning-500 size-12" />
          </div>
          <BaseHeading tag="h3" size="md" weight="semibold">
            توزیع‌کننده
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            تحویل محصولات
          </BaseParagraph>
        </div>
      </div>
    </BaseCard>

    <!-- Benefits Section -->
    <div class="mb-16">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="text-center mb-12">
        مزایای پلتفرم
      </BaseHeading>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-start mb-4">
            <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-12 items-center justify-center ml-4">
              <Icon name="ph:link-duotone" class="text-primary-500 size-6" />
            </div>
            <BaseHeading tag="h3" size="md" weight="semibold">
              اتصال مستقیم
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            ارتباط مستقیم بین تولیدکنندگان و مصرف‌کنندگان بدون واسطه
          </BaseParagraph>
        </BaseCard>
        
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-start mb-4">
            <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-12 items-center justify-center ml-4">
              <Icon name="ph:currency-circle-dollar-duotone" class="text-success-500 size-6" />
            </div>
            <BaseHeading tag="h3" size="md" weight="semibold">
              کاهش هزینه‌ها
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            کاهش هزینه‌های واسطه‌گری و قیمت مناسب برای همه
          </BaseParagraph>
        </BaseCard>
        
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-start mb-4">
            <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-12 items-center justify-center ml-4">
              <Icon name="ph:shield-check-duotone" class="text-info-500 size-6" />
            </div>
            <BaseHeading tag="h3" size="md" weight="semibold">
              تضمین کیفیت
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            تضمین کیفیت محصولات از مبدا تا مقصد
          </BaseParagraph>
        </BaseCard>
        
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-start mb-4">
            <div class="nui-mask nui-mask-hexed bg-warning-500/10 flex size-12 items-center justify-center ml-4">
              <Icon name="ph:leaf-duotone" class="text-warning-500 size-6" />
            </div>
            <BaseHeading tag="h3" size="md" weight="semibold">
              پایداری
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            حمایت از کشاورزی پایدار و توسعه محلی
          </BaseParagraph>
        </BaseCard>
      </div>
    </div>

    <!-- CTA Section -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8 text-center">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="mb-4">
        آماده برای شروع هستید؟
      </BaseHeading>
      <BaseParagraph size="lg" class="max-w-2xl mx-auto text-muted-600 dark:text-muted-300 mb-8">
        به جامعه با هم بپیوندید و تجربه خرید و فروش محصولات کشاورزی را متحول کنید
      </BaseParagraph>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/baham/auth/register/buyer">
          <BaseButton color="primary" size="lg">
            <Icon name="ph:user-plus-duotone" class="ml-2" />
            ثبت نام به عنوان خریدار
          </BaseButton>
        </NuxtLink>
        <NuxtLink to="/baham/auth/register/provider">
          <BaseButton color="success" variant="outline" size="lg">
            <Icon name="ph:plant-duotone" class="ml-2" />
            ثبت نام به عنوان ارائه‌دهنده
          </BaseButton>
        </NuxtLink>
      </div>
    </BaseCard>
    
    
  </div>
</template>