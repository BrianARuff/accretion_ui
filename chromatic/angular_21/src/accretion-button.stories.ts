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
