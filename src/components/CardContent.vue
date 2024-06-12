<script setup lang="ts">
import type { ContentCardType } from '@/types'
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import { pb } from '@/backend'
import IconBookmark from './icons/IconBookmark.vue'
import ActionButton from './ActionButton.vue'

import { addContent, getCollections } from '@/collections'

let windowSave = ref(false)
let currentuser = ref()

const props = withDefaults(defineProps<Partial<ContentCardType & { 
  variant?: 'default' | 'lazyload',
  showSave?: boolean
  categories?: any,
}>>(),
  {
  variant: 'default',
  showSave: true
})

const select_category = ref('')
const savedConfirm = ref(false)

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
})


</script>

<template>
  <li v-if="variant === 'default'" class="gray p-3 rounded-lg flex flex-col gap-2 flex-none flex-shrink-0">
    <RouterLink :to="`/content/${id}`">
      <div class="bg-[F9F9F9] rounded-md flex items-center justify-center">
        <img
          class="size-48"
          :src="'https://www.artic.edu/iiif/2/' + image_id + '/full/843,/0/default.jpg'"
          :alt="alt_text"
        />
      </div>
      </RouterLink>
      <section class="flex justify-between ">
        <h3 class="line-clamp-1 w-4/5">{{ title }}</h3>
        <div v-if="showSave" class="place-self-end flex flex-col items-center" >
        <button @click="windowSave = !windowSave"><IconBookmark class="w-4" :class="{ 'fill-black': savedConfirm}" /></button>
        <div v-show="windowSave" class="absolute gray p-4 rounded-lg w-80 mt-10">
          <h4 class="line-clamp-2">Dans quelle catégorie voulez-vous ajouter {{ title }} ?</h4>
          <div class="flex gap-5">
            <select v-model="select_category" class="w-full rounded-xl">
              <option disabled selected>Choisissez une catégorie</option>
              <option v-for="categorie in categories" :key="categorie" :value="categorie.id">{{ categorie.nom }}</option>
            </select>
            <button class="bg-blue-500 px-2 py-1 text-white rounded-xl" @click="addContent(id.toString(), select_category,'interne'), windowSave = false, savedConfirm = true">Ajouter</button>
          </div>
        </div>
      </div>
      </section>
  </li>
  <li v-else-if="variant === 'lazyload'">
    <div class="flex flex-col gap-2 animate-pulse">
      <span class="bg-gray-300 px-32 py-28 w-full h-full rounded-lg"></span>
      <div class="flex justify-between">
        <span class="bg-gray-300 w-36 h-8 rounded-lg"></span>
        <span class="bg-gray-300 w-14 h-8 rounded-lg"></span>
      </div>
    </div>
  </li>
</template>
