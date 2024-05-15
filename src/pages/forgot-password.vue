<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'


onMounted(async () => {
  pb = new Pocketbase('http://127.0.0.1:8090')
})

let pb = null
const currentuser = ref()
const email = ref('')

const resetEmail = async () => {
    const response = await pb.collection('users').requestPasswordReset(email.value);
    console.log(response)
}
</script>

<template>
    <div class="container mx-auto">
        <h1>Mot de passe oublié ?</h1>
        <section class="bg-slate-300 p-3 flex flex-col">
                <label for="">Adresse e-mail / Nom d'utilisateur</label>
                <input v-model="email" class="px-3 py-3 rounded-lg shadow" type="email" />
                <button @click="resetEmail" type="button">Envoyer</button>
        </section>
    </div>
</template>