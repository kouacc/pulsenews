<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router/auto'
import Pocketbase from 'pocketbase'
import {
  get as getCredential,
  parseRequestOptionsFromJSON
} from '@github/webauthn-json/browser-ponyfill'
import { pb, requestVerification } from '@/backend'
import IconGoogle from '@/components/icons/IconGoogle.vue'
import ActionButton from '@/components/ActionButton.vue'
import IconKey from '@/components/icons/IconKey.vue'
import AlertWindow from '@/components/AlertWindow.vue'

const router = useRouter()

const currentuser = ref()
const email = ref('')
const password = ref('')

const login_error = ref(false)
const login_message = ref({
  variant: '',
  title_text: '',
  message_text: '',
})

let canRequest = ref<boolean>(true)
let lastRequestTime = ref<Date | null>(null)

onMounted(async () => {
  if (pb.authStore.isValid) {
    router.replace('/')
  }

  pb.authStore.onChange(() => {
    currentuser.value = pb.authStore.model
  }, true)
})

//Connexion standard avec email et mot de passe
const doLogin = async () => {
  try {
    await pb.collection('users').authWithPassword(email.value, password.value)
    currentuser.value = pb.authStore.model
    router.push('/')
    window.location.reload()
  } catch (error) {
      checkError(error)
  }
}

//Connexion avec Google
const doLoginOauth = async () => {
  try {
    await pb.collection('users').authWithOAuth2({ provider: 'google' })
    currentuser.value = pb.authStore.model
    router.push('/')
    window.location.reload()
  } catch (error) {
      checkError(error)
  }
}

//Connexion avec Webauthn
const doLoginWebauthn = async () => {
  try{
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
    router.push('/')
    window.location.reload()
  } catch (error) {
    checkError(error)
  }
}

function checkError(error: any) {
  if (error.response && error.response.code === 403) {
    if (canRequest.value) {
      login_error.value = true
      login_message.value = {
        variant: 'warning',
        title_text: 'Compte non vérifié',
        message_text: "Un e-mail de vérification vous a été envoyé."
      }
      requestVerification(email.value)
      lastRequestTime.value = new Date()
      setTimeout(() => {
        login_error.value = false
      }, 5000)
    } else {
      login_error.value = true
      login_message.value = {
        variant: 'warning',
        title_text: 'Compte non vérifié',
        message_text: "Vous pouvez demander une demande de vérification toutes les 5 minutes."
      }
      setTimeout(() => {
        login_error.value = false
      }, 5000)
    }
  } else if (error.response && error.response.code === 404) {
    login_error.value = true
    login_message.value = {
      variant: 'bad',
      title_text: 'Utilisateur introuvable',
      message_text: "Ce compte n'existe pas."
    }
    setTimeout(() => {
      login_error.value = false
    }, 5000)
  } else if (error.reponse && error.response.code === 400) {
    login_error.value = true
    login_message.value = {
      variant: 'bad',
      title_text: 'Erreur',
      message_text: "Une erreur est survenue. Veuillez réessayer."
    }
    setTimeout(() => {
      login_error.value = false
    }, 5000)
  } else {
    login_error.value = true
    login_message.value = {
      variant: 'bad',
      title_text: 'Erreur',
      message_text: "Une erreur est survenue. Veuillez réessayer."
    }
    setTimeout(() => {
      login_error.value = false
    }, 5000)
  }
}

watch(lastRequestTime, () => {
  if (lastRequestTime.value) {
    const now = new Date()
    const diffInMinutes = (now.getTime() - lastRequestTime.value.getTime()) / 1000 / 60
    canRequest.value = diffInMinutes >= 5
  }
}, { immediate: true })

let step1 = ref(true)
let step2 = ref(false)
</script>

<template>
  <div class="container py-10 space-y-4 px-80">
    <section>
      <h1>Connexion</h1>
      <h3>Content de vous revoir !</h3>
    </section>
    <div class="flex flex-col gap-10">
      <div class="gray rounded-lg p-10">
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
            <ActionButton
              v-show="step1"
              class="place-self-end"
              @click="(step1 = false), (step2 = true)"
              text="Continuer"
              url="#"
            />
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
            <ActionButton class="place-self-end" text="Connexion" url="#" @click="doLogin" />
            <div
              class="flex justify-center items-center before:border-b before:border-b-gray-800 before:flex-1 after:border-b after:border-b-gray-800 after:flex-1"
            >
              <p class="mx-2">ou</p>
            </div>
            <button class="flex items-center justify-center gap-4 p-3 bg-white border rounded-lg" @click="doLoginWebauthn">
              <IconKey />Utiliser une clé de sécurité
            </button>
          </div>
        </div>
      </div>
      <div class="flex gap-10">
        <button class="p-3 inline-flex gap-3 justify-center items-center gray rounded-lg grow w-1/2" type="button" @click="doLoginOauth">
          <IconGoogle />Connexion par Google
        </button>
      <RouterLink to="/forgot-password" class="p-3 gray rounded-lg grow w-1/2 font-serif flex justify-center"
        >Mot de passe oublié ?</RouterLink
      >
      </div>
      <section class="text-center">
        <h3>Pas de compte ?</h3>
        <RouterLink class="font-serif underline" to="/register">Créer un compte</RouterLink>
      </section>
    </div>
  </div>
  <AlertWindow v-show="login_error" v-bind="login_message" />
</template>
