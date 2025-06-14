// Icon optimization service to reduce bundle size
// This service provides tree-shaking for icons and dynamic loading

import { ref, computed } from 'vue';

// Track used icons across the app
const usedIcons = new Set<string>();
const loadedIconSets = new Map<string, Set<string>>();

// Common icons that should always be available
const CORE_ICONS = [
  'play', 'pause', 'stop', 'next', 'previous', 'forward', 'backward',
  'volumeZero', 'volumeOne', 'volumeTwo', 'volumeThree', 'volumeMuted',
  'chevronLeft', 'chevronRight', 'chevronUp', 'chevronDown',
  'add', 'remove', 'close', 'search', 'menu', 'settings',
  'home', 'user', 'heart', 'star', 'bookmark',
  'download', 'upload', 'share', 'like', 'dislike'
];

// Icon categories for lazy loading
const ICON_CATEGORIES = {
  core: CORE_ICONS,
  media: ['movieClap', 'tv', 'music', 'headphones', 'speaker', 'microphone'],
  navigation: ['compass', 'map', 'location', 'directions', 'route'],
  communication: ['phone', 'message', 'email', 'notification', 'bell'],
  file: ['folder', 'file', 'image', 'document', 'archive'],
  social: ['facebook', 'twitter', 'instagram', 'youtube', 'share'],
  weather: ['sun', 'cloud', 'rain', 'snow', 'storm', 'wind'],
  devices: ['desktop', 'laptop', 'tablet', 'mobile', 'watch', 'gamepad'],
  transport: ['car', 'plane', 'train', 'bike', 'bus', 'ship'],
  food: ['pizza', 'burger', 'coffee', 'beer', 'cake', 'apple']
};

// SVG icon cache for dynamically loaded icons
const svgIconCache = new Map<string, string>();

interface IconConfig {
  name: string;
  category?: keyof typeof ICON_CATEGORIES;
  size?: string | number;
  color?: string;
  className?: string;
}

class IconOptimizationService {
  private loadingPromises = new Map<string, Promise<void>>();

  /**
   * Register an icon as used in the application
   */
  registerIconUsage(iconName: string, category?: string) {
    usedIcons.add(iconName);
    
    if (category) {
      if (!loadedIconSets.has(category)) {
        loadedIconSets.set(category, new Set());
      }
      loadedIconSets.get(category)!.add(iconName);
    }
  }

  /**
   * Get optimized icon component
   */
  async getOptimizedIcon(config: IconConfig) {
    const { name, category, size = 24, color, className } = config;
    
    // Register usage
    this.registerIconUsage(name, category);
    
    // Check if icon is in core set (always available)
    if (CORE_ICONS.includes(name)) {
      return this.createFontIcon(name, size, color, className);
    }
    
    // Try to load as SVG icon for better optimization
    const svgIcon = await this.loadSVGIcon(name, category);
    if (svgIcon) {
      return this.createSVGIcon(svgIcon, size, color, className);
    }
    
    // Fallback to font icon
    return this.createFontIcon(name, size, color, className);
  }

  /**
   * Load SVG icon dynamically
   */
  private async loadSVGIcon(iconName: string, category?: string): Promise<string | null> {
    // Check cache first
    const cacheKey = `${category || 'default'}-${iconName}`;
    if (svgIconCache.has(cacheKey)) {
      return svgIconCache.get(cacheKey)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      await this.loadingPromises.get(cacheKey);
      return svgIconCache.get(cacheKey) || null;
    }

    // Start loading
    const loadingPromise = this.fetchSVGIcon(iconName, category);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      await loadingPromise;
      return svgIconCache.get(cacheKey) || null;
    } catch (error) {
      console.warn(`Failed to load SVG icon: ${iconName}`, error);
      return null;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }
  /**
   * Fetch SVG icon from server or CDN
   */
  private async fetchSVGIcon(iconName: string, category?: string): Promise<void> {
    const cacheKey = `${category || 'default'}-${iconName}`;
    
    try {
      // Try loading from optimized icon set first
      const optimizedUrl = `${__dirname}/resources/icons/mooooom/${category || "default"}/${iconName}.svg?import`;
      let response = await fetch(optimizedUrl);
      
      // Check if the response is actually HTML (SPA fallback) instead of SVG
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          // This is the SPA fallback serving index.html, not an actual SVG
          throw new Error('SVG endpoint returned HTML (SPA fallback detected)');
        }
      }
      
      if (!response.ok && category) {
        // Fallback to general icon set
        const fallbackUrl = `${__dirname}/resources/icons/mooooom/${iconName}.svg?import`;
        response = await fetch(fallbackUrl);
        
        // Check content type again for fallback
        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('text/html')) {
            throw new Error('SVG fallback endpoint returned HTML (SPA fallback detected)');
          }
        }
      }
      
      if (response.ok) {
        const svgContent = await response.text();
        // Double-check that we actually got SVG content, not HTML
        if (svgContent.trim().startsWith('<svg')) {
          svgIconCache.set(cacheKey, svgContent);
        } else {
          throw new Error('Response content is not valid SVG');
        }
      }
    } catch (error) {
      // Don't cache failed attempts to prevent repeated requests
    }
  }

  /**
   * Create font icon element
   */
  private createFontIcon(name: string, size: string | number, color?: string, className?: string) {
    return {
      type: 'font',
      html: `<i class="mooooom-${name} ${className || ''}" style="font-size: ${typeof size === 'number' ? size + 'px' : size}; ${color ? `color: ${color};` : ''}"></i>`
    };
  }

  /**
   * Create SVG icon element
   */
  private createSVGIcon(svgContent: string, size: string | number, color?: string, className?: string) {
    const sizeStyle = typeof size === 'number' ? `${size}px` : size;
    const colorStyle = color ? `fill: ${color};` : '';
    const styledSvg = svgContent
      .replace('<svg', `<svg class="${className || ''}" width="${sizeStyle}" height="${sizeStyle}" style="${colorStyle}"`)
      .replace(/fill="[^"]*"/g, '') // Remove existing fills to allow CSS control
      .replace(/stroke="[^"]*"/g, ''); // Remove existing strokes
    
    return {
      type: 'svg',
      html: styledSvg
    };
  }

  /**
   * Preload icon category
   */
  async preloadIconCategory(category: keyof typeof ICON_CATEGORIES) {
    const icons = ICON_CATEGORIES[category];
    if (!icons) return;

    const loadPromises = icons.map(iconName => 
      this.loadSVGIcon(iconName, category).catch(() => null)
    );

    await Promise.allSettled(loadPromises);
    console.log(`Preloaded ${category} icons`);
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return {
      totalUsedIcons: usedIcons.size,
      usedIcons: Array.from(usedIcons).sort(),
      loadedCategories: Array.from(loadedIconSets.keys()),
      cacheSize: svgIconCache.size,
      memorySavings: this.calculateMemorySavings()
    };
  }

  /**
   * Calculate estimated memory savings
   */
  private calculateMemorySavings() {
    const totalAvailableIcons = 2000; // Approximate count from mooooom-icons
    const avgIconSize = 2048; // Bytes per icon (estimated)
    const totalPossibleSize = totalAvailableIcons * avgIconSize;
    const actualUsedSize = usedIcons.size * avgIconSize;
    const svgCacheSize = Array.from(svgIconCache.values())
      .reduce((total, svg) => total + svg.length, 0);
    
    return {
      totalPossibleSize,
      actualUsedSize,
      svgCacheSize,
      savedBytes: totalPossibleSize - actualUsedSize - svgCacheSize,
      savedPercentage: ((totalPossibleSize - actualUsedSize - svgCacheSize) / totalPossibleSize * 100).toFixed(1)
    };
  }

  /**
   * Clear unused icons from cache
   */
  clearUnusedCache() {
    const unusedKeys = Array.from(svgIconCache.keys()).filter(key => {
      const iconName = key.split('-').pop();
      return iconName && !usedIcons.has(iconName);
    });

    unusedKeys.forEach(key => svgIconCache.delete(key));
    console.log(`Cleared ${unusedKeys.length} unused icons from cache`);
  }

  /**
   * Generate optimized icon font with only used icons
   */
  async generateOptimizedIconFont() {
    const usedIconsList = Array.from(usedIcons);
    
    try {
      const response = await fetch('/api/icons/generate-optimized-font', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          icons: usedIconsList,
          format: 'woff2'
        })
      });

      if (response.ok) {
        const fontData = await response.blob();
        const fontUrl = URL.createObjectURL(fontData);
        
        // Replace current font with optimized version
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'mooooom-icons-optimized';
            src: url('${fontUrl}') format('woff2');
            font-display: swap;
          }
          
          [class^="mooooom-"], [class*=" mooooom-"] {
            font-family: 'mooooom-icons-optimized' !important;
          }
        `;
        document.head.appendChild(style);
        
        console.log(`Generated optimized icon font with ${usedIconsList.length} icons`);
        return fontUrl;
      }
    } catch (error) {
      console.error('Failed to generate optimized icon font:', error);
    }
    
    return null;
  }
}

// Export singleton instance
export const iconOptimizationService = new IconOptimizationService();

// Vue composable for easy usage
export function useOptimizedIcon() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getIcon = async (config: IconConfig) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const icon = await iconOptimizationService.getOptimizedIcon(config);
      return icon;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load icon';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const preloadCategory = (category: keyof typeof ICON_CATEGORIES) => {
    return iconOptimizationService.preloadIconCategory(category);
  };

  const stats = computed(() => iconOptimizationService.getUsageStats());

  return {
    getIcon,
    preloadCategory,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    stats
  };
}
