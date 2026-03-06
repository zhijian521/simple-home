import type { NoteItem, TreeFolder } from './types'

export const THEME_KEY = 'simplehome.theme'
export const HOME_BOOKMARK_ID = 'chatgpt'

export function createInitialTree(): TreeFolder[] {
  return [
    {
      id: 'daily-tools',
      name: '常用工具',
      expanded: false,
      bookmarks: [
        {
          id: 'chatgpt',
          title: 'ChatGPT',
          url: 'https://chatgpt.com',
          intro: '日常问答、写作、代码与效率助手。',
          tags: ['AI', '效率'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'google-search',
          title: 'Google',
          url: 'https://www.google.com',
          intro: '默认网页搜索入口。',
          tags: ['搜索', '入口'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'gmail',
          title: 'Gmail',
          url: 'https://mail.google.com',
          intro: '邮件收发与通知中心。',
          tags: ['邮箱', '沟通'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'notion',
          title: 'Notion',
          url: 'https://www.notion.so',
          intro: '文档、项目和知识管理。',
          tags: ['文档', '知识库'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'google-drive',
          title: 'Google Drive',
          url: 'https://drive.google.com',
          intro: '云端文件存储与共享。',
          tags: ['云盘', '协作'],
          updatedAt: '2026-03-06',
        },
      ],
    },
    {
      id: 'dev-tech',
      name: '开发技术',
      expanded: false,
      bookmarks: [
        {
          id: 'github',
          title: 'GitHub',
          url: 'https://github.com',
          intro: '代码托管、Issue 与协作入口。',
          tags: ['代码', '协作'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'mdn',
          title: 'MDN',
          url: 'https://developer.mozilla.org',
          intro: 'Web 标准与 API 文档。',
          tags: ['文档', 'Web'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'stack-overflow',
          title: 'Stack Overflow',
          url: 'https://stackoverflow.com',
          intro: '开发问题搜索与问答社区。',
          tags: ['问答', '排错'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'npm',
          title: 'npm',
          url: 'https://www.npmjs.com',
          intro: 'JavaScript 包查询与文档。',
          tags: ['包管理', 'JavaScript'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'vite',
          title: 'Vite',
          url: 'https://vite.dev',
          intro: '前端构建工具官方文档。',
          tags: ['构建', '前端'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'vue-docs',
          title: 'Vue Docs',
          url: 'https://vuejs.org',
          intro: 'Vue 3 官方文档。',
          tags: ['框架', '文档'],
          updatedAt: '2026-03-06',
        },
      ],
    },
    {
      id: 'design-product',
      name: '设计产品',
      expanded: false,
      bookmarks: [
        {
          id: 'figma',
          title: 'Figma',
          url: 'https://www.figma.com',
          intro: '界面设计与协同评审。',
          tags: ['设计', '协作'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'dribbble',
          title: 'Dribbble',
          url: 'https://dribbble.com',
          intro: '界面与插画灵感。',
          tags: ['灵感', '视觉'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'behance',
          title: 'Behance',
          url: 'https://www.behance.net',
          intro: '产品与视觉作品集。',
          tags: ['作品', '案例'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'excalidraw',
          title: 'Excalidraw',
          url: 'https://excalidraw.com',
          intro: '快速草图与流程图。',
          tags: ['草图', '流程图'],
          updatedAt: '2026-03-06',
        },
      ],
    },
    {
      id: 'collaboration',
      name: '协作沟通',
      expanded: false,
      bookmarks: [
        {
          id: 'slack',
          title: 'Slack',
          url: 'https://slack.com',
          intro: '团队频道沟通平台。',
          tags: ['团队', '沟通'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'discord',
          title: 'Discord',
          url: 'https://discord.com',
          intro: '社区与语音协作。',
          tags: ['社区', '语音'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'zoom',
          title: 'Zoom',
          url: 'https://zoom.us',
          intro: '在线视频会议。',
          tags: ['会议', '远程'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'jira',
          title: 'Jira',
          url: 'https://www.atlassian.com/software/jira',
          intro: '任务和迭代管理。',
          tags: ['项目管理', '流程'],
          updatedAt: '2026-03-06',
        },
      ],
    },
    {
      id: 'news-community',
      name: '资讯社区',
      expanded: false,
      bookmarks: [
        {
          id: 'hacker-news',
          title: 'Hacker News',
          url: 'https://news.ycombinator.com',
          intro: '技术创业新闻与讨论。',
          tags: ['技术', '新闻'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'product-hunt',
          title: 'Product Hunt',
          url: 'https://www.producthunt.com',
          intro: '新产品发现与趋势。',
          tags: ['产品', '趋势'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'reddit',
          title: 'Reddit',
          url: 'https://www.reddit.com',
          intro: '多主题讨论社区。',
          tags: ['社区', '讨论'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'x',
          title: 'X',
          url: 'https://x.com',
          intro: '实时资讯与动态流。',
          tags: ['动态', '资讯'],
          updatedAt: '2026-03-06',
        },
      ],
    },
    {
      id: 'learning',
      name: '学习资源',
      expanded: false,
      bookmarks: [
        {
          id: 'youtube',
          title: 'YouTube',
          url: 'https://www.youtube.com',
          intro: '教程与技术视频学习。',
          tags: ['视频', '学习'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'coursera',
          title: 'Coursera',
          url: 'https://www.coursera.org',
          intro: '系统化在线课程。',
          tags: ['课程', '学习'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'udemy',
          title: 'Udemy',
          url: 'https://www.udemy.com',
          intro: '技能导向在线课程平台。',
          tags: ['课程', '技能'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'freecodecamp',
          title: 'freeCodeCamp',
          url: 'https://www.freecodecamp.org',
          intro: '编程练习与项目实战。',
          tags: ['编程', '练习'],
          updatedAt: '2026-03-06',
        },
        {
          id: 'roadmap',
          title: 'roadmap.sh',
          url: 'https://roadmap.sh',
          intro: '按方向规划技能成长路径。',
          tags: ['路线图', '成长'],
          updatedAt: '2026-03-06',
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
