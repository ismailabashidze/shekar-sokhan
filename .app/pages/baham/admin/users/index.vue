<script setup lang="ts">
import type { AdminUser } from '~/types/admin'

definePageMeta({
  title: 'مدیریت کاربران - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مدیریت کاربران - با هم',
  meta: [
    { name: 'description', content: 'مدیریت کاربران پلتفرم با هم' }
  ]
})

// Mock data
const users: AdminUser[] = [
  {
    id: '1',
    nationalCode: '1234567890',
    phoneNumber: '09123456789',
    email: 'ali@example.com',
    role: 'buyer',
    isVerified: true,
    createdAt: new Date('2023-01-15'),
    orderCount: 12,
    lastActivity: new Date('2023-06-10')
  },
  {
    id: '2',
    nationalCode: '0987654321',
    phoneNumber: '09129876543',
    email: 'sara@example.com',
    role: 'distributor',
    isVerified: true,
    createdAt: new Date('2023-02-20'),
    orderCount: 45,
    lastActivity: new Date('2023-06-12')
  },
  {
    id: '3',
    nationalCode: '1122334455',
    phoneNumber: '09131122334',
    email: 'reza@example.com',
    role: 'provider',
    isVerified: false,
    createdAt: new Date('2023-03-05'),
    orderCount: 0,
    lastActivity: new Date('2023-05-28')
  },
  {
    id: '4',
    nationalCode: '5566778899',
    phoneNumber: '09145566778',
    email: 'mina@example.com',
    role: 'buyer',
    isVerified: true,
    createdAt: new Date('2023-04-12'),
    orderCount: 8,
    lastActivity: new Date('2023-06-11')
  }
]

const roles = {
  buyer: 'خریدار',
  distributor: 'توزیع‌کننده',
  provider: 'ارائه‌دهنده',
  admin: 'مدیر'
}

const getStatusClass = (verified: boolean) => {
  return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
}

const getStatusText = (verified: boolean) => {
  return verified ? 'تایید شده' : 'در انتظار تایید'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          مدیریت کاربران
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          لیست تمام کاربران پلتفرم
        </BaseParagraph>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton color="primary">
          <Icon name="ph:plus-duotone" class="size-5 mr-2" />
          افزودن کاربر جدید
        </BaseButton>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900 mb-8">
      <div class="p-6">
        <!-- Search and Filters -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <BaseInput
              placeholder="جستجوی کاربران..."
              rounded="sm"
              :classes="{
                wrapper: 'w-full'
              }"
            >
              <template #addon>
                <Icon name="ph:magnifying-glass-duotone" class="size-5 text-muted-400" />
              </template>
            </BaseInput>
          </div>
          <div>
            <BaseSelect rounded="sm">
              <option value="">همه نقش‌ها</option>
              <option value="buyer">خریدار</option>
              <option value="distributor">توزیع‌کننده</option>
              <option value="provider">ارائه‌دهنده</option>
            </BaseSelect>
          </div>
          <div>
            <BaseSelect rounded="sm">
              <option value="">همه وضعیت‌ها</option>
              <option value="verified">تایید شده</option>
              <option value="pending">در انتظار تایید</option>
            </BaseSelect>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <!-- Users Table -->
    <TairoTable rounded="lg" class="dark:!bg-muted-900">
      <template #header>
        <TairoTableHeading>کاربر</TairoTableHeading>
        <TairoTableHeading>نقش</TairoTableHeading>
        <TairoTableHeading>تعداد سفارش</TairoTableHeading>
        <TairoTableHeading>وضعیت</TairoTableHeading>
        <TairoTableHeading>تاریخ عضویت</TairoTableHeading>
        <TairoTableHeading>آخرین فعالیت</TairoTableHeading>
        <TairoTableHeading class="text-center">عملیات</TairoTableHeading>
      </template>
      
      <TairoTableRow v-for="user in users" :key="user.id">
        <TairoTableCell>
          <div class="flex items-center">
            <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-10 items-center justify-center mr-3">
              <Icon name="ph:user-duotone" class="text-primary-500 size-5" />
            </div>
            <div>
              <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
                {{ user.email }}
              </BaseParagraph>
              <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                {{ user.phoneNumber }}
              </BaseParagraph>
            </div>
          </div>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ roles[user.role] }}
          </BaseParagraph>
          <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
            {{ user.nationalCode }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ user.orderCount }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseBadge 
            :color="user.isVerified ? 'success' : 'warning'" 
            rounded="lg"
            class="capitalize"
          >
            {{ getStatusText(user.isVerified) }}
          </BaseBadge>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ new Date(user.createdAt).toLocaleDateString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ new Date(user.lastActivity).toLocaleDateString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell class="text-center">
          <NuxtLink 
            :to="`/baham/admin/users/${user.id}`"
          >
            <BaseButton color="primary" size="sm" outlined>
              مشاهده جزئیات
            </BaseButton>
          </NuxtLink>
        </TairoTableCell>
      </TairoTableRow>
    </TairoTable>
    
    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
        نمایش <span class="font-medium">1</span> تا <span class="font-medium">4</span> از <span class="font-medium">4</span> کاربر
      </BaseParagraph>
      <div class="flex space-x-2 rtl:space-x-reverse">
        <BaseButton size="sm" color="default" outlined>
          قبلی
        </BaseButton>
        <BaseButton size="sm" color="primary">
          1
        </BaseButton>
        <BaseButton size="sm" color="default" outlined>
          بعدی
        </BaseButton>
      </div>
    </div>
  </div>
</template>