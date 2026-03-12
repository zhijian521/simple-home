import { apiConfig } from '../../config/api'
import type { CliMessage } from '../model/types'

const AI_SYSTEM_PROMPT = [
  '你是 SimpleHome 中的 AI 助手。',
  '请始终使用 Markdown 输出。',
  '默认使用简体中文。',
  '回答保持准确、直接、简洁。',
  '只有在确实需要展示代码时才使用代码块。',
].join(' ')

type ChatRequestMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatSsePayload = {
  done?: boolean
  error?: string
  choices?: Array<{ delta?: { content?: string } }>
}

export function buildChatRequestMessages(messages: CliMessage[]): ChatRequestMessage[] {
  return [
    {
      role: 'system',
      content: AI_SYSTEM_PROMPT,
    },
    ...messages.filter(isConversationMessage).map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ]
}

export async function streamChatReply(
  messages: ChatRequestMessage[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(apiConfig.deepseekChatCompletionsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
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
      const parsed = parseSseEvent(event)
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

  if (!buffer.trim()) {
    return
  }

  const parsed = parseSseEvent(buffer)
  if (parsed?.error) {
    throw new Error(parsed.error)
  }
  if (parsed?.content) {
    onChunk(parsed.content)
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : error instanceof Error && error.name === 'AbortError'
}

function isConversationMessage(message: CliMessage): message is CliMessage & { role: 'user' | 'assistant' } {
  return message.role === 'user' || message.role === 'assistant'
}

function parseSseEvent(event: string) {
  const dataLine = event
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('data:'))

  if (!dataLine) {
    return null
  }

  const payload = dataLine.slice(5).trim()
  if (!payload || payload === '[DONE]') {
    return { done: true }
  }

  const parsed = JSON.parse(payload) as ChatSsePayload | undefined

  if (!parsed) {
    return null
  }

  if (parsed.done) {
    return { done: true }
  }

  if (parsed.error) {
    return { error: parsed.error }
  }

  return {
    content: parsed.choices?.[0]?.delta?.content || '',
  }
}

function extractErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return ''
  }

  const direct = (data as { error?: string }).error
  if (typeof direct === 'string') {
    return direct
  }

  const nested = (data as { error?: { message?: string } }).error?.message
  if (typeof nested === 'string') {
    return nested
  }

  const message = (data as { message?: string }).message
  return typeof message === 'string' ? message : ''
}
