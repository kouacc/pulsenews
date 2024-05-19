<script setup lang="ts">
import AlertWindow from '@/components/AlertWindow.vue'
import IconWarning from '@/components/icons/IconWarning.vue';

import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'


onMounted(async () => {
  let pocketbase_ip = ''
  if (import.meta.env.MODE === "production")
    pocketbase_ip = "http://193.168.147.74:8090/"
  else pocketbase_ip = "http://127.0.0.1:8090/"
  pb = new Pocketbase(pocketbase_ip)
})

let pb = null
const currentuser = ref()
const email = ref('')
let ErrorWindow = ref(false)
let SuccessWindow = ref(false)

const resetEmail = async () => {
    try {
        await pb.collection('users').requestPasswordReset(email.value);
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
    <AlertWindow bad v-show="ErrorWindow">
      <section class="inline-flex gap-5">
        <IconWarning />
        <h4>Erreur</h4>
      </section>
        <p>Un problème est survenu</p>
    </AlertWindow>
    <AlertWindow v-show="SuccessWindow">
        <h4>E-mail envoyé !</h4>
        <p>Pensez à vérifier vos spams si l'e-mail n'apparaît pas.</p>
    </AlertWindow>
</template>