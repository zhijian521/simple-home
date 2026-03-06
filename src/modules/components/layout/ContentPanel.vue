<script setup lang="ts">
import HomeContentSection from '../content/HomeContentSection.vue'
import NotesContentSection from '../content/NotesContentSection.vue'
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
          <svg v-if="tab === 'home'" viewBox="0 0 24 24" class="tab-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M4.8 10.2 12 4.8l7.2 5.4V19H4.8v-8.8Zm2 6.8h10.4v-5.8L12 7.3 6.8 11.2V17Z"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="tab-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z"
            />
          </svg>
          <span class="tab-text">{{ tab === 'home' ? '首页' : '笔记' }}</span>
          <span class="tab-close" aria-hidden="true" @click.stop="emit('close-tab', tab)">×</span>
        </button>
      </div>
      <button type="button" class="header-ghost" aria-label="更多">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="6" cy="12" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <circle cx="18" cy="12" r="1.4" fill="currentColor" />
        </svg>
      </button>
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
