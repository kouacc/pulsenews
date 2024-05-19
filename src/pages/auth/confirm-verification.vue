<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const authorizeVerification = async () => {
    try {
        await pb.collection('users').confirmVerification(Token.value);
        } catch (error) {
            console.log(error)
      }
}

onMounted(async () => {
  let pocketbase_ip = ''
  if (import.meta.env.MODE === "production")
    pocketbase_ip = "http://193.168.147.74:8090/"
  else pocketbase_ip = "http://127.0.0.1:8090/"
  pb = new Pocketbase(pocketbase_ip)
  
  Token.value = route.query.token as string
    authorizeVerification()
})

let pb = null
let Token = ref<string>('')


</script>


<template>

</template>