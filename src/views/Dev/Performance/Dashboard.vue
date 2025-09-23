<script lang="ts" setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import PerformanceDashboard from '@/components/PerformanceDashboard.vue';
import { addNotification } from '@/store/notifications';
import { pwaMessages } from '@/i18n/pwa';
import { onMounted } from 'vue';

// Development-only performance monitoring route
const isProduction = import.meta.env.PROD;

onMounted(() => {
	if (isProduction) {
		// Redirect to home in production
		window.location.href = '/';
	}
});

function handleReload() {
	window.location.reload();
}
function handleClearCache() {
	if (window.caches) {
		window.caches.keys().then((cacheNames) => {
			cacheNames.forEach((cacheName) => {
				window.caches.delete(cacheName);
			});
		});
	}
	localStorage.clear();
	sessionStorage.clear();
	location.reload();
	window.location.reload();
}
function handleSimulateFirstVisit() {
	window.open(`${window.location.origin}?no-cache=1`, '_blank');
}

function handleTestUpdateNotification() {
	const lang = localStorage.getItem('language')
		|| navigator.language.split('-')[0]
		|| 'en';
	const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

	const updateNotification = {
		id: `sw-update-test-${Date.now()}`,
		type: 'update',
		title: messages.newVersion,
		body: messages.updateNow,
		from: 'system',
		read: false,
		created_at: Date.now(),
		updated_at: Date.now(),
		notify: true,
		link: 'reload',
	};

	addNotification(updateNotification);
	console.log('Test update notification added');
}
</script>

<template v-if="!isProduction">
	<IonPage>
		<IonHeader>
			<IonToolbar>
				<IonTitle>Performance Dashboard</IonTitle>
			</IonToolbar>
		</IonHeader>

		<IonContent class="ion-padding">
			<div class="max-w-7xl mx-auto">
				<div class="mb-6">
					<h1 class="text-2xl font-bold mb-2">
						Development Performance Dashboard
					</h1>
					<p class="text-surface-10">
						Monitor app performance, bundle metrics, and optimization status in
						real-time.
					</p>
				</div>

				<PerformanceDashboard />
				<div class="mt-8 p-4 bg-surface-10 rounded-lg border border-surface-6">
					<h2 class="text-lg font-semibold mb-3">
						Quick Actions
					</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<button
							class="p-3 bg-surface-4 hover:bg-surface-5 rounded-md border border-surface-6 text-left transition-colors"
							@click="handleReload"
						>
							<div class="font-medium">
								Reload Page
							</div>
							<div class="text-sm text-surface-10">
								Test cold start performance
							</div>
						</button>

						<button
							class="p-3 bg-surface-4 hover:bg-surface-5 rounded-md border border-surface-6 text-left transition-colors"
							@click="handleClearCache"
						>
							<div class="font-medium">
								Clear Cache
							</div>
							<div class="text-sm text-surface-10">
								Reset all cached data
							</div>
						</button>

						<button
							class="p-3 bg-surface-4 hover:bg-surface-5 rounded-md border border-surface-6 text-left transition-colors"
							@click="handleSimulateFirstVisit"
						>
							<div class="font-medium">
								Test No Cache
							</div>
							<div class="text-sm text-surface-10">
								Simulate first visit
							</div>
						</button>

						<button
							class="p-3 bg-theme-5 hover:bg-theme-6 rounded-md border border-blue-400 text-left transition-colors"
							@click="handleTestUpdateNotification"
						>
							<div class="font-medium">
								Test Update Notification
							</div>
							<div class="text-sm opacity-90">
								Manually trigger update UI
							</div>
						</button>
					</div>
				</div>

				<div
					class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
				>
					<div class="flex items-start">
						<div class="flex-shrink-0">
							<svg
								class="h-5 w-5 text-yellow-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									clip-rule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									fill-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<h3
								class="text-sm font-medium text-yellow-800 dark:text-yellow-200"
							>
								Development Only
							</h3>
							<div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
								<p>
									This dashboard is only available in development mode. It will
									not be accessible in production builds.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>

<style scoped>
.grid {
	display: grid;
}

.grid-cols-1 {
	grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
	.sm\:grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.lg\:grid-cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
</style>
