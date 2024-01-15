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
  // Should rename
  const translate = async (text: string, from: string, to: string) => {
    if (!seamless.value) {
      await connect()
    }
    isTranslating.value = true
    const { data } = await seamless.value.predict('/t2tt', [text, from, to])
    translated.value = data[0]
    isTranslating.value = false
  }
  const translateS2T = async (
    soundAddress: string,
    from: string,
    to: string,
  ) => {
    if (!seamless.value) {
      await connect()
    }
    isTranslating.value = true
    try {
      // const chunksResponse = await fetch(`/api/chunks/${soundAddress}`)
      // if (!chunksResponse.ok) {
      //   throw new Error('Failed to fetch chunk list.')
      // }
      // const chunkFiles = await chunksResponse.json()

      // for (const chunkFile of chunkFiles) {
      //   const fileUrl = `${window.location.origin}/uploads/${soundAddress}/chunks/${chunkFile}`
      //   const response = await fetch(fileUrl)
      //   if (!response.ok) {
      //     throw new Error('Failed to fetch chunk file.')
      //   }

      //   const blob = await response.blob()
      //   const data = await seamless.value.predict('/s2tt', [blob, from, to])
      //   translated.value = data
      //   console.log(translated.value)
      //   isTranslating.value = false
      // }
      const response = await fetch(
        'https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3',
      )
      const audio_file = await response.blob()

      const app = await client('abidlabs/whisper', {})
      const transcription = await app.predict('/predict', [audio_file])
      console.log(transcription.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  return {
    translated,
    isTranslating,
    translate,
    translateS2T,
  }
}
