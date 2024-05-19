<script setup lang="ts">
import ActionWindow from '../components/ActionWindow.vue'
import IconGoogle from '../components/icons/IconGoogle.vue'
import IconCroix from '@/components/icons/IconCroix.vue'
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { create as createCredential, parseCreationOptionsFromJSON} from "@github/webauthn-json/browser-ponyfill"
import { deleteUser, getAuthMethods } from '@/backend'
import { get } from 'node_modules/axios/index.cjs'

let pb: Pocketbase | null = null
const currentuser = ref()
let authoptions = ref()

onMounted(async () => {
    let pocketbase_ip = ''
    if (import.meta.env.MODE === "production")
      pocketbase_ip = "http://193.168.147.74:8090/"
    else pocketbase_ip = "http://127.0.0.1:8090/"
    pb = new Pocketbase(pocketbase_ip)
  
    currentuser.value = pb.authStore.isValid ? pb.authStore.model : null
    
    authoptions.value = getAuthMethods(currentuser.value.id)
    console.log(authoptions.value)
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
    <ActionWindow v-show="changePasswordWindow" v-scroll-lock="changePasswordWindow">
        <h1>Changer de mot de passe</h1>
        <p>Pour changer votre mot de passe, vous devrez vérifier votre mot de passe actuel</p>
    </ActionWindow>

    <ActionWindow v-show="changeEmailWindow" v-scroll-lock="changeEmailWindow">
        <h1>Changer d'adresse e-mail</h1>
    </ActionWindow>

    <ActionWindow v-show="ExternalAuthWindow" v-scroll-lock="ExternalAuthWindow">
        <button @click="ExternalAuthWindow = false"><IconCroix /></button>
        <h1>Authentificateurs externes</h1>
        <div>
            <h2>Authentification par Google</h2>
            <p>Lier votre compte Google pour une connexion plus simple et sécurisée. Assurez-vous d'utiliser le compte Google avec la même adresse e-mail que votre compte Pulse.</p>
            <div class="p-5">
                <IconGoogle />
                <span v-if="authoptions && authoptions.length === 1">Connecté</span>
                <span v-else>Non connecté</span>
                <button v-if="authoptions && authoptions.length === 1">Délier</button>
                <button v-else>Lier</button>
            </div>
        </div>
        <div class="space-y-3">
            <h2>Clés de sécurité</h2>
            <div class="flex gap-10 items-start">
                <section>
                <p>Uilisez votre appareil et ses informations de connexion (mot de passe, code PIN, empreinte digitale...) pour vous connecter. Les clés de sécurité se passent de votre mot de passe, et sont stockés sur votre appareil uniquement. Vous pouvez supprimer à tout moment une clé de votre compte.</p>
                <!--TODO: remplacer vers un article blog-->
                <a class="underline" href="https://fidoalliance.org/passkeys/">En savoir plus sur les clés de sécurité</a>
                </section>
                <button class="bg-blue-500 text-white rounded-xl px-5 py-3 shrink grow-0" @click="registerPasskey">Enregistrer</button>
            </div>
            <section>
                <h3>Clés enregistrées</h3>
                <p v-if="currentuser && currentuser.webauth_id_b64">Vous n'avez pas de clé enregistrée</p>
            </section>
        </div>
    </ActionWindow>

    <ActionWindow v-show="deleteAccountWindow" v-scroll-lock="deleteAccountWindow">
        <h2>Supprimer mon compte</h2>
        <p>Attention, cette action est irréversible</p>
        <button @click="deleteAccountWindow = false">Annuler</button>
        <button @click="deleteAccount()">Supprimer</button>
    </ActionWindow>


</template>