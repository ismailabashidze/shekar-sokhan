<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LoadRequest } from '../../buyer/types'

definePageMeta({
  title: 'جزئیات درخواست',
  layout: 'sidebar',
})

useHead({
  title: 'جزئیات درخواست | با هم',
  htmlAttrs: { dir: 'rtl' },
})

const route = useRoute()
const router = useRouter()
const requestId = route.params.id

// Mock data for a specific request
const request = ref<LoadRequest | null>(null)

onMounted(() => {
  // Mock data initialization
  request.value = {
    id: requestId as string,
    orderId: 'o1',
    buyerName: 'احمد محمدی',
    quantityKg: 50,
    requestedAt: new Date(),
    status: 'pending'
  }
})

const approveRequest = () => {
  if (request.value) {
    request.value.status = 'approved'
    // In a real app, this would update the server
    console.log(`Request ${requestId} approved`)
  }
}

const rejectRequest = () => {
  if (request.value) {
    request.value.status = 'rejected'
    // In a real app, this would update the server
    console.log(`Request ${requestId} rejected`)
  }
}

// Status color mapping
const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger'
} as const

// Status text mapping
const statusText = {
  pending: 'در انتظار',
  approved: 'تأیید شده',
  rejected: 'رد شده'
} as const
</script>

<template>
  <div>
    <TairoContentWrapper v-if="request">
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          جزئیات درخواست
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          اطلاعات کامل درخواست خرید و خریدار
        </BaseText>
      </template>
      
      <template #right>
        <BaseButton 
          @click="router.back()" 
          color="muted" 
          variant="pastel"
        >
          <Icon name="ph:arrow-left" class="size-4" />
          <span>بازگشت</span>
        </BaseButton>
      </template>
      
      <!-- Request Information -->
      <BaseCard rounded="sm" class="p-6 mb-8">
        <BaseHeading as="h2" size="lg" weight="medium" class="mb-6">
          اطلاعات درخواست
        </BaseHeading>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              شناسه درخواست
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1 font-mono">
              {{ request.id }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              شناسه سفارش
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1 font-mono">
              {{ request.orderId }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              نام خریدار
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ request.buyerName }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              مقدار درخواستی
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ request.quantityKg }} کیلو
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              تاریخ درخواست
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ new Date(request.requestedAt).toLocaleDateString('fa-IR') }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              وضعیت
            </BaseText>
            <BaseTag 
              :color="statusColors[request.status]" 
              variant="pastel" 
              rounded="full" 
              size="sm"
              class="mt-1"
            >
              {{ statusText[request.status] }}
            </BaseTag>
          </div>
        </div>
      </BaseCard>
      
      <!-- Buyer Information -->
      <BaseCard rounded="sm" class="p-6 mb-8">
        <BaseHeading as="h2" size="lg" weight="medium" class="mb-6">
          اطلاعات خریدار
        </BaseHeading>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              نام و نام خانوادگی
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ request.buyerName }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              شماره تماس
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              09123456789
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              آدرس
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              تهران، خیابان ولیعصر، پلاک 123
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              تاریخ عضویت
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              1402/01/15
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
      
      <!-- Action Buttons -->
      <BaseCard 
        v-if="request.status === 'pending'" 
        rounded="sm" 
        class="p-6"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="text-center md:text-right">
            <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
              عملیات بر روی درخواست
            </BaseHeading>
            <BaseText size="sm" class="text-muted-500">
              آیا این درخواست را تأیید یا رد می‌کنید؟
            </BaseText>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <BaseButton 
              @click="rejectRequest"
              color="danger" 
              variant="solid"
            >
              <Icon name="ph:x" class="size-4" />
              <span>رد درخواست</span>
            </BaseButton>
            <BaseButton 
              @click="approveRequest"
              color="success" 
              variant="solid"
            >
              <Icon name="ph:check" class="size-4" />
              <span>تأیید درخواست</span>
            </BaseButton>
          </div>
        </div>
      </BaseCard>
      
      <!-- Status Message -->
      <BaseCard 
        v-else
        rounded="sm" 
        class="p-6"
        :class="request.status === 'approved' ? 'border-r-4 border-r-success-500' : 'border-r-4 border-r-danger-500'"
      >
        <div class="flex items-start">
          <div 
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            :class="request.status === 'approved' ? 'bg-success-500/10' : 'bg-danger-500/10'"
          >
            <Icon 
              v-if="request.status === 'approved'" 
              name="ph:check-circle" 
              class="text-success-500 size-6" 
            />
            <Icon 
              v-else 
              name="ph:x-circle" 
              class="text-danger-500 size-6" 
            />
          </div>
          <div class="ms-4">
            <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
              {{
                request.status === 'approved' 
                  ? 'درخواست تأیید شده است' 
                  : 'درخواست رد شده است'
              }}
            </BaseHeading>
            <BaseText size="sm" class="text-muted-500">
              {{
                request.status === 'approved' 
                  ? 'این درخواست توسط شما تأیید شده و سفارش در حال پردازش است.' 
                  : 'این درخواست توسط شما رد شده است.'
              }}
            </BaseText>
          </div>
        </div>
      </BaseCard>
    </TairoContentWrapper>
    
    <TairoContentWrapper v-else>
      <BasePlaceholderPage
        title="در حال بارگذاری"
        subtitle="اطلاعات درخواست در حال بارگذاری است..."
      >
        <template #image>
          <BaseLoading size="lg" />
        </template>
      </BasePlaceholderPage>
    </TairoContentWrapper>
  </div>
</template>