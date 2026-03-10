import { computed, ref } from 'vue'
import { apiConfig } from '../../config/api'
import { createInitialNotes, createInitialTree, HOME_BOOKMARK_ID, THEME_KEY } from '../model/data'
import type { CliMessage, ModuleKey, ThemeMode } from '../model/types'

const AI_SYSTEM_PROMPT = [
  '你是 SimpleHome 中的 AI 助手。',
  '请始终使用 Markdown 输出。',
  '默认使用简体中文。',
  '回答保持准确、直接、简洁。',
  '只有在确实需要展示代码时才使用代码块。',
].join(' ')

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

  const activeNote = computed(() => notes.value.find((note) => note.id === activeNoteId.value))
  const resourcePanelTitle = computed(() => (activeModule.value === 'home' ? '书签管理器' : '笔记列表'))
  const contentPanelTitle = computed(() => (activeModule.value === 'home' ? 'CLI 搜索与对话' : '笔记详情'))
  const bookmarkUrls = computed(() =>
    tree.value.flatMap((folder) => folder.bookmarks.map((bookmark) => ({ id: bookmark.id, url: bookmark.url }))),
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
    const folder = tree.value.find((item) => item.id === folderId)
    if (folder) {
      folder.expanded = !folder.expanded
    }
  }

  function selectBookmark(bookmarkId: string) {
    const targetBookmark = bookmarkUrls.value.find((bookmark) => bookmark.id === bookmarkId)
    if (!targetBookmark) return

    activeBookmarkId.value = bookmarkId
    window.open(targetBookmark.url, '_blank', 'noopener,noreferrer')
  }

  function selectNote(noteId: string) {
    activeNoteId.value = noteId
  }

  function setSearchKeyword(value: string) {
    searchKeyword.value = value
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
    if (!cliStarted.value) {
      cliStarted.value = true
      pushMessage(cliMessages.value, 'system', 'SimpleHome CLI ready. 输入指令内容后选择执行动作。')
    }

    if (aiRequestInFlight.value) {
      pushMessage(cliMessages.value, 'system', 'AI 正在输出，请等待当前回复完成。')
      return
    }

    const value = searchKeyword.value.trim()
    if (!value) {
      pushMessage(cliMessages.value, 'system', '请输入内容后再发起 AI 对话。')
      return
    }

    pushMessage(cliMessages.value, 'user', `ai ${value}`)
    searchKeyword.value = ''
    aiRequestInFlight.value = true

    const assistantMessageId = pushMessage(cliMessages.value, 'assistant', '')
    const requestMessages = buildRequestMessages(cliMessages.value)

    try {
      let received = ''

      await streamDeepSeekReply(requestMessages, (chunk) => {
        received += chunk
        updateMessage(cliMessages.value, assistantMessageId, received)
      })

      if (!received.trim()) {
        updateMessage(cliMessages.value, assistantMessageId, '接口已连接，但没有返回可显示的内容。')
      }
    } catch (error) {
      removeMessage(cliMessages.value, assistantMessageId)
      const message = error instanceof Error ? error.message : 'AI 请求失败，请稍后重试。'
      pushMessage(cliMessages.value, 'system', message)
    } finally {
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

function buildRequestMessages(messages: CliMessage[]) {
  return [
    {
      role: 'system' as const,
      content: AI_SYSTEM_PROMPT,
    },
    ...messages.filter(isConversationMessage).map((message) => ({
      role: message.role,
      content: message.role === 'user' ? message.content.slice(3) : message.content,
    })),
  ]
}

function isConversationMessage(message: CliMessage): message is CliMessage & { role: 'user' | 'assistant' } {
  return message.role === 'user' || message.role === 'assistant'
}

async function streamDeepSeekReply(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  onChunk: (chunk: string) => void,
) {
  const response = await fetch(apiConfig.deepseekChatCompletionsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      stream: true,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(extractErrorMessage(data) || `AI 请求失败（${response.status}）`)
  }

  if (!response.body) {
    throw new Error('AI 流式响应不可用，请检查 simple-api 服务。')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''

    for (const event of events) {
      const parsed = parseSSEEvent(event)
      if (!parsed) continue
      if (parsed.done) return
      if (parsed.error) {
        throw new Error(parsed.error)
      }
      if (parsed.content) {
        onChunk(parsed.content)
      }
    }
  }

  if (!buffer.trim()) return

  const parsed = parseSSEEvent(buffer)
  if (parsed?.error) {
    throw new Error(parsed.error)
  }
  if (parsed?.content) {
    onChunk(parsed.content)
  }
}

function parseSSEEvent(event: string) {
  const dataLine = event
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('data:'))

  if (!dataLine) return null

  const payload = dataLine.slice(5).trim()
  if (!payload || payload === '[DONE]') {
    return { done: true }
  }

  const parsed = JSON.parse(payload) as
    | {
        done?: boolean
        error?: string
        choices?: Array<{ delta?: { content?: string } }>
      }
    | undefined

  if (!parsed) return null
  if (parsed.done) return { done: true }
  if (parsed.error) return { error: parsed.error }

  return {
    content: parsed.choices?.[0]?.delta?.content || '',
  }
}

function extractErrorMessage(data: unknown) {
  if (!data || typeof data !== 'object') return ''

  const direct = (data as { error?: string }).error
  if (typeof direct === 'string') return direct

  const nested = (data as { error?: { message?: string } }).error?.message
  if (typeof nested === 'string') return nested

  const message = (data as { message?: string }).message
  return typeof message === 'string' ? message : ''
}
