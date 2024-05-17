<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Pocketbase from 'pocketbase'

import { RouterLink } from 'vue-router'
import LogoBlack from './icons/LogoBlack.vue'
import ProfileCard from '@/components/ProfileCard.vue'

let pb = null
const currentuser = ref()
onMounted(async () => {
  pb = new Pocketbase('http://127.0.0.1:8090')

  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null

})

const avatarUrl = ref<string>('')

watch(currentuser, (newVal, oldVal) => {
  if (newVal) {
    avatarUrl.value = pb.getFileUrl(newVal,newVal.avatar, {'thumb': '100x250'});
  }
});

let profileCard = ref(false)
</script>

<template>
  <header v-if="currentuser" class="flex flex-row items-center px-6 py-5">
    <nav class="flex w-full items-center gap-4 justify-between">
      <div class="flex gap-2 font-serif items-center">
        <RouterLink to="/"><LogoBlack /></RouterLink>
        <RouterLink to="/explore">Explorer</RouterLink>
        <RouterLink to="/search">Rechercher</RouterLink>
      </div>
      <button @click="profileCard = true" class="w-[3%]"><img :src="avatarUrl" alt="Avatar utilisateur"></button>
      <ProfileCard v-show="profileCard" />
    </nav>
    
  </header>
  <header v-else class="flex flex-row items-center justify-between px-6 py-5">
    <div class="flex items-center gap-4">
      <RouterLink to="/"><LogoBlack /></RouterLink>
      <nav class="flex gap-2 font-serif">
        <a href="features.html">Fonctionnalités</a>
        <a href="prices.html">Tarifs</a>
      </nav>
    </div>
    <nav class="flex gap-2 font-serif">
      <RouterLink to="/login">Connexion</RouterLink>
      <RouterLink to="/register">S'inscrire</RouterLink>
    </nav>
  </header>
  
</template>
