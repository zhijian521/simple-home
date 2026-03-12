<script setup lang="ts">
import type { CliMessage } from '../../model/types'
import CliComposer from './CliComposer.vue'
import CliConversation from './CliConversation.vue'

const props = defineProps<{
  searchKeyword: string
  cliStarted: boolean
  cliMessages: CliMessage[]
}>()

const emit = defineEmits<{
  (event: 'update:search-keyword', value: string): void
  (event: 'clear-cli-session'): void
  (event: 'submit-search'): void
  (event: 'submit-ai-chat'): void
}>()
</script>

<template>
  <section class="cli-shell" :class="{ 'is-started': cliStarted }" aria-label="CLI 搜索与对话区">
    <header class="cli-hero">
      <h1 class="cli-brand">Simple Home</h1>
    </header>

    <CliComposer
      :search-keyword="searchKeyword"
      @update:search-keyword="emit('update:search-keyword', $event)"
      @submit-search="emit('submit-search')"
      @submit-ai-chat="emit('submit-ai-chat')"
    />

    <CliConversation
      :cli-started="cliStarted"
      :cli-messages="cliMessages"
      @clear-cli-session="emit('clear-cli-session')"
    />
  </section>
</template>

<style scoped>
.cli-shell {
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(0.75rem, 2vw, 1rem) 0;
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    gap 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

:global(.content-scroll.is-home) .cli-shell.is-started {
  transform: translateY(-4vh);
}

.cli-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  text-align: center;
  user-select: none;
}

.cli-brand {
  margin: 0;
  color: #7c542d;
  font-family: 'Iowan Old Style', 'Palatino Linotype', 'Noto Serif SC', serif;
  font-size: clamp(2.7rem, 6vw, 4.6rem);
  font-weight: 700;
  line-height: 0.94;
  letter-spacing: 0.02em;
  text-shadow: 0 10px 22px rgba(143, 101, 51, 0.14);
}

@supports ((-webkit-background-clip: text) or (background-clip: text)) {
  .cli-brand {
    color: transparent;
    background: linear-gradient(
      135deg,
      rgba(105, 70, 34, 0.98) 0%,
      rgba(168, 121, 69, 0.98) 42%,
      rgba(118, 83, 44, 0.98) 100%
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
}

:global(.explorer-page.theme-dark) .cli-brand {
  color: #ead9bd;
  text-shadow: 0 12px 26px rgba(0, 0, 0, 0.22);
}

@supports ((-webkit-background-clip: text) or (background-clip: text)) {
  :global(.explorer-page.theme-dark) .cli-brand {
    color: transparent;
    background: linear-gradient(
      135deg,
      rgba(243, 233, 211, 0.98) 0%,
      rgba(215, 188, 145, 0.98) 40%,
      rgba(181, 152, 111, 0.98) 100%
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
}

@media (max-width: 640px) {
  .cli-shell {
    width: 100%;
    padding: 0.4rem 0;
  }

  :global(.content-scroll.is-home) .cli-shell:not(.is-started),
  :global(.content-scroll.is-home) .cli-shell.is-started {
    transform: translateY(0);
  }

  .cli-brand {
    font-size: clamp(2.2rem, 10vw, 3.2rem);
    letter-spacing: 0.04em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cli-shell {
    transition: none;
  }
}
</style>
