<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { getCollections, addContent, addCategory, deleteCategory, deleteContent, getContents } from '@/collections';
import { renderContent } from '@/backend';
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { pb } from '@/backend'
import IconPlus from '@/components/icons/IconPlus.vue';
import ActionWindow from '@/components/ActionWindow.vue';

const CardContent = defineAsyncComponent(() => import('@/components/CardContent.vue'))
const ExternalContentCard = defineAsyncComponent(() => import('@/components/ExternalContentCard.vue'))

const currentuser = ref()
let collections = ref()
let categories = ref()
let contenus = ref()
let select_category = ref('')
let select_content = ref('')
let delete_category_select = ref('')

let deletecategory_warning = ref(false)
let deletecontent_warning = ref(false)

let categoryname = ref('')

const renderedContenus = ref()

const popover_addcategory = ref(false)
const popover_addcontent = ref(false)

const isLoading = ref(true)

async function fetchData() {
  contenus.value = []
try {
  //boucle pour fetch les données de chaque contenu, soit via l'API artic, soit par le scraper web
  for (let categorie of collections.value) {
    let contents = await getContents(categorie.id)
    contenus.value.push(...contents)

    for (let content of contents) {
      let renderedContent = await renderContent(content)
      renderedContenus.value = {
        ...renderedContenus.value,
        [content.id]: renderedContent
      }
    }
  }
} catch (error) {
  console.error(error)
} finally {
  isLoading.value = false
}}

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  //fetch les collections associés à l'utilisateur
  collections.value = await getCollections(currentuser.value.id)

  //récuperer les noms des collections
  categories.value = collections.value.map((categorie: { nom: string }) => categorie.nom)

  fetchData()
})



</script>

<template>
  <div class="grille py-10">
    <h1 class="col-start-1 col-span-full">Mes collections</h1>
    <div class="col-span-full gray p-6 rounded-lg z-10" v-show="popover_addcategory">
      <h2>Créer une catégorie</h2>
      <input v-model="categoryname" type="text" placeholder="Nom de la catégorie" minlength="4" maxlength="20" />
      <button @click="addCategory(currentuser.id, categoryname)">Ajouter une catégorie</button>
      <select v-model="delete_category_select">
        <option disabled selected>Choisissez une catégorie</option>
        <option v-for="categorie in collections" :key="categorie.id" :value="categorie.id">{{ categorie.nom }}</option>
      </select>
      <button @click="deleteCategory(delete_category_select)">Supprimer une catégorie</button>
    </div>
    <div class="col-span-full gray p-6 rounded-lg" v-show="popover_addcontent">
      <h2>Ajouter un contenu</h2>
      <input v-model="select_content" type="text" placeholder="Lien" />
      <select v-model="select_category" name="categories">
        <option disabled selected>Choisissez une catégorie</option>
        <option v-for="categorie in collections" :key="categorie.id" :value="categorie.id">{{ categorie.nom }}</option>
      </select>
      <button @click="addContent(select_content, select_category, 'externe')">Ajouter un contenu</button>
      <button @click="deleteContent(currentuser.contenu, 2)">Supprimer un contenu</button>
    </div>
    <div class="col-start-1 col-span-full flex gap-10">
      <button class="gray inline-flex px-4 py-3 gap-3 rounded-xl mb-3 grow" @click="popover_addcategory = !  popover_addcategory"><IconPlus />Ajouter une catégorie</button>
      <button class="gray inline-flex px-4 py-3 gap-3 rounded-xl mb-3 grow" @click="popover_addcontent = ! popover_addcontent"><IconPlus />Ajouter du contenu</button>
    </div>
    <KeepAlive>
    <ul class="space-y-10 col-start-1 col-span-full" v-if="collections">
      <li class="gray p-6 rounded-xl space-y-3" v-for="categorie in collections" :key="categorie.id">
        <h3>{{ categorie.nom }}</h3>
        <div v-if="isLoading">
          <ul class="grid grid-cols-3 gap-5">
            <CardContent variant="lazyload" v-for="n in 3" :key="n" />
          </ul>
        </div>
        <div class="grid grid-cols-3 gap-5" v-else>
          <ul v-for="contenu in contenus.filter(c => c.categorie_associe === categorie.id)" :key="contenu.id">
                <li v-if="contenu.type === 'interne'">
                  <CardContent v-bind="renderedContenus[contenu.id]"  />
                </li>
                <li v-else-if="contenu.type === 'externe'">
                  <ExternalContentCard :url="contenu.content" v-bind="renderedContenus[contenu.id]" />
                </li>
          </ul>
          </div>
        <RouterLink class="mt-10" :to="`/profile/collections/${categorie.id}`">Voir plus</RouterLink>
      </li>
    </ul>
    </KeepAlive>
  </div>
  <ActionWindow v-show="deletecategory_warning">
    <h2>Attention</h2>
    <p>Vous êtes sur le point de supprimer {{ delete_category_select }} et ses contenus associés. Voulez-vous vraiment continuer ?</p>
    <div class="flex">
      <button @click="deleteCategory(delete_category_select)">Oui</button>
      <button @click="deletecategory_warning = false">Non</button>
    </div>
  </ActionWindow>
  <ActionWindow v-show="deletecontent_warning">

  </ActionWindow>
</template>
