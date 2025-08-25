<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات سیستم - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'تنظیمات سیستم - با هم',
  meta: [
    { name: 'description', content: 'تنظیمات سیستم پلتفرم با هم' }
  ]
})

const systemSettings = reactive({
  commissionRate: 5,
  minOrderAmount: 100000,
  maxOrderAmount: 10000000,
  deliveryRadius: 50,
  supportEmail: 'support@baham.ir',
  supportPhone: '+98 21 1234 5678'
})

const saving = ref(false)

const saveSettings = async () => {
  saving.value = true
  try {
    // In a real app, this would be an API call
    // await $fetch('/api/settings', { method: 'PUT', body: systemSettings })
    alert('تنظیمات با موفقیت ذخیره شد')
  } catch (error) {
    alert('خطا در ذخیره تنظیمات')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          تنظیمات سیستم
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          پیکربندی تنظیمات کلی پلتفرم
        </BaseParagraph>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton 
          @click="saveSettings" 
          :loading="saving"
          color="primary"
        >
          <Icon name="ph:floppy-disk-duotone" class="size-5 mr-2" />
          {{ saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
        </BaseButton>
      </div>
    </div>
    
    <div class="space-y-6">
      <!-- Commission Settings -->
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            <Icon name="ph:percent-duotone" class="size-6 mr-2 text-primary-500" />
            تنظیمات کارمزد
          </BaseHeading>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TairoFormGroup label="نرخ کارمزد (%)">
              <BaseInput
                v-model.number="systemSettings.commissionRate"
                type="number"
                min="0"
                max="100"
                placeholder="نرخ کارمزد را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
          </div>
        </div>
      </BaseCard>
      
      <!-- Order Settings -->
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            <Icon name="ph:shopping-cart-duotone" class="size-6 mr-2 text-primary-500" />
            تنظیمات سفارش
          </BaseHeading>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TairoFormGroup label="حداقل مبلغ سفارش (ریال)">
              <BaseInput
                v-model.number="systemSettings.minOrderAmount"
                type="number"
                placeholder="حداقل مبلغ سفارش را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
            
            <TairoFormGroup label="حداکثر مبلغ سفارش (ریال)">
              <BaseInput
                v-model.number="systemSettings.maxOrderAmount"
                type="number"
                placeholder="حداکثر مبلغ سفارش را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
          </div>
        </div>
      </BaseCard>
      
      <!-- Delivery Settings -->
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            <Icon name="ph:truck-duotone" class="size-6 mr-2 text-primary-500" />
            تنظیمات تحویل
          </BaseHeading>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TairoFormGroup label="شعاع تحویل (کیلومتر)">
              <BaseInput
                v-model.number="systemSettings.deliveryRadius"
                type="number"
                placeholder="شعاع تحویل را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
          </div>
        </div>
      </BaseCard>
      
      <!-- Contact Settings -->
      <BaseCard rounded="lg" class="dark:!bg-muted-900">
        <div class="p-6">
          <BaseHeading tag="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white mb-6">
            <Icon name="ph:phone-duotone" class="size-6 mr-2 text-primary-500" />
            اطلاعات تماس
          </BaseHeading>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TairoFormGroup label="ایمیل پشتیبانی">
              <BaseInput
                v-model="systemSettings.supportEmail"
                type="email"
                placeholder="آدرس ایمیل پشتیبانی را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
            
            <TairoFormGroup label="تلفن پشتیبانی">
              <BaseInput
                v-model="systemSettings.supportPhone"
                type="text"
                dir="ltr"
                placeholder="شماره تلفن پشتیبانی را وارد کنید"
                rounded="sm"
                :classes="{
                  wrapper: 'w-full'
                }"
              />
            </TairoFormGroup>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>