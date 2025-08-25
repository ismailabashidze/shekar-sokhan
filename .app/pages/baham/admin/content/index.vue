<script setup lang="ts">
definePageMeta({
  title: 'مدیریت محتوا - با هم',
  layout: 'sidebar'
})

useHead({
  title: 'مدیریت محتوا - با هم',
  meta: [
    { name: 'description', content: 'مدیریت محتوای پلتفرم با هم' }
  ]
})

const contentPages = [
  {
    id: 'about',
    title: 'درباره ما',
    lastModified: new Date('2023-06-01')
  },
  {
    id: 'contact',
    title: 'تماس با ما',
    lastModified: new Date('2023-05-28')
  },
  {
    id: 'faq',
    title: 'سوالات متداول',
    lastModified: new Date('2023-06-05')
  }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <BaseHeading tag="h1" size="2xl" weight="bold" class="text-muted-800 dark:text-white">
          مدیریت محتوا
        </BaseHeading>
        <BaseParagraph size="md" class="text-muted-500 dark:text-muted-400 mt-2">
          مدیریت صفحات ایستا پلتفرم
        </BaseParagraph>
      </div>
      <div class="mt-4 sm:mt-0">
        <BaseButton color="primary">
          <Icon name="ph:plus-duotone" class="size-5 mr-2" />
          افزودن صفحه جدید
        </BaseButton>
      </div>
    </div>
    
    <!-- Content Pages List -->
    <BaseCard rounded="lg" class="dark:!bg-muted-900">
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BaseCard 
            v-for="page in contentPages" 
            :key="page.id" 
            rounded="md" 
            class="dark:!bg-muted-800 hover:shadow-lg transition-shadow"
          >
            <div class="p-5">
              <div class="flex items-start">
                <div class="nui-mask nui-mask-hexed bg-primary-500/10 flex size-12 items-center justify-center mr-4">
                  <Icon 
                    :name="page.id === 'about' ? 'ph:info-duotone' : 
                           page.id === 'contact' ? 'ph:phone-duotone' : 
                           'ph:question-duotone'" 
                    class="text-primary-500 size-6" 
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <BaseHeading tag="h3" size="md" weight="semibold" class="text-muted-800 dark:text-white mb-1">
                    {{ page.title }}
                  </BaseHeading>
                  <BaseParagraph size="xs" class="text-muted-500 dark:text-muted-400">
                    آخرین ویرایش: {{ new Date(page.lastModified).toLocaleDateString('fa-IR') }}
                  </BaseParagraph>
                </div>
              </div>
              <div class="mt-4">
                <NuxtLink :to="`/baham/admin/content/edit?id=${page.id}`">
                  <BaseButton color="primary" size="sm" outlined class="w-full">
                    ویرایش
                  </BaseButton>
                </NuxtLink>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </BaseCard>
  </div>
</template>