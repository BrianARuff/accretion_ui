/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@accretion_ui/core/dist/components';

import { defineCustomElement as defineAccretionButton } from '@accretion_ui/core/dist/components/accretion-button.js';
@ProxyCmp({
  defineCustomElementFn: defineAccretionButton,
  inputs: ['disabled', 'variant']
})
@Component({
  selector: 'accretion-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'variant'],
  standalone: true
})
export class AccretionButton {
  protected el: HTMLAccretionButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AccretionButton extends Components.AccretionButton {}


