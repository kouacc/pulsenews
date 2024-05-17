<script setup lang="ts">
import type { ContentType } from '@/types';
import { RouterLink } from 'vue-router';

defineProps<ContentType>()

</script>

<template>
    <li class="flex flex-col gap-2 flex-none flex-shrink-0">
        <RouterLink :to="`/content/${id}`">
        <img class="w-full h-1/3" :src="'https://www.artic.edu/iiif/2/'+image_id+'/full/843,/0/default.jpg'" :alt="alt_text" />
        <h3 class="line-clamp-1">{{ title }}</h3>
        </RouterLink>
    </li>
</template>