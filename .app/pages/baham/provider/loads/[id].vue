<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  title: 'جزئیات بار',
  layout: 'sidebar',
})

useHead({
  title: 'جزئیات بار | با هم',
  htmlAttrs: { dir: 'rtl' },
})

// Define types directly in the file
interface LoadRequest {
  id: string
  orderId: string
  buyerName: string
  quantityKg: number
  requestedAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

interface ProviderLoad {
  id: string
  productId: string
  productName: string
  totalQuantityKg: number
  availableQuantityKg: number
  pricePerKg: number
  status: 'active' | 'inactive' | 'expired'
  availabilityDate: Date
  expiryDate: Date
  createdAt: Date
  updatedAt: Date
  requests: LoadRequest[]
  totalSales: number
}

const route = useRoute()
const loadId = route.params.id

// Mock data for a specific load
const load = ref<ProviderLoad | null>(null)
const requests = ref<LoadRequest[]>([])

onMounted(() => {
  // Mock data initialization
  load.value = {
    id: loadId as string,
    productId: 'p1',
    productName: 'سیب زمینی مرغوب',
    totalQuantityKg: 1000,
    availableQuantityKg: 400,
    pricePerKg: 5000,
    status: 'active',
    availabilityDate: new Date(),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    createdAt: new Date(),
    updatedAt: new Date(),
    requests: [
      {
        id: 'r1',
        orderId: 'o1',
        buyerName: 'احمد محمدی',
        quantityKg: 50,
        requestedAt: new Date(),
        status: 'pending'
      },
      {
        id: 'r2',
        orderId: 'o2',
        buyerName: 'مریم رضوی',
        quantityKg: 30,
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        status: 'approved'
      },
      {
        id: 'r3',
        orderId: 'o3',
        buyerName: 'علی اکبری',
        quantityKg: 20,
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        status: 'rejected'
      },
      {
        id: 'r4',
        orderId: 'o4',
        buyerName: 'زهرا حسینی',
        quantityKg: 40,
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        status: 'pending'
      }
    ],
    totalSales: 3000000
  }
  
  requests.value = load.value.requests
})

// Status color mapping
const statusColors = {
  active: 'success',
  completed: 'info',
  expired: 'danger',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger'
} as const

// Status text mapping
const statusText = {
  active: 'فعال',
  completed: 'تکمیل شده',
  expired: 'منقضی',
  pending: 'در انتظار',
  approved: 'تأیید شده',
  rejected: 'رد شده'
} as const
</script>

<template>
  <div>
    <TairoContentWrapper v-if="load">
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          جزئیات بار: {{ load.productName }}
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          اطلاعات کامل بار و درخواست‌های خرید
        </BaseText>
      </template>
      
      <template #right>
        <BaseButton color="primary" variant="solid">
          <Icon name="ph:pencil-simple" class="size-4" />
          <span>ویرایش بار</span>
        </BaseButton>
      </template>
      
      <!-- Load Information -->
      <BaseCard rounded="sm" class="p-6 mb-8">
        <BaseHeading as="h2" size="lg" weight="medium" class="mb-6">
          اطلاعات بار
        </BaseHeading>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              شناسه بار
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ load.id }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              نام محصول
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ load.productName }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              وضعیت
            </BaseText>
            <BaseTag 
              :color="statusColors[load.status]" 
              variant="pastel" 
              rounded="full" 
              size="sm"
              class="mt-1"
            >
              {{ statusText[load.status] }}
            </BaseTag>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              موجودی
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              <span class="font-medium">{{ load.availableQuantityKg }}</span>
              <span class="text-muted-400">/{{ load.totalQuantityKg }} کیلو</span>
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              قیمت هر کیلو
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ load.pricePerKg.toLocaleString('fa-IR') }} تومان
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              فروش کل
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ load.totalSales.toLocaleString('fa-IR') }} تومان
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              تاریخ آماده‌سازی
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ new Date(load.availabilityDate).toLocaleDateString('fa-IR') }}
            </BaseHeading>
          </div>
          
          <div>
            <BaseText size="sm" class="text-muted-500 dark:text-muted-400">
              تاریخ انقضا
            </BaseText>
            <BaseHeading as="p" size="sm" weight="medium" class="mt-1">
              {{ new Date(load.expiryDate).toLocaleDateString('fa-IR') }}
            </BaseHeading>
          </div>
        </div>
      </BaseCard>
      
      <!-- Requests -->
      <BaseCard rounded="sm" class="p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <BaseHeading as="h2" size="lg" weight="medium">
              درخواست‌های خرید
            </BaseHeading>
            <BaseText size="sm" class="text-muted-400 mt-1">
              لیست درخواست‌های ثبت شده برای این بار
            </BaseText>
          </div>
          <BaseTag color="primary" variant="pastel" rounded="full" size="sm">
            {{ requests.length }} درخواست
          </BaseTag>
        </div>
        
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                خریدار
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                مقدار (کیلو)
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                تاریخ درخواست
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                وضعیت
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced class="text-end">
                عملیات
              </TairoTableHeading>
            </template>
            
            <TairoTableRow v-for="request in requests" :key="request.id">
              <TairoTableCell spaced>
                <div class="font-medium">{{ request.buyerName }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ request.quantityKg }} کیلو</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ new Date(request.requestedAt).toLocaleDateString('fa-IR') }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <BaseTag 
                  :color="statusColors[request.status]" 
                  variant="pastel" 
                  rounded="full" 
                  size="sm"
                >
                  {{ statusText[request.status] }}
                </BaseTag>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex justify-end">
                  <NuxtLink :to="`/baham/provider/requests/${request.id}`">
                    <BaseButton color="primary" variant="pastel" size="sm">
                      <Icon name="ph:eye" class="size-4" />
                      <span>مشاهده</span>
                    </BaseButton>
                  </NuxtLink>
                </div>
              </TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </BaseCard>
    </TairoContentWrapper>
    
    <TairoContentWrapper v-else>
      <BasePlaceholderPage
        title="در حال بارگذاری"
        subtitle="اطلاعات بار در حال بارگذاری است..."
      >
        <template #image>
          <BaseLoading size="lg" />
        </template>
      </BasePlaceholderPage>
    </TairoContentWrapper>
  </div>
</template>