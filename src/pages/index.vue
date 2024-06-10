<script setup lang="ts">
import OfflineWindow from '@/components/OfflineWindow.vue'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import Pocketbase from 'pocketbase'
import { pb } from '@/backend'
import { useRouter } from 'vue-router/auto'

import axios from 'axios'

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

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

  if (!currentuser.value) {
    router.replace('/login')
  }
})

onMounted(() => {
  fetchArtData()
})

const CardContent = defineAsyncComponent(() => import('@/components/CardContent.vue'))
</script>

<template>
  <div v-if="isLoading" class="container mx-auto">
    <div class="flex flex-col">
          <section>
            <h1 v-if="currentuser">Bonjour, {{ currentuser.surname }} !</h1>
            <ul class="grid grid-cols-3 gap-10">
              <CardContent variant="lazyload" v-for="n in 20" :key="n" />
            </ul>
          </section>
        </div>
  </div>
  <div v-else class="container mx-auto">
    <section class="flex justify-between">
      <h1 v-if="currentuser">Bonjour, {{ currentuser.surname }} !</h1>
    </section>
        <div class="flex flex-col">
          <section>
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

  <div class="bg-amber-400 w-screen h-32 absolute top-10 -z-10 rotate-6"></div>
</template>
