<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Pocketbase from 'pocketbase'
import IconLogout from '@/components/icons/IconLogout.vue'

import { RouterLink } from 'vue-router'
import { pb } from '@/backend'

const currentuser = ref()
onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
})

const avatarUrl = ref<string>('')

watch(currentuser, (newVal, oldVal) => {
  if (newVal) {
    avatarUrl.value = pb.getFileUrl(newVal, newVal.avatar, { thumb: '100x100' })
  }
})

const doLogout = async () => {
  pb.authStore.clear()
  currentuser.value = null
}
</script>

<template>
  <div v-if="currentuser" class="p-4 bg-slate-300 rounded-xl absolute top-20 right-5">
    <div class="inline-flex justify-between gap-14 items-center">
      <section class="inline-flex gap-3 items-center w-fit">
        <img class="rounded-full w-8" :src="avatarUrl" alt="Avatar utilisateur" />
        <h4>{{ currentuser.surname }}</h4>
      </section>
      <button class="w-fit h-fit" @click="doLogout"><IconLogout class="w-6 h-auto" /></button>
    </div>
    <div class="border-t border-gray-500 flex flex-col">
      <RouterLink to="/profile">Mon profil</RouterLink>
      <RouterLink to="/settings">Paramètres</RouterLink>
    </div>
  </div>
</template>
