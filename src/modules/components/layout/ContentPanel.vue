<script setup lang="ts">
import HomeContentSection from '../content/HomeContentSection.vue'
import NotesContentSection from '../content/NotesContentSection.vue'
import type { CliMessage, ModuleKey, NoteItem } from '../../model/types'

defineProps<{
  activeModule: ModuleKey
  contentPanelTitle: string
  searchKeyword: string
  cliStarted: boolean
  cliMessages: CliMessage[]
  activeNote?: NoteItem
}>()

const emit = defineEmits<{
  (event: 'update:search-keyword', value: string): void
  (event: 'clear-cli-session'): void
  (event: 'submit-search'): void
  (event: 'submit-ai-chat'): void
}>()
</script>

<template>
  <section class="module-panel content-panel" :aria-label="contentPanelTitle">
    <header class="content-header">
      <h2 class="content-title">{{ contentPanelTitle }}</h2>
    </header>

    <main class="content-scroll" :class="{ 'is-home': activeModule === 'home' }">
      <HomeContentSection
        v-if="activeModule === 'home'"
        :search-keyword="searchKeyword"
        :cli-started="cliStarted"
        :cli-messages="cliMessages"
        @update:search-keyword="emit('update:search-keyword', $event)"
        @clear-cli-session="emit('clear-cli-session')"
        @submit-search="emit('submit-search')"
        @submit-ai-chat="emit('submit-ai-chat')"
      />
      <NotesContentSection v-else :active-note="activeNote" />
    </main>
  </section>
</template>

<style scoped>
.content-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content-header {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid var(--ink-08);
  background: var(--ink-03);
}

.content-title {
  margin: 0;
  color: var(--color-text-light);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  letter-spacing: 0;
}

.content-scroll {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem clamp(1.25rem, 3vw, 2.25rem) 2.25rem;
  background: var(--panel-surface);
}

.content-scroll.is-home {
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top center, rgba(160, 113, 63, 0.08) 0, transparent 34%),
    radial-gradient(circle at bottom right, rgba(77, 123, 104, 0.08) 0, transparent 26%),
    transparent;
}

@media (max-width: 640px) {
  .content-header {
    height: 38px;
  }

  .content-scroll {
    padding: 0.8rem 0.85rem 1.2rem;
  }

  .content-scroll.is-home {
    align-items: flex-start;
  }
}
</style>
