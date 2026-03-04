import { Component, Element, h, Method, Prop, State } from '@stencil/core';
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

  private get headingLevel(): 1 | 2 | 3 | 4 | 5 | 6 {
    const parsedLevel = Number(this.level);

    if (Number.isNaN(parsedLevel)) {
      return 3;
    }

    const clampedLevel = Math.max(1, Math.min(6, Math.trunc(parsedLevel))) as 1 | 2 | 3 | 4 | 5 | 6;

    return clampedLevel;
  }

  private get headingTag(): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
    const level = this.headingLevel;

    if (level === 1) {
      return 'h1';
    }

    if (level === 2) {
      return 'h2';
    }

    if (level === 3) {
      return 'h3';
    }

    if (level === 4) {
      return 'h4';
    }

    if (level === 5) {
      return 'h5';
    }

    return 'h6';
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
    this.disabled = source.hasAttribute('data-disabled') || item.hasAttribute('disabled');
    this.index = Number.isNaN(index) ? -1 : index;
    this.orientation = orientation === 'horizontal' ? 'horizontal' : 'vertical';
  }

  render() {
    const HeadingTag = this.headingTag;

    return (
      <HeadingTag
        data-accordion-header
        data-open={this.open ? '' : undefined}
        data-disabled={this.disabled ? '' : undefined}
        data-index={this.index >= 0 ? String(this.index) : undefined}
        data-orientation={this.orientation}
      >
        <slot />
      </HeadingTag>
    );
  }
}
