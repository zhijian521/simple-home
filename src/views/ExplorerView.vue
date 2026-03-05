<script setup lang="ts">
import { computed, ref } from 'vue'

interface BookmarkItem {
  id: string
  title: string
  url: string
  intro: string
  tags: string[]
  updatedAt: string
}

interface TreeFolder {
  id: string
  name: string
  expanded: boolean
  bookmarks: BookmarkItem[]
  folders?: TreeFolder[]
}

interface NoteItem {
  id: string
  title: string
  updatedAt: string
  summary: string
  content: string
}

const THEME_KEY = 'simplehome.theme'
const HOME_BOOKMARK_ID = 'home'
type ThemeMode = 'light' | 'dark'
type ModuleKey = 'home' | 'notes'

const tree = ref<TreeFolder[]>([
  {
    id: 'home-group',
    name: '首页',
    expanded: true,
    bookmarks: [
      {
        id: HOME_BOOKMARK_ID,
        title: '导航首页',
        url: '/',
        intro: '浏览器导航总入口，用于集中打开常用站点。',
        tags: ['主页', '入口'],
        updatedAt: '2026-03-05',
      },
    ],
  },
  {
    id: 'work',
    name: '开发',
    expanded: true,
    bookmarks: [
      {
        id: 'github',
        title: 'GitHub',
        url: 'https://github.com',
        intro: '代码仓库、Issue 和协作入口。',
        tags: ['代码', '协作'],
        updatedAt: '2026-02-28',
      },
      {
        id: 'vite',
        title: 'Vite',
        url: 'https://vitejs.dev',
        intro: '构建工具与脚手架文档。',
        tags: ['构建', 'Vue'],
        updatedAt: '2026-03-01',
      },
    ],
    folders: [
      {
        id: 'work-docs',
        name: '参考文档',
        expanded: false,
        bookmarks: [
          {
            id: 'vue',
            title: 'Vue Docs',
            url: 'https://vuejs.org',
            intro: 'Vue 核心文档和生态说明。',
            tags: ['文档', '框架'],
            updatedAt: '2026-02-22',
          },
          {
            id: 'mdn',
            title: 'MDN',
            url: 'https://developer.mozilla.org',
            intro: 'Web API 标准文档。',
            tags: ['Web', '标准'],
            updatedAt: '2026-02-18',
          },
        ],
      },
    ],
  },
  {
    id: 'personal',
    name: '耶温',
    expanded: true,
    bookmarks: [
      {
        id: 'about-site',
        title: '关于本站',
        url: 'https://github.com/zhijian521/simple-home',
        intro: '站点定位与重构记录。',
        tags: ['项目', '介绍'],
        updatedAt: '2025-12-29',
      },
      {
        id: 'about-me',
        title: '关于我',
        url: 'mailto:yuwb0521@yeah.net',
        intro: '你好，我是耶温。一个在代码与文字间游走的人。',
        tags: ['个人', '联系'],
        updatedAt: '2025-12-29',
      },
      {
        id: 'site-recommend',
        title: '站点推荐',
        url: 'https://caniuse.com',
        intro: '常用站点集合，减少重复搜索。',
        tags: ['收藏', '效率'],
        updatedAt: '2025-12-25',
      },
      {
        id: 'all-in-web',
        title: 'All in Web',
        url: 'https://www.notion.so',
        intro: 'Web 相关资源聚合入口。',
        tags: ['Web', '聚合'],
        updatedAt: '2025-12-20',
      },
    ],
  },
])

const notes = ref<NoteItem[]>([
  {
    id: 'note-2026-0305',
    title: '导航页结构重构说明',
    updatedAt: '2026-03-05',
    summary: '梳理首页模块、功能按钮和主题切换关系。',
    content:
      '当前版本将页面拆分为功能按钮区、资源面板和内容面板。后续新增功能时，只需扩展模块枚举与对应模板分支。',
  },
  {
    id: 'note-2026-0304',
    title: '书签整理计划',
    updatedAt: '2026-03-04',
    summary: '按工作流拆分书签分组，减少查找路径。',
    content:
      '建议将书签分为开发、设计、文档、效率工具四类，并保持二级目录不超过三层，保证点击成本可控。',
  },
  {
    id: 'note-2026-0303',
    title: '主题视觉校准',
    updatedAt: '2026-03-03',
    summary: '亮色与暗色统一使用液态玻璃层级。',
    content:
      '后续可继续微调边框透明度与阴影强度，优先保证文字对比度，再处理装饰效果，避免视觉噪声过重。',
  },
])

const activeBookmarkId = ref(HOME_BOOKMARK_ID)
const activeModule = ref<ModuleKey>('home')
const openTabs = ref<ModuleKey[]>(['home'])
const activeNoteId = ref(notes.value[0]?.id ?? '')
const sidebarOpen = ref(false)
const searchKeyword = ref('')
const themeMode = ref<ThemeMode>(initThemeMode())

const allBookmarks = computed(() => {
  const output: BookmarkItem[] = []
  const visit = (nodes: TreeFolder[]) => {
    for (const node of nodes) {
      output.push(...node.bookmarks)
      if (node.folders) visit(node.folders)
    }
  }
  visit(tree.value)
  return output
})

const activeNote = computed(() => notes.value.find((note) => note.id === activeNoteId.value))
const resourcePanelTitle = computed(() => (activeModule.value === 'home' ? '书签管理器' : '笔记列表'))
const contentPanelTitle = computed(() => (activeModule.value === 'home' ? '搜索模块' : '笔记详情'))

function initThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function toggleTheme() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_KEY, themeMode.value)
  }
}

function toggleFolder(folderId: string) {
  const visit = (nodes: TreeFolder[]): boolean => {
    for (const node of nodes) {
      if (node.id === folderId) {
        node.expanded = !node.expanded
        return true
      }
      if (node.folders && visit(node.folders)) return true
    }
    return false
  }
  visit(tree.value)
}

function selectBookmark(bookmarkId: string) {
  const targetBookmark = allBookmarks.value.find((bookmark) => bookmark.id === bookmarkId)
  if (!targetBookmark) return
  activeBookmarkId.value = bookmarkId
  window.open(targetBookmark.url, '_blank', 'noopener,noreferrer')
  if (window.matchMedia('(max-width: 1023px)').matches) {
    sidebarOpen.value = false
  }
}

function ensureTab(module: ModuleKey) {
  if (!openTabs.value.includes(module)) {
    openTabs.value.push(module)
  }
}

function activateModule(module: ModuleKey) {
  ensureTab(module)
  activeModule.value = module
  if (module === 'notes' && !activeNoteId.value && notes.value.length > 0) {
    activeNoteId.value = notes.value[0].id
  }
}

function goHome() {
  activateModule('home')
}

function goNotes() {
  activateModule('notes')
}

function switchTab(module: ModuleKey) {
  activeModule.value = module
}

function closeTab(module: ModuleKey) {
  if (openTabs.value.length <= 1) return
  const index = openTabs.value.indexOf(module)
  if (index === -1) return
  openTabs.value.splice(index, 1)
  if (activeModule.value === module) {
    const fallback = openTabs.value[index - 1] ?? openTabs.value[0]
    activeModule.value = fallback
  }
}

function selectNote(noteId: string) {
  activeNoteId.value = noteId
  if (window.matchMedia('(max-width: 1023px)').matches) {
    sidebarOpen.value = false
  }
}

function submitSearch() {
  const value = searchKeyword.value.trim()
  if (!value) return
  const isDirectUrl = /^(https?:\/\/|mailto:)/i.test(value)
  const targetUrl = isDirectUrl ? value : `https://www.google.com/search?q=${encodeURIComponent(value)}`
  window.open(targetUrl, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="explorer-page" :class="{ 'theme-dark': themeMode === 'dark' }">
    <div class="layout-grid">
      <aside class="module-panel toolbar-panel" aria-label="功能按钮区">
        <div class="tool-actions activity-bar">
          <button
            type="button"
            class="tool-btn"
            :class="{ active: activeModule === 'home' }"
            aria-label="首页"
            @click="goHome"
          >
            <svg viewBox="0 0 1024 1024" fill="none" aria-hidden="true">
              <path
                d="M110.376354 529.013003a29.474671 29.474671 0 0 1-21.268717-9.026302c-11.342002-11.744786-11.014355-30.460075 0.73043-41.800845L491.874351 89.951389c11.746018-11.34077 30.461307-11.013123 41.800846 0.729199 11.342002 11.744786 11.014355 30.460075-0.730431 41.800845L130.908482 520.717132a29.466049 29.466049 0 0 1-20.532128 8.295871z"
                fill="#132541"
              />
              <path
                d="M925.133167 529.013003a29.458658 29.458658 0 0 1-20.338743-8.113571L493.719521 131.010718c-11.847022-11.234839-12.340956-29.946433-1.106117-41.792223 11.236071-11.84579 29.946433-12.339724 41.792224-1.104885l411.074903 389.889946c11.84579 11.234839 12.342187 29.946433 1.104885 41.792223-5.808958 6.12675-13.624445 9.217224-21.452249 9.217224zM799.216989 847.255442c-16.326916 0-29.562125-13.23521-29.562126-29.562125V582.40097c0-16.326916 13.23521-29.562125 29.562126-29.562125s29.562125 13.23521 29.562125 29.562125v235.291115c0 16.328147-13.23521 29.563357-29.562125 29.563357zM207.916587 847.255442c-16.326916 0-29.562125-13.23521-29.562125-29.562125V582.40097c0-16.326916 13.23521-29.562125 29.562125-29.562125s29.562125 13.23521 29.562126 29.562125v235.291115c0 16.328147-13.23521 29.563357-29.562126 29.563357z"
                fill="#132541"
              />
              <path
                d="M620.592773 906.049583H386.539571c-16.326916 0-29.562125-13.23521-29.562125-29.562125s13.23521-29.562125 29.562125-29.562126h234.053202c16.326916 0 29.562125 13.23521 29.562125 29.562126s-13.23521 29.562125-29.562125 29.562125z"
                fill="#EB5A23"
              />
            </svg>
          </button>
          <button
            type="button"
            class="tool-btn tool-note-btn"
            :class="{ active: activeModule === 'notes' }"
            aria-label="笔记"
            @click="goNotes"
          >
            <svg viewBox="0 0 1024 1024" aria-hidden="true">
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 483.555556q0 170.666667-170.666666 170.666666l-483.555556 0q-170.666667 0-170.666666-170.666666l0-483.555556q0-170.666667 170.666666-170.666666Z"
                fill="#E4DCD5"
              />
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 469.333334q0 170.666667-170.666666 170.666666l-483.555556 0q-170.666667 0-170.666666-170.666666l0-469.333334q0-170.666667 170.666666-170.666666Z"
                fill="#FEF6EE"
              />
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 455.111111q0 170.666667-170.666666 170.666667l-483.555556 0q-170.666667 0-170.666666-170.666667l0-455.111111q0-170.666667 170.666666-170.666666Z"
                fill="#E4DCD5"
              />
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 440.888889q0 170.666667-170.666666 170.666667l-483.555556 0q-170.666667 0-170.666666-170.666667l0-440.888889q0-170.666667 170.666666-170.666666Z"
                fill="#FEF6EE"
              />
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 426.666667q0 170.666667-170.666666 170.666667l-483.555556 0q-170.666667 0-170.666666-170.666667l0-426.666667q0-170.666667 170.666666-170.666666Z"
                fill="#E4DCD5"
              />
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 412.444445q0 170.666667-170.666666 170.666666l-483.555556 0q-170.666667 0-170.666666-170.666666l0-412.444445q0-170.666667 170.666666-170.666666Z"
                fill="#FFF6EE"
              />
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 398.222222q0 170.666667-170.666666 170.666667l-483.555556 0q-170.666667 0-170.666666-170.666667l0-398.222222q0-170.666667 170.666666-170.666666Z"
                fill="#E4DCD5"
              />
              <path
                d="M99.555556 99.555556m170.666666 0l483.555556 0q170.666667 0 170.666666 170.666666l0 384q0 170.666667-170.666666 170.666667l-483.555556 0q-170.666667 0-170.666666-170.666667l0-384q0-170.666667 170.666666-170.666666Z"
                fill="#FFF6EE"
              />
              <path
                d="M234.666667 277.333333m-35.555556 0a35.555556 35.555556 0 1 0 71.111111 0 35.555556 35.555556 0 1 0-71.111111 0Z"
                fill="#4B556A"
              />
              <path
                d="M327.111111 284.444444m14.222222 0l256 0q14.222222 0 14.222223 14.222223l0 0q0 14.222222-14.222223 14.222222l-256 0q-14.222222 0-14.222222-14.222222l0 0q0-14.222222 14.222222-14.222223Z"
                fill="#FF6400"
              />
              <path
                d="M327.111111 384m14.222222 0l469.333334 0q14.222222 0 14.222222 14.222222l0 0q0 14.222222-14.222222 14.222222l-469.333334 0q-14.222222 0-14.222222-14.222222l0 0q0-14.222222 14.222222-14.222222Z"
                fill="#FF6400"
              />
              <path
                d="M327.111111 483.555556m14.222222 0l469.333334 0q14.222222 0 14.222222 14.222222l0 0q0 14.222222-14.222222 14.222222l-469.333334 0q-14.222222 0-14.222222-14.222222l0 0q0-14.222222 14.222222-14.222222Z"
                fill="#FF6400"
              />
              <path
                d="M327.111111 583.111111m14.222222 0l469.333334 0q14.222222 0 14.222222 14.222222l0 0q0 14.222222-14.222222 14.222223l-469.333334 0q-14.222222 0-14.222222-14.222223l0 0q0-14.222222 14.222222-14.222222Z"
                fill="#FF6400"
              />
              <path
                d="M234.666667 448m-35.555556 0a35.555556 35.555556 0 1 0 71.111111 0 35.555556 35.555556 0 1 0-71.111111 0Z"
                fill="#4B556A"
              />
              <path
                d="M234.666667 604.444444m-35.555556 0a35.555556 35.555556 0 1 0 71.111111 0 35.555556 35.555556 0 1 0-71.111111 0Z"
                fill="#4B556A"
              />
              <path
                d="M583.111111 99.555556h227.555556a113.777778 113.777778 0 0 1 113.777777 113.777777v227.555556L583.111111 99.555556z"
                fill="#F3ECE3"
              />
              <path
                d="M924.444444 440.888889l-246.257777-41.045333A113.777778 113.777778 0 0 1 583.111111 287.616V99.555556l341.333333 341.333333z"
                fill="#CCC6C2"
              />
              <path
                d="M896 412.444444l-224.327111-50.986666a113.777778 113.777778 0 0 1-88.561778-110.933334V99.555556l312.888889 312.888888z"
                fill="#E4DCD5"
              />
            </svg>
          </button>
        </div>
        <div class="tool-bottom-actions">
          <button
            type="button"
            class="tool-btn tool-theme-btn"
            :aria-label="themeMode === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
            :title="themeMode === 'dark' ? '切换到亮色主题' : '切换到暗色主题'"
            @click="toggleTheme"
          >
            <svg v-if="themeMode === 'dark'" viewBox="0 0 1024 1024" aria-hidden="true">
              <path
                d="M698.65472 5.3248L696.44288 0C888.832 80.26112 1024 270.1312 1024 491.58144 1024 785.6128 785.6128 1024 491.58144 1024 270.1312 1024 80.26112 888.81152 0 696.44288a530.67776 530.67776 0 0 0 204.88192 40.87808c294.05184 0 532.43904-238.3872 532.43904-532.43904 0-70.57408-13.7216-137.9328-38.66624-199.55712z m120.15616 176.51712l0.3072 11.50976 0.12288 11.53024c0 339.29216-275.0464 614.35904-614.35904 614.35904-7.70048 0-15.38048-0.14336-23.04-0.43008A450.06848 450.06848 0 0 0 491.58144 942.08C740.39296 942.08 942.08 740.39296 942.08 491.58144a450.06848 450.06848 0 0 0-123.2896-309.73952z"
                fill="currentColor"
              />
              <path
                d="M389.2224 245.8624l-96.29696 50.62656 18.39104-107.23328-77.90592-75.93984 107.66336-15.64672L389.2224 0.1024l48.14848 97.56672 107.68384 15.64672-77.90592 75.93984 18.39104 107.23328zM266.3424 512.1024l-48.128 25.31328 9.17504-53.61664-38.95296-37.96992 53.84192-7.82336 24.064-48.78336 24.08448 48.78336 53.84192 7.82336-38.97344 37.96992 9.216 53.61664z"
                fill="currentColor"
              />
            </svg>
            <svg v-else viewBox="0 0 1044 1024" aria-hidden="true">
              <path
                d="M565.5552 860.16v163.84h-81.92v-163.84h81.92zM249.4464 729.23136l57.93792 57.91744-115.85536 115.85536-57.93792-57.93792 115.85536-115.83488z m550.2976 0l115.85536 115.83488-57.91744 57.93792-115.85536-115.85536 57.91744-57.91744zM524.5952 245.76c147.0464 0 266.24 119.1936 266.24 266.24s-119.1936 266.24-266.24 266.24-266.24-119.1936-266.24-266.24 119.1936-266.24 266.24-266.24z m0 81.92a184.32 184.32 0 1 0 0 368.64 184.32 184.32 0 0 0 0-368.64z m512 143.36v81.92h-163.84v-81.92h163.84z m-860.16 0v81.92h-163.84v-81.92h163.84zM860.7744 117.90336l57.93792 57.93792-115.85536 115.85536-57.91744-57.93792 115.83488-115.85536z m-672.31744 0l115.85536 115.85536-57.93792 57.93792-115.83488-115.85536L188.416 117.90336zM565.5552 0v163.84h-81.92V0h81.92z"
                fill="currentColor"
              />
            </svg>
          </button>
          <a
            class="tool-btn tool-bottom-link"
            href="https://github.com/zhijian521/simple-home"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
              <path
                d="M512 76C271 76 76 271 76 512c0 193 125 357 299 414 22 4 30-10 30-22v-79c-121 26-146-52-146-52-20-50-48-64-48-64-39-27 3-27 3-27 43 3 66 44 66 44 38 66 101 47 126 36 4-28 15-47 27-57-97-11-198-48-198-213 0-47 17-85 44-115-5-11-19-56 4-117 0 0 36-12 118 44a407 407 0 0 1 215 0c82-56 118-44 118-44 23 61 9 106 4 117 28 30 44 68 44 115 0 165-101 202-199 213 16 14 30 41 30 84v125c0 12 8 26 30 22 174-57 299-221 299-414C948 271 753 76 512 76z"
              />
            </svg>
          </a>
        </div>
      </aside>

      <aside class="module-panel resource-panel" :class="{ open: sidebarOpen }" :aria-label="resourcePanelTitle">
        <header class="resource-header">
          <h2>{{ resourcePanelTitle }}</h2>
          <button type="button" class="close-btn" @click="sidebarOpen = false">×</button>
        </header>
        <div v-if="activeModule === 'home'" class="tree-scroll">
          <section v-for="folder in tree" :key="folder.id" class="tree-node">
            <button type="button" class="folder-row" @click="toggleFolder(folder.id)">
              <span class="arrow" :class="{ expanded: folder.expanded }">›</span>
              <svg viewBox="0 0 32 32" class="node-type-icon folder-icon" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="m13.844 7.536-1.288-1.072A2 2 0 0 0 11.276 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H15.124a2 2 0 0 1-1.28-.464"
                />
                <path
                  fill="rgba(26,26,26,0.24)"
                  d="M24 10h-7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V16Zm0 16h-6v-2h6Zm4-4H18v-2h10Zm-4.828-5.172V12L28 16.828Z"
                />
              </svg>
              <span>{{ folder.name }}</span>
            </button>

            <div class="folder-children" :class="{ expanded: folder.expanded }">
              <button
                v-for="bookmark in folder.bookmarks"
                :key="bookmark.id"
                type="button"
                class="bookmark-row"
                :class="{ active: activeBookmarkId === bookmark.id }"
                @click="selectBookmark(bookmark.id)"
              >
                <svg viewBox="0 0 24 24" class="node-type-icon file-icon" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z"
                  />
                </svg>
                <span>{{ bookmark.title }}</span>
              </button>

              <section v-for="child in folder.folders || []" :key="child.id" class="tree-subnode">
                <button type="button" class="folder-row folder-sub" @click="toggleFolder(child.id)">
                  <span class="arrow" :class="{ expanded: child.expanded }">›</span>
                  <svg viewBox="0 0 32 32" class="node-type-icon folder-icon" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="m13.844 7.536-1.288-1.072A2 2 0 0 0 11.276 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H15.124a2 2 0 0 1-1.28-.464"
                    />
                    <path
                      fill="rgba(26,26,26,0.24)"
                      d="M24 10h-7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V16Zm0 16h-6v-2h6Zm4-4H18v-2h10Zm-4.828-5.172V12L28 16.828Z"
                    />
                  </svg>
                  <span>{{ child.name }}</span>
                </button>
                <div class="folder-children folder-children-sub" :class="{ expanded: child.expanded }">
                  <button
                    v-for="bookmark in child.bookmarks"
                    :key="bookmark.id"
                    type="button"
                    class="bookmark-row bookmark-sub"
                    :class="{ active: activeBookmarkId === bookmark.id }"
                    @click="selectBookmark(bookmark.id)"
                  >
                    <svg viewBox="0 0 24 24" class="node-type-icon file-icon" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z"
                      />
                    </svg>
                    <span>{{ bookmark.title }}</span>
                  </button>
                </div>
              </section>
            </div>
          </section>
        </div>
        <div v-else class="tree-scroll notes-scroll">
          <button
            v-for="note in notes"
            :key="note.id"
            type="button"
            class="note-row"
            :class="{ active: activeNoteId === note.id }"
            @click="selectNote(note.id)"
          >
            <svg viewBox="0 0 24 24" class="node-type-icon file-icon" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm4 18H6V4h7v5h5z"
              />
            </svg>
            <div class="note-meta">
              <span class="note-title">{{ note.title }}</span>
              <span class="note-date">{{ note.updatedAt }}</span>
            </div>
          </button>
        </div>
      </aside>

      <section class="module-panel content-panel" :aria-label="contentPanelTitle">
        <header class="content-header">
          <button type="button" class="mobile-toggle-btn" @click="sidebarOpen = true">☰</button>
          <div class="tabs-wrap">
            <button
              v-for="tab in openTabs"
              :key="tab"
              type="button"
              class="tab-label"
              :class="{ 'is-active': activeModule === tab }"
              @click="switchTab(tab)"
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
              <span class="tab-close" aria-hidden="true" @click.stop="closeTab(tab)">×</span>
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
          <section v-if="activeModule === 'home'" class="search-box simple-search-box">
            <form class="search-form" @submit.prevent="submitSearch">
              <input
                id="bookmark-search"
                v-model="searchKeyword"
                type="search"
                placeholder="输入关键词后回车搜索（支持网址）"
                aria-label="网页搜索"
              />
              <button type="submit">搜索</button>
            </form>
          </section>
          <section v-else-if="activeNote" class="note-detail">
            <h1>{{ activeNote.title }}</h1>
            <time>{{ activeNote.updatedAt }}</time>
            <p class="note-summary">{{ activeNote.summary }}</p>
            <p class="note-content">{{ activeNote.content }}</p>
          </section>
          <section v-else class="note-empty">暂无笔记内容</section>
        </main>
      </section>
    </div>

    <div v-if="sidebarOpen" class="mobile-mask" @click="sidebarOpen = false" />
  </div>
</template>

<style scoped>
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
  --tab-height: 35px;
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
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-lighter);
  transition: transform 0.18s ease;
}

.arrow.expanded {
  transform: rotate(90deg);
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
  margin-left: 0.95rem;
  font-size: var(--fs-sm);
}

.tree-subnode {
  margin-left: 0.95rem;
}

.folder-sub,
.bookmark-sub {
  font-size: var(--fs-sm);
}

.bookmark-sub {
  margin-left: 1.9rem;
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
  justify-content: space-between;
  border-bottom: none;
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
  overflow: hidden;
  position: relative;
}

.tabs-wrap::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--ink-08);
  pointer-events: none;
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
  border-top: 1px solid var(--ink-14);
  border-left: 1px solid var(--ink-14);
  border-right: 1px solid var(--ink-14);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: var(--panel-surface);
  margin-bottom: -1px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.tab-label:hover:not(.is-active) {
  background: var(--ink-04);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  color: var(--color-text);
}

.tab-label.is-active {
  height: 37px;
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
  width: var(--icon-xs);
  height: var(--icon-xs);
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

.header-ghost {
  width: 28px;
  height: 28px;
  margin-right: 0.2rem;
  border-radius: 6px;
  border: 0;
  background: transparent;
  color: var(--color-text-lighter);
  cursor: pointer;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-1px);
  transition: background 0.18s ease, color 0.18s ease;
}

.header-ghost:hover {
  color: var(--color-text);
  background: var(--ink-06);
}

.header-ghost svg {
  width: var(--icon-xs);
  height: var(--icon-xs);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1rem clamp(1.25rem, 3vw, 2.25rem) 2.25rem;
  background: var(--panel-surface);
}

.search-box {
  border: 1px solid var(--ink-08);
  border-radius: 12px;
  background: var(--surface-soft);
  padding: 0.75rem;
}

.simple-search-box {
  max-width: 720px;
}

.search-form {
  display: flex;
  gap: 0.5rem;
}

.search-form input {
  flex: 1;
  height: 36px;
  border: 1px solid var(--ink-12);
  border-radius: 8px;
  background: var(--surface-solid);
  padding: 0 0.75rem;
  color: var(--color-text);
}

.search-form button {
  height: 36px;
  padding: 0 0.85rem;
  border: 1px solid var(--ink-12);
  border-radius: 8px;
  background: var(--surface-solid);
  color: var(--color-text-light);
  cursor: pointer;
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
