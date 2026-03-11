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
