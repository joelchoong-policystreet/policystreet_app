import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/**
 * Moves the host element to document.body so position:fixed overlays span the full
 * viewport (including shell sidebar/top bar), not only the routed scroll column.
 */
@Directive({
  selector: '[appViewportFixed]',
  standalone: true,
})
export class ViewportFixedDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.remove();
  }
}
