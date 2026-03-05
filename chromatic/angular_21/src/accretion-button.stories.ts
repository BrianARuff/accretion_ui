import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccretionAngularModule } from '@accretion_ui/angular_21';

type ButtonArgs = {
  variant: 'primary' | 'secondary' | 'tertiary';
  disabled: boolean;
  label: string;
};

const meta: Meta<ButtonArgs> = {
  title: 'Accretion/AccretionButton',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AccretionAngularModule]
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
      options: ['primary', 'secondary', 'tertiary']
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

export const Summary: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docsOnly: true,
    docs: {
      source: { code: '' },
      canvas: { sourceState: 'none' }
    },
    previewTabs: {
      'storybook/controls/panel': { hidden: true },
      'storybook/actions/panel': { hidden: true },
      'storybook/interactions/panel': { hidden: true }
    }
  },
  render: () => ({
    template: ''
  })
};

export const InteractivePrimary: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    previewTabs: {
      'storybook/controls/panel': { hidden: true },
      'storybook/actions/panel': { hidden: true },
      'storybook/interactions/panel': { hidden: true }
    }
  },
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
          <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
          <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>
        </div>
      `
    };
  }
};

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `<accretion-button [attr.variant]="variant" [attr.disabled]="disabled ? '' : null">{{ label }}</accretion-button>`
  })
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary Button'
  },
  render: Primary.render
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    label: 'Tertiary Button'
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
