<script lang="ts" setup>
import { useContinueWatchingData } from '@/views/Base/data';

import MediaCarousel from '@/components/Carousel/MediaCarousel.vue';

const { data } = useContinueWatchingData();
</script>

<template>
	<MediaCarousel
		v-if="data?.[0]"
		:data="data"
		:index="0"
		title="Continue watching"
		suffix="/watch"
	/>
</template>
