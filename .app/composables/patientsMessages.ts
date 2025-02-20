// patientsMessages.ts
import { useUser } from './user'

export type MessageType = 'sent' | 'received' | 'separator'

export type Message = {
  id: string
  patient: string // Relation to patient record
  user: string // Relation to user record
  type: MessageType
  text: string
  time: string // ISO date string
  created?: string
  updated?: string
}

export function usePatientMessages() {
  const nuxtApp = useNuxtApp()
  const selectedPatientId = ref<string | null>(null)

  const getMessages = async (patientId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    selectedPatientId.value = patientId
    try {
      return await nuxtApp.$pb.collection('patients_messages').getFullList({
        sort: 'created',
        filter: `patient = "${patientId}" && user = "${nuxtApp.$pb.authStore.model.id}"`,
        expand: 'patient,user',
        batch: 100, // Process in smaller batches
      })
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  const sendMessage = async (patientId: string, text: string, type: MessageType = 'sent') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    const messageData = {
      patient: patientId,
      user: nuxtApp.$pb.authStore.model.id,
      type,
      text,
      time: new Date().toISOString(),
    }

    try {
      return await nuxtApp.$pb.collection('patients_messages').create(messageData)
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const createSeparator = async (patientId: string, text: string = '') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    return await sendMessage(patientId, text, 'separator')
  }

  const deleteMessage = async (messageId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    try {
      await nuxtApp.$pb.collection('patients_messages').delete(messageId)
      return true
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return false
      }
      throw error
    }
  }

  const updateMessage = async (messageId: string, data: Partial<Message>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    try {
      return await nuxtApp.$pb.collection('patients_messages').update(messageId, data)
    } catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const clearMessages = async (patientId: string) => {
    try {
      // Get all messages for this patient
      const records = await nuxtApp.$pb.collection('patients_messages').getFullList({
        filter: `patient = "${patientId}" && user = "${nuxtApp.$pb.authStore.model.id}"`,
      })
      
      // Delete all messages in parallel
      await Promise.all(
        records.map(record => 
          nuxtApp.$pb.collection('patients_messages').delete(record.id)
        )
      )
      
      return true
    } catch (error) {
      console.error('Error clearing messages:', error)
      throw error
    }
  }

  return {
    selectedPatientId,
    getMessages,
    sendMessage,
    createSeparator,
    deleteMessage,
    updateMessage,
    clearMessages,
  }
}
