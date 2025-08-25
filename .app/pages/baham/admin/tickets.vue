<script setup lang="ts">
definePageMeta({
  title: 'مدیریت تیکت‌ها - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مدیریت تیکت‌ها - با هم',
  meta: [
    { name: 'description', content: 'مدیریت تیکت‌های پشتیبانی پلتفرم با هم' }
  ]
})

// Mock data for tickets
const tickets = [
  {
    id: 'T001',
    user: 'زهرا احمدی',
    subject: 'مشکل در ثبت سفارش',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2023-06-12'),
    assignedAdmin: null
  },
  {
    id: 'T002',
    user: 'حسین کریمی',
    subject: 'تأیید مدارک',
    priority: 'medium',
    status: 'in_progress',
    createdAt: new Date('2023-06-11'),
    assignedAdmin: 'مدیر اصلی'
  },
  {
    id: 'T003',
    user: 'مریم رضایی',
    subject: 'سوال درباره نحوه استفاده',
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2023-06-10'),
    assignedAdmin: 'حمیدرضا محمدی'
  }
]

const getStatusClass = (status: string) => {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800'
    case 'closed': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'open': return 'باز'
    case 'in_progress': return 'در حال پردازش'
    case 'closed': return 'بسته شده'
    default: return status
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return 'بالا'
    case 'medium': return 'متوسط'
    case 'low': return 'پایین'
    default: return priority
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          مدیریت تیکت‌های پشتیبانی
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          لیست تمام تیکت‌های پشتیبانی
        </BaseParagraph>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton color="primary">
          <Icon name="ph:gear-duotone" class="size-5 mr-2" />
          تنظیمات پشتیبانی
        </BaseButton>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900 mb-8">
      <div class="p-6">
        <!-- Search and Filters -->
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <BaseInput
              placeholder="جستجوی تیکت‌ها..."
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
              <option value="">همه وضعیت‌ها</option>
              <option value="open">باز</option>
              <option value="in_progress">در حال پردازش</option>
              <option value="closed">بسته شده</option>
            </BaseSelect>
          </div>
          <div>
            <BaseSelect rounded="sm">
              <option value="">همه اولویت‌ها</option>
              <option value="high">بالا</option>
              <option value="medium">متوسط</option>
              <option value="low">پایین</option>
            </BaseSelect>
          </div>
        </div>
      </div>
    </BaseCard>
    
    <!-- Tickets Table -->
    <TairoTable rounded="lg" class="dark:!bg-muted-900">
      <template #header>
        <TairoTableHeading>شناسه</TairoTableHeading>
        <TairoTableHeading>کاربر</TairoTableHeading>
        <TairoTableHeading>موضوع</TairoTableHeading>
        <TairoTableHeading>اولویت</TairoTableHeading>
        <TairoTableHeading>وضعیت</TairoTableHeading>
        <TairoTableHeading>تاریخ ثبت</TairoTableHeading>
        <TairoTableHeading>مسئول پاسخگویی</TairoTableHeading>
        <TairoTableHeading class="text-center">عملیات</TairoTableHeading>
      </template>
      
      <TairoTableRow v-for="ticket in tickets" :key="ticket.id">
        <TairoTableCell>
          <BaseParagraph size="sm" weight="medium" class="text-muted-800 dark:text-white">
            {{ ticket.id }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ ticket.user }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-800 dark:text-white">
            {{ ticket.subject }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseBadge 
            :color="ticket.priority === 'high' ? 'danger' : 
                   ticket.priority === 'medium' ? 'warning' : 'success'" 
            rounded="lg"
            class="capitalize"
          >
            {{ getPriorityText(ticket.priority) }}
          </BaseBadge>
        </TairoTableCell>
        <TairoTableCell>
          <BaseBadge 
            :color="ticket.status === 'open' ? 'danger' : 
                   ticket.status === 'in_progress' ? 'warning' : 'success'" 
            rounded="lg"
            class="capitalize"
          >
            {{ getStatusText(ticket.status) }}
          </BaseBadge>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ new Date(ticket.createdAt).toLocaleDateString('fa-IR') }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell>
          <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
            {{ ticket.assignedAdmin || 'تعیین نشده' }}
          </BaseParagraph>
        </TairoTableCell>
        <TairoTableCell class="text-center">
          <BaseButton color="primary" size="sm" outlined>
            مشاهده و پاسخ
          </BaseButton>
        </TairoTableCell>
      </TairoTableRow>
    </TairoTable>
    
    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
        نمایش <span class="font-medium">1</span> تا <span class="font-medium">3</span> از <span class="font-medium">3</span> تیکت
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