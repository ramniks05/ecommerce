// A resilient storage wrapper that safely uses localStorage when available
// and falls back to in-memory storage when blocked (Incognito/Safari Private) or absent (SSR).

const createMemoryStore = () => {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    clear() {
      map.clear();
    }
  };
};

export const createSafeStorage = () => {
  const hasWindow = typeof window !== 'undefined';
  let storage = null;

  if (hasWindow) {
    try {
      const s = window.localStorage;
      // Test basic write/remove; this can throw in Safari Private
      const testKey = '__safe_test__';
      s.setItem(testKey, '1');
      s.removeItem(testKey);
      storage = s;
    } catch (e) {
      storage = null;
    }
  }

  const memory = createMemoryStore();

  return {
    getItem(key) {
      try {
        return storage ? storage.getItem(key) : memory.getItem(key);
      } catch {
        return memory.getItem(key);
      }
    },
    setItem(key, value) {
      try {
        if (storage) return storage.setItem(key, String(value));
        return memory.setItem(key, String(value));
      } catch {
        return memory.setItem(key, String(value));
      }
    },
    removeItem(key) {
      try {
        if (storage) return storage.removeItem(key);
        return memory.removeItem(key);
      } catch {
        return memory.removeItem(key);
      }
    },
    clear() {
      try {
        if (storage) return storage.clear();
        return memory.clear();
      } catch {
        return memory.clear();
      }
    }
  };
};

export const safeStorage = createSafeStorage();

export const jsonStorage = {
  get(key, defaultValue = null) {
    const raw = safeStorage.getItem(key);
    if (raw == null) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      safeStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  remove(key) {
    safeStorage.removeItem(key);
  },
  clear() {
    safeStorage.clear();
  }
};


