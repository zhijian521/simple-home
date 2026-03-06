import { ref } from 'vue'
import type { ModuleKey } from '../../model/types'

export function useModuleTabs() {
  const activeModule = ref<ModuleKey>('home')
  const openTabs = ref<ModuleKey[]>(['home'])

  function ensureTab(module: ModuleKey) {
    if (!openTabs.value.includes(module)) {
      openTabs.value.push(module)
    }
  }

  function activateModule(module: ModuleKey) {
    ensureTab(module)
    activeModule.value = module
  }

  function switchTab(module: ModuleKey) {
    activeModule.value = module
  }

  function closeTab(module: ModuleKey) {
    if (openTabs.value.length <= 1) return

    const index = openTabs.value.indexOf(module)
    if (index === -1) return

    openTabs.value.splice(index, 1)
    if (activeModule.value !== module) return

    const fallback = openTabs.value[index - 1] ?? openTabs.value[0]
    if (!fallback) return
    activeModule.value = fallback
  }

  return {
    activeModule,
    openTabs,
    activateModule,
    switchTab,
    closeTab,
  }
}
