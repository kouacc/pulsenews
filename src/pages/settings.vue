<script setup lang="ts">
import ActionWindow from '../components/ActionWindow.vue'
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { create as createCredential, parseCreationOptionsFromJSON} from "@github/webauthn-json/browser-ponyfill"
import { deleteUser } from '@/backend'

let pb: Pocketbase | null = null
const currentuser = ref()

onMounted(async () => {
  let pocketbase_ip = ''
  if (import.meta.env.MODE === "production")
    pocketbase_ip = "http://193.168.147.74:8090/"
  else pocketbase_ip = "http://127.0.0.1:8090/"
  pb = new Pocketbase(pocketbase_ip)
  
  currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
    console.log(currentuser.value)
})


const registerPasskey = async () => {
  const publicKeyCredentialCreationOptions = await pb.send(`/webauthn-begin-registration/${btoa(currentuser.value.email)}`, {
    method: "POST"
  })
  console.log("publicKeyCredentialCreationOptions", publicKeyCredentialCreationOptions)

  const credential = await createCredential(parseCreationOptionsFromJSON(publicKeyCredentialCreationOptions))
  console.log("finishRegistration: send credential", credential.toJSON())

  const finalResult = await pb.send(`/webauthn-finish-registration/${btoa(currentuser.value.email)}`, {
    method: "POST",
    body: credential
  })
  console.log("beginRegistrationAction finalResult", finalResult)

  return finalResult
}

function deleteAccount() {
    deleteUser(currentuser.value.id)
    //clear le authStore
    pb.authStore.clear()
    //refresh la page
    location.reload()
}

let deleteAccountWindow = ref(false)
let changePasswordWindow = ref(false)
let changeEmailWindow = ref(false)
let ExternalAuthWindow = ref(false)
</script>

<template>
    <div v-if="currentuser" class="container mx-auto space-y-3">
        <a href="./">Retour</a>
        <h1>Paramètres</h1>
        <div class="bg-slate-300/20 px-8 py-9 rounded-lg">
            <h2>Informations de compte</h2>
            <div>
                <label>Nom d'utilisateur</label>
                <input type="text" v-model="currentuser.username">
            </div>
            <div>
                <label>Adresse e-mail</label>
                <input type="text" v-model="currentuser.email">
            </div>
        </div>
        <div class="bg-slate-300/20 px-8 py-9 rounded-lg">
            <h2>Confidentialité</h2>
        </div>
        <div class="bg-slate-300/20 px-8 py-9 rounded-lg">
            <h2>Notifications par e-mail</h2>
        </div>
        <div class="bg-slate-300/20 px-8 py-9 rounded-lg">
            <h2>Zone de danger</h2>
            <section>
                <h3>Authentification</h3>
                <button @click="changePasswordWindow = true">Changer de mot de passe</button>
                <button @click="changeEmailWindow = true">Changer d'adresse e-mail</button>
                <button @click="ExternalAuthWindow = true">Authentifications externes</button>
            </section>
            <section>
                <h3>Suppression de compte</h3>
                <button @click="deleteAccountWindow = true">Supprimer mon compte</button>
            </section>
        </div>
    </div>
    <!-- fenetres modal-->
    <ActionWindow v-show="changePasswordWindow">
        <h2>Changer de mot de passe</h2>
        
    </ActionWindow>

    <ActionWindow v-show="changeEmailWindow">
        <h2>Changer d'adresse e-mail</h2>
    </ActionWindow>

    <ActionWindow v-show="ExternalAuthWindow">
        <h2>Authentificateurs externes</h2>
        <div>
            <h2>Enregistrer un passkey</h2>
            <button @click="registerPasskey">Enregistrer</button>
        </div>
    </ActionWindow>

    <ActionWindow v-show="deleteAccountWindow">
        <h2>Supprimer mon compte</h2>
        <p>Attention, cette action est irréversible</p>
        <button @click="deleteAccountWindow = false">Annuler</button>
        <button @click="deleteAccount()">Supprimer</button>
    </ActionWindow>


</template>