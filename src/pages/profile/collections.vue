<script setup lang="ts">
import { getCollections } from '@/backend';
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'

let pb = null
const currentuser = ref()
let collections = ref()
let categories = ref()
let contenus = ref([])

interface Item {
    categorie: string;
    content: string;
    type: string;
}

function filterByCategorie(obj: { [key: number]: Item }, categorieNumber: string): Item[] {
    // Convert the object to an array and filter based on the 'categorie' field
    return Object.values(obj).filter(item => item.categorie === categorieNumber);
}

onMounted(async () => {
  pb = new Pocketbase(import.meta.env.VITE_URL_POCKETBASE)

  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  collections.value = await getCollections(currentuser.value.id)
  categories.value = collections.value.expand.contenu.categories.categories
  contenus.value = collections.value.expand.contenu.contenu.contenu
  
  console.log(contenus.value)
})
</script>

<template>
  <h1>Mes collections</h1>
  <ul v-if="collections">
    <li v-for="(categorie, index) in categories" :key="index">{{ categorie }}
      <div>
        <h3>Contenus enregistrés</h3>
        <ul v-for="(contenu, indexContenu) in filterByCategorie(contenus, index.toString())" :key="indexContenu">
          {{ contenu.content }}
        </ul>
      </div>
    </li>
  </ul>
</template>
