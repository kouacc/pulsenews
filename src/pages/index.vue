<script setup lang="ts">
import OfflineWindow from '@/components/OfflineWindow.vue'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import Pocketbase from 'pocketbase'

import axios from 'axios'

//const accessToken = '20e12bb708ba46d3b88f5298d3317e4f7803aa5d33c92ff1297213af0e4f653e'
//
//axios.get('https://api.dribbble.com/v2/user?access_token='+accessToken)
//.then(response =>
//    console.log(response.data))
//.catch(error => console.error(error));

//Met Museum, recup tous les objects
//axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects')
//.then(response =>
//    console.log(response.data))
//.catch(error => console.error(error));

//Met Museum, recup un object et ses data

//api img
//const dataChigagoImg = axios.get('https://www.artic.edu/iiif/2/e966799b-97ee-1cc6-bd2f-a94b4b8bb8f9/full/843,/0/default.jpg')
//.then(response =>
//    console.log(response.data))
//.catch(error => console.error(error));

const artData = ref<any>(null)

const getData = async (): Promise<{ title: string; image_id: string }> => {
  try {
    const response = await axios.get(
      'https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,thumbnail&limit=100'
    )
    const { data } = response.data
    artData.value = data
    console.log(artData.value)
    return artData.value
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

getData()
console.log(artData.value)

let pb = null
const currentuser = ref()
onMounted(async () => {
  pb = new Pocketbase('http://127.0.0.1:8090')

  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
})

const CardContent = defineAsyncComponent(() => import('@/components/CardContent.vue'))
</script>

<template>
  <div class="container mx-auto">
    <section class="flex justify-between">
      <h1 v-if="currentuser">Bonjour, {{ currentuser.surname }} !</h1>
    </section>

    <Suspense>
      <template #default>
        <div class="flex flex-col">
          <section>
            <h2>Pour vous</h2>
            <ul class="flex overflow-x-scroll scroll-smooth snap-mandatory gap-10">
              <CardContent
                v-for="art in artData.slice(0, 10)"
                v-bind="art"
                :key="artData.title"
                :alt_text="art.thumbnail.alt_text"
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
      </template>
      <template #fallback>
        <div class="flex flex-col">
          <section>
            <h2>-</h2>
            <ul class="grid grid-cols-3 gap-10">
              <CardContent variant="lazyload" v-for="n in 3" :key="n" />
            </ul>
          </section>
        </div>
      </template>
    </Suspense>
  </div>

  <div class="bg-amber-400 w-screen h-32 absolute top-10 -z-10 rotate-6"></div>
</template>
