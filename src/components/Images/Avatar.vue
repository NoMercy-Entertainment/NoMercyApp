<script lang="ts" setup>
import { useTranslation } from 'i18next-vue';
import md5 from 'md5';
import { computed, ref } from 'vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';

defineProps({
	height: {
		type: Number,
		default: 40,
	},
	width: {
		type: Number,
		default: 40,
	},
	size: {
		type: Number,
		default: 400,
	},
	className: {
		type: String,
		default: '',
	},
	email: {
		type: String,
		required: true,
	},
	cache: {
		type: Number,
		default: 1,
	},
});

const { t } = useTranslation();

const suffix = location.hostname.includes('dev') ? '-dev' : '';
const baseUrl = computed(() => `https://cdn${suffix}.nomercy.tv`);

const error = ref(false);

function onError(e: Event) {
	console.error(e);
	(e.target as HTMLImageElement).onerror = null;
	error.value = true;
}
</script>

<template v-once>
	<div
		:class="className"
		class="relative flex aspect-square flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-hidden rounded-lg bg-black"
	>
		<div class="absolute h-full">
			<img v-if="!error"
				:alt="`${t('NoMercyAvatar for')} ${email}`"
				:height="size ?? height"
				:onerror="onError"
				:src="`${baseUrl}/avatar/${md5(
					email,
				)}?cache=${cache}&d=monsterid&fm=webp&r=pg&s=${size}&w=${size}`"
				:srcset="`${baseUrl}/avatar/${md5(
					email,
				)}?cache=${cache}&d=monsterid&fm=webp&r=pg&s=${size * 2}&w=${size * 2}`"
				:width="size ?? width"
				class="h-full object-cover NoMercyAvatar"
				crossorigin="anonymous"
			>
			<div
				v-else
				class="inset-0 grid aspect-square h-full w-full place-items-center place-center bg-black"
			>
				<AppLogoSquare class="h-auto max-h-[60%]" />
			</div>
		</div>
	</div>
</template>
