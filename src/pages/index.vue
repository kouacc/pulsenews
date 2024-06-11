<script setup lang="ts">
import OfflineWindow from '@/components/OfflineWindow.vue'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { pb } from '@/backend'
import { useRouter } from 'vue-router/auto'

import axios from 'axios'
import ActionButton from '@/components/ActionButton.vue'
import { getCollections } from '@/collections'
import IconPlus from '@/components/icons/IconPlus.vue'

const router = useRouter()

const artData = ref<any>(null)
const isLoading = ref(true)

const getData = async (): Promise<{ title: string; image_id: string }> => {
  try {
    const response = await axios.get(
      'https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,thumbnail&limit=100'
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

const CardContent = defineAsyncComponent(() => import('@/components/CardContent.vue'))
</script>

<template>
  <div v-if="isLoading" class="container mx-auto overflow-x-hidden">
    <div class="flex flex-col">
          <section>
            <h1 v-if="currentuser">Bonjour, {{ currentuser.surname }} !</h1>
            <ul class="grid grid-cols-3 gap-10">
              <CardContent variant="lazyload" v-for="n in 20" :key="n" />
            </ul>
          </section>
        </div>
  </div>
  <div v-else class="container py-6 space-y-6 overflow-hidden">
    <div>
      <section class="flex items-center justify-between pt-4">
        <h1 v-if="currentuser">Bonjour, {{ currentuser.surname }} !</h1>
        <button class="px-3 py-2 gray rounded-[0.75rem] inline-flex items-center gap-4" @click="add_window = ! add_window"><IconPlus />Ajouter un contenu </button>
      </section>
      <div class="gray px-8 py-2 rounded-lg inline-flex items-center gap-10 top-48 absolute right-[27rem]" v-show="add_window">
        <input class="px-3 py-1 rounded-md w-full" type="text" placeholder="Lien" />
        <select class="w-96 px-3 py-1 rounded-md" v-model="select_category">
          <option disabled selected>Choisissez une catégorie</option>
          <option v-for="categorie in categories" :key="categorie.nom" :value="categorie.id">{{ categorie.nom }}</option>
        </select>
        <ActionButton variant="default" size="medium" text="Ajouter" url="#" @click=""/>
      </div>
    </div>
        <div class="flex flex-col gap-5">
          <section class="space-y-3">
            <h2>Pour vous</h2>
            <ul class="flex overflow-x-scroll scroll-smooth snap-mandatory gap-10">
              <CardContent
                v-for="art in artData.slice(0, 10)"
                v-bind="art"
                :key="artData.title"
                
              />
            </ul>
            <!-- indicateur activité-->
          </section>
          <section>
            <h2>Pour vous</h2>
            <ul class="flex overflow-x-scroll scroll-smooth snap-mandatory gap-10">
              <CardContent v-for="art in artData.slice(11, 21)" v-bind="art" :key="artData.title" />
            </ul>
          </section>
          <section>
            <h2>Pour vous</h2>
            <ul class="flex overflow-x-scroll scroll-smooth snap-mandatory gap-10">
              <CardContent v-for="art in artData.slice(22, 32)" v-bind="art" :key="artData.title" />
            </ul>
          </section>
          <section>
            <h2>Pour vous</h2>
            <ul class="flex overflow-x-scroll scroll-smooth snap-mandatory gap-10">
              <CardContent v-for="art in artData.slice(33, 43)" v-bind="art" :key="artData.title" />
            </ul>
          </section>
          <section>
            <h2>Pour vous</h2>
            <ul class="flex overflow-x-scroll scroll-smooth snap-mandatory gap-10">
              <CardContent v-for="art in artData.slice(44, 54)" v-bind="art" :key="artData.title" />
            </ul>
          </section>
        </div>
        </div>
      <span class="bg-amber-400 w-[100vw] h-32 absolute top-[20rem] -left-5 -z-10 rotate-6"></span>
      <span class="bg-amber-400 w-[100vw] h-32 absolute top-[40rem] -left-5 -z-10 -rotate-6"></span>
</template>
