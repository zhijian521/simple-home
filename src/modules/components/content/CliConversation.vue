<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { CliMessage } from '../../model/types'
import { createChatHistoryMarkdown, isPendingAssistantMessage, prefixByRole, renderMarkdown } from '../../utils/chat'
import ClearChatIcon from '../icons/ClearChatIcon.vue'
import DownloadChatIcon from '../icons/DownloadChatIcon.vue'

const props = defineProps<{
  cliStarted: boolean
  cliMessages: CliMessage[]
}>()

const emit = defineEmits<{
  (event: 'clear-cli-session'): void
}>()

const cliLogRef = ref<HTMLDivElement | null>(null)

const displayedMessages = computed<CliMessage[]>(() => {
  if (props.cliMessages.length) {
    return props.cliMessages
  }

  return [
    {
      id: 'placeholder-system-1',
      role: 'system',
      content: '输入内容后按 Enter 可直接发起 AI 对话；点击搜索按钮可用浏览器搜索当前关键词。',
    },
  ]
})

const showActionButtons = computed(() => props.cliStarted || props.cliMessages.length > 0)

function downloadChatHistory() {
  if (!props.cliMessages.length || typeof window === 'undefined') {
    return
  }

  const content = createChatHistoryMarkdown(props.cliMessages)
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  link.href = url
  link.download = `simplehome-chat-${timestamp}.md`
  link.click()

  window.URL.revokeObjectURL(url)
}

watch(
  () => props.cliMessages.map((message) => `${message.id}:${message.content.length}`).join('|'),
  async () => {
    if (!props.cliStarted || !props.cliMessages.length) {
      return
    }

    await nextTick()
    const cliLogElement = cliLogRef.value
    if (!cliLogElement) {
      return
    }

    cliLogElement.scrollTop = cliLogElement.scrollHeight
  },
)
</script>

<template>
  <section class="cli-log-shell" aria-label="会话记录">
    <div ref="cliLogRef" class="cli-log" role="log" aria-live="polite">
      <div v-for="message in displayedMessages" :key="message.id" class="cli-line" :class="`is-${message.role}`">
        <div class="cli-line-head">
          <span class="cli-prefix" :data-role="message.role">{{ prefixByRole(message.role) }}</span>
        </div>
        <div v-if="isPendingAssistantMessage(message)" class="cli-text cli-thinking" aria-live="polite">
          <span>thinking</span>
          <span class="cli-thinking-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
        <div
          v-else-if="message.role === 'assistant'"
          class="cli-text cli-markdown"
          v-html="renderMarkdown(message.content)"
        />
        <span v-else class="cli-text">{{ message.content }}</span>
      </div>
    </div>

    <div v-if="showActionButtons" class="cli-log-actions">
      <button
        type="button"
        class="cli-clear-btn"
        aria-label="下载聊天记录"
        title="下载聊天记录"
        @click="downloadChatHistory"
      >
        <DownloadChatIcon />
      </button>
      <button
        type="button"
        class="cli-clear-btn"
        aria-label="清空会话"
        title="清空会话"
        @click="emit('clear-cli-session')"
      >
        <ClearChatIcon />
      </button>
    </div>
  </section>
</template>

<style scoped>
.cli-log {
  width: 100%;
  height: clamp(360px, 46vh, 540px);
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  overflow-y: auto;
  padding: 0.35rem 0 0.1rem;
}

.cli-log-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.45rem;
  padding-top: 0.55rem;
}

.cli-clear-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(160, 113, 63, 0.12);
  border-radius: 10px;
  color: color-mix(in srgb, var(--cli-accent-strong) 88%, #8a612e);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(243, 235, 222, 0.94));
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.cli-clear-btn:hover {
  color: var(--color-text);
  background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(239, 228, 211, 1));
  transform: translateY(-1px);
}

.cli-clear-btn svg {
  width: 20px;
  height: 20px;
}

:global(.explorer-page.theme-dark) .cli-clear-btn {
  border-color: rgba(215, 188, 145, 0.1);
  color: var(--cli-accent);
  background: linear-gradient(180deg, rgba(60, 51, 40, 0.96), rgba(45, 38, 30, 0.96));
}

:global(.explorer-page.theme-dark) .cli-clear-btn:hover {
  color: var(--color-text);
  background: linear-gradient(180deg, rgba(68, 58, 47, 1), rgba(52, 43, 34, 1));
}

.cli-line {
  --cli-line-accent: var(--ink-12);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
  padding: 0.72rem 0 0.72rem 2rem;
  color: var(--color-text-light);
}

.cli-line::before {
  content: '';
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 8px;
  width: 2px;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--cli-line-accent) 45%, transparent),
    var(--cli-line-accent),
    color-mix(in srgb, var(--cli-line-accent) 55%, transparent)
  );
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--cli-line-accent) 18%, transparent);
}

.cli-line::after {
  content: '';
  position: absolute;
  top: 0.82rem;
  left: 4px;
  width: 10px;
  height: 10px;
  box-sizing: border-box;
  border: 2px solid var(--cli-line-accent);
  border-radius: 999px;
  background: var(--panel-surface);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--cli-line-accent) 14%, transparent);
}

.cli-line.is-user {
  --cli-line-accent: rgba(160, 113, 63, 0.88);
}

.cli-line.is-assistant {
  --cli-line-accent: rgba(77, 123, 104, 0.88);
}

.cli-line.is-system {
  --cli-line-accent: color-mix(in srgb, var(--color-text-lighter) 78%, transparent);
}

:global(.explorer-page.theme-dark) .cli-line.is-user {
  --cli-line-accent: rgba(215, 188, 145, 0.92);
}

:global(.explorer-page.theme-dark) .cli-line.is-assistant {
  --cli-line-accent: rgba(141, 197, 173, 0.92);
}

:global(.explorer-page.theme-dark) .cli-line.is-system {
  --cli-line-accent: color-mix(in srgb, var(--color-text-lighter) 72%, transparent);
}

.cli-line-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.cli-prefix {
  width: 5rem;
  min-height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.18rem 0.58rem;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--color-text);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.38));
  box-shadow:
    0 8px 18px rgba(47, 52, 64, 0.05),
    inset 0 1px rgba(255, 255, 255, 0.5);
  font-family: 'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SFMono-Regular', monospace;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cli-prefix[data-role='system'] {
  border-color: rgba(95, 101, 116, 0.14);
  color: #5f6574;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(213, 217, 225, 0.42));
}

.cli-prefix[data-role='user'] {
  border-color: rgba(160, 113, 63, 0.16);
  color: #8b5d31;
  background: linear-gradient(180deg, rgba(247, 236, 221, 0.96), rgba(236, 219, 196, 0.82));
}

.cli-prefix[data-role='assistant'] {
  border-color: rgba(77, 123, 104, 0.18);
  color: #4d7b68;
  background: linear-gradient(180deg, rgba(230, 244, 237, 0.98), rgba(207, 229, 219, 0.84));
}

:global(.explorer-page.theme-dark) .cli-prefix {
  color: #f1e7d3;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.16),
    inset 0 1px rgba(255, 255, 255, 0.06);
}

:global(.explorer-page.theme-dark) .cli-prefix[data-role='system'] {
  border-color: rgba(193, 184, 168, 0.16);
  color: #c9c0b0;
  background: linear-gradient(180deg, rgba(66, 59, 49, 0.82), rgba(49, 43, 36, 0.72));
}

:global(.explorer-page.theme-dark) .cli-prefix[data-role='user'] {
  border-color: rgba(215, 188, 145, 0.18);
  color: #f0d7b0;
  background: linear-gradient(180deg, rgba(89, 66, 39, 0.88), rgba(66, 48, 28, 0.76));
}

:global(.explorer-page.theme-dark) .cli-prefix[data-role='assistant'] {
  border-color: rgba(141, 197, 173, 0.2);
  color: #a9d7c3;
  background: linear-gradient(180deg, rgba(47, 74, 64, 0.9), rgba(34, 56, 48, 0.76));
}

.cli-text {
  font-size: 14px;
  line-height: 1.75;
  word-break: break-word;
}

.cli-thinking {
  display: inline-flex;
  align-items: center;
  gap: 0.08rem;
  color: var(--color-text-light);
}

.cli-thinking-dots {
  min-width: 1.6em;
  display: inline-flex;
}

.cli-thinking-dots span {
  opacity: 0.2;
  animation: cli-thinking-blink 1.2s infinite;
}

.cli-thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.cli-thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes cli-thinking-blink {
  0%,
  80%,
  100% {
    opacity: 0.2;
  }

  40% {
    opacity: 1;
  }
}

.cli-markdown :deep(*:first-child) {
  margin-top: 0;
}

.cli-markdown :deep(*:last-child) {
  margin-bottom: 0;
}

.cli-markdown :deep(p),
.cli-markdown :deep(ul),
.cli-markdown :deep(pre),
.cli-markdown :deep(h1),
.cli-markdown :deep(h2),
.cli-markdown :deep(h3) {
  margin: 0 0 0.7rem;
}

.cli-markdown :deep(h1),
.cli-markdown :deep(h2),
.cli-markdown :deep(h3),
.cli-markdown :deep(strong) {
  color: var(--color-text);
}

.cli-markdown :deep(h1) {
  font-size: 1.2rem;
}

.cli-markdown :deep(h2) {
  font-size: 1.08rem;
}

.cli-markdown :deep(h3) {
  font-size: 1rem;
}

.cli-markdown :deep(ul) {
  padding-left: 1.2rem;
}

.cli-markdown :deep(li + li) {
  margin-top: 0.22rem;
}

.cli-markdown :deep(a) {
  color: var(--cli-accent-strong);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cli-markdown :deep(.md-inline-code) {
  padding: 0.1rem 0.35rem;
  border-radius: 6px;
  background: rgba(160, 113, 63, 0.08);
  font-family: 'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SFMono-Regular', monospace;
  font-size: 0.92em;
}

.cli-markdown :deep(.md-code) {
  overflow-x: auto;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  background: rgba(47, 52, 64, 0.06);
}

.cli-markdown :deep(.md-code code) {
  white-space: pre-wrap;
  font-family: 'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SFMono-Regular', monospace;
  font-size: 13px;
  line-height: 1.65;
}

:global(.explorer-page.theme-dark) .cli-markdown :deep(a) {
  color: var(--cli-accent);
}

:global(.explorer-page.theme-dark) .cli-markdown :deep(.md-inline-code) {
  background: rgba(215, 188, 145, 0.12);
}

:global(.explorer-page.theme-dark) .cli-markdown :deep(.md-code) {
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 640px) {
  .cli-line-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .cli-log {
    height: 300px;
    padding: 0.25rem 0 0.1rem;
  }

  .cli-log-actions {
    padding-top: 0.45rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cli-clear-btn,
  .cli-thinking-dots span {
    transition: none;
    animation: none;
  }
}
</style>
