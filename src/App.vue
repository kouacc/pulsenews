<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

import axios from 'axios';


axios.get("https://api.dribbble.com/v2/user/shots?page=2&per_page=100", {
    params: {
        access_token: ``
    }
})
.then(response =>
    console.log(response.data))
.catch(error => console.error(error));



</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

