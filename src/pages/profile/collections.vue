<script setup lang="ts">
import { getCollections, addContent, addCategory, deleteCategory, deleteContent } from '@/collections';
import { getContent } from '@/backend';
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import CardContent from '@/components/CardContent.vue';

let pb = null
const currentuser = ref()
let collections = ref()
let categories = ref()
let contenus = ref([])
let select_category = ref('')
let select_content = ref('')

let categoryname = ref('')

interface Item {
    categorie: string;
    content: string;
    type: string;
}

function filterByCategorie(obj: { [key: number]: Item }, categorieNumber: string): Item[] {
    // Convert the object to an array and filter based on the 'categorie' field
    return Object.values(obj).filter(item => item.categorie === categorieNumber);
}

function filterByType(obj: { [key: number]: Item }, type: string): Item[] {
    // Convert the object to an array and filter based on the 'type' field
    return Object.values(obj).filter(item => item.type === type);
}

onMounted(async () => {
  pb = new Pocketbase(import.meta.env.VITE_URL_POCKETBASE)

  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  collections.value = await getCollections(currentuser.value.id)
  categories.value = collections.value.expand.contenu.categories
  contenus.value = collections.value.expand.contenu.contenu
})

</script>

<template>
  <h1>Mes collections</h1>
  <div>
    <h2>Créer une catégorie</h2>
    <input v-model="categoryname" type="text" placeholder="Nom de la catégorie" />
    <button @click="addCategory(currentuser.contenu, categoryname)">Ajouter une catégorie</button>
    <button @click="deleteCategory(currentuser.contenu, 3)">Supprimer une catégorie</button>
  </div>
  <div>
    <h2>Ajouter un contenu</h2>
    <input v-model="select_content" type="text" placeholder="Lien" />
    <select v-model="select_category" name="categories">
      <option disabled selected>Choisissez une catégorie</option>
      <option v-for="(categorie, index) in categories" :key="index" :value="index">{{ categorie }}</option>
    </select>
    <button @click="addContent(currentuser.contenu, select_category, select_content, 'externe')">Ajouter un contenu</button>
    <button @click="deleteContent(currentuser.contenu, 2)">Supprimer un contenu</button>
  </div>
  <ul v-if="collections">
    <li v-for="(categorie, index) in categories" :key="index">{{ categorie }}
      <div>
        <h3>Contenus enregistrés</h3>
        <div v-for="(contenu, indexContenu) in filterByCategorie(contenus, index.toString())" :key="indexContenu">
          <ul v-if="contenu.type === 'interne'">
            <CardContent variant="default" />
          </ul>
          <ul v-else-if="contenu.type === 'externe'">
            <li>{{ contenu.content }}</li>
          </ul>
          <!-- TODO: créer variant external, réussir à sortir les données meta (embed) et les map sur le composant  -->
          <!-- <CardContent variant="external" v-else-if="contenu.type === 'externe'" /> -->
          <li v-else-if="contenu.type === 'externe'">{{ contenu.content }}</li>
        </div>
      </div>
    </li>
  </ul>
</template>
