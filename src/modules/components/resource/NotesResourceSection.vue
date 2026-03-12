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

<style scoped>
.tree-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0.4rem 0.8rem;
}

.notes-scroll {
  padding-top: 0.6rem;
}

.note-row {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.5rem;
  border: 0;
  border-radius: 8px;
  color: var(--color-text-light);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.note-row + .note-row {
  margin-top: 0.25rem;
}

.note-row:hover,
.note-row.active {
  color: var(--color-text);
  background: var(--ink-08);
}

.node-type-icon {
  width: var(--icon-md);
  height: var(--icon-md);
  flex-shrink: 0;
  color: var(--color-text-light);
}

.file-icon {
  color: var(--color-text-lighter);
}

.note-row:hover .file-icon,
.note-row.active .file-icon {
  color: var(--color-text-light);
}

.note-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.note-title {
  overflow: hidden;
  color: inherit;
  font-size: var(--fs-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-date {
  color: var(--color-text-lighter);
  font-size: var(--fs-xs);
}

@media (prefers-reduced-motion: reduce) {
  .note-row {
    transition: none;
  }
}
</style>
