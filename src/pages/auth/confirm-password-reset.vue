<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import AlertWindow from '@/components/AlertWindow.vue'
import IconWarning from '@/components/icons/IconWarning.vue';

const route = useRoute()

onMounted(async () => {
  pb = new Pocketbase('http://127.0.0.1:8090')
  Token.value = route.query.token as string
})

let pb = null
let NewPassword = ref('')
let ConfirmPassword = ref('')
let Token = ref<string>('')

let ErrorWindow = ref(false)
let SuccessWindow = ref(false)

const resetPassword = async () => {
    try {
        await pb.collection('users').confirmPasswordReset(Token.value, NewPassword.value, ConfirmPassword.value);
        SuccessWindow.value = true
        setTimeout(() => {
            SuccessWindow.value = false
        }, 5000)
        } catch (error) {
        ErrorWindow.value = true
        setTimeout(() => {
            ErrorWindow.value = false
        }, 5000)
      }
}
</script>

<template>
    <h1>Changement de mot de passe</h1>
    <div>
        <label>Nouveau mot de passe</label>
        <input type="password" v-model="NewPassword">
    </div>
    <div>
        <label>Confirmer le mot de passe</label>
        <input type="password" v-model="ConfirmPassword">
    </div>
    <button @click="resetPassword">Envoyer</button>
    <AlertWindow bad v-show="ErrorWindow">
      <section class="inline-flex gap-5">
        <IconWarning />
        <h4>Erreur</h4>
      </section>
        <p>Un problème est survenu</p>
    </AlertWindow>
    <AlertWindow v-show="SuccessWindow">
        <h4>Mot de passe modifié !</h4>
        <p>Reconnectez-vous avec votre nouveau mot de passe pour accéder à votre compte.</p>
    </AlertWindow>
</template>