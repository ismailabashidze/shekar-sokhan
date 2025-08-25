<script setup lang="ts">
import type { ServiceArea } from './types'

definePageMeta({
  title: 'مدیریت منطقه',
  icon: 'mdi:map-marker-radius',
  layout: 'distributor'
})

useHead({
  title: 'مدیریت منطقه - با هم',
  meta: [
    { name: 'description', content: 'مدیریت منطقه خدمات‌رسانی توزیع‌کننده در پلتفرم با هم' }
  ],
 htmlAttrs: { dir: 'rtl' } 

})

// Mock data for service areas
const serviceAreas = ref<ServiceArea[]>([
  {
    id: 'AREA-001',
    name: 'منطقه شمالی تهران',
    capacity: 2500,
    polygonCoordinates: [
      [35.7242, 51.3681],
      [35.7242, 51.4824],
      [35.8055, 51.4824],
      [35.8055, 51.3681]
    ]
  },
  {
    id: 'AREA-002',
    name: 'منطقه شرقی تهران',
    capacity: 1800,
    polygonCoordinates: [
      [35.6597, 51.4824],
      [35.6597, 51.5824],
      [35.7597, 51.5824],
      [35.7597, 51.4824]
    ]
  }
])

const serviceArea = ref({
  name: '',
  capacity: 2000,
  polygonCoordinates: [] as [number, number][]
})

const saveServiceArea = () => {
  if (serviceArea.value.name && serviceArea.value.capacity) {
    // In a real app, we would save to the backend
    const toaster = useToaster()
    toaster.show({
      title: 'محدوده ذخیره شد',
      message: `محدوده "${serviceArea.value.name}" با ظرفیت ${serviceArea.value.capacity} کیلوگرم ذخیره شد`,
      color: 'success',
      icon: 'ph:check-circle',
      closable: true,
    })
    serviceArea.value.name = ''
    serviceArea.value.capacity = 2000
  } else {
    const toaster = useToaster()
    toaster.show({
      title: 'خطا',
      message: 'لطفاً نام منطقه و ظرفیت را وارد کنید',
      color: 'danger',
      icon: 'ph:x-circle',
      closable: true,
    })
  }
}

const resetMap = () => {
  serviceArea.value.polygonCoordinates = []
  const toaster = useToaster()
  toaster.show({
    title: 'نقشه بازنشانی شد',
    message: 'نقشه با موفقیت بازنشانی شد',
    color: 'info',
    icon: 'ph:arrow-counter-clockwise',
    closable: true,
  })
}

const editArea = (id: string) => {
  const area = serviceAreas.value.find(a => a.id === id)
  if (area) {
    serviceArea.value = { ...area }
    const toaster = useToaster()
    toaster.show({
      title: 'ویرایش منطقه',
      message: `در حال ویرایش منطقه "${area.name}"`,
      color: 'info',
      icon: 'ph:pencil',
      closable: true,
    })
  }
}

const deleteArea = (id: string) => {
  if (confirm('آیا از حذف این منطقه اطمینان دارید؟')) {
    serviceAreas.value = serviceAreas.value.filter(a => a.id !== id)
    const toaster = useToaster()
    toaster.show({
      title: 'منطقه حذف شد',
      message: 'منطقه با موفقیت حذف شد',
      color: 'info',
      icon: 'ph:trash',
      closable: true,
    })
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
        <span class="flex items-center">
          <Icon name="ph:map-pin-duotone" class="size-8 ml-3 text-primary-500" />
          مدیریت منطقه
        </span>
      </BaseHeading>
      <BaseParagraph size="md" class="text-muted-600 dark:text-muted-400 mt-2">
        تعریف و مدیریت مناطق خدمات‌رسانی خود را انجام دهید
      </BaseParagraph>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Service Area Form -->
      <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
        <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white flex items-center">
          <Icon name="ph:plus-circle-duotone" class="size-6 ml-2 text-primary-500" />
          تعریف منطقه جدید
        </BaseHeading>
        
        <div class="space-y-6">
          <BaseInput 
            v-model="serviceArea.name" 
            label="نام منطقه"
            placeholder="مثال: منطقه شمالی تهران"
            required
          />
          
          <BaseInput 
            v-model="serviceArea.capacity" 
            label="ظرفیت حمل (کیلوگرم)"
            type="number"
            placeholder="مثال: 2500"
            required
          />
          
          <div>
            <BaseHeading tag="h3" size="md" weight="semibold" class="mb-3 text-muted-800 dark:text-white">
              تعیین محدوده روی نقشه
            </BaseHeading>
            <div class="h-64 bg-gradient-to-br from-primary-500/10 to-success-500/10 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700 flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 bg-grid-pattern opacity-20"></div>
              <div class="text-center relative z-10">
                <Icon name="ph:map-pin-duotone" class="size-12 text-primary-500 mx-auto mb-3" />
                <BaseHeading tag="h4" size="md" weight="semibold" class="text-primary-700 dark:text-primary-300 mb-2">
                  نقشه تعاملی
                </BaseHeading>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400 max-w-xs">
                  برای تعریف محدوده خدمات، نقاط را روی نقشه انتخاب کنید
                </BaseParagraph>
              </div>
            </div>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-3">
              <Icon name="ph:info-duotone" class="size-4 ml-1 inline" />
              برای رسم محدوده، نقاط را روی نقشه انتخاب کنید
            </BaseParagraph>
          </div>
          
          <div class="flex gap-3 pt-2">
            <BaseButton 
              @click="resetMap" 
              variant="outline" 
              color="secondary"
              class="flex-1"
            >
              <Icon name="ph:arrow-counter-clockwise-duotone" class="size-5 ml-2" />
              بازنشانی
            </BaseButton>
            <BaseButton 
              @click="saveServiceArea" 
              variant="solid" 
              color="primary"
              class="flex-1"
            >
              <Icon name="ph:floppy-disk-duotone" class="size-5 ml-2" />
              ذخیره محدوده
            </BaseButton>
          </div>
        </div>
      </BaseCard>
      
      <!-- Service Areas List -->
      <div class="space-y-8">
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <div class="flex items-center justify-between mb-6">
            <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white flex items-center">
              <Icon name="ph:map-pin-line-duotone" class="size-6 ml-2 text-primary-500" />
              مناطق تعریف شده
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
              {{ serviceAreas.length }} منطقه
            </BaseParagraph>
          </div>
          
          <div v-if="serviceAreas.length === 0" class="text-center py-12">
            <Icon name="ph:map-trifold-duotone" class="size-16 text-muted-400 mx-auto mb-4" />
            <BaseHeading tag="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-2">
              هیچ منطقه‌ای تعریف نشده است
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
              برای شروع، یک منطقه جدید تعریف کنید
            </BaseParagraph>
          </div>
          
          <div v-else class="space-y-4">
            <BaseCard 
              v-for="area in serviceAreas" 
              :key="area.id" 
              rounded="lg"
              class="dark:!bg-muted-800 p-5 border border-muted-200 dark:border-muted-700 hover:shadow-md transition-all"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                  <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-10 items-center justify-center ml-3">
                    <Icon name="ph:map-pin-duotone" class="text-primary-500 size-5" />
                  </div>
                  <BaseHeading tag="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white">
                    {{ area.name }}
                  </BaseHeading>
                </div>
                <div class="flex gap-2">
                  <BaseButton 
                    @click="editArea(area.id)" 
                    variant="outline" 
                    color="primary" 
                    size="sm"
                  >
                    <Icon name="ph:pencil-simple-duotone" class="size-4 ml-1" />
                    ویرایش
                  </BaseButton>
                  <BaseButton 
                    @click="deleteArea(area.id)" 
                    variant="outline" 
                    color="danger" 
                    size="sm"
                  >
                    <Icon name="ph:trash-duotone" class="size-4 ml-1" />
                    حذف
                  </BaseButton>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center justify-between p-3 bg-muted-100 dark:bg-muted-800 rounded-lg">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    ظرفیت
                  </BaseParagraph>
                  <BaseHeading tag="h4" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                    {{ new Intl.NumberFormat('fa-IR').format(area.capacity) }} کیلوگرم
                  </BaseHeading>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-muted-100 dark:bg-muted-800 rounded-lg">
                  <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                    نقاط
                  </BaseParagraph>
                  <BaseHeading tag="h4" size="sm" weight="semibold" class="text-muted-800 dark:text-white">
                    {{ area.polygonCoordinates.length }} رأس
                  </BaseHeading>
                </div>
              </div>
            </BaseCard>
          </div>
        </BaseCard>
        
        <!-- Statistics Card -->
        <BaseCard rounded="lg" class="dark:!bg-muted-900 p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white flex items-center">
            <Icon name="ph:chart-bar-duotone" class="size-6 ml-2 text-primary-500" />
            آمار کلی
          </BaseHeading>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center justify-between p-4 bg-primary-500/10 rounded-lg">
              <div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                  کل مناطق
                </BaseParagraph>
                <BaseHeading tag="h3" size="xl" weight="bold" class="text-primary-600 dark:text-primary-400">
                  {{ serviceAreas.length }}
                </BaseHeading>
              </div>
              <Icon name="ph:map-pin-duotone" class="size-8 text-primary-500" />
            </div>
            
            <div class="flex items-center justify-between p-4 bg-success-500/10 rounded-lg">
              <div>
                <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-400">
                  ظرفیت کل
                </BaseParagraph>
                <BaseHeading tag="h3" size="xl" weight="bold" class="text-success-600 dark:text-success-400">
                  {{ new Intl.NumberFormat('fa-IR').format(serviceAreas.reduce((sum, area) => sum + area.capacity, 0)) }}
                </BaseHeading>
              </div>
              <Icon name="ph:package-duotone" class="size-8 text-success-500" />
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>