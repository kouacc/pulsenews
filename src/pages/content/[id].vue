<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router/auto'
import axios from 'axios'
import { addContent, getCollections } from '@/collections'
import { pb, getContent } from '@/backend'

import ContentTag from '@/components/ContentTag.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import ActionWindow from '@/components/ActionWindow.vue'
import AlertWindow from '@/components/AlertWindow.vue'

const route = useRoute('/offres/[id]')
const router = useRouter()
console.log('id : ', route.params.id)
import { onMounted, ref, watch } from 'vue'
import CardContent from '@/components/CardContent.vue'


const artData = ref<any>(null)
const contenusSameArtist = ref<any>()
const contenusSimilaires = ref<any>()

const categories = ref<any>()
const currentuser = ref<any>()

const isLoading = ref(true)

const getData = async (): Promise<{
  title: string
  artist_title: string
  image_id: string
  description: string
  category_titles: string[]
  term_titles: string[]
}> => {
  try {
    const response = await getContent(route.params.id)
    artData.value = response
    return artData.value
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const getSameArtist = async () => {
  try {
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search?query[match][artist_title]=${artData.value.artist_title}`)
    const { data } = response.data
    contenusSameArtist.value = data
    // randomiser
    contenusSameArtist.value = contenusSameArtist.value.sort(() => Math.random() - 0.5)
    contenusSameArtist.value = contenusSameArtist.value.slice(0, 3)
    //render
    for (let i = 0; i < contenusSameArtist.value.length; i++) {
  contenusSameArtist.value[i] = await getContent(contenusSameArtist.value[i].id)
}
    return contenusSameArtist.value
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const getSimilaires = async () => {
  try {
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search?query[match][term_titles]=${artData.value.term_titles[0]}`)
    const { data } = response.data
    contenusSimilaires.value = data
    // randomiser
    contenusSimilaires.value = contenusSimilaires.value.sort(() => Math.random() - 0.5)
    contenusSimilaires.value = contenusSimilaires.value.slice(0, 3)
    //render
    for (let i = 0; i < contenusSimilaires.value.length; i++) {
  contenusSimilaires.value[i] = await getContent(contenusSimilaires.value[i].id)
}
    return contenusSimilaires.value
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const add_alert = ref({})
const add_title = ref('')
const add_message = ref('')
const add_window = ref(false)
let error_window = ref(false)

const select_category = ref()

const saveContent = async () => {
  try {
    await addContent(route.params.id, select_category.value, 'interne')
    add_alert.value = {
      variant: 'good',
      title_text: 'Contenu ajouté',
      message_text: 'Le contenu a bien été ajouté à la collection'
    }
    error_window.value = true
    setTimeout(() => {
      error_window.value = false
    }, 5000)
  } catch (error) {
    add_alert.value = {
      variant: 'bad',
      title_text: 'Erreur',
      message_text: 'Le contenu n\'a pas pu être ajouté à la collection.'
    }
    error_window.value = true
    setTimeout(() => {
      error_window.value = false
    }, 5000)
  }
}

async function fetchData() {
      try {
        // Mettre à jour l'état de isLoading à true
        isLoading.value = true

        const artDataResult = await getData()
        artData.value = artDataResult

        // Attendre que toutes les promesses soient résolues
        const [contenusSameArtistResult, contenusSimilairesResult, categories_utilisateur] = await Promise.all([
          getSameArtist(),
          getSimilaires(),
          getCollections(currentuser.value.id)
        ])

        // Mettre à jour les valeurs des refs avec les résultats des promesses
        contenusSameArtist.value = contenusSameArtistResult
        contenusSimilaires.value = contenusSimilairesResult
        categories.value = categories_utilisateur

      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error)
      } finally {
        // Mettre à jour l'état de isLoading à false
        isLoading.value = false
      }
    }

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

  if (!currentuser.value) {
    router.replace('/login')
  }
})

onMounted(() => {
  fetchData()
})


watch(route, async () => {
    artData.value = await getContent(route.params.id)
    contenusSameArtist.value = await getSameArtist()
    contenusSimilaires.value = await getSimilaires()
});



</script>

<template>
  <div v-if="isLoading === true" class="container mx-auto space-y-3 animate-pulse">
    <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="size-5" />Retour</RouterLink
    >
    <span class="flex h-5 w-96 bg-gray-300 rounded-lg"></span>
    <span class="flex h-5 w-80 bg-gray-300 rounded-lg"></span>
    <span class="flex w-4/5 h-[30rem] mx-auto bg-gray-300 rounded-lg"></span>
    <div class="flex flex-col gap-3">
      <span class="flex h-5 w-full bg-gray-300 rounded-lg"></span>
      <span class="flex h-5 w-full bg-gray-300 rounded-lg"></span>
      <span class="flex h-5 w-full bg-gray-300 rounded-lg"></span>
      <span class="flex h-5 w-full bg-gray-300 rounded-lg"></span>
      <span class="flex h-5 w-full bg-gray-300 rounded-lg"></span>
    </div>
  </div>
  <div v-else-if="isLoading === false" class="container mx-auto px-48 pt-6 pb-16 space-y-5">
    <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="size-5" />Retour</RouterLink
    >
    <section class="space-y-2">
      <h1>{{ artData.title }}</h1>
      <h2>par {{ artData.artist_title || 'Artiste inconnu' }}</h2>
    </section>
    <img
      class="w-4/5 h-auto mx-auto"
      :src="'https://www.artic.edu/iiif/2/' + artData.image_id + '/full/843,/0/default.jpg'"
      :alt="artData.thumbnail.alt_text"
    />
    <button @click="add_window = ! add_window" class="bg-blue-500 text-white rounded-lg px-4 py-2">Ajouter à ma collection</button>
    <div class="absolute gray p-10 rounded-lg" v-show="add_window">
    <h4>Dans quelle catégorie souhaitez vous ajouter {{ artData.title }} ?</h4>
    <div class="flex gap-5">
      <select class="px-3 py-1 rounded-md w-full" v-model="select_category" name="categories">
        <option disabled selected>Choisissez une catégorie</option>
        <option v-for="categorie in categories" :key="categorie.nom" :value="categorie.id">{{ categorie.nom }}</option>
      </select>
      <button class="bg-blue-500 text-white rounded-lg px-2 py-1" @click="saveContent(), add_window = false" type="button">Ajouter</button>
    </div>
  </div>
    <section class="space-y-4">
      <h3>Description</h3>
      <p v-if="artData.description" v-html="artData.description"></p>
      <p v-else>Aucune description disponible</p>
    </section>
    <section class="space-y-4">
      <h3>Tags</h3>
      <ul class="flex gap-x-5 gap-y-6 flex-wrap">
        <ContentTag v-for="(tag, index) in artData.term_titles" :key="index" :tag="tag" type="tag" />
      </ul>
    </section>
    <section class="space-y-4">
      <h3>Catégories</h3>
      <ul class="flex gap-x-5 gap-y-6 flex-wrap">
        <ContentTag v-for="(tag, index) in artData.category_titles" :key="index" :tag="tag" type="category" />
      </ul>
    </section>
    <section class="space-y-3">
      <h3>Du même artiste</h3>
      <ul class="grid grid-cols-3 gap-5">
        <CardContent v-for="content in contenusSameArtist" :key="content.id" v-bind="content" :categories="collections" />
      </ul>
    </section>
    <section class="space-y-3">
      <h3>Contenus similaires</h3>
      <ul class="grid grid-cols-3 gap-5">
        <CardContent v-for="content in contenusSimilaires" :key="content.id" v-bind="content" />
      </ul>
    </section>
  
  <AlertWindow v-show="error_window" v-bind="add_alert" />
  </div>
</template>
