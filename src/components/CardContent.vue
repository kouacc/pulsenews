<script setup lang="ts">
import type { ContentType } from '@/types';

defineProps<ContentType>()
</script>

<template>
    <div class="flex flex-col gap-2">
        <img class="w-1/3 h-auto" :src="'https://www.artic.edu/iiif/2/'+image_id+'/full/843,/0/default.jpg'" :alt="alt_text" />
        <h3>{{ title }}</h3>
    </div>
</template>