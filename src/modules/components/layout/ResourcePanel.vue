<script setup lang="ts">
import HomeResourceSection from '../resource/HomeResourceSection.vue'
import NotesResourceSection from '../resource/NotesResourceSection.vue'
import type { ModuleKey, NoteItem, TreeFolder } from '../../model/types'

defineProps<{
  activeModule: ModuleKey
  sidebarOpen: boolean
  resourcePanelTitle: string
  tree: TreeFolder[]
  activeBookmarkId: string
  notes: NoteItem[]
  activeNoteId: string
}>()

const emit = defineEmits<{
  (event: 'close-sidebar'): void
  (event: 'toggle-folder', folderId: string): void
  (event: 'select-bookmark', bookmarkId: string): void
  (event: 'select-note', noteId: string): void
}>()
</script>

<template>
  <aside class="module-panel resource-panel" :class="{ open: sidebarOpen }" :aria-label="resourcePanelTitle">
    <header class="resource-header">
      <h2>{{ resourcePanelTitle }}</h2>
      <button type="button" class="close-btn" @click="emit('close-sidebar')">×</button>
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
