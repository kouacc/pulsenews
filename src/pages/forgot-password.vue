<script setup lang="ts">
import AlertWindow from '@/components/AlertWindow.vue'
import IconWarning from '@/components/icons/IconWarning.vue'

import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router/auto'

import { pb } from '@/backend'
import ActionButton from '@/components/ActionButton.vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'

const router = useRouter()

onMounted(async () => {
  if (pb.authStore.isValid) {
    router.replace('/')
  }
})

const email = ref('')

let window = ref(false)
const error_window = ref({})


const resetEmail = async () => {
  try {
    await pb.collection('users').requestPasswordReset(email.value)
    error_window.value = {
      variant: 'good',
      title_text: 'E-mail envoyé',
      message_text: 'Un e-mail contenant un lien pour réinitialiser votre mot de passe vous a été envoyé.'
    }
    window.value = true
    setTimeout(() => {
      window.value = false
    }, 5000)
  } catch (error) {
    error_window.value = {
      variant: 'bad',
      title_text: 'Impossible d\'envoyer l\'e-mail.',
      message_text: 'Veuillez réessayer.'
    }
    window.value = true
    setTimeout(() => {
      window.value = false
    }, 5000)
  }
}
</script>

<template>
  <div class="container grille h-screen pt-16">
    <div class="place-self-center place-content-center space-y-3 col-span-full col-start-1">
      <RouterLink class="inline-flex items-center gap-3" to="#" @click.prevent="$router.go(-1)"><IconChevronLeft class="size-4"/>Retour</RouterLink>
      <section>
        <h1 class="mb-3">Mot de passe oublié ?</h1>
        <p>Entrez l'adresse e-mail que vous avez utilisé pour créer votre compte.</p>
        <p>Vous recevrez un e-mail contenant un lien pour réinitialiser votre mot de passe.</p>
      </section>
      <section class="p-3 h-screen space-y-10">
        <div class="flex flex-col gap-2">
          <label for="">Adresse e-mail</label>
          <input v-model="email" class="p-3 rounded-lg shadow-2xl" type="email" placeholder="Votre adresse e-mail" />
        </div>
      <ActionButton class="w-full justify-center" @click="resetEmail()" url="#" size="medium" text="Envoyer" />
        </section>
      </div>
  </div>
  <AlertWindow v-show="window" v-bind="error_window" />
</template>
