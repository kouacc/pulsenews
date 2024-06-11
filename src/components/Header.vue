<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'


import { RouterLink } from 'vue-router'
import LogoBlack from './icons/LogoBlack.vue'
import IconLogout from '@/components/icons/IconLogout.vue'
import IconUser from '@/components/icons/IconUser.vue'
import IconGear from '@/components/icons/IconGear.vue'
import { useRouter } from 'vue-router'
import { pb } from '@/backend'

const router = useRouter()

const currentuser = ref()
onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
})

const avatarUrl = ref<string>('')

watch(currentuser, (newVal, oldVal) => {
  if (newVal) {
    avatarUrl.value = pb.getFileUrl(newVal, newVal.avatar, { thumb: '100x250' })
  }
})

let profileCard = ref(false)

const doLogout = async () => {
  pb.authStore.clear()
  currentuser.value = null
  router.push('/login')
}
</script>

<template>
  <header v-if="currentuser" class="flex flex-row items-center px-6 py-5">
    <nav class="flex w-full items-center gap-4 justify-between">
      <div class="flex gap-2 font-serif items-center">
        <RouterLink to="/"><LogoBlack /></RouterLink>
        <RouterLink to="/explore">Explorer</RouterLink>
        <RouterLink to="/search">Rechercher</RouterLink>
      </div>
      <button @click="profileCard = !profileCard" class="w-12">
        <img class="rounded-full" :src="avatarUrl" alt="Avatar utilisateur" />
      </button>
      <div v-if="currentuser" v-show="profileCard" class="p-4 gray rounded-xl absolute top-20 right-5">
    <div class="inline-flex justify-between gap-14 items-center w-full">
      <section class="inline-flex gap-3 items-center w-fit">
        <img class="rounded-full w-8" :src="avatarUrl" alt="Avatar utilisateur" />
        <h4>{{ currentuser.surname }}</h4>
      </section>
      <button class="w-fit h-fit" @click="doLogout"><IconLogout class="w-6 h-auto" /></button>
    </div>
    <div class="border-t border-gray-500 flex gap-5 pt-5">
      <RouterLink class="p-8 gray rounded-md flex flex-col items-center relative transition-all hover:scale-110" to="/profile/collections" @click="profileCard = false"><IconUser />Mon profil</RouterLink>
      <RouterLink class="p-8 gray rounded-md flex flex-col items-center relative transition-all hover:scale-110" to="/settings" @click="profileCard = false"><IconGear />Paramètres</RouterLink>
    </div>
  </div>
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
