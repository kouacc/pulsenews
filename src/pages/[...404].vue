<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="container h-screen flex flex-col justify-center items-center gap-5">
        <h1>404</h1>
        <p>Page introuvable</p>
        <RouterLink to="/">Retour à l'accueil</RouterLink>
    </div>
</template>