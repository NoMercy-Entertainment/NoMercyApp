<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

interface Props {
	items?: any[] | null;
	itemHeight: number;
	containerHeight: number;
	buffer?: number;
	keyField?: string;
}

const props = withDefaults(defineProps<Props>(), {
	buffer: 5,
	keyField: 'id',
});

const container = ref<HTMLElement>();
const content = ref<HTMLElement>();
const scrollTop = ref(0);

const safeItems = computed(() => props.items || []);
const totalHeight = computed(() => safeItems.value.length * props.itemHeight);
const visibleCount = computed(
	() => Math.ceil(props.containerHeight / props.itemHeight) + props.buffer * 2,
);
const startIndex = computed(() =>
	Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer),
);
const endIndex = computed(() =>
	Math.min(safeItems.value.length, startIndex.value + visibleCount.value),
);
const visibleItems = computed(() =>
	safeItems.value.slice(startIndex.value, endIndex.value),
);
const offsetY = computed(() => startIndex.value * props.itemHeight);

function getItemKey(item: any, index: number) {
	return item[props.keyField] || index;
}

function handleScroll() {
	if (container.value) {
		scrollTop.value = container.value.scrollTop;
	}
}

// Reset scroll position when items change significantly
watch(
	() => safeItems.value.length,
	() => {
		if (container.value) {
			container.value.scrollTop = 0;
			scrollTop.value = 0;
		}
	},
);

onMounted(() => {
	if (container.value) {
		scrollTop.value = container.value.scrollTop;
	}
});
</script>

<template>
	<div
		ref="container"
		class="virtual-scroller"
		:style="{ height: `${containerHeight}px`, overflow: 'auto' }"
		@scroll="handleScroll"
	>
		<div
			class="virtual-scroller-spacer"
			:style="{ height: `${totalHeight}px`, paddingTop: `${offsetY}px` }"
		>
			<div ref="content" class="virtual-scroller-content">
				<slot
					v-for="(item, index) in visibleItems"
					:key="getItemKey(item, startIndex + index)"
					:item="item"
					:index="startIndex + index"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.virtual-scroller {
	position: relative;
}

.virtual-scroller-spacer {
	position: relative;
	width: 100%;
}

.virtual-scroller-content {
	position: relative;
	width: 100%;
}
</style>
