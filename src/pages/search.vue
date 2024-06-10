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

onMounted(() => {
  tag.value = route.query.tag as string

  if (!pb.authStore.isValid) {
    router.replace('/login')
  }

  const getData = async () => {
    try {
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
    } catch (error) {
      console.error(error)
    }
  }
  console.log('getData : ', getData())
  console.log(tag.value)
})

const artData = ref<any[]>([])

let searchInput = ref<string>('')
let searchType = ref<string>('')

const searchQuery = async () => {
  try {
    const response = await axios.get(
      `https://api.artic.edu/api/v1/artworks/search?q=${searchInput.value}&limit=50&fields=id,title,image_id,alt_text`
    )
    const { data } = response.data
    artData.value = data
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <section v-if="tag" class="container">
    <h1>Recherche pour : {{ tag }}</h1>
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <CardContent v-for="art in artData" v-bind="art" :key="art.title" />
    </ul>
  </section>
  <section v-else class="container">
    <h1>Recherche</h1>
    <p>Entrez un tag ou faites une recherche.</p>
    <input v-model="searchInput" type="text" placeholder="Recherche" />
    <div>
      <input
        v-model="searchType"
        type="radio"
        id="contactChoice2"
        name="contact"
        value="phone"
        checked
      />
      <label for="contactChoice2">Tag</label>

      <input v-model="searchType" type="radio" id="contactChoice3" name="contact" value="mail" />
      <label for="contactChoice3">Recherche</label>
    </div>
    <button @click="searchQuery">Rechercher</button>
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <CardContent v-for="art in artData" v-bind="art" :key="art.title" />
    </ul>
  </section>
</template>
