<script setup lang="ts">
definePageMeta({
  title: 'خرید بسته - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const packId = route.params.packId

const packageInfo = ref({
  id: packId,
  name: 'بسته رشد کودک',
  description: 'برنامه جامع برای رشد سالم کودک',
  price: '1,200,000',
  originalPrice: '1,500,000',
  discount: '۲۰٪',
  sessions: 6,
  duration: '۲ ماه',
  features: [
    '۶ جلسه مشاوره تخصصی',
    'برنامه رشد ماهانه',
    'تحلیل رفتار کودک',
    'مشاوره ۲۴ ساعته',
    'دسترسی به منابع آموزشی',
  ],
})

const paymentMethods = ref([
  {
    id: 1,
    type: 'credit-card',
    name: 'کارت بانک ملی',
    number: '**** **** **** 1234',
    isDefault: true,
  },
  {
    id: 2,
    type: 'credit-card',
    name: 'کارت بانک صادرات',
    number: '**** **** **** 5678',
    isDefault: false,
  },
  {
    id: 3,
    type: 'wallet',
    name: 'کیف پول TogetherMama',
    balance: '1,250,000',
  },
])

const selectedPaymentMethod = ref(1)

const purchasePackage = () => {
  // Mock purchase functionality
  alert('بسته با موفقیت خریداری شد')
}
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink
        to="/togethermama/mother/packages"
        class="text-muted-400 hover:text-primary-500 mb-4 inline-flex items-center gap-2 font-sans font-medium transition-colors duration-300"
      >
        <Icon name="gg:arrow-long-right" class="size-5" />
        <span>بازگشت به بسته‌ها</span>
      </NuxtLink>
      
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-muted-800 dark:text-white"
      >
        خرید بسته
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        تکمیل خرید بسته {{ packageInfo.name }}
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Package Info -->
      <div class="lg:col-span-2">
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات بسته
          </BaseHeading>

          <div class="flex items-start gap-6">
            <div class="bg-primary-100 dark:bg-primary-500/20 flex size-16 items-center justify-center rounded-lg">
              <Icon name="ph:package-duotone" class="text-primary-500 size-8" />
            </div>
            
            <div class="flex-1">
              <BaseHeading as="h3" size="xl" weight="semibold" class="text-muted-800 dark:text-white mb-2">
                {{ packageInfo.name }}
              </BaseHeading>
              <BaseParagraph class="text-muted-600 dark:text-muted-300 mb-4">
                {{ packageInfo.description }}
              </BaseParagraph>
              
              <div class="mb-4 flex flex-wrap gap-2">
                <BaseTag color="primary" variant="pastel">
                  {{ packageInfo.sessions }} جلسه
                </BaseTag>
                <BaseTag color="muted" variant="pastel">
                  {{ packageInfo.duration }}
                </BaseTag>
              </div>
              
              <div class="space-y-2">
                <div
                  v-for="(feature, index) in packageInfo.features"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5" />
                  <span class="text-muted-600 dark:text-muted-300">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Payment Methods -->
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            روش پرداخت
          </BaseHeading>

          <div class="space-y-4">
            <BaseCard
              v-for="method in paymentMethods"
              :key="method.id"
              :class="[
                'cursor-pointer p-5 transition-all',
                selectedPaymentMethod === method.id
                  ? 'border-primary-500 ring-primary-500 ring-2'
                  : 'border-muted-200 dark:border-muted-700 border'
              ]"
              @click="selectedPaymentMethod = method.id"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <Icon 
                    :name="method.type === 'credit-card' ? 'ph:credit-card' : 'ph:wallet'" 
                    class="text-muted-500 size-6" 
                  />
                  <div>
                    <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                      {{ method.name }}
                    </BaseHeading>
                    <BaseParagraph class="text-muted-500 text-sm">
                      {{ method.type === 'credit-card' ? method.number : `موجودی: ${method.balance} تومان` }}
                    </BaseParagraph>
                  </div>
                </div>
                <BaseTag v-if="method.isDefault" color="success" variant="pastel" size="sm">
                  پیش‌فرض
                </BaseTag>
              </div>
            </BaseCard>
          </div>
        </BaseCard>
      </div>

      <!-- Order Summary -->
      <div>
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            خلاصه سفارش
          </BaseHeading>

          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-muted-500">قیمت بسته:</span>
              <span class="text-muted-500 line-through">{{ packageInfo.originalPrice }} تومان</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-muted-500">تخفیف ({{ packageInfo.discount }}):</span>
              <span class="text-success-500">-{{ (parseInt(packageInfo.originalPrice.replace(/,/g, '')) - parseInt(packageInfo.price.replace(/,/g, ''))).toLocaleString() }} تومان</span>
            </div>
            
            <div class="border-muted-200 dark:border-muted-700 my-2 border-t" />
            
            <div class="flex justify-between">
              <span class="text-muted-500">جمع کل:</span>
              <span class="text-xl font-bold">{{ packageInfo.price }} تومان</span>
            </div>
          </div>

          <div class="mt-6 rounded-lg bg-muted-50 p-4 dark:bg-muted-800">
            <BaseHeading as="h3" size="sm" weight="semibold" class="text-muted-800 dark:text-white mb-2">
              مزایای خرید بسته
            </BaseHeading>
            <ul class="space-y-2">
              <li class="flex items-start gap-2">
                <Icon name="ph:check" class="text-success-500 mt-0.5 size-4" />
                <span class="text-muted-500 text-sm">صرفه‌جویی {{ packageInfo.discount }} نسبت به جلسات تکی</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="ph:check" class="text-success-500 mt-0.5 size-4" />
                <span class="text-muted-500 text-sm">برنامه‌ریزی شده برای بهترین نتیجه</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="ph:check" class="text-success-500 mt-0.5 size-4" />
                <span class="text-muted-500 text-sm">پشتیبانی ویژه خریداران بسته</span>
              </li>
            </ul>
          </div>

          <BaseButton
            color="primary"
            size="lg"
            class="mt-6 w-full"
            @click="purchasePackage"
          >
            پرداخت و تکمیل خرید
          </BaseButton>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
