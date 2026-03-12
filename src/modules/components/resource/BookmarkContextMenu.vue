<script setup lang="ts">
interface BookmarkContextMenuItem {
  key: string
  label: string
  danger?: boolean
}

defineProps<{
  visible: boolean
  x: number
  y: number
  items: BookmarkContextMenuItem[]
}>()

const emit = defineEmits<{
  (event: 'select', key: string): void
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="context-menu" :style="{ left: `${x}px`, top: `${y}px` }" role="menu">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="context-menu-item"
        :class="{ danger: item.danger }"
        @click="emit('select', item.key)"
      >
        <span class="context-menu-label">{{ item.label }}</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 200;
  min-width: 168px;
  padding: 0.28rem;
  border: 1px solid color-mix(in srgb, var(--panel-border) 70%, rgba(120, 95, 58, 0.12));
  border-radius: 12px;
  background: color-mix(in srgb, var(--panel-surface) 92%, rgba(255, 255, 255, 0.72));
  box-shadow: 0 14px 32px rgba(30, 26, 20, 0.16);
  backdrop-filter: blur(18px) saturate(120%);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
}

.context-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 34px;
  padding: 0.45rem 0.62rem;
  border: 0;
  border-radius: 9px;
  color: var(--color-text-light);
  background: transparent;
  font-size: var(--fs-sm);
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.context-menu-item:hover {
  color: var(--color-text);
  background: var(--ink-08);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ink-12) 72%, transparent);
}

.context-menu-item.danger {
  color: var(--color-text-light);
}

.context-menu-item.danger:hover {
  color: var(--color-text);
  background: var(--ink-08);
}

.context-menu-label {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}

:global(.explorer-page.theme-dark) .context-menu {
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .context-menu-item {
    transition: none;
  }
}
</style>
