class PreloadService {
	private preloadedResources = new Set<string>();

	// Use proper dynamic import functions instead of string paths
	private criticalComponentLoaders = [
		() => import('@/Layout/Desktop/BaseLayout.vue'),
		() => import('@/Layout/Mobile/BaseLayout.vue'),
		() => import('@/Layout/Tv/BaseLayout.vue'),
		() => import('@/views/Base/Home/Desktop.vue'),
		() => import('@/views/Base/Home/Mobile.vue'),
		() => import('@/views/Base/Home/Tv.vue'),
	];

	/**
	 * Preload critical CSS and fonts
	 */
	preloadCriticalAssets() {
		// Preload critical fonts
		this.preloadFont('/fonts/Inter-roman.var-latin.woff2');
		this.preloadFont('/fonts/mooooom-icons.woff');

		// Preload critical images
		this.preloadImage('/img/icons/android-chrome-192x192.png');
	}

	/**
	 * Preload a font file
	 */
	preloadFont(href: string) {
		if (this.preloadedResources.has(href))
			return;

		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'font';
		link.type = 'font/woff2';
		link.crossOrigin = 'anonymous';
		link.href = href;

		document.head.appendChild(link);
		this.preloadedResources.add(href);
	}

	/**
	 * Preload an image
	 */
	preloadImage(src: string) {
		if (this.preloadedResources.has(src))
			return;

		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'image';
		link.href = src;

		document.head.appendChild(link);
		this.preloadedResources.add(src);
	}

	/**
	 * Preload images in viewport
	 */
	preloadImagesInViewport() {
		const images = document.querySelectorAll('img[data-src]');

		const imageObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement;
						const src = img.dataset.src;

						if (src) {
							this.preloadImage(src);
							imageObserver.unobserve(img);
						}
					}
				});
			},
			{
				rootMargin: '50px',
			},
		);

		images.forEach(img => imageObserver.observe(img));
	}

	/**
	 * Preload critical route components during idle time
	 */
	preloadCriticalComponents() {
		if ('requestIdleCallback' in window) {
			requestIdleCallback(async () => {
				for (const componentLoader of this.criticalComponentLoaders) {
					try {
						await componentLoader();
					}
					catch (error) {
						console.warn(`Failed to preload critical component:`, error);
					}
				}
			});
		}
		else {
			// Fallback for browsers without requestIdleCallback
			setTimeout(async () => {
				for (const componentLoader of this.criticalComponentLoaders) {
					try {
						await componentLoader();
					}
					catch (error) {
						console.warn(`Failed to preload critical component:`, error);
					}
				}
			}, 100);
		}
	}

	/**
	 * Initialize all preloading strategies
	 */
	init() {
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () =>
				this.startPreloading());
		}
		else {
			this.startPreloading();
		}
	}

	private startPreloading() {
		this.preloadCriticalAssets();
		this.preloadImagesInViewport();

		// Preload critical components after initial load
		window.addEventListener('load', () => {
			this.preloadCriticalComponents();
		});
	}
}

export const preloadService = new PreloadService();
