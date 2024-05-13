<script setup lang="ts">
import Croix from './icons/IconCroix.vue'
import Warning from './icons/IconWarning.vue'

if (navigator.onLine) {
            document.getElementById('offline__message').style.display = 'none';
        } else {
            document.getElementById('offline__message').style.display = 'flex';
        }

        // Écoutez les changements d'état de la connexion
        window.addEventListener('online', function (e) {
           document.getElementById('offline__message').style.display = 'none';
        });

        window.addEventListener('offline', function (e) {
            document.getElementById('offline__message').style.display = 'flex';
        });
        
        function closeWindow() {
            document.getElementById('offline__message').style.display = 'none';
        }

</script>

<template>
  <div
    id="offline__message"
    class="flex flex-col z-10 fixed bg-slate-100 p-7 rounded-xl gap-3 w-96 shadow"
  >
    <div class="flex justify-between">
      <section class="flex items-end gap-3">
        <Warning />
        <h6 class="underline text-2xl">Vous êtes hors ligne</h6>
      </section>
      <button @click="closeWindow()" aria-label="Fermer la fenêtre"><Croix /></button>
    </div>
    <p>Pour continuer à utiliser Pulse, reconnectez-vous à Internet.</p>
  </div>
</template>
