import { client } from '@gradio/client'

export function useSeamless() {
  const seamless = ref()
  const translated = ref('')
  const isTranslating = ref(false)
  const connect = async () => {
    seamless.value = await client(
      'https://facebook-seamless-m4t-v2-large.hf.space/--replicas/2bmbx/',
      {},
    )
  }
  const translate = async (text: string, from: string, to: string) => {
    if (!seamless.value) {
      await connect()
    }
    isTranslating.value = true
    const { data } = await seamless.value.predict('/t2tt', [text, from, to])
    translated.value = data
    isTranslating.value = false
  }
  return {
    translated,
    isTranslating,
    translate,
  }
}
