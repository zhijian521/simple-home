<script setup lang="ts">
import FileIcon from '../icons/FileIcon.vue'
import type { NoteItem } from '../../model/types'

defineProps<{
  notes: NoteItem[]
  activeNoteId: string
}>()

const emit = defineEmits<{
  (event: 'select-note', noteId: string): void
}>()
</script>

<template>
  <div class="tree-scroll notes-scroll">
    <button
      v-for="note in notes"
      :key="note.id"
      type="button"
      class="note-row"
      :class="{ active: activeNoteId === note.id }"
      @click="emit('select-note', note.id)"
    >
      <FileIcon class="node-type-icon file-icon" aria-hidden="true" />
      <div class="note-meta">
        <span class="note-title">{{ note.title }}</span>
        <span class="note-date">{{ note.updatedAt }}</span>
      </div>
    </button>
  </div>
</template>
