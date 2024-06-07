<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { getCollections, addContent, addCategory, deleteCategory, deleteContent } from '@/collections';
import { getContent } from '@/backend';
import { onMounted, ref } from 'vue'
import { pb } from '@/backend'
import CardContent from '@/components/CardContent.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import ExternalContentCard from '@/components/ExternalContentCard.vue';

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
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  collections.value = await getCollections(currentuser.value.id)
  categories.value = collections.value.categories
  contenus.value = collections.value.contenu
})

// watch si la valeur collections change

</script>

<template>
  <h1>Mes collections</h1>
  <div>
    <h2>Créer une catégorie</h2>
    <input v-model="categoryname" type="text" placeholder="Nom de la catégorie" minlength="4" maxlength="20" />
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
  <button class="gray inline-flex px-4 py-3 gap-3 rounded-xl mb-3"><IconPlus />Ajouter une catégorie</button>
  <ul class="space-y-4" v-if="collections">
    <li class="gray p-6 rounded-xl" v-for="(categorie, index) in categories" :key="index">
      <h3>{{ categorie }}</h3>
      <ul class="grid grid-cols-3 gap-4">
        <li v-for="(contenu, indexContenu) in filterByCategorie(contenus, index.toString())" :key="indexContenu">
          <ul v-if="contenu.type === 'interne'">
            <CardContent :showSave="false" variant="default" v-bind="contenu"  />
          </ul>
          <ul class="" v-else-if="contenu.type === 'externe'">
            <ExternalContentCard :url="contenu.content"/>
          </ul>
        </li>
      </ul>
      <RouterLink :to="`/profile/collections/${index}`">Voir plus</RouterLink>
    </li>
  </ul>
</template>
