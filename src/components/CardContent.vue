<script setup lang="ts">
import type { ContentType } from '@/types';

defineProps<ContentType>()
</script>

<template>
    <li class="flex flex-col gap-2 flex-none flex-shrink-0">
        <img class="w-full h-1/3" :src="'https://www.artic.edu/iiif/2/'+image_id+'/full/843,/0/default.jpg'" :alt="alt_text" />
        <h3 class="line-clamp-1">{{ title }}</h3>
    </li>
</template>