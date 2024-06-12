<script setup lang="ts">
import IconFacebook from '../../components/icons/IconFacebook.vue'
import IconTwitter from '../../components/icons/IconTwitter.vue'
import IconInstagram from '../../components/icons/IconInstagram.vue'
import IconLinkedin from '../../components/icons/IconLinkedin.vue'
import IconGithub from '../../components/icons/IconGithub.vue'
import IconCalender from '../../components/icons/IconCalender.vue'
import IconGlobe from '../../components/icons/IconGlobe.vue'

import { formatDate } from '../../helper'
import { pb } from '@/backend'

import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'


const currentuser = ref()

onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
})
</script>

<template>
  <div v-if="currentuser" class="py-10 grille">
    <h1 class="col-start-1 col-span-full">À propos</h1>
    <div class="inline-flex items-center gap-4 col-start-1 col-span-4">
      <IconCalender class="size-8" />
      <h3>Membre depuis : {{ formatDate(currentuser.created) }}</h3>
    </div>
  <div class="col-start-1 col-span-6">
    <div class="gray p-8 rounded-lg w-full">
      <h2 class="text-center">Biographie</h2>
      <p v-if="currentuser.biographie">{{ currentuser.biographie }}</p>
      <p v-else>C'est bien vide... Pourquoi ne pas ajouter une biographie pour votre profil ?</p>
    </div>
    </div>
    <div class="col-start-9 col-span-5" v-if="currentuser.facebook || currentuser.twitter || currentuser.instagram || currentuser.linkedin || currentuser.github || currentuser.siteweb">
        <h2>Réseaux sociaux</h2>
        <ul class="flex gap-5">
          <li v-if="currentuser.facebook">
            <a :href="currentuser.facebook"><IconFacebook class="transition-all hover:scale-110" /></a>
          </li>
          <li v-if="currentuser.twitter">
            <a :href="currentuser.twitter"><IconTwitter class="transition-all hover:scale-110" /></a>
          </li>
          <li v-if="currentuser.instagram">
            <a :href="currentuser.instagram"><IconInstagram class="transition-all hover:scale-110" /></a>
          </li>
          <li v-if="currentuser.linkedin">
            <a :href="currentuser.linkedin"><IconLinkedin class="transition-all hover:scale-110" /></a>
          </li>
          <li v-if="currentuser.github">
            <a :href="currentuser.github"><IconGithub class="transition-all hover:scale-110" /></a>
          </li>
          <li v-if="currentuser.siteweb">
            <a :href="currentuser.siteweb"><IconGlobe class="transition-all hover:scale-110" /></a>
          </li>
        </ul>
      </div>
  </div>
</template>
