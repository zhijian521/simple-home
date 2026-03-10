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
    <header class="cli-hero">
      <h1 class="cli-brand">Simple Home</h1>
    </header>

    <section class="cli-input-shell" aria-label="命令输入区">
      <div class="cli-input-row">
        <input
          id="bookmark-search"
          :value="searchKeyword"
          type="text"
          placeholder="输入关键词搜索，或直接发起 AI 对话"
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
          <span class="cli-text">{{ message.content }}</span>
        </div>
      </div>
    </section>
  </section>
</template>
