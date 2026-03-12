<script setup lang="ts">
import type { NoteItem } from '../../model/types'

defineProps<{
  activeNote?: NoteItem
}>()
</script>

<template>
  <section v-if="activeNote" class="note-detail">
    <h1>{{ activeNote.title }}</h1>
    <time>{{ activeNote.updatedAt }}</time>
    <p class="note-summary">{{ activeNote.summary }}</p>
    <p class="note-content">{{ activeNote.content }}</p>
  </section>
  <section v-else class="note-empty">暂无笔记内容</section>
</template>

<style scoped>
.note-detail {
  max-width: 820px;
  padding: 1rem;
  border: 1px solid var(--ink-08);
  border-radius: 12px;
  background: var(--surface-soft);
}

.note-detail h1 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: var(--fw-medium);
}

.note-detail time {
  display: block;
  margin-top: 0.35rem;
  color: var(--color-text-lighter);
  font-size: var(--fs-xs);
}

.note-summary {
  margin: 0.8rem 0 0;
  color: var(--color-text-light);
  font-size: var(--fs-body);
  line-height: 1.7;
}

.note-content,
.note-empty {
  margin: 0.75rem 0 0;
  color: var(--color-text);
  font-size: var(--fs-body);
  line-height: 1.8;
}
</style>
