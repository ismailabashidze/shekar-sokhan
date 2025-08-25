<script setup lang="ts">
import type { AdminUser } from '~/types/admin'

definePageMeta({
  title: 'جزئیات کاربر - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'جزئیات کاربر - با هم',
  meta: [
    { name: 'description', content: 'جزئیات کاربر پلتفرم با هم' }
  ]
})

const route = useRoute()
const router = useRouter()

// Mock user data
const user: AdminUser = {
  id: route.params.id as string,
  nationalCode: '1234567890',
  phoneNumber: '09123456789',
  email: 'ali@example.com',
  role: 'distributor',
  isVerified: false,
  createdAt: new Date('2023-02-20'),
  orderCount: 45,
  lastActivity: new Date('2023-06-12')
}

const roles = {
  buyer: 'خریدار',
  distributor: 'توزیع‌کننده',
  provider: 'ارائه‌دهنده',
  admin: 'مدیر'
}

const toggleVerification = () => {
  user.isVerified = !user.isVerified
}

const deleteUser = () => {
  if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
    // In a real app, this would be an API call
    router.push('/baham/admin/users')
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          جزئیات کاربر
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          اطلاعات کامل کاربر #{{ user.id }}
        </BaseParagraph>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton color="danger" @click="deleteUser">
          <Icon name="ph:trash-duotone" class="size-5 mr-2" />
          حذف کاربر
        </BaseButton>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900 mb-8">
      <div class="p-6">
        <div class="flex items-center mb-6">
          <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-16 items-center justify-center">
            <Icon name="ph:user-duotone" class="text-primary-500 size-8" />
          </div>
          <div class="mr-4">
            <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
              علی محمدی
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
              {{ user.email }}
            </BaseParagraph>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
              اطلاعات شخصی
            </BaseHeading>
            <div class="space-y-4">
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  شناسه کاربر:
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ user.id }}
                </BaseParagraph>
              </div>
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  کد ملی:
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ user.nationalCode }}
                </BaseParagraph>
              </div>
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  شماره تلفن:
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ user.phoneNumber }}
                </BaseParagraph>
              </div>
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  ایمیل:
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ user.email }}
                </BaseParagraph>
              </div>
            </div>
          </div>
          
          <div>
            <BaseHeading tag="h3" size="md" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
              اطلاعات حساب
            </BaseHeading>
            <div class="space-y-4">
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  نقش:
                </BaseParagraph>
                <BaseBadge color="info" rounded="lg">
                  {{ roles[user.role] }}
                </BaseBadge>
              </div>
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  وضعیت تایید:
                </BaseParagraph>
                <BaseBadge 
                  :color="user.isVerified ? 'success' : 'warning'" 
                  rounded="lg"
                >
                  {{ user.isVerified ? 'تایید شده' : 'در انتظار تایید' }}
                </BaseBadge>
              </div>
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  تاریخ عضویت:
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ new Date(user.createdAt).toLocaleDateString('fa-IR') }}
                </BaseParagraph>
              </div>
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  آخرین فعالیت:
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ new Date(user.lastActivity).toLocaleDateString('fa-IR') }}
                </BaseParagraph>
              </div>
              <div class="flex">
                <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 w-32">
                  تعداد سفارشات:
                </BaseParagraph>
                <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
                  {{ user.orderCount }}
                </BaseParagraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <div class="flex flex-wrap gap-3">
      <BaseButton
        @click="toggleVerification"
        :color="user.isVerified ? 'warning' : 'success'"
      >
        <Icon 
          :name="user.isVerified ? 'ph:x-circle-duotone' : 'ph:check-circle-duotone'" 
          class="size-5 mr-2" 
        />
        {{ user.isVerified ? 'لغو تایید' : 'تایید کاربر' }}
      </BaseButton>
      <BaseButton color="default" outlined>
        <Icon name="ph:pencil-duotone" class="size-5 mr-2" />
        ویرایش اطلاعات
      </BaseButton>
      <NuxtLink to="/baham/admin/users">
        <BaseButton color="default">
          <Icon name="ph:arrow-left-duotone" class="size-5 mr-2" />
          بازگشت
        </BaseButton>
      </NuxtLink>
    </div>
  </div>
</template>