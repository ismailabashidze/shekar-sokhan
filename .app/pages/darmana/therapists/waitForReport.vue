<script setup lang="ts">
import HorizontalSideBar from '~/components/global/HorizontalSideBar.vue'

definePageMeta({
  title: 'در حال آماده سازی گزارش',
  // layout: 'sidebar',
  layout: 'empty',
  preview: {
    title: 'در حال آماده سازی گزارش',
    description: 'گزارش جلسه در حال آماده سازی است. لطفا صبر کنید.',
    categories: ['layouts', 'profile'],
    src: '/img/screens/layouts-subpages-notifications.png',
    srcDark: '/img/screens/layouts-subpages-notifications-dark.png',
    order: 80,
  },
})
useHead({ htmlAttrs: { dir: 'rtl' } })

</script>

<template>
  <div class="flex flex-col md:flex-row">
    <VerticalSideBar />
    <HorizontalSideBar />
    <div class="grow">
      <FullscreenLoading loader-type="user" />
      <div class="m-5">
        <BaseMessage color="primary" class="align-center justify-center">
          <div class="m-3 text-center text-lg">
            هوش مصنوعی در حال طراحی گزارش شماست. به محض آماده شدن، از طریق پیامک، رایانامه و پیام درون برنامه ای به شما اطلاع رسانی خواهد شد.
          </div>
        </BaseMessage>
      </div>
    </div>
  </div>
</template>
