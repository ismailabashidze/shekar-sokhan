<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-lg bg-white shadow-xl">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-8 text-center">
          <div class="mb-4 flex justify-center">
            <div class="rounded-full bg-white p-4">
              <Icon name="ph:lock-simple" class="size-16 text-red-500" />
            </div>
          </div>
          <h1 class="mb-2 text-3xl font-bold text-white">
            {{ accessReason === 'auth' ? 'نیاز به احراز هویت' : 'دسترسی محدود' }}
          </h1>
          <p class="text-red-100">
            {{ accessReason === 'auth' ? 'شما باید وارد حساب کاربری خود شوید' : 'شما به این بخش دسترسی ندارید' }}
          </p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <div class="mb-8 text-center">
            <div class="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <Icon name="ph:warning" class="mx-auto mb-4 size-8 text-yellow-600" />
              <h2 class="mb-2 text-xl font-semibold text-gray-900">
                {{ accessReason === 'auth' ? 'نیاز به ورود به سیستم' : 'محدودیت دسترسی به بخش درخواستی' }}
              </h2>
              <p class="text-gray-600">
                {{ accessReason === 'auth'
                  ? 'برای دسترسی به بخش‌های مختلف، باید ابتدا وارد حساب کاربری خود شوید.'
                  : 'شما تلاش کردید به بخشی دسترسی پیدا کنید که در لیست مجوزهای شما وجود ندارد. برای دسترسی به بخش‌های مختلف، باید از مدیر سیستم مجوزهای لازم را دریافت کنید.'
                }}
              </p>
            </div>

            <!-- User Access Information -->
            <div v-if="user?.id" class="mb-6 rounded-lg bg-blue-50 p-6">
              <h3 class="mb-4 text-lg font-semibold text-gray-900">
                اطلاعات دسترسی شما
              </h3>

              <div class="grid grid-cols-1 gap-4 text-right md:grid-cols-2">
                <div>
                  <span class="text-sm text-gray-500">نام کاربری:</span>
                  <div class="font-medium text-gray-900">
                    {{ user?.name || 'نامشخص' }}
                  </div>
                </div>
                <div>
                  <span class="text-sm text-gray-500">نقش:</span>
                  <div class="font-medium text-gray-900">
                    {{ user?.role || 'نامشخص' }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <span class="text-sm text-gray-500">بخش‌های قابل دسترسی:</span>
                  <div class="mt-2 flex flex-wrap justify-end gap-2">
                    <span
                      v-for="zone in userZones"
                      :key="zone.name"
                      class="rounded-full px-3 py-1 text-sm font-medium"
                      :class="getZoneBadgeClass(zone.color)"
                    >
                      <Icon :name="zone.icon" class="ml-1 size-4" />
                      {{ zone.label }}
                    </span>
                    <span v-if="userZones.length === 0" class="text-sm text-gray-500">
                      هیچ بخشی فعال نیست
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Not Authenticated -->
            <div v-else class="mb-6 rounded-lg bg-orange-50 p-6">
              <Icon name="ph:user-x" class="mx-auto mb-4 size-8 text-orange-600" />
              <h3 class="mb-2 text-center text-lg font-semibold text-gray-900">
                شما وارد حساب کاربری نشده‌اید
              </h3>
              <p class="mb-4 text-center text-gray-600">
                برای دسترسی به بخش‌های مختلف، ابتدا باید وارد حساب کاربری خود شوید.
              </p>
              <div class="flex justify-center">
                <NuxtLink to="/auth/login" class="btn btn-primary">
                  <Icon name="ph:sign-in" class="ml-2 size-4" />
                  ورود به سیستم
                </NuxtLink>
              </div>
            </div>

            <!-- Requested Zone Information -->
            <div v-if="requestedZone" class="rounded-lg bg-gray-50 p-6">
              <h3 class="mb-2 text-lg font-semibold text-gray-900">
                بخش درخواستی
              </h3>
              <div class="flex items-center justify-center space-x-3 space-x-reverse">
                <Icon
                  :name="getRequestedZoneIcon()"
                  :class="getRequestedZoneClass()"
                  class="size-8"
                />
                <span class="text-xl font-medium text-gray-900">{{ getRequestedZoneLabel() }}</span>
                <span class="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                  غیرمجاز
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <div class="flex flex-col justify-center gap-4 sm:flex-row">
              <NuxtLink
                v-if="user?.id"
                to="/dashboard"
                class="btn btn-primary"
              >
                <Icon name="ph:house" class="ml-2 size-4" />
                بازگشت به داشبورد
              </NuxtLink>

              <NuxtLink
                v-else
                to="/auth/login"
                class="btn btn-primary"
              >
                <Icon name="ph:sign-in" class="ml-2 size-4" />
                ورود به سیستم
              </NuxtLink>

              <button
                class="btn btn-secondary"
                @click="contactAdmin"
              >
                <Icon name="ph:envelope" class="ml-2 size-4" />
                تماس با مدیر سیستم
              </button>
            </div>

            <div class="flex justify-center">
              <NuxtLink
                to="/publicDomain"
                class="text-sm text-gray-600 underline hover:text-gray-900"
              >
                بازگشت به بخش عمومی
              </NuxtLink>
            </div>
          </div>

          <!-- Help Section -->
          <div class="mt-8 border-t border-gray-200 pt-8">
            <div class="text-sm text-gray-600">
              <h4 class="mb-3 font-semibold text-gray-900">
                راهنمای دسترسی:
              </h4>
              <ul class="space-y-2 text-right">
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="ml-2 mt-0.5 size-4 text-green-500" />
                  <span>برای دریافت دسترسی به بخش‌های جدید با مدیر سیستم تماس بگیرید</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="ml-2 mt-0.5 size-4 text-green-500" />
                  <span>می‌توانید از داشبورد به بخش‌های مجاز خود دسترسی داشته باشید</span>
                </li>
                <li class="flex items-start">
                  <Icon name="ph:check-circle" class="ml-2 mt-0.5 size-4 text-green-500" />
                  <span>بخش عمومی برای همه کاربران بدون نیاز به مجوز قابل دسترسی است</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Public page - no authentication required
definePageMeta({
  layout: false,
})

const route = useRoute()
const { user } = useUser()
const { userZones, ZONE_CONFIGS } = useZones()

// Get requested zone from query parameters
const requestedZoneName = computed(() => {
  return route.query.zone as string || ''
})

const accessReason = computed(() => {
  return route.query.reason as string || ''
})

const requestedZone = computed(() => {
  if (!requestedZoneName.value) return null
  return ZONE_CONFIGS[requestedZoneName.value]
})

const getRequestedZoneLabel = () => {
  return requestedZone.value?.label || requestedZoneName.value
}

const getRequestedZoneIcon = () => {
  return requestedZone.value?.icon || 'ph:lock'
}

const getRequestedZoneClass = () => {
  const color = requestedZone.value?.color
  return color ? `text-${color}-600` : 'text-gray-600'
}

const getZoneBadgeClass = (color?: string) => {
  if (!color) return 'bg-gray-100 text-gray-800'

  const colorMap: Record<string, string> = {
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    orange: 'bg-orange-100 text-orange-800',
  }

  return colorMap[color] || 'bg-gray-100 text-gray-800'
}

const contactAdmin = () => {
  // You can implement contact functionality here
  // For now, just redirect to a contact page or show a message
  const toaster = useToaster()
  toaster.show({
    title: 'تماس با مدیر',
    message: 'لطفاً از طریق راه‌های ارتباطی با مدیر سیستم تماس بگیرید.',
    color: 'info',
    icon: 'ph:envelope',
    closable: true,
  })
}
</script>
