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
