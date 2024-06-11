<script setup lang="ts">
import { pb } from '@/backend';
import { ref, onMounted } from 'vue';
import { getCategory, getContents, } from '@/collections';
import { renderContent } from '@/backend';
import { useRoute } from 'vue-router/auto';
import { deleteCategory, deleteContent } from '@/collections';
import { useRouter } from 'vue-router/auto';

import CardContent from '@/components/CardContent.vue';
import ExternalContentCard from '@/components/ExternalContentCard.vue';
import ActionWindow from '@/components/ActionWindow.vue';
import ActionButton from '@/components/ActionButton.vue';
import AlertWindow from '@/components/AlertWindow.vue';

import IconChevronLeft from '@/components/icons/IconChevronLeft.vue';
import IconDotMenu from '@/components/icons/IconDotMenu.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconWarning from '@/components/icons/IconWarning.vue';
import IconCroix from '@/components/icons/IconCroix.vue';

const route = useRoute('/profile/collections/[id]')
console.log('id : ', route.params.id)

const router = useRouter()

const currentuser = ref()
const contenus = ref()
const collection = ref()
const renderedContenus = ref()

const rollout_menu = ref(false)
const deletecategory_warning = ref(false)
const deletecontent_warning = ref(false)
const select_content = ref('')
const alert = ref(false)
const alert_message = ref({
    variant: '',
    title_text: '',
    message_text: ''
})

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

async function deleteCategoryFlow(id: number) {
  try {
    await deleteCategory(id)
    router.push('/profile/collections')
  } catch (error) {
    console.error(error)
  }
}

async function deleteContentFlow(id: string) {
    try {
        await deleteContent(id)
        //refetch les contenus
        contenus.value = await getContents(route.params.id)
        alert_message.value = {
            variant: 'good',
            title_text: 'Contenu supprimé',
            message_text: 'Le contenu a été supprimé avec succès.'
        }
        alert.value = true
        setTimeout(() => {
            alert.value = false
        }, 5000)
    } catch (error) {
        console.error(error)
        alert_message.value = {
            variant: 'bad',
            title_text: 'Erreur',
            message_text: 'Une erreur est survenue.'
        }
        alert.value = true
        setTimeout(() => {
            alert.value = false
        }, 5000)
    }
    
}

</script>

<template>
    <div class="grille py-10">
        <RouterLink class="inline-flex gap-4 items-center" to="#" @click.prevent="$router.go(-1)"
      ><IconChevronLeft class="scale-75" />Retour</RouterLink
    >
        <div class="col-start-1 col-span-full space-y-4" v-if="collection">
            <section class="flex items-center justify-between">
                <h1>{{ collection.nom }}</h1>
                <button class="flex flex-col items-end" @click="rollout_menu = !rollout_menu"><IconDotMenu />
                    <div class="absolute flex flex-col divide-y px-2 py-1 gray rounded-xl grow-0 z-30 mt-10" v-show="rollout_menu">
                        <button class="text-red-500 inline-flex items-center gap-3 p-3" @click="deletecontent_warning = true"><IconTrash class="fill-red-500" />Supprimer un contenu</button>
                        <button class="text-red-500 inline-flex items-center gap-3 p-3" @click="deletecategory_warning = true"><IconWarning class="fill-red-500 size-6" />Supprimer la catégorie</button>
                    </div>
                </button>
            </section>
            <div v-if="isLoading" >
                <ul class="grid grid-cols-3 gap-5">
                    <CardContent v-for="i in 6" :key="i" variant="lazyload" />
                </ul>
            </div>
            <ul v-else class="grid grid-cols-3 gap-5">
                <li v-for="contenu in contenus" :key="contenu.id">
                    <div v-if="contenu.type === 'interne'">
                        <CardContent :showSave="false" v-bind="renderedContenus[contenu.id]" />
                    </div>
                    <div v-else-if="contenu.type === 'externe'">
                        <ExternalContentCard :url="contenu.content" v-bind="renderedContenus[contenu.id]" />
                    </div>
                </li>
            </ul>
            <ActionWindow v-show="deletecategory_warning">
                <h2>Attention</h2>
                <p>Vous êtes sur le point de supprimer {{ collection.nom }} et ses contenus associés. Voulez-vous vraiment continuer ?</p>
                <div class="flex justify-center">
                    <ActionButton variant="outlined" size="medium" text="Non" url="#" @click="deletecategory_warning = false" />
                    <ActionButton variant="warning" size="medium" text="Oui" url="#" @click="deleteCategoryFlow(collection.id), deletecategory_warning = false" />
                </div>
            </ActionWindow>
            <ActionWindow v-show="deletecontent_warning">
                <button @click="deletecontent_warning = false"><IconCroix /></button>
                <h2>Supprimer un contenu</h2>
                <p>Choisissez un contenu à supprimer</p>
                <select class="w-full px-4 py-2 rounded-xl" v-model="select_content">
                    <option disabled selected>Choisissez un contenu</option>
                    <option v-for="(contenu, id) in renderedContenus" :key="id" :value="id">{{ contenu.title }}</option>
                </select>
                <ActionButton class="place-self-end" variant="warning" size="medium" text="Supprimer" url="#" @click="deleteContentFlow(select_content), deletecontent_warning = false" />
            </ActionWindow>
        </div>
    </div>
    <AlertWindow v-show="alert" v-bind="alert_message" />
</template>