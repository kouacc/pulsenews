<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router/auto'
import { onMounted, ref } from 'vue'
import { pb } from '@/backend'
import CardContent from '@/components/CardContent.vue'
import axios from 'axios'

import { getContent } from '@/backend'

const route = useRoute()
const router = useRouter()
let tag = ref<string>('')
let queryType = ref<string>('')


onMounted(() => {
  if (route.query.tag) {
    tag.value = route.query.tag as string
    queryType.value = 'tag'
  } else if (route.query.category) {
    tag.value = route.query.category as string
    queryType.value = 'category'
  }

  if (!pb.authStore.isValid) {
    router.replace('/login')
  }
})

const getData = async () => {
    try {
      if (queryType.value === 'category') {
        if (tag.value != '') {
          const response = await axios.get(
            `https://api.artic.edu/api/v1/artworks/search?query[match][category_titles]=${tag.value}&limit=50&fields=id,title,image_id,alt_text`
          )
          const { data } = response.data
          artData.value = data
  
          // Utiliser getContent sur chaque élément de artData
          for (let art of artData.value) {
            const content = await getContent(art.id)
            art.content = content // Ajouter le contenu à l'objet art
          }
      }
      } else if (queryType.value === 'tag') {
        if (tag.value != '') {
          const response = await axios.get(
            `https://api.artic.edu/api/v1/artworks/search?query[match][term_titles]=${tag.value}&limit=50&fields=id,title,image_id,alt_text`
          )
          const { data } = response.data
          artData.value = data
  
          // Utiliser getContent sur chaque élément de artData
          for (let art of artData.value) {
            const content = await getContent(art.id)
            art.content = content // Ajouter le contenu à l'objet art
          }
        }
      }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  if (tag.value) {
    await getData()
  }
})

const artData = ref([])

let searchInput = ref<string>('')

const searchQuery = async () => {
  try {
    const response = await axios.get(
      `https://api.artic.edu/api/v1/artworks/search?q=${searchInput.value}`
    )
    const data_content = []
    for (let item of response.data.data) {
      console.log(item.id)
      let content = await getContent(item.id)
      console.log(content)
      const rendered = content
      data_content.push(rendered)
    }
    artData.value = data_content
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div v-if="tag" class="container py-10 grille space-y-5">
    <section class="col-span-full col-start-1">
      <h1>Recherche pour : {{ tag }}</h1>
      </section>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 col-span-full">
          <CardContent v-for="art in artData" v-bind="art" :key="art.title" />
        </ul>
  </div>
  <div v-else-if="category" class="container py-10 grille space-y-5">
    <section class="col-span-full col-start-1">
      <h1>Recherche pour : {{ tag }}</h1>
      </section>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 col-span-full">
          <CardContent v-for="art in artData" v-bind="art" :key="art.title" />
        </ul>
  </div>
  <div v-else class="container grille py-10" :class="{ 'h-screen': artData.length === 0}">
    <div class="col-start-1 col-span-full space-y-5">
      <section>
        <h1>Recherche</h1>
        <p>Entrez un tag ou faites une recherche.</p>
      </section>
      <div class="col-start-1 col-span-full flex gap-5 items-center">
        <input v-model="searchInput" class="w-full px-6 py-3 gray rounded-lg" type="text" placeholder='Cherchez un terme comme "cats"' />
        <button class="bg-blue-500 px-4 py-3 rounded-lg text-white" @click="searchQuery()">Rechercher</button>
      </div>
    </div>
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 col-span-full">
      <CardContent v-for="art in artData" v-bind="art" :key="art.title" />
    </ul>
  </div>
</template>
