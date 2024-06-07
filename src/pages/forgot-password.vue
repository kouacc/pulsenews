<script setup lang="ts">
import AlertWindow from '@/components/AlertWindow.vue'
import IconWarning from '@/components/icons/IconWarning.vue'

import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'

import { pb } from '@/backend'

const currentuser = ref()
const email = ref('')

let window = ref(false)
const content_title = ref('')
const content_message = ref('')
const content_error = ref('')


const resetEmail = async () => {
  try {
    await pb.collection('users').requestPasswordReset(email.value)
    content_error.value = 'good'
    content_title.value = 'E-mail envoyé !'
    content_message.value = 'Un e-mail contenant un lien pour réinitialiser votre mot de passe vous a été envoyé.'
    window.value = true
    setTimeout(() => {
      window.value = false
    }, 5000)
  } catch (error) {
    content_error.value = 'bad'
    content_title.value = "Impossible d'envoyer l'e-mail."
    content_message.value = 'Veuillez réessayer.'
    window.value = true
    setTimeout(() => {
      window.value = false
    }, 5000)
  }
}
</script>

<template>
  <div class="container mx-auto grid h-screen space-y-3">
    <section class="place-self-center place-content-center">
      <h1>Mot de passe oublié ?</h1>
      <p>Entrez l'adresse e-mail que vous avez utilisé pour créer votre compte.</p>
      <p>Vous recevrez un e-mail contenant un lien pour réinitialiser votre mot de passe.</p>
      <section class="p-3 flex flex-col h-screen">
        <label for="">Adresse e-mail / Nom d'utilisateur</label>
        <input v-model="email" class="px-3 py-3 rounded-lg shadow" type="email" />
        <button @click="resetEmail()" type="button">Envoyer</button>
      </section>
    </section>
  </div>
  <AlertWindow v-show="window" :variant="content_error" :title_text="content_title" :message_text="content_message" />
</template>
