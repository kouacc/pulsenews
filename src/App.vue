<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import OfflineWindow from './components/OfflineWindow.vue'

</script>

<template>
  <Header />
  <main>
    <Suspense>
      <RouterView />
    </Suspense>
  </main>
  <Footer />
</template>
