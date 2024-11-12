<script setup lang="ts">

defineProps({
    isActive: {
        type: Boolean,
        default: false,
        required: true,
    }
});

</script>

<template>
    <div class="contents" v-show='isActive'>
        <slot />
    </div>
</template>
