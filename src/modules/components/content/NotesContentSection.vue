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
