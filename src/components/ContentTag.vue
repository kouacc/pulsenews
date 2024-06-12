<script setup lang="ts">
import { RouterLink } from 'vue-router'


const props = defineProps({
  tag: String,
  type: String
})
</script>

<template>
  <li>
    <RouterLink v-if="type === 'category'" :to="`/search?category=${tag}`" class="px-3 py-2 gray rounded-xl">
      <span class="font-serif">{{ tag }}</span>
    </RouterLink>
    <RouterLink v-else-if="type === 'tag'" :to="`/search?tag=${tag}`" class="px-3 py-2 gray rounded-xl">
      <span class="font-serif">{{ tag }}</span>
    </RouterLink>
  </li>
</template>
