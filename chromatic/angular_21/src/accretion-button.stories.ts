import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccretionButton } from '@accretion_ui/angular_21';

type ButtonArgs = {
  variant: 'primary' | 'secondary';
  disabled: boolean;
  label: string;
};

const meta: Meta<ButtonArgs> = {
  title: 'Accretion/AccretionButton',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AccretionButton]
    })
  ],
  args: {
    variant: 'primary',
    disabled: false,
    label: 'Click Me'
  },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary']
    },
    disabled: {
      control: { type: 'boolean' }
    },
    label: {
      control: { type: 'text' }
    }
  }
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const InteractivePrimary: Story = {
  render: () => {
    const count = signal(0);

    return {
      props: {
        count,
        increment: () => {
          count.update((value) => value + 1);
        },
        decrement: () => {
          count.update((value) => value - 1);
        },
        reset: () => {
          count.set(0);
        }
      },
      template: `
        <div style="display:grid;gap:12px;max-width:352px;">
          <p><strong>Framework:</strong> angular_21 (Angular 21 + signals)</p>
          <p><strong>Count:</strong> {{ count() }}</p>
          <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
          <accretion-button variant="primary" (click)="decrement()">Decrement Count</accretion-button>
          <accretion-button variant="primary" (click)="reset()">Reset Count</accretion-button>
        </div>
      `
    };
  }
};

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: '<accretion-button [variant]="variant" [disabled]="disabled">{{ label }}</accretion-button>'
  })
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary Button'
  },
  render: Primary.render
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Button'
  },
  render: Primary.render
};
