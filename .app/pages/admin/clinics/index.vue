<script setup lang="ts">

definePageMeta({
  title: 'مدیریت کلینیک‌ها',
  layout: 'sidebar',
})

useHead({
  title: 'مدیریت کلینیک‌ها',
  htmlAttrs: { dir: 'rtl' },
})

const route = useRoute()
const router = useRouter()
const toaster = useToaster()

const page = computed(() => parseInt((route.query.page as string) ?? '1'))
const filter = ref('')
const perPage = ref(10)

watch([filter, perPage], () => {
  router.push({
    query: {
      page: undefined,
    },
  })
})

const query = computed(() => {
  return {
    filter: filter.value,
    perPage: perPage.value,
    page: page.value,
  }
})

const { data, pending, error, refresh } = await useFetch('/api/clinics', {
  query: computed(() => ({
    ...query.value,
    admin: 'true'
  })),
})

const stats = computed(() => {
  const clinics = data.value?.data || []
  return {
    total: clinics.length,
    active: clinics.filter(c => c.status === 'active').length,
    pending: clinics.filter(c => c.status === 'pending').length,
    verified: clinics.filter(c => c.status === 'verified').length,
    banned: clinics.filter(c => c.status === 'banned').length,
    inactive: clinics.filter(c => c.status === 'inactive').length,
    totalPsychotherapists: clinics.reduce((sum, clinic) => sum + (clinic.psychotherapistsCount || 0), 0),
  }
})

async function updateClinicStatus(clinicId: string, status: 'active' | 'inactive' | 'pending') {
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

async function verifyClinic(clinicId: string, action: 'approved' | 'rejected' | 'under_review', notes?: string) {
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

async function banClinic(clinicId: string, action: 'ban' | 'unban', reason?: string) {
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

function getstatusColor(status: string) {
  switch (status) {
    case 'approved': return 'success'
    case 'under_review': return 'warning'
    case 'rejected': return 'danger'
    case 'pending': return 'muted'
    default: return 'muted'
  }
}

function getstatusLabel(status: string) {
  switch (status) {
    case 'approved': return 'تایید شده'
    case 'under_review': return 'در حال بررسی'
    case 'rejected': return 'رد شده'
    case 'pending': return 'در انتظار بررسی'
    default: return 'نامشخص'
  }
}

function getEducationLabel(education: string) {
  switch (education) {
    case 'MAStudent': return 'دانشجوی کارشناسی ارشد'
    case 'MA': return 'کارشناسی ارشد'
    case 'PHDStudent': return 'دانشجوی دکترا'
    case 'PHD': return 'دکترا'
    default: return education || 'نامشخص'
  }
}

function getOwnerAvatar(owner: any) {
  if (owner?.avatar) {
    return owner.avatar
  }
  return null
}

function getOwnerName(owner: any) {
  if (owner?.expand?.psychotherapist) {
    const psycho = owner.expand.psychotherapist
    return `${psycho.firstName} ${psycho.lastName}`
  }
  return owner?.name || 'نامشخص'
}

function getOwnerAge(owner: any) {
  return owner?.expand?.psychotherapist?.age || 'نامشخص'
}

function getOwnerEducation(owner: any) {
  const education = owner?.expand?.psychotherapist?.educationLevel
  return education ? getEducationLabel(education) : 'نامشخص'
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
          <span>مدیریت کلینیک‌ها</span>
        </BaseHeading>
      </template>
      
      <template #right>
        <BaseInput
          v-model="filter"
          icon="lucide:search"
          placeholder="جست و جو کلینیک..."
          :classes="{
            wrapper: 'w-full sm:w-auto',
          }"
        />
      </template>

      <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-primary-500 mb-2">
              {{ stats.total }}
            </div>
            <div class="text-muted-500 text-sm">
              کل کلینیک‌ها
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-success-500 mb-2">
              {{ stats.active }}
            </div>
            <div class="text-muted-500 text-sm">
              فعال
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-primary-500 mb-2">
              {{ stats.verified }}
            </div>
            <div class="text-muted-500 text-sm">
              تایید شده
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-warning-500 mb-2">
              {{ stats.pending }}
            </div>
            <div class="text-muted-500 text-sm">
              در انتظار تایید
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-danger-500 mb-2">
              {{ stats.banned }}
            </div>
            <div class="text-muted-500 text-sm">
              مسدود شده
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-muted-500 mb-2">
              {{ stats.inactive }}
            </div>
            <div class="text-muted-500 text-sm">
              غیرفعال
            </div>
          </BaseCard>
          
          <BaseCard rounded="lg" class="p-6 text-center">
            <div class="text-3xl font-bold text-info-500 mb-2">
              {{ stats.totalPsychotherapists }}
            </div>
            <div class="text-muted-500 text-sm">
              روانشناسان
            </div>
          </BaseCard>
        </div>

        <!-- Clinics List -->
        <div v-if="pending" class="flex justify-center py-20">
          <BaseLoader size="xl" />
        </div>

        <div v-else-if="error" class="text-center py-20">
          <BasePlaceholderPage
            title="خطا در بارگذاری"
            subtitle="خطا در بارگذاری لیست کلینیک‌ها"
          />
        </div>

        <div v-else-if="!data?.data?.length">
          <BaseCard rounded="lg" class="p-8 text-center">
            <BasePlaceholderPage
              title="کلینیکی یافت نشد"
              subtitle="هنوز کلینیکی ثبت نشده است"
            />
          </BaseCard>
        </div>

        <div v-else class="space-y-4">
          <BaseCard
            v-for="clinic in data.data"
            :key="clinic.id"
            rounded="lg"
            class="p-6"
          >
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div class="flex-1">
                <div class="flex items-start gap-4 mb-3">
                  <!-- Clinic Logo -->
                  <div v-if="clinic.logo" class="shrink-0">
                    <img 
                      :src="clinic.logo" 
                      alt="لوگو کلینیک" 
                      class="w-16 h-16 object-cover rounded-lg border border-muted-200 dark:border-muted-700"
                    />
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
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
                      
                      <BaseTag
                        v-if="clinic.status"
                        :color="getstatusColor(clinic.status)"
                        variant="solid"
                        rounded="full"
                        size="sm"
                      >
                        {{ getstatusLabel(clinic.status) }}
                      </BaseTag>
                    </div>
                  </div>
                </div>
                
                <!-- Owner Information -->
                <div class="mb-4 p-3 bg-muted-50 dark:bg-muted-900 rounded-lg">
                  <div class="flex items-center gap-3 mb-2">
                    <BaseAvatar
                      :src="getOwnerAvatar(clinic.expand?.owner)"
                      :text="getOwnerName(clinic.expand?.owner)"
                      size="sm"
                      class="shrink-0"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-muted-800 dark:text-muted-100">
                        {{ getOwnerName(clinic.expand?.owner) }}
                      </div>
                      <div class="text-xs text-muted-500">
                        مالک کلینیک
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs text-muted-600">
                    <div class="flex items-center gap-1">
                      <Icon name="lucide:user" class="size-3" />
                      <span>سن: {{ getOwnerAge(clinic.expand?.owner) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Icon name="lucide:graduation-cap" class="size-3" />
                      <span>{{ getOwnerEducation(clinic.expand?.owner) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-2 text-sm text-muted-500">
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:map-pin" class="size-4 ml-2" />
                    <span>{{ clinic.address }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:phone" class="size-4 ml-2" />
                    <span>{{ clinic.phone }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:mail" class="size-4 ml-2" />
                    <span>{{ clinic.email }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:calendar" class="size-4 ml-2" />
                    <span>ثبت شده: {{ new Date(clinic.created).toLocaleDateString('fa-IR') }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:users" class="size-4 ml-2" />
                    <span>تعداد روانشناسان: {{ clinic.psychotherapistsCount || 0 }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2 mt-4 lg:mt-0">
                <BaseButton
                  :to="`/admin/clinics/${clinic.id}`"
                  color="muted"
                  size="sm"
                  rounded="lg"
                >
                  <Icon name="lucide:eye" class="size-4 ml-2" />
                  <span>مشاهده</span>
                </BaseButton>
                
                <!-- Verification Actions for Unverified Clinics -->
                <template v-if="clinic.status === 'pending' || clinic.status === 'under_review'">
                  <BaseButton
                    color="success"
                    size="sm"
                    rounded="lg"
                    @click="verifyClinic(clinic.id, 'approved')"
                  >
                    <Icon name="lucide:check-circle" class="size-4 ml-2" />
                    <span>تایید</span>
                  </BaseButton>
                  
                  <BaseButton
                    color="danger"
                    size="sm"
                    rounded="lg"
                    @click="verifyClinic(clinic.id, 'rejected')"
                  >
                    <Icon name="lucide:x-circle" class="size-4 ml-2" />
                    <span>رد</span>
                  </BaseButton>
                </template>
                
                <!-- Actions for Verified Clinics -->
                <template v-if="clinic.status === 'approved'">
                  <BaseButton
                    color="warning"
                    size="sm"
                    rounded="lg"
                    @click="verifyClinic(clinic.id, 'under_review')"
                  >
                    <Icon name="lucide:clock" class="size-4 ml-2" />
                    <span>در حال بررسی</span>
                  </BaseButton>
                  
                  <!-- Ban/Unban Actions for Verified Clinics -->
                  <BaseButton
                    v-if="clinic.status !== 'banned'"
                    color="danger"
                    variant="outline"
                    size="sm"
                    rounded="lg"
                    @click="banClinic(clinic.id, 'ban', 'نقض قوانین')"
                  >
                    <Icon name="lucide:ban" class="size-4 ml-2" />
                    <span>مسدود</span>
                  </BaseButton>
                  
                  <BaseButton
                    v-if="clinic.status === 'banned'"
                    color="success"
                    size="sm"
                    rounded="lg"
                    @click="banClinic(clinic.id, 'unban')"
                  >
                    <Icon name="lucide:unlock" class="size-4 ml-2" />
                    <span>رفع مسدودیت</span>
                  </BaseButton>
                  
                  <!-- Status Actions for Verified Clinics -->
                  <BaseButton
                    v-if="clinic.status === 'inactive'"
                    color="success"
                    size="sm"
                    rounded="lg"
                    @click="updateClinicStatus(clinic.id, 'active')"
                  >
                    <Icon name="lucide:play" class="size-4 ml-2" />
                    <span>فعال</span>
                  </BaseButton>
                  
                  <BaseButton
                    v-if="clinic.status === 'active'"
                    color="warning"
                    size="sm"
                    rounded="lg"
                    @click="updateClinicStatus(clinic.id, 'inactive')"
                  >
                    <Icon name="lucide:pause" class="size-4 ml-2" />
                    <span>غیرفعال</span>
                  </BaseButton>
                </template>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Pagination -->
        <div v-if="data && data.total > perPage" class="flex justify-center mt-6">
          <BasePagination
            :total-items="data.total"
            :item-per-page="perPage"
            :current-page="page"
            rounded="full"
            @page-change="(newPage) => router.push({ query: { ...route.query, page: newPage } })"
          />
        </div>
      </div>
    </TairoContentWrapper>
  </div>
</template>