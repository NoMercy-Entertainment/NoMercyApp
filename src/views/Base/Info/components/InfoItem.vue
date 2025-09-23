<script lang="ts" setup>
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
			class="flex-col sm:flex-row flex grid-cols-3 text-xs font-bold whitespace-nowrap uppercase text-surface-12/70 dark:text-surface-12/80"
		>
			{{ $t(title) }}
		</p>
		<div
			class="col-span-12 sm:col-span-6 sm:col-start-3 flex w-full max-w-fit flex-wrap gap-1 self-center xl:col-start-3 2xl:col-start-2"
		>
			<div
				v-for="(item, index) in data[keyName]"
				:key="item?.id"
				:class="data[keyName]?.length > 5 && keyName === 'genres' ? 'children:grayscale' : ''"
				class="gap-1 children:whitespace-nowrap text-sm leading-[140%] text-surface-12 dark:text-surface-12/90 font-semibold"
			>
				<span v-if="(typeof item === 'string')" class="inline-block">
					{{ item }}
				</span>
				<template v-else-if="item?.id && prefix && keyName === 'genres'">
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
					class="inline-block underline-offset-4 hover:underline focus-visible:underline"
					target="_blank"
				>
					{{ item?.name }}
				</RouterLink>
				<a
					v-else
					:href="item?.link"
					class="inline-block underline-offset-4 hover:underline focus-visible:underline"
					target="_blank"
				>
					<!--					<img v-if="item?.logo" -->
					<!--						:src="`https://image.tmdb.org/t/p/w92${item?.logo}`" -->
					<!--						:alt="item?.name" -->
					<!--						class="inline h-6 w-auto rounded-sm align-middle col-span-1" -->
					<!--					> -->
					<span>{{ item?.name }}</span>
				</a>
				<span v-if="index !== data[keyName].length - 1 && keyName !== 'genres'">,</span>
			</div>
		</div>
	</div>
</template>
