<template>
  <div class="py-8">
    <div class="mb-8">
      <div class="mb-4 flex items-center space-x-3 space-x-reverse">
        <div class="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600">
          <svg
            class="size-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            ماژول همسریابی
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            سیستم هوشمند همسریابی بر اساس سازگاری روانشناختی و علمی
          </p>
        </div>
      </div>
    </div>

    <!-- وضعیت قفل/باز شدن ماژول -->
    <div class="mb-8 rounded-2xl border border-purple-200 bg-gradient-to-r from-white to-purple-50 p-8 shadow-lg dark:border-purple-800 dark:from-gray-800 dark:to-purple-900/10">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6 space-x-reverse">
          <div class="relative">
            <div :class="isMatchmakingUnlocked ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'" class="flex size-20 items-center justify-center rounded-2xl shadow-lg">
              <svg
                v-if="isMatchmakingUnlocked"
                class="size-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg
                v-else
                class="size-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div v-if="isMatchmakingUnlocked" class="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-green-500">
              <svg
                class="size-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div>
            <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ isMatchmakingUnlocked ? '🎉 ماژول همسریابی فعال است!' : '🔒 ماژول همسریابی در انتظار فعال‌سازی' }}
            </h2>
            <p class="mb-1 text-lg text-gray-600 dark:text-gray-300">
              {{ isMatchmakingUnlocked ? 'حالا می‌توانید با افراد سازگار آشنا شوید و رابطه‌ای پایدار بسازید' : 'پس از تکمیل مراحل آمادگی، این بخش برای شما باز خواهد شد' }}
            </p>
            <div v-if="isMatchmakingUnlocked" class="flex items-center space-x-4 space-x-reverse text-sm text-purple-600 dark:text-purple-400">
              <span class="flex items-center space-x-1 space-x-reverse">
                <svg
                  class="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>تایید روانشناس</span>
              </span>
              <span class="flex items-center space-x-1 space-x-reverse">
                <svg
                  class="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"
                  />
                </svg>
                <span>تحلیل هوش مصنوعی</span>
              </span>
              <span class="flex items-center space-x-1 space-x-reverse">
                <svg
                  class="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>حریم خصوصی محافظت شده</span>
              </span>
            </div>
          </div>
        </div>
        <div v-if="isMatchmakingUnlocked" class="flex items-center space-x-3 space-x-reverse">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ compatibleMatches.length }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              فرد سازگار
            </div>
          </div>
          <div class="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            آماده همسریابی
          </div>
        </div>
      </div>
    </div>

    <!-- محتوای ماژول همسریابی (فقط در صورت باز بودن قفل) -->
    <div v-if="isMatchmakingUnlocked">
      <!-- آمار همسریابی -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <svg
              class="size-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ stats.potentialMatches }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            افراد سازگار
          </p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg
              class="size-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
              />
            </svg>
          </div>
          <div class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ stats.sentRequests }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            درخواست ارسالی
          </p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              class="size-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ stats.acceptedRequests }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            درخواست پذیرفته شده
          </p>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
            <svg
              class="size-6 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ stats.pendingRequests }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            در انتظار پاسخ
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- لیست افراد سازگار -->
        <div class="lg:col-span-2">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                افراد سازگار
              </h3>
              <button class="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                فیلترها
              </button>
            </div>

            <div class="space-y-8">
              <div
                v-for="match in compatibleMatches"
                :key="match.id"
                class="rounded-2xl border border-purple-100 bg-gradient-to-r from-white to-purple-50/30 p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-lg dark:border-purple-800 dark:from-gray-800 dark:to-purple-900/10 dark:hover:border-purple-700"
              >
                <div class="flex items-start space-x-8 space-x-reverse">
                  <!-- عکس پروفایل بهبود یافته -->
                  <div class="relative shrink-0">
                    <div class="relative">
                      <div v-if="match.photo" class="size-24 overflow-hidden rounded-2xl shadow-lg ring-4 ring-purple-100 dark:ring-purple-900">
                        <img
                          :src="match.photo"
                          :alt="match.firstName"
                          class="size-full object-cover"
                        >
                      </div>
                      <div v-else class="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg ring-4 ring-purple-100 dark:ring-purple-900">
                        <span class="text-3xl font-bold text-white">{{ match.firstName.charAt(0) }}</span>
                      </div>
                      <div class="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white dark:bg-gray-800 dark:ring-gray-800">
                        <div :class="match.isOnline ? 'bg-green-400' : 'bg-gray-400'" class="size-4 rounded-full" />
                      </div>
                    </div>
                    <!-- نمره سازگاری -->
                    <div class="absolute -left-3 -top-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                      {{ match.compatibilityScore }}%
                    </div>
                  </div>

                  <!-- اطلاعات فرد بهبود یافته -->
                  <div class="flex-1">
                    <div class="mb-4 flex items-start justify-between">
                      <div>
                        <h4 class="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                          {{ match.firstName }}، {{ match.age }} ساله
                        </h4>
                        <div class="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 dark:text-gray-400">
                          <span class="flex items-center space-x-1 space-x-reverse">
                            <svg
                              class="size-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{{ match.location || 'تهران' }}</span>
                          </span>
                          <span class="flex items-center space-x-1 space-x-reverse">
                            <svg
                              class="size-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6c0 1.657 2.343 3 4 3s4-1.343 4-3V6"
                              />
                            </svg>
                            <span>{{ match.education || 'کارشناسی ارشد' }}</span>
                          </span>
                          <span class="flex items-center space-x-1 space-x-reverse">
                            <div :class="match.isOnline ? 'bg-green-400' : 'bg-gray-400'" class="size-2 rounded-full" />
                            <span>{{ match.isOnline ? 'آنلاین' : 'آخرین بازدید: امروز' }}</span>
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="mb-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          سازگاری عالی
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                          {{ match.mutualFriends || 0 }} دوست مشترک
                        </div>
                      </div>
                    </div>

                    <!-- تحلیل هوش مصنوعی بهبود یافته -->
                    <div class="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div class="flex items-start space-x-4 space-x-reverse">
                        <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                          <svg
                            class="size-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h5 class="mb-2 text-lg font-bold text-blue-900 dark:text-blue-300">
                            🤖 تحلیل سازگاری هوش مصنوعی
                          </h5>
                          <p class="leading-relaxed text-blue-800 dark:text-blue-400">
                            {{ match.aiAnalysis }}
                          </p>
                          <div class="mt-4 grid grid-cols-3 gap-4">
                            <div class="text-center">
                              <div class="text-lg font-bold text-blue-900 dark:text-blue-300">
                                {{ match.personalityMatch || '94' }}%
                              </div>
                              <div class="text-xs text-blue-700 dark:text-blue-400">
                                شخصیت
                              </div>
                            </div>
                            <div class="text-center">
                              <div class="text-lg font-bold text-blue-900 dark:text-blue-300">
                                {{ match.valuesMatch || '89' }}%
                              </div>
                              <div class="text-xs text-blue-700 dark:text-blue-400">
                                ارزش‌ها
                              </div>
                            </div>
                            <div class="text-center">
                              <div class="text-lg font-bold text-blue-900 dark:text-blue-300">
                                {{ match.goalsMatch || '96' }}%
                              </div>
                              <div class="text-xs text-blue-700 dark:text-blue-400">
                                اهداف
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- ویژگی‌های مشترک بهبود یافته -->
                    <div class="mb-6">
                      <h6 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        🤝 نقاط مشترک:
                      </h6>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="trait in match.commonTraits"
                          :key="trait"
                          class="rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 text-sm font-medium text-purple-800 dark:border-purple-700 dark:from-purple-900 dark:to-pink-900 dark:text-purple-300"
                        >
                          {{ trait }}
                        </span>
                      </div>
                    </div>

                    <!-- اقدامات بهبود یافته -->
                    <div class="flex items-center space-x-4 space-x-reverse">
                      <button
                        :disabled="match.requestSent"
                        class="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                        @click="sendIntroductionRequest(match.id)"
                      >
                        {{ match.requestSent ? '✓ درخواست ارسال شده' : '💌 درخواست معرفی' }}
                      </button>
                      <button class="rounded-xl border-2 border-purple-600 px-6 py-3 text-sm font-medium text-purple-600 shadow-lg transition-all duration-300 hover:bg-purple-50 hover:shadow-xl dark:text-purple-400 dark:hover:bg-purple-900/20" @click="requestCounselorConsultation(match.id)">
                        🧠 مشاوره روانشناس
                      </button>
                      <button class="rounded-xl border-2 border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700" @click="showMatchDetails(match.id)">
                        📋 جزئیات بیشتر
                      </button>
                      <button class="rounded-xl p-3 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400" @click="rejectMatch(match.id)">
                        <svg
                          class="size-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
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
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              تنظیمات حریم خصوصی
            </h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    نمایش عکس پروفایل
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    عکس شما برای افراد بالقوه نمایش داده شود
                  </div>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input
                    v-model="privacySettings.showPhoto"
                    type="checkbox"
                    class="peer sr-only"
                  >
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-purple-800" />
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    نمایش سن دقیق
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    سن دقیق شما نمایش داده شود
                  </div>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input
                    v-model="privacySettings.showExactAge"
                    type="checkbox"
                    class="peer sr-only"
                  >
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-purple-800" />
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    فعال بودن آنلاین
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    وضعیت آنلاین بودن شما نمایش داده شود
                  </div>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input
                    v-model="privacySettings.showOnlineStatus"
                    type="checkbox"
                    class="peer sr-only"
                  >
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-purple-800" />
                </label>
              </div>
            </div>
          </div>

          <!-- درخواست‌های دریافتی -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              درخواست‌های دریافتی
            </h3>

            <div v-if="receivedRequests.length === 0" class="py-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                درخواست جدیدی ندارید
              </p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="request in receivedRequests"
                :key="request.id"
                class="rounded-lg border border-gray-200 p-4 dark:border-gray-600"
              >
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ request.fromName.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">
                        {{ request.fromName }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        {{ request.type === 'introduction' ? 'درخواست معرفی' : 'درخواست مشاوره' }}
                      </div>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ request.createdAt }}</span>
                </div>
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button class="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700" @click="acceptRequest(request.id)">
                    پذیرش
                  </button>
                  <button class="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700" @click="rejectRequest(request.id)">
                    رد
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- پیام‌های سیستم -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              اعلان‌ها
            </h3>

            <div class="space-y-3">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex items-start space-x-3 space-x-reverse rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20"
              >
                <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg
                    class="size-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-blue-900 dark:text-blue-300">
                    {{ notification.message }}
                  </p>
                  <p class="mt-1 text-xs text-blue-700 dark:text-blue-400">
                    {{ notification.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- محتوای نمایش در صورت قفل بودن -->
    <div v-else class="py-16 text-center">
      <div class="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        <svg
          class="size-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        ماژول همسریابی هنوز فعال نشده است
      </h3>
      <p class="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400">
        برای دسترسی به این بخش، ابتدا باید نقشه راه را تکمیل کنید و ارزیابی روانشناس را دریافت کنید.
      </p>
      <div class="mx-auto max-w-lg rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h4 class="mb-2 font-medium text-blue-900 dark:text-blue-300">
          مراحل باز شدن قفل:
        </h4>
        <ul class="space-y-1 text-right text-sm text-blue-700 dark:text-blue-400">
          <li>✓ تکمیل حداقل 80% نقشه راه</li>
          <li>✓ گذراندن آزمون‌های شخصیت‌شناسی</li>
          <li>✓ تایید آمادگی توسط مشاور</li>
          <li>⏳ ارزیابی نهایی روانشناس</li>
        </ul>
      </div>
      <button class="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700" @click="navigateTo('/hammasir/roadmap')">
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
  pendingRequests: 2,
})

// تنظیمات حریم خصوصی
const privacySettings = ref({
  showPhoto: true,
  showExactAge: true,
  showOnlineStatus: false,
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
    requestSent: false,
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
    requestSent: true,
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
    requestSent: false,
  },
])

// درخواست‌های دریافتی
const receivedRequests = ref([
  {
    id: 1,
    fromName: 'علی',
    type: 'introduction',
    createdAt: '2 ساعت پیش',
  },
  {
    id: 2,
    fromName: 'محمد',
    type: 'counselor_consultation',
    createdAt: '1 روز پیش',
  },
])

// اعلان‌ها
const notifications = ref([
  {
    id: 1,
    message: 'ماژول همسریابی برای شما فعال شد! حالا می‌توانید افراد سازگار را مشاهده کنید.',
    time: '10 دقیقه پیش',
  },
  {
    id: 2,
    message: 'یک درخواست معرفی جدید دریافت کردید.',
    time: '2 ساعت پیش',
  },
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
