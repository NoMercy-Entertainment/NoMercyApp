<script lang="ts" setup>
import { computed } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import router from '@/router';

const props = defineProps({
	status: {
		type: Number,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

const title = computed(() => {
	return {
		503: 'Service Unavailable',
		500: 'Server Error',
		404: 'Page Not Found',
		403: 'Forbidden',
	}[props.status];
});

const description = computed(() => {
	return {
		503: 'Sorry, we are doing some maintenance.\n Please check back soon.',
		500: 'Whoops, something went wrong on our servers.',
		404: 'Sorry, we were unable to find that page.',
		403: 'Sorry, you are forbidden from accessing this page.',
	}[props.status];
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div class="grid h-full w-full place-items-center">
				<div
					class="relative flex flex-col items-center justify-start gap-8 overflow-hidden"
				>
					<div class="relative flex w-full flex-col gap-4">
						<p
							class="text-7xl font-bold text-center text-slate-11 dark:text-slate-11"
						>
							{{ title }}
						</p>
						<p
							class="left-0 text-2xl text-center text-slate-11 dark:text-slate-11 whitespace-pre-line"
						>
							{{ description }}
						</p>
					</div>
					<div class="h-6 w-full flex-shrink-0 flex-grow-0">
						<div class="h-6 w-full">
							<button
								class="absolute w-full text-base text-center text-slate-11 dark:text-slate-11 underline underline-offset-4"
								@click="router.back()"
							>
								{{ $t("Send me back") }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>
