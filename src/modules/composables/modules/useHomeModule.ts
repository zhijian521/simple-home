import { computed, ref } from 'vue'
import { createInitialTree, HOME_BOOKMARK_ID } from '../../model/data'
import type { CliMessage, TreeFolder } from '../../model/types'

interface UseHomeModuleOptions {
  onNavigate?: () => void
}

export function useHomeModule(options: UseHomeModuleOptions = {}) {
  const tree = ref(createInitialTree())
  const activeBookmarkId = ref(HOME_BOOKMARK_ID)
  const searchKeyword = ref('')
  const cliStarted = ref(false)
  const cliMessages = ref<CliMessage[]>([])

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

  function pushMessage(role: CliMessage['role'], content: string) {
    cliMessages.value.push({
      id: pushId(),
      role,
      content,
    })
  }

  function submitSearch() {
    const value = searchKeyword.value.trim()
    if (!value) {
      if (cliStarted.value) {
        pushMessage('system', '请输入关键词后再执行搜索。')
      }
      return
    }

    const isDirectUrl = /^(https?:\/\/|mailto:)/i.test(value)
    const targetUrl = isDirectUrl ? value : `https://www.google.com/search?q=${encodeURIComponent(value)}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
    if (cliStarted.value) {
      pushMessage('user', `web ${value}`)
      pushMessage('system', isDirectUrl ? `已打开链接：${targetUrl}` : `已打开搜索：${value}`)
    }
    searchKeyword.value = ''
  }

  function submitAiChat() {
    if (!cliStarted.value) {
      cliStarted.value = true
      pushMessage('system', 'SimpleHome CLI ready. 输入指令内容后选择执行动作。')
    }

    const value = searchKeyword.value.trim()
    if (!value) {
      pushMessage('system', '请输入内容后再发起 AI 对话。')
      return
    }

    pushMessage('user', `ai ${value}`)
    // TODO: 后续改成真实接口调用，这里先使用本地写死回复。
    pushMessage('assistant', buildMockReply(value))
    searchKeyword.value = ''
  }

  function resetHome() {
    activeBookmarkId.value = HOME_BOOKMARK_ID
    searchKeyword.value = ''
    cliStarted.value = false
    cliMessages.value = []
  }

  return {
    tree,
    activeBookmarkId,
    searchKeyword,
    cliStarted,
    cliMessages,
    toggleFolder,
    selectBookmark,
    setSearchKeyword,
    submitSearch,
    submitAiChat,
    resetHome,
  }
}

function pushId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function buildMockReply(input: string) {
  const text = input.toLowerCase()

  if (text.includes('vue') || text.includes('vite') || text.includes('typescript')) {
    return '建议先从模块边界入手：拆分 composable、补齐类型定义，再加最小测试保障回归。'
  }
  if (text.includes('ui') || text.includes('样式') || text.includes('设计')) {
    return '可以先锁定版式和色阶，再统一控件状态（默认/悬停/激活/禁用），最后补动效。'
  }
  if (text.includes('书签') || text.includes('整理') || text.includes('分类')) {
    return '建议按“高频-低频”两层分类：高频放首屏，低频按场景归档，并保持目录层级不超过两层。'
  }

  return '这是本地模拟回复：我已收到你的输入，后续可替换为真实 AI 接口返回。'
}
