<script setup lang="ts">
import type { Clinic } from '~/types/wizard'

definePageMeta({
  title: 'داشبورد کلینیک',
  layout: 'sidebar',
})

useHead({
  title: 'داشبورد کلینیک',
  htmlAttrs: { dir: 'rtl' },
})

const { data: clinics, pending, error, refresh } = await useFetch('/api/clinics')

const userClinics = computed(() => {
  return clinics.value?.data || []
})

const stats = computed(() => {
  const totalClinics = userClinics.value.length
  const activeClinics = userClinics.value.filter(c => c.status === 'active').length
  const pendingClinics = userClinics.value.filter(c => c.status === 'pending').length
  
  return {
    totalClinics,
    activeClinics,
    pendingClinics
  }
})

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'success'
    case 'pending': return 'warning'
    case 'inactive': return 'muted'
    default: return 'muted'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'active': return 'فعال'
    case 'pending': return 'در انتظار تایید'
    case 'inactive': return 'غیرفعال'
    default: return 'نامشخص'
  }
}
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading
          as="h1"
          size="3xl"
          weight="light"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>داشبورد کلینیک</span>
        </BaseHeading>
      </template>
      
      <template #right>
        <BaseButton
          to="/clinic/register"
          color="primary"
          class="w-full sm:w-auto"
        >
          <Icon name="lucide:plus" class="ml-2 size-4" />
          <span>ثبت کلینیک جدید</span>
        </BaseButton>
      </template>

      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-primary-500 mb-2">
              {{ stats.totalClinics }}
            </div>
            <div class="text-muted-500 text-sm">
              کل کلینیک‌ها
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-success-500 mb-2">
              {{ stats.activeClinics }}
            </div>
            <div class="text-muted-500 text-sm">
              کلینیک‌های فعال
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-warning-500 mb-2">
              {{ stats.pendingClinics }}
            </div>
            <div class="text-muted-500 text-sm">
              در انتظار تایید
            </div>
          </BaseCard>
        </div>

        <!-- Clinics List -->
        <div v-if="pending">
          <BaseCard rounded="lg" class="p-8 text-center">
            <BasePlaceholderPage
              title="در حال بارگذاری..."
              subtitle="لطفا صبر کنید"
            />
          </BaseCard>
        </div>

        <div v-else-if="error">
          <BaseCard rounded="lg" class="p-8 text-center">
            <BasePlaceholderPage
              title="خطا در بارگذاری"
              subtitle="لطفا صفحه را مجدداً بارگذاری کنید"
            />
          </BaseCard>
        </div>

        <div v-else-if="userClinics.length === 0">
          <BaseCard rounded="lg" class="p-8 text-center">
            <BasePlaceholderPage
              title="کلینیکی یافت نشد"
              subtitle="هنوز کلینیکی ثبت نکرده‌اید"
            >
              <template #image>
                <img
                  class="block dark:hidden"
                  src="/img/illustrations/placeholders/flat/placeholder-search-1.svg"
                  alt="No clinics"
                >
                <img
                  class="hidden dark:block"
                  src="/img/illustrations/placeholders/flat/placeholder-search-1-dark.svg"
                  alt="No clinics"
                >
              </template>
              <template #action>
                <BaseButton
                  to="/clinic/register"
                  color="primary"
                  rounded="lg"
                  class="w-full sm:w-auto"
                >
                  <Icon name="lucide:plus" class="ml-2 size-4" />
                  <span>ثبت کلینیک جدید</span>
                </BaseButton>
              </template>
            </BasePlaceholderPage>
          </BaseCard>
        </div>

        <div v-else class="space-y-4">
          <BaseCard
            v-for="clinic in userClinics"
            :key="clinic.id"
            rounded="lg"
            class="p-6"
          >
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <BaseHeading
                    as="h3"
                    size="lg"
                    weight="semibold"
                    class="text-muted-800 dark:text-muted-100"
                  >
                    {{ clinic.name }}
                  </BaseHeading>
                  
                  <BaseTag
                    :color="getStatusColor(clinic.status)"
                    variant="pastel"
                    rounded="full"
                    size="sm"
                  >
                    {{ getStatusLabel(clinic.status) }}
                  </BaseTag>
                </div>
                
                <div class="space-y-2 text-sm text-muted-500">
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:map-pin" class="size-4" />
                    <span>{{ clinic.address }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:phone" class="size-4" />
                    <span>{{ clinic.phone }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:mail" class="size-4" />
                    <span>{{ clinic.email }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex gap-2 mt-4 lg:mt-0">
                <BaseButton
                  :to="`/clinic/manage/${clinic.id}`"
                  color="muted"
                  size="sm"
                  rounded="lg"
                >
                  <Icon name="lucide:settings" class="size-4" />
                  <span>مدیریت</span>
                </BaseButton>
                
                <BaseButton
                  :to="`/clinic/psychologists/${clinic.id}`"
                  color="primary"
                  size="sm"
                  rounded="lg"
                >
                  <Icon name="lucide:users" class="size-4" />
                  <span>مشاوران</span>
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>