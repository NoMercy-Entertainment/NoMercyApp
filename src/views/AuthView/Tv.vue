<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import type { Level, RenderAs } from 'qrcode.vue';
import QrcodeVue from 'qrcode.vue';

import type { DeviceResponse, TokenResponse } from '@/lib/auth/index.d';
import { keepTokenFresh, refreshToken, storeTokens } from '@/lib/auth';
import { useKeycloak } from '@/lib/auth/tv-keycloak';

import { suffix } from '@/config/config';
import router from '@/router';
import { IonContent, IonPage } from '@ionic/vue';
import servers from '@/store/servers.ts';

const url = ref(
	`https://${suffix ? `${suffix.replace('-', '')}.` : ''}nomercy.tv/tv`,
);
const qr = ref('');
const hasToken = ref(false);

const show = ref(false);
const level = ref<Level>('L');
const renderAs = ref<RenderAs>('canvas');

const deviceResponse = ref<DeviceResponse>();

onMounted(async () => {
	try {
		await refreshToken();

		keepTokenFresh();

		const { isAuthenticated } = useKeycloak();
		isAuthenticated.value = true;
	}
	catch (error) {
		axios
			.post<DeviceResponse>(
				`https://auth${suffix}.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/auth/device`,
				{
					client_id: 'nomercy-ui',
					scope: 'openid profile email',
					cancelToken: new axios.CancelToken(cancel =>
						cancel('Cancel repeated request'),
					),
				},
				{
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			)
			.then((response) => {
				deviceResponse.value = response.data;
				show.value = true;
			})
			.catch((error) => {
				console.log(error);
			});
	}
});

watch(deviceResponse, (response) => {
	if (response) {
		console.log(response);

		setTimeout(() => {
			acquireToken();
		}, response.interval * 1000);
	}
});

function acquireToken() {
	axios
		.post<TokenResponse>(
			`https://auth${suffix}.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/token`,
			{
				grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
				client_id: 'nomercy-ui',
				scope: 'openid',
				device_code: deviceResponse.value?.device_code,
			},
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
		)
		.then(async (response) => {
			storeTokens(response.data);
			keepTokenFresh();

			setTimeout(async () => {
				await router.push({ name: 'Home' });
			}, 500);
		})
		.catch(() => {
			setTimeout(() => {
				acquireToken();
			}, deviceResponse.value!.interval * 1000);
		});
}

watch(servers, (value) => {
	if (value.length === 0)
		return;

	setTimeout(async () => {
		await router.push({ name: 'Home' });
	}, 1000);
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				v-if="show && deviceResponse?.user_code && !hasToken"
				class="flex h-screen w-screen flex-nowrap items-center justify-between gap-4 overflow-hidden p-24 text-slate-12 dark:text-slate-12 bg-surface-2 dark:bg-surface-1"
			>
				<div class="flex w-2/3 flex-col gap-4 font-semibold">
					<h1 class="text-3xl">
						{{ $t("Follow these steps on your computer or mobile device") }}
					</h1>
					<div class="flex items-start gap-4">
						<span
							class="whitespace-nowrap rounded-md px-3 leading-8 bg-theme-600"
						>{{ $t("Step") }} 1</span>
						<div class="flex flex-col gap-2 text-lg">
							<p>{{ $t("Scan the QR with your phone or go to") }}:</p>
							<p class="text-2xl font-semibold whitespace-break-spaces">
								{{ url }}?code={{ deviceResponse?.user_code }}
							</p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<span
							class="whitespace-nowrap rounded-md px-3 leading-8 bg-theme-600"
						>{{ $t("Step") }} 2</span>
						<div class="flex flex-col gap-2 text-lg">
							<p>{{ $t("Sign in to NoMercy") }}.</p>
							<p>{{ $t("Your tv will be ready to watch") }}.</p>
						</div>
					</div>
				</div>

				<div class="grid w-1/3 place-items-center gap-4 p-4 font-semibold">
					<QrcodeVue
						v-if="deviceResponse?.verification_uri_complete"
						:level="level"
						:render-as="renderAs"
						:size="250"
						:value="deviceResponse?.verification_uri_complete"
						class="bg-white p-1"
					/>

					<img v-if="qr" :src="qr" alt="" class="bg-white p-1">
				</div>
			</div>
			<div v-else class="grid h-screen w-screen place-items-center">
				<div role="status">
					<span>{{ $t("Loading") }}...</span>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>
