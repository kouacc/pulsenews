<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router/auto'

import AlertWindow from '@/components/AlertWindow.vue'
import IconWarning from '@/components/icons/IconWarning.vue'
import { changePassword, pb } from '@/backend'
import ActionButton from '@/components/ActionButton.vue'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  if (pb.authStore.isValid) {
    router.replace('/')
  }

  Token.value = route.query.token as string
})

let NewPassword = ref('')
let ConfirmPassword = ref('')
let Token = ref<string>('')

let ErrorWindow = ref(false)
let ErrorWindow_alert = ref({})
let PasswordChanged = ref(false)

const resetPassword = async () => {
  try {
    changePassword({
      token: Token.value,
      password: NewPassword.value,
      passwordConfirm: ConfirmPassword.value
    })
    ErrorWindow.value = true
    PasswordChanged.value = true
    ErrorWindow_alert.value = {
      variant: 'good',
      title_text: 'Mot de passe modifié',
      message_text: 'Votre mot de passe a été modifié avec succès.'
    }
    setTimeout(() => {
      ErrorWindow_alert.value = false
    }, 5000)
  } catch (e) {
    ErrorWindow.value = true
    ErrorWindow_alert.value = {
      variant: 'bad',
      title_text: 'Erreur',
      message_text: 'Impossible de modifier le mot de passe.'
    }
    setTimeout(() => {
      ErrorWindow_alert.value = false
    }, 5000)
  }
}
</script>

<template>
  <div class="container grille h-screen -mt-16">
    <section class="place-self-center place-content-center space-y-3 col-span-full col-start-1" v-if="PasswordChanged === false">
      <h1>Changement de mot de passe</h1>
      <div class="flex flex-col gap-2">
        <label>Nouveau mot de passe</label>
        <input class="p-3 rounded-lg shadow-2xl" type="password" v-model="NewPassword" placeholder="Nouveau mot de passe" />
      </div>
      <div class="flex flex-col gap-2">
        <label>Confirmer le mot de passe</label>
        <input class="p-3 rounded-lg shadow-2xl" type="password" v-model="ConfirmPassword" placeholder="Confirmation de mot de passe" />
      </div>
      <ActionButton class="w-full justify-center mt-10" @click="resetPassword" url="#" text="Modifier" size="medium"/>
    </section>
    <section class="place-self-center place-content-center space-y-3 col-span-full col-start-1" v-if="PasswordChanged === true">
      <h1 class="text-center">Mot de passe modifié !</h1>
      <p>Votre ancien mot de passe est devenu invalide, et a été remplacé par le nouveau.</p>
      <ActionButton class="w-full justify-center mt-10" url="/login" text="Se connecter" size="medium"/>
    </section>
    </div>
  <AlertWindow v-show="ErrorWindow" v-bind="ErrorWindow_alert"/>
</template>
