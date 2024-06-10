<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pb, confirmVerification } from '@/backend'
import ActionButton from '@/components/ActionButton.vue'

const route = useRoute()
const router = useRouter()
const error_trigger = ref(false)

const authorizeVerification = async () => {
  try {
    confirmVerification(Token.value)
  } catch (error) {
    console.log(error)
    error_trigger.value = true
  }
}


onMounted(async () => {
 if (pb.authStore.isValid) {
    router.replace('/')
  }

  Token.value = route.query.token as string
  if (Token.value) {
    authorizeVerification()
  } else {
    error_trigger.value = true
  }

})

let Token = ref<string>('')

</script>

<template>
  <div class="container grille h-screen -mt-10">
    <section v-if="error_trigger === false" class="place-self-center place-content-center col-span-full col-start-1">
      <h1 class="text-center">Merci !</h1>
      <p>Votre compte a été vérifié avec succès.</p>
      <p>Vous pouvez maintenant vous connecter.</p>
      <ActionButton class="w-full justify-center mt-4" size="medium" url="/login" text="Se connecter" />
    </section>
    <section v-else-if="error_trigger === true" class="place-self-center place-content-center col-span-full col-start-1">
      <h1>Une erreur est survenue</h1>
      <p>Votre compte n'a pas pu être vérifié.</p>
      <p>Veuillez réessayer plus tard.</p>
    </section>
  </div>

</template>
