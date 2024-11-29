<script setup lang="ts">

defineProps({
    title: {
        type: String,
        required: true,
    },
    background: {
        type: Boolean,
        required: false,
        default: true,
    }
});

</script>

<template>
    <div
        class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch"
    >
        <div
            class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-6 self-stretch"
        >
            <p class="flex-grow text-xl font-medium">
                {{ $t(title) }}
            </p>
            <div class="ml-auto flex gap-2">
                <slot name="cta" />
            </div>
        </div>

        <div
            class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch rounded-xl"
            :class="{
              'bg-auto-2/6 dark:bg-auto-alpha-3 p-4' : background
            }"
        >
            <slot />

        </div>
    </div>
</template>
