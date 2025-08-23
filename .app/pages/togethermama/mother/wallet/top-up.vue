<script setup lang="ts">
definePageMeta({
  title: 'شارژ کیف پول',
  layout: 'default',
})

const amounts = [
  { value: 100000, label: '100,000 تومان' },
  { value: 250000, label: '250,000 تومان' },
  { value: 500000, label: '500,000 تومان' },
  { value: 1000000, label: '1,000,000 تومان' },
]

const selectedAmount = ref(500000)
const customAmount = ref('')

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

const selectedPaymentMethod = ref(1)

const topUpWallet = () => {
  // Mock function for topping up wallet
  alert(`کیف پول شما به مبلغ ${selectedAmount.value.toLocaleString()} تومان شارژ خواهد شد`)
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
        <span>شارژ کیف پول</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>مبلغ مورد نظر خود را برای شارژ کیف پول انتخاب کنید</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Top-up Form -->
      <div class="lg:col-span-2">
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              انتخاب مبلغ
            </BaseHeading>
          </div>

          <!-- Predefined Amounts -->
          <div class="mb-8">
            <BaseParagraph size="sm" class="text-muted-500 mb-4">
              مبالغ پیشنهادی:
            </BaseParagraph>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <BaseCard
                v-for="amount in amounts"
                :key="amount.value"
                :class="[
                  'cursor-pointer p-4 text-center transition-all',
                  selectedAmount === amount.value
                    ? 'border-primary-500 bg-primary-500/10 dark:border-primary-500 dark:bg-primary-500/20'
                    : 'border-muted-200 hover:border-primary-300 dark:border-muted-700 dark:hover:border-primary-500/50'
                ]"
                @click="selectedAmount = amount.value"
              >
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="semibold"
                  :class="[
                    'transition-colors',
                    selectedAmount === amount.value
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-muted-800 dark:text-white'
                  ]"
                >
                  {{ amount.label }}
                </BaseHeading>
              </BaseCard>
            </div>
          </div>

          <!-- Custom Amount -->
          <div class="mb-8">
            <BaseParagraph size="sm" class="text-muted-500 mb-4">
              مبلغ دلخواه:
            </BaseParagraph>
            <div class="flex items-center gap-3">
              <BaseInput
                v-model="customAmount"
                type="number"
                placeholder="مبلغ به تومان"
                class="flex-1"
              />
              <BaseButton
                color="primary"
                :disabled="!customAmount || customAmount === ''"
                @click="selectedAmount = parseInt(customAmount)"
              >
                <span>انتخاب</span>
              </BaseButton>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="mb-8">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white mb-6"
            >
              روش پرداخت
            </BaseHeading>
            
            <div class="space-y-4">
              <div
                v-for="method in paymentMethods"
                :key="method.id"
                :class="[
                  'dark:border-muted-700 cursor-pointer border rounded-xl p-4 transition-all',
                  selectedPaymentMethod === method.id
                    ? 'border-primary-500 bg-primary-500/10 dark:border-primary-500 dark:bg-primary-500/20'
                    : 'border-muted-200 hover:border-primary-300 dark:border-muted-700 dark:hover:border-primary-500/50'
                ]"
                @click="selectedPaymentMethod = method.id"
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
                  <div v-if="method.isDefault" class="text-primary-500">
                    <Icon name="ph:check-circle-fill" class="size-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirm Button -->
          <div class="flex justify-end">
            <BaseButton
              color="primary"
              size="lg"
              :disabled="!selectedAmount"
              @click="topUpWallet"
            >
              <Icon name="ph:wallet" class="mr-2 size-5" />
              <span>پرداخت {{ selectedAmount.toLocaleString() }} تومان</span>
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Summary -->
        <BaseCard class="p-6">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              خلاصه پرداخت
            </BaseHeading>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">مبلغ شارژ:</BaseParagraph>
              <BaseHeading
                as="h3"
                size="sm"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                {{ selectedAmount.toLocaleString() }} تومان
              </BaseHeading>
            </div>
            
            <div class="flex items-center justify-between">
              <BaseParagraph size="sm" class="text-muted-500">مالیات:</BaseParagraph>
              <BaseHeading
                as="h3"
                size="sm"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                0 تومان
              </BaseHeading>
            </div>
            
            <div class="mt-4 flex items-center justify-between border-t border-muted-200 pt-4 dark:border-muted-700">
              <BaseHeading
                as="h3"
                size="md"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                مجموع:
              </BaseHeading>
              <BaseHeading
                as="h3"
                size="md"
                weight="bold"
                class="text-primary-600 dark:text-primary-400"
              >
                {{ selectedAmount.toLocaleString() }} تومان
              </BaseHeading>
            </div>
          </div>
        </BaseCard>

        <!-- Security Notice -->
        <BaseCard class="p-6">
          <div class="mb-4 flex items-center gap-3">
            <BaseIconBox
              color="success"
              size="md"
              rounded="lg"
            >
              <Icon name="ph:lock" class="size-6" />
            </BaseIconBox>
            <BaseHeading
              as="h2"
              size="md"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              پرداخت ایمن
            </BaseHeading>
          </div>
          <BaseParagraph size="sm" class="text-muted-500">
            تمام تراکنش‌ها به‌صورت رمزگذاری‌شده انجام می‌شوند و اطلاعات مالی شما به‌هیچ‌وجه با افراد ثالث به اشتراک گذاشته نمی‌شود.
          </BaseParagraph>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
