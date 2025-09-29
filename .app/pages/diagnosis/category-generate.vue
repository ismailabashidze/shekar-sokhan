<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/diagnosis" class="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Icon name="ph:arrow-left" class="size-5 text-slate-600 dark:text-slate-400 rotate-180" />
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                تولید دسته‌بندی‌های DSM-5
              </h1>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                DSM-5 Categories Generator
              </p>
            </div>
          </div>
          <BaseThemeToggle />
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Input Form -->
      <div class="mb-8">
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6">
          <div class="text-center mb-6">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-full w-16 h-16 mx-auto mb-4">
              <Icon name="ph:folders" class="size-10 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              ایجاد دسته‌بندی کامل DSM-5
            </h2>
            <p class="text-slate-600 dark:text-slate-400">
              نام انگلیسی دسته‌بندی را وارد کنید تا اطلاعات کامل تولید شود
            </p>
          </div>

          <!-- Mode Selection -->
          <div class="flex gap-4 mb-6">
            <button
              @click="generationMode = 'single'"
              :class="[
                'flex-1 py-2 px-4 rounded-lg font-medium transition-all',
                generationMode === 'single' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              ]"
            >
              تولید تکی
            </button>
            <button
              @click="generationMode = 'bulk'"
              :class="[
                'flex-1 py-2 px-4 rounded-lg font-medium transition-all',
                generationMode === 'bulk' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
              ]"
            >
              تولید انبوه دسته‌ها
            </button>
          </div>

          <!-- Single Generation Form -->
          <form v-if="generationMode === 'single'" @submit.prevent="generateCategoryInfo" class="space-y-4">
            <div>
              <label for="categoryName" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                نام انگلیسی دسته‌بندی (Category English Name)
              </label>
              <input
                v-model="categoryEnglishName"
                id="categoryName"
                type="text"
                placeholder="e.g., Neurodevelopmental Disorders"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                :disabled="processing"
              />
            </div>

            <button
              type="submit"
              :disabled="!categoryEnglishName.trim() || processing"
              class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="!processing" name="ph:folders" class="size-5" />
              <div v-else class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              {{ processing ? 'در حال تولید...' : 'تولید دسته‌بندی کامل' }}
            </button>
          </form>

          <!-- Bulk Generation Controls -->
          <div v-if="generationMode === 'bulk'" class="space-y-6">
            <!-- Existing Categories Info -->
            <div v-if="existingCategoriesLoaded" class="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="ph:database" class="size-5 text-emerald-600 dark:text-emerald-400" />
                <h3 class="font-semibold text-emerald-800 dark:text-emerald-200">وضعیت فعلی پایگاه داده</h3>
              </div>
              <p class="text-sm text-emerald-700 dark:text-emerald-300">
                {{ existingCategories.length }} دسته‌بندی از {{ bulkCategoriesList.length }} دسته‌بندی قبلاً ایجاد شده است
              </p>
            </div>

            <!-- Category Selection -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-slate-900 dark:text-white">انتخاب دسته‌بندی‌های مورد نظر:</h3>
                <div class="flex gap-2">
                  <button
                    @click="selectAllCategories"
                    class="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    همه
                  </button>
                  <button
                    @click="deselectAllCategories"
                    class="text-xs px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    هیچ‌کدام
                  </button>
                  <button
                    @click="selectMissingCategories"
                    class="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    ناموجود
                  </button>
                </div>
              </div>
              
              <div class="max-h-96 overflow-y-auto space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div v-for="category in bulkCategoriesList" :key="category.titleEn" class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div class="flex items-center gap-3">
                    <input
                      type="checkbox"
                      :id="category.titleEn"
                      v-model="category.selected"
                      class="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <label :for="category.titleEn" class="cursor-pointer">
                      <div class="font-medium text-slate-900 dark:text-white text-sm">
                        {{ category.titleFa }}
                      </div>
                      <div class="text-xs text-slate-600 dark:text-slate-400">
                        {{ category.titleEn }}
                      </div>
                    </label>
                  </div>
                  <div class="text-right">
                    <div 
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="category.exists ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
                    >
                      {{ category.exists ? 'موجود' : 'ناموجود' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="text-center text-sm text-slate-600 dark:text-slate-400">
                {{ selectedCategoriesCount }} دسته‌بندی انتخاب شده
              </div>
            </div>

            <button
              @click="startBulkGeneration"
              :disabled="bulkProcessing || selectedCategoriesCount === 0"
              class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="!bulkProcessing" name="ph:rocket" class="size-5" />
              <div v-else class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              {{ bulkProcessing ? 'در حال تولید انبوه...' : `شروع تولید ${selectedCategoriesCount} دسته‌بندی` }}
            </button>

            <div v-if="bulkProcessing" class="space-y-2">
              <button
                @click="pauseBulkGeneration"
                class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Icon name="ph:pause" class="size-4" />
                {{ bulkPaused ? 'ادامه' : 'توقف موقت' }}
              </button>
              
              <button
                @click="stopBulkGeneration"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Icon name="ph:stop" class="size-4" />
                توقف کامل
              </button>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div class="flex items-start gap-3">
              <Icon name="ph:warning" class="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 class="font-medium text-red-800 dark:text-red-200">خطا در تولید اطلاعات</h3>
                <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Progress Display -->
      <div v-if="bulkProcessing" class="mb-8">
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">پیشرفت تولید انبوه دسته‌بندی‌ها</h3>
            <div class="text-sm text-slate-600 dark:text-slate-400">
              {{ bulkStats.completed }}/{{ bulkStats.total }} دسته‌بندی
            </div>
          </div>
          
          <!-- Overall Progress -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">پیشرفت کل</span>
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ Math.round((bulkStats.completed / bulkStats.total) * 100) }}%</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                :style="{ width: `${(bulkStats.completed / bulkStats.total) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Current Processing with Detailed Progress -->
          <div v-if="currentBulkItem || currentProgressDetails.length > 0" class="mb-6 space-y-4">
            <!-- Current Category Info -->
            <div v-if="currentBulkItem" class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div class="flex items-center gap-3 mb-2">
                <div class="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
                <span class="font-medium text-emerald-800 dark:text-emerald-200">در حال پردازش:</span>
              </div>
              <p class="text-sm text-emerald-700 dark:text-emerald-300">
                {{ currentBulkItem.categoryTitle }}
              </p>
            </div>

            <!-- Detailed Category Progress -->
            <div v-if="currentProgressDetails.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-slate-900 dark:text-white">جزئیات پیشرفت دسته‌بندی‌ها:</h4>
                <div class="text-xs text-slate-600 dark:text-slate-400">
                  {{ currentProgressDetails.length }} دسته‌بندی در حال پردازش/تکمیل شده
                </div>
              </div>
              
              <div class="max-h-96 overflow-y-auto space-y-3">
                <div 
                  v-for="progress in currentProgressDetails" 
                  :key="progress.categoryName"
                  class="p-4 rounded-lg border"
                  :class="[
                    progress.status === 'processing' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 
                    progress.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                    progress.status === 'failed' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                    'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  ]"
                >
                  <!-- Category Header -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <div 
                        class="w-4 h-4 rounded-full flex items-center justify-center"
                        :class="[
                          progress.status === 'processing' ? 'bg-emerald-500' : 
                          progress.status === 'completed' ? 'bg-green-500' :
                          progress.status === 'failed' ? 'bg-red-500' :
                          'bg-slate-400'
                        ]"
                      >
                        <Icon 
                          v-if="progress.status === 'completed'" 
                          name="ph:check" 
                          class="size-2.5 text-white" 
                        />
                        <Icon 
                          v-else-if="progress.status === 'failed'" 
                          name="ph:x" 
                          class="size-2.5 text-white" 
                        />
                        <div 
                          v-else-if="progress.status === 'processing'" 
                          class="animate-spin rounded-full h-2.5 w-2.5 border border-white border-t-transparent"
                        ></div>
                      </div>
                      <div>
                        <h5 class="font-medium text-sm text-slate-900 dark:text-white">
                          {{ progress.categoryName }}
                        </h5>
                      </div>
                    </div>
                    
                    <!-- Progress Summary -->
                    <div class="text-right">
                      <div class="text-xs text-slate-600 dark:text-slate-400">
                        {{ getSectionProgressSummary(progress) }}
                      </div>
                      <div 
                        v-if="progress.startTime && progress.endTime" 
                        class="text-xs text-slate-500 dark:text-slate-400"
                      >
                        {{ formatDuration(progress.endTime - progress.startTime) }}
                      </div>
                      <div 
                        v-else-if="progress.startTime" 
                        class="text-xs text-slate-500 dark:text-slate-400"
                      >
                        {{ formatDuration(Date.now() - progress.startTime) }}
                      </div>
                    </div>
                  </div>

                  <!-- Error Message -->
                  <div v-if="progress.error" class="mb-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-800 dark:text-red-200">
                    خطا: {{ progress.error }}
                  </div>

                  <!-- Sections Grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div
                      v-for="section in CATEGORY_SECTIONS"
                      :key="section.id"
                      class="flex flex-col items-center p-2 rounded-lg text-center"
                      :class="[
                        progress.sections[section.id].status === 'processing' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 
                        progress.sections[section.id].status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                        progress.sections[section.id].status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-slate-100 dark:bg-slate-800'
                      ]"
                    >
                      <!-- Section Icon -->
                      <div 
                        class="w-6 h-6 rounded-full flex items-center justify-center mb-1"
                        :class="[
                          progress.sections[section.id].status === 'processing' ? 'bg-emerald-500' : 
                          progress.sections[section.id].status === 'completed' ? 'bg-green-500' :
                          progress.sections[section.id].status === 'failed' ? 'bg-red-500' :
                          'bg-slate-400'
                        ]"
                      >
                        <Icon 
                          v-if="progress.sections[section.id].status === 'completed'" 
                          name="ph:check" 
                          class="size-3 text-white" 
                        />
                        <Icon 
                          v-else-if="progress.sections[section.id].status === 'failed'" 
                          name="ph:x" 
                          class="size-3 text-white" 
                        />
                        <div 
                          v-else-if="progress.sections[section.id].status === 'processing'" 
                          class="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"
                        ></div>
                      </div>
                      
                      <!-- Section Name -->
                      <div class="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">
                        {{ section.name }}
                      </div>
                      
                      <!-- Section Error -->
                      <div 
                        v-if="progress.sections[section.id].error" 
                        class="text-xs text-red-600 dark:text-red-400 mt-1"
                        :title="progress.sections[section.id].error"
                      >
                        خطا
                      </div>
                      
                      <!-- Section Duration -->
                      <div 
                        v-if="progress.sections[section.id].startTime && progress.sections[section.id].endTime" 
                        class="text-xs text-slate-500 dark:text-slate-400 mt-1"
                      >
                        {{ formatDuration(progress.sections[section.id].endTime! - progress.sections[section.id].startTime!) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ bulkStats.completed }}</div>
              <div class="text-xs text-green-700 dark:text-green-300">تکمیل شده</div>
            </div>
            <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ bulkStats.processing }}</div>
              <div class="text-xs text-blue-700 dark:text-blue-300">در حال پردازش</div>
            </div>
            <div class="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div class="text-lg font-bold text-red-600 dark:text-red-400">{{ bulkStats.failed }}</div>
              <div class="text-xs text-red-700 dark:text-red-300">ناموفق</div>
            </div>
            <div class="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div class="text-lg font-bold text-slate-600 dark:text-slate-400">{{ bulkStats.remaining }}</div>
              <div class="text-xs text-slate-700 dark:text-slate-300">باقی‌مانده</div>
            </div>
          </div>

          <!-- Elapsed Time -->
          <div v-if="bulkStartTime" class="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            زمان سپری شده: {{ formatElapsedTime(Date.now() - bulkStartTime) }}
          </div>
        </div>
      </div>

      <!-- Single Progress Display -->
      <div v-if="processing && !bulkProcessing" class="mb-8">
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">پیشرفت تولید دسته‌بندی</h3>
          <div class="space-y-3">
            <div v-for="step in generationSteps" :key="step.id" class="flex items-center gap-3">
              <div class="flex-shrink-0">
                <div v-if="step.status === 'completed'" class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="ph:check" class="size-4 text-white" />
                </div>
                <div v-else-if="step.status === 'processing'" class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                </div>
                <div v-else class="w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ step.title }}</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Result -->
      <div v-if="generatedCategory" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-emerald-500 p-2 rounded-lg">
              <Icon name="ph:info" class="size-5 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">اطلاعات دسته‌بندی</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">کد دسته‌بندی</label>
              <p class="text-slate-900 dark:text-white font-mono">{{ generatedCategory.code }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">آیکون</label>
              <div class="flex items-center gap-2">
                <Icon :name="generatedCategory.icon" class="size-5 text-emerald-500" />
                <p class="text-slate-900 dark:text-white">{{ generatedCategory.icon }}</p>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">عنوان فارسی</label>
              <p class="text-slate-900 dark:text-white text-lg font-semibold">{{ generatedCategory.titleFa }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">عنوان انگلیسی</label>
              <p class="text-slate-900 dark:text-white">{{ generatedCategory.titleEn }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">توضیحات</label>
              <p class="text-slate-900 dark:text-white text-sm leading-relaxed">{{ generatedCategory.description }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="text-center space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="saveToDatabase"
              :disabled="saving"
              class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon v-if="!saving" name="ph:database" class="size-5" />
              <div v-else class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              {{ saving ? 'در حال ذخیره...' : 'ذخیره در پایگاه داده' }}
            </button>
            <button
              @click="copyToClipboard"
              class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Icon name="ph:copy" class="size-5" />
              کپی JSON کامل
            </button>
          </div>
          
          <div class="space-y-2">
            <p v-if="copied" class="text-green-600 dark:text-green-400 text-sm">
              ✓ JSON کپی شد!
            </p>
            <p v-if="saved" class="text-green-600 dark:text-green-400 text-sm">
              ✓ اطلاعات با موفقیت در پایگاه داده ذخیره شد!
            </p>
            <p v-if="saveError" class="text-red-600 dark:text-red-400 text-sm">
              ✗ خطا در ذخیره: {{ saveError }}
            </p>
          </div>
        </div>

        <!-- Raw JSON Display (collapsible) -->
        <div class="bg-slate-900 dark:bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
          <button
            @click="showJson = !showJson"
            class="w-full p-4 text-left flex items-center justify-between text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-t-2xl"
          >
            <span class="font-medium">نمایش JSON خام</span>
            <Icon :name="showJson ? 'ph:caret-up' : 'ph:caret-down'" class="size-5" />
          </button>
          <div v-if="showJson" class="p-4 border-t border-slate-700">
            <pre class="text-sm text-green-400 bg-slate-900 p-4 rounded-xl overflow-x-auto"><code>{{ JSON.stringify(generatedCategory, null, 2) }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useDSMCategoryGenerator, type CategoryInfo } from '~/composables/useDSMCategoryGenerator'

// SEO
useHead({
  title: 'تولید دسته‌بندی‌های DSM-5',
  meta: [
    { name: 'description', content: 'تولید کامل دسته‌بندی‌های DSM-5 با اختلالات مرتبط' }
  ],
  htmlAttrs: { dir: 'rtl' } 
})

const { 
  generateCompleteCategoryInfo, 
  processing, 
  error, 
  categoryProgress, 
  clearProgress, 
  getAllProgress 
} = useDSMCategoryGenerator()
const { CATEGORY_SECTIONS } = await import('~/composables/useDSMCategoryGenerator')
const nuxtApp = useNuxtApp()

// State
const categoryEnglishName = ref('')
const generatedCategory = ref<CategoryInfo | null>(null)
const copied = ref(false)
const showJson = ref(false)
const saving = ref(false)
const saved = ref(false)
const saveError = ref<string | null>(null)

// Bulk generation state
const generationMode = ref<'single' | 'bulk'>('single')
const bulkProcessing = ref(false)
const bulkPaused = ref(false)
const bulkStartTime = ref<number | null>(null)
const currentBulkItem = ref<{ categoryTitle: string } | null>(null)
const existingCategories = ref<string[]>([])
const existingCategoriesLoaded = ref(false)

// Bulk statistics
const bulkStats = reactive({
  total: 0,
  completed: 0,
  processing: 0,
  failed: 0,
  remaining: 0
})

// DSM-5 Categories List
const bulkCategoriesList = ref([
  {
    titleFa: 'اختلالات نوروتکاملی',
    titleEn: 'Neurodevelopmental Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'طیف اسکیزوفرنی و سایر اختلالات روانپریشی',
    titleEn: 'Schizophrenia Spectrum and Other Psychotic Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلال دوقطبی و اختلالات مرتبط',
    titleEn: 'Bipolar and Related Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات افسردگی',
    titleEn: 'Depressive Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات اضطرابی',
    titleEn: 'Anxiety Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلال وسواسی-جبری و اختلالات مرتبط',
    titleEn: 'Obsessive-Compulsive and Related Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات مرتبط با تروما و استرس',
    titleEn: 'Trauma- and Stressor-Related Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات تجزیه‌ای',
    titleEn: 'Dissociative Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلال علائم جسمی و اختلالات مرتبط',
    titleEn: 'Somatic Symptom and Related Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات تغذیه و خوردن',
    titleEn: 'Feeding and Eating Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات دفع',
    titleEn: 'Elimination Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات خواب-بیداری',
    titleEn: 'Sleep-Wake Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات ناکارآمدی جنسی',
    titleEn: 'Sexual Dysfunctions',
    selected: true,
    exists: false
  },
  {
    titleFa: 'ناهنجاری‌های جنسی',
    titleEn: 'Paraphilic Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات مرتبط با مواد و اعتیاد',
    titleEn: 'Substance-Related and Addictive Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات شناختی',
    titleEn: 'Neurocognitive Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات شخصیت',
    titleEn: 'Personality Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات تکانشی، کنترل رفتار، و اختلال سلوک',
    titleEn: 'Disruptive, Impulse-Control, and Conduct Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلال ناهماهنگی جنسیتی',
    titleEn: 'Gender Dysphoria',
    selected: true,
    exists: false
  },
  {
    titleFa: 'سایر اختلالات روانی',
    titleEn: 'Other Mental Disorders',
    selected: true,
    exists: false
  },
  {
    titleFa: 'اختلالات حرکتی ناشی از دارو و سایر عوارض نامطلوب داروها',
    titleEn: 'Medication-Induced Movement Disorders and Other Adverse Effects of Medication',
    selected: true,
    exists: false
  },
  {
    titleFa: 'سایر شرایطی که ممکن است محور توجه بالینی باشند',
    titleEn: 'Other Conditions That May Be a Focus of Clinical Attention',
    selected: true,
    exists: false
  }
])

const generationSteps = reactive([
  { id: 1, title: 'اطلاعات کلی', description: 'تولید کد، عنوان‌ها، آیکون و توضیحات', status: 'pending' },
  { id: 2, title: 'آمار دسته‌بندی', description: 'تولید آمار تعداد، شیوع و دوران شروع', status: 'pending' },
  { id: 3, title: 'ویژگی‌های کلیدی', description: 'تولید ویژگی‌های اصلی دسته‌بندی', status: 'pending' },
  { id: 4, title: 'حیطه‌های تأثیرگذاری', description: 'تولید مناطق تأثیر با آیکون‌ها', status: 'pending' },
  { id: 5, title: 'اطلاعات کلی', description: 'تولید عنوان و توضیحات بخش overview', status: 'pending' },
  { id: 6, title: 'منابع مفید', description: 'تولید منابع تخصصی و مراجع', status: 'pending' },
  { id: 7, title: 'اختلالات خلاصه', description: 'تولید فهرست اختلالات مرتبط', status: 'pending' },
])

// Computed properties
const selectedCategoriesCount = computed(() => {
  return bulkCategoriesList.value.filter(cat => cat.selected).length
})

const currentProgressDetails = computed(() => {
  return getAllProgress().filter(progress => 
    progress.status === 'processing' || 
    progress.status === 'completed' ||
    progress.status === 'failed'
  )
})

// Generate single category using AI
const generateCategoryInfo = async () => {
  if (!categoryEnglishName.value.trim()) return

  try {
    // Reset all steps
    generationSteps.forEach(step => step.status = 'pending')
    generatedCategory.value = null

    // Simulate step-by-step progress
    for (let i = 1; i <= generationSteps.length; i++) {
      updateStepStatus(i, 'processing')
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    const result = await generateCompleteCategoryInfo(categoryEnglishName.value.trim())
    generatedCategory.value = result

    // Mark all steps as completed
    generationSteps.forEach(step => step.status = 'completed')

  } catch (err: any) {
    console.error('Category generation failed:', err)
    // Reset step statuses on error
    generationSteps.forEach(step => step.status = 'pending')
  }
}

const updateStepStatus = (stepId: number, status: 'pending' | 'processing' | 'completed') => {
  const step = generationSteps.find(s => s.id === stepId)
  if (step) {
    step.status = status
  }
}

// Load existing categories
const loadExistingCategories = async () => {
  try {
    const pb = nuxtApp.$pb
    const records = await pb.collection('DSM5_categories').getFullList({
      fields: 'titleEn'
    })
    
    existingCategories.value = records.map(record => record.titleEn)
    
    // Update exists status
    bulkCategoriesList.value.forEach(category => {
      category.exists = existingCategories.value.includes(category.titleEn)
    })
    
    existingCategoriesLoaded.value = true
    console.log(`Loaded ${existingCategories.value.length} existing categories`)
    
  } catch (error) {
    console.error('Failed to load existing categories:', error)
    existingCategoriesLoaded.value = true
  }
}

// Category selection functions
const selectAllCategories = () => {
  bulkCategoriesList.value.forEach(cat => cat.selected = true)
}

const deselectAllCategories = () => {
  bulkCategoriesList.value.forEach(cat => cat.selected = false)
}

const selectMissingCategories = () => {
  bulkCategoriesList.value.forEach(cat => {
    cat.selected = !cat.exists
  })
}

// Bulk generation with AI
const startBulkGeneration = async () => {
  bulkProcessing.value = true
  bulkPaused.value = false
  bulkStartTime.value = Date.now()
  clearProgress() // Clear previous progress
  
  const selectedCategories = bulkCategoriesList.value.filter(cat => cat.selected && !cat.exists)
  
  bulkStats.total = selectedCategories.length
  bulkStats.completed = 0
  bulkStats.processing = 0
  bulkStats.failed = 0
  bulkStats.remaining = selectedCategories.length

  try {
    console.log(`🚀 Starting bulk category generation: ${selectedCategories.length} categories`)

    for (const category of selectedCategories) {
      if (!bulkProcessing.value) break
      
      // Wait if paused
      while (bulkPaused.value && bulkProcessing.value) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      if (!bulkProcessing.value) break

      try {
        bulkStats.processing = 1
        currentBulkItem.value = { categoryTitle: category.titleFa }

        // Generate category using AI with detailed progress
        const result = await generateCompleteCategoryInfo(
          category.titleEn, 
          true // Enable detailed progress
        )
        
        // Save to database
        const pb = nuxtApp.$pb
        const data = {
          code: result.code,
          titleFa: result.titleFa,
          titleEn: result.titleEn,
          icon: result.icon,
          description: result.description,
          stats: JSON.stringify(result.stats),
          keyFeatures: JSON.stringify(result.keyFeatures),
          impactAreas: JSON.stringify(result.impactAreas),
          overview: JSON.stringify(result.overview),
          resources: JSON.stringify(result.resources),
          disorders: JSON.stringify(result.disorders)
        }

        await pb.collection('DSM5_categories').create(data)
        console.log(`💾 Category saved: ${result.titleEn}`)
        
        bulkStats.completed++
        bulkStats.remaining--
        category.exists = true
        
        console.log(`✅ Generated category: ${category.titleEn}`)
        
      } catch (error: any) {
        console.error(`❌ Failed category: ${category.titleEn} -`, error.message)
        bulkStats.failed++
        bulkStats.remaining--
      }
      
      bulkStats.processing = 0
      
      // Delay between categories
      if (bulkProcessing.value) {
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }
    
    if (bulkProcessing.value) {
      console.log('🎉 Bulk category generation completed!')
    }
    
  } catch (error: any) {
    console.error('Bulk generation failed:', error)
  } finally {
    bulkProcessing.value = false
    bulkPaused.value = false
    currentBulkItem.value = null
    bulkStats.processing = 0
  }
}

const pauseBulkGeneration = () => {
  bulkPaused.value = !bulkPaused.value
}

const stopBulkGeneration = () => {
  bulkProcessing.value = false
  bulkPaused.value = false
  currentBulkItem.value = null
  bulkStats.processing = 0
}

// Save to database
const saveToDatabase = async () => {
  if (!generatedCategory.value) return

  saving.value = true
  saveError.value = null
  saved.value = false

  try {
    const pb = nuxtApp.$pb

    const data = {
      code: generatedCategory.value.code,
      titleFa: generatedCategory.value.titleFa,
      titleEn: generatedCategory.value.titleEn,
      icon: generatedCategory.value.icon,
      description: generatedCategory.value.description,
      stats: JSON.stringify(generatedCategory.value.stats),
      keyFeatures: JSON.stringify(generatedCategory.value.keyFeatures),
      impactAreas: JSON.stringify(generatedCategory.value.impactAreas),
      overview: JSON.stringify(generatedCategory.value.overview),
      resources: JSON.stringify(generatedCategory.value.resources),
      disorders: JSON.stringify(generatedCategory.value.disorders)
    }

    const record = await pb.collection('DSM5_categories').create(data)
    console.log('Category saved successfully:', record)
    
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 5000)

  } catch (err: any) {
    console.error('Failed to save to database:', err)
    saveError.value = err.message || 'خطا در ذخیره اطلاعات'
    setTimeout(() => {
      saveError.value = null
    }, 5000)
  } finally {
    saving.value = false
  }
}

// Copy to clipboard
const copyToClipboard = async () => {
  if (!generatedCategory.value) return

  try {
    await navigator.clipboard.writeText(JSON.stringify(generatedCategory.value, null, 2))
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Get section progress summary
const getSectionProgressSummary = (progress: any) => {
  const completedSections = Object.values(progress.sections).filter((section: any) => section.status === 'completed').length
  const totalSections = CATEGORY_SECTIONS.length
  return `${completedSections}/${totalSections}`
}

// Format duration
const formatDuration = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  
  if (minutes > 0) {
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }
  return `${seconds}s`
}

// Format elapsed time
const formatElapsedTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
  }
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

// Initialize on mount
onMounted(async () => {
  await loadExistingCategories()
})
</script>