<script setup lang="ts">
definePageMeta({
  title: 'ویرایش محتوا - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'ویرایش محتوا - با هم',
  meta: [
    { name: 'description', content: 'ویرایش محتوای پلتفرم با هم' }
  ]
})

const route = useRoute()

// Mock content data
const contentData = ref({
  id: route.query.id || 'new',
  title: route.query.id === 'about' ? 'درباره ما' : 
         route.query.id === 'contact' ? 'تماس با ما' : 
         route.query.id === 'faq' ? 'سوالات متداول' : '',
  content: route.query.id === 'about' ? 'متن صفحه درباره ما...' : 
           route.query.id === 'contact' ? 'متن صفحه تماس با ما...' : 
           route.query.id === 'faq' ? 'متن صفحه سوالات متداول...' : ''
})

const saving = ref(false)

const saveContent = async () => {
  saving.value = true
  try {
    // In a real app, this would be an API call
    // await $fetch(`/api/content/${contentData.value.id}`, { method: 'PUT', body: contentData.value })
    alert('محتوا با موفقیت ذخیره شد')
  } catch (error) {
    alert('خطا در ذخیره محتوا')
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
          ویرایش محتوا
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          ویرایش محتوای صفحه "{{ contentData.title }}"
        </BaseParagraph>
      </div>
      <div class="mt-4 flex space-x-3 rtl:space-x-reverse sm:mt-0">
        <NuxtLink to="/baham/admin/content">
          <BaseButton color="default" outlined>
            <Icon name="ph:x-duotone" class="size-5 mr-2" />
            لغو
          </BaseButton>
        </NuxtLink>
        <BaseButton 
          @click="saveContent" 
          :loading="saving"
          color="primary"
        >
          <Icon name="ph:floppy-disk-duotone" class="size-5 mr-2" />
          {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
        </BaseButton>
      </div>
    </div>
    
    <BaseCard rounded="lg" class="dark:!bg-muted-900">
      <div class="p-6">
        <div class="grid grid-cols-1 gap-6">
          <TairoFormGroup label="عنوان صفحه">
            <BaseInput
              v-model="contentData.title"
              placeholder="عنوان صفحه را وارد کنید"
              rounded="sm"
              :classes="{
                wrapper: 'w-full'
              }"
            />
          </TairoFormGroup>
          
          <TairoFormGroup label="محتوای صفحه">
            <BaseTextarea
              v-model="contentData.content"
              placeholder="محتوای صفحه را وارد کنید..."
              rows="15"
              rounded="sm"
              :classes="{
                wrapper: 'w-full'
              }"
            />
            <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400 mt-2">
              می‌توانید از HTML برای قالب‌بندی محتوا استفاده کنید
            </BaseParagraph>
          </TairoFormGroup>
        </div>
      </div>
    </BaseCard>
  </div>
</template>