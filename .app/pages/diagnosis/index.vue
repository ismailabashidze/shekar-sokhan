<template>
  <div class="from-primary-50 via-white to-success-50 dark:from-muted-900 dark:via-muted-800 dark:to-muted-900 min-h-screen bg-gradient-to-br">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 20%, theme(colors.primary.400) 0%, transparent 50%), radial-gradient(circle at 80% 80%, theme(colors.success.400) 0%, transparent 50%), radial-gradient(circle at 40% 60%, theme(colors.blue.400) 0%, transparent 50%)"></div>
      </div>
      
      <div class="container mx-auto max-w-7xl px-4 py-16 relative">
        <!-- Navigation Breadcrumb and Theme Toggle -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2 text-sm text-muted-600 dark:text-muted-400">
            <Icon name="ph:house" class="size-4" />
            <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              خانه
            </NuxtLink>
            <Icon name="ph:caret-left" class="size-3" />
            <span class="text-primary-600 dark:text-primary-400 font-medium">راهنمای تشخیصی</span>
          </div>
          
          <!-- Theme Toggle -->
          <div class="flex items-center gap-3">
            <BaseThemeToggle />
          </div>
        </div>

        <!-- Hero Content -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-3 bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20 dark:border-muted-700/50 mb-8">
            <div class="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-full">
              <Icon name="ph:brain" class="size-8 text-white" />
            </div>
            <div class="text-right">
              <div class="text-sm text-muted-600 dark:text-muted-400">استاندارد جهانی</div>
              <div class="font-bold text-muted-800 dark:text-white text-lg">تشخیص اختلالات روانی</div>
            </div>
          </div>

          <h1 class="text-5xl md:text-6xl font-bold text-muted-800 dark:text-white mb-6 leading-tight">
            راهنمای تشخیصی
            <span class="bg-gradient-to-r from-primary-500 to-success-500 bg-clip-text text-transparent">DSM-5</span>
          </h1>
          
          <p class="text-xl text-muted-600 dark:text-muted-400 max-w-4xl mx-auto leading-relaxed mb-8">
            راهنمای تشخیصی و آماری اختلالات روانی، استانداردی جهانی برای تشخیص دقیق و علمی اختلالات روانی، 
            که توسط متخصصان سلامت روان در سراسر جهان مورد استفاده قرار می‌گیرد.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink
              to="/diagnosis/categories"
              class="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div class="flex items-center gap-3">
                <Icon name="ph:list" class="size-5" />
                <span>مشاهده ۲۲ دسته‌بندی</span>
                <Icon name="ph:arrow-left" class="size-5 transition-transform group-hover:-translate-x-1" />
              </div>
            </NuxtLink>
            
            <button class="group bg-white/90 hover:bg-white text-muted-700 hover:text-primary-600 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl border-2 border-muted-200 hover:border-primary-300 transition-all duration-300 transform hover:scale-105">
              <div class="flex items-center gap-3">
                <Icon name="ph:download" class="size-5" />
                <span>دانلود راهنما</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-muted-700/50 text-center">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Icon name="ph:folder-open" class="size-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">22</div>
            <div class="text-sm text-muted-600 dark:text-muted-400">دسته‌بندی اصلی</div>
          </div>

          <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-muted-700/50 text-center">
            <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Icon name="ph:stethoscope" class="size-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">300+</div>
            <div class="text-sm text-muted-600 dark:text-muted-400">اختلال مشخص</div>
          </div>

          <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-muted-700/50 text-center">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Icon name="ph:globe" class="size-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">180+</div>
            <div class="text-sm text-muted-600 dark:text-muted-400">کشور استفاده‌کننده</div>
          </div>

          <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-muted-700/50 text-center">
            <div class="bg-gradient-to-r from-rose-500 to-rose-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Icon name="ph:calendar" class="size-8 text-white" />
            </div>
            <div class="text-3xl font-bold text-rose-600 dark:text-rose-400 mb-2">2013</div>
            <div class="text-sm text-muted-600 dark:text-muted-400">سال انتشار DSM-5</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto max-w-7xl px-4 pb-16">
      
      <!-- What is DSM-5 Section -->
      <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-muted-700/50 mb-16">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <div class="bg-gradient-to-r from-primary-100 to-success-100 dark:from-primary-900/50 dark:to-success-900/50 p-4 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Icon name="ph:book-open" class="size-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 class="text-4xl font-bold text-muted-800 dark:text-white mb-4">DSM-5 چیست؟</h2>
          </div>
          
          <div class="prose prose-xl prose-muted dark:prose-invert max-w-none text-right leading-relaxed">
            <p class="text-muted-600 dark:text-muted-400 mb-6">
              <strong class="text-muted-800 dark:text-white">راهنمای تشخیصی و آماری اختلالات روانی (DSM-5)</strong> 
              پنجمین و جدیدترین نسخه از استانداردترین راهنمای تشخیص اختلالات روانی در جهان است که توسط 
              انجمن روانپزشکی آمریکا (APA) در سال ۲۰۱۳ منتشر شده است.
            </p>
            
            <p class="text-muted-600 dark:text-muted-400 mb-6">
              این راهنما حاصل سال‌ها تحقیق علمی و همکاری صدها متخصص سلامت روان از سراسر جهان است و 
              شامل معیارهای دقیق و استاندارد برای تشخیص بیش از ۳۰۰ اختلال روانی در ۲۲ دسته‌بندی اصلی می‌باشد.
            </p>
            
            <p class="text-muted-600 dark:text-muted-400">
              استفاده از DSM-5 به متخصصان کمک می‌کند تا تشخیص‌های دقیق‌تر و قابل اعتمادتری ارائه داده، 
              درمان‌های مؤثرتری برای بیماران طراحی کنند و امکان تحقیقات علمی بهتری را فراهم آورند.
            </p>
          </div>
        </div>
      </div>

      <!-- Key Features Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-muted-700/50">
          <div class="mb-6">
            <div class="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Icon name="ph:target" class="size-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-2xl font-bold text-muted-800 dark:text-white mb-4">ویژگی‌های کلیدی DSM-5</h3>
          </div>
          
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <Icon name="ph:check-circle" class="size-5 text-success-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">معیارهای تشخیصی دقیق و علمی</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:check-circle" class="size-5 text-success-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">رویکرد طیفی به اختلالات</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:check-circle" class="size-5 text-success-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">در نظر گیری عوامل فرهنگی</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:check-circle" class="size-5 text-success-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">ارزیابی شدت علائم</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:check-circle" class="size-5 text-success-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">تشخیص‌های کمکی مفید</span>
            </li>
          </ul>
        </div>

        <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-muted-700/50">
          <div class="mb-6">
            <div class="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Icon name="ph:users" class="size-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 class="text-2xl font-bold text-muted-800 dark:text-white mb-4">کاربران DSM-5</h3>
          </div>
          
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <Icon name="ph:user-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">روانپزشکان و روانشناسان</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:user-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">مشاوران و درمانگران</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:user-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">محققان سلامت روان</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:user-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">دانشجویان رشته‌های مرتبط</span>
            </li>
            <li class="flex items-start gap-3">
              <Icon name="ph:user-circle" class="size-5 text-primary-500 shrink-0 mt-0.5" />
              <span class="text-muted-600 dark:text-muted-400">شرکت‌های بیمه و نهادهای درمانی</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Diagnostic Process Section -->
      <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-muted-700/50 mb-16">
        <div class="text-center mb-12">
          <div class="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-4 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Icon name="ph:path" class="size-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 class="text-4xl font-bold text-muted-800 dark:text-white mb-4">فرآیند تشخیص بر اساس DSM-5</h2>
          <p class="text-muted-600 dark:text-muted-400 max-w-2xl mx-auto">
            تشخیص اختلالات روانی بر اساس DSM-5 شامل مراحل علمی و استانداردی است که دقت و اعتبار تشخیص را تضمین می‌کند.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-xl">1</span>
            </div>
            <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-2">ارزیابی اولیه</h4>
            <p class="text-sm text-muted-600 dark:text-muted-400">جمع‌آوری اطلاعات جامع درباره علائم، تاریخچه و شرایط فعلی</p>
          </div>

          <div class="text-center">
            <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-xl">2</span>
            </div>
            <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-2">بررسی معیارها</h4>
            <p class="text-sm text-muted-600 dark:text-muted-400">مقایسه علائم با معیارهای تشخیصی استاندارد DSM-5</p>
          </div>

          <div class="text-center">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-xl">3</span>
            </div>
            <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-2">تشخیص افتراقی</h4>
            <p class="text-sm text-muted-600 dark:text-muted-400">تمایز میان اختلالات مشابه و حذف سایر علل احتمالی</p>
          </div>

          <div class="text-center">
            <div class="bg-gradient-to-r from-rose-500 to-rose-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span class="text-white font-bold text-xl">4</span>
            </div>
            <h4 class="text-lg font-semibold text-muted-800 dark:text-white mb-2">تشخیص نهایی</h4>
            <p class="text-sm text-muted-600 dark:text-muted-400">ارائه تشخیص دقیق همراه با طرح درمانی مناسب</p>
          </div>
        </div>
      </div>

      <!-- Categories Preview -->
      <div class="bg-white/80 dark:bg-muted-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-muted-700/50">
        <div class="text-center mb-12">
          <div class="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 p-4 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Icon name="ph:folders" class="size-12 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 class="text-4xl font-bold text-muted-800 dark:text-white mb-4">دسته‌بندی‌های اصلی DSM-5</h2>
          <p class="text-muted-600 dark:text-muted-400 max-w-3xl mx-auto mb-8">
            DSM-5 شامل ۲۲ دسته‌بندی اصلی است که بر اساس ویژگی‌های مشترک، علل احتمالی و الگوهای رفتاری طبقه‌بندی شده‌اند.
          </p>
          
          <NuxtLink
            to="/diagnosis/categories"
            class="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Icon name="ph:list" class="size-5" />
            <span>مشاهده تمام دسته‌بندی‌ها</span>
            <Icon name="ph:arrow-left" class="size-5 transition-transform group-hover:-translate-x-1" />
          </NuxtLink>
        </div>

        <!-- Sample Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <div class="flex items-center gap-3 mb-4">
              <Icon name="ph:brain-fill" class="size-8 text-blue-600 dark:text-blue-400" />
              <h4 class="font-semibold text-blue-800 dark:text-blue-300">اختلالات نوروتکاملی</h4>
            </div>
            <p class="text-sm text-blue-700 dark:text-blue-300">شامل اوتیسم، ADHD و اختلالات یادگیری</p>
          </div>

          <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div class="flex items-center gap-3 mb-4">
              <Icon name="ph:heart-break-fill" class="size-8 text-emerald-600 dark:text-emerald-400" />
              <h4 class="font-semibold text-emerald-800 dark:text-emerald-300">اختلالات افسردگی</h4>
            </div>
            <p class="text-sm text-emerald-700 dark:text-emerald-300">شامل افسردگی اساسی و اختلالات خلقی</p>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
            <div class="flex items-center gap-3 mb-4">
              <Icon name="ph:lightning-fill" class="size-8 text-purple-600 dark:text-purple-400" />
              <h4 class="font-semibold text-purple-800 dark:text-purple-300">اختلالات اضطرابی</h4>
            </div>
            <p class="text-sm text-purple-700 dark:text-purple-300">شامل اضطراب عمومی، پانیک و فوبی‌ها</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'راهنمای تشخیصی DSM-5 | ذهنا',
})

useHead({
  htmlAttrs: { dir: 'rtl' },
  title: 'راهنمای تشخیصی DSM-5 | ذهنا',
  meta: [
    { 
      name: 'description', 
      content: 'راهنمای جامع تشخیص اختلالات روانی بر اساس استاندارد جهانی DSM-5. شامل ۲۲ دسته‌بندی و بیش از ۳۰۰ اختلال روانی با معیارهای علمی و دقیق.' 
    },
    {
      name: 'keywords',
      content: 'DSM-5, تشخیص اختلالات روانی, راهنمای تشخیصی, سلامت روان, روانپزشکی, روانشناسی, اختلالات روانی'
    }
  ]
})
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

/* Enhanced prose styling */
.prose {
  line-height: 1.8;
}

.prose p {
  margin-bottom: 1.5rem;
}

.prose strong {
  font-weight: 600;
}

/* Enhanced dark mode transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Custom hover effects */
.group:hover .group-hover\:-translate-x-1 {
  transform: translateX(-0.25rem);
}

/* Custom grid animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.6s ease-out forwards;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }
</style>