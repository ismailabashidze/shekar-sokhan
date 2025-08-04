<script setup lang="ts">
definePageMeta({
  title: 'قیمت‌گذاری همسیر',
  preview: {
    title: 'Hammasir Pricing',
    description: 'Pricing plans for Hammasir counseling services',
    categories: ['pricing'],
    src: '/img/screens/pricing-hammasir.png',
    srcDark: '/img/screens/pricing-hammasir-dark.png',
    order: 5,
  },
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const pricingPlans = [
  {
    id: 'basic',
    name: 'بسته پایه',
    subtitle: 'برای شروع مسیر خودشناسی',
    price: 450000,
    originalPrice: 650000,
    duration: '2 ماه',
    popular: false,
    description: 'شامل آزمون‌های اولیه و راهنمایی‌های پایه',
    features: [
      'آزمون شخصیت NEO (کامل)',
      'تحلیل اولیه شخصیت',
      'دسترسی به آزمون‌های روان‌شناختی',
      '1 جلسه مشاوره آنلاین',
      'پشتیبانی تلگرامی',
      'دسترسی 2 ماهه'
    ],
    notIncluded: [
      'دوره‌های تخصصی',
      'مشاوره حضوری',
      'همسان‌یابی پیشرفته'
    ],
    badge: null,
    color: 'blue'
  },
  {
    id: 'standard',
    name: 'بسته استاندارد',
    subtitle: 'برای توسعه جدی مهارت‌های فردی',
    price: 850000,
    originalPrice: 1200000,
    duration: '4 ماه',
    popular: true,
    description: 'شامل دوره‌های آموزشی و مشاوره تخصصی',
    features: [
      'همه امکانات بسته پایه',
      'دوره مدیریت هیجانات (13 جلسه)',
      'آزمون‌های تخصصی (Cattell, Glasser)',
      '4 جلسه مشاوره تخصصی',
      'تحلیل عمیق شخصیت',
      'برنامه شخصی‌سازی شده',
      'پشتیبانی اولویت‌دار',
      'دسترسی 4 ماهه'
    ],
    notIncluded: [
      'همسان‌یابی پیشرفته',
      'مشاوره نامحدود'
    ],
    badge: 'محبوب‌ترین',
    color: 'purple'
  },
  {
    id: 'premium',
    name: 'بسته حرفه‌ای',
    subtitle: 'برای آمادگی کامل ازدواج',
    price: 1450000,
    originalPrice: 2000000,
    duration: '6 ماه',
    popular: false,
    description: 'شامل همسان‌یابی هوشمند و مشاوره نامحدود',
    features: [
      'همه امکانات بسته استاندارد',
      'همسان‌یابی هوشمند',
      'مشاوره نامحدود (تا 12 جلسه)',
      'آزمون آمادگی ازدواج',
      'تحلیل سازگاری مالی',
      'برنامه‌ریزی زندگی زناشویی',
      'پشتیبانی 24/7',
      'ضمانت بازگشت وجه',
      'دسترسی 6 ماهه'
    ],
    notIncluded: [],
    badge: 'پیشرفته',
    color: 'emerald'
  }
]

const paymentMethods = [
  {
    id: 'bank_transfer',
    name: 'انتقال بانکی مستقیم',
    description: 'انتقال وجه به حساب بانکی (فعال)',
    icon: 'ph:bank',
    available: true,
    processingTime: 'فوری تا 2 ساعت',
    fee: 'بدون کارمزد',
    details: {
      bankName: 'بانک ملی ایران',
      accountNumber: '1234567890123456',
      cardNumber: '6274-1211-2345-6789',
      accountHolder: 'شرکت فناوری ذهنا'
    }
  },
  {
    id: 'gateway',
    name: 'درگاه پرداخت اینترنتی',
    description: 'پرداخت آنلاین با کارت‌های بانکی (به‌زودی)',
    icon: 'ph:credit-card',
    available: false,
    processingTime: 'فوری',
    fee: 'کارمزد درگاه',
    comingSoon: true
  }
]

const selectedPlan = ref(null)
const selectedPaymentMethod = ref('bank_transfer')
const showPaymentModal = ref(false)
const orderStep = ref(1) // 1: انتخاب بسته، 2: اطلاعات، 3: پرداخت

const orderForm = ref({
  fullName: '',
  phoneNumber: '',
  email: '',
  agreement: false
})

function selectPlan(plan) {
  selectedPlan.value = plan
  showPaymentModal.value = true
  orderStep.value = 2
}

function getDiscountPercentage(original, current) {
  return Math.round(((original - current) / original) * 100)
}

function formatPrice(price) {
  return new Intl.NumberFormat('fa-IR').format(price)
}

function proceedToPayment() {
  if (!orderForm.value.agreement) {
    alert('لطفاً قوانین و مقررات را مطالعه و تأیید کنید')
    return
  }
  orderStep.value = 3
}

function submitOrder() {
  // برای MVP - نمایش اطلاعات انتقال بانکی
  alert('سفارش شما ثبت شد. اطلاعات انتقال بانکی نمایش داده خواهد شد.')
  // در آینده: ارسال به API برای ثبت سفارش
}

function closeModal() {
  showPaymentModal.value = false
  orderStep.value = 1
  selectedPlan.value = null
  orderForm.value = {
    fullName: '',
    phoneNumber: '',
    email: '',
    agreement: false
  }
}

const benefits = [
  {
    icon: 'ph:shield-check',
    title: 'تضمین کیفیت',
    description: 'ضمانت بازگشت وجه در صورت عدم رضایت'
  },
  {
    icon: 'ph:users-three',
    title: 'روان‌شناسان متخصص',
    description: 'مشاوره با بهترین متخصصان کشور'
  },
  {
    icon: 'ph:clock',
    title: 'پشتیبانی 24/7',
    description: 'پاسخگویی در تمام ساعات شبانه‌روز'
  },
  {
    icon: 'ph:chart-line-up',
    title: 'پیشرفت قابل اندازه‌گیری',
    description: 'رصد دقیق پیشرفت در تمام مراحل'
  }
]

const faqs = [
  {
    question: 'آیا می‌توانم بسته‌ام را تغییر دهم؟',
    answer: 'بله، تا 7 روز پس از خرید امکان تغییر بسته وجود دارد.'
  },
  {
    question: 'مدت زمان دسترسی چقدر است؟',
    answer: 'بسته به نوع بسته انتخابی، از 2 تا 6 ماه دسترسی خواهید داشت.'
  },
  {
    question: 'آیا امکان بازپرداخت وجود دارد؟',
    answer: 'در صورت عدم رضایت تا 14 روز پس از خرید، کل مبلغ بازگردانده می‌شود.'
  },
  {
    question: 'چطور به مشاور دسترسی پیدا کنم؟',
    answer: 'پس از خرید، از طریق پنل کاربری می‌توانید جلسه رزرو کنید.'
  }
]

const openFaq = ref(null)

function toggleFaq(index) {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 p-1 shadow-2xl shadow-purple-500/25 mb-12">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
      <div class="relative rounded-3xl bg-gradient-to-br from-purple-600/90 via-blue-700/90 to-indigo-800/90 backdrop-blur-xl px-8 py-16">
        <!-- Floating decorative elements -->
        <div class="absolute top-8 right-12 w-24 h-24 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-12 left-16 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div class="relative text-center max-w-4xl mx-auto">
          <BaseHeading
            as="h1"
            size="5xl"
            weight="bold"
            lead="tight"
            class="text-white drop-shadow-lg mb-6"
          >
            <span class="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              قیمت‌گذاری همسیر
            </span>
          </BaseHeading>
          
          <BaseParagraph class="text-white/90 text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            <span>
              بسته‌های مختلفی برای مسیر خودشناسی و آمادگی ازدواج شما طراحی کرده‌ایم. 
              بسته مناسب خود را انتخاب کنید و مسیر رشد شخصی خود را آغاز کنید.
            </span>
          </BaseParagraph>

          <!-- Quick Stats -->
          <div class="flex justify-center gap-8 text-center">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div class="text-2xl font-bold text-white mb-1">+1000</div>
              <div class="text-white/80 text-sm">کاربر موفق</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div class="text-2xl font-bold text-white mb-1">95%</div>
              <div class="text-white/80 text-sm">رضایت کاربران</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div class="text-2xl font-bold text-white mb-1">24/7</div>
              <div class="text-white/80 text-sm">پشتیبانی</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Plans -->
    <div class="mb-16">
      <div class="text-center mb-12">
        <BaseHeading as="h2" size="3xl" weight="bold" class="text-gray-900 dark:text-white mb-4">
          <span>بسته‌های خدماتی</span>
        </BaseHeading>
        <BaseParagraph class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          <span>بسته مناسب نیاز و بودجه خود را انتخاب کنید</span>
        </BaseParagraph>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="plan in pricingPlans" 
          :key="plan.id"
          class="relative group"
        >
          <!-- Popular badge -->
          <div 
            v-if="plan.popular"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              {{ plan.badge }}
            </div>
          </div>

          <div 
            class="relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 group-hover:shadow-2xl"
            :class="{
              'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200': plan.color === 'blue',
              'bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300': plan.color === 'purple',
              'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-300': plan.color === 'emerald'
            }"
          >
            <!-- Background decorations -->
            <div class="absolute top-0 right-0 w-32 h-32 opacity-20 blur-2xl"
              :class="{
                'bg-gradient-to-br from-blue-400 to-indigo-500': plan.color === 'blue',
                'bg-gradient-to-br from-purple-400 to-pink-500': plan.color === 'purple',
                'bg-gradient-to-br from-emerald-400 to-teal-500': plan.color === 'emerald'
              }"
            ></div>
            
            <div class="relative p-8">
              <!-- Plan Header -->
              <div class="text-center mb-8">
                <BaseHeading as="h3" size="xl" weight="bold" class="text-gray-900 dark:text-white mb-2">
                  <span>{{ plan.name }}</span>
                </BaseHeading>
                <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-300 mb-4">
                  <span>{{ plan.subtitle }}</span>
                </BaseParagraph>
                
                <!-- Price -->
                <div class="mb-6">
                  <div class="flex items-center justify-center gap-3 mb-2">
                    <div class="text-4xl font-bold text-gray-900 dark:text-white">
                      {{ formatPrice(plan.price) }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      تومان
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-center gap-2 mb-2">
                    <span class="text-lg text-gray-500 dark:text-gray-400 line-through">
                      {{ formatPrice(plan.originalPrice) }}
                    </span>
                    <div class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {{ getDiscountPercentage(plan.originalPrice, plan.price) }}% تخفیف
                    </div>
                  </div>
                  
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ plan.duration }}
                  </div>
                </div>
                
                <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-300">
                  <span>{{ plan.description }}</span>
                </BaseParagraph>
              </div>

              <!-- Features -->
              <div class="mb-8">
                <div class="space-y-4">
                  <div 
                    v-for="feature in plan.features" 
                    :key="feature"
                    class="flex items-start gap-3"
                  >
                    <div class="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      :class="{
                        'bg-blue-500': plan.color === 'blue',
                        'bg-purple-500': plan.color === 'purple',
                        'bg-emerald-500': plan.color === 'emerald'
                      }"
                    >
                      <Icon name="ph:check" class="w-3 h-3 text-white" />
                    </div>
                    <span class="text-sm text-gray-700 dark:text-gray-200 font-medium">{{ feature }}</span>
                  </div>
                  
                  <!-- Not included features -->
                  <div 
                    v-for="notIncluded in plan.notIncluded" 
                    :key="notIncluded"
                    class="flex items-start gap-3 opacity-50"
                  >
                    <div class="flex-shrink-0 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center mt-0.5">
                      <Icon name="ph:x" class="w-3 h-3 text-white" />
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ notIncluded }}</span>
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <BaseButton 
                @click="selectPlan(plan)"
                class="w-full relative overflow-hidden group transition-all duration-300 hover:scale-105"
                :class="{
                  'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/25': plan.color === 'blue',
                  'bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white shadow-lg shadow-purple-500/25': plan.color === 'purple',
                  'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-500/25': plan.color === 'emerald'
                }"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span class="relative z-10 font-bold">انتخاب بسته {{ plan.name }}</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="mb-16">
      <div class="text-center mb-12">
        <BaseHeading as="h2" size="3xl" weight="bold" class="text-gray-900 dark:text-white mb-4">
          <span>مزایای همسیر</span>
        </BaseHeading>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="benefit in benefits" 
          :key="benefit.title"
          class="group text-center"
        >
          <div class="relative mb-6">
            <div class="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-all duration-300">
              <Icon :name="benefit.icon" class="w-8 h-8 text-white" />
            </div>
          </div>
          <BaseHeading as="h3" size="md" weight="semibold" class="text-gray-900 dark:text-white mb-3">
            <span>{{ benefit.title }}</span>
          </BaseHeading>
          <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-300">
            <span>{{ benefit.description }}</span>
          </BaseParagraph>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="mb-16">
      <div class="text-center mb-12">
        <BaseHeading as="h2" size="3xl" weight="bold" class="text-gray-900 dark:text-white mb-4">
          <span>سوالات متداول</span>
        </BaseHeading>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 text-right flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BaseHeading as="h4" size="md" weight="medium" class="text-gray-900 dark:text-white">
                <span>{{ faq.question }}</span>
              </BaseHeading>
              <Icon 
                :name="openFaq === index ? 'ph:minus' : 'ph:plus'" 
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': openFaq === index }"
              />
            </button>
            <div 
              v-if="openFaq === index"
              class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <BaseParagraph class="text-gray-600 dark:text-gray-300">
                <span>{{ faq.answer }}</span>
              </BaseParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <TairoModal :open="showPaymentModal" size="xl" @close="closeModal">
      <template #header>
        <div class="flex items-center justify-between">
          <BaseHeading as="h3" size="lg" weight="semibold" class="text-gray-900 dark:text-white">
            <span v-if="orderStep === 1">انتخاب بسته</span>
            <span v-else-if="orderStep === 2">تکمیل اطلاعات</span>
            <span v-else>پرداخت نهایی</span>
          </BaseHeading>
          <BaseButton @click="closeModal" variant="ghost" size="sm">
            <Icon name="ph:x" class="w-5 h-5" />
          </BaseButton>
        </div>
      </template>

      <div class="p-6">
        <!-- Step 2: Order Information -->
        <div v-if="orderStep === 2">
          <div class="mb-6">
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200/50">
              <div class="flex items-center justify-between mb-4">
                <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-900 dark:text-white">
                  <span>{{ selectedPlan?.name }}</span>
                </BaseHeading>
                <div class="text-2xl font-bold text-purple-600">
                  {{ formatPrice(selectedPlan?.price) }} تومان
                </div>
              </div>
              <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-300">
                <span>{{ selectedPlan?.description }}</span>
              </BaseParagraph>
            </div>
          </div>

          <form @submit.prevent="proceedToPayment">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <BaseInput
                v-model="orderForm.fullName"
                label="نام و نام خانوادگی"
                placeholder="نام کامل خود را وارد کنید"
                required
              />
              <BaseInput
                v-model="orderForm.phoneNumber"
                label="شماره تماس"
                placeholder="09123456789"
                type="tel"
                required
              />
            </div>
            
            <div class="mb-6">
              <BaseInput
                v-model="orderForm.email"
                label="ایمیل"
                placeholder="example@email.com"
                type="email"
                required
              />
            </div>

            <div class="mb-6">
              <label class="flex items-start gap-3">
                <BaseCheckbox v-model="orderForm.agreement" required />
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  <a href="#" class="text-purple-600 hover:underline">قوانین و مقررات</a> و 
                  <a href="#" class="text-purple-600 hover:underline">سیاست حفظ حریم خصوصی</a> 
                  را مطالعه کرده و با آن موافقم.
                </span>
              </label>
            </div>

            <div class="flex gap-4">
              <BaseButton @click="closeModal" variant="outline" class="flex-1">
                انصراف
              </BaseButton>
              <BaseButton type="submit" class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                ادامه پرداخت
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Step 3: Payment Methods -->
        <div v-if="orderStep === 3">
          <div class="mb-6">
            <BaseHeading as="h4" size="md" weight="semibold" class="text-gray-900 dark:text-white mb-4">
              <span>روش پرداخت</span>
            </BaseHeading>
            
            <div class="space-y-4">
              <div 
                v-for="method in paymentMethods" 
                :key="method.id"
                class="relative"
              >
                <label 
                  class="block cursor-pointer"
                  :class="{ 'opacity-50 cursor-not-allowed': !method.available }"
                >
                  <input 
                    v-model="selectedPaymentMethod" 
                    :value="method.id"
                    type="radio"
                    class="sr-only"
                    :disabled="!method.available"
                  />
                  <div 
                    class="border-2 rounded-2xl p-6 transition-all duration-200"
                    :class="selectedPaymentMethod === method.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'"
                  >
                    <div class="flex items-start gap-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon :name="method.icon" class="w-6 h-6 text-white" />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <BaseHeading as="h5" size="sm" weight="semibold" class="text-gray-900 dark:text-white">
                            <span>{{ method.name }}</span>
                          </BaseHeading>
                          <span v-if="method.comingSoon" class="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                            به‌زودی
                          </span>
                        </div>
                        <BaseParagraph size="sm" class="text-gray-600 dark:text-gray-300 mb-3">
                          <span>{{ method.description }}</span>
                        </BaseParagraph>
                        <div class="flex gap-4 text-xs text-gray-500">
                          <span>⏱ {{ method.processingTime }}</span>
                          <span>💰 {{ method.fee }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Bank Transfer Details -->
          <div v-if="selectedPaymentMethod === 'bank_transfer'" class="mb-6">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50">
              <BaseHeading as="h5" size="md" weight="semibold" class="text-gray-900 dark:text-white mb-4">
                <span>اطلاعات انتقال بانکی</span>
              </BaseHeading>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">بانک:</span>
                  <span class="text-gray-900 dark:text-white mr-2">{{ paymentMethods[0].details.bankName }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">صاحب حساب:</span>
                  <span class="text-gray-900 dark:text-white mr-2">{{ paymentMethods[0].details.accountHolder }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">شماره حساب:</span>
                  <span class="text-gray-900 dark:text-white mr-2 font-mono">{{ paymentMethods[0].details.accountNumber }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">شماره کارت:</span>
                  <span class="text-gray-900 dark:text-white mr-2 font-mono">{{ paymentMethods[0].details.cardNumber }}</span>
                </div>
              </div>

              <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200">
                <div class="flex items-start gap-2">
                  <Icon name="ph:info" class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div class="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>مهم:</strong> پس از انتقال وجه، رسید پرداخت را از طریق تلگرام یا ایمیل برای ما ارسال کنید تا حساب شما فعال شود.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="mb-6">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <BaseHeading as="h5" size="md" weight="semibold" class="text-gray-900 dark:text-white mb-4">
                <span>خلاصه سفارش</span>
              </BaseHeading>
              
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">بسته انتخابی:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedPlan?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">مبلغ اصلی:</span>
                  <span class="text-gray-500 line-through">{{ formatPrice(selectedPlan?.originalPrice) }} تومان</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">تخفیف:</span>
                  <span class="text-green-600 font-medium">{{ formatPrice(selectedPlan?.originalPrice - selectedPlan?.price) }} تومان</span>
                </div>
                <hr class="border-gray-200 dark:border-gray-700">
                <div class="flex justify-between text-lg font-bold">
                  <span class="text-gray-900 dark:text-white">مبلغ نهایی:</span>
                  <span class="text-purple-600">{{ formatPrice(selectedPlan?.price) }} تومان</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <BaseButton @click="orderStep = 2" variant="outline" class="flex-1">
              بازگشت
            </BaseButton>
            <BaseButton @click="submitOrder" class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              تأیید و ثبت سفارش
            </BaseButton>
          </div>
        </div>
      </div>
    </TairoModal>
  </div>
</template>

<style scoped>
/* Custom animations for pricing cards */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Hover effects */
.hover-scale {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Shimmer effect for buttons */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
</style>