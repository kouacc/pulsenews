<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { getCollections, addContent, addCategory, deleteCategory, deleteContent, getContents } from '@/collections';
import { renderContent } from '@/backend';
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { pb } from '@/backend'
import IconPlus from '@/components/icons/IconPlus.vue';
import IconDotMenu from '@/components/icons/IconDotMenu.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import ActionWindow from '@/components/ActionWindow.vue';
import ActionButton from '@/components/ActionButton.vue';
import AlertWindow from '@/components/AlertWindow.vue';

const CardContent = defineAsyncComponent(() => import('@/components/CardContent.vue'))
const ExternalContentCard = defineAsyncComponent(() => import('@/components/ExternalContentCard.vue'))

const currentuser = ref()
let collections = ref()
let categories = ref()
let contenus = ref()
let select_category = ref('')
let select_content = ref('')
let delete_category_select = ref('')

let deletecategory_warning = ref({})
let deletecontent_warning = ref(false)

let categoryname = ref('')

const renderedContenus = ref()

const popover_addcategory = ref(false)
const popover_addcontent = ref(false)
const rollout_menu = ref({})
const delete_category_window = ref(false)

let alert_error = ref(false)
let alert_message = ref({
  variant: '',
  title_text: '',
  message_text: ''
})

const isLoading = ref(true)

async function fetchData() {
  contenus.value = []
try {
  //boucle pour fetch les données de chaque contenu, soit via l'API artic, soit par le scraper web
  for (let categorie of collections.value) {
    let contents = await getContents(categorie.id)
    contents = contents.slice(0, 3)
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

async function deleteCategoryFlow(id: number) {
  try {
    await deleteCategory(id)
    collections.value = await getCollections(currentuser.value.id)
    alert_error.value = true
    alert_message.value = {
      variant: 'good',
      title_text: 'Catégorie supprimée',
      message_text: 'La catégorie a bien été supprimée.'
    }
    setTimeout(() => {
      alert_error.value = false
    }, 5000)
  } catch (error) {
    console.error(error)
    alert_error.value = true
    alert_message.value = {
      variant: 'bad',
      title_text: 'Erreur',
      message_text: 'Une erreur est survenue lors de la suppression de la catégorie. Veuillez réessayer plus tard.'
    }
    setTimeout(() => {
      alert_error.value = false
    }, 5000)
  }
}

async function addCategoryFlow (userid: string, category_name: string) {
  try {
    const actual_categories = await getCollections(userid)
    if (actual_categories.some((categorie: { nom: string }) => categorie.nom === category_name)) {
      alert_error.value = true
      alert_message.value = {
        variant: 'bad',
        title_text: 'Erreur',
        message_text: 'Cette catégorie existe déjà.'
      }
      setTimeout(() => {
        alert_error.value = false
      }, 5000)
    } else {
      await addCategory(userid, category_name)
      categoryname.value = ''
      collections.value = await getCollections(userid)
      alert_error.value = true
      alert_message.value = {
        variant: 'good',
        title_text: 'Catégorie ajoutée',
        message_text: 'La catégorie a bien été ajoutée.'
      }
      setTimeout(() => {
        alert_error.value = false
      }, 5000)
    }
  } catch (error) {
    console.error(error)
    alert_error.value = true
    alert_message.value = {
      variant: 'bad',
      title_text: 'Erreur',
      message_text: 'Une erreur est survenue lors de l\'ajout de la catégorie. Veuillez réessayer plus tard.'
    }
    setTimeout(() => {
      alert_error.value = false
    }, 5000)
  }
}

async function addContentFlow(content: string, categoryid: string, type: 'interne' | 'externe') {
  try {
    const actual_contents = await getContents(categoryid)
    if (actual_contents.some((contenu: { content: string }) => contenu.content === content)) {
      alert_error.value = true
      alert_message.value = {
        variant: 'bad',
        title_text: 'Erreur',
        message_text: 'Ce contenu existe déjà dans cette catégorie.'
      }
      setTimeout(() => {
        alert_error.value = false
      }, 5000)
    } else {
      await addContent(content, categoryid, type)
      contenus.value = await getCollections(currentuser.value.id)
      select_content.value = ''
      select_category.value = ''
      fetchData()
      alert_error.value = true
      alert_message.value = {
        variant: 'good',
        title_text: 'Contenu ajouté',
        message_text: 'Le contenu a bien été ajouté.'
      }
      setTimeout(() => {
        alert_error.value = false
      }, 5000)
    }
  } catch (error) {
    console.error(error)
    alert_error.value = true
    alert_message.value = {
      variant: 'bad',
      title_text: 'Erreur',
      message_text: 'Une erreur est survenue lors de l\'ajout du contenu. Veuillez réessayer plus tard.'
    }
    setTimeout(() => {
      alert_error.value = false
    }, 5000)
  }
}

</script>

<template>
  <div class="grille py-10">
    <h1 class="col-start-1 col-span-full">Mes collections</h1>
    <div class="col-start-1 col-span-full flex gap-10">
      <div class="flex flex-col mb-3 grow" ><button class="gray inline-flex gap-3 w-full px-4 py-3 rounded-xl cursor-pointer" @click="popover_addcategory = ! popover_addcategory, popover_addcontent = false"><IconPlus />Ajouter une catégorie</button>
      <div class="gray p-6 rounded-lg z-10 absolute mt-14" v-show="popover_addcategory">
      <h2>Créer une catégorie</h2>
      <div class="inline-flex items-center gap-5">
        <input class="px-5 py-2 rounded-xl" v-model="categoryname" type="text" placeholder="Nom de la catégorie" minlength="4" maxlength="20" />
        <ActionButton @click="addCategoryFlow(currentuser.id, categoryname), popover_addcategory = false" text="Ajouter une catégorie" url="#" />
      </div>
    </div></div>
      <div class="flex flex-col items-end mb-3 grow shrink-0" ><p class="gray inline-flex gap-3 w-full px-4 py-3 rounded-xl cursor-pointer" @click="popover_addcontent = ! popover_addcontent, popover_addcategory = false"><IconPlus />Ajouter du contenu</p>
      <div class="gray p-6 rounded-lg absolute mt-14" v-show="popover_addcontent">
      <h2>Ajouter un contenu</h2>
      <div class="inline-flex items-center gap-5">
      <input class="px-5 py-2 rounded-xl" v-model="select_content" type="text" placeholder="Lien" />
      <select class="px-5 py-2 rounded-xl" v-model="select_category" name="categories">
        <option disabled selected>Choisissez une catégorie</option>
        <option v-for="categorie in collections" :key="categorie.id" :value="categorie.id">{{ categorie.nom }}</option>
      </select>
      <ActionButton @click="addContentFlow(select_content, select_category, 'externe'), popover_addcontent = false" url="#" text="Ajouter un contenu" />
      </div>
    </div></div>
    </div>
    <KeepAlive>
    <ul class="space-y-10 col-start-1 col-span-full" v-if="collections">
      <li class="gray p-6 rounded-xl space-y-3" v-for="categorie in collections" :key="categorie.id">
        <section class="flex items-center justify-between">
          <h3>{{ categorie.nom }}</h3>
          <button class="flex flex-col items-end" @click="rollout_menu[categorie.id] = !rollout_menu[categorie.id]"><IconDotMenu />
            <div class="absolute flex px-6 py-3 gray rounded-xl grow-0 z-30 mt-10" v-show="rollout_menu[categorie.id]">
              <button class="text-red-500 inline-flex items-center gap-3" @click="deletecategory_warning[categorie.id] = true"><IconTrash class="fill-red-500" />Supprimer la catégorie</button>
            </div>
          </button>
        </section>
        <ActionWindow v-show="deletecategory_warning[categorie.id]">
          <h2>Attention</h2>
          <p>Vous êtes sur le point de supprimer {{ categorie.nom }} et ses contenus associés. Voulez-vous vraiment continuer ?</p>
          <div class="flex justify-center">
            <ActionButton variant="outlined" size="medium" text="Non" url="#" @click="deletecategory_warning[categoryname.id] = false" />
            <ActionButton variant="warning" size="medium" text="Oui" url="#" @click="deleteCategoryFlow(categorie.id), deletecategory_warning[categoryname.id] = false" />
          </div>
        </ActionWindow>
        <div v-if="isLoading">
          <ul class="grid grid-cols-3 gap-5">
            <CardContent variant="lazyload" v-for="n in 3" :key="n" />
          </ul>
        </div>
        <div class="grid grid-cols-3 gap-5" v-else>
          <ul v-for="contenu in contenus.filter(c => c.categorie_associe === categorie.id)" :key="contenu.id">
                <li v-if="contenu.type === 'interne'">
                  <CardContent v-bind="renderedContenus[contenu.id]" :showSave="false"  />
                </li>
                <li v-else-if="contenu.type === 'externe'">
                  <ExternalContentCard :url="contenu.content" v-bind="renderedContenus[contenu.id]" />
                </li>
          </ul>
          </div>
        <ActionButton text="Voir plus" :to="`/profile/collections/${categorie.id}`" />
      </li>
    </ul>
    </KeepAlive>
  </div>
  <AlertWindow v-show="alert_error" v-bind="alert_message" />
</template>
