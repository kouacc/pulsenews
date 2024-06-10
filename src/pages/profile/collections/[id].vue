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

onMounted(async () => {
    currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

    //fetch la catégorie associée à la route
    collection.value = await getCategory(route.params.id)
    //fetch les contenus associés à la catégorie
    contenus.value = await getContents(route.params.id)

    //render les contenus
    for (let content of contenus.value) {
        console.log(content.content)
        let renderedContent = await renderContent(content)
        console.log(renderedContent)
        renderedContenus.value = {
            ...renderedContenus.value,
            [content.id]: renderedContent
        }
    }
})

</script>

<template>
    <div class="grille py-10">
        <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="scale-75" />Retour</RouterLink
    >
        <section class="col-start-1 col-span-full" v-if="collection">
            <h1>{{ collection.nom }}</h1>
            <div class="grid grid-cols-3 gap-5">
                <ul v-for="contenu in contenus" :key="contenu.id">
                    <li v-if="contenu.type === 'interne'">
                        <CardContent v-bind="renderedContenus[contenu.id]" />
                    </li>
                    <li v-else-if="contenu.type === 'externe'">
                        <ExternalContentCard :url="contenu.content" v-bind="renderedContenus[contenu.id]" />
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>