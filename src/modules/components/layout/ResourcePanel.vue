<script setup lang="ts">
import HomeResourceSection from '../resource/HomeResourceSection.vue'
import NotesResourceSection from '../resource/NotesResourceSection.vue'
import type { ModuleKey, NoteItem, TreeFolder } from '../../model/types'

defineProps<{
  activeModule: ModuleKey
  resourcePanelTitle: string
  tree: TreeFolder[]
  activeBookmarkId: string
  notes: NoteItem[]
  activeNoteId: string
}>()

const emit = defineEmits<{
  (event: 'toggle-folder', folderId: string): void
  (event: 'select-bookmark', bookmarkId: string): void
  (event: 'select-note', noteId: string): void
}>()
</script>

<template>
  <aside class="module-panel resource-panel" :aria-label="resourcePanelTitle">
    <header class="resource-header">
      <h2>{{ resourcePanelTitle }}</h2>
    </header>

    <HomeResourceSection
      v-if="activeModule === 'home'"
      :tree="tree"
      :active-bookmark-id="activeBookmarkId"
      @toggle-folder="emit('toggle-folder', $event)"
      @select-bookmark="emit('select-bookmark', $event)"
    />
    <NotesResourceSection
      v-else
      :notes="notes"
      :active-note-id="activeNoteId"
      @select-note="emit('select-note', $event)"
    />
  </aside>
</template>
