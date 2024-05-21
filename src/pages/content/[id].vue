<script setup lang="ts">
import { useRoute } from 'vue-router/auto'
import axios from 'axios';

import ContentTag from '@/components/ContentTag.vue';
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue';

const route = useRoute('/offres/[id]')
console.log('id : ', route.params.id)
import { onMounted, ref } from 'vue';

const artData = ref<any>(null);

const getData = async (): Promise<{ title: string, artist_title: string, image_id: string, description: string, category_titles: string[]}> => {
  try {
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${route.params.id}`);
    const { data } = response.data;
    artData.value = data;
    return artData.value;
  } catch (error) {
    console.error(error)
    return Promise.reject(error);
  }
}
console.log('getData : ', getData())
</script>

<template>
  <div class="container mx-auto space-y-3">
    <RouterLink class="inline-flex gap-4 items-center" to="/"><IconChevronLeft class="scale-75"/>Retour</RouterLink>
    <h1>{{ artData.title }}</h1>
    <h2>par {{ artData.artist_title }}</h2>
    <img class="w-full h-auto" :src="'https://www.artic.edu/iiif/2/'+artData.image_id+'/full/843,/0/default.jpg'" :alt="artData.alt_text" />
    <section class="space-y-4">
      <h3>Description</h3>
      <p v-if="artData.description" v-html="artData.description"></p>
      <p v-else>Aucune description disponible</p>
    </section>
    <section class="space-y-4">
        <h3>Tags</h3>
        <ul class="flex gap-3">
          <ContentTag v-for="(tag, index) in artData.category_titles" :key="index" :tag="tag"/>
        </ul>
    </section>
    <section>
      <h3>Du même artiste</h3>
      <ul class="grid grid-cols-3">
        <!-- TODO: faire une query sur l'artiste et afficher 3 de ses oeuvres (maximum) -->
      </ul>
    </section>
    <section>
      <h3>Contenus similaires</h3>
      <ul class="grid grid-cols-3">
        <!-- TODO: faire une query sur le premier category_title et afficher 3 éléments (maximum) -->
      </ul>
    </section>
  </div>
</template>