<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import md5 from 'md5';
import { IonAvatar } from '@ionic/vue';

import type { User } from '@/types/auth';
import type { VueKeycloakTokenParsed } from '@dsb-norge/vue-keycloak-js/dist/types';

defineProps({
	size: {
		type: Number,
		required: false,
		default: 40,
	},
	user: {
		type: Object as PropType<User | VueKeycloakTokenParsed>,
		required: false,
	},
});

const { t } = useTranslation();

const suffix = location.hostname.includes('dev') ? '-dev' : '';
const baseUrl = computed(() => `https://cdn${suffix}.nomercy.tv`);

function remove(e: ErrorEvent) {
	(e.target as HTMLImageElement)?.remove();
}
</script>

<template>
	<IonAvatar style="max-width: 100%; max-height: 100%;">
		<img
			v-if="user && !user.avatarUrl"
			:onerror="remove"
			:alt="`${t('NoMercyAvatar for')} ${user.name}`"
			class="rounded-full object-cover object-center p-px NoMercyAvatar aspect-square"
			:src="`${baseUrl}/avatar/${md5(
				user.email,
			)}?d=monsterid&fm=webp&r=pg&s=${size}&w=${size}`"
			:srcset="`${baseUrl}/avatar/${md5(
				user.email,
			)}?d=monsterid&fm=webp&r=pg&s=${size * 2}&w=${size * 2}`"
			:height="`${size}`"
			:width="`${size}`"
			crossorigin="anonymous"
		>
		<img
			v-else-if="user"
			:onerror="remove"
			:alt="`${t('NoMercyAvatar for')} ${user.name}`"
			class="rounded-full object-cover object-center p-px NoMercyAvatar aspect-square"
			:src="user.avatarUrl"
			:height="`${size}`"
			:width="`${size}`"
			crossorigin="anonymous"
		>
	</IonAvatar>
</template>

<style scoped></style>
