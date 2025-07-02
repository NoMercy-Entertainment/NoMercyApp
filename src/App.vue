<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<template>
	<IonApp>
		<!--		<div -->
		<!--			id="navShadow" -->
		<!--			class="fixed sm:hidden w-full pt-safe z-1199 bg-focus top-0 left-0 bg-gradient-to-r" -->
		<!--			:class="{ -->
		<!--				block: isPlatform('android'), -->
		<!--				hidden: !isPlatform('android'), -->
		<!--			}" -->
		<!--		/> -->
		<IonRouterOutlet
			animated="false"
			class="pointer-events-none children:pointer-events-auto"
		/>
	</IonApp>
</template>
