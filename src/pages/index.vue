<script setup lang="ts">
import OfflineWindow from '@/components/OfflineWindow.vue';
import CardContent from '@/components/CardContent.vue';
import { ref } from 'vue';

import axios from 'axios';

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

const artData = ref<any>(null);

const getData = async (): Promise<{ artist_id: number, title: string, image_id: string }> => {
  try {
    const response = await axios.get('https://api.artic.edu/api/v1/artworks?limit=100');
    const { data } = response.data;
    artData.value = data;
    return artData.value;
  } catch (error) {
    console.error(error);
  }
}

getData();
console.log(artData.value);
</script>

<template>
  <main>
    <div class="flex">
      <CardContent v-for="art in artData" v-bind="art" :key="artData.title" />
    </div>
    
  </main>
</template>
