// import { Client } from '@gradio/client'

// export function useSeamless() {
//   const seamless = ref()
//   const translated = ref('')
//   const isTranslating = ref(false)
//   const connect = async () => {
//     seamless.value = await Client.connect(
//       // 'https://facebook-seamless-m4t-v2-large.hf.space/--replicas/2bmbx/',
//       'https://bluman1-seamless-m4t-v2-large.hf.space/--replicas/y1arv/',
//       // 'http://127.0.0.1:7860/',
//       {},
//     )
//   }
//   // Should rename
//   const translate = async (text: string, from: string, to: string) => {
//     if (!seamless.value) {
//       await connect()
//     }
//     isTranslating.value = true
//     try {
//       const { data } = await seamless.value.predict('/t2tt', [text, from, to])
//       translated.value = data[0]
//       isTranslating.value = false
//       return translated.value
//     }
//     catch (e) {
//       isTranslating.value = false
//     }
//   }
//   const translateS2T = async (
//     soundAddress: string,
//     from: string,
//     to: string,
//   ) => {
//     if (!seamless.value) {
//       await connect()
//     }
//     isTranslating.value = true
//     try {
//       // const chunksResponse = await fetch(`/api/chunks/${soundAddress}`)
//       // if (!chunksResponse.ok) {
//       //   throw new Error('Failed to fetch chunk list.')
//       // }
//       // const chunkFiles = await chunksResponse.json()

//       // for (const chunkFile of chunkFiles) {
//       //   const fileUrl = `${window.location.origin}/uploads/${soundAddress}/chunks/${chunkFile}`
//       //   const response = await fetch(fileUrl)
//       //   if (!response.ok) {
//       //     throw new Error('Failed to fetch chunk file.')
//       //   }

//       //   const blob = await response.blob()
//       //   const data = await seamless.value.predict('/s2tt', [blob, from, to])
//       //   translated.value = data
//       //   console.log(translated.value)
//       //   isTranslating.value = false
//       // }
//       const response = await fetch(
//         'https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3',
//       )
//       const audio_file = await response.blob()

//       const app = await Client.connect('abidlabs/whisper')
//       // const result = await app.predict('/predict', [handle_file(audio_file)])

//       // console.log(result.data)
//     }
//     catch (error) {
//       console.log('Error:', error)
//     }
//   }
//   return {
//     translated,
//     isTranslating,
//     translate,
//     translateS2T,
//   }
// }
