import { Directive, HostBinding, Input } from '@angular/core';
import type { Components } from '@accretion_ui/core/dist/components';
import { defineCustomElement as defineAccretionButton } from '@accretion_ui/core/dist/components/accretion-button.js';

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
  constructor() {
    ensureAccretionButtonDefined();
  }

  @Input()
  variant: Components.AccretionButton['variant'] = 'primary';

  @Input()
  disabled = false;

  @HostBinding('attr.variant')
  get variantAttr(): Components.AccretionButton['variant'] | null {
    return this.variant ?? null;
  }

  @HostBinding('attr.disabled')
  get disabledAttr(): '' | null {
    return this.disabled ? '' : null;
  }
}
