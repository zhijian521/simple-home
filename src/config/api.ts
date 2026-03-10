function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '')
}

const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3001/api')

export const apiConfig = {
  baseUrl: apiBaseUrl,
  deepseekChatCompletionsUrl: `${apiBaseUrl}/deepseek/chat/completions`,
} as const
