<script setup lang="ts">
import HomeContentSection from '../content/HomeContentSection.vue'
import HomeIcon from '../icons/HomeIcon.vue'
import NotesContentSection from '../content/NotesContentSection.vue'
import NotesIcon from '../icons/NotesIcon.vue'
import type { ModuleKey, NoteItem } from '../../model/types'

defineProps<{
  activeModule: ModuleKey
  openTabs: ModuleKey[]
  contentPanelTitle: string
  searchKeyword: string
  activeNote?: NoteItem
}>()

const emit = defineEmits<{
  (event: 'open-sidebar'): void
  (event: 'switch-tab', module: ModuleKey): void
  (event: 'close-tab', module: ModuleKey): void
  (event: 'update:search-keyword', value: string): void
  (event: 'submit-search'): void
}>()
</script>

<template>
  <section class="module-panel content-panel" :aria-label="contentPanelTitle">
    <header class="content-header">
      <button type="button" class="mobile-toggle-btn" @click="emit('open-sidebar')">☰</button>
      <div class="tabs-wrap">
        <button
          v-for="tab in openTabs"
          :key="tab"
          type="button"
          class="tab-label"
          :class="{ 'is-active': activeModule === tab }"
          @click="emit('switch-tab', tab)"
        >
          <HomeIcon v-if="tab === 'home'" class="tab-icon" aria-hidden="true" />
          <NotesIcon v-else class="tab-icon" aria-hidden="true" />
          <span class="tab-text">{{ tab === 'home' ? '首页' : '笔记' }}</span>
          <span class="tab-close" aria-hidden="true" @click.stop="emit('close-tab', tab)">×</span>
        </button>
      </div>
    </header>

    <main class="content-scroll">
      <HomeContentSection
        v-if="activeModule === 'home'"
        :search-keyword="searchKeyword"
        @update:search-keyword="emit('update:search-keyword', $event)"
        @submit-search="emit('submit-search')"
      />
      <NotesContentSection v-else :active-note="activeNote" />
    </main>
  </section>
</template>
