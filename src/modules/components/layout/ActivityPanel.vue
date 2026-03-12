<script setup lang="ts">
import GithubIcon from '../icons/GithubIcon.vue'
import HomeIcon from '../icons/HomeIcon.vue'
import NotesIcon from '../icons/NotesIcon.vue'
import ThemeMoonIcon from '../icons/ThemeMoonIcon.vue'
import ThemeSunIcon from '../icons/ThemeSunIcon.vue'
import type { ModuleKey, ThemeMode } from '../../model/types'

defineProps<{
  activeModule: ModuleKey
  themeMode: ThemeMode
}>()

const emit = defineEmits<{
  (event: 'select-home'): void
  (event: 'select-notes'): void
  (event: 'toggle-theme'): void
}>()
</script>

<template>
  <aside class="module-panel toolbar-panel" aria-label="功能按钮区">
    <div class="tool-actions activity-bar">
      <button
        type="button"
        class="tool-btn"
        :class="{ active: activeModule === 'home' }"
        aria-label="首页"
        title="首页"
        @click="emit('select-home')"
      >
        <HomeIcon aria-hidden="true" />
      </button>

      <button
        type="button"
        class="tool-btn tool-note-btn"
        :class="{ active: activeModule === 'notes' }"
        aria-label="笔记"
        title="笔记"
        @click="emit('select-notes')"
      >
        <NotesIcon aria-hidden="true" />
      </button>
    </div>

    <div class="tool-bottom-actions">
      <button
        type="button"
        class="tool-btn tool-theme-btn"
        :aria-label="themeMode === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
        :title="themeMode === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
        @click="emit('toggle-theme')"
      >
        <ThemeMoonIcon v-if="themeMode === 'dark'" aria-hidden="true" />
        <ThemeSunIcon v-else aria-hidden="true" />
      </button>
      <a
        class="tool-btn tool-bottom-link"
        href="https://github.com/zhijian521/simple-home"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
      >
        <GithubIcon aria-hidden="true" />
      </a>
    </div>
  </aside>
</template>

<style scoped>
.toolbar-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.tool-actions,
.tool-bottom-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.activity-bar {
  align-self: start;
  padding: 0.75rem 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 16px;
  background: var(--panel-surface);
}

.tool-btn {
  width: var(--btn-size-sm);
  height: var(--btn-size-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.tool-btn:hover,
.tool-btn.active {
  color: var(--color-text);
  background: var(--ink-08);
}

.tool-btn svg {
  width: var(--icon-sm);
  height: var(--icon-sm);
}

.tool-bottom-link {
  width: var(--btn-size-md);
  height: var(--btn-size-md);
  text-decoration: none;
}

.tool-bottom-link svg,
.tool-note-btn svg {
  width: var(--icon-lg);
  height: var(--icon-lg);
}

@media (prefers-reduced-motion: reduce) {
  .tool-btn {
    transition: none;
  }
}
</style>
