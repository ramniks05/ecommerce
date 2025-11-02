// Utility to clear all cached data and force fresh load
// This helps when browser cache is causing issues

export const clearAppCache = () => {
  try {
    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      // Keep only essential items, clear rest
      const essentialKeys = ['user']; // Keep user session
      
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && !essentialKeys.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          window.localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to remove ${key} from localStorage:`, e);
        }
      });
      
      console.log('🧹 Cleared localStorage cache (kept essential data)');
    }
    
    // Clear sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.clear();
      console.log('🧹 Cleared sessionStorage');
    }
    
    // Force reload without cache
    if (typeof window !== 'undefined') {
      // Set a flag to indicate cache was cleared
      sessionStorage.setItem('cache_cleared', Date.now().toString());
      
      console.log('✅ Cache cleared. Reloading page...');
      // Reload page with cache bypass
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

// Check if we should clear cache on load (for debugging)
export const checkAndClearCacheIfNeeded = () => {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const clearCache = urlParams.get('clearCache');
      
      if (clearCache === 'true') {
        console.log('🔄 Clear cache parameter detected, clearing...');
        clearAppCache();
      }
    }
  } catch (error) {
    console.error('Error checking cache clear:', error);
  }
};

