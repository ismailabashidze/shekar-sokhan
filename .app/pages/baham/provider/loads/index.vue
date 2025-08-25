<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ProviderLoad } from '../types'

definePageMeta({
  title: 'مدیریت بارها',
  layout: 'sidebar',
})

useHead({
  title: 'مدیریت بارها | با هم',
  htmlAttrs: { dir: 'rtl' },
})

// Mock data for loads
const activeLoads = ref<ProviderLoad[]>([])
const completedLoads = ref<ProviderLoad[]>([])
const expiredLoads = ref<ProviderLoad[]>([])
const currentTab = ref('active')

onMounted(() => {
  // Mock data initialization
  const mockLoads: ProviderLoad[] = [
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
      availableQuantityKg: 0,
      pricePerKg: 4500,
      status: 'completed',
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
      expiryDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      createdAt: new Date(),
      updatedAt: new Date(),
      requests: [],
      totalSales: 0
    },
    {
      id: '4',
      productId: 'p4',
      productName: 'سیر',
      totalQuantityKg: 200,
      availableQuantityKg: 200,
      pricePerKg: 25000,
      status: 'expired',
      availabilityDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() - 3)),
      createdAt: new Date(),
      updatedAt: new Date(),
      requests: [],
      totalSales: 0
    },
    {
      id: '5',
      productId: 'p5',
      productName: 'هویج',
      totalQuantityKg: 400,
      availableQuantityKg: 300,
      pricePerKg: 8000,
      status: 'active',
      availabilityDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      createdAt: new Date(),
      updatedAt: new Date(),
      requests: [
        {
          id: 'r4',
          orderId: 'o4',
          buyerName: 'زهرا حسینی',
          quantityKg: 40,
          requestedAt: new Date(),
          status: 'pending'
        },
        {
          id: 'r5',
          orderId: 'o5',
          buyerName: 'رضا کریمی',
          quantityKg: 60,
          requestedAt: new Date(),
          status: 'approved'
        }
      ],
      totalSales: 720000
    }
  ]

  activeLoads.value = mockLoads.filter(load => load.status === 'active')
  completedLoads.value = mockLoads.filter(load => load.status === 'completed')
  expiredLoads.value = mockLoads.filter(load => load.status === 'expired')
})
</script>

<template>
  <div>
    <TairoContentWrapper>
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          مدیریت بارها
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          مدیریت بارهای در دست فروش، تکمیل شده و منقضی
        </BaseText>
      </template>
      
      <template #right>
        <NuxtLink to="/baham/provider/loads/new">
          <BaseButton color="primary" variant="solid">
            <Icon name="ph:plus" class="size-4 ml-2" />
            <span>ثبت بار جدید</span>
          </BaseButton>
        </NuxtLink>
      </template>
      
      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-muted-200 dark:border-muted-700">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              @click="currentTab = 'active'"
              :class="[
                currentTab === 'active' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-muted-500 hover:text-muted-700 hover:border-muted-300 dark:text-muted-400 dark:hover:text-muted-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              بارهای فعال ({{ activeLoads.length }})
            </button>
            <button
              @click="currentTab = 'completed'"
              :class="[
                currentTab === 'completed' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-muted-500 hover:text-muted-700 hover:border-muted-300 dark:text-muted-400 dark:hover:text-muted-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              بارهای تکمیل شده ({{ completedLoads.length }})
            </button>
            <button
              @click="currentTab = 'expired'"
              :class="[
                currentTab === 'expired' 
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'border-transparent text-muted-500 hover:text-muted-700 hover:border-muted-300 dark:text-muted-400 dark:hover:text-muted-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              بارهای منقضی ({{ expiredLoads.length }})
            </button>
          </nav>
        </div>
      </div>
      
      <!-- Active Loads Table -->
      <BaseCard v-if="currentTab === 'active'" rounded="sm" class="p-6">
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
                      <Icon name="ph:eye" class="size-4 ml-2" />
                      <span>مشاهده</span>
                    </BaseButton>
                  </NuxtLink>
                </div>
              </TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </BaseCard>
      
      <!-- Completed Loads Table -->
      <BaseCard v-if="currentTab === 'completed'" rounded="sm" class="p-6">
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                نام محصول
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                قیمت هر کیلو
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                تاریخ تکمیل
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                فروش کل
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced class="text-end">
                عملیات
              </TairoTableHeading>
            </template>
            
            <TairoTableRow v-for="load in completedLoads" :key="load.id">
              <TairoTableCell spaced>
                <div class="font-medium">{{ load.productName }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ load.pricePerKg.toLocaleString('fa-IR') }} تومان</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ new Date(load.updatedAt).toLocaleDateString('fa-IR') }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ load.totalSales.toLocaleString('fa-IR') }} تومان</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex justify-end">
                  <NuxtLink :to="`/baham/provider/loads/${load.id}`">
                    <BaseButton color="primary" variant="pastel" size="sm">
                      <Icon name="ph:eye" class="size-4 ml-2" />
                      <span>مشاهده</span>
                    </BaseButton>
                  </NuxtLink>
                </div>
              </TairoTableCell>
            </TairoTableRow>
          </TairoTable>
        </div>
      </BaseCard>
      
      <!-- Expired Loads Table -->
      <BaseCard v-if="currentTab === 'expired'" rounded="sm" class="p-6">
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                نام محصول
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                مقدار کل
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                قیمت هر کیلو
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                تاریخ انقضا
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced class="text-end">
                عملیات
              </TairoTableHeading>
            </template>
            
            <TairoTableRow v-for="load in expiredLoads" :key="load.id">
              <TairoTableCell spaced>
                <div class="font-medium">{{ load.productName }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ load.totalQuantityKg }} کیلو</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="font-medium">{{ load.pricePerKg.toLocaleString('fa-IR') }} تومان</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm">{{ new Date(load.expiryDate).toLocaleDateString('fa-IR') }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="flex justify-end">
                  <NuxtLink :to="`/baham/provider/loads/${load.id}`">
                    <BaseButton color="primary" variant="pastel" size="sm">
                      <Icon name="ph:eye" class="size-4 ml-2" />
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
  </div>
</template>