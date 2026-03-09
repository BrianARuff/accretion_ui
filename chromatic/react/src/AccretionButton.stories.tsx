import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccretionButton } from '@accretion_ui/react';

type ButtonArgs = {
  variant: 'primary' | 'secondary' | 'tertiary';
  disabled: boolean;
  children: string;
};

type SummaryRow = readonly [prop: string, description: string];

const SUMMARY_TABLE_STYLE: CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%'
};

const SUMMARY_CELL_STYLE: CSSProperties = {
  border: '1px solid #d3dfed',
  padding: '0.625rem',
  textAlign: 'left',
  verticalAlign: 'top'
};

const BUTTON_PROP_ROWS: SummaryRow[] = [
  ['variant', 'Chooses the visual treatment for the button surface.'],
  ['disabled', 'Prevents pointer and keyboard activation when the action is unavailable.'],
  ['children', 'Supplies the visible button label through the default slot.']
];

const BUTTON_GUIDELINES = [
  'Use the primary variant for the main action in a view and reserve the other variants for lower emphasis.',
  'Keep labels short and action-oriented so the button remains scannable.',
  'Set disabled only when the action cannot run yet; prefer helper text nearby when users need to know why.'
];

const ButtonSummaryPage = () => (
  <div style={{ display: 'grid', gap: '1rem', maxWidth: '64rem', padding: '1rem' }}>
    <div
      style={{
        background: '#f4f8fc',
        border: '1px solid #c9d8ea',
        borderRadius: '0.75rem',
        color: '#1f2d40',
        display: 'grid',
        gap: '0.5rem',
        padding: '0.75rem 0.875rem'
      }}
    >
      <p style={{ margin: 0 }}>
        <strong>Button summary</strong>
      </p>
      <p style={{ margin: 0 }}>
        Use the button for discrete actions. Choose the variant based on emphasis, then pass the label through the
        default slot.
      </p>
    </div>

    <div
      style={{
        background: '#f4f8fc',
        border: '1px solid #c9d8ea',
        borderRadius: '0.75rem',
        color: '#1f2d40',
        display: 'grid',
        gap: '0.5rem',
        padding: '0.75rem 0.875rem'
      }}
    >
      <p style={{ margin: 0 }}>
        <strong>Props</strong>
      </p>
      <table style={SUMMARY_TABLE_STYLE}>
        <thead>
          <tr>
            <th style={SUMMARY_CELL_STYLE}>Prop</th>
            <th style={SUMMARY_CELL_STYLE}>Description</th>
          </tr>
        </thead>
        <tbody>
          {BUTTON_PROP_ROWS.map(([prop, description]) => (
            <tr key={prop}>
              <td style={SUMMARY_CELL_STYLE}>
                <code>{prop}</code>
              </td>
              <td style={SUMMARY_CELL_STYLE}>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div
      style={{
        background: '#f4f8fc',
        border: '1px solid #c9d8ea',
        borderRadius: '0.75rem',
        color: '#1f2d40',
        display: 'grid',
        gap: '0.5rem',
        padding: '0.75rem 0.875rem'
      }}
    >
      <p style={{ margin: 0 }}>
        <strong>Usage guidelines</strong>
      </p>
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        {BUTTON_GUIDELINES.map((guideline) => (
          <li key={guideline}>{guideline}</li>
        ))}
      </ul>
    </div>
  </div>
);

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
  render: () => <ButtonSummaryPage />
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
