import { Component } from '@angular/core';
import { CachedAssetImgDirective } from '../../assets/cached-asset-img.directive';

/** PolicyStreet header (logo only) — matches Figma welcome / login top bar. */
@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CachedAssetImgDirective],
  templateUrl: './app-top-bar.component.html',
  styleUrl: './app-top-bar.component.scss',
})
export class AppTopBarComponent {}
