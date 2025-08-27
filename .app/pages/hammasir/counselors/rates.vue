<script setup lang="ts">
import { useCounselorProfile } from '~/composables/hammasir/useCounselorProfile'
import type { UpdateCounselorRatesDto } from '~/types/api'

definePageMeta({
  title: 'تنظیم نرخ‌ها',
  layout: 'sidebar',
  middleware: ['auth', 'counselor']
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const {
  counselorProfile,
  isProfileLoading,
  profileError,
  getMyCounselorProfile,
  updateRates
} = useCounselorProfile()

const rates = ref<UpdateCounselorRatesDto>({
  hourlyRate: 0,
  packageRates: []
})

const isSaving = ref(false)
const saveError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Package options
const packageOptions = [
  { sessions: 1, label: 'جلسه تکی' },
  { sessions: 5, label: 'بسته 5 جلسه‌ای' },
  { sessions: 10, label: 'بسته 10 جلسه‌ای' },
  { sessions: 15, label: 'بسته 15 جلسه‌ای' }
]

// Initialize the rates data
onMounted(async () => {
  await loadRates()
})

const loadRates = async () => {
  try {
    await getMyCounselorProfile()
    if (counselorProfile.value) {
      rates.value = {
        hourlyRate: counselorProfile.value.hourlyRate || 0,
        packageRates: counselorProfile.value.packageRates || []
      }
    } else {
      // Initialize with default values
      rates.value = {
        hourlyRate: 200000,
        packageRates: []
      }
    }
  } catch (error) {
    console.error('Error loading rates:', error)
  }
}

const getPackageRate = (sessions: number) => {
  return rates.value.packageRates.find(p => p.numberOfSessions === sessions)
}

const updatePackageRate = (sessions: number, rate: number) => {
  const index = rates.value.packageRates.findIndex(p => p.numberOfSessions === sessions)
  if (index !== -1) {
    rates.value.packageRates[index].totalPrice = rate
  } else {
    rates.value.packageRates.push({
      numberOfSessions: sessions,
      totalPrice: rate
    })
  }
}

const removePackageRate = (sessions: number) => {
  rates.value.packageRates = rates.value.packageRates.filter(p => p.numberOfSessions !== sessions)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount)
}

const parseCurrency = (value: string) => {
  // Remove commas and convert to number
  return parseInt(value.replace(/,/g, '')) || 0
}

const saveRates = async () => {
  isSaving.value = true
  saveError.value = null
  successMessage.value = null

  try {
    // Validate hourly rate
    if (rates.value.hourlyRate <= 0) {
      saveError.value = 'نرخ ساعتی باید بیشتر از صفر باشد'
      return
    }

    // Validate package rates
    for (const pkg of rates.value.packageRates) {
      if (pkg.totalPrice <= 0) {
        saveError.value = `قیمت بسته ${pkg.numberOfSessions} جلسه‌ای باید بیشتر از صفر باشد`
        return
      }
      
      // Check if package rate is better than individual rate
      const individualCost = pkg.numberOfSessions * rates.value.hourlyRate
      if (pkg.totalPrice >= individualCost) {
        saveError.value = `قیمت بسته ${pkg.numberOfSessions} جلسه‌ای باید کمتر از ${formatCurrency(individualCost)} تومان باشد (برای تشویق به خرید بسته)`
        return
      }
    }

    await updateRates(rates.value)
    successMessage.value = 'نرخ‌ها با موفقیت ذخیره شدند'
    
    // Reload to get updated data
    await loadRates()
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (error: any) {
    saveError.value = error.message || 'خطا در ذخیره نرخ‌ها'
  } finally {
    isSaving.value = false
  }
}

const calculateSavings = (sessions: number, packagePrice: number) => {
  const individualCost = sessions * rates.value.hourlyRate
  const savings = individualCost - packagePrice
  return savings > 0 ? savings : 0
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="border-b border-gray-200 pb-5 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              تنظیم نرخ‌ها
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              تنظیم نرخ‌های جلسات مشاوره
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <NuxtLink
              to="/hammasir/counselors/me"
              class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Icon name="ph:arrow-right" class="ml-2 size-4" />
              <span>بازگشت به پروفایل</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto mt-6 max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:check-circle" class="size-5 text-green-400" />
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">
              {{ successMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="saveError" class="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <div class="flex">
          <div class="shrink-0">
            <Icon name="ph:x-circle" class="size-5 text-red-400" />
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              خطا
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ saveError }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-700 sm:px-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              تنظیم نرخ‌های مشاوره
            </h2>
            <div class="mt-4 flex md:mt-0">
              <button
                :disabled="isSaving"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                @click="saveRates"
              >
                <Icon
                  v-if="isSaving"
                  name="ph:spinner"
                  class="ml-2 size-4 animate-spin"
                />
                <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="px-4 py-5 sm:px-6">
          <div class="space-y-8">
            <!-- Hourly Rate -->
            <div>
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                نرخ ساعتی
              </h3>
              
              <div class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-700/50">
                <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                  <div class="sm:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      نرخ ساعتی (تومان)
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <input
                        v-model.number="rates.hourlyRate"
                        type="number"
                        min="0"
                        step="10000"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 pl-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      >
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-gray-500 dark:text-gray-400 sm:text-sm">تومان</span>
                      </div>
                    </div>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      نرخ پایه برای هر جلسه 60 دقیقه‌ای
                    </p>
                  </div>
                  
                  <div class="sm:col-span-3">
                    <div class="h-full rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-700">
                      <div class="flex h-full flex-col items-center justify-center text-center">
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                          {{ formatCurrency(rates.hourlyRate) }}
                        </div>
                        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          هر جلسه 60 دقیقه‌ای
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Package Rates -->
            <div>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  بسته‌های تخفیفی
                </h3>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  تشویق به خرید بسته برای کاهش هزینه کلی
                </div>
              </div>
              
              <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div
                  v-for="pkg in packageOptions"
                  :key="pkg.sessions"
                  class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-700"
                >
                  <div class="border-b border-gray-200 px-4 py-5 dark:border-gray-600 sm:px-6">
                    <div class="flex items-center justify-between">
                      <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ pkg.label }}
                      </h4>
                      <div class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {{ pkg.sessions }} جلسه
                      </div>
                    </div>
                  </div>
                  
                  <div class="px-4 py-5 sm:px-6">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          قیمت کل بسته (تومان)
                        </label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <input
                            :value="getPackageRate(pkg.sessions)?.totalPrice || ''"
                            type="number"
                            min="0"
                            step="10000"
                            class="block w-full rounded-md border border-gray-300 px-3 py-2 pl-12 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                            @input="updatePackageRate(pkg.sessions, parseInt(($event.target as HTMLInputElement).value) || 0)"
                          >
                          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">تومان</span>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="getPackageRate(pkg.sessions)">
                        <!-- Individual Cost Comparison -->
                        <div class="rounded-md bg-gray-50 p-3 dark:bg-gray-600">
                          <div class="text-xs font-medium text-gray-700 dark:text-gray-300">
                            هزینه فردی:
                          </div>
                          <div class="mt-1 flex items-center justify-between">
                            <div class="text-sm text-gray-900 dark:text-white">
                              {{ formatCurrency(pkg.sessions * rates.hourlyRate) }} تومان
                            </div>
                            <div v-if="calculateSavings(pkg.sessions, getPackageRate(pkg.sessions)!.totalPrice) > 0" class="text-sm font-medium text-green-600">
                              {{ formatCurrency(calculateSavings(pkg.sessions, getPackageRate(pkg.sessions)!.totalPrice)) }} تومان تخفیف
                            </div>
                          </div>
                        </div>
                        
                        <!-- Per Session Rate -->
                        <div class="mt-2 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                          <div class="text-xs font-medium text-blue-700 dark:text-blue-300">
                            نرخ هر جلسه در بسته:
                          </div>
                          <div class="mt-1 text-sm font-medium text-blue-900 dark:text-blue-100">
                            {{ formatCurrency(Math.floor(getPackageRate(pkg.sessions)!.totalPrice / pkg.sessions)) }} تومان
                          </div>
                        </div>
                      </div>
                      
                      <div v-else class="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-600">
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          این بسته فعال نیست
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pricing Tips -->
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <div class="flex items-start">
                <Icon name="ph:lightbulb" class="ml-3 mt-0.5 size-5 shrink-0 text-blue-500" />
                <div>
                  <h3 class="text-lg font-medium text-blue-800 dark:text-blue-200">
                    نکات مهم برای تعیین نرخ
                  </h3>
                  <ul class="mt-3 list-inside list-disc space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>
                      نرخ ساعتی شما باید منطبق با استانداردهای بازار و تجربه شما باشد
                    </li>
                    <li>
                      بسته‌های تخفیفی باید حداقل 10-20٪ تخفیف نسبت به خرید فردی ارائه دهند
                    </li>
                    <li>
                      قیمت‌گذاری واضح و شفاف به اعتماد کاربران کمک می‌کند
                    </li>
                    <li>
                      نرخ‌ها را به‌طور منظم بر اساس تجربه و بازخوردهای دریافتی به‌روز کنید
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button (Fixed at bottom for mobile) -->
      <div class="sticky bottom-0 mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:hidden">
        <button
          :disabled="isSaving"
          class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          @click="saveRates"
        >
          <Icon
            v-if="isSaving"
            name="ph:spinner"
            class="ml-2 size-5 animate-spin"
          />
          <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>