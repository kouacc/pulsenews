<script setup lang="ts">
import { useRoute } from 'vue-router/auto'
import axios from 'axios';

import ContentTag from '@/components/ContentTag.vue';

const route = useRoute('/offres/[id]')
console.log('id : ', route.params.id)
import { onMounted, ref } from 'vue';

const artData = ref<any>(null);

const getData = async (): Promise<{ title: string, image_id: string, description: string, category_titles: string[]}> => {
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
  <div class="container mx-auto">
    <h1>{{ artData.title }}</h1>
    <img class="w-full h-auto" :src="'https://www.artic.edu/iiif/2/'+artData.image_id+'/full/843,/0/default.jpg'" :alt="artData.alt_text" />
    <p v-if="artData.description" v-html="artData.description"></p>
    <section>
        <h2>Tags</h2>
        <ContentTag v-for="(tag, index) in artData.category_titles" :key="index" :tag="tag"/>
    </section>
  </div>
</template>