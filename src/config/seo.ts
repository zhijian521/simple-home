type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

type SitePage = {
  path: string
  title: string
  description: string
  keywords?: string[]
  changeFrequency: ChangeFrequency
  priority: number
}

type PageSeo = {
  title: string
  description: string
  keywords: string
  canonicalUrl: string
  imageUrl: string
  structuredData: string
}

export const siteConfig = {
  name: 'Simple Home',
  title: 'Simple Home | 个人导航与起始页',
  description:
    'Simple Home 是一个聚合常用工具、开发资源、学习站点与个人笔记的轻量起始页，帮助你更快进入日常工作流。',
  url: 'https://home.yuwb.dev',
  lang: 'zh-CN',
  locale: 'zh_CN',
  author: 'Yuwb',
  themeColor: '#ebe6da',
  imagePath: '/logo.png',
  imageAlt: 'Simple Home logo',
  keywords: [
    'Simple Home',
    '个人导航页',
    '浏览器起始页',
    '书签导航',
    '开发者主页',
    '效率工具导航',
  ],
} as const

const defaultPage: SitePage = {
  path: '/',
  title: siteConfig.title,
  description: siteConfig.description,
  changeFrequency: 'weekly',
  priority: 1,
}

export const sitePages: readonly SitePage[] = [defaultPage]

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path.startsWith('/') ? path : `/${path}`
}

function toAbsoluteUrl(path: string): string {
  return new URL(normalizePath(path), `${siteConfig.url}/`).toString()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeXml(value: string): string {
  return escapeHtml(value)
}

function createStructuredData(page: SitePage, canonicalUrl: string): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      alternateName: page.title,
      url: canonicalUrl,
      description: page.description,
      inLanguage: siteConfig.lang,
      author: {
        '@type': 'Person',
        name: siteConfig.author,
      },
    },
    null,
    2,
  )
}

export function getPageSeo(path = '/'): PageSeo {
  const normalizedPath = normalizePath(path)
  const page = sitePages.find((item) => item.path === normalizedPath) ?? defaultPage
  const keywords = [...siteConfig.keywords, ...(page.keywords ?? [])].join(', ')
  const canonicalUrl = toAbsoluteUrl(page.path)

  return {
    title: page.title,
    description: page.description,
    keywords,
    canonicalUrl,
    imageUrl: toAbsoluteUrl(siteConfig.imagePath),
    structuredData: createStructuredData(page, canonicalUrl),
  }
}

export function buildIndexHeadMarkup(path = '/'): string {
  const seo = getPageSeo(path)

  return [
    `    <title>${escapeHtml(seo.title)}</title>`,
    `    <meta name="description" content="${escapeHtml(seo.description)}" />`,
    `    <meta name="keywords" content="${escapeHtml(seo.keywords)}" />`,
    '    <meta name="robots" content="index, follow" />',
    `    <meta name="author" content="${escapeHtml(siteConfig.author)}" />`,
    `    <meta name="theme-color" content="${siteConfig.themeColor}" />`,
    `    <link rel="canonical" href="${seo.canonicalUrl}" />`,
    `    <meta property="og:locale" content="${siteConfig.locale}" />`,
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:site_name" content="${escapeHtml(siteConfig.name)}" />`,
    `    <meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `    <meta property="og:url" content="${seo.canonicalUrl}" />`,
    `    <meta property="og:image" content="${seo.imageUrl}" />`,
    `    <meta property="og:image:alt" content="${escapeHtml(siteConfig.imageAlt)}" />`,
    '    <meta name="twitter:card" content="summary" />',
    `    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `    <meta name="twitter:image" content="${seo.imageUrl}" />`,
    `    <script id="site-seo-json-ld" type="application/ld+json">${seo.structuredData}</script>`,
  ].join('\n')
}

export function buildRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', `Sitemap: ${toAbsoluteUrl('/sitemap.xml')}`].join('\n')
}

export function buildSitemapXml(): string {
  const urls = sitePages
    .map((page) => {
      return [
        '  <url>',
        `    <loc>${escapeXml(toAbsoluteUrl(page.path))}</loc>`,
        `    <changefreq>${page.changeFrequency}</changefreq>`,
        `    <priority>${page.priority.toFixed(1)}</priority>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
  ].join('\n')
}
