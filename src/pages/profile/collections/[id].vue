<script setup lang="ts">
import { pb } from '@/backend';
import { ref, onMounted } from 'vue';
import { getCategory, getContents, } from '@/collections';
import { renderContent } from '@/backend';
import { useRoute } from 'vue-router/auto';

import CardContent from '@/components/CardContent.vue';
import ExternalContentCard from '@/components/ExternalContentCard.vue';
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue';

const route = useRoute('/profile/collections/[id]')
console.log('id : ', route.params.id)

const currentuser = ref()
const contenus = ref()
const collection = ref()
const renderedContenus = ref()

const isLoading = ref(true)

async function fetchData() {
    try {
        for (let content of contenus.value) {
        let renderedContent = await renderContent(content)
        renderedContenus.value = {
            ...renderedContenus.value,
            [content.id]: renderedContent
        }
    }
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

    //fetch la catégorie associée à la route
    collection.value = await getCategory(route.params.id)
    //fetch les contenus associés à la catégorie
    contenus.value = await getContents(route.params.id)

    //render les contenus
    fetchData()
})

</script>

<template>
    <div class="grille py-10">
        <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="scale-75" />Retour</RouterLink
    >
        <section class="col-start-1 col-span-full" v-if="collection">
            <h1>{{ collection.nom }}</h1>
            <div v-if="isLoading" >
                <ul class="grid grid-cols-3 gap-5">
                    <CardContent v-for="i in 6" :key="i" variant="lazyload" />
                </ul>
            </div>
            <ul v-else class="grid grid-cols-3 gap-5">
                <li v-for="contenu in contenus" :key="contenu.id">
                    <div v-if="contenu.type === 'interne'">
                        <CardContent v-bind="renderedContenus[contenu.id]" />
                    </div>
                    <div v-else-if="contenu.type === 'externe'">
                        <ExternalContentCard :url="contenu.content" v-bind="renderedContenus[contenu.id]" />
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>