// Example usage of useMyClients composable
import { useMyClients } from './useMyClients'

// In a Vue component or composable
export function useMyClientsExample() {
  const {
    // State
    myClientsState,
    clientsError,
    isClientsLoading,
    isClientsUpdating,

    // Computed
    myClientsList,
    currentClient,
    currentClientLink,
    clientNotes,
    clientGoals,

    // Methods
    getMyClients,
    getClientById,
    getClientLink,
    updateClientLink,
    getClientNotes,
    addClientNote,
    getClientGoals,
    addClientGoal,
    updateClientGoal,
  } = useMyClients()

  // Example: Fetch my clients
  const fetchClients = async () => {
    const result = await getMyClients(1, 10, 'ACTIVE')
    if (result) {
      console.log('Fetched clients:', result.clients)
    }
  }

  // Example: Get a specific client
  const fetchClient = async (clientId: string) => {
    const client = await getClientById(clientId)
    if (client) {
      console.log('Fetched client:', client)
    }
  }

  // Example: Get client connection link
  const fetchClientLink = async (clientId: string) => {
    const link = await getClientLink(clientId)
    if (link) {
      console.log('Client link:', link)
    }
  }

  // Example: Update client connection status
  const updateLink = async (clientId: string) => {
    const updatedLink = await updateClientLink(clientId, {
      status: 'ACCEPTED',
      notes: 'Client has been accepted for counseling',
    })

    if (updatedLink) {
      console.log('Updated link:', updatedLink)
    }
  }

  // Example: Get client notes
  const fetchClientNotes = async (clientId: string) => {
    const notes = await getClientNotes(clientId)
    if (notes) {
      console.log('Client notes:', notes)
    }
  }

  // Example: Add a client note
  const addNote = async (clientId: string) => {
    const newNote = await addClientNote(clientId, 'This is a new note about the client')
    if (newNote) {
      console.log('Added note:', newNote)
    }
  }

  // Example: Get client goals
  const fetchClientGoals = async (clientId: string) => {
    const goals = await getClientGoals(clientId)
    if (goals) {
      console.log('Client goals:', goals)
    }
  }

  // Example: Add a client goal
  const addGoal = async (clientId: string) => {
    const newGoal = await addClientGoal(clientId, {
      title: 'Improve communication skills',
      description: 'Work on expressing emotions more effectively',
      status: 'IN_PROGRESS',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })

    if (newGoal) {
      console.log('Added goal:', newGoal)
    }
  }

  // Example: Update a client goal
  const updateGoal = async (clientId: string, goalId: string) => {
    const updatedGoal = await updateClientGoal(clientId, goalId, {
      status: 'COMPLETED',
    })

    if (updatedGoal) {
      console.log('Updated goal:', updatedGoal)
    }
  }

  return {
    // State
    myClientsState,
    clientsError,
    isClientsLoading,
    isClientsUpdating,

    // Computed
    myClientsList,
    currentClient,
    currentClientLink,
    clientNotes,
    clientGoals,

    // Methods
    fetchClients,
    fetchClient,
    fetchClientLink,
    updateLink,
    fetchClientNotes,
    addNote,
    fetchClientGoals,
    addGoal,
    updateGoal,
  }
}
