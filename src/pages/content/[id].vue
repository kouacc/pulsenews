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

const collections = ref<any>()
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

const add_alert = ref('')
const add_title = ref('')
const add_message = ref('')
const add_window = ref(false)
let error_window = ref(false)

const select_category = ref()

const addContentToCollection = async () => {
  try {
    await addContent(currentuser.value.contenu, select_category.value, artData.value.id, 'interne')
    add_alert.value = 'good'
    add_title.value = 'Contenu ajouté'
    add_message.value = 'Le contenu a bien été ajouté à la collection'
    error_window.value = true
    setTimeout(() => {
      error_window.value = false
    }, 5000)
  } catch (error) {
    add_alert.value = 'bad'
    add_title.value = 'Erreur'
    add_message.value = 'Une erreur est survenue lors de l\'ajout du contenu'
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
        const [contenusSameArtistResult, contenusSimilairesResult] = await Promise.all([
          getSameArtist(),
          getSimilaires()
        ])

        // Mettre à jour les valeurs des refs avec les résultats des promesses
        contenusSameArtist.value = contenusSameArtistResult
        contenusSimilaires.value = contenusSimilairesResult
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

  collections.value = await getCollections(currentuser.value.id)
  categories.value = collections.value.expand.contenu.categories
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
  <div v-if="isLoading === true" class="container mx-auto space-y-3">
    <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="size-5" />Retour</RouterLink
    >
    <h1>Chargement</h1>
    <h2>Chargement</h2>
  </div>
  <div v-else-if="isLoading === false" class="container mx-auto space-y-3">
    <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="size-5" />Retour</RouterLink
    >
    <h1>{{ artData.title }}</h1>
    <h2>par {{ artData.artist_title || 'Artiste inconnu' }}</h2>
    <img
      class="w-auto h-64"
      :src="'https://www.artic.edu/iiif/2/' + artData.image_id + '/full/843,/0/default.jpg'"
      :alt="artData.thumbnail.alt_text"
    />
    <button @click="add_window = ! add_window" class="bg-blue-500 text-white rounded-lg px-4 py-2">Ajouter à ma collection</button>
    <section class="space-y-4">
      <h3>Description</h3>
      <p v-if="artData.description" v-html="artData.description"></p>
      <p v-else>Aucune description disponible</p>
    </section>
    <section class="space-y-4">
      <h3>Tags</h3>
      <ul class="flex gap-3">
        <ContentTag v-for="(tag, index) in artData.category_titles" :key="index" :tag="tag" />
      </ul>
    </section>
    <section>
      <h3>Du même artiste</h3>
      <ul class="grid grid-cols-3 gap-5">
        <CardContent v-for="content in contenusSameArtist" :key="content.id" v-bind="content" />
      </ul>
    </section>
    <section>
      <h3>Contenus similaires</h3>
      <ul class="grid grid-cols-3 gap-5">
        <CardContent v-for="content in contenusSimilaires" :key="content.id" v-bind="content" />
      </ul>
    </section>
  </div>
  <div class="absolute  bg-slate-300 p-10 rounded-xl" v-show="add_window">
    <select v-model="select_category" name="categories">
      <option disabled selected>Choisissez une catégorie</option>
      <option v-for="(categorie, index) in categories" :key="index" :value="index">{{ categorie }}</option>
    </select>
    <button @click="addContentToCollection()" type="button">Ajouter</button>
  </div>
  <AlertWindow v-show="error_window" :variant="add_alert" :title_text="add_title" :message_text="add_message" />
</template>
