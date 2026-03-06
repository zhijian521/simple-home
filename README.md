# Simple Home

基于 `Vue 3 + TypeScript + Vite` 的浏览器导航页。

## 目录结构

```text
src/
  modules/
    composables/
      useExplorerState.ts        # 页面状态聚合编排
      modules/                   # home/notes/theme/tabs 功能封装
    components/
      layout/                    # 三个主区域组件
      resource/                  # 中间资源区子组件
      content/                   # 右侧内容区子组件
    model/
      data.ts                    # 初始书签/笔记数据与常量
      types.ts                   # 模块类型定义
  router/
    index.ts                     # 路由入口
  views/
    HomeView.vue                 # 页面布局与样式
```

## 开发约定

- 新功能优先放入 `src/modules/<feature>/`，按 `model + composables + components/pages` 分层。
- `views` 层尽量只负责布局与组装，业务逻辑下沉到 composable。
- 公共资源放 `public/`，网站图标使用 `public/logo.png`。
