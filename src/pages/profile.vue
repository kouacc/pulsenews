<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

let pb: Pocketbase | null = null
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

let navActive = ref(1)
</script>

<template>
  <div class="container mx-auto">
    <div v-if="currentuser" class="flex gap-5 container items-center mx-auto place-content-center">
        <img class="rounded-full" :src="avatarUrl" alt="Avatar">
        <section class="flex flex-col gap-3 flex-grow-0 items-center">
            <h2 class="bg-slate-300/30 rounded-xl px-8 py-3 grow-0">{{ currentuser.prenom }}</h2>
            <h3 class="bg-slate-300/30 rounded-xl px-8 py-3 grow-0 w-fit">{{ currentuser.localisation }}, France</h3>
        </section>
    </div>
    <nav class="flex gap-5 border-b-2 border-black">
            <RouterLink to="/profile/collections" class="px-2 transition-all" @click="navActive = 1" :class="{ 'border-b-2 border-blue-400' : navActive === 1}">Collections</RouterLink>
            <RouterLink to="/profile/about" class="px-2 transition-all" @click="navActive = 2" :class="{ 'border-b-2 border-blue-400' : navActive === 2}">À propos</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

