import { Component, Element, h, Method, Prop, State, Watch } from '@stencil/core';
import type { AccordionItemSnapshot } from '../accretion-accordion/shared';

@Component({
  tag: 'accretion-accordion-panel',
  styleUrl: 'accretion-accordion-panel.css',
  shadow: false
})
export class AccretionAccordionPanel {
  @Element() private el!: HTMLElement;

  /**
   * Keeps panel content mounted while closed.
   */
  @Prop({ reflect: true, attribute: 'keep-mounted' }) keepMounted = false;

  /**
   * Uses `hidden="until-found"` when content is collapsed and not mounted.
   */
  @Prop({ reflect: true, attribute: 'hidden-until-found' }) hiddenUntilFound = false;

  @State() private open = false;
  @State() private disabled = false;
  @State() private index = -1;
  @State() private orientation: AccordionItemSnapshot['orientation'] = 'vertical';
  @State() private panelId = '';
  @State() private triggerId = '';
  @State() private transitionState: 'idle' | 'starting' | 'ending' = 'idle';

  private transitionFrameId?: number;
  private transitionTimeoutId?: number;
  private resizeObserver?: ResizeObserver;

  @Watch('keepMounted')
  @Watch('hiddenUntilFound')
  protected handleVisibilityOptionChange(): void {
    this.applyHostVisibility();
  }

  componentWillLoad(): void {
    this.syncFromParentItem();
  }

  componentDidLoad(): void {
    this.updatePanelSize();
    this.applyHostVisibility();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updatePanelSize();
    });

    this.resizeObserver.observe(this.el);
  }

  componentDidRender(): void {
    this.updatePanelSize();
    this.applyHostVisibility();
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.clearTransitionTimers();
  }

  @Method()
  async syncFromItem(snapshot: AccordionItemSnapshot): Promise<void> {
    const wasOpen = this.open;

    this.open = snapshot.open;
    this.disabled = snapshot.disabled;
    this.index = snapshot.index;
    this.orientation = snapshot.orientation;
    this.panelId = snapshot.panelId;
    this.triggerId = snapshot.triggerId;

    if (wasOpen !== snapshot.open) {
      this.startTransition();
    }

    this.updatePanelSize();
    this.applyHostVisibility();
  }

  private startTransition(): void {
    this.clearTransitionTimers();
    this.transitionState = 'starting';

    const raf =
      typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (callback: FrameRequestCallback): number =>
            window.setTimeout(() => callback(Date.now()), 16);

    this.transitionFrameId = raf(() => {
      this.transitionState = 'ending';

      this.transitionTimeoutId = window.setTimeout(() => {
        this.transitionState = 'idle';
      }, 240);
    });
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
    this.triggerId = source.getAttribute('data-trigger-id') ?? this.triggerId;
    this.panelId = source.getAttribute('data-panel-id') ?? this.panelId;
  }

  private clearTransitionTimers(): void {
    if (typeof cancelAnimationFrame === 'function' && this.transitionFrameId !== undefined) {
      cancelAnimationFrame(this.transitionFrameId);
    }

    if (this.transitionTimeoutId !== undefined) {
      window.clearTimeout(this.transitionTimeoutId);
    }

    this.transitionFrameId = undefined;
    this.transitionTimeoutId = undefined;
  }

  private updatePanelSize(): void {
    const panelContainer = this.getPanelContainerElement();

    if (!panelContainer) {
      return;
    }

    const panelHeight = panelContainer.scrollHeight;
    const panelWidth = panelContainer.scrollWidth;

    this.el.style.setProperty('--accordion-panel-height', `${panelHeight}px`);
    this.el.style.setProperty('--accordion-panel-width', `${panelWidth}px`);
  }

  private getPanelContainerElement(): HTMLElement | null {
    return this.el.querySelector('[data-accordion-panel]') as HTMLElement | null;
  }

  private applyVisibilityAttributes(target: HTMLElement | null, shouldHide: boolean): void {
    if (!target) {
      return;
    }

    if (shouldHide) {
      if (this.hiddenUntilFound) {
        target.setAttribute('hidden', 'until-found');
      } else {
        target.setAttribute('hidden', '');
      }
    } else {
      target.removeAttribute('hidden');
    }
  }

  private applyHostVisibility(): void {
    const shouldHide = !this.open && !this.keepMounted;
    const panelContainer = this.getPanelContainerElement();

    this.applyVisibilityAttributes(this.el, shouldHide);
    this.applyVisibilityAttributes(panelContainer, shouldHide);

    if (!this.open && this.keepMounted) {
      this.el.setAttribute('inert', '');
      panelContainer?.setAttribute('inert', '');
    } else {
      this.el.removeAttribute('inert');
      panelContainer?.removeAttribute('inert');
    }
  }

  render() {
    return (
      <div
        data-accordion-panel
        id={this.panelId || undefined}
        role="region"
        aria-labelledby={this.triggerId || undefined}
        aria-hidden={this.open ? 'false' : 'true'}
        data-open={this.open ? '' : undefined}
        data-disabled={this.disabled ? '' : undefined}
        data-index={this.index >= 0 ? String(this.index) : undefined}
        data-orientation={this.orientation}
        data-starting-style={this.transitionState === 'starting' ? '' : undefined}
        data-ending-style={this.transitionState === 'ending' ? '' : undefined}
      >
        <slot />
      </div>
    );
  }
}
