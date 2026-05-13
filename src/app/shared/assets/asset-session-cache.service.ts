import { Injectable } from '@angular/core';

import { SESSION_IMAGE_ASSET_URLS } from './session-cached-asset-urls';

/**
 * Fetches `/assets/**` once per browser tab, serves `blob:` URLs so `<img>` reuse does not
 * hit the network again when routes tear down and recreate (common with lazy-loaded routes).
 */
@Injectable({ providedIn: 'root' })
export class AssetSessionCacheService {
  private readonly originalToBlobUrl = new Map<string, string>();
  private readonly failed = new Set<string>();
  private readonly inflight = new Map<string, Promise<void>>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.revokeAll());
    }
  }

  /** Blob URL if cached, otherwise the original (caller may still display via plain fetch). */
  resolve(url: string): string {
    if (!this.isAssetUrl(url)) {
      return url;
    }
    return this.originalToBlobUrl.get(url) ?? url;
  }

  /** Prefetch and store as blob URL; no-op if already cached or previously failed. */
  async ensure(url: string): Promise<void> {
    if (!this.isAssetUrl(url) || this.originalToBlobUrl.has(url) || this.failed.has(url)) {
      return;
    }

    let pending = this.inflight.get(url);
    if (!pending) {
      pending = this.fetchOne(url);
      this.inflight.set(url, pending);
    }
    await pending;
  }

  /**
   * Warm the catalog in idle time so first paint on tab surfaces often hits warm cache.
   */
  warmSessionAssets(urls: readonly string[] = SESSION_IMAGE_ASSET_URLS): void {
    const run = (): void => {
      for (const u of urls) {
        void this.ensure(u);
      }
    };
    if (typeof globalThis.requestIdleCallback === 'function') {
      globalThis.requestIdleCallback(run, { timeout: 4000 });
    } else {
      globalThis.setTimeout(run, 0);
    }
  }

  private isAssetUrl(url: string): boolean {
    return typeof url === 'string' && url.startsWith('/assets/');
  }

  private async fetchOne(url: string): Promise<void> {
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      this.originalToBlobUrl.set(url, blobUrl);
    } catch {
      this.failed.add(url);
    } finally {
      this.inflight.delete(url);
    }
  }

  private revokeAll(): void {
    for (const blobUrl of this.originalToBlobUrl.values()) {
      URL.revokeObjectURL(blobUrl);
    }
    this.originalToBlobUrl.clear();
    this.failed.clear();
    this.inflight.clear();
  }
}
