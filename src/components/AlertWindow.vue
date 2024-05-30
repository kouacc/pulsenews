<script setup lang="ts">
import IconWarning from './icons/IconWarning.vue';
import IconCroix from './icons/IconCroix.vue';
import IconCheck from './icons/IconCheck.vue';
import IconCircleCroix from './icons/IconCircleCroix.vue';

const props = withDefaults(
  defineProps<{
    variant: 'good' | 'bad' | 'warning'
    title_text: string
    message_text: string
  }
>(), {
  variant: 'good',
}
)

const variantClass = {
  good: 'bg-green-500',
  bad: 'bg-red-500',
  warning: 'bg-yellow-300'
}
</script>

<template>
  <div class="px-10 py-7 fixed rounded-2xl bottom-4 right-4" :class="variantClass[props.variant]">
      <section class="inline-flex items-center gap-1">
        <IconCheck class="scale-75" v-if="props.variant === 'good'" />
        <IconWarning class="scale-75" v-else-if="props.variant === 'warning'" />
        <IconCircleCroix class="scale-75" v-else-if="props.variant === 'bad'" />
        <h4 class="text-xl">{{ title_text }}</h4>
      </section>
    <p>{{ message_text }}</p>
  </div>
</template>
