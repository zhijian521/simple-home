import { createInitialTree } from '../model/data'
import type {
  BookmarkDraft,
  BookmarkItem,
  BookmarkDropPosition,
  CreateBookmarkPayload,
  CreateFolderPayload,
  MoveFolderPayload,
  MoveBookmarkPayload,
  TreeFolder,
  UpdateBookmarkPayload,
} from '../model/types'

const BOOKMARK_TREE_KEY = 'simplehome.bookmark-tree'

type FolderLocation = {
  folder: TreeFolder
  index: number
  siblings: TreeFolder[]
}

type BookmarkLocation = {
  bookmark: BookmarkItem
  index: number
  folder: TreeFolder
}

export function loadBookmarkTree(): TreeFolder[] {
  if (typeof window === 'undefined') {
    return createInitialTree()
  }

  const raw = window.localStorage.getItem(BOOKMARK_TREE_KEY)
  if (!raw) {
    return createInitialTree()
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed) && parsed.length === 0) {
      return []
    }

    const normalized = normalizeTree(parsed)
    return normalized.length ? normalized : createInitialTree()
  } catch {
    return createInitialTree()
  }
}

export function saveBookmarkTree(tree: TreeFolder[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(BOOKMARK_TREE_KEY, JSON.stringify(tree))
}

export function toggleFolderExpanded(tree: TreeFolder[], folderId: string): TreeFolder[] {
  const nextTree = cloneTree(tree)
  const location = findFolderLocation(nextTree, folderId)
  if (!location) {
    return tree
  }

  location.folder.expanded = !location.folder.expanded
  return nextTree
}

export function createFolder(tree: TreeFolder[], payload: CreateFolderPayload): TreeFolder[] {
  const name = payload.name.trim()
  if (!name) {
    return tree
  }

  const nextTree = cloneTree(tree)
  const folder = createEmptyFolder(name)

  if (payload.placement === 'root' || !payload.referenceFolderId) {
    nextTree.push(folder)
    return nextTree
  }

  const location = findFolderLocation(nextTree, payload.referenceFolderId)
  if (!location) {
    return tree
  }

  if (payload.placement === 'child') {
    location.folder.expanded = true
    location.folder.children.push(folder)
    return nextTree
  }

  location.siblings.splice(location.index + 1, 0, folder)
  return nextTree
}

export function updateFolder(tree: TreeFolder[], folderId: string, name: string): TreeFolder[] {
  const normalizedName = name.trim()
  if (!normalizedName) {
    return tree
  }

  const nextTree = cloneTree(tree)
  const location = findFolderLocation(nextTree, folderId)
  if (!location) {
    return tree
  }

  location.folder.name = normalizedName
  return nextTree
}

export function deleteFolder(tree: TreeFolder[], folderId: string): TreeFolder[] {
  const nextTree = cloneTree(tree)
  const location = findFolderLocation(nextTree, folderId)
  if (!location) {
    return tree
  }

  location.siblings.splice(location.index, 1)
  return nextTree
}

export function createBookmark(tree: TreeFolder[], payload: CreateBookmarkPayload): TreeFolder[] {
  const bookmark = normalizeDraftBookmark(payload)
  if (!bookmark) {
    return tree
  }

  const nextTree = cloneTree(tree)
  const location = findFolderLocation(nextTree, payload.folderId)
  if (!location) {
    return tree
  }

  location.folder.expanded = true
  location.folder.bookmarks.push({
    id: createId('bookmark'),
    ...bookmark,
  })

  return nextTree
}

export function updateBookmark(tree: TreeFolder[], payload: UpdateBookmarkPayload): TreeFolder[] {
  const bookmark = normalizeDraftBookmark(payload)
  if (!bookmark) {
    return tree
  }

  const nextTree = cloneTree(tree)
  const location = findBookmarkLocation(nextTree, payload.bookmarkId)
  if (!location) {
    return tree
  }

  location.folder.bookmarks[location.index] = {
    ...location.bookmark,
    ...bookmark,
  }

  return nextTree
}

export function deleteBookmark(tree: TreeFolder[], bookmarkId: string): TreeFolder[] {
  const nextTree = cloneTree(tree)
  const location = findBookmarkLocation(nextTree, bookmarkId)
  if (!location) {
    return tree
  }

  location.folder.bookmarks.splice(location.index, 1)
  return nextTree
}

export function moveBookmark(tree: TreeFolder[], payload: MoveBookmarkPayload): TreeFolder[] {
  const nextTree = cloneTree(tree)
  const source = findBookmarkLocation(nextTree, payload.bookmarkId)
  if (!source) {
    return tree
  }

  if (payload.position !== 'end' && payload.targetBookmarkId === payload.bookmarkId) {
    return tree
  }

  const [bookmark] = source.folder.bookmarks.splice(source.index, 1)
  if (!bookmark) {
    return tree
  }

  const targetFolderLocation = findFolderLocation(nextTree, payload.targetFolderId)
  if (!targetFolderLocation) {
    return tree
  }

  const targetBookmarks = targetFolderLocation.folder.bookmarks
  const insertIndex = resolveBookmarkInsertIndex(targetBookmarks, payload.position, payload.targetBookmarkId)

  targetFolderLocation.folder.expanded = true
  targetBookmarks.splice(insertIndex, 0, bookmark)
  return nextTree
}

export function moveFolder(tree: TreeFolder[], payload: MoveFolderPayload): TreeFolder[] {
  const nextTree = cloneTree(tree)
  const source = findFolderLocation(nextTree, payload.folderId)
  const target = findFolderLocation(nextTree, payload.targetFolderId)

  if (!source || !target || source.folder.id === target.folder.id) {
    return tree
  }

  if (containsFolder(source.folder, payload.targetFolderId)) {
    return tree
  }

  const [folder] = source.siblings.splice(source.index, 1)
  if (!folder) {
    return tree
  }

  const updatedTarget = findFolderLocation(nextTree, payload.targetFolderId)
  if (!updatedTarget) {
    return tree
  }

  const insertIndex = payload.position === 'after' ? updatedTarget.index + 1 : updatedTarget.index
  updatedTarget.siblings.splice(insertIndex, 0, folder)
  return nextTree
}

export function countBookmarks(tree: TreeFolder[]): number {
  return tree.reduce(
    (total, folder) => total + folder.bookmarks.length + countBookmarks(folder.children),
    0,
  )
}

export function getFirstBookmarkId(tree: TreeFolder[]): string {
  for (const folder of tree) {
    const firstBookmark = folder.bookmarks[0]
    if (firstBookmark) {
      return firstBookmark.id
    }

    const childBookmarkId = getFirstBookmarkId(folder.children)
    if (childBookmarkId) {
      return childBookmarkId
    }
  }

  return ''
}

export function findBookmarkById(tree: TreeFolder[], bookmarkId: string): BookmarkItem | undefined {
  return findBookmarkLocation(tree, bookmarkId)?.bookmark
}

export function treeHasBookmark(tree: TreeFolder[], bookmarkId: string): boolean {
  return Boolean(findBookmarkById(tree, bookmarkId))
}

function normalizeTree(value: unknown): TreeFolder[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((folder, folderIndex) => normalizeFolder(folder, folderIndex))
    .filter((folder): folder is TreeFolder => Boolean(folder))
}

function normalizeFolder(value: unknown, folderIndex: number): TreeFolder | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const folder = value as Partial<TreeFolder>
  const name = typeof folder.name === 'string' ? folder.name.trim() : ''
  if (!name) {
    return null
  }

  const bookmarks = Array.isArray(folder.bookmarks)
    ? folder.bookmarks
        .map((bookmark, bookmarkIndex) => normalizeBookmark(bookmark, folderIndex, bookmarkIndex))
        .filter((bookmark): bookmark is BookmarkItem => Boolean(bookmark))
    : []

  const children = Array.isArray(folder.children)
    ? folder.children
        .map((child, childIndex) => normalizeFolder(child, childIndex))
        .filter((child): child is TreeFolder => Boolean(child))
    : []

  return {
    id: normalizeId(folder.id, `folder-${folderIndex}`),
    name,
    expanded: Boolean(folder.expanded),
    bookmarks,
    children,
  }
}

function normalizeBookmark(value: unknown, folderIndex: number, bookmarkIndex: number): BookmarkItem | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const bookmark = value as Partial<BookmarkItem>
  const normalized = normalizeDraftBookmark(bookmark)
  if (!normalized) {
    return null
  }

  return {
    id: normalizeId(bookmark.id, `bookmark-${folderIndex}-${bookmarkIndex}`),
    ...normalized,
  }
}

function normalizeDraftBookmark(value: Partial<BookmarkDraft>): BookmarkDraft | null {
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  const url = typeof value.url === 'string' ? value.url.trim() : ''

  if (!title || !url) {
    return null
  }

  return { title, url }
}

function normalizeId(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function cloneTree(tree: TreeFolder[]): TreeFolder[] {
  return tree.map((folder) => ({
    ...folder,
    bookmarks: [...folder.bookmarks],
    children: cloneTree(folder.children),
  }))
}

function createEmptyFolder(name: string): TreeFolder {
  return {
    id: createId('folder'),
    name,
    expanded: true,
    bookmarks: [],
    children: [],
  }
}

function findFolderLocation(tree: TreeFolder[], folderId: string): FolderLocation | null {
  return findFolderLocationInSiblings(tree, folderId)
}

function findFolderLocationInSiblings(siblings: TreeFolder[], folderId: string): FolderLocation | null {
  for (let index = 0; index < siblings.length; index += 1) {
    const folder = siblings[index]
    if (!folder) {
      continue
    }

    if (folder.id === folderId) {
      return { folder, index, siblings }
    }

    const childLocation = findFolderLocationInSiblings(folder.children, folderId)
    if (childLocation) {
      return childLocation
    }
  }

  return null
}

function findBookmarkLocation(tree: TreeFolder[], bookmarkId: string): BookmarkLocation | null {
  for (const folder of tree) {
    const bookmarkIndex = folder.bookmarks.findIndex((bookmark) => bookmark.id === bookmarkId)
    if (bookmarkIndex !== -1) {
      const bookmark = folder.bookmarks[bookmarkIndex]
      if (!bookmark) {
        return null
      }

      return {
        bookmark,
        index: bookmarkIndex,
        folder,
      }
    }

    const childLocation = findBookmarkLocation(folder.children, bookmarkId)
    if (childLocation) {
      return childLocation
    }
  }

  return null
}

function resolveBookmarkInsertIndex(
  bookmarks: BookmarkItem[],
  position: BookmarkDropPosition,
  targetBookmarkId?: string,
): number {
  if (position === 'end' || !targetBookmarkId) {
    return bookmarks.length
  }

  const targetIndex = bookmarks.findIndex((bookmark) => bookmark.id === targetBookmarkId)
  if (targetIndex === -1) {
    return bookmarks.length
  }

  return position === 'after' ? targetIndex + 1 : targetIndex
}

function containsFolder(folder: TreeFolder, targetFolderId: string): boolean {
  return folder.children.some((child) => child.id === targetFolderId || containsFolder(child, targetFolderId))
}

function createId(prefix: 'folder' | 'bookmark') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
