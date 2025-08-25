<template>
  <div class="distributor-dashboard space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard class="border-l-4 border-blue-500 p-6">
        <div class="flex items-center">
          <div class="p-4 rounded-full bg-blue-100 text-blue-500 ml-5">
            <Icon name="mdi:package-variant" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">سفارشات جدید</p>
            <p class="text-3xl font-bold">12</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="border-l-4 border-green-500 p-6">
        <div class="flex items-center">
          <div class="p-4 rounded-full bg-green-100 text-green-500 ml-5">
            <Icon name="mdi:currency-usd" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">درآمد این ماه</p>
            <p class="text-3xl font-bold">2,450,000 تومان</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="border-l-4 border-purple-500 p-6">
        <div class="flex items-center">
          <div class="p-4 rounded-full bg-purple-100 text-purple-500 ml-5">
            <Icon name="mdi:truck-delivery" class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">بارهای اختصاص‌یافته</p>
            <p class="text-3xl font-bold">8</p>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BaseCard class="p-6">
        <template #header>
          <h2 class="text-xl font-semibold mb-6">منطقه خدمات‌رسانی</h2>
        </template>
        <div class="h-72 bg-gray-100 rounded-xl flex items-center justify-center">
          <div class="text-center">
            <Icon name="mdi:map-marker-radius" class="w-14 h-14 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500 text-lg">نقشه تعاملی (Tairo Map Component)</p>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-5">
          <div class="bg-gray-50 p-4 rounded-xl">
            <p class="text-sm text-gray-500 mb-2">ظرفیت فعلی</p>
            <p class="text-xl font-semibold">2.5 تن</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl">
            <p class="text-sm text-gray-500 mb-2">مساحت تحت پوشش</p>
            <p class="text-xl font-semibold">12 کیلومتر مربع</p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="p-6">
        <template #header>
          <h2 class="text-xl font-semibold mb-6">فعالیت اخیر</h2>
        </template>
        <div class="space-y-5">
          <div class="flex items-start">
            <div class="p-3 bg-blue-100 rounded-full ml-4">
              <Icon name="mdi:cart" class="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p class="font-medium text-lg mb-1">سفارش جدید از «فروشگاه سبز»</p>
              <p class="text-gray-500">2 ساعت پیش - 150 کیلوگرم سیب زمینی</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="p-3 bg-green-100 rounded-full ml-4">
              <Icon name="mdi:package-variant-closed" class="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p class="font-medium text-lg mb-1">بار جدید اختصاص یافت</p>
              <p class="text-gray-500">4 ساعت پیش - 500 کیلوگرم پیاز از «باغ نخل»</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="p-3 bg-purple-100 rounded-full ml-4">
              <Icon name="mdi:bank-transfer" class="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p class="font-medium text-lg mb-1">تسویه حساب انجام شد</p>
              <p class="text-gray-500">دیروز - 320,000 تومان به حساب شما واریز شد</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    
    <BaseCard class="p-6">
      <template #header>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">سفارشات اخیر</h2>
          <NuxtLink to="/baham/distributor/orders" class="text-blue-500 hover:underline font-medium">
            مشاهده همه
          </NuxtLink>
        </div>
      </template>
      <TairoTable :columns="orderColumns" :data="recentOrders" :loading="false" />
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import type { DistributorOrder } from './types'

definePageMeta({
  title: 'پیشخوان توزیع‌کننده',
  icon: 'mdi:view-dashboard',
  layout: 'distributor'
})

useHead({
  title: 'پیشخوان توزیع‌کننده - با هم',
  meta: [
    { name: 'description', content: 'پیشخوان توزیع‌کننده در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

const orderColumns = [
  { key: 'id', label: 'شناسه', sortable: true },
  { key: 'buyerName', label: 'خریدار', sortable: true },
  { key: 'loadDetails.productName', label: 'محصول', sortable: true },
  { key: 'quantity_kg', label: 'مقدار', sortable: true },
  { key: 'total_price', label: 'قیمت کل', sortable: true },
  { key: 'status', label: 'وضعیت', sortable: true }
]

const recentOrders: DistributorOrder[] = [
  {
    id: 'ORD-001',
    buyerName: 'فروشگاه سبز',
    buyerPhone: '09123456789',
    quantity_kg: 150,
    total_price: 4500000,
    status: 'pending',
    delivery_method: 'pickup_from_distributor',
    loadDetails: {
      productName: 'سیب زمینی مرغوب'
    }
  },
  {
    id: 'ORD-002',
    buyerName: 'سوپرمارکت طلایی',
    buyerPhone: '09129876543',
    quantity_kg: 200,
    total_price: 6000000,
    status: 'confirmed_by_provider',
    delivery_method: 'pickup_from_distributor',
    loadDetails: {
      productName: 'پیاز زرد'
    }
  },
  {
    id: 'ORD-003',
    buyerName: 'رستوران آبی',
    buyerPhone: '09124567890',
    quantity_kg: 80,
    total_price: 2400000,
    status: 'shipped',
    delivery_method: 'pickup_from_distributor',
    loadDetails: {
      productName: 'سیر خشک'
    }
  }
]
</script>