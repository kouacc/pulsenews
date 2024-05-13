<script setup lang="ts"></script>

<template>
  <div class="container mx-auto">
    <h1>Inscription</h1>
    <h3>Rejoignez-nous !</h3>
    <div class="flex flex-col gap-10 mx-64">
      <div class="bg-gray-50 rounded-xl p-10 shadow-xl">
        <form class="flex flex-col gap-2" action="">
          <label for="">Adresse e-mail</label>
          <input class="px-3 py-3 rounded-xl shadow-xl" type="email" placeholder="Aaa" />
          <label for="">Nom d'utilisateur</label>
          <input
            class="px-3 py-3 rounded-xl shadow-xl"
            type="text"
            placeholder="Nom d'utilisateur"
          />
          <label for="">Mot de passe</label>
          <input
            class="px-3 py-3 rounded-xl shadow-xl"
            type="password"
            placeholder="Mot de passe"
          />
          <label for="">Confirmer le mot de passe</label>
          <input
            class="px-3 py-3 rounded-xl shadow-xl"
            type="password"
            placeholder="Confirmer le mot de passe"
          />
        </form>
        <ActionButton text="S'inscrire" />
      </div>
    </div>
  </div>
</template>
