<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
</script>

<template>
  <div class="container py-10">
    <h1>Explorer</h1>
    <ul v-if="isLoading">
        <CardContent v-for="i in 10" :key="i" variant="lazyload"/>
    </ul>
    <ul class="flex flex-wrap" v-else>
        <CardContent v-for="art in artData" v-bind="art" :key="art.title" />
    </ul>
  </div>
</template>