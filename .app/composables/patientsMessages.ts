// patientsMessages.ts
import type { MessageType, PatientMessage } from '~/types'

// Type alias for backward compatibility - use specific name to avoid conflicts
export type PatientsMessage = PatientMessage

export function usePatientMessages() {
  const nuxtApp = useNuxtApp()

  const getMessages = async (conversationId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }

    try {
      return await nuxtApp.$pb.collection('patients_messages').getFullList({
        sort: 'created',
        filter: `conversation = "${conversationId}" && user = "${nuxtApp.$pb.authStore.model.id}"`,
        expand: 'patient,user',
        batch: 100,
      })
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return []
      }
      throw error
    }
  }

  const sendMessage = async (patientId: string, conversationId: string, text: string, type: MessageType = 'sent') => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    const messageData = {
      patient: patientId,
      user: nuxtApp.$pb.authStore.model.id,
      conversation: conversationId,
      type,
      text,
      time: new Date().toISOString(),
    }

    try {
      return await nuxtApp.$pb.collection('patients_messages').create(messageData)
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    try {
      await nuxtApp.$pb.collection('patients_messages').delete(messageId)
      return true
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return false
      }
      throw error
    }
  }

  const updateMessage = async (messageId: string, data: Partial<PatientMessage>) => {
    if (!nuxtApp.$pb.authStore.isValid) {
      throw new Error('User not authenticated')
    }
    try {
      return await nuxtApp.$pb.collection('patients_messages').update(messageId, data)
    }
    catch (error: any) {
      if (error?.isAbort) {
        console.log('Request was cancelled')
        return null
      }
      throw error
    }
  }

  return {
    getMessages,
    sendMessage,
    deleteMessage,
    updateMessage,
  }
}
