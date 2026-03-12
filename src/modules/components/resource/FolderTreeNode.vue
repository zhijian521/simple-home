<script setup lang="ts">
import BookmarkIcon from '../icons/BookmarkIcon.vue'
import ChevronDownIcon from '../icons/ChevronDownIcon.vue'
import ChevronRightIcon from '../icons/ChevronRightIcon.vue'
import FolderClosedIcon from '../icons/FolderClosedIcon.vue'
import FolderOpenIcon from '../icons/FolderOpenIcon.vue'
import type { BookmarkDropPosition, TreeFolder } from '../../model/types'

type BookmarkDropIndicator = {
  folderId: string
  targetBookmarkId?: string
  position: BookmarkDropPosition
} | null

const props = defineProps<{
  folder: TreeFolder
  activeBookmarkId: string
  draggingBookmarkId: string
  draggingFolderId: string
  folderDropTargetId: string
  folderDropPosition: 'before' | 'after' | null
  bookmarkDropIndicator: BookmarkDropIndicator
}>()

const emit = defineEmits<{
  (event: 'toggle-folder', folderId: string): void
  (event: 'select-bookmark', bookmarkId: string): void
  (event: 'folder-contextmenu', payload: { event: MouseEvent; folderId: string }): void
  (event: 'bookmark-contextmenu', payload: { event: MouseEvent; folderId: string; bookmarkId: string }): void
  (event: 'folder-dragstart', payload: { event: DragEvent; folderId: string }): void
  (event: 'folder-dragend'): void
  (event: 'folder-dragover', payload: { event: DragEvent; folderId: string }): void
  (event: 'folder-drop', folderId: string): void
  (event: 'bookmark-dragstart', payload: { event: DragEvent; bookmarkId: string }): void
  (event: 'bookmark-dragend'): void
  (event: 'bookmark-dragover', payload: { event: DragEvent; folderId: string; bookmarkId: string }): void
  (event: 'bookmark-drop', payload: { folderId: string; bookmarkId: string }): void
}>()

function isFolderDropBefore(folderId: string) {
  return props.folderDropTargetId === folderId && props.folderDropPosition === 'before'
}

function isFolderDropAfter(folderId: string) {
  return props.folderDropTargetId === folderId && props.folderDropPosition === 'after'
}

function isFolderDropTarget(folderId: string) {
  return props.bookmarkDropIndicator?.folderId === folderId && !props.bookmarkDropIndicator.targetBookmarkId
}

function isBookmarkDropBefore(folderId: string, bookmarkId: string) {
  return (
    props.bookmarkDropIndicator?.folderId === folderId &&
    props.bookmarkDropIndicator.targetBookmarkId === bookmarkId &&
    props.bookmarkDropIndicator.position === 'before'
  )
}

function isBookmarkDropAfter(folderId: string, bookmarkId: string) {
  return (
    props.bookmarkDropIndicator?.folderId === folderId &&
    props.bookmarkDropIndicator.targetBookmarkId === bookmarkId &&
    props.bookmarkDropIndicator.position === 'after'
  )
}
</script>

<template>
  <section class="folder-block">
    <button
      type="button"
      class="folder-row"
      :class="{
        'is-drop-target': isFolderDropTarget(folder.id),
        'drop-before': isFolderDropBefore(folder.id),
        'drop-after': isFolderDropAfter(folder.id),
        'is-dragging': draggingFolderId === folder.id,
      }"
      draggable="true"
      @click="emit('toggle-folder', folder.id)"
      @contextmenu.prevent.stop="emit('folder-contextmenu', { event: $event, folderId: folder.id })"
      @dragstart="emit('folder-dragstart', { event: $event, folderId: folder.id })"
      @dragend="emit('folder-dragend')"
      @dragover="emit('folder-dragover', { event: $event, folderId: folder.id })"
      @drop="emit('folder-drop', folder.id)"
    >
      <span class="arrow" aria-hidden="true">
        <ChevronDownIcon v-if="folder.expanded" class="arrow-icon" />
        <ChevronRightIcon v-else class="arrow-icon" />
      </span>
      <FolderOpenIcon v-if="folder.expanded" class="node-type-icon folder-icon" aria-hidden="true" />
      <FolderClosedIcon v-else class="node-type-icon folder-icon" aria-hidden="true" />
      <span class="folder-name">{{ folder.name }}</span>
      <span class="folder-count">{{ folder.bookmarks.length }}</span>
    </button>

    <div class="folder-children" :class="{ expanded: folder.expanded }">
      <button
        v-for="bookmark in folder.bookmarks"
        :key="bookmark.id"
        type="button"
        class="bookmark-row"
        :class="{
          active: activeBookmarkId === bookmark.id,
          'is-dragging': draggingBookmarkId === bookmark.id,
          'drop-before': isBookmarkDropBefore(folder.id, bookmark.id),
          'drop-after': isBookmarkDropAfter(folder.id, bookmark.id),
        }"
        draggable="true"
        @click="emit('select-bookmark', bookmark.id)"
        @contextmenu.prevent.stop="emit('bookmark-contextmenu', { event: $event, folderId: folder.id, bookmarkId: bookmark.id })"
        @dragstart="emit('bookmark-dragstart', { event: $event, bookmarkId: bookmark.id })"
        @dragend="emit('bookmark-dragend')"
        @dragover="emit('bookmark-dragover', { event: $event, folderId: folder.id, bookmarkId: bookmark.id })"
        @drop="emit('bookmark-drop', { folderId: folder.id, bookmarkId: bookmark.id })"
      >
        <BookmarkIcon class="node-type-icon file-icon" aria-hidden="true" />
        <span class="bookmark-title">{{ bookmark.title }}</span>
        <span class="bookmark-url">{{ bookmark.url }}</span>
      </button>

      <FolderTreeNode
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :active-bookmark-id="activeBookmarkId"
        :dragging-bookmark-id="draggingBookmarkId"
        :dragging-folder-id="draggingFolderId"
        :folder-drop-target-id="folderDropTargetId"
        :folder-drop-position="folderDropPosition"
        :bookmark-drop-indicator="bookmarkDropIndicator"
        @toggle-folder="emit('toggle-folder', $event)"
        @select-bookmark="emit('select-bookmark', $event)"
        @folder-contextmenu="emit('folder-contextmenu', $event)"
        @bookmark-contextmenu="emit('bookmark-contextmenu', $event)"
        @folder-dragstart="emit('folder-dragstart', $event)"
        @folder-dragend="emit('folder-dragend')"
        @folder-dragover="emit('folder-dragover', $event)"
        @folder-drop="emit('folder-drop', $event)"
        @bookmark-dragstart="emit('bookmark-dragstart', $event)"
        @bookmark-dragend="emit('bookmark-dragend')"
        @bookmark-dragover="emit('bookmark-dragover', $event)"
        @bookmark-drop="emit('bookmark-drop', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.folder-block + .folder-block {
  margin-top: 0.28rem;
}

.folder-row,
.bookmark-row {
  width: 100%;
  min-height: 34px;
  display: flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0 0.5rem;
  border: 0;
  border-radius: 9px;
  color: var(--color-text-light);
  background: transparent;
  font-size: var(--fs-sm);
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.folder-row:hover,
.bookmark-row:hover,
.bookmark-row.active {
  color: var(--color-text);
  background: var(--ink-04);
}

.bookmark-row.active {
  background: var(--ink-08);
}

.folder-row.is-drop-target,
.folder-row.drop-before,
.folder-row.drop-after,
.bookmark-row.drop-before,
.bookmark-row.drop-after {
  box-shadow: inset 0 0 0 1px rgba(160, 113, 63, 0.28);
}

.folder-row.drop-before {
  background:
    linear-gradient(180deg, rgba(160, 113, 63, 0.22), rgba(160, 113, 63, 0.22)) top / 100% 2px no-repeat,
    var(--ink-04);
}

.folder-row.drop-after {
  background:
    linear-gradient(180deg, rgba(160, 113, 63, 0.22), rgba(160, 113, 63, 0.22)) bottom / 100% 2px no-repeat,
    var(--ink-04);
}

.bookmark-row.drop-before {
  background:
    linear-gradient(180deg, rgba(160, 113, 63, 0.22), rgba(160, 113, 63, 0.22)) top / 100% 2px no-repeat,
    var(--ink-04);
}

.bookmark-row.drop-after {
  background:
    linear-gradient(180deg, rgba(160, 113, 63, 0.22), rgba(160, 113, 63, 0.22)) bottom / 100% 2px no-repeat,
    var(--ink-04);
}

.bookmark-row.is-dragging,
.folder-row.is-dragging {
  opacity: 0.44;
}

.arrow {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-lighter);
}

.arrow-icon,
.node-type-icon {
  flex-shrink: 0;
}

.arrow-icon {
  width: 10px;
  height: 10px;
}

.node-type-icon {
  width: var(--icon-md);
  height: var(--icon-md);
  color: var(--color-text-light);
}

.folder-icon,
.file-icon {
  color: var(--color-text-lighter);
}

.folder-icon {
  width: 18px;
  height: 18px;
}

.folder-row:hover .folder-icon,
.bookmark-row:hover .file-icon,
.bookmark-row.active .file-icon {
  color: var(--color-text-light);
}

.folder-name,
.bookmark-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-name {
  flex: 1;
}

.folder-count {
  min-width: 1.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  color: var(--color-text-lighter);
  background: var(--ink-04);
  font-size: 0.72rem;
  text-align: center;
}

.folder-children {
  overflow: hidden;
  max-height: 0;
  margin-left: 1.4rem;
  transition: max-height 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.folder-children.expanded {
  max-height: 8000px;
}

.bookmark-row {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  grid-template-areas:
    'icon title'
    'icon url';
  row-gap: 0.12rem;
  padding-top: 0.46rem;
  padding-bottom: 0.46rem;
  padding-left: 1.1rem;
}

.bookmark-row .file-icon {
  grid-area: icon;
  margin-top: 0.08rem;
}

.bookmark-title {
  grid-area: title;
  color: inherit;
  font-size: var(--fs-sm);
}

.bookmark-url {
  grid-area: url;
  overflow: hidden;
  color: var(--color-text-lighter);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.explorer-page.theme-dark) .folder-row.is-drop-target,
:global(.explorer-page.theme-dark) .bookmark-row.drop-before,
:global(.explorer-page.theme-dark) .bookmark-row.drop-after {
  box-shadow: inset 0 0 0 1px rgba(215, 188, 145, 0.34);
}

@media (prefers-reduced-motion: reduce) {
  .folder-row,
  .bookmark-row,
  .folder-children {
    transition: none;
  }
}
</style>
