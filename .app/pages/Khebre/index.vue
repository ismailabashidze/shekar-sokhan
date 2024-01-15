<script setup lang="ts">
definePageMeta({
  title: 'خبره',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const seamless = useSeamless()

const { translated, isTranslating, translateS2T } = seamless

const voice = ref<FileList | null>(null)
const isLoading = ref(false)

const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
const back = () => {
  navigateTo('/choose')
}
const upload = async () => {
  isLoading.value = true
  const fd = new FormData()
  const name = new Date().getTime().toString()
  // fd.append(name, voice.value[0])
  // const res = await useFetch('/api/upload', {
  //   method: 'POST',
  //   body: fd,
  //   headers: { 'cache-control': 'no-cache' },
  // })

  translateS2T(name, 'Western Persian', 'English')
  isLoading.value = false
  // upload file
  // chunk it to 1 mins
  // upload 1 mins to translate
  // when Done, put together chunks to make a rough english translation
  // give rough translate to clean up
  // summerize
  // give it back.
}
</script>

<template>
  <div class="w-full flex flex-row-reverse mb-5 gap-3">
    <BaseButton
      color="primary"
      @click="upload"
      :loading="isLoading"
      :disabled="!voice || isLoading"
      >آپلود فایل</BaseButton
    >
    <BaseButton @click="back">بازگشت</BaseButton>
  </div>
  <div class="font-thin mb-5 mt-0">
    خبره اولین خلاصه ساز، و مستند ساز صوت جلسات است که با پردازش معنایی از صوت
    (که در حال حاضر جلسه فرض می شود) اطلاعات معنایی آن را استخراج و در فرمت
    نوشتاری در اختیار قرار می دهد. خبره در زمینه ی معنایی فعالیت می کند و
    اطلاعات را از صوت فارسی، به نوشته ی فارسی تبدیل می کند. این کار را با سرویس
    ترجمان (دیگر سرویس از مجموعه ی سرویس های هوش مصنوعی این پنل) انجام می دهد.
    سپس با استفاده از توانمندی خود در درک و تحلیل زبان فارسی آن را تحلیل و صورت
    جلسه را آماده می کند.
  </div>

  <div class="mt-4 w-full grid grid-cols-1 gap-6">
    <BaseInputFile
      v-model="voice"
      shape="straight"
      label="فایل صوتی جلسه"
      :loading="isLoading"
    />
  </div>
</template>
