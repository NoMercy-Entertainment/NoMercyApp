<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref } from 'vue';

const props = defineProps({
	tabs: {
		type: Array as PropType<{ name: string }[]>,
		required: true,
	},
});

const activeTab = ref(props.tabs[0].name);

function setTab(value: number) {
	activeTab.value = props.tabs[value].name;
}
</script>

<template>
	<div
		class="z-0 flex shrink grow basis-0 flex-col items-start justify-start self-stretch"
	>
		<div
			class="sticky -top-1 z-10 h-14 w-full border-b border-surface-12/6 bg-surface-1"
		>
			<nav
				class="absolute left-4 inline-flex flex-col items-start justify-start gap-2 top-[15px]"
			>
				<ul class="inline-flex items-start justify-start gap-4">
					<button
						v-for="(tab, index) in tabs"
						:key="tab.name"
						:class="`px-1 pb-4 ${
							activeTab === tab.name ? 'border-b-2' : ''
						} empty:hidden transition-transform duration-100 border-focus justify-center items-center gap-2 flex cursor-pointer`"
						@click="setTab(index)"
					>
						<div
							v-if="tab?.name"
							:class="`${
								activeTab === tab.name ? 'text-focus' : ''
							} text-base font-semibold leading-normal`"
						>
							{{ $t(tab.name) }}
						</div>
					</button>
				</ul>
			</nav>

			<slot :active-tab="activeTab" name="extra" />
		</div>

		<slot :active-tab="activeTab" class="z-0" />
	</div>
</template>
