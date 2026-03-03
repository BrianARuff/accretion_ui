import { Directive, ElementRef, Input, NgZone } from '@angular/core';
import type { Components } from '@accretion/core/dist/components';
import { defineCustomElement as defineAccretionButton } from '@accretion/core/dist/components/accretion-button.js';

const ensureAccretionButtonDefined = () => {
  if (typeof customElements !== 'undefined' && !customElements.get('accretion-button')) {
    defineAccretionButton();
  }
};

@Directive({
  selector: 'accretion-button',
  standalone: true
})
export class AccretionButton {
  private readonly el: HTMLAccretionButtonElement;

  constructor(host: ElementRef<HTMLAccretionButtonElement>, private readonly zone: NgZone) {
    ensureAccretionButtonDefined();
    this.el = host.nativeElement;
  }

  @Input()
  get variant(): Components.AccretionButton['variant'] {
    return this.el.variant;
  }

  set variant(value: Components.AccretionButton['variant']) {
    this.zone.runOutsideAngular(() => {
      this.el.variant = value;
    });
  }

  @Input()
  get disabled(): boolean {
    return this.el.disabled;
  }

  set disabled(value: boolean) {
    this.zone.runOutsideAngular(() => {
      this.el.disabled = value;
    });
  }
}
