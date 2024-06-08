<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { getCollections, addContent, addCategory, deleteCategory, deleteContent, getContents } from '@/collections';
import { renderContent } from '@/backend';
import { onMounted, ref } from 'vue'
import { pb } from '@/backend'
import CardContent from '@/components/CardContent.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import ExternalContentCard from '@/components/ExternalContentCard.vue';

const currentuser = ref()
let collections = ref()
let categories = ref()
let contenus = ref()
let select_category = ref('')
let select_content = ref('')
let delete_category_select = ref('')

let categoryname = ref('')

const renderedContenus = ref()


onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  //fetch les collections associés à l'utilisateur
  collections.value = await getCollections(currentuser.value.id)

  //récuperer les noms des collections
  categories.value = collections.value.map((categorie: { nom: string }) => categorie.nom)

  contenus.value = []

  //boucle pour filtrer les contenus associés à chaque collection
  for (let categorie of collections.value) {
    let contents = await getContents(categorie.id)
    contenus.value.push(...contents)

    //boucle pour fetch les données de chaque contenu, soit via l'API artic, soit par le scraper web
    for (let content of contents) {
      console.log(content.content)
      let renderedContent = await renderContent(content)
      console.log(renderedContent)
      renderedContenus.value = {
        ...renderedContenus.value,
        [content.id]: renderedContent
      }
    }
    console.log(renderedContenus.value)
}})


</script>

<template>
  <h1>Mes collections</h1>
  <div>
    <h2>Créer une catégorie</h2>
    <input v-model="categoryname" type="text" placeholder="Nom de la catégorie" minlength="4" maxlength="20" />
    <button @click="addCategory(currentuser.id, categoryname)">Ajouter une catégorie</button>
    <select v-model="delete_category_select">
      <option disabled selected>Choisissez une catégorie</option>
      <option v-for="categorie in collections" :key="categorie.id" :value="categorie.id">{{ categorie.nom }}</option>
    </select>
    <button @click="deleteCategory(delete_category_select)">Supprimer une catégorie</button>
  </div>
  <div>
    <h2>Ajouter un contenu</h2>
    <input v-model="select_content" type="text" placeholder="Lien" />
    <select v-model="select_category" name="categories">
      <option disabled selected>Choisissez une catégorie</option>
      <option v-for="categorie in collections" :key="categorie.id" :value="categorie.id">{{ categorie.nom }}</option>
    </select>
    <button @click="addContent(select_content, select_category, 'externe')">Ajouter un contenu</button>
    <button @click="deleteContent(currentuser.contenu, 2)">Supprimer un contenu</button>
  </div>
  <button class="gray inline-flex px-4 py-3 gap-3 rounded-xl mb-3"><IconPlus />Ajouter une catégorie</button>
  <ul class="space-y-4" v-if="collections">
    <li class="gray p-6 rounded-xl" v-for="categorie in collections" :key="categorie.id">
      <h3>{{ categorie.nom }}</h3>
      <div class="grid grid-cols-3 gap-5">
        <ul v-for="contenu in contenus.filter(c => c.categorie_associe === categorie.id)" :key="contenu.id">
          <li  v-if="contenu.type === 'interne'">
            <CardContent v-bind="renderedContenus[contenu.id]"  />
          </li>
          <li v-else-if="contenu.type === 'externe'">
            <ExternalContentCard :url="contenu.content" v-bind="renderedContenus[contenu.id]" />
          </li>
        </ul>
        </div>
      <RouterLink :to="`/profile/collections/${categorie.id}`">Voir plus</RouterLink>
    </li>
  </ul>
</template>
