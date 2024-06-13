<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router/auto'
import { pb, createUser } from '@/backend'
import ActionButton from '@/components/ActionButton.vue';
import IconArrowRight from '@/components/icons/IconArrowRight.vue';
import AlertWindow from '@/components/AlertWindow.vue';
import type { UsersResponse } from '@/pocketbase-types';

const router = useRouter()

onMounted(async () => {
  if (pb.authStore.isValid) {
    router.replace('/')
  }
})

const progressbar = ref(0)
const user_form = ref({
  emailVisibility: true,
} as UsersResponse)
const error_show = ref(false)
const form_error = ref({})
const terms_accepted = ref(false)

const next_screen = () => {
  if (progressbar.value === 0) {
    if (user_form.value.password !== user_form.value.passwordConfirm) {
      error_show.value = true
      form_error.value = {
        title_text: 'Erreur',
        message_text: 'Les mots de passe ne correspondent pas.'
      }
      setTimeout(() => {
      error_show.value = false
    }, 5000)
    } else if (user_form.value.name && user_form.value.surname && user_form.value.email && user_form.value.password && user_form.value.passwordConfirm) {
      progressbar.value = 1
    } else {
      error_show.value = true
      form_error.value = {
        title_text: 'Erreur',
        message_text: 'Veuillez remplir tous les champs obligatoires.'
      }
      setTimeout(() => {
      error_show.value = false
    }, 5000)

    }
    } else {
      progressbar.value = 1
    }
  }

const register_user = async () => {
  if (terms_accepted.value === true) {
    try {
      const result = await createUser(user_form.value)
      if (result === true) {
        router.push(`/register/register-confirmed?email=${user_form.value.email}`)
      }
    } catch (e) {
      error_show.value = true
      form_error.value = {
        title_text: 'Erreur',
        message_text: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      }
      setTimeout(() => {
        error_show.value = false
      }, 5000)
    }
  } else if (terms_accepted.value === false) {
    error_show.value = true
    form_error.value = {
      title_text: 'Erreur',
      message_text: 'Vous devez accepter les conditions générales d\'utilisation pour continuer.'
    }
    setTimeout(() => {
      error_show.value = false
    }, 5000)
  }
}
</script>



<template>
  <div class="container grille">
    <section class="col-start-1 col-span-full">
      <h1>Inscription</h1>
      <h3 v-if="progressbar === 0">Dites-en plus sur vous !</h3>
      <h3 v-if="progressbar === 1">Complétez votre profil !</h3>
      <h3 v-if="progressbar === 2">Récap</h3>
    </section>
      <!-- progress bar-->
       <div class="w-full h-3.5 rounded-full bg-[#D9D9D9] col-start-1 col-span-full">
         <div class="flex justify-between relative z-10 rounded-full w-full px-0.5 py-0.5">
           <span class="w-2.5 h-2.5 bg-white rounded-full"></span>
           <span class="w-2.5 h-2.5 bg-white rounded-full"></span>
           <span class="w-2.5 h-2.5 bg-white rounded-full"></span>
          </div>
          <div class="relative bottom-3.5 z-0 w-3.5 h-3.5 rounded-full bg-blue-500 transition-all ease-in-out" :class="{ '!w-[50.7%]': progressbar === 1, '!w-full': progressbar === 2}"></div>
        </div>
      <div v-if="progressbar === 0" class="grille col-start-2 col-span-10">
        <div class="col-span-full flex flex-col gap-2">
          <label class="after:text-red-500 after:content-['*']" for="">Nom</label>
          <input v-model="user_form.name" class="border-b-2 border-black p-1" type="text" placeholder="Aa" required>
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label class="after:text-red-500 after:content-['*']" for="">Prénom</label>
          <input v-model="user_form.surname" class="border-b-2 border-black p-1" type="text" placeholder="Aa" required>
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label class="after:text-red-500 after:content-['*']" for="">Adresse e-mail</label>
          <input v-model="user_form.email" class="border-b-2 border-black p-1" type="email" placeholder="Aa" required>
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label class="after:text-red-500 after:content-['*']" for="">Mot de passe</label>
          <input v-model="user_form.password" class="border-b-2 border-black p-1" type="password" placeholder="Aa" minlength="8" required>
          <p>Votre mot de passe doit contenir au moins :</p>
          <ul class="list-disc list-inside">
            <li>8 caractères minimum</li>
            <li>1 minuscule</li>
            <li>1 majuscule</li>
            <li>1 caractère spécial</li>
          </ul>
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label class="after:text-red-500 after:content-['*']" for="">Confirmer le mot de passe</label>
          <input v-model="user_form.passwordConfirm" class="border-b-2 border-black p-1" type="password" minlength="8" placeholder="Aa" required>
        </div>
        <ActionButton class="col-end-13 col-span-2" text="Continuer" :icon="IconArrowRight" url="#" @click="next_screen" />
        </div>
        <div v-if="progressbar === 1" class="grille col-start-2 col-span-10">
          <button class="col-start-1 col-span-2" @click="progressbar = 0">Retour</button>
          <div class="col-start-1 col-span-6 flex flex-col gap-2">
            <label for="">Avatar</label>
            <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" @change="user_form.avatar = [...$event.target.files]">
            <p>Si vous ne remplissez pas ce champ, un avatar par défaut vous sera attribué.</p>
          </div>
          <div class="col-start-7 col-span-6 flex flex-col gap-2">
            <label for="">Biographie</label>
            <textarea v-model="user_form.biographie" rows="3" maxlength="200" class="p-2 border-2 rounded-lg" placeholder="Biographie"></textarea>
            <p>Limité à 200 caractères.</p>
          </div>
          <div class="col-start-7 col-span-6 flex flex-col gap-2">
            <label for="">Ville</label>
            <input v-model="user_form.localisation" class="p-1 border-b-2 border-black" placeholder="Paris, France">
          </div>
          <div class="grille col-start-1 col-span-full">
            <div class="col-start-1 col-span-6 flex flex-col gap-2">
              <label for="">Facebook</label>
              <input v-model="user_form.facebook" class="border-b-2 border-black p-1" placeholder="Lien Facebook" type="text">
            </div>
            <div class="col-end-13 col-span-6 flex flex-col gap-2">
              <label for="">Twitter</label>
              <input v-model="user_form.twitter" class="border-b-2 border-black p-1" placeholder="Lien Twitter" type="text">
            </div>
            <div class="col-start-1 col-span-6 flex flex-col gap-2">
              <label for="">Instagram</label>
              <input v-model="user_form.instagram" class="border-b-2 border-black p-1" placeholder="Lien Instagram" type="text">
            </div>
            <div class="col-end-13 col-span-6 flex flex-col gap-2">
              <label for="">Site web</label>
              <input v-model="user_form.siteweb" class="border-b-2 border-black p-1" placeholder="Lien de votre site web" type="text">
            </div>
          </div>
          
          
          <ActionButton class="col-end-13 col-span-2" text="Continuer" :icon="IconArrowRight" url="#" @click="progressbar = 2" />
            </div>
            <div v-if="progressbar === 2" class="grille col-start-2 col-span-10">
              <button class="col-start-1 col-span-2" @click="progressbar = 1">Retour</button>
              <h2 class="col-start-1 col-span-3">Vos informations</h2>
              <div class="col-start-1 col-span-full grille">
                <div class="col-start-1 col-span-4 flex flex-col gap-2">
                  <label for="">Nom</label>
                  <p>{{ user_form.name }}</p>
                </div>
                <div class="col-start-5 col-span-4 flex flex-col gap-2">
                  <label for="">Prénom</label>
                  <p>{{ user_form.surname }}</p>
                </div>
                <div class="col-start-9 col-span-7 flex flex-col gap-2">
                  <label for="">Adresse e-mail</label>
                  <p>{{ user_form.email }}</p>
                </div>
                <div class="col-start-1 col-span-9 flex flex-col gap-2">
                  <label for="">Biographie</label>
                  <p class="line-clamp-1" v-if="user_form.biographie">{{ user_form.biographie }}</p>
                  <p v-else>Non renseigné</p>
                </div>
                <div class="col-end-13 col-span-3 flex flex-col gap-2">
                  <label for="">Ville</label>
                  <p class="line-clamp-1" v-if="user_form.localisation">{{ user_form.localisation }}</p>
                  <p v-else>Non renseigné</p>
                </div>
                <div class="col-start-1 col-span-3 flex flex-col gap-2">
                  <label for="">Facebook</label>
                  <p class="line-clamp-1" v-if="user_form.facebook">{{ user_form.facebook }}</p>
                  <p v-else>Non renseigné</p>
                </div>
                <div class="col-start-4 col-span-3 flex flex-col gap-2">
                  <label for="">Twitter</label>
                  <p class="line-clamp-1" v-if="user_form.twitter">{{ user_form.twitter }}</p>
                  <p v-else>Non renseigné</p>
                </div>
                <div class="col-start-7 col-span-3 flex flex-col gap-2">
                  <label for="">Instagram</label>
                  <p class="line-clamp-1" v-if="user_form.instagram">{{ user_form.instagram }}</p>
                  <p v-else>Non renseigné</p>
                </div>
                <div class="col-start-10 col-span-3 flex flex-col gap-2">
                  <label for="">Site web</label>
                  <p class="line-clamp-1" v-if="user_form.siteweb">{{ user_form.siteweb }}</p>
                  <p v-else>Non renseigné</p>
                </div>
              </div>
              <div class="flex gap-3 col-start-1 col-span-full pt-10 border-t-2 border-black">
                <input class="size-5" type="checkbox" required v-model="terms_accepted">
                <label>J'accepte les conditions générales d'utilisation de Pulse Digital News.</label>
              </div>
              <ActionButton class="col-end-13 col-span-2" text="S'inscrire" :icon="IconArrowRight" url="#" @click="register_user" />
              </div>
        <AlertWindow v-show="error_show" variant="bad" v-bind="form_error"/>
  </div>
</template>
