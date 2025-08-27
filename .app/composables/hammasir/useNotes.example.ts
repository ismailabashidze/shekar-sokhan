// Example usage of useNotes composable
import { useNotes } from './useNotes'

// In a Vue component or composable
export function useNotesExample() {
  const {
    // State
    notesState,
    notesError,
    isNotesLoading,
    isNotesCreating,

    // Computed
    clientNotes,

    // Methods
    getClientNotes,
    addClientNote,
  } = useNotes()

  // Example: Fetch client notes
  const fetchClientNotes = async (clientId: string) => {
    const notes = await getClientNotes(clientId)
    if (notes) {
      console.log('Fetched client notes:', notes)
    }
  }

  // Example: Add a client note
  const addNote = async (clientId: string) => {
    const newNote = await addClientNote(clientId, 'This is a new note about the client')
    if (newNote) {
      console.log('Added note:', newNote)
    }
  }

  return {
    // State
    notesState,
    notesError,
    isNotesLoading,
    isNotesCreating,

    // Computed
    clientNotes,

    // Methods
    fetchClientNotes,
    addNote,
  }
}