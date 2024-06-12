<script setup lang="ts">
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
    <li v-if="description" class="gray p-3 rounded-lg space-y-4">
        <a :href="props.url" target="_blank">
        <section>
            <h4 class="line-clamp-1">{{ title }}</h4>
            <p class="line-clamp-2">{{ description }}</p>
        </section>
        <img class="w-auto h-32 rounded-xl place-self-center" :src="img" :alt="title" />
        <div class="inline-flex gap-2 items-center">
            <img class="size-4" :src="favicon" :alt="title" />
            <span class="font-serif">{{ domain }}</span>
        </div>
        </a>
    </li>
    <li v-else-if="description === null" class="gray p-3 rounded-lg space-y-4">
        <a :href="props.url" target="_blank">
            <section>
                <h4 class="line-clamp-1">{{ url }}</h4>
                <p class="line-clamp-2">Ce lien n'a pas renvoyé d'informations. Aucune données disponibles.</p>
            </section>
            <img class="w-auto h-auto" src="@/assets/unknown-link.webp" />
            <div class="inline-flex gap-2 items-center">
                <img class="size-4" :src="favicon" :alt="title" />
                <span class="font-serif">{{ domain }}</span>
            </div>
        </a>
    </li>
</template>