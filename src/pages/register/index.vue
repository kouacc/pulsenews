<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { pb } from '@/backend'
import ActionButton from '@/components/ActionButton.vue';
import IconArrow from '@/components/icons/IconArrow.vue';
import type { UsersResponse } from '@/pocketbase-types';

const progressbar = ref(0)
const user_form = ref({} as UsersResponse)
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
          <div class="relative bottom-3.5 z-0 w-3.5 h-3.5 rounded-full bg-blue-500 transition-all" :class="{ '!w-[50.7%]': progressbar === 1, '!w-full': progressbar === 2}"></div>
        </div>
      <div v-if="progressbar === 0" class="grille col-start-2 col-span-10">
        <div class="col-span-full flex flex-col gap-2">
          <label for="">Nom</label>
          <input v-model="user_form.name" class="border-b-2 border-black" type="text" placeholder="Aa">
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label for="">Prénom</label>
          <input v-model="user_form.surname" class="border-b-2 border-black" type="text" placeholder="Aa">
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label for="">Adresse e-mail</label>
          <input v-model="user_form.email" class="border-b-2 border-black" type="email" placeholder="Aa">
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label for="">Mot de passe</label>
          <input v-model="user_form.password" class="border-b-2 border-black" type="password" placeholder="Aa">
          <p>Votre mot de passe doit contenir au moins :</p>
          <ul class="list-disc list-inside">
            <li>8 caractères minimum</li>
            <li>1 minuscule</li>
            <li>1 majuscule</li>
            <li>1 caractère spécial</li>
          </ul>
        </div>
        <div class="col-span-full flex flex-col gap-2">
          <label for="">Confirmer le mot de passe</label>
          <input v-model="user_form.passwordConfirm" class="border-b-2 border-black" type="password" placeholder="Aa">
        </div>
        <ActionButton class="col-end-13 col-span-3" text="Continuer" :icon="IconArrow" url="#" @click="progressbar = 1" />
      </div>
      <div v-if="progressbar === 1" class="grille col-start-2 col-span-10">
        <button class="col-start-1 col-span-2" @click="progressbar = 0">Retour</button>
        <div class="col-start-1 col-span-5 flex flex-col gap-2">
          <label for="">Avatar</label>
          <input type="file" @change="user_form.avatar = [...$event.target.files]">
        </div>
        <ActionButton class="col-end-13 col-span-3" text="Continuer" :icon="IconArrow" url="#" @click="progressbar = 2" />
      </div>
      <div v-if="progressbar === 2">

      </div>
  </div>
</template>
