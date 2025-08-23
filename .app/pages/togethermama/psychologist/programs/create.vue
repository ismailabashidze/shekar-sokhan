<script setup lang="ts">
definePageMeta({
  title: 'ایجاد برنامه - TogetherMama',
  layout: 'sidebar',
})

useHead({ htmlAttrs: { dir: 'rtl' } })

const program = ref({
  title: '',
  description: '',
  category: '',
  duration: '',
  sessions: 0,
  price: '',
  targetAge: '',
  goals: [''] as string[],
  materials: [''] as string[],
})

const addGoal = () => {
  program.value.goals.push('')
}

const removeGoal = (index: number) => {
  if (program.value.goals.length > 1) {
    program.value.goals.splice(index, 1)
  }
}

const addMaterial = () => {
  program.value.materials.push('')
}

const removeMaterial = (index: number) => {
  if (program.value.materials.length > 1) {
    program.value.materials.splice(index, 1)
  }
}

const createProgram = () => {
  // Mock create program functionality
  alert('برنامه با موفقیت ایجاد شد')
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
      
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-muted-800 dark:text-white"
      >
        ایجاد برنامه جدید
      </BaseHeading>
      <BaseParagraph class="text-muted-500">
        طراحی یک برنامه تخصصی برای رشد کودکان
      </BaseParagraph>
    </div>

    <BaseCard class="p-6">
      <form @submit.prevent="createProgram">
        <div class="space-y-6">
          <!-- Basic Info -->
          <div>
            <BaseHeading as="h2" size="lg" weight="semibold" class="mb-4 text-muted-800 dark:text-white">
              اطلاعات پایه
            </BaseHeading>
            
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <BaseInput
                v-model="program.title"
                label="عنوان برنامه"
                placeholder="عنوان برنامه را وارد کنید"
                shape="curved"
                required
              />
              
              <BaseSelect
                v-model="program.category"
                label="دسته‌بندی"
                shape="curved"
                required
              >
                <option value="">انتخاب دسته‌بندی</option>
                <option value="growth">رشد کودک</option>
                <option value="behavioral">رفتاری</option>
                <option value="educational">آموزشی</option>
                <option value="social">اجتماعی</option>
                <option value="emotional">احساسی</option>
              </BaseSelect>
              
              <BaseInput
                v-model="program.duration"
                label="مدت زمان کل (هفته)"
                type="number"
                placeholder="تعداد هفته‌ها"
                shape="curved"
                required
              />
              
              <BaseInput
                v-model="program.sessions"
                label="تعداد جلسات"
                type="number"
                placeholder="تعداد جلسات"
                shape="curved"
                required
              />
              
              <BaseInput
                v-model="program.price"
                label="قیمت (تومان)"
                type="number"
                placeholder="قیمت برنامه"
                shape="curved"
                required
              />
              
              <BaseInput
                v-model="program.targetAge"
                label="رده سنی هدف"
                placeholder="مثال: ۳-۶ سال"
                shape="curved"
                required
              />
            </div>
            
            <div class="mt-5">
              <BaseTextarea
                v-model="program.description"
                label="توضیحات"
                placeholder="توضیحات کامل درباره برنامه..."
                rows="4"
                required
              />
            </div>
          </div>

          <!-- Goals -->
          <div>
            <div class="mb-4 flex items-center justify-between">
              <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
                اهداف برنامه
              </BaseHeading>
              <BaseButton size="sm" color="primary" variant="outline" @click="addGoal">
                <Icon name="ph:plus" class="ml-2 size-4" />
                افزودن هدف
              </BaseButton>
            </div>
            
            <div class="space-y-3">
              <div
                v-for="(goal, index) in program.goals"
                :key="index"
                class="flex items-center gap-3"
              >
                <BaseInput
                  v-model="program.goals[index]"
                  :label="`هدف ${index + 1}`"
                  placeholder="هدف برنامه را وارد کنید"
                  shape="curved"
                  class="flex-1"
                />
                <BaseButtonIcon
                  v-if="program.goals.length > 1"
                  size="md"
                  color="danger"
                  @click="removeGoal(index)"
                >
                  <Icon name="ph:trash" class="size-4" />
                </BaseButtonIcon>
              </div>
            </div>
          </div>

          <!-- Materials -->
          <div>
            <div class="mb-4 flex items-center justify-between">
              <BaseHeading as="h2" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
                مواد و منابع مورد نیاز
              </BaseHeading>
              <BaseButton size="sm" color="primary" variant="outline" @click="addMaterial">
                <Icon name="ph:plus" class="ml-2 size-4" />
                افزودن ماده
              </BaseButton>
            </div>
            
            <div class="space-y-3">
              <div
                v-for="(material, index) in program.materials"
                :key="index"
                class="flex items-center gap-3"
              >
                <BaseInput
                  v-model="program.materials[index]"
                  :label="`ماده ${index + 1}`"
                  placeholder="ماده یا منبع مورد نیاز را وارد کنید"
                  shape="curved"
                  class="flex-1"
                />
                <BaseButtonIcon
                  v-if="program.materials.length > 1"
                  size="md"
                  color="danger"
                  @click="removeMaterial(index)"
                >
                  <Icon name="ph:trash" class="size-4" />
                </BaseButtonIcon>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="flex justify-end pt-4">
            <BaseButton
              type="submit"
              color="primary"
              size="lg"
            >
              ایجاد برنامه
            </BaseButton>
          </div>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
