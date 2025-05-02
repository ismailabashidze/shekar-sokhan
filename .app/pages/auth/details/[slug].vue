<script setup lang="ts">
definePageMeta({
  title: 'Project Details',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { open } = usePanels()

const route = useRoute()
const slug = computed(() => route.params.slug)

const query = computed(() => {
  return {
    slug: slug.value,
  }
})

const { data, pending, error, refresh } = await useFetch(
  '/api/company/projects',
  {
    query,
  },
)

if (!data.value?.project) {
  await navigateTo('/layouts/projects')
}

const currentTask = ref()

function openTaskPanel(id: number, tasks: any) {
  currentTask.value = tasks.find((task: any) => task.id === id)
  open('task', { task: currentTask })
}

// Define data for patient report
const achievements = [
  {
    title: 'تکمیل هدف هفتگی',
    date: '2025-04-30',
    details: 'توانستم هدفی که برای خودم تعیین کرده بودم را تا پایان هفته انجام دهم و احساس موفقیت و رضایت داشتم. این هدف شامل گفتن "نه" به یک درخواست غیرمنطقی بود که قبلاً برایم دشوار بود.',
    icon: '🏆',
  },
  {
    title: 'شرکت فعال در جلسه',
    details: 'در بحث گروهی بیشتر مشارکت کردم و نظراتم را با اعتماد به نفس بیان کردم. این کار باعث شد احساس ارزشمندی بیشتری داشته باشم.',
    icon: '🙋‍♂️',
  },
  {
    title: 'مدیریت یک موقعیت استرس‌زا',
    details: 'در یک موقعیت کاری که معمولاً مضطرب می‌شوم، با استفاده از تکنیک تنفس عمیق توانستم آرامشم را حفظ کنم و واکنش بهتری نشان دهم.',
    icon: '😌',
  },
]

const strengthsData = [
  { label: 'انعطاف‌پذیری', icon: '🌱' },
  { label: 'صداقت', icon: '🤝' },
  { label: 'پذیرش بازخورد', icon: '🧠' },
  { label: 'توانایی فکر کردن قبل از واکنش', icon: '⏳' },
  { label: 'شجاعت در بیان احساسات', icon: '💬' },
]

const growthAreas = [
  {
    title: 'جرأت‌مندی',
    reason: 'در جمع‌ها گاهی خودم را کمتر ابراز می‌کنم و از قضاوت دیگران می‌ترسم.',
    icon: '🗣️',
    suggestedActions: [
      { title: 'تمرین بیان احساسات در جمع حتی اگر اضطراب داشته باشم', icon: '🎤' },
      { title: 'شرکت در کارگاه مهارت‌های اجتماعی و تمرین نقش‌آفرینی', icon: '🎭' },
    ],
  },
  {
    title: 'مدیریت استرس',
    reason: 'در موقعیت‌های پراسترس گاهی دچار افکار منفی و بی‌حوصلگی می‌شوم.',
    icon: '😮‍💨',
    suggestedActions: [
      { title: 'تمرین تنفس عمیق و ذهن‌آگاهی هر روز صبح', icon: '🧘‍♂️' },
      { title: 'استفاده از تکنیک‌های آرام‌سازی و یادداشت‌برداری از افکارم', icon: '📝' },
    ],
  },
]

const nextSteps = [
  {
    title: 'گزارش پیشرفت به درمانگر',
    responsible: 'من',
    dueDate: '2025-05-09',
    description: 'در جلسه بعدی خلاصه‌ای از پیشرفت خودم را ارائه خواهم داد و درباره احساساتم نسبت به تمرین مرزگذاری صحبت می‌کنم.',
    icon: '🗒️',
  },
  {
    title: 'تعیین هدف جدید هفتگی',
    responsible: 'من',
    dueDate: '2025-05-16',
    description: 'برای هفته آینده یک هدف جدید درباره تمرین جرأت‌مندی تعیین می‌کنم و سعی می‌کنم آن را در موقعیت‌های واقعی اجرا کنم.',
    icon: '🎯',
  },
  {
    title: 'تمرین روزانه ذهن‌آگاهی',
    responsible: 'من',
    dueDate: '2025-05-16',
    description: 'هر روز حداقل ۵ دقیقه تمرین ذهن‌آگاهی انجام دهم و تاثیر آن را یادداشت کنم.',
    icon: '🧘‍♀️',
  },
]

const actionItems = [
  { title: 'تمرین گفتن نه در موقعیت‌های روزمره، حتی اگر سخت باشد', completed: false, dueDate: '2025-05-10', icon: '🛑' },
  { title: 'نوشتن خاطرات و احساساتم درباره مرزها و تجربه‌های جدیدم', completed: true, icon: '✍️' },
  { title: 'شناسایی موقعیت‌هایی که مرزهایم رعایت نمی‌شود و تحلیل واکنشم', completed: false, icon: '🔍' },
  { title: 'مطالعه مقاله‌ای درباره مرزهای سالم در روابط', completed: false, icon: '📚' },
]

const insightsData = [
  { text: 'یاد گرفتم باید از خودم مراقبت کنم و این کار خودخواهی نیست.', icon: '🧡' },
  { text: 'فهمیدم تعیین مرزهای سالم در روابط چقدر مهم است و باعث احترام بیشتر دیگران به من می‌شود.', icon: '🚧' },
  { text: 'متوجه شدم که احساسات من ارزشمند هستند و باید به آن‌ها توجه کنم.', icon: '💭' },
  { text: 'درک کردم که می‌توانم رفتارها و واکنش‌هایم را تغییر دهم و رشد کنم.', icon: '🌻' },
]

const learningsData = [
  { text: 'مهارت نه گفتن بدون احساس گناه', icon: '🙅‍♀️' },
  { text: 'ارتباط مؤثر با دیگران و بیان نیازهایم', icon: '📢' },
  { text: 'تشخیص احساساتم و نام‌گذاری آن‌ها', icon: '🔖' },
  { text: 'استفاده از تکنیک‌های آرام‌سازی هنگام استرس', icon: '🧊' },
  { text: 'یادگیری اینکه اشتباه کردن بخشی از مسیر رشد است', icon: '🪜' },
]

const strategiesData = [
  { title: 'تنفس عمیق و تمرکز بر نفس‌هایم وقتی مضطرب می‌شوم', icon: '🌬️' },
  { title: 'مطالعه کتاب‌های الهام‌بخش برای تقویت روحیه', icon: '📖' },
  { title: 'گفتگو با دوستان نزدیک وقتی احساس تنهایی دارم', icon: '👥' },
  { title: 'نوشتن احساساتم در دفترچه روزانه', icon: '📓' },
]

const mainPointsData = [
  { title: 'تمرین نه گفتن', icon: '🙅‍♂️', description: 'آموختم که چگونه با اعتماد به نفس «نه» بگویم و مرزهای خود را تعیین کنم.' },
  { title: 'مدیریت استرس', icon: '😮‍💨', description: 'تکنیک‌های آرام‌سازی و مدیریت استرس را برای کاهش اضطراب یاد گرفتم.' },
  { title: 'تقویت جرأت‌مندی', icon: '🗣️', description: 'تمرین بیان نیازها و خواسته‌هایم به صورت مناسب و احترام‌آمیز.' },
  { title: 'تمرین ذهن‌آگاهی', icon: '🧘‍♂️', description: 'تمرکز بر لحظه حال و آگاهی از افکار و احساسات بدون قضاوت.' },
]

const relationshipSteps = [
  { title: 'در جلسه بعدی احساساتم را شفاف‌تر بیان کنم و از بیان نگرانی‌هایم نترسم', icon: '🗣️' },
  { title: 'سوالات و ابهاماتم را یادداشت کنم تا فراموش نکنم', icon: '📝' },
  { title: 'در صورت نیاز از درمانگر درخواست راهنمایی بیشتر کنم', icon: '🤲' },
]

const tasksData = [
  { 
    title: 'تمرین گفتن نه در موقعیت‌های روزمره', 
    dueDate: '2025-05-10', 
    icon: '🛑',
    status: 'در حال انجام',
    description: 'هر روز در یک موقعیت که احساس می‌کنم مرزهایم نقض می‌شود، تمرین کنم که محترمانه "نه" بگویم.',
    progress: 30,
    completed: false
  },
  { 
    title: 'نوشتن خاطرات و احساساتم درباره مرزها', 
    dueDate: '2025-05-02', 
    icon: '✍️',
    status: 'تکمیل شده',
    description: 'هر شب قبل از خواب درباره احساساتم و تجربیات روزانه‌ام در رابطه با مرزهای شخصی بنویسم.',
    progress: 100,
    completed: true
  },
  { 
    title: 'شناسایی موقعیت‌هایی که مرزهایم رعایت نمی‌شود', 
    dueDate: '2025-05-08', 
    icon: '🔍',
    status: 'در حال انجام',
    description: 'لیستی از موقعیت‌ها و افرادی که معمولاً باعث می‌شوند احساس ناراحتی کنم تهیه کنم و الگوها را شناسایی کنم.',
    progress: 50,
    completed: false
  },
  { 
    title: 'مطالعه مقاله‌ای درباره مرزهای سالم در روابط', 
    dueDate: '2025-05-15', 
    icon: '📚',
    status: 'به زودی',
    description: 'مقاله پیشنهادی درمانگر را درباره نحوه تعیین مرزهای سالم مطالعه کنم و نکات کلیدی را یادداشت کنم.',
    progress: 0,
    completed: false
  },
  { 
    title: 'تمرین روزانه ذهن‌آگاهی', 
    dueDate: '2025-05-16', 
    icon: '🧘‍♀️',
    status: 'در حال انجام',
    description: 'هر روز حداقل ۵ دقیقه تمرین ذهن‌آگاهی انجام دهم و تاثیر آن بر استرس روزانه‌ام را یادداشت کنم.',
    progress: 40,
    completed: false
  },
]

const keyEmotions = { شادی: 4, اضطراب: 3, امیدواری: 4, تردید: 2, آرامش: 3 }
const mainPoints = [
  { title: 'تعیین مرزهای سالم', icon: '🚧' },
  { title: 'تمرین نه گفتن', icon: '🙅‍♂️' },
  { title: 'مدیریت استرس', icon: '😮‍💨' },
  { title: 'تقویت جرأت‌مندی', icon: '🗣️' },
  { title: 'تمرین ذهن‌آگاهی', icon: '🧘‍♂️' },
]

const homeworksData = [
  { 
    title: 'تمرین گفتن نه در موقعیت‌های روزمره', 
    dueDate: '2025-05-10', 
    icon: '🛑',
    completed: false
  },
  { 
    title: 'نوشتن خاطرات و احساساتم درباره مرزها', 
    dueDate: '2025-05-02', 
    icon: '✍️',
    completed: true
  },
  { 
    title: 'شناسایی موقعیت‌هایی که مرزهایم رعایت نمی‌شود', 
    dueDate: '2025-05-08', 
    icon: '🔍',
    completed: false
  },
  { 
    title: 'مطالعه مقاله‌ای درباره مرزهای سالم در روابط', 
    dueDate: '2025-05-15', 
    icon: '📚',
    completed: false
  },
  { 
    title: 'تمرین روزانه ذهن‌آگاهی', 
    dueDate: '2025-05-16', 
    icon: '🧘‍♀️',
    completed: false
  },
]

const activeFilter = ref('all')

const filteredHomeworks = computed(() => {
  const today = new Date()
  
  if (activeFilter.value === 'all') {
    return homeworksData
  } else if (activeFilter.value === 'completed') {
    return homeworksData.filter(hw => hw.completed)
  } else if (activeFilter.value === 'pending') {
    return homeworksData.filter(hw => !hw.completed)
  } else if (activeFilter.value === 'upcoming') {
    return homeworksData.filter(hw => {
      if (!hw.dueDate) return false
      const dueDate = new Date(hw.dueDate)
      return dueDate > today && !hw.completed
    })
  }
  
  return homeworksData
})
</script>

<template>
  <div class="relative">
    <div class="absolute end-12 top-2.5 z-20 hidden sm:block">
      <BaseButton
        size="sm"
        rounded="lg"
        :to="`/layouts/projects/board/${slug}`"
      >
        <Icon name="ph:kanban-duotone" class="size-4" />
        <span>Open Board</span>
      </BaseButton>
    </div>
    <div class="absolute end-0 top-2 z-20">
      <BaseDropdown
        variant="context"
        label="Dropdown"
        placement="bottom-end"
        size="md"
        class="z-20"
        rounded="lg"
      >
        <BaseDropdownItem
          :to="`/layouts/projects/board/${slug}`"
          title="Board view"
          text="Swicth to board view"
          class="sm:hidden"
        >
          <template #start>
            <Icon name="ph:kanban-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownDivider />
        <BaseDropdownItem
          to="#"
          title="Edit"
          text="Edit this project"
        >
          <template #start>
            <Icon name="ph:pencil-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownDivider />
        <BaseDropdownItem
          to="#"
          title="Permissions"
          text="Manage permissions"
        >
          <template #start>
            <Icon name="ph:lock-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownItem
          to="#"
          title="Files"
          text="Manage files"
        >
          <template #start>
            <Icon name="ph:file-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
        <BaseDropdownDivider />
        <BaseDropdownItem
          to="#"
          title="Delete"
          text="Delete this project"
        >
          <template #start>
            <Icon name="ph:trash-duotone" class="me-2 block size-5" />
          </template>
        </BaseDropdownItem>
      </BaseDropdown>
    </div>
    <div v-if="data?.project === undefined">
      <BasePlaceholderPage
        title="Project not found"
        subtitle="We couldn't find a project matching this namespace."
      >
        <template #image>
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-projects.svg"
            alt="Placeholder image"
          >
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-projects-dark.svg"
            alt="Placeholder image"
          >
        </template>
      </BasePlaceholderPage>
    </div>
    <div v-else class="h-full">
      <BaseTabs
        model-value="overview"
        :tabs="[
          {
            label: 'گزارش کلی',
            value: 'overview',
          },
          {
            label: 'پیشرفت جلسه',
            value: 'progress',
          },
          {
            label: 'سفر احساسی',
            value: 'emotional',
          },
          {
            label: 'رشد شخصی',
            value: 'personal',
          },
          {
            label: 'نکات کلیدی',
            value: 'mainpoints',
          },
          {
            label: 'ارتباط درمانی',
            value: 'therapeutic',
          },
          {
            label: 'تکالیف',
            value: 'tasks',
          },
          {
            label: 'تکالیف',
            value: 'homeworks',
          },
        ]"
      >
        <template #tab="{ activeValue }">
          <!-- Overview -->
          <div v-if="activeValue === 'overview'">
            <div class="grid grid-cols-12 gap-6">
              <div class="ltablet:col-span-8 col-span-12 lg:col-span-8">
                <BaseCard class="space-y-8 p-6">
                  <div
                    class="border-muted-200 dark:border-muted-700 flex flex-col items-center justify-between gap-8 border-b pb-6 sm:flex-row"
                  >
                    <div class="w-full">
                      <BaseHeading
                        tag="h2"
                        size="2xl"
                        weight="medium"
                      >
                        گزارش جلسه {{ data?.project?.title || 'هفتم' }}
                      </BaseHeading>
                      <BaseParagraph
                        size="sm"
                        class="text-muted-400 mt-1"
                      >
                        تاریخ جلسه: {{ '۲ اردیبهشت ۱۴۰۴' }}
                      </BaseParagraph>
                      
                      <!-- Main Points -->
                      <div class="mt-6">
                        <BaseHeading
                          tag="h3"
                          size="lg"
                          weight="medium"
                          class="mb-4"
                        >
                          نکات کلیدی جلسه
                        </BaseHeading>
                        <div class="flex flex-wrap gap-3">
                          <BaseTag 
                            v-for="point in mainPoints"
                            :key="point.title"
                            color="default"
                            flavor="pastel"
                            size="md"
                            class="rtl:ml-2 ltr:mr-2 mb-2"
                          >
                            {{ point.icon }} {{ point.title }}
                          </BaseTag>
                        </div>
                      </div>
                      
                      <!-- Emotional Journey -->
                      <div class="mt-6 border-t border-muted-200 dark:border-muted-700 pt-6">
                        <BaseHeading
                          tag="h3"
                          size="lg"
                          weight="medium"
                          class="mb-4"
                        >
                          سفر احساسی
                        </BaseHeading>
                        <div class="mb-4 flex items-center gap-1 text-xl">
                          <span>😊😌😐😔</span>
                        </div>
                        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-4">
                          در ابتدای جلسه کمی مضطرب بودم اما با صحبت کردن درباره احساساتم آرام‌تر شدم. در طول جلسه احساس امیدواری و شادی بیشتری پیدا کردم و در پایان جلسه حس سبکی داشتم. با این حال، هنوز گاهی اضطراب و تردید سراغم می‌آید.
                        </BaseParagraph>
                        
                        <div class="mb-4">
                          <BaseHeading
                            tag="h4"
                            size="md"
                            weight="medium"
                            class="mb-2"
                          >
                            احساسات کلیدی
                          </BaseHeading>
                          <div class="flex flex-wrap gap-2">
                            <BaseProgress
                              v-for="(value, emotion) in keyEmotions"
                              :key="emotion"
                              :value="value * 20"
                              :color="emotion === 'اضطراب' || emotion === 'تردید' ? 'warning' : 'primary'"
                              size="xs"
                              label-position="start"
                              class="mb-3 w-full max-w-md"
                            >
                              {{ emotion }}
                            </BaseProgress>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Insights/Learnings -->
                      <div class="mt-6 border-t border-muted-200 dark:border-muted-700 pt-6">
                        <BaseHeading
                          tag="h3"
                          size="lg"
                          weight="medium"
                          class="mb-4"
                        >
                          بینش‌ها و یادگیری‌ها
                        </BaseHeading>
                        
                        <div class="mb-4">
                          <BaseHeading
                            tag="h4"
                            size="md"
                            weight="medium"
                            class="mb-2"
                          >
                            بینش‌ها
                          </BaseHeading>
                          <ul class="ps-4 space-y-2">
                            <li v-for="insight in insightsData" 
                                :key="insight.text"
                                class="text-muted-600 dark:text-muted-300 flex items-start gap-2"
                            >
                              <span>{{ insight.icon }}</span>
                              <span>{{ insight.text }}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div class="mb-4">
                          <BaseHeading
                            tag="h4"
                            size="md"
                            weight="medium"
                            class="mb-2"
                          >
                            یادگیری‌ها
                          </BaseHeading>
                          <ul class="ps-4 space-y-2">
                            <li v-for="learning in learningsData" 
                                :key="learning.text"
                                class="text-muted-600 dark:text-muted-300 flex items-start gap-2"
                            >
                              <span>{{ learning.icon }}</span>
                              <span>{{ learning.text }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Items -->
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      تکالیف
                    </BaseHeading>
                    <div class="space-y-3">
                      <BaseListItem
                        v-for="item in actionItems"
                        :key="item.title"
                        class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
                      >
                        <template #start>
                          <BaseCheckbox
                            :model-value="item.completed"
                            :color="item.completed ? 'success' : 'muted'"
                            :disabled="true"
                            class="me-2"
                          />
                        </template>
                        <div class="flex flex-1 flex-col">
                          <p class="text-muted-800 dark:text-muted-100 font-sans text-sm font-medium leading-tight">
                            <span>{{ item.icon }}</span> {{ item.title }}
                          </p>
                          <p class="text-muted-400 font-sans text-xs" v-if="item.dueDate">
                            <span class="me-1">
                              <Icon name="ph:calendar-duotone" class="size-3" />
                            </span>
                            <span>تا تاریخ {{ item.dueDate }}</span>
                          </p>
                        </div>
                      </BaseListItem>
                    </div>
                  </div>
                </BaseCard>
              </div>
              <div class="ltablet:col-span-4 col-span-12 lg:col-span-4">
                <div class="space-y-6">
                  <!-- Strengths -->
                  <BaseCard class="p-6">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      نقاط قوت
                    </BaseHeading>
                    <div class="flex flex-wrap gap-2">
                      <BaseTag 
                        v-for="strength in strengthsData"
                        :key="strength.label"
                        color="success"
                        flavor="pastel"
                        size="md"
                        class="rtl:ml-2 ltr:mr-2 mb-2"
                      >
                        {{ strength.icon }} {{ strength.label }}
                      </BaseTag>
                    </div>
                    <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-4">
                      در این جلسه متوجه شدم که انعطاف‌پذیری و صداقتم به من کمک می‌کند تا روابط بهتری داشته باشم. همچنین توانستم بازخورد درمانگر را بدون احساس تدافعی بپذیرم و درباره احساساتم با شجاعت بیشتری صحبت کنم.
                    </BaseParagraph>
                  </BaseCard>
                  
                  <!-- Areas for Growth -->
                  <BaseCard class="p-6">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      زمینه‌های رشد
                    </BaseHeading>
                    <div class="space-y-4">
                      <div v-for="area in growthAreas" 
                          :key="area.title"
                      >
                        <BaseHeading
                          tag="h4"
                          size="md"
                          weight="medium"
                          class="mb-2 flex items-center gap-2"
                        >
                          <span>{{ area.icon }}</span> {{ area.title }}
                        </BaseHeading>
                        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mb-2">
                          {{ area.reason }}
                        </BaseParagraph>
                        <div class="ps-4">
                          <BaseHeading
                            tag="h5"
                            size="sm"
                            weight="medium"
                            class="mb-2"
                          >
                            اقدامات پیشنهادی:
                          </BaseHeading>
                          <ul class="ps-2 space-y-1">
                            <li v-for="action in area.suggestedActions" 
                                :key="action.title"
                                class="text-muted-600 dark:text-muted-300 text-sm flex items-start gap-2">
                              <span>{{ action.icon }}</span>
                              <span>{{ action.title }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                  
                  <!-- Therapeutic Relationship -->
                  <BaseCard class="p-6">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      ارتباط درمانی
                    </BaseHeading>
                    <div class="mb-4">
                      <div class="grid grid-cols-3 gap-3 mb-4">
                        <div class="text-center">
                          <div class="bg-muted-100 dark:bg-muted-700 rounded-md p-2 mb-1">
                            <div class="text-primary-500 text-2xl">
                              <Icon name="ph:chat-circle-text-duotone" class="size-8" />
                            </div>
                          </div>
                          <div class="text-sm font-medium">کیفیت ارتباط</div>
                          <div class="text-muted-400 text-xs">خوب</div>
                        </div>
                        <div class="text-center">
                          <div class="bg-muted-100 dark:bg-muted-700 rounded-md p-2 mb-1">
                            <div class="text-warning-500 text-2xl">
                              <Icon name="ph:brain-duotone" class="size-8" />
                            </div>
                          </div>
                          <div class="text-sm font-medium">سطح درک</div>
                          <div class="text-muted-400 text-xs">متوسط</div>
                        </div>
                        <div class="text-center">
                          <div class="bg-muted-100 dark:bg-muted-700 rounded-md p-2 mb-1">
                            <div class="text-info-500 text-2xl">
                              <Icon name="ph:handshake-duotone" class="size-8" />
                            </div>
                          </div>
                          <div class="text-sm font-medium">سطح اعتماد</div>
                          <div class="text-muted-400 text-xs">در حال رشد</div>
                        </div>
                      </div>
                      
                      <BaseHeading
                        tag="h4"
                        size="md"
                        weight="medium"
                        class="mt-4 mb-2"
                      >
                        گام‌های بعدی برای بهبود ارتباط
                      </BaseHeading>
                      <ul class="ps-4 space-y-2">
                        <li v-for="step in relationshipSteps" 
                            :key="step.title"
                            class="text-muted-600 dark:text-muted-300 flex items-start gap-2"
                        >
                          <span>{{ step.icon }}</span>
                          <span>{{ step.title }}</span>
                        </li>
                      </ul>
                      <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400 mt-4">
                        می‌خواهم ارتباطم با درمانگرم را بازتر و شفاف‌تر کنم تا بهتر بتوانم پیشرفت کنم. گاهی هنوز احساس خجالت دارم اما تصمیم دارم این احساس را مدیریت کنم و بیشتر به خودم اعتماد کنم.
                      </BaseParagraph>
                    </div>
                  </BaseCard>
                </div>
              </div>
            </div>
          </div>
          <!-- Progress Tab -->
          <div v-else-if="activeValue === 'progress'">
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12">
                <BaseCard class="p-6">
                  <BaseHeading
                    tag="h2"
                    size="2xl"
                    weight="medium"
                    class="mb-4"
                  >
                    پیشرفت جلسه
                  </BaseHeading>
                  
                  <!-- Strengths -->
                  <div class="mb-8 border-b border-muted-200 dark:border-muted-700 pb-6">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      نقاط قوت شناسایی شده
                    </BaseHeading>
                    <div class="flex flex-wrap gap-2 mb-4">
                      <BaseTag 
                        v-for="strength in strengthsData"
                        :key="strength.label"
                        color="success"
                        flavor="pastel"
                        size="md"
                        class="rtl:ml-2 ltr:mr-2 mb-2"
                      >
                        {{ strength.icon }} {{ strength.label }}
                      </BaseTag>
                    </div>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                      در این جلسه متوجه شدم که انعطاف‌پذیری و صداقتم به من کمک می‌کند تا روابط بهتری داشته باشم. همچنین توانستم بازخورد درمانگر را بدون احساس تدافعی بپذیرم و درباره احساساتم با شجاعت بیشتری صحبت کنم.
                    </BaseParagraph>
                  </div>
                  
                  <!-- Achievements -->
                  <div class="mb-8 border-b border-muted-200 dark:border-muted-700 pb-6">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      دستاوردها
                    </BaseHeading>
                    <div class="space-y-4">
                      <BaseCard 
                        v-for="achievement in achievements"
                        :key="achievement.title"
                        class="border-muted-200 dark:border-muted-700 shadow-none border"
                      >
                        <div class="p-4">
                          <div class="flex items-start gap-3">
                            <div class="text-2xl">{{ achievement.icon }}</div>
                            <div>
                              <BaseHeading
                                tag="h4"
                                size="md"
                                weight="medium"
                                class="mb-1"
                              >
                                {{ achievement.title }}
                              </BaseHeading>
                              <div v-if="achievement.date" class="text-muted-400 text-xs mb-2">
                                <Icon name="ph:calendar-duotone" class="size-3 inline-block" />
                                <span class="ms-1">{{ achievement.date }}</span>
                              </div>
                              <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                                {{ achievement.details }}
                              </BaseParagraph>
                            </div>
                          </div>
                        </div>
                      </BaseCard>
                    </div>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mt-4">
                      پیشرفت خوبی در پیگیری اهدافم داشتم و از اینکه توانستم در موقعیت‌های چالش‌برانگیز بهتر عمل کنم، به خودم افتخار می‌کنم.
                    </BaseParagraph>
                  </div>
                  
                  <!-- Areas for Growth -->
                  <div class="mb-8 border-b border-muted-200 dark:border-muted-700 pb-6">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      زمینه‌های رشد
                    </BaseHeading>
                    <div class="space-y-5">
                      <div v-for="area in growthAreas" 
                          :key="area.title"
                          class="bg-muted-50 dark:bg-muted-800/30 rounded-lg p-5"
                      >
                        <BaseHeading
                          tag="h4"
                          size="md"
                          weight="medium"
                          class="mb-3 flex items-center gap-2"
                        >
                          <span>{{ area.icon }}</span> {{ area.title }}
                        </BaseHeading>
                        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-4">
                          {{ area.reason }}
                        </BaseParagraph>
                        <div class="bg-white dark:bg-muted-800 rounded p-4">
                          <BaseHeading
                            tag="h5"
                            size="sm"
                            weight="medium"
                            class="mb-3"
                          >
                            اقدامات پیشنهادی
                          </BaseHeading>
                          <ul class="space-y-2">
                            <li v-for="action in area.suggestedActions" 
                                :key="action.title"
                                class="text-muted-600 dark:text-muted-300 text-sm flex items-start gap-2"
                            >
                              <span>{{ action.icon }}</span>
                              <span>{{ action.title }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mt-4">
                      برای رشد شخصی‌ام تصمیم گرفتم مهارت‌های جرأت‌مندی و مدیریت استرس را به طور منظم تمرین کنم. همچنین می‌خواهم بیشتر به احساسات خودم توجه کنم و اجازه ندهم ترس از قضاوت دیگران مانع بیان خودم شود.
                    </BaseParagraph>
                  </div>
                  
                  <!-- Next Steps -->
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      گام‌های بعدی
                    </BaseHeading>
                    <div class="space-y-3">
                      <BaseListItem
                        v-for="step in nextSteps"
                        :key="step.title"
                        class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
                      >
                        <template #start>
                          <div class="text-lg me-2">{{ step.icon }}</div>
                        </template>
                        <div class="flex flex-1 flex-col">
                          <p class="text-muted-800 dark:text-muted-100 font-sans text-sm font-medium leading-tight mb-1">
                            {{ step.title }}
                          </p>
                          <div class="flex items-center gap-3 text-xs text-muted-400 my-1">
                            <div>
                              <Icon name="ph:user-duotone" class="size-3 inline-block" />
                              <span class="ms-1">{{ step.responsible }}</span>
                            </div>
                            <div v-if="step.dueDate">
                              <Icon name="ph:calendar-duotone" class="size-3 inline-block" />
                              <span class="ms-1">تا تاریخ {{ step.dueDate }}</span>
                            </div>
                          </div>
                          <p class="text-muted-600 dark:text-muted-300 font-sans text-sm mt-1">
                            {{ step.description }}
                          </p>
                        </div>
                      </BaseListItem>
                    </div>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
          <!-- Emotional Journey Tab -->
          <div v-else-if="activeValue === 'emotional'">
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12">
                <BaseCard class="p-6">
                  <BaseHeading
                    tag="h2"
                    size="2xl"
                    weight="medium"
                    class="mb-6"
                  >
                    سفر احساسی
                  </BaseHeading>
                  
                  <div class="flex flex-col md:flex-row gap-6 mb-8 border-b border-muted-200 dark:border-muted-700 pb-8">
                    <div class="md:w-1/3 mb-4 md:mb-0">
                      <BaseHeading
                        tag="h3"
                        size="lg"
                        weight="medium"
                        class="mb-4"
                      >
                        حالت کلی
                      </BaseHeading>
                      <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-4 text-center">
                        <div class="text-4xl mb-4">😊😌😐😔</div>
                        <div class="inline-block bg-primary-500/20 text-primary-500 dark:bg-primary-500/30 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                          حالت کلی: خوب
                        </div>
                        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 text-right">
                          در ابتدای جلسه کمی مضطرب بودم اما با صحبت کردن درباره احساساتم آرام‌تر شدم. در طول جلسه احساس امیدواری و شادی بیشتری پیدا کردم و در پایان جلسه حس سبکی داشتم. با این حال، هنوز گاهی اضطراب و تردید سراغم می‌آید.
                        </BaseParagraph>
                      </div>
                    </div>
                    
                    <div class="md:w-2/3">
                      <BaseHeading
                        tag="h3"
                        size="lg"
                        weight="medium"
                        class="mb-4"
                      >
                        احساسات کلیدی
                      </BaseHeading>
                      <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-6">
                        <div class="space-y-4">
                          <div v-for="(value, emotion, index) in keyEmotions" 
                              :key="emotion"
                              class="relative"
                          >
                            <div class="flex items-center justify-between mb-1">
                              <div class="text-muted-800 dark:text-muted-100 font-medium">{{ emotion }}</div>
                              <div class="text-muted-400 text-xs">{{ value }} از 5</div>
                            </div>
                            <div class="h-3 w-full bg-muted-200 dark:bg-muted-700 rounded-full overflow-hidden">
                              <div 
                                class="h-full rounded-full" 
                                :class="{
                                  'bg-success-500': emotion === 'شادی' || emotion === 'امیدواری' || emotion === 'آرامش',
                                  'bg-warning-500': emotion === 'اضطراب' || emotion === 'تردید'
                                }"
                                :style="{ width: `${value * 20}%` }"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <BaseHeading
                    tag="h3"
                    size="lg"
                    weight="medium"
                    class="mb-4"
                  >
                    استراتژی‌های مقابله با استرس
                  </BaseHeading>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <BaseCard 
                      v-for="strategy in strategiesData"
                      :key="strategy.title"
                      class="border-muted-200 dark:border-muted-700 shadow-none border"
                    >
                      <div class="p-4">
                        <div class="flex items-start gap-3">
                          <div class="text-2xl">{{ strategy.icon }}</div>
                          <div>
                            <BaseHeading
                              tag="h4"
                              size="md"
                              weight="medium"
                              class="mb-1"
                            >
                              {{ strategy.title }}
                            </BaseHeading>
                          </div>
                        </div>
                      </div>
                    </BaseCard>
                  </div>
                  
                  <div class="bg-muted-50 dark:bg-muted-800/30 rounded-lg p-5 mb-4">
                    <BaseHeading
                      tag="h4"
                      size="md"
                      weight="medium"
                      class="mb-3"
                    >
                      میزان تاثیرگذاری
                    </BaseHeading>
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                      احساس می‌کنم تکنیک‌های ذهن‌آگاهی و نوشتن احساساتم بیشترین تاثیر را داشتند. صحبت با دوستان هم به کاهش اضطرابم کمک کرد، اما هنوز باید تمرین کنم تا به طور مداوم از این روش‌ها استفاده کنم.
                    </BaseParagraph>
                  </div>
                  
                  <div class="flex flex-wrap gap-2 mt-6">
                    <BaseButton color="primary" flavor="pastel">
                      <Icon name="ph:plus-circle-duotone" class="me-2" />
                      افزودن استراتژی جدید
                    </BaseButton>
                    <BaseButton color="info" flavor="pastel">
                      <Icon name="ph:note-pencil-duotone" class="me-2" />
                      ثبت حالت روزانه
                    </BaseButton>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
          <!-- Personal Growth Tab -->
          <div v-else-if="activeValue === 'personal'">
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12">
                <BaseCard class="p-6">
                  <BaseHeading
                    tag="h2"
                    size="2xl"
                    weight="medium"
                    class="mb-6"
                  >
                    رشد شخصی
                  </BaseHeading>
                  
                  <!-- Insights Section -->
                  <div class="mb-8 border-b border-muted-200 dark:border-muted-700 pb-8">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      بینش‌ها
                    </BaseHeading>
                    
                    <div class="bg-muted-50 dark:bg-muted-800/30 rounded-lg p-5 mb-6">
                      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 italic">
                        "در این جلسه به این نتیجه رسیدم که مراقبت از خود و تعیین مرزها برای آرامش روانم ضروری است. همچنین فهمیدم که رشد شخصی یک فرآیند تدریجی است و باید به خودم فرصت بدهم."
                      </BaseParagraph>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <BaseCard 
                        v-for="insight in insightsData"
                        :key="insight.text"
                        class="border-muted-200 dark:border-muted-700 shadow-none border"
                      >
                        <div class="p-4">
                          <div class="flex items-start gap-3">
                            <div class="text-2xl shrink-0">{{ insight.icon }}</div>
                            <div>
                              <BaseParagraph size="sm" class="text-muted-800 dark:text-muted-100">
                                {{ insight.text }}
                              </BaseParagraph>
                            </div>
                          </div>
                        </div>
                      </BaseCard>
                    </div>
                  </div>
                  
                  <!-- Learnings Section -->
                  <div class="mb-8">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      یادگیری‌ها
                    </BaseHeading>
                    
                    <div class="bg-muted-50 dark:bg-muted-800/30 rounded-lg p-5 mb-6">
                      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 italic">
                        "در این جلسه مهارت‌هایی را تمرین کردم که می‌توانم در زندگی روزمره‌ام به کار ببرم و به تدریج اعتماد به نفس بیشتری پیدا کنم."
                      </BaseParagraph>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <BaseCard 
                        v-for="learning in learningsData"
                        :key="learning.text"
                        class="bg-white dark:bg-muted-800 p-4 rounded-lg shadow-sm"
                      >
                        <div class="flex flex-col items-center text-center">
                          <div class="text-3xl mb-3">{{ learning.icon }}</div>
                          <BaseHeading
                            tag="h4"
                            size="sm"
                            weight="medium"
                            class="mb-2"
                          >
                            {{ learning.text }}
                          </BaseHeading>
                        </div>
                      </BaseCard>
                    </div>
                  </div>
                  
                  <!-- Growth Tracking -->
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      ثبت پیشرفت شخصی
                    </BaseHeading>
                    
                    <div class="flex flex-wrap gap-3">
                      <BaseButton color="primary">
                        <Icon name="ph:star-duotone" class="me-2" />
                        ثبت بینش جدید
                      </BaseButton>
                      <BaseButton color="info">
                        <Icon name="ph:note-pencil-duotone" class="me-2" />
                        یادداشت یادگیری
                      </BaseButton>
                      <BaseButton color="success" flavor="pastel">
                        <Icon name="ph:chart-line-up-duotone" class="me-2" />
                        مشاهده روند پیشرفت
                      </BaseButton>
                    </div>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
          <!-- Team -->
          <div v-else-if="activeValue === 'team'">
            <div class="grid gap-6 sm:grid-cols-3">
              <BaseCard
                elevated-hover
                class="hover:!border-primary-500 relative"
              >
                <NuxtLink to="#">
                  <Icon
                    name="uiw:star-on"
                    class="text-primary-500 absolute end-6 top-6"
                  />
                  <div class="flex flex-col items-center p-5 sm:flex-row">
                    <div class="flex flex-col gap-3 sm:flex-row">
                      <BaseAvatar
                        :src="data?.project.owner.avatar"
                        :badge-src="data?.project.owner.badge"
                        :text="data?.project.owner.name"
                        size="lg"
                        class="bg-muted-500/20 text-muted-500"
                      />
                      <div class="text-center leading-none sm:text-left">
                        <h4
                          class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium"
                        >
                          {{ data?.project.owner.name }}
                        </h4>
                        <p class="text-muted-400 mb-2 font-sans text-xs">
                          Project owner
                        </p>
                        <p
                          class="text-muted-500 dark:text-muted-400 font-sans text-xs"
                        >
                          {{ data?.project.owner.bio }}
                        </p>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </BaseCard>
              <BaseCard
                v-for="item in data?.project.team"
                :key="item.id"
                elevated-hover
                class="hover:!border-primary-500"
              >
                <NuxtLink to="#">
                  <div class="flex flex-col items-center p-5 sm:flex-row">
                    <div class="flex flex-col gap-3 sm:flex-row">
                      <BaseAvatar
                        :src="item.src"
                        :badge-src="item.badge"
                        :text="item.text"
                        size="lg"
                        class="bg-muted-500/20 text-muted-500"
                      />
                      <div class="text-center leading-none sm:text-left">
                        <h4
                          class="text-muted-800 dark:text-muted-100 font-sans text-base font-medium"
                        >
                          {{ item.tooltip }}
                        </h4>
                        <p class="text-muted-400 mb-2 font-sans text-xs">
                          {{ item.role }}
                        </p>
                        <p
                          class="text-muted-500 dark:text-muted-400 font-sans text-xs"
                        >
                          {{ item.bio }}
                        </p>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </BaseCard>
              <!-- Invite -->
              <div>
                <button
                  type="button"
                  class="border-muted-300 dark:border-muted-800 hover:border-primary-500 dark:hover:border-primary-500 group flex size-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors duration-300"
                >
                  <span class="block text-center font-sans">
                    <span
                      class="text-muted-800 dark:text-muted-100 group-hover:text-primary-500 dark:group-hover:text-primary-500 block transition-colors duration-300"
                    >
                      Invite a new member
                    </span>
                    <span class="text-muted-400 block text-sm">
                      Send an invitation to join your project team
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <!-- Tasks -->
          <div v-else-if="activeValue === 'tasks'">
            <div class="grid gap-6 sm:grid-cols-3">
              <BaseCard
                v-for="item in data?.project.tasks"
                :key="item.id"
                elevated-hover
                class="hover:!border-primary-500 flex cursor-pointer flex-col"
                @click="openTaskPanel(item.id, data?.project?.tasks)"
              >
                <div class="flex flex-col items-center p-5 sm:flex-row">
                  <div class="flex flex-col gap-3 sm:flex-row">
                    <Icon
                      v-if="item.status === 0"
                      name="ph:plus-circle-duotone"
                      class="text-muted-400 size-6 shrink-0"
                    />
                    <Icon
                      v-else-if="item.status === 5"
                      name="ph:check-circle-duotone"
                      class="text-success-500 size-6 shrink-0"
                    />
                    <Icon
                      v-else-if="item.status === 1"
                      name="ph:timer-duotone"
                      class="text-muted-400 size-6 shrink-0"
                    />
                    <Icon
                      v-else-if="item.status === 2 || item.status === 3"
                      name="ph:warning-duotone"
                      class="text-warning-500 size-6 shrink-0"
                    />
                    <div class="text-center leading-none sm:text-left">
                      <h4
                        class="text-muted-800 dark:text-muted-100 mb-2 font-sans text-base font-medium leading-tight"
                      >
                        {{ item.name }}
                      </h4>
                      <p class="text-muted-400 line-clamp-2 font-sans text-xs">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-muted-50 dark:bg-muted-700/50 mt-auto flex items-center justify-between rounded-b-lg px-5 py-3"
                >
                  <div class="flex max-w-[180px] grow items-center gap-2">
                    <BaseAvatar
                      size="xxs"
                      :src="item.assignee.src"
                      :data-nui-tooltip="item.assignee.tooltip"
                    />
                    <BaseProgress
                      :value="item.completion"
                      size="xs"
                      :color="item.status === 5 ? 'success' : 'primary'"
                    />
                  </div>
                  <div class="text-muted-400 flex items-center gap-4">
                    <div class="flex items-center gap-1 text-sm">
                      <Icon name="ph:paperclip-duotone" class="size-4" />
                      <span class="font-sans">
                        {{ item.files.length }}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                      <Icon name="ph:chat-circle-duotone" class="size-4" />
                      <span class="font-sans">
                        {{ item.comments.length }}
                      </span>
                    </div>
                  </div>
                </div>
              </BaseCard>
              <!-- Invite -->
              <div>
                <button
                  type="button"
                  class="border-muted-300 dark:border-muted-800 hover:border-primary-500 dark:hover:border-primary-500 group flex size-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors duration-300"
                >
                  <span class="block text-center font-sans">
                    <span
                      class="text-muted-800 dark:text-muted-100 group-hover:text-primary-500 dark:group-hover:text-primary-500 block transition-colors duration-300"
                    >
                      Create a new task
                    </span>
                    <span class="text-muted-400 block text-sm">
                      Add a new task to your project
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <!-- Main Points Tab -->
          <div v-else-if="activeValue === 'mainpoints'">
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12">
                <BaseCard class="p-6">
                  <BaseHeading
                    tag="h2"
                    size="2xl"
                    weight="medium"
                    class="mb-6"
                  >
                    نکات کلیدی
                  </BaseHeading>
                  
                  <div class="mb-8 border-b border-muted-200 dark:border-muted-700 pb-8">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      تعیین مرزهای سالم
                    </BaseHeading>
                    
                    <div class="flex items-center gap-2 mb-4">
                      <div class="inline-block bg-primary-500/20 text-primary-500 dark:bg-primary-500/30 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                        اهمیت: بالا
                      </div>
                    </div>
                    
                    <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300 mb-6">
                      در این جلسه متوجه شدم که تعیین مرزهای سالم چگونه می‌تواند به بهبود روابط من با دیگران کمک کند. درباره موقعیت‌هایی که مرزهایم نقض شده بود صحبت کردم و احساساتم را بیان کردم. همچنین یاد گرفتم که احترام به مرزهای خودم نشانه خوددوستی است و به من احساس امنیت و آرامش بیشتری می‌دهد.
                    </BaseParagraph>
                    
                    <BaseHeading
                      tag="h4"
                      size="md"
                      weight="medium"
                      class="mb-3"
                    >
                      تکالیف مرتبط
                    </BaseHeading>
                    
                    <div class="space-y-3">
                      <BaseListItem
                        v-for="item in actionItems"
                        :key="item.title"
                        class="border-muted-200 dark:border-muted-700 rounded-lg border p-4"
                      >
                        <template #start>
                          <BaseCheckbox
                            :model-value="item.completed"
                            :color="item.completed ? 'success' : 'muted'"
                            class="me-2"
                          />
                        </template>
                        <div class="flex flex-1 flex-col">
                          <p class="text-muted-800 dark:text-muted-100 font-sans text-sm font-medium leading-tight">
                            <span>{{ item.icon }}</span> {{ item.title }}
                          </p>
                          <p class="text-muted-400 font-sans text-xs" v-if="item.dueDate">
                            <span class="me-1">
                              <Icon name="ph:calendar-duotone" class="size-3" />
                            </span>
                            <span>تا تاریخ {{ item.dueDate }}</span>
                          </p>
                        </div>
                      </BaseListItem>
                    </div>
                  </div>
                  
                  <BaseHeading
                    tag="h3"
                    size="lg"
                    weight="medium"
                    class="mb-4"
                  >
                    سایر نکات کلیدی جلسه
                  </BaseHeading>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <BaseCard 
                      v-for="point in mainPointsData"
                      :key="point.title"
                      class="border-muted-200 dark:border-muted-700 shadow-none border"
                    >
                      <div class="p-4">
                        <div class="flex items-center gap-2 mb-2">
                          <div class="text-2xl">{{ point.icon }}</div>
                          <BaseHeading
                            tag="h4"
                            size="md"
                            weight="medium"
                          >
                            {{ point.title }}
                          </BaseHeading>
                        </div>
                        <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                          {{ point.description }}
                        </BaseParagraph>
                      </div>
                    </BaseCard>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
          <!-- Therapeutic Relationship Tab -->
          <div v-else-if="activeValue === 'therapeutic'">
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12">
                <BaseCard class="p-6">
                  <BaseHeading
                    tag="h2"
                    size="2xl"
                    weight="medium"
                    class="mb-6"
                  >
                    ارتباط درمانی
                  </BaseHeading>
                  
                  <!-- Relationship Metrics -->
                  <div class="mb-8 border-b border-muted-200 dark:border-muted-700 pb-8">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-6"
                    >
                      وضعیت کنونی ارتباط
                    </BaseHeading>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-5 text-center">
                        <div class="bg-primary-100 dark:bg-primary-900/30 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                          <Icon name="ph:chat-circle-text-duotone" class="text-primary-500 size-8" />
                        </div>
                        <BaseHeading
                          tag="h4"
                          size="md"
                          weight="medium"
                          class="mb-2"
                        >
                          کیفیت ارتباط
                        </BaseHeading>
                        <div class="text-primary-500 dark:text-primary-400 text-lg font-medium mb-2">
                          خوب
                        </div>
                        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                          ارتباط مؤثر با بازخورد مثبت از هر دو طرف
                        </BaseParagraph>
                      </div>
                      
                      <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-5 text-center">
                        <div class="bg-warning-100 dark:bg-warning-900/30 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                          <Icon name="ph:brain-duotone" class="text-warning-500 size-8" />
                        </div>
                        <BaseHeading
                          tag="h4"
                          size="md"
                          weight="medium"
                          class="mb-2"
                        >
                          سطح درک متقابل
                        </BaseHeading>
                        <div class="text-warning-500 dark:text-warning-400 text-lg font-medium mb-2">
                          متوسط
                        </div>
                        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                          در حال ساخت درک عمیق‌تر از احساسات و نیازها
                        </BaseParagraph>
                      </div>
                      
                      <div class="bg-muted-100 dark:bg-muted-800 rounded-lg p-5 text-center">
                        <div class="bg-info-100 dark:bg-info-900/30 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                          <Icon name="ph:handshake-duotone" class="text-info-500 size-8" />
                        </div>
                        <BaseHeading
                          tag="h4"
                          size="md"
                          weight="medium"
                          class="mb-2"
                        >
                          سطح اعتماد
                        </BaseHeading>
                        <div class="text-info-500 dark:text-info-400 text-lg font-medium mb-2">
                          در حال رشد
                        </div>
                        <BaseParagraph size="sm" class="text-muted-500 dark:text-muted-400">
                          اعتماد در حال شکل‌گیری با پیشرفت در هر جلسه
                        </BaseParagraph>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Next Steps -->
                  <div class="mb-8 border-b border-muted-200 dark:border-muted-700 pb-8">
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      گام‌های بعدی برای بهبود ارتباط
                    </BaseHeading>
                    
                    <div class="bg-muted-50 dark:bg-muted-800/30 rounded-lg p-5 mb-6">
                      <BaseParagraph size="sm" class="text-muted-600 dark:text-muted-300">
                        می‌خواهم ارتباطم با درمانگرم را بازتر و شفاف‌تر کنم تا بهتر بتوانم پیشرفت کنم. گاهی هنوز احساس خجالت دارم اما تصمیم دارم این احساس را مدیریت کنم و بیشتر به خودم اعتماد کنم.
                      </BaseParagraph>
                    </div>
                    
                    <div class="space-y-4">
                      <BaseListItem
                        v-for="step in relationshipSteps"
                        :key="step.title"
                        class="bg-white dark:bg-muted-800 rounded-lg p-4 border border-muted-200 dark:border-muted-700 shadow-sm"
                      >
                        <template #start>
                          <div class="text-xl me-3">{{ step.icon }}</div>
                        </template>
                        
                        <BaseHeading
                          tag="h4"
                          size="sm"
                          weight="medium"
                          class="mb-1"
                        >
                          {{ step.title }}
                        </BaseHeading>
                      </BaseListItem>
                    </div>
                  </div>
                  
                  <!-- Historical Progress -->
                  <div>
                    <BaseHeading
                      tag="h3"
                      size="lg"
                      weight="medium"
                      class="mb-4"
                    >
                      پیشرفت ارتباط درمانی در طول زمان
                    </BaseHeading>
                    
                    <div class="flex items-center mb-6">
                      <div class="w-full max-w-md">
                        <div class="flex justify-between mb-2">
                          <div class="text-muted-400 text-xs">جلسه اول</div>
                          <div class="text-muted-400 text-xs">جلسه هفتم (کنونی)</div>
                        </div>
                        <div class="h-2 bg-muted-200 dark:bg-muted-700 rounded-full overflow-hidden">
                          <div class="bg-gradient-to-r from-info-300 to-primary-500 h-full rounded-full" style="width: 65%"></div>
                        </div>
                      </div>
                      <div class="ms-4">
                        <div class="text-primary-500 dark:text-primary-400 text-lg font-medium">65%</div>
                        <div class="text-muted-400 text-xs">پیشرفت</div>
                      </div>
                    </div>
                    
                    <BaseButton color="primary">
                      <Icon name="ph:chat-centered-dots-duotone" class="me-2" />
                      یادداشت بازخورد برای درمانگر
                    </BaseButton>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
          <!-- Homeworks Tab -->
          <div v-else-if="activeValue === 'homeworks'">
            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12">
                <BaseCard class="p-6">
                  <div class="flex justify-between items-center mb-6">
                    <BaseHeading
                      tag="h2"
                      size="2xl"
                      weight="medium"
                    >
                      تکالیف
                    </BaseHeading>
                    <BaseButton color="primary" flavor="outline" class="rtl:ml-2 ltr:mr-2">
                      <span class="flex items-center gap-2">
                        <Icon name="ph:plus-duotone" class="size-4" />
                        <span>افزودن تکلیف جدید</span>
                      </span>
                    </BaseButton>
                  </div>
                  
                  <!-- Filter Options -->
                  <div class="flex flex-wrap gap-2 mb-6">
                    <BaseTag 
                      color="muted"
                      flavor="pastel"
                      size="md"
                      class="cursor-pointer"
                      :class="{ 'bg-primary-500 text-white dark:bg-primary-500 dark:text-white': activeFilter === 'all' }"
                      @click="activeFilter = 'all'"
                    >
                      همه
                    </BaseTag>
                    <BaseTag 
                      color="success"
                      flavor="pastel"
                      size="md"
                      class="cursor-pointer"
                      :class="{ 'bg-success-500 text-white dark:bg-success-500 dark:text-white': activeFilter === 'completed' }"
                      @click="activeFilter = 'completed'"
                    >
                      تکمیل شده
                    </BaseTag>
                    <BaseTag 
                      color="danger"
                      flavor="pastel"
                      size="md"
                      class="cursor-pointer"
                      :class="{ 'bg-danger-500 text-white dark:bg-danger-500 dark:text-white': activeFilter === 'pending' }"
                      @click="activeFilter = 'pending'"
                    >
                      در انتظار
                    </BaseTag>
                    <BaseTag 
                      color="warning"
                      flavor="pastel"
                      size="md"
                      class="cursor-pointer"
                      :class="{ 'bg-warning-500 text-white dark:bg-warning-500 dark:text-white': activeFilter === 'upcoming' }"
                      @click="activeFilter = 'upcoming'"
                    >
                      آینده
                    </BaseTag>
                  </div>
                  
                  <!-- Homeworks List -->
                  <div class="space-y-4">
                    <BaseCard 
                      v-for="(homework, index) in filteredHomeworks"
                      :key="index"
                      class="border-muted-200 dark:border-muted-700 shadow-none border"
                    >
                      <div class="p-4">
                        <div class="flex items-start justify-between">
                          <div class="flex items-start gap-3">
                            <div class="mt-0.5">
                              <BaseCheckbox 
                                v-model="homework.completed" 
                                :color="homework.completed ? 'success' : 'muted'"
                                class="h-5 w-5"
                              />
                            </div>
                            <div>
                              <p class="text-muted-800 dark:text-muted-100 font-sans text-sm font-medium leading-tight flex items-center gap-2">
                                <span>{{ homework.icon }}</span> 
                                <span :class="{ 'line-through text-muted-400': homework.completed }">{{ homework.title }}</span>
                              </p>
                              <div class="flex items-center gap-4 mt-2 text-muted-400 text-xs">
                                <span class="flex items-center gap-1" v-if="homework.dueDate">
                                  <Icon name="ph:calendar-duotone" class="size-3.5" />
                                  <span>تا تاریخ {{ homework.dueDate }}</span>
                                </span>
                                <span class="flex items-center gap-1">
                                  <Icon name="ph:tag-duotone" class="size-3.5" />
                                  <span>مرزهای سالم</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            <BaseButton color="info" flavor="ghost" shape="circle" size="xs">
                              <Icon name="ph:pencil-duotone" class="size-4" />
                            </BaseButton>
                            <BaseButton color="danger" flavor="ghost" shape="circle" size="xs">
                              <Icon name="ph:trash-duotone" class="size-4" />
                            </BaseButton>
                          </div>
                        </div>
                      </div>
                    </BaseCard>
                  </div>
                  
                  <!-- No Homeworks State -->
                  <div v-if="filteredHomeworks.length === 0" class="text-center py-8">
                    <div class="text-muted-400 mb-2">
                      <Icon name="ph:clipboard-text-duotone" class="size-12 mx-auto" />
                    </div>
                    <p class="text-muted-500 dark:text-muted-400 mb-2">هیچ تکلیفی یافت نشد</p>
                    <BaseButton color="primary" flavor="outline" size="sm">
                      افزودن تکلیف جدید
                    </BaseButton>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
        </template>
      </BaseTabs>
    </div>
  </div>
</template>
