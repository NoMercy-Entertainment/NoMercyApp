<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ShareOptions } from '@capacitor/share';
import { Share } from '@capacitor/share';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import { useTranslation } from 'i18next-vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	shareData: {
		type: Object as PropType<ShareOptions>,
		required: false,
	},
	fallbackText: {
		type: String,
		required: false,
		default: 'Share',
	},
});

const route = useRoute();
const { t } = useTranslation();

const isCopied = ref(false);

async function share() {
	await Share.share(
		props.shareData ?? {
			title: document.title,
			text: document.querySelector('meta[name="description"]')
				?.getAttribute('content') ?? '',
			url: `https://app.nomercy.tv${route.fullPath}`,
			dialogTitle: t('Share with buddies'),
		},
	)
		.then(() => {
			isCopied.value = true;
			setTimeout(() => {
				isCopied.value = false;
			}, 2000);
		})
		.catch((error) => {
			console.error('Share failed:', error);
			alert(props.fallbackText);
		});
}
</script>

<template>
	<MusicButton :onclick="share" label="Share">
		<MoooomIcon v-if="isCopied" class="" icon="shareSquare" />
		<MoooomIcon v-else class="" icon="shareSquare" />
	</MusicButton>
</template>

<style scoped></style>
