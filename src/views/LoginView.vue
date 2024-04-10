<script setup lang="ts">
import ActionButton from '@/components/ActionButton.vue'
</script>

<template>
  <div class="container mx-auto">
    <h1>Connexion</h1>
    <h3>Content de vour revoir !</h3>
    <div class="flex flex-col gap-10 mx-64">
      <div class="bg-slate-100 rounded-lg p-10 shadow">
        <form class="flex flex-col gap-2" action="">
          <label for="">Adresse e-mail / Nom d'utilisateur</label>
          <input class="px-3 py-3 rounded-lg shadow" type="email" />
          <label for="">Mot de passe</label>
          <input class="px-3 py-3 rounded-lg shadow" type="password" />
        </form>
        <ActionButton text="Se connecter" />
      </div>
      <div class="p-3 bg-slate-100 rounded-lg shadow">
        <p>Connexion en 1-clic</p>
      </div>
      <section class="text-center">
        <h3>Pas de compte ?</h3>
        <RouterLink to="/register">Créer un compte</RouterLink>
      </section>
    </div>
  </div>
</template>
