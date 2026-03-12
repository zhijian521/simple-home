<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BookmarkContextMenu from './BookmarkContextMenu.vue'
import BookmarkEditorDialog from './BookmarkEditorDialog.vue'
import FolderTreeNode from './FolderTreeNode.vue'
import type {
  BookmarkItem,
  BookmarkDropPosition,
  CreateBookmarkPayload,
  CreateFolderPayload,
  MoveFolderPayload,
  MoveBookmarkPayload,
  TreeFolder,
  UpdateBookmarkPayload,
  UpdateFolderPayload,
} from '../../model/types'

type ContextMenuState =
  | { type: 'blank'; x: number; y: number }
  | { type: 'folder'; x: number; y: number; folderId: string }
  | { type: 'bookmark'; x: number; y: number; folderId: string; bookmarkId: string }

type EditorState =
  | { kind: 'folder'; mode: 'create'; placement: CreateFolderPayload['placement']; referenceFolderId?: string }
  | { kind: 'folder'; mode: 'edit'; folderId: string }
  | { kind: 'bookmark'; mode: 'create'; folderId: string }
  | { kind: 'bookmark'; mode: 'edit'; folderId: string; bookmarkId: string }

type ContextMenuItem = {
  key: string
  label: string
  danger?: boolean
}

type DropIndicator = {
  folderId: string
  targetBookmarkId?: string
  position: BookmarkDropPosition
}

type FolderDropIndicator = {
  targetFolderId: string
  position: 'before' | 'after'
}

const props = defineProps<{
  tree: TreeFolder[]
  activeBookmarkId: string
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
}>()

const contextMenu = ref<ContextMenuState | null>(null)
const editor = ref<EditorState | null>(null)
const draggingBookmarkId = ref('')
const draggingFolderId = ref('')
const bookmarkDropIndicator = ref<DropIndicator | null>(null)
const folderDropIndicator = ref<FolderDropIndicator | null>(null)

const contextMenuItems = computed<ContextMenuItem[]>(() => {
  if (!contextMenu.value) {
    return []
  }

  if (contextMenu.value.type === 'blank') {
    return [{ key: 'create-root-folder', label: '新增文件夹' }]
  }

  if (contextMenu.value.type === 'folder') {
    return [
      { key: 'create-bookmark', label: '新增书签' },
      { key: 'edit-folder', label: '修改文件夹' },
      { key: 'create-sibling-folder', label: '新增文件夹' },
      { key: 'create-child-folder', label: '新增下级文件夹' },
      { key: 'delete-folder', label: '删除文件夹', danger: true },
    ]
  }

  return [
    { key: 'open-bookmark', label: '打开书签' },
    { key: 'edit-bookmark', label: '修改书签' },
    { key: 'delete-bookmark', label: '删除书签', danger: true },
  ]
})

const dialogTitle = computed(() => {
  if (!editor.value) {
    return ''
  }

  if (editor.value.kind === 'folder') {
    return editor.value.mode === 'create' ? '新增文件夹' : '修改文件夹'
  }

  return editor.value.mode === 'create' ? '新增书签' : '修改书签'
})

const dialogConfirmLabel = computed(() => (editor.value?.mode === 'create' ? '创建' : '保存'))

const dialogInitialName = computed(() => {
  if (!editor.value || editor.value.mode !== 'edit') {
    return ''
  }

  if (editor.value.kind === 'folder') {
    return getFolderById(editor.value.folderId)?.name ?? ''
  }

  return getBookmarkById(editor.value.bookmarkId)?.title ?? ''
})

const dialogInitialUrl = computed(() => {
  if (!editor.value || editor.value.kind !== 'bookmark' || editor.value.mode !== 'edit') {
    return ''
  }

  return getBookmarkById(editor.value.bookmarkId)?.url ?? ''
})

onMounted(() => {
  window.addEventListener('click', closeContextMenu)
  window.addEventListener('blur', closeContextMenu)
  window.addEventListener('scroll', closeContextMenu, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeContextMenu)
  window.removeEventListener('blur', closeContextMenu)
  window.removeEventListener('scroll', closeContextMenu, true)
})

function onBlankContextMenu(event: MouseEvent) {
  contextMenu.value = {
    type: 'blank',
    x: event.clientX + 2,
    y: event.clientY + 2,
  }
}

function onFolderContextMenu(payload: { event: MouseEvent; folderId: string }) {
  contextMenu.value = {
    type: 'folder',
    folderId: payload.folderId,
    x: payload.event.clientX + 2,
    y: payload.event.clientY + 2,
  }
}

function onBookmarkContextMenu(payload: { event: MouseEvent; folderId: string; bookmarkId: string }) {
  contextMenu.value = {
    type: 'bookmark',
    folderId: payload.folderId,
    bookmarkId: payload.bookmarkId,
    x: payload.event.clientX + 2,
    y: payload.event.clientY + 2,
  }
}

function closeContextMenu() {
  contextMenu.value = null
}

function openEditor(nextEditor: EditorState) {
  closeContextMenu()
  editor.value = nextEditor
}

function closeEditor() {
  editor.value = null
}

function handleContextMenuAction(actionKey: string) {
  const currentMenu = contextMenu.value
  if (!currentMenu) {
    return
  }

  if (actionKey === 'create-root-folder') {
    openEditor({ kind: 'folder', mode: 'create', placement: 'root' })
    return
  }

  if (currentMenu.type === 'folder') {
    if (actionKey === 'create-sibling-folder') {
      openEditor({
        kind: 'folder',
        mode: 'create',
        placement: 'sibling',
        referenceFolderId: currentMenu.folderId,
      })
      return
    }

    if (actionKey === 'create-child-folder') {
      openEditor({
        kind: 'folder',
        mode: 'create',
        placement: 'child',
        referenceFolderId: currentMenu.folderId,
      })
      return
    }

    if (actionKey === 'create-bookmark') {
      openEditor({ kind: 'bookmark', mode: 'create', folderId: currentMenu.folderId })
      return
    }

    if (actionKey === 'edit-folder') {
      openEditor({ kind: 'folder', mode: 'edit', folderId: currentMenu.folderId })
      return
    }

    if (actionKey === 'delete-folder') {
      const folder = getFolderById(currentMenu.folderId)
      const confirmed = window.confirm(`确认删除文件夹“${folder?.name ?? '当前文件夹'}”吗？`)

      if (confirmed) {
        emit('delete-folder', currentMenu.folderId)
      }

      closeContextMenu()
      return
    }
  }

  if (currentMenu.type === 'bookmark') {
    if (actionKey === 'open-bookmark') {
      emit('select-bookmark', currentMenu.bookmarkId)
      closeContextMenu()
      return
    }

    if (actionKey === 'edit-bookmark') {
      openEditor({
        kind: 'bookmark',
        mode: 'edit',
        folderId: currentMenu.folderId,
        bookmarkId: currentMenu.bookmarkId,
      })
      return
    }

    if (actionKey === 'delete-bookmark') {
      const bookmark = getBookmarkById(currentMenu.bookmarkId)
      const confirmed = window.confirm(`确认删除书签“${bookmark?.title ?? '当前项目'}”吗？`)

      if (confirmed) {
        emit('delete-bookmark', currentMenu.bookmarkId)
      }

      closeContextMenu()
    }
  }
}

function submitEditor(payload: { name: string; url?: string }) {
  const currentEditor = editor.value
  if (!currentEditor) {
    return
  }

  if (currentEditor.kind === 'folder') {
    if (currentEditor.mode === 'create') {
      emit('create-folder', {
        name: payload.name,
        placement: currentEditor.placement,
        referenceFolderId: currentEditor.referenceFolderId,
      })
    } else {
      emit('update-folder', {
        folderId: currentEditor.folderId,
        name: payload.name,
      })
    }

    closeEditor()
    return
  }

  const url = payload.url ?? ''
  if (currentEditor.mode === 'create') {
    emit('create-bookmark', {
      folderId: currentEditor.folderId,
      title: payload.name,
      url,
    })
  } else {
    emit('update-bookmark', {
      bookmarkId: currentEditor.bookmarkId,
      title: payload.name,
      url,
    })
  }

  closeEditor()
}

function createFirstFolder() {
  openEditor({ kind: 'folder', mode: 'create', placement: 'root' })
}

function onBookmarkDragStart(payload: { event: DragEvent; bookmarkId: string }) {
  if (draggingFolderId.value || !payload.event.dataTransfer) {
    return
  }

  draggingBookmarkId.value = payload.bookmarkId
  payload.event.dataTransfer.effectAllowed = 'move'
  payload.event.dataTransfer.setData('text/plain', payload.bookmarkId)
  closeContextMenu()
}

function onBookmarkDragEnd() {
  draggingBookmarkId.value = ''
  bookmarkDropIndicator.value = null
}

function onFolderDragStart(payload: { event: DragEvent; folderId: string }) {
  if (draggingBookmarkId.value || !payload.event.dataTransfer) {
    return
  }

  draggingFolderId.value = payload.folderId
  folderDropIndicator.value = null
  payload.event.dataTransfer.effectAllowed = 'move'
  payload.event.dataTransfer.setData('text/plain', payload.folderId)
  closeContextMenu()
}

function onFolderDragEnd() {
  draggingFolderId.value = ''
  folderDropIndicator.value = null
}

function onFolderDragOver(payload: { event: DragEvent; folderId: string }) {
  if (draggingFolderId.value) {
    if (draggingFolderId.value === payload.folderId) {
      folderDropIndicator.value = null
      return
    }

    payload.event.preventDefault()
    folderDropIndicator.value = {
      targetFolderId: payload.folderId,
      position: resolveFolderDropPosition(payload.event),
    }
    return
  }

  if (!draggingBookmarkId.value) {
    return
  }

  payload.event.preventDefault()
  bookmarkDropIndicator.value = {
    folderId: payload.folderId,
    position: 'end',
  }
}

function onBookmarkDragOver(payload: { event: DragEvent; folderId: string; bookmarkId: string }) {
  if (!draggingBookmarkId.value) {
    return
  }

  payload.event.preventDefault()
  bookmarkDropIndicator.value = {
    folderId: payload.folderId,
    targetBookmarkId: payload.bookmarkId,
    position: resolveDropPosition(payload.event),
  }
}

function onFolderDrop(folderId: string) {
  if (draggingFolderId.value) {
    const indicator = folderDropIndicator.value
    if (!indicator || indicator.targetFolderId !== folderId) {
      onFolderDragEnd()
      return
    }

    emit('move-folder', {
      folderId: draggingFolderId.value,
      targetFolderId: folderId,
      position: indicator.position,
    })

    onFolderDragEnd()
    return
  }

  if (!draggingBookmarkId.value) {
    return
  }

  emit('move-bookmark', {
    bookmarkId: draggingBookmarkId.value,
    targetFolderId: folderId,
    position: 'end',
  })

  onBookmarkDragEnd()
}

function onBookmarkDrop(payload: { folderId: string; bookmarkId: string }) {
  if (!draggingBookmarkId.value || !bookmarkDropIndicator.value) {
    return
  }

  emit('move-bookmark', {
    bookmarkId: draggingBookmarkId.value,
    targetFolderId: payload.folderId,
    targetBookmarkId: payload.bookmarkId,
    position: bookmarkDropIndicator.value.position,
  })

  onBookmarkDragEnd()
}

function getFolderById(folderId: string, folders: TreeFolder[] = props.tree): TreeFolder | undefined {
  for (const folder of folders) {
    if (folder.id === folderId) {
      return folder
    }

    const childFolder = getFolderById(folderId, folder.children)
    if (childFolder) {
      return childFolder
    }
  }

  return undefined
}

function getBookmarkById(bookmarkId: string, folders: TreeFolder[] = props.tree): BookmarkItem | undefined {
  for (const folder of folders) {
    const bookmark = folder.bookmarks.find((item) => item.id === bookmarkId)
    if (bookmark) {
      return bookmark
    }

    const childBookmark = getBookmarkById(bookmarkId, folder.children)
    if (childBookmark) {
      return childBookmark
    }
  }

  return undefined
}

function resolveDropPosition(event: DragEvent): BookmarkDropPosition {
  const currentTarget = event.currentTarget as HTMLElement | null
  if (!currentTarget) {
    return 'before'
  }

  const { top, height } = currentTarget.getBoundingClientRect()
  return event.clientY >= top + height / 2 ? 'after' : 'before'
}

function resolveFolderDropPosition(event: DragEvent): 'before' | 'after' {
  return resolveDropPosition(event) === 'after' ? 'after' : 'before'
}
</script>

<template>
  <div class="tree-scroll" @contextmenu.prevent="onBlankContextMenu">
    <template v-if="tree.length">
      <FolderTreeNode
        v-for="folder in tree"
        :key="folder.id"
        :folder="folder"
        :active-bookmark-id="activeBookmarkId"
        :dragging-bookmark-id="draggingBookmarkId"
        :dragging-folder-id="draggingFolderId"
        :folder-drop-target-id="folderDropIndicator?.targetFolderId ?? ''"
        :folder-drop-position="folderDropIndicator?.position ?? null"
        :bookmark-drop-indicator="bookmarkDropIndicator"
        @toggle-folder="emit('toggle-folder', $event)"
        @select-bookmark="emit('select-bookmark', $event)"
        @folder-contextmenu="onFolderContextMenu"
        @bookmark-contextmenu="onBookmarkContextMenu"
        @folder-dragstart="onFolderDragStart"
        @folder-dragend="onFolderDragEnd"
        @folder-dragover="onFolderDragOver"
        @folder-drop="onFolderDrop"
        @bookmark-dragstart="onBookmarkDragStart"
        @bookmark-dragend="onBookmarkDragEnd"
        @bookmark-dragover="onBookmarkDragOver"
        @bookmark-drop="onBookmarkDrop"
      />
    </template>

    <section v-else class="empty-state">
      <h3>还没有书签文件夹</h3>
      <p>先创建一个文件夹，再把常用站点收进来。后续所有修改都会保存在本地。</p>
      <button type="button" class="empty-action" @click="createFirstFolder">新增文件夹</button>
    </section>

    <BookmarkContextMenu
      :visible="Boolean(contextMenu)"
      :x="contextMenu?.x ?? 0"
      :y="contextMenu?.y ?? 0"
      :items="contextMenuItems"
      @select="handleContextMenuAction"
    />

    <BookmarkEditorDialog
      :visible="Boolean(editor)"
      :mode="editor?.kind === 'bookmark' ? 'bookmark' : 'folder'"
      :title="dialogTitle"
      :confirm-label="dialogConfirmLabel"
      :initial-name="dialogInitialName"
      :initial-url="dialogInitialUrl"
      @close="closeEditor"
      @submit="submitEditor"
    />
  </div>
</template>

<style scoped>
.tree-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.65rem 0.45rem 0.9rem;
}

.empty-state {
  margin-top: 0.55rem;
  padding: 1rem 0.9rem;
  border: 1px dashed color-mix(in srgb, var(--ink-12) 72%, transparent);
  border-radius: 16px;
  text-align: left;
}

.empty-state h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 0.98rem;
}

.empty-state p {
  margin: 0.45rem 0 0;
  color: var(--color-text-light);
  font-size: 0.82rem;
  line-height: 1.6;
}

.empty-action {
  margin-top: 0.85rem;
  height: 34px;
  padding: 0 0.85rem;
  border: 1px solid rgba(160, 113, 63, 0.18);
  border-radius: 10px;
  color: #7a522d;
  background: linear-gradient(180deg, rgba(247, 236, 221, 1), rgba(234, 219, 196, 0.96));
  cursor: pointer;
}
</style>
