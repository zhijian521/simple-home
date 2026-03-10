export interface BookmarkItem {
  id: string
  title: string
  url: string
}

export interface TreeFolder {
  id: string
  name: string
  expanded: boolean
  bookmarks: BookmarkItem[]
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
