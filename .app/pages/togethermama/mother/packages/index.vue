<script setup lang="ts">
definePageMeta({
  title: 'بسته‌های ویژه - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const packages = ref([
  {
    id: 1,
    name: 'بسته رشد کودک',
    description: 'برنامه جامع برای رشد سالم کودک',
    price: '1,200,000',
    sessions: 6,
    duration: '۲ ماه',
    popular: true,
    color: 'primary',
    features: [
      '۶ جلسه مشاوره تخصصی',
      'برنامه رشد ماهانه',
      'تحلیل رفتار کودک',
      'مشاوره ۲۴ ساعته',
      'دسترسی به منابع آموزشی',
    ],
  },
  {
    id: 2,
    name: 'بسته آموزش خ Dormitory',
    description: 'آموزش مهارت‌های اجتماعی و آموزشی کودک',
    price: '800,000',
    sessions: 4,
    duration: '۱ ماه',
    popular: false,
    color: 'success',
    features: [
      '۴ جلسه مشاوره تخصصی',
      'برنامه آموزش اجتماعی',
      'تحلیل یادگیری کودک',
      'مشاوره هفتگی',
      'دسترسی به منابع آموزشی',
    ],
  },
  {
    id: 3,
    name: 'بسته رفتاری',
    description: 'حل مشکلات رفتاری کودک',
    price: '1,500,000',
    sessions: 8,
    duration: '۳ ماه',
    popular: false,
    color: 'info',
    features: [
      '۸ جلسه مشاوره تخصصی',
      'برنامه رفتاری شخصی‌سازی شده',
      'تحلیل عمیق رفتار کودک',
      'مشاوره ۲۴ ساعته',
      'دسترسی به منابع آموزشی',
      'پشتیبانی والدین',
    ],
  },
])

const purchasePackage = (packId: number) => {
  // Mock purchase functionality
  alert(`بسته ${packId} انتخاب شد برای خرید`)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-muted-800 dark:text-white"
      >
        بسته‌های ویژه
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        بسته‌های تخصصی برای رشد و توسعه کودک شما
      </BaseParagraph>
    </div>

    <!-- Packages -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div
        v-for="pack in packages"
        :key="pack.id"
        class="group relative transition-all duration-300 hover:-translate-y-2"
      >
        <!-- Popular badge -->
        <div
          v-if="pack.popular"
          class="from-primary-500 to-primary-600 absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r px-6 py-2 text-sm font-bold text-white shadow-lg"
        >
          محبوب‌ترین انتخاب
        </div>

        <BaseCard
          class="h-full p-8"
          :class="{
            'border-primary-500 ring-primary-500 ring-2': pack.popular,
          }"
        >
          <!-- Package header -->
          <div class="mb-8 text-center">
            <BaseHeading
              as="h3"
              size="2xl"
              weight="bold"
              class="mb-2"
              :class="{
                'text-primary-700 dark:text-primary-300': pack.popular,
                'text-muted-700 dark:text-muted-200': !pack.popular
              }"
            >
              {{ pack.name }}
            </BaseHeading>
            <BaseParagraph size="sm" class="text-muted-500 mb-6">
              {{ pack.description }}
            </BaseParagraph>

            <!-- Price -->
            <div class="mb-4">
              <div class="mb-2 flex items-center justify-center gap-2">
                <span
                  class="text-4xl font-bold"
                  :class="{
                    'text-primary-600 dark:text-primary-400': pack.popular,
                    'text-muted-700 dark:text-muted-200': !pack.popular
                  }"
                >
                  {{ pack.price.toLocaleString() }}
                </span>
                <span class="text-muted-500 text-lg">تومان</span>
              </div>
              <BaseParagraph size="sm" class="text-muted-500">
                {{ pack.sessions }} جلسه در {{ pack.duration }}
              </BaseParagraph>
            </div>
          </div>

          <!-- Features -->
          <div class="mb-8 space-y-4">
            <div
              v-for="feature in pack.features"
              :key="feature"
              class="flex items-start gap-3 text-right"
            >
              <Icon
                name="ph:check-circle"
                class="text-success-500 mt-0.5 size-5 shrink-0"
              />
              <span class="text-muted-600 dark:text-muted-300 text-sm">{{ feature }}</span>
            </div>
          </div>

          <!-- Purchase button -->
          <BaseButton
            :color="pack.popular ? 'primary' : 'muted'"
            :variant="pack.popular ? 'solid' : 'outline'"
            size="lg"
            class="w-full transition-all duration-300"
            @click="purchasePackage(pack.id)"
          >
            خرید بسته
          </BaseButton>
        </BaseCard>
      </div>
    </div>

    <!-- Benefits -->
    <div class="mt-12">
      <BaseHeading as="h2" size="xl" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
        مزایای بسته‌های ویژه
      </BaseHeading>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <BaseCard class="p-6 text-center">
          <Icon name="ph:star-duotone" class="text-primary-500 mx-auto mb-4 size-10" />
          <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-2">
            تخصصی و شخصی‌سازی شده
          </BaseHeading>
          <BaseParagraph class="text-muted-500">
            برنامه‌هایی که بر اساس نیاز خاص کودک شما طراحی شده‌اند
          </BaseParagraph>
        </BaseCard>

        <BaseCard class="p-6 text-center">
          <Icon name="ph:currency-circle-dollar-duotone" class="text-primary-500 mx-auto mb-4 size-10" />
          <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-2">
            صرفه‌جویی در هزینه
          </BaseHeading>
          <BaseParagraph class="text-muted-500">
            خرید بسته‌های ویژه تا ۳۰٪ نسبت به جلسات تکی ارزان‌تر است
          </BaseParagraph>
        </BaseCard>

        <BaseCard class="p-6 text-center">
          <Icon name="ph:chart-line-up-duotone" class="text-primary-500 mx-auto mb-4 size-10" />
          <BaseHeading as="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-2">
            پیشرفت سریع‌تر
          </BaseHeading>
          <BaseParagraph class="text-muted-500">
            برنامه‌های متمرکز به شما کمک می‌کنند سریع‌تر به اهدافتان برسید
          </BaseParagraph>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
