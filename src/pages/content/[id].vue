<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router/auto'
import axios from 'axios'
import { addContent, getCollections } from '@/collections'
import Pocketbase from 'pocketbase'
import { pb } from '@/backend'

import ContentTag from '@/components/ContentTag.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import ActionWindow from '@/components/ActionWindow.vue'
import AlertWindow from '@/components/AlertWindow.vue'

const route = useRoute('/offres/[id]')
const router = useRouter()
console.log('id : ', route.params.id)
import { onMounted, ref } from 'vue'

const artData = ref<any>(null)
const collections = ref<any>()
const categories = ref<any>()
const currentuser = ref<any>()

const getData = async (): Promise<{
  title: string
  artist_title: string
  image_id: string
  description: string
  category_titles: string[]
}> => {
  try {
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${route.params.id}`)
    const { data } = response.data
    artData.value = data
    return artData.value
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

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

  if (!currentuser.value) {
    router.replace('/login')
  }

  collections.value = await getCollections(currentuser.value.id)
  categories.value = collections.value.expand.contenu.categories

  console.log(categories.value)
  console.log(collections.value)

})

getData()
</script>

<template>
  <div class="container mx-auto space-y-3">
    <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="scale-75" />Retour</RouterLink
    >
    <h1>{{ artData.title }}</h1>
    <h2>par {{ artData.artist_title || 'Artiste inconnu' }}</h2>
    <img
      class="w-full h-auto"
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
      <ul class="grid grid-cols-3">
        <!-- TODO: faire une query sur l'artiste et afficher 3 de ses oeuvres (maximum) -->
      </ul>
    </section>
    <section>
      <h3>Contenus similaires</h3>
      <ul class="grid grid-cols-3">
        <!-- TODO: faire une query sur le premier category_title et afficher 3 éléments (maximum) -->
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
