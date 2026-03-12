<script setup lang="ts">
import BookmarkIcon from '../icons/BookmarkIcon.vue'
import ChevronDownIcon from '../icons/ChevronDownIcon.vue'
import ChevronRightIcon from '../icons/ChevronRightIcon.vue'
import FolderClosedIcon from '../icons/FolderClosedIcon.vue'
import FolderOpenIcon from '../icons/FolderOpenIcon.vue'
import type { TreeFolder } from '../../model/types'

defineProps<{
  tree: TreeFolder[]
  activeBookmarkId: string
}>()

const emit = defineEmits<{
  (event: 'toggle-folder', folderId: string): void
  (event: 'select-bookmark', bookmarkId: string): void
}>()
</script>

<template>
  <div class="tree-scroll">
    <section v-for="folder in tree" :key="folder.id">
      <button type="button" class="folder-row" @click="emit('toggle-folder', folder.id)">
        <span class="arrow" aria-hidden="true">
          <ChevronDownIcon v-if="folder.expanded" class="arrow-icon" />
          <ChevronRightIcon v-else class="arrow-icon" />
        </span>
        <FolderOpenIcon v-if="folder.expanded" class="node-type-icon folder-icon" aria-hidden="true" />
        <FolderClosedIcon v-else class="node-type-icon folder-icon" aria-hidden="true" />
        <span>{{ folder.name }}</span>
      </button>

      <div class="folder-children" :class="{ expanded: folder.expanded }">
        <button
          v-for="bookmark in folder.bookmarks"
          :key="bookmark.id"
          type="button"
          class="bookmark-row"
          :class="{ active: activeBookmarkId === bookmark.id }"
          @click="emit('select-bookmark', bookmark.id)"
        >
          <BookmarkIcon class="node-type-icon file-icon" aria-hidden="true" />
          <span>{{ bookmark.title }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tree-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0.4rem 0.8rem;
}

.folder-row,
.bookmark-row {
  width: 100%;
  min-height: 32px;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 0.45rem;
  border: 0;
  border-radius: 6px;
  color: var(--color-text-light);
  background: transparent;
  font-size: var(--fs-sm);
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.bookmark-row {
  padding-left: 2.55rem;
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

.folder-children {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.folder-children.expanded {
  max-height: 2000px;
}

@media (prefers-reduced-motion: reduce) {
  .folder-row,
  .bookmark-row,
  .folder-children {
    transition: none;
  }
}
</style>
