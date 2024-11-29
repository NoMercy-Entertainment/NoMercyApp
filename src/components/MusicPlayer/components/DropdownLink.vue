<script setup lang="ts">

defineProps({
    href: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: false,
        default: null
    }
});
</script>

<template>
    <RouterLink
        v-if="!href.startsWith('http')"
        :to="href"
        :target="target"
        class="block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out text-auto-12 hover:bg-theme-6 focus:bg-theme-3 focus:outline-none"
    >
        <slot />
    </RouterLink>
  <a :href="href"
      v-else
     :target="target"
     class="block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out text-auto-12 hover:bg-theme-6 focus:bg-theme-3 focus:outline-none"
  >
    <slot />
  </a>
</template>
