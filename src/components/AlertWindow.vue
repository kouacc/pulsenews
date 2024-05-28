<script setup lang="ts">
defineProps({
  bad: Boolean
})
</script>

<template>
  <div v-if="bad === true" class="bg-red-300 px-10 py-7 fixed rounded-xl bottom-4 right-4">
    <slot />
  </div>
  <div v-else class="bg-green-300 px-10 py-7 fixed rounded-xl bottom-4 right-4">
    <slot />
  </div>
</template>
