<script setup lang="ts">

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import DeviceName from '@/views/Preferences/Display/components/DeviceName.vue';
import DisplayLanguage from '@/views/Preferences/Display/components/DisplayLanguage.vue';
import DisplayStyles from '@/views/Preferences/Display/components/DisplayStyles.vue';
import ScreensaverSettings from '@/views/Preferences/Display/components/ScreensaverSettings.vue';
import ThemeColors from '@/views/Preferences/Display/components/ThemeColors.vue';
</script>

<template>
			<DashboardLayout
				title="Display settings"
				:grid-style="3"
				:allow-anyone="true"
			>
				<div class="flex flex-col p-4 gap-4">
					<DeviceName />
					<DisplayLanguage />
					<ScreensaverSettings />
					<ThemeColors />
					<DisplayStyles />
				</div>
			</DashboardLayout>
</template>
