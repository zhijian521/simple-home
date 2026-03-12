<script setup lang="ts">
import HomeResourceSection from '../resource/HomeResourceSection.vue'
import NotesResourceSection from '../resource/NotesResourceSection.vue'
import type {
  CreateBookmarkPayload,
  CreateFolderPayload,
  ModuleKey,
  MoveFolderPayload,
  MoveBookmarkPayload,
  NoteItem,
  TreeFolder,
  UpdateBookmarkPayload,
  UpdateFolderPayload,
} from '../../model/types'

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
  (event: 'create-folder', payload: CreateFolderPayload): void
  (event: 'update-folder', payload: UpdateFolderPayload): void
  (event: 'delete-folder', folderId: string): void
  (event: 'create-bookmark', payload: CreateBookmarkPayload): void
  (event: 'update-bookmark', payload: UpdateBookmarkPayload): void
  (event: 'delete-bookmark', bookmarkId: string): void
  (event: 'move-folder', payload: MoveFolderPayload): void
  (event: 'move-bookmark', payload: MoveBookmarkPayload): void
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
      @create-folder="emit('create-folder', $event)"
      @update-folder="emit('update-folder', $event)"
      @delete-folder="emit('delete-folder', $event)"
      @create-bookmark="emit('create-bookmark', $event)"
      @update-bookmark="emit('update-bookmark', $event)"
      @delete-bookmark="emit('delete-bookmark', $event)"
      @move-folder="emit('move-folder', $event)"
      @move-bookmark="emit('move-bookmark', $event)"
    />
    <NotesResourceSection
      v-else
      :notes="notes"
      :active-note-id="activeNoteId"
      @select-note="emit('select-note', $event)"
    />
  </aside>
</template>

<style scoped>
.resource-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.resource-header {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid var(--ink-08);
  background: var(--ink-03);
}

.resource-header h2 {
  margin: 0;
  color: var(--color-text-light);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  letter-spacing: 0;
}

@media (max-width: 640px) {
  .resource-header {
    height: 38px;
  }
}
</style>
