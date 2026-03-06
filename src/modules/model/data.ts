import type { NoteItem, TreeFolder } from './types'

export const THEME_KEY = 'simplehome.theme'
export const HOME_BOOKMARK_ID = 'home'

export function createInitialTree(): TreeFolder[] {
  return [
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
  ]
}
