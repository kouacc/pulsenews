<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { onMounted, ref } from 'vue'
import Pocketbase from 'pocketbase'

let pb = null
const currentuser = ref()

onMounted(async () => {
  pb = new Pocketbase('http://127.0.0.1:8090')
  currentuser.value = pb.authStore.model
})
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

