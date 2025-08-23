<script setup lang="ts">
definePageMeta({
  title: 'روش‌های پرداخت',
  layout: 'default',
})

const paymentMethods = [
  {
    id: 1,
    type: 'credit-card',
    number: '**** **** **** 1234',
    name: 'زهرا محمدی',
    expiry: '1403/12',
    isDefault: true,
  },
  {
    id: 2,
    type: 'credit-card',
    number: '**** **** **** 5678',
    name: 'زهرا محمدی',
    expiry: '1404/05',
    isDefault: false,
  },
]

const addPaymentMethod = () => {
  // Mock function for adding payment method
  alert('صفحه افزودن روش پرداخت نمایش داده می‌شود')
}
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="semibold"
        class="text-muted-800 dark:text-white"
      >
        <span>روش‌های پرداخت</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>مدیریت روش‌های پرداخت ثبت‌شده</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Payment Methods List -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              روش‌های پرداخت ثبت‌شده
            </BaseHeading>
            <BaseButton color="primary" @click="addPaymentMethod">
              <Icon name="ph:plus" class="mr-2 size-5" />
              <span>افزودن روش پرداخت</span>
            </BaseButton>
          </div>

          <div class="space-y-4">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="dark:border-muted-700 border border-muted-200 rounded-xl p-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <Icon 
                    :name="method.type === 'credit-card' ? 'ph:credit-card' : 'ph:bank'" 
                    class="text-muted-500 size-8" 
                  />
                  <div>
                    <BaseHeading
                      as="h3"
                      size="sm"
                      weight="medium"
                      class="text-muted-800 dark:text-white"
                    >
                      {{ method.number }}
                    </BaseHeading>
                    <div class="flex items-center gap-3 text-xs">
                      <BaseParagraph class="text-muted-500">
                        {{ method.name }}
                      </BaseParagraph>
                      <span class="text-muted-300">•</span>
                      <BaseParagraph class="text-muted-500">
                        انقضا: {{ method.expiry }}
                      </BaseParagraph>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <BaseButton
                    v-if="!method.isDefault"
                    size="sm"
                    color="muted"
                    variant="outline"
                  >
                    <span>تنظیم به‌عنوان پیش‌فرض</span>
                  </BaseButton>
                  <BaseTag
                    v-if="method.isDefault"
                    color="success"
                    variant="pastel"
                  >
                    پیش‌فرض
                  </BaseTag>
                  <BaseButton size="sm" color="danger" variant="outline">
                    <Icon name="ph:trash" class="size-4" />
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Security Notice -->
        <BaseCard class="p-6">
          <div class="mb-4 flex items-center gap-3">
            <BaseIconBox
              color="success"
              size="md"
              rounded="lg"
            >
              <Icon name="ph:shield-check" class="size-6" />
            </BaseIconBox>
            <BaseHeading
              as="h2"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              امنیت پرداخت
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-500">
            اطلاعات کارت شما به‌صورت رمزگذاری‌شده ذخیره می‌شود و هیچ‌گاه با افراد ثالث به اشتراک گذاشته نمی‌شود.
          </BaseParagraph>
        </BaseCard>

        <!-- Support -->
        <BaseCard class="p-6">
          <div class="mb-4 flex items-center gap-3">
            <BaseIconBox
              color="info"
              size="md"
              rounded="lg"
            >
              <Icon name="ph:headset" class="size-6" />
            </BaseIconBox>
            <BaseHeading
              as="h2"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              پشتیبانی
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-500 mb-4">
            در صورت بروز هرگونه مشکل در پرداخت با ما در ارتباط باشید.
          </BaseParagraph>
          <BaseButton color="info" variant="solid" class="w-full">
            <Icon name="ph:chat-circle" class="mr-2 size-5" />
            <span>تماس با پشتیبانی</span>
          </BaseButton>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
