import { conversation, sleep, loading, chatEl } from './chat.vue'

onMounted(async () => {
  conversation.value.messages = await getMessages()
  conversation.value.messages.unshift({
    role: 'assistant',
    content: 'سلام. من مانی هستم 👋. چطور می تونم به شما کمک کنم؟',
    time: new Date().toLocaleTimeString('fa'),
    attachments: [],
  })
  conversation.value.messages.unshift({
    role: 'separator',
    content: '',
    time: 'شروع گفت و گو',
    attachments: [],
  })

  await sleep(2000)
  loading.value = false
  setTimeout(() => {
    if (chatEl.value) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, 300)
})
