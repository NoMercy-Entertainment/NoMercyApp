<script setup lang="ts">
import { onMounted } from 'vue';
import GenrePill from '@/components/Buttons/GenrePill.vue';

defineProps({
	data: {
		type: Object,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	prefix: {
		type: String,
		required: false,
	},
	keyName: {
		type: String,
		required: true,
	},
});

onMounted(() => {
	setTimeout(() => {
		document.dispatchEvent(new Event('sidebar'));
		// setDisableScreensaver(false);
	}, 0);
});
</script>

<template>
	<div
		v-if="data && data[keyName]"
		class="relative grid w-full flex-shrink-0 flex-grow-0 grid-cols-7 items-start justify-start gap-1"
	>
		<p
			class="flex-col sm:flex-row flex grid-cols-3 text-xs font-bold whitespace-nowrap uppercase text-slate-lightA-12/70 dark:text-slate-darkA-12/80"
		>
			{{ $t(title) }}
		</p>
		<div
			class="col-span-12 sm:col-span-6 sm:col-start-3 flex w-full max-w-fit flex-wrap gap-1 self-center xl:col-start-3 2xl:col-start-2"
		>
			<div
				v-for="(item, index) in data[keyName]"
				:key="item?.id"
				:class="data[keyName]?.length > 5 ? 'children:grayscale' : ''"
				class="gap-1 children:whitespace-nowrap text-sm leading-[140%] text-slate-lightA-12/70 dark:text-slate-darkA-12/80"
			>
				<template v-if="item?.id && prefix && keyName === 'genres'">
					<GenrePill :genre="item" />
				</template>
				<RouterLink
					v-else-if="item?.id && prefix"
					:to="`${prefix}/${item?.id}`"
					class="inline-block underline-offset-4 hover:underline focus-visible:underline"
				>
					{{ item?.name }}
				</RouterLink>
				<RouterLink
					v-else-if="item?.url"
					:to="item?.url"
					target="_blank"
					class="inline-block underline-offset-4 hover:underline focus-visible:underline"
				>
					{{ item?.name }}
				</RouterLink>
				<span v-else class="inline-block">
					{{ item?.name || item }}
				</span>
				<span v-if="index !== data[keyName].length - 1 && keyName !== 'genres'">,</span>
			</div>
		</div>
	</div>
</template>
