import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccretionButton } from '@accretion_ui/react';

type ButtonArgs = {
  variant: 'primary' | 'secondary';
  disabled: boolean;
  children: string;
};

const meta = {
  title: 'Accretion/AccretionButton',
  component: AccretionButton,
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    disabled: false,
    children: 'Click Me'
  },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary']
    },
    disabled: {
      control: { type: 'boolean' }
    },
    children: {
      control: { type: 'text' }
    }
  },
  render: ({ children, ...args }: ButtonArgs) => <AccretionButton {...args}>{children}</AccretionButton>
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
};
