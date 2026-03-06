import { computed, ref } from 'vue'
import { createInitialNotes } from '../../model/data'

interface UseNotesModuleOptions {
  onNavigate?: () => void
}

export function useNotesModule(options: UseNotesModuleOptions = {}) {
  const notes = ref(createInitialNotes())
  const activeNoteId = ref(notes.value[0]?.id ?? '')
  const activeNote = computed(() => notes.value.find((note) => note.id === activeNoteId.value))

  function selectNote(noteId: string) {
    activeNoteId.value = noteId
    options.onNavigate?.()
  }

  function ensureActiveNote() {
    if (activeNoteId.value || notes.value.length === 0) return
    const firstNote = notes.value[0]
    if (firstNote) {
      activeNoteId.value = firstNote.id
    }
  }

  return {
    notes,
    activeNoteId,
    activeNote,
    selectNote,
    ensureActiveNote,
  }
}
