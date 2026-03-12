import type { CliMessage } from '../model/types'

export function prefixByRole(role: CliMessage['role']): string {
  if (role === 'user') return '$ME:'
  if (role === 'assistant') return '$AI:'
  return '$SYS:'
}

export function isPendingAssistantMessage(message: CliMessage): boolean {
  return message.role === 'assistant' && !message.content.trim()
}

export function createChatHistoryMarkdown(messages: CliMessage[]): string {
  const generatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
  const sections = messages.map((message) => {
    return [`## ${roleLabelByRole(message.role)}`, '', message.content || '_empty_', ''].join('\n')
  })

  return ['# Simple Home Chat History', '', `Generated: ${generatedAt}`, '', ...sections].join('\n')
}

export function renderMarkdown(content: string): string {
  const codeBlocks: string[] = []
  let html = escapeHtml(content)

  html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_match: string, language: string, code: string) => {
    const languageClass = language ? ` class="language-${language}"` : ''
    const block = `<pre class="md-code"><code${languageClass}>${code.trim()}</code></pre>`
    codeBlocks.push(block)
    return `@@CODE_BLOCK_${codeBlocks.length - 1}@@`
  })

  html = html
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')

  html = html.replace(/(?:^|\n)([-*] .+(?:\n[-*] .+)*)/g, (match: string) => {
    const items = match
      .trim()
      .split('\n')
      .map((line: string) => line.replace(/^[-*] /, '').trim())
      .map((line: string) => `<li>${line}</li>`)
      .join('')

    return `\n<ul>${items}</ul>`
  })

  html = html
    .split(/\n{2,}/)
    .map((block: string) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (/^<(h1|h2|h3|ul|pre)/.test(trimmed)) return trimmed
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`
    })
    .join('')

  return html.replace(/@@CODE_BLOCK_(\d+)@@/g, (_match: string, index: string) => codeBlocks[Number(index)] || '')
}

function roleLabelByRole(role: CliMessage['role']): string {
  if (role === 'user') return 'ME'
  if (role === 'assistant') return 'AI'
  return 'SYS'
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
