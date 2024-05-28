<script setup lang="ts">
import type { ContentCardType } from '@/types'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import IconBookmark from './icons/IconBookmark.vue'

import { saveContent } from '@/backend'

let windowSave = ref(false)

const props = withDefaults(defineProps<ContentCardType & { variant?: 'default' | 'lazyload' }>(), {
  variant: 'default'
})
</script>

<template>
  <li v-if="variant === 'default'" class="flex flex-col gap-2 flex-none flex-shrink-0">
    <RouterLink :to="`/content/${id}`">
      <div class="bg-gray-800 flex items-center justify-center">
        <img
          class="w-32 h-full"
          :src="'https://www.artic.edu/iiif/2/' + image_id + '/full/843,/0/default.jpg'"
          :alt="alt_text"
        />
      </div>
      <h3 class="line-clamp-1">{{ title }}</h3>
    </RouterLink>
    <button class="place-self-end" @click="windowSave = !windowSave">
      <IconBookmark class="w-4" />
    </button>
    <div v-show="windowSave" class="absolute top-0 right-0 bg-slate-300"></div>
  </li>
  <li v-else-if="variant === 'lazyload'">
    <div class="flex flex-col gap-2">
      <div class="bg-gray-300 px-32 py-28 w-full h-full rounded-lg"></div>
      <div class="flex justify-between">
        <div class="bg-gray-300 w-36 h-8 rounded-lg"></div>
        <div class="bg-gray-300 w-14 h-8 rounded-lg"></div>
      </div>
    </div>
  </li>
</template>
