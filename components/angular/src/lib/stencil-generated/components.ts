/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import type { Components } from '@accretion_ui/core/dist/components';

import { defineCustomElement as defineAccretionAccordion } from '@accretion_ui/core/dist/components/accretion-accordion.js';
import { defineCustomElement as defineAccretionAccordionHeader } from '@accretion_ui/core/dist/components/accretion-accordion-header.js';
import { defineCustomElement as defineAccretionAccordionItem } from '@accretion_ui/core/dist/components/accretion-accordion-item.js';
import { defineCustomElement as defineAccretionAccordionPanel } from '@accretion_ui/core/dist/components/accretion-accordion-panel.js';
import { defineCustomElement as defineAccretionAccordionTrigger } from '@accretion_ui/core/dist/components/accretion-accordion-trigger.js';
import { defineCustomElement as defineAccretionButton } from '@accretion_ui/core/dist/components/accretion-button.js';
@ProxyCmp({
  defineCustomElementFn: defineAccretionAccordion,
  inputs: ['collapsible', 'disabled', 'focusLoop', 'loop', 'orientation', 'sizeVariant', 'type'],
  methods: ['registerItem', 'unregisterItem']
})
@Component({
  selector: 'accretion-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['collapsible', 'disabled', 'focusLoop', 'loop', 'orientation', 'sizeVariant', 'type'],
  standalone: true
})
export class AccretionAccordion {
  protected el: HTMLAccretionAccordionElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['accretionAccordionChange']);
  }
}


export declare interface AccretionAccordion extends Components.AccretionAccordion {

  accretionAccordionChange: EventEmitter<CustomEvent<{ openValues: string[] }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAccretionAccordionHeader,
  inputs: ['level'],
  methods: ['syncFromItem']
})
@Component({
  selector: 'accretion-accordion-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['level'],
  standalone: true
})
export class AccretionAccordionHeader {
  protected el: HTMLAccretionAccordionHeaderElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AccretionAccordionHeader extends Components.AccretionAccordionHeader {}


@ProxyCmp({
  defineCustomElementFn: defineAccretionAccordionItem,
  inputs: ['disabled', 'open', 'value'],
  methods: ['setOpenState', 'setIndex', 'syncFromRoot', 'focusTrigger', 'getItemValue']
})
@Component({
  selector: 'accretion-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'open', 'value'],
  standalone: true
})
export class AccretionAccordionItem {
  protected el: HTMLAccretionAccordionItemElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['accretionAccordionItemStateChange']);
  }
}


import type { AccordionItemElement as IAccretionAccordionItemAccordionItemElement } from '@accretion_ui/core/dist/components';

export declare interface AccretionAccordionItem extends Components.AccretionAccordionItem {

  accretionAccordionItemStateChange: EventEmitter<CustomEvent<{ item: IAccretionAccordionItemAccordionItemElement }>>;
}


@ProxyCmp({
  defineCustomElementFn: defineAccretionAccordionPanel,
  inputs: ['hiddenUntilFound', 'keepMounted'],
  methods: ['syncFromItem']
})
@Component({
  selector: 'accretion-accordion-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['hiddenUntilFound', 'keepMounted'],
  standalone: true
})
export class AccretionAccordionPanel {
  protected el: HTMLAccretionAccordionPanelElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface AccretionAccordionPanel extends Components.AccretionAccordionPanel {}


@ProxyCmp({
  defineCustomElementFn: defineAccretionAccordionTrigger,
  inputs: ['disabled'],
  methods: ['syncFromItem']
})
@Component({
  selector: 'accretion-accordion-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled'],
  standalone: true
})
export class AccretionAccordionTrigger {
  protected el: HTMLAccretionAccordionTriggerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['accretionAccordionToggleRequest', 'accretionAccordionFocusRequest']);
  }
}


import type { AccordionToggleRequestDetail as IAccretionAccordionTriggerAccordionToggleRequestDetail } from '@accretion_ui/core/dist/components';
import type { AccordionFocusRequestDetail as IAccretionAccordionTriggerAccordionFocusRequestDetail } from '@accretion_ui/core/dist/components';

export declare interface AccretionAccordionTrigger extends Components.AccretionAccordionTrigger {

  accretionAccordionToggleRequest: EventEmitter<CustomEvent<IAccretionAccordionTriggerAccordionToggleRequestDetail>>;

  accretionAccordionFocusRequest: EventEmitter<CustomEvent<IAccretionAccordionTriggerAccordionFocusRequestDetail>>;
}


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


