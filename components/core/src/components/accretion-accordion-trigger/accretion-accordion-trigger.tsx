import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from '@stencil/core';
import {
  ACCORDION_FOCUS_REQUEST,
  ACCORDION_TOGGLE_REQUEST,
  type AccordionFocusAction,
  type AccordionFocusRequestDetail,
  type AccordionItemSnapshot,
  type AccordionToggleRequestDetail
} from '../accretion-accordion/shared';

@Component({
  tag: 'accretion-accordion-trigger',
  styleUrl: 'accretion-accordion-trigger.css',
  shadow: false
})
export class AccretionAccordionTrigger {
  @Element() private el!: HTMLElement;

  /**
   * Disables interaction for this trigger.
   */
  @Prop({ reflect: true }) disabled = false;

  @State() private open = false;
  @State() private itemDisabled = false;
  @State() private index = -1;
  @State() private orientation: AccordionItemSnapshot['orientation'] = 'vertical';
  @State() private panelId = '';
  @State() private triggerId = '';

  @Event({ eventName: ACCORDION_TOGGLE_REQUEST, bubbles: true, composed: true })
  private toggleRequest!: EventEmitter<AccordionToggleRequestDetail>;

  @Event({ eventName: ACCORDION_FOCUS_REQUEST, bubbles: true, composed: true })
  private focusRequest!: EventEmitter<AccordionFocusRequestDetail>;

  componentWillLoad(): void {
    this.syncFromParentItem();
  }

  @Method()
  async syncFromItem(snapshot: AccordionItemSnapshot): Promise<void> {
    this.open = snapshot.open;
    this.itemDisabled = snapshot.disabled;
    this.index = snapshot.index;
    this.orientation = snapshot.orientation;
    this.panelId = snapshot.panelId;
    this.triggerId = snapshot.triggerId;
  }

  private isDisabled(): boolean {
    return this.disabled || this.itemDisabled;
  }

  private syncFromParentItem(): void {
    const item = this.el.closest('accretion-accordion-item');

    if (!item) {
      return;
    }

    const index = Number.parseInt(item.getAttribute('data-index') ?? '-1', 10);
    const orientation = item.getAttribute('data-orientation');

    this.open = item.hasAttribute('open');
    this.itemDisabled = item.hasAttribute('data-disabled') || item.hasAttribute('disabled');
    this.index = Number.isNaN(index) ? -1 : index;
    this.orientation = orientation === 'horizontal' ? 'horizontal' : 'vertical';
    this.triggerId = item.getAttribute('data-trigger-id') ?? this.triggerId;
    this.panelId = item.getAttribute('data-panel-id') ?? this.panelId;
  }

  private emitToggleRequest(): void {
    this.toggleRequest.emit({ trigger: this.el });
  }

  private emitFocusRequest(action: AccordionFocusAction): void {
    this.focusRequest.emit({
      trigger: this.el,
      action
    });
  }

  private handleClick = (event: MouseEvent): void => {
    event.preventDefault();

    if (this.isDisabled()) {
      return;
    }

    this.emitToggleRequest();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.isDisabled()) {
      return;
    }

    const isVertical = this.orientation !== 'horizontal';

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.emitToggleRequest();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.emitFocusRequest('first');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.emitFocusRequest('last');
      return;
    }

    if (isVertical && event.key === 'ArrowDown') {
      event.preventDefault();
      this.emitFocusRequest('next');
      return;
    }

    if (isVertical && event.key === 'ArrowUp') {
      event.preventDefault();
      this.emitFocusRequest('previous');
      return;
    }

    if (!isVertical && event.key === 'ArrowRight') {
      event.preventDefault();
      this.emitFocusRequest('next');
      return;
    }

    if (!isVertical && event.key === 'ArrowLeft') {
      event.preventDefault();
      this.emitFocusRequest('previous');
    }
  };

  render() {
    const isDisabled = this.isDisabled();

    return (
      <Host
        role="button"
        id={this.triggerId || undefined}
        tabindex={isDisabled ? -1 : 0}
        aria-controls={this.panelId || undefined}
        aria-expanded={this.open ? 'true' : 'false'}
        aria-disabled={isDisabled ? 'true' : undefined}
        data-open={this.open ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        data-index={this.index >= 0 ? String(this.index) : undefined}
        data-orientation={this.orientation}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <slot />
      </Host>
    );
  }
}
