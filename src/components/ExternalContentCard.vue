<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const props = defineProps({
    title: String,
    description: String,
    img: String,
    url: String,
    domain: String,
    favicon: String,
})

</script>

<template>
    <li v-if="description" class="bg-neutral-100 p-3 rounded-lg space-y-4">
        <a :href="props.url" target="_blank">
        <section>
            <h4 class="line-clamp-1">{{ title }}</h4>
            <p class="line-clamp-2">{{ description }}</p>
        </section>
        <img class="w-auto h-auto" :src="img" :alt="title" />
        <div class="inline-flex gap-2 items-center">
            <img class="size-4" :src="favicon" :alt="title" />
            <span class="font-serif">{{ domain }}</span>
        </div>
        </a>
    </li>
    <li v-else-if="description === null">
        <a :href="props.url" target="_blank">{{ props.url }}  
        </a>
    </li>
</template>