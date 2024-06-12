<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { pb } from '@/backend'
import { useRouter } from 'vue-router/auto'
import CardContent from '@/components/CardContent.vue'

import axios from 'axios'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'

const router = useRouter()

const artData = ref<any>(null)
const isLoading = ref(true)
const current_page = ref(1)
const search_page = ref()
const totalPages = 1259

const getData = async (): Promise<{ title: string; image_id: string }> => {
  try {
    const response = await axios.get(
      `https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,thumbnail&limit=100&page=${current_page.value}`
    )
    const { data } = response.data
    artData.value = data
    return artData.value
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

async function fetchArtData() {
  try {
    isLoading.value = true

    const artDataResult = await getData()
    artData.value = artDataResult
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
}
}

const currentuser = ref()

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

  if (!currentuser.value) {
    router.replace('/login')
  }
})

onMounted(() => {
  fetchArtData()
})

function nextPage() {
  if (current_page.value < totalPages) {
    current_page.value++
  }
}

function prevPage() {
  if (current_page.value > 1) {
    current_page.value--
  }
}

watch(current_page, () => {
  fetchArtData()
})
</script>

<template>
  <div class="container py-10 space-y-10">
    <h1>Explorer</h1>
    <ul v-if="isLoading" class="grid grid-cols-4 gap-10">
        <CardContent v-for="i in 100" :key="i" variant="lazyload"/>
    </ul>
    <ul class="grid grid-cols-4 grid-flow-row-dense gap-5" v-else>
      <li class="" v-for="art in artData" v-bind="art" :key="art.title">
        <div>
          <RouterLink :to="`/content/${art.id}`">
          <img class="w-auto h-auto" :src="'https://www.artic.edu/iiif/2/' + art.image_id + '/full/843,/0/default.jpg'" :alt="art.thumbnail?.alt_text" />
          <h3 class="line-clamp-3">{{ art.title }}</h3>
          </RouterLink>
        </div>
      </li>
    </ul>
    <div class="flex flex-col items-center gap-10">
      <div class="flex gap-10 items-center">
        <button class="border rounded-full px-4 py-1 inline-flex items-center gap-3" @click="prevPage" :disabled="current_page === 1"><IconChevronLeft class="size-4" /> Page précédente</button>
        <span>Page {{ current_page }} sur {{ totalPages }}</span>
        <button class="border rounded-full px-4 py-1 inline-flex items-center gap-3" @click="nextPage" :disabled="current_page === totalPages">Page suivante<IconChevronLeft class="rotate-180 size-4" /></button>
      </div>
      <div class="flex flex-col items-center">
        <p>ou cherchez une page spécifique</p>
        <div class="inline-flex gap-3">
          <input class="w-fit rounded-xl border px-4 py-1 " v-model="search_page" type="number" placeholder="Numéro de page">
          <button class="bg-blue-500 text-white rounded-xl px-3" @click="current_page = search_page">Aller à la page</button>
        </div>
      </div>
      </div>
    </div>
</template>