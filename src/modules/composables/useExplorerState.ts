import { computed, ref } from 'vue'
import { useHomeModule } from './modules/useHomeModule'
import { useModuleTabs } from './modules/useModuleTabs'
import { useNotesModule } from './modules/useNotesModule'
import { useThemeMode } from './modules/useThemeMode'

export function useExplorerState() {
  const sidebarOpen = ref(false)

  const { themeMode, toggleTheme } = useThemeMode()
  const homeModule = useHomeModule({ onNavigate: closeSidebarOnMobile })
  const notesModule = useNotesModule({ onNavigate: closeSidebarOnMobile })
  const tabsModule = useModuleTabs()

  const resourcePanelTitle = computed(() => (tabsModule.activeModule.value === 'home' ? '书签管理器' : '笔记列表'))
  const contentPanelTitle = computed(() => (tabsModule.activeModule.value === 'home' ? '搜索模块' : '笔记详情'))

  function goHome() {
    tabsModule.activateModule('home')
    homeModule.resetHome()
  }

  function goNotes() {
    tabsModule.activateModule('notes')
    notesModule.ensureActiveNote()
  }

  function switchTab(module: 'home' | 'notes') {
    tabsModule.switchTab(module)
    if (module === 'notes') {
      notesModule.ensureActiveNote()
    }
  }

  function closeTab(module: 'home' | 'notes') {
    tabsModule.closeTab(module)
    if (tabsModule.activeModule.value === 'notes') {
      notesModule.ensureActiveNote()
    }
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function closeSidebarOnMobile() {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 1023px)').matches) {
      sidebarOpen.value = false
    }
  }

  return {
    tree: homeModule.tree,
    notes: notesModule.notes,
    activeBookmarkId: homeModule.activeBookmarkId,
    activeModule: tabsModule.activeModule,
    openTabs: tabsModule.openTabs,
    activeNoteId: notesModule.activeNoteId,
    sidebarOpen,
    searchKeyword: homeModule.searchKeyword,
    themeMode,
    activeNote: notesModule.activeNote,
    resourcePanelTitle,
    contentPanelTitle,
    toggleTheme,
    toggleFolder: homeModule.toggleFolder,
    selectBookmark: homeModule.selectBookmark,
    goHome,
    goNotes,
    switchTab,
    closeTab,
    selectNote: notesModule.selectNote,
    setSearchKeyword: homeModule.setSearchKeyword,
    submitSearch: homeModule.submitSearch,
    openSidebar,
    closeSidebar,
  }
}
