<script setup lang="ts">
import type { ContentType } from '@/types';
import { RouterLink } from 'vue-router';
import { ref } from 'vue'
import IconBookmark from './icons/IconBookmark.vue';

import { saveContent } from '@/backend';

let windowSave = ref(false)

defineProps<ContentType>()

</script>

<template>
    <li class="flex flex-col gap-2 flex-none flex-shrink-0">
        <RouterLink :to="`/content/${id}`">
            <div class="bg-gray-800 flex items-center justify-center">
                <img class="w-32 h-full" :src="'https://www.artic.edu/iiif/2/'+image_id+'/full/843,/0/default.jpg'" :alt="alt_text" />
            </div>
        
        <h3 class="line-clamp-1">{{ title }}</h3>
        </RouterLink>
        <button class="place-self-end" @click="windowSave = ! windowSave">
            <IconBookmark class="w-4" />
        </button>
        <div v-show="windowSave" class="absolute top-0 right-0 bg-slate-300">

        </div>
    </li>
</template>