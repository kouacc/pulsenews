<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router/auto'
import { onMounted, ref, watch } from 'vue';
import { requestVerification, pb } from '@/backend';

import AlertWindow from '@/components/AlertWindow.vue';

const route = useRoute()
const router = useRouter()

let email = ref<string>('')
let canRequest = ref<boolean>(true)
let lastRequestTime = ref<Date | null>(null)
let request_window = ref(false)
const request_error = ref({})

onMounted(async () => {
  if (pb.authStore.isValid) {
    router.replace('/')
  }

  email.value = route.query.email as string
})

const askVerification = () => {
  if (canRequest.value) {
    requestVerification(email.value)
    lastRequestTime.value = new Date()
    request_window.value = true
    request_error.value = {
        variant: 'good',
        title_text: 'Mail envoyé',
        message_text: 'Consultez votre boîte et vérifiez votre compte.'
      }
      setTimeout(() => {
      request_window.value = false
    }, 5000)
} else if (!canRequest.value) {
    request_window.value = true
    request_error.value = {
        variant: 'bad',
        title_text: 'Erreur',
        message_text: 'Veuillez attendre avant de renvoyer un e-mail de vérification.'
      }
    setTimeout(() => {
      request_window.value = false
    }, 5000)
  }
}

watch(lastRequestTime, () => {
  if (lastRequestTime.value) {
    const now = new Date()
    const diffInMinutes = (now.getTime() - lastRequestTime.value.getTime()) / 1000 / 60
    canRequest.value = diffInMinutes >= 5
  }
}, { immediate: true })


</script>

<template>
  <div class="container">
    <section class="border-b-4 border-black pb-6">
      <h1>Merci !</h1>
      <h2>Une vérification par e-mail vous a été envoyé.</h2>
    </section>
    <div class="flex justify-between gap-5 px-5 py-8">
      <section class="px-8 py-8 bg-gray-100 rounded-lg grow shadow-2xl space-y-2">
        <h3>Rien reçu ?</h3>
        <button @click="askVerification" class="underline">Renvoyer l'e-mail de vérification</button>
      </section>
      <section class="px-8 py-8 bg-gray-100 rounded-lg grow shadow-2xl flex flex-col gap-2">
        <h3>E-mail vérifié ?</h3>
        <RouterLink class="underline font-serif" to="/login">Accéder à la page de connexion</RouterLink>
      </section>
    </div>
  </div>
  <AlertWindow v-show="request_window" v-bind="request_error" />
</template>
