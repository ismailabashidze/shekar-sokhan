import { Client } from '@gradio/client'

export function useMMTTS() {
  const mmtts = ref()
  const voice = ref('')
  const isVoicing = ref(false)
  // const connect = async () => {
  //   mmtts.value = await client(
  //     // 'https://facebook-mmtts-m4t-v2-large.hf.space/--replicas/2bmbx/',
  //     'innoai/Edge-TTS-Text-to-Speech',
  //   )
  // }
  // Should rename
  const textToVoice = async (text: string) => {
    // if (!mmtts.value) {
    //   await connect()
    // }
    isVoicing.value = true
    try {
      const client = await Client.connect('innoai/Edge-TTS-Text-to-Speech')
      const { data } = await client.predict('/predict', {
        text: text,
        voice: { name: 'fa-IR-FaridNeural', id: 'fa-IR' },
        rate: 0,
        pitch: 0,
      })
      console.log('data')
      console.log(data)
      // voice.value = 'blob:https://flux9665-massivelymultilingualtts.hf.space/file=' + data[0].replace('/blob', '')
      // console.log(voice.value)
      isVoicing.value = false

      return voice.value
    }
    catch (e) {
      isVoicing.value = false
      console.log('error')
      console.log(e)
    }
  }
  return {
    voice,
    isVoicing,
    textToVoice,
  }
}
