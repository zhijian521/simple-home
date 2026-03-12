import { computed, ref } from 'vue'
import { createInitialNotes, createInitialTree, HOME_BOOKMARK_ID, THEME_KEY } from '../model/data'
import type { CliMessage, ModuleKey, ThemeMode } from '../model/types'
import { buildChatRequestMessages, isAbortError, streamChatReply } from '../services/chat'

export function useHomeState() {
  const activeModule = ref<ModuleKey>('home')
  const themeMode = ref<ThemeMode>(initThemeMode())
  const tree = ref(createInitialTree())
  const notes = ref(createInitialNotes())
  const activeBookmarkId = ref(HOME_BOOKMARK_ID)
  const activeNoteId = ref(notes.value[0]?.id ?? '')
  const searchKeyword = ref('')
  const cliStarted = ref(false)
  const cliMessages = ref<CliMessage[]>([])
  const aiRequestInFlight = ref(false)
  const currentStreamController = ref<AbortController | null>(null)

  const activeNote = computed(() => notes.value.find((note) => note.id === activeNoteId.value))
  const resourcePanelTitle = computed(() => (activeModule.value === 'home' ? '书签管理器' : '笔记列表'))
  const contentPanelTitle = computed(() => (activeModule.value === 'home' ? 'CLI 搜索与对话' : '笔记详情'))

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
    const folder = tree.value.find((item) => item.id === folderId)
    if (folder) {
      folder.expanded = !folder.expanded
    }
  }

  function selectBookmark(bookmarkId: string) {
    const targetUrl = findBookmarkUrl(tree.value, bookmarkId)
    if (!targetUrl) return

    activeBookmarkId.value = bookmarkId
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
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
    selectNote,
    setSearchKeyword,
    clearCliSession,
    submitSearch,
    submitAiChat,
  }
}

function initThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'

  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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

function findBookmarkUrl(
  tree: Array<{ bookmarks: Array<{ id: string; url: string }> }>,
  bookmarkId: string,
): string | undefined {
  for (const folder of tree) {
    const bookmark = folder.bookmarks.find((item) => item.id === bookmarkId)
    if (bookmark) {
      return bookmark.url
    }
  }

  return undefined
}
