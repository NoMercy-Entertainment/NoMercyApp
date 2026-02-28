<script lang="ts" setup>
import { currentServer } from '@/store/currentServer';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import { user } from '@/store/user';
import { RouterLink } from 'vue-router';
</script>

<template>
	<RouterLink
		class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 mb-2"
		to="/preferences/profile"
	>
		<NoMercyAvatar :size="40" :user="user" />
		<div
			class="flex flex-col justify-start items-start flex-grow relative gap-0.5"
		>
			<p
				class="flex-grow-0 flex-shrink-0 w-48 text-base font-semibold text-left "
			>
				{{ user.name }}
			</p>
			<div
				class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-0.5"
			>
				<MoooomIcon
					v-if="currentServer"
					class-name="w-4 h-4"
					icon="link"
				/>
				<MoooomIcon v-else class-name="w-4 h-4" icon="link" />
				<p
					class="flex-grow text-sm text-left text-slate-3 dark:text-slate-3"
				>
					{{ currentServer?.name ?? $t("Not connected") }}
				</p>
			</div>
		</div>
	</RouterLink>
</template>
