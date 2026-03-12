import type { NoteItem, TreeFolder } from './types'

export const THEME_KEY = 'simplehome.theme'
export const HOME_BOOKMARK_ID = 'chatgpt'

export function createInitialTree(): TreeFolder[] {
  return [
    {
      id: 'daily-tools',
      name: '常用工具',
      expanded: false,
      children: [],
      bookmarks: [
        { id: 'chatgpt', title: 'ChatGPT', url: 'https://chatgpt.com' },
        { id: 'google-search', title: 'Google', url: 'https://www.google.com' },
        { id: 'gmail', title: 'Gmail', url: 'https://mail.google.com' },
        { id: 'notion', title: 'Notion', url: 'https://www.notion.so' },
        { id: 'google-drive', title: 'Google Drive', url: 'https://drive.google.com' },
      ],
    },
    {
      id: 'dev-tech',
      name: '开发技术',
      expanded: false,
      children: [],
      bookmarks: [
        { id: 'github', title: 'GitHub', url: 'https://github.com' },
        { id: 'mdn', title: 'MDN', url: 'https://developer.mozilla.org' },
        { id: 'stack-overflow', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
        { id: 'npm', title: 'npm', url: 'https://www.npmjs.com' },
        { id: 'vite', title: 'Vite', url: 'https://vite.dev' },
        { id: 'vue-docs', title: 'Vue Docs', url: 'https://vuejs.org' },
      ],
    },
    {
      id: 'design-product',
      name: '设计产品',
      expanded: false,
      children: [],
      bookmarks: [
        { id: 'figma', title: 'Figma', url: 'https://www.figma.com' },
        { id: 'dribbble', title: 'Dribbble', url: 'https://dribbble.com' },
        { id: 'behance', title: 'Behance', url: 'https://www.behance.net' },
        { id: 'excalidraw', title: 'Excalidraw', url: 'https://excalidraw.com' },
      ],
    },
    {
      id: 'collaboration',
      name: '协作沟通',
      expanded: false,
      children: [],
      bookmarks: [
        { id: 'slack', title: 'Slack', url: 'https://slack.com' },
        { id: 'discord', title: 'Discord', url: 'https://discord.com' },
        { id: 'zoom', title: 'Zoom', url: 'https://zoom.us' },
        { id: 'jira', title: 'Jira', url: 'https://www.atlassian.com/software/jira' },
      ],
    },
    {
      id: 'news-community',
      name: '资讯社区',
      expanded: false,
      children: [],
      bookmarks: [
        { id: 'hacker-news', title: 'Hacker News', url: 'https://news.ycombinator.com' },
        { id: 'product-hunt', title: 'Product Hunt', url: 'https://www.producthunt.com' },
        { id: 'reddit', title: 'Reddit', url: 'https://www.reddit.com' },
        { id: 'x', title: 'X', url: 'https://x.com' },
      ],
    },
    {
      id: 'learning',
      name: '学习资源',
      expanded: false,
      children: [],
      bookmarks: [
        { id: 'youtube', title: 'YouTube', url: 'https://www.youtube.com' },
        { id: 'coursera', title: 'Coursera', url: 'https://www.coursera.org' },
        { id: 'udemy', title: 'Udemy', url: 'https://www.udemy.com' },
        { id: 'freecodecamp', title: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
        { id: 'roadmap', title: 'roadmap.sh', url: 'https://roadmap.sh' },
      ],
    },
  ]
}

export function createInitialNotes(): NoteItem[] {
  return [
    {
      id: 'note-2026-0305',
      title: '导航页结构重构说明',
      updatedAt: '2026-03-05',
      summary: '梳理首页模块、功能按钮和主题切换关系。',
      content:
        '当前版本将页面拆分为功能按钮区、资源面板和内容面板。后续新增功能时，只需扩展模块状态与对应内容区组件。',
    },
    {
      id: 'note-2026-0304',
      title: '书签整理计划',
      updatedAt: '2026-03-04',
      summary: '按工作流拆分书签分组，减少查找路径。',
      content:
        '建议将书签分为开发、设计、文档、效率工具四类，并保持目录层级尽量扁平，避免为了抽象而抽象。',
    },
    {
      id: 'note-2026-0303',
      title: '主题视觉校准',
      updatedAt: '2026-03-03',
      summary: '亮色与暗色统一使用液态玻璃层级。',
      content:
        '后续可以继续微调边框透明度与阴影强度，但应优先保证文字对比度，再处理装饰效果，避免视觉噪声过重。',
    },
  ]
}
