<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import IconEdit from '../components/icons/IconEdit.vue'
import ActionWindow from '../components/ActionWindow.vue'
import IconCroix from '../components/icons/IconCroix.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import AlertWindow from '@/components/AlertWindow.vue'
import { updateUser } from '@/backend'

let pb: Pocketbase | null = null
const currentuser = ref()
let tempUser = ref(null)

onMounted(async () => {
  pb = new Pocketbase(import.meta.env.VITE_URL_POCKETBASE)

  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  tempUser.value = { ...currentuser.value }

})

const avatarUrl = ref<string>('')

watch(currentuser, (newVal) => {
  if (newVal) {
    avatarUrl.value = pb.getFileUrl(newVal, newVal.avatar, { thumb: '100x100' })
  }
})


const content_title = ref('')
const content_message = ref('')
const content_error = ref('')

const updateProfile = async () => {
  if (tempUser.value === currentuser.value) {
    content_error.value = 'bad'
    content_title.value = 'Erreur'
    content_message.value = 'Aucune modification n\'a été apportée à votre profil.'
    alert.value = true
    setTimeout(() => {
      alert.value = false
    }, 5000)
  } else if (tempUser.value !== currentuser.value) {
    await updateUser(tempUser.value, currentuser.value)
    editwindow.value = false
    content_error.value = 'good'
    content_title.value = 'Profil mis à jour'
    content_message.value = 'Votre profil a été mis à jour avec succès.'
    alert.value = true
    setTimeout(() => {
      alert.value = false
    }, 5000)
  }
}

let editwindow = ref(false)
let editpage = ref(1)
const alert = ref(false)
</script>

<template>
  <Transition name="fade">
    <ActionWindow v-if="currentuser" v-show="editwindow" class="z-20">
      <section class="inline-flex justify-between">
        <h2>Modifier votre profil</h2>
        <button @click="editwindow = false"><IconCroix /></button>
      </section>
      <section v-show="editpage === 1">
        <h3 class="mb-2">Infos globales</h3>
        <div class="flex justify-between gap-10">
          <div class="flex flex-col gap-3 grow">
            <div class="flex flex-col gap-2">
              <label>Prénom</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.surname" />
            </div>
            <div class="flex flex-col gap-2">
              <label>Nom</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.name" />
            </div>
            <div class="flex flex-col gap-2">
              <label>Localisation</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.localisation" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label>Avatar</label>
            <img class="rounded-full w-1/2 h-auto" :src="avatarUrl" alt="Avatar" />
            <input type="file" @change="tempUser.avatar = $event.target.files[0]" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label>Biographie</label>
          <textarea class="rounded-lg px-4 py-2" v-model="tempUser.biographie"></textarea>
        </div>
      </section>
      <section v-show="editpage === 2">
          <h3 class="mb-2">Réseaux sociaux</h3>
          <div class="grid grid-cols-2 grid-rows-2 gap-5">
            <div class="flex flex-col">
              <label>Facebook</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.facebook" />
            </div>
            <div class="flex flex-col">
              <label>Instagram</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.instagram" />
            </div>
            <div class="flex flex-col">
              <label>Twitter</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.twitter" />
            </div>
            <div class="flex flex-col">
              <label>Github</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.github" />
            </div>
            <div class="flex flex-col">
              <label>Linkedin</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.linkedin" />
            </div>
            <div class="flex flex-col">
              <label>Site web</label>
              <input class="rounded-lg px-4 py-2" type="text" v-model="tempUser.siteweb" />
            </div>
          </div>
        </section>
        <div class="flex justify-between">
          <div class="space-x-5">
            <button @click="editpage = 1"><IconChevronLeft /></button>
            <button @click="editpage = 2"><IconChevronLeft class="rotate-180" /></button>
          </div>
        <button
          @click="updateProfile()"
          class="px-6 py-2 bg-blue-500 rounded-lg text-white place-self-end grow-0 w-fit"
        >
          Enregistrer
        </button>
        </div>
    </ActionWindow>
  </Transition>
  <div class="container mx-auto">
    <div v-if="currentuser" class="flex gap-28 container items-center mx-auto place-content-center">
      <img class="rounded-full w-[15%] h-auto" :src="avatarUrl" alt="Avatar" />
      <section class="flex flex-col gap-3 flex-grow-0 items-center">
        <h1 class="bg-slate-300/30 rounded-xl px-8 py-3 grow-0">{{ currentuser.surname }}</h1>
        <h2 class="bg-slate-300/30 rounded-xl px-8 py-3 grow-0 w-fit">
          {{ currentuser.localisation }}, France
        </h2>
      </section>
      <button
        class="relative right-[15%] z-10 rounded-full p-4 bg-slate-300"
        @click="editwindow = true"
      >
        <IconEdit />
      </button>
    </div>
    <nav class="flex gap-5 border-b-2 border-black">
      <RouterLink
        to="/profile/collections"
        activeClass="border-b-2 border-blue-400"
        class="px-2 transition-all"
        >Collections</RouterLink
      >
      <RouterLink
        to="/profile/about"
        activeClass="border-b-2 border-blue-400"
        class="px-2 transition-all"
        >À propos</RouterLink
      >
    </nav>
    <RouterView />
  </div>
  <AlertWindow v-show="alert" :variant="content_error" :title_text="content_title" :message_text="content_message" />
</template>
