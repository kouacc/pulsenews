<script setup lang="ts">
import Pocketbase from 'pocketbase'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { pb } from '@/backend'

const route = useRoute()

const authorizeVerification = async () => {
  try {
    await pb.collection('users').confirmVerification(Token.value)
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  Token.value = route.query.token as string
  authorizeVerification()
})

let Token = ref<string>('')
</script>

<template></template>
