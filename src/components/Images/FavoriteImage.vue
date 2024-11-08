<script setup lang="ts">

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
	size: {
		type: Number,
		required: false,
		default: 256,
	},
});

</script>

<template>
    <div class="relative flex aspect-square h-auto w-full flex-col items-center justify-center overflow-clip rounded-xl bg-gradient-to-br text-white shadow-lg bg-theme-8 from-theme-4 via-theme-6 to-theme-12" style="padding:15%">
        <MoooomIcon icon="heart" class="h-60 w-60" />
    </div>
</template>
