/**
 * Clear Service Worker Cache Script
 * This script helps clear old service worker caches during development
 */

console.log("🧹 Service Worker Cache Cleanup Script");

// Function to clear all caches
async function clearAllCaches() {
  if ("serviceWorker" in navigator && "caches" in window) {
    try {
      // Get all cache names
      const cacheNames = await caches.keys();
      console.log("📦 Found caches:", cacheNames);

      // Delete all caches
      const deletePromises = cacheNames.map((cacheName) => {
        console.log(`🗑️ Deleting cache: ${cacheName}`);
        return caches.delete(cacheName);
      });

      await Promise.all(deletePromises);
      console.log("✅ All caches cleared successfully");

      // Unregister all service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(
        "🔧 Found service worker registrations:",
        registrations.length
      );

      for (let registration of registrations) {
        console.log(`🗑️ Unregistering service worker: ${registration.scope}`);
        await registration.unregister();
      }

      console.log("✅ All service workers unregistered");
      console.log("🔄 Please refresh the page to use the new service worker");
    } catch (error) {
      console.error("❌ Error clearing caches:", error);
    }
  } else {
    console.log("❌ Service Worker or Cache API not supported");
  }
}

// Function to show current cache status
async function showCacheStatus() {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      console.log("📊 Current Cache Status:");

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        console.log(`  ${cacheName}: ${keys.length} entries`);
      }

      if (cacheNames.length === 0) {
        console.log("  No caches found");
      }
    } catch (error) {
      console.error("❌ Error reading cache status:", error);
    }
  }
}

// Make functions available globally for console usage
window.clearAllCaches = clearAllCaches;
window.showCacheStatus = showCacheStatus;

console.log("💡 Available commands:");
console.log("  clearAllCaches() - Clear all service worker caches");
console.log("  showCacheStatus() - Show current cache status");
console.log("");
console.log("🎯 To clear caches and start fresh, run: clearAllCaches()");
