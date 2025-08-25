<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'پیشخوان ارائه‌دهنده',
  layout: 'sidebar',
})

useHead({
  title: 'پیشخوان ارائه‌دهنده | با هم',
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

// Mock data for provider dashboard
const activeLoads = ref<ProviderLoad[]>([])
const totalSales = ref(0)
const monthlySales = ref(0)

onMounted(() => {
  // Mock data initialization
  activeLoads.value = [
    {
      id: '1',
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
        }
      ],
      totalSales: 3000000
    },
    {
      id: '2',
      productId: 'p2',
      productName: 'پیاز زرد',
      totalQuantityKg: 500,
      availableQuantityKg: 200,
      pricePerKg: 4500,
      status: 'active',
      availabilityDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      createdAt: new Date(),
      updatedAt: new Date(),
      requests: [
        {
          id: 'r2',
          orderId: 'o2',
          buyerName: 'مریم رضوی',
          quantityKg: 30,
          requestedAt: new Date(),
          status: 'approved'
        }
      ],
      totalSales: 1500000
    },
    {
      id: '3',
      productId: 'p3',
      productName: 'گوجه فرنگی',
      totalQuantityKg: 300,
      availableQuantityKg: 150,
      pricePerKg: 12000,
      status: 'active',
      availabilityDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      createdAt: new Date(),
      updatedAt: new Date(),
      requests: [
        {
          id: 'r3',
          orderId: 'o3',
          buyerName: 'علی اکبری',
          quantityKg: 25,
          requestedAt: new Date(),
          status: 'pending'
        }
      ],
      totalSales: 2100000
    }
  ]

  totalSales.value = activeLoads.value.reduce((sum, load) => sum + load.totalSales, 0)
  monthlySales.value = 4500000
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                بارهای فعال
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                تعداد بارهای در دست فروش
              </BaseText>
            </div>
            <div class="bg-primary-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:package-duotone" class="text-primary-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-primary-500">
            {{ activeLoads.length }}
          </BaseHeading>
        </BaseCard>
        
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                فروش کل (تومان)
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                مجموع فروش تاکنون
              </BaseText>
            </div>
            <div class="bg-success-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:currency-circle-dollar-duotone" class="text-success-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-success-500">
            {{ totalSales.toLocaleString('fa-IR') }}
          </BaseHeading>
        </BaseCard>
        
        <BaseCard rounded="sm" class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <BaseHeading as="h3" size="md" weight="medium" class="mb-1">
                فروش ماهانه (تومان)
              </BaseHeading>
              <BaseText size="xs" class="text-muted-400">
                فروش این ماه
              </BaseText>
            </div>
            <div class="bg-purple-500/10 flex size-12 items-center justify-center rounded-full">
              <Icon name="ph:chart-line-up-duotone" class="text-purple-500 size-6" />
            </div>
          </div>
          <BaseHeading as="p" size="2xl" weight="bold" class="mt-4 text-purple-500">
            {{ monthlySales.toLocaleString('fa-IR') }}
          </BaseHeading>
        </BaseCard>
      </div>
      
      <!-- Active Loads -->
      <BaseCard rounded="sm" class="p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <BaseHeading as="h2" size="lg" weight="medium">
              بارهای فعال
            </BaseHeading>
            <BaseText size="sm" class="text-muted-400 mt-1">
              لیست بارهای در دست فروش
            </BaseText>
          </div>
          <NuxtLink to="/baham/provider/loads/new">
            <BaseButton color="primary" variant="solid">
              <Icon name="ph:plus" class="size-4" />
              <span>ثبت بار جدید</span>
            </BaseButton>
          </NuxtLink>
        </div>
        
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                نام محصول
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                موجودی
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                قیمت هر کیلو
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                تاریخ انقضا
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                درخواست‌ها
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced class="text-end">
                عملیات
              </TairoTableHeading>
            </template>
            
            <TairoTableRow v-for="load in activeLoads" :key="load.id">
              <TairoTableCell spaced>
                <div class="font-medium">{{ load.productName }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">
                  <span class="font-medium">{{ load.availableQuantityKg }}</span>
                  <span class="text-muted-400">/{{ load.totalQuantityKg }} کیلو</span>
                </div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ load.pricePerKg.toLocaleString('fa-IR') }} تومان</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ new Date(load.expiryDate).toLocaleDateString('fa-IR') }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <BaseTag 
                  v-if="load.requests.filter(r => r.status === 'pending').length > 0"
                  color="warning" 
                  variant="pastel" 
                  rounded="full" 
                  size="sm"
                >
                  {{ load.requests.filter(r => r.status === 'pending').length }} در انتظار
                </BaseTag>
                <BaseTag 
                  v-else
                  color="success" 
                  variant="pastel" 
                  rounded="full" 
                  size="sm"
                >
                  بدون درخواست
                </BaseTag>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex justify-end">
                  <NuxtLink :to="`/baham/provider/loads/${load.id}`">
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
      
      <!-- Sales Chart Placeholder -->
      <BaseCard rounded="sm" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <BaseHeading as="h2" size="lg" weight="medium">
              نمودار فروش
            </BaseHeading>
            <BaseText size="sm" class="text-muted-400 mt-1">
              تحلیل فروش ماهانه
            </BaseText>
          </div>
        </div>
        
        <div class="h-64 flex items-center justify-center bg-muted-100 dark:bg-muted-800 rounded-lg">
          <div class="text-center">
            <Icon name="ph:chart-line-duotone" class="text-muted-400 size-12 mx-auto mb-3" />
            <BaseText size="sm" class="text-muted-500">
              نمودار فروش در اینجا نمایش داده می‌شود
            </BaseText>
          </div>
        </div>
      </BaseCard>
    </TairoContentWrapper>
  </div>
</template>