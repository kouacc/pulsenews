<script setup lang="ts">
import OfflineWindow from '@/components/OfflineWindow.vue'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { pb } from '@/backend'
import { useRouter } from 'vue-router/auto'
import { getContents, addContent } from '@/collections'

import axios from 'axios'
import ActionButton from '@/components/ActionButton.vue'
import { getCollections } from '@/collections'
import IconPlus from '@/components/icons/IconPlus.vue'
import AlertWindow from '@/components/AlertWindow.vue'

const router = useRouter()

const artData = ref<any>(null)
const isLoading = ref(true)

//randomiser 
const random_number = ref(Math.floor(Math.random() * 1258))

const getData = async (): Promise<{ title: string; image_id: string }> => {
  try {
    const response = await axios.get(
      `https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,thumbnail&limit=100&page=${random_number.value}`
    )
    const { data } = response.data
    artData.value = data
    artData.value = artData.value.sort(() => Math.random() - 0.5)
    return artData.value
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

async function fetchArtData() {
  try {
    isLoading.value = true

    const artDataResult = await getData()
    artData.value = artDataResult
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
}
}

const currentuser = ref()

const categories = ref<any>()
const select_category = ref<any>('')
const add_window = ref(false)

const addcontent_link = ref('')
const alert_error = ref(false)
const alert_message = ref({
  variant: '',
  title_text: '',
  message_text: ''
})

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

  if (!currentuser.value) {
    router.replace('/login')
  }

  categories.value = await getCollections(currentuser.value.id)
})

onMounted(() => {
  fetchArtData()
})

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
      addcontent_link.value = ''
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

const CardContent = defineAsyncComponent(() => import('@/components/CardContent.vue'))
</script>

<template>
  <div v-if="isLoading" class="container px-0 py-6 space-y-6 grille">
    <div class="flex flex-col gap-10 col-start-1 col-span-full">
      <h1 v-if="currentuser">Bonjour, {{ currentuser.surname }} !</h1>
          <section>
            <h2>Voici des recommendations pour vous</h2>
            <ul class="grid grid-cols-4 gap-10">
              <CardContent variant="lazyload" v-for="n in 20" :key="n" />
            </ul>
            <section class="flex flex-col items-center">
              <h2>Envie d'en voir plus ?</h2>
              <ActionButton size="medium" url="/explore" text="Explorer" />
            </section>
          </section>
        </div>
  </div>
  <div v-else class="container px-0 py-6 space-y-6 grille">
    <div class="col-start-1 col-span-full">
      <section class="flex items-center justify-between pt-4">
        <h1 v-if="currentuser">Bonjour, {{ currentuser.surname }} !</h1>
        <div class="flex flex-col items-end"><button class="inline-flex items-center gap-4 cursor-pointer px-3 py-2 gray rounded-[0.75rem]" @click="add_window = ! add_window"><IconPlus />Ajouter un contenu</button>
          <div class="gray px-8 py-2 rounded-lg inline-flex items-center gap-10 top-48 absolute" v-show="add_window">
            <input class="px-3 py-1 rounded-md w-full" v-model="addcontent_link" type="text" placeholder="Lien" />
            <select class="w-96 px-3 py-1 rounded-md" v-model="select_category">
              <option disabled selected>Choisissez une catégorie</option>
              <option v-for="categorie in categories" :key="categorie.nom" :value="categorie.id">{{ categorie.nom }}</option>
            </select>
            <ActionButton variant="default" size="medium" text="Ajouter" url="#" @click="addContentFlow(addcontent_link, select_category, 'externe'), add_window = false"/>
          </div>
        </div>
      </section>
    </div>
        <div class="flex flex-col gap-5 col-start-1 col-span-full">
          <h2>Voici des recommendations pour vous</h2>
          <div class="space-y-10">
            <ul class="grid grid-cols-4 scroll-smooth snap-mandatory gap-x-6 gap-y-8">
              <CardContent
                v-for="art in artData"
                v-bind="art"
                :key="artData.title"
                :categories="categories"
              />
            </ul>
            <section class="flex flex-col items-center">
              <h2>Envie d'en voir plus ?</h2>
              <ActionButton size="medium" url="/explore" text="Explorer" />
            </section>
          </div>
        </div>
        </div>
      <span class="bg-amber-400 w-[105%] h-32 absolute top-[20rem] -left-5 -z-10 rotate-6"></span>
      <span class="bg-amber-400 w-[105%] h-32 absolute top-[40rem] -left-5 -z-10 -rotate-6"></span>
      <AlertWindow v-show="alert_error" v-bind="alert_message" />
</template>
