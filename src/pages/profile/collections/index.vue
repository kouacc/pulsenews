<script setup lang="ts">
import { getCollections, addContent, addCategory, deleteCategory, deleteContent } from '@/collections';
import { getContent } from '@/backend';
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { pb } from '@/backend'
import CardContent from '@/components/CardContent.vue';
import IconPlus from '@/components/icons/IconPlus.vue';

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
  categories.value = collections.value.expand.contenu.categories
  contenus.value = collections.value.expand.contenu.contenu
})

import LinkPreview from "@ashwamegh/vue-link-preview";

const handleClick = preview => {
    console.log(
        "click",
        preview.domain,
        preview.title,
        preview.description,
        preview.img
    );
};

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
  <button class="inline-flex px-4 py-3 gap-3 bg-slate-300 rounded-xl mb-3"><IconPlus />Ajouter une catégorie</button>
  <ul class="space-y-4" v-if="collections">
    <li class="bg-slate-300 p-6 rounded-xl" v-for="(categorie, index) in categories" :key="index">{{ categorie }}
      <div>
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
  <LinkPreview customDomain="https://linkpreview-pulsenews.maxencelallemand.fr/parse/link" url="https://www.lemonde.fr/les-decodeurs/article/2024/06/07/elections-europeennes-2024-tout-ce-qu-il-faut-savoir-avant-de-voter-le-9-juin_6237858_4355770.html" @on-click="handleClick"></LinkPreview>
</template>
