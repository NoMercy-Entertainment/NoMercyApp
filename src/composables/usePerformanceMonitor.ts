import { onMounted, onUnmounted, ref } from 'vue';

interface PerformanceMetrics {
	loadTime: number;
	domContentLoaded: number;
	firstContentfulPaint: number;
	largestContentfulPaint: number;
	cumulativeLayoutShift: number;
	firstInputDelay: number;
	memoryUsage?: number;
	bundleSize?: number;
}

export function usePerformanceMonitor() {
	const metrics = ref<Partial<PerformanceMetrics>>({});
	const isLoading = ref(true);

	const measureLoadTime = () => {
		const navigation = performance.getEntriesByType(
			'navigation',
		)[0] as PerformanceNavigationTiming;
		if (navigation) {
			metrics.value.loadTime
				= navigation.loadEventEnd - navigation.navigationStart;
			metrics.value.domContentLoaded
				= navigation.domContentLoadedEventEnd - navigation.navigationStart;
		}
	};

	const measurePaintMetrics = () => {
		const paintEntries = performance.getEntriesByType('paint');
		const fcpEntry = paintEntries.find(
			entry => entry.name === 'first-contentful-paint',
		);
		if (fcpEntry) {
			metrics.value.firstContentfulPaint = fcpEntry.startTime;
		}
	};

	const measureLCP = () => {
		if ('PerformanceObserver' in window) {
			const observer = new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				const lastEntry = entries[entries.length - 1];
				metrics.value.largestContentfulPaint = lastEntry.startTime;
			});

			try {
				observer.observe({ entryTypes: ['largest-contentful-paint'] });
			}
			catch (e) {
				// LCP not supported
			}
		}
	};

	const measureCLS = () => {
		if ('PerformanceObserver' in window) {
			let clsValue = 0;
			const observer = new PerformanceObserver((entryList) => {
				for (const entry of entryList.getEntries()) {
					if (!(entry as any).hadRecentInput) {
						clsValue += (entry as any).value;
					}
				}
				metrics.value.cumulativeLayoutShift = clsValue;
			});

			try {
				observer.observe({ entryTypes: ['layout-shift'] });
			}
			catch (e) {
				// CLS not supported
			}
		}
	};

	const measureFID = () => {
		if ('PerformanceObserver' in window) {
			const observer = new PerformanceObserver((entryList) => {
				for (const entry of entryList.getEntries()) {
					metrics.value.firstInputDelay
						= entry.processingStart - entry.startTime;
				}
			});

			try {
				observer.observe({ entryTypes: ['first-input'] });
			}
			catch (e) {
				// FID not supported
			}
		}
	};

	const measureMemoryUsage = () => {
		if ('memory' in performance) {
			const memory = (performance as any).memory;
			metrics.value.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
		}
	};

	const measureBundleSize = async () => {
		try {
			// Estimate bundle size from loaded resources
			const resources = performance.getEntriesByType(
				'resource',
			) as PerformanceResourceTiming[];
			let totalSize = 0;

			for (const resource of resources) {
				if (resource.name.includes('.js') || resource.name.includes('.css')) {
					totalSize += resource.transferSize || 0;
				}
			}

			metrics.value.bundleSize = totalSize / 1024 / 1024; // MB
		}
		catch (e) {
			console.warn('Could not measure bundle size:', e);
		}
	};

	const logMetrics = () => {
		if (process.env.NODE_ENV === 'development') {
			console.group('📊 Performance Metrics');
			console.log('Load Time:', metrics.value.loadTime?.toFixed(2), 'ms');
			console.log(
				'DOM Content Loaded:',
				metrics.value.domContentLoaded?.toFixed(2),
				'ms',
			);
			console.log(
				'First Contentful Paint:',
				metrics.value.firstContentfulPaint?.toFixed(2),
				'ms',
			);
			console.log(
				'Largest Contentful Paint:',
				metrics.value.largestContentfulPaint?.toFixed(2),
				'ms',
			);
			console.log(
				'Cumulative Layout Shift:',
				metrics.value.cumulativeLayoutShift?.toFixed(4),
			);
			console.log(
				'First Input Delay:',
				metrics.value.firstInputDelay?.toFixed(2),
				'ms',
			);
			console.log('Memory Usage:', metrics.value.memoryUsage?.toFixed(2), 'MB');
			console.log('Bundle Size:', metrics.value.bundleSize?.toFixed(2), 'MB');
			console.groupEnd();
		}
	};

	const startMonitoring = () => {
		measureLoadTime();
		measurePaintMetrics();
		measureLCP();
		measureCLS();
		measureFID();
		measureMemoryUsage();
		measureBundleSize();

		// Log metrics after a delay to ensure all measurements are captured
		setTimeout(() => {
			logMetrics();
			isLoading.value = false;
		}, 3000);
	};

	const getScores = () => {
		const scores = {
			performance: 100,
			recommendations: [] as string[],
		};

		// LCP scoring (Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s)
		if (metrics.value.largestContentfulPaint) {
			if (metrics.value.largestContentfulPaint > 4000) {
				scores.performance -= 30;
				scores.recommendations.push('Improve Largest Contentful Paint (>4s)');
			}
			else if (metrics.value.largestContentfulPaint > 2500) {
				scores.performance -= 15;
				scores.recommendations.push(
					'Optimize Largest Contentful Paint (2.5-4s)',
				);
			}
		}

		// FCP scoring (Good: <1.8s, Needs Improvement: 1.8-3s, Poor: >3s)
		if (metrics.value.firstContentfulPaint) {
			if (metrics.value.firstContentfulPaint > 3000) {
				scores.performance -= 20;
				scores.recommendations.push('Improve First Contentful Paint (>3s)');
			}
			else if (metrics.value.firstContentfulPaint > 1800) {
				scores.performance -= 10;
				scores.recommendations.push('Optimize First Contentful Paint (1.8-3s)');
			}
		}

		// CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
		if (metrics.value.cumulativeLayoutShift) {
			if (metrics.value.cumulativeLayoutShift > 0.25) {
				scores.performance -= 25;
				scores.recommendations.push('Fix Cumulative Layout Shift (>0.25)');
			}
			else if (metrics.value.cumulativeLayoutShift > 0.1) {
				scores.performance -= 10;
				scores.recommendations.push(
					'Improve Cumulative Layout Shift (0.1-0.25)',
				);
			}
		}

		// FID scoring (Good: <100ms, Needs Improvement: 100-300ms, Poor: >300ms)
		if (metrics.value.firstInputDelay) {
			if (metrics.value.firstInputDelay > 300) {
				scores.performance -= 20;
				scores.recommendations.push('Improve First Input Delay (>300ms)');
			}
			else if (metrics.value.firstInputDelay > 100) {
				scores.performance -= 10;
				scores.recommendations.push('Optimize First Input Delay (100-300ms)');
			}
		}

		// Bundle size scoring
		if (metrics.value.bundleSize && metrics.value.bundleSize > 2) {
			scores.performance -= 15;
			scores.recommendations.push('Reduce bundle size (>2MB)');
		}

		return scores;
	};

	onMounted(() => {
		if (typeof window !== 'undefined') {
			if (document.readyState === 'complete') {
				startMonitoring();
			}
			else {
				window.addEventListener('load', startMonitoring);
			}
		}
	});
	onUnmounted(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('load', startMonitoring);
		}
	});

	const getWebVitals = async () => {
		return {
			lcp: metrics.value.largestContentfulPaint ?? null,
			fid: metrics.value.firstInputDelay ?? null,
			cls: metrics.value.cumulativeLayoutShift ?? null,
		};
	};

	const getLoadingMetrics = async () => {
		return {
			ttfb: performance.timing
				? performance.timing.responseStart - performance.timing.navigationStart
				: null,
			fcp: metrics.value.firstContentfulPaint ?? null,
			tti: metrics.value.loadTime ?? null,
		};
	};

	const getResourceMetrics = async () => {
		const resources = performance.getEntriesByType(
			'resource',
		) as PerformanceResourceTiming[];
		let totalSize = 0;
		const totalResources = resources.length;
		let cacheHits = 0;

		const byType: Record<
			string,
			{ count: number; size: number; loadTime: number }
		> = {};

		resources.forEach((resource) => {
			totalSize += resource.transferSize || 0;

			// Count cache hits (transferSize of 0 usually means cached)
			if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
				cacheHits++;
			}

			// Group by resource type
			const extension
				= resource.name.split('.').pop()?.toLowerCase() || 'other';
			const type = getResourceType(extension);

			if (!byType[type]) {
				byType[type] = { count: 0, size: 0, loadTime: 0 };
			}

			byType[type].count++;
			byType[type].size += resource.transferSize || 0;
			byType[type].loadTime += resource.duration;
		});

		return {
			totalResources,
			totalSize,
			cacheHitRate:
        totalResources > 0 ? Math.round((cacheHits / totalResources) * 100) : 0,
			byType,
		};
	};

	const getResourceType = (extension: string): string => {
		const types: Record<string, string> = {
			js: 'JavaScript',
			css: 'CSS',
			png: 'Images',
			jpg: 'Images',
			jpeg: 'Images',
			gif: 'Images',
			svg: 'Images',
			webp: 'Images',
			woff: 'Fonts',
			woff2: 'Fonts',
			ttf: 'Fonts',
			eot: 'Fonts',
			json: 'Data',
			xml: 'Data',
		};
		return types[extension] || 'Other';
	};

	const clearMetrics = () => {
		metrics.value = {};
		if ('PerformanceObserver' in window) {
			// Clear existing observers and restart monitoring
			startMonitoring();
		}
	};

	return {
		metrics,
		isLoading,
		getScores,
		logMetrics,
		getWebVitals,
		getLoadingMetrics,
		getResourceMetrics,
		clearMetrics,
	};
}
