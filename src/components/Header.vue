<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LogoBlack from './icons/LogoBlack.vue'
</script>

<template>
  <header class="flex flex-row items-center justify-between px-6 py-5">
    <div class="flex items-center gap-4">
      <RouterLink to="/"><LogoBlack /></RouterLink>
      <nav class="flex gap-2 font-serif">
        <a href="features.html">Fonctionnalités</a>
        <a href="prices.html">Tarifs</a>
      </nav>
    </div>
    <nav class="flex gap-2 font-serif">
      <RouterLink to="/profile">Profil</RouterLink>
      <RouterLink to="/login">Connexion</RouterLink>
      <RouterLink to="/register">S'inscrire</RouterLink>
    </nav>
  </header>
</template>
