<script setup lang="ts">
import AlertWindow from '@/components/AlertWindow.vue'
import IconWarning from '@/components/icons/IconWarning.vue';

import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'


onMounted(async () => {
  pb = new Pocketbase('http://127.0.0.1:8090')
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
    <div class="container mx-auto">
        <h1>Mot de passe oublié ?</h1>
        <section class="bg-slate-300 p-3 flex flex-col">
                <label for="">Adresse e-mail / Nom d'utilisateur</label>
                <input v-model="email" class="px-3 py-3 rounded-lg shadow" type="email" />
                <button @click="resetEmail()" type="button">Envoyer</button>
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