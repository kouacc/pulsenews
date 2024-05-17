<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import CardContent from '@/components/CardContent.vue';
import axios from 'axios';

const route = useRoute()
let tag = ref<string>('')

onMounted(() => {
    tag.value = route.query.tag as string

    const getData = async (): Promise<{ title: string, image_id: string }> => {
    try {
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks/query[term][category_titles]=${tag.value}`);
    const { data } = response.data;
    artData.value = data;
    console.log('artData : ', artData.value)
    return artData.value;
  } catch (error) {
    console.error(error)
    return Promise.reject(error);
  }
}
console.log('getData : ', getData())
console.log(tag.value)
})

const artData = ref<any>(null);


</script>

<template>
    <h1>Recherche pour : {{ tag }}</h1>
    <CardContent v-for="art in artData" v-bind="art" :key="artData.title" />
</template>