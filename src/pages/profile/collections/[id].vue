<script setup lang="ts">
import { pb } from '@/backend';
import { ref, onMounted } from 'vue';
import { getContentFromCollection, getCollections } from '@/collections';
import { useRoute } from 'vue-router/auto';

import CardContent from '@/components/CardContent.vue';
import ExternalContentCard from '@/components/ExternalContentCard.vue';

const route = useRoute('/profile/collections/[id]')
console.log('id : ', route.params.id)

const currentuser = ref()
const contenus = ref()
const collection_name = ref('')
const collections = ref()

onMounted(async () => {
    currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
    collections.value = await getCollections(currentuser.value.id)
    collection_name.value = collections.value.categories[route.params.id.toString()]
    contenus.value = await getContentFromCollection(currentuser.value.id, route.params.id.toString())
})

</script>

<template>
    <div>
        <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="scale-75" />Retour</RouterLink
    >
        <h1>{{ collection_name }}</h1>
        <ul class="grid grid-cols-3 gap-3">
            <li v-for="contenu in contenus" :key="contenu.content">
                <CardContent :showSave="false" v-if="contenu.type === 'interne'" />
                <ExternalContentCard v-else-if="contenu.type === 'externe'" :url="contenu.content" />
            </li>
        </ul>
    </div>
</template>