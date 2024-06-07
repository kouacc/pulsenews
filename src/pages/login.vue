<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Pocketbase from 'pocketbase'
import {
  get as getCredential,
  parseRequestOptionsFromJSON
} from '@github/webauthn-json/browser-ponyfill'
import { pb } from '@/backend'

const currentuser = ref()
const email = ref('')
const password = ref('')

onMounted(async () => {

  pb.authStore.onChange(() => {
    currentuser.value = pb.authStore.model
  }, true)
})

//Connexion standard avec email et mot de passe
const doLogin = async () => {
  const authData = await pb.collection('users').authWithPassword(email.value, password.value)

  currentuser.value = pb.authStore.model
  console.log(currentuser.value)
  location.reload()
}

//Connexion avec Google
const doLoginOauth = async () => {
  const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })

  currentuser.value = pb.authStore.model
  location.reload()
}

//Connexion avec Webauthn
const doLoginWebauthn = async () => {
  const publicKeyCredentialRequestOptions = await pb.send(
    `/webauthn-begin-login/${btoa(email.value)}`,
    {
      method: 'POST'
    }
  )

  const assertion = await getCredential(
    parseRequestOptionsFromJSON(publicKeyCredentialRequestOptions)
  )

  const finalResult = await pb.send(`/webauthn-finish-login/${btoa(email.value)}`, {
    method: 'POST',
    //query: data,
    body: assertion
  })

  pb.authStore.save(finalResult.token, finalResult.user)
  currentuser.value = finalResult.user
  location.reload()
  return finalResult
}

let step1 = ref(true)
let step2 = ref(false)
</script>

<template>
  <div class="container mx-auto">
    <h1>Connexion</h1>
    <h3>Content de vous revoir !</h3>
    <h4 v-if="currentuser">Bien connecté, bonjour {{ currentuser.surname }}</h4>
    <div class="flex flex-col gap-10 mx-1/2">
      <div class="bg-slate-300/20 rounded-lg p-10 shadow">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <h3 v-show="step1">Entrez votre adresse e-mail</h3>
            <h3 v-show="step2">Entrez votre mot de passe</h3>
            <label for="email">Adresse e-mail</label>
            <p v-show="step2">{{ email }}</p>
            <input
              v-show="step1"
              v-model="email"
              class="px-3 py-3 rounded-lg shadow"
              id="email"
              type="text"
              autocomplete="webauthn"
            />
            <button
              v-show="step1"
              class="p-3 bg-slate-300/20 rounded-lg shadow"
              type="submit"
              @click="(step1 = false), (step2 = true)"
            >
              Continuer
            </button>
          </div>
          <div class="flex flex-col gap-2" v-show="step2">
            <label for="password">Mot de passe</label>
            <input
              v-model="password"
              class="px-3 py-3 rounded-lg shadow"
              id="password"
              type="password"
              autocomplete="webauthn"
            />
            <div class="flex items-center justify-between">
              <div>
                <label for="remember">Rester connecté</label>
                <input type="checkbox" id="remember" name="remember" />
              </div>
              <button class="p-3 bg-slate-300/20 rounded-lg shadow" @click="doLogin">
                Connexion
              </button>
            </div>
            <div
              class="flex justify-center items-center before:border-b before:border-b-gray-800 before:flex-1 after:border-b after:border-b-gray-800 after:flex-1"
            >
              <p class="mx-2">ou</p>
            </div>
            <button class="p-3 bg-slate-300/20 rounded-lg shadow" @click="doLoginWebauthn">
              Utiliser une clé de sécurité
            </button>
          </div>
        </div>
      </div>
      <div class="flex">
        <button class="p-3 bg-slate-300/20 rounded-lg shadow" type="button" @click="doLoginOauth">
          Connexion par Google
        </button>
      </div>
      <h3>Mot de passe oublié ?</h3>
      <RouterLink to="/forgot-password" class="p-3 bg-slate-300/20 rounded-lg shadow"
        >Réinitialiser le mot de passe</RouterLink
      >
      <section class="text-center">
        <h3>Pas de compte ?</h3>
        <RouterLink to="/register">Créer un compte</RouterLink>
      </section>
    </div>
  </div>
</template>
