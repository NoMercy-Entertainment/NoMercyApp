<script lang="ts" setup>
import type { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import { setSortOrder, setSortType, sortOrder, sortType } from '@/store/ui';
import { SortOrder, SortType } from '@/types/musicPlayer';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

defineProps({
	name: {
		type: String,
		required: true,
	},
	sortingType: {
		type: String as PropType<SortType>,
		required: true,
	},
	iconSpacer: {
		type: String,
		default: '',
	},
});

const { t } = useTranslation();

function handleSortChange(value: SortType) {
	console.log('handleSortChange', value);

	if (sortType.value === value) {
		setSortOrder(
			sortOrder.value === SortOrder.asc ? SortOrder.desc : SortOrder.asc,
		);
	}
	else {
		setSortOrder(SortOrder.asc);
	}

	setSortType(value);
}

function handleKeyup(e: KeyboardEvent) {
	const target = e.target as HTMLElement;
	if (e.key === 'ArrowUp') {
		const el = (
			(target.parentElement as HTMLElement)?.parentElement as HTMLElement
		)?.previousElementSibling as HTMLElement;
		if ((el && el.nodeName === 'BUTTON') || el.nodeName === 'A') {
			el.focus();
		}
		else {
			document.querySelector<HTMLButtonElement>('#playList')?.focus();
		}
	}
	else if (e.key === 'ArrowDown') {
		(
			((target.parentElement as HTMLElement)?.parentElement as HTMLElement)
				?.nextElementSibling as HTMLElement
		)?.focus();
	}
	else if (e.key === 'ArrowLeft') {
		(target.previousElementSibling as HTMLElement)?.focus();
	}
	else if (e.key === 'ArrowRight') {
		(target.nextElementSibling as HTMLElement)?.focus();
	}
}
</script>

<template>
	<button
		no-ring
		class="relative cursor-pointer items-center focus-visible:underline focus-visible:underline-offset-2"
		:onclick="() => handleSortChange(sortingType)"
		:onkeyup="handleKeyup"
	>
		<span class="">
			{{ t(name) }}
		</span>
		<OptimizedIcon
			v-if="
				sortOrder === SortOrder.asc
					&& sortType === sortingType
					&& sortType !== SortType.index
			"
			icon="chevronUp"
			:class="`w-6 h-6 ${iconSpacer}`"
		/>
		<OptimizedIcon
			v-else-if="
				sortOrder === SortOrder.desc
					&& sortType === sortingType
					&& sortType !== SortType.index
			"
			icon="chevronDown"
			:class="`w-6 h-6 ${iconSpacer}`"
		/>
	</button>
</template>
