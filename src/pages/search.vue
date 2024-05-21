<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import CardContent from '@/components/CardContent.vue';
import axios from 'axios';

import { getContent } from '@/backend';

const route = useRoute()
let tag = ref<string>('')

onMounted(() => {
    tag.value = route.query.tag as string

    const getData = async () => {
    try {
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search?query[match][category_titles]=${tag.value}&limit=50&fields=id,title,image_id,alt_text`);
        const { data } = response.data;
        artData.value = data;

        // Utiliser getContent sur chaque élément de artData
        for (let art of artData.value) {
          const content = await getContent(art.id);
          art.content = content;  // Ajouter le contenu à l'objet art
        }
      } catch (error) {
        console.error(error)
      }
    }

console.log('getData : ', getData())
console.log(tag.value)
})

const artData = ref<any[]>([]);

</script>

<template>
  <section class="container">
    <h1>Recherche pour : {{ tag }}</h1>
    <ul class="grid grid-cols-3 gap-10">
      <CardContent v-for="art in artData" v-bind="art" :key="artData.title" />
    </ul>
  </section>
</template>