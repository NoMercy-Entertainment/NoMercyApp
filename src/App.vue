<script lang="ts" setup>
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from 'primevue';

const toast = useToast();

function handleToast(data: ToastMessageOptions) {
	toast.add({
		severity: data.severity,
		summary: data.summary,
		detail: data.detail,
		life: data.life,
	});
}

onMounted(async () => {
	document.addEventListener('toast', (event) => {
		handleToast(event.detail);
	});
});
</script>

<template>
	<IonApp>
		<IonRouterOutlet animations="false" />
		<Toast class="z-1199" />
	</IonApp>
</template>
