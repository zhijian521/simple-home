import { ref } from 'vue'
import { THEME_KEY } from '../../model/data'
import type { ThemeMode } from '../../model/types'

export function useThemeMode() {
  const themeMode = ref<ThemeMode>(initThemeMode())

  function toggleTheme() {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_KEY, themeMode.value)
    }
  }

  return {
    themeMode,
    toggleTheme,
  }
}

function initThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'

  const saved = window.localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
