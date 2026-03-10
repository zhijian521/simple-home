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
