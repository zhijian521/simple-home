import { computed, ref, watch } from 'vue'
import { createInitialNotes, createInitialTree, HOME_BOOKMARK_ID, THEME_KEY } from '../model/data'
import type {
  CliMessage,
  CreateBookmarkPayload,
  CreateFolderPayload,
  ModuleKey,
  MoveFolderPayload,
  MoveBookmarkPayload,
  ThemeMode,
  UpdateBookmarkPayload,
  UpdateFolderPayload,
} from '../model/types'
import {
  createBookmark,
  createFolder,
  deleteBookmark,
  deleteFolder,
  findBookmarkById,
  getFirstBookmarkId,
  loadBookmarkTree,
  moveBookmark,
  moveFolder,
  saveBookmarkTree,
  toggleFolderExpanded,
  treeHasBookmark,
  updateBookmark,
  updateFolder,
} from '../services/bookmarks'
import { buildChatRequestMessages, isAbortError, streamChatReply } from '../services/chat'

export function useHomeState() {
  const activeModule = ref<ModuleKey>('home')
  const themeMode = ref<ThemeMode>(initThemeMode())
  const tree = ref(loadBookmarkTree())
  const notes = ref(createInitialNotes())
  const activeBookmarkId = ref(resolveInitialBookmarkId(tree.value))
  const activeNoteId = ref(notes.value[0]?.id ?? '')
  const searchKeyword = ref('')
  const cliStarted = ref(false)
  const cliMessages = ref<CliMessage[]>([])
  const aiRequestInFlight = ref(false)
  const currentStreamController = ref<AbortController | null>(null)

  const activeNote = computed(() => notes.value.find((note) => note.id === activeNoteId.value))
  const resourcePanelTitle = computed(() => (activeModule.value === 'home' ? '书签管理器' : '笔记列表'))
  const contentPanelTitle = computed(() => (activeModule.value === 'home' ? 'CLI 搜索与对话' : '笔记详情'))

  watch(
    themeMode,
    (mode) => {
      applyDocumentTheme(mode)
    },
    { immediate: true },
  )

  watch(
    tree,
    (nextTree) => {
      saveBookmarkTree(nextTree)

      if (!nextTree.length) {
        activeBookmarkId.value = ''
        return
      }

      if (activeBookmarkId.value && treeHasBookmark(nextTree, activeBookmarkId.value)) {
        return
      }

      activeBookmarkId.value = resolveInitialBookmarkId(nextTree)
    },
    { deep: true },
  )

  function goHome() {
    activeModule.value = 'home'
  }

  function goNotes() {
    activeModule.value = 'notes'
    if (!activeNoteId.value && notes.value[0]) {
      activeNoteId.value = notes.value[0].id
    }
  }

  function toggleTheme() {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
    window.localStorage.setItem(THEME_KEY, themeMode.value)
  }

  function toggleFolder(folderId: string) {
    tree.value = toggleFolderExpanded(tree.value, folderId)
  }

  function selectBookmark(bookmarkId: string) {
    const targetUrl = findBookmarkById(tree.value, bookmarkId)?.url
    if (!targetUrl) return

    activeBookmarkId.value = bookmarkId
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  function createBookmarkFolder(payload: CreateFolderPayload) {
    tree.value = createFolder(tree.value, payload)
  }

  function updateBookmarkFolder(payload: UpdateFolderPayload) {
    tree.value = updateFolder(tree.value, payload.folderId, payload.name)
  }

  function deleteBookmarkFolder(folderId: string) {
    tree.value = deleteFolder(tree.value, folderId)
  }

  function addBookmark(payload: CreateBookmarkPayload) {
    tree.value = createBookmark(tree.value, payload)
  }

  function editBookmark(payload: UpdateBookmarkPayload) {
    tree.value = updateBookmark(tree.value, payload)
  }

  function removeBookmark(bookmarkId: string) {
    tree.value = deleteBookmark(tree.value, bookmarkId)
  }

  function repositionBookmark(payload: MoveBookmarkPayload) {
    tree.value = moveBookmark(tree.value, payload)
  }

  function repositionFolder(payload: MoveFolderPayload) {
    tree.value = moveFolder(tree.value, payload)
  }

  function selectNote(noteId: string) {
    activeNoteId.value = noteId
  }

  function setSearchKeyword(value: string) {
    searchKeyword.value = value
  }

  function clearCliSession() {
    currentStreamController.value?.abort()
    currentStreamController.value = null
    aiRequestInFlight.value = false
    cliStarted.value = false
    cliMessages.value = []
    searchKeyword.value = ''
  }

  function submitSearch() {
    const value = searchKeyword.value.trim()
    if (!value) {
      if (cliStarted.value) {
        pushMessage(cliMessages.value, 'system', '请输入关键词后再执行搜索。')
      }
      return
    }

    const isDirectUrl = /^(https?:\/\/|mailto:)/i.test(value)
    const targetUrl = isDirectUrl ? value : `https://www.google.com/search?q=${encodeURIComponent(value)}`

    window.open(targetUrl, '_blank', 'noopener,noreferrer')

    if (cliStarted.value) {
      pushMessage(cliMessages.value, 'user', `web ${value}`)
      pushMessage(cliMessages.value, 'system', isDirectUrl ? `已打开链接：${targetUrl}` : `已打开搜索：${value}`)
    }

    searchKeyword.value = ''
  }

  async function submitAiChat() {
    ensureCliStarted(cliStarted, cliMessages.value)

    if (aiRequestInFlight.value) {
      pushMessage(cliMessages.value, 'system', 'AI 正在输出，请等待当前回复完成。')
      return
    }

    const value = searchKeyword.value.trim()
    if (!value) {
      pushMessage(cliMessages.value, 'system', '请输入内容后再发起 AI 对话。')
      return
    }

    pushMessage(cliMessages.value, 'user', value)
    searchKeyword.value = ''
    aiRequestInFlight.value = true

    const assistantMessageId = pushMessage(cliMessages.value, 'assistant', '')
    const requestMessages = buildChatRequestMessages(cliMessages.value)
    const abortController = new AbortController()
    currentStreamController.value = abortController

    try {
      let received = ''

      await streamChatReply(
        requestMessages,
        (chunk) => {
          received += chunk
          updateMessage(cliMessages.value, assistantMessageId, received)
        },
        abortController.signal,
      )

      if (!received.trim()) {
        updateMessage(cliMessages.value, assistantMessageId, '接口已连接，但没有返回可显示的内容。')
      }
    } catch (error) {
      if (isAbortError(error)) {
        return
      }

      removeMessage(cliMessages.value, assistantMessageId)
      const message = error instanceof Error ? error.message : 'AI 请求失败，请稍后重试。'
      pushMessage(cliMessages.value, 'system', message)
    } finally {
      if (currentStreamController.value === abortController) {
        currentStreamController.value = null
      }
      aiRequestInFlight.value = false
    }
  }

  return {
    tree,
    notes,
    activeBookmarkId,
    activeModule,
    activeNoteId,
    searchKeyword,
    cliStarted,
    cliMessages,
    themeMode,
    activeNote,
    resourcePanelTitle,
    contentPanelTitle,
    goHome,
    goNotes,
    toggleTheme,
    toggleFolder,
    selectBookmark,
    createBookmarkFolder,
    updateBookmarkFolder,
    deleteBookmarkFolder,
    addBookmark,
    editBookmark,
    removeBookmark,
    repositionFolder,
    repositionBookmark,
    selectNote,
    setSearchKeyword,
    clearCliSession,
    submitSearch,
    submitAiChat,
  }
}

function resolveInitialBookmarkId(tree: ReturnType<typeof createInitialTree>) {
  return treeHasBookmark(tree, HOME_BOOKMARK_ID) ? HOME_BOOKMARK_ID : getFirstBookmarkId(tree)
}

function initThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'

  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyDocumentTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.classList.add('simplehome-app')
  document.body.classList.toggle('simplehome-theme-dark', mode === 'dark')
}

function pushMessage(messages: CliMessage[], role: CliMessage['role'], content: string) {
  const message = {
    id: createMessageId(),
    role,
    content,
  }

  messages.push(message)
  return message.id
}

function updateMessage(messages: CliMessage[], messageId: string, content: string) {
  const target = messages.find((message) => message.id === messageId)
  if (target) {
    target.content = content
  }
}

function removeMessage(messages: CliMessage[], messageId: string) {
  const index = messages.findIndex((message) => message.id === messageId)
  if (index !== -1) {
    messages.splice(index, 1)
  }
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function ensureCliStarted(cliStarted: { value: boolean }, messages: CliMessage[]) {
  if (cliStarted.value) {
    return
  }

  cliStarted.value = true
  pushMessage(messages, 'system', 'SimpleHome CLI ready. 输入指令内容后选择执行动作。')
}
