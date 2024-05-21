<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps({
    tag: String,
})
</script>

<template>
    <li>
        <RouterLink :to="`/search?tag=${tag}`" class="px-5 py-2 bg-slate-300/30 rounded-xl">
            <span>{{ tag }}</span>
        </RouterLink>
    </li>
</template>