<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import AiActionIcon from '../icons/AiActionIcon.vue'
import SearchActionIcon from '../icons/SearchActionIcon.vue'
import type { CliMessage } from '../../model/types'

const props = defineProps<{
  searchKeyword: string
  cliStarted: boolean
  cliMessages: CliMessage[]
}>()

const emit = defineEmits<{
  (event: 'update:search-keyword', value: string): void
  (event: 'submit-search'): void
  (event: 'submit-ai-chat'): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  emit('update:search-keyword', target?.value ?? '')
}

function prefixByRole(role: CliMessage['role']) {
  if (role === 'user') return 'you@simplehome:~$'
  if (role === 'assistant') return 'ai@simplehome:~$'
  return 'sys@simplehome:~$'
}

function labelByRole(role: CliMessage['role']) {
  if (role === 'user') return 'User'
  if (role === 'assistant') return 'Assistant'
  return 'System'
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMarkdown(content: string) {
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

const cliLogRef = ref<HTMLDivElement | null>(null)

const displayedMessages = computed<CliMessage[]>(() => {
  if (props.cliMessages.length) return props.cliMessages

  return [
    {
      id: 'placeholder-system-1',
      role: 'system',
      content: '输入内容后按 Enter 可直接发起 AI 对话；点击搜索按钮可用浏览器搜索当前关键词。',
    },
  ]
})

watch(
  () => props.cliMessages.map((message) => `${message.id}:${message.content.length}`).join('|'),
  async () => {
    if (!props.cliStarted || !props.cliMessages.length) return

    await nextTick()
    const cliLogElement = cliLogRef.value
    if (!cliLogElement) return

    cliLogElement.scrollTop = cliLogElement.scrollHeight
  },
)
</script>

<template>
  <section class="cli-shell" :class="{ 'is-started': cliStarted }" aria-label="CLI 搜索与对话区">
    <header class="cli-hero">
      <h1 class="cli-brand">Simple Home</h1>
    </header>

    <section class="cli-input-shell" aria-label="命令输入区">
      <div class="cli-input-row">
        <input
          id="bookmark-search"
          :value="searchKeyword"
          type="text"
          placeholder="search..."
          aria-label="CLI 输入"
          @input="onInput"
          @keydown.enter.prevent="emit('submit-ai-chat')"
        />
        <button type="button" class="cli-btn" aria-label="搜索引擎" title="搜索引擎" @click="emit('submit-search')">
          <SearchActionIcon />
        </button>
        <button
          type="button"
          class="cli-btn is-ai"
          aria-label="AI 对话"
          title="AI 对话"
          @click="emit('submit-ai-chat')"
        >
          <AiActionIcon />
        </button>
      </div>
    </section>

    <section class="cli-log-shell" aria-label="会话记录">
      <div ref="cliLogRef" class="cli-log" role="log" aria-live="polite">
        <div v-for="message in displayedMessages" :key="message.id" class="cli-line" :class="`is-${message.role}`">
          <div class="cli-line-head">
            <span class="cli-prefix">{{ prefixByRole(message.role) }}</span>
            <span class="cli-role">{{ labelByRole(message.role) }}</span>
          </div>
          <div v-if="message.role === 'assistant'" class="cli-text cli-markdown" v-html="renderMarkdown(message.content)" />
          <span v-else class="cli-text">{{ message.content }}</span>
        </div>
      </div>
    </section>
  </section>
</template>
