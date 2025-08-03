<template>
  <div class="py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">تسلط بر هوش هیجانی</h1>
      <p class="text-gray-600 dark:text-gray-300">توسعه مهارت‌های ضروری هوش هیجانی برای موفقیت شخصی و حرفه‌ای</p>
    </div>

    <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 mb-8 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90"></div>
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-6">
          <div>
            <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">پیشرفته</span>
            <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mr-2">4 هفته</span>
          </div>
        </div>
        <h2 class="text-2xl font-bold mb-4">احساسات خود را کنترل کنید، زندگی خود را متحول کنید</h2>
        
        <div class="grid grid-cols-3 gap-8 mt-8">
          <div class="text-center">
            <div class="text-3xl font-bold">8</div>
            <div class="text-white/80">ماژول</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold">24</div>
            <div class="text-white/80">درس</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold">60%</div>
            <div class="text-white/80">پیشرفت شما</div>
          </div>
        </div>
        
        <div class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm">پیشرفت</span>
            <span class="text-sm">60%</span>
          </div>
          <div class="w-full bg-white/20 rounded-full h-2">
            <div class="bg-white h-2 rounded-full" style="width: 60%"></div>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-6">
          <div class="flex space-x-4 space-x-reverse">
            <span class="text-sm bg-white/20 px-3 py-1 rounded-full">فعال</span>
            <span class="text-sm bg-white/20 px-3 py-1 rounded-full">در حال انجام</span>
          </div>
          <button class="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            ادامه یادگیری
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">محتوای دوره</h3>
          
          <div class="space-y-4">
            <div v-for="(module, index) in modules" :key="index" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 space-x-reverse">
                  <div :class="getModuleIcon(module.status)" class="w-8 h-8 rounded-full flex items-center justify-center">
                    <svg v-if="module.status === 'completed'" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <svg v-else-if="module.status === 'in_progress'" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ module.title }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ module.description }}</p>
                    <div v-if="module.lessons" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ module.lessons }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <span :class="getStatusBadge(module.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(module.status) }}
                  </span>
                  <button class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">درباره این دوره</h3>
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              این دوره جامع به شما کمک می‌کند تا مهارت‌های ضروری هوش هیجانی را توسعه دهید. از طریق این دوره، خواهید آموخت که چگونه احساسات خود را به روش‌های مثبت مدیریت کنید، به طور مؤثر ارتباط برقرار کنید، چالش‌ها را حل کنید و روابط معنادار برقرار کنید.
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              این دوره جامع شما را در طول مؤلفه‌های کلیدی هوش هیجانی راهنمایی خواهد کرد: خودآگاهی، خودمدیریتی، آگاهی اجتماعی و مدیریت روابط.
            </p>
            
            <h4 class="font-semibold text-gray-900 dark:text-white mb-3">آنچه خواهید آموخت:</h4>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li class="flex items-start space-x-2 space-x-reverse">
                <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>شناسایی و درک الگوهای احساسی خود</span>
              </li>
              <li class="flex items-start space-x-2 space-x-reverse">
                <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>توسعه استراتژی‌هایی برای تنظیم احساسات</span>
              </li>
              <li class="flex items-start space-x-2 space-x-reverse">
                <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>بهبود همدلی و آگاهی‌های اجتماعی</span>
              </li>
              <li class="flex items-start space-x-2 space-x-reverse">
                <svg class="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>ایجاد روابط قوی‌تر و معنادارتر</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">اقدامات دوره</h3>
          <div class="space-y-3">
            <button class="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>ادامه ماژول 3</span>
            </button>
            <button class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>پیوستن به گروه تلگرام</span>
            </button>
            <button class="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>دانلود منابع</span>
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">پشتیبانی و انجمن</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">گروه تلگرام</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">247 عضو فعال</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">تیم پشتیبانی</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">پاسخ در کمتر از 2 ساعت</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">مدرس دوره</h3>
          <div class="flex items-center space-x-4 space-x-reverse mb-4">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span class="text-lg font-medium text-gray-600 dark:text-gray-300">دم</span>
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">دکتر مایکل چن</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">دکترای روانشناسی</div>
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            دکتر چن با بیش از 15 سال تجربه در زمینه مدیریت هیجانات، متخصص برجسته‌ای در حوزه هوش هیجانی و مهارت‌های عاطفی است.
          </p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">تجربه تدریس:</span>
            <span class="font-medium text-gray-900 dark:text-white">10 سال</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">آمار دوره</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">دانشجویان فعال</span>
              <span class="font-bold text-gray-900 dark:text-white">1,247</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">نرخ تکمیل</span>
              <span class="font-bold text-gray-900 dark:text-white">87%</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">میانگین امتیاز</span>
              <div class="flex items-center space-x-1 space-x-reverse">
                <span class="font-bold text-gray-900 dark:text-white">4.8</span>
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'تسلط بر هوش هیجانی',
  preview: {
    title: 'Emotional Intelligence Course',
    description: 'Emotional intelligence mastery course page',
    categories: ['courses'],
    src: '/img/screens/courses-emotional-intelligence.png',
    srcDark: '/img/screens/courses-emotional-intelligence-dark.png',
    order: 1,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const modules = ref([
  {
    title: 'ماژول 1: درک خود',
    description: 'درک احساسات، نمونه‌های احساسی',
    status: 'completed',
    lessons: null
  },
  {
    title: 'ماژول 2: خودآگاهی',
    description: 'تشخیص الگوهای احساسی خود',
    status: 'completed',
    lessons: null
  },
  {
    title: 'ماژول 3: تنظیم احساسات',
    description: 'مدیریت و کنترل احساسات',
    status: 'in_progress',
    lessons: '2 از 5 درس تکمیل شده'
  },
  {
    title: 'ماژول 4: خودآگاهی اجتماعی',
    description: 'درک احساسات دیگران',
    status: 'locked',
    lessons: null
  },
  {
    title: 'ماژول 5: مدیریت روابط',
    description: 'ایجاد ارتباطات قوی‌تر',
    status: 'locked',
    lessons: null
  }
])

const getModuleIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500'
    case 'in_progress':
      return 'bg-blue-500'
    default:
      return 'bg-gray-300'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'تکمیل شده'
    case 'in_progress':
      return 'در حال انجام'
    default:
      return 'قفل شده'
  }
}
</script>