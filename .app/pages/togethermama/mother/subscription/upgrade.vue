<script setup lang="ts">
definePageMeta({
  title: 'ارتقاء بسته',
  layout: 'default',
})

const currentPlan = {
  id: 'standard',
  name: 'بسته استاندارد',
  price: '899,000',
  endDate: '1402/05/15',
}

const upgradePlans = [
  {
    id: 'premium',
    name: 'بسته حرفه‌ای',
    price: '1,399,000',
    duration: 'ماهانه',
    savings: '10%',
    features: [
      'جلسات نامحدود مشاوره',
      'مشاوره با متخصصان حوزه کودک',
      'برنامه‌های تخصصی (رفتاری، آموزشی)',
      'تحلیل عمیق رشد کودک',
      'پشتیبانی ۲۴ ساعته',
    ],
    priceDifference: '500,000',
  },
]

const upgradePlan = () => {
  // Mock function for upgrading plan
  alert('درخواست ارتقاء بسته ثبت شد')
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
        <span>ارتقاء بسته</span>
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        <span>ارتقاء بسته فعلی خود به بسته‌های پیشرفته‌تر</span>
      </BaseParagraph>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Current Plan -->
      <div class="lg:col-span-1">
        <BaseCard class="p-6 h-full">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              بسته فعلی شما
            </BaseHeading>
          </div>

          <div class="mb-6 rounded-xl border border-primary-200 bg-primary-50/50 p-6 dark:border-primary-500/30 dark:bg-primary-500/10">
            <div class="mb-4 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                class="text-primary-700 dark:text-primary-300"
              >
                {{ currentPlan.name }}
              </BaseHeading>
              <BaseTag
                color="primary"
                variant="solid"
                rounded="lg"
              >
                فعلی
              </BaseTag>
            </div>
            
            <div class="mb-4">
              <BaseParagraph size="sm" class="text-muted-500 mb-1">
                مبلغ پرداختی
              </BaseParagraph>
              <BaseHeading
                as="h4"
                size="lg"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                {{ currentPlan.price }} تومان
              </BaseHeading>
            </div>
            
            <div>
              <BaseParagraph size="sm" class="text-muted-500 mb-1">
                تاریخ پایان
              </BaseParagraph>
              <BaseHeading
                as="h4"
                size="lg"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                {{ currentPlan.endDate }}
              </BaseHeading>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Upgrade Arrow -->
      <div class="lg:col-span-1 flex items-center justify-center">
        <div class="hidden lg:flex items-center justify-center">
          <Icon name="ph:arrow-right" class="text-muted-400 size-12" />
        </div>
        <div class="lg:hidden flex items-center justify-center w-full">
          <Icon name="ph:arrow-down" class="text-muted-400 size-12" />
        </div>
      </div>

      <!-- Upgrade Plan -->
      <div class="lg:col-span-1">
        <BaseCard class="p-6 h-full">
          <div class="mb-6">
            <BaseHeading
              as="h2"
              size="lg"
              weight="semibold"
              class="text-muted-800 dark:text-white"
            >
              بسته پیشنهادی
            </BaseHeading>
          </div>

          <div class="mb-6 rounded-xl border border-success-200 bg-success-50/50 p-6 dark:border-success-500/30 dark:bg-success-500/10">
            <div class="mb-4 flex items-center justify-between">
              <BaseHeading
                as="h3"
                size="xl"
                weight="bold"
                class="text-success-700 dark:text-success-300"
              >
                بسته حرفه‌ای
              </BaseHeading>
              <BaseTag
                color="success"
                variant="solid"
                rounded="lg"
              >
                پیشنهاد ویژه
              </BaseTag>
            </div>
            
            <div class="mb-4">
              <BaseParagraph size="sm" class="text-muted-500 mb-1">
                مبلغ پرداختی
              </BaseParagraph>
              <BaseHeading
                as="h4"
                size="lg"
                weight="semibold"
                class="text-muted-800 dark:text-white"
              >
                1,399,000 تومان
              </BaseHeading>
            </div>
            
            <div class="mb-4">
              <BaseTag color="success" variant="pastel">
                صرفه‌جویی 10%
              </BaseTag>
            </div>
            
            <div class="mb-6">
              <BaseParagraph size="sm" class="text-muted-500 mb-2">
                امکانات بسته:
              </BaseParagraph>
              <ul class="space-y-2">
                <li
                  v-for="feature in upgradePlans[0].features"
                  :key="feature"
                  class="flex items-start gap-2"
                >
                  <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5" />
                  <BaseParagraph size="sm" class="text-muted-700 dark:text-muted-300">
                    {{ feature }}
                  </BaseParagraph>
                </li>
              </ul>
            </div>
            
            <div class="flex gap-3">
              <BaseButton color="success" variant="solid" @click="upgradePlan">
                <Icon name="ph:arrow-up" class="mr-2 size-5" />
                <span>ارتقاء بسته - {{ upgradePlans[0].priceDifference }} تومان</span>
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Benefits of Upgrading -->
    <BaseCard class="p-6 mt-6">
      <div class="mb-6">
        <BaseHeading
          as="h2"
          size="lg"
          weight="semibold"
          class="text-muted-800 dark:text-white"
        >
          مزایای ارتقاء بسته
        </BaseHeading>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="text-center">
          <BaseIconBox
            color="primary"
            size="xl"
            rounded="xl"
            class="mx-auto mb-4"
          >
            <Icon name="ph:users-three" class="size-8" />
          </BaseIconBox>
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            class="text-muted-800 dark:text-white mb-2"
          >
            مشاوره تخصصی
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500">
            دسترسی به مشاوران تخصصی در حوزه رشد کودک و مشکلات خانوادگی
          </BaseParagraph>
        </div>
        
        <div class="text-center">
          <BaseIconBox
            color="success"
            size="xl"
            rounded="xl"
            class="mx-auto mb-4"
          >
            <Icon name="ph:infinity" class="size-8" />
          </BaseIconBox>
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            class="text-muted-800 dark:text-white mb-2"
          >
            جلسات نامحدود
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500">
            دسترسی نامحدود به جلسات مشاوره و پشتیبانی ۲۴ ساعته
          </BaseParagraph>
        </div>
        
        <div class="text-center">
          <BaseIconBox
            color="info"
            size="xl"
            rounded="xl"
            class="mx-auto mb-4"
          >
            <Icon name="ph:chart-line-up" class="size-8" />
          </BaseIconBox>
          <BaseHeading
            as="h3"
            size="md"
            weight="semibold"
            class="text-muted-800 dark:text-white mb-2"
          >
            تحلیل عمیق
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-500">
            تحلیل جامع رشد کودک و برنامه‌های شخصی‌سازی شده
          </BaseParagraph>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
