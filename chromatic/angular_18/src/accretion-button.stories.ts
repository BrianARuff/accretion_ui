import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccretionButton } from '@accretion_ui/angular_18';

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

export const InteractivePrimary: Story = {
  render: () => {
    const state = { count: 0 };

    return {
      props: {
        state,
        increment: () => {
          state.count += 1;
        },
        decrement: () => {
          state.count -= 1;
        },
        reset: () => {
          state.count = 0;
        }
      },
      template: `
        <div style="display:grid;gap:12px;max-width:352px;">
          <p><strong>Framework:</strong> angular_18 (Angular 18-20)</p>
          <p><strong>Count:</strong> {{ state.count }}</p>
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
