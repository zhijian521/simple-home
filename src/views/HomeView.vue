<script setup lang="ts">
import ActivityPanel from '../modules/components/layout/ActivityPanel.vue'
import ContentPanel from '../modules/components/layout/ContentPanel.vue'
import ResourcePanel from '../modules/components/layout/ResourcePanel.vue'
import { useHomeState } from '../modules/composables/useHomeState'

const {
  tree,
  notes,
  activeBookmarkId,
  activeModule,
  activeNoteId,
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
  createBookmarkFolder,
  updateBookmarkFolder,
  deleteBookmarkFolder,
  addBookmark,
  editBookmark,
  removeBookmark,
  repositionFolder,
  repositionBookmark,
  goHome,
  goNotes,
  selectNote,
  setSearchKeyword,
  clearCliSession,
  submitSearch,
  submitAiChat,
} = useHomeState()
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
        :resource-panel-title="resourcePanelTitle"
        :tree="tree"
        :active-bookmark-id="activeBookmarkId"
        :notes="notes"
        :active-note-id="activeNoteId"
        @toggle-folder="toggleFolder"
        @select-bookmark="selectBookmark"
        @create-folder="createBookmarkFolder"
        @update-folder="updateBookmarkFolder"
        @delete-folder="deleteBookmarkFolder"
        @create-bookmark="addBookmark"
        @update-bookmark="editBookmark"
        @delete-bookmark="removeBookmark"
        @move-folder="repositionFolder"
        @move-bookmark="repositionBookmark"
        @select-note="selectNote"
      />

      <ContentPanel
        :active-module="activeModule"
        :content-panel-title="contentPanelTitle"
        :search-keyword="searchKeyword"
        :cli-started="cliStarted"
        :cli-messages="cliMessages"
        :active-note="activeNote"
        @update:search-keyword="setSearchKeyword"
        @clear-cli-session="clearCliSession"
        @submit-search="submitSearch"
        @submit-ai-chat="submitAiChat"
      />
    </div>
  </div>
</template>

<style src="../styles/home.css"></style>
