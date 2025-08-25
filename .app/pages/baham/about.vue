<script setup lang="ts">
definePageMeta({
  title: 'درباره ما - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'درباره ما - با هم',
  meta: [
    { name: 'description', content: 'درباره پلتفرم اشتراک‌گذاری محصولات کشاورزی با هم' }
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
        <Icon name="ph:handshake-duotone" class="text-primary-500 size-16" />
      </div>
      <BaseHeading tag="h1" size="3xl" weight="bold" class="mb-6">
        با هم
        <span class="text-primary-500"> رشد می‌کنیم</span>
      </BaseHeading>
      <BaseParagraph size="xl" class="max-w-3xl mx-auto text-muted-600 dark:text-muted-300">
        پلی بین تولیدکننده و مصرف‌کننده برای ایجاد یک آینده پایدار و سبز
      </BaseParagraph>
    </div>

    <!-- Main Description Card with Visual -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8 mb-16 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-success-500/5 rounded-full translate-y-48 -translate-x-48"></div>
      
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <BaseHeading tag="h2" size="2xl" weight="bold" class="mb-6">
            اتصال مستقیم،
            <span class="text-primary-500"> منافع مشترک</span>
          </BaseHeading>
          <BaseParagraph size="lg" class="mb-6 text-muted-700 dark:text-muted-300">
            «با هم» یک پلتفرم دیجیتال نوآورانه است که با هدف اتصال مستقیم تولیدکنندگان محصولات کشاورزی با 
            مصرف‌کنندگان نهایی ایجاد شده است. ما با حذف واسطه‌ها، زنجیره تأمین را کارآمدتر و شفاف‌تر کرده‌ایم.
          </BaseParagraph>
          <BaseParagraph size="lg" class="mb-8 text-muted-700 dark:text-muted-300">
            این پلتفرم نه تنها به مصرف‌کنندگان اجازه می‌دهد تا محصولات تازه و باکیفیت را با قیمت منصفانه دریافت کنند، 
            بلکه به تولیدکنندگان نیز کمک می‌کند تا سهم بیشتری از ارزش افزوده خود را حفظ کنند.
          </BaseParagraph>
          
          <div class="flex flex-wrap gap-4">
            <BaseButton variant="solid" color="primary" size="lg">
              <Icon name="ph:users-duotone" class="ml-2" />
              جامعه ما
            </BaseButton>
            <BaseButton variant="outline" color="primary" size="lg">
              <Icon name="ph:chart-line-up-duotone" class="ml-2" />
              رشد و توسعه
            </BaseButton>
          </div>
        </div>
        
        <div class="relative">
          <div class="relative rounded-2xl overflow-hidden shadow-xl border-8 border-white dark:border-muted-800">
            <div class="bg-gradient-to-br from-primary-500/10 to-success-500/10 aspect-video flex items-center justify-center">
              <div class="grid grid-cols-3 gap-4 w-full max-w-md p-8">
                <div class="bg-white dark:bg-muted-800 rounded-xl p-4 shadow text-center">
                  <Icon name="ph:person-duotone" class="text-primary-500 size-8 mx-auto mb-2" />
                  <div class="text-2xl font-bold">۱۲۰۰+</div>
                  <div class="text-sm text-muted-500">تولیدکننده</div>
                </div>
                <div class="bg-white dark:bg-muted-800 rounded-xl p-4 shadow text-center">
                  <Icon name="ph:truck-duotone" class="text-success-500 size-8 mx-auto mb-2" />
                  <div class="text-2xl font-bold">۸۵۰+</div>
                  <div class="text-sm text-muted-500">توزیع‌کننده</div>
                </div>
                <div class="bg-white dark:bg-muted-800 rounded-xl p-4 shadow text-center">
                  <Icon name="ph:storefront-duotone" class="text-info-500 size-8 mx-auto mb-2" />
                  <div class="text-2xl font-bold">۵۰۰۰+</div>
                  <div class="text-sm text-muted-500">خریدار</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-500 rounded-full opacity-20 animate-pulse"></div>
          <div class="absolute -top-6 -right-6 w-16 h-16 bg-success-500 rounded-full opacity-20 animate-ping"></div>
        </div>
      </div>
    </BaseCard>

    <!-- Mission & Vision Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8 hover:shadow-lg transition-shadow duration-300">
        <div class="flex items-center mb-6">
          <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-16 items-center justify-center ml-6">
            <Icon name="ph:target-duotone" class="text-primary-500 size-8" />
          </div>
          <BaseHeading tag="h2" size="2xl" weight="semibold">
            ماموریت ما
          </BaseHeading>
        </div>
        <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-300 mb-6">
          کاهش شکاف بین تولید و مصرف در بخش کشاورزی با ایجاد یک پلتفرم شفاف و کارآمد که 
          منافع همه ذی‌نفعان را حفظ می‌کند.
        </BaseParagraph>
        <ul class="space-y-3">
          <li class="flex items-start">
            <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-1 ml-3" />
            <span>ارتقای درآمد تولیدکنندگان کشاورزی</span>
          </li>
          <li class="flex items-start">
            <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-1 ml-3" />
            <span>تضمین کیفیت و تازگی محصولات</span>
          </li>
          <li class="flex items-start">
            <Icon name="ph:check-circle-duotone" class="text-success-500 size-5 mt-1 ml-3" />
            <span>کاهش هزینه‌های واسطه‌گری</span>
          </li>
        </ul>
      </BaseCard>
      
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8 hover:shadow-lg transition-shadow duration-300">
        <div class="flex items-center mb-6">
          <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-16 items-center justify-center ml-6">
            <Icon name="ph:eye-duotone" class="text-success-500 size-8" />
          </div>
          <BaseHeading tag="h2" size="2xl" weight="semibold">
            چشم‌انداز
          </BaseHeading>
        </div>
        <BaseParagraph size="lg" class="text-muted-600 dark:text-muted-300 mb-6">
          تبدیل شدن به بزرگترین پلتفرم اشتراک‌گذاری محصولات کشاورزی در ایران که به توسعه 
          پایدار بخش کشاورزی کمک می‌کند.
        </BaseParagraph>
        <ul class="space-y-3">
          <li class="flex items-start">
            <Icon name="ph:rocket-duotone" class="text-primary-500 size-5 mt-1 ml-3" />
            <span>گسترش به تمام استان‌های کشور</span>
          </li>
          <li class="flex items-start">
            <Icon name="ph:leaf-duotone" class="text-primary-500 size-5 mt-1 ml-3" />
            <span>حمایت از کشاورزی ارگانیک و پایدار</span>
          </li>
          <li class="flex items-start">
            <Icon name="ph:users-four-duotone" class="text-primary-500 size-5 mt-1 ml-3" />
            <span>ایجاد ۱۰۰۰۰ فرصت شغلی مستقیم و غیرمستقیم</span>
          </li>
        </ul>
      </BaseCard>
    </div>

    <!-- Our Values Section -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8 mb-16">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="mb-4 text-center">
        ارزش‌های ما
      </BaseHeading>
      <BaseParagraph size="lg" class="max-w-3xl mx-auto text-center mb-12 text-muted-600 dark:text-muted-300">
        اصول و ارزش‌هایی که همه تصمیمات و اقدامات ما بر اساس آنها شکل می‌گیرد
      </BaseParagraph>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-muted-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-muted-200 dark:border-muted-700">
          <div class="nui-mask nui-mask-hexed bg-info-500/10 flex size-12 items-center justify-center mb-4">
            <Icon name="ph:eye-duotone" class="text-info-500 size-6" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            شفافیت
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            تمام تراکنش‌ها شفاف و قابل ردیابی هستند. ما معتقدیم شفافیت پایه اعتماد است.
          </BaseParagraph>
        </div>
        
        <div class="bg-white dark:bg-muted-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-muted-200 dark:border-muted-700">
          <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-12 items-center justify-center mb-4">
            <Icon name="ph:shield-check-duotone" class="text-primary-500 size-6" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            کیفیت
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            تضمین کیفیت محصولات از مبدا تا مقصد. هر محصول قبل از ارسال بازرسی می‌شود.
          </BaseParagraph>
        </div>
        
        <div class="bg-white dark:bg-muted-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-muted-200 dark:border-muted-700">
          <div class="nui-mask nui-mask-hexed bg-success-500/10 flex size-12 items-center justify-center mb-4">
            <Icon name="ph:scales" class="text-success-500 size-6" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            عدالت
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            تقسیم عادلانه منافع بین همه ذی‌نفعان. هیچ طرفی در زنجیره تأمین مورد سوءاستفاده قرار نمی‌گیرد.
          </BaseParagraph>
        </div>
        
        <div class="bg-white dark:bg-muted-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-muted-200 dark:border-muted-700">
          <div class="nui-mask nui-mask-hexed bg-warning-500/10 flex size-12 items-center justify-center mb-4">
            <Icon name="ph:leaf-duotone" class="text-warning-500 size-6" />
          </div>
          <BaseHeading tag="h3" size="lg" weight="semibold" class="mb-3">
            پایداری
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
            حمایت از روش‌های کشاورزی پایدار و کاهش تأثیرات منفی بر محیط زیست.
          </BaseParagraph>
        </div>
      </div>
    </BaseCard>

    <!-- Stats Section -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900 p-8">
      <BaseHeading tag="h2" size="2xl" weight="bold" class="mb-4 text-center">
        آمار ما
      </BaseHeading>
      <BaseParagraph size="lg" class="max-w-3xl mx-auto text-center mb-12 text-muted-600 dark:text-muted-400">
        رشد و دستاوردهای ما تا کنون
      </BaseParagraph>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center p-6 bg-white dark:bg-muted-800 rounded-xl shadow-sm">
          <div class="text-4xl font-bold text-primary-500 mb-2">۱۲۰۰+</div>
          <div class="text-muted-600 dark:text-muted-300">تولیدکننده</div>
        </div>
        <div class="text-center p-6 bg-white dark:bg-muted-800 rounded-xl shadow-sm">
          <div class="text-4xl font-bold text-success-500 mb-2">۸۵۰+</div>
          <div class="text-muted-600 dark:text-muted-300">توزیع‌کننده</div>
        </div>
        <div class="text-center p-6 bg-white dark:bg-muted-800 rounded-xl shadow-sm">
          <div class="text-4xl font-bold text-info-500 mb-2">۵۰۰۰+</div>
          <div class="text-muted-600 dark:text-muted-300">خریدار فعال</div>
        </div>
        <div class="text-center p-6 bg-white dark:bg-muted-800 rounded-xl shadow-sm">
          <div class="text-4xl font-bold text-warning-500 mb-2">۴۲۰+</div>
          <div class="text-muted-600 dark:text-muted-300">شهر فعال</div>
        </div>
      </div>
    </BaseCard>
    
    
  </div>
</template>