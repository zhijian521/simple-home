<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  mode: 'folder' | 'bookmark'
  title: string
  confirmLabel: string
  initialName?: string
  initialUrl?: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: { name: string; url?: string }): void
}>()

const name = ref('')
const url = ref('')
const error = ref('')

const isBookmark = computed(() => props.mode === 'bookmark')

watch(
  () => [props.visible, props.initialName, props.initialUrl],
  ([visible]) => {
    if (!visible) {
      return
    }

    name.value = props.initialName ?? ''
    url.value = props.initialUrl ?? ''
    error.value = ''
  },
  { immediate: true },
)

function closeDialog() {
  emit('close')
}

function submit() {
  const trimmedName = name.value.trim()
  const trimmedUrl = url.value.trim()

  if (!trimmedName) {
    error.value = isBookmark.value ? '请输入书签名称。' : '请输入分组名称。'
    return
  }

  if (isBookmark.value && !trimmedUrl) {
    error.value = '请输入书签地址。'
    return
  }

  emit('submit', {
    name: trimmedName,
    url: isBookmark.value ? trimmedUrl : undefined,
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-mask" @click.self="closeDialog">
      <section class="dialog-card" role="dialog" aria-modal="true" :aria-label="title">
        <header class="dialog-header">
          <h3>{{ title }}</h3>
          <button type="button" class="dialog-close" aria-label="关闭" @click="closeDialog">×</button>
        </header>

        <div class="dialog-body">
          <label class="field">
            <span>{{ isBookmark ? '名称' : '分组名称' }}</span>
            <input
              v-model="name"
              type="text"
              :placeholder="isBookmark ? '例如：GitHub' : '例如：常用工具'"
              @keydown.enter.prevent="submit"
            />
          </label>

          <label v-if="isBookmark" class="field">
            <span>地址</span>
            <input
              v-model="url"
              type="url"
              placeholder="https://example.com"
              @keydown.enter.prevent="submit"
            />
          </label>

          <p v-if="error" class="dialog-error">{{ error }}</p>
        </div>

        <footer class="dialog-actions">
          <button type="button" class="dialog-btn is-secondary" @click="closeDialog">取消</button>
          <button type="button" class="dialog-btn is-primary" @click="submit">{{ confirmLabel }}</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: transparent;
}

.dialog-card {
  width: min(420px, 100%);
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--panel-border) 72%, rgba(135, 102, 56, 0.12));
  border-radius: 20px;
  background: var(--panel-surface);
  box-shadow: 0 24px 56px rgba(32, 26, 18, 0.18);
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.dialog-header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
}

.dialog-close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 999px;
  color: var(--color-text-light);
  background: var(--ink-04);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.dialog-close:hover {
  color: var(--color-text);
  background: var(--ink-08);
  transform: translateY(-1px);
}

.dialog-body {
  margin-top: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.field + .field {
  margin-top: 0.85rem;
}

.field span {
  color: var(--color-text-light);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

.field input {
  height: 42px;
  padding: 0 0.85rem;
  border: 1px solid color-mix(in srgb, var(--ink-12) 70%, transparent);
  border-radius: 12px;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.56);
}

.dialog-error {
  margin: 0.85rem 0 0;
  color: #b4483d;
  font-size: 0.78rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dialog-btn {
  min-width: 84px;
  height: 34px;
  padding: 0 0.85rem;
  border-radius: 10px;
  cursor: pointer;
}

.dialog-btn.is-secondary {
  border: 1px solid color-mix(in srgb, var(--ink-12) 72%, transparent);
  color: var(--color-text-light);
  background: transparent;
}

.dialog-btn.is-primary {
  border: 1px solid rgba(160, 113, 63, 0.2);
  color: #7a522d;
  background: linear-gradient(180deg, rgba(247, 236, 221, 1), rgba(234, 219, 196, 0.96));
}

.dialog-btn:hover {
  transform: translateY(-1px);
}

.dialog-btn.is-secondary:hover {
  color: var(--color-text);
  background: var(--ink-04);
}

.dialog-btn.is-primary:hover {
  color: #684521;
  background: linear-gradient(180deg, rgba(250, 241, 229, 1), rgba(237, 223, 201, 1));
}

:global(.explorer-page.theme-dark) .dialog-card {
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.38);
}

:global(.explorer-page.theme-dark) .field input {
  background: rgba(23, 20, 15, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  .dialog-close,
  .dialog-btn {
    transition: none;
  }
}
</style>
