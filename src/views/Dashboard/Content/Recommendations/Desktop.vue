<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { libraryIconName } from '@/lib/utils';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import NMComponent from '@/components/NMComponent.vue';

const route = useRoute();

const tabs = [
	{ name: 'Anime', path: '/dashboard/recommendations/anime', type: 'anime' },
	{ name: 'Movies', path: '/dashboard/recommendations/movies', type: 'movie' },
	{ name: 'TV', path: '/dashboard/recommendations/tv', type: 'tv' },
];
</script>

<template>
	<DashboardLayout
		:grid-style="4"
		description="Manage your recommendations and their content here."
		title="Recommendations"
	>
		<template #pre-cta>
			<nav class="flex items-center gap-2">
				<RouterLink
					v-for="tab in tabs"
					:key="tab.name"
					:class="route.path === tab.path
						? 'bg-focus/11 border-focus/4'
						: 'border-transparent hover:bg-focus/10 hover:border-focus/4'"
					:to="tab.path"
					class="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors duration-200"
				>
					<MoooomIcon :icon="libraryIconName(tab.type) ?? 'sparkles'" class-name="w-5" />
					<span>{{ $t(tab.name) }}</span>
				</RouterLink>
			</nav>
		</template>

		<NMComponent :path="route.path" />
	</DashboardLayout>
</template>
