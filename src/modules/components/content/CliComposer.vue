<script setup lang="ts">
import AiActionIcon from '../icons/AiActionIcon.vue'
import SearchActionIcon from '../icons/SearchActionIcon.vue'

defineProps<{
  searchKeyword: string
}>()

const emit = defineEmits<{
  (event: 'update:search-keyword', value: string): void
  (event: 'submit-search'): void
  (event: 'submit-ai-chat'): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  emit('update:search-keyword', target?.value ?? '')
}
</script>

<template>
  <section class="cli-input-shell" aria-label="命令输入区">
    <div class="cli-input-row">
      <input
        id="bookmark-search"
        :value="searchKeyword"
        type="text"
        placeholder="search..."
        aria-label="CLI 输入"
        @input="onInput"
        @keydown.enter.prevent="emit('submit-ai-chat')"
      />
      <button type="button" class="cli-btn" aria-label="搜索引擎" title="搜索引擎" @click="emit('submit-search')">
        <SearchActionIcon />
      </button>
      <button
        type="button"
        class="cli-btn is-ai"
        aria-label="AI 对话"
        title="AI 对话"
        @click="emit('submit-ai-chat')"
      >
        <AiActionIcon />
      </button>
    </div>
  </section>
</template>

<style scoped>
.cli-input-shell {
  margin-top: 0;
  padding: 0.25rem 0 0.2rem;
}

.cli-input-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px 32px;
  align-items: center;
  gap: 0.5rem;
  padding: 0.42rem;
  border: 1px solid rgba(160, 113, 63, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.58);
  box-shadow:
    0 10px 26px rgba(77, 56, 31, 0.06),
    inset 0 1px rgba(255, 255, 255, 0.42);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

:global(.explorer-page.theme-dark) .cli-input-row {
  border-color: rgba(215, 188, 145, 0.14);
  background: rgba(23, 20, 15, 0.36);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.14),
    inset 0 1px rgba(255, 255, 255, 0.03);
}

.cli-input-row:focus-within {
  border-color: rgba(160, 113, 63, 0.3);
  box-shadow:
    0 0 0 4px rgba(160, 113, 63, 0.09),
    0 14px 30px rgba(77, 56, 31, 0.09);
}

:global(.explorer-page.theme-dark) .cli-input-row:focus-within {
  border-color: rgba(215, 188, 145, 0.28);
  box-shadow:
    0 0 0 4px rgba(215, 188, 145, 0.07),
    0 14px 30px rgba(0, 0, 0, 0.16);
}

.cli-input-row input {
  width: 100%;
  height: 46px;
  padding: 0 0.9rem;
  border: 0;
  border-radius: 14px;
  color: var(--color-text);
  background: transparent;
  font-family: var(--font-ui);
  font-size: 17px;
  font-weight: 450;
  line-height: 1.2;
}

.cli-input-row input::placeholder {
  color: var(--color-text-light);
  opacity: 0.72;
}

.cli-input-row input:focus-visible {
  outline: none;
}

.cli-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(160, 113, 63, 0.12);
  border-radius: 10px;
  color: color-mix(in srgb, var(--cli-accent-strong) 88%, #8a612e);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(243, 235, 222, 0.94));
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.cli-btn svg {
  width: 14px;
  height: 14px;
}

.cli-btn:hover {
  color: var(--color-text);
  background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(239, 228, 211, 1));
  transform: translateY(-1px);
}

.cli-btn.is-ai {
  border-color: rgba(77, 123, 104, 0.16);
  color: #557e70;
  background: linear-gradient(180deg, rgba(234, 244, 239, 0.98), rgba(214, 232, 224, 0.98));
}

:global(.explorer-page.theme-dark) .cli-btn {
  border-color: rgba(215, 188, 145, 0.1);
  color: var(--cli-accent);
  background: linear-gradient(180deg, rgba(60, 51, 40, 0.96), rgba(45, 38, 30, 0.96));
}

:global(.explorer-page.theme-dark) .cli-btn.is-ai {
  border-color: rgba(141, 197, 173, 0.18);
  color: #8dc5ad;
  background: linear-gradient(180deg, rgba(39, 58, 51, 0.96), rgba(29, 43, 38, 0.96));
}

@media (max-width: 640px) {
  .cli-input-row input {
    height: 42px;
    padding-inline: 0.7rem;
    font-size: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cli-input-row,
  .cli-btn {
    transition: none;
  }
}
</style>
