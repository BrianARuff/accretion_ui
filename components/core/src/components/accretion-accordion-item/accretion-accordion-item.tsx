import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import {
  ACCORDION_ITEM_STATE_CHANGE,
  type AccordionHeaderElement,
  type AccordionItemElement,
  type AccordionItemSnapshot,
  type AccordionOrientation,
  type AccordionPanelElement,
  type AccordionRootSnapshot,
  type AccordionTriggerElement,
  createAccordionItemIds,
  getClosestAccordion
} from '../accretion-accordion/shared';

@Component({
  tag: 'accretion-accordion-item',
  styleUrl: 'accretion-accordion-item.css',
  shadow: false
})
export class AccretionAccordionItem {
  @Element() private el!: HTMLElement;

  /**
   * Stable value used to identify this item.
   */
  @Prop({ reflect: true }) value?: string;

  /**
   * Controls whether the item is expanded.
   */
  @Prop({ reflect: true, mutable: true }) open = false;

  /**
   * Disables interaction for this item.
   */
  @Prop({ reflect: true }) disabled = false;

  @State() private index = -1;
  @State() private rootDisabled = false;
  @State() private orientation: AccordionOrientation = 'vertical';

  @Event({ eventName: ACCORDION_ITEM_STATE_CHANGE, bubbles: true, composed: true })
  private itemStateChange!: EventEmitter<{ item: AccordionItemElement }>;

  private triggerId = '';
  private panelId = '';
  private fallbackValue = '';

  @Watch('value')
  protected handleValueChange(): void {
    this.assignItemIds();
    void this.syncChildren();
    this.emitStateChange();
  }

  @Watch('open')
  protected handleOpenChange(): void {
    void this.syncChildren();
    this.emitStateChange();
  }

  @Watch('disabled')
  protected handleDisabledChange(): void {
    void this.syncChildren();
    this.emitStateChange();
  }

  componentWillLoad(): void {
    this.assignItemIds();
  }

  connectedCallback(): void {
    void this.registerWithRoot();
  }

  componentDidLoad(): void {
    void this.syncChildren();
    void this.registerWithRoot();
  }

  disconnectedCallback(): void {
    void this.unregisterFromRoot();
  }

  @Method()
  async setOpenState(open: boolean): Promise<void> {
    this.open = open;
    await this.syncChildren();
  }

  @Method()
  async setIndex(index: number): Promise<void> {
    if (this.index !== index) {
      this.index = index;
      await this.syncChildren();
    }
  }

  @Method()
  async syncFromRoot(snapshot: AccordionRootSnapshot): Promise<void> {
    this.rootDisabled = snapshot.disabled;
    this.orientation = snapshot.orientation;
    this.index = snapshot.index;
    await this.syncChildren();
  }

  @Method()
  async focusTrigger(): Promise<void> {
    const trigger = this.getTriggerElement();

    if (trigger) {
      trigger.focus();
    }
  }

  @Method()
  async getItemValue(): Promise<string> {
    return this.resolveItemValue();
  }

  private assignItemIds(): void {
    const ids = createAccordionItemIds(this.value);

    this.triggerId = ids.triggerId;
    this.panelId = ids.panelId;
    this.fallbackValue = ids.fallbackValue;
  }

  private resolveItemValue(): string {
    const normalizedValue = this.value?.trim();

    return normalizedValue && normalizedValue.length > 0 ? normalizedValue : this.fallbackValue;
  }

  private isDisabled(): boolean {
    return this.disabled || this.rootDisabled;
  }

  private getHeaderElement(): AccordionHeaderElement | null {
    return this.el.querySelector('accretion-accordion-header') as AccordionHeaderElement | null;
  }

  private getTriggerElement(): AccordionTriggerElement | null {
    return this.el.querySelector('accretion-accordion-trigger') as AccordionTriggerElement | null;
  }

  private getPanelElement(): AccordionPanelElement | null {
    return this.el.querySelector('accretion-accordion-panel') as AccordionPanelElement | null;
  }

  private createSnapshot(): AccordionItemSnapshot {
    return {
      open: this.open,
      disabled: this.isDisabled(),
      index: this.index,
      orientation: this.orientation,
      triggerId: this.triggerId,
      panelId: this.panelId
    };
  }

  private async syncChildren(): Promise<void> {
    const snapshot = this.createSnapshot();
    const syncTasks: Array<Promise<void>> = [];

    const header = this.getHeaderElement();
    const trigger = this.getTriggerElement();
    const panel = this.getPanelElement();

    if (header && typeof header.syncFromItem === 'function') {
      syncTasks.push(header.syncFromItem(snapshot));
    }

    if (trigger && typeof trigger.syncFromItem === 'function') {
      syncTasks.push(trigger.syncFromItem(snapshot));
    }

    if (panel && typeof panel.syncFromItem === 'function') {
      syncTasks.push(panel.syncFromItem(snapshot));
    }

    if (syncTasks.length > 0) {
      await Promise.all(syncTasks);
    }
  }

  private async registerWithRoot(): Promise<void> {
    const root = getClosestAccordion(this.el) as (HTMLElement & { registerItem?: (item: AccordionItemElement) => Promise<void> }) | null;

    if (root?.registerItem) {
      await root.registerItem(this.el as AccordionItemElement);
    }
  }

  private async unregisterFromRoot(): Promise<void> {
    const root = getClosestAccordion(this.el) as (HTMLElement & { unregisterItem?: (item: AccordionItemElement) => Promise<void> }) | null;

    if (root?.unregisterItem) {
      await root.unregisterItem(this.el as AccordionItemElement);
    }
  }

  private emitStateChange(): void {
    this.itemStateChange.emit({ item: this.el as AccordionItemElement });
  }

  render() {
    return (
      <Host
        data-open={this.open ? '' : undefined}
        data-disabled={this.isDisabled() ? '' : undefined}
        data-index={this.index >= 0 ? String(this.index) : undefined}
        data-orientation={this.orientation}
        data-trigger-id={this.triggerId}
        data-panel-id={this.panelId}
      >
        <slot />
      </Host>
    );
  }
}
