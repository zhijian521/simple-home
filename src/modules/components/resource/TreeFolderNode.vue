<script setup lang="ts">
import type { TreeFolder } from '../../model/types'

defineOptions({ name: 'TreeFolderNode' })

const props = withDefaults(
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
        <svg v-if="folder.expanded" viewBox="0 0 1024 1024" class="arrow-icon">
          <path
            d="M544.7 712.90000001L878.9 378.7c18.6-18.6 18.6-47.50000001 0-67-18.6-19.6-47.50000001-18.6-67 0l-300.7 300.70000001-300.7-300.70000001c-19.6-18.6-47.50000001-18.6-67 0s-19.5 47.5 0 67l334.2 334.20000001c19.5 18.6 47.4 18.6 67 0z m0 0"
            fill="currentColor"
          />
        </svg>
        <svg v-else viewBox="0 0 1024 1024" class="arrow-icon">
          <path
            d="M712.9 479.3L378.7 145.1c-18.6-18.6-47.5-18.6-67 0-19.6 18.6-18.6 47.5 0 67l300.7 300.7-300.7 300.7c-18.6 19.6-18.6 47.5 0 67s47.5 19.5 67 0l334.2-334.2c18.6-19.5 18.6-47.4 0-67z m0 0"
            fill="currentColor"
          />
        </svg>
      </span>
      <svg viewBox="0 0 32 32" class="node-type-icon folder-icon" aria-hidden="true">
        <path
          fill="currentColor"
          d="m13.844 7.536-1.288-1.072A2 2 0 0 0 11.276 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H15.124a2 2 0 0 1-1.28-.464"
        />
        <path
          fill="rgba(26,26,26,0.24)"
          d="M24 10h-7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V16Zm0 16h-6v-2h6Zm4-4H18v-2h10Zm-4.828-5.172V12L28 16.828Z"
        />
      </svg>
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
        <svg viewBox="0 0 24 24" class="node-type-icon file-icon" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z"
          />
        </svg>
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
