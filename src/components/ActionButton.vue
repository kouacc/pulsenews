<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'warning' | 'outlined'
    size?: 'small' | 'medium' | 'large'
    url?: string
    text?: string
    icon?: string | object | undefined
  }>(),
  {
    variant: 'default',
    size: 'small'
  }
)
const variantClass = {
  default: 'bg-blue-500 text-white',
  warning: 'bg-red-500 text-white',
  outlined: 'border-indigo-200 bg-red'
}
const sizeClass = {
  small: 'px-4 py-1.5 text-base',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-base'
}
</script>

<template>
  <RouterLink
    class="inline-flex items-center gap-2 font-serif rounded-xl transition duration-300 ease-in-out"
    :class="[variantClass[props.variant], sizeClass[props.size]]"
    :to="`${url}`"
  >
    <component
      v-if="props.icon"
      :is="props.icon"
      :class="props.variant === 'outlined' ? 'fill-black' : 'fill-white'"
      class="size-5"
    />
    {{ text }}
  </RouterLink>
</template>
