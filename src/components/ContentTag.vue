<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps({
  tag: String
})
</script>

<template>
  <li>
    <RouterLink :to="`/search?tag=${tag}`" class="px-3 py-2 gray rounded-xl">
      <span class="font-serif">{{ tag }}</span>
    </RouterLink>
  </li>
</template>
