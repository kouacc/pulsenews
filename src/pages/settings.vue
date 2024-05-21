<script setup lang="ts">
// Composants
import ActionWindow from '../components/ActionWindow.vue'
import AlertWindow from '../components/AlertWindow.vue'
// Icones
import IconGoogle from '../components/icons/IconGoogle.vue'
import IconCroix from '@/components/icons/IconCroix.vue'
// Fonctions Backend
import { deleteUser, getAuthMethods, unlinkOAuth, changePasswordLoggedIn } from '@/backend'

import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { create as createCredential, parseCreationOptionsFromJSON} from "@github/webauthn-json/browser-ponyfill"


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
    
    try {
    const array = await getAuthMethods(currentuser.value.id);
    authoptions.value = array.length === 1;
  } catch (error) {
    console.error('Une erreur est survenue :', error);
    authoptions.value = false;
  }
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

const doLoginOauth = async () => {
  const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });

  location.reload()
}
// fenetres actions
let deleteAccountWindow = ref(false)
let changePasswordWindow = ref(false)
let changeEmailWindow = ref(false)
let ExternalAuthWindow = ref(false)
let warningUnlinkOAuth = ref(false)

//fenetres alertes
let alertChangePassword = ref(false)
let alertError = ref(false)


let oldPassword = ref('')
let password = ref('')
let passwordConfirm = ref('')
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
        <div class="bg-slate-300/20 px-8 py-9 rounded-lg space-y-3">
            <h2 class="border-b border-gray-900 pb-1">Zone de danger</h2>
            <section>
                <h3>Authentification</h3>
                <div class="flex gap-5">
                    <button @click="changePasswordWindow = true">Changer de mot de passe</button>
                    <button @click="changeEmailWindow = true">Changer d'adresse e-mail</button>
                    <button @click="ExternalAuthWindow = true">Authentifications externes</button>
                </div>
            </section>
            <section>
                <h3>Suppression de compte</h3>
                <button @click="deleteAccountWindow = true">Supprimer mon compte</button>
            </section>
        </div>
    </div>
    <!-- fenetres modal-->
    <ActionWindow v-show="changePasswordWindow" v-scroll-lock="changePasswordWindow">
        <button class="place-self-start" @click="changePasswordWindow = false"><IconCroix /></button>
        <h1>Changer de mot de passe</h1>
        <p>Pour changer votre mot de passe, vous devrez vérifier votre mot de passe actuel</p>
        <input v-model="oldPassword" class="px-3 py-3 rounded-lg shadow" type="password" placeholder="Mot de passe actuel" required>
        <input v-model="password" class="px-3 py-3 rounded-lg shadow" type="password" placeholder="Nouveau mot de passe" required>
        <input v-model="passwordConfirm" class="px-3 py-3 rounded-lg shadow" type="password" placeholder="Confirmer le nouveau mot de passe" required>
        <button @click="if (oldPassword && password && passwordConfirm) { changePasswordLoggedIn(currentuser.id, password, passwordConfirm, oldPassword); changePasswordWindow = false; }">Changer</button>
    </ActionWindow>

    <ActionWindow v-show="changeEmailWindow" v-scroll-lock="changeEmailWindow">
        <button class="place-self-start" @click="changeEmailWindow = false"><IconCroix /></button>
        <h1>Changer d'adresse e-mail</h1>
    </ActionWindow>

    <ActionWindow v-show="ExternalAuthWindow" v-scroll-lock="ExternalAuthWindow">
        <button class="place-self-start" @click="ExternalAuthWindow = false"><IconCroix /></button>
        <h1>Authentificateurs externes</h1>
        <div>
            <h2>Authentification par Google</h2>
            <p>Lier votre compte Google pour une connexion plus simple et sécurisée. Assurez-vous d'utiliser le compte Google avec la même adresse e-mail que votre compte Pulse.</p>
            <div class="p-5 flex justify-between items-center">
                <div class="flex gap-5 items-center">
                    <IconGoogle class="scale-150" />
                    <p>Statut : <span v-if="authoptions === true">Connecté</span><span v-else>Non connecté</span></p>
                </div>
                <button v-if="authoptions === true" @click="warningUnlinkOAuth = true" class="bg-blue-500 text-white rounded-full px-5 py-2">Délier</button>
                <button v-else @click="doLoginOauth" class="bg-blue-500 text-white rounded-full px-5 py-2">Lier</button>
            </div>
        </div>
        <ActionWindow v-show="warningUnlinkOAuth">
            <h2>Attention</h2>
            <p>Vous êtes sur le point de délier votre compte Google de votre compte Pulse. Vous ne pourrez plus utiliser Google pour vous connecter à votre compte Pulse. Cependant, vous pourrez toujours reconnecter votre compte plus tard depuis cet écran, ou en vous connectant depuis l'écran de connexion.</p>
            <div class="flex gap-4 justify-center">
                <button class="px-5 py-2" @click="warningUnlinkOAuth = false">Annuler</button>
                <button class="px-5 py-2 bg-red-500 text-white rounded-full" @click="unlinkOAuth(currentuser.id)">Délier</button>
            </div>
            </ActionWindow>
        <div class="space-y-3">
            <h2>Clés de sécurité</h2>
            <div class="flex gap-10 items-start">
                <section>
                <p>Uilisez votre appareil et ses informations de connexion (mot de passe, code PIN, empreinte digitale...) pour vous connecter. Les clés de sécurité se passent de votre mot de passe, et sont stockés sur votre appareil uniquement. Vous pouvez supprimer à tout moment une clé de votre compte.</p>
                <!--TODO: remplacer vers un article blog-->
                <a class="underline" href="https://fidoalliance.org/passkeys/" target="_blank">En savoir plus sur les clés de sécurité</a>
                </section>
                <button class="bg-blue-500 text-white rounded-full px-5 py-2 shrink grow-0" @click="registerPasskey">Enregistrer</button>
            </div>
            <section>
                <h3>Clés enregistrées</h3>
                <p v-if="currentuser && currentuser.webauth_id_b64">Vous n'avez pas de clé enregistrée</p>
                <!--TODO: afficher la clé enregistré, à voir en prod si c'est possible d'ajouter plusieurs clés-->

            </section>
        </div>
    </ActionWindow>

    <ActionWindow v-show="deleteAccountWindow" v-scroll-lock="deleteAccountWindow">
        <h2>Supprimer mon compte</h2>
        <p>Attention, cette action est irréversible</p>
        <button @click="deleteAccountWindow = false">Annuler</button>
        <button class="rounded-full px-5 py-2 bg-red-500 text-white" @click="deleteUser(currentuser.id)">Supprimer</button>
    </ActionWindow>
    <!-- fenetres alertes -->
    <AlertWindow v-show="alertChangePassword">
        <h2>Changement effectué</h2>
        <p>Votre mot de passe a été changé avec succès</p>
        <button @click="alertChangePassword = false">Fermer</button>
    </AlertWindow>
    <AlertWindow bad v-show="alertError">
    
    </AlertWindow>


</template>