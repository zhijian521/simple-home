<script setup lang="ts">
import ActivityPanel from '../modules/components/layout/ActivityPanel.vue'
import ContentPanel from '../modules/components/layout/ContentPanel.vue'
import ResourcePanel from '../modules/components/layout/ResourcePanel.vue'
import { useExplorerState } from '../modules/composables/useExplorerState'

const {
  tree,
  notes,
  activeBookmarkId,
  activeModule,
  openTabs,
  activeNoteId,
  sidebarOpen,
  searchKeyword,
  cliStarted,
  cliMessages,
  themeMode,
  activeNote,
  resourcePanelTitle,
  contentPanelTitle,
  toggleTheme,
  toggleFolder,
  selectBookmark,
  goHome,
  goNotes,
  switchTab,
  closeTab,
  selectNote,
  setSearchKeyword,
  submitSearch,
  submitAiChat,
  openSidebar,
  closeSidebar,
} = useExplorerState()
</script>

<template>
  <div class="explorer-page" :class="{ 'theme-dark': themeMode === 'dark' }">
    <div class="layout-grid">
      <ActivityPanel
        :active-module="activeModule"
        :theme-mode="themeMode"
        @select-home="goHome"
        @select-notes="goNotes"
        @toggle-theme="toggleTheme"
      />

      <ResourcePanel
        :active-module="activeModule"
        :sidebar-open="sidebarOpen"
        :resource-panel-title="resourcePanelTitle"
        :tree="tree"
        :active-bookmark-id="activeBookmarkId"
        :notes="notes"
        :active-note-id="activeNoteId"
        @close-sidebar="closeSidebar"
        @toggle-folder="toggleFolder"
        @select-bookmark="selectBookmark"
        @select-note="selectNote"
      />

      <ContentPanel
        :active-module="activeModule"
        :open-tabs="openTabs"
        :content-panel-title="contentPanelTitle"
        :search-keyword="searchKeyword"
        :cli-started="cliStarted"
        :cli-messages="cliMessages"
        :active-note="activeNote"
        @open-sidebar="openSidebar"
        @switch-tab="switchTab"
        @close-tab="closeTab"
        @update:search-keyword="setSearchKeyword"
        @submit-search="submitSearch"
        @submit-ai-chat="submitAiChat"
      />
    </div>

    <div v-if="sidebarOpen" class="mobile-mask" @click="closeSidebar" />
  </div>
</template>

<style>
.explorer-page {
  --color-text: #3a3a3a;
  --color-text-light: #666;
  --color-text-lighter: #999;
  --color-bg-page: #ebe6da;
  --panel-surface: #f1eadc;
  --panel-border: rgba(255, 255, 255, 0.4);
  --panel-shadow: 0 12px 30px rgba(0, 0, 0, 0.08), inset 0 1px rgba(255, 255, 255, 0.42);
  --surface-solid: #fff;
  --surface-soft: rgba(255, 255, 255, 0.5);
  --surface-muted: #f5f1e8;
  --ink-01: rgba(0, 0, 0, 0.01);
  --ink-03: rgba(0, 0, 0, 0.03);
  --ink-04: rgba(0, 0, 0, 0.04);
  --ink-06: rgba(0, 0, 0, 0.06);
  --ink-08: rgba(0, 0, 0, 0.08);
  --ink-09: rgba(0, 0, 0, 0.09);
  --ink-12: rgba(0, 0, 0, 0.12);
  --ink-14: rgba(0, 0, 0, 0.14);
  --outline-color: rgba(26, 26, 26, 0.35);
  --link-bg: linear-gradient(90deg, rgba(26, 26, 26, 0.07), rgba(26, 26, 26, 0.03));
  --link-border: rgba(26, 26, 26, 0.3);
  --scrollbar-thumb: rgba(151, 126, 89, 0.2);
  --scrollbar-thumb-hover: rgba(151, 126, 89, 0.3);
  --font-ui:
    "SF Pro Text", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --fw-regular: 400;
  --fw-medium: 500;
  --fs-xs: 12px;
  --fs-sm: 13px;
  --fs-body: 14px;
  --fs-tag: 11px;
  --fs-h1: 1.9rem;
  --fs-h2: 1.4rem;
  --fs-h1-mobile: 1.6rem;
  --icon-xs: 14px;
  --icon-sm: 20px;
  --icon-md: 16px;
  --icon-lg: 23px;
  --btn-size-sm: 38px;
  --btn-size-md: 42px;
  --tab-height: 36px;
  height: 100dvh;
  width: 100%;
  padding: 0.75rem;
  overflow: hidden;
  box-sizing: border-box;
  background: var(--color-bg-page);
  background-image:
    linear-gradient(var(--ink-01) 1px, transparent 1px),
    linear-gradient(90deg, var(--ink-01) 1px, transparent 1px);
  background-size: 40px 40px;
  color: var(--color-text);
  font-family: var(--font-ui);
  font-weight: var(--fw-regular);
}

.explorer-page.theme-dark {
  --color-text: #e9e3d6;
  --color-text-light: #c1b8a8;
  --color-text-lighter: #9b9283;
  --color-bg-page: #17140f;
  --panel-surface: #26211b;
  --panel-border: rgba(255, 255, 255, 0.12);
  --panel-shadow: 0 18px 40px rgba(0, 0, 0, 0.45), inset 0 1px rgba(255, 255, 255, 0.06);
  --surface-solid: #302a23;
  --surface-soft: rgba(255, 255, 255, 0.05);
  --surface-muted: #2f2922;
  --ink-01: rgba(255, 255, 255, 0.02);
  --ink-03: rgba(255, 255, 255, 0.04);
  --ink-04: rgba(255, 255, 255, 0.07);
  --ink-06: rgba(255, 255, 255, 0.1);
  --ink-08: rgba(255, 255, 255, 0.12);
  --ink-09: rgba(255, 255, 255, 0.14);
  --ink-12: rgba(255, 255, 255, 0.2);
  --ink-14: rgba(255, 255, 255, 0.24);
  --outline-color: rgba(229, 221, 205, 0.65);
  --link-bg: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
  --link-border: rgba(255, 255, 255, 0.35);
  --scrollbar-thumb: rgba(233, 227, 214, 0.16);
  --scrollbar-thumb-hover: rgba(233, 227, 214, 0.26);
}

.layout-grid {
  height: 100%;
  display: grid;
  grid-template-columns: 58px 320px minmax(0, 1fr);
  grid-template-areas: 'activity tree preview';
  gap: 0.75rem;
}

.module-panel {
  border-radius: 16px;
  background: var(--panel-surface);
  border: 1px solid var(--panel-border);
  box-shadow: 0 10px 28px var(--ink-06), inset 0 1px rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(14px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(120%);
  overflow: hidden;
}

.toolbar-panel {
  grid-area: activity;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.tool-actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: center;
}

.tool-bottom-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.activity-bar {
  align-self: start;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  background: var(--panel-surface);
  box-shadow: none;
  padding: 0.75rem 0.45rem;
}

.tool-btn {
  width: var(--btn-size-sm);
  height: var(--btn-size-sm);
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: var(--color-text-light);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.tool-btn:hover,
.tool-btn.active {
  background: var(--ink-08);
  color: var(--color-text);
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

.tool-bottom-link svg {
  width: var(--icon-lg);
  height: var(--icon-lg);
}

.tool-theme-btn svg {
  width: var(--icon-sm);
  height: var(--icon-sm);
}

.tool-note-btn svg {
  width: var(--icon-lg);
  height: var(--icon-lg);
}

.resource-panel {
  grid-area: tree;
  display: flex;
  flex-direction: column;
  min-width: 0;
  box-shadow: 0 10px 28px var(--ink-06), inset 0 1px rgba(255, 255, 255, 0.42);
}

.resource-header {
  height: 40px;
  padding: 0 1rem;
  border-bottom: 1px solid var(--ink-08);
  background: var(--ink-03);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.resource-header h2 {
  margin: 0;
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-light);
}

.close-btn {
  display: none;
}

.tree-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0.4rem 0.8rem;
}

.folder-row,
.bookmark-row {
  width: 100%;
  min-height: 32px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 0.45rem;
  text-align: left;
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.folder-row {
  padding-left: calc(0.45rem + var(--tree-depth, 0) * 0.95rem);
}

.folder-row:hover,
.bookmark-row:hover {
  background: var(--ink-04);
  color: var(--color-text);
}

.bookmark-row.active {
  background: var(--ink-08);
  color: var(--color-text);
}

.arrow {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-lighter);
}

.arrow-icon {
  width: 10px;
  height: 10px;
  display: block;
}

.node-type-icon {
  width: var(--icon-md);
  height: var(--icon-md);
  flex-shrink: 0;
  color: var(--color-text-light);
}

.folder-icon,
.file-icon {
  color: var(--color-text-lighter);
}

.folder-row:hover .folder-icon,
.bookmark-row:hover .file-icon,
.bookmark-row.active .file-icon {
  color: var(--color-text-light);
}

.folder-children {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.folder-children.expanded {
  max-height: 2000px;
}

.bookmark-row {
  --bookmark-indent: calc(1.90rem + var(--bookmark-depth, 0) * 0.95rem);
  width: calc(100% - var(--bookmark-indent));
  margin-left: var(--bookmark-indent);
  padding-left: 1.15rem;
  font-size: var(--fs-sm);
}

.notes-scroll {
  padding-top: 0.6rem;
}

.note-row {
  width: 100%;
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.5rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.note-row + .note-row {
  margin-top: 0.25rem;
}

.note-row:hover,
.note-row.active {
  background: var(--ink-08);
  color: var(--color-text);
}

.note-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.note-title {
  font-size: var(--fs-sm);
  color: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-date {
  font-size: var(--fs-xs);
  color: var(--color-text-lighter);
}

.content-panel {
  grid-area: preview;
  display: flex;
  flex-direction: column;
  min-width: 0;
  box-shadow: 0 12px 30px var(--ink-06), inset 0 1px rgba(255, 255, 255, 0.42);
}

.content-header {
  height: 40px;
  background: var(--ink-03);
  padding: 0 0.3rem;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  border-bottom: 1px solid var(--ink-08);
}

.mobile-toggle-btn {
  display: none;
}

.tabs-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  margin-top: 3px;
  position: relative;
}

.tabs-wrap::after {
  content: none;
}

.tab-label {
  min-width: 120px;
  max-width: 240px;
  height: var(--tab-height);
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0 0.7rem;
  font-size: var(--fs-xs);
  color: var(--color-text);
  border-top: 1px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: var(--color-bg-page);
  margin-bottom: 0;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.tab-label:hover:not(.is-active) {
  background: var(--color-bg-page);
  color: var(--color-text);
}

.tab-label.is-active {
  height: 37px;
  border-top: 1px solid var(--ink-14);
  border-left: 1px solid var(--ink-14);
  border-right: 1px solid var(--ink-14);
  background: var(--panel-surface);
  margin-bottom: -1px;
  z-index: 3;
}

.tab-label.is-active::after {
  content: '';
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: -2px;
  height: 4px;
  background: var(--panel-surface);
}

.tab-icon {
  width: calc(var(--icon-xs) + 2px);
  height: calc(var(--icon-xs) + 2px);
  flex-shrink: 0;
  color: var(--color-text-light);
}

.tab-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  width: var(--icon-md);
  height: var(--icon-md);
  border-radius: 4px;
  color: var(--color-text-lighter);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease, background 0.18s ease, color 0.18s ease;
}

.tab-label:hover .tab-close,
.tab-label.is-active .tab-close {
  opacity: 1;
  pointer-events: auto;
}

.tab-close:hover {
  background: var(--ink-08);
  color: var(--color-text);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1rem clamp(1.25rem, 3vw, 2.25rem) 2.25rem;
  background: var(--panel-surface);
}

.content-scroll.is-home {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cli-shell {
  width: min(920px, 100%);
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.cli-shell:not(.is-started) {
  width: min(760px, 100%);
}

.cli-log {
  max-height: 380px;
  min-height: 260px;
  overflow-y: auto;
  padding: 0.5rem 0.15rem 0.85rem;
  background: transparent;
}

.cli-line {
  margin: 0;
  font-family: 'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SFMono-Regular', monospace;
  font-size: calc(var(--fs-body) + 1px);
  line-height: 1.72;
  display: flex;
  gap: 0.62rem;
  color: var(--color-text-light);
}

.cli-line + .cli-line {
  margin-top: 0.4rem;
}

.cli-line.is-user {
  color: var(--color-text);
}

.cli-line.is-assistant {
  color: #4d7b68;
}

.explorer-page.theme-dark .cli-line.is-assistant {
  color: #8dc5ad;
}

.cli-prefix {
  white-space: nowrap;
  color: var(--color-text-lighter);
}

.cli-text {
  min-width: 0;
  word-break: break-word;
}

.cli-input-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 38px 38px;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.6rem;
  border: 1px solid var(--ink-12);
  border-radius: 12px;
  background: var(--surface-soft);
  box-shadow: 0 8px 20px var(--ink-06);
}

.cli-prompt {
  font-family: 'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SFMono-Regular', monospace;
  font-size: calc(var(--fs-body) + 1px);
  font-weight: var(--fw-medium);
  color: var(--color-text-lighter);
  transform: translateY(-1px);
}

.cli-input-row input {
  width: 100%;
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  padding: 0 0.35rem;
  color: var(--color-text);
  font-family: 'Cascadia Mono', 'JetBrains Mono', 'Consolas', 'SFMono-Regular', monospace;
  font-size: calc(var(--fs-body) + 1px);
}

.cli-input-row input::placeholder {
  color: var(--color-text-lighter);
}

.cli-input-row input:focus-visible {
  outline: none;
}

.cli-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--ink-12);
  border-radius: 10px;
  background: var(--surface-solid);
  color: var(--color-text-light);
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.cli-btn svg {
  width: 18px;
  height: 18px;
}

.cli-btn:hover {
  background: var(--ink-04);
  color: var(--color-text);
}

.cli-btn.is-ai {
  border-color: rgba(63, 111, 92, 0.35);
  color: #3f6f5c;
}

.explorer-page.theme-dark .cli-btn.is-ai {
  border-color: rgba(141, 197, 173, 0.38);
  color: #8dc5ad;
}

.cli-reveal-enter-active,
.cli-reveal-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.cli-reveal-enter-from,
.cli-reveal-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.note-detail {
  max-width: 820px;
  border: 1px solid var(--ink-08);
  border-radius: 12px;
  background: var(--surface-soft);
  padding: 1rem;
}

.note-detail h1 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: var(--fw-medium);
}

.note-detail time {
  display: block;
  margin-top: 0.35rem;
  font-size: var(--fs-xs);
  color: var(--color-text-lighter);
}

.note-summary {
  margin: 0.8rem 0 0;
  font-size: var(--fs-body);
  color: var(--color-text-light);
  line-height: 1.7;
}

.note-content {
  margin: 0.75rem 0 0;
  font-size: var(--fs-body);
  color: var(--color-text);
  line-height: 1.8;
}

.note-empty {
  color: var(--color-text-light);
  font-size: var(--fs-body);
}

.mobile-mask {
  display: none;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--outline-color);
  outline-offset: 1px;
}

@media (max-width: 1200px) {
  .layout-grid {
    grid-template-columns: 52px 280px minmax(0, 1fr);
  }
}

@media (max-width: 960px) {
  .layout-grid {
    grid-template-columns: 52px minmax(0, 1fr);
    grid-template-rows: 45vh minmax(55vh, auto);
    grid-template-areas:
      'activity tree'
      'activity preview';
  }

  .toolbar-panel {
    padding-top: 0;
  }

  .resource-panel {
    position: static;
    transform: none;
  }

  .close-btn,
  .mobile-toggle-btn,
  .mobile-mask {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .explorer-page {
    padding: 0.5rem;
  }

  .layout-grid {
    gap: 0.5rem;
  }

  .module-panel {
    border-radius: 12px;
  }

  .resource-header {
    height: 38px;
  }

  .content-scroll {
    padding: 0.8rem 0.85rem 1.2rem;
  }

  .content-scroll.is-home {
    align-items: flex-start;
  }

  .cli-log {
    min-height: 200px;
  }

  .cli-shell:not(.is-started) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tool-btn,
  .folder-row,
  .bookmark-row,
  .arrow,
  .folder-children {
    transition: none;
  }
}
</style>
