import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { AssetSessionCacheService } from './asset-session-cache.service';

/**
 * Binds `<img>` to a session-cached blob URL for `/assets/**` paths after first fetch.
 */
@Directive({
  selector: 'img[appCachedAsset]',
  standalone: true,
})
export class CachedAssetImgDirective implements OnChanges {
  /** Asset URL under `/assets/`. Undefined skips binding (e.g. optional slide fields). */
  @Input({ alias: 'appCachedAsset' }) appCachedAsset: string | undefined;

  private seq = 0;

  constructor(
    private readonly host: ElementRef<HTMLImageElement>,
    private readonly cache: AssetSessionCacheService,
    private readonly zone: NgZone,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['appCachedAsset']) {
      return;
    }
    const url = this.appCachedAsset;
    if (!url) {
      return;
    }
    this.apply(url);
  }

  private apply(url: string): void {
    const img = this.host.nativeElement;
    const mySeq = ++this.seq;

    const resolved = this.cache.resolve(url);
    if (resolved !== url) {
      img.src = resolved;
      return;
    }

    void this.cache.ensure(url).then(() => {
      if (mySeq !== this.seq) {
        return;
      }
      this.zone.run(() => {
        const next = this.cache.resolve(url);
        img.src = next !== url ? next : url;
      });
    });
  }
}
