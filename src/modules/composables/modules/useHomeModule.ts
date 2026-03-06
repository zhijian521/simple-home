import { computed, ref } from 'vue'
import { createInitialTree, HOME_BOOKMARK_ID } from '../../model/data'
import type { TreeFolder } from '../../model/types'

interface UseHomeModuleOptions {
  onNavigate?: () => void
}

export function useHomeModule(options: UseHomeModuleOptions = {}) {
  const tree = ref(createInitialTree())
  const activeBookmarkId = ref(HOME_BOOKMARK_ID)
  const searchKeyword = ref('')

  const allBookmarks = computed(() => {
    const output: { id: string; url: string }[] = []
    const visit = (nodes: TreeFolder[]) => {
      for (const node of nodes) {
        output.push(...node.bookmarks.map((bookmark) => ({ id: bookmark.id, url: bookmark.url })))
        if (node.folders) visit(node.folders)
      }
    }

    visit(tree.value)
    return output
  })

  function toggleFolder(folderId: string) {
    const visit = (nodes: TreeFolder[]): boolean => {
      for (const node of nodes) {
        if (node.id === folderId) {
          node.expanded = !node.expanded
          return true
        }
        if (node.folders && visit(node.folders)) return true
      }
      return false
    }
    visit(tree.value)
  }

  function selectBookmark(bookmarkId: string) {
    const targetBookmark = allBookmarks.value.find((bookmark) => bookmark.id === bookmarkId)
    if (!targetBookmark) return

    activeBookmarkId.value = bookmarkId
    window.open(targetBookmark.url, '_blank', 'noopener,noreferrer')
    options.onNavigate?.()
  }

  function setSearchKeyword(value: string) {
    searchKeyword.value = value
  }

  function submitSearch() {
    const value = searchKeyword.value.trim()
    if (!value) return

    const isDirectUrl = /^(https?:\/\/|mailto:)/i.test(value)
    const targetUrl = isDirectUrl ? value : `https://www.google.com/search?q=${encodeURIComponent(value)}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  function resetHome() {
    activeBookmarkId.value = HOME_BOOKMARK_ID
    searchKeyword.value = ''
  }

  return {
    tree,
    activeBookmarkId,
    searchKeyword,
    toggleFolder,
    selectBookmark,
    setSearchKeyword,
    submitSearch,
    resetHome,
  }
}
