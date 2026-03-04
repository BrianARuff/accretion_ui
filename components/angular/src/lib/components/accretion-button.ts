import { Directive } from '@angular/core';
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
}
