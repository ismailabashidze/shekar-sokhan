<script setup lang="ts">
import type { Clinic } from '~/types/wizard'

definePageMeta({
  title: 'جزئیات کلینیک',
  layout: 'sidebar',
})

useHead({
  title: 'جزئیات کلینیک',
  htmlAttrs: { dir: 'rtl' },
})

const route = useRoute()
const router = useRouter()
const toaster = useToaster()

const clinicId = route.params.id as string

const { data: clinic, pending, error, refresh } = await useFetch<{ data: Clinic }>(`/api/clinics/${clinicId}`)
const { data: psychologists } = await useFetch(`/api/clinics/${clinicId}/psychologists`)

async function updateClinicStatus(status: 'active' | 'inactive' | 'pending') {
  try {
    await $fetch(`/api/clinics/${clinicId}`, {
      method: 'PUT',
      body: { status }
    })
    
    toaster.show({
      title: 'بروزرسانی موفق',
      message: 'وضعیت کلینیک با موفقیت تغییر کرد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    await refresh()
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در تغییر وضعیت کلینیک',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
}

async function verifyClinic(action: 'approved' | 'rejected' | 'under_review', notes?: string) {
  try {
    await $fetch(`/api/clinics/${clinicId}/verify`, {
      method: 'POST',
      body: { action, notes }
    })
    
    toaster.show({
      title: 'تایید موفق',
      message: `کلینیک با موفقیت ${action === 'approved' ? 'تایید' : action === 'rejected' ? 'رد' : 'در حال بررسی قرار گرفت'}`,
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    await refresh()
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در تایید کلینیک',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
}

async function banClinic(action: 'ban' | 'unban', reason?: string) {
  const confirmMessage = action === 'ban' 
    ? 'آیا مطمئن هستید که می‌خواهید این کلینیک را مسدود کنید؟'
    : 'آیا مطمئن هستید که می‌خواهید این کلینیک را از حالت مسدود خارج کنید؟'
    
  if (!confirm(confirmMessage)) return
  
  try {
    await $fetch(`/api/clinics/${clinicId}/ban`, {
      method: 'POST',
      body: { action, reason }
    })
    
    toaster.show({
      title: action === 'ban' ? 'مسدود شد' : 'رفع مسدودیت',
      message: `کلینیک با موفقیت ${action === 'ban' ? 'مسدود' : 'از حالت مسدود خارج'} شد`,
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    await refresh()
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: `خطا در ${action === 'ban' ? 'مسدود کردن' : 'رفع مسدودیت'} کلینیک`,
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
}

async function deleteClinic() {
  if (!confirm('آیا مطمئن هستید که می‌خواهید این کلینیک را حذف کنید؟')) {
    return
  }
  
  try {
    await $fetch(`/api/clinics/${clinicId}`, {
      method: 'DELETE'
    })
    
    toaster.show({
      title: 'حذف موفق',
      message: 'کلینیک با موفقیت حذف شد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    await router.push('/admin/clinics')
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف کلینیک',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'success'
    case 'verified': return 'primary'
    case 'pending': return 'warning'
    case 'banned': return 'danger'
    case 'inactive': return 'muted'
    default: return 'muted'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'active': return 'فعال'
    case 'verified': return 'تایید شده'
    case 'pending': return 'در انتظار تایید'
    case 'banned': return 'مسدود شده'
    case 'inactive': return 'غیرفعال'
    default: return 'نامشخص'
  }
}

function getVerificationStatusColor(status: string) {
  switch (status) {
    case 'approved': return 'success'
    case 'under_review': return 'warning'
    case 'rejected': return 'danger'
    case 'pending': return 'muted'
    default: return 'muted'
  }
}

function getVerificationStatusLabel(status: string) {
  switch (status) {
    case 'approved': return 'تایید شده'
    case 'under_review': return 'در حال بررسی'
    case 'rejected': return 'رد شده'
    case 'pending': return 'در انتظار بررسی'
    default: return 'نامشخص'
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case 'owner': return 'مالک'
    case 'member': return 'عضو'
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
          <span>جزئیات کلینیک</span>
        </BaseHeading>
      </template>
      
      <template #right>
        <BaseButton
          to="/admin/clinics"
          color="muted"
          class="w-full sm:w-auto"
        >
          <Icon name="lucide:arrow-right" class="ml-2 size-4" />
          <span>بازگشت</span>
        </BaseButton>
      </template>

      <div v-if="pending" class="flex justify-center py-20">
        <BaseLoader size="xl" />
      </div>

      <div v-else-if="error" class="text-center py-20">
        <BasePlaceholderPage
          title="خطا در بارگذاری"
          subtitle="کلینیک مورد نظر یافت نشد"
        />
      </div>

      <div v-else-if="clinic?.data" class="space-y-6">
        <!-- Main Info Card -->
        <BaseCard rounded="lg" class="p-6">
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div class="flex-1">
              <div class="flex items-start gap-4 mb-4">
                <!-- Clinic Logo -->
                <div v-if="clinic.data.logo" class="shrink-0">
                  <img 
                    :src="clinic.data.logo" 
                    alt="لوگو کلینیک" 
                    class="w-20 h-20 object-cover rounded-lg border border-muted-200 dark:border-muted-700"
                  />
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <BaseHeading
                      as="h2"
                      size="2xl"
                      weight="semibold"
                      class="text-muted-800 dark:text-muted-100"
                    >
                      {{ clinic.data.name }}
                    </BaseHeading>
                    
                    <BaseTag
                      :color="getStatusColor(clinic.data.status)"
                      variant="pastel"
                      rounded="full"
                      size="lg"
                    >
                      {{ getStatusLabel(clinic.data.status) }}
                    </BaseTag>
                  </div>
                  
                  <!-- Owner Information -->
                  <div v-if="clinic.data.expand?.owner" class="mb-3 p-3 bg-muted-50 dark:bg-muted-800 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <Icon name="lucide:user-check" class="size-4 text-muted-500" />
                      <span class="text-sm font-medium text-muted-700 dark:text-muted-300">مالک کلینیک:</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <BaseAvatar
                        :src="clinic.data.expand.owner.avatar"
                        :text="clinic.data.expand.owner.meta?.name"
                        size="xs"
                      />
                      <div>
                        <div class="text-sm font-medium text-muted-800 dark:text-muted-100">
                          {{ clinic.data.expand.owner.meta?.name || clinic.data.expand.owner.username }}
                        </div>
                        <div class="text-xs text-muted-500">
                          {{ clinic.data.expand.owner.meta?.email || clinic.data.expand.owner.email }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-muted-600">
                  <Icon name="lucide:map-pin" class="size-5" />
                  <span>{{ clinic.data.address }}</span>
                </div>
                <div class="flex items-center gap-2 text-muted-600">
                  <Icon name="lucide:phone" class="size-5" />
                  <span>{{ clinic.data.phone }}</span>
                </div>
                <div class="flex items-center gap-2 text-muted-600">
                  <Icon name="lucide:mail" class="size-5" />
                  <span>{{ clinic.data.email }}</span>
                </div>
                <div class="flex items-center gap-2 text-muted-600">
                  <Icon name="lucide:file-text" class="size-5" />
                  <span>پروانه: {{ clinic.data.license }}</span>
                </div>
              </div>
              
              <div v-if="clinic.data.description" class="mt-4">
                <BaseHeading
                  as="h4"
                  size="sm"
                  weight="medium"
                  class="text-muted-700 dark:text-muted-300 mb-2"
                >
                  توضیحات:
                </BaseHeading>
                <BaseParagraph class="text-muted-600">
                  {{ clinic.data.description }}
                </BaseParagraph>
              </div>
            </div>
            
            <div class="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
              <!-- Verification Actions -->
              <BaseButton
                v-if="clinic.data.verificationStatus === 'pending'"
                color="success"
                size="sm"
                rounded="lg"
                @click="verifyClinic('approved')"
              >
                <Icon name="lucide:check-circle" class="ml-2 size-4" />
                تایید کلینیک
              </BaseButton>
              
              <BaseButton
                v-if="clinic.data.verificationStatus === 'pending'"
                color="danger"
                size="sm"
                rounded="lg"
                @click="verifyClinic('rejected')"
              >
                <Icon name="lucide:x-circle" class="ml-2 size-4" />
                رد کلینیک
              </BaseButton>
              
              <BaseButton
                v-if="clinic.data.verificationStatus === 'approved'"
                color="warning"
                size="sm"
                rounded="lg"
                @click="verifyClinic('under_review')"
              >
                <Icon name="lucide:clock" class="ml-2 size-4" />
                در حال بررسی
              </BaseButton>
              
              <!-- Ban/Unban Actions -->
              <BaseButton
                v-if="clinic.data.status !== 'banned'"
                color="danger"
                variant="outline"
                size="sm"
                rounded="lg"
                @click="banClinic('ban', 'نقض قوانین')"
              >
                <Icon name="lucide:ban" class="ml-2 size-4" />
                مسدود کردن
              </BaseButton>
              
              <BaseButton
                v-if="clinic.data.status === 'banned'"
                color="success"
                size="sm"
                rounded="lg"
                @click="banClinic('unban')"
              >
                <Icon name="lucide:unlock" class="ml-2 size-4" />
                رفع مسدودیت
              </BaseButton>
              
              <!-- Status Actions -->
              <BaseButton
                v-if="clinic.data.status === 'inactive'"
                color="success"
                size="sm"
                rounded="lg"
                @click="updateClinicStatus('active')"
              >
                <Icon name="lucide:play" class="ml-2 size-4" />
                فعال کردن
              </BaseButton>
              
              <BaseButton
                v-if="clinic.data.status === 'active'"
                color="warning"
                size="sm"
                rounded="lg"
                @click="updateClinicStatus('inactive')"
              >
                <Icon name="lucide:pause" class="ml-2 size-4" />
                غیرفعال کردن
              </BaseButton>
              
              <BaseButton
                color="danger"
                variant="outline"
                size="sm"
                rounded="lg"
                @click="deleteClinic"
              >
                <Icon name="lucide:trash-2" class="ml-2 size-4" />
                حذف کلینیک
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Verification & Ban Status Card -->
        <BaseCard rounded="lg" class="p-6">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="text-muted-800 dark:text-muted-100 mb-4"
          >
            وضعیت تایید و مسدودیت
          </BaseHeading>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Verification Status -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <h4 class="font-medium text-muted-700 dark:text-muted-300">وضعیت تایید:</h4>
                <BaseTag
                  :color="getVerificationStatusColor(clinic.data.verificationStatus || 'pending')"
                  variant="solid"
                  rounded="full"
                  size="sm"
                >
                  {{ getVerificationStatusLabel(clinic.data.verificationStatus || 'pending') }}
                </BaseTag>
              </div>
              
              <div v-if="clinic.data.verificationNotes" class="text-sm">
                <span class="text-muted-500">یادداشت تایید:</span>
                <p class="mt-1 text-muted-600">{{ clinic.data.verificationNotes }}</p>
              </div>
              
              <div v-if="clinic.data.verifiedAt" class="text-sm text-muted-500">
                تایید شده در: {{ new Date(clinic.data.verifiedAt).toLocaleDateString('fa-IR') }}
              </div>
            </div>
            
            <!-- Ban Status -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <h4 class="font-medium text-muted-700 dark:text-muted-300">وضعیت مسدودیت:</h4>
                <BaseTag
                  :color="clinic.data.status === 'banned' ? 'danger' : 'success'"
                  variant="solid"
                  rounded="full"
                  size="sm"
                >
                  {{ clinic.data.status === 'banned' ? 'مسدود' : 'آزاد' }}
                </BaseTag>
              </div>
              
              <div v-if="clinic.data.status === 'banned' && clinic.data.bannedReason" class="text-sm">
                <span class="text-muted-500">دلیل مسدودیت:</span>
                <p class="mt-1 text-muted-600">{{ clinic.data.bannedReason }}</p>
              </div>
              
              <div v-if="clinic.data.bannedAt" class="text-sm text-muted-500">
                مسدود شده در: {{ new Date(clinic.data.bannedAt).toLocaleDateString('fa-IR') }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Dates Card -->
        <BaseCard rounded="lg" class="p-6">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="text-muted-800 dark:text-muted-100 mb-4"
          >
            اطلاعات تاریخی
          </BaseHeading>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-muted-500 mb-1">تاریخ ثبت</div>
              <div class="font-medium">{{ new Date(clinic.data.created).toLocaleDateString('fa-IR') }}</div>
            </div>
            <div>
              <div class="text-sm text-muted-500 mb-1">آخرین بروزرسانی</div>
              <div class="font-medium">{{ new Date(clinic.data.updated).toLocaleDateString('fa-IR') }}</div>
            </div>
          </div>
        </BaseCard>

        <!-- Psychologists Card -->
        <BaseCard rounded="lg" class="p-6">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="text-muted-800 dark:text-muted-100 mb-4"
          >
            مشاوران کلینیک
          </BaseHeading>
          
          <div v-if="!psychologists?.data?.length" class="text-center py-8">
            <BaseParagraph class="text-muted-500">
              هنوز مشاوری به این کلینیک اضافه نشده است
            </BaseParagraph>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="psychologist in psychologists.data"
              :key="psychologist.id"
              class="flex items-center justify-between p-3 bg-muted-50 dark:bg-muted-800 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <BaseAvatar
                  size="sm"
                  :src="psychologist.expand?.psychologist?.avatar"
                  :text="psychologist.expand?.psychologist?.name"
                />
                <div>
                  <div class="font-medium text-muted-800 dark:text-muted-100">
                    {{ psychologist.expand?.psychologist?.name || 'نام نامشخص' }}
                  </div>
                  <div class="text-sm text-muted-500">
                    {{ getRoleLabel(psychologist.role) }}
                  </div>
                </div>
              </div>
              
              <div class="text-sm text-muted-500">
                عضو از {{ new Date(psychologist.created).toLocaleDateString('fa-IR') }}
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </TairoContentWrapper>
  </div>
</template>