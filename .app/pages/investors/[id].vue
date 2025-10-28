<script setup lang="ts">
definePageMeta({
  title: 'جزئیات سرمایه‌گذار',
  layout: 'sidebar',
});

useHead({ htmlAttrs: { dir: 'rtl' } });

const route = useRoute();
const investorId = Number(route.params.id);

// Sample investors data - same as in list.vue
const investors = [
  {
    id: 1,
    name: 'علی محمدی',
    company: 'شرکت فناوری پیشرو',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    message: 'علاقه‌مند به سرمایه‌گذاری در حوزه هوش مصنوعی',
    created: '2025-04-15',
    // Additional details for detail page
    position: 'مدیرعامل',
    website: 'www.pishrotech.com',
    address: 'تهران، خیابان ولیعصر، برج نوآوری',
    investmentInterests: ['هوش مصنوعی', 'یادگیری ماشین', 'پردازش زبان طبیعی'],
    investmentRange: '۵۰۰ میلیون تا ۲ میلیارد تومان',
    status: 'در حال بررسی',
    notes: 'جلسه معارفه در تاریخ ۲۵ خرداد برگزار خواهد شد. آقای محمدی تجربه قبلی سرمایه‌گذاری در سه استارتاپ موفق را دارند.',
  },
  {
    id: 2,
    name: 'سارا احمدی',
    company: 'گروه سرمایه‌گذاری نوآفرین',
    email: 'sara.ahmadi@example.com',
    phone: '09187654321',
    message: 'تمایل به مشارکت در پروژه‌های استارتاپی حوزه سلامت',
    created: '2025-04-18',
    // Additional details for detail page
    position: 'مدیر سرمایه‌گذاری',
    website: 'www.noavarin.co',
    address: 'تهران، سعادت‌آباد، مجتمع تجاری اداری سروستان',
    investmentInterests: ['سلامت دیجیتال', 'تله‌مدیسین', 'فناوری‌های پوشیدنی سلامت'],
    investmentRange: '۱ تا ۵ میلیارد تومان',
    status: 'تأیید شده',
    notes: 'خانم احمدی علاقه‌مند به مشارکت در تیم مشاوران محصول نیز هستند. سابقه فعالیت در حوزه سلامت دیجیتال به مدت ۸ سال.',
  },
  {
    id: 3,
    name: 'رضا کریمی',
    company: 'هلدینگ توسعه فناوری',
    email: 'reza.karimi@example.com',
    phone: '09361234567',
    message: 'بررسی فرصت‌های سرمایه‌گذاری در حوزه تکنولوژی‌های جدید',
    created: '2025-04-22',
    // Additional details for detail page
    position: 'رئیس هیئت مدیره',
    website: 'www.techdev.ir',
    address: 'اصفهان، شهرک علمی تحقیقاتی، ساختمان فناوران',
    investmentInterests: ['اینترنت اشیا', 'واقعیت افزوده', 'بلاک‌چین'],
    investmentRange: '۳ تا ۱۰ میلیارد تومان',
    status: 'مذاکره',
    notes: 'آقای کریمی تمایل به سرمایه‌گذاری در استارتاپ‌های مرحله رشد را دارند. مایل به مشارکت در دوره شتابدهی نیستند.',
  },
  {
    id: 4,
    name: 'مریم حسینی',
    company: 'صندوق سرمایه‌گذاری خصوصی ایران',
    email: 'maryam.hosseini@example.com',
    phone: '09125678901',
    message: 'علاقه‌مند به مشارکت در پروژه‌های نوآورانه',
    created: '2025-05-01',
    // Additional details for detail page
    position: 'تحلیلگر سرمایه‌گذاری',
    website: 'www.ivcf.org',
    address: 'تهران، میدان آرژانتین، برج آرژانتین، طبقه ۱۵',
    investmentInterests: ['فین‌تک', 'پروژه‌های دانش‌بنیان', 'انرژی‌های تجدیدپذیر'],
    investmentRange: '۱ تا ۷ میلیارد تومان',
    status: 'در انتظار',
    notes: 'خانم حسینی نماینده صندوق هستند. نیاز به ارائه گزارش مالی و برنامه کسب و کار دقیق دارند.',
  },
  {
    id: 5,
    name: 'امیر رضایی',
    company: 'گروه توسعه کسب و کار نوین',
    email: 'amir.rezaei@example.com',
    phone: '09352345678',
    message: 'جستجوی فرصت‌های سرمایه‌گذاری در استارتاپ‌های مرحله رشد',
    created: '2025-05-10',
    // Additional details for detail page
    position: 'مدیر توسعه کسب و کار',
    website: 'www.novindev.co',
    address: 'مشهد، بلوار سجاد، مجتمع تجاری آرمان',
    investmentInterests: ['تجارت الکترونیک', 'لجستیک و حمل و نقل هوشمند', 'گردشگری دیجیتال'],
    investmentRange: '۲ تا ۸ میلیارد تومان',
    status: 'مذاکره',
    notes: 'آقای رضایی علاقه‌مند به همکاری با تیم‌های دارای محصول و با رشد قابل توجه هستند. تخصص در بازاریابی و توسعه بازار دارند.',
  },
];

// Find the investor by id
const investor = computed(() => {
  return investors.find(i => i.id === investorId) || null;
});

// For navigation
const router = useRouter();

// Status color mapping
const statusColors = {
  'در حال بررسی': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'تأیید شده': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'مذاکره': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'در انتظار': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'رد شده': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

// Handle 404
if (!investor.value) {
  router.push('/investors/list');
}
</script>

<template>
  <div v-if="investor">
    <BasePageHeading
      :title="investor.name"
      :subtitle="investor.company"
    >
      <template #pageTitle>
        <div class="flex items-center">
          <Icon name="ph:user-duotone" class="text-primary-500 me-2 size-6" />
          <span>{{ investor.name }}</span>
        </div>
      </template>
    </BasePageHeading>

    <div class="pb-20">
      <!-- Action Bar -->
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink
          to="/investors/list"
          class="bg-muted-100 dark:bg-muted-700 hover:bg-muted-200 dark:hover:bg-muted-600 flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-300"
        >
          <Icon name="ph:arrow-right-duotone" class="size-5" />
          <span class="text-muted-500">بازگشت به لیست</span>
        </NuxtLink>

        <div class="flex gap-3">
          <button class="bg-primary-500 hover:bg-primary-600 flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors duration-300">
            <Icon name="ph:envelope-duotone" class="size-5" />
            <span>ارسال ایمیل</span>
          </button>
          <button class="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-emerald-600">
            <Icon name="ph:phone-duotone" class="size-5" />
            <span>تماس</span>
          </button>
        </div>
      </div>

      <!-- Investor Information -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Main Information Card -->
        <BaseCard class="md:col-span-2">
          <div class="border-muted-200 dark:border-muted-700 flex items-center justify-between border-b p-6">
            <h3 class="text-muted-800 text-lg font-bold dark:text-white">
              اطلاعات سرمایه‌گذار
            </h3>
            <span
              :class="[
                'rounded-full px-3 py-1 text-sm',
                statusColors[investor.status] || 'bg-muted-100 text-muted-800 dark:bg-muted-700 dark:text-muted-200'
              ]"
            >
              {{ investor.status }}
            </span>
          </div>

          <div class="p-6">
            <div class="grid gap-y-6 md:grid-cols-2 md:gap-x-6">
              <!-- Name -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  نام
                </h4>
                <p class="text-muted-800 dark:text-muted-100">
                  {{ investor.name }}
                </p>
              </div>

              <!-- Company -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  شرکت
                </h4>
                <p class="text-muted-800 dark:text-muted-100">
                  {{ investor.company }}
                </p>
              </div>

              <!-- Position -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  سمت
                </h4>
                <p class="text-muted-800 dark:text-muted-100">
                  {{ investor.position }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  ایمیل
                </h4>
                <a
                  :href="`mailto:${investor.email}`"
                  class="text-primary-500 hover:text-primary-600 transition-colors"
                >
                  {{ investor.email }}
                </a>
              </div>

              <!-- Phone -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  تلفن
                </h4>
                <a
                  :href="`tel:${investor.phone}`"
                  class="text-primary-500 hover:text-primary-600 transition-colors"
                >
                  {{ investor.phone }}
                </a>
              </div>

              <!-- Website -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  وب‌سایت
                </h4>
                <a
                  :href="`https://${investor.website}`"
                  target="_blank"
                  class="text-primary-500 hover:text-primary-600 transition-colors"
                >
                  {{ investor.website }}
                </a>
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  آدرس
                </h4>
                <p class="text-muted-800 dark:text-muted-100">
                  {{ investor.address }}
                </p>
              </div>

              <!-- Created Date -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  تاریخ ثبت
                </h4>
                <p class="text-muted-800 dark:text-muted-100">
                  {{ investor.created }}
                </p>
              </div>

              <!-- Investment Range -->
              <div>
                <h4 class="text-muted-400 mb-2 text-sm font-medium">
                  محدوده سرمایه‌گذاری
                </h4>
                <p class="text-muted-800 dark:text-muted-100">
                  {{ investor.investmentRange }}
                </p>
              </div>
            </div>

            <!-- Investment Interests -->
            <div class="mt-6">
              <h4 class="text-muted-400 mb-2 text-sm font-medium">
                علاقه‌مندی‌های سرمایه‌گذاری
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="interest in investor.investmentInterests"
                  :key="interest"
                  class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full px-3 py-1 text-sm"
                >
                  {{ interest }}
                </span>
              </div>
            </div>

            <!-- Message -->
            <div class="mt-6">
              <h4 class="text-muted-400 mb-2 text-sm font-medium">
                پیام
              </h4>
              <div class="bg-muted-100 dark:bg-muted-700 rounded-lg p-4">
                <p class="text-muted-800 dark:text-muted-100">
                  {{ investor.message }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Notes Card -->
        <BaseCard>
          <div class="border-muted-200 dark:border-muted-700 border-b p-6">
            <h3 class="text-muted-800 text-lg font-bold dark:text-white">
              یادداشت‌ها
            </h3>
          </div>

          <div class="p-6">
            <div class="bg-muted-100 dark:bg-muted-700 rounded-lg p-4">
              <p class="text-muted-800 dark:text-muted-100 whitespace-pre-line">
                {{ investor.notes }}
              </p>
            </div>

            <!-- Add New Note Form -->
            <div class="mt-6">
              <h4 class="text-muted-400 mb-2 text-sm font-medium">
                افزودن یادداشت جدید
              </h4>
              <textarea
                class="text-muted-600 dark:text-muted-200 placeholder:text-muted-300 dark:placeholder:text-muted-500 border-muted-300 dark:border-muted-700 dark:bg-muted-900 focus:border-primary-500 min-h-[120px] w-full rounded-lg border bg-white p-3 transition-colors duration-300 focus:outline-none"
                placeholder="یادداشت خود را وارد کنید..."
              />
              <button class="bg-primary-500 hover:bg-primary-600 mt-3 rounded-lg px-4 py-2 text-white transition-colors duration-300">
                ذخیره یادداشت
              </button>
            </div>
          </div>
        </BaseCard>

        <!-- Activity Timeline Card -->
        <BaseCard class="md:col-span-3">
          <div class="border-muted-200 dark:border-muted-700 border-b p-6">
            <h3 class="text-muted-800 text-lg font-bold dark:text-white">
              تاریخچه فعالیت‌ها
            </h3>
          </div>

          <div class="p-6">
            <div class="relative">
              <!-- Timeline -->
              <div class="border-primary-500 absolute inset-0 mr-5 border-l-2 border-dashed" />

              <!-- Timeline Items -->
              <div class="space-y-8">
                <div class="relative flex">
                  <div class="bg-primary-500 z-10 mr-3 mt-0.5 size-4 rounded-full" />
                  <div class="dark:bg-muted-800 flex-1 rounded-lg bg-white p-4 shadow-md">
                    <div class="mb-2 flex items-center justify-between">
                      <h4 class="text-muted-800 font-medium dark:text-white">
                        ثبت درخواست سرمایه‌گذاری
                      </h4>
                      <span class="text-muted-400 text-sm">{{ investor.created }}</span>
                    </div>
                    <p class="text-muted-500 text-sm">
                      {{ investor.name }} درخواست سرمایه‌گذاری را ثبت کرد.
                    </p>
                  </div>
                </div>

                <div class="relative flex">
                  <div class="bg-primary-500 z-10 mr-3 mt-0.5 size-4 rounded-full" />
                  <div class="dark:bg-muted-800 flex-1 rounded-lg bg-white p-4 shadow-md">
                    <div class="mb-2 flex items-center justify-between">
                      <h4 class="text-muted-800 font-medium dark:text-white">
                        بررسی اولیه
                      </h4>
                      <span class="text-muted-400 text-sm">{{ new Date(new Date(investor.created).getTime() + 2*24*60*60*1000).toISOString().split('T')[0] }}</span>
                    </div>
                    <p class="text-muted-500 text-sm">
                      تیم سرمایه‌گذاری، درخواست را بررسی اولیه کرد.
                    </p>
                  </div>
                </div>

                <div class="relative flex">
                  <div class="bg-primary-500 z-10 mr-3 mt-0.5 size-4 rounded-full" />
                  <div class="dark:bg-muted-800 flex-1 rounded-lg bg-white p-4 shadow-md">
                    <div class="mb-2 flex items-center justify-between">
                      <h4 class="text-muted-800 font-medium dark:text-white">
                        وضعیت: {{ investor.status }}
                      </h4>
                      <span class="text-muted-400 text-sm">{{ new Date(new Date(investor.created).getTime() + 5*24*60*60*1000).toISOString().split('T')[0] }}</span>
                    </div>
                    <p class="text-muted-500 text-sm">
                      وضعیت درخواست به "{{ investor.status }}" تغییر یافت.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
