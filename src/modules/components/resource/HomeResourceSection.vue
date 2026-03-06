<script setup lang="ts">
import TreeFolderNode from './TreeFolderNode.vue'
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
    <TreeFolderNode
      v-for="folder in tree"
      :key="folder.id"
      :folder="folder"
      :active-bookmark-id="activeBookmarkId"
      @toggle-folder="emit('toggle-folder', $event)"
      @select-bookmark="emit('select-bookmark', $event)"
    />
  </div>
</template>
