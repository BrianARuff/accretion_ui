import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'accretion-button',
  styleUrl: 'accretion-button.css',
  shadow: true
})
export class AccretionButton {
  @Prop() variant: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Prop() disabled = false;

  render() {
    return (
      <button class={`button button--${this.variant}`} disabled={this.disabled} type="button">
        <slot />
      </button>
    );
  }
}
