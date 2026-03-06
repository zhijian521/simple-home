<script setup lang="ts">
import ChevronDownIcon from '../icons/ChevronDownIcon.vue'
import ChevronRightIcon from '../icons/ChevronRightIcon.vue'
import BookmarkIcon from '../icons/BookmarkIcon.vue'
import FolderClosedIcon from '../icons/FolderClosedIcon.vue'
import FolderOpenIcon from '../icons/FolderOpenIcon.vue'
import type { TreeFolder } from '../../model/types'

defineOptions({ name: 'TreeFolderNode' })

withDefaults(
  defineProps<{
    folder: TreeFolder
    activeBookmarkId: string
    depth?: number
  }>(),
  {
    depth: 0,
  },
)

const emit = defineEmits<{
  (event: 'toggle-folder', folderId: string): void
  (event: 'select-bookmark', bookmarkId: string): void
}>()
</script>

<template>
  <section class="tree-node" :style="{ '--tree-depth': String(depth) }">
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
        :style="{ '--bookmark-depth': String(depth) }"
        @click="emit('select-bookmark', bookmark.id)"
      >
        <BookmarkIcon class="node-type-icon file-icon" aria-hidden="true" />
        <span>{{ bookmark.title }}</span>
      </button>

      <TreeFolderNode
        v-for="child in folder.folders || []"
        :key="child.id"
        :folder="child"
        :active-bookmark-id="activeBookmarkId"
        :depth="depth + 1"
        @toggle-folder="emit('toggle-folder', $event)"
        @select-bookmark="emit('select-bookmark', $event)"
      />
    </div>
  </section>
</template>
