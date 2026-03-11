import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { buildIndexHeadMarkup, buildRobotsTxt, buildSitemapXml } from './src/config/seo'

function seoPlugin(): PluginOption {
  let outDir = ''

  return {
    name: 'site-seo',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      return html.replace('<!--seo-head-->', buildIndexHeadMarkup('/'))
    },
    async writeBundle() {
      await mkdir(outDir, { recursive: true })
      await Promise.all([
        writeFile(resolve(outDir, 'robots.txt'), buildRobotsTxt()),
        writeFile(resolve(outDir, 'sitemap.xml'), buildSitemapXml()),
      ])
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), seoPlugin()],
})
