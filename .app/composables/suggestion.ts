import type { Content } from '~/types'
// export type BackendMessage = {
//   role: 'system' | 'user' | 'assistant' | 'separator'
//   content: Content
//   contentFa?: Content
//   time?: string
//   created?: string
//   Updated?: string
//   user?: string
//   deletionDivider: number
// }

export function useSuggestion() {
  const nuxtApp = useNuxtApp()
  const { user } = useUser()
  const saveSuggest = async (newSuggest) => {
    const post = {
      user: user.value.id,
      ...newSuggest,
    }
    try {
      return await nuxtApp.$pb.collection('suggestions').create(post)
    }
    catch (e) {
      console.log('e')
      console.log(e)
      return 'error'
    }
  }
  const getLastSuggestion = async (msgId: string) => {
    const list = await nuxtApp.$pb.collection('suggestions').getFullList({
      sort: '-created',
      filter: `message.id = "${msgId}"`,
    })
    return list[0]
  }

  return {
    saveSuggest,
    getLastSuggestion,
  }
}
