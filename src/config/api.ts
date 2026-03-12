function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, '')
}

const fallbackApiBaseUrl = import.meta.env.PROD ? 'https://api.yuwb.dev/api' : 'http://127.0.0.1:3001/api'

const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl)

export const apiConfig = {
  baseUrl: apiBaseUrl,
  deepseekChatCompletionsUrl: `${apiBaseUrl}/deepseek/chat/completions`,
} as const
