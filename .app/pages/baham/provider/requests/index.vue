<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LoadRequest } from '../../buyer/types'

definePageMeta({
  title: 'مدیریت درخواست‌ها',
  layout: 'sidebar',
})

useHead({
  title: 'مدیریت درخواست‌ها | با هم',
  htmlAttrs: { dir: 'rtl' },
})

// Mock data for requests
const requests = ref<LoadRequest[]>([])
const filteredRequests = ref<LoadRequest[]>([])
const currentFilter = ref('all')

onMounted(() => {
  // Mock data initialization
  requests.value = [
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
    },
    {
      id: 'r5',
      orderId: 'o5',
      buyerName: 'حسین رمضانی',
      quantityKg: 60,
      requestedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      status: 'pending'
    },
    {
      id: 'r6',
      orderId: 'o6',
      buyerName: 'سارا کریمی',
      quantityKg: 35,
      requestedAt: new Date(new Date().setDate(new Date().getDate() - 7)),
      status: 'approved'
    },
    {
      id: 'r7',
      orderId: 'o7',
      buyerName: 'محمد احمدی',
      quantityKg: 45,
      requestedAt: new Date(new Date().setDate(new Date().getDate() - 10)),
      status: 'rejected'
    }
  ]
  
  filteredRequests.value = [...requests.value]
})

const filterRequests = (filter: string) => {
  currentFilter.value = filter
  if (filter === 'all') {
    filteredRequests.value = [...requests.value]
  } else {
    filteredRequests.value = requests.value.filter(req => req.status === filter)
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
    <TairoContentWrapper>
      <template #left>
        <BaseHeading as="h1" size="xl" weight="medium">
          مدیریت درخواست‌ها
        </BaseHeading>
        <BaseText size="sm" class="text-muted-400 mt-1">
          مدیریت درخواست‌های خرید ثبت شده توسط خریداران
        </BaseText>
      </template>
      
      <!-- Filters -->
      <div class="mb-6 flex flex-wrap gap-2">
        <BaseButton
          @click="filterRequests('all')"
          :color="currentFilter === 'all' ? 'primary' : 'muted'"
          variant="solid"
          size="sm"
        >
          همه ({{ requests.length }})
        </BaseButton>
        <BaseButton
          @click="filterRequests('pending')"
          :color="currentFilter === 'pending' ? 'warning' : 'muted'"
          variant="solid"
          size="sm"
        >
          در انتظار ({{ requests.filter(r => r.status === 'pending').length }})
        </BaseButton>
        <BaseButton
          @click="filterRequests('approved')"
          :color="currentFilter === 'approved' ? 'success' : 'muted'"
          variant="solid"
          size="sm"
        >
          تأیید شده ({{ requests.filter(r => r.status === 'approved').length }})
        </BaseButton>
        <BaseButton
          @click="filterRequests('rejected')"
          :color="currentFilter === 'rejected' ? 'danger' : 'muted'"
          variant="solid"
          size="sm"
        >
          رد شده ({{ requests.filter(r => r.status === 'rejected').length }})
        </BaseButton>
      </div>
      
      <!-- Requests Table -->
      <BaseCard rounded="sm" class="p-6">
        <div class="w-full overflow-x-auto">
          <TairoTable rounded="sm">
            <template #header>
              <TairoTableHeading uppercase spaced>
                خریدار
              </TairoTableHeading>
              <TairoTableHeading uppercase spaced>
                شناسه سفارش
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
            
            <TairoTableRow v-for="request in filteredRequests" :key="request.id">
              <TairoTableCell spaced>
                <div class="font-medium">{{ request.buyerName }}</div>
              </TairoTableCell>
              <TairoTableCell spaced>
                <div class="text-sm font-mono">{{ request.orderId }}</div>
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
  </div>
</template>