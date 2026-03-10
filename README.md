# Simple Home

基于 `Vue 3 + TypeScript + Vite` 的单页浏览器导航页。

## 环境变量

复制 `.env.example` 为 `.env`，按实际环境填写：

```bash
VITE_API_BASE_URL=http://127.0.0.1:3001/api
```

## 目录结构

```text
src/
  config/
    api.ts                       # API 地址配置
  modules/
    composables/
      useHomeState.ts            # 页面状态与行为入口
    components/
      layout/                    # 三个主区域组件
      resource/                  # 书签与笔记列表
      content/                   # 首页内容与笔记详情
      icons/                     # SVG 图标组件
    model/
      data.ts                    # 初始书签/笔记数据
      types.ts                   # 基础类型
  views/
    HomeView.vue                 # 页面结构
    home.css                     # 页面样式
  main.ts                        # 应用入口
```

## 开发约定

- 页面状态统一维护在 `src/modules/composables/useHomeState.ts`，避免多层 composable 跳转。
- `views` 只负责页面结构，样式单独放在 `src/views/home.css`。
- 公共资源放 `public/`，网站图标使用 `public/logo.png`。

## Vercel 部署

这个项目可以直接接 GitHub 自动部署到 Vercel。

### 1. 推送仓库

先把 `SimpleHome` 推送到 GitHub 仓库。

### 2. 导入到 Vercel

在 Vercel 后台选择：

```text
Add New Project -> Import Git Repository
```

选择当前 GitHub 仓库后，Vercel 会自动识别为 `Vite` 项目。

### 3. 配置构建信息

通常保持默认即可：

```text
Framework Preset: Vite
Build Command: vite build
Output Directory: dist
```

### 4. 配置环境变量

在 Vercel 项目设置中添加：

```bash
VITE_API_BASE_URL=https://your-api-domain/api
```

注意：

- 本地开发可以继续使用 `http://127.0.0.1:3001/api`
- 线上部署不能再指向本地地址
- 如果前端需要调用 `simple-api`，必须先把 `simple-api` 部署到公网
