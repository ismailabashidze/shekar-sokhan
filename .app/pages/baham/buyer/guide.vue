<script setup lang="ts">
definePageMeta({
  title: 'راهنمای استفاده - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'راهنمای استفاده - با هم',
  meta: [
    { name: 'description', content: 'راهنمای جامع استفاده از پلتفرم با هم برای خریداران' }
  ],
  htmlAttrs: { dir: 'rtl' }
})

const guideSections = [
  {
    id: 'dashboard',
    title: 'داشبورد',
    description: 'آشنایی با پیشخوان خریداران',
    icon: 'ph:house-duotone',
    content: `
      <p class="mb-3">داشبورد اصلی شما شامل دو نسخه است:</p>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">1. داشبورد خریداران تازه وارد</h4>
      <p class="mb-3">برای کاربرانی که اولین بار وارد سیستم می‌شوند:</p>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>خوشامدگویی و معرفی اجمالی پلتفرم</li>
        <li>آمار حساب (همه صفر برای کاربران جدید)</li>
        <li>عملیات سریع: ثبت اولین سفارش، آموزش استفاده، پرسش‌های متداول، پشتیبانی</li>
        <li>راهنمای شروع: آموزش پلتفرم، ارتباط با فروشندگان، پشتیبانی</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">2. داشبورد خریداران عادی</h4>
      <p class="mb-3">برای کاربرانی که قبلاً از سیستم استفاده کرده‌اند:</p>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>آمار کلی: تعداد کل سفارشات، سفارشات در انتظار، مجموع خرج شده، میانگین هزینه سفارش، صرفه‌جویی، محصولات مورد علافه</li>
        <li>عملیات سریع: ثبت سفارش جدید، مشاهده سفارشات، مشاهده محصولات، مشاهده پیام‌ها</li>
        <li>سفارشات اخیر</li>
        <li>بارهای فعال</li>
        <li>راهنمایی و اطلاعات مفید</li>
      </ul>
    `
  },
  {
    id: 'marketplace',
    title: 'بازار محصولات',
    description: 'نحوه جستجو و خرید محصولات',
    icon: 'ph:storefront-duotone',
    content: `
      <p class="mb-3">در صفحه بازار می‌توانید محصولات کشاورزی موجود را مرور کنید:</p>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">آمار بازار</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>تعداد بارهای فعال</li>
        <li>دسته‌بندی‌ها</li>
        <li>تعداد ارائه‌دهندگان</li>
        <li>میانگین قیمت</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">فیلترها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>جستجو بر اساس نام محصول، دسته‌بندی یا توضیحات</li>
        <li>فیلتر بر اساس دسته‌بندی</li>
        <li>فیلتر بر اساس محصول</li>
        <li>مرتب‌سازی بر اساس قیمت، موجودی یا تاریخ انقضا</li>
        <li>فیلتر بر اساس محدوده قیمت</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">لیست بارهای فعال</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>نام محصول</li>
        <li>دسته‌بندی</li>
        <li>قیمت به ازای هر کیلوگرم</li>
        <li>توضیحات</li>
        <li>موجودی</li>
        <li>تاریخ انقضا</li>
        <li>کد ارائه‌دهنده</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">بینش بازار</h4>
      <p>اطلاعات تحلیلی و آماری درباره روندهای بازار</p>
    `
  },
  {
    id: 'cart',
    title: 'سبد خرید',
    description: 'مدیریت محصولات انتخاب شده',
    icon: 'ph:shopping-cart-simple-duotone',
    content: `
      <p class="mb-3">در صفحه سبد خرید می‌توانید محصولات انتخابی خود را مدیریت کنید:</p>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">قابلیت‌ها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>مشاهده آیتم‌های موجود در سبد</li>
        <li>تغییر تعداد کیلوگرم هر محصول</li>
        <li>حذف آیتم از سبد</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">خلاصه سفارش</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>تعداد کل اقلام</li>
        <li>جمع کل</li>
        <li>هزینه ارسال (معمولاً رایگان)</li>
        <li>قابل پرداخت</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">سایر امکانات</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>اعمال کد تخفیف</li>
        <li>خرید ایمن (اطلاعات امنیتی)</li>
        <li>ادامه به پرداخت</li>
      </ul>
    `
  },
  {
    id: 'checkout',
    title: 'پرداخت',
    description: 'تکمیل فرآیند خرید',
    icon: 'ph:credit-card-duotone',
    content: `
      <p class="mb-3">صفحه پرداخت شامل مراحل تکمیل فرآیند خرید است:</p>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">اطلاعات تماس</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>نام</li>
        <li>نام خانوادگی</li>
        <li>تلفن همراه</li>
        <li>ایمیل</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">روش تحویل</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>تحویل مستقیم</li>
        <li>دریافت از توزیع‌کننده</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">زمان تحویل</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>صبح (۸ تا ۱۲ ظهر)</li>
        <li>بعد از ظهر (۱۲ تا ۱۸)</li>
        <li>تاریخ تحویل</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">آدرس تحویل</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>انتخاب از آدرس‌های ذخیره شده</li>
        <li>افزودن آدرس جدید</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">سایر بخش‌ها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>یادداشت سفارش (توضیحات برای فروشنده)</li>
        <li>خلاصه سفارش</li>
        <li>روش پرداخت: آنلاین یا در محل</li>
        <li>تأیید قوانین و مقررات</li>
        <li>پرداخت امن</li>
      </ul>
    `
  },
  {
    id: 'orders',
    title: 'سفارشات',
    description: 'پیگیری سفارشات ثبت شده',
    icon: 'ph:package-duotone',
    content: `
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">لیست سفارشات</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>مشاهده تمام سفارشات</li>
        <li>فیلتر بر اساس وضعیت (در انتظار، تأیید شده، ارسال شده، تحویل داده شده، لغو شده)</li>
        <li>جستجو در سفارشات</li>
        <li>آمار سفارشات: تعداد سفارشات در هر وضعیت</li>
        <li>جدول سفارشات شامل: شماره سفارش، تاریخ، آیتم‌ها، مبلغ، وضعیت، عملیات مشاهده جزئیات</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">جزئیات سفارش</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>وضعیت سفارش</li>
        <li>خط زمانی سفارش</li>
        <li>اطلاعات محصول</li>
        <li>اطلاعات سفارش</li>
        <li>اطلاعات پرداخت</li>
        <li>اطلاعات ارائه‌دهنده</li>
        <li>اطلاعات تحویل</li>
        <li>عملیات: ایجاد تیکت پشتیبانی، چاپ فاکتور، سفارش مجدد</li>
        <li>سفارشات مرتبط</li>
      </ul>
    `
  },
  {
    id: 'distributors',
    title: 'توزیع‌کنندگان',
    description: 'مدیریت ارتباط با توزیع‌کنندگان',
    icon: 'ph:truck-duotone',
    content: `
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">لیست توزیع‌کنندگان</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>مشاهده تمام توزیع‌کنندگان تأیید شده</li>
        <li>جستجو بر اساس نام شرکت یا منطقه خدمات</li>
        <li>لیست توزیع‌کنندگان شامل: نام شرکت، منطقه خدمات، اطلاعات تماس، وضعیت تأیید، امتیاز، تعداد سفارشات، تاریخ عضویت</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">جزئیات توزیع‌کننده</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>اطلاعات کلی توزیع‌کننده</li>
        <li>اطلاعات تماس</li>
        <li>آدرس و خدمات</li>
        <li>خدمات ارائه شده</li>
        <li>گواهی‌ها</li>
        <li>آمار عملکرد</li>
        <li>سفارشات اخیر</li>
        <li>نظرات کاربران</li>
        <li>اقدامات: درخواست اتصال، قطع اتصال، ارسال پیام</li>
      </ul>
    `
  },
  {
    id: 'wallet',
    title: 'کیف پول',
    description: 'مدیریت مالی و تراکنش‌ها',
    icon: 'ph:wallet-duotone',
    content: `
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">قابلیت‌ها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>مشاهده موجودی قابل استفاده</li>
        <li>مشاهده موجودی مسدود شده</li>
        <li>مشاهده مجموع پس‌انداز</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">شارژ کیف پول</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>وارد کردن مبلغ</li>
        <li>روش پرداخت: کارت بانکی، پرداخت دیجیتال، واریز بانکی</li>
        <li>شارژ سریع با مقادیر پیش‌فرض</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">تراکنش‌ها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>مشاهده آخرین تراکنش‌ها</li>
        <li>اطلاعات: تاریخ، شرح، مبلغ، موجودی</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">پس‌انداز</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>پس‌انداز این ماه</li>
        <li>میانگین ماهانه</li>
        <li>پیشرفت ماهانه</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">دیگر امکانات</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>مزایای کیف پول: پرداخت سریع، امنیت بالا، پس‌انداز</li>
        <li>امنیت کیف پول: احراز هویت دو مرحله‌ای، بیومتریک، تغییر رمز عبور</li>
        <li>پشتیبانی</li>
      </ul>
    `
  },
  {
    id: 'support',
    title: 'پشتیبانی',
    description: 'دریافت کمک و ارسال تیکت',
    icon: 'ph:headset-duotone',
    content: `
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">لیست تیکت‌ها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>آمار تیکت‌ها: مجموع، باز، در حال پیگیری، بسته</li>
        <li>فیلترها: جستجو، وضعیت، اولویت، دسته‌بندی</li>
        <li>جدول تیکت‌ها: موضوع، دسته‌بندی، اولویت، وضعیت، تاریخ ایجاد، آخرین به‌روزرسانی، واگذار شده به، عملیات</li>
        <li>اطلاعات تماس پشتیبانی: تلفن، ایمیل، چت آنلاین</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">ایجاد تیکت جدید</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>اطلاعات تیکت: موضوع، دسته‌بندی، اولویت، شماره سفارش، توضیحات، پیوست فایل</li>
        <li>راهنمای دسته‌بندی‌ها</li>
        <li>راهنمای اولویت‌ها</li>
        <li>راهنمایی: نحوه نوشتن تیکت مؤثر</li>
        <li>سؤالات متداول: زمان پاسخگویی، پیگیری وضعیت تیکت</li>
      </ul>
    `
  },
  {
    id: 'settings',
    title: 'تنظیمات',
    description: 'مدیریت حساب کاربری',
    icon: 'ph:gear-duotone',
    content: `
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">تنظیمات عمومی</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>اطلاعات شخصی: نام، نام خانوادگی، ایمیل، شماره تلفن</li>
        <li>تنظیمات سریع: مدیریت آدرس‌ها، تنظیمات اعلان‌ها</li>
        <li>امنیت حساب: تغییر رمز عبور، دو عاملی سازی</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">مدیریت آدرس‌ها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>افزودن آدرس جدید</li>
        <li>لیست آدرس‌های ذخیره شده</li>
        <li>مشاهده موقعیت روی نقشه</li>
        <li>ویرایش آدرس</li>
        <li>تنظیم به عنوان آدرس پیش‌فرض</li>
        <li>حذف آدرس</li>
      </ul>
      
      <h4 class="font-bold text-muted-800 dark:text-white mb-2">تنظیمات اعلان‌ها</h4>
      <ul class="list-disc pr-5 mb-4 space-y-2">
        <li>دسته‌بندی اعلان‌ها: سفارشات، پرداخت‌ها، پیشنهادات ویژه، پیام‌های سیستمی</li>
        <li>کانال‌های اعلان: اعلان‌های فشاری، ایمیل، پیامک</li>
        <li>فرکانس اعلان‌ها: فوری، روزانه، هفتگی</li>
        <li>عملیات: ذخیره تنظیمات، بازنشانی تنظیمات</li>
      </ul>
    `
  }
]

const activeSection = ref(guideSections[0].id)

const selectSection = (sectionId) => {
  activeSection.value = sectionId
}

const currentSection = computed(() => {
  return guideSections.find(section => section.id === activeSection.value)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon name="ph:book-open-duotone" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">راهنمای استفاده از سیستم</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">راهنمای جامع استفاده از پلتفرم با هم برای خریداران</p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm sticky top-6">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="ph:list-duotone" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              محتوای راهنما
            </h2>
          </div>
          <div class="p-4">
            <nav class="space-y-1">
              <a
                v-for="section in guideSections"
                :key="section.id"
                @click="selectSection(section.id)"
                :class="[
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-colors',
                  activeSection === section.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                ]"
              >
                <Icon :name="section.icon" class="h-5 w-5" />
                {{ section.title }}
              </a>
            </nav>
          </div>
        </BaseCard>
      </div>
      
      <!-- Main Content - Only show selected section -->
      <div class="lg:col-span-3">
        <BaseCard 
          :id="currentSection.id"
          rounded="xl" 
          class="dark:!bg-muted-900 shadow-sm"
        >
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Icon :name="currentSection.icon" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ currentSection.title }}</h2>
                <p class="text-gray-600 dark:text-gray-400">{{ currentSection.description }}</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="prose prose-gray dark:prose-invert max-w-none" v-html="currentSection.content"></div>
          </div>
        </BaseCard>
        
        <!-- Help and Support -->
        <BaseCard rounded="xl" class="dark:!bg-muted-900 shadow-sm mt-8">
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:items-center gap-6">
              <div class="flex-shrink-0">
                <div class="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-xl">
                  <Icon name="ph:headset-duotone" class="h-10 w-10 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div class="flex-grow">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">نیاز به کمک بیشتر دارید؟</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  اگر سؤالی دارید یا با مشکلی مواجه شده‌اید، می‌توانید با تیم پشتیبانی ما تماس بگیرید.
                </p>
                <BaseButton 
                  variant="solid" 
                  color="primary" 
                  size="lg"
                  rounded="lg"
                  @click="$router.push('/baham/buyer/support/new')"
                >
                  <Icon name="ph:plus-duotone" class="h-4 w-4 ml-2" />
                  ایجاد تیکت پشتیبانی
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(h4) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.prose :deep(p) {
  margin-bottom: 1rem;
}

.prose :deep(ul) {
  margin-bottom: 1.5rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}
</style>