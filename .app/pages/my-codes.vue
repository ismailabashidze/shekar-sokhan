<script setup lang="ts">

definePageMeta({
  title: 'کدهای تخفیف من',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const { getMyCoupons } = useDiscountCopoun()
const toaster = useToaster()

// Filters
const statusFilter = ref('all')
const prefixFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Selected codes for bulk actions
const selectedCoupons = ref<string[]>([])

// Coupons data
const coupons = ref<discountCopoun[]>([])

// Load coupons
const loadCoupons = async () => {
  try {
    const result = await getMyCoupons()
    console.log(result)
    coupons.value = result
  }
  catch (err) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در دریافت کدهای تخفیف',
      color: 'danger',
      icon: 'ph:warning-circle-fill',
      closable: true,
    })
  }
}

// Filter coupons
const filteredCoupons = computed(() => {
  return coupons.value.filter((coupon) => {
    if (statusFilter.value !== 'all') {
      if (statusFilter.value === 'active' && (coupon.isUsed || isExpired(coupon.expiresAt))) return false
      if (statusFilter.value === 'used' && !coupon.isUsed) return false
    }
    if (prefixFilter.value && !coupon.code.toLowerCase().includes(prefixFilter.value.toLowerCase())) {
      return false
    }
    return true
  }).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredCoupons.value.length / itemsPerPage.value))
const paginatedCoupons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCoupons.value.slice(start, end)
})

// Reset filters
const resetFilters = () => {
  statusFilter.value = 'all'
  prefixFilter.value = ''
  currentPage.value = 1
  selectedCoupons.value = []
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price)
}

// Copy selected codes
const copySelectedCodes = async () => {
  const codes = selectedCoupons.value
    .map(id => coupons.value.find(c => c.id === id)?.code)
    .filter(Boolean)
    .join('\n')

  if (codes) {
    await navigator.clipboard.writeText(codes)
    toaster.show({
      title: 'موفق',
      message: 'کدهای انتخاب شده کپی شدند',
      color: 'success',
      icon: 'ph:check-circle-fill',
      closable: true,
    })
  }
}

// Toggle all coupons selection
const toggleAllCoupons = (checked: boolean) => {
  if (checked) {
    selectedCoupons.value = paginatedCoupons.value.map(coupon => coupon.id)
  }
  else {
    selectedCoupons.value = []
  }
}

// Check if code is expired
const isExpired = (expiresAt: string) => {
  return new Date(expiresAt) < new Date()
}

// Get status color
const getStatusColor = (coupon: UserCoupon) => {
  if (coupon.isUsed) return 'danger'
  if (isExpired(coupon.expiresAt)) return 'warning'
  return 'success'
}

// Get status text
const getStatusText = (coupon: UserCoupon) => {
  if (coupon.isUsed) return 'استفاده شده'
  if (isExpired(coupon.expiresAt)) return 'منقضی شده'
  return 'فعال'
}

// Watch for filter changes to reset page
watch([statusFilter, prefixFilter, itemsPerPage], () => {
  currentPage.value = 1
})

// Load coupons on mount
onMounted(() => {
  loadCoupons()
})
</script>

<template>
  <div class="py-6">
    <div class="container-fluid">
      <!-- Header -->
      <BaseCard rounded="md" class="mb-6 p-6">
        <BaseHeading
          weight="medium"
          size="lg"
          lead="none"
          class="mb-2"
        >
          کدهای تخفیف من
        </BaseHeading>
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <BaseParagraph size="sm" class="text-muted-400">
              {{ filteredCoupons.length ? `${filteredCoupons.length} کد تخفیف موجود است` : 'هیچ کد تخفیفی موجود نیست' }}
            </BaseParagraph>
            <BaseButton
              v-if="statusFilter !== 'all' || prefixFilter"
              color="muted"
              size="sm"
              @click="resetFilters"
            >
              <Icon name="ph:x" class="size-4" />
              <span>حذف فیلترها</span>
            </BaseButton>
          </div>
          <div class="flex items-center gap-4">
            <BaseInput
              v-model="prefixFilter"
              placeholder="جستجو..."
              :classes="{
                wrapper: 'w-48',
              }"
            >
              <template #prefix>
                <Icon name="ph:magnifying-glass" class="text-muted-400 size-4" />
              </template>
              <template v-if="prefixFilter" #suffix>
                <button
                  class="text-muted-400 hover:text-primary-500"
                  @click="prefixFilter = ''"
                >
                  <Icon name="ph:x" class="size-4" />
                </button>
              </template>
            </BaseInput>
            <BaseSelect v-model="statusFilter" :classes="{ wrapper: 'w-36' }">
              <option value="all">
                همه کدها
              </option>
              <option value="active">
                کدهای فعال
              </option>
              <option value="used">
                کدهای استفاده شده
              </option>
            </BaseSelect>
            <BaseButton
              v-if="selectedCoupons.length"
              color="primary"
              @click="copySelectedCodes"
            >
              <Icon name="ph:copy" class="ml-2 size-4" />
              <span>کپی {{ selectedCoupons.length }} کد</span>
            </BaseButton>
          </div>
        </div>

        <!-- Coupons table -->
        <div v-if="filteredCoupons.length" class="overflow-x-auto">
          <table class="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                  <BaseCheckbox
                    :model-value="selectedCoupons.length === paginatedCoupons.length && paginatedCoupons.length > 0"
                    :indeterminate="selectedCoupons.length > 0 && selectedCoupons.length < paginatedCoupons.length"
                    @update:model-value="toggleAllCoupons"
                  />
                </th>
                <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                  <div class="text-muted-400 font-normal">
                    کد تخفیف
                  </div>
                </th>
                <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                  <div class="text-muted-400 font-normal">
                    مبلغ (تومان)
                  </div>
                </th>
                <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                  <div class="text-muted-400 font-normal">
                    مدت (روز)
                  </div>
                </th>
                <th class="border-muted-200 bg-muted-50 dark:border-muted-700 dark:bg-muted-800 border-b p-3 text-right">
                  <div class="text-muted-400 font-normal">
                    وضعیت
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="coupon in paginatedCoupons"
                :key="coupon.id"
                class="border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800/50 border-b transition-colors duration-300"
              >
                <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                  <BaseCheckbox
                    v-model="selectedCoupons"
                    :value="coupon.id"
                  />
                </td>
                <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                  <div class="flex items-center gap-2">
                    <Icon
                      :name="coupon.type === 'welcome' ? 'ph:hand-waving-duotone' : 'ph:medal-duotone'"
                      class="text-primary-500 size-5"
                    />
                    <BaseText class="font-mono">
                      {{ coupon.code }}
                    </BaseText>
                  </div>
                </td>
                <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                  <BaseText class="text-success-600 dark:text-success-400 font-mono">
                    {{ formatPrice(coupon.amount) }}
                  </BaseText>
                </td>
                <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                  <BaseText>{{ coupon.duration }}</BaseText>
                </td>
                <td class="border-muted-200 dark:border-muted-700 border-b p-3">
                  <BaseTag :color="getStatusColor(coupon)" rounded="lg">
                    {{ getStatusText(coupon) }}
                  </BaseTag>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-2">
              <BaseSelect
                v-model="itemsPerPage"
                :classes="{
                  wrapper: 'min-w-32',
                }"
              >
                <option :value="10">
                  10
                </option>
                <option :value="20">
                  20
                </option>
                <option :value="50">
                  50
                </option>
              </BaseSelect>
              <span class="text-muted-400 min-w-32 text-sm">مورد در هر صفحه</span>
            </div>

            <div class="flex items-center gap-2">
              <BaseButton
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="lucide:chevron-right" class="size-4" />
              </BaseButton>
              <span class="text-muted-500 dark:text-muted-400 text-sm">
                صفحه {{ currentPage }} از {{ totalPages }}
              </span>
              <BaseButton
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="lucide:chevron-left" class="size-4" />
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="flex items-center justify-center py-6"
        >
          <div class="text-center">
            <Icon name="ph:ticket-duotone" class="text-primary-500 mx-auto mb-2 size-12" />
            <BaseParagraph size="sm" class="text-muted-400">
              هیچ کد تخفیفی موجود نیست
            </BaseParagraph>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
