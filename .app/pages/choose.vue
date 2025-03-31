<script setup lang="ts">
definePageMeta({
  title: 'انتخاب سرویس',
  layout: 'sidebar',
  preview: {
    title: 'انتخاب سرویس',
    description: 'استفاده از سرویس ها',
    categories: ['layouts'],
    src: '/img/logo.png',
    srcDark: '/img/logo.png',
    order: 84,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { generateAndSetCode } = useUser()
const { createReport } = useReport()
const toaster = useToaster()

await generateAndSetCode()
// await createReport()
const customRadio = ref('دانا، هوش مصنوعی فارسی')

const plans = [
  // {
  //   name: 'ترجمان',
  //   description: 'ترجمه زبانی از فارسی به انگلیسی و بالعکس',
  //   price: {
  //     monthly: 9,
  //     yearly: 99,
  //   },
  //   features: [
  //     'سرور اختصاصی',
  //     'امکان ترجمه فایل های بزرگ',
  //     'ذخیره سازی اختصاصی',
  //   ],
  //   benefits: ['یک سال بروز رسانی رایگان', 'یک سال پشتیبانی رایگان'],
  // },
  {
    name: 'دانا، هوش مصنوعی فارسی',
    description:
      'استفاده از مدل بومی و در دسترس برای توسعه هوش مصنوعی به زبان فارسی',
    price: {
      monthly: 19,
      yearly: 199,
    },
    features: ['سرور اختصاصی', 'بدون سانسور', 'ذخیره سازی اختصاصی'],
    benefits: [
      'یک سال بروز رسانی رایگان',
      'یک سال پشتیبانی رایگان',
      'امکان هاست سرویس برای شرکت ها',
    ],
  },
  {
    name: 'درمانا',
    description:
      'در محیطی ایمن، با کمک هوش مصنوعی، تکنیک های روان درمانی را تمرین کنید!',
    price: {
      monthly: 29,
      yearly: 299,
    },
    features: [
      'سوپرویژن',
      'رویکرد های مختلف درمان',
      'همراهی با هوش مصنوعی در درمان',
      'امکان جذب در بهترین کلینیک های ایران',
    ],
    benefits: [
      'یک سال بروز رسانی رایگان',
      'یک سال پشتیبانی رایگان',
      'امکان هاست سرویس برای شرکت ها',
    ],
  },
  {
    name: 'طنین آرامش',
    description:
      'طنین، اولین و تنها هوش مصنوعی با رویکرد مداخلات درمانا است که به مشاوران و مراجعان کمک می کند درمان اثر بخشی را تجربه نمایند.',
    price: {
      monthly: 10,
      yearly: 120,
    },
    features: ['به زودی', 'در حال تحقیق و توسعه'],
    benefits: ['به زودی'],
  },
  {
    name: 'مانا',
    description: 'مانی، مشاور بحران',
    price: {
      monthly: 49,
      yearly: 399,
    },
    features: ['به زودی', 'در حال تحقیق و توسعه'],
    benefits: ['به زودی'],
  },

  {
    name: 'تحلیل گر خبر',
    description:
      'تحلیل معنایی و محتوایی خبر با استفاده از تکنیک های هوش مصنوعی',
    price: {
      monthly: 10,
      yearly: 120,
    },
    features: ['به زودی', 'در حال تحقیق و توسعه'],
    benefits: ['به زودی'],
  },
  {
    name: 'خبره',
    description: 'خلاصه ساز، و نویسنده ی صورت جلسه ',
    price: {
      monthly: 10,
      yearly: 120,
    },
    features: ['به زودی', 'در حال تحقیق و توسعه'],
    benefits: ['به زودی'],
  },
]

const selectedPlan = computed(() => {
  return plans.find((plan) => plan.name === customRadio.value)
})

const planColor = computed(() => {
  switch (customRadio.value) {
    // case 'ترجمان':
    //   return 'text-success-500'
    case 'دانا، هوش مصنوعی فارسی':
      return 'text-yellow-400'
    case 'درمانا':
      return 'text-indigo-500'
    case 'طنین آرامش':
      return 'text-primary-500'
    case 'مانا':
      return 'text-orange-500'
    case 'تحلیل گر خبر':
      return 'text-green-500'
    case 'خبره':
      return 'text-blue-500'
  }
})

const chooseService = () => {
  // if (selectedPlan.value?.name === 'ترجمان') {
  //   navigateTo('/tarjoman')
  // } else
  if (selectedPlan.value?.name === 'دانا، هوش مصنوعی فارسی') {
    navigateTo('/dana')
  } else if (selectedPlan.value?.name === 'مانا') {
    navigateTo('/Mana/chat')
  } else if (selectedPlan.value?.name === 'خبره') {
    navigateTo('/Khebre')
  } else {
    toaster.show({
      title: 'خطا',
      message: 'سرویس در حال توسعه می باشد',
      color: 'warning',
      icon: 'lucide:alert-triangle',
      closable: true,
    })
  }
}
</script>

<template>
  <div class="mb-8 flex flex-col justify-between md:flex-row md:items-center">
    <div
      class="ltablet:max-w-full flex max-w-[425px] flex-col items-center gap-4 text-center md:flex-row md:text-left lg:max-w-full"
    >
      <BaseAvatar src="/img/logo.png" size="lg" />
      <div class="text-right">
        <BaseHeading
          as="h2"
          size="xl"
          weight="light"
          lead="tight"
          class="text-muted-800 dark:text-white"
        >
          <span>سرویس های هوش مصنوعی</span>
        </BaseHeading>
        <BaseParagraph>
          <span class="text-muted-500">
            با استفاده از این بخش از بین سرویس های موجود انتخاب نمایید.
          </span>
        </BaseParagraph>
      </div>
    </div>
    <div
      class="mt-4 flex items-center justify-center gap-2 md:mt-0 md:justify-start"
    >
      <BaseButton color="primary" @click="chooseService">
        <span>انتخاب</span>
      </BaseButton>
    </div>
  </div>
  <div
    class="dark:border-muted-800 mb-10 grid gap-4 border-b border-gray-200 pb-10 md:grid-cols-2 xl:gap-8"
  >
    <div class="grid grid-cols-2 gap-2 xl:gap-6">
      <!-- <BaseRadioHeadless
        v-model="customRadio"
        name="radio_custom"
        value="ترجمان"
      >
        <BaseCard
          shape="rounded"
          class="text-muted-400/50 peer-checked:!border-success-500 peer-checked:text-success-500 group relative p-6 text-center peer-checked:[&_.child]:!opacity-100"
        >
          <div
            class="child border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border bg-white opacity-0"
          >
            <Icon name="lucide:check" class="h-3 w-3 text-current" />
          </div>
          <TairoLogo class="mx-auto mb-2 h-9 w-9" />
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            ترجمان
          </BaseHeading>
          <BaseText size="xs" lead="tight" class="text-muted-400"
            >ترجمه متن فارسی به انگلیسی و بالعکس</BaseText
          >
        </BaseCard>
      </BaseRadioHeadless> -->
      <BaseRadioHeadless
        v-model="customRadio"
        name="radio_custom"
        value="دانا، هوش مصنوعی فارسی"
      >
        <BaseCard
          shape="rounded"
          class="text-muted-400/50 group relative p-6 text-center peer-checked:!border-yellow-400 peer-checked:text-yellow-400 peer-checked:[&_.child]:!opacity-100"
        >
          <div
            class="child border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border bg-white opacity-0"
          >
            <Icon name="lucide:check" class="h-3 w-3 text-current" />
          </div>
          <TairoLogo class="mx-auto mb-2 h-9 w-9" />
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            دانا، هوش مصنوعی فارسی
          </BaseHeading>
          <BaseText size="xs" lead="tight" class="text-muted-400"
            >با دانا، هوش مصنوعی اختصاصی صحبت کنید!</BaseText
          >
        </BaseCard>
      </BaseRadioHeadless>
      <BaseRadioHeadless
        v-model="customRadio"
        name="radio_custom"
        value="درمانا"
      >
        <BaseCard
          shape="rounded"
          class="text-muted-400/50 group relative p-6 text-center peer-checked:!border-indigo-500 peer-checked:text-indigo-500 peer-checked:[&_.child]:!opacity-100"
        >
          <div
            class="child border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border bg-white opacity-0"
          >
            <Icon name="lucide:check" class="h-3 w-3 text-current" />
          </div>
          <TairoLogo class="mx-auto mb-2 h-9 w-9" />
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            درمانا
          </BaseHeading>
          <BaseText size="xs" lead="tight" class="text-muted-400"
            >محیطی امن و ایمن برای تمرین روان درمانی</BaseText
          >
        </BaseCard>
      </BaseRadioHeadless>
      <BaseRadioHeadless
        v-model="customRadio"
        name="radio_custom"
        value="طنین آرامش"
      >
        <BaseCard
          shape="rounded"
          class="text-muted-400/50 peer-checked:!border-primary-500 peer-checked:text-primary-500 group relative p-6 text-center peer-checked:[&_.child]:!opacity-100"
        >
          <div
            class="child border-muted-200 dark:border-muted-700 dark:bg-muted-800 absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border bg-white opacity-0"
          >
            <Icon name="lucide:check" class="h-3 w-3 text-current" />
          </div>
          <TairoLogo class="mx-auto mb-2 h-9 w-9" />
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            طنین آرامش
          </BaseHeading>
          <BaseText size="xs" lead="tight" class="text-muted-400"
            >دستیار سلامت روان شما</BaseText
          >
        </BaseCard>
      </BaseRadioHeadless>
      <BaseRadioHeadless v-model="customRadio" name="radio_custom" value="مانا">
        <BaseCard
          shape="rounded"
          class="text-muted-400/50 peer-checked:!border-orange-500 peer-checked:text-orange-500 group relative p-6 text-center peer-checked:[&_.child]:!opacity-100"
        >
          <div
            class="child border-muted-200 dark:border-muted-700 dark:bg-orange-500 absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border bg-white opacity-0"
          >
            <Icon name="lucide:check" class="h-3 w-3 text-current" />
          </div>
          <TairoLogo class="mx-auto mb-2 h-9 w-9" />
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            مانا
          </BaseHeading>
          <BaseText size="xs" lead="tight" class="text-muted-400"
            >سیستم هوشمند مداخله پیش از اقدام برای خودکشی
          </BaseText>
        </BaseCard>
      </BaseRadioHeadless>
      <BaseRadioHeadless
        v-model="customRadio"
        name="radio_custom"
        value="تحلیل گر خبر"
      >
        <BaseCard
          shape="rounded"
          class="text-muted-400/50 peer-checked:!border-green-500 peer-checked:text-green-500 group relative p-6 text-center peer-checked:[&_.child]:!opacity-100"
        >
          <div
            class="child border-muted-200 dark:border-muted-700 dark:bg-green-500 absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border bg-white opacity-0"
          >
            <Icon name="lucide:check" class="h-3 w-3 text-current" />
          </div>
          <TairoLogo class="mx-auto mb-2 h-9 w-9" />
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            تحلیل گر خبر
          </BaseHeading>
          <BaseText size="xs" lead="tight" class="text-muted-400"
            >تحلیل معنایی و محتوایی خبر
          </BaseText>
        </BaseCard>
      </BaseRadioHeadless>
      <BaseRadioHeadless v-model="customRadio" name="radio_custom" value="خبره">
        <BaseCard
          shape="rounded"
          class="text-muted-400/50 peer-checked:!border-blue-500 peer-checked:text-blue-500 group relative p-6 text-center peer-checked:[&_.child]:!opacity-100"
        >
          <div
            class="child border-muted-200 dark:border-muted-700 dark:bg-blue-500 absolute end-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border bg-white opacity-0"
          >
            <Icon name="lucide:check" class="h-3 w-3 text-current" />
          </div>
          <TairoLogo class="mx-auto mb-2 h-9 w-9" />
          <BaseHeading
            as="h4"
            size="sm"
            weight="medium"
            class="text-muted-800 dark:text-white"
          >
            خبره
          </BaseHeading>
          <BaseText size="xs" lead="tight" class="text-muted-400"
            >خلاصه سازی و تهیه مستندات جلسات
          </BaseText>
        </BaseCard>
      </BaseRadioHeadless>
    </div>
    <div>
      <BaseCard shape="rounded" class="p-8">
        <div class="flex gap-12">
          <TairoLogo class="h-12 w-12 shrink-0" :class="planColor" />
          <div>
            <BaseText size="md" lead="tight" weight="semibold"
              >{{ selectedPlan?.price.monthly }} میلیون تومان
              <span class="text-muted-400 font-normal">/ در ماه</span></BaseText
            >
            <BaseText size="xs" lead="tight" class="mb-2" :class="planColor"
              >{{ selectedPlan?.price.yearly }} میلیون تومان سالیانه با
              تخفیف</BaseText
            >
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
              {{ selectedPlan?.description }}
            </BaseParagraph>
          </div>
        </div>
        <div class="my-4">
          <BaseParagraph
            size="sm"
            lead="tight"
            class="text-muted-500 dark:text-muted-400"
          >
            سامانه به شما امکان می دهد تا با توجه به امکانات و هدف گذاری های
            خود، پلن های منعطفی را انتخاب نمایید تا به بهترین وجه از سیستم
            استفاده نمایید.
          </BaseParagraph>
        </div>
        <div class="grid grid-cols-2 gap-6 font-sans text-xs">
          <div>
            <ul>
              <li
                v-for="item in selectedPlan?.features"
                :key="item"
                class="flex items-center gap-2"
                :class="planColor"
              >
                <Icon name="lucide:check" class="h-3 w-3 text-current" />
                <span class="text-muted-400">{{ item }}</span>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li
                v-for="item in selectedPlan?.benefits"
                :key="item"
                class="flex items-center gap-2"
                :class="planColor"
              >
                <Icon name="lucide:check" class="h-3 w-3 text-current" />
                <span class="text-muted-400">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
  <!-- Version Display -->
  <CommonVersionDisplay />
</template>
