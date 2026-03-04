import { Component, Element, Event, EventEmitter, h, Method, Prop, State } from '@stencil/core';
import {
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
  @State() private itemValue = '';
  @State() private panelId = '';
  @State() private triggerId = '';

  @Event({ eventName: 'accretionAccordionToggleRequest', bubbles: true, composed: true })
  private toggleRequest!: EventEmitter<AccordionToggleRequestDetail>;

  @Event({ eventName: 'accretionAccordionFocusRequest', bubbles: true, composed: true })
  private focusRequest!: EventEmitter<AccordionFocusRequestDetail>;

  componentWillLoad(): void {
    this.syncFromParentItem();
  }

  @Method()
  async syncFromItem(snapshot: AccordionItemSnapshot): Promise<void> {
    this.itemValue = snapshot.value;
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
    const stateContainer = item?.querySelector('[data-accordion-item]') as HTMLElement | null;
    const source = stateContainer ?? item;

    if (!item || !source) {
      return;
    }

    const index = Number.parseInt(source.getAttribute('data-index') ?? '-1', 10);
    const orientation = source.getAttribute('data-orientation');

    this.open = item.hasAttribute('open');
    this.itemDisabled = source.hasAttribute('data-disabled') || item.hasAttribute('disabled');
    this.index = Number.isNaN(index) ? -1 : index;
    this.orientation = orientation === 'horizontal' ? 'horizontal' : 'vertical';
    this.itemValue = item.getAttribute('value')?.trim() ?? this.itemValue;
    this.triggerId = source.getAttribute('data-trigger-id') ?? this.triggerId;
    this.panelId = source.getAttribute('data-panel-id') ?? this.panelId;
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
      <button
        type="button"
        data-accordion-trigger
        id={this.triggerId || undefined}
        data-value={this.itemValue || undefined}
        tabIndex={isDisabled ? -1 : 0}
        disabled={isDisabled}
        aria-controls={this.panelId || undefined}
        aria-expanded={this.open ? 'true' : 'false'}
        aria-disabled={isDisabled ? 'true' : undefined}
        data-open={this.open ? '' : undefined}
        data-panel-open={this.open ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        data-index={this.index >= 0 ? String(this.index) : undefined}
        data-orientation={this.orientation}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <slot />
      </button>
    );
  }
}
