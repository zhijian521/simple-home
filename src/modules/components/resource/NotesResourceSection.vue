<script setup lang="ts">
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
      <svg viewBox="0 0 24 24" class="node-type-icon file-icon" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z"
        />
      </svg>
      <div class="note-meta">
        <span class="note-title">{{ note.title }}</span>
        <span class="note-date">{{ note.updatedAt }}</span>
      </div>
    </button>
  </div>
</template>
