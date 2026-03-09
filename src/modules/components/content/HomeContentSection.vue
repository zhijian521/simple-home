<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
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

const cliLogRef = ref<HTMLDivElement | null>(null)

watch(
  () => props.cliMessages.length,
  async (currentLength, previousLength = 0) => {
    if (!props.cliStarted || currentLength <= previousLength) return

    await nextTick()
    const cliLogElement = cliLogRef.value
    if (!cliLogElement) return

    cliLogElement.scrollTop = cliLogElement.scrollHeight
  },
)
</script>

<template>
  <section class="cli-shell" :class="{ 'is-started': cliStarted }" aria-label="CLI 搜索与对话区">
    <div class="cli-hero" :class="{ 'is-compact': cliStarted }">
      <div class="cli-brand-wrap">
        <h1 class="cli-brand">Simple Home</h1>
        <p class="cli-badge">LOCAL TERMINAL</p>
      </div>
      <p class="cli-summary">把常用入口、搜索命令和轻量对话收进同一张工作台。</p>
    </div>

    <section class="cli-input-shell" aria-label="命令输入区">
      <div class="cli-input-meta">
        <span class="cli-input-label">Command Deck</span>
        <span class="cli-input-hint">Enter 直接发送 AI，对话按钮和搜索按钮保留原逻辑</span>
      </div>

      <div class="cli-input-row">
        <span class="cli-prompt" aria-hidden="true">></span>
        <input
          id="bookmark-search"
          :value="searchKeyword"
          type="text"
          placeholder="Type a command or question..."
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

    <Transition name="cli-log-reveal">
      <section v-if="cliStarted" class="cli-log-shell" aria-label="会话记录">
        <header class="cli-log-chrome">
          <span>session.log</span>
          <span>{{ cliMessages.length }} entries</span>
        </header>
        <div ref="cliLogRef" class="cli-log" role="log" aria-live="polite">
          <div v-for="message in cliMessages" :key="message.id" class="cli-line" :class="`is-${message.role}`">
            <div class="cli-line-head">
              <span class="cli-prefix">{{ prefixByRole(message.role) }}</span>
              <span class="cli-role">{{ labelByRole(message.role) }}</span>
            </div>
            <span class="cli-text">{{ message.content }}</span>
          </div>
        </div>
      </section>
    </Transition>
  </section>
</template>
