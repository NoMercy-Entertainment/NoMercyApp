<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { usePerformanceMonitor } from '@/composables/usePerformanceMonitor';

const performanceMonitor = usePerformanceMonitor();

// Reactive data
const isRefreshing = ref(false);
const memoryChart = ref<HTMLCanvasElement>();
const timelineChart = ref<HTMLCanvasElement>();
const currentFPS = ref(60);
const frameTime = ref(16.67);
const activeRequests = ref(0);

// Performance metrics
const webVitals = ref({
	lcp: null as number | null,
	fid: null as number | null,
	cls: null as number | null,
});

const loadingMetrics = ref({
	ttfb: null as number | null,
	fcp: null as number | null,
	tti: null as number | null,
});

const resourceMetrics = ref({
	totalResources: 0,
	totalSize: 0,
	cacheHitRate: 0,
	byType: {} as Record<
		string,
		{ count: number; size: number; loadTime: number }
	>,
});

const memoryMetrics = ref({
	usedJSHeapSize: 0,
	totalJSHeapSize: 0,
	jsHeapSizeLimit: 0,
});

const recommendations = ref<
	Array<{
		title: string;
		description: string;
		impact: string;
		priority: 'high' | 'medium' | 'low';
	}>
>([]);

// Computed properties
const memoryUsagePercentage = computed(() => {
	if (memoryMetrics.value.jsHeapSizeLimit === 0)
		return 0;
	return Math.round(
		(memoryMetrics.value.usedJSHeapSize / memoryMetrics.value.jsHeapSizeLimit)
		* 100,
	);
});

// Methods
function formatTime(time: number | null) {
	if (time === null || time === undefined)
		return 'N/A';
	if (time < 1000)
		return `${Math.round(time)}ms`;
	return `${(time / 1000).toFixed(2)}s`;
}

function formatBytes(bytes: number) {
	if (bytes === 0)
		return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}

function getMetricStatus(value: number | null, goodThreshold: number, needsImprovementThreshold: number) {
	if (value === null)
		return 'unknown';
	if (value <= goodThreshold)
		return 'good';
	if (value <= needsImprovementThreshold)
		return 'needs-improvement';
	return 'poor';
}

function getFPSStatus(fps: number) {
	if (fps >= 55)
		return 'good';
	if (fps >= 30)
		return 'needs-improvement';
	return 'poor';
}

async function refreshMetrics() {
	isRefreshing.value = true;

	try {
		// Collect Web Vitals
		webVitals.value = await performanceMonitor.getWebVitals();

		// Collect loading metrics
		loadingMetrics.value = await performanceMonitor.getLoadingMetrics();

		// Collect resource metrics
		resourceMetrics.value = await performanceMonitor.getResourceMetrics();

		// Collect memory metrics
		if ('memory' in performance) {
			const memory = (performance as any).memory;
			memoryMetrics.value = {
				usedJSHeapSize: memory.usedJSHeapSize,
				totalJSHeapSize: memory.totalJSHeapSize,
				jsHeapSizeLimit: memory.jsHeapSizeLimit,
			};
		}

		// Generate recommendations
		generateRecommendations();

		// Update charts
		updateMemoryChart();
		updateTimelineChart();
	}
	catch (error) {
		console.error('Failed to refresh metrics:', error);
	}
	finally {
		isRefreshing.value = false;
	}
}

function clearMetrics() {
	performanceMonitor.clearMetrics();
	refreshMetrics();
}

function generateRecommendations() {
	const newRecommendations = [];

	// LCP recommendations
	if (webVitals.value.lcp && webVitals.value.lcp > 2500) {
		newRecommendations.push({
			title: 'Improve Largest Contentful Paint',
			description:
        'Optimize images, reduce server response times, and eliminate render-blocking resources',
			impact: 'High',
			priority: 'high' as const,
		});
	}

	// Memory recommendations
	if (memoryUsagePercentage.value > 80) {
		newRecommendations.push({
			title: 'Reduce Memory Usage',
			description:
        'Consider implementing virtual scrolling and cleaning up unused resources',
			impact: 'Medium',
			priority: 'medium' as const,
		});
	}

	// Resource size recommendations
	if (resourceMetrics.value.totalSize > 5 * 1024 * 1024) {
		// 5MB
		newRecommendations.push({
			title: 'Reduce Bundle Size',
			description: 'Implement code splitting and remove unused dependencies',
			impact: 'High',
			priority: 'high' as const,
		});
	}

	// Cache hit rate recommendations
	if (resourceMetrics.value.cacheHitRate < 70) {
		newRecommendations.push({
			title: 'Improve Cache Strategy',
			description:
        'Optimize service worker caching and implement better cache headers',
			impact: 'Medium',
			priority: 'medium' as const,
		});
	}

	recommendations.value = newRecommendations;
}

function updateMemoryChart() {
	if (!memoryChart.value)
		return;

	const ctx = memoryChart.value.getContext('2d');
	if (!ctx)
		return;

	const width = memoryChart.value.width;
	const height = memoryChart.value.height;

	// Clear canvas
	ctx.clearRect(0, 0, width, height);

	// Draw memory usage visualization
	const usedPercentage = memoryUsagePercentage.value / 100;
	const usedWidth = width * usedPercentage;

	// Background
	ctx.fillStyle = '#e5e7eb';
	ctx.fillRect(0, 0, width, height);

	// Used memory
	ctx.fillStyle
		= usedPercentage > 0.8
			? '#ef4444'
			: usedPercentage > 0.6
				? '#f59e0b'
				: '#10b981';
	ctx.fillRect(0, 0, usedWidth, height);

	// Border
	ctx.strokeStyle = '#374151';
	ctx.lineWidth = 2;
	ctx.strokeRect(0, 0, width, height);

	// Text
	ctx.fillStyle = '#374151';
	ctx.font = '14px Arial';
	ctx.textAlign = 'center';
	ctx.fillText(`${memoryUsagePercentage.value}%`, width / 2, height / 2 + 5);
}

function updateTimelineChart() {
	if (!timelineChart.value)
		return;

	const ctx = timelineChart.value.getContext('2d');
	if (!ctx)
		return;

	const width = timelineChart.value.width;
	const height = timelineChart.value.height;

	// Clear canvas
	ctx.clearRect(0, 0, width, height);

	// Draw performance timeline
	const metrics = [
		{ name: 'TTFB', value: loadingMetrics.value.ttfb, color: '#3b82f6' },
		{ name: 'FCP', value: loadingMetrics.value.fcp, color: '#10b981' },
		{ name: 'LCP', value: webVitals.value.lcp, color: '#f59e0b' },
		{ name: 'TTI', value: loadingMetrics.value.tti, color: '#8b5cf6' },
	];

	const maxValue = Math.max(...metrics.map(m => m.value || 0));
	const barWidth = width / metrics.length;

	metrics.forEach((metric, index) => {
		if (metric.value) {
			const barHeight = (metric.value / maxValue) * (height - 40);
			const x = index * barWidth + barWidth * 0.1;
			const y = height - barHeight - 20;

			ctx.fillStyle = metric.color;
			ctx.fillRect(x, y, barWidth * 0.8, barHeight);
			// Labels - use theme-aware colors
			const isDarkMode
				= document.documentElement.classList.contains('scheme-dark');
			ctx.fillStyle = isDarkMode ? '#a1a1aa' : '#374151'; // slate-400 for dark, gray-700 for light
			ctx.font = '12px Arial';
			ctx.textAlign = 'center';
			ctx.fillText(metric.name, x + barWidth * 0.4, height - 5);
			ctx.fillText(formatTime(metric.value), x + barWidth * 0.4, y - 5);
		}
	});
}

// FPS monitoring
let fpsStartTime = performance.now();
let fpsFrameCount = 0;

function measureFPS() {
	fpsFrameCount++;
	const currentTime = performance.now();
	const elapsed = currentTime - fpsStartTime;

	if (elapsed >= 1000) {
		currentFPS.value = Math.round((fpsFrameCount * 1000) / elapsed);
		frameTime.value = Math.round((elapsed / fpsFrameCount) * 100) / 100;
		fpsFrameCount = 0;
		fpsStartTime = currentTime;
	}

	requestAnimationFrame(measureFPS);
}

// Lifecycle
onMounted(() => {
	refreshMetrics();
	measureFPS();

	// Refresh metrics every 10 seconds
	const interval = setInterval(refreshMetrics, 10000);

	onUnmounted(() => {
		clearInterval(interval);
	});
});
</script>

<template>
	<div class="performance-dashboard">
		<div class="dashboard-header">
			<h2>Performance Dashboard</h2>
			<div class="header-controls">
				<button
					:disabled="isRefreshing"
					class="refresh-btn"
					@click="refreshMetrics"
				>
					{{ isRefreshing ? "Refreshing..." : "Refresh" }}
				</button>
				<button class="clear-btn" @click="clearMetrics">
					Clear Data
				</button>
			</div>
		</div>

		<!-- Core Web Vitals -->
		<div class="metric-section">
			<h3>Core Web Vitals</h3>
			<div class="metric-grid">
				<div
					class="metric-card"
					:class="getMetricStatus(webVitals.lcp, 2500, 4000)"
				>
					<div class="metric-title">
						Largest Contentful Paint
					</div>
					<div class="metric-value">
						{{ formatTime(webVitals.lcp) }}
					</div>
					<div class="metric-description">
						Good: &lt;2.5s, Needs Improvement: 2.5s-4s
					</div>
				</div>

				<div
					class="metric-card"
					:class="getMetricStatus(webVitals.fid, 100, 300)"
				>
					<div class="metric-title">
						First Input Delay
					</div>
					<div class="metric-value">
						{{ formatTime(webVitals.fid) }}
					</div>
					<div class="metric-description">
						Good: &lt;100ms, Needs Improvement: 100ms-300ms
					</div>
				</div>

				<div
					class="metric-card"
					:class="getMetricStatus(webVitals.cls, 0.1, 0.25)"
				>
					<div class="metric-title">
						Cumulative Layout Shift
					</div>
					<div class="metric-value">
						{{ webVitals.cls?.toFixed(3) || "N/A" }}
					</div>
					<div class="metric-description">
						Good: &lt;0.1, Needs Improvement: 0.1-0.25
					</div>
				</div>
			</div>
		</div>

		<!-- Loading Performance -->
		<div class="metric-section">
			<h3>Loading Performance</h3>
			<div class="metric-grid">
				<div class="metric-card">
					<div class="metric-title">
						Time to First Byte
					</div>
					<div class="metric-value">
						{{ formatTime(loadingMetrics.ttfb) }}
					</div>
					<div class="metric-description">
						Server response time
					</div>
				</div>

				<div class="metric-card">
					<div class="metric-title">
						First Contentful Paint
					</div>
					<div class="metric-value">
						{{ formatTime(loadingMetrics.fcp) }}
					</div>
					<div class="metric-description">
						First content rendered
					</div>
				</div>

				<div class="metric-card">
					<div class="metric-title">
						Time to Interactive
					</div>
					<div class="metric-value">
						{{ formatTime(loadingMetrics.tti) }}
					</div>
					<div class="metric-description">
						Page becomes interactive
					</div>
				</div>
			</div>
		</div>

		<!-- Resource Performance -->
		<div class="metric-section">
			<h3>Resource Performance</h3>
			<div class="resource-metrics">
				<div class="resource-summary">
					<div class="summary-item">
						<span class="label">Total Resources:</span>
						<span class="value">{{ resourceMetrics.totalResources }}</span>
					</div>
					<div class="summary-item">
						<span class="label">Total Size:</span>
						<span class="value">{{
							formatBytes(resourceMetrics.totalSize)
						}}</span>
					</div>
					<div class="summary-item">
						<span class="label">Cache Hit Rate:</span>
						<span class="value">{{ resourceMetrics.cacheHitRate }}%</span>
					</div>
				</div>

				<div class="resource-breakdown">
					<h4>Resource Breakdown</h4>
					<div class="breakdown-grid">
						<div
							v-for="(resource, type) in resourceMetrics.byType"
							:key="type"
							class="breakdown-item"
						>
							<div class="resource-type">
								{{ type }}
							</div>
							<div class="resource-count">
								{{ resource.count }} files
							</div>
							<div class="resource-size">
								{{ formatBytes(resource.size) }}
							</div>
							<div class="resource-time">
								{{ formatTime(resource.loadTime) }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Memory Usage -->
		<div class="metric-section">
			<h3>Memory Usage</h3>
			<div class="memory-metrics">
				<div class="memory-chart">
					<canvas ref="memoryChart" width="400" height="200" />
				</div>
				<div class="memory-stats">
					<div class="stat-item">
						<span class="label">Used JS Heap:</span>
						<span class="value">{{
							formatBytes(memoryMetrics.usedJSHeapSize)
						}}</span>
					</div>
					<div class="stat-item">
						<span class="label">Total JS Heap:</span>
						<span class="value">{{
							formatBytes(memoryMetrics.totalJSHeapSize)
						}}</span>
					</div>
					<div class="stat-item">
						<span class="label">Heap Limit:</span>
						<span class="value">{{
							formatBytes(memoryMetrics.jsHeapSizeLimit)
						}}</span>
					</div>
					<div class="stat-item">
						<span class="label">Memory Usage:</span>
						<span class="value">{{ memoryUsagePercentage }}%</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Performance Timeline -->
		<div class="metric-section">
			<h3>Performance Timeline</h3>
			<div class="timeline-container">
				<canvas ref="timelineChart" width="800" height="300" />
			</div>
		</div>

		<!-- Recommendations -->
		<div v-if="recommendations.length > 0" class="metric-section">
			<h3>Performance Recommendations</h3>
			<div class="recommendations">
				<div
					v-for="(recommendation, index) in recommendations"
					:key="index"
					class="recommendation-item"
					:class="recommendation.priority"
				>
					<div class="recommendation-title">
						{{ recommendation.title }}
					</div>
					<div class="recommendation-description">
						{{ recommendation.description }}
					</div>
					<div class="recommendation-impact">
						Impact: {{ recommendation.impact }}
					</div>
				</div>
			</div>
		</div>

		<!-- Real-time Performance -->
		<div class="metric-section">
			<h3>Real-time Performance</h3>
			<div class="realtime-metrics">
				<div class="realtime-item">
					<span class="label">FPS:</span>
					<span class="value" :class="getFPSStatus(currentFPS)">{{
						currentFPS
					}}</span>
				</div>
				<div class="realtime-item">
					<span class="label">Frame Time:</span>
					<span class="value">{{ formatTime(frameTime) }}</span>
				</div>
				<div class="realtime-item">
					<span class="label">Active Requests:</span>
					<span class="value">{{ activeRequests }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.performance-dashboard {
	padding: 1rem;
	max-width: 1200px;
	margin: 0 auto;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.dashboard-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	@apply border-b-2 border-slate-lightA-6 dark:border-slate-darkA-6;
}

.dashboard-header h2 {
	margin: 0;
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.header-controls {
	display: flex;
	gap: 0.5rem;
}

.refresh-btn,
.clear-btn {
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: background-color 0.2s;
	@apply border border-slate-lightA-7 dark:border-slate-darkA-7 bg-slate-lightA-1 dark:bg-slate-darkA-1 text-slate-lightA-12 dark:text-slate-darkA-12;
}

.refresh-btn:hover,
.clear-btn:hover {
	@apply bg-slate-lightA-3 dark:bg-slate-darkA-3;
}

.refresh-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.clear-btn {
	@apply bg-red-lightA-2 dark:bg-red-darkA-2 text-red-lightA-11 dark:text-red-darkA-11 border-red-lightA-7 dark:border-red-darkA-7;
}

.metric-section {
	margin-bottom: 2rem;
}

.metric-section h3 {
	margin: 0 0 1rem 0;
	font-size: 1.25rem;
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.metric-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
}

.metric-card {
	padding: 1rem;
	border-radius: 0.5rem;
	@apply border-2 border-slate-lightA-6 dark:border-slate-darkA-6 bg-slate-lightA-1 dark:bg-slate-darkA-1;
}

.metric-card.good {
	@apply border-green-lightA-8 dark:border-green-darkA-8 bg-green-lightA-2 dark:bg-green-darkA-2;
}

.metric-card.needs-improvement {
	@apply border-amber-lightA-8 dark:border-amber-darkA-8 bg-amber-lightA-2 dark:bg-amber-darkA-2;
}

.metric-card.poor {
	@apply border-red-lightA-8 dark:border-red-darkA-8 bg-red-lightA-2 dark:bg-red-darkA-2;
}

.metric-title {
	font-weight: 600;
	margin-bottom: 0.5rem;
	@apply text-slate-lightA-11 dark:text-slate-darkA-11;
}

.metric-value {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 0.25rem;
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.metric-description {
	font-size: 0.875rem;
	@apply text-slate-lightA-10 dark:text-slate-darkA-10;
}

.resource-metrics {
	display: grid;
	grid-template-columns: 1fr 2fr;
	gap: 2rem;
}

.resource-summary {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.summary-item {
	display: flex;
	justify-content: space-between;
	padding: 0.5rem;
	border-radius: 0.25rem;
	@apply bg-slate-lightA-2 dark:bg-slate-darkA-2;
}

.breakdown-grid {
	display: grid;
	grid-template-columns: 2fr 1fr 1fr 1fr;
	gap: 0.5rem;
	font-size: 0.875rem;
}

.breakdown-item {
	display: contents;
}

.breakdown-item > div {
	padding: 0.25rem;
	border-radius: 0.25rem;
	@apply bg-slate-lightA-2 dark:bg-slate-darkA-2;
}

.memory-metrics {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
}

.memory-stats {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.stat-item {
	display: flex;
	justify-content: space-between;
	padding: 0.5rem;
	border-radius: 0.25rem;
	@apply bg-slate-lightA-2 dark:bg-slate-darkA-2;
}

.timeline-container {
	border-radius: 0.5rem;
	padding: 1rem;
	@apply bg-slate-lightA-1 dark:bg-slate-darkA-1 border border-slate-lightA-6 dark:border-slate-darkA-6;
}

.recommendations {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.recommendation-item {
	padding: 1rem;
	border-radius: 0.5rem;
	border-left: 4px solid;
}

.recommendation-item.high {
	@apply bg-red-lightA-2 dark:bg-red-darkA-2 border-red-lightA-8 dark:border-red-darkA-8;
}

.recommendation-item.medium {
	@apply bg-amber-lightA-2 dark:bg-amber-darkA-2 border-amber-lightA-8 dark:border-amber-darkA-8;
}

.recommendation-item.low {
	@apply bg-green-lightA-2 dark:bg-green-darkA-2 border-green-lightA-8 dark:border-green-darkA-8;
}

.recommendation-title {
	font-weight: 600;
	margin-bottom: 0.5rem;
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.recommendation-description {
	margin-bottom: 0.25rem;
	@apply text-slate-lightA-10 dark:text-slate-darkA-10;
}

.label {
	@apply text-slate-lightA-11 dark:text-slate-darkA-11;
}

.value {
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.resource-type,
.resource-count,
.resource-size,
.resource-time {
	@apply text-slate-lightA-11 dark:text-slate-darkA-11;
}

h4 {
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.recommendation-impact {
	font-size: 0.875rem;
	font-weight: 500;
}

.realtime-metrics {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
}

.realtime-item {
	display: flex;
	justify-content: space-between;
	padding: 1rem;
	border-radius: 0.5rem;
	@apply bg-slate-lightA-1 dark:bg-slate-darkA-1 border border-slate-lightA-6 dark:border-slate-darkA-6;
}

.label {
	font-weight: 500;
	@apply text-slate-lightA-11 dark:text-slate-darkA-11;
}

.value {
	font-weight: 600;
	@apply text-slate-lightA-12 dark:text-slate-darkA-12;
}

.value.good {
	@apply text-green-lightA-11 dark:text-green-darkA-11;
}

.value.needs-improvement {
	@apply text-amber-lightA-11 dark:text-amber-darkA-11;
}

.value.poor {
	@apply text-red-lightA-11 dark:text-red-darkA-11;
}

@media (max-width: 768px) {
	.resource-metrics,
	.memory-metrics {
		grid-template-columns: 1fr;
	}

	.breakdown-grid {
		grid-template-columns: 1fr;
	}

	.realtime-metrics {
		grid-template-columns: 1fr;
	}
}
</style>
