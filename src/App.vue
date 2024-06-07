<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import OfflineWindow from './components/OfflineWindow.vue'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router/auto'

const router = useRouter()
const route = useRoute()

import { pb } from '@/backend'
const currentuser = ref()
console.log(router.currentRoute.value)
console.log(route.fullPath)

/* onMounted(async () => {
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
  if (!currentuser.value && route.currentRoute('/login')) {
    router.replace('/login')
  } else if (
    (currentuser.value && window.location.pathname === '/login') ||
    window.location.pathname === '/register' ||
    window.location.pathname === '/confirm-verification'
  ) {
    window.location.href = '/'
  }
}) */
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
