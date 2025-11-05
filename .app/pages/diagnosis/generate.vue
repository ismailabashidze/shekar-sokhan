<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Header -->
    <div class="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
      <div class="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink to="/diagnosis" class="rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
              <Icon name="ph:arrow-left" class="size-5 rotate-180 text-slate-600 dark:text-slate-400" />
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                تولید اطلاعات اختلال DSM-5
              </h1>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
                DSM-5 Disorder Information Generator
              </p>
            </div>
          </div>
          <BaseThemeToggle />
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Input Form -->
      <div class="mb-8">
        <div class="rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/60">
          <div class="mb-6 text-center">
            <div class="mx-auto mb-4 size-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3">
              <Icon name="ph:brain" class="size-10 text-white" />
            </div>
            <h2 class="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
              ایجاد اطلاعات کامل اختلال
            </h2>
            <p class="text-slate-600 dark:text-slate-400">
              نام انگلیسی اختلال را وارد کنید تا اطلاعات کامل DSM-5 تولید شود
            </p>
          </div>

          <!-- Mode Selection -->
          <div class="mb-6 flex gap-4">
            <button
              :class="[
                'flex-1 rounded-lg px-4 py-2 font-medium transition-all',
                generationMode === 'single'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              ]"
              @click="generationMode = 'single'"
            >
              تولید تکی
            </button>
            <button
              :class="[
                'flex-1 rounded-lg px-4 py-2 font-medium transition-all',
                generationMode === 'bulk'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              ]"
              @click="generationMode = 'bulk'"
            >
              تولید انبوه DSM-5
            </button>
          </div>

          <!-- Single Generation Form -->
          <form
            v-if="generationMode === 'single'"
            class="space-y-4"
            @submit.prevent="generateDisorderInfo"
          >
            <div>
              <label for="disorderName" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                نام انگلیسی اختلال (Disorder English Name)
              </label>
              <input
                id="disorderName"
                v-model="disorderEnglishName"
                type="text"
                placeholder="e.g., Attention-Deficit/Hyperactivity Disorder"
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all placeholder:text-slate-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                :disabled="processing"
              >
            </div>

            <button
              type="submit"
              :disabled="!disorderEnglishName.trim() || processing"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
            >
              <Icon
                v-if="!processing"
                name="ph:magic-wand"
                class="size-5"
              />
              <div v-else class="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {{ processing ? 'در حال تولید...' : 'تولید اطلاعات کامل' }}
            </button>
          </form>

          <!-- Bulk Generation Controls -->
          <div v-if="generationMode === 'bulk'" class="space-y-6">
            <!-- Existing Disorders Info -->
            <div v-if="existingDisordersLoaded" class="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20">
              <div class="mb-2 flex items-center gap-2">
                <Icon name="ph:database" class="size-5 text-blue-600 dark:text-blue-400" />
                <h3 class="font-semibold text-blue-800 dark:text-blue-200">
                  وضعیت فعلی پایگاه داده
                </h3>
              </div>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                {{ existingDisorders.length }} اختلال از {{ bulkStats.total }} اختلال قبلاً ایجاد شده است
              </p>
              <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">
                تولید انبوه از جایی که متوقف شده ادامه خواهد یافت
              </p>
            </div>

            <!-- Category Selection -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-slate-900 dark:text-white">
                  انتخاب دسته‌های مورد نظر:
                </h3>
                <div class="flex gap-2">
                  <button
                    class="rounded-lg bg-green-500 px-3 py-1 text-xs text-white transition-colors hover:bg-green-600"
                    @click="selectAllCategories"
                  >
                    همه
                  </button>
                  <button
                    class="rounded-lg bg-red-500 px-3 py-1 text-xs text-white transition-colors hover:bg-red-600"
                    @click="deselectAllCategories"
                  >
                    هیچ‌کدام
                  </button>
                  <button
                    class="rounded-lg bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600"
                    @click="selectIncompleteCategories"
                  >
                    ناتمام
                  </button>
                </div>
              </div>

              <div class="max-h-96 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div
                  v-for="category in bulkCategories"
                  :key="category.titleEn"
                  class="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div class="flex items-center gap-3">
                    <input
                      :id="category.titleEn"
                      v-model="category.selected"
                      type="checkbox"
                      class="size-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:ring-offset-slate-800 dark:focus:ring-blue-600"
                    >
                    <label :for="category.titleEn" class="cursor-pointer">
                      <div class="text-sm font-medium text-slate-900 dark:text-white">
                        {{ category.title }}
                      </div>
                      <div class="text-xs text-slate-600 dark:text-slate-400">
                        {{ category.existingCount }}/{{ category.disorders.length }} اختلال موجود
                      </div>
                    </label>
                  </div>
                  <div class="text-right">
                    <div class="h-2 w-20 rounded-full bg-slate-200 dark:bg-slate-600">
                      <div
                        class="h-2 rounded-full transition-all duration-300"
                        :class="category.existingCount === category.disorders.length ? 'bg-green-500' : 'bg-blue-500'"
                        :style="{ width: `${(category.existingCount / category.disorders.length) * 100}%` }"
                      />
                    </div>
                    <div class="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {{ Math.round((category.existingCount / category.disorders.length) * 100) }}%
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-center text-sm text-slate-600 dark:text-slate-400">
                {{ selectedCategoriesCount }} دسته انتخاب شده -
                {{ selectedDisordersCount }} اختلال برای تولید
              </div>
            </div>

            <!-- Concurrency Control -->
            <div class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div class="flex items-center justify-between">
                <label class="font-medium text-slate-900 dark:text-white">تعداد تولید همزمان:</label>
                <div class="flex items-center gap-3">
                  <input
                    v-model.number="concurrencyLevel"
                    type="range"
                    min="1"
                    max="10"
                    class="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700"
                  >
                  <div class="flex min-w-16 items-center gap-2">
                    <span class="font-mono text-lg font-semibold text-blue-600 dark:text-blue-400">{{ concurrencyLevel }}</span>
                    <Icon
                      :name="concurrencyLevel <= 3 ? 'ph:speedometer' : concurrencyLevel <= 7 ? 'ph:gauge' : 'ph:fire'"
                      class="size-5"
                      :class="concurrencyLevel <= 3 ? 'text-green-500' : concurrencyLevel <= 7 ? 'text-yellow-500' : 'text-red-500'"
                    />
                  </div>
                </div>
              </div>
              <div class="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>کم (کمتر بار روی API)</span>
                <span>متوسط</span>
                <span>زیاد (سریع‌تر اما بار بیشتر)</span>
              </div>
              <div class="text-center">
                <div class="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
                  <Icon name="ph:clock" class="size-4 text-blue-600 dark:text-blue-400" />
                  <span class="text-sm text-blue-800 dark:text-blue-200">
                    زمان تخمینی: {{ Math.ceil(selectedDisordersCount / concurrencyLevel) * 3 }} دقیقه
                  </span>
                </div>
              </div>
            </div>

            <!-- Warning -->
            <div class="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-center dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
              <Icon name="ph:warning" class="mx-auto mb-2 size-6 text-amber-600 dark:text-amber-400" />
              <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
                {{ selectedDisordersCount }} اختلال در دسته‌های انتخابی تولید خواهد شد
              </p>
              <p class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                با {{ concurrencyLevel }} تولید همزمان
              </p>
            </div>

            <button
              :disabled="bulkProcessing || selectedDisordersCount === 0"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:from-red-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
              @click="startBulkGeneration"
            >
              <Icon
                v-if="!bulkProcessing"
                name="ph:rocket"
                class="size-5"
              />
              <div v-else class="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {{ bulkProcessing ? 'در حال تولید انبوه...' : `شروع تولید ${selectedDisordersCount} اختلال` }}
            </button>

            <div v-if="bulkProcessing" class="space-y-2">
              <button
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 font-medium text-white transition-all hover:bg-yellow-700"
                @click="pauseBulkGeneration"
              >
                <Icon name="ph:pause" class="size-4" />
                {{ bulkPaused ? 'ادامه' : 'توقف موقت' }}
              </button>

              <button
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-all hover:bg-red-700"
                @click="stopBulkGeneration"
              >
                <Icon name="ph:stop" class="size-4" />
                توقف کامل
              </button>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div class="flex items-start gap-3">
              <Icon name="ph:warning" class="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h3 class="font-medium text-red-800 dark:text-red-200">
                  خطا در تولید اطلاعات
                </h3>
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ error }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Progress Display -->
      <div v-if="bulkProcessing" class="mb-8">
        <div class="rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/60">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              پیشرفت تولید انبوه DSM-5
            </h3>
            <div class="text-sm text-slate-600 dark:text-slate-400">
              {{ bulkStats.completed }}/{{ bulkStats.total }} اختلال
            </div>
          </div>

          <!-- Overall Progress -->
          <div class="mb-6">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">پیشرفت کل</span>
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ Math.round((bulkStats.completed / bulkStats.total) * 100) }}%</span>
            </div>
            <div class="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                class="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                :style="{ width: `${(bulkStats.completed / bulkStats.total) * 100}%` }"
              />
            </div>
          </div>

          <!-- Current Processing with Detailed Progress -->
          <div v-if="currentBulkItem || currentProgressDetails.length > 0" class="mb-6 space-y-4">
            <!-- Current Batch Info -->
            <div v-if="currentBulkItem" class="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div class="mb-2 flex items-center gap-3">
                <div class="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <span class="font-medium text-blue-800 dark:text-blue-200">در حال پردازش:</span>
                <div class="flex items-center gap-1 rounded-full bg-blue-200 px-2 py-1 dark:bg-blue-800">
                  <Icon name="ph:lightning" class="size-3 text-blue-700 dark:text-blue-300" />
                  <span class="font-mono text-xs text-blue-700 dark:text-blue-300">×{{ concurrencyLevel }}</span>
                </div>
              </div>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                <span class="font-semibold">{{ currentBulkItem.categoryTitle }}</span> - {{ currentBulkItem.disorderName }}
              </p>
            </div>

            <!-- Detailed Disorders Progress -->
            <div v-if="currentProgressDetails.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
                  جزئیات پیشرفت اختلالات:
                </h4>
                <div class="text-xs text-slate-600 dark:text-slate-400">
                  {{ currentProgressDetails.length }} اختلال در حال پردازش/تکمیل شده
                </div>
              </div>

              <div class="max-h-96 space-y-3 overflow-y-auto">
                <div
                  v-for="progress in currentProgressDetails"
                  :key="progress.disorderName"
                  class="rounded-lg border p-4"
                  :class="[
                    progress.status === 'processing' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' :
                    progress.status === 'completed' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
                    progress.status === 'failed' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' :
                    'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
                  ]"
                >
                  <!-- Disorder Header -->
                  <div class="mb-3 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        class="flex size-4 items-center justify-center rounded-full"
                        :class="[
                          progress.status === 'processing' ? 'bg-blue-500' :
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
                          class="size-2.5 animate-spin rounded-full border border-white border-t-transparent"
                        />
                      </div>
                      <div>
                        <h5 class="text-sm font-medium text-slate-900 dark:text-white">
                          {{ progress.disorderName }}
                        </h5>
                        <p class="text-xs text-slate-600 dark:text-slate-400">
                          {{ progress.categoryTitle }}
                        </p>
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
                  <div v-if="progress.error" class="mb-3 rounded bg-red-100 p-2 text-xs text-red-800 dark:bg-red-900/30 dark:text-red-200">
                    خطا: {{ progress.error }}
                  </div>

                  <!-- Sections Grid -->
                  <div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    <div
                      v-for="section in DISORDER_SECTIONS"
                      :key="section.id"
                      class="flex flex-col items-center rounded-lg p-2 text-center"
                      :class="[
                        progress.sections[section.id].status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        progress.sections[section.id].status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                        progress.sections[section.id].status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-slate-100 dark:bg-slate-800'
                      ]"
                    >
                      <!-- Section Icon -->
                      <div
                        class="mb-1 flex size-6 items-center justify-center rounded-full"
                        :class="[
                          progress.sections[section.id].status === 'processing' ? 'bg-blue-500' :
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
                          class="size-3 animate-spin rounded-full border border-white border-t-transparent"
                        />
                      </div>

                      <!-- Section Name -->
                      <div class="text-xs font-medium leading-tight text-slate-700 dark:text-slate-300">
                        {{ section.name }}
                      </div>

                      <!-- Section Error -->
                      <div
                        v-if="progress.sections[section.id].error"
                        class="mt-1 text-xs text-red-600 dark:text-red-400"
                        :title="progress.sections[section.id].error"
                      >
                        خطا
                      </div>

                      <!-- Section Duration -->
                      <div
                        v-if="progress.sections[section.id].startTime && progress.sections[section.id].endTime"
                        class="mt-1 text-xs text-slate-500 dark:text-slate-400"
                      >
                        {{ formatDuration(progress.sections[section.id].endTime! - progress.sections[section.id].startTime!) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Categories Progress -->
          <div class="max-h-96 space-y-3 overflow-y-auto">
            <div
              v-for="category in bulkCategories"
              :key="category.titleEn"
              class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div class="mb-2 flex items-center justify-between">
                <h4 class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ category.title }}
                </h4>
                <span class="text-xs text-slate-600 dark:text-slate-400">
                  {{ category.completed }}/{{ category.disorders.length }}
                </span>
              </div>
              <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-600">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="category.completed === category.disorders.length ? 'bg-green-500' : 'bg-blue-500'"
                  :style="{ width: `${(category.completed / category.disorders.length) * 100}%` }"
                />
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div class="rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-800 dark:bg-green-900/20">
              <div class="text-lg font-bold text-green-600 dark:text-green-400">
                {{ bulkStats.completed }}
              </div>
              <div class="text-xs text-green-700 dark:text-green-300">
                تکمیل شده
              </div>
            </div>
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-800 dark:bg-blue-900/20">
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ bulkStats.processing }}
              </div>
              <div class="text-xs text-blue-700 dark:text-blue-300">
                در حال پردازش
              </div>
            </div>
            <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-800 dark:bg-red-900/20">
              <div class="text-lg font-bold text-red-600 dark:text-red-400">
                {{ bulkStats.failed }}
              </div>
              <div class="text-xs text-red-700 dark:text-red-300">
                ناموفق
              </div>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-700 dark:bg-slate-800">
              <div class="text-lg font-bold text-slate-600 dark:text-slate-400">
                {{ bulkStats.remaining }}
              </div>
              <div class="text-xs text-slate-700 dark:text-slate-300">
                باقی‌مانده
              </div>
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
        <div class="rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/60">
          <h3 class="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            پیشرفت تولید
          </h3>
          <div class="space-y-3">
            <div
              v-for="step in generationSteps"
              :key="step.id"
              class="flex items-center gap-3"
            >
              <div class="shrink-0">
                <div v-if="step.status === 'completed'" class="flex size-6 items-center justify-center rounded-full bg-green-500">
                  <Icon name="ph:check" class="size-4 text-white" />
                </div>
                <div v-else-if="step.status === 'processing'" class="flex size-6 items-center justify-center rounded-full bg-blue-500">
                  <div class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
                <div v-else class="size-6 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ step.title }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated Result -->
      <div v-if="generatedInfo" class="space-y-6">
        <!-- Basic Information -->
        <div class="rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/60">
          <div class="mb-4 flex items-center gap-3">
            <div class="rounded-lg bg-blue-500 p-2">
              <Icon name="ph:info" class="size-5 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              اطلاعات کلی
            </h3>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">کد DSM-5</label>
              <p class="font-mono text-slate-900 dark:text-white">
                {{ generatedInfo.code }}
              </p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">شیوع</label>
              <p class="text-slate-900 dark:text-white">
                {{ generatedInfo.Prevalence }}
              </p>
            </div>
            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">عنوان فارسی</label>
              <p class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ generatedInfo.title }}
              </p>
            </div>
            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">توضیحات</label>
              <p class="text-sm leading-relaxed text-slate-900 dark:text-white">
                {{ generatedInfo.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Diagnosis Criteria -->
        <div class="rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/60">
          <div class="mb-4 flex items-center gap-3">
            <div class="rounded-lg bg-emerald-500 p-2">
              <Icon name="ph:list-checks" class="size-5 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              معیارهای تشخیصی
            </h3>
          </div>
          <div class="space-y-4">
            <div
              v-for="criterion in generatedInfo.diagnosisCriteria"
              :key="criterion.alphabet"
              class="border-r-4 border-emerald-500 pr-4"
            >
              <h4 class="mb-2 font-semibold text-slate-900 dark:text-white">
                معیار {{ criterion.alphabet }}: {{ criterion.description }}
              </h4>
              <ul v-if="criterion.subsets.length > 0" class="mr-4 space-y-1">
                <li
                  v-for="subset in criterion.subsets"
                  :key="subset.number"
                  class="text-sm text-slate-700 dark:text-slate-300"
                >
                  {{ subset.number }}. {{ subset.description }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4 text-center">
          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              :disabled="saving"
              class="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
              @click="saveToDatabase"
            >
              <Icon
                v-if="!saving"
                name="ph:database"
                class="size-5"
              />
              <div v-else class="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {{ saving ? 'در حال ذخیره...' : 'ذخیره در پایگاه داده' }}
            </button>
            <button
              class="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700"
              @click="copyToClipboard"
            >
              <Icon name="ph:copy" class="size-5" />
              کپی JSON کامل
            </button>
          </div>

          <div class="space-y-2">
            <p v-if="copied" class="text-sm text-green-600 dark:text-green-400">
              ✓ JSON کپی شد!
            </p>
            <p v-if="saved" class="text-sm text-green-600 dark:text-green-400">
              ✓ اطلاعات با موفقیت در پایگاه داده ذخیره شد!
            </p>
            <p v-if="saveError" class="text-sm text-red-600 dark:text-red-400">
              ✗ خطا در ذخیره: {{ saveError }}
            </p>
          </div>
        </div>

        <!-- Raw JSON Display (collapsible) -->
        <div class="rounded-2xl border border-slate-700 bg-slate-900 shadow-xl dark:bg-slate-800">
          <button
            class="flex w-full items-center justify-between rounded-t-2xl p-4 text-left text-white transition-colors hover:bg-slate-800 dark:hover:bg-slate-700"
            @click="showJson = !showJson"
          >
            <span class="font-medium">نمایش JSON خام</span>
            <Icon :name="showJson ? 'ph:caret-up' : 'ph:caret-down'" class="size-5" />
          </button>
          <div v-if="showJson" class="border-t border-slate-700 p-4">
            <pre class="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-green-400"><code>{{ JSON.stringify(generatedInfo, null, 2) }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useDSMInfoGenerator, type DisorderInfo } from '~/composables/useDSMInfoGenerator';

// SEO
useHead({
  title: 'تولید اطلاعات اختلال DSM-5',
  meta: [
    { name: 'description', content: 'تولید کامل اطلاعات اختلالات روانشناختی بر اساس DSM-5' },
  ],
  htmlAttrs: { dir: 'rtl' },
});

const {
  generateCompleteDisorderInfo,
  processing,
  error,
  disorderProgress,
  clearProgress,
  getAllProgress,
} = useDSMInfoGenerator();
const { DISORDER_SECTIONS } = await import('~/composables/useDSMInfoGenerator');
const nuxtApp = useNuxtApp();

const disorderEnglishName = ref('');
const generatedInfo = ref<DisorderInfo | null>(null);
const copied = ref(false);
const showJson = ref(false);
const saving = ref(false);
const saved = ref(false);
const saveError = ref<string | null>(null);

// Bulk generation state
const generationMode = ref<'single' | 'bulk'>('single');
const bulkProcessing = ref(false);
const bulkPaused = ref(false);
const bulkStartTime = ref<number | null>(null);
const currentBulkItem = ref<{ categoryTitle: string; disorderName: string } | null>(null);
const existingDisorders = ref<string[]>([]);
const existingDisordersLoaded = ref(false);
const concurrencyLevel = ref(5); // Default to 5 concurrent generations

// Bulk statistics
const bulkStats = reactive({
  total: 0,
  completed: 0,
  processing: 0,
  failed: 0,
  remaining: 0,
});

// DSM-5 Categories and Disorders
const bulkCategories = ref([
  {
    title: 'اختلالات تکاملی عصبی',
    titleEn: 'Neurodevelopmental Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Intellectual Disabilities',
      'Global Developmental Delay',
      'Unspecified Intellectual Disability',
      'Communication Disorders',
      'Language Disorder',
      'Speech Sound Disorder',
      'Social (Pragmatic) Communication Disorder',
      'Autism Spectrum Disorder',
      'Attention-Deficit/Hyperactivity Disorder',
      'Specific Learning Disorder',
      'Motor Disorders',
      'Developmental Coordination Disorder',
      'Stereotypic Movement Disorder',
      'Tic Disorders',
    ],
  },
  {
    title: 'طیف اسکیزوفرنی و سایر اختلالات روانپریشی',
    titleEn: 'Schizophrenia Spectrum and Other Psychotic Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Delusional Disorder',
      'Brief Psychotic Disorder',
      'Schizophreniform Disorder',
      'Schizophrenia',
      'Schizoaffective Disorder',
      'Substance/Medication-Induced Psychotic Disorder',
      'Psychotic Disorder Due to Another Medical Condition',
      'Other Specified Schizophrenia Spectrum and Other Psychotic Disorder',
      'Unspecified Schizophrenia Spectrum and Other Psychotic Disorder',
    ],
  },
  {
    title: 'اختلال دوقطبی و اختلالات مرتبط',
    titleEn: 'Bipolar and Related Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Bipolar I Disorder',
      'Bipolar II Disorder',
      'Cyclothymic Disorder',
      'Substance/Medication-Induced Bipolar and Related Disorder',
      'Bipolar and Related Disorder Due to Another Medical Condition',
      'Other Specified Bipolar and Related Disorder',
      'Unspecified Bipolar and Related Disorder',
    ],
  },
  {
    title: 'اختلالات افسردگی',
    titleEn: 'Depressive Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Disruptive Mood Dysregulation Disorder',
      'Major Depressive Disorder',
      'Persistent Depressive Disorder',
      'Premenstrual Dysphoric Disorder',
      'Substance/Medication-Induced Depressive Disorder',
      'Depressive Disorder Due to Another Medical Condition',
      'Other Specified Depressive Disorder',
      'Unspecified Depressive Disorder',
    ],
  },
  {
    title: 'اختلالات اضطرابی',
    titleEn: 'Anxiety Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Separation Anxiety Disorder',
      'Selective Mutism',
      'Specific Phobia',
      'Social Anxiety Disorder',
      'Panic Disorder',
      'Agoraphobia',
      'Generalized Anxiety Disorder',
      'Substance/Medication-Induced Anxiety Disorder',
      'Anxiety Disorder Due to Another Medical Condition',
      'Other Specified Anxiety Disorder',
      'Unspecified Anxiety Disorder',
    ],
  },
  {
    title: 'اختلال وسواسی-جبری و اختلالات مرتبط',
    titleEn: 'Obsessive-Compulsive and Related Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Obsessive-Compulsive Disorder',
      'Body Dysmorphic Disorder',
      'Hoarding Disorder',
      'Trichotillomania',
      'Excoriation Disorder',
      'Substance/Medication-Induced Obsessive-Compulsive and Related Disorder',
      'Obsessive-Compulsive and Related Disorder Due to Another Medical Condition',
      'Other Specified Obsessive-Compulsive and Related Disorder',
      'Unspecified Obsessive-Compulsive and Related Disorder',
    ],
  },
  {
    title: 'اختلالات مرتبط با تروما و استرس',
    titleEn: 'Trauma- and Stressor-Related Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Reactive Attachment Disorder',
      'Disinhibited Social Engagement Disorder',
      'Posttraumatic Stress Disorder',
      'Acute Stress Disorder',
      'Adjustment Disorders',
      'Other Specified Trauma- and Stressor-Related Disorder',
      'Unspecified Trauma- and Stressor-Related Disorder',
    ],
  },
  {
    title: 'اختلالات تجزیه‌ای',
    titleEn: 'Dissociative Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Dissociative Identity Disorder',
      'Dissociative Amnesia',
      'Depersonalization/Derealization Disorder',
      'Other Specified Dissociative Disorder',
      'Unspecified Dissociative Disorder',
    ],
  },
  {
    title: 'اختلال علائم جسمی و اختلالات مرتبط',
    titleEn: 'Somatic Symptom and Related Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Somatic Symptom Disorder',
      'Illness Anxiety Disorder',
      'Conversion Disorder',
      'Psychological Factors Affecting Other Medical Conditions',
      'Factitious Disorder',
      'Other Specified Somatic Symptom and Related Disorder',
      'Unspecified Somatic Symptom and Related Disorder',
    ],
  },
  {
    title: 'اختلالات تغذیه و خوردن',
    titleEn: 'Feeding and Eating Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Pica',
      'Rumination Disorder',
      'Avoidant/Restrictive Food Intake Disorder',
      'Anorexia Nervosa',
      'Bulimia Nervosa',
      'Binge-Eating Disorder',
      'Other Specified Feeding or Eating Disorder',
      'Unspecified Feeding or Eating Disorder',
    ],
  },
  {
    title: 'اختلالات دفع',
    titleEn: 'Elimination Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Enuresis',
      'Encopresis',
      'Other Specified Elimination Disorder',
      'Unspecified Elimination Disorder',
    ],
  },
  {
    title: 'اختلالات خواب-بیداری',
    titleEn: 'Sleep-Wake Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Insomnia Disorder',
      'Hypersomnolence Disorder',
      'Narcolepsy',
      'Breathing-Related Sleep Disorders',
      'Circadian Rhythm Sleep-Wake Disorders',
      'Non-Rapid Eye Movement Sleep Arousal Disorders',
      'Nightmare Disorder',
      'Rapid Eye Movement Sleep Behavior Disorder',
      'Restless Legs Syndrome',
      'Substance/Medication-Induced Sleep Disorder',
    ],
  },
  {
    title: 'اختلالات ناکارآمدی جنسی',
    titleEn: 'Sexual Dysfunctions',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Delayed Ejaculation',
      'Erectile Disorder',
      'Female Orgasmic Disorder',
      'Female Sexual Interest/Arousal Disorder',
      'Genito-Pelvic Pain/Penetration Disorder',
      'Male Hypoactive Sexual Desire Disorder',
      'Premature Ejaculation',
      'Substance/Medication-Induced Sexual Dysfunction',
      'Other Specified Sexual Dysfunction',
      'Unspecified Sexual Dysfunction',
    ],
  },
  {
    title: 'ناهنجاری‌های جنسی',
    titleEn: 'Paraphilic Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Voyeuristic Disorder',
      'Exhibitionistic Disorder',
      'Frotteuristic Disorder',
      'Sexual Masochism Disorder',
      'Sexual Sadism Disorder',
      'Pedophilic Disorder',
      'Fetishistic Disorder',
      'Transvestic Disorder',
      'Other Specified Paraphilic Disorder',
      'Unspecified Paraphilic Disorder',
    ],
  },
  {
    title: 'اختلالات مرتبط با مواد و اعتیاد',
    titleEn: 'Substance-Related and Addictive Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Alcohol-Related Disorders',
      'Caffeine-Related Disorders',
      'Cannabis-Related Disorders',
      'Hallucinogen-Related Disorders',
      'Inhalant-Related Disorders',
      'Opioid-Related Disorders',
      'Sedative-, Hypnotic-, or Anxiolytic-Related Disorders',
      'Stimulant-Related Disorders',
      'Tobacco-Related Disorders',
      'Other Substance-Related Disorders',
      'Non-Substance-Related Disorders',
    ],
  },
  {
    title: 'اختلالات شناختی',
    titleEn: 'Neurocognitive Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Delirium',
      'Major Neurocognitive Disorder',
      'Minor Neurocognitive Disorder',
      'Other Specified Neurocognitive Disorder',
      'Unspecified Neurocognitive Disorder',
    ],
  },
  {
    title: 'اختلالات شخصیت',
    titleEn: 'Personality Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Paranoid Personality Disorder',
      'Schizoid Personality Disorder',
      'Schizotypal Personality Disorder',
      'Antisocial Personality Disorder',
      'Borderline Personality Disorder',
      'Histrionic Personality Disorder',
      'Narcissistic Personality Disorder',
      'Avoidant Personality Disorder',
      'Dependent Personality Disorder',
      'Obsessive-Compulsive Personality Disorder',
      'Other Specified Personality Disorder',
      'Unspecified Personality Disorder',
    ],
  },
  {
    title: 'اختلالات پارافیلیک',
    titleEn: 'Paraphilic Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Voyeuristic Disorder',
      'Exhibitionistic Disorder',
      'Frotteuristic Disorder',
      'Sexual Masochism Disorder',
      'Sexual Sadism Disorder',
      'Pedophilic Disorder',
      'Fetishistic Disorder',
      'Transvestic Disorder',
    ],
  },
  {
    title: 'سایر اختلالات روانی',
    titleEn: 'Other Mental Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Other Specified Mental Disorder Due to Another Medical Condition',
      'Unspecified Mental Disorder Due to Another Medical Condition',
      'Other Specified Mental Disorder',
      'Unspecified Mental Disorder',
    ],
  },
  {
    title: 'اختلالات حرکتی ناشی از دارو',
    titleEn: 'Medication-Induced Movement Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Neuroleptic-Induced Parkinsonism',
      'Other Medication-Induced Parkinsonism',
      'Neuroleptic Malignant Syndrome',
      'Medication-Induced Acute Dystonia',
      'Medication-Induced Acute Akathisia',
      'Tardive Dyskinesia',
      'Tardive Dystonia',
      'Tardive Akathisia',
      'Medication-Induced Postural Tremor',
      'Other Medication-Induced Movement Disorder',
    ],
  },
  {
    title: 'مسائل دیگر که ممکن است کانون توجه کلینیکی باشند',
    titleEn: 'Other Conditions That May Be a Focus of Clinical Attention',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Relational Problems',
      'Abuse and Neglect',
      'Educational and Occupational Problems',
      'Housing and Economic Problems',
      'Other Problems Related to the Social Environment',
      'Problems Related to Crime or Interaction with the Legal System',
      'Other Health Service Encounters for Counseling and Medical Advice',
      'Problems Related to Other Psychosocial, Personal, and Environmental Circumstances',
    ],
  },
  {
    title: 'اختلالات تکانشی، کنترل رفتار، و اختلال سلوک',
    titleEn: 'Disruptive, Impulse-Control, and Conduct Disorders',
    completed: 0,
    selected: true,
    existingCount: 0,
    disorders: [
      'Oppositional Defiant Disorder',
      'Intermittent Explosive Disorder',
      'Conduct Disorder',
      'Antisocial Personality Disorder',
      'Pyromania',
      'Kleptomania',
      'Other Specified Disruptive, Impulse-Control, and Conduct Disorder',
      'Unspecified Disruptive, Impulse-Control, and Conduct Disorder',
    ],
  },
]);

const generationSteps = reactive([
  { id: 1, title: 'اطلاعات کلی', description: 'تولید کد، عنوان، توضیحات و اطلاعات پایه', status: 'pending' },
  { id: 2, title: 'معیارهای تشخیصی', description: 'تولید معیارهای DSM-5 کامل', status: 'pending' },
  { id: 3, title: 'مشخص‌کننده‌ها', description: 'تولید مشخص‌کننده‌های تشخیصی', status: 'pending' },
  { id: 4, title: 'ویژگی‌های تشخیصی', description: 'تولید ویژگی‌های کلینیکی', status: 'pending' },
  { id: 5, title: 'ویژگی‌های همراه', description: 'تولید ویژگی‌های مرتبط', status: 'pending' },
  { id: 6, title: 'نشانگرهای تشخیصی', description: 'تولید نشانگرهای بیولوژیکی و روانی', status: 'pending' },
  { id: 7, title: 'تشخیص افتراقی', description: 'تولید اختلالات مشابه', status: 'pending' },
  { id: 8, title: 'عوامل خطر', description: 'تولید عوامل خطر و پیش‌آگهی', status: 'pending' },
  { id: 9, title: 'مسائل فرهنگی', description: 'تولید ملاحظات فرهنگی', status: 'pending' },
  { id: 10, title: 'مسائل جنسیتی', description: 'تولید ملاحظات مرتبط با جنسیت', status: 'pending' },
]);

// Computed properties for category selection
const selectedCategoriesCount = computed(() => {
  return bulkCategories.value.filter(cat => cat.selected).length;
});

const selectedDisordersCount = computed(() => {
  return bulkCategories.value
    .filter(cat => cat.selected)
    .reduce((total, cat) => total + (cat.disorders.length - cat.existingCount), 0);
});

// Load existing disorders from database
const loadExistingDisorders = async () => {
  try {
    const pb = nuxtApp.$pb;
    const records = await pb.collection('DSM5_disorders').getFullList({
      fields: 'titleEn',
    });

    existingDisorders.value = records.map(record => record.titleEn);

    // Update existing counts for each category
    bulkCategories.value.forEach((category) => {
      category.existingCount = category.disorders.filter(disorder =>
        existingDisorders.value.includes(disorder),
      ).length;
    });

    existingDisordersLoaded.value = true;
    console.log(`Loaded ${existingDisorders.value.length} existing disorders`);
  }
  catch (error) {
    console.error('Failed to load existing disorders:', error);
    existingDisordersLoaded.value = true; // Still mark as loaded to show UI
  }
};

// Category selection functions
const selectAllCategories = () => {
  bulkCategories.value.forEach(cat => cat.selected = true);
};

const deselectAllCategories = () => {
  bulkCategories.value.forEach(cat => cat.selected = false);
};

const selectIncompleteCategories = () => {
  bulkCategories.value.forEach((cat) => {
    cat.selected = cat.existingCount < cat.disorders.length;
  });
};

const updateStepStatus = (stepId: number, status: 'pending' | 'processing' | 'completed') => {
  const step = generationSteps.find(s => s.id === stepId);
  if (step) {
    step.status = status;
  }
};

const generateDisorderInfo = async () => {
  if (!disorderEnglishName.value.trim()) return;

  try {
    // Reset all steps
    generationSteps.forEach(step => step.status = 'pending');
    generatedInfo.value = null;

    // Simulate step-by-step progress
    for (let i = 1; i <= 10; i++) {
      updateStepStatus(i, 'processing');
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for UX
    }

    const result = await generateCompleteDisorderInfo(disorderEnglishName.value.trim());
    generatedInfo.value = result;

    // Mark all steps as completed
    generationSteps.forEach(step => step.status = 'completed');
  }
  catch (err: any) {
    console.error('Generation failed:', err);
    // Reset step statuses on error
    generationSteps.forEach(step => step.status = 'pending');
  }
};

const copyToClipboard = async () => {
  if (!generatedInfo.value) return;

  try {
    await navigator.clipboard.writeText(JSON.stringify(generatedInfo.value, null, 2));
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  }
  catch (err) {
    console.error('Failed to copy:', err);
  }
};

const saveToDatabase = async () => {
  if (!generatedInfo.value) return;

  saving.value = true;
  saveError.value = null;
  saved.value = false;

  try {
    const pb = nuxtApp.$pb;

    const data = {
      code: generatedInfo.value.code,
      title: generatedInfo.value.title,
      titleEn: generatedInfo.value.titleEn,
      description: generatedInfo.value.description,
      minimumCriteria: generatedInfo.value.minimumCriteria,
      specialNote: generatedInfo.value.specialNote,
      Prevalence: generatedInfo.value.Prevalence,
      developmentAndCourse: generatedInfo.value.developmentAndCourse,
      suicideRisk: generatedInfo.value.suicideRisk,
      diagnosisCriteria: JSON.stringify(generatedInfo.value.diagnosisCriteria),
      specifiers: JSON.stringify(generatedInfo.value.specifiers),
      diagnosticFeatures: JSON.stringify(generatedInfo.value.diagnosticFeatures),
      diagnosticMarkers: JSON.stringify(generatedInfo.value.diagnosticMarkers),
      associated_features: JSON.stringify(generatedInfo.value.associated_features),
      riskAndPrognosticFactors: JSON.stringify(generatedInfo.value.riskAndPrognosticFactors),
      cultureRelatedDiagnosticIssues: JSON.stringify(generatedInfo.value.cultureRelatedDiagnosticIssues),
      genderRelatedDiagnosticIssues: JSON.stringify(generatedInfo.value.genderRelatedDiagnosticIssues),
      differentialDiagnosis: JSON.stringify(generatedInfo.value.differentialDiagnosis),
    };

    const record = await pb.collection('DSM5_disorders').create(data);
    console.log('Disorder saved successfully:', record);

    saved.value = true;
    setTimeout(() => {
      saved.value = false;
    }, 5000);
  }
  catch (err: any) {
    console.error('Failed to save to database:', err);
    saveError.value = err.message || 'خطا در ذخیره اطلاعات';
    setTimeout(() => {
      saveError.value = null;
    }, 5000);
  }
  finally {
    saving.value = false;
  }
};

// Initialize bulk statistics
const initializeBulkStats = () => {
  let total = 0;
  bulkCategories.value.forEach((category) => {
    total += category.disorders.length;
  });

  bulkStats.total = total;
  bulkStats.completed = 0;
  bulkStats.processing = 0;
  bulkStats.failed = 0;
  bulkStats.remaining = total;
};

// Format elapsed time
const formatElapsedTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  }
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

// Start bulk generation
const startBulkGeneration = async () => {
  bulkProcessing.value = true;
  bulkPaused.value = false;
  bulkStartTime.value = Date.now();
  clearProgress(); // Clear previous progress
  initializeBulkStats();

  try {
    // Create queue of disorders from selected categories, excluding existing ones
    const allDisorders = [];
    for (const category of bulkCategories.value) {
      if (!category.selected) continue; // Skip unselected categories

      for (const disorderName of category.disorders) {
        // Skip if disorder already exists
        if (existingDisorders.value.includes(disorderName)) {
          console.log(`Skipping existing disorder: ${disorderName}`);
          continue;
        }

        allDisorders.push({
          categoryTitle: category.title,
          disorderName: disorderName,
          category: category,
        });
      }
    }

    if (allDisorders.length === 0) {
      console.log('No new disorders to generate');
      return;
    }

    console.log(`🚀 Starting bulk generation: ${allDisorders.length} disorders, ${concurrencyLevel.value} concurrent`);
    bulkStats.total = allDisorders.length + existingDisorders.value.length;
    bulkStats.remaining = allDisorders.length;

    // Process disorders in batches based on concurrency level
    const batchSize = concurrencyLevel.value;
    for (let i = 0; i < allDisorders.length; i += batchSize) {
      if (!bulkProcessing.value) break; // Stop if cancelled

      // Wait if paused
      while (bulkPaused.value && bulkProcessing.value) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!bulkProcessing.value) break; // Stop if cancelled

      const batch = allDisorders.slice(i, i + batchSize);
      bulkStats.processing = batch.length;

      // Process current batch in parallel
      const batchPromises = batch.map(async (item) => {
        if (!bulkProcessing.value) return; // Stop if cancelled

        try {
          // Update current item (show first item of batch)
          if (batch.indexOf(item) === 0) {
            const othersCount = batch.length - 1;
            currentBulkItem.value = {
              categoryTitle: item.categoryTitle,
              disorderName: othersCount > 0 ? `${item.disorderName} (+${othersCount} دیگر)` : item.disorderName,
            };
          }

          // Generate disorder info with detailed progress tracking
          const result = await generateCompleteDisorderInfo(
            item.disorderName,
            item.categoryTitle,
            true, // Enable detailed progress
          );

          // Note: The createPartialSave function already saves to database when doing partial saves
          // For complete results, we still need to save manually
          if (!result.titleEn.includes('-need')) {
            // This is a complete result, save it to database
            const pb = nuxtApp.$pb;
            const data = {
              code: result.code,
              title: result.title,
              titleEn: result.titleEn,
              description: result.description,
              minimumCriteria: result.minimumCriteria,
              specialNote: result.specialNote,
              Prevalence: result.Prevalence,
              developmentAndCourse: result.developmentAndCourse,
              suicideRisk: result.suicideRisk,
              diagnosisCriteria: JSON.stringify(result.diagnosisCriteria),
              specifiers: JSON.stringify(result.specifiers),
              diagnosticFeatures: JSON.stringify(result.diagnosticFeatures),
              diagnosticMarkers: JSON.stringify(result.diagnosticMarkers),
              associated_features: JSON.stringify(result.associated_features),
              riskAndPrognosticFactors: JSON.stringify(result.riskAndPrognosticFactors),
              cultureRelatedDiagnosticIssues: JSON.stringify(result.cultureRelatedDiagnosticIssues),
              genderRelatedDiagnosticIssues: JSON.stringify(result.genderRelatedDiagnosticIssues),
              differentialDiagnosis: JSON.stringify(result.differentialDiagnosis),
            };

            await pb.collection('DSM5_disorders').create(data);
            console.log(`💾 Complete disorder saved: ${result.titleEn}`);
          }
          else {
            console.log(`🔄 Partial disorder (auto-saved): ${result.titleEn}`);
          }

          // Update statistics
          item.category.completed++;
          bulkStats.completed++;
          bulkStats.remaining--;

          const isPartial = result.titleEn.includes('-need');
          console.log(`✅ Generated: ${item.disorderName}${isPartial ? ' (PARTIAL)' : ' (COMPLETE)'}`);
          return { success: true, disorder: item.disorderName, isPartial };
        }
        catch (error: any) {
          console.error(`❌ Failed: ${item.disorderName} -`, error.message);
          bulkStats.failed++;
          bulkStats.remaining--;
          return { success: false, disorder: item.disorderName, error };
        }
      });

      // Wait for current batch to complete
      await Promise.allSettled(batchPromises);

      // Update processing count after batch completion
      bulkStats.processing = 0;

      // Small delay between batches to prevent overwhelming the API
      if (bulkProcessing.value && i + batchSize < allDisorders.length) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    if (bulkProcessing.value) {
      console.log('🎉 Bulk generation completed!');
    }
  }
  catch (error: any) {
    console.error('Bulk generation failed:', error);
  }
  finally {
    bulkProcessing.value = false;
    bulkPaused.value = false;
    currentBulkItem.value = null;
    bulkStats.processing = 0;
  }
};

// Pause/Resume bulk generation
const pauseBulkGeneration = () => {
  bulkPaused.value = !bulkPaused.value;
};

// Stop bulk generation
const stopBulkGeneration = () => {
  bulkProcessing.value = false;
  bulkPaused.value = false;
  currentBulkItem.value = null;
  bulkStats.processing = 0;
};

// Initialize stats on mount and load existing disorders
onMounted(async () => {
  initializeBulkStats();
  await loadExistingDisorders();
});

// Computed property to get current progress details
const currentProgressDetails = computed(() => {
  return getAllProgress().filter(progress =>
    progress.status === 'processing'
    || progress.status === 'completed'
    || progress.status === 'failed',
  );
});

// Clear progress when switching modes or starting new generation
watch(generationMode, () => {
  if (generationMode.value === 'bulk') {
    clearProgress();
  }
});

// Clear progress when starting new bulk generation
const clearProgressOnStart = () => {
  clearProgress();
};

// Helper function to get section progress summary
const getSectionProgressSummary = (progress) => {
  const sections = Object.values(progress.sections);
  const completed = sections.filter(s => s.status === 'completed').length;
  const failed = sections.filter(s => s.status === 'failed').length;
  const processing = sections.filter(s => s.status === 'processing').length;

  return `${completed}/${sections.length} تکمیل${failed > 0 ? ` (${failed} خطا)` : ''}${processing > 0 ? ` (${processing} در حال انجام)` : ''}`;
};

// Helper function to format duration
const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);

  if (minutes > 0) {
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }
  return `${seconds}ث`;
};

// Watch for mode changes to reload data
watch(generationMode, async (newMode) => {
  if (newMode === 'bulk' && !existingDisordersLoaded.value) {
    await loadExistingDisorders();
  }
});
</script>
