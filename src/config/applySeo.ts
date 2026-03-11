import { getPageSeo, siteConfig } from './seo'

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertCanonical(href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function upsertStructuredData(content: string): void {
  let element = document.head.querySelector<HTMLScriptElement>('#site-seo-json-ld')

  if (!element) {
    element = document.createElement('script')
    element.id = 'site-seo-json-ld'
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }

  element.textContent = content
}

export function applyPageSeo(path = '/'): void {
  if (typeof document === 'undefined') {
    return
  }

  const seo = getPageSeo(path)

  document.documentElement.lang = siteConfig.lang
  document.title = seo.title

  upsertMeta('name', 'description', seo.description)
  upsertMeta('name', 'keywords', seo.keywords)
  upsertMeta('name', 'robots', 'index, follow')
  upsertMeta('name', 'author', siteConfig.author)
  upsertMeta('name', 'theme-color', siteConfig.themeColor)
  upsertMeta('property', 'og:locale', siteConfig.locale)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', siteConfig.name)
  upsertMeta('property', 'og:title', seo.title)
  upsertMeta('property', 'og:description', seo.description)
  upsertMeta('property', 'og:url', seo.canonicalUrl)
  upsertMeta('property', 'og:image', seo.imageUrl)
  upsertMeta('property', 'og:image:alt', siteConfig.imageAlt)
  upsertMeta('name', 'twitter:card', 'summary')
  upsertMeta('name', 'twitter:title', seo.title)
  upsertMeta('name', 'twitter:description', seo.description)
  upsertMeta('name', 'twitter:image', seo.imageUrl)
  upsertCanonical(seo.canonicalUrl)
  upsertStructuredData(seo.structuredData)
}
