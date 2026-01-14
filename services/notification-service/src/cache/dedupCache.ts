type Entry = {
  expiresAt: number;
};

class DedupCache {
  private store = new Map<string, Entry>();

  has(key: string) {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  set(key: string, ttlMs: number) {
    this.store.set(key, {
      expiresAt: Date.now() + ttlMs,
    });
  }
}

export const dedupCache = new DedupCache();
