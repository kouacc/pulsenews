<script setup lang="ts">
import IconFacebook from '../../components/icons/IconFacebook.vue'
import IconTwitter from '../../components/icons/IconTwitter.vue'
import IconInstagram from '../../components/icons/IconInstagram.vue'
import IconLinkedin from '../../components/icons/IconLinkedin.vue'
import IconGithub from '../../components/icons/IconGithub.vue'
import IconCalender from '../../components/icons/IconCalender.vue'

import { formatDate } from '../../helper'

import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'

let pb: Pocketbase | null = null
const currentuser = ref()

onMounted(async () => {
  pb = new Pocketbase(import.meta.env.VITE_URL_POCKETBASE)

  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
})
</script>

<template>
  <div v-if="currentuser" class="flex flex-col">
    <h1>À propos</h1>
    <div class="inline-flex items-center gap-4">
      <IconCalender />
      <h3>Membre depuis : {{ formatDate(currentuser.created) }}</h3>
    </div>

    <div class="flex justify-between">
      <div class="bg-slate-300/30 p-8 rounded-xl w-1/2">
        <h2>Biographie</h2>
        <p v-if="currentuser.biographie">{{ currentuser.biographie }}</p>
        <p v-else>C'est bien vide... Pourquoi ne pas ajouter une biographie pour votre profil ?</p>
      </div>
      <div>
        <h2>Réseaux sociaux</h2>
        <ul class="flex gap-5">
          <li v-if="currentuser.facebook">
            <a :href="currentuser.facebook"><IconFacebook /></a>
          </li>
          <li v-if="currentuser.twitter">
            <a :href="currentuser.twitter"><IconTwitter /></a>
          </li>
          <li v-if="currentuser.instagram">
            <a :href="currentuser.instagram"><IconInstagram /></a>
          </li>
          <li v-if="currentuser.linkedin">
            <a :href="currentuser.linkedin"><IconLinkedin /></a>
          </li>
          <li v-if="currentuser.github">
            <a :href="currentuser.github"><IconGithub /></a>
          </li>
          <li v-if="currentuser.siteweb">
            <a :href="currentuser.siteweb"><IconGithub /></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
