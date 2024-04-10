<script setup lang="ts">
const props = defineProps({
  to: String,
  text: String,
  isLink: Boolean
})
</script>

<template>
  <a
    v-if="props.isLink"
    class="flex rounded-lg bg-blue-500 text-white w-full justify-center py-1"
    v-on="$props"
    :href="to"
  >
    {{ props.text }}
  </a>
  <button
    v-else
    class="flex rounded-lg bg-blue-500 text-white w-full justify-center py-1"
    v-on="$props"
    :click="to"
  >
    {{ props.text }}
  </button>
</template>
