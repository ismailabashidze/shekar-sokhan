<script setup lang="ts">
import type { Clinic } from '~/types/wizard'

definePageMeta({
  title: 'مدیریت کلینیک',
  layout: 'sidebar',
})

useHead({
  title: 'مدیریت کلینیک',
  htmlAttrs: { dir: 'rtl' },
})

const route = useRoute()
const router = useRouter()
const toaster = useToaster()

const clinicId = route.params.id as string

const { data: clinic, pending, error, refresh } = await useFetch<{ data: Clinic }>(`/api/clinics/${clinicId}`)

const form = ref<Partial<Clinic>>({
  name: '',
  address: '',
  phone: '',
  email: '',
  license: '',
  description: '',
})

const loading = ref(false)
const errors = ref<Record<string, string>>({})

watchEffect(() => {
  if (clinic.value?.data) {
    form.value = {
      name: clinic.value.data.name,
      address: clinic.value.data.address,
      phone: clinic.value.data.phone,
      email: clinic.value.data.email,
      license: clinic.value.data.license,
      description: clinic.value.data.description,
    }
  }
})

function validateForm() {
  errors.value = {}
  
  if (!form.value.name) errors.value.name = 'نام کلینیک اجباری است'
  if (!form.value.address) errors.value.address = 'آدرس اجباری است'
  if (!form.value.phone) errors.value.phone = 'شماره تلفن اجباری است'
  if (!form.value.email) errors.value.email = 'ایمیل اجباری است'
  if (!form.value.license) errors.value.license = 'شماره پروانه اجباری است'
  
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    await $fetch(`/api/clinics/${clinicId}`, {
      method: 'PUT',
      body: form.value
    })
    
    toaster.show({
      title: 'بروزرسانی موفق',
      message: 'اطلاعات کلینیک با موفقیت بروزرسانی شد',
      color: 'success',
      icon: 'ph:check',
      closable: true,
    })
    
    await refresh()
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در بروزرسانی اطلاعات کلینیک',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!confirm('آیا مطمئن هستید که می‌خواهید این کلینیک را حذف کنید؟')) {
    return
  }
  
  loading.value = true
  
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
    
    await router.push('/clinic/dashboard')
  } catch (error) {
    toaster.show({
      title: 'خطا',
      message: 'خطا در حذف کلینیک',
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  } finally {
    loading.value = false
  }
}

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
          <span>مدیریت کلینیک</span>
        </BaseHeading>
      </template>
      
      <template #right>
        <BaseButton
          to="/clinic/dashboard"
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
        <!-- Status Card -->
        <BaseCard rounded="lg" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading
                as="h2"
                size="xl"
                weight="semibold"
                class="text-muted-800 dark:text-muted-100 mb-2"
              >
                {{ clinic.data.name }}
              </BaseHeading>
              <BaseParagraph class="text-muted-500">
                آخرین بروزرسانی: {{ new Date(clinic.data.updated).toLocaleDateString('fa-IR') }}
              </BaseParagraph>
            </div>
            <BaseTag
              :color="getStatusColor(clinic.data.status)"
              variant="pastel"
              rounded="full"
              size="lg"
            >
              {{ getStatusLabel(clinic.data.status) }}
            </BaseTag>
          </div>
        </BaseCard>

        <!-- Edit Form -->
        <BaseCard rounded="lg" class="p-6">
          <BaseHeading
            as="h3"
            size="lg"
            weight="semibold"
            class="text-muted-800 dark:text-muted-100 mb-6"
          >
            ویرایش اطلاعات کلینیک
          </BaseHeading>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.name"
                label="نام کلینیک"
                placeholder="نام کلینیک را وارد کنید"
                :error="errors.name"
                required
              />
              
              <BaseInput
                v-model="form.license"
                label="شماره پروانه"
                placeholder="شماره پروانه کلینیک"
                :error="errors.license"
                required
              />
            </div>
            
            <BaseTextarea
              v-model="form.address"
              label="آدرس"
              placeholder="آدرس کامل کلینیک"
              :error="errors.address"
              required
            />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.phone"
                label="شماره تلفن"
                placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
                :error="errors.phone"
                required
              />
              
              <BaseInput
                v-model="form.email"
                label="ایمیل"
                type="email"
                placeholder="clinic@example.com"
                :error="errors.email"
                required
              />
            </div>
            
            <BaseTextarea
              v-model="form.description"
              label="توضیحات"
              placeholder="توضیحات اضافی در مورد کلینیک"
              rows="3"
            />

            <div class="flex justify-between pt-6">
              <BaseButton
                type="button"
                color="danger"
                variant="outline"
                @click="handleDelete"
                :loading="loading"
                :disabled="loading"
              >
                <Icon name="lucide:trash-2" class="ml-2 size-4" />
                حذف کلینیک
              </BaseButton>
              
              <BaseButton
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="loading"
              >
                <Icon name="lucide:save" class="ml-2 size-4" />
                ذخیره تغییرات
              </BaseButton>
            </div>
          </form>
        </BaseCard>
      </div>
    </TairoContentWrapper>
  </div>
</template>