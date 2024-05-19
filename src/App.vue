<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import OfflineWindow from './components/OfflineWindow.vue'
import { onMounted, ref } from 'vue'
import Pocketbase from 'pocketbase'

let pb = null
const currentuser = ref()

onMounted(async () => {
  let pocketbase_ip = ''
  if (import.meta.env.MODE === "production")
    pocketbase_ip = "http://193.168.147.74:8090/"
  else pocketbase_ip = "http://127.0.0.1:8090/"
  pb = new Pocketbase(pocketbase_ip)
  
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  if (!currentuser.value && window.location.pathname !== '/login') {
    window.location.href = '/login'
  } else if (currentuser.value && window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/confirm-verification') {
    window.location.href = '/'
  }
})
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

