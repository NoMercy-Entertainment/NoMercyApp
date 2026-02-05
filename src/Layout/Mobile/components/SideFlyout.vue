<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useSwipe } from '@vueuse/core';

import { darkMode } from '@/store/colorScheme';

import {
	hasMusicLibrary,
	isDashboardRoute,
	isHomeRoute,
	isLibraryRoute,
	isMusicRoute,
	isPreferencesRoute,
} from '@/store/routeState';

import { closeSidebar, sidebar } from '@/store/sidebar';
import { currentServer } from '@/store/currentServer';
import libraries from '@/store/libraries';

import ProfileMenuServerSection from '@/Layout/Desktop/components/Menus/ProfileMenuServerSection.vue';
import SideFlyoutButton from '@/Layout/Mobile/components/SideFlyoutButton.vue';

import Toggle from '@/components/Forms/Toggle.vue';

const reload = () => window.location.reload();

const shouldShowLibraryLinks = computed(() => !!currentServer.value && (libraries.value?.length ?? 0) > 0);

const target = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const containerWidth = computed(() => container.value?.offsetWidth);
const left = ref('-100%');
const opacity = ref(0);

onMounted(() => {
	if (sidebar.value === 'open') {
		left.value = '0';
		opacity.value = 1;
	}
	else {
		left.value = '-100%';
		opacity.value = 0;
	}
});

watch(sidebar, (value) => {
	if (value === 'open') {
		left.value = '0';
		opacity.value = 1;
	}
	else if (value === 'closed') {
		left.value = '-100%';
		opacity.value = 0;
	}
});

const { isSwiping, lengthX } = useSwipe(target, {
	passive: true,
	onSwipe() {
		if (containerWidth.value) {
			if (lengthX.value > 0) {
				const length = Math.abs(lengthX.value);
				left.value = `-${length}px`;
				opacity.value = 1 - length / containerWidth.value;
			}
			else {
				left.value = '0';
				opacity.value = 1;
			}
		}
	},
	onSwipeEnd() {
		if (
			lengthX.value > 0
			&& containerWidth.value
			&& Math.abs(lengthX.value) / containerWidth.value >= 0.25
		) {
			left.value = '-100%';
			opacity.value = 0;
			closeSidebar();
		}
		else {
			left.value = '0';
			opacity.value = 1;
		}
	},
});
</script>

<template>
	<aside
		ref="target"
		:class="{
			'transition-left duration-200 ease-in-out ': !isSwiping,
		}"
		:style="{ left }"
		class="flex flex-col h-available absolute top-14 z-999 w-5/6 overflow-hidden"
		style="box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.08)"
	>
		<button
			:class="{
				'transition-opacity duration-200 ease-in-out ': !isSwiping,
				'pointer-events-none': sidebar !== 'open',
			}"
			:style="{ opacity }"
			class="fixed inset-0 top-14 w-[500%] h-screen bg-black/40 -z-10"
			@click="closeSidebar"
		/>
		<div
			ref="container"
			class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-hidden bg-surface-1 h-full"
		>
			<ProfileMenuServerSection />

			<div
				v-if="currentServer"
				class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-t border-r-0 border-b border-l-0 px-3 py-2 border-surface-12/[0.08]"
			>
				<SideFlyoutButton
					href="/setup/select-servers"
					icon="serverSwitch"
					title="Switch server"
					@click="closeSidebar"
				/>
			</div>

			<div
				v-if="currentServer"
				class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-t-0 border-r-0 border-b border-l-0 px-3 py-2 border-surface-12/[0.08]"
			>
				<SideFlyoutButton
					v-if="shouldShowLibraryLinks"
					:active="isHomeRoute"
					href="/home"
					icon="home1"
					title="Home"
					@click="closeSidebar"
				/>
				<SideFlyoutButton
					v-if="shouldShowLibraryLinks && hasMusicLibrary"
					:active="isLibraryRoute"
					href="/libraries"
					icon="folder"
					title="Libraries"
					@click="closeSidebar"
				/>
				<SideFlyoutButton
					v-if="shouldShowLibraryLinks && hasMusicLibrary"
					:active="isMusicRoute"
					href="/music/start"
					icon="noteDouble"
					title="Music"
					@click="closeSidebar"
				/>
			</div>
			<div
				class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch px-3 py-2"
			>
				<SideFlyoutButton
					v-if="currentServer"
					:active="isDashboardRoute"
					href="/dashboard/system"
					icon="gridMasonry"
					title="System"
					@click="closeSidebar"
				/>
				<SideFlyoutButton
					v-if="currentServer"
					:active="isPreferencesRoute"
					href="/preferences/display"
					icon="paintSwatches"
					title="Preferences"
					@click="closeSidebar"
				/>
				<SideFlyoutButton
					:onclick="reload"
					icon="arrowRefreshHorizontal"
					title="Refresh"
					@click="closeSidebar"
				/>

				<SideFlyoutButton
					icon="moonDiagonal"
					title="Dark mode"
					@click="darkMode = !darkMode"
				>
					<label
						class="inline-flex w-min cursor-pointer items-center gap-3"
						for="ion-tg-0"
					>
						<Toggle
							id="toggleScheme"
							:model-value="darkMode"
							@update:model-value="darkMode = $event"
						/>
					</label>
				</SideFlyoutButton>

				<!--        <SideFlyoutButton -->
				<!--            @click="toggleNativeUI" -->
				<!--            title="Switch ui style" icon="switchCamera"/> -->
			</div>

			<div
				class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch px-3 py-2 mt-auto border-t border-r-0 border-b-0 border-l-0 border-surface-12/[0.08]"
			>
				<SideFlyoutButton
					icon="doorOpen"
					title="Logout"
					@click="$keycloak?.keycloak?.logout()"
				/>
			</div>
		</div>
	</aside>
</template>
