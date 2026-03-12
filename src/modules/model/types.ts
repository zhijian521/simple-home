export interface BookmarkItem {
  id: string
  title: string
  url: string
}

export interface BookmarkDraft {
  title: string
  url: string
}

export interface TreeFolder {
  id: string
  name: string
  expanded: boolean
  bookmarks: BookmarkItem[]
  children: TreeFolder[]
}

export interface FolderDraft {
  name: string
}

export type FolderCreatePlacement = 'root' | 'sibling' | 'child'

export interface CreateFolderPayload extends FolderDraft {
  placement: FolderCreatePlacement
  referenceFolderId?: string
}

export interface CreateBookmarkPayload extends BookmarkDraft {
  folderId: string
}

export interface UpdateBookmarkPayload extends BookmarkDraft {
  bookmarkId: string
}

export interface UpdateFolderPayload extends FolderDraft {
  folderId: string
}

export type BookmarkDropPosition = 'before' | 'after' | 'end'

export interface MoveBookmarkPayload {
  bookmarkId: string
  targetFolderId: string
  targetBookmarkId?: string
  position: BookmarkDropPosition
}

export interface MoveFolderPayload {
  folderId: string
  targetFolderId: string
  position: 'before' | 'after'
}

export interface NoteItem {
  id: string
  title: string
  updatedAt: string
  summary: string
  content: string
}

export interface CliMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type ThemeMode = 'light' | 'dark'
export type ModuleKey = 'home' | 'notes'
