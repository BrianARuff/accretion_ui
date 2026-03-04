import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';
import {
  type AccordionFocusRequestDetail,
  type AccordionItemElement,
  type AccordionItemStateChangeDetail,
  type AccordionOrientation,
  type AccordionSizeVariant,
  type AccordionToggleRequestDetail,
  type AccordionType,
  getClosestAccordion,
  getClosestAccordionItem
} from './shared';

@Component({
  tag: 'accretion-accordion',
  styleUrl: 'accretion-accordion.css',
  shadow: false
})
export class AccretionAccordion {
  @Element() private el!: HTMLElement;

  /**
   * Defines whether one or many items can be open at the same time.
   */
  @Prop({ reflect: true }) type: AccordionType = 'single';

  /**
   * Allows the currently open item to collapse when type is single.
   */
  @Prop({ reflect: true }) collapsible = true;

  /**
   * Disables all accordion interaction.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Controls whether keyboard focus wraps between the first and last enabled triggers.
   */
  @Prop({ reflect: true, attribute: 'focus-loop' }) focusLoop = true;

  /**
   * @deprecated Use `focusLoop` instead.
   */
  @Prop({ reflect: true }) loop?: boolean;

  /**
   * Determines keyboard arrow behavior.
   */
  @Prop({ reflect: true }) orientation: AccordionOrientation = 'vertical';

  /**
   * Controls component spacing density.
   */
  @Prop({ reflect: true, attribute: 'size-variant' }) sizeVariant: AccordionSizeVariant = 'comfortable';

  @Event({ eventName: 'accretionAccordionChange' })
  private accretionAccordionChange!: EventEmitter<{ openValues: string[] }>;

  private items: AccordionItemElement[] = [];
  private mutationObserver?: MutationObserver;
  private isSyncingState = false;
  @State() private hasOpenItems = false;

  @Watch('type')
  @Watch('disabled')
  @Watch('orientation')
  @Watch('focusLoop')
  @Watch('loop')
  protected handleRootStateChange(): void {
    void this.syncItemsFromDom();
  }

  connectedCallback(): void {
    void this.syncItemsFromDom();
  }

  componentDidLoad(): void {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      void this.syncItemsFromDom();
    });

    this.mutationObserver.observe(this.el, {
      childList: true,
      subtree: true
    });

    void this.syncItemsFromDom();
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
  }

  @Method()
  async registerItem(item: AccordionItemElement): Promise<void> {
    if (!this.items.includes(item)) {
      this.items = [...this.items, item];
      await this.syncItemsFromDom();
    }
  }

  @Method()
  async unregisterItem(item: AccordionItemElement): Promise<void> {
    this.items = this.items.filter((currentItem) => currentItem !== item);
    await this.syncItemsFromDom();
  }

  @Listen('accretionAccordionToggleRequest')
  async handleToggleRequest(event: CustomEvent<AccordionToggleRequestDetail>): Promise<void> {
    const trigger = event.detail?.trigger;

    if (!trigger || getClosestAccordion(trigger) !== this.el) {
      return;
    }

    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    const item = getClosestAccordionItem(trigger);

    if (!item || this.isItemDisabled(item)) {
      return;
    }

    await this.toggleItem(item);
  }

  @Listen('accretionAccordionFocusRequest')
  async handleFocusRequest(event: CustomEvent<AccordionFocusRequestDetail>): Promise<void> {
    const trigger = event.detail?.trigger;

    if (!trigger || getClosestAccordion(trigger) !== this.el) {
      return;
    }

    event.stopPropagation();

    const item = getClosestAccordionItem(trigger);

    if (!item) {
      return;
    }

    await this.moveFocus(item, event.detail.action);
  }

  @Listen('accretionAccordionItemStateChange')
  async handleItemStateChange(event: CustomEvent<AccordionItemStateChangeDetail>): Promise<void> {
    const item = event.detail?.item;

    if (!item || getClosestAccordion(item) !== this.el || this.isSyncingState) {
      return;
    }

    event.stopPropagation();

    await this.enforceExpansionRules(item);
    this.syncOpenState();
    await this.emitValueChange();
  }

  private get normalizedType(): AccordionType {
    return this.type === 'multiple' ? 'multiple' : 'single';
  }

  private get normalizedOrientation(): AccordionOrientation {
    return this.orientation === 'horizontal' ? 'horizontal' : 'vertical';
  }

  private get normalizedSizeVariant(): AccordionSizeVariant {
    if (this.sizeVariant === 'compact' || this.sizeVariant === 'spacious') {
      return this.sizeVariant;
    }

    return 'comfortable';
  }

  private get shouldLoopFocus(): boolean {
    if (typeof this.loop === 'boolean') {
      return this.loop;
    }

    return this.focusLoop;
  }

  private getItemsFromDom(): AccordionItemElement[] {
    return Array.from(this.el.querySelectorAll('accretion-accordion-item')) as AccordionItemElement[];
  }

  private isItemDisabled(item: AccordionItemElement): boolean {
    return this.disabled || item.disabled;
  }

  private async syncItemsFromDom(): Promise<void> {
    const items = this.getItemsFromDom();

    this.items = items;

    await Promise.all(
      items.map((item, index) =>
        item.syncFromRoot({
          disabled: this.disabled,
          orientation: this.normalizedOrientation,
          index
        })
      )
    );

    await this.enforceExpansionRules();
    this.syncOpenState();
  }

  private async toggleItem(item: AccordionItemElement): Promise<void> {
    await this.withStateSync(async () => {
      if (this.normalizedType === 'multiple') {
        await item.setOpenState(!item.open);
      } else if (item.open) {
        if (this.collapsible) {
          await item.setOpenState(false);
        }
      } else {
        await this.closeOtherItems(item);
        await item.setOpenState(true);
      }
    });

    this.syncOpenState();
    await this.emitValueChange();
  }

  private async closeOtherItems(activeItem: AccordionItemElement): Promise<void> {
    const closeTasks = this.items
      .filter((item) => item !== activeItem && item.open)
      .map((item) => item.setOpenState(false));

    if (closeTasks.length > 0) {
      await Promise.all(closeTasks);
    }
  }

  private async enforceExpansionRules(preferredOpenItem?: AccordionItemElement): Promise<void> {
    if (this.normalizedType !== 'single') {
      return;
    }

    const openItems = this.items.filter((item) => item.open && !this.isItemDisabled(item));

    if (openItems.length <= 1) {
      if (!this.collapsible && openItems.length === 0) {
        const firstEnabledItem = this.items.find((item) => !this.isItemDisabled(item));

        if (firstEnabledItem) {
          await this.withStateSync(async () => {
            await firstEnabledItem.setOpenState(true);
          });
        }
      }

      return;
    }

    const itemToKeepOpen = preferredOpenItem && openItems.includes(preferredOpenItem) ? preferredOpenItem : openItems[0];

    await this.withStateSync(async () => {
      await Promise.all(
        openItems
          .filter((item) => item !== itemToKeepOpen)
          .map((item) => item.setOpenState(false))
      );
    });
  }

  private async moveFocus(item: AccordionItemElement, action: AccordionFocusRequestDetail['action']): Promise<void> {
    const enabledItems = this.items.filter((currentItem) => !this.isItemDisabled(currentItem));

    if (enabledItems.length === 0) {
      return;
    }

    const itemIndex = enabledItems.indexOf(item);

    if (itemIndex === -1) {
      return;
    }

    let targetIndex = itemIndex;

    if (action === 'first') {
      targetIndex = 0;
    }

    if (action === 'last') {
      targetIndex = enabledItems.length - 1;
    }

    if (action === 'next') {
      targetIndex = itemIndex + 1;

      if (targetIndex >= enabledItems.length) {
        targetIndex = this.shouldLoopFocus ? 0 : enabledItems.length - 1;
      }
    }

    if (action === 'previous') {
      targetIndex = itemIndex - 1;

      if (targetIndex < 0) {
        targetIndex = this.shouldLoopFocus ? enabledItems.length - 1 : 0;
      }
    }

    await enabledItems[targetIndex].focusTrigger();
  }

  private async emitValueChange(): Promise<void> {
    const openValues = await Promise.all(
      this.items
        .filter((item) => item.open)
        .map((item) => item.getItemValue())
    );

    this.accretionAccordionChange.emit({ openValues });
  }

  private syncOpenState(): void {
    this.hasOpenItems = this.items.some((item) => item.open);
  }

  private async withStateSync(task: () => Promise<void>): Promise<void> {
    this.isSyncingState = true;

    try {
      await task();
    } finally {
      this.isSyncingState = false;
    }
  }

  render() {
    const dir = this.el.getAttribute('dir') ?? undefined;

    return (
      <div
        role="group"
        dir={dir}
        data-accordion-root
        data-open={this.hasOpenItems ? '' : undefined}
        data-orientation={this.normalizedOrientation}
        data-size-variant={this.normalizedSizeVariant}
        data-disabled={this.disabled ? '' : undefined}
        aria-disabled={this.disabled ? 'true' : undefined}
      >
        <slot />
      </div>
    );
  }
}
