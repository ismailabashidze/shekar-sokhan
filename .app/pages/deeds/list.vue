<script setup lang="ts">
definePageMeta({
  title: 'پیشنهادات نیک',
  preview: {
    title: 'پیشنهادات اعمال نیک',
    description: 'برای دریافت کد اشتراک از طریق انجام کارهای نیک',
    categories: ['dashboards'],
    src: '/img/screens/dashboards-jobs.png',
    srcDark: '/img/screens/dashboards-jobs-dark.png',
    order: 14,
  },
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const search = ref('')
const location = ref('')
const alertKeyword = ref('')

const selectedType = ref('all')
const selectedRange = ref('all')

const deedTypes = ref([
  'خانواده',
  'دوستان',
  'جامعه',
  'تشیع',
  'معنویت آزاد',
])

const deedDifficulty = ref([
  'ساده',
  'متوسط',
  'چالش‌برانگیز',
])

const deeds = [
  {
    category: 'خانواده',
    logo: '🏠',
    title: 'محبت به والدین',
    description: 'امروز برای پدر و مادرتان وقت بگذارید. با آنها صحبت کنید، به حرف‌هایشان گوش دهید و در کارهای روزمره به آنها کمک کنید.',
    tags: ['ساده', 'خانواده', 'والدین'],
  },
  {
    category: 'خانواده',
    logo: '💑',
    title: 'توجه به همسر',
    description: 'امروز برای همسرتان کاری خاص انجام دهید. می‌تواند یک هدیه کوچک، یک پیام محبت‌آمیز یا انجام کاری که همیشه دوست داشته باشد.',
    tags: ['ساده', 'خانواده', 'همسر'],
  },
  {
    category: 'دوستان',
    logo: '👥',
    title: 'احوالپرسی از دوست قدیمی',
    description: 'با یکی از دوستان قدیمی که مدتی است از او بی‌خبر هستید تماس بگیرید و حالش را جویا شوید.',
    tags: ['ساده', 'دوستان', 'ارتباطات'],
  },
  {
    category: 'جامعه',
    logo: '🤝',
    title: 'کمک به همسایه',
    description: 'به یکی از همسایه‌ها که نیاز به کمک دارد (مثل افراد مسن یا خانواده‌های دارای فرزند کوچک) کمک کنید.',
    tags: ['متوسط', 'جامعه', 'همسایه'],
  },
  {
    category: 'تشیع',
    logo: '📿',
    title: 'زیارت مجازی',
    description: 'زیارت مجازی یکی از اماکن متبرکه را انجام دهید و برای شفای بیماران دعا کنید.',
    tags: ['ساده', 'معنوی', 'تشیع'],
  },
  {
    category: 'تشیع',
    logo: '🕌',
    title: 'مطالعه حدیث',
    description: 'یک حدیث از ائمه معصومین (ع) را مطالعه کنید و در طول روز به آن عمل کنید.',
    tags: ['ساده', 'معنوی', 'تشیع'],
  },
  {
    category: 'معنویت آزاد',
    logo: '🧘',
    title: 'مراقبه و تفکر',
    description: 'ده دقیقه در سکوت به تفکر و مراقبه بپردازید و به آرامش درونی خود توجه کنید.',
    tags: ['ساده', 'معنوی', 'مراقبه'],
  },
  {
    category: 'معنویت آزاد',
    logo: '🌱',
    title: 'ارتباط با طبیعت',
    description: 'زمانی را در طبیعت بگذرانید و به زیبایی‌های اطرافتان توجه کنید. می‌توانید یک گیاه بکارید یا به گل‌های موجود رسیدگی کنید.',
    tags: ['متوسط', 'معنوی', 'طبیعت'],
  },
]
</script>

<template>
  <div>
    <!-- Search bar -->
    <div class="relative">
      <BaseCard
        rounded="lg"
        class="ptablet:py-6 ptablet:px-4 ptablet:grid ptablet:grid-cols-12 ltablet:divide-x divide-muted-200 dark:divide-muted-700 mb-10 flex w-full flex-col items-center py-2 sm:flex-row sm:py-0 lg:divide-x"
      >
        <div
          class="ptablet:ps-4 ptablet:col-span-6 w-full py-2 pe-4 ps-4 sm:w-auto sm:grow sm:ps-2"
        >
          <BaseInput
            v-model.trim="search"
            rounded="lg"
            icon="lucide:search"
            placeholder="جستجوی کارهای نیک"
          />
        </div>
        <div class="ptablet:col-span-6 w-full flex-1 px-4 py-2 sm:w-auto">
          <BaseInput
            v-model.trim="location"
            rounded="lg"
            icon="lucide:map-pin"
            placeholder="مکان"
          />
        </div>
        <div class="ptablet:col-span-6 w-full flex-1 px-4 py-2 sm:w-auto">
          <BaseSelect
            v-model="selectedType"
            rounded="lg"
            icon="lucide:briefcase"
            label=""
            hide-label
          >
            <option value="">
              انتخاب نوع کار نیک
            </option>
            <option value="all">
              همه
            </option>
            <option value="خانواده">
              خانواده
            </option>
            <option value="دوستان">
              دوستان
            </option>
            <option value="جامعه">
              جامعه
            </option>
            <option value="تشیع">
              تشیع
            </option>
            <option value="معنویت آزاد">
              معنویت آزاد
            </option>
          </BaseSelect>
        </div>
        <div class="ptablet:col-span-6 w-full flex-1 px-4 py-2 sm:w-auto">
          <BaseSelect
            v-model="selectedRange"
            rounded="lg"
            icon="lucide:dollar-sign"
            label=""
            hide-label
          >
            <option value="">
              انتخاب سطح سختی
            </option>
            <option value="all">
              همه
            </option>
            <option value="ساده">
              ساده
            </option>
            <option value="متوسط">
              متوسط
            </option>
            <option value="چالش‌برانگیز">
              چالش‌برانگیز
            </option>
          </BaseSelect>
        </div>
        <div class="ptablet:col-span-12 w-full px-4 py-2 sm:w-auto">
          <BaseButton
            rounded="lg"
            color="primary"
            class="ptablet:w-full w-full sm:w-32"
          >
            جستجو
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    <!-- Grid -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Column -->
      <div
        class="ptablet:col-span-4 ltablet:col-span-4 col-span-12 lg:col-span-3"
      >
        <div class="w-full">
          <div class="bg-muted-200 dark:bg-muted-800 mb-12 rounded-xl p-6">
            <!-- Title -->
            <div class="mb-6">
              <BaseHeading
                as="h3"
                size="md"
                weight="light"
                lead="tight"
                class="text-muted-800 mb-2 dark:text-white"
              >
                <span>ایجاد هشدار کار نیک</span>
              </BaseHeading>
              <BaseParagraph size="xs">
                <span class="text-muted-500">
                  ایجاد یک هشدار کار نیک مطابق با کلمات کلیدی زیر و در صورت انتشار یک کار نیک جدید مطابق با معیارهای شما، از طریق ایمیل به شما اطلاع‌رسانی می‌شود.
                </span>
              </BaseParagraph>
            </div>
            <!-- Form -->
            <form class="space-y-2">
              <BaseInput
                v-model.trim="alertKeyword"
                rounded="lg"
                icon="lucide:search"
                placeholder="کلمات کلیدی کار نیک"
              />
              <BaseButton
                rounded="lg"
                color="primary"
                class="w-full"
              >
                ایجاد هشدار
              </BaseButton>
            </form>
          </div>
          <!-- Filters -->
          <div class="space-y-12">
            <!-- Filter group -->
            <div class="relative">
              <!-- Title -->
              <div class="mb-6">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-2 dark:text-white"
                >
                  <span>انواع کارهای نیک</span>
                </BaseHeading>
              </div>
              <!-- Checkboxes -->
              <div class="flex flex-col gap-4 ps-2">
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedTypes"
                    value="خانواده"
                    label="خانواده"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    12
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedTypes"
                    value="دوستان"
                    label="دوستان"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    8
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedTypes"
                    value="جامعه"
                    label="جامعه"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    15
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedTypes"
                    value="تشیع"
                    label="تشیع"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    10
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedTypes"
                    value="معنویت آزاد"
                    label="معنویت آزاد"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    12
                  </BaseTag>
                </div>
              </div>
            </div>
            <!-- Filter group -->
            <div class="relative">
              <!-- Title -->
              <div class="mb-6">
                <BaseHeading
                  as="h3"
                  size="md"
                  weight="light"
                  lead="tight"
                  class="text-muted-800 mb-2 dark:text-white"
                >
                  <span>سطح سختی کارهای نیک</span>
                </BaseHeading>
              </div>
              <!-- Checkboxes -->
              <div class="flex flex-col gap-4 ps-2">
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedDifficulty"
                    value="ساده"
                    label="ساده"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    20
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedDifficulty"
                    value="متوسط"
                    label="متوسط"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    15
                  </BaseTag>
                </div>
                <div class="flex items-center justify-between">
                  <BaseCheckbox
                    v-model="deedDifficulty"
                    value="چالش‌برانگیز"
                    label="چالش‌برانگیز"
                    rounded="sm"
                    color="primary"
                  />
                  <BaseTag
                    color="default"
                    rounded="full"
                    class="text-xs"
                    size="sm"
                  >
                    10
                  </BaseTag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Column -->
      <div
        class="ptablet:col-span-8 ltablet:col-span-8 col-span-12 lg:col-span-9"
      >
        <!-- Title -->
        <div class="mb-6 mt-12 sm:mt-0">
          <BaseHeading
            as="h3"
            size="lg"
            weight="light"
            lead="tight"
            class="text-muted-800 dark:text-white"
          >
            <span>نمایش 46 کار نیک</span>
          </BaseHeading>
          <BaseParagraph size="sm">
            <span class="text-muted-500">
              این‌ها کارهای نیک هستند که ما پیدا کردیم
            </span>
          </BaseParagraph>
        </div>
        <!-- Inner jobs grid -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div
            v-for="(deed, index) in deeds"
            :key="index"
            class="relative"
          >
            <BaseCard rounded="lg" class="p-6">
              <div class="flex w-full flex-col gap-4 sm:flex-row">
                <div :data-nui-tooltip="deed.category">
                  <Icon :name="deed.logo" class="size-10 shrink-0" />
                </div>
                <div>
                  <BaseHeading
                    as="h4"
                    size="md"
                    weight="semibold"
                    lead="tight"
                    class="after:text-muted-800 mb-4 dark:text-white"
                  >
                    <span>{{ deed.title }}</span>
                  </BaseHeading>
                  <BaseParagraph size="sm">
                    <span
                      class="text-muted-500 dark:text-muted-400 line-clamp-4"
                    >
                      {{ deed.description }}
                    </span>
                  </BaseParagraph>
                  <div class="flex flex-wrap items-center gap-2 py-4">
                    <BaseTag
                      v-for="tag in deed.tags"
                      :key="tag"
                      color="default"
                      size="sm"
                      class="text-xs"
                    >
                      {{ tag }}
                    </BaseTag>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <!-- BaseAvatarGroup
                        :avatars="deed.applicants"
                        :limit="2"
                        size="xs"
                      /> -->
                    </div>
                    <div class="flex gap-2">
                      <BaseButton
                        rounded="lg"
                        color="primary"
                        class="w-24"
                      >
                        انجام دهید
                      </BaseButton>
                      <BaseButton
                        rounded="lg"
                        color="default"
                        class="w-24"
                      >
                        جزئیات
                      </BaseButton>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
