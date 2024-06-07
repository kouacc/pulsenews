<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const props = defineProps({
    url: String
})

const data = await axios.post('https://linkpreview-pulsenews.maxencelallemand.fr/parse/link', { url: props.url })
const scraped_data = ref(data.data)

console.log(scraped_data.value)
</script>

<template>
    <li v-if="scraped_data.description" class="bg-neutral-100 p-3 rounded-lg space-y-4">
        <a :href="props.url" target="_blank">
        <section>
            <h4 class="line-clamp-1">{{ scraped_data.title }}</h4>
            <p class="line-clamp-2">{{ scraped_data.description }}</p>
        </section>
        <img class="w-auto h-auto" :src="scraped_data.img" :alt="scraped_data.title" />
        <div class="inline-flex gap-2 items-center">
            <img class="size-4" :src="scraped_data.favicon" :alt="scraped_data.title" />
            <span class="font-serif">{{ scraped_data.domain }}</span>
        </div>
        </a>
    </li>
    <li v-else-if="scraped_data.description === null">
        <a :href="props.url" target="_blank">{{ props.url }}
            
        </a>
    </li>
</template>