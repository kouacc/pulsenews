<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import LogoBlack from './icons/LogoBlack.vue'
</script>

<template>
  <footer class="flex justify-between mt-5 py-5 px-20">
    <div class="flex flex-col gap-3">
      <LogoBlack />
      <p>© 2024 Pulse News SARL</p>
      <ul class="flex gap-5 text-3xl">
        <li><i class="fa-brands fa-facebook"></i></li>
        <li><i class="fa-brands fa-twitter"></i></li>
        <li><i class="fa-brands fa-instagram"></i></li>
      </ul>
    </div>
    <ul class="font-serif">
      <li>
        <p><b>Pulse</b></p>
      </li>
      <li><a href="team.html">Équipe</a></li>
      <li><a href="about.html">À propos</a></li>
    </ul>
    <ul class="font-serif">
      <li>
        <p><b>Produit</b></p>
      </li>
      <li><a href="features.html">Fonctionnalités</a></li>
      <li><a href="prices.html">Tarifs</a></li>
    </ul>
    <ul class="font-serif">
      <li>
        <p><b>Support</b></p>
      </li>
      <li><a href="">Centre d'aide</a></li>
      <li><a href="">FAQ</a></li>
      <li><a href="">Contacter le support</a></li>
    </ul>
    <ul class="font-serif">
      <li>
        <p><b>Légal</b></p>
      </li>
      <li><a href="">Conditions générales d'utilisation</a></li>
      <li><a href="">Conditions générales de vente</a></li>
      <li><a href="">Politique de confidentialité</a></li>
    </ul>
  </footer>
</template>
