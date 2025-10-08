<script setup lang="ts">
definePageMeta({
  title: 'تنظیمات امنیت',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const { user } = useUser()
const { getUserAvatarUrl } = useAvatarManager()
</script>

<template>
  <div class="mx-auto w-full max-w-3xl">
    <BaseCard rounded="lg" class="p-6">
      <div class="mb-6">
        <BaseHeading tag="h3" size="lg" weight="semibold" class="text-muted-800 dark:text-white">
          تنظیمات امنیت حساب
        </BaseHeading>
        <BaseParagraph size="sm" class="text-muted-500 mt-2">
          مدیریت امنیت حساب کاربری شما
        </BaseParagraph>
      </div>



      <!-- Additional Security Settings Can Be Added Here -->
      <div>
        <BaseHeading tag="h4" size="md" weight="medium" class="text-muted-800 dark:text-white mb-4">
          سایر تنظیمات امنیتی
        </BaseHeading>
        
        <BaseParagraph size="sm" class="text-muted-500 mb-4">
          تنظیمات بیشتر امنیتی در آینده اضافه خواهند شد
        </BaseParagraph>
      </div>
    </BaseCard>
  </div>
</template>