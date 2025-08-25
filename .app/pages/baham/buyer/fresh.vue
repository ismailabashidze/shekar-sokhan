<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'خوش آمدید - با هم',
  layout: 'sidebar',
})

useHead({
  title: 'خوش آمدید - با هم',
  meta: [
    { name: 'description', content: 'صفحه خوش آمدگویی کاربران تازه ثبت نام کرده در پلتفرم با هم' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

const router = useRouter()

// For new users, we'll show zero stats initially
const stats = ref({
  totalOrders: 0,
  pendingOrders: 0,
  totalSpent: 0,
  savedAmount: 0,
  favoriteProducts: 0
})

const avgOrderValue = computed(() => {
  if (stats.value.totalOrders === 0) return 0
  return Math.round(stats.value.totalSpent / stats.value.totalOrders)
})

const quickActions = [
  { id: 1, title: 'ثبت اولین سفارش', icon: 'ph:shopping-cart', color: 'primary', action: () => router.push('/baham/buyer/marketplace') },
  { id: 2, title: 'راهنمای استفاده', icon: 'ph:book-open', color: 'info', action: () => router.push('/baham/buyer/guide') },
  { id: 3, title: 'پرسش‌های متداول', icon: 'ph:question', color: 'success', action: () => router.push('/faq') },
  { id: 4, title: 'پشتیبانی', icon: 'ph:headset', color: 'warning', action: () => router.push('/baham/buyer/support') }
]

const recentOrders = ref([])
const activeLoads = ref([])

const statusTranslations = {
  pending: 'در انتظار',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده'
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'nui-tag nui-tag-md nui-tag-solid nui-tag-warning',
    processing: 'nui-tag nui-tag-md nui-tag-solid nui-tag-info',
    shipped: 'nui-tag nui-tag-md nui-tag-solid nui-tag-primary',
    completed: 'nui-tag nui-tag-md nui-tag-solid nui-tag-success',
    cancelled: 'nui-tag nui-tag-md nui-tag-solid nui-tag-danger'
  }
  return classes[status] || 'nui-tag nui-tag-md nui-tag-solid nui-tag-default'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
}

// Show welcome message for new users
const showWelcomeModal = ref(true)

const closeWelcomeModal = () => {
  showWelcomeModal.value = false
}

// Mark user as no longer new when they visit this page
onMounted(() => {
  // Set a flag in localStorage to indicate the user has visited the fresh dashboard
  localStorage.setItem('hasVisitedFreshDashboard', 'true')
})
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Modal for New Users -->
    <TairoModal
      :open="showWelcomeModal"
      size="lg"
      @close="closeWelcomeModal"
    >
      <template #header>
        <div class="flex w-full items-center justify-between p-4 sm:p-5">
          <div class="flex items-center gap-2">
            <div class="flex size-10 items-center justify-center rounded-full bg-primary-500/20 text-primary-500">
              <Icon name="ph:confetti" class="size-5" />
            </div>
            <h3 class="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              خوش آمدید!
            </h3>
          </div>
          <BaseButtonClose @click="closeWelcomeModal" />
        </div>
      </template>
      <div class="p-4 sm:p-5">
        <div class="text-center">
          <div class="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-500/10 text-primary-500 mb-4">
            <Icon name="ph:hand-heart-duotone" class="size-10" />
          </div>
          <BaseHeading tag="h2" size="xl" weight="bold" class="text-muted-800 dark:text-white mb-2">
            به خانواده با هم خوش آمدید!
          </BaseHeading>
          <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mb-6">
            از این که به پلتفرم ما پیوستید بسیار خرسندیم. در این صفحه می‌توانید با امکانات پلتفرم آشنا شوید و اولین سفارش خود را ثبت کنید.
          </BaseParagraph>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-primary-500/10 dark:bg-primary-500/20 rounded-xl p-4">
              <Icon name="ph:check-circle-duotone" class="size-8 text-primary-500 mx-auto mb-2" />
              <BaseHeading tag="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white mb-1">
                ثبت نام کامل شد
              </BaseHeading>
              <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                حساب کاربری شما با موفقیت ایجاد شد
              </BaseParagraph>
            </div>
            <div class="bg-success-500/10 dark:bg-success-500/20 rounded-xl p-4">
              <Icon name="ph:truck-duotone" class="size-8 text-success-500 mx-auto mb-2" />
              <BaseHeading tag="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white mb-1">
                تحویل سریع
              </BaseHeading>
              <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                سفارشات شما با حداقل زمان تحویل می‌شوند
              </BaseParagraph>
            </div>
            <div class="bg-warning-500/10 dark:bg-warning-500/20 rounded-xl p-4">
              <Icon name="ph:shield-check-duotone" class="size-8 text-warning-500 mx-auto mb-2" />
              <BaseHeading tag="h3" size="sm" weight="medium" class="text-muted-800 dark:text-white mb-1">
                تضمین کیفیت
              </BaseHeading>
              <BaseParagraph size="xs" class="text-muted-600 dark:text-muted-400">
                تمامی محصولات از کیفیت بالایی برخوردارند
              </BaseParagraph>
            </div>
          </div>
          
          <BaseButton 
            color="primary" 
            size="lg"
            rounded="lg"
            class="w-full"
            @click="closeWelcomeModal"
          >
            شروع به کار
          </BaseButton>
        </div>
      </div>
    </TairoModal>
    
    <!-- Welcome Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          پیشخوان خریدار
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          خوش آمدید! این صفحه مخصوص کاربران تازه ثبت نام کرده است
        </BaseParagraph>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton 
          color="primary" 
          size="lg"
          rounded="lg"
          @click="router.push('/baham/buyer/marketplace')"
        >
          <Icon name="ph:cart-plus" class="size-5 ml-2" />\n          ثبت اولین سفارش
        </BaseButton>
      </div>
    </div>

    <!-- Stats Overview - All zero for new users -->
    <div class="space-y-4">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
        آمار حساب شما
      </BaseHeading>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-primary-500/10 p-4">
              <Icon name="ph:box-open" class="size-7 text-primary-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                مجموع سفارشات
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ stats.totalOrders }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="primary" 
              rounded="lg"
              @click="router.push('/baham/buyer/marketplace')"
            >
              ثبت اولین سفارش
              <Icon name="ph:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-warning-500/10 p-4">
              <Icon name="ph:clock" class="size-7 text-warning-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                سفارشات در انتظار
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ stats.pendingOrders }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="warning" 
              rounded="lg"
              @click="router.push('/baham/buyer/marketplace')"
            >
              ثبت سفارش
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-success-500/10 p-4">
              <Icon name="fa6-solid:money-bill" class="size-7 text-success-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                مجموع خرج شده
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ formatCurrency(stats.totalSpent) }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="success" 
              rounded="lg"
              @click="router.push('/baham/buyer/marketplace')"
            >
              خرید اول
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-amber-500/10 p-4">
              <Icon name="fa6-solid:chart-line" class="size-7 text-amber-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                میانگین هزینه سفارش
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ formatCurrency(avgOrderValue) }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="amber" 
              rounded="lg"
              @click="router.push('/baham/buyer/marketplace')"
            >
              ثبت سفارش
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-info-500/10 p-4">
              <Icon name="fa6-solid:percent" class="size-7 text-info-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                صرفه‌جویی
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white flex items-center">
                {{ formatCurrency(stats.savedAmount) }}
                <Icon name="fa6-solid:chart-line" class="size-4 text-success-500 mr-2" />
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="info" 
              rounded="lg"
              @click="router.push('/baham/buyer/marketplace?sort=discount')"
            >
              تخفیف‌ها
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard rounded="lg" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center">
            <div class="rounded-xl bg-danger-500/10 p-4">
              <Icon name="fa6-solid:heart" class="size-7 text-danger-500" />
            </div>
            <div class="mr-5">
              <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-1">
                محصولات مورد علاقه
              </BaseParagraph>
              <BaseHeading tag="h3" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
                {{ stats.favoriteProducts }}
              </BaseHeading>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-muted-200 dark:border-muted-700">
            <BaseButton 
              size="sm" 
              variant="ghost" 
              color="danger" 
              rounded="lg"
              @click="router.push('/baham/buyer/marketplace')"
            >
              انتخاب علاقه‌مندی
              <Icon name="fa6-solid:arrow-left" class="size-3 mr-2" />
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Welcome Banner -->
    <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8 p-6">
        <div class="flex items-center gap-5">
          <BaseAvatar size="xl" initials="کاربر" color="primary" />
          <div>
            <BaseHeading tag="h2" size="xl" weight="bold" class="text-muted-800 dark:text-white mb-1">
              خوش آمدید!
            </BaseHeading>
            <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400">
              این اولین ورود شما به پلتفرم با هم است
            </BaseParagraph>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <BaseTag color="primary" variant="solid" size="lg">
            <Icon name="fa6-solid:user-plus" class="size-4 ml-2" />
            کاربر تازه
          </BaseTag>
          <BaseTag color="success" variant="solid" size="lg">
            <Icon name="fa6-solid:shield" class="size-4 ml-2" />
            حساب تأیید شده
          </BaseTag>
        </div>
      </div>
    </BaseCard>

    <!-- Quick Actions -->
    <div class="space-y-4">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
        عملیات سریع
      </BaseHeading>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <BaseCard
          v-for="action in quickActions"
          :key="action.id"
          rounded="lg"
          elevated
          class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 cursor-pointer hover:shadow-lg transition-all duration-300"
          @click="action.action"
        >
          <div class="text-center py-6">
            <div class="inline-flex items-center justify-center size-14 rounded-full bg-primary-500/10 text-primary-500 mb-4">
              <Icon :name="action.icon" class="size-7" />
            </div>
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              {{ action.title }}
            </BaseHeading>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Getting Started Guide -->
    <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
        راهنمای شروع
      </BaseHeading>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-5 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:book-open-duotone" class="size-6 text-primary-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              آموزش پلتفرم
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
            با نحوه استفاده از امکانات پلتفرم آشنا شوید.
          </BaseParagraph>
          <BaseButton 
            size="sm" 
            variant="solid" 
            color="primary" 
            rounded="lg"
            @click="router.push('/baham/buyer/guide')"
          >
            مشاهده آموزش
          </BaseButton>
        </div>
        <div class="p-5 bg-success-500/10 dark:bg-success-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:storefront-duotone" class="size-6 text-success-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              بازار محصولات
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
            محصولات کشاورزی موجود را مرور کنید.
          </BaseParagraph>
          <BaseButton 
            size="sm" 
            variant="solid" 
            color="success" 
            rounded="lg"
            @click="router.push('/baham/buyer/marketplace')"
          >
            مشاهده بازار
          </BaseButton>
        </div>
        <div class="p-5 bg-warning-500/10 dark:bg-warning-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:headset-duotone" class="size-6 text-warning-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
            پشتیبانی
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 mb-3">
            در صورت داشتن هرگونه سوال با ما در ارتباط باشید.
          </BaseParagraph>
          <BaseButton 
            size="sm" 
            variant="solid" 
            color="warning" 
            rounded="lg"
            @click="router.push('/baham/buyer/support')"
          >
            تماس با پشتیبانی
          </BaseButton>
        </div>
      </div>
    </BaseCard>
    
    <!-- Helpful Information -->
    <BaseCard rounded="xl" elevated class="dark:!bg-muted-900 border border-muted-200 dark:border-muted-700 p-6">
      <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
        اطلاعات مفید برای شروع
      </BaseHeading>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-5 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:lightbulb-duotone" class="size-6 text-primary-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              نکات خرید
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            برای خرید بهتر، از فیلترهای پیشرفته در بازار استفاده کنید و قیمت‌ها را مقایسه کنید.
          </BaseParagraph>
        </div>
        <div class="p-5 bg-success-500/10 dark:bg-success-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:truck-duotone" class="size-6 text-success-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              تحویل سفارشات
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            سفارشات شما معمولاً ظرف 24-48 ساعت تحویل داده می‌شوند.
          </BaseParagraph>
        </div>
        <div class="p-5 bg-warning-500/10 dark:bg-warning-500/20 rounded-xl">
          <div class="flex items-center mb-3">
            <Icon name="ph:percent-duotone" class="size-6 text-warning-500 ml-3" />
            <BaseHeading tag="h3" size="md" weight="medium" class="text-muted-800 dark:text-white">
              تخفیف‌ها
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
            برای دریافت تخفیف‌های ویژه، عضو کلاب با هم شوید.
          </BaseParagraph>
        </div>
      </div>
    </BaseCard>
    
    <!-- Navigation Links -->
    <div class="mt-10">
      <BuyerNavigation />
    </div>
  </div>
</template>