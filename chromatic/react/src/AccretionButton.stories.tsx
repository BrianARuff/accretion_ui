import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccretionButton } from '@accretion_ui/react';

type ButtonArgs = {
  variant: 'primary' | 'secondary' | 'tertiary';
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
      options: ['primary', 'secondary', 'tertiary']
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
  render: () => null
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
    const [count, setCount] = useState(0);

    return (
      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '22rem' }}>
        <p>
          <strong>Framework:</strong> react (React 18+ / 19+)
        </p>
        <p>
          <strong>Count:</strong> {count}
        </p>
        <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>
          Increment Count
        </AccretionButton>
        <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>
          Decrement Count
        </AccretionButton>
        <AccretionButton variant="tertiary" onClick={() => setCount(0)}>
          Reset Count
        </AccretionButton>
      </div>
    );
  }
};

export const Primary: Story = {
  args: {
    variant: "primary"
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: 'Secondary Button'
  }
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: 'Tertiary Button'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
};
