<script setup lang="ts">
import AiActionIcon from '../icons/AiActionIcon.vue'
import SearchActionIcon from '../icons/SearchActionIcon.vue'
import type { CliMessage } from '../../model/types'

defineProps<{
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
</script>

<template>
  <section class="cli-shell" :class="{ 'is-started': cliStarted }" aria-label="CLI 搜索与对话区">
    <div class="cli-hero" :class="{ 'is-compact': cliStarted }">
      <p class="cli-badge">LOCAL TERMINAL</p>
      <h1 class="cli-brand">Simple Home</h1>
    </div>

    <Transition name="cli-reveal">
      <div v-if="cliStarted" class="cli-log" role="log" aria-live="polite">
        <p v-for="message in cliMessages" :key="message.id" class="cli-line" :class="`is-${message.role}`">
          <span class="cli-prefix">{{ prefixByRole(message.role) }}</span>
          <span class="cli-text">{{ message.content }}</span>
        </p>
      </div>
    </Transition>

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
</template>
