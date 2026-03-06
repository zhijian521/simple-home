<script setup lang="ts">
defineProps<{
  searchKeyword: string
}>()

const emit = defineEmits<{
  (event: 'update:search-keyword', value: string): void
  (event: 'submit-search'): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  emit('update:search-keyword', target?.value ?? '')
}
</script>

<template>
  <section class="search-box simple-search-box">
    <form class="search-form" @submit.prevent="emit('submit-search')">
      <input
        id="bookmark-search"
        :value="searchKeyword"
        type="search"
        placeholder="输入关键词后回车搜索（支持网址）"
        aria-label="网页搜索"
        @input="onInput"
      />
      <button type="submit">搜索</button>
    </form>
  </section>
</template>
