<script setup lang="ts">
// import { client } from '@gradio/client'
definePageMeta({
  title: 'شکر سخن',
  layout: 'sidebar',
})
useHead({ htmlAttrs: { dir: 'rtl' } })

const msg = ref('')
const translated = ref('')
const faToEn = ref(true)
const isLoading = ref(false)
const canNotSend = ref(true)

const MSG_LIMIT = 1000

const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
const sendToTranslate = async () => {
  isLoading.value = true
  canNotSend.value = true
  const app = await client(
    'https://facebook-seamless-m4t-v2-large.hf.space/--replicas/2bmbx/',
    {},
  )
  const result = await app.predict('/t2tt', [
    msg.value,
    faToEn.value ? 'Western Persian' : 'English',
    faToEn.value ? 'English' : 'Western Persian',
  ])
  translated.value = result.data
  await sleep(1000)
  isLoading.value = false
  canNotSend.value = false
}
const changeLang = () => {
  faToEn.value = !faToEn.value
  msg.value = ''
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
  <div v-if="faToEn">ترجمه از فارسی به انگلیسی</div>
  <div v-else>ترجمه از انگلیسی به فارسی</div>
  <div class="mt-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
    <BaseTextarea
      v-model="msg"
      label="متن شما"
      shape="rounded"
      placeholder="متن خود را بنویسید"
      :disabled="isLoading"
      :error="lengthCheck()"
    />
    <BaseTextarea
      v-model="translated"
      label="ترجمه"
      shape="rounded"
      placeholder="ترجمه این جا نمایش داده می شود"
      :loading="isLoading"
    />
  </div>
  <div class="mt-4 flex">
    <BaseButton
      color="primary"
      @click="sendToTranslate"
      :loading="isLoading"
      :disabled="canNotSend"
      >ترجمه</BaseButton
    ><BaseButton
      color="muted"
      class="mr-4"
      @click="changeLang"
      :disabled="isLoading"
      >جابه جایی زبان ها</BaseButton
    >
  </div>
</template>
