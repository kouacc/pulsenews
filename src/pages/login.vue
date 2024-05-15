<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Pocketbase from 'pocketbase'

let pb = null
const currentuser = ref()
const email = ref('')
const password = ref('')

onMounted(async () => {
  pb = new Pocketbase('http://127.0.0.1:8090')

  pb.authStore.onChange(() => {
    currentuser.value = pb.authStore.model
  
  }, true)

});

const doLogin = async () => {
  const authData = await pb.collection('users').authWithPassword(email.value, password.value);

  console.log(pb.authStore.isValid)
  console.log(pb.authStore.token)
  console.log(pb.authStore.model)
  currentuser.value = pb.authStore.model.prenom
}

const doLogout = async () => {
  pb.authStore.clear()
  currentuser.value = null
}

const doLoginOauth = async () => {
  const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });

  console.log(pb.authStore.isValid)
  console.log(pb.authStore.token)
  console.log(pb.authStore.model)
  currentuser.value = pb.authStore.model
}

</script>

<template>
  <div class="container mx-auto">
    <h1>Connexion</h1>
    <h3>Content de vous revoir !</h3>
    <h4 v-if="currentuser">Bien connecté, bonjour {{ currentuser.prenom }}</h4>
    <button v-if="currentuser" type="button" @click="doLogout">Déconnexion</button>
    <div class="flex flex-col gap-10 mx-1/2">
      <div class="bg-slate-300/20 rounded-lg p-10 shadow">
        <div class="flex flex-col gap-2" action="/login" method="post">
          <label for="">Adresse e-mail / Nom d'utilisateur</label>
          <input v-model="email" class="px-3 py-3 rounded-lg shadow" type="email" />
          <label for="">Mot de passe</label>
          <input v-model="password" class="px-3 py-3 rounded-lg shadow" type="password" />
          <div class="flex">
            <input type="checkbox">
            <label for="">Rester connecté</label>
            <RouterLink to="/forgot-password">Mot de passe oublié ?</RouterLink>
          </div>
          <button @click="doLogin">Se connecter</button>
        </div>
      </div>
      <div class="flex">
        <button class="p-3 bg-slate-300/20 rounded-lg shadow">Connexion en 1-clic</button>
        <button class="p-3 bg-slate-300/20 rounded-lg shadow" type="button" @click="doLoginOauth">Connexion par Google</button>
      </div>
      <section class="text-center">
        <h3>Pas de compte ?</h3>
        <RouterLink to="/register">Créer un compte</RouterLink>
      </section>
    </div>
  </div>
</template>


