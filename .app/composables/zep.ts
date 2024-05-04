// import { CreateUserRequest, ZepClient } from '@getzep/zep-js'

// const API_KEY =
//   'z_1dWlkIjoiZjU5MWE3YjUtNDg1NS00MzQ3LWFhMmYtYTdhNGIyYjczODA4In0.XzzHGd-buAU41lwZjtbp6jfYn-ifRC6_AW2Vnryvk43xnTXhJnTq_c_BLQm7z-zpdSASmCyPH8C2MzGHh6Teyg'
// export function useZep() {
//   const nuxtApp = useNuxtApp()
//   const zep = ref({} as ZepClient)
//   const memUser = ref({})
//   const connect = async () => {
//     console.log('connecting on client...')
//     zep.value = await ZepClient.init(API_KEY)
//   }
//   const upsertZep = async (user) => {
//     const user_request: CreateUserRequest = {
//       userId: user.record.id,
//       email: user.meta.email,
//       firstName: user.meta.rawUser.given_name,
//       lastName: user.meta.rawUser.family_name,
//       metadata: {},
//     }
//     try {
//       const u = await zep.value.user.get(user.record.id)
//       memUser.value = u
//     } catch (e) {
//       const u = await zep.value.user.add(user.record.id)
//       memUser.value = u
//     }
//     return memUser.value
//   }

//   return {
//     zep,
//     connect,
//     upsertZep,
//   }
// }
