<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import IconFacebook from './icons/IconFacebook.vue'
import IconTwitter from './icons/IconTwitter.vue'
import IconInstagram from './icons/IconInstagram.vue'
import LogoBlack from './icons/LogoBlack.vue'
</script>

<template>
  <footer class="flex flex-col lg:flex-row justify-evenly mt-5 py-5 px-10 lg:px-20">
    <div class="flex flex-col gap-3">
      <LogoBlack />
      <p>© 2024 Pulse News SARL</p>
      <ul class="flex gap-5 items-center">
        <RouterLink to="#"><IconFacebook /></RouterLink>
        <RouterLink to="#"><IconTwitter /></RouterLink>
        <RouterLink to="#"><IconInstagram /></RouterLink>
      </ul>
    </div>
    <div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
      <ul class="font-serif">
        <li>
          <p><b>Pulse</b></p>
        </li>
        <li><a href="https://pulsenews.maxencelallemand.fr/equipe/">Équipe</a></li>
        <li><a href="https://pulsenews.maxencelallemand.fr/about/">À propos</a></li>
      </ul>
      <ul class="font-serif">
        <li>
          <p><b>Produit</b></p>
        </li>
        <li><a href="https://pulsenews.maxencelallemand.fr/fonctionnalites/">Fonctionnalités</a></li>
        <li><a href="https://pulsenews.maxencelallemand.fr/tarifs/">Tarifs</a></li>
      </ul>
      <ul class="font-serif">
        <li>
          <p><b>Support</b></p>
        </li>
        <li><a href="">Centre d'aide</a></li>
        <li><a href="">FAQ</a></li>
        <li><a href="https://pulsenews.maxencelallemand.fr/contact/">Contacter le support</a></li>
      </ul>
      <ul class="font-serif">
        <li>
          <p><b>Légal</b></p>
        </li>
        <li><a href="https://pulsenews.maxencelallemand.fr/cgu/">Conditions générales d'utilisation</a></li>
        <li><a href="https://pulsenews.maxencelallemand.fr/cgv/">Conditions générales de vente</a></li>
        <li><a href="https://pulsenews.maxencelallemand.fr/confidentialite/">Politique de confidentialité</a></li>
      </ul>
    </div>
  </footer>
</template>
