<template>
  <div class="from-primary-50 to-success-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br via-white">
    <!-- Header Section -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 20%, theme(colors.primary.400) 0%, transparent 50%), radial-gradient(circle at 80% 80%, theme(colors.success.400) 0%, transparent 50%), radial-gradient(circle at 40% 60%, theme(colors.blue.400) 0%, transparent 50%)" />
      </div>

      <div class="container relative mx-auto max-w-7xl px-4 py-12">
        <!-- Navigation Breadcrumb -->
        <div class="text-muted-600 dark:text-muted-400 mb-8 flex items-center gap-2 text-sm">
          <Icon name="ph:house" class="size-4" />
          <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
            خانه
          </NuxtLink>
          <Icon name="ph:caret-left" class="size-3" />
          <span class="text-primary-600 dark:text-primary-400 font-medium">دسته‌بندی‌های DSM-5</span>
        </div>

        <!-- Main Header -->
        <div class="mb-12 text-center">
          <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/80 px-6 py-3 shadow-lg backdrop-blur-sm">
            <div class="from-primary-500 to-primary-600 rounded-full bg-gradient-to-r p-2">
              <Icon name="ph:brain" class="size-6 text-white" />
            </div>
            <div class="text-right">
              <div class="text-muted-600 dark:text-muted-400 text-sm">
                راهنمای تشخیصی
              </div>
              <div class="text-muted-800 font-bold dark:text-white">
                دسته‌بندی‌های DSM-5
              </div>
            </div>
          </div>

          <h1 class="text-muted-800 mb-4 text-4xl font-bold leading-tight dark:text-white md:text-5xl">
            ۲۲ دسته‌بندی اختلالات روانی
          </h1>

          <p class="text-muted-600 dark:text-muted-400 mx-auto max-w-3xl text-lg leading-relaxed">
            راهنمای تشخیصی و آماری اختلالات روانی (DSM-5) شامل ۲۲ دسته‌بندی اصلی است که تمامی اختلالات روانی شناخته شده را پوشش می‌دهد.
          </p>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="container mx-auto max-w-7xl px-4 pb-12">
      <!-- Loading State -->
      <div v-if="loading" class="py-12 text-center">
        <div class="border-primary-500 mx-auto mb-4 size-12 animate-spin rounded-full border-2 border-t-transparent" />
        <p class="text-muted-600 dark:text-muted-400">
          در حال بارگذاری دسته‌بندی‌ها...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-12 text-center">
        <div class="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/20">
          <Icon name="ph:warning" class="mx-auto mb-4 size-12 text-red-500" />
          <h3 class="mb-2 text-xl font-bold text-red-800 dark:text-red-200">
            خطا در بارگذاری
          </h3>
          <p class="mb-4 text-red-600 dark:text-red-400">
            {{ error }}
          </p>

          <!-- Link to category generation if no data found -->
          <div v-if="error.includes('ایجاد نشده')" class="mt-4">
            <NuxtLink
              to="/diagnosis/category-generate"
              class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              <Icon name="ph:plus" class="size-4" />
              رفتن به صفحه تولید دسته‌بندی‌ها
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(category, index) in dsmCategories"
          :key="category.id || index"
          class="dark:bg-muted-800/90 dark:border-muted-700/50 group relative overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        >
          <!-- Category Image -->
          <div class="relative h-48 overflow-hidden">
            <div
              class="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
              :class="getCategoryGradient(index)"
            >
              <!-- Background Pattern -->
              <div class="absolute inset-0 opacity-20">
                <div class="absolute inset-0" style="background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)" />
              </div>

              <!-- Icon -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="rounded-full border border-white/30 bg-white/20 p-6 backdrop-blur-sm">
                  <Icon :name="category.icon || getCategoryIcon(index)" class="size-16 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>

          <!-- Category Content -->
          <div class="p-6">
            <!-- Category Title -->
            <h3 class="text-muted-800 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-3 text-xl font-bold transition-colors dark:text-white">
              {{ category.titleFa }}
            </h3>

            <!-- English Title -->
            <div class="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 mb-3 inline-block rounded-full px-2 py-1 text-xs">
              {{ category.titleEn }}
            </div>

            <!-- Description -->
            <!-- <p class="text-muted-600 dark:text-muted-400 text-sm leading-relaxed mb-4">
              {{ category.description }}
            </p> -->

            <!-- Examples -->
            <div v-if="category.disorders && category.disorders.length > 0" class="mb-4 space-y-2">
              <div class="text-muted-700 dark:text-muted-300 text-xs font-medium">
                نمونه‌هایی از اختلالات:
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="disorder in category.disorders.slice(0, 3)"
                  :key="disorder.code || disorder.titleFa"
                  class="bg-muted-100 dark:bg-muted-700 text-muted-700 dark:text-muted-300 rounded-full px-2 py-1 text-xs"
                >
                  {{ disorder.titleFa }}
                </span>
                <span
                  v-if="category.disorders.length > 3"
                  class="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full px-2 py-1 text-xs"
                >
                  +{{ category.disorders.length - 3 }} مورد دیگر
                </span>
              </div>
            </div>

            <!-- Learn More Button -->
            <button
              class="from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 w-full rounded-lg bg-gradient-to-r px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
              @click="handleLearnMore(index)"
            >
              <div class="flex items-center justify-center gap-2">
                <span>اطلاعات بیشتر</span>
                <Icon name="ph:arrow-left" class="size-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="mt-16">
        <div class="dark:bg-muted-800/80 dark:border-muted-700/50 mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
          <div class="mb-6 text-center">
            <Icon name="ph:info" class="text-primary-500 mx-auto mb-4 size-12" />
            <h2 class="text-muted-800 mb-2 text-2xl font-bold dark:text-white">
              درباره DSM-5
            </h2>
          </div>

          <div class="prose prose-muted dark:prose-invert max-w-none text-right">
            <p class="text-muted-600 dark:text-muted-400 leading-relaxed">
              <strong>راهنمای تشخیصی و آماری اختلالات روانی (DSM-5)</strong> استانداردی جهانی برای تشخیص اختلالات روانی است که توسط انجمن روانپزشکی آمریکا منتشر شده است. این راهنما شامل ۲۲ دسته‌بندی اصلی است که هر یک شامل چندین اختلال مشخص می‌باشد.
            </p>
            <p class="text-muted-600 dark:text-muted-400 mt-4 leading-relaxed">
              هر دسته‌بندی بر اساس ویژگی‌های مشترک، علل احتمالی، و الگوهای رفتاری مشابه طبقه‌بندی شده است. این طبقه‌بندی به متخصصان سلامت روان کمک می‌کند تا تشخیص دقیق‌تری ارائه داده و درمان مناسب‌تری برای بیماران خود انتخاب کنند.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDSMInfoGenerator } from '~/composables/useDSMInfoGenerator';

definePageMeta({
  layout: 'default',
  title: 'دسته‌بندی‌های DSM-5 | ذهنا',
});

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'دسته‌بندی‌های DSM-5 | ذهنا',
  meta: [
    { name: 'description', content: '۲۲ دسته‌بندی اصلی اختلالات روانی بر اساس راهنمای تشخیصی DSM-5 با توضیحات کامل' },
  ],
});

// Dynamic data fetching
const { fetchAllCategories } = useDSMInfoGenerator();

// State
const dsmCategories = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Load categories on mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('🔄 Starting to fetch categories...');
    const categories = await fetchAllCategories();

    if (categories && categories.length > 0) {
      dsmCategories.value = categories;
      console.log(`✅ Loaded ${categories.length} categories from database`);
    }
    else {
      // If no categories in database, show message
      console.warn('⚠️ No categories found in database');
      error.value = 'هنوز هیچ دسته‌بندی‌ای در پایگاه داده ایجاد نشده است. لطفاً ابتدا با استفاده از صفحه تولید دسته‌بندی‌ها، داده‌ها را ایجاد کنید.';
    }
  }
  catch (err: any) {
    console.error('❌ Error loading categories:', err);
    error.value = err.message || 'خطا در اتصال به پایگاه داده';
  }
  finally {
    loading.value = false;
  }
});

// Fallback static data (removed - using dynamic data)
const staticCategories = [
  {
    titleEn: 'Neurodevelopmental Disorders',
    titleFa: 'اختلالات نوروتکاملی',
    description: 'اختلالاتی که معمولاً در دوران کودکی شروع می‌شوند و بر رشد و عملکرد مغز تأثیر می‌گذارند.',
    examples: ['اختلال طیف اوتیسم', 'ADHD', 'اختلالات یادگیری'],
  },
  {
    titleEn: 'Schizophrenia Spectrum and Other Psychotic Disorders',
    titleFa: 'طیف اسکیزوفرنی و سایر اختلالات روان‌پریشی',
    description: 'اختلالاتی که با عوارض روان‌پریشانه مانند توهمات، هذیان‌ها و تفکر غیرمنظم مشخص می‌شوند.',
    examples: ['اسکیزوفرنی', 'اختلال هذیانی', 'اختلال روان‌پریشی کوتاه'],
  },
  {
    titleEn: 'Bipolar and Related Disorders',
    titleFa: 'اختلالات دوقطبی و مرتبط',
    description: 'اختلالاتی که با نوسانات شدید خلق بین دوره‌های شیدایی و افسردگی مشخص می‌شوند.',
    examples: ['اختلال دوقطبی نوع ۱', 'اختلال دوقطبی نوع ۲', 'اختلال سیکلوتایمیک'],
  },
  {
    titleEn: 'Depressive Disorders',
    titleFa: 'اختلالات افسردگی',
    description: 'اختلالاتی که با خلق افسرده، از دست دادن علاقه و کاهش انرژی مشخص می‌شوند.',
    examples: ['اختلال افسردگی اساسی', 'اختلال افسردگی مداوم', 'اختلال افسردگی قبل از قاعدگی'],
  },
  {
    titleEn: 'Anxiety Disorders',
    titleFa: 'اختلالات اضطرابی',
    description: 'اختلالاتی که با ترس، نگرانی و اضطراب مفرط و مداوم مشخص می‌شوند.',
    examples: ['اختلال اضطراب عمومی', 'اختلال پانیک', 'فوبی‌های خاص'],
  },
  {
    titleEn: 'Obsessive-Compulsive and Related Disorders',
    titleFa: 'اختلال وسواسی-اجباری و مرتبط',
    description: 'اختلالاتی که با افکار وسواسی و رفتارهای اجباری تکراری مشخص می‌شوند.',
    examples: ['اختلال وسواسی-اجباری', 'اختلال بدشکلی بدن', 'اختلال انباشت'],
  },
  {
    titleEn: 'Trauma- and Stressor-Related Disorders',
    titleFa: 'اختلالات مرتبط با تروما و استرس',
    description: 'اختلالاتی که پس از قرار گرفتن در معرض رویدادهای آسیب‌زا یا استرس‌زا بروز می‌کنند.',
    examples: ['PTSD', 'اختلال استرس حاد', 'اختلالات تطبیقی'],
  },
  {
    titleEn: 'Dissociative Disorders',
    titleFa: 'اختلالات تجزیه‌ای',
    description: 'اختلالاتی که با قطع ارتباط بین افکار، احساسات، خاطرات و هویت مشخص می‌شوند.',
    examples: ['اختلال هویت تجزیه‌ای', 'اختلال فراموشی تجزیه‌ای', 'اختلال غربت از شخصیت'],
  },
  {
    titleEn: 'Somatic Symptom and Related Disorders',
    titleFa: 'اختلالات علائم جسمانی و مرتبط',
    description: 'اختلالاتی که با علائم جسمانی بدون علت پزشکی مشخص یا با پاسخ نامتناسب به مشکلات جسمی مشخص می‌شوند.',
    examples: ['اختلال علائم جسمانی', 'اختلال اضطراب بیماری', 'اختلال تبدیلی'],
  },
  {
    titleEn: 'Feeding and Eating Disorders',
    titleFa: 'اختلالات تغذیه و خوردن',
    description: 'اختلالاتی که با الگوهای غیرطبیعی خوردن و نگرانی درباره وزن و شکل بدن مشخص می‌شوند.',
    examples: ['بی‌اشتهایی روانی', 'پرخوری عصبی', 'اختلال پرخوری'],
  },
  {
    titleEn: 'Elimination Disorders',
    titleFa: 'اختلالات دفعی',
    description: 'اختلالاتی که با عدم کنترل مناسب دفع ادرار یا مدفوع در سنین نامناسب مشخص می‌شوند.',
    examples: ['شب‌ادراری', 'یبوست عملکردی', 'بی‌اختیاری مدفوع'],
  },
  {
    titleEn: 'Sleep-Wake Disorders',
    titleFa: 'اختلالات خواب-بیداری',
    description: 'اختلالاتی که در کیفیت، زمان‌بندی و مقدار خواب یا در رفتارهای مرتبط با خواب بروز می‌کنند.',
    examples: ['بی‌خوابی', 'آپنه خواب', 'اختلال ریتم شبانه‌روزی'],
  },
  {
    titleEn: 'Sexual Dysfunctions',
    titleFa: 'اختلالات عملکرد جنسی',
    description: 'اختلالاتی که با مشکل در پاسخ جنسی طبیعی یا تجربه لذت جنسی مشخص می‌شوند.',
    examples: ['اختلال میل جنسی', 'اختلال برانگیختگی', 'اختلال ارگاسم'],
  },
  {
    titleEn: 'Gender Dysphoria',
    titleFa: 'نارضایتی جنسیتی',
    description: 'ناراحتی قابل توجه ناشی از عدم تطابق بین جنسیت تولد و هویت جنسیتی فرد.',
    examples: ['نارضایتی جنسیتی کودکان', 'نارضایتی جنسیتی نوجوانان و بزرگسالان'],
  },
  {
    titleEn: 'Disruptive, Impulse-Control, and Conduct Disorders',
    titleFa: 'اختلالات مخرب، کنترل تکانه و رفتار',
    description: 'اختلالاتی که با مشکلات خودکنترلی عاطفی و رفتاری مشخص می‌شوند.',
    examples: ['اختلال رفتار', 'اختلال نافرمانی مقابله‌ای', 'اختلال انفجاری متناوب'],
  },
  {
    titleEn: 'Substance-Related and Addictive Disorders',
    titleFa: 'اختلالات مرتبط با مواد و اعتیاد',
    description: 'اختلالاتی که با استفاده مشکل‌ساز از مواد یا رفتارهای اعتیادآور مشخص می‌شوند.',
    examples: ['اختلال استفاده از الکل', 'اختلال استفاده از مواد مخدر', 'اختلال قمار'],
  },
  {
    titleEn: 'Neurocognitive Disorders',
    titleFa: 'اختلالات عصبی-شناختی',
    description: 'اختلالاتی که با کاهش عملکردهای شناختی مانند حافظه، توجه و تفکر مشخص می‌شوند.',
    examples: ['زوال عقل آلزایمر', 'زوال عقل عروقی', 'آسیب مغزی تروماتیک'],
  },
  {
    titleEn: 'Personality Disorders',
    titleFa: 'اختلالات شخصیت',
    description: 'الگوهای پایدار و انعطاف‌ناپذیر تفکر، احساس و رفتار که با هنجارهای فرهنگی متفاوت است.',
    examples: ['اختلال شخصیت مرزی', 'اختلال شخصیت خودشیفته', 'اختلال شخصیت ضداجتماعی'],
  },
  {
    titleEn: 'Paraphilic Disorders',
    titleFa: 'اختلالات انحرافات جنسی',
    description: 'اختلالاتی که با انحرافات جنسی که باعث رنج فرد یا آسیب به دیگران می‌شود، مشخص می‌شوند.',
    examples: ['اختلال تک‌تماسی', 'اختلال نمایشگری', 'اختلال کودک‌آزاری جنسی'],
  },
  {
    titleEn: 'Other Mental Disorders',
    titleFa: 'سایر اختلالات روانی',
    description: 'اختلالات روانی که در دسته‌بندی‌های دیگر قرار نمی‌گیرند اما نیاز به توجه بالینی دارند.',
    examples: ['اختلال روانی ناشی از حالت پزشکی', 'اختلال روانی نامشخص'],
  },
  {
    titleEn: 'Medication-Induced Movement Disorders and Other Adverse Effects of Medication',
    titleFa: 'اختلالات حرکتی ناشی از دارو و سایر عوارض نامطلوب دارو',
    description: 'اختلالات حرکتی و عوارض جانبی ناشی از مصرف داروهای روانپزشکی.',
    examples: ['پارکینسونیسم ناشی از دارو', 'دیسکینزی تأخیری', 'آکاتیزیا حاد'],
  },
  {
    titleEn: 'Other Conditions That May Be a Focus of Clinical Attention',
    titleFa: 'سایر شرایطی که ممکن است محور توجه بالینی باشند',
    description: 'مشکلات و شرایطی که ممکن است نیاز به توجه بالینی داشته باشند اما اختلال روانی محسوب نمی‌شوند.',
    examples: ['مشکلات ازدواج', 'مشکلات شغلی', 'مشکلات تحصیلی'],
  },
];

// Helper functions for styling
const getCategoryGradient = (index: number) => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
    'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
    'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
    'bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700',
    'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700',
    'bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700',
    'bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700',
    'bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700',
    'bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700',
    'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700',
    'bg-gradient-to-br from-lime-500 via-lime-600 to-lime-700',
    'bg-gradient-to-br from-red-500 via-red-600 to-red-700',
    'bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700',
    'bg-gradient-to-br from-green-500 via-green-600 to-green-700',
    'bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700',
    'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
    'bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600',
    'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600',
    'bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600',
    'bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600',
  ];
  return gradients[index % gradients.length];
};

const getCategoryIcon = (index: number) => {
  const icons = [
    'ph:brain-fill', // Neurodevelopmental
    'ph:eye-fill', // Schizophrenia Spectrum
    'ph:wave-sine-fill', // Bipolar
    'ph:heart-break-fill', // Depressive
    'ph:lightning-fill', // Anxiety
    'ph:repeat-fill', // OCD
    'ph:shield-warning-fill', // Trauma
    'ph:mask-sad-fill', // Dissociative
    'ph:heartbeat-fill', // Somatic
    'ph:fork-knife-fill', // Eating
    'ph:toilet-paper-fill', // Elimination
    'ph:moon-stars-fill', // Sleep-Wake
    'ph:heart-fill', // Sexual
    'ph:gender-intersex-fill', // Gender Dysphoria
    'ph:warning-fill', // Disruptive/Impulse
    'ph:pill-fill', // Substance
    'ph:cpu-fill', // Neurocognitive
    'ph:user-circle-fill', // Personality
    'ph:prohibit-fill', // Paraphilic
    'ph:question-fill', // Other Mental
    'ph:capsule-fill', // Medication-Induced
    'ph:info-fill', // Other Conditions
  ];
  return icons[index % icons.length];
};

// Handle learn more button clicks
const handleLearnMore = (index: number) => {
  const router = useRouter();

  // Get the category from the dynamic data
  const category = dsmCategories.value[index];
  if (!category) {
    console.error('Category not found at index:', index);
    return;
  }

  // Create a slug from the English title
  const categorySlug = category.titleEn.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  // Navigate to the dynamic category page
  const route = `/diagnosis/${categorySlug}`;
  console.log(`Navigating to: ${route}`);
  router.push(route);
};
</script>

<style scoped>
/* Enhanced glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Enhanced shadow effects */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Custom gradient animations */
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  animation: gradient-x 15s ease infinite;
  background-size: 400% 400%;
}

/* Enhanced dark mode transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
</style>
