<template>
  <div class="py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 space-x-reverse mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">ماژول همسریابی</h1>
          <p class="text-gray-600 dark:text-gray-300">سیستم هوشمند همسریابی بر اساس سازگاری روانشناختی و علمی</p>
        </div>
      </div>
    </div>

    <!-- وضعیت قفل/باز شدن ماژول -->
    <div class="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 p-8 mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6 space-x-reverse">
          <div class="relative">
            <div :class="isMatchmakingUnlocked ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'" class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
              <svg v-if="isMatchmakingUnlocked" class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div v-if="isMatchmakingUnlocked" class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ isMatchmakingUnlocked ? '🎉 ماژول همسریابی فعال است!' : '🔒 ماژول همسریابی در انتظار فعال‌سازی' }}
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-1">
              {{ isMatchmakingUnlocked ? 'حالا می‌توانید با افراد سازگار آشنا شوید و رابطه‌ای پایدار بسازید' : 'پس از تکمیل مراحل آمادگی، این بخش برای شما باز خواهد شد' }}
            </p>
            <div v-if="isMatchmakingUnlocked" class="flex items-center space-x-4 space-x-reverse text-sm text-purple-600 dark:text-purple-400">
              <span class="flex items-center space-x-1 space-x-reverse">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>تایید روانشناس</span>
              </span>
              <span class="flex items-center space-x-1 space-x-reverse">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
                </svg>
                <span>تحلیل هوش مصنوعی</span>
              </span>
              <span class="flex items-center space-x-1 space-x-reverse">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>حریم خصوصی محافظت شده</span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="isMatchmakingUnlocked" class="flex items-center space-x-3 space-x-reverse">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ compatibleMatches.length }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">فرد سازگار</div>
          </div>
          <div class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
            آماده همسریابی
          </div>
        </div>
      </div>
    </div>

    <!-- محتوای ماژول همسریابی (فقط در صورت باز بودن قفل) -->
    <div v-if="isMatchmakingUnlocked">
      <!-- آمار همسریابی -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ stats.potentialMatches }}</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">افراد سازگار</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ stats.sentRequests }}</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">درخواست ارسالی</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ stats.acceptedRequests }}</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">درخواست پذیرفته شده</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ stats.pendingRequests }}</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">در انتظار پاسخ</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- لیست افراد سازگار -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">افراد سازگار</h3>
              <button class="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm">
                فیلترها
              </button>
            </div>

            <div class="space-y-8">
              <div v-for="match in compatibleMatches" :key="match.id" class="bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-2xl p-8 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300">
                <div class="flex items-start space-x-8 space-x-reverse">
                  <!-- عکس پروفایل بهبود یافته -->
                  <div class="relative flex-shrink-0">
                    <div class="relative">
                      <div v-if="match.photo" class="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-purple-100 dark:ring-purple-900 shadow-lg">
                        <img :src="match.photo" :alt="match.firstName" class="w-full h-full object-cover">
                      </div>
                      <div v-else class="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center ring-4 ring-purple-100 dark:ring-purple-900 shadow-lg">
                        <span class="text-3xl font-bold text-white">{{ match.firstName.charAt(0) }}</span>
                      </div>
                      <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-800">
                        <div :class="match.isOnline ? 'bg-green-400' : 'bg-gray-400'" class="w-4 h-4 rounded-full"></div>
                      </div>
                    </div>
                    <!-- نمره سازگاری -->
                    <div class="absolute -top-3 -left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {{ match.compatibilityScore }}%
                    </div>
                  </div>

                  <!-- اطلاعات فرد بهبود یافته -->
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-4">
                      <div>
                        <h4 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ match.firstName }}، {{ match.age }} ساله</h4>
                        <div class="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                          <span class="flex items-center space-x-1 space-x-reverse">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>{{ match.location || 'تهران' }}</span>
                          </span>
                          <span class="flex items-center space-x-1 space-x-reverse">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6c0 1.657 2.343 3 4 3s4-1.343 4-3V6"></path>
                            </svg>
                            <span>{{ match.education || 'کارشناسی ارشد' }}</span>
                          </span>
                          <span class="flex items-center space-x-1 space-x-reverse">
                            <div :class="match.isOnline ? 'bg-green-400' : 'bg-gray-400'" class="w-2 h-2 rounded-full"></div>
                            <span>{{ match.isOnline ? 'آنلاین' : 'آخرین بازدید: امروز' }}</span>
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-2">
                          سازگاری عالی
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                          {{ match.mutualFriends || 0 }} دوست مشترک
                        </div>
                      </div>
                    </div>

                    <!-- تحلیل هوش مصنوعی بهبود یافته -->
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border border-blue-100 dark:border-blue-800">
                      <div class="flex items-start space-x-4 space-x-reverse">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h5 class="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">🤖 تحلیل سازگاری هوش مصنوعی</h5>
                          <p class="text-blue-800 dark:text-blue-400 leading-relaxed">{{ match.aiAnalysis }}</p>
                          <div class="mt-4 grid grid-cols-3 gap-4">
                            <div class="text-center">
                              <div class="text-lg font-bold text-blue-900 dark:text-blue-300">{{ match.personalityMatch || '94' }}%</div>
                              <div class="text-xs text-blue-700 dark:text-blue-400">شخصیت</div>
                            </div>
                            <div class="text-center">
                              <div class="text-lg font-bold text-blue-900 dark:text-blue-300">{{ match.valuesMatch || '89' }}%</div>
                              <div class="text-xs text-blue-700 dark:text-blue-400">ارزش‌ها</div>
                            </div>
                            <div class="text-center">
                              <div class="text-lg font-bold text-blue-900 dark:text-blue-300">{{ match.goalsMatch || '96' }}%</div>
                              <div class="text-xs text-blue-700 dark:text-blue-400">اهداف</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- ویژگی‌های مشترک بهبود یافته -->
                    <div class="mb-6">
                      <h6 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">🤝 نقاط مشترک:</h6>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="trait in match.commonTraits" :key="trait" class="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-300 px-3 py-2 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700">
                          {{ trait }}
                        </span>
                      </div>
                    </div>

                    <!-- اقدامات بهبود یافته -->
                    <div class="flex items-center space-x-4 space-x-reverse">
                      <button @click="sendIntroductionRequest(match.id)" :disabled="match.requestSent" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105">
                        {{ match.requestSent ? '✓ درخواست ارسال شده' : '💌 درخواست معرفی' }}
                      </button>
                      <button @click="requestCounselorConsultation(match.id)" class="border-2 border-purple-600 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-xl text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 shadow-lg hover:shadow-xl">
                        🧠 مشاوره روانشناس
                      </button>
                      <button @click="showMatchDetails(match.id)" class="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                        📋 جزئیات بیشتر
                      </button>
                      <button @click="rejectMatch(match.id)" class="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-3 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- تنظیمات حریم خصوصی و درخواست‌ها -->
        <div class="space-y-6">
          <!-- تنظیمات حریم خصوصی -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">تنظیمات حریم خصوصی</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">نمایش عکس پروفایل</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">عکس شما برای افراد بالقوه نمایش داده شود</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="privacySettings.showPhoto" type="checkbox" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">نمایش سن دقیق</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">سن دقیق شما نمایش داده شود</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="privacySettings.showExactAge" type="checkbox" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">فعال بودن آنلاین</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">وضعیت آنلاین بودن شما نمایش داده شود</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="privacySettings.showOnlineStatus" type="checkbox" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- درخواست‌های دریافتی -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">درخواست‌های دریافتی</h3>
            
            <div v-if="receivedRequests.length === 0" class="text-center py-4">
              <p class="text-gray-500 dark:text-gray-400 text-sm">درخواست جدیدی ندارید</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="request in receivedRequests" :key="request.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ request.fromName.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ request.fromName }}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">{{ request.type === 'introduction' ? 'درخواست معرفی' : 'درخواست مشاوره' }}</div>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ request.createdAt }}</span>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button @click="acceptRequest(request.id)" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                    پذیرش
                  </button>
                  <button @click="rejectRequest(request.id)" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    رد
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- پیام‌های سیستم -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">اعلان‌ها</h3>
            
            <div class="space-y-3">
              <div v-for="notification in notifications" :key="notification.id" class="flex items-start space-x-3 space-x-reverse p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-blue-900 dark:text-blue-300">{{ notification.message }}</p>
                  <p class="text-xs text-blue-700 dark:text-blue-400 mt-1">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- محتوای نمایش در صورت قفل بودن -->
    <div v-else class="text-center py-16">
      <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">ماژول همسریابی هنوز فعال نشده است</h3>
      <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
        برای دسترسی به این بخش، ابتدا باید نقشه راه را تکمیل کنید و ارزیابی روانشناس را دریافت کنید.
      </p>
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-lg mx-auto">
        <h4 class="font-medium text-blue-900 dark:text-blue-300 mb-2">مراحل باز شدن قفل:</h4>
        <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1 text-right">
          <li>✓ تکمیل حداقل 80% نقشه راه</li>
          <li>✓ گذراندن آزمون‌های شخصیت‌شناسی</li>
          <li>✓ تایید آمادگی توسط مشاور</li>
          <li>⏳ ارزیابی نهایی روانشناس</li>
        </ul>
      </div>
      <button @click="navigateTo('/hammasir/roadmap')" class="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
        مشاهده نقشه راه
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'ماژول همسریابی',
  preview: {
    title: 'Matchmaking Module',
    description: 'AI-powered matchmaking system with psychological compatibility',
    categories: ['matchmaking'],
    src: '/img/screens/matchmaking-module.png',
    srcDark: '/img/screens/matchmaking-module-dark.png',
    order: 1,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

// وضعیت قفل/باز شدن ماژول (بر اساس پیشرفت کاربر)
const isMatchmakingUnlocked = ref(true) // در عمل باید از API گرفته شود

// آمار همسریابی
const stats = ref({
  potentialMatches: 12,
  sentRequests: 3,
  acceptedRequests: 1,
  pendingRequests: 2
})

// تنظیمات حریم خصوصی
const privacySettings = ref({
  showPhoto: true,
  showExactAge: true,
  showOnlineStatus: false
})

// لیست افراد سازگار
const compatibleMatches = ref([
  {
    id: 1,
    firstName: 'مریم',
    age: 28,
    photo: null,
    location: 'تهران، ولنجک',
    education: 'کارشناسی ارشد روانشناسی',
    isOnline: true,
    compatibilityScore: 92,
    personalityMatch: 94,
    valuesMatch: 91,
    goalsMatch: 96,
    mutualFriends: 3,
    aiAnalysis: 'بر اساس تحلیل عمیق شخصیت‌تان، هر دو دارای اهداف مشترک در زندگی و نگرش مثبت به خانواده هستید. نمرات بالای شما در مدیریت احساسات و حل تعارض نشان‌دهنده سازگاری فوق‌العاده است. همچنین هر دو به رشد معنوی و توسعه شخصی اهمیت می‌دهید.',
    commonTraits: ['اهداف مشترک', 'مدیریت احساسات', 'خانواده‌دوست', 'رشد معنوی', 'مسئولیت‌پذیری'],
    requestSent: false
  },
  {
    id: 2,
    firstName: 'سارا',
    age: 26,
    photo: null,
    location: 'تهران، نیاوران',
    education: 'کارشناسی مهندسی کامپیوتر',
    isOnline: false,
    compatibilityScore: 87,
    personalityMatch: 89,
    valuesMatch: 86,
    goalsMatch: 91,
    mutualFriends: 1,
    aiAnalysis: 'ارزش‌های مشترک شما در زمینه رشد شخصی، یادگیری مادام‌العمر و تعادل کار-زندگی نشان‌دهنده سازگاری بالا است. هر دو دارای شخصیت درون‌گرا و متفکر هستید که برای ایجاد روابط عمیق و معنادار مناسب است. علاقه مشترک به تکنولوژی و نوآوری نقطه قوت رابطه شما خواهد بود.',
    commonTraits: ['رشد شخصی', 'درون‌گرا', 'متفکر', 'تکنولوژی‌دوست', 'تعادل کار-زندگی'],
    requestSent: true
  },
  {
    id: 3,
    firstName: 'فاطمه',
    age: 30,
    photo: null,
    location: 'تهران، فرمانیه',
    education: 'دکترای پزشکی',
    isOnline: true,
    compatibilityScore: 84,
    personalityMatch: 82,
    valuesMatch: 88,
    goalsMatch: 89,
    mutualFriends: 5,
    aiAnalysis: 'هر دو در زمینه صداقت، شفافیت در روابط و تعهد به ارزش‌های اخلاقی نمرات بالایی دارید. اولویت‌های مشترک شما در ایجاد خانواده، ثبات مالی و خدمت به جامعه بنیان محکمی برای رابطه طولانی‌مدت فراهم می‌کند. هر دو به سلامت جامعه و کمک به دیگران اهمیت می‌دهید.',
    commonTraits: ['صداقت', 'ثبات مالی', 'خانواده‌محور', 'خدمت‌گزاری', 'ارزش‌های اخلاقی'],
    requestSent: false
  }
])

// درخواست‌های دریافتی
const receivedRequests = ref([
  {
    id: 1,
    fromName: 'علی',
    type: 'introduction',
    createdAt: '2 ساعت پیش'
  },
  {
    id: 2,
    fromName: 'محمد',
    type: 'counselor_consultation',
    createdAt: '1 روز پیش'
  }
])

// اعلان‌ها
const notifications = ref([
  {
    id: 1,
    message: 'ماژول همسریابی برای شما فعال شد! حالا می‌توانید افراد سازگار را مشاهده کنید.',
    time: '10 دقیقه پیش'
  },
  {
    id: 2,
    message: 'یک درخواست معرفی جدید دریافت کردید.',
    time: '2 ساعت پیش'
  }
])

// توابع
const sendIntroductionRequest = (matchId: number) => {
  console.log('Sending introduction request to:', matchId)
  // به‌روزرسانی وضعیت در لیست
  const match = compatibleMatches.value.find(m => m.id === matchId)
  if (match) {
    match.requestSent = true
  }
}

const requestCounselorConsultation = (matchId: number) => {
  console.log('Requesting counselor consultation for:', matchId)
  // ارسال درخواست مشاوره
}

const rejectMatch = (matchId: number) => {
  console.log('Rejecting match:', matchId)
  // نمایش دیالوگ دلیل رد و حذف از لیست
}

const acceptRequest = (requestId: number) => {
  console.log('Accepting request:', requestId)
  // حذف از لیست درخواست‌های دریافتی
  const index = receivedRequests.value.findIndex(r => r.id === requestId)
  if (index > -1) {
    receivedRequests.value.splice(index, 1)
  }
}

const rejectRequest = (requestId: number) => {
  console.log('Rejecting request:', requestId)
  // حذف از لیست درخواست‌های دریافتی
  const index = receivedRequests.value.findIndex(r => r.id === requestId)
  if (index > -1) {
    receivedRequests.value.splice(index, 1)
  }
}

const showMatchDetails = (matchId: number) => {
  console.log('Showing match details for:', matchId)
  // نمایش دیالوگ جزئیات بیشتر فرد
}
</script>