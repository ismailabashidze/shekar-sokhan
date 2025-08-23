<script setup lang="ts">
definePageMeta({
  title: 'جزئیات برنامه - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const route = useRoute()
const programId = route.params.id

const program = ref({
  id: programId,
  title: 'برنامه رشد اجتماعی کودکان',
  description: 'این برنامه برای کمک به کودکان در تقویت مهارت‌های اجتماعی و ارتباطی طراحی شده است. برنامه شامل جلسات تعاملی و بازی‌های گروهی است که به کودکان کمک می‌کند با دیگران ارتباط برقرار کنند و رفتارهای اجتماعی مناسب یاد بگیرند.',
  category: 'اجتماعی',
  duration: '۸ هفته',
  sessions: 12,
  price: '1,200,000',
  targetAge: '۴-۸ سال',
  goals: [
    'تقویت مهارت‌های ارتباطی کودک',
    'افزایش اعتماد به نفس در تعاملات اجتماعی',
    'یادگیری حل تعارض و همکاری',
    'توسعه همدلی و درک احساسات دیگران',
  ],
  materials: [
    'کارت‌های احساسات',
    'بازی‌های گروهی',
    'دفترچه فعالیت‌های خانگی',
    'راهنمای والدین',
  ],
  createdAt: '۱۴۰۳/۰۳/۱۵',
  status: 'active',
})

const editProgram = () => {
  // Mock edit program functionality
  alert('ویرایش برنامه')
}

const deleteProgram = () => {
  // Mock delete program functionality
  if (confirm('آیا مطمئن هستید که می‌خواهید این برنامه را حذف کنید؟')) {
    alert('برنامه حذف شد')
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink
        to="/togethermama/psychologist/programs"
        class="text-muted-400 hover:text-primary-500 mb-4 inline-flex items-center gap-2 font-sans font-medium transition-colors duration-300"
      >
        <Icon name="gg:arrow-long-right" class="size-5" />
        <span>بازگشت به لیست برنامه‌ها</span>
      </NuxtLink>
      
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <BaseHeading
            as="h1"
            size="2xl"
            weight="bold"
            class="text-muted-800 dark:text-white"
          >
            {{ program.title }}
          </BaseHeading>
          <BaseParagraph class="text-muted-500">
            جزئیات برنامه
          </BaseParagraph>
        </div>
        <div class="flex gap-3">
          <BaseButton color="muted" variant="outline" @click="editProgram">
            <Icon name="ph:pencil-simple" class="ml-2 size-4" />
            ویرایش
          </BaseButton>
          <BaseButton color="danger" variant="outline" @click="deleteProgram">
            <Icon name="ph:trash" class="ml-2 size-4" />
            حذف
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Program Details -->
      <div class="lg:col-span-2">
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-6 text-muted-800 dark:text-white">
            اطلاعات برنامه
          </BaseHeading>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                عنوان
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ program.title }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                دسته‌بندی
              </BaseHeading>
              <BaseTag color="primary" variant="pastel">
                {{ program.category }}
              </BaseTag>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                مدت زمان
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ program.duration }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                تعداد جلسات
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ program.sessions }} جلسه
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                قیمت
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ program.price }} تومان
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                رده سنی هدف
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ program.targetAge }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                تاریخ ایجاد
              </BaseHeading>
              <BaseParagraph class="text-muted-800 dark:text-white">
                {{ program.createdAt }}
              </BaseParagraph>
            </div>
            
            <div>
              <BaseHeading as="h3" size="sm" weight="medium" class="text-muted-500 mb-1">
                وضعیت
              </BaseHeading>
              <BaseTag
                :color="program.status === 'active' ? 'success' : 'muted'"
                variant="pastel"
              >
                {{ program.status === 'active' ? 'فعال' : 'غیرفعال' }}
              </BaseTag>
            </div>
          </div>
        </BaseCard>

        <!-- Description -->
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            توضیحات
          </BaseHeading>
          <BaseParagraph class="text-muted-600 dark:text-muted-300">
            {{ program.description }}
          </BaseParagraph>
        </BaseCard>

        <!-- Goals -->
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            اهداف برنامه
          </BaseHeading>
          <ul class="space-y-3">
            <li
              v-for="(goal, index) in program.goals"
              :key="index"
              class="flex items-start gap-3"
            >
              <Icon name="ph:check-circle" class="text-success-500 mt-0.5 size-5" />
              <span class="text-muted-600 dark:text-muted-300">{{ goal }}</span>
            </li>
          </ul>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div>
        <!-- Materials -->
        <BaseCard class="mb-6 p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            مواد و منابع مورد نیاز
          </BaseHeading>
          <ul class="space-y-3">
            <li
              v-for="(material, index) in program.materials"
              :key="index"
              class="flex items-start gap-3"
            >
              <Icon name="ph:file-text" class="text-muted-500 mt-0.5 size-5" />
              <span class="text-muted-600 dark:text-muted-300">{{ material }}</span>
            </li>
          </ul>
        </BaseCard>

        <!-- Actions -->
        <BaseCard class="p-6">
          <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
            عملیات
          </BaseHeading>
          
          <div class="space-y-3">
            <BaseButton color="primary" class="w-full">
              <Icon name="ph:users" class="ml-2 size-4" />
              اختصاص به مادران
            </BaseButton>
            <BaseButton color="muted" variant="outline" class="w-full">
              <Icon name="ph:copy" class="ml-2 size-4" />
              کپی برنامه
            </BaseButton>
            <BaseButton color="muted" variant="outline" class="w-full">
              <Icon name="ph:chart-bar" class="ml-2 size-4" />
              گزارش استفاده
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
