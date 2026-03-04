import { Component, Element, h, Host, Method, Prop, State } from '@stencil/core';
import type { AccordionItemSnapshot } from '../accretion-accordion/shared';

@Component({
  tag: 'accretion-accordion-header',
  styleUrl: 'accretion-accordion-header.css',
  shadow: false
})
export class AccretionAccordionHeader {
  @Element() private el!: HTMLElement;

  /**
   * Heading level announced to assistive technology.
   */
  @Prop({ reflect: true }) level = 3;

  @State() private open = false;
  @State() private disabled = false;
  @State() private index = -1;
  @State() private orientation: AccordionItemSnapshot['orientation'] = 'vertical';

  componentWillLoad(): void {
    this.syncFromParentItem();
  }

  @Method()
  async syncFromItem(snapshot: AccordionItemSnapshot): Promise<void> {
    this.open = snapshot.open;
    this.disabled = snapshot.disabled;
    this.index = snapshot.index;
    this.orientation = snapshot.orientation;
  }

  private get ariaLevel(): string {
    const parsedLevel = Number(this.level);

    if (Number.isNaN(parsedLevel)) {
      return '3';
    }

    const clampedLevel = Math.max(1, Math.min(6, Math.trunc(parsedLevel)));

    return String(clampedLevel);
  }

  private syncFromParentItem(): void {
    const item = this.el.closest('accretion-accordion-item');

    if (!item) {
      return;
    }

    const index = Number.parseInt(item.getAttribute('data-index') ?? '-1', 10);
    const orientation = item.getAttribute('data-orientation');

    this.open = item.hasAttribute('open');
    this.disabled = item.hasAttribute('data-disabled') || item.hasAttribute('disabled');
    this.index = Number.isNaN(index) ? -1 : index;
    this.orientation = orientation === 'horizontal' ? 'horizontal' : 'vertical';
  }

  render() {
    return (
      <Host
        role="heading"
        aria-level={this.ariaLevel}
        data-open={this.open ? '' : undefined}
        data-disabled={this.disabled ? '' : undefined}
        data-index={this.index >= 0 ? String(this.index) : undefined}
        data-orientation={this.orientation}
      >
        <slot />
      </Host>
    );
  }
}
