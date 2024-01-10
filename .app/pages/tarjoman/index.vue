<script setup lang="ts">
definePageMeta({
  title: 'شکر سخن',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const seamless = useSeamless()

const { translated, isTranslating, translate } = seamless

const msg = ref('')
const faToEn = ref(true)
const canNotSend = ref(true)

const MSG_LIMIT = 1000

const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
const back = () => {
  navigateTo('/choose')
}
const sendToTranslate = async () => {
  canNotSend.value = true
  translate(
    msg.value,
    faToEn.value ? 'Western Persian' : 'English',
    faToEn.value ? 'English' : 'Western Persian',
  )
  await sleep(1000)
  canNotSend.value = false
}
const changeLang = () => {
  faToEn.value = !faToEn.value
  msg.value = ''
  translated.value = ''
}
const lengthCheck = () => {
  if (msg.value.length >= MSG_LIMIT)
    return 'متن نمی تواند از دویست حرف بیشتر باشد'
  return false
}

watch(msg, (newValue: string, oldValue: string) => {
  if (newValue.length > MSG_LIMIT) {
    canNotSend.value = true
  } else {
    canNotSend.value = false
  }
})
</script>

<template>
  <div class="w-full flex flex-row-reverse mb-5">
    <BaseButton @click="back">بازگشت</BaseButton>
  </div>
  <div class="font-thin mb-5 mt-0">
    ترجمان اولین نرم افزار توسعه داده شده در این مجموعه، وظیفه ی ترجمه ی فارسی
    به انگلیسی و بالعکس را به عهده دارد. متن وارد شده نباید بیشتر از دویست کلمه
    باشد. پس از نوشتن متن با کلیک روی دکمه ی ترجمه، متن وارد شده پردازش گردیده و
    سپس ترجمه ی آن در بخش «ترجمه» نمایش داده خواهد شد.
  </div>
  <div v-if="faToEn">ترجمه از فارسی به انگلیسی</div>
  <div v-else>ترجمه از انگلیسی به فارسی</div>

  <div class="mt-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
    <BaseTextarea
      v-model="msg"
      label="متن شما"
      shape="rounded"
      placeholder="متن خود را بنویسید"
      :disabled="isTranslating"
      :error="lengthCheck()"
    />
    <BaseTextarea
      v-model="translated"
      label="ترجمه"
      shape="rounded"
      placeholder="ترجمه این جا نمایش داده می شود"
      :loading="isTranslating"
    />
  </div>
  <div class="mt-4 flex">
    <BaseButton
      color="primary"
      @click="sendToTranslate"
      :loading="isTranslating"
      :disabled="canNotSend"
      >ترجمه</BaseButton
    ><BaseButton
      color="muted"
      class="mr-4"
      @click="changeLang"
      :disabled="isTranslating"
      >جابه جایی زبان ها</BaseButton
    >
  </div>
</template>
