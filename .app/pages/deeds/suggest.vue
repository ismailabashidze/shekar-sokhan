<script setup lang="ts">
import type { Deed, DeedStepData } from '../types';

definePageMeta({
  layout: 'empty',
});
useHead({
  titleTemplate: title => `${title} | پیشنهاد کار نیک - مرحله ${currentStepId.value + 1}`,
  htmlAttrs: { dir: 'rtl' },
});

const initialState = ref<Deed>({
  type: undefined,
  title: '',
  description: '',
  startDate: undefined,
  endDate: undefined,
  category: {
    name: undefined,
    icon: undefined,
    difficulty: undefined,
  },
  evidence: null,
  avatar: null,
  beneficiaries: [],
  requirements: [],
  reward: 'کم',
});

const toaster = useToaster();

const { handleSubmit, currentStepId } = provideMultiStepForm({
  initialState,
  steps: [
    {
      to: '/deeds/suggest',
      meta: {
        name: 'نوع کار نیک',
        title: 'انتخاب نوع کار نیک',
        subtitle: 'نوع کار نیکی که می‌خواهید پیشنهاد دهید را انتخاب کنید',
      },
      validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['type']);
        if (!data.value.type) {
          setFieldError('type', 'لطفا یک نوع را انتخاب کنید');
        }
      },
    },
    {
      to: '/deeds/suggest/step-2',
      meta: {
        name: 'اطلاعات کار نیک',
        title: 'این کار نیک درباره چیست؟',
        subtitle: 'با افزودن تمام اطلاعات مرتبط، کار نیک را بهتر مدیریت کنید',
      },
      validate({ data, setFieldError, resetFieldError }) {
        resetFieldError(['title']);
        if (!data.value.title) {
          setFieldError('title', 'لطفا یک عنوان وارد کنید');
        }
      },
    },
    {
      to: '/deeds/suggest/step-3',
      meta: {
        name: 'جزئیات کار نیک',
        title: 'افزودن جزئیات بیشتر',
        subtitle: 'جزئیات مفید را به کار نیک خود اضافه کنید. بعداً می‌توانید آن را ویرایش کنید',
      },
    },
    {
      to: '/deeds/suggest/step-4',
      meta: {
        name: 'مستندات کار نیک',
        title: 'افزودن مستندات به این کار نیک',
        subtitle: 'یا می‌توانید از این مرحله بگذرید. همیشه می‌توانید بعداً مستندات بیشتری اضافه کنید',
      },
    },
    {
      to: '/deeds/suggest/step-5',
      meta: {
        name: 'ذینفعان',
        title: 'چگونه انجام دهنده از این عمل نیک بهره مند می شود؟',
        subtitle: 'به آورده های غیر مادی این کار برای خودتان فکر کنید',
      },
    },
    {
      to: '/deeds/suggest/step-6',
      meta: {
        name: 'نیازمندی‌ها',
        title: 'چه چیزهایی برای انجام این کار نیک نیاز است؟',
        subtitle: 'مجموعه‌ای از نیازمندی‌هایی که برای انجام این کار نیک لازم است را انتخاب کنید',
      },
    },
    {
      to: '/deeds/suggest/step-7',
      meta: {
        preview: true,
        name: 'پایان',
        title: 'مطمئن شوید همه چیز درست است',
        subtitle: 'اگر نیاز به ویرایش دارید، می‌توانید به مراحل قبلی برگردید',
      },
    },
  ],
  onSubmit: async (state, ctx) => {
    await new Promise(resolve => setTimeout(resolve, 4000));

    toaster.clearAll();
    toaster.show({
      title: 'موفقیت',
      message: `کار نیک ${state.title} ایجاد شد!`,
      color: 'success',
      icon: 'ph:check',
      closable: true,
    });
  },
  onError: (error) => {
    toaster.clearAll();
    toaster.show({
      title: 'خطا!',
      message: error.message,
      color: 'danger',
      icon: 'lucide:alert-triangle',
      closable: true,
    });
  },
});
</script>

<template>
  <TairoSidebarLayout
    :toolbar="false"
    :sidebar="false"
    class="bg-muted-100 dark:bg-muted-900 min-h-screen w-full"
  >
    <template #logo>
      <NuxtLink
        to="/"
        class="text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300"
        @click.prevent="$router.back()"
      >
        <Icon name="lucide:arrow-right" class="size-5" />
      </NuxtLink>
    </template>

    <DemoWizardNavigation />

    <form
      action=""
      method="POST"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div class="pb-32 pt-24">
        <NuxtPage />
      </div>
      <DemoWizardButtons />
    </form>
  </TairoSidebarLayout>
</template>
